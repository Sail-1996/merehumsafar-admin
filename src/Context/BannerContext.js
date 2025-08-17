import { create } from "zustand";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";

const useBannerStore = create((set, get) => ({
  banners: [],
  loading: false,

  fetchBanners: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/banners"); // replace with your endpoint
      set({ banners: res.data });
    } catch (error) {
      console.error("Failed to fetch banners:", error);
    } finally {
      set({ loading: false });
    }
  },

  addBanner: async (newBanner) => {
    try {
      const res = await axiosInstance.post("/banners", newBanner);
      set((state) => ({
        banners: [...state.banners, res.data],
      }));
    } catch (error) {
      console.error("Failed to add banner:", error);
    }
  },

  updateBanner: async (id, updatedData) => {
    try {
      const res = await axiosInstance.put(`/banners/${id}`, updatedData);
      set((state) => ({
        banners: state.banners.map((banner) =>
          banner.bannerId === id ? res.data : banner
        ),
      }));
    } catch (error) {
      console.error("Failed to update banner:", error);
    }
  },

  deleteBanner: async (id) => {
    try {
      await axiosInstance.delete(`/banners/${id}`);
      set((state) => ({
        banners: state.banners.filter((banner) => banner.bannerId !== id),
      }));
    } catch (error) {
      console.error("Failed to delete banner:", error);
    }
  },
}));

export default useBannerStore;
