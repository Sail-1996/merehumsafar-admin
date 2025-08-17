import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';

const useSpecificationFieldsStore = create((set) => ({
  specificationFields: [],

  addSpecificationField: async (fieldData) => {
    try {
      const res = await axiosInstance.post('/specification-fields', fieldData);
      set((state) => ({
        specificationFields: [...state.specificationFields, res.data]
      }));
      alert('Specification field added successfully');
      return res.data;
    } catch (error) {
      alert("Failed to add specification field");
      throw error;
    }
  },

  getAllSpecificationFields: async () => {
    try {
      const res = await axiosInstance.get('/specification-fields');
      set({ specificationFields: res?.data || [] });
      return res.data
    } catch (error) {
      alert("Failed to fetch specification fields");
    }
  },

  removeSpecificationField: async (id) => {
    try {
      await axiosInstance.delete(`/specification-fields/${id}`);
      set((state) => ({
        specificationFields: state.specificationFields.filter(field => field.id !== id)
      }));
      alert('Specification field deleted successfully');
    } catch (error) {
      alert("Failed to delete specification field");
    }
  },

  // Update specification field
  updateSpecificationField: async (id, updatedData) => {
    try {
      await axiosInstance.put(`/specification-fields/${id}`, updatedData);
      set((state) => ({
        specificationFields: state.specificationFields.map((field) =>
          field.id === id ? { ...field, ...updatedData } : field
        ),
      }));
      alert('Specification field updated successfully');
    } catch (error) {
      alert("Failed to update specification field");
    }
  },

  getCommonFieldTemplates: () => [
    { name: "Capacity", unit: "kg/liters/persons" },
    { name: "Weight", unit: "kg" },
    { name: "Height", unit: "cm/inches" },
    { name: "Width", unit: "cm/inches" },
    { name: "Depth", unit: "cm/inches" },
    { name: "Volume", unit: "cubic meters" },
    { name: "Color" },
    { name: "Material" },
    { name: "Power Source" },
    { name: "Condition" }
  ]
}));

export default useSpecificationFieldsStore;