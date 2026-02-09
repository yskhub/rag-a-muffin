import React, { useState, useRef } from 'react';
import { documentsApi } from '../services/api';

const DocumentUpload = ({ onUploadComplete }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState(null);
    const fileRef = useRef();

    const handleFile = async (file) => {
        if (!file.name.endsWith('.pdf')) { setMessage({ type: 'error', text: 'Only PDF files allowed' }); return; }
        if (file.size > 10 * 1024 * 1024) { setMessage({ type: 'error', text: 'Max 10MB' }); return; }

        setUploading(true); setProgress(0); setMessage(null);
        try {
            const result = await documentsApi.uploadDocument(file, setProgress);
            setMessage({ type: 'success', text: `Uploaded: ${result.filename} (${result.chunks} chunks)` });
            onUploadComplete?.();
        } catch (e) {
            setMessage({ type: 'error', text: 'Upload failed' });
        } finally { setUploading(false); }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-bold mb-4">📄 Upload Documents</h3>
            <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-blue-300">
                <input ref={fileRef} type="file" accept=".pdf" onChange={e => e.target.files[0] && handleFile(e.target.files[0])} className="hidden" />
                <div className="text-4xl mb-2">📁</div>
                <p className="text-gray-600">Click to upload PDF (max 10MB)</p>
            </div>
            {uploading && <div className="mt-4 w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progress}%` }} /></div>}
            {message && <div className={`mt-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message.text}</div>}
        </div>
    );
};

export default DocumentUpload;
