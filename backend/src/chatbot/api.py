import os
import uuid
import threading
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from contextlib import asynccontextmanager

# Import necessary components from the chatbot_rag script
from chatbot_rag import (
    client,  # MongoDB client
    hospital_collection,
    medicines_collection,
    appointments_collection, # Added for status check
    create_hospital_embeddings,
    create_pharmacy_embeddings,
    create_hospital_rag_system,  # Changed
    create_pharmacy_rag_system,  # Changed
    check_vector_indexes,      # Changed
    check_appointment_status,  # Added
    PatientBookingSystem       # Added
)
from dotenv import load_dotenv

load_dotenv()

# --- Global Variables ---
global_hospital_qa_chain = None
global_pharmacy_qa_chain = None
# This session store will hold the stateful booking system for each user
global_session_store: Dict[str, Dict[str, Any]] = {}

# --- Initialization Logic ---
def initialize_system():
    """
    Complete system initialization: DB, embeddings, and RAG chains.
    This runs once on startup.
    """
    global global_hospital_qa_chain, global_pharmacy_qa_chain
    print("Starting API and initializing RAG system...")

    # 1. Test MongoDB connection
    try:
        client.admin.command('ping')
        print("MongoDB Atlas connection OK")
    except Exception as e:
        print(f"MongoDB connection failed: {e}")
        return

    # 2. Verify database setup and check/create embeddings
    check_vector_indexes() # Changed from verify_database_setup
    
    hospital_docs = hospital_collection.count_documents({})
    pharmacy_docs = medicines_collection.count_documents({})
    hospital_with_embeddings = hospital_collection.count_documents({"embeddings": {"$exists": True, "$ne": []}})
    pharmacy_with_embeddings = medicines_collection.count_documents({"embeddings": {"$exists": True, "$ne": []}})


    if hospital_with_embeddings < hospital_docs:
        print(f"Hospital embeddings incomplete ({hospital_with_embeddings}/{hospital_docs}). Creating...")
        create_hospital_embeddings()
    if pharmacy_with_embeddings < pharmacy_docs:
        print(f"Pharmacy embeddings incomplete ({pharmacy_with_embeddings}/{pharmacy_docs}). Creating...")
        create_pharmacy_embeddings()

    # 3. Create RAG systems
    print("Creating RAG systems...")
    global_hospital_qa_chain, _ = create_hospital_rag_system()
    global_pharmacy_qa_chain, _ = create_pharmacy_rag_system()

    if not global_hospital_qa_chain or not global_pharmacy_qa_chain:
        print("Failed to create RAG systems. API might not function correctly.")
        return
    else:
        print("RAG systems created successfully.")
    
    print("System initialization complete. API is ready.")

# --- FastAPI Startup Event ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Running startup initialization...")
    init_thread = threading.Thread(target=initialize_system)
    init_thread.start()
    init_thread.join() # Wait for it to finish before accepting requests
    print("Startup complete.")
    yield
    # Clean up resources if needed on shutdown
    print("Shutting down...")

app = FastAPI(lifespan=lifespan)

# --- API Request/Response Models ---
class ChatRequest(BaseModel):
    query: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    context: str # e.g., "booking", "status", "hospital", "pharmacy", "mixed"
    error: Optional[str] = None

# --- API Endpoints ---
@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main endpoint for all conversational interactions.
    Handles hospital, pharmacy, and booking queries.
    """
    if not global_hospital_qa_chain or not global_pharmacy_qa_chain:
        raise HTTPException(
            status_code=503, 
            detail="System is still initializing. Please try again in a moment."
        )

    try:
        # 1. Manage Session and get user-specific booking system
        session_id = request.session_id or str(uuid.uuid4())
        
        if session_id not in global_session_store:
            global_session_store[session_id] = {
                "booking_system": PatientBookingSystem()
            }
        
        booking_system = global_session_store[session_id]["booking_system"]
        user_query = request.query
        
        # We don't have voice, so language is assumed to be text (None for booking)
        detected_lang = None 

        # 2. ENHANCED BOOKING HANDLING (Logic from your main_system)
        # Check if query is part of an active flow OR starts a new one
        booking_response = None
        if booking_system.current_booking_step > 0 or any(keyword in user_query.lower() for keyword in ['book', 'appointment', 'schedule']):
            booking_response = booking_system.collect_booking_details(user_query, detected_lang)

        if booking_response:
            # If booking is finished or cancelled, reset the session's booking system
            if "APPOINTMENT CONFIRMED" in booking_response or "Appointment cancelled" in booking_response:
                global_session_store[session_id]["booking_system"] = PatientBookingSystem()

            return ChatResponse(
                response=booking_response,
                session_id=session_id,
                context="booking"
            )

        # 3. APPOINTMENT STATUS CHECK (Logic from your main_system)
        if any(keyword in user_query.lower() for keyword in ['check', 'status', 'my appointment']):
            status_response = check_appointment_status(user_query)
            return ChatResponse(
                response=status_response,
                session_id=session_id,
                context="status"
            )
        
        # 4. CLASSIFY & QUERY RAG (Logic from your main_system)
        
        # WARNING:
        # Your `create_hospital_rag_system` in chatbot_rag.py uses a
        # global `ConversationBufferWindowMemory`. This means all API
        # users will SHARE THE SAME CHAT HISTORY.
        # For a real API, you must modify `create_hospital_rag_system`
        # to accept a `session_id` and manage memory per-session.
        # The code below will work, but has this major flaw.

        pharmacy_keywords = ['medicine', 'drug', 'pharmacy', 'tablet', 'capsule', 'syrup', 'injection', 'prescription']
        hospital_keywords = ['doctor', 'physician', 'specialist', 'appointment', 'cardiologist', 'neurologist', 'surgeon']

        is_pharmacy_query = any(k in user_query.lower() for k in pharmacy_keywords)
        is_hospital_query = any(k in user_query.lower() for k in hospital_keywords)

        if is_pharmacy_query and not is_hospital_query:
            result = global_pharmacy_qa_chain.invoke({"question": user_query})
            answer = result['answer']
            return ChatResponse(response=answer, session_id=session_id, context="pharmacy")
        
        elif is_hospital_query and not is_hospital_query:
            result = global_hospital_qa_chain.invoke({"question": user_query})
            answer = result['answer']
            return ChatResponse(response=answer, session_id=session_id, context="hospital")
        
        else:
            # Default fallback: query both systems
            h_res = global_hospital_qa_chain.invoke({"question": user_query})
            p_res = global_pharmacy_qa_chain.invoke({"question": user_query})
            
            # Smartly combine, or just join
            if "I don't know" in h_res['answer'] and "I don't know" not in p_res['answer']:
                answer = p_res['answer']
            elif "I don't know" not in h_res['answer'] and "I don't know" in p_res['answer']:
                answer = h_res['answer']
            else:
                 answer = f"Regarding the hospital: {h_res['answer']}\n\nRegarding the pharmacy: {p_res['answer']}"

            return ChatResponse(
                response=answer,
                session_id=session_id,
                context="mixed"
            )

    except Exception as e:
        print(f"Unhandled API error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"An internal server error occurred: {e}")

if __name__ == "__main__":
    import uvicorn
    # Set reload=False for production to avoid re-running startup
    uvicorn.run("api:app", host="127.0.0.1", port=5002, reload=False)