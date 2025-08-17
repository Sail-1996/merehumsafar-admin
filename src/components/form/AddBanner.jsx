
import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { useForm } from "react-hook-form";
import useBannerStore from "../../Context/BannerContext";
import { useLocation, useNavigate } from "react-router-dom";
import { FloatLabel } from "primereact/floatlabel";
import axiosInstance from "../../utils/axiosInstance";

export default function AddBannerWithImageUploader() {
  const { addBanner, updateBanner } = useBannerStore();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBannerId, setCurrentBannerId] = useState(null);
const [uploadedImageId, setUploadedImageId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({ defaultValues: { title: "" } });

  useEffect(() => {
    const banner = location.state?.banner;
    if (banner) {
      setIsEditMode(true);
      setCurrentBannerId(banner.bannerId);
      setValue("title", banner.title); // ✅ use title instead of name
      if (banner.imageUrl) {
        setUploadedUrl(banner.imageUrl); // ✅ use imageUrl instead of images
        setPreviewUrl(banner.imageUrl);
      }
    }
  }, [location.state, setValue]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setMessage("");
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select an image");
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
      setUploadedImageId(response.data?.image?.imageId);

      const imageUrl = response.data?.fileUrl;
      if (imageUrl) {
        setUploadedUrl(imageUrl);
        setMessage("Image uploaded successfully");
        setSelectedFile(null);
      } else {
        setMessage("Upload succeeded but no URL returned");
      }
    } catch (error) {
      console.error(error);
      setMessage("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!uploadedUrl && !isEditMode) {
      setMessage("Please upload an image before submitting");
      return;
    }

    const payload = {
      title: data.title,
      imageId : uploadedImageId,
    };

    try {
      if (isEditMode) {
        await updateBanner(currentBannerId, payload);
        setMessage("Banner updated successfully!");
        navigate(-1);
      } else {
        await addBanner(payload);
        alert("Banner created successfully!");
        setMessage("Banner created successfully!");
        reset();
        setUploadedUrl("");
        setPreviewUrl("");
      }
    } catch (error) {
      console.error(error);
      setMessage(`Failed to ${isEditMode ? "update" : "create"} banner.`);
    }
  };

  const handleRemoveImage =  async () => {
    if(location.state?.banner?.bannerId){
      try {
        await axiosInstance.delete(`/banners/${location.state.banner.bannerId}/image`);
        alert("Image deleted from server.");
      } catch (error) {
        console.error("Failed to delete image from server:", error);
      }
    }else{
      try {
        await axiosInstance.delete(`/image-entities/${uploadedImageId}`);
        alert("Image deleted from server.");
      } catch (error) {
        console.error("Failed to delete image from server:", error);
      }
    }
    setUploadedUrl("");
    setPreviewUrl("");
    setSelectedFile(null);
    setMessage("");
  };
  const nameValue = watch("title", "");
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 p-4 dark:bg-gray-900 dark:text-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl bg-white rounded-xl overflow-hidden border border-gray-300 transition-all hover:shadow-md dark:bg-gray-900 dark:text-gray-100"
      >
        <div className="bg-indigo-50 p-6 border-b border-gray-100 dark:bg-gray-900 dark:text-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-white shadow-sm border border-gray-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-light">
                {isEditMode ? "Edit Banner" : "Add New Banner"}
              </h2>
              <p className="text-sm text-gray-500">Banner title and image</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <FloatLabel>
              <InputText
                id="title"
                value={nameValue}
                className="w-full px-3 py-2 border-b dark:bg-gray-800 focus:border-blue-500"
                {...register("title", {
                  required: "Title is required",
                  minLength: { value: 2, message: "Minimum 2 characters" },
                })}
              />
              <label htmlFor="title">Banner Title</label>
            </FloatLabel>
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium">Banner Image</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-800">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.9A5 5 0 1116 6a5 5 0 011 9.9M15 13l-3-3-3 3m3-3v12" />
                </svg>
                <p className="text-xs text-gray-500">Click to upload or drag and drop</p>
              </div>
              <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
            </label>

            {previewUrl && (
              <div className="relative group w-48 h-48 mx-auto">
                <img src={previewUrl} alt="preview" className="w-full h-full object-cover rounded shadow" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs shadow hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleImageUpload}
              disabled={uploading}
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded transition"
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </button>

            {message && <p className="text-sm text-center mt-2">{message}</p>}
          </div>
        </div>

        <div className="px-6 pb-6">
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded shadow"
          >
            {isEditMode ? "Update Banner" : "Create Banner"}
          </button>
        </div>
      </form>
    </div>
  );
}
