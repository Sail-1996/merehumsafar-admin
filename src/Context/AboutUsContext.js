// src/store/AboutUsStore.js
import { create } from "zustand";
import axiosInstance from "../utils/axiosInstance";

 const useAboutUsStore = create((set, get) => ({
  aboutUsList: [],
  loading: false,
  error: null,

  fetchAboutUs: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get("/about-us");
      set({ aboutUsList: res.data });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  createAboutUs: async (data) => {
    try {
      const res = await axiosInstance.post("/about-us", data);
      set((state) => ({
        aboutUsList: [...state.aboutUsList, res.data],
      }));
      return res;
    } catch (err) {
      console.error("Create failed:", err.message);
    }
  },

  updateAboutUs: async (id, data) => {
    try {
      const res = await axiosInstance.put(`/about-us/${id}`, data);
      set((state) => ({
        aboutUsList: state.aboutUsList.map((item) =>
          item.aboutUsId === id ? res.data : item
        ),
      }));
      return res;
    } catch (err) {
      console.error("Update failed:", err.message);
    }
  },

  deleteAboutUs: async (id) => {
    try {
      const res = await axiosInstance.delete(`/about-us/${id}`);
      set((state) => ({
        aboutUsList: state.aboutUsList.filter(
          (item) => item.aboutUsId !== id
        ),
      }));
      return res;
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  },

  getAboutUsById: (id) => {
    return get().aboutUsList.find((item) => item.aboutUsId === id);
  },
}));

export default useAboutUsStore