import React from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { User, Shield, Pill } from "lucide-react";

export default function SingleLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract selected login type from URL
  const getSelectedLoginType = () => {
    if (location.pathname.includes("admin")) return "admin";
    if (location.pathname.includes("pharmacy")) return "pharmacy";
    return "user";
  };

  const selectedLoginType = getSelectedLoginType();

  const loginTypes = [
    {
      id: "user",
      title: "Patient Login",
      description: "Access your medical records and book appointments",
      icon: User,
      bgColor: "#4f46e5",
      redirectPath: "/single-login/user",
    },
    {
      id: "admin",
      title: "Admin Login",
      description: "Manage hospitals, doctors and system operations",
      icon: Shield,
      bgColor: "#059669",
      redirectPath: "/single-login/admin",
    },
    {
      id: "pharmacy",
      title: "Pharmacy Login",
      description: "Manage prescriptions and inventory",
      icon: Pill,
      bgColor: "#dc2626",
      redirectPath: "/single-login/pharmacy",
    },
  ];

  const handleLoginTypeSelection = (type) => {
    navigate(loginTypes.find((lt) => lt.id === type).redirectPath);
  };

  return (
    <div style={{ background: "#f6f8fb", minHeight: "100vh" }}>
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Header */}
            <div className="text-center mb-4">
              <h1
                className="fw-bold mb-2"
                style={{ color: "#2d3748", fontSize: "2rem" }}
              >
                Welcome to VitalsHub
              </h1>
              <p className="text-secondary mb-0" style={{ fontSize: "1rem" }}>
                Select your login type and enter credentials
              </p>
            </div>

            {/* Login Type Selection */}
            <div className="mb-4">
              <h6
                className="fw-bold mb-3 text-center"
                style={{ color: "#2d3748" }}
              >
                Choose Login Type
              </h6>
              <div className="row g-2">
                {loginTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <div key={type.id} className="col-md-4">
                      <div
                        className={`card border-0 h-100 cursor-pointer ${
                          selectedLoginType === type.id
                            ? "shadow-lg"
                            : "shadow-sm"
                        }`}
                        style={{
                          background:
                            selectedLoginType === type.id
                              ? type.bgColor
                              : "white",
                          borderRadius: "10px",
                          transition: "all 0.2s ease",
                          cursor: "pointer",
                          border:
                            selectedLoginType === type.id
                              ? `2px solid ${type.bgColor}`
                              : "2px solid transparent",
                        }}
                        onClick={() => handleLoginTypeSelection(type.id)}
                        onMouseEnter={(e) => {
                          if (selectedLoginType !== type.id) {
                            e.currentTarget.style.transform =
                              "translateY(-2px)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedLoginType !== type.id) {
                            e.currentTarget.style.transform = "translateY(0)";
                          }
                        }}
                      >
                        <div className="card-body d-flex flex-column align-items-center p-3">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center mb-2"
                            style={{
                              background:
                                selectedLoginType === type.id
                                  ? "rgba(255,255,255,0.2)"
                                  : "#f1f5f9",
                              width: "48px",
                              height: "48px",
                            }}
                          >
                            <IconComponent
                              size={24}
                              className={
                                selectedLoginType === type.id
                                  ? "text-white"
                                  : "text-primary"
                              }
                            />
                          </div>
                          <h6
                            className={`fw-bold mb-1 text-center ${
                              selectedLoginType === type.id ? "text-white" : ""
                            }`}
                            style={{
                              color:
                                selectedLoginType === type.id
                                  ? "white"
                                  : "#2d3748",
                              fontSize: "0.9rem",
                            }}
                          >
                            {type.title}
                          </h6>
                          <p
                            className={`mb-0 text-center ${
                              selectedLoginType === type.id
                                ? "text-white-50"
                                : "text-secondary"
                            }`}
                            style={{ fontSize: "0.75rem" }}
                          >
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Login Form - Outlet */}
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6">
                <Outlet
                  context={{
                    loginTypes: loginTypes.find(
                      (type) => type.id === selectedLoginType
                    ),
                    selectedLoginType,
                  }}
                />
              </div>
            </div>

            {/* Footer Links */}
            <div className="text-center mt-3">
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link
                  to="/forgot-password"
                  className="text-decoration-none text-secondary"
                  style={{ fontSize: "0.85rem" }}
                >
                  Forgot Password?
                </Link>
                <Link
                  to="/help"
                  className="text-decoration-none text-secondary"
                  style={{ fontSize: "0.85rem" }}
                >
                  Need Help?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
