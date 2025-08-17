import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance'; 
const useOrderStore = create((set) => ({
  orders: [],
  loading: false,
  error: null,
  selectedOrder: null,

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/orders'); // replace with your actual endpoint
      set({ orders: response.data, loading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch orders', 
        loading: false 
      });
    }
  },
  getOrderById: async (orderId) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(`/orders/${orderId}`);
      set({ selectedOrder: res.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to load order',
        loading: false,
      });
    }
  },
  updateOrderStatus: async (orderId, newStatus) => {
    try {
      const res = await axiosInstance.put(`/orders/${orderId}/status?status=${newStatus}`, );
      set((state) => ({
        selectedOrder: { ...state.selectedOrder, status: newStatus },
      }));
      return res.data;
    } catch (error) {
      console.error('Status update failed:', error);
      throw error;
    }
  },
  deleteOrder: async (orderId) => {
    try {
      await axiosInstance.delete(`/orders/${orderId}`);
      set((state) => ({
        orders: state.orders.filter(order => order.orderId !== orderId),
        selectedOrder: state.selectedOrder?.orderId === orderId ? null : state.selectedOrder,
      }));
    } catch (error) {
      console.error('Failed to delete order:', error);
      throw error;
    }
  },

}));

export default useOrderStore;
