import React from "react";
import { useEffect } from "react";
import { useAuthStore } from "../../stores/adminAuthStore";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Edit Doctor
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>

            <div>
              <input
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                type="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>

            <div>
              <input
                placeholder="Specialisation"
                value={formData.specialisation}
                onChange={(e) =>
                  setFormData({ ...formData, specialisation: e.target.value })
                }
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Is Active?
              </label>
            </div>

            <div>
              <label
                htmlFor="starttime"
                className="block text-sm font-medium text-gray-700"
              >
                Shift Start Time (24hr format):
              </label>
              <input
                name="starttime"
                value={formData.start}
                onChange={(e) =>
                  setFormData({ ...formData, start: e.target.value })
                }
                type="number"
                min="0"
                max="23"
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="endtime"
                className="block text-sm font-medium text-gray-700"
              >
                Shift End Time (24hr format):
              </label>
              <input
                name="endtime"
                value={formData.end}
                onChange={(e) =>
                  setFormData({ ...formData, end: e.target.value })
                }
                type="number"
                min="0"
                max="23"
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Doctor
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
