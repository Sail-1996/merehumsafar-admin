import React from 'react';
import { Controller } from 'react-hook-form';

const InventorySection = ({ control }) => {
  return (
    <div className="bg-white dark:bg-gray-800  border-gray-200 dark:border-gray-700 rounded-lg transition-colors duration-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-secondary w-full p-4 px-8 bg-blue-50">
        Inventory Management
      </h3>
      <div className="flex items-center justify-between mb-6">
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-2 border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-gray-50/50 dark:bg-gray-700/30">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Product SKU
          </label>
          <div className="relative">
            <Controller
              name="inventory.sku"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="SKU-12345"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:text-gray-200 dark:bg-gray-800 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 text-xs">UNIQUE</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-gray-50/50 dark:bg-gray-700/30">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Available Quantity
          </label>
          <div className="relative">
            <Controller
              name="inventory.quantity"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  placeholder="Enter Quantity"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:text-gray-200 dark:bg-gray-800 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => {
                    field.onChange(parseInt(e.target.value));
                  }}
                />
              )}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 text-sm">QTY</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-gray-50/50 dark:bg-gray-700/30">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Stock Status
          </label>
          <div className="mt-6 flex flex-wrap gap-3">
            <Controller
              name="inventory.stockStatus"
              control={control}
              render={({ field }) => (
                <>
                  <button
                    type="button"
                    onClick={() => field.onChange('IN_STOCK')}
                    className={`px-3 py-1.5 uppercase rounded-full text-xs font-medium flex items-center transition-colors ${field.value === 'IN_STOCK'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                  >
                    <span className={`w-2 h-2 rounded-full mr-2 ${field.value === 'IN_STOCK' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></span>
                    In Stock
                  </button>

                  <button
                    type="button"
                    onClick={() => field.onChange('OUT_OF_STOCK')}
                    className={`px-3 py-1.5 uppercase rounded-full text-xs font-medium flex items-center transition-colors ${field.value === 'OUT_OF_STOCK'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                  >
                    <span className={`w-2 h-2 rounded-full mr-2 ${field.value === 'OUT_OF_STOCK' ? 'bg-red-500' : 'bg-gray-400'
                      }`}></span>
                    Out of Stock
                  </button>
                </>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventorySection;