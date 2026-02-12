import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { documentsApi, adminApi } from '../services/api';
import DocumentUpload from './DocumentUpload';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ total_documents: 0 });
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setError(null);
            const [s, src] = await Promise.all([
                documentsApi.getStats().catch(err => {
                    console.error("Stats fetch error:", err);
                    return { total_documents: 0 };
                }),
                documentsApi.getSources().catch(err => {
                    console.error("Sources fetch error:", err);
                    return { sources: [] };
                })
            ]);

            setStats(s || { total_documents: 0 });
            setSources(src?.sources || []);
        } catch (e) {
            console.error("Critical admin data fetch failure:", e);
            setError("Failed to synchronize with Knowledge Engine.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSeed = async () => {
        try {
            await adminApi.seedSampleData();
            await fetchData();
        } catch (e) {
            console.error("Seeding error:", e);
        }
    };

    const handleDelete = async (name) => {
        try {
            await documentsApi.deleteDocument(name);
            await fetchData();
        } catch (e) {
            console.error("Delete error:", e);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#020408] flex items-center justify-center">
            <div className="relative">
                <div className="animate-spin h-10 w-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full" />
                <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-10" />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020408] text-gray-200 selection:bg-indigo-500/30 font-sans p-6 md:p-12 relative overflow-hidden">
            <div className="grid-bg" />

            {/* Background Glows */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-5xl mx-auto space-y-12 relative">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 animate-slide-up">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-4 uppercase">
                            <span className="w-10 h-10 bg-white/[0.03] rounded-xl border border-white/5 flex items-center justify-center text-xl">⚙️</span>
                            System Control
                        </h1>
                        <p className="text-gray-500 text-[10px] font-bold tracking-[0.3em] uppercase pl-1">Knowledge Engine Management</p>
                    </div>
                    <Link to="/" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-indigo-600/20">
                        ← Exit System
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-500/5 border border-red-500/10 text-red-100 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-slide-up">
                        <span>⚠️</span> {error}
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
                    {[
                        { label: 'Neural Vectors', value: stats?.total_documents || 0, icon: '📊' },
                        { label: 'Active Fragments', value: sources.length, icon: '📁' },
                        { label: 'Compute Cost', value: '$0.00', icon: '💰' }
                    ].map((item, i) => (
                        <div key={i} className="glass p-8 rounded-[32px] border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 text-3xl opacity-5 group-hover:opacity-10 transition-opacity">
                                {item.icon}
                            </div>
                            <p className="text-gray-600 text-[9px] font-black uppercase tracking-[0.2em] mb-4">{item.label}</p>
                            <p className="text-4xl font-black text-white tracking-tight">{item.value}</p>
                        </div>
                    ))}
                </div>

                {/* Tools Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <div className="glass p-8 rounded-[32px] border border-white/5">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3 text-indigo-400">
                            Core_Operations
                        </h3>
                        <div className="space-y-4">
                            <button onClick={handleSeed} className="w-full flex items-center justify-between px-6 py-4 bg-indigo-500/5 border border-indigo-500/10 text-indigo-400 rounded-xl hover:bg-indigo-500/10 font-black text-[10px] uppercase tracking-widest transition-all">
                                Seed_Sample_Dataset
                                <span>🌱</span>
                            </button>
                            <button onClick={fetchData} className="w-full flex items-center justify-between px-6 py-4 bg-white/[0.02] border border-white/5 text-gray-500 hover:text-white rounded-xl hover:bg-white/[0.05] font-black text-[10px] uppercase tracking-widest transition-all">
                                Sync_Engine_Status
                                <span>🔄</span>
                            </button>
                        </div>
                    </div>
                    <DocumentUpload onUploadComplete={fetchData} />
                </div>

                {/* Knowledge Base */}
                <div className="glass p-8 rounded-[32px] border border-white/5 animate-slide-up" style={{ animationDelay: '300ms' }}>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-indigo-400">
                        Ingested_Knowledge_Base
                    </h3>
                    {sources.length === 0 ? (
                        <div className="text-gray-600 text-center py-20 bg-white/[0.01] rounded-3xl border-2 border-dashed border-white/5 text-[10px] font-black uppercase tracking-widest">
                            No knowledge fragments localized.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {sources.map(s => (
                                <div key={s} className="flex justify-between items-center bg-white/[0.01] hover:bg-white/[0.03] rounded-xl px-5 py-4 border border-white/5 transition-all group/item">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-10 h-10 bg-indigo-500/5 rounded-lg flex items-center justify-center text-indigo-500 text-sm">📄</div>
                                        <span className="font-bold text-xs text-gray-400 truncate pr-4">{s}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(s)}
                                        className="text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md bg-red-500/5 border border-red-500/10 hover:border-red-500/20 text-red-500/50 hover:text-red-500 transition-all opacity-0 group-hover/item:opacity-100"
                                    >
                                        Expunge
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
