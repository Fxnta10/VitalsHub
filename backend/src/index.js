import express from "express"
import cors from "cors"
const app = express();
const PORT =5002;
import authRoutes from "./routes/auth.routes.js"
import uploadRoutes from "./routes/pdf.routes.js"
// import appointmentRoutes from "./routes/appointment.routes.js"
import {connectDB} from "./lib/db.js"
import dotenv from "dotenv" 
import cookieParser from "cookie-parser"


import loginRoutes from "./routes/login.router.js"
import appointmentRouter from "./routes/appointment.router.js"
import doctorRouter from "./routes/doctor.router.js"


dotenv.config();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({limit: "10mb" , extended: true }));
app.use(cookieParser());
app.use(cors(
    {
    origin: ["http://localhost:5173", "http://localhost:5174"],  // Allow both frontend ports
    credentials: true,  
    }
));
app.use('/api/user',authRoutes)
app.use('/api/user',uploadRoutes)

app.use("/api/auth", loginRoutes);
app.use("/api/appointments", appointmentRouter); //CRUD of Appointments and state update
app.use("/api/admin/doctors", doctorRouter); 



app.get('/',(req,res)=>{
    res.send("Hellow World")
})

app.listen(PORT, () =>{ console.log(`Server running on port ${PORT}`)

connectDB();
});