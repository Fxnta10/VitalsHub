import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePharmacyStore } from "../stores/pharmacyAuthStore";

export default function PharmacyNavbar() {
  const navigate = useNavigate();
  const { logout } = usePharmacyStore();

  return (
    <nav className="bg-white shadow-sm" style={{ borderBottom: "1px solid #e2e8f0" }}>
      <div className="container d-flex justify-content-between align-items-center py-3">
        <div className="d-flex align-items-center">
            <Link to="/pharmacy/dashboard" className="text-decoration-none d-flex align-items-center">
          <h1 className="h4 fw-bold mb-0" style={{ color: "#3b82f6" }}>
            VitalsHub-Pharmacy
          </h1>
            </Link>
          
          
        </div>

        <button
          onClick={() => logout(navigate)}
          className="btn btn-outline-danger"
          style={{ padding: "8px 16px", fontSize: "0.9rem", borderRadius: "6px", transition: "all 0.2s ease" }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
