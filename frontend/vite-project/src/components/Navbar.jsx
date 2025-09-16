import React from 'react'
import {Link} from "react-router-dom"
import {  LogOut } from "lucide-react"
import { useAuthStore } from '../stores/useAuthStore'
import { useNavigate } from 'react-router-dom';
export default function Navbar() {
    const { logout } = useAuthStore();
    const navigate = useNavigate();
    return (
      <div>
        <Link to="/">Home</Link>
        <LogOut />
        <button onClick={() => logout(navigate)}>Logout</button>
        <Link to="/myprofile">My Profile</Link>
      </div>
    );
}
