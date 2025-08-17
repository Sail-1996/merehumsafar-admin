import React, { useEffect, useState } from 'react';
import useCategoryStore from '../../Context/CategoryContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

export default function AddCategory() {
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [mainCategoryID, setMainCategoryID] = useState('');
  const { 
    getAllCategories, 
    addCategory, 
    handleEditCategory,
    flatCategoryList 
  } = useCategoryStore();
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCatId, setCurrentCatId] = useState(null);
  const [isSubcategory, setIsSubcategory] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    getAllCategories();
    
    if (location.state?.category) {
      const { categoryId, name, parentCategoryId } = location.state.category;
      setIsEditMode(true);
      setCurrentCatId(categoryId);
      
      if (parentCategoryId) {
        // Editing a subcategory
        setIsSubcategory(true);
        setSubCategory(name);
        setMainCategoryID(parentCategoryId);
      } else {
        // Editing a main category
        setMainCategory(name);
      }
    }
  }, [location.state, getAllCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let payload;
    
    if (mainCategory && !mainCategoryID) {
      // Creating/editing a main category
      payload = {
        name: mainCategory,
        parentCategoryId: null
      };
    } else if (subCategory && mainCategoryID) {
      // Creating/editing a subcategory
      payload = {
        name: subCategory,
        parentCategoryId: mainCategoryID
      };
    } else {
      alert('Please fill in the required fields');
      return;
    }

    try {
      if (isEditMode) {
        await handleEditCategory(currentCatId, payload);
        alert('Category updated successfully!');
        navigate(-1); // Go back after edit
      } else {
        await addCategory(payload);
        alert('Category added successfully!');
        resetForm();
      }
      await getAllCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      alert(`Failed to ${isEditMode ? 'update' : 'add'} category. Please try again.`);
    }
  };

  const resetForm = () => {
    setMainCategory('');
    setSubCategory('');
    setMainCategoryID('');
    setIsSubcategory(false);
  };

  const handleCancel = () => {
    if (isEditMode) {
      navigate(-1); // Go back if in edit mode
    } else {
      resetForm();
    }
  };

  // Find the parent category object for display
  const selectedParentCategory = flatCategoryList.find(cat => cat.categoryId === mainCategoryID);

  return (
    <div className='min-h-screen  dark:bg-gray-900 p-4'>

    <div className="max-w-2xl mx-auto p-6 bg-white  dark:bg-gray-800 rounded-lg shadow-md">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-light text-secondary dark:text-gray-200 mb-1 tracking-tight">
          {isEditMode ? 'Edit Category' : 'Create New Category'}
        </h2>
        <p className="text-gray-500 dark:text-gray-300 font-light">
          {isEditMode ? 'Update category details' : 'Organize your inventory systematically'}
        </p>
      </div>
    
      <form onSubmit={handleSubmit} className="space-y-7 ">
      <div className={`transition-all relative duration-200 ease-in-out ${(isSubcategory || mainCategoryID !== '') ? 'opacity-60' : ''}`}>
      <FloatLabel>
            <InputText
              id="mainCategory"
              type="text"
              value={mainCategory}
              onChange={(e) => setMainCategory(e.target.value)}
              className="w-full peer px-4 py-2.5 text-sm border-0 border-b border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-0 focus:border-blue-500"
              disabled={isSubcategory || mainCategoryID !== ''}
            />
            <label htmlFor="mainCategory" className="block text-sm font-medium text-gray-700 peer-focus:text-blue-600 uppercase tracking-wider transition-colors duration-200">
              Main Category
            </label>
          </FloatLabel>
          {!isSubcategory && !mainCategoryID && (
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-300">Leave empty if creating subcategory</p>
          )}
        </div>
    
        <div className={`transition-all duration-200 ease-in-out ${mainCategory && !isSubcategory ? 'opacity-60' : ''}`}>
          <div className="flex items-center justify-between">
            <label htmlFor="parentCategory" className="block text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-1">
              Parent Category
            </label>
            {!mainCategory && (subCategory || isSubcategory) && (
              <span className="text-xs text-blue-500 animate-pulse">Required for subcategory</span>
            )}
          </div>
          
          {/* Replace select with Dropdown for better UI */}
          <Dropdown
            id="parentCategory"
            value={selectedParentCategory}
            options={flatCategoryList}
            onChange={(e) => setMainCategoryID(e.value.categoryId)}
            optionLabel="name"
            placeholder="Select parent category"
            className="w-full border-0 border-b border-gray-300 dark:border-gray-600 bg-transparent"
            disabled={mainCategory && !isSubcategory}
            filter
          />
        </div>
    
        <div className={`transition-all duration-200 ease-in-out ${mainCategory && !isSubcategory ? 'opacity-60' : ''}`}>
          <FloatLabel>
            <InputText
              id="subCategory"
              type="text"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full px-4 py-2.5 peer text-sm border-0 border-b border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-0 focus:border-blue-500"
              disabled={mainCategory && !isSubcategory}
            />
            <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 peer-focus:text-blue-600 uppercase tracking-wider transition-colors duration-200">
              Subcategory Name
            </label>
          </FloatLabel>
        </div>
    
        <div className="flex justify-end gap-4 pt-4">
          {isEditMode && (
            <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Cancel
          </button>
          )}
          
          <button
            type="submit"
            className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors duration-200"
          >
            {isEditMode ? 'Update Category' : 'Create Category'}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}
