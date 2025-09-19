import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

export default function AllHospitals() {
  const { getAllHospitals, allHospitals, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    getAllHospitals();
  }, [getAllHospitals]);

  const handleViewDoctors = (hospital) => {
    navigate("/doctors", {
      state: {
        hospitalId: hospital._id,
        hospitalName: hospital.hospitalId,
        hospitalAddress: hospital.address,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading hospitals...</p>
        </div>
      </div>
    );
  }

  if (!allHospitals || allHospitals.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🏥</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Hospitals Found
          </h2>
          <p className="text-gray-600">
            There are currently no hospitals available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Available Hospitals
          </h1>
          <p className="text-xl text-gray-600">
            Choose a hospital to view available doctors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allHospitals.map((hospital) => (
            <div
              key={hospital._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                {/* Hospital Icon */}
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                  <span className="text-3xl">🏥</span>
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Hospital {hospital.hospitalId}
                  </h3>
                  <div className="flex items-center justify-center text-gray-600 mb-2">
                    <span className="text-sm">📧</span>
                    <span className="ml-2 text-sm">{hospital.email}</span>
                  </div>
                  <div className="flex items-start justify-center text-gray-600">
                    <span className="text-sm">📍</span>
                    <p className="ml-2 text-sm text-center">
                      {hospital.address}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleViewDoctors(hospital)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <span>�‍⚕️</span>
                  View Doctors
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            Found {allHospitals.length} hospital
            {allHospitals.length !== 1 ? "s" : ""} available
          </p>
        </div>
      </div>
    </div>
  );
}
