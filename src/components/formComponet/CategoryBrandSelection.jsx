import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import useBrandStore from '../../Context/BrandContext';
import useCategoryStore from '../../Context/CategoryContext';

const CategoryBrandSelection = ({ control, errors, singleProduct, reset, setValue }) => {
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
    const [selectedMainCategory, setSelectedMainCategory] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);

    useEffect(() => {
        getAllCategories();
        getAllBrands();
    }, []);

    useEffect(() => {
    if (singleProduct && flatCategoryList.length > 0 && brands.length > 0) {
        const mainCat = flatCategoryList.find(
            cat => cat.categoryId === singleProduct?.category?.categoryId
        );
console.log(mainCat, "main cat")
        if (mainCat) {
            setSelectedMainCategory(mainCat);
            setSelectedCategory(mainCat.categoryId);
            setValue('category.main', mainCat.categoryId);
        } else {
            setSelectedMainCategory(null);
            setValue('category.main', null);
        }

        // Set subcategory if exists
        if (singleProduct?.subCategory?.categoryId && subCategories.length > 0) {
            const subCat = subCategories.find(
                cat => cat.categoryId === singleProduct.subCategory.categoryId
            );
            setSelectedSubCategory(subCat);
            setValue('category.sub', subCat?.categoryId || null);
        }

        // Set brand
        const brand = brands.find(b => b.brandId === singleProduct.brand);
        if (brand) {
            setSelectedBrand(brand);
            setValue('brand', brand.brandId);
        }
    } else if (location.pathname === '/products/add') {
        setSelectedMainCategory(null);
        setSelectedSubCategory(null);
        setSelectedBrand(null);
        setValue('category.main', null);
        setValue('category.sub', null);
        setValue('brand', null);
    }
}, [singleProduct, flatCategoryList, brands,]);

    const filteredCategories = flatCategoryList.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredBrands = brands.filter(b =>
        b.name.toLowerCase().includes(brandSearchTerm.toLowerCase())
    );

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6 bg-secondary bg-opacity-10 rounded-lg px-5">
                <h2 className="md:text-lg text-base font-semibold text-secondary rounded-lg p-3 dark:text-gray-100">Category & Brand</h2>
                <span className="text-xs bg-blue-50 dark:bg-blue-900 text-secondary px-1 py-1 rounded max-w-28">Required fields*</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label htmlFor="mainCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Main Category</label>
                        <span className="text-xs text-red-500">*required</span>
                    </div>

                    <Controller
                        name="category.main"
                        control={control}
                        rules={{ required: 'Please select a main category' }}
                        render={({ field }) => {
                            return (
                                <Dropdown
                                    {...field}
                                    id="mainCategory"
                                    options={filteredCategories}
                                    optionLabel="name"
                                    optionValue="categoryId"
                                    placeholder="Select Category"
                                    filter
                                    filterBy="name"
                                    className={classNames('w-full border dark:border-gray-600 focus:outline-none focus:ring-0 bg-white dark:bg-gray-900', {
                                        'p-invalid': errors.category?.main
                                    })}
                                    filterPlaceholder="Search categories..."
                                    emptyFilterMessage="No categories found"
                                    onChange={(e) => {
                                        const selectedCat = filteredCategories.find(cat => cat.categoryId === e.value);
                                        field.onChange(e.value);
                                        setSelectedCategory(e.value);
                                        setSelectedMainCategory(selectedCat);
                                        setIsTouched(true);
                                      
                                        setSelectedSubCategory(null);
                                        setValue('category.sub', null);
                                    }}
                                    value={field.value}
                                    // valueTemplate={(option, props) => {
                                    //     if (!option && selectedMainCategory) {
                                    //         return (
                                    //             <div className="flex items-center text-gray-800 dark:text-gray-100">
                                    //                 <span>{selectedMainCategory.name}</span>
                                    //             </div>
                                    //         );
                                    //     }
                                    //     if (!option) return props.placeholder;
                                    //     return (
                                    //         <div className="flex items-center text-gray-800 dark:text-gray-100">
                                    //             <span>{option.name}</span>
                                    //         </div>
                                    //     );
                                    // }}
                                    itemTemplate={(option) => {
                                        return (
                                            <div className="flex items-center text-gray-800 dark:text-gray-100">
                                                <span>{option.name}</span>
                                            </div>
                                        );
                                    }}
                                />
                            );
                        }}
                    />
                    {errors.category?.main && (
                        <small className="p-error">{errors.category.main.message}</small>
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sub Category</label>
                    <Controller
                        name="category.sub"
                        control={control}
                        render={({ field }) => (
                            console.log(field.value),
                            <Dropdown
                                {...field}
                                id="subCategory"
                                options={subCategories}
                                optionLabel="name"
                                optionValue="categoryId"
                                placeholder="Select Sub Category"
                                className="w-full border dark:border-gray-600 p-dropdown:focus-none bg-white dark:bg-gray-900"
                                onChange={(e) => {
                                    field.onChange(e.value);  // Simplified - just pass the value directly
                                }}
                                value={field.value}
                            />
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label htmlFor="brand" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Brand</label>
                        <span className="text-xs text-red-500">*required</span>
                    </div>

                    <Controller
                        name="brand"
                        control={control}
                        rules={{ required: 'Please select a brand' }}
                        render={({ field }) => (
                            <Dropdown
                                {...field}
                                id="brand"
                                options={filteredBrands}
                                optionLabel="name"
                                placeholder="Select Brand"
                                filter
                                filterBy="name"
                                className={classNames('w-full border bg-white dark:bg-gray-900 dark:border-gray-600 outline-none p-dropdown:focus-none', {
                                    'p-invalid': errors.brand
                                })}
                                filterPlaceholder="Search brands..."
                                emptyFilterMessage="No brands found"
                                onChange={(e) => {
                                    const selectedBrand = filteredBrands.find(b => b.brandId === e.value);
                                    field.onChange(e.value);
                                    setSelectedBrand(selectedBrand);
                                    setIsTouched(true)
                                        ;
                                }}
                                value={field.value}
                                valueTemplate={(option, props) => {
                                    if (!option && selectedBrand) {
                                        return (
                                            <div className="flex items-center text-gray-800 dark:text-gray-100">
                                                <span>{selectedBrand.name}</span>
                                            </div>
                                        );
                                    }
                                    if (!option) return props.placeholder;
                                    return (
                                        <div className="flex items-center text-gray-800 dark:text-gray-100">
                                            <span>{option.name}</span>
                                        </div>
                                    );
                                }}
                            />
                        )}
                    />
                    {errors.brand && (
                        <small className="p-error">{errors.brand.message}</small>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryBrandSelection;
