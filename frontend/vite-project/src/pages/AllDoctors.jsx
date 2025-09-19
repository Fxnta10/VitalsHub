import React, { useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

export default function AllDoctors() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    hospitalDoctors: doctors,
    isLoading,
    getDoctorsByHospital,
  } = useAuthStore();

  const { hospitalId, hospitalName, hospitalAddress } = location.state || {};

  const fetchDoctors = useCallback(async () => {
    if (!hospitalId) return;
    await getDoctorsByHospital(hospitalId);
  }, [hospitalId, getDoctorsByHospital]);

  useEffect(() => {
    if (!hospitalId) {
      navigate("/hospitals");
      return;
    }
    fetchDoctors();
  }, [hospitalId, navigate, fetchDoctors]);

  const handleSelectDoctor = (doctor) => {
    navigate("/create-appointment", {
      state: {
        hospitalId,
        hospitalName,
        hospitalAddress,
        doctorId: doctor._id,
        doctorName: doctor.name,
        doctorSpecialisation: doctor.specialisation,
        doctorEmail: doctor.email,
      },
    });
  };

  const handleBackToHospitals = () => {
    navigate("/hospitals");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  if (!doctors || doctors.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">👨‍⚕️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Doctors Found
          </h2>
          <p className="text-gray-600 mb-4">
            No doctors are currently available at {hospitalName}.
          </p>
          <button
            onClick={handleBackToHospitals}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Hospitals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleBackToHospitals}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <span className="mr-2">←</span>
            Back to Hospitals
          </button>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-800">
              Selected Hospital
            </h2>
            <p className="text-gray-600">{hospitalName}</p>
            <p className="text-sm text-gray-500">{hospitalAddress}</p>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Available Doctors
          </h1>
          <p className="text-xl text-gray-600">
            Select a doctor to book your appointment
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                {/* Doctor Icon */}
                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                  <span className="text-3xl">👨‍⚕️</span>
                </div>

                {/* Doctor Info */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {doctor.name}
                  </h3>

                  <div className="flex items-center justify-center text-blue-600 mb-2">
                    <span className="text-sm">🎓</span>
                    <span className="ml-2 text-sm font-medium">
                      {doctor.specialisation}
                    </span>
                  </div>

                  <div className="flex items-center justify-center text-gray-600 mb-2">
                    <span className="text-sm">📧</span>
                    <span className="ml-2 text-sm">{doctor.email}</span>
                  </div>

                  <div className="flex items-center justify-center text-gray-600 mb-2">
                    <span className="text-sm">🕒</span>
                    <span className="ml-2 text-sm">
                      {doctor.shift?.start}:00 - {doctor.shift?.end}:00
                    </span>
                  </div>

                  {/* Availability Status */}
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      doctor.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-1 ${
                        doctor.isActive ? "bg-green-400" : "bg-red-400"
                      }`}
                    ></span>
                    {doctor.isActive ? "Available" : "Not Available"}
                  </div>
                </div>

                {/* Select Doctor Button */}
                <button
                  onClick={() => handleSelectDoctor(doctor)}
                  disabled={!doctor.isActive}
                  className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
                    doctor.isActive
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <span>📅</span>
                  {doctor.isActive
                    ? "Book with this Doctor"
                    : "Currently Unavailable"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Found {doctors.length} doctor{doctors.length !== 1 ? "s" : ""} at{" "}
            {hospitalName}
          </p>
        </div>
      </div>
    </div>
  );
}
