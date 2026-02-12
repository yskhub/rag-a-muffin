import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { documentsApi, adminApi } from '../services/api';
import DocumentUpload from './DocumentUpload';
import GlassCard from './ui/GlassCard';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ total_documents: 0 });
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [seeding, setSeeding] = useState(false);

    const fetchData = async () => {
        try {
            setError(null);
            const [s, src] = await Promise.all([
                documentsApi.getStats().catch(() => ({ total_documents: 0 })),
                documentsApi.getSources().catch(() => ({ sources: [] }))
            ]);
            setStats(s || { total_documents: 0 });
            setSources(src?.sources || []);
        } catch (e) {
            setError("Failed to connect to backend");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSeed = async () => {
        setSeeding(true);
        try { await adminApi.seedSampleData(); await fetchData(); } catch (e) { }
        setSeeding(false);
    };

    const handleDelete = async (name) => {
        try { await documentsApi.deleteDocument(name); fetchData(); } catch (e) { }
    };

    if (loading) return (
        <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
                <div>
                    <h2 className="font-heading text-xl font-semibold text-white">Admin Dashboard</h2>
                    <p className="text-[11px] text-slate-500 mt-1">Manage documents, seed data, and monitor the knowledge base.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchData} className="px-4 py-2 text-[11px] font-medium text-slate-400 bg-white/[0.03] border border-white/[0.06] rounded-lg hover:bg-white/[0.06] transition-all">
                        Refresh
                    </button>
                    <Link to="/">
                        <button className="px-4 py-2 text-[11px] font-medium text-primary bg-primary/5 border border-primary/15 rounded-lg hover:bg-primary/10 transition-all">
                            ← Back to Chat
                        </button>
                    </Link>
                </div>
            </div>

            {error && (
                <div className="px-4 py-3 bg-red-500/5 border border-red-500/15 text-red-400 rounded-xl text-[11px] font-medium flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    {error}
                </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Stats */}
                    <div className="space-y-4">
                        <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Knowledge Base Stats</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { l: 'Indexed Documents', v: stats.total_documents, color: 'text-primary' },
                                { l: 'Active Sources', v: sources.length, color: 'text-emerald-400' },
                                { l: 'Engine Cost', v: '$0.00', color: 'text-white' },
                                { l: 'Uptime', v: '99.9%', color: 'text-violet-400' },
                            ].map((m, i) => (
                                <GlassCard key={i} className="!p-5 text-center">
                                    <p className="text-[9px] font-medium text-slate-500 uppercase tracking-wider mb-2">{m.l}</p>
                                    <p className={`text-2xl font-heading font-bold ${m.color} tracking-tight`}>{m.v}</p>
                                </GlassCard>
                            ))}
                        </div>
                    </div>

                    {/* Operations */}
                    <div className="space-y-4">
                        <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Operations</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <GlassCard className="flex flex-col gap-4">
                                <h4 className="text-[11px] font-semibold text-slate-400">Seed Sample Data</h4>
                                <button
                                    onClick={handleSeed}
                                    disabled={seeding}
                                    className="px-4 py-3 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold rounded-lg hover:bg-primary/20 disabled:opacity-30 transition-all"
                                >
                                    {seeding ? 'Seeding...' : 'Initialize Sample Data'}
                                </button>
                                <p className="text-[10px] text-slate-600 leading-relaxed">
                                    Inject default knowledge fragments into ChromaDB to populate the RAG context index.
                                </p>
                            </GlassCard>
                            <DocumentUpload onUploadComplete={fetchData} />
                        </div>
                    </div>
                </div>

                {/* Document Sources */}
                <div className="space-y-4">
                    <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Indexed Sources · {sources.length} documents
                    </h3>
                    <GlassCard noPadding>
                        {sources.length === 0 ? (
                            <div className="py-16 text-center">
                                <p className="text-sm text-slate-600">No documents indexed yet.</p>
                                <p className="text-[11px] text-slate-700 mt-1">Upload documents or seed sample data to get started.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/[0.04]">
                                {sources.map(s => (
                                    <div key={s} className="px-5 py-4 flex justify-between items-center hover:bg-white/[0.02] transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-[11px]">📄</div>
                                            <span className="text-sm font-medium text-slate-300">{s}</span>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(s)}
                                            className="text-[10px] font-medium text-red-500/30 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-500/5"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
