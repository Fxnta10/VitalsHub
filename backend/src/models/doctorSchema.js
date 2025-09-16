import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  hospitalId: {
    type: String,
    required: true,
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
      type: Number, // 24 hour format
      required: true,
    },
    end: {
      type: Number, // 24 hour format
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
