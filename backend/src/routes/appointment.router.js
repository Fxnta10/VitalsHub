import express from "express";
import axios from "axios";
import mongoose from "mongoose";

const router = express.Router();

import Appointment from "../models/appointmentSchema.js";
import Doctor from "../models/doctorSchema.js";
import { authenticateToken } from "../middleware/adminAuth.js";


//Gets all Appointments in a hospital
router.get("/", authenticateToken, async (req, res) => {
  // Get hospitalId from authenticated token
  const hospitalId = req.hospital.hospitalId; // Using the custom hospitalId from token
  try {
    const appointments = await Appointment.find({ hospitalId: hospitalId });
    if (appointments.length == 0) {
      res.status(500).json({
        success: false,
        message: "No Appointments",
      });
    }

    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
    });
  }
});

//to create new apppointment
router.post("/", authenticateToken, async (req, res) => {
  // Get hospitalId from authenticated token
  const hospitalId = req.hospital.hospitalId;

  const { patientId, isEmergency, description } = req.body;
  try {
    const newAppointment = new Appointment({
      hospitalId: hospitalId,
      doctorId: null,
      patientId: patientId,
      appointmentTime: null,
      isEmergency: isEmergency,
      status: "pending",
      description: description,
    });

    await newAppointment.save();

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: newAppointment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error creating new appointments",
    });
  }
});

//get a specific appointment
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Cannot fetch appointment",
    });
  }
});

router.put("/:id/assign", async (req, res) => {
  const { id } = req.params;
  const { doctorId, time } = req.body;
  if (!id || !doctorId) {
    return res.status(500).json({
      success: false,
      message: "Please give correct ID and assign again",
    });
  }

  try {
    const doctor = await Doctor.findById(doctorId);
    const appointment = await Appointment.findById(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    appointment.doctorId = doctor._id;
    appointment.appointmentTime = time;
    appointment.status = "appointed";
    await appointment.save();

    doctor.appointments.push(appointment._id);
    await doctor.save();
    return res.status(200).json({
      success: true,
      message: `Successfully assigned appointment ${id} to doctor ${doctorId}`,
      data: appointment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong in assigning",
    });
  }
});

router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id || !status) {
    return res
      .status(500)
      .json({ success: false, message: "Give correct id and status update" });
  }

  try {
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    appointment.status = status;
    await appointment.save();
    return res.status(200).json({
      success: true,
      message: `Status of appointment ${id} updated to ${status}`,
      data: appointment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong in updating status ",
    });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    if (deletedAppointment) {
      console.log("Appointment removed successfully:", deletedAppointment);
      return res.status(200).json({
        success: true,
        message: `Deleted appointment with id ${id}`,
        data: deletedAppointment,
      });
    } else {
      console.log("Appointment not found with ID:", id);
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

export default router;