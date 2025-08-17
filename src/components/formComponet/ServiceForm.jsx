import React from 'react';
import { Controller } from 'react-hook-form';

const ServiceForm = ({ control, watch, setValue, serviceKey, label, priceLabel,initialData }) => {
  const serviceData = watch(`pricing.services.${serviceKey}`);

  return (
    <div className="dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 transition-colors duration-200">
      <h3 className="text-lg font-medium mb-4 dark:text-white text-purple-700 bg-purple-50/75 p-3 flex items-center border-gray-300 rounded-lg">{label}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {priceLabel}
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">AED</span>
            </div>
            <Controller
              name={`pricing.services.${serviceKey}.price`}
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  min="0"
                  step="0.01"
                  className="block w-full pl-12 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="0.00"
                  onChange={(e) => {
                    field.onChange(e.target.value === '' ? '' : parseFloat(e.target.value));
                  }}
                />
              )}
            />
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Benefits
          </label>
          <div className="space-y-3">
            {serviceData?.benefits?.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <Controller
                  name={`pricing.services.${serviceKey}.benefits.${index}`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder={`Benefit ${index + 1}`}
                      className="block w-full px-4 py-2 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  )}
                />
                {serviceData.benefits.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const currentBenefits = watch(`pricing.services.${serviceKey}.benefits`);
                      const updatedBenefits = currentBenefits.filter((_, i) => i !== index);
                      setValue(`pricing.services.${serviceKey}.benefits`, updatedBenefits);
                    }}
                    className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Remove benefit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const currentBenefits = watch(`pricing.services.${serviceKey}.benefits`) || [''];
                setValue(`pricing.services.${serviceKey}.benefits`, [...currentBenefits, '']);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceForm;