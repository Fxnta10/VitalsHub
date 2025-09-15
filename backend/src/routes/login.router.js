import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";

const router = express.Router();

const saltRounds = 10;

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || "blahblahblahblah";

import Hospital from "../models/hospitalSchema.js";
import { authenticateToken } from "../middleware/adminAuth.js";


// Generate JWT token
const generateToken = (hospitalId, hospitalObjectId) => {
  return jwt.sign(
    {
      hospitalId: hospitalId,
      id: hospitalObjectId,
      type: "hospital",
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
};

router.post("/login", async (req, res) => {
  const { hospitalId, password } = req.body;

  if (!hospitalId.trim() || !password.trim()) {
    return res.status(500).json({
      success: false,
      message: "ID and password cannot be empty ",
    });
  }

  try {
    const hospital = await Hospital.findOne({ hospitalId: hospitalId });

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }

    const passwordMatch = await bcrypt.compare(password, hospital.password);
    if (passwordMatch) {
      const token = generateToken(hospital.hospitalId, hospital._id);
      return res.status(200).json({
        success: true,
        token: token,
        hospital: {
          id: hospital._id,
          hospitalId: hospital.hospitalId,
          email: hospital.email,
          address: hospital.address,
        },
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

router.post("/register", async (req, res) => {
  const { hospitalId, email, password, address } = req.body;

  if (!hospitalId || !email || !password || !address) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    // Check if hospital already exists
    const existingHospital = await Hospital.findOne({
      $or: [{ hospitalId: hospitalId }, { email: email }],
    });

    if (existingHospital) {
      return res.status(409).json({
        success: false,
        message: "Hospital ID or email already exists",
      });
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, salt);

    const newHospital = new Hospital({
      hospitalId: hospitalId,
      email: email,
      password: hashPassword,
      address: address,
    });

    await newHospital.save();

    return res.status(201).json({
      success: true,
      message: `New Hospital Registered with ID: ${hospitalId}`,
      data: {
        id: newHospital._id,
        hospitalId: newHospital.hospitalId,
        email: newHospital.email,
        address: newHospital.address,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during registration",
    });
  }
});

// Route to verify token and get current hospital info
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.hospital.id).select(
      "-password"
    );

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }

    res.status(200).json({
      success: true,
      hospital: {
        id: hospital._id,
        hospitalId: hospital.hospitalId,
        email: hospital.email,
        address: hospital.address,
      },
    });
  } catch (err) {
    console.error("Get current hospital error:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

export default router;
