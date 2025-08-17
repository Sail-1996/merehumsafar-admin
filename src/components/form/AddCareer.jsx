
import React, { useState, useEffect, useCallback } from 'react';
import useCareerStore from "../../Context/CareerContext";
import axiosInstance from '../../utils/axiosInstance';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoCloudUploadOutline } from "react-icons/io5";

function AddCareer() {
  const { createJobPost, editJobPost } = useCareerStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImageId, setUploadedImageId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    heading: '',
    description: '',
    notes: '',
  });

  const [focusedFields, setFocusedFields] = useState({
    heading: false,
    description: false,
    notes: false
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const post = location.state?.post;

    if (post) {
      setIsEditMode(true);
      setCurrentPostId(post.jobPostId);
      setFormData({
        heading: post.jobTitle || '',
        description: post.jobDescription || '',
        notes: post.requirements || '',
      });

      // Handle both image structures (direct URL or imageDetails object)
      if (post.imageDetails?.imageUrl) {
        setUploadedImageUrl(post.imageDetails.imageUrl);
        setPreviewUrl(post.imageDetails.imageUrl);
        setUploadedImageId(post.imageDetails.imageId);
        // Set selectedFile to null to show the uploaded image view
        setSelectedFile(null);
      } else if (post.image) {
        setUploadedImageUrl(post.image);
        setPreviewUrl(post.image);
        // Try to extract imageId if available
        setUploadedImageId(post.imageId);
        // Set selectedFile to null to show the uploaded image view
        setSelectedFile(null);
      }
      
      // Log to verify data is being set correctly
      console.log("Edit mode data:", {
        imageUrl: post.imageDetails?.imageUrl || post.image,
        imageId: post.imageDetails?.imageId || post.imageId
      });
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleFocus = (field) => {
    setFocusedFields(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    if (!formData[field]) {
      setFocusedFields(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type and size
    const maxSize = 1024 * 1024; // 1MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload only JPG, PNG, or WebP images');
      return;
    }
    
    if (file.size > maxSize) {
      alert('Image size should be less than 1MB');
      return;
    }
    
    setSelectedFile(file);
    
    // Clean up previous preview URL if it exists
    if (previewUrl && !previewUrl.includes('http')) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setPreviewUrl(URL.createObjectURL(file));
    setUploadMessage('');
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      setUploadMessage("Please select an image to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setUploading(true);
      setUploadMessage("Uploading image...");

      const response = await axiosInstance.post(
        "/image-entities/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      // Extract image data from response
      const imageId = response.data?.image?.imageId;
      const imageUrl = response.data?.image?.imageUrl || response.data?.fileUrl;
      
      if (imageId && imageUrl) {
        setUploadedImageId(imageId);
        setUploadedImageUrl(imageUrl);
        
        // Clean up the object URL since we now have the server URL
        if (previewUrl && !previewUrl.includes('http')) {
          URL.revokeObjectURL(previewUrl);
        }
        
        setPreviewUrl(imageUrl);
        setSelectedFile(null);
        setUploadMessage("Image uploaded successfully");
      } else {
        setUploadMessage("Upload response missing image data");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      setUploadMessage("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      jobTitle: formData.heading,
      jobDescription: formData.description,
      requirements: formData.notes,
      isActive: true,
      imageId: uploadedImageId || null,
    };

    try {
      if (isEditMode) {
        await editJobPost(payload, currentPostId);
        alert('Career post updated successfully!');
        navigate(-1);
      } else {
        await createJobPost(payload);
        alert('Career post created successfully!');
        
        // Reset form
        setFormData({ heading: '', description: '', notes: '' });
        setPreviewUrl('');
        setSelectedFile(null);
        setUploadedImageUrl('');
        setUploadMessage('');
        setUploadedImageId(null);
      }
    } catch (error) {
      console.error('Error submitting job post:', error);
      alert('Failed to submit career post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteImage = async () => {
    setIsDeleting(true);
    try {
      if (location.state?.post?.jobPostId) {
        const res = await axiosInstance.delete(`/job-posts/${location.state.post.jobPostId}/image`);
        if (res.status === 204 || res.status === 200 || res.status === 201) {
          setUploadMessage("Image deleted from server");
        }
      } else if (uploadedImageId) {
        await axiosInstance.delete(`/image-entities/${uploadedImageId}`);
        setUploadMessage("Image deleted successfully");
      }
      
      // Clean up object URL to prevent memory leaks
      if (previewUrl && !previewUrl.includes('http')) {
        URL.revokeObjectURL(previewUrl);
      }
      
      setPreviewUrl('');
      setUploadedImageUrl('');
      setUploadedImageId(null);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error deleting image:", error);
      setUploadMessage("Failed to delete image");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 text-gray-900 dark:text-gray-100">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-secondary">{isEditMode ? 'Edit Job Post' : 'Create Job Post'}</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isEditMode ? 'Modify your job listing below.' : 'Add a new job opportunity to your career page.'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">

            <div className="relative pt-5">
              <label
                htmlFor="heading"
                className={`absolute left-0 ${focusedFields.heading || formData.heading ?
                  '-top-1 text-sm text-blue-400 dark:text-blue-400 transition-all duration-200' :
                  'top-4 text-sm text-gray-500 dark:text-gray-400 transition-all duration-200'}`}
              >
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="heading"
                name="heading"
                value={formData.heading}
                onChange={handleChange}
                onFocus={() => handleFocus('heading')}
                onBlur={() => handleBlur('heading')}
                required
                className="block w-full px-0 py-2 border-0 border-b border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-0 focus:border-blue-500"
              />
            </div>

            {/* Job Description Field */}
            <div className="relative pt-5">
              <label
                htmlFor="description"
                className={`absolute left-0 ${focusedFields.description || formData.description ?
                  '-top-1 text-sm text-blue-400  dark:text-blue-400 transition-all duration-200' :
                  'top-4 text-sm text-gray-500 dark:text-gray-400 transition-all duration-200'}`}
              >
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                onFocus={() => handleFocus('description')}
                onBlur={() => handleBlur('description')}
                rows="3"
                required
                className="block w-full px-0 py-2 border-0 border-b border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-0 focus:border-blue-500"
              />
            </div>

            {/* Requirements Field */}
            <div className="relative pt-5">
              <label
                htmlFor="notes"
                className={`absolute left-0 ${focusedFields.notes || formData.notes ?
                  '-top-1 text-sm text-blue-400  dark:text-blue-400 transition-all duration-200' :
                  'top-4 text-sm text-gray-500 dark:text-gray-400 transition-all duration-200'}`}
              >
                Requirements
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                onFocus={() => handleFocus('notes')}
                onBlur={() => handleBlur('notes')}
                rows="2"
                className="block w-full px-0 py-2 border-0 border-b border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-0 focus:border-blue-500"
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <label className="block text-sm font-medium mb-1">
                Job Post Image
              </label>
              
              {/* Image Upload Area - Only show when no image is selected or uploaded */}
              {!previewUrl && (
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <IoCloudUploadOutline className="text-4xl text-blue-500 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                    Select an image to upload<br />
                    <span className="text-xs">JPG, PNG, or WebP (max 1MB)</span>
                  </p>
                  
                  <div className="flex flex-col gap-3 w-full max-w-xs">
                    <input
                      type="file"
                      accept="image/jpeg, image/png, image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                      id="career-image-upload"
                    />
                    <label
                      htmlFor="career-image-upload"
                      className="py-2 px-4 bg-blue-600 text-white rounded-md text-center cursor-pointer hover:bg-blue-700 transition-colors"
                    >
                      Select Image
                    </label>
                  </div>
                </div>
              )}
              
              {/* Selected Image Preview - Show when an image is selected but not yet uploaded */}
              {previewUrl && selectedFile && (
                <div className="mt-4">
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="w-full md:w-1/3">
                      <img 
                        src={previewUrl} 
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
                          type="button"
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
                          type="button"
                          onClick={() => {
                            if (previewUrl && !previewUrl.includes('http')) {
                              URL.revokeObjectURL(previewUrl);
                            }
                            setPreviewUrl('');
                            setSelectedFile(null);
                            setUploadMessage('');
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
              
              {/* Uploaded Image - Show when an image is uploaded or in edit mode with existing image */}
              {previewUrl && !selectedFile && (
                <div className="mt-4">
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="w-full md:w-1/3 relative group">
                      <img 
                        src={previewUrl} 
                        alt="Job post image" 
                        className="w-full h-40 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg">
                        <button
                          type="button"
                          onClick={handleDeleteImage}
                          disabled={isDeleting}
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
                        {isDeleting ? "Deleting image..." : 
                          uploadMessage || (isEditMode ? "Current job post image. You can replace or remove it." : "Image uploaded successfully. This image will be displayed on the career post.")}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          if (previewUrl && !previewUrl.includes('http')) {
                            URL.revokeObjectURL(previewUrl);
                          }
                          setPreviewUrl('');
                          setUploadedImageUrl('');
                          setUploadedImageId(null);
                          setUploadMessage('');
                        }}
                        className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        disabled={isDeleting}
                      >
                        Replace Image
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {uploadMessage && (
                <p className={`mt-1 text-sm ${uploadMessage.includes("success") || uploadMessage.includes("deleted") ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {uploadMessage}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 grid md:grid-cols-2 grid-cols-1 gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  isEditMode ? 'Update Job Post' : 'Create Job Post'
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AddCareer;
