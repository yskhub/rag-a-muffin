import React, { useState, useRef } from 'react';
import { documentsApi } from '../services/api';
import GlassCard from './ui/GlassCard';

const DocumentUpload = ({ onUploadComplete }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState(null);
    const fileRef = useRef();

    const handleFile = async (file) => {
        if (!file.name.endsWith('.pdf')) {
            setMessage({ type: 'error', text: 'Only PDF files are supported.' });
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'File size must be under 10MB.' });
            return;
        }

        setUploading(true);
        setProgress(0);
        setMessage(null);
        try {
            await documentsApi.uploadDocument(file, (p) => setProgress(p));
            setMessage({ type: 'success', text: 'Document indexed successfully.' });
            onUploadComplete?.();
        } catch (e) {
            setMessage({ type: 'error', text: 'Upload failed. Please try again.' });
        } finally {
            setUploading(false);
        }
    };

    return (
        <GlassCard className="flex flex-col gap-4">
            <h4 className="text-[11px] font-semibold text-slate-400">Upload Document</h4>

            <div
                onClick={() => !uploading && fileRef.current?.click()}
                className={`
                    flex-1 border border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all
                    ${uploading
                        ? 'border-white/[0.04] cursor-not-allowed opacity-40'
                        : 'border-white/[0.08] hover:border-primary/30 hover:bg-primary/[0.02]'
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
                <div className="text-2xl mb-3 opacity-30">📄</div>
                <p className="text-[11px] font-medium text-slate-400 mb-1">
                    {uploading ? 'Uploading...' : 'Click to upload PDF'}
                </p>
                <p className="text-[9px] text-slate-600">Max 10MB</p>
            </div>

            {uploading && (
                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Processing...</span>
                        <span className="font-mono">{progress}%</span>
                    </div>
                    <div className="w-full bg-white/[0.04] rounded-full h-1 overflow-hidden">
                        <div
                            className="bg-primary h-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {message && (
                <div className={`px-3 py-2 rounded-lg text-[10px] font-medium flex items-center gap-2 ${message.type === 'success'
                        ? 'bg-emerald-500/5 border border-emerald-500/15 text-emerald-400'
                        : 'bg-red-500/5 border border-red-500/15 text-red-400'
                    }`}>
                    <div className={`w-1 h-1 rounded-full ${message.type === 'success' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    {message.text}
                </div>
            )}
        </GlassCard>
    );
};

export default DocumentUpload;
