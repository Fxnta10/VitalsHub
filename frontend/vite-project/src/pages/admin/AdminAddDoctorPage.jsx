import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/adminAuthStore";
import toast from "react-hot-toast";
import AdminNavbar from "../../components/AdminNavbar";
export default function AdminAddDoctorPage() {
  const { addDoctor, isAddingDoc } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialisation: "",
    start: "",
    end: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const { name, email, specialisation, start, end } = formData;

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (!specialisation.trim()) {
      newErrors.specialisation = "Specialisation is required";
    }
    if (start && (isNaN(start) || start < 0 || start > 23)) {
      newErrors.start = "Start time must be between 0 and 23";
    }
    if (end && (isNaN(end) || end < 0 || end > 23)) {
      newErrors.end = "End time must be between 0 and 23";
    }
    if (start && end && parseInt(start) >= parseInt(end)) {
      newErrors.start = "Start time must be before end time";
      newErrors.end = "End time must be after start time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    try {
      // Prepare data to match backend expected structure
      const doctorData = {
        name: formData.name,
        email: formData.email,
        specialisation: formData.specialisation,
        start: formData.start || null,
        end: formData.end || null,
        isActive: formData.isActive,
      };

      console.log("Submitting doctor data:", doctorData);
      
      const result = await addDoctor(doctorData);

      if (result.success) {
        toast.success("Doctor added successfully!");
        navigate("/admin/doctors");
      }
    } catch (error) {
      console.error("Error adding doctor:", error);
      toast.error("Failed to add doctor");
    }
  };

  const handleInputChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  return (

    <div>
      <AdminNavbar/>
        <div style={{ background: "#f6f8fb", minHeight: "100vh", padding: "32px 0" }}>
      
      <div className="container" style={{ maxWidth: "800px" }}>
        <h2 className="fw-bold mb-2" style={{ color: "#2d3748" }}>
          Add New Doctor
        </h2>
        <p className="text-secondary mb-4" style={{ fontSize: "1.1rem" }}>
          Fill in the doctor's information to add them to the system
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
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange("name")}
                placeholder="Dr. John Doe"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                style={{ padding: "12px", borderRadius: "8px" }}
                required
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name}</div>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="fw-bold mb-2" style={{ color: "#2d3748" }}>
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                placeholder="doctor@hospital.com"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                style={{ padding: "12px", borderRadius: "8px" }}
                required
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            {/* Specialisation Field */}
            <div className="mb-4">
              <label htmlFor="specialisation" className="fw-bold mb-2" style={{ color: "#2d3748" }}>
                Specialisation *
              </label>
              <input
                id="specialisation"
                name="specialisation"
                type="text"
                value={formData.specialisation}
                onChange={handleInputChange("specialisation")}
                placeholder="Cardiology, Neurology, etc."
                className={`form-control ${errors.specialisation ? 'is-invalid' : ''}`}
                style={{ padding: "12px", borderRadius: "8px" }}
                required
              />
              {errors.specialisation && (
                <div className="invalid-feedback">{errors.specialisation}</div>
              )}
            </div>

            {/* Shift Timing */}
            <div className="row mb-4">
              <div className="col-md-6">
                <label htmlFor="start" className="fw-bold mb-2" style={{ color: "#2d3748" }}>
                  Shift Start (24hr)
                </label>
                <input
                  id="start"
                  name="start"
                  type="number"
                  min="0"
                  max="23"
                  value={formData.start}
                  onChange={handleInputChange("start")}
                  placeholder="9"
                  className={`form-control ${errors.start ? 'is-invalid' : ''}`}
                  style={{ padding: "12px", borderRadius: "8px" }}
                />
                {errors.start && (
                  <div className="invalid-feedback">{errors.start}</div>
                )}
              </div>

              <div className="col-md-6">
                <label htmlFor="end" className="fw-bold mb-2" style={{ color: "#2d3748" }}>
                  Shift End (24hr)
                </label>
                <input
                  id="end"
                  name="end"
                  type="number"
                  min="0"
                  max="23"
                  value={formData.end}
                  onChange={handleInputChange("end")}
                  placeholder="17"
                  className={`form-control ${errors.end ? 'is-invalid' : ''}`}
                  style={{ padding: "12px", borderRadius: "8px" }}
                />
                {errors.end && (
                  <div className="invalid-feedback">{errors.end}</div>
                )}
              </div>
            </div>

            {/* Active Status */}
            <div className="mb-4">
              <div className="form-check">
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={handleInputChange("isActive")}
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
                disabled={isAddingDoc}
                className="btn btn-primary flex-grow-1"
                style={{ 
                  padding: "12px", 
                  borderRadius: "8px", 
                  fontSize: "1rem", 
                  fontWeight: "500" 
                }}
              >
                {isAddingDoc ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Adding...
                  </>
                ) : (
                  "Add Doctor"
                )}
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
