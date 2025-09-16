import React from "react";
import { useEffect } from "react";
import { useAuthStore } from "../../stores/adminAuthStore";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import AdminNavbar from "../../components/AdminNavbar";

export default function AdminEditDoctor() {
  const { getDoctor, updateDoctor } = useAuthStore();
  const { id: doctorId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    start: "",
    end: "",
    specialisation: "",
    isActive: false,
  });

  useEffect(() => {
    const getDoctorDetails = async () => {
      if (!doctorId) return;

      const result = await getDoctor(doctorId);
      if (result.success) {
        const doctor = result.data;
        setFormData({
          name: doctor.name || "",
          email: doctor.email || "",
          start: doctor.shift?.start || "",
          end: doctor.shift?.end || "",
          specialisation: doctor.specialisation || "",
          isActive: doctor.isActive || false,
        });
      }
    };

    getDoctorDetails();
  }, [doctorId, getDoctor]);

  const validateForm = () => {
    const { name, email, start, end, specialisation } = formData;

    if (!name.trim() || !email.trim() || !specialisation.trim()) {
      toast.error("Please fill in all required fields");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (start && (isNaN(start) || start < 0 || start > 23)) {
      toast.error("Start time must be a number between 0 and 23");
      return false;
    }

    if (end && (isNaN(end) || end < 0 || end > 23)) {
      toast.error("End time must be a number between 0 and 23");
      return false;
    }

    if (start && end && parseInt(start) >= parseInt(end)) {
      toast.error("Start time must be before end time");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valid = validateForm();
    if (!valid) {
      return;
    }

    try {
      console.log("Submitting doctor update:", { doctorId, ...formData });
      
      const result = await updateDoctor({
        doctorId,
        name: formData.name,
        email: formData.email,
        specialisation: formData.specialisation,
        start: formData.start || null,
        end: formData.end || null,
        isActive: formData.isActive,
      });

      if (result.success) {
        toast.success("Doctor updated successfully!");
        navigate("/admin/doctors");
      } else {
        toast.error("Failed to update doctor");
      }
    } catch (error) {
      console.error("Error updating doctor:", error);
      toast.error("An error occurred while updating the doctor");
    }
  };
  return (
    <div>
      <AdminNavbar />
    <div style={{ background: "#f6f8fb", minHeight: "100vh", padding: "32px 0" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        <h2 className="fw-bold mb-2" style={{ color: "#2d3748" }}>
          Edit Doctor
        </h2>
        <p className="text-secondary mb-4" style={{ fontSize: "1.1rem" }}>
          Update doctor's information in the system
        </p>

        <div className="bg-white rounded-3 shadow-sm p-4" style={{ border: "1px solid #e2e8f0" }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="mb-4">
              <label htmlFor="name" className="fw-bold mb-2" style={{ color: "#2d3748" }}>
                Full Name *
              </label>
              <input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                type="text"
                placeholder="Dr. John Doe"
                className="form-control"
                style={{ padding: "12px", borderRadius: "8px" }}
                required
              />
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="fw-bold mb-2" style={{ color: "#2d3748" }}>
                Email Address *
              </label>
              <input
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                type="email"
                placeholder="doctor@hospital.com"
                className="form-control"
                style={{ padding: "12px", borderRadius: "8px" }}
                required
              />
            </div>

            {/* Specialisation Field */}
            <div className="mb-4">
              <label htmlFor="specialisation" className="fw-bold mb-2" style={{ color: "#2d3748" }}>
                Specialisation *
              </label>
              <input
                id="specialisation"
                value={formData.specialisation}
                onChange={(e) => setFormData({ ...formData, specialisation: e.target.value })}
                type="text"
                placeholder="Cardiology, Neurology, etc."
                className="form-control"
                style={{ padding: "12px", borderRadius: "8px" }}
                required
              />
            </div>

            {/* Shift Timing */}
            <div className="row mb-4">
              <div className="col-md-6">
                <label htmlFor="start" className="fw-bold mb-2" style={{ color: "#2d3748" }}>
                  Shift Start (24hr)
                </label>
                <input
                  id="start"
                  value={formData.start}
                  onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                  type="number"
                  min="0"
                  max="23"
                  placeholder="9"
                  className="form-control"
                  style={{ padding: "12px", borderRadius: "8px" }}
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="end" className="fw-bold mb-2" style={{ color: "#2d3748" }}>
                  Shift End (24hr)
                </label>
                <input
                  id="end"
                  value={formData.end}
                  onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                  type="number"
                  min="0"
                  max="23"
                  placeholder="17"
                  className="form-control"
                  style={{ padding: "12px", borderRadius: "8px" }}
                />
              </div>
            </div>

            {/* Active Status */}
            <div className="mb-4">
              <div className="form-check">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="form-check-input"
                  style={{ width: "1.2em", height: "1.2em" }}
                />
                <label htmlFor="isActive" className="form-check-label ms-2" style={{ color: "#2d3748" }}>
                  Doctor is currently active
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="d-flex gap-3">
              <button
                type="submit"
                className="btn btn-outline-primary flex-grow-1"
                style={{ 
                  padding: "12px", 
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "500"
                }}
              >
                Update Doctor
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/doctors")}
                className="btn btn-outline-secondary flex-grow-1"
                style={{ 
                  padding: "12px", 
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "500"
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}
