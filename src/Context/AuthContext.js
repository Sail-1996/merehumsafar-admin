import { create } from "zustand";
import axiosInstance from "../utils/axiosInstance";
import { jwtDecode } from "jwt-decode";

const useAuthStore = create((set, get) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    loginError: null,


    initializeAuth: () => {
        try {
            const token = localStorage.getItem('access');
            if (!token) return false;

            const decodedToken = jwtDecode(token);

            if (decodedToken?.exp) {
                set({
                    accessToken: token,
                    refreshToken: localStorage.getItem('refresh'),
                });
                return true;
            } else {
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                return false;
            }
        } catch (error) {
            console.error("Token decoding error:", error);
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            return false;
        }
    },

    login: async (credentials) => {
        try {
            const response = await axiosInstance.post("/auth/admin-login", credentials);
            console.log(response, 'login')
            const decodedToken = jwtDecode(response?.data?.accessToken)

            if (decodedToken?.exp) {
                const { user, accessToken, refreshToken } = response.data;
                set({ user, accessToken, refreshToken, loginError: null });
                localStorage.setItem('access', accessToken);
                localStorage.setItem('refresh', refreshToken);
            } else {
                alert("Invalid credentials or login failed")
            }

            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Invalid credentials or login failed";
            set({ loginError: errorMessage });
            return { success: false, error: errorMessage };
        }
    },

    register: async (userData) => {
        try {
            const response = await axiosInstance.post("/register", userData);
            const { user, accessToken, refreshToken } = response.data;
            set({ user, accessToken, refreshToken });
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Registration failed";
            return { success: false, error: errorMessage };
        }
    },

    logout: async () => {
        try {
            const refreshToken = localStorage.getItem('refresh');
            const response = await axiosInstance.post(`/auth/logout?refreshToken=${refreshToken}`);
            console.log(response, 'logout')
            if (response.status === 200) {
                set({ user: null, accessToken: null, refreshToken: null });
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
            }
            return response;
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // refreshAccessToken: async () => {
    //     const { refreshToken } = get();
    //     try {
    //         const response = await axiosInstance.post("https://your-api.com/api/refresh-token", {
    //             refreshToken,
    //         });

    //         const { accessToken } = response.data;
    //         set({ accessToken });
    //         return { success: true };
    //     } catch (error) {
    //         set({ user: null, accessToken: null, refreshToken: null });
    //         return {
    //             success: false,
    //             error: error.response?.data?.message || "Token refresh failed",
    //         };
    //     }
    // },
}));

export default useAuthStore;
