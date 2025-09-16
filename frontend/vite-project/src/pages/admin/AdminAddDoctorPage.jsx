import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/adminAuthStore";
import toast from "react-hot-toast";

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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Add New Doctor
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Fill in the doctor's information
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange("name")}
                placeholder="Dr. John Doe"
                className={`mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  errors.name ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                placeholder="doctor@hospital.com"
                className={`mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  errors.email ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Specialisation Field */}
            <div>
              <label
                htmlFor="specialisation"
                className="block text-sm font-medium text-gray-700"
              >
                Specialisation *
              </label>
              <input
                id="specialisation"
                name="specialisation"
                type="text"
                value={formData.specialisation}
                onChange={handleInputChange("specialisation")}
                placeholder="Cardiology, Neurology, etc."
                className={`mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  errors.specialisation ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                required
              />
              {errors.specialisation && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.specialisation}
                </p>
              )}
            </div>

            {/* Shift Timing */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="start"
                  className="block text-sm font-medium text-gray-700"
                >
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
                  className={`mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border ${
                    errors.start ? "border-red-300" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                />
                {errors.start && (
                  <p className="mt-1 text-sm text-red-600">{errors.start}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="end"
                  className="block text-sm font-medium text-gray-700"
                >
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
                  className={`mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border ${
                    errors.end ? "border-red-300" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                />
                {errors.end && (
                  <p className="mt-1 text-sm text-red-600">{errors.end}</p>
                )}
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={handleInputChange("isActive")}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isActive"
                className="ml-2 block text-sm text-gray-900"
              >
                Doctor is currently active
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isAddingDoc}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingDoc ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding...
                </>
              ) : (
                "Add Doctor"
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/doctors")}
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
