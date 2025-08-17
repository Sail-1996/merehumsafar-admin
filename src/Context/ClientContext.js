import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';

const useClientStore = create((set) => ({
    clients: [],
    image: "",
    loading: false,
    error: null,

    addClient: async (client) => {
        try {
            const res = await axiosInstance.post('/clients', client);
            set((state) => ({
                clients: [...state.clients, res.data]
            }));
            alert('Client added successfully');
            return res.data;
        } catch (error) {
            alert("Adding client failed due to backend issue");
            throw error;
        }
    },

    getAllClients: async () => {
        try {
            const res = await axiosInstance.get('/clients');
           
            set({ clients: res?.data || [] });
        } catch (error) {
            alert("Fetching data  due to backend issue");
        }
    },

    addClientImage: async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axiosInstance.post(
                '/images/upload?quality=80&fallbackToJpeg=true',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            const formattedFiles = response.data.map((path) => ({ url: path }));
            set({ image: formattedFiles });

            return formattedFiles;
        } catch (error) {
            console.error('Upload error:', error);
            set({ error: error.message });
            throw error;
        }
    },

    removeClient: async (id) => {
        try {
            await axiosInstance.delete(`/clients/${id}`);
            set((state) => ({
                clients: state.clients.filter(client => client.id !== id)
            }));
            alert('Client deleted successfully');
        } catch (error) {
            alert("Deletion failed due to backend issue");
        }
    },

    editClient: async (id, updatedclient) => {
        try {
            await axiosInstance.put(`/clients/${id}`, updatedclient);
            set((state) => ({
                clients: state.clients.map((b) =>
                    b.id === id ? { ...b, ...updatedclient } : b
                ),
            }));
            alert('Client updated successfully');
        } catch (error) {
            alert("Update failed due to backend issue");
        }
    },

}));

export default useClientStore;
