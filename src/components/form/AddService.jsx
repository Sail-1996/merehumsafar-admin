
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Editor } from "primereact/editor";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Toast } from 'primereact/toast';
import useServiceStore from "../../Context/ServiceContext";
import axiosInstance from "../../utils/axiosInstance";
import { IoCloudUploadOutline } from "react-icons/io5";

export default function AddService() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addService, updateService } = useServiceStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [serviceId, setServiceId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const toast = useRef(null);
  const [fileKey, setFileKey] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [tempPreview, setTempPreview] = useState(null);
  const [uploadedImageId, setUploadedImageId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    detailedHeading: "",
    detailedDescription: "",
    imageId: null,
    image: null,
    features: [
      {
        title: "",
        description: ""
      }
    ]
  });

  // Add a utility function to strip HTML tags
  const stripHtmlTags = (html) => {
    if (!html) return '';
    // First, remove any <p> tags
    let text = html.replace(/<p>/g, '').replace(/<\/p>/g, '');
    // Then remove any other HTML tags if present
    text = text.replace(/<[^>]*>/g, '');
    return text;
  };

  useEffect(() => {
    const serviceToEdit = location.state?.service;
    if (serviceToEdit) {
      setIsEditMode(true);
      setServiceId(serviceToEdit.ourServiceId);


      if (serviceToEdit.image) {
        setUploadedImageId(serviceToEdit.image.imageId);
      }

      setFormData({
        title: serviceToEdit.title || "",
        shortDescription: serviceToEdit.shortDescription || "",
        detailedHeading: serviceToEdit.detailedHeading || "",
        detailedDescription: serviceToEdit.detailedDescription || "",
        imageId: serviceToEdit.image?.imageId || null,
        image: serviceToEdit.image || null,
        features: serviceToEdit.features || [{ title: "", description: "" }]
      });
    }
  }, [location.state]);

  const handleFileSelect = (event) => {
    const file = event.files[0];
    const maxSize = 1024 * 1024; // 1MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Please upload only JPG, PNG, or WebP images',
        life: 3000
      });
      return;
    }

    if (file.size > maxSize) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Image size should be less than 1MB',
        life: 3000
      });
      return;
    }

    // Clean up previous preview if exists
    if (tempPreview) {
      URL.revokeObjectURL(tempPreview);
    }

    setSelectedFile(file);
    setTempPreview(URL.createObjectURL(file));
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      toast.current.show({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select an image first',
        life: 3000
      });
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axiosInstance.post(
        '/image-entities/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Extract image data from response
      const imageId = response.data?.image?.imageId;
      const imageUrl = response.data?.image?.imageUrl || response.data?.fileUrl;

      if (imageId && imageUrl) {
        setUploadedImageId(imageId);
        setFormData(prev => ({
          ...prev,
          imageId: imageId,
          image: {
            imageId: imageId,
            imageUrl: imageUrl
          }
        }));

        // Clean up temporary preview
        if (tempPreview) {
          URL.revokeObjectURL(tempPreview);
        }
        setTempPreview(null);
        setSelectedFile(null);

        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Image uploaded successfully',
          life: 3000
        });
      } else {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Upload response missing image data',
          life: 3000
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to upload image',
        life: 3000
      });
    } finally {
      setUploading(false);
    }
  };



  const removeImage = async () => {
    location.state?.service?.ourServiceId
    try {
      if (location.state?.service?.ourServiceId) {
        await axiosInstance.delete(`/our-services/${location.state?.service?.ourServiceId}/image`);


        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Image deleted successfully',
          life: 3000
        });
      } else {
        await axiosInstance.delete(`/image-entities/${uploadedImageId}`);
      }

      // Reset image data in form
      setFormData(prev => ({
        ...prev,
        imageId: null,
        image: null
      }));
      setUploadedImageId(null);

    } catch (error) {
      console.error('Delete error:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete image',
        life: 3000
      });
    }
  };

  const handleFeatureChange = (index, field, value) => {
    setFormData(prev => {
      const updatedFeatures = [...prev.features];
      updatedFeatures[index] = {
        ...updatedFeatures[index],
        [field]: value
      };
      return {
        ...prev,
        features: updatedFeatures
      };
    });
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, { title: "", description: "" }]
    }));
  };

  const removeFeature = (index) => {
    if (formData?.features?.length > 1) {
      setFormData(prev => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      // Prepare payload with imageId instead of imageUrl
      // Strip HTML tags from descriptions
      const payload = {
        title: formData.title,
        shortDescription: stripHtmlTags(formData.shortDescription),
        detailedHeading: formData.detailedHeading,
        detailedDescription: stripHtmlTags(formData.detailedDescription),
        imageId: uploadedImageId,
        features: formData.features.map(feature => ({
          ...feature,
          description: stripHtmlTags(feature.description)
        }))
      };

      if (isEditMode) {
        await updateService(serviceId, payload);
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Service updated successfully',
          life: 3000
        });
      } else {
        await addService(payload);
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Service added successfully',
          life: 3000
        });
      }

      navigate(-1);
    } catch (error) {
      console.error('Failed to save service:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to save service',
        life: 3000
      });
    }
  };

  return (
    <div className="mx-auto">
      <Toast ref={toast} />
      <h2 className="text-2xl font-bold mb-6 text-gray-600 dark:text-gray-200">
        {isEditMode ? 'Edit Service' : 'Add New Service'}
      </h2>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="card p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>

          <div className="space-y-4">
            <div>
              <label className="block mb-2">Title</label>
              <InputText
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full focus:outline-none focus:ring-0 p-2 border-b focus:border-blue-400 bg-primary dark:bg-gray-800"
              />
            </div>

            <div>
              <label className="block mb-2">Short Description</label>
              <Editor
                value={formData.shortDescription}
                onTextChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.htmlValue }))}
                style={{ height: '200px' }}
              />
            </div>
          </div>
        </div>

        {/* Detailed Content */}
        <div className="card p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Detailed Content</h3>

          <div className="space-y-4">
            <div>
              <label className="block mb-2">Detailed Heading</label>
              <InputText
                value={formData.detailedHeading}
                onChange={(e) => setFormData(prev => ({ ...prev, detailedHeading: e.target.value }))}
                className="w-full focus:outline-none focus:ring-0 p-2 border-b focus:border-blue-400 bg-primary dark:bg-gray-800"
              />
            </div>

            <div>
              <label className="block mb-2">Detailed Description</label>
              <Editor
                value={formData.detailedDescription}
                onTextChange={(e) => setFormData(prev => ({ ...prev, detailedDescription: e.htmlValue }))}
                style={{ height: '200px' }}
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="card p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Image</h3>

          {/* Image Upload Area */}
          <div className="mb-4">
            {!formData.image && (
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                <IoCloudUploadOutline className="text-4xl text-blue-500 mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                  Select an image to upload<br />
                  <span className="text-xs">JPG, PNG, or WebP (max 1MB)</span>
                </p>

                <div className="flex flex-col gap-3 w-full max-w-xs">
                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      // Validate file type and size
                      const maxSize = 1024 * 1024; // 1MB
                      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

                      if (!allowedTypes.includes(file.type)) {
                        toast.current.show({
                          severity: 'error',
                          summary: 'Error',
                          detail: 'Please upload only JPG, PNG, or WebP images',
                          life: 3000
                        });
                        return;
                      }

                      if (file.size > maxSize) {
                        toast.current.show({
                          severity: 'error',
                          summary: 'Error',
                          detail: 'Image size should be less than 1MB',
                          life: 3000
                        });
                        return;
                      }

                      // Set selected file and create preview
                      setSelectedFile(file);
                      if (tempPreview) URL.revokeObjectURL(tempPreview);
                      setTempPreview(URL.createObjectURL(file));
                    }}
                    className="hidden"
                    id="service-image-upload"
                  />
                  <label
                    htmlFor="service-image-upload"
                    className="py-2 px-4 bg-blue-600 text-white rounded-md text-center cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    Select Image
                  </label>
                </div>
              </div>
            )}

            {/* Selected Image Preview */}
            {tempPreview && !formData.image && (
              <div className="mt-4">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="w-full md:w-1/3">
                    <img
                      src={tempPreview}
                      alt="Selected preview"
                      className="w-full h-40 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                  </div>

                  <div className="w-full md:w-2/3 space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedFile?.name} ({Math.round(selectedFile?.size / 1024)} KB)
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={handleImageUpload}
                        disabled={uploading}
                        className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {uploading ? (
                          <>
                            <span className="animate-spin">⟳</span> Uploading...
                          </>
                        ) : (
                          <>
                            <span>↑</span> Upload Image
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          if (tempPreview) URL.revokeObjectURL(tempPreview);
                          setTempPreview(null);
                          setSelectedFile(null);
                        }}
                        disabled={uploading}
                        className="py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Uploaded Image */}
            {formData.image && (
              <div className="mt-4">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="w-full md:w-1/3 relative group">
                    <img
                      src={formData.image.imageUrl}
                      alt="Service image"
                      className="w-full h-40 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg">
                      <button
                        onClick={removeImage}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="w-full md:w-2/3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Image uploaded successfully. This image will be displayed on the service page.
                    </p>
                    <button
                      onClick={() => {
                        setFormData(prev => ({ ...prev, image: null }));
                        setUploadedImageId(null);
                      }}
                      className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Replace Image
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="card p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Features</h3>
            <Button
              icon="pi pi-plus"
              onClick={addFeature}
              className="p-button-success p-button-rounded focus:outline-none focus:ring-0 bg-secondary p-2 text-primary"
              tooltip="Add New Feature"
              tooltipOptions={{ position: 'left' }}
            />
          </div>

          <div className="space-y-4">
            {formData.features.map((feature, index) => (
              <div
                key={index}
                className="relative p-4 border border-gray-200 dark:border-gray-700 rounded-lg transition-all hover:shadow-md"
              >
                <div className="absolute top-2 right-2 flex gap-2">
                  {formData.features.length > 1 && (
                    <Button
                      icon="pi pi-trash"
                      onClick={() => removeFeature(index)}
                      className="p-button-danger p-button-rounded p-button-text"
                      tooltip="Remove Feature"
                      tooltipOptions={{ position: 'left' }}
                    />
                  )}
                </div>

                <div className="space-y-4 mt-6">
                  <div>
                    <label className="block mb-2">Feature Title</label>
                    <InputText
                      value={feature.title}
                      onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                      className="w-full focus:outline-none focus:ring-0 p-2 border-b focus:border-blue-400 bg-primary dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block mb-2">Feature Description</label>
                    <Editor
                      value={feature.description}
                      onTextChange={(e) => handleFeatureChange(index, 'description', e.htmlValue)}
                      style={{ height: '150px' }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <Button
            label="Cancel"
            icon="pi pi-times"
            onClick={() => navigate(-1)}
            className="p-button-text focus:outline-none focus:ring-0 bg-secondary p-2 text-primary"
          />
          <Button
            label={isEditMode ? 'Update Service' : 'Add Service'}
            icon="pi pi-save"
            onClick={handleSubmit}
            className="p-button-success focus:outline-none focus:ring-0 bg-secondary p-2 text-primary"
          />
        </div>
      </div>
    </div>
  );
}
