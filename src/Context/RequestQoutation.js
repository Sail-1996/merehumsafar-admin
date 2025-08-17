// stores/requestQuotationStore.js
import { create } from 'zustand';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';

export const useRequestQuotationStore = create((set, get) => ({
    quotations: [],
    loading: false,
    error: null,
    currentQuotation: null,

    fetchQuotations: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get('/request-quotations', {
                headers: {
                    'skip_zrok_interstitial': 'true'
                },
            });
            set({ quotations: response?.data, loading: false });
            return response.data;

        } catch (error) {
            set({ error: error.response?.data?.message || error.message, loading: false });
            throw error;
        }
    },

    getQuotationById: async (id) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            set({ currentQuotation: response.data, loading: false });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, loading: false });
            throw error;
        }
    },

    // Create new quotation
    createQuotation: async (quotationData) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(API_URL, quotationData);
            set((state) => ({
                quotations: [...state.quotations, response.data],
                loading: false
            }));
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, loading: false });
            throw error;
        }
    },


    updateQuotation: async (id, updatedData  ) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.put(`/request-quotations/${id}`, updatedData)
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, loading: false });
            throw error;
        }
    },

    // Delete quotation
    deleteQuotation: async (id) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`${API_URL}/${id}`);
            set((state) => ({
                quotations: state.quotations.filter(item => item.id !== id),
                currentQuotation: null,
                loading: false
            }));
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, loading: false });
            throw error;
        }
    },

    // Reset current quotation
    resetCurrentQuotation: () => set({ currentQuotation: null }),

    // Clear errors
    clearError: () => set({ error: null }),
}));