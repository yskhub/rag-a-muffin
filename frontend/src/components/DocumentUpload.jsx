import React, { useState, useRef } from 'react';
import { documentsApi } from '../services/api';

const DocumentUpload = ({ onUploadComplete }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState(null);
    const fileRef = useRef();

    const handleFile = async (file) => {
        if (!file.name.endsWith('.pdf')) {
            setMessage({ type: 'error', text: 'ERR: PDF_REQUIRED' });
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'ERR: OVER_LIMIT [10MB]' });
            return;
        }

        setUploading(true);
        setProgress(0);
        setMessage(null);
        try {
            const result = await documentsApi.uploadDocument(file, (p) => setProgress(p));
            setMessage({ type: 'success', text: `SUCCESS: ${result.filename} INDEXED` });
            onUploadComplete?.();
        } catch (e) {
            setMessage({ type: 'error', text: 'ERR: EXTRACTION_FAILED' });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="glass p-8 rounded-[32px] border border-white/5 relative overflow-hidden group">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-indigo-400">
                Knowledge_Intake
            </h3>

            <div
                onClick={() => !uploading && fileRef.current?.click()}
                className={`
                    border border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300
                    ${uploading
                        ? 'border-indigo-500/10 cursor-not-allowed opacity-50'
                        : 'border-white/10 hover:border-indigo-500/40 hover:bg-white/[0.01]'
                    }
                `}
            >
                <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf"
                    onChange={e => e.target.files[0] && handleFile(e.target.files[0])}
                    className="hidden"
                />

                <div className="text-4xl mb-6 opacity-30 group-hover:opacity-100 transition-opacity">📥</div>

                <p className="text-white text-[10px] font-black uppercase tracking-widest mb-2">
                    {uploading ? 'Processing_Packet...' : 'Deploy_Source_File'}
                </p>
                <p className="text-gray-600 text-[8px] font-black uppercase tracking-widest">
                    PDF Only &bull; 10MB Max
                </p>
            </div>

            {uploading && (
                <div className="mt-8 space-y-3 animate-slide-up">
                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-indigo-400">
                        <span>Ingestion_Progress</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                        <div
                            className="bg-indigo-500 h-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {message && (
                <div className={`mt-8 p-4 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-3 animate-slide-up ${message.type === 'success'
                        ? 'bg-green-500/5 border border-green-500/10 text-green-400/80'
                        : 'bg-red-500/5 border border-red-500/10 text-red-400/80'
                    }`}>
                    <span>{message.type === 'success' ? '✔' : '✘'}</span>
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default DocumentUpload;
