import { create } from "zustand";
import axiosInstance from "../utils/axiosInstance"; // adjust path as needed
import axios from "axios";

const useJobStore = create((set, get) => ({
  jobs: [],
  loading: false,
  error: null,

  // Fetch all jobs
  fetchJobs: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/career");
      set({ jobs: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createJob: async (jobData) => {
    try {
      const response = await axiosInstance.post("/job-posts", jobData);
      set((state) => ({
        jobs: [...state.jobs, response.data],
      }));
    } catch (error) {
      console.error("Create job error:", error);
    }
  },

  // Update a job
  updateJob: async (id, updatedData) => {
    try {
      const response = await axiosInstance.put(`/career/update/${id}`, updatedData);
      set((state) => ({
        jobs: state.jobs.map((job) =>
          job.id === id ? response.data : job
        ),
      }));
    } catch (error) {
      console.error("Update job error:", error);
    }
  },

  // Delete a job
  deleteJob: async (id) => {
    try {
      await axiosInstance.delete(`/career/delete/${id}`);
      set((state) => ({
        jobs: state.jobs.filter((job) => job.id !== id),
      }));
    } catch (error) {
      console.error("Delete job error:", error);
    }
  },
}));

export default useJobStore;
