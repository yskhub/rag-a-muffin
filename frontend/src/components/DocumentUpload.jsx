import React, { useState, useRef } from 'react';
import { documentsApi } from '../services/api';

const DocumentUpload = ({ onUploadComplete }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState(null);
    const fileRef = useRef();

    const handleFile = async (file) => {
        if (!file.name.endsWith('.pdf')) {
            setMessage({ type: 'error', text: 'Only PDF files supported' });
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'Size exceeds 10MB limit' });
            return;
        }

        setUploading(true);
        setProgress(0);
        setMessage(null);
        try {
            const result = await documentsApi.uploadDocument(file, (p) => setProgress(p));
            setMessage({ type: 'success', text: `Successfully indexed: ${result.filename}` });
            onUploadComplete?.();
        } catch (e) {
            setMessage({ type: 'error', text: 'Knowledge extraction failed' });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="glass p-8 rounded-[32px] border border-white/5 relative overflow-hidden group">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
                <span className="text-indigo-400">📥</span>
                Knowledge Intake
            </h3>

            <div
                onClick={() => !uploading && fileRef.current?.click()}
                className={`
                    border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300
                    ${uploading
                        ? 'border-indigo-500/10 cursor-not-allowed opacity-50'
                        : 'border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/[0.02] group-hover:scale-[0.99]'
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

                <div className="relative inline-block mb-4">
                    <div className="text-5xl group-hover:scale-110 transition-transform duration-300">📄</div>
                    {uploading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>

                <p className="text-gray-300 font-bold mb-1">
                    {uploading ? 'Processing Knowledge...' : 'Deploy PDF Source'}
                </p>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">
                    MAX 10MB &bull; 100% SECURE
                </p>
            </div>

            {uploading && (
                <div className="mt-6 space-y-2 animate-slide-up">
                    <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-indigo-400">
                        <span>Ingestion Progress</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {message && (
                <div className={`mt-6 p-4 rounded-2xl text-xs font-bold flex items-center gap-3 animate-slide-up ${message.type === 'success'
                        ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                        : 'bg-red-500/10 border border-red-500/20 text-red-400'
                    }`}>
                    <span>{message.type === 'success' ? '✅' : '❌'}</span>
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default DocumentUpload;
