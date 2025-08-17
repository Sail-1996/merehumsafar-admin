

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { InputText } from 'primereact/inputtext';
// import { InputTextarea } from 'primereact/inputtextarea';
// import { FileUpload } from 'primereact/fileupload';
// import CustomButton from '../../systemdesign/CustomeButton';
// import { Button } from 'primereact/button';

// export default function AddSale() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     title: '',
//     subtitle: '',
//     description: '',
//     images: [],
//   });

//   const [previewImages, setPreviewImages] = useState([]);
//   const [error, setError] = useState('');

//   // Load images from localStorage on component mount
//   useEffect(() => {
//     const savedImages = JSON.parse(localStorage.getItem('selectedImages'));
//     const savedPreviews = JSON.parse(localStorage.getItem('previewImages'));

//     if (savedImages && savedPreviews) {
//       setFormData((prevData) => ({
//         ...prevData,
//         images: savedImages,
//       }));
//       setPreviewImages(savedPreviews);
//     }
//   }, []);

//   // Save images to localStorage when formData or previewImages change
//   useEffect(() => {
//     localStorage.setItem('selectedImages', JSON.stringify(formData.images));
//     localStorage.setItem('previewImages', JSON.stringify(previewImages));
//   }, [formData.images, previewImages]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Image Validation, Upload, and Preview
//   const onImageSelect = (event) => {
//     const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
//     const maxSize = 1024 * 1024; // 1MB
//     const selectedFiles = event.files;

//     // Check Total Image Count
//     if (selectedFiles.length + previewImages.length > 10) {
//       setError('You can upload a maximum of 10 images.');
//       setTimeout(() => setError(''), 5000);
//       return;
//     }

//     const validImages = [];
//     const previews = [];

//     for (let file of selectedFiles) {
//       // Validate File Type
//       if (!allowedTypes.includes(file.type)) {
//         setError('Please select a valid image file (png, jpeg, jpg, or webp).');
//         setTimeout(() => setError(''), 5000);
//         continue;
//       }

//       // Validate File Size
//       if (file.size > maxSize) {
//         setError('File size should be less than 1MB.');
//         setTimeout(() => setError(''), 5000);
//         continue;
//       }

//       // validImages.push(file);
//       previews.push(URL.createObjectURL(file));
//     }

//     // Only Update State with Valid Images
//     if (validImages.length > 0) {
//       setFormData((prevData) => ({
//         ...prevData,
//         images: [...prevData.images, ...validImages],
//       }));
//       setPreviewImages((prevImages) => [...prevImages, ...previews]);
//     }
//   };
//   const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: '  custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
  

//   // Delete Image
//   const handleDelete = (index) => {
//     const updatedImages = formData.images.filter((_, i) => i !== index);
//     const updatedPreviews = previewImages.filter((_, i) => i !== index);
//     setFormData({ ...formData, images: updatedImages });
//     setPreviewImages(updatedPreviews);
//   };

//   const handleSubmit = () => {
//     console.log('New Sale Added:', formData);
//     localStorage.removeItem('selectedImages');
//     localStorage.removeItem('previewImages');
//     navigate('/sale-list');
//   };

//   return (
//     <div className="h-screen">
//       <h3 className="heading mb-6 dark:text-gray-100 ">Add New Sale Detail</h3>

//       {/* Sale Information Section */}
//       <div className="border p-6 rounded-lg shadow bg-white mb-6 dark:text-gray-100 dark:bg-gray-800">
//         <h4 className="font-semibold mb-4 subheading dark:text-gray-100">Sale Information</h4>

//         <div className="mb-4 flex flex-col md:flex-row justify-between md:items-center">
//           <label className="block text mb-2 dark:text-gray-100">Title</label>
//           <InputText className="w-[100%] md:w-[70%] p-2 border rounded dark:text-gray-100 dark:bg-gray-800" name="title" value={formData.title} onChange={handleChange} placeholder="Title" />
//         </div>

//         <div className="mb-4 flex flex-col md:flex-row justify-between md:items-center">
//           <label className="block text mb-2 dark:text-gray-100">Subtitle</label>
//           <InputText className="w-[100%] md:w-[70%]  p-2 border rounded dark:text-gray-100 dark:bg-gray-800" name="subtitle" value={formData.subtitle} onChange={handleChange} placeholder="Subtitle" />
//         </div>

//         <div className='flex flex-col md:flex-row justify-between md:items-center'>
//           <label className="block text mb-2 dark:text-gray-100">Description</label>
//           <InputTextarea className="w-[100%] md:w-[70%]  p-2 border rounded dark:text-gray-100 dark:bg-gray-800" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
//         </div>
//       </div>

//       {/* Image Upload Section */}
//       <div className="border p-6 rounded-lg shadow bg-white mb-6 dark:text-gray-100 dark:bg-gray-800">
//         <div className=' mb-4'>
//         <h4 className="font-semibold subheading dark:text-gray-100">Upload Images</h4>
//         <p className='text-yellow-500 dark:text-gray-400 opacity-70 text-sm mt-1'>**Image should be below 1 MB and should have dimentions of 500X600 and type of .png / .jpeg / .webp**</p>
//         </div>

//         <FileUpload 
//           mode="basic" 
//           name="images[]" 
//           accept="image/png, image/jpeg, image/jpg, image/webp"
//           maxFileSize={1000000} 
//           // customUpload 
//           multiple 
//           chooseLabel="Select" 
//           uploadOptions={uploadOptions}
//           chooseOptions={{ className: 'bg-primary border-2 border-secondary text-secondary dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700  dark:border-gray-300' }}
//           onSelect={onImageSelect}
          

//         />

//         {error && <p className="text-red-600 mt-2">{error}</p>}

//         {/* <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"> */}
//           {/* {previewImages.map((image, index) => (
//             <div key={index} className="relative">
//               <img 
//                 src={image} 
//                 alt={`Preview ${index}`} 
//                 className="w-full h-auto rounded-lg shadow-lg object-cover"
//                 style={{ maxHeight: '200px' }}
//               />
//               <Button 
//                 icon="pi pi-times" 
//                 className="p-button-rounded p-button-danger p-button-sm absolute top-2 right-2"
//                 onClick={() => handleDelete(index)}
//               />
//             </div>
//           ))}
//         </div> */}
//       </div>

//       <div className="flex justify-center mt-6">
//         <CustomButton title={'Submit'}  onClick={handleSubmit} icon={'pi pi-save'}/>
//       </div>
//     </div>
//   );
// }





import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import CustomButton from '../../systemdesign/CustomeButton';
import { Button } from 'primereact/button';

export default function AddSale() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    images: [],
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [error, setError] = useState('');
  const [focusField, setFocusField] = useState('');

  useEffect(() => {
    const savedImagesStr = localStorage.getItem('selectedImages');
    const savedPreviewsStr = localStorage.getItem('previewImages');

    try {
      const savedImages = savedImagesStr ? JSON.parse(savedImagesStr) : [];
      const savedPreviews = savedPreviewsStr ? JSON.parse(savedPreviewsStr) : [];

      if (savedImages.length || savedPreviews.length) {
        setFormData((prevData) => ({
          ...prevData,
          images: savedImages,
        }));
        setPreviewImages(savedPreviews);
      }
    } catch (err) {
      console.error('Error parsing localStorage:', err);
      localStorage.removeItem('selectedImages');
      localStorage.removeItem('previewImages');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedImages', JSON.stringify(formData.images));
    localStorage.setItem('previewImages', JSON.stringify(previewImages));
  }, [formData.images, previewImages]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onImageSelect = (event) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const maxSize = 1024 * 1024;
    const selectedFiles = event.files;

    if (selectedFiles.length + previewImages.length > 10) {
      setError('You can upload a maximum of 10 images.');
      setTimeout(() => setError(''), 5000);
      return;
    }

    const validImages = [];
    const previews = [];

    for (let file of selectedFiles) {
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid image file (png, jpeg, jpg, or webp).');
        setTimeout(() => setError(''), 5000);
        continue;
      }

      if (file.size > maxSize) {
        setError('File size should be less than 1MB.');
        setTimeout(() => setError(''), 5000);
        continue;
      }

      validImages.push(file);
      previews.push(URL.createObjectURL(file));
    }

    if (validImages.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        images: [...prevData.images, ...validImages],
      }));
      setPreviewImages((prevImages) => [...prevImages, ...previews]);
    }
  };

  const uploadOptions = {
    icon: 'pi pi-fw pi-cloud-upload',
    iconOnly: true,
    className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined',
  };

  const handleDelete = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    const updatedPreviews = previewImages.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
    setPreviewImages(updatedPreviews);
  };

  const handleSubmit = () => {
    console.log('New Sale Added:', formData);
    localStorage.removeItem('selectedImages');
    localStorage.removeItem('previewImages');
    navigate('/sale-list');
  };

  const getFloatLabelClass = (field) => {
    const isActive = focusField === field || formData[field];
    return `p-float-label w-full md:w-[70%] ${isActive ? 'text-blue-500' : ''}`;
  };

  return (
    <div className="h-screen">
      <h3 className="heading mb-6 dark:text-gray-100">Add New Sale Detail</h3>

      {/* Sale Information Section */}
      <div className="border p-6 rounded-lg shadow bg-white mb-6 dark:text-gray-100 dark:bg-gray-800">
        <h4 className="font-semibold subheading dark:text-gray-100 mb-10">Sale Information</h4>

        <div className="mb-8 flex flex-col md:flex-row justify-between md:items-center">
          <div className={getFloatLabelClass('title')}>
            <InputText
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onFocus={() => setFocusField('title')}
              onBlur={() => setFocusField('')}
              className={`w-full border-b rounded bg-transparent text-gray-500 dark:text-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-0 focus:border-blue-500 peer ${
                formData.title ? 'border-blue-0' : 'border-gray-300'
              }`}
            />
            <label htmlFor="title" className='peer-focus:text-blue-500'>Title</label>
          </div>
        </div>

        <div className="mb-8 flex flex-col md:flex-row justify-between md:items-center">
          <div className={getFloatLabelClass('subtitle')}>
            <InputText
              id="subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              onFocus={() => setFocusField('subtitle')}
              onBlur={() => setFocusField('')}
              className={`w-full border-b rounded text-gray-500 bg-transparent dark:text-gray-100 focus:outline-none focus:ring-0 peer focus:border-blue-500 dark:bg-gray-800 ${
                formData.subtitle ? 'border-blue-0' : 'border-gray-300'
              }`}
            />
            <label htmlFor="subtitle" className='peer-focus:text-blue-500'>Subtitle</label>
          </div>
        </div>

        <div className="mb-6 flex flex-col md:flex-row justify-between md:items-center">
          <div className={getFloatLabelClass('description')}>
            <InputTextarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onFocus={() => setFocusField('description')}
              onBlur={() => setFocusField('')}
              rows={3}
              className={`w-full border-b text-gray-500 rounded bg-transparent focus:outline-none focus:ring-0 peer dark:text-gray-100 dark:bg-gray-800 focus:border-blue-500 ${
                formData.description ? 'border-blue-0' : 'border-gray-300'
              }`}
            />
            <label htmlFor="description" className='peer-focus:text-blue-500'>Description</label>
          </div>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="border p-6 rounded-lg shadow bg-white mb-6 dark:text-gray-100 dark:bg-gray-800">
        <div className="mb-4">
          <h4 className="font-semibold subheading dark:text-gray-100">Upload Images</h4>
          <p className="text-yellow-500 dark:text-gray-400 opacity-70 text-sm mt-1">
            **Image should be below 1 MB and should have dimensions of 500X600 and type of .png / .jpeg / .webp**
          </p>
        </div>

        <FileUpload
          mode="basic"
          name="images[]"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          maxFileSize={1000000}
          multiple
          chooseLabel="Select"
          uploadOptions={uploadOptions}
          chooseOptions={{
            className:
              'bg-primary border-2 border-secondary text-secondary dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700  dark:border-gray-300',
          }}
          onSelect={onImageSelect}
        />

        {error && <p className="text-red-600 mt-2">{error}</p>}

        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previewImages.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Preview ${index}`}
                className="w-full h-auto rounded-lg shadow-lg object-cover"
                style={{ maxHeight: '200px' }}
              />
              <Button
                icon="pi pi-times"
                className="p-button-rounded p-button-danger p-button-sm absolute top-2 right-2"
                onClick={() => handleDelete(index)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <CustomButton title={'Submit'} onClick={handleSubmit} icon={'pi pi-save'} />
      </div>
    </div>
  );
}

