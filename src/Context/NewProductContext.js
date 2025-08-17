import { create } from 'zustand';
import axios from 'axios';

const useNewProductStore = create((set) => ({
  loading: false,
  error: null,
  success: false,

  addProduct: async (productData) => {
    set({ loading: true, error: null, success: false });
    try {
      const response = await axios.post('/api/Products/AddProduct', productData, {
        headers: {
          'Content-Type': 'application/json',
          // 'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Accept': 'text/plain' ,

          // 'skip_zrok_interstitial': 'true',
          // Add authorization if required
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: false, // Set this to true if you need to send cookies
      });
      
      set({ success: true });
      return response.data;
    } catch (error) {
      // Enhanced error handling
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add product';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },

  // Add a method to clear the state
  clearState: () => {
    set({
      loading: false,
      error: null,
      success: false
    });
  }
}));

export default useNewProductStore;
