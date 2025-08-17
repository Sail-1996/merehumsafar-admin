
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { FloatLabel } from 'primereact/floatlabel';

export default function AddRent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image1: null,
    image2: null,
    image3: null,
  });

  const [errors, setErrors] = useState({});
  const [previews, setPreviews] = useState({
    image1: null,
    image2: null,
    image3: null,
  });
  const [fileKey, setFileKey] = useState(0);

  // Refs for FileUpload components to access clear() method
  const fileUploadRefs = {
    image1: useRef(null),
    image2: useRef(null),
    image3: useRef(null),
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleFileChange = (e, name) => {
    const file = e.files[0];

    // Validation for file type and size
    if (file) {
      const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, [name]: 'Invalid file type. Allowed types: .png, .jpeg, .webp' });
        fileUploadRefs[name].current.clear(); // Clear input on error
        return;
      }
      if (file.size > 1024 * 1024) {
        setErrors({ ...errors, [name]: 'File size exceeds 1 MB' });
        fileUploadRefs[name].current.clear(); // Clear input on error
        return;
      }

      // Set file and preview
      setFormData({ ...formData, [name]: file });
      setPreviews({ ...previews, [name]: URL.createObjectURL(file) });
      setErrors({ ...errors, [name]: '' });
    }
    setFileKey(!fileKey)
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.subtitle) newErrors.subtitle = 'Subtitle is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.image1) newErrors.image1 = 'First image is required';
    if (!formData.image2) newErrors.image2 = 'Second image is required';
    if (!formData.image3) newErrors.image3 = 'Third image is required';
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('subtitle', formData.subtitle);
    formDataToSend.append('description', formData.description);
    if (formData.image1) formDataToSend.append('image1', formData.image1);
    if (formData.image2) formDataToSend.append('image2', formData.image2);
    if (formData.image3) formDataToSend.append('image3', formData.image3);


    navigate('/rental-list');
  };

  return (
    <div className="w-full">
      <h3 className="heading mb-6 dark:text-white">Add New Rental Detail</h3>

      <div className="border border-gray-300 dark:border-gray-700 p-6 rounded-lg shadow bg-white dark:bg-gray-800 mb-6">
        <h2 className="subheading mb-8 text-gray-800 dark:text-gray-200 ">Rental Information</h2>

        {/* Title Field */}
        <div className="mb-8 flex flex-col md:flex-row justify-between md:items-center">
          <FloatLabel className='w-full'>
          <InputText
            className="w-[100%] peer md:w-[70%] peer p-2 border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-0 focus:outline-none focus:border-blue-500 rounded-md"
            name="title"
            value={formData.title}
            onChange={handleChange}
            // placeholder="Title"
          />
          <label className="text-gray-600 peer-focus:text-blue-500 dark:text-gray-300 mb-2 md:mb-0">Title</label>
          </FloatLabel>
          {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
        </div>

        {/* Subtitle Field */}
        <div className="mb-8 flex flex-col md:flex-row justify-between md:items-center ">
        <FloatLabel className='w-full'>
          <InputText
            className="w-[100%] md:w-[70%] peer  p-2 border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-0 focus:outline-none focus:border-blue-500 rounded-md"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            // placeholder="Subtitle"
          />
          <label className="text-gray-600 peer-focus:text-blue-500 dark:text-gray-300 mb-2 md:mb-0">Subtitle</label>
          </FloatLabel>
          {errors.subtitle && <span className="text-red-500 text-sm">{errors.subtitle}</span>}
        </div>

        {/* Description Field */}
        <div className="mb-4 flex flex-col md:flex-row justify-between md:items-center">
          <FloatLabel className='w-full'>     
          <InputText
            className="w-[100%] peer md:w-[70%] p-2 border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-0 focus:outline-none focus:border-blue-500 rounded-md "
            name="description"
            value={formData.description}
            onChange={handleChange}
            // placeholder="Description"
          />
          <label className="text-gray-600 peer-focus:text-blue-500 dark:text-gray-300 mb-2 md:mb-0">Description</label>
          </FloatLabel>    
          {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
        </div>
      </div>


      {/* Image Upload Section */}
      <div className="border border-gray-300 dark:border-gray-700 p-6 rounded-lg shadow bg-white dark:bg-gray-800 mb-6">
        <h4 className="subheading mb-4 text-gray-800 dark:text-gray-200">Images</h4>

        <p className="text-yellow-500 dark:text-gray-400  opacity-70 text-sm mb-4">
          **Image should be below 1 MB, with dimensions 500x600, and in .png / .jpeg / .webp format**
        </p>

        {['image1', 'image2', 'image3'].map((name, index) => (
          <div key={name} className="mb-4 flex justify-between items-center w-full">
            <div className="flex flex-row justify-between items-center w-[100%] md:w-[70%]">
              {/* Label */}
              <label className="text-gray-600 dark:text-gray-300 mb-2 md:mb-0">
                Image {index + 1}
              </label>

              {/* File Upload */}
              <FileUpload
                ref={fileUploadRefs[name]}
                mode="basic"
                name={name}
                accept="image/*"
                auto
                customUpload
                chooseOptions={{ className: "bg-primary border-2 border-secondary text-secondary dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:border-gray-300 dark:border-gray-300" }}
                key={fileKey} // Force re-render
                chooseLabel={formData[name] ? formData[name].name : "Choose"}
                onSelect={(e) => handleFileChange(e, name)}
                className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 rounded-md"
              />
            </div>

            {/* Image Preview */}
            {previews[name] && (
              <img
                src={previews[name]}
                alt=""
                className="w-24 h-24 rounded-lg shadow ml-4 border border-gray-300 dark:border-gray-600"
              />
            )}

            {/* Error Message */}
            {errors[name] && <span className="text-red-500 text-sm ml-4">{errors[name]}</span>}
          </div>
        ))}
      </div>


      <div className="flex justify-center mt-6">
        <Button
          label="Submit"
          className="p-button-success bg-secondary text-white px-6 py-2 rounded-md shadow-md transition-all duration-300 
               dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 border dark:border-gray-300 "
          onClick={handleSubmit}
        />
      </div>

    </div>
  );
}
