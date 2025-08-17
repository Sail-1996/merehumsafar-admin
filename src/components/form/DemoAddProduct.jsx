

import React, { useEffect, useRef, useState } from 'react';
import useCategoryStore from '../../Context/CategoryContext';
import useImageUploadStore from '../../Context/ImageUploadContext';
import useBrandStore from '../../Context/BrandContext';
import SpecificationFields from '../formComponet/SpecificationFields';
import useProductStore from '../../Context/ProductContext';
import { RxCross2, RxCrossCircled } from 'react-icons/rx';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { FiSend, FiTrash2, FiUpload, FiUploadCloud, FiX } from 'react-icons/fi';
import { FaSpinner } from "react-icons/fa";
import { Toast } from 'primereact/toast';
import { FloatLabel } from 'primereact/floatlabel';
import { InputTextarea } from 'primereact/inputtextarea';
import "../../index.css"
import { useParams } from 'react-router-dom';
import DemoProductSkeleton from '../widget/DemoProductSkeleton';
import axiosInstance from '../../utils/axiosInstance';




const DemoProduct = () => {
    const { createProduct, getProductsById, singleProduct, updateProduct, deleteProductImage } = useProductStore()
    const { id } = useParams();
    const [loading, setLoading] = useState(false)
    const [pageLoading, setPageLoading] = useState(false)
    const toast = useRef(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (id) {
                setPageLoading(true);
                try {
                    const res = await getProductsById(id);
                    if (res?.name) {
                  
                    }
                } catch (error) {
                    console.error("Failed to fetch product:", error);
                } finally {
                    setPageLoading(false);
                }
            }
        };
        fetchProduct();
    }, [id]);
    




    const [productData, setProductData] = useState({
        basicInfo: {
            name: singleProduct?.name || '',
            // description: singleProduct?.description || '',
            shortDescription: singleProduct?.description || '',
            longDescription: singleProduct?.longDescription || '',
            manufacturer: singleProduct?.manufacturer || '',
            supplierName: singleProduct?.supplierName || '',
            supplierCode: singleProduct?.supplierCode || '',
            modelNo: singleProduct?.modelNo || '',
        },
        category: {
            main: singleProduct?.category?.name || null,
            sub: singleProduct?.category?.sub || null
        },
        brand: singleProduct?.brand || null,
        pricing: {
            sell: singleProduct?.pricing?.sell || null,
            rent: singleProduct?.pricing?.rent || null,
            services: {
                ots: singleProduct?.pricing?.services?.ots || null,
                mmc: singleProduct?.pricing?.services?.mmc || null,
                amcBasic: singleProduct?.pricing?.services?.amcBasic || null,
                amcGold: singleProduct?.pricing?.services?.amcGold || null
            }
        },
        inventory: {
            sku: singleProduct?.inventory?.sku || '',
            quantity: singleProduct?.inventory?.quantity || 0,
            stockStatus: singleProduct?.inventory?.stockStatus || 'IN_STOCK'
        },
        keyFeatures: singleProduct?.keyFeatures || [],
        specifications: singleProduct?.specifications || [],
        images: singleProduct?.imageUrls || [],
        tagandkeywords : singleProduct?.tagNKeywords || []
    });

    const handleInputChange = (section, field, value) => {

        setProductData(prev => {
            if (field === 'images') {
                return {
                    ...prev,
                    [section]: value
                };
            }


            if (field === null) {
                return {
                    ...prev,
                    [section]: value
                };
            }


            return {
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            };
        });
    };

    const showToast = (severity, summary, detail) => {
        toast.current.show({
            severity: severity,
            summary: summary,
            detail: detail,
            life: 3000
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = preparePayload(productData);
        console.log(payload, 'payload checkinh')

        if (!payload?.categoryId) {
            showToast('warn', 'Warning', 'Please select a Category.');
            return;
        }

        if (!payload?.brandId) {
            showToast('warn', 'Warning', 'Please select a Brand.');
            return;
        }

        try {
            setLoading(true);
            let response;
            if (id) {
                response = await updateProduct(id, payload);
                showToast('success', 'Success', 'Product updated successfully!');
                setLoading(false);
            } else {
                response = await createProduct(payload);
                showToast('success', 'Success', 'Product created successfully!');
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            showToast('error', 'Error', 'Failed to create product. Please try again.');
            console.error('Error creating product:', error);
        }
    };




    return (
        <div className="mx-auto px-0 py-0">
            <Toast ref={toast} position="top-right" />

            <div className="bg-white dark:bg-gray-800 p-2 shadow-md rounded-md">
                <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-6 border-b dark:border-gray-600 pb-2">
                   {id ? 'Edit Product' : 'Add New Product'} 
                </h1>
                {pageLoading ? <DemoProductSkeleton/> :
                    <form onSubmit={handleSubmit} className="space-y-8 text-gray-700 dark:text-gray-300">
                        <ProductBasicInfo data={productData.basicInfo} onChange={handleInputChange} />
                        <CategoryBrandSelection
                            category={productData.category}
                            brand={productData.brand}
                            singleProduct={singleProduct}
                            onChange={handleInputChange}
                        />
                        <PricingOptions
                            singleProduct={singleProduct}
                            pricing={productData.pricing}
                            onChange={handleInputChange}
                        />
                        <SpecificationFields
                        singleProduct
                            specs={productData.specifications}
                            onChange={handleInputChange}
                        />
                        <InventorySection
                            inventory={productData.inventory}
                            onChange={handleInputChange}
                        />
                        <KeyFeaturesFields
                            features={productData.keyFeatures}
                            onChange={handleInputChange}
                        />
                        <TagsAndKeywords
                            features={productData.tagandkeywords}
                            onChange={handleInputChange}
                        />
                        <ImageUploader
                            singleProduct={singleProduct}
                            images={productData.images}
                            onChange={(images) => handleInputChange('images', 'images', images)}
                        />

                        <div className="flex justify-end pt-4 border-t dark:border-gray-600">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-secondary text-white rounded-md  transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                            >
                                {loading ? <FaSpinner className='animate-spin' /> : 'Add New Product '}
                            </button>
                        </div>
                    </form>
                }

            </div>
        </div>

    );
};


const preparePayload = (productData) => {
    console.log(productData, 'productData')

    // Safely handle images array
    const imageUrls = Array.isArray(productData.images) 
        ? productData.images.map(img => img?.url?.fileUrl || '').filter(url => url)
        : [];

    // Safely handle specifications
    const specifications = Array.isArray(productData.specifications)
        ? productData.specifications
              .filter(spec => spec?.name && spec?.value)
              .map(spec => ({
                  name: spec.name,
                  value: spec.value
              }))
        : [];

    // Helper function to safely handle service benefits
    const getServicePayload = (service) => {
        if (!service) return { price: 0, benefits: [] };
        
        return {
            price: Number(service.price) || 0,
            benefits: Array.isArray(service.benefits) 
                ? service.benefits.filter(benefit => benefit && benefit.trim() !== '')
                : (service.benefits ? [service.benefits].filter(b => b && b.trim() !== '') : [])
        };
    };

    const payload = {
        name: productData.basicInfo.name || '',
        description: productData.basicInfo.shortDescription || '',
        longDescription: productData.basicInfo.longDescription || '',
        manufacturer: productData.basicInfo.manufacturer || '',
        brandId: +(productData?.brand?.brandId || 0),
        imageUrls,
        specifications,
        modelNo: productData.basicInfo.modelNo || '',
        supplierName: productData.basicInfo.supplierName || '',
        supplierCode: productData.basicInfo.supplierCode || '',
        productFor: {
            sell: {
                actualPrice: productData.pricing?.sell?.price || 0,
                discountPrice: productData.pricing?.sell?.discountedPrice || 0,
                benefits: Array.isArray(productData.pricing?.sell?.benefits)
                    ? productData.pricing.sell.benefits.filter(b => b)
                    : [],
                isWarrantyAvailable: productData.pricing?.sell?.isWarrantyAvailable || false,
                warrantPeriod: +(productData.pricing?.sell?.warrantPeriod || 0)
            },
            rent: {
                monthlyPrice: productData.pricing?.rent?.monthlyPrice || 0,
                discountPrice: productData.pricing?.rent?.discountedPrice || 0,
                benefits: Array.isArray(productData.pricing?.rent?.benefits)
                    ? productData.pricing.rent.benefits.filter(b => b)
                    : [],
                isWarrantyAvailable: productData.pricing?.rent?.isWarrantyAvailable || false,
                warrantPeriod: +(productData.pricing?.rent?.warrantPeriod || 0)
            },
            // requestQuotation: {
            //     actualPrice: productData.pricing?.requestQuotation?.actualPrice || 0,
            //     discountPrice: productData.pricing?.requestQuotation?.discountedPrice || 0
            // },
            service: {
                ots: getServicePayload(productData.pricing?.services?.ots),
                mmc: getServicePayload(productData.pricing?.services?.mmc),
                amcBasic: getServicePayload(productData.pricing?.services?.amcBasic),
                amcGold: getServicePayload(productData.pricing?.services?.amcGold)
            }
        },
        categoryId: +(productData.category?.main?.categoryId || 0),
        subCategoryId: +(productData?.category?.sub?.categoryId || null),
        inventory: {
            quantity: +(productData.inventory?.quantity || 0),
            sku: productData.inventory?.sku || '',
            stockStatus: productData.inventory?.stockStatus || 'IN_STOCK'
        },
        keyFeatures: Array.isArray(productData.keyFeatures)
            ? productData.keyFeatures.filter(f => f)
            : [],
        tagNKeywords: Array.isArray(productData?.tagandkeywords)
            ? productData.tagandkeywords.filter(t => t)
            : []
    };
    console.log(payload, 'payload')
    
    return payload;
};





export default DemoProduct;

const ProductBasicInfo = ({ data, onChange }) => {
    return (
        <div className="bg-white dark:bg-gray-900 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
                <h2 className="md:text-xl text-base font-semibold text-gray-800 dark:text-gray-100">Product Information</h2>
                <span className="text-xs bg-blue-50 dark:bg-blue-900 text-secondary dark:text-blue-300 px-1 py-1 rounded">Required fields*</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="space-y-2">
                    <FloatLabel className='active:text-blue-500 '>
                        {/* <div className="flex items-center justify-between"> */}
                        {/* <span className="text-xs text-red-500">*required</span> */}
                        {/* </div> */}
                        <InputText
                            value={data.name}
                            id='name'
                            onChange={(e) => onChange('basicInfo', 'name', e.target.value)}
                            required
                            // placeholder="e.g. Premium Wireless Headphones"
                            className="w-full px-3 peer py-2 border-b border-gray-300  dark:text-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-0 focus:border-blue-500 "
                        />
                        <label htmlFor='name' className="block text-sm peer-focus:text-blue-500 font-medium text-gray-700 dark:text-gray-300 focus:text-blue-500">Product Name</label>
                    </FloatLabel>
                    {!data.name && (
                        <p className="text-xs text-red-500 mt-1">Product name is required</p>
                    )}
                </div>
                <div className="space-y-2">
                    {/* <div className="flex items-center justify-between">
                    </div> */}
                    <FloatLabel>
                        <InputText
                            value={data.modelNo}
                            onChange={(e) => onChange('basicInfo', 'modelNo', e.target.value)}
                            required
                            // placeholder="Enter Model No."
                            className="w-full px-3 peer py-2 border-b dark:text-gray-200 dark:bg-gray-800 border-gray-300  focus:outline-none focus:ring-0 focus:border-blue-500"
                        />
                        <label className="block peer-focus:text-blue-500  text-sm font-medium text-gray-700 dark:text-gray-300">Product Model No</label>
                    </FloatLabel>

                </div>

                <div className="space-y-2">
                    <div className="relative">
                        <FloatLabel>
                            <InputText
                                value={data.manufacturer}
                                onChange={(e) => onChange('basicInfo', 'manufacturer', e.target.value)}
                                // placeholder="e.g. Sony, Apple, Samsung"
                                className="w-full peer px-3 py-2 border-b border-gray-300 dark:text-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-0 focus:border-blue-500"
                            />
                            <label className="block peer-focus:text-blue-500  text-sm font-medium text-gray-700 dark:text-gray-300">Manufacturer</label>
                        </FloatLabel>
                        {data.manufacturer && (
                            <button
                                onClick={() => onChange('basicInfo', 'manufacturer', '')}
                                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                aria-label="Clear manufacturer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="relative">
                        <FloatLabel>
                            <InputText
                                value={data.supplierName}
                                onChange={(e) => onChange('basicInfo', 'supplierName', e.target.value)}
                                // placeholder="Enter Supplier Name"
                                className="w-full px-3 peer py-2 border-b border-gray-300 dark:text-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-0 focus:border-blue-500"
                            />
                            <label className="block peer-focus:text-blue-500  text-sm font-medium text-gray-700 dark:text-gray-300">Supplier Name</label>
                        </FloatLabel>
                        {data.supplierName && (
                            <button
                                onClick={() => onChange('basicInfo', 'supplierName', '')}
                                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                aria-label="Clear manufacturer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="relative">
                        <FloatLabel>
                            <InputText
                                value={data.supplierCode}
                                onChange={(e) => onChange('basicInfo', 'supplierCode', e.target.value)}
                                // placeholder="Enter Supplier Code"
                                className="w-full px-3 peer py-2 border-b border-gray-300 dark:text-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-0 focus:border-blue-500"
                            />
                            <label className="block peer-focus:text-blue-500  text-sm font-medium text-gray-700 dark:text-gray-300">Supplier Code</label>
                        </FloatLabel>
                        {data.supplierCode && (
                            <button
                                onClick={() => onChange('basicInfo', 'supplierCode', '')}
                                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                aria-label="Clear manufacturer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <div className="relative">
                        <FloatLabel>
                            <InputText
                                value={data.shortDescription}
                                onChange={(e) => onChange('basicInfo', 'shortDescription', e.target.value)}
                                // placeholder="Brief product description (max 160 characters)"
                                maxLength={160}
                                className="w-full px-3 py-2 peer border-b border-gray-300 dark:text-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-0 focus:border-blue-500"
                            />
                            <label className="block  peer-focus:text-blue-500 text-sm font-medium text-gray-700 dark:text-gray-300">Short Description</label>
                        </FloatLabel>
                        <span className="absolute right-2 bottom-2 text-xs text-gray-400 dark:text-gray-500">
                            {data.shortDescription?.length || 0}/160
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This will appear in product cards and search results</p>
                </div>

                {/* Long Description */}
                <div className="space-y-2 md:col-span-2">
                    <FloatLabel>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Long Description</label>
                        <InputTextarea
                            value={data.longDescription}
                            onChange={(e) => onChange('basicInfo', 'longDescription', e.target.value)}
                            // placeholder="Detailed product description with features and benefits"
                            rows={3}
                            className="w-full peer px-3 py-2 border-b border-gray-300 dark:text-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-0 focus:border-blue-500"
                        />
                    </FloatLabel>

                </div>
            </div>
        </div>
    );
};






const CategoryBrandSelection = ({ category, brand, onChange, singleProduct }) => {
    const {
        flatCategoryList,
        subCategories,
        getAllCategories,
        setSelectedCategory,
    } = useCategoryStore();

    const { brands, getAllBrands } = useBrandStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [brandSearchTerm, setBrandSearchTerm] = useState('');
    const [isTouched, setIsTouched] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        getAllCategories();
        getAllBrands();
    }, []);

    useEffect(() => {
        if (singleProduct && flatCategoryList.length > 0 && brands.length > 0 && !isInitialized) {
            const matchedCategory = flatCategoryList.find(
                cat => cat.categoryId === singleProduct.category?.categoryId
            ) || null;

            const matchedBrand = brands.find(
                b => b.brandId === singleProduct.brand?.brandId
            ) || null;

            if (matchedCategory) {
                onChange('category', 'main', matchedCategory);
                setSelectedCategory(matchedCategory.categoryId);
                setIsTouched(true); // Mark as touched since we're setting a value
            }

            if (matchedBrand) {
                onChange('brand', null, matchedBrand);
                setSelectedBrand(matchedBrand);
                setIsTouched(true);
            }

            setIsInitialized(true);
        }
    }, [singleProduct, flatCategoryList, brands, isInitialized]);

    const filteredCategories = flatCategoryList.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredBrands = brands.filter(b =>
        b.name.toLowerCase().includes(brandSearchTerm.toLowerCase())
    );

    const selectedSubCategoryOption = subCategories.find(sub =>
        sub.categoryId === (category.sub?.categoryId || category.sub)
    );

    const selectedCategoryOption = category.main
        ? filteredCategories.find(cat =>
            cat.categoryId === (category.main?.categoryId || category.main)
        ) || null
        : null;

    const handleCategoryChange = (e) => {
        onChange('category', 'main', e.value);
        setSelectedCategory(e.value?.categoryId);
        setIsTouched(true);
    };

    const handleBrandChange = (e) => {
        onChange('brand', null, e.value);
        setSelectedBrand(e.value);
        setIsTouched(true);
    };

    return (
        <div className="bg-white dark:bg-gray-900 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
                <h2 className="md:text-xl text-base font-semibold text-gray-800 dark:text-gray-100">Category & Brand</h2>
                <span className="text-xs bg-blue-50 text-secondary dark:bg-blue-900 dark:text-blue-300 px-1 py-1 rounded">Required fields*</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label htmlFor="mainCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Main Category</label>
                        <span className="text-xs text-red-500">*required</span>
                    </div>

                    <Dropdown
                        id="mainCategory"
                        value={selectedCategoryOption}
                        onChange={handleCategoryChange}
                        options={filteredCategories}
                        optionLabel="name"
                        placeholder="Select Category"
                        filter
                        filterBy="name"
                        className={classNames('w-full border dark:border-gray-600 focus:outline-none focus:ring-0 bg-white dark:bg-gray-900')}
                        filterPlaceholder="Search categories..."
                        emptyFilterMessage="No categories found"
                        valueTemplate={(option) => {
                            return option ? (
                                <div className="flex items-center text-gray-800 dark:text-gray-100">
                                    <span>{option.name}</span>
                                </div>
                            ) : (
                                <span className="text-gray-500 dark:text-gray-400">Select Category</span>
                            );
                        }}
                        itemTemplate={(option) => {
                            return (
                                <div className="flex items-center text-gray-800 dark:text-gray-100">
                                    <span>{option.name}</span>
                                </div>
                            );
                        }}
                    />

                    {/* Only show error if touched and no category selected */}
                    {isTouched && !category.main && (
                        <small className="p-error">Please select a main category</small>
                    )}
                </div>

                {category.main && (
                    <div className="space-y-2">
                        <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sub Category</label>
                        <Dropdown
                            id="subCategory"
                            value={selectedSubCategoryOption}
                            onChange={(e) => onChange('category', 'sub', e.value || null)}
                            options={subCategories}
                            optionLabel="name"
                            placeholder="Select Sub Category"
                            className="w-full border dark:border-gray-600 p-dropdown:focus-none bg-white dark:bg-gray-900"
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label htmlFor="brand" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Brand</label>
                        <span className="text-xs text-red-500">*required</span>
                    </div>

                    <Dropdown
                        id="brand"
                        value={selectedBrand}
                        onChange={handleBrandChange}
                        options={filteredBrands}
                        optionLabel="name"
                        placeholder="Select Brand"
                        filter
                        filterBy="name"
                        className={classNames('w-full border bg-white dark:bg-gray-900 dark:border-gray-600 outline-none p-dropdown:focus-none')}
                        filterPlaceholder="Search brands..."
                        emptyFilterMessage="No brands found"
                    />

                    {/* Only show error if touched and no brand selected */}
                    {isTouched && !brand && (
                        <small className="p-error">Please select a brand</small>
                    )}
                </div>
            </div>
        </div>
    );
};




const PricingOptions = ({ pricing, onChange, singleProduct }) => {
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleOptionChange = (option) => {
        setSelectedOptions(prev =>
            prev.includes(option)
                ? prev.filter(o => o !== option)
                : [...prev, option]
        );
    };

    return (
        <div className="bg-white dark:bg-gray-900 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="md:text-xl text-base font-semibold text-gray-700 dark:text-gray-200 mb-4">Pricing Options</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                {[
                    { label: 'Sell', value: 'sell', color: "green-500", hasData: !!singleProduct?.productFor?.sell },
                    { label: 'Rent', value: 'rent', color: "orange-500", hasData: !!singleProduct?.productFor?.rent },
                    { label: 'Service', value: 'service', color: "purple-500", hasData: !!singleProduct?.productFor?.service },
                ].map((option) => (
                    <label
                        key={option.value}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                    ${selectedOptions.includes(option.value) || option.hasData
                                ? `border-${option.color} text-${option.color}`
                                : `bg-white border-${option.color} text-${option.color} hover:border-${option.color} dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 hover:dark:border-blue-400`}
                `}
                    >
                        <input
                            type="checkbox"
                            checked={selectedOptions.includes(option.value) || option.hasData}
                            onChange={() => handleOptionChange(option.value)}
                            className="form-checkbox h-5 w-5 text-secondary dark:text-blue-500 focus:ring-0 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                            disabled={option.hasData}
                        />
                        <span className="text-sm font-medium">{option.label}</span> 
                        {option.hasData && (
                            <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">(configured)</span>
                        )}
                    </label>
                ))}
            </div>

            <div className="space-y-6">
                {(selectedOptions.includes('sell') || !!singleProduct?.productFor?.sell) && (
                    <SellPricingForm
                        data={singleProduct?.productFor?.sell || pricing.sell}
                        onChange={(data) => onChange('pricing', 'sell', data)}
                    />
                )}

                {(selectedOptions.includes('rent') || !!singleProduct?.productFor?.rent) && (
                    <RentPricingForm
                        data={singleProduct?.productFor?.rent || pricing.rent}
                        onChange={(data) => onChange('pricing', 'rent', data)}
                    />
                )}

                {(selectedOptions.includes('service') || !!singleProduct?.productFor?.service) && (
                    <ServiceOptions
                        services={singleProduct?.productFor?.service || pricing.services}
                        onChange={(data) => onChange('pricing', 'services', data)}
                    />
                )}

                
            </div>
        </div>
    );
};


const SellPricingForm = ({ data, onChange, }) => {
    const [formData, setFormData] = useState(data || {
        price: '' || data?.actualPrice,
        discount: '',
        discountedPrice: '' || data?.discountPrice,
        benefits: [''],
        vatIncluded: false,
        isWarrantyAvailable: false,
        warrantPeriod: 1,
    });
    const [discountType, setDiscountType] = useState('percentage');

    useEffect(() => {
        calculateDiscountedPrice();
    }, [formData.price, formData.discount, discountType, formData.vatIncluded]);

    const calculateDiscountedPrice = () => {
        let basePrice = parseFloat(formData.price) || 0;
        let discountValue = parseFloat(formData.discount) || 0;
        let discountedPrice = basePrice;

        if (basePrice && discountValue) {
            if (discountType === 'percentage') {
                discountedPrice = basePrice - (basePrice * discountValue / 100);
            } else {
                discountedPrice = basePrice - discountValue;
            }
        }

        if (formData.vatIncluded) {
            discountedPrice = discountedPrice * 1.05
        }

        if (discountedPrice !== parseFloat(formData.discountedPrice || 0)) {
            const updated = {
                ...formData,
                discountedPrice: discountedPrice.toFixed(2)
            };
            setFormData(updated);
            onChange(updated);
        }
    };

    const handleChange = (field, value) => {
        const updated = {
            ...formData,
            [field]: value,
            isWarrantyAvailable: field === 'warrantPeriod' ? value !== null : formData.isWarrantyAvailable
        };
        setFormData(updated);
        onChange(updated);
    };

    const handleBenefitChange = (index, value) => {
        const updatedBenefits = [...formData.benefits];
        updatedBenefits[index] = value;
        handleChange('benefits', updatedBenefits);
    };

    const addBenefit = () => {
        handleChange('benefits', [...formData.benefits, '']);
    };

    const removeBenefit = (index) => {
        const updatedBenefits = [...formData.benefits];
        updatedBenefits.splice(index, 1);
        handleChange('benefits', updatedBenefits);
    };

    return (
        <div className="p-4 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">Sell Pricing</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">Price (AED)</label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-800 dark:text-gray-100">
                            <span className="sm:text-sm">AED</span>
                        </div>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => handleChange('price', parseFloat(e.target.value) || '')}
                            min="0"
                            step="0.01"
                            className="block w-full pl-12 pr-12 py-2 border-b  border-gray-200 bg-white dark:border-gray-500 dark:bg-gray-800 focus:outline-none focus:ring-0 focus:border-blue-500"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="flex space-x-4 mb-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Discount</label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={discountType === 'percentage'}
                                onChange={() => setDiscountType('percentage')}
                                className="h-4 w-4 text-secondary focus:ring-blue-500 border-gray-300 dark:border-gray-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">%</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={discountType === 'fixed'}
                                onChange={() => setDiscountType('fixed')}
                                className="h-4 w-4 text-secondary focus:ring-blue-500 border-gray-300 dark:border-gray-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">AED</span>
                        </label>
                    </div>
                    <input
                        type="number"
                        value={formData.discount}
                        onChange={(e) => handleChange('discount', parseFloat(e.target.value) || '')}
                        min="0"
                        step={discountType === 'percentage' ? '1' : '0.01'}
                        className="block w-full px-3 py-2 border-b shadow-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-blue-500"
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Warranty Period (Months)</label>
                    <input
                        type="number"
                        value={formData.warrantPeriod || ''}
                        onChange={(e) => handleChange('warrantPeriod', e.target.value || null)}
                        className="block w-full px-3 py-2 border-b shadow-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-blue-500"
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Discounted Price (AED)</label>
                    <input
                        type="text"
                        value={formData.discountedPrice}
                        readOnly
                        className="block w-full px-3 py-2 border-b shadow-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-blue-500"
                    />
                </div>

            </div>

            <div className="mb-6">
                <div className="flex space-x-4 items-center">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">VAT (5%)</label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            checked={formData.vatIncluded}
                            onChange={() => handleChange('vatIncluded', true)}
                            className="h-4 w-4 text-secondary focus:ring-blue-500 border-gray-300 dark:border-gray-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Included</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            checked={!formData.vatIncluded}
                            onChange={() => handleChange('vatIncluded', false)}
                            className="h-4 w-4 text-secondary focus:ring-blue-500 border-gray-300 dark:border-gray-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Excluded</span>
                    </label>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {formData.vatIncluded
                        ? "5% VAT is included in the displayed prices"
                        : "5% VAT will be added at checkout"}
                </p>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">Purchase Benefits</h4>
                    <button
                        type="button"
                        onClick={addBenefit}
                        className="inline-flex items-center px-3 py-1 rounded-md transition duration-200 bg-secondary  text-white"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add 
                    </button>
                </div>

                {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={benefit}
                            onChange={(e) => handleBenefitChange(index, e.target.value)}
                            className="flex-grow px-3 py-2 border-b  border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-0 focus:border-blue-500"
                        />
                        <button
                            type="button"
                            onClick={() => removeBenefit(index)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-500"
                        >
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>

    );
};






const RentPricingForm = ({ data, onChange }) => {
    console.log(data)
    const [formData, setFormData] = useState(data || {
        monthlyPrice: '',
        discount: '',
        discountedPrice: '',
        benefits: [''],
        vatIncluded: true,
        vatAmount: '',
        isWarrantyAvailable: false,
        warrantPeriod: 1,
    });
    const [discountType, setDiscountType] = useState('percentage');

    const handleChange = (field, value) => {
        const updated = { 
            ...formData, 
            [field]: field === 'benefits' 
                ? (Array.isArray(value) ? value.filter(b => b && b.trim() !== '') : [])
                : value 
        };
        setFormData(updated);
        onChange(updated);
    };

    const handleBenefitChange = (index, value) => {
        const updatedBenefits = [...formData.benefits];
        updatedBenefits[index] = value;
        handleChange('benefits', updatedBenefits);
    };

    const addBenefit = () => handleChange('benefits', [...formData.benefits, '']);
    const removeBenefit = (index) => {
        const updatedBenefits = [...formData.benefits];
        updatedBenefits.splice(index, 1);
        handleChange('benefits', updatedBenefits);
    };

    return (
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">Rent Pricing</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Monthly Price */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Monthly Price (AED)</label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">AED</span>
                        </div>
                        <input
                            type="number"
                            value={formData.monthlyPrice}
                            onChange={(e) => handleChange('monthlyPrice', parseFloat(e.target.value))}
                            min="0"
                            step="0.01"
                            className="block w-full pl-12 pr-12 py-2 border-b border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-0 focus:border-blue-500"
                            placeholder="0.00"
                        />
                    </div>
                </div>


                <div className="space-y-1">
                    <div className="flex space-x-4 mb-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Discount</label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={discountType === 'percentage'}
                                onChange={() => setDiscountType('percentage')}
                                className="h-4 w-4 text-secondary focus:ring-blue-500 border-gray-300"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-200">%</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={discountType === 'fixed'}
                                onChange={() => setDiscountType('fixed')}
                                className="h-4 w-4 text-secondary focus:ring-blue-500 border-gray-300"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-200">AED</span>
                        </label>
                    </div>
                    <input
                        type="number"
                        value={formData.discount}
                        onChange={(e) => handleChange('discount', parseFloat(e.target.value))}
                        min="0"
                        step={discountType === 'percentage' ? '1' : '0.01'}
                        className="block w-full px-3 py-2 border-b border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-0 focus:border-blue-500"
                    />
                </div>
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Warranty Period (Months)</label>
                    <input
                        type="number"
                        value={formData.warrantPeriod || ''}
                        onChange={(e) => handleChange('warrantPeriod', e.target.value || null)}
                        className="block w-full px-3 py-2 border-b shadow-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Discounted Price (AED)</label>
                    <input
                        type="text"
                        value={formData.discountedPrice}
                        readOnly
                        className="block w-full px-3 py-2 border-b border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-0 focus:border-blue-500"
                    />
                </div>

            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="mb-6">
                    <div className="flex space-x-4 items-center">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">VAT (5%)</label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={formData.vatIncluded}
                                onChange={() => handleChange('vatIncluded', true)}
                                className="h-4 w-4 text-secondary focus:ring-blue-500 border-gray-300 dark:border-gray-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Included</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={!formData.vatIncluded}
                                onChange={() => handleChange('vatIncluded', false)}
                                className="h-4 w-4 text-secondary focus:ring-blue-500 border-gray-300 dark:border-gray-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Excluded</span>
                        </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {formData.vatIncluded
                            ? "5% VAT is included in the displayed prices"
                            : "5% VAT will be added at checkout"}
                    </p>
                </div>

            </div>


            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h4 className="text-md font-medium text-gray-700 dark:text-gray-200">Rental Benefits</h4>
                    <button
                        type="button"
                        onClick={addBenefit}
                        className="inline-flex items-center px-3 py-1 bg-secondary text-white rounded-md  transition duration-200"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add 
                    </button>
                </div>

                {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={benefit}
                            onChange={(e) => handleBenefitChange(index, e.target.value)}
                            placeholder={`Benefit ${index + 1}`}
                            className="flex-1 px-3 py-2 border-b border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-0 focus:border-blue-500 shadow-sm"
                        />
                        {formData.benefits.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeBenefit(index)}
                                className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                                title="Remove benefit"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};


const ServiceOptions = ({ services, onChange }) => {
    const [selectedServices, setSelectedServices] = useState({
        ots: !!services?.ots,
        mmc: !!services?.mmc,
        amcBasic: !!services?.amcBasic,
        amcGold: !!services?.amcGold
    });

    const handleServiceToggle = (service) => {
        const serviceKey = service === 'ots' ? 'ots' : service;
        const updated = {
            ...selectedServices,
            [service]: !selectedServices[service]
        };
        setSelectedServices(updated);

        if (!updated[service]) {
            const updatedServices = { ...services };
            delete updatedServices[serviceKey];
            onChange(updatedServices);
        }
    };

    const handleServiceChange = (service, data) => {
        console.log(data,'0099')
        const serviceKey = service === 'ots' ? 'ots' : service;
        onChange({
            ...services,
            [serviceKey]: {
                ...services?.[serviceKey],
                price: data.price,
                benefits: Array.isArray(data.benefits) 
                    ? data.benefits.filter(benefit => benefit && benefit.trim() !== '')
                    : []
            }
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">Service Options</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {[
                    { key: 'ots', label: 'One Time Service', dataKey: 'ots' },
                    { key: 'mmc', label: 'MMC Service', dataKey: 'mmc' },
                    { key: 'amcBasic', label: 'AMC Basic Service', dataKey: 'amcBasic' },
                    { key: 'amcGold', label: 'AMC Gold Service', dataKey: 'amcGold' }
                ].map(({ key, label, dataKey }) => {
                    const hasData = !!services?.[dataKey];
                    const isChecked = selectedServices[key] || hasData;

                    return (
                        <label key={key} className="relative flex items-start cursor-pointer group">
                            <div className="flex items-center h-5">
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => handleServiceToggle(key)}
                                    className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    disabled={hasData}
                                />
                            </div>
                            <div className="ml-3">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                                    {label}
                                </span>
                                {hasData && (
                                    <span className="block text-xs text-gray-500 dark:text-gray-400">(configured)</span>
                                )}
                            </div>
                        </label>
                    );
                })}
            </div>

            <div className="space-y-6">
                {(selectedServices.ots || !!services?.ots) && (
                    <ServiceForm
                        service={services?.ots || { price: '', benefits: [''] }}
                        onChange={(data) => handleServiceChange('ots', data)}
                        label="One Time Service"
                        priceLabel="Price (Per Service)"
                        isPreconfigured={!!services?.ots}
                    />
                )}

                {/* Other service forms remain the same */}
                {(selectedServices.mmc || !!services?.mmc) && (
                    <ServiceForm
                        service={services?.mmc || { price: '', benefits: [''] }}
                        onChange={(data) => handleServiceChange('mmc', data)}
                        label="MMC Service"
                        priceLabel="Price (Per Month)"
                        isPreconfigured={!!services?.mmc}
                    />
                )}

                {(selectedServices.amcBasic || !!services?.amcBasic) && (
                    <ServiceForm
                        service={services?.amcBasic || { price: '', benefits: [''] }}
                        onChange={(data) => handleServiceChange('amcBasic', data)}
                        label="AMC Basic Service"
                        priceLabel="Price (Per Year)"
                        isPreconfigured={!!services?.amcBasic}
                    />
                )}

                {(selectedServices.amcGold || !!services?.amcGold) && (
                    <ServiceForm
                        service={services?.amcGold || { price: '', benefits: [''] }}
                        onChange={(data) => handleServiceChange('amcGold', data)}
                        label="AMC Gold Service"
                        priceLabel="Price (Per Year)"
                        isPreconfigured={!!services?.amcGold}
                    />
                )}
            </div>
        </div>
    );
};




const ServiceForm = ({ service, onChange, label, priceLabel }) => {

    const [formData, setFormData] = useState({
        price: service?.price || '',
        benefits: service?.benefits?.length > 0 ? [...service.benefits] : ['']
    });

    useEffect(() => {
        setFormData({
            price: service?.price || '',
            benefits: service?.benefits?.length > 0 ? [...service.benefits] : ['']
        });
    }, [service]);

    const handleChange = (field, value) => {
        const updated = { ...formData, [field]: value };
        setFormData(updated);
        // Make sure to pass the benefits as an array
        onChange({
            ...updated,
            benefits: Array.isArray(updated.benefits) ? updated.benefits : [updated.benefits].filter(b => b)
        });
    };

    const handleBenefitChange = (index, value) => {
        const updatedBenefits = [...formData.benefits];
        updatedBenefits[index] = value;
        handleChange('benefits', updatedBenefits);
    };

    const addBenefit = () => {
        handleChange('benefits', [...formData.benefits, '']);
    };

    const removeBenefit = (index) => {
        const updatedBenefits = formData.benefits.filter((_, i) => i !== index);
        handleChange('benefits', updatedBenefits);
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 transition-colors duration-200">
            <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-4 text-lg">{label}</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price Input */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {priceLabel}
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">AED</span>
                        </div>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => handleChange('price', e.target.value === '' ? '' : parseFloat(e.target.value))}
                            min="0"
                            step="0.01"
                            className="block w-full pl-12 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Benefits
                    </label>
                    <div className="space-y-3">
                        {formData.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={benefit}
                                    onChange={(e) => handleBenefitChange(index, e.target.value)}
                                    placeholder={`Benefit ${index + 1}`}
                                    className=" block w-full px-4 py-2 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                />
                                {formData.benefits.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeBenefit(index)}
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
                            onClick={addBenefit}
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



const InventorySection = ({ inventory, onChange }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <h2 className="md:text-xl text-base font-semibold text-gray-800 dark:text-gray-100 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                Inventory Management
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* SKU Field */}
                <div className="space-y-2">

                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Product SKU
                    </label>
                    <div className="relative">


                        <input
                            type="text"
                            value={inventory.sku}
                            onChange={(e) => onChange('inventory', 'sku', e.target.value)}
                            placeholder="SKU-12345"
                            className="w-full px-3 py-2 border-b border-gray-300 dark:text-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-0 focus:border-blue-500"
                        />

                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 dark:text-gray-400 text-xs">UNIQUE</span>
                        </div>
                    </div>
                </div>

                {/* Quantity Field */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Available Quantity
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            value={inventory.quantity}
                            onChange={(e) => onChange('inventory', 'quantity', parseInt(e.target.value))}
                            placeholder="0"
                            min="0"
                            className="w-full px-3 py-2 border-b border-gray-300 dark:text-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-0 focus:border-blue-500"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 dark:text-gray-400 text-sm">QTY</span>
                        </div>
                    </div>
                </div>

                {/* Stock Status Field */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Stock Status
                    </label>
                    <div className="relative">
                        <select
                            value={inventory.stockStatus}
                            onChange={(e) => onChange('inventory', 'stockStatus', e.target.value)}
                            className="w-full px-3 py-2 border-b border-gray-300 dark:text-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-0 focus:border-blue-500"
                        >
                            <option value="IN_STOCK" className="text-gray-900 dark:text-gray-100">In Stock</option>
                            <option value="OUT_OF_STOCK" className="text-gray-900 dark:text-gray-100">Out of Stock</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
                <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${inventory.stockStatus === 'IN_STOCK' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                    In Stock
                </div>
                <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${inventory.stockStatus === 'OUT_OF_STOCK' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                    Out of Stock
                </div>

            </div>
        </div>
    );
};





const KeyFeaturesFields = ({ features = [], onChange }) => {
    const [keyFeatures, setKeyFeatures] = useState(features.length > 0 ? features : ['']);

    useEffect(() => {
        if (keyFeatures.length === 0) {
            setKeyFeatures(['']);
        }
    }, []);

    useEffect(() => {
        const nonEmptyFeatures = keyFeatures.filter(feature => feature.trim() !== '');
        onChange('keyFeatures', null, nonEmptyFeatures);
    }, [keyFeatures]);

    const handleFeatureChange = (index, value) => {
        const updatedFeatures = [...keyFeatures];
        updatedFeatures[index] = value;
        setKeyFeatures(updatedFeatures);
    };

    const addFeature = () => {
        setKeyFeatures([...keyFeatures, '']);
    };

    const removeFeature = (index) => {
        if (keyFeatures.length <= 1) {
            // If it's the last feature, just clear it instead of removing
            const updatedFeatures = [...keyFeatures];
            updatedFeatures[index] = '';
            setKeyFeatures(updatedFeatures);
        } else {
            const updatedFeatures = keyFeatures.filter((_, i) => i !== index);
            setKeyFeatures(updatedFeatures);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <div className="flex justify-between items-center mb-4">
                <h2 className="md:text-xl text-base font-semibold text-gray-800 dark:text-gray-100">Key Features</h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {keyFeatures.filter(f => f.trim() !== '').length} added
                </span>
            </div>

            <div className="space-y-4">
                {keyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 group">
                        <div className="flex-1 relative">
                            {/* <div className="absolute top-3 left-4 flex items-center">
                                <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-700 px-1 rounded">
                                    {index + 1}
                                </span>
                            </div> */}
                            <InputTextarea
                                value={feature}
                                onChange={(e) => handleFeatureChange(index, e.target.value)}
                                placeholder={`Describe feature #${index + 1}...`}
                                rows={2}

                                className="w-full px-4 py-3 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500  resize-y"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="mt-3 px-2 py-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Remove feature"
                            aria-label="Remove feature"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-6">
                <button
                    type="button"
                    onClick={addFeature}
                    className="inline-flex items-center px-4 py-2.5 border border-dashed border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg shadow-sm text-secondary dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Feature
                </button>
            </div>
        </div>
    );
};




// const ImageUploader = ({ images, onChange, singleProduct }) => {
//     const { uploadFiles, isLoading, deleteImage } = useImageUploadStore();
//     const {deleteProductImage} = useProductStore()
//     const [selectedFiles, setSelectedFiles] = useState([]);
//     const [isDragging, setIsDragging] = useState(false);

//     const handleChooseFiles = async (e) => {
//         const files = Array.from(e.target.files || e.dataTransfer.files);
//         await validateAndSetFiles(files);
//     };

//     const validateAndSetFiles = async (files) => {
//         const validImages = [];

//         for (const file of files) {
//             const image = new Image();
//             const objectUrl = URL.createObjectURL(file);

//             const isValid = await new Promise((resolve) => {
//                 image.onload = () => {
//                     const is500x500 = image.width === 500 && image.height === 500;
//                     const isUnder500KB = file.size <= 500 * 1024;
//                     URL.revokeObjectURL(objectUrl);
//                     resolve(is500x500 && isUnder500KB);
//                 };
//                 image.onerror = () => resolve(false);
//                 image.src = objectUrl;
//             });

//             if (isValid) {
//                 validImages.push(file);
//             } else {
//                 const sizeKB = (file.size / 1024).toFixed(2);
//                 alert(`"${file.name}" is either not 500x500 pixels or larger than 500KB (${sizeKB}KB). It will be skipped.`);
//             }
//         }

//         setSelectedFiles(prev => [...prev, ...validImages]);
//     };

//     const handleDragOver = (e) => {
//         e.preventDefault();
//         setIsDragging(true);
//     };

//     const handleDragLeave = () => {
//         setIsDragging(false);
//     };

//     const handleDrop = (e) => {
//         e.preventDefault();
//         setIsDragging(false);
//         handleChooseFiles(e);
//     };

//     const resetImage = () => {
//         setSelectedFiles([]);
//     };

//     const removeImage = (name) => {
//         setSelectedFiles(prev => prev.filter((e) => e.name !== name));
//     };

//     const handleDeleteImage = async (index) => {
//         try {
//             const newImages = [...images];
//             newImages.splice(index, 1);
//             onChange(newImages);
//             console.log(newImages,'yhid dhbd new')

//             await deleteProductImage(singleProduct.productId,index.imageId);
//             showToast('success', 'Success', 'Image deleted successfully');

//         } catch (error) {
//             showToast('error', 'Error', 'Failed to delete image');
//             console.error('Error deleting image:', error);
//         }
//     };

//     const handleUpload = async (entityType, entityId) => {
//         if (selectedFiles.length === 0) return;
//         const uploaded = await uploadFiles(selectedFiles);
//         if (uploaded) {
//             onChange([...images, ...uploaded]);
//             setSelectedFiles([]);
//         }
//     };
//     return (
//         <section className="bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-md dark:shadow-gray-700/50 space-y-6 transition-colors duration-300">
//             <h2 className="md:text-xl text-base font-semibold text-gray-800 dark:text-gray-100 border-b pb-2 dark:border-gray-700">
//                 Product Images
//             </h2>

//             <div className="space-y-4">
//                 <div
//                     className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${isDragging
//                         ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
//                         : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
//                         }`}
//                     onDragOver={handleDragOver}
//                     onDragLeave={handleDragLeave}
//                     onDrop={handleDrop}
//                 >
//                     <div className="flex flex-col items-center justify-center space-y-3">
//                         <FiUploadCloud className="h-10 w-10 text-gray-400 dark:text-gray-500" />
//                         <div className="flex flex-col items-center">
//                             <p className="text-sm text-gray-600 dark:text-gray-300">
//                                 <span className="font-medium text-secondary dark:text-blue-400">
//                                     Click to upload
//                                 </span>{' '}
//                                 or drag and drop
//                             </p>
//                             <p className="text-xs text-gray-500 dark:text-gray-400">
//                                 Only 500×500px images (max 500KB)
//                             </p>
//                         </div>
//                         <label
//                             htmlFor="file-upload"
//                             className="cursor-pointer inline-flex items-center px-4 py-2 bg-secondary text-white rounded-md  transition "
//                         >
//                             <FiUpload className="h-4 w-4 mr-2 " />
//                             Select Files
//                         </label>
//                         <input
//                             id="file-upload"
//                             type="file"
//                             multiple
//                             accept="image/*"
//                             onChange={handleChooseFiles}
//                             className="hidden"
//                         />
//                     </div>
//                 </div>

//                 <div className="flex flex-wrap items-center gap-3">
//                     <button
//                         onClick={() => handleUpload('product', singleProduct?.productId)}
//                         disabled={isLoading || selectedFiles.length === 0}
//                         className={`flex items-center px-4 py-2 rounded-md text-white transition ${selectedFiles.length === 0 || isLoading
//                             ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
//                             : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
//                             }`}
//                     >
//                         {isLoading ? (
//                             <>
//                                 <FaSpinner className="h-4 w-4 mr-2 animate-spin" />
//                                 Uploading...
//                             </>
//                         ) : (
//                             <>
//                                 <FiSend className="h-4 w-4 mr-2" />
//                                 Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
//                             </>
//                         )}
//                     </button>

//                     <button
//                         onClick={resetImage}
//                         disabled={isLoading || selectedFiles.length === 0}
//                         className={`flex items-center px-4 py-2 rounded-md transition ${selectedFiles.length === 0 || isLoading
//                             ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
//                             : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
//                             }`}
//                     >
//                         <FiTrash2 className="h-4 w-4 mr-2" />
//                         Clear Selection
//                     </button>
//                 </div>

//                 {/* Selected Files Preview */}
//                 {selectedFiles.length > 0 && (
//                     <div className="space-y-3">
//                         <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                             Selected Images ({selectedFiles.length})
//                         </h3>
//                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//                             {selectedFiles.map((file, index) => (
//                                 <div
//                                     key={index}
//                                     className="relative group aspect-square rounded-lg overflow-hidden shadow-sm border dark:border-gray-700"
//                                 >
//                                     <img
//                                         src={URL.createObjectURL(file)}
//                                         alt={`Preview ${index + 1}`}
//                                         className="w-full h-full object-cover"
//                                     />
//                                     {index === 0 && (
//                                         <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md shadow">
//                                             Main
//                                         </span>
//                                     )}
//                                     <button
//                                         onClick={() => removeImage(file.name)}
//                                         className="absolute top-2 right-2 p-1 bg-white/90 dark:bg-gray-800/90 rounded-full shadow hover:bg-white dark:hover:bg-gray-700 transition opacity-0 group-hover:opacity-100"
//                                     >
//                                         <FiX className="h-4 w-4 text-red-500" />
//                                     </button>
//                                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
//                                         <p className="text-xs text-white truncate">{file.name}</p>
//                                         <p className="text-xs text-white/80">{(file.size / 1024).toFixed(1)}KB</p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}

//                 {/* Display uploaded images */}
//                 {(images?.length > 0 || singleProduct?.images?.length > 0) && (
//                     <div className="space-y-3">
//                         <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                             Uploaded Images ({images?.length || singleProduct?.images?.length})
//                         </h3>
//                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//                             {(images || singleProduct?.images)?.map((img, index) => (
//                                 <div
//                                     key={index}
//                                     className="relative group aspect-square rounded-lg overflow-hidden shadow-sm border dark:border-gray-700"
//                                 >
//                                     <img
//                                         src={img?.url?.fileUrl || img}
//                                         alt={`Product ${index + 1}`}
//                                         className="w-full h-full object-cover"
//                                         onError={(e) => {
//                                             e.target.src = '/path-to-fallback-image.jpg'; // Add fallback image
//                                         }}
//                                     />
//                                     {index === 0 && (
//                                         <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-md shadow">
//                                             Main
//                                         </span>
//                                     )}
//                                     <button
//                                         onClick={() => handleDeleteImage(img)}
//                                         className="absolute top-2 right-2 p-1 bg-white/90 dark:bg-gray-800/90 rounded-full shadow hover:bg-white dark:hover:bg-gray-700 transition opacity-0 group-hover:opacity-100"
//                                     >
//                                         <FiX className="h-4 w-4 text-red-500" />
//                                     </button>
//                                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
//                                         <p className="text-xs text-white truncate">
//                                             {img?.name || `Image ${index + 1}`}
//                                         </p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </section>
//     );
// };

const ImageUploader = ({ images = [], onChange, singleProduct = {} }) => {
    const { uploadFiles, isLoading } = useImageUploadStore();

    const { deleteProductImage } = useProductStore();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    // Memoized handler for file validation
    const validateAndSetFiles = useCallback(async (files) => {
        const validImages = [];

        for (const file of files) {
            try {
                const isValid = await new Promise((resolve) => {
                    const image = new Image();
                    const objectUrl = URL.createObjectURL(file);

                    image.onload = () => {
                        const is500x500 = image.width === 500 && image.height === 500;
                        const isUnder500KB = file.size <= 500 * 1024;
                        URL.revokeObjectURL(objectUrl);
                        resolve(is500x500 && isUnder500KB);
                    };
                    image.onerror = () => {
                        URL.revokeObjectURL(objectUrl);
                        resolve(false);
                    };
                    image.src = objectUrl;
                });

                if (isValid) {
                    validImages.push(file);
                } else {
                    const sizeKB = (file.size / 1024).toFixed(2);
                    alert(`"${file.name}" is either not 500x500 pixels or larger than 500KB (${sizeKB}KB). It will be skipped.`);
                }
            } catch (error) {
                console.error("Error validating image:", error);
            }
        }

        setSelectedFiles(prev => [...prev, ...validImages]);
    }, []);

    const handleChooseFiles = useCallback(async (e) => {
        const files = Array.from(e.target.files || e.dataTransfer.files);
        if (files.length > 0) {
            await validateAndSetFiles(files);
        }
    }, [validateAndSetFiles]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        handleChooseFiles(e);
    }, [handleChooseFiles]);

    const resetImage = useCallback(() => {
        setSelectedFiles([]);
    }, []);

    const removeImage = useCallback((name) => {
        setSelectedFiles(prev => prev.filter((e) => e.name !== name));
    }, []);

    const handleDeleteImage123 = async (img) => {
        try {
            // Create new array without the deleted image
            // const newImages = images.filter(image => image.imageId !== img.imageId);
            // onChange(newImages);

            if (singleProduct?.productId && img.imageId) {
                // await deleteProductImage(singleProduct.productId, img.imageId);
                console.log("hitting")
                await axiosInstance.delete(`/products/${singleProduct.productId}/images/${img.imageId}`);
                console.log("Image deleted successfully");

                showToast('success', 'Success', 'Image deleted successfully');
            }
        } catch (error) {
            showToast('error', 'Error', 'Failed to delete image');
            console.error('Error deleting image:', error);
        }
    };

    const handleUpload = useCallback(async () => {
        if (selectedFiles.length === 0 || !singleProduct?.productId) return;
        
        try {
            const uploaded = await uploadFiles(selectedFiles);
            if (uploaded && uploaded.length > 0) {
                onChange([...(images || []), ...uploaded]);
                setSelectedFiles([]);
            }
        } catch (error) {
            console.error('Upload error:', error);
            showToast('error', 'Error', 'Failed to upload images');
        }
    }, [selectedFiles, images, onChange, uploadFiles, singleProduct?.productId]);

    // Calculate display images (prioritizing props over singleProduct)
    const displayImages = images?.length > 0 ? images : singleProduct?.images || [];

    return (
        <section className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-md dark:shadow-gray-700/50 space-y-6 transition-colors duration-300">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100 border-b pb-2 dark:border-gray-700">
                Product Images
            </h2>

            <div className="space-y-4">
                {/* Drag and drop area */}
                <div
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
                        isDragging
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <FiUploadCloud className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                        <div className="flex flex-col items-center">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-medium text-secondary dark:text-blue-400">
                                    Click to upload
                                </span>{' '}
                                or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Only 500×500px images (max 500KB)
                            </p>
                        </div>
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer inline-flex items-center px-4 py-2 bg-secondary text-white rounded-md transition hover:bg-secondary-dark"
                        >
                            <FiUpload className="h-4 w-4 mr-2" />
                            Select Files
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleChooseFiles}
                            className="hidden"
                        />
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={isLoading || selectedFiles.length === 0 || !singleProduct?.productId}
                        className={`flex items-center px-4 py-2 rounded-md text-white transition ${
                            selectedFiles.length === 0 || isLoading || !singleProduct?.productId
                                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <FaSpinner className="h-4 w-4 mr-2 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <FiSend className="h-4 w-4 mr-2" />
                                Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={resetImage}
                        disabled={isLoading || selectedFiles.length === 0}
                        className={`flex items-center px-4 py-2 rounded-md transition ${
                            selectedFiles.length === 0 || isLoading
                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
                        }`}
                    >
                        <FiTrash2 className="h-4 w-4 mr-2" />
                        Clear Selection
                    </button>
                </div>

                {/* Selected Files Preview */}
                {selectedFiles.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Selected Images ({selectedFiles.length})
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {selectedFiles.map((file, index) => (
                                <div
                                    key={`selected-${file.name}-${index}`}
                                    className="relative group aspect-square rounded-lg overflow-hidden shadow-sm border dark:border-gray-700"
                                >
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                                    />
                                    {index === 0 && (
                                        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md shadow">
                                            Main
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeImage(file.name)}
                                        className="absolute top-2 right-2 p-1 bg-white/90 dark:bg-gray-800/90 rounded-full shadow hover:bg-white dark:hover:bg-gray-700 transition opacity-0 group-hover:opacity-100"
                                        aria-label={`Remove ${file.name}`}
                                    >
                                        <FiX className="h-4 w-4 text-red-500" />
                                    </button>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                        <p className="text-xs text-white truncate">{file.name}</p>
                                        <p className="text-xs text-white/80">{(file.size / 1024).toFixed(1)}KB</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Display uploaded images */}
                {displayImages.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Uploaded Images ({displayImages.length})
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {displayImages.map((img, index) => (
                                <div
                                    key={`uploaded-${img.imageId || index}`}
                                    className="relative group aspect-square rounded-lg overflow-hidden shadow-sm border dark:border-gray-700"
                                >
                                    <img
                                        src={img?.url?.fileUrl || img}
                                        alt={`Product ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = '/placeholder-product.jpg';
                                            e.target.alt = 'Placeholder image';
                                        }}
                                    />
                                    {index === 0 && (
                                        <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-md shadow">
                                            Main
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteImage123(img)}
                                        className="absolute top-2 right-2 p-1 bg-white/90 dark:bg-gray-800/90 rounded-full shadow hover:bg-white dark:hover:bg-gray-700 transition opacity-0 group-hover:opacity-100"
                                        aria-label={`Delete image ${index + 1}`}
                                    >
                                        <FiX className="h-4 w-4 text-red-500" />
                                    </button>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                        <p className="text-xs text-white truncate">
                                            {img?.name || `Image ${index + 1}`}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

const TagsAndKeywords = ({ features = [], onChange }) => {
    const [keywords, setKeywords] = useState(() => {
        // Initialize with features if available, otherwise start with one empty string
        return features && features.length > 0 ? features : [''];
    });

    // Update keywords when features prop changes
    useEffect(() => {
        if (features && features.length > 0) {
            setKeywords(features);
        }
    }, []);

    useEffect(() => {
        if (keywords.length === 0) {
            setKeywords(['']);
        }
    }, []);

    useEffect(() => {
        const nonEmptyKeywords = keywords.filter(keyword => keyword.trim() !== '');
        onChange('tagandkeywords', null, nonEmptyKeywords);
    }, [keywords]);

    const handleKeywordChange = (index, value) => {
        const updatedKeywords = [...keywords];
        updatedKeywords[index] = value;
        setKeywords(updatedKeywords);
    };

    const addKeyword = () => {
        setKeywords([...keywords, '']);
    };

    const removeKeyword = (index) => {
        if (keywords.length <= 1) {
            // If it's the last keyword, just clear it instead of removing
            const updatedKeywords = [...keywords];
            updatedKeywords[index] = '';
            setKeywords(updatedKeywords);
        } else {
            const updatedKeywords = keywords.filter((_, i) => i !== index);
            setKeywords(updatedKeywords);
        }
    };

    return (
        <div className="border p-2 rounded-lg shadow bg-white mb-6 dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
                <h2 className="md:text-xl text-base font-semibold dark:text-gray-100">Tags & Keywords</h2>
                <button
                    type="button"
                    onClick={addKeyword}
                    className="px-4 py-2 bg-secondary text-white rounded  transition-colors"
                >
                    Add Tag
                </button>
            </div>

            <div className="space-y-4">
                {keywords.map((keyword, index) => (
                    <div key={index} className="flex items-start gap-3 group">
                        <div className="flex-1 relative">
                            <InputText
                                value={keyword || ''}
                                onChange={(e) => handleKeywordChange(index, e.target.value)}
                                placeholder={`Enter tag/keyword #${index + 1}...`}
                                className="w-full p-2 border-b dark:text-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-0 focus:border-blue-500"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => removeKeyword(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
