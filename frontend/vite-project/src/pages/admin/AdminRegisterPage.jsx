import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../stores/adminAuthStore";

export default function AdminRegisterPage() {
  const [formData, setFormData] = useState({
    hospitalId: "",
    email: "",
    password: "",
    address: "",
  });

  const [error, setError] = useState("");
  const { signup, isSigningUp } = useAuthStore();
  const navigate = useNavigate();

  const validateForm = () => {
    const { hospitalId, email, password, address } = formData;
    if (!email || !password || !hospitalId || !address) {
      setError("All fields are required");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      const result = await signup(formData);

      if (result?.success) {
        console.log("Registration successful");
        toast.success("Registration successful! Please login.");
        navigate("/admin/login");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("An unexpected error occurred");
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  return (
    <div style={{ background: "#f6f8fb", minHeight: "100vh" }} className="d-flex align-items-center justify-content-center py-5">
      <div className="container" style={{ maxWidth: "450px" }}>
        <div className="bg-white rounded-3 shadow-sm p-4" style={{ border: "1px solid #e2e8f0" }}>
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-2" style={{ color: "#2d3748" }}>
              Admin Registration
            </h2>
            <p className="text-secondary" style={{ fontSize: "0.95rem" }}>
              Register your hospital admin account
            </p>
          </div>

          {error && (
            <div className="alert alert-danger mb-4" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label htmlFor="hospitalId" className="fw-bold mb-2" style={{ color: "#2d3748" }}>
                Hospital ID
              </label>
              <input
                id="hospitalId"
                name="hospitalId"
                type="text"
                value={formData.hospitalId}
                onChange={handleInputChange("hospitalId")}
                placeholder="Enter hospital ID"
                className="form-control"
                style={{ padding: "12px", borderRadius: "8px" }}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="fw-bold mb-2" style={{ color: "#2d3748" }}>
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                placeholder="Enter email address"
                className="form-control"
                style={{ padding: "12px", borderRadius: "8px" }}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="fw-bold mb-2" style={{ color: "#2d3748" }}>
                Hospital Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange("address")}
                placeholder="Enter hospital address"
                rows="3"
                className="form-control"
                style={{ padding: "12px", borderRadius: "8px" }}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="fw-bold mb-2" style={{ color: "#2d3748" }}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange("password")}
                placeholder="Min. 6 characters"
                className="form-control"
                style={{ padding: "12px", borderRadius: "8px" }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSigningUp}
              className="btn btn-outline-primary w-100 mb-3"
              style={{ 
                padding: "12px", 
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "500",
                transition: "all 0.2s ease"
              }}
            >
              {isSigningUp ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </button>

            <div className="text-center">
              <p className="text-secondary mb-0" style={{ fontSize: "0.95rem" }}>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/admin/login")}
                  className="btn btn-link p-0 align-baseline"
                  style={{ color: "#4f46e5", textDecoration: "none" }}
                >
                  Login here
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
