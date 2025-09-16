import { useAuthStore } from "../../stores/adminAuthStore";
import AdminNavbar from "../../components/AdminNavbar";
export default function AdminDashboardPage() {
  const { authUser } = useAuthStore();

  return (
    <div>
      <AdminNavbar />
      <h1>Welcome Admin!</h1>
      <h3>Hospital ID : {authUser.hospitalId}</h3>
    </div>
  );
}
