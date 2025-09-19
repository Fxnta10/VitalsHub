import React, { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function CreateAppointment() {
  const { authUser, createAppointment, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Get data passed from AllDoctors page
  const {
    hospitalId,
    hospitalName,
    hospitalAddress,
    doctorId,
    doctorName,
    doctorSpecialisation,
    doctorEmail,
  } = location.state || {};

  const [formData, setFormData] = React.useState({
    hospitalId: "",
    patientId: authUser?._id || "",
    doctorId: "",
    appointmentTime: "",
    isEmergency: false,
    description: "",
  });
  const [error, setError] = React.useState("");

  // Set form data when component mounts with passed data
  useEffect(() => {
    if (hospitalId && doctorId && authUser) {
      setFormData((prev) => ({
        ...prev,
        hospitalId,
        doctorId,
        patientId: authUser._id,
      }));
    }
  }, [hospitalId, doctorId, authUser]);

  // Redirect if no doctor/hospital data is available
  useEffect(() => {
    if (!hospitalId || !doctorId) {
      toast.error("Please select a doctor first");
      navigate("/hospitals");
    }
  }, [hospitalId, doctorId, navigate]);

  const validateForm = () => {
    const { hospitalId, patientId, doctorId, appointmentTime, description } =
      formData;
    if (
      !hospitalId ||
      !patientId ||
      !doctorId ||
      !appointmentTime ||
      !description
    ) {
      setError("All fields are required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      const result = await createAppointment(formData);

      if (result?.success) {
        console.log("Appointment creation successful");
        toast.success("Appointment booked successfully!");
        navigate("/"); // Redirect to home page
      } else {
        setError("Appointment booking failed. Please try again.");
      }
    } catch (err) {
      console.error("Appointment creation error:", err);
      setError("An unexpected error occurred");
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleBackToDoctors = () => {
    navigate("/doctors", {
      state: {
        hospitalId,
        hospitalName,
        hospitalAddress,
      },
    });
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button
            onClick={handleBackToDoctors}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <span className="mr-2">←</span>
            Back to Doctors
          </button>
        </div>

        {/* Appointment Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Book Appointment
            </h1>
            <p className="text-gray-600">Fill in the details to book your appointment</p>
          </div>

          {/* Selected Doctor & Hospital Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Selected Hospital</h3>
              <p className="text-gray-700">{hospitalName}</p>
              <p className="text-sm text-gray-600">{hospitalAddress}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Selected Doctor</h3>
              <p className="text-gray-700 font-medium">{doctorName}</p>
              <p className="text-sm text-gray-600">{doctorSpecialisation}</p>
              <p className="text-sm text-gray-600">{doctorEmail}</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Date & Time *
              </label>
              <input
                type="datetime-local"
                value={formData.appointmentTime}
                onChange={handleInputChange("appointmentTime")}
                min={today}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description / Symptoms *
              </label>
              <textarea
                value={formData.description}
                onChange={handleInputChange("description")}
                placeholder="Please describe your symptoms or reason for the appointment..."
                rows={4}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-vertical"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="emergency"
                checked={formData.isEmergency}
                onChange={(e) =>
                  setFormData({ ...formData, isEmergency: e.target.checked })
                }
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="emergency" className="ml-3 text-sm text-gray-700">
                This is an emergency appointment
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleBackToDoctors}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                  isLoading
                    ? 'bg-blue-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isLoading ? 'Booking...' : 'Book Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
