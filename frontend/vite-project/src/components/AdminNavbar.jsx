import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/adminAuthStore";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  return (
    <nav className="bg-white shadow-sm" style={{ borderBottom: "1px solid #e2e8f0" }}>
      <div className="container d-flex justify-content-between align-items-center py-3">
        <div className="d-flex align-items-center">
          <h1 className="h4 fw-bold mb-0" style={{ color: "#3b82f6" }}>
            VitalsHub
          </h1>
          
          <div className="ms-4 d-flex gap-3">
            <Link 
              to="/admin/dashboard"
              className="text-decoration-none"
              style={{ 
                color: "#4a5568",
                fontSize: "0.95rem",
                transition: "color 0.2s ease"
              }}
            >
              Home
            </Link>
            <Link 
              to="/admin/appointments"
              className="text-decoration-none"
              style={{ 
                color: "#4a5568",
                fontSize: "0.95rem",
                transition: "color 0.2s ease"
              }}
            >
              Appointments
            </Link>
            <Link 
              to="/admin/doctors"
              className="text-decoration-none"
              style={{ 
                color: "#4a5568",
                fontSize: "0.95rem",
                transition: "color 0.2s ease"
              }}
            >
              All Doctors
            </Link>
          </div>
        </div>

        <button
          onClick={() => logout(navigate)}
          className="btn btn-outline-danger"
          style={{ 
            padding: "8px 16px",
            fontSize: "0.9rem",
            borderRadius: "6px",
            transition: "all 0.2s ease"
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
