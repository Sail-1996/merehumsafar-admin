import { create } from 'zustand';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';

const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,
  singleProduct: {},
  createProduct: async (newProduct) => {
    console.log(newProduct, 'newProduct');
    try {
      set({ loading: true, error: null });

      const response = await axiosInstance.post('/products', newProduct, {
        headers: {
          'skip_zrok_interstitial': 'true'
        },
      });
      set((state) => ({
        products: [...state.products, response.data],
      }));
      return response
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  getProducts: async () => {
    try {
      set({ loading: true, error: null });

      const response = await axiosInstance.get('/products');
      set({ products: response.data });

    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
  getProductsById: async (id) => {
    try {
      set({ loading: true, error: null });

      const response = await axiosInstance.get(`/products/${id}`);
      set({ singleProduct: response.data });
      return response.data
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id, updatedProduct) => {
    try {
      set({ loading: true, error: null });

      const response = await axiosInstance.put(`products/${id}`, updatedProduct);
      set((state) => ({
        products: state.products.map((product) =>
          product.id === id ? { ...product, ...response.data } : product
        ),
      }));
      return response
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },


  deleteProduct: async (id) => {
    try {
      set({ loading: true, error: null });

      const response = await axiosInstance.delete(`/products/${id}`);
      set((state) => ({
        products: state.products.filter((product) => product.productId !== id), // Ensure you're matching the correct key (e.g., productId)
      }));

      return { success: true }; // ✅ return something so you can check success
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message }; // ✅ also return failure info
    } finally {
      set({ loading: false });
    }
  },

  deleteProductImage: async (productId,imageId)=> {
    try {
      set({ loading: true, error: null });

      const response = await axiosInstance.delete(`/products/${productId}/images/${imageId}`);
  
        // set({ uploadedFiles: updatedFiles, isDeleting: false });
        // Ensure you're matching the correct key (e.g., productId)


      return { success: true }; // ✅ return something so you can check success
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message }; // ✅ also return failure info
    } finally {
      set({ loading: false });
    }
  },

}));

export default useProductStore;
