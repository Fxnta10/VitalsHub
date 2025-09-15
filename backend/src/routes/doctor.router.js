import express from "express";
import axios from "axios";
import mongoose from "mongoose";

import Appointment from "../models/appointmentSchema.js";
import Doctor from "../models/doctorSchema.js";
import { authenticateToken } from "../middleware/adminAuth.js";
import {
  deleteDoctor,
  getAllDoctors,
  getDoctorDetails,
  newDoctor,
  updateDoctor,
} from "../controllers/admin.doctor.controllers.js";

const router = express.Router();

router.get("/all", authenticateToken, getAllDoctors);

router.post("/new", authenticateToken, newDoctor);

router.get("/:id", authenticateToken, getDoctorDetails);

router.put("/update/:id", authenticateToken, updateDoctor);

router.delete("/delete/:id", authenticateToken, deleteDoctor);

export default router
