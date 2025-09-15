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
  slots: {
    type: Number, // [9 , 10 , 11 , 12 ,13 ] 9 am slot book aithe remove 9
    required: true,
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
