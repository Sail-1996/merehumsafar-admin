import React, { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import SellPricingForm from './SellPricingForm';
import RentPricingForm from './RentPricingForm';
import ServiceOptions from './ServiceOptions';

const PricingOptions = ({ control, watch, setValue, singleProduct, formState, isEditMode = false }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isAvailableForRequestQuotation, setIsAvailableForRequestQuotation] = useState(false);

  // const hasMainOptionsData =
  //   !!singleProduct?.productFor?.sell ||
  //   !!singleProduct?.productFor?.rent ||
  //   !!singleProduct?.productFor?.service;


  useEffect(() => {
    if (formState?.isSubmitSuccessful && !isEditMode) {
      setSelectedOptions([]);
      setIsAvailableForRequestQuotation(false);
      setValue('pricing.isAvailableForRequestQuotation', false);
    }
  }, [formState?.isSubmitSuccessful, setValue, isEditMode]);

  const handleOptionChange = (option) => {
    // Special handling for request quotation
    if (option === 'request_quotation') {
      const newValue = !isAvailableForRequestQuotation;
      setIsAvailableForRequestQuotation(newValue);
      setValue('pricing.isAvailableForRequestQuotation', newValue);
      
      // In edit mode, allow Request Quotation to be toggled without affecting other options
      if (isEditMode) {
        setSelectedOptions(prev => {
          if (newValue) {
            return [...prev, 'request_quotation'];
          } else {
            return prev.filter(o => o !== 'request_quotation');
          }
        });
        return;
      }
      
      // In create mode, maintain exclusive behavior
      if (newValue) {
        setSelectedOptions(['request_quotation']);
        setValue('pricing.sell', undefined);
        setValue('pricing.rent', undefined);
        setValue('pricing.services', undefined);
      } else {
        setSelectedOptions([]);
      }
      return;
    }

    if (isEditMode) {
      setSelectedOptions(prev => {
        if (prev.includes(option)) {
          // Unchecking an option
          if (option === 'sell') setValue('pricing.sell', undefined);
          if (option === 'rent') setValue('pricing.rent', undefined);
          if (option === 'service') setValue('pricing.services', undefined);
          return prev.filter(o => o !== option);
        } else {
          // Checking an option
          if (option === 'sell' && singleProduct?.productFor?.sell) {
            setValue('pricing.sell', singleProduct.productFor.sell);
          }
          if (option === 'rent' && singleProduct?.productFor?.rent) {
            setValue('pricing.rent', singleProduct.productFor.rent);
          }
          if (option === 'service' && singleProduct?.productFor?.service) {
            setValue('pricing.services', singleProduct.productFor.service);
          }
          return [...prev, option];
        }
      });
      return;
    }

    // In create mode, don't allow toggling other options if request quotation is enabled
    if (isAvailableForRequestQuotation) {
      return;
    }

    // Normal toggle for other options in create mode
    setSelectedOptions(prev => {
      if (prev.includes(option)) {
        if (option === 'sell') setValue('pricing.sell', undefined);
        if (option === 'rent') setValue('pricing.rent', undefined);
        if (option === 'service') setValue('pricing.services', undefined);
        return prev.filter(o => o !== option);
      } else {
        return [...prev, option];
      }
    });
  };


  useEffect(() => {
    if (!singleProduct) {
      setSelectedOptions([]);
      setIsAvailableForRequestQuotation(false);
      setValue('pricing.isAvailableForRequestQuotation', false);
      return;
    }

    const initialOptions = [];
    if (singleProduct?.productFor?.sell) initialOptions.push('sell');
    if (singleProduct?.productFor?.rent) initialOptions.push('rent');
    if (singleProduct?.productFor?.service) initialOptions.push('service');

    // Check for request quotation in multiple possible locations
    // Only consider it true if one of these values is explicitly true (not just truthy)
    const hasRequestQuotation = 
      singleProduct?.productFor?.request_quotation === true || 
      singleProduct?.productFor?.isAvailableForRequestQuotation === true || 
      singleProduct?.isAvailableForRequestQuotation === true;

    if (hasRequestQuotation) {
      initialOptions.push('request_quotation');
      setIsAvailableForRequestQuotation(true);
      setValue('pricing.isAvailableForRequestQuotation', true);
    } else {
      setIsAvailableForRequestQuotation(false);
      setValue('pricing.isAvailableForRequestQuotation', false);
    }

    setSelectedOptions(initialOptions);
  }, [singleProduct, setValue]);

  // Configuration for the option buttons
  const optionsConfig = [
    { label: 'Sell', value: 'sell', color: "green", hasData: !!singleProduct?.productFor?.sell },
    { label: 'Rent', value: 'rent', color: "orange", hasData: !!singleProduct?.productFor?.rent },
    { label: 'Service', value: 'service', color: "purple", hasData: !!singleProduct?.productFor?.service },
    { 
      label: 'Request Quotation', 
      value: 'request_quotation', 
      color: "blue", 
      hasData: singleProduct?.productFor?.request_quotation === true || 
               singleProduct?.productFor?.isAvailableForRequestQuotation === true || 
               singleProduct?.isAvailableForRequestQuotation === true
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6 bg-secondary bg-opacity-10 rounded-lg px-5">
        <h2 className="md:text-lg text-base font-semibold text-secondary rounded-lg p-3 dark:text-gray-100">Pricing Options</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {optionsConfig.map((option) => {
          const isRequestQuotation = option.value === 'request_quotation';
          const isDisabled = 
            isRequestQuotation ? false : // Never disable Request Quotation
            (!isEditMode && isAvailableForRequestQuotation); // Only disable other options in create mode when Request Quotation is enabled
          
          const isSelected = selectedOptions.includes(option.value);

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => !isDisabled && handleOptionChange(option.value)}
              disabled={isDisabled}
              className={`flex items-center justify-center gap-3 p-3 rounded-lg border transition-colors ${
                isSelected
                  ? `bg-${option.color}-100 border-${option.color}-500 text-${option.color}-700 dark:bg-${option.color}-900 dark:border-${option.color}-500 dark:text-${option.color}-200`
                  : `bg-white border-${option.color}-300 text-${option.color}-600 hover:border-${option.color}-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 hover:dark:border-secondary`
              } ${
                isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <span className={`flex items-center justify-center w-5 h-5 rounded-full border ${
                isSelected 
                  ? `bg-${option.color}-500 border-${option.color}-500`
                  : `bg-white border-${option.color}-300 dark:bg-gray-800 dark:border-gray-500`
              }`}>
                {isSelected && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <span className="text-sm font-medium">{option.label}</span>

            </button>
          );
        })}
      </div>

      <div className="space-y-6">
        {selectedOptions.includes('sell') && !isAvailableForRequestQuotation && (
          <SellPricingForm control={control} watch={watch} setValue={setValue} singleProduct={singleProduct?.productFor?.sell} />
        )}

        {selectedOptions.includes('rent') && !isAvailableForRequestQuotation && (
          <RentPricingForm control={control} watch={watch} setValue={setValue} singleProduct={singleProduct?.productFor?.rent} />
        )}

        {selectedOptions.includes('service') && !isAvailableForRequestQuotation && (
          <ServiceOptions control={control} watch={watch} setValue={setValue} singleProduct={singleProduct?.productFor?.service} />
        )}

        {isAvailableForRequestQuotation && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <p className="text-blue-700 dark:text-blue-200">Quotation request option is enabled for this product.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingOptions;
