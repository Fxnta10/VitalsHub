import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'
import { CalendarDays, FolderOpen } from "lucide-react";


export default function HomePage() {
  const { authUser } = useAuthStore();

  return (
    <div style={{ background: "#f6f8fb", minHeight: "100vh", padding: "32px 0" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        <h2 className="fw-bold mb-2" style={{ color: "#2d3748" }}>
          Welcome back{authUser?.fullName ? `, ${authUser.fullName.split(" ")[0]}` : ""}!
        </h2>
        <p className="text-secondary mb-4" style={{ fontSize: "1.1rem" }}>
          Here's a summary of your recent activity and quick access to common tasks.
        </p>

        {/* Quick Actions */}
        <h5 className="fw-bold mb-3" style={{ color: "#2d3748" }}>Quick Actions</h5>
        <div className="d-flex gap-3 mb-5">
          <Link
            to="/chatbot"
            className="btn btn-primary d-flex align-items-center fw-bold flex-grow-1"
            style={{ fontSize: "1.1rem", padding: "16px 0", borderRadius: "10px", boxShadow: "0 2px 8px #e2e8f0" }}
          >
            <CalendarDays size={22} className="me-2" />
            Schedule Appointment
          </Link>
          <Link
            to="/medical-records"
            className="btn d-flex align-items-center fw-bold flex-grow-1"
            style={{
              background: "#f1f5f9",
              color: "#22223b",
              fontSize: "1.1rem",
              padding: "16px 0",
              borderRadius: "10px",
              boxShadow: "0 2px 8px #e2e8f0"
            }}
          >
            <FolderOpen size={22} className="me-2" />
            View Medical Records
          </Link>
        </div>

        {/* Recent Activity */}
        <h5 className="fw-bold mb-3" style={{ color: "#2d3748" }}>Recent Activity</h5>
        <div className="mb-3">
          <div className="d-flex align-items-center justify-content-between bg-white rounded-3 shadow-sm px-4 py-3 mb-3" style={{ border: "1px solid #e2e8f0" }}>
            <div className="d-flex align-items-center">
              <CalendarDays size={32} className="me-3 text-primary" />
              <div>
                <div className="fw-bold" style={{ color: "#22223b" }}>Upcoming Appointment</div>
                <div className="text-secondary" style={{ fontSize: "0.98rem" }}>Appointment with Dr. Emily Carter</div>
              </div>
            </div>
            <div className="text-secondary" style={{ fontWeight: 500 }}>July 15, 2024</div>
          </div>
          <div className="d-flex align-items-center justify-content-between bg-white rounded-3 shadow-sm px-4 py-3" style={{ border: "1px solid #e2e8f0" }}>
            <div className="d-flex align-items-center">
              <FolderOpen size={32} className="me-3 text-primary" />
              <div>
                <div className="fw-bold" style={{ color: "#22223b" }}>Recent Medical Records</div>
                <div className="text-secondary" style={{ fontSize: "0.98rem" }}>Checkup results from June 2024</div>
              </div>
            </div>
            <div className="text-secondary" style={{ fontWeight: 500 }}>June 20, 2024</div>
          </div>
        </div>

        {/* Add Documents Button */}
        <div className="mt-4 text-end">
          <Link
            to="/addDocs"
            className="btn btn-outline-primary fw-bold"
            style={{ borderRadius: "8px", padding: "10px 24px", fontSize: "1rem" }}
          >
            Add Documents
          </Link>
        </div>
      </div>
    </div>
  )
}
