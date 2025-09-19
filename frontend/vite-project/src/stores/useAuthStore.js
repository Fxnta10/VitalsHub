import {create} from "zustand"
import toast from "react-hot-toast"
import {axiosInstance} from "../lib/axios"


export const useAuthStore = create((set) => ({
  authUser: null,
  allHospitals: null,
  hospitalDoctors: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,
  isAddingDoc: false,
  isLoading: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/user/check", {
        withCredentials: true,
      });
      console.log("Login response:", res.data);
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkAuth", error.message);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/user/signup", data);
      set({ authUser: res.data });
      toast.success("User Created Successfully");
      return { success: true };
    } catch (error) {
      console.log("Error in signup", error.message);
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/user/login", data);
      set({ authUser: res.data });
      toast.success("User Logged In Successfully");
      return { success: true };
    } catch (error) {
      console.log("Error in login", error.message);
      // toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/user/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile Updated Successfully");
      return { success: true };
    } catch (error) {
      console.log("Error in updateProfile", error.message);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  logout: async (navigate) => {
    try {
      await axiosInstance.post("/user/logout");
      set({ authUser: null });
      toast.success("User Logged Out Successfully");
      navigate("/login");
    } catch (error) {
      console.log("Error in logout", error.message);
      toast.error(error.response.data.message);
    }
  },
  addDocs: async (data) => {
    set({ isAddingDoc: true });
    try {
      axiosInstance.post("/user/upload", data);
      toast.success("Document Added Successfully");
      return { success: true };
    } catch (error) {
      console.log("Error in addDocs", error.message);
      toast.error(error.response.data.message);
    } finally {
      set({ isAddingDoc: false });
    }
  },
  createAppointment: async (data) => {
    set({ isLoading: true });
    try {
      await axiosInstance.post("/appointments/create", data);
      toast.success("Appointment Created successfully");
      return { success: true };
    } catch (error) {
      console.log("Error in creating appointment", error.message);
      toast.error(
        error.response?.data?.message || "Failed to create appointment"
      );
      return { success: false };
    } finally {
      set({ isLoading: false });
    }
  },

  getAllHospitals: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/auth/allhospitals");
      set({ allHospitals: res.data.data });
      return { success: true };
    } catch (error) {
      console.log("Error in getting all hospitals", error.message);
      toast.error(error.response?.data?.message || "Failed to fetch hospitals");
      return { success: false };
    } finally {
      set({ isLoading: false });
    }
  },

  getDoctorsByHospital: async (hospitalId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(
        `/admin/doctors/hospital/${hospitalId}`
      );
      set({ hospitalDoctors: res.data.data || res.data });
      return { success: true, data: res.data.data || res.data };
    } catch (error) {
      console.log("Error in getting doctors by hospital", error.message);
      toast.error(error.response?.data?.message || "Failed to fetch doctors");
      set({ hospitalDoctors: [] });
      return { success: false };
    } finally {
      set({ isLoading: false });
    }
  },
}));