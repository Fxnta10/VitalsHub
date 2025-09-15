import React, { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Phone, Lock, Calendar } from "lucide-react";

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    dateOfBirth: "", // ✅ added
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    const { fullName, email, password, phoneNumber, dateOfBirth } = formData;

    if (!fullName || !email || !password || !phoneNumber || !dateOfBirth) {
      return toast.error("All fields are required");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }
    if (phoneNumber.length !== 10) {
      return toast.error("Phone number must be 10 digits long");
    }
    if (!/\S+@\S+\.\S+/.test(email)) return toast.error("Invalid email format");

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success) {
      const nav = await signup(formData);
      if (nav) navigate("/");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4 text-center">Sign Up</h2>
      <form className="border p-4 rounded shadow-sm bg-light" onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="mb-3 position-relative">
          <label htmlFor="fullName" className="form-label">Full Name</label>
          <User className="position-absolute" style={{ top: "38px", left: "10px", color: "#6c757d" }} size={20} />
          <input
            type="text"
            id="fullName"
            className="form-control ps-5"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Enter your full name"
          />
        </div>

        {/* Email */}
        <div className="mb-3 position-relative">
          <label htmlFor="email" className="form-label">Email</label>
          <Mail className="position-absolute" style={{ top: "38px", left: "10px", color: "#6c757d" }} size={20} />
          <input
            type="email"
            id="email"
            className="form-control ps-5"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter your email"
          />
        </div>

        {/* Password */}
        <div className="mb-3 position-relative">
          <label htmlFor="password" className="form-label">Password</label>
          <Lock className="position-absolute" style={{ top: "38px", left: "10px", color: "#6c757d" }} size={20} />
          <input
            type="password"
            id="password"
            className="form-control ps-5"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Enter your password"
          />
        </div>

        {/* Phone Number */}
        <div className="mb-3 position-relative">
          <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
          <Phone className="position-absolute" style={{ top: "38px", left: "10px", color: "#6c757d" }} size={20} />
          <input
            type="text"
            id="phoneNumber"
            className="form-control ps-5"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            placeholder="Enter your 10-digit phone number"
          />
        </div>

        {/* Date of Birth */}
        <div className="mb-4 position-relative">
          <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
          <Calendar className="position-absolute" style={{ top: "38px", left: "10px", color: "#6c757d" }} size={20} />
          <input
            type="date"
            id="dateOfBirth"
            className="form-control ps-5"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={isSigningUp}>
          {isSigningUp ? "Signing Up..." : "Sign Up"}
        </button>

        <div className="mt-3 text-center">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </form>
    </div>
  );
}
