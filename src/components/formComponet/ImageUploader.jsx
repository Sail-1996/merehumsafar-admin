// import React, { useState } from 'react';
// import { Controller } from 'react-hook-form';
// import { FiUploadCloud, FiSend, FiTrash2, FiX, FiUpload } from 'react-icons/fi';
// import { FaSpinner } from 'react-icons/fa';
// import useImageUploadStore from '../../Context/ImageUploadContext';
// import useProductStore from '../../Context/ProductContext';

// const ImageUploader = ({ control, setValue, singleProduct, setIsImageSelected, setIsImageUpload, watch ,isEditing }) => {
//   const { uploadFiles, isLoading, deleteImage, isDeleting,deleteProductImage } = useImageUploadStore();
//   // const { deleteProductImage } = useProductStore();
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [isDragging, setIsDragging] = useState(false);
//   const images = watch('images') || [];

//   const handleChooseFiles = async (e) => {
//     const files = Array.from(e.target.files || e.dataTransfer.files);
//     await validateAndSetFiles(files);
//   };

//   const validateAndSetFiles = async (files) => {
//     const validImages = [];

//     for (const file of files) {
//       const image = new Image();
//       const objectUrl = URL.createObjectURL(file);

//       const isValid = await new Promise((resolve) => {
//         image.onload = () => {
//           const is500x500 = image.width === 500 && image.height === 500;
//           const isUnder500KB = file.size <= 500 * 1024;
//           URL.revokeObjectURL(objectUrl);
//           resolve(is500x500 && isUnder500KB);
//         };
//         image.onerror = () => resolve(false);
//         image.src = objectUrl;
//       });

//       if (isValid) {
//         validImages.push(file);
//       } else {
//         const sizeKB = (file.size / 1024).toFixed(2);
//         alert(`"${file.name}" is either not 500x500 pixels or larger than 500KB (${sizeKB}KB). It will be skipped.`);
//       }
//     }

//     if (validImages.length > 0) {
//       setIsImageSelected(true);
//     }

//     setSelectedFiles(prev => [...prev, ...validImages]);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = () => {
//     setIsDragging(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     handleChooseFiles(e);
//   };

//   const resetImage = () => {
//     setSelectedFiles([]);
//   };

//   const removeImage = (name) => {
//     setSelectedFiles(prev => prev.filter((e) => e.name !== name));
//   };

//   const handleDeleteImage = async (singleProductId,image) => {
//     try {
  
//       isEditing==true?deleteProductImage(singleProductId,image.imageId)  :deleteImage(image.imageId);



      

//        // pass only the ID to the store method
  
//       const newImages = images.filter(img => {
//         if (typeof img === 'string') return img !== image.imageId;
//         return img.imageId !== imageimageId;
//       });
  
//       setValue('images', newImages);
//     } catch (error) {
//       console.error('Error deleting image:', error);
//     }
//   };
  

//   const handleUpload = async () => {
//     if (selectedFiles.length === 0) return;
//     try {
//       const uploaded = await uploadFiles(selectedFiles);
//       if (uploaded) {
//         setIsImageUpload(true);
//         setValue('images', [...images, ...uploaded]);
//         setSelectedFiles([]);
//       }
//     } catch (error) {
//       console.error('Error uploading images:', error);
//     }
//   };

  
//   const getImageUrl = (img) => {
//     console.log(img,'imgurllss');
//     if (typeof img === 'string') return img;
//     return img.imageUrl || img.url;
//   };

//   const isExistingProductImage = (img) => {
//     return typeof img === 'string' && singleProduct?.images?.includes(img);
//   };

//   return (
//     <section className="bg-white dark:bg-gray-800 dark:shadow-gray-700/50 space-y-6 transition-colors duration-300">
//       <div className="flex items-center justify-between mb-5 bg-secondary bg-opacity-10 rounded-lg px-5">
//         <h2 className="md:text-lg text-base font-semibold text-secondary rounded-lg p-3 dark:text-gray-100">Product Images</h2>
//       </div>

//       <div className="space-y-4">
//         <div
//           className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${isDragging
//               ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
//               : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
//             }`}
//           onDragOver={handleDragOver}
//           onDragLeave={handleDragLeave}
//           onDrop={handleDrop}
//         >
//           <div className="flex flex-col items-center justify-center space-y-3">
//             <FiUploadCloud className="h-10 w-10 text-gray-400 dark:text-gray-500" />
//             <div className="flex flex-col items-center">
//               <p className="text-sm text-gray-600 dark:text-gray-300">
//                 <span className="font-medium text-secondary dark:text-blue-400">
//                   Click to upload
//                 </span>{' '}
//                 or drag and drop
//               </p>
//               <p className="text-xs text-gray-500 dark:text-gray-400">
//                 Only 500×500px images (max 500KB)
//               </p>
//             </div>
//             <label
//               htmlFor="file-upload"
//               className="cursor-pointer inline-flex items-center px-4 py-2 bg-secondary text-white rounded-md transition"
//             >
//               <FiUpload className="h-4 w-4 mr-2" />
//               Select Files
//             </label>
//             <input
//               id="file-upload"
//               type="file"
//               multiple
//               accept="image/*"
//               onChange={handleChooseFiles}
//               className="hidden"
//             />
//           </div>
//         </div>

//         <div className="flex flex-wrap items-center gap-3">
//           <button
//             onClick={handleUpload}
//             disabled={isLoading || selectedFiles.length === 0}
//             className={`flex items-center px-4 py-2 rounded-md text-white transition ${selectedFiles.length === 0 || isLoading
//                 ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
//                 : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
//               }`}
//           >
//             {isLoading ? (
//               <>
//                 <FaSpinner className="h-4 w-4 mr-2 animate-spin" />
//                 Uploading...
//               </>
//             ) : (
//               <>
//                 <FiSend className="h-4 w-4 mr-2" />
//                 Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
//               </>
//             )}
//           </button>

//           <button
//             onClick={resetImage}
//             disabled={isLoading || selectedFiles.length === 0}
//             className={`flex items-center px-4 py-2 rounded-md transition ${selectedFiles.length === 0 || isLoading
//                 ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
//                 : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
//               }`}
//           >
//             <FiTrash2 className="h-4 w-4 mr-2" />
//             Clear Selection
//           </button>
//         </div>

//         {selectedFiles.length > 0 && (
//           <div className="space-y-3">
//             <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
//               Selected Images ({selectedFiles.length})
//             </h3>
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//               {selectedFiles.map((file, index) => (
//                 <div
//                   key={index}
//                   className="relative group aspect-square rounded-lg overflow-hidden shadow-sm border dark:border-gray-700"
//                 >
//                   <img
//                     src={URL.createObjectURL(file)}
//                     alt={`Preview ${index + 1}`}
//                     className="w-full h-full object-cover"
//                   />
//                   {index === 0 && (
//                     <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md shadow">
//                       Main
//                     </span>
//                   )}
//                   <button
//                     onClick={() => removeImage(file.name)}
//                     className="absolute top-2 right-2 p-1 bg-white/90 dark:bg-gray-800/90 rounded-full shadow hover:bg-white dark:hover:bg-gray-700 transition opacity-0 group-hover:opacity-100"
//                   >
//                     <FiX className="h-4 w-4 text-red-500" />
//                   </button>
//                   <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
//                     <p className="text-xs text-white truncate">{file.name}</p>
//                     <p className="text-xs text-white/80">{(file.size / 1024).toFixed(1)}KB</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {(images?.length > 0 || singleProduct?.images?.length > 0) && (
//           <div className="space-y-3">
//             <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
//               Uploaded Images ({images?.length || singleProduct?.images?.length})
//             </h3>
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//               {( singleProduct?.images || images)?.map((img, index) => (
//                 <div
//                   key={index}
//                   className="relative group aspect-square rounded-lg overflow-hidden shadow-sm border dark:border-gray-700"
//                 >
//                   <img
//                     src={getImageUrl(img)}
//                     alt={`Product ${index + 1}`}
//                     className="w-full h-full object-cover"
//                   />
//                   {index === 0 && (
//                     <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-md shadow">
//                       Main
//                     </span>
//                   )}
//                   <button
//                     onClick={() => handleDeleteImage(singleProduct?.productId, img)}
//                     disabled={isDeleting}
//                     className="absolute top-2 right-2 p-1 bg-white/90 dark:bg-gray-800/90 rounded-full shadow hover:bg-white dark:hover:bg-gray-700 transition opacity-0 group-hover:opacity-100"
//                   >
//                     {isDeleting ? (
//                       <FaSpinner className="h-4 w-4 animate-spin text-gray-500" />
//                     ) : (
//                       <FiX className="h-4 w-4 text-red-500" />
//                     )}
//                   </button>
//                   <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
//                     <p className="text-xs text-white truncate">
//                       {img?.name || (isExistingProductImage(img) ? 'Existing Image' : `Image ${index + 1}`)}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default ImageUploader;


// Inside ImageUploader.jsx
import React, { useState } from 'react';
import { FiUploadCloud, FiSend, FiTrash2, FiX, FiUpload } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import useImageUploadStore from '../../Context/ImageUploadContext';

const ImageUploader = ({ control, setValue, singleProduct, setIsImageSelected, setIsImageUpload, watch, isEditing }) => {
  const { uploadFiles, isLoading, deleteImage, isDeleting, deleteProductImage } = useImageUploadStore();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const images = watch('images') || [];

  const handleChooseFiles = async (e) => {
    const files = Array.from(e.target.files || e.dataTransfer.files);
    await validateAndSetFiles(files);
  };

  const validateAndSetFiles = async (files) => {
    const validImages = [];

    for (const file of files) {
      const image = new Image();
      const objectUrl = URL.createObjectURL(file);

      const isValid = await new Promise((resolve) => {
        image.onload = () => {
          const is500x500 = image.width === 500 && image.height === 500;
          const isUnder500KB = file.size <= 500 * 1024;
          URL.revokeObjectURL(objectUrl);
          resolve(is500x500 && isUnder500KB);
        };
        image.onerror = () => resolve(false);
        image.src = objectUrl;
      });

      if (isValid) {
        validImages.push(file);
      } else {
        const sizeKB = (file.size / 1024).toFixed(2);
        alert(`"${file.name}" is either not 500x500 pixels or larger than 500KB (${sizeKB}KB). It will be skipped.`);
      }
    }

    if (validImages.length > 0) {
      setIsImageSelected(true);
    }

    setSelectedFiles(prev => [...prev, ...validImages]);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    try {
      const uploaded = await uploadFiles(selectedFiles);
      if (uploaded) {
        setIsImageUpload(true);
        setValue('images', [...images, ...uploaded]); // update form images
        setSelectedFiles([]);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  const handleDeleteImage = async (productId, image) => {
    try {
      if (isEditing) {
        await deleteProductImage(productId, image.imageId);
      } else {
        await deleteImage(image.imageId);
      }

      // Update images list immediately
      const newImages = images.filter((img) => {
        if (typeof img === 'string') return img !== image.imageId;
        return img.imageId !== image.imageId;
      });
      setValue('images', newImages);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const removeImage = (name) => {
    setSelectedFiles(prev => prev.filter((e) => e.name !== name));
  };

  const resetImage = () => {
    setSelectedFiles([]);
  };

  const getImageUrl = (img) => {
    if (typeof img === 'string') return img;
    return img.imageUrl || img.url;
  };

  return (
    <section className="space-y-6">
      {/* Uploader Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
          }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleChooseFiles(e); }}
      >
        <div className="flex flex-col items-center space-y-3">
          <FiUploadCloud className="h-10 w-10 text-gray-400" />
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-secondary">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">Only 500×500px images (max 500KB)</p>
          </div>
          <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center px-4 py-2 bg-secondary text-white rounded-md">
            <FiUpload className="h-4 w-4 mr-2" />
            Select Files
          </label>
          <input id="file-upload" type="file" multiple accept="image/*" onChange={handleChooseFiles} className="hidden" />
        </div>
      </div>

      {/* Upload and Clear Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleUpload}
          type='button'
          disabled={isLoading || selectedFiles.length === 0}
          className={`flex items-center px-4 py-2 rounded-md text-white transition ${selectedFiles.length === 0 || isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {isLoading ? <><FaSpinner className="h-4 w-4 mr-2 animate-spin" />Uploading...</> : <><FiSend className="h-4 w-4 mr-2" />Upload ({selectedFiles.length})</>}
        </button>

        <button
          onClick={resetImage}
          type='button'
          disabled={isLoading || selectedFiles.length === 0}
          className={`flex items-center px-4 py-2 rounded-md ${selectedFiles.length === 0 || isLoading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 hover:bg-gray-200'
            }`}
        >
          <FiTrash2 className="h-4 w-4 mr-2" />
          Clear Selection
        </button>
      </div>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Selected Images ({selectedFiles.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group aspect-square rounded-lg overflow-hidden shadow-sm border">
                <img src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(file.name)}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100 transition opacity-0 group-hover:opacity-100"
                >
                  <FiX className="h-4 w-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded Images Section */}
      {images?.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Uploaded Images ({images.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((img, index) => (
              <div key={index} className="relative group aspect-square rounded-lg overflow-hidden shadow-sm border">
                <img src={getImageUrl(img)} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => handleDeleteImage(singleProduct?.productId, img)}
                  disabled={isDeleting}
                  type='button'
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100 transition opacity-0 group-hover:opacity-100"
                >
                  <FiX className="h-4 w-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ImageUploader;
