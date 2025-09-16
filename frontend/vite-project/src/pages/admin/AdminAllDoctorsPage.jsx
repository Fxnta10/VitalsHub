import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/adminAuthStore";
import { useNavigate } from "react-router-dom";
import { Trash2, Edit, Plus, Eye, UserCircle } from "lucide-react";

export default function AdminAllDoctorsPage() {
  const {
    authUser,
    doctors,
    isLoadingDoctors,
    isUpdating,
    getAllDoctors,
    deleteDoctor,
  } = useAuthStore();

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAllDoctors();
  }, [getAllDoctors]);

  const handleDeleteDoctor = async (doctorId) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      const result = await deleteDoctor({ doctorId });
      if (result.success) {
        getAllDoctors();
      }
    }
  };

  const handleViewDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDetails(true);
  };

  const handleAddNewDoctor = () => {
    navigate("/admin/doctors/add");
  };

  const handleEditDoctor = (doctorId) => {
    navigate(`/admin/doctors/edit/${doctorId}`);
  };

  if (isLoadingDoctors) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Doctors</h1>
          <p className="text-gray-600 mt-2">
            Hospital: {authUser?.hospitalId || "Unknown"}
          </p>
        </div>
        <button
          onClick={handleAddNewDoctor}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Doctor
        </button>
      </div>

      {doctors.length === 0 ? (
        <div className="text-center py-12">
          <UserCircle className="w-24 h-24 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No doctors found
          </h3>
          <p className="text-gray-500 mb-6">
            Get started by adding your first doctor.
          </p>
          <button
            onClick={handleAddNewDoctor}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Doctor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <UserCircle className="w-12 h-12 text-gray-400 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {doctor.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {doctor.specialisation}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {doctor.email}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Shift:</span>{" "}
                  {doctor.shift?.start} - {doctor.shift?.end}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs ${
                      doctor.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {doctor.isActive ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewDetails(doctor)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </button>
                <button
                  onClick={() => handleEditDoctor(doctor._id)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteDoctor(doctor._id)}
                  disabled={isUpdating}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Doctor Details Modal */}
      {showDetails && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Doctor Details
              </h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <UserCircle className="w-16 h-16 text-gray-400 mr-4" />
                <div>
                  <h3 className="text-lg font-medium">{selectedDoctor.name}</h3>
                  <p className="text-gray-600">
                    {selectedDoctor.specialisation}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {selectedDoctor.email}
                </p>
                <p>
                  <span className="font-medium">Hospital ID:</span>{" "}
                  {selectedDoctor.hospitalId}
                </p>
                <p>
                  <span className="font-medium">Shift:</span>{" "}
                  {selectedDoctor.shift?.start} - {selectedDoctor.shift?.end}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  {selectedDoctor.isActive ? "Active" : "Inactive"}
                </p>
                <p>
                  <span className="font-medium">Appointments:</span>{" "}
                  {selectedDoctor.appointments?.length || 0}
                </p>
              </div>

              <div className="flex space-x-2 pt-4">
                <button
                  onClick={() => handleEditDoctor(selectedDoctor._id)}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Edit Doctor
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
