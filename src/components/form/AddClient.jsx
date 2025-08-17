
import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { useForm } from "react-hook-form";
import useClientStore from "../../Context/ClientContext";
import { useLocation, useNavigate } from "react-router-dom";
import { FloatLabel } from "primereact/floatlabel";
import axiosInstance from "../../utils/axiosInstance";

export default function AddClientWithImageUploader() {
  const { addClient, editClient } = useClientStore();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentClientId, setCurrentClientId] = useState(null);
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
  } = useForm();

  console.log(location.state?.client, "this is location state");
  useEffect(() => {
    if (location.state?.client) {
      const { clientId, name, image } = location.state.client;
      setIsEditMode(true);
      setCurrentClientId(clientId);

      // Reset form with the client data
      reset({
        name: name || ""
      });

      // Handle image URL
      if (image?.imageUrl) {
        setUploadedUrl(image?.imageUrl);
      }
    } else {

      reset({ name: "" });
      setIsEditMode(false);
      setCurrentClientId(null);
    }
  }, [location.state, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setMessage("File size should be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setMessage("");
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

      setUploadedUrl(response?.data.fileUrl || response?.data?.image?.imageUrl);
      setUploadedImageId(response?.data?.image?.imageId);
      setPreviewUrl("");
      setMessage("Image uploaded successfully");
      setSelectedFile(null);
    } catch (error) {
      console.error("Image upload error:", error);
      setMessage("Image upload failed. Please try again.");
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
      name: data.name,
      imageId: uploadedImageId || null,
    };

    try {
      if (isEditMode) {
        await editClient(currentClientId, payload);
        setMessage("Client updated successfully!");
        navigate(-1);
      } else {
        await addClient(payload);
        setMessage("Client created successfully!");
        resetForm();
      }
    } catch (error) {
      console.error("Client submission error:", error);
      setMessage(
        `Failed to ${isEditMode ? "update" : "create"} client. Please try again.`
      );
    }
  };

  const resetForm = () => {
    reset();
    setSelectedFile(null);
    setPreviewUrl("");
    setUploadedUrl("");
    setMessage("");
  };

  const handleRemoveImage = async () => {
    const clientId = location.state?.client?.clientId;

    if (clientId) {

      try {
        await axiosInstance.delete(`/clients/${clientId}/image`);
      } catch (error) {
        console.error("Failed to delete image from server:", error);
      }
    }else{
      try {
        await axiosInstance.delete(`/image-entities/${uploadedImageId}`);
      } catch (error) {
        console.error("Failed to delete image from server:", error);
      }
    }

    // Reset local image state
    setUploadedUrl("");
    setUploadedImageId(null);
    setPreviewUrl("");
    setSelectedFile(null);
    setMessage("");
  };

  const displayImage = previewUrl || uploadedUrl;
  const nameValue = watch("name", "");

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 p-4 dark:bg-gray-900 dark:text-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl bg-white rounded-xl overflow-hidden border border-gray-300 transition-all hover:shadow-md dark:bg-gray-900 dark:text-gray-100"
      >
        <div className="dark:bg-gray-900 dark:text-gray-100 bg-indigo-50 p-6 border-b border-gray-100">
          <h2 className="text-2xl font-light text-gray-800 dark:text-gray-100">
            {isEditMode ? "Edit Client" : "Add New Client"}
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <FloatLabel>
            <InputText
              id="name"
              value={nameValue}
              className="w-full px-3 peer py-2 border-b border-gray-300"
              {...register("name", {
                required: "Client name is required",
                minLength: {
                  value: 2,
                  message: "Minimum 2 characters required",
                },
              })}
            />
            <label htmlFor="name" className="peer-focus:text-blue-500">
              Full Name
            </label>
          </FloatLabel>
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}


          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Client Photo
            </label>

            {displayImage ? (
              <div className="relative group">
                <img
                  src={displayImage}
                  alt={nameValue || "Client image"}
                  className="w-32 h-32 object-cover rounded-md border"

                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition dark:bg-gray-800 dark:border-gray-700">
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
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Click to upload or drag and drop
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}

            {previewUrl && !uploadedUrl && (
              <button
                type="button"
                onClick={handleImageUpload}
                disabled={uploading}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
              >
                {uploading ? "Uploading..." : "Upload Image"}
              </button>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              {isEditMode ? "Update Client" : "Add Client"}
            </button>
            {message && (
              <p className={`mt-2 text-sm ${message.includes("success") ? "text-green-600" : "text-red-500"
                }`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}