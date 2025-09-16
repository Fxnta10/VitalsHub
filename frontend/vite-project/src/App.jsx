
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import { Toaster } from "react-hot-toast";
import MyProfile from "./pages/MyProfile";
import Navbar from "./components/Navbar";
import { useAuthStore } from "./stores/useAuthStore";
import AddDocs from "./pages/AddDocs";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminRegisterPage from "./pages/admin/AdminRegisterPage";
import AdminAllDoctorsPage from "./pages/admin/AdminAllDoctorsPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminEditDoctor from "./pages/admin/AdminEditDoctor";
import AdminAddDoctorPage from "./pages/admin/AdminAddDoctorPage";
import RagChatbot from "./pages/RagChatbot";
import MedicalRecords from "./pages/MedicalRecords";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    // Only check auth for non-admin routes
    if (!window.location.pathname.startsWith("/admin")) {
      checkAuth();
    }
  }, [checkAuth]);

  if (
    isCheckingAuth &&
    !authUser &&
    !window.location.pathname.startsWith("/admin")
  ) {
    return <h1>Loading...</h1>;
  }

  return (

    <div>
      {authUser && !window.location.pathname.startsWith("/admin") && <Navbar />}
      <Routes>
        <Route path="/" element={authUser ? <HomePage />:<LoginPage/>} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/addDocs" element={<AddDocs />} />
        <Route path="/medical-records" element={<MedicalRecords />} />
        <Route path="/chatbot" element={<RagChatbot />} />

        <Route path="/admin/*">
          <Route index element={<AdminLoginPage />} />
          <Route path="login" element={<AdminLoginPage />} />
          <Route path="register" element={<AdminRegisterPage />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="doctors" element={<AdminAllDoctorsPage />} />
          <Route path="doctors/add" element={<AdminAddDoctorPage />} />
          <Route path="doctors/edit/:id" element={<AdminEditDoctor />} />
          {/* <Route path="appointments" element={<AdminAppointments />} /> */}
        </Route>
      </Routes>
      <Toaster />
    </div>
  );
   

}

export default App;
