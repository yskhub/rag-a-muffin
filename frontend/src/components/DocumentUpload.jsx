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
            setMessage({ type: 'error', text: 'ERR_INVALID_FORMAT_PDF_REQUIRED' });
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'ERR_FILE_OVER_LIMIT_10MB' });
            return;
        }

        setUploading(true);
        setProgress(0);
        setMessage(null);
        try {
            await documentsApi.uploadDocument(file, (p) => setProgress(p));
            setMessage({ type: 'success', text: 'TRANSMISSION_COMPLETE_INDEXED' });
            onUploadComplete?.();
        } catch (e) {
            setMessage({ type: 'error', text: 'ERR_EXTRACTION_FAILURE' });
        } finally {
            setUploading(false);
        }
    };

    return (
        <GlassCard className="flex flex-col gap-6 h-full relative overflow-hidden group">
            <h4 className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Knowledge_Intake_Gateway</h4>

            <div
                onClick={() => !uploading && fileRef.current?.click()}
                className={`
                    flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all duration-500
                    ${uploading
                        ? 'border-primary/5 cursor-not-allowed opacity-40'
                        : 'border-primary/10 hover:border-primary/40 hover:bg-primary/5 bg-black/20'
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

                <div className="text-4xl mb-6 opacity-20 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_10px_#00f0ff]">📁</div>

                <p className="text-white text-[11px] font-bold uppercase tracking-widest mb-2 font-heading">
                    {uploading ? 'UPLOADING_PACKET...' : 'DEPLOY_SOURCE_FILE'}
                </p>
                <p className="text-primary/20 text-[9px] font-mono uppercase tracking-[0.2em]">
                    PDF_ONLY // 10MB_LIMIT
                </p>
            </div>

            {uploading && (
                <div className="space-y-3 animate-slide-up">
                    <div className="flex justify-between text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                        <span>Ingestion...</span>
                        <span className="font-mono">{progress}%</span>
                    </div>
                    <div className="w-full bg-primary/10 rounded-full h-1 overflow-hidden shadow-inner">
                        <div
                            className="bg-primary h-full transition-all duration-300 shadow-[0_0_10px_#00f0ff]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {message && (
                <div className={`p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-4 animate-slide-up ${message.type === 'success'
                        ? 'bg-green-500/5 border border-green-500/20 text-green-500/80'
                        : 'bg-red-500/5 border border-red-500/20 text-red-500/80'
                    }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                    {message.text}
                </div>
            )}
        </GlassCard>
    );
};

export default DocumentUpload;
