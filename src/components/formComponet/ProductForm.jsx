// ProductForm.js
import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { FaSpinner } from 'react-icons/fa';
import useProductStore from '../../Context/ProductContext';
import ProductBasicInfo from './ProductBasicInfo';
import CategoryBrandSelection from './CategoryBrandSelection';
import PricingOptions from './PricingOptions';
import SpecificationFields from './SpecificationFields';
import InventorySection from './InventorySection';
import KeyFeaturesFields from './KeyFeaturesFields';
import TagsAndKeywords from './TagsAndKeywords';
import ImageUploader from './ImageUploader';
import SpecificationFields2 from './SpecificationFields2';
import ServiceSelector from './ServiceSelecter';
import { FaHeartPulse } from 'react-icons/fa6';

const defaultFormValues = {
  basicInfo: {
    name: '',
    shortDescription: '',
    longDescription: '',
    manufacturer: '',
    supplierName: '',
    supplierCode: '',
    modelNo: '',
  },
  category: {
    main: null,
    sub: null
  },
  brand: null,
  pricing: {
    sell: {
      actualPrice: 0,
      discountValue: 0,
      discountUnit: '',
      discountedPrice: 0,
      isVatIncluded: false,
      benefits: [],
      warrantPeriod: 0,
      vat: 0
    },
    rent: {
      monthlyPrice: 0,
      discountValue: 0,
      discountUnit: '',
      discountedPrice: 0,
      isVatIncluded: false,
      benefits: []
    },
    services: {
      ots: {
        price: '',
        benefits: []
      },
      mmc: {
        price: '',
        benefits: []
      },
      amcBasic: {
        price: '',
        benefits: []
      },
      amcGold: {
        price: '',
        benefits: []
      },
      isAvailableForRequestQuotation: false
    }
  },
  inventory: {
    sku: '',
    quantity: 1,
    stockStatus: 'IN_STOCK'
  },
  keyFeatures: [''],
  specifications: [{ name: '', value: '' }],
  images: [],
  ourServiceIds: [],
  tagandkeywords: ['']
};

const ProductForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const toast = useRef(null);
  const { createProduct, getProductsById, singleProduct, updateProduct } = useProductStore();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [isImageUpload, setIsImageUpload] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate();



  const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: defaultFormValues
  });

  useEffect(() => {

    setPageLoading(true)
    const fetchProduct = async () => {
      if (location.pathname === '/products/add') {

        reset(defaultFormValues);
    
        setPageLoading(false);
        setIsEditing(false);
        reset();
      } else if (id) {
        try {
          const res = await getProductsById(id);
          if (res?.name) {
            reset({
              basicInfo: {
                name: res.name || '',
                shortDescription: res.description || '',
                longDescription: res.longDescription || '',
                manufacturer: res.manufacturer || '',
                supplierName: res.supplierName || '',
                supplierCode: res.supplierCode || '',
                modelNo: res.modelNo || '',
              },
              category: {
                main: res.category?.name || null,
                sub: res.category?.sub || null
              },
              brand: res.brand || null,
              pricing: {
                sell: res.pricing?.sell || null,
                rent: res.pricing?.rent || null,
                services: {
                  ots: res.pricing?.services?.ots || null,
                  mmc: res.pricing?.services?.mmc || null,
                  amcBasic: res.pricing?.services?.amcBasic || null,
                  amcGold: res.pricing?.services?.amcGold || null,
                  isAvailableForRequestQuotation: res.pricing?.services?.isAvailableForRequestQuotation || false
                }
              },
              inventory: {
                sku: res.inventory?.sku || '',
                quantity: res.inventory?.quantity || 1,
                stockStatus: res.inventory?.stockStatus || 'IN_STOCK'
              },
              keyFeatures: res.keyFeatures || [''],
              specifications: res.specifications || [{ name: '', value: '' }],
              images: res.images || [],
              ourServiceIds: res.ourServices?.map(s => s.ourServiceId) || [],
              tagandkeywords: res.tagNKeywords || ['']
            });
          }
        } catch (error) {
          console.error("Error fetching product:", error);
          showToast('error', 'Error', 'Failed to load product data');
        } finally {
          setPageLoading(false);
          setIsEditing(true);
        }
      }
    };
    fetchProduct();
  }, [getProductsById]);

  const showToast = (severity, summary, detail) => {
    if (toast.current) {
      toast.current.show({
        severity: severity,
        summary: summary,
        detail: detail,
        life: 3000
      });
    }
  };

  const resetForm = () => {
    reset(defaultFormValues);
    setIsImageSelected(false);
    setIsImageUpload(false);
  };

  const onSubmit = async (data) => {
    console.log('data', data);
    if (isSubmitting) return;

    console.log(data);

    if (data?.images?.length === 0 && !isImageSelected) {
      showToast('warn', 'Warning', 'Please select an image.');
      return;
    }
    if (data?.images?.length === 0 && isImageSelected) {
      showToast('warn', 'Warning', 'Please Upload Image first.');
      return;
    }

    if (!data?.category?.main) {
      showToast('warn', 'Warning', 'Please select a Category.');
      return;
    }

    if (!data?.brand) {
      showToast('warn', 'Warning', 'Please select a Brand.');
      return;
    }

    if (!isImageUpload && singleProduct?.imageUrls?.length === 0) {
      showToast('warn', 'Warning', 'Please Upload Image First');
      return;
    }

    try {
      setLoading(true);
      setIsSubmitting(true);
      const payload = preparePayload(data);


      let response;
      if (id) {
        response = await updateProduct(id, payload);
        showToast('success', 'Success', 'Product updated successfully!');

        
        navigate('/products');
        if (response.status === 200 || response.status === 201) {
          window.location.reload();
        }

      } else {
        response = await createProduct(payload);
        showToast('success', 'Success', 'Product created successfully!');
        resetForm();
        setValue('category.main', '');
        // if (response.status === 200 || response.status === 201) {

        //   window.location.reload();
        // }


      }

      console.log('API Response:', response);
    } catch (error) {
      showToast('error', 'Error', 'Failed to save product. Please try again.');
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };



  const preparePayload = (data) => {
    const specifications = Array.isArray(data.specifications)
      ? data.specifications
        .filter(spec => spec?.name && spec?.value)
        .map(spec => ({ name: spec.name, value: spec.value }))
      : [];

    const getServicePayload = (service) => {
      if (!service) return { price: 0, benefits: [] };

      return {
        price: Number(service.price) || 0,
        benefits: Array.isArray(service.benefits)
          ? service.benefits.filter(benefit => benefit && benefit.trim() !== '')
          : (service.benefits ? [service.benefits].filter(b => b && b.trim() !== '') : [])
      };
    };

    let productFor = {};

    if (!data.pricing?.isAvailableForRequestQuotation) {
      productFor.service = {
        ots: getServicePayload(data.pricing?.services?.ots),
        mmc: getServicePayload(data.pricing?.services?.mmc),
        amcBasic: getServicePayload(data.pricing?.services?.amcBasic),
        amcGold: getServicePayload(data.pricing?.services?.amcGold)
      };

      if (data.pricing?.sell?.actualPrice) {
        productFor.sell = {
          actualPrice: data.pricing.sell.actualPrice,
          discountValue: data.pricing.sell.discountValue || 0,
          discountUnit: data.pricing.sell.discountUnit || 'PERCENTAGE',
          discountPrice: data.pricing.sell.discountedPrice || 0,
          isVatIncluded: data.pricing.sell.isVatIncluded || false,
          benefits: Array.isArray(data.pricing.sell.benefits)
            ? data.pricing.sell.benefits.filter(b => b)
            : [],
          warrantPeriod: +(data.pricing.sell.warrantPeriod || 0)
        };
      }

      // Add rent data if available
      if (data.pricing?.rent?.monthlyPrice) {
        productFor.rent = {
          monthlyPrice: data.pricing.rent.monthlyPrice,
          discountPrice: data.pricing.rent.discountedPrice || 0,
          discountValue: data.pricing.rent.discountValue || 0,
          discountUnit: data.pricing.rent.discountUnit || 'PERCENTAGE',
          isVatIncluded: data.pricing.rent.isVatIncluded || false,
          benefits: Array.isArray(data.pricing.rent.benefits)
            ? data.pricing.rent.benefits.filter(b => b)
            : [],
        };
      }
    } else {
      productFor.isAvailableForRequestQuotation = true;
    }

    return {
      name: data.basicInfo.name || '',
      description: data.basicInfo.shortDescription || '',
      longDescription: data.basicInfo.longDescription || '',
      manufacturer: data.basicInfo.manufacturer || '',
      brandId: +(data?.brand?.brandId || 0),
      imageIds: data.images?.map((item) => item.imageId),
      ourServiceIds: data.ourServiceIds,
      specifications,
      modelNo: data.basicInfo.modelNo || '',
      supplierName: data.basicInfo.supplierName || '',
      supplierCode: data.basicInfo.supplierCode || '',
      productFor,
      categoryId: data.category?.main,
      subCategoryId: data?.category?.sub,
      inventory: {
        quantity: +(data.inventory?.quantity),
        sku: data.inventory?.sku || '',
        stockStatus: data.inventory?.stockStatus || 'IN_STOCK'
      },
      keyFeatures: Array.isArray(data.keyFeatures)
        ? data.keyFeatures.filter(f => f)
        : [],
      tagNKeywords: Array.isArray(data?.tagandkeywords)
        ? data.tagandkeywords.filter(t => t)
        : []
    };
  };

  if (pageLoading) {
    return <div className='flex justify-center items-center h-96'>
      <FaSpinner className='animate-spin' />
    </div>
  }


  return (
    <div className="mx-auto px-0 py-0">
      <Toast ref={toast} position="top-right" />

      <div className="bg-white dark:bg-gray-800 p-2 rounded-md">
        <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-6 border-b dark:border-gray-600 pb-2">
          {id ? 'Edit Product' : 'Add New Product'}
        </h1>

        {pageLoading ? (
          <div className='flex justify-center items-center h-96'>
            <FaSpinner className='animate-spin' />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 text-gray-700 dark:text-gray-300">
            <ProductBasicInfo control={control} errors={errors} />
            <CategoryBrandSelection control={control} errors={errors} singleProduct={singleProduct} setValue={setValue} />
            {/* <ServiceSelector
              initialSelected={singleProduct?.ourServiceIds || []}
             
            /> */}
            <ServiceSelector
              initialSelected={singleProduct?.ourServices || watch('ourServiceIds') || []}
              onSave={(selectedIds) => {
                // This only updates the form state with the selected service IDs
                // It doesn't trigger a product save/update
                console.log('Selected service IDs:', selectedIds);
                setValue('ourServiceIds', selectedIds);
              }}
              onCancel={() => {
                // Optional: Handle cancel action if needed
                console.log('Service selection cancelled');
              }}
            />

            <PricingOptions control={control} watch={watch} setValue={setValue} singleProduct={singleProduct} />
            <SpecificationFields2 control={control} watch={watch} setValue={setValue} />
            <InventorySection control={control} />
            <KeyFeaturesFields control={control} watch={watch} setValue={setValue} />
            <TagsAndKeywords control={control} watch={watch} setValue={setValue} />
            <ImageUploader
              control={control}
              isEditing={isEditing}
              setValue={setValue}
              watch={watch}
              singleProduct={singleProduct}
              setIsImageSelected={setIsImageSelected}
              setIsImageUpload={setIsImageUpload}
            />

            <div className="flex justify-between pt-4 border-t dark:border-gray-600">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Reset Form
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-secondary text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                disabled={loading || isSubmitting}
              >
                {loading ? <FaSpinner className='animate-spin' /> : id ? 'Update Product' : 'Add New Product'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductForm;
