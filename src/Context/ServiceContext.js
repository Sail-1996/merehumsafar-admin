import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';

const useServiceStore = create((set) => ({
  services: [],
  loading: false,
  error: null,

  getAllServices: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get('/our-services');
      set({ services: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error("Failed to fetch services:", error);
    }
  },

  addService: async (serviceData) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.post('/our-services', serviceData);
      set((state) => ({
        services: [...state.services, response.data],
        loading: false
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateService: async (id, serviceData) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.put(`/our-services/${id}`, serviceData);
      set((state) => ({
        services: state.services.map(service => 
          service.ourServiceId === id ? response.data : service
        ),
        loading: false
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteService: async (id) => {
    try {
      set({ loading: true, error: null });
      await axiosInstance.delete(`/our-services/${id}`);
      set((state) => ({
        services: state.services.filter(service => service.ourServiceId !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  }
}));

export default useServiceStore;

