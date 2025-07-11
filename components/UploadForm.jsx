'use client';

import { useEffect, useState } from 'react';

export default function UploadForm() {
    const [image, setImage] = useState (null);
    const [previewUrl, setPreviewUrl] = useState (null);
    const [uploadedUrl, setUploadedUrl] = useState (null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImage(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleUpload = async () => {
        if (!image) return;

        const formData = new FormData();
        formData.append('file', image);

        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        console.log(data.data.url);
        
        setUploadedUrl(data.data.url);
    };
useEffect(()=>{
    console.log(uploadedUrl);
    
},[uploadedUrl])
    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>

            {/* Preview before upload */}
            {previewUrl && (
                <div className="mt-4">
                    <p className="text-sm text-gray-500">Preview:</p>
                    <img src={previewUrl} alt="Preview" className="w-64" />
                </div>
            )}

            {/* Display uploaded image */}
            {uploadedUrl && (
                <div className="mt-4">
                    <p className="text-sm text-green-500">Uploaded:</p>
                    <img src={uploadedUrl} alt="Uploaded" className="w-64" />
                </div>
            )}
        </div>
    );
}
