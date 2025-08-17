
// pages/OrderDetail.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import useOrderStore from '../Context/OrderContext';

const OrderDetail = () => {
  const { state } = useLocation();
  const { updateOrderStatus } = useOrderStore();
  const [newStatus, setNewStatus] = useState('');
  const order = state?.order;

  if (!order) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-8 bg-white rounded-xl shadow-md text-center border border-gray-200">
        <p className="text-red-500 font-medium text-lg">Order details not found.</p>
      </div>
    </div>
  );

  const {
    orderId,
    orderNumber,
    userName,
    items,
    totalAmount,
    status,
    deliveryAddress,
    deliveryDate,
    paymentMethod,
    isPaid,
    paidAt,
    createdAt,
  } = order;

  const handleStatusChange = async () => {
    if (!newStatus) return;
    try {
      await updateOrderStatus(order.orderId, newStatus);
      alert('Order status updated successfully');
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'PAYMENT_CONFIRMED':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'PROCESSING':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'READY_FOR_DELIVERY':
        return 'bg-indigo-50 border-indigo-200 text-indigo-800';
      case 'OUT_FOR_DELIVERY':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'DELIVERED':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'COMPLETED':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'CANCELLED':
        return 'bg-rose-50 border-rose-200 text-rose-800';
      case 'PAYMENT_FAILED':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-light text-gray-800 tracking-tight">Order Details</h1>
          <p className="text-gray-500 mt-2 font-mono">#{orderNumber}</p>
        </div>

        {/* Order Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200/70">
          {/* Order Meta */}
          <div className="p-6 border-b border-gray-200/70 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Placed on</p>
                <p className="text-gray-700 font-medium mt-1">
                  {new Date(createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full border ${getStatusColor(status)} text-xs font-medium mt-1`}>
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Customer & Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200/70">
            <div className="p-6">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Customer</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-gray-800 font-medium">{userName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Contact Number</p>
                  <p className="text-gray-800 font-medium">{order.userMobile}</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Payment</h3>
              <p className="text-gray-800 font-medium capitalize">{paymentMethod?.toLowerCase()}</p>
              <p className={`text-sm mt-2 ${isPaid ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}`}>
                {isPaid ? `Paid on ${new Date(paidAt).toLocaleDateString()}` : 'Payment pending'}
              </p>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="p-6 border-t border-gray-200/70">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Delivery</h3>
            <p className="text-gray-800 font-medium mb-2">{deliveryAddress.formattedAddress}</p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Estimated delivery:</span> {new Date(deliveryDate).toLocaleDateString()}
            </p>
          </div>

          {/* Order Items */}
          <div className="p-6 border-t border-gray-200/70">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Items ({items.length})</h3>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.orderItemId} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-gray-800 font-medium">{item.productName}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.productType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-800 font-medium">AED {item.totalPrice.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-6 bg-gray-50 border-t border-gray-200/70">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Amount</h3>
                <p className="text-gray-800 text-xl font-bold">AED {totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Update */}
        <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200/70">
          <div className="p-6">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Update Order Status</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option className='pr-4' value="">Select new status</option>
                <option value="PENDING">Pending</option>
                <option value="PAYMENT_CONFIRMED">Confirmed</option>
                <option value="PROCESSING">Processing</option>
                <option value="READY_FOR_DELIVERY">Ready for Delivery</option>
                <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="PAYMENT_FAILED">Payment Failed</option>
                <option value="COMPLETED">Completed</option>
                

              </select>
              <button 
                onClick={handleStatusChange} 
                disabled={!newStatus}
                className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${newStatus ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-indigo-700 hover:to-indigo-600 shadow-md' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;