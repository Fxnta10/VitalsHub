import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/adminAuthStore";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  return (
    <div>
      <h1>VitalsHub</h1>
      <Link to="/admin/dashboard">Home</Link>
      <Link to="/admin/appointments">Appointments</Link>
      <Link to="/admin/doctors">All Doctors</Link>
      <button onClick={() => logout(navigate)}>Logout</button>
    </div>
  );
}
