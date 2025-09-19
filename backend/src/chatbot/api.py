from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from chatbot_rag import (
    create_hospital_rag_system, 
    create_pharmacy_rag_system,
    process_booking_command,
    AppointmentBooking
)
import threading

app = FastAPI()

# Global RAG chains
hospital_qa_chain = None
pharmacy_qa_chain = None

def init_rag_systems():
    global hospital_qa_chain, pharmacy_qa_chain
    hospital_qa_chain, _ = create_hospital_rag_system()
    pharmacy_qa_chain, _ = create_pharmacy_rag_system()

# Initialize on startup
threading.Thread(target=init_rag_systems).start()

class QueryRequest(BaseModel):
    query: str

class BookingRequest(BaseModel):
    query: str
    patient_name: Optional[str] = None
    patient_phone: Optional[str] = None
    patient_email: Optional[str] = None

@app.post("/api/chat")
async def chat(request: QueryRequest):
    if not hospital_qa_chain or not pharmacy_qa_chain:
        raise HTTPException(status_code=503, detail="RAG systems initializing")
    
    query = request.query
    pharmacy_keywords = ['medicine', 'drug', 'pharmacy', 'prescription']
    hospital_keywords = ['doctor', 'appointment', 'specialist'] 

    is_pharmacy = any(word in query.lower() for word in pharmacy_keywords)
    is_hospital = any(word in query.lower() for word in hospital_keywords)

    if is_pharmacy and not is_hospital:
        result = pharmacy_qa_chain({"question": query})
        return {"type": "pharmacy", "response": result["answer"]}
    elif is_hospital and not is_pharmacy:
        result = hospital_qa_chain({"question": query})
        return {"type": "hospital", "response": result["answer"]}
    else:
        hospital_result = hospital_qa_chain({"question": query})
        pharmacy_result = pharmacy_qa_chain({"question": query})
        return {
            "type": "mixed",
            "hospital": hospital_result["answer"],
            "pharmacy": pharmacy_result["answer"]
        }

@app.post("/api/booking")
async def handle_booking(request: BookingRequest):
    result = process_booking_command(
        request.query,
        patient_name=request.patient_name,
        patient_phone=request.patient_phone,
        patient_email=request.patient_email
    )
    return {"success": True, "response": result}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="127.0.0.1", port=5002, reload=True)
