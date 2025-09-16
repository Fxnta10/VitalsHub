import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/adminAuthStore";

export default function AdminLoginPage() {
  const [hospitalID, setHospitalID] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login, isLoggingIn } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!hospitalID.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const result = await login({
        hospitalId: hospitalID.trim(),
        password: password.trim(),
      });

      if (result?.success) {
        console.log("Login successful");
        navigate("/admin/dashboard");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred");
    }
  };

  return (
    <div
      style={{ background: "#f6f8fb", minHeight: "100vh" }}
      className="d-flex align-items-center justify-content-center py-5"
    >
      <div className="container" style={{ maxWidth: "400px" }}>
        <div
          className="bg-white rounded-3 shadow-sm p-4"
          style={{ border: "1px solid #e2e8f0" }}
        >
          <div className="text-center mb-4">
            <h2
              className="fw-bold mb-2"
              style={{ color: "#2d3748" }}
            >
              Admin Login
            </h2>
            <p
              className="text-secondary"
              style={{ fontSize: "0.95rem" }}
            >
              Sign in to your hospital admin account
            </p>
          </div>

          {error && (
            <div className="alert alert-danger mb-4" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label
                htmlFor="hospitalID"
                className="fw-bold mb-2"
                style={{ color: "#2d3748" }}
              >
                Hospital ID
              </label>
              <input
                id="hospitalID"
                name="hospitalID"
                type="text"
                value={hospitalID}
                onChange={(e) => setHospitalID(e.target.value)}
                placeholder="Enter your hospital ID"
                className="form-control"
                style={{ padding: "12px", borderRadius: "8px" }}
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="fw-bold mb-2"
                style={{ color: "#2d3748" }}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="form-control"
                style={{ padding: "12px", borderRadius: "8px" }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="btn btn-outline-primary w-100 mb-3"
              style={{
                padding: "12px",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "500",
                transition: "all 0.2s ease",
              }}
            >
              {isLoggingIn ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>

            <div className="text-center">
              <p
                className="text-secondary mb-0"
                style={{ fontSize: "0.95rem" }}
              >
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/admin/register")}
                  className="btn btn-link p-0 align-baseline"
                  style={{
                    color: "#4f46e5",
                    textDecoration: "none",
                  }}
                >
                  Register here
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
