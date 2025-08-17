import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';

const useBrandStore = create((set) => ({
    brands: [],
    brandNames: [], // New state to store brand names
    image: "",
    loading: false,
    error: null,

    getBrandNames: async () => {
        try {
            set({ loading: true, error: null });
            const res = await axiosInstance.get('/brands/names');
            set({ 
                brandNames: res?.data || [],
                loading: false 
            });
            return res?.data || [];
        } catch (error) {
            console.error('Error fetching brand names:', error);
            set({ 
                error: error.message || 'Failed to fetch brand names',
                loading: false 
            });
            return [];
        }
    },

    addBrand: async (brand) => {
        try {
            const res = await axiosInstance.post('/brands', brand);

            set((state) => ({
                brands: [...state.brands, res.data]
            }));
            alert('Brand added successfully');

            return res;
        } catch (error) {
            if (error == "AxiosError: Request failed with status code 409") {
                alert("Brand already exists");
            }else{
                alert("Failed to add brand");
            }
            throw error;
        }
    },

    getAllBrands: async () => {
        try {
            const res = await axiosInstance.get('/brands');

            set({ brands: res?.data || [] });
        } catch (error) {
            alert("Fetching data  due to backend issue");
        }
    },

    addBrandImage: async (file) => {
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

    removeBrand: async (id) => {

        try {
            await axiosInstance.delete(`/brands/${id}`);
            set((state) => ({
                brands: state.brands.filter(brand => brand.id !== id)
            }));
            alert('Brand deleted successfully');
        } catch (error) {
            if (error?.response?.data?.message) {
                alert(error?.response?.data?.message);
            } else {
                alert("Failed to delete brand");
            }
        }
    },

    editBrand: async (id, updatedBrand) => {
        try {
            await axiosInstance.put(`/brands/${id}`, updatedBrand);
            set((state) => ({
                brands: state.brands.map((b) =>
                    b.id === id ? { ...b, ...updatedBrand } : b
                ),
            }));
            alert('Brand updated successfully');
        } catch (error) {
            alert("Update failed due to backend issue");
        }
    },

    deleteImage: async (entityType, entityId) => {
        try {
            set({ loading: true, error: null });

            const response = await axiosInstance.delete(`/images/delete/${entityType}/${entityId}`);

            if (response.status === 200 || response.status === 204) {
                // Update the brands state if needed
                set((state) => ({
                    brands: state.brands.map(brand => {
                        if (brand.id === entityId) {
                            return {
                                ...brand,
                                images: brand.images.filter(img => img !== entityId)
                            };
                        }
                        return brand;
                    })
                }));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Delete image error:', error);
            set({ error: error.message || 'Failed to delete image' });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    deleteBrandImage: async (brandId, imageId) => {
        try {
            set({ loading: true, error: null });

            const response = await axiosInstance.delete(`/images/delete/brand/${imageId}`);

            if (response.status === 200 || response.status === 204) {
                // Update the specific brand's images
                set((state) => ({
                    brands: state.brands.map(brand => {
                        if (brand.id === brandId) {
                            return {
                                ...brand,
                                images: brand.images.filter(img => img !== imageId)
                            };
                        }
                        return brand;
                    })
                }));
                return { success: true, message: 'Image deleted successfully' };
            }
        } catch (error) {
            console.error('Delete brand image error:', error);
            set({
                error: error.response?.data?.message || error.message || 'Failed to delete image'
            });
            return { success: false, message: 'Failed to delete image' };
        } finally {
            set({ loading: false });
        }
    }
}));

export default useBrandStore;
