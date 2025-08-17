import { create } from "zustand";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";

const usePdfUploadStore = create((set) => ({
    uploadedUrl: null,
    isUploading: false,
    error: null,

    uploadPdf: async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            set({ isUploading: true, error: null });

            const response = await axiosInstance.post("/files/upload-pdf",formData,
                {
                headers: {
                    "Content-Type": "multipart/form-data",
                    'skip_zrok_interstitial' : 'true'
                },
            });

            const fileUrl = response.data.url;
            set({ uploadedUrl: fileUrl, isUploading: false });
        } catch (err) {
            set({ error: err.message || "Upload failed", isUploading: false });
        }
    },
}));

export default usePdfUploadStore;
