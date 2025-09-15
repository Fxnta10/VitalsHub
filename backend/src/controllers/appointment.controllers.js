// import Appointment from "../models/appointment.model.js";
// import User from "../models/user.model.js";
// import Hospital from "../models/hospital.model.js";
// import Doctor from "../models/doctor.model.js";

// export const addAppointment=(async(req,res)=>{
//     const {hospitalId , patientId ,doctorId, date , time , reason} = req.body

//    try{ const hospital=await Hospital.findById(hospitalId);
//     if(!hospital){
//         res.status(404).json({message:"Hospital not found"});
//     }
//     const patient = await User.findById(patientId);
//     if(!patient){
//         res.status(404).json({message:"Patient not found"});
//     }
//     const doctor = await Doctor.findById(doctorId);
//     if(!doctor){
//         res.status(404).json({message:"Doctor not found"});
//     }

//     if(doctor.hospitalId !== hospitalId){
//         res.status(400).json({message:"Doctor is not from this Hospital"});
//     }
//     const newAppointment = new Appointment({
//         hospitalId,
//         patientId,
//         doctorId,
//         date,
//         time,
//         reason
//     })

//     await newAppointment.save();}
//     catch(error){
//         console.log("Error in creating an appointment",error.message);
//         res.status(500).json({message:"Server error"});
//     }   
    
// })


// export const getAppointment=(async(req,res)=>{
//     try{
//         const appointments = await Appointment.find();
//         res.status(200).json(appointments);
//     }
//     catch(error){
//         console.log("Error in getting appointments",error.message);
//         res.status(500).json({message:"Server error"});
//     }
// })

// export const getHospitals = (async(req,res)=>{
//     try {const hospitals = await Hospital.find();
//     res.status(200).json(hospitals);
// } 
//     catch (error) {
        
//     }
// })

// export const getDoctors = (async(req,res)=>{
//     const hospitalId = req.params.hospitalId
//     try {
//         if(!hospitalId){
//             res.status(404).json({message:"Hospital not found"});
//         }
        
//         const availableDoctors = await Doctor.find({hospitalId:hospitalId});
//         if(!availableDoctors || availableDoctors.length === 0){
//             res.status(404).json({message:"No doctors available"});
//         }
//         res.status(200).json(availableDoctors);
// } 
//     catch (error) {
//         console.log("Error in getting doctors",error.message);
//         res.status(500).json({message:"Server error"});
        
//     }
// })