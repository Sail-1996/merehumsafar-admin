import React, { useState, useEffect, use } from "react";
import { InputText} from "primereact/inputtext";
import { Controller, useForm } from "react-hook-form";
import useBrandStore from "../../Context/BrandContext";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FloatLabel } from "primereact/floatlabel";
import axiosInstance from "../../utils/axiosInstance";
import { AutoComplete } from 'primereact/autocomplete';

export default function AddBrandWithImageUploader() {
  const { addBrand, editBrand, getBrandNames, brandNames } = useBrandStore();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBrandId, setCurrentBrandId] = useState(null);
  const [uploadedImageId, setUploadedImageId] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [nameLoading, setNameLoading] = useState(false);
  const [brandExists, setBrandExists] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [filteredBrands, setFilteredBrands] = useState([]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    setNameLoading(true);
    getBrandNames();
    setNameLoading(false);
  }, []);

  useEffect(() => {
    if (location.state?.brand) {
      const { brandId, name, image } = location.state.brand;
      setIsEditMode(true);
      setCurrentBrandId(brandId);
      setValue("name", name);

      if (image?.imageUrl) {
        setUploadedImageUrl(image?.imageUrl);
        setUploadedImageId(image?.imageId);
        setPreviewUrl(image?.imageUrl);
      }
    }
  }, [location.state, setValue]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Clean up previous preview URL if it exists
      if (previewUrl && !previewUrl.includes('http')) {
        URL.revokeObjectURL(previewUrl);
      }

      setSelectedFile(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Reset uploaded image data since we have a new file
      setUploadedImageId(null);
      setUploadedImageUrl(null);
      setMessage("");
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select an image to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setUploading(true);
      setMessage("Uploading image...");

      const response = await axiosInstance.post(
        "/image-entities/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );


      const imageId = response?.data?.image?.imageId;
      const imageUrl = response?.data?.image?.imageUrl || response?.data?.fileUrl;

      if (imageId && imageUrl) {
        setUploadedImageId(imageId);
        setUploadedImageUrl(imageUrl);

        // Clean up the object URL since we now have the server URL
        if (previewUrl && !previewUrl.includes('http')) {
          URL.revokeObjectURL(previewUrl);
        }

        setPreviewUrl(imageUrl);
        setSelectedFile(null);
        setMessage("Image uploaded successfully");
      } else {
        setMessage("Upload response missing image data");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      setMessage("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };
  console.log(brandNames, "brand names");

  const nameValue = watch("name", "");

  useEffect(() => {
    if (nameValue && brandNames?.length > 0) {
      const exists = brandNames.some(
        brand => brand.toLowerCase() === nameValue.toLowerCase()
      );
      setBrandExists(exists && !isEditMode);
      
      // Show message immediately when brand exists
      if (exists && !isEditMode) {
        setMessage("This brand name already exists. Please choose a different name.");
      } else if (message.includes("already exists")) {
        // Clear the message if it was showing the "already exists" warning
        setMessage("");
      }
    } else {
      setBrandExists(false);
    }
  }, [nameValue, brandNames, isEditMode]);

  const onSubmit = async (data) => {
    if (!uploadedImageUrl && !isEditMode) {
      setMessage("Please upload an image before submitting");
      return;
    }

    try {
      const payload = {
        name: data.name,
        imageId: uploadedImageId,
      };

      if (isEditMode) {
        await editBrand(currentBrandId, payload);
        setMessage("Brand updated successfully!");
        navigate(-1);
      } else {
        const res = await addBrand(payload);

        setMessage("Brand created successfully!");
        reset();

        // Clean up preview URL
        if (previewUrl && !previewUrl.includes('http')) {
          URL.revokeObjectURL(previewUrl);
        }

        setPreviewUrl(null);
        setUploadedImageId(null);
        setUploadedImageUrl(null);
        setSelectedFile(null);
      }
    } catch (error) {

      setMessage(
        `Failed to ${isEditMode ? "update" : "create"} brand. Please try again.`
      );
    }
  };

  const handleRemoveImage = async () => {
    try {
      if (currentBrandId) {
        await axiosInstance.delete(`/brands/${currentBrandId}/image`);
        setMessage("Image deleted from server");
      } else {
        await axiosInstance.delete(`/image-entities/${uploadedImageId}`);
        setMessage("Image deleted from server");
      }

      // Clean up object URL to prevent memory leaks
      if (previewUrl && !previewUrl.includes('http')) {
        URL.revokeObjectURL(previewUrl);
      }


      setPreviewUrl(null);
      setSelectedFile(null);
      setUploadedImageId(null);
      setUploadedImageUrl(null);
    } catch (error) {
      console.error("Failed to delete image:", error);
      setMessage("Failed to delete image from server");
    }
  };

  const searchBrands = (event) => {
    const query = event.query.toLowerCase();
    const filtered = brandNames?.filter(brand => 
      brand.toLowerCase().includes(query)
    );
    setFilteredBrands(filtered || []);
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 dark:bg-gray-900 dark:text-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl bg-white rounded-xl overflow-hidden border border-gray-300 transition-all hover:shadow-md dark:bg-gray-900 dark:text-gray-100"
      >
        {/* Header */}
        <div className="dark:bg-gray-900 dark:text-gray-100 bg-indigo-50 p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-white shadow-sm border border-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-light text-gray-800 dark:text-gray-100">
                {isEditMode ? "Edit Brand" : "Add New Brand"}
              </h2>
              <p className="text-sm text-gray-500">
                {isEditMode
                  ? "Update brand details and logo"
                  : "Add new brand with logo and details"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Brand Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Brand Name
            </label>
            <Controller
              name="name"
              control={control}
              rules={{
                required: "Brand name is required",
                minLength: {
                  value: 2,
                  message: "Minimum 2 characters required",
                }
              }}
              render={({ field, fieldState }) => (
                <AutoComplete
                  id={field.name}
                  value={field.value}
                  suggestions={filteredBrands}
                  completeMethod={searchBrands}
                  onChange={(e) => field.onChange(e.value)}
                  className={`w-full ${brandExists ? 'p-invalid' : ''}`}
                  inputClassName="w-full px-3 py-2 border-b border-gray-300 dark:text-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-0 focus:border-blue-500"
                />
              )}
            />
            {brandExists && (
              <p className="text-xs text-red-500 mt-1 animate-fade-in">
                This brand name already exists
              </p>
            )}
            {errors.name && (
              <p className="text-xs text-red-500 mt-1 animate-fade-in">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 uppercase tracking-wider mb-2 dark:text-gray-100">
                Brand Logo
              </label>

              {!previewUrl && (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition dark:bg-gray-900 dark:text-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                      <p className="text-xs text-gray-500">
                        <span className="font-semibold">Click to upload</span> or
                        drag and drop
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, WEBP
                      </p>
                    </div>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Image Preview */}
            {previewUrl && (
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-48 h-48 overflow-hidden rounded-lg border border-gray-200">
                    <img
                      src={previewUrl}
                      alt="Brand logo preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                {/* Only show upload button if we have a selected file but not an uploaded image */}
                {selectedFile && !uploadedImageId && (
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    disabled={uploading}
                    className="mt-4 flex items-center justify-center py-2 px-4 rounded-lg font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        Upload Image
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-lg font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 inline"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {isEditMode ? "Update Brand" : "Create Brand"}
            </button>
          </div>

          {/* Status Message */}
          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${message.includes("success")
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
                } animate-fade-in`}
            >
              {message}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
