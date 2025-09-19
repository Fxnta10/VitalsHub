import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePharmacyStore } from "../../stores/pharmacyAuthStore";
import { LogIn, Loader } from "lucide-react";
import toast from "react-hot-toast";

export default function PharmacyLogin() {
  const { login, isLoggingIn } = usePharmacyStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    licenseNumber: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData);
    if (result.success) {
      toast.success("Login Successful");
      navigate("/pharmacy/dashboard");
    } else {
      toast.error("Invalid Credentials");
    }
  };

  return (
    <div style={{ background: "#f6f8fb", minHeight: "100vh" }}>
      <div className="container py-5" style={{ maxWidth: "450px" }}>
        <div
          className="bg-white rounded-3 shadow-sm p-4 p-md-5"
          style={{ border: "1px solid #e2e8f0" }}
        >
          {/* Header */}
          <div className="text-center mb-4">
            <LogIn
              size={40}
              className="text-primary mb-3"
              style={{ opacity: 0.8 }}
            />
            <h2
              className="fw-bold mb-2"
              style={{ color: "#2d3748" }}
            >
              Pharmacy Login
            </h2>
            <p
              className="text-secondary"
              style={{ fontSize: "1.05rem" }}
            >
              Enter your credentials to access your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="row g-4">
            <div className="col-12">
              <label
                className="fw-medium mb-2"
                style={{ color: "#4a5568" }}
              >
                License Number
              </label>
              <input
                type="text"
                name="licenseNumber"
                className="form-control"
                value={formData.licenseNumber}
                onChange={handleChange}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                }}
                required
              />
            </div>

            <div className="col-12">
              <label
                className="fw-medium mb-2"
                style={{ color: "#4a5568" }}
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                }}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="col-12 mt-3">
              <button
                type="submit"
                className="btn btn-primary w-100"
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "500",
                  background: "#4f46e5",
                  border: "none",
                }}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader size={20} className="me-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>

              {/* Link to Signup */}
              <p className="text-center mt-4 mb-0">
                Don’t have an account?{" "}
                <Link
                  to="/pharmacy/signup"
                  className="text-decoration-none"
                  style={{ color: "#4f46e5" }}
                >
                  Register
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
