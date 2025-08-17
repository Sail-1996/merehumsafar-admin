import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';

const useImageUploadStore = create((set, get) => ({
    uploadedFiles: [], // [{ imageId, imageUrl }]
    isLoading: false,
    error: null,
    isDeleting: false,

    uploadFiles: async (files) => {
        set({ isLoading: true, error: null });

        try {
            const formData = new FormData();
            if (Array.isArray(files)) {
                files.forEach((file) => formData.append('files', file));
            } else {
                formData.append('files', files);
            }

            const response = await axiosInstance.post(
                '/image-entities/batch-upload',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            // Extract and format files
            const formattedFiles = response?.data?.map((file) => ({
                imageId: file.image?.imageId,
                imageUrl: file.image?.imageUrl,
            }));

            const currentFiles = get().uploadedFiles || [];
            set({
                uploadedFiles: [...currentFiles, ...formattedFiles],
                isLoading: false,
            });

            return formattedFiles;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    deleteImage: async (imageId) => {
        set({ isDeleting: true, error: null });

        try {
           const response = await axiosInstance.delete(`/image-entities/${imageId}`);

            const currentFiles = get().uploadedFiles || [];
            console.log('All files before filter:', currentFiles);

            const updatedFiles = currentFiles.filter(file => {
                return file?.imageId && file.imageId !== imageId;
            });

            console.log('Deleting imageId:', imageId);
            console.log('Current files before delete:', currentFiles);


            set({ uploadedFiles: updatedFiles, isDeleting: false });

            return ;
        } catch (error) {
            set({ error: error.message, isDeleting: false });
            throw error;
        }

        
    },
      deleteProductImage: async (productId,imageId)=> {
        try {
          set({ loading: true, error: null });
    
          const response = await axiosInstance.delete(`/products/${productId}/images/${imageId}`);
          const updatedFiles = currentFiles.filter(file => {
            return file?.imageId && file.imageId !== imageId;
        });
      
            set({ uploadedFiles: updatedFiles, isDeleting: false });
    
    
          return { success: true }; 
        } catch (error) {
          set({ error: error.message });
          return { success: false, error: error.message }; // ✅ also return failure info
        } finally {
          set({ loading: false });
        }
      },

    reset: () => set({ uploadedFiles: [], error: null, isLoading: false }),
}));

export default useImageUploadStore;
