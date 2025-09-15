import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  specialisation: {
    type: String,
    required: true,
  },
  shift: {
    start: {
      type: String, // e.g., "08:00"
      required: true,
    },
    end: {
      type: String, // e.g., "17:00"
      required: true,
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],
});

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
