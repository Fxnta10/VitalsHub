import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore';
import { User, Mail, Phone, Lock } from "lucide-react";

export default function LoginPage() {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  })
  const navigate = useNavigate();
  const {login,isLoggingIn} = useAuthStore();
  const handleSubmit=async(e)=>{
    e.preventDefault();
    const sucess=await login(formData)
    if(sucess.success){navigate("/")}
    
  }
  return (
    <div>
      <div className="container mt-5" style={{ maxWidth: "500px" }}>
            <h2 className="mb-4 text-center">Sign Up</h2>
            <form className="border p-4 rounded shadow-sm bg-light" onSubmit={handleSubmit}>
              
              {/* Full Name */}
              
      
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
              
      
              <button type="submit" className="btn btn-primary w-100" disabled={isLoggingIn}>
                {isLoggingIn ? "Logging In..." : "Login"}
              </button>
      
              <div>
                <p>Don't have an account?{""} <Link to="/signup">SignUp</Link></p>
              </div>
            </form>
          </div>
    </div>
  )
}
