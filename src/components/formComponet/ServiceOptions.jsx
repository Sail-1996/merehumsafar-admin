import React, { useState, useEffect } from 'react';
import ServiceForm from './ServiceForm';

const ServiceOptions = ({ control, watch, setValue, singleProduct }) => {
  const serviceTypes = {
    ots: { label: 'One Time Service', priceLabel: 'Price (Per Service)' },
    mmc: { label: 'MMC Service', priceLabel: 'Price (Per Month)' },
    amcBasic: { label: 'AMC Basic Service', priceLabel: 'Price (Per Year)' },
    amcGold: { label: 'AMC Gold Service', priceLabel: 'Price (Per Year)' }
  };

  // Initialize services state
  const [services, setServices] = useState(() => {
    const initialState = {};
    Object.keys(serviceTypes).forEach(key => {
      initialState[key] = {
        isActive: false,
        data: null
      };
    });
    return initialState;
  });

  // Initialize from singleProduct
  useEffect(() => {
    if (singleProduct) {
      const updatedServices = { ...services };
      Object.keys(serviceTypes).forEach(key => {
        const serviceData = singleProduct[key];
        if (serviceData) {
          updatedServices[key] = {
            isActive: true,
            data: serviceData
          };
          setValue(`pricing.services.${key}`, {
            price: serviceData.price || '',
            benefits: serviceData.benefits || ['']
          });
        }
      });
      setServices(updatedServices);
    }
  }, [singleProduct]);

  const toggleService = (serviceKey) => {
    setServices(prev => {
      const newState = { ...prev };
      const currentService = newState[serviceKey];
      
      if (currentService.isActive) {
        // Deactivate service
        newState[serviceKey] = {
          isActive: false,
          data: null
        };
        setValue(`pricing.services.${serviceKey}`, null);
      } else {
        // Activate service
        newState[serviceKey] = {
          isActive: true,
          data: { price: '', benefits: [''] }
        };
        setValue(`pricing.services.${serviceKey}`, {
          price: '',
          benefits: ['']
        });
      }
      
      return newState;
    });
  };

  const updateServiceData = (serviceKey, newData) => {
    setServices(prev => ({
      ...prev,
      [serviceKey]: {
        ...prev[serviceKey],
        data: newData
      }
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 border rounded-lg border-purple-300 dark:border-gray-700 dark:shadow-none">
      <div className="flex items-center justify-between mb-6 bg-purple-50 rounded-lg px-5">
        <h2 className="md:text-lg text-base font-semibold text-purple-700 rounded-lg p-3 dark:text-gray-100">
          Service Options {singleProduct?.serviceId && `(ID: ${singleProduct.serviceId})`}
        </h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(serviceTypes).map(([key, { label }]) => (
          <label key={key} className="relative flex items-center justify-center cursor-pointer group">
            <div className="flex items-center justify-center h-5">
              <input
                type="checkbox"
                checked={services[key]?.isActive || false}
                onChange={() => toggleService(key)}
                className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div className="ms-2 text-sm">
              <span className="font-medium text-gray-900 dark:text-gray-300">
                {label}
              </span>
            </div>
          </label>
        ))}
      </div>

      <div className="space-y-6">
        {Object.entries(serviceTypes).map(([key, { label, priceLabel }]) => (
          services[key]?.isActive && (
            <ServiceForm
              key={key}
              control={control}
              watch={watch}
              setValue={setValue}
              serviceKey={key}
              label={label}
              priceLabel={priceLabel}
              initialData={services[key]?.data || { price: '', benefits: [''] }}
              onUpdate={(newData) => updateServiceData(key, newData)}
            />
          )
        ))}
      </div>
    </div>
  );
};

export default ServiceOptions;