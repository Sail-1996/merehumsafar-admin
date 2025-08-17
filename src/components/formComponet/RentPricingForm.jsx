import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useWatch } from 'react-hook-form';

const RentPricingForm = ({ control, setValue, singleProduct }) => {
    const [discountType, setDiscountType] = useState('PERCENTAGE');
    const rentData = useWatch({
        control,
        name: 'pricing.rent'
    }) || {};
    const [isVatIncluded, setIsVatIncluded] = useState(false);
    const [displayDiscountPrice, setDisplayDiscountPrice] = useState('');


    const finalPrice = useMemo(() => {
        const price = parseFloat(rentData.monthlyPrice) || 0;
        const discount = parseFloat(rentData.discountValue) || 0;
        const vat = parseFloat(singleProduct?.vat) || 0;

        let discountedPrice = discountType === 'PERCENTAGE'
            ? price * (1 - discount / 100)
            : price - discount;

        if (isVatIncluded && vat > 0) {
            return discountedPrice * (1 + vat / 100);
        }

        return discountedPrice;
    }, [rentData.monthlyPrice, rentData.discountValue, rentData.vat, discountType, isVatIncluded]);


    useEffect(() => {
        const productRentData = singleProduct || {};

        if (singleProduct) {
            const initialVatIncluded = productRentData.vat > 0;
            setIsVatIncluded(initialVatIncluded);

            const initialDiscountType = productRentData?.discountUnit === 'AED' ? 'AED' : 'PERCENTAGE';
            setDiscountType(initialDiscountType);

            
            setValue('pricing.rent.monthlyPrice', productRentData.monthlyPrice || '');
            
            setDisplayDiscountPrice(productRentData.discountPrice || '');

            setValue('pricing.rent.discountedPrice', productRentData?.discountedPrice || '');
            setValue('pricing.rent.discountValue', productRentData?.discountValue || '');
            setValue('pricing.rent.discountUnit', initialDiscountType);
            setValue('pricing.rent.benefits', productRentData.benefits?.length > 0 ? productRentData.benefits : ['']);
            setValue('pricing.rent.isVatIncluded', initialVatIncluded);
        } else {

            setDisplayDiscountPrice('');
            setIsVatIncluded(false);
            setValue('pricing.rent', {
                monthlyPrice: '',
                discountedPrice: '',
                discountValue: '',
                discountUnit: discountType,
                benefits: [''],
                vat: 0,
                isVatIncluded: false
            });
        }
    }, [singleProduct, setValue]);

    const handleVatChange = (includeVat) => {
        console.log(includeVat,'includeVat')
        setIsVatIncluded(includeVat);
        setValue('pricing.rent.isVatIncluded', includeVat);
    };

    const handleAddBenefit = () => {
        const currentBenefits = Array.isArray(rentData?.benefits)
            ? [...rentData.benefits.filter(b => b !== null)]
            : [''];
        setValue('pricing.rent.benefits', [...currentBenefits, '']);
    };

    const handleDiscountTypeChange = (type) => {
        setDiscountType(type);
        setValue('pricing.rent.discountUnit', type);
        if (type !== discountType) {
            setValue('pricing.rent.discountValue', '');
        }
    };

    const handleRemoveBenefit = (index) => {
        if (!Array.isArray(rentData?.benefits)) return;

        const updatedBenefits = rentData.benefits
            .filter((_, i) => i !== index)
            .filter(b => b !== null);

        setValue('pricing.rent.benefits', updatedBenefits.length > 0 ? updatedBenefits : ['']);
    };

    const handleBenefitChange = (index, value) => {
        if (!Array.isArray(rentData?.benefits)) return;

        const updatedBenefits = [...rentData.benefits];
        updatedBenefits[index] = value;
        setValue('pricing.rent.benefits', updatedBenefits);
    };

    return (
        <div className="p-4 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-lg font-medium mb-4 dark:text-white text-orange-700 bg-orange-50/75 p-3 flex items-center border-gray-300 rounded-lg">
                Rent Pricing
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-6">
                {/* Monthly Price */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                        Monthly Price (AED)
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-800 dark:text-gray-100">
                            <span className="sm:text-sm">AED</span>
                        </div>
                        <Controller
                            name="pricing.rent.monthlyPrice"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={field.value || ''}
                                    className="block w-full pl-12 pr-12 py-2 border-b border-gray-200 bg-white dark:border-gray-500 dark:bg-gray-800 focus:outline-none focus:ring-0 focus:border-blue-500"
                                    placeholder="0.00"
                                    onChange={(e) => {
                                        const value = e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0);
                                        field.onChange(value);
                                    }}
                                />
                            )}
                        />
                    </div>
                </div>



                {/* Discount Section */}
                <div className="space-y-1">
                    <div className="flex space-x-4 mb-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Discount
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={discountType === 'PERCENTAGE'}
                                onChange={() => handleDiscountTypeChange('PERCENTAGE')}
                                className="h-4 w-4 text-secondary focus:ring-blue-500 border-gray-300 dark:border-gray-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">%</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={discountType === 'AED'}
                                onChange={() => handleDiscountTypeChange('AED')}
                                className="h-4 w-4 text-secondary focus:ring-blue-500 border-gray-300 dark:border-gray-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">AED</span>
                        </label>
                    </div>
                    <Controller
                        name="pricing.rent.discountValue"
                        control={control}
                        render={({ field }) => (
                            <input
                                {...field}
                                type="number"
                                min="0"
                                value={field.value || ''}
                                className="block w-full px-3 py-2 border-b shadow-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-blue-500"
                                onChange={(e) => {
                                    const value = e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0);
                                    field.onChange(value);
                                }}
                            />
                        )}
                    />
                </div>


                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                        Final Price
                    </label>
                    <div className='flex space-x-2 items-center border-b p-2 gap-5'>
                        <p>AED</p>
                        <input
                            type="text"
                            readOnly
                            value={finalPrice.toFixed(2) || displayDiscountPrice}
                            className="block w-full font-semibold  dark:border-gray-500 dark:bg-gray-700 focus:outline-none focus:ring-0 focus:border-blue-500"
                        />
                    </div>
                </div>


                {/* Discounted Price & VAT */}
                <div className="space-y-1">
                    <div className='flex justify-between items-center bg-gray-50 h-full p-5 rounded-lg'>

                        <div>


                            <div className="flex space-x-4 items-center">
                                <label className="block text-lg font-medium text-secondary dark:text-gray-300">
                                VAT ({isVatIncluded ? '5%' : '0%'})
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        checked={isVatIncluded}
                                        onChange={() => handleVatChange(true)}
                                        className="h-4 w-4 text-secondary focus:ring-blue-500 border-gray-300 dark:border-gray-500"
                                    />
                                    <span className="ml-2 text-sm font-semibold uppercase text-green-700 dark:text-gray-300">
                                        Include
                                    </span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        checked={!isVatIncluded}
                                        onChange={() => handleVatChange(false)}
                                        className="h-4 w-4 text-secondary focus:ring-blue-500 border-gray-300 dark:border-gray-500"
                                    />
                                    <span className="ml-2 text-sm font-semibold uppercase text-red-700 dark:text-gray-300">
                                        Exclude
                                    </span>
                                </label>
                            </div>

                        </div>

                    </div>
                    {/* <Controller
                        name="pricing.rent.discountedPrice"
                        control={control}
                        render={({ field }) => (
                            <input
                                {...field}
                                type="text"
                                readOnly
                                value={field.value || ''}
                                className="block w-full px-3 py-2 border-b shadow-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-blue-500 font-semibold"
                            />
                        )}
                    /> */}
                </div>

            </div>

            {/* Benefits Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h4 className="text-md font-medium text-orange-700 dark:text-gray-300">
                        Rental Benefits
                    </h4>
                    <button
                        type="button"
                        onClick={handleAddBenefit}
                        className="inline-flex items-center px-3 py-1 rounded-md transition duration-200 bg-secondary text-white"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Benefit
                    </button>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {Array.isArray(rentData?.benefits) && rentData.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={benefit || ''}
                                onChange={(e) => handleBenefitChange(index, e.target.value)}
                                placeholder={`Benefit ${index + 1}`}
                                className="flex-1 px-3 py-2 border-b border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-0 focus:border-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveBenefit(index)}
                                className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                                title="Remove benefit"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RentPricingForm;