import React, { useRef } from "react";
import usePdfUploadStore from "../../Context/PdfUpload";

export default function PdfUploader() {
    const inputRef = useRef(null);
    const { uploadPdf, uploadedUrl, isUploading, error } = usePdfUploadStore();

    const handleUpload = () => {
        const file = inputRef.current.files[0];
        if (file) {
            uploadPdf(file);
        }
    };

    return (
        <div className="p-4">
            <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                    const file = e.target.files[0];
                    usePdfUploadStore.getState().uploadPdf(file);
                }}
            />
            <button
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleUpload}
                disabled={isUploading}
            >
                {isUploading ? "Uploading..." : "Upload PDF"}
            </button>

            {uploadedUrl && (
                <p className="mt-3 text-green-600">
                    Uploaded PDF: <a href={uploadedUrl} className="underline" target="_blank">View</a>
                </p>
            )}

            {error && <p className="mt-3 text-red-600">Error: {error}</p>}
        </div>
    );
}
