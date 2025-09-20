
import { NavLink, Link } from "react-router-dom"
import { LogOut } from "lucide-react"
import { useAuthStore } from '../stores/useAuthStore'
import { useNavigate } from 'react-router-dom';






export default function Navbar() {
  const { logout,authUser } = useAuthStore();
  const navigate = useNavigate();
  const navLinkClass = ({ isActive }) =>
    `mx-3 fw-semibold text-decoration-none ${isActive ? "text-primary" : "text-dark"}`;

  return (
    <nav
      className="d-flex align-items-center justify-content-between px-4 py-3 shadow-sm bg-white"
      style={{ borderRadius: "12px" }}
    >
      <div className="d-flex align-items-center">
        <Link
          to="/"
          className="fw-bold fs-4 text-primary me-4 text-decoration-none"
          style={{ letterSpacing: "1px" }}
        >
          VitalsHub
        </Link>
        <NavLink to="/" className={navLinkClass}>
          Home
        </NavLink>

        <NavLink to="/chatbot" className={navLinkClass}>
          Quick Ask
        </NavLink>
        <NavLink to="/appointments" className={navLinkClass}>
          My Appointments
        </NavLink>
        <NavLink to="/medical-records" className={navLinkClass}>
          Medical Records
        </NavLink>
        {/* <NavLink to="/chatbot" className={navLinkClass}>Health Assistant</NavLink> */}

        <NavLink to="/allPharmacies" className={navLinkClass}>
          Medicine & Pharmacy
        </NavLink>
        {/* <NavLink to="/appointments" className={navLinkClass}>Appointments</NavLink> */}
        {/* <NavLink to="/messages" className={navLinkClass}>Messages</NavLink> */}

        <NavLink to="/myprofile" className={navLinkClass}>
          My Profile
        </NavLink>
      </div>
      <div className="d-flex align-items-center">
        <button
          onClick={() => logout(navigate)}
          className="btn btn-outline-danger d-flex align-items-center fw-bold px-3 py-1 rounded-pill me-3"
          style={{ gap: "8px" }}
        >
          <LogOut size={18} className="me-1" />
          Logout
        </button>
        <img
          src={authUser?.profilePic || "/avatar.png"}
          alt="Profile"
          className="rounded-circle"
          style={{
            width: "40px",
            height: "40px",
            objectFit: "cover",
            border: "2px solid #e2e8f0",
          }}
        />
      </div>
    </nav>
  );
}
