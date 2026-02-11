import React, { useState, useEffect } from 'react';
import { documentsApi, adminApi } from '../services/api';
import DocumentUpload from './DocumentUpload';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [s, src] = await Promise.all([documentsApi.getStats(), documentsApi.getSources()]);
            setStats(s); setSources(src.sources || []);
        } catch (e) {
            console.error("Failed to fetch admin data", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSeed = async () => { await adminApi.seedSampleData(); fetchData(); };
    const handleDelete = async (name) => { await documentsApi.deleteDocument(name); fetchData(); };

    if (loading) return (
        <div className="min-h-screen bg-[#0c0e14] flex items-center justify-center">
            <div className="relative">
                <div className="animate-spin h-14 w-14 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full" />
                <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20" />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0c0e14] text-gray-200 selection:bg-indigo-500/30 font-sans p-6 md:p-12 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-5xl mx-auto space-y-10 relative">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-slide-up">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
                            <span className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-inner">⚙️</span>
                            Admin Control
                        </h1>
                        <p className="text-gray-500 font-medium tracking-wide pl-1">Knowledge Engine Management</p>
                    </div>
                    <a href="/" className="px-8 py-3.5 bg-white text-black font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-white/5">
                        ← Return to Interface
                    </a>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
                    {[
                        { label: 'Total Vectors', value: stats?.total_documents || 0, icon: '📊', color: 'indigo' },
                        { label: 'Active Sources', value: sources.length, icon: '📁', color: 'purple' },
                        { label: 'Compute Cost', value: '$0.00', icon: '💰', color: 'green' }
                    ].map((item, i) => (
                        <div key={i} className="glass p-8 rounded-[32px] border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 text-4xl opacity-10 group-hover:opacity-20 transition-opacity">
                                {item.icon}
                            </div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">{item.label}</p>
                            <p className="text-4xl font-bold text-white tracking-tight">{item.value}</p>
                        </div>
                    ))}
                </div>

                {/* Tools Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <div className="glass p-8 rounded-[32px] border border-white/5">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
                            <span className="text-indigo-400">⚡</span>
                            Core Operations
                        </h3>
                        <div className="space-y-4">
                            <button onClick={handleSeed} className="w-full flex items-center justify-between p-5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-2xl hover:bg-indigo-500/20 font-bold transition-all group">
                                Seed Sample Dataset
                                <span className="group-hover:translate-x-1 transition-transform">🌱</span>
                            </button>
                            <button onClick={fetchData} className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/10 text-gray-300 rounded-2xl hover:bg-white/10 font-bold transition-all group">
                                Refresh Engine Status
                                <span className="group-hover:rotate-180 transition-transform duration-500">🔄</span>
                            </button>
                        </div>
                    </div>
                    <DocumentUpload onUploadComplete={fetchData} />
                </div>

                {/* Knowledge Base */}
                <div className="glass p-8 rounded-[32px] border border-white/5 animate-slide-up" style={{ animationDelay: '300ms' }}>
                    <h3 className="text-xl font-bold mb-8 flex items-center gap-3 text-white">
                        <span className="text-indigo-400">📚</span>
                        Ingested Knowledge
                    </h3>
                    {sources.length === 0 ? (
                        <div className="text-gray-500 text-center py-16 bg-white/[0.01] rounded-3xl border-2 border-dashed border-white/5 font-medium">
                            No knowledge sources found. Start by uploading or seeding data.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {sources.map(s => (
                                <div key={s} className="flex justify-between items-center bg-white/5 hover:bg-white/[0.08] rounded-2xl px-6 py-4 border border-white/5 transition-all group/item">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">📄</div>
                                        <span className="font-bold text-gray-200 truncate pr-4">{s}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(s)}
                                        className="text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl bg-red-400/5 border border-red-400/10 hover:border-red-400/20 transition-all opacity-0 group-hover/item:opacity-100"
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
