import express from "express";
import axios from "axios";
import mongoose from "mongoose";

import Appointment from "../models/appointmentSchema.js";
import Doctor from "../models/doctorSchema.js";

export const getAllDoctors = async (req, res) => {
  // Get hospitalId from authenticated token
  const hospitalId = req.hospital.hospitalId; // Using the ObjectId from token
  try {
    const doctors = await Doctor.find({ hospitalId: hospitalId });
    if (doctors.length == 0) {
      res.status(500).json({
        success: false,
        message: "No Doctors",
      });
    }

    res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong fetching doctors",
    });
  }
};

export const newDoctor = async (req, res) => {
  const { name, email, specialization, start, end } = req.body;

  // Get hospitalId from authenticated token
  const hospitalId = req.hospital.hospitalId;

  try {
    const newDoctor = new Doctor({
      hospitalId: hospitalId,
      name: name,
      email: email,
      specialisation: specialization,
      shift: {
        start: start,
        end: end,
      },
      isActive: true,
      appointments: [],
    });

    await newDoctor.save();

    res.status(201).json({
      success: true,
      message: `Created new doctor successfully in hospital ${req.hospital.hospitalId}`,
      data: newDoctor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to create new Doctor ",
    });
  }
};

export const getDoctorDetails = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(500).json({
      success: false,
      message: "Not valid ID",
    });
  }

  try {
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      res.status(500).json({
        success: false,
        message: "Doctor with that ID does not exist ",
      });
    }
    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong fetching doctor ",
    });
  }
};

export const updateDoctor = async (req, res) => {
  const { value, parameter } = req.body;
  const { id } = req.params; //id of doctor u want to update

  try {
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      res.status(500).json({
        success: false,
        message: "Doctor with that ID does not exist ",
      });
    }

    doctor[parameter] = value;
    await doctor.save();
    res.status(200).json({
      success: true,
      message: "updated doctor ",
      data: doctor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong updating doctor ",
    });
  }
};

export const deleteDoctor = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      success: false,
      message: "Not valid ID",
    });
    return;
  }

  try {
    const doctor = await Doctor.findByIdAndDelete(id);
    if (!doctor) {
      res.status(404).json({
        success: false,
        message: "Doctor with that ID does not exist",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
      data: doctor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong deleting doctor",
    });
  }
};
