import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { documentsApi, adminApi } from '../services/api';
import DocumentUpload from './DocumentUpload';
import GlassCard from './ui/GlassCard';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ total_documents: 0 });
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [seeding, setSeeding] = useState(false);
    const [clearing, setClearing] = useState(false);
    const [message, setMessage] = useState(null);

    const fetchData = async () => {
        try {
            setError(null);
            setRefreshing(true);
            const [s, src] = await Promise.all([
                documentsApi.getStats().catch(() => ({ total_documents: 0 })),
                documentsApi.getSources().catch(() => ({ sources: [] }))
            ]);
            setStats(s || { total_documents: 0 });
            setSources(src?.sources || []);
        } catch (e) {
            setError("Failed to connect to backend. Is the server running?");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSeed = async () => {
        setSeeding(true);
        setMessage(null);
        setError(null);
        try {
            await adminApi.seedSampleData();
            setMessage("✅ Sample data seeded successfully!");
            await fetchData();
        } catch (e) {
            setError("Failed to seed data. " + (e?.response?.data?.detail || e.message || ""));
        }
        setSeeding(false);
    };

    const handleClearAll = async () => {
        setClearing(true);
        setMessage(null);
        setError(null);
        try {
            await documentsApi.clearAll();
            setMessage("✅ All documents cleared!");
            await fetchData();
        } catch (e) {
            setError("Failed to clear documents. " + (e?.response?.data?.detail || e.message || ""));
        }
        setClearing(false);
    };

    const handleDelete = async (name) => {
        try {
            setMessage(null);
            await documentsApi.deleteDocument(name);
            setMessage(`✅ Deleted "${name}"`);
            await fetchData();
        } catch (e) {
            setError("Failed to delete document.");
        }
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
                    <p className="text-xs text-slate-500 mt-1">Manage documents, seed data, and monitor the knowledge base.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchData}
                        disabled={refreshing}
                        className="px-4 py-2 text-xs font-medium text-slate-300 bg-white/[0.04] border border-white/[0.08] rounded-lg hover:bg-white/[0.08] disabled:opacity-40 transition-all"
                    >
                        {refreshing ? '⟳ Refreshing...' : '⟳ Refresh'}
                    </button>
                    <Link to="/">
                        <button className="px-4 py-2 text-xs font-medium text-primary bg-primary/5 border border-primary/15 rounded-lg hover:bg-primary/10 transition-all">
                            ← Back to Chat
                        </button>
                    </Link>
                </div>
            </div>

            {/* Status Messages */}
            {error && (
                <div className="px-4 py-3 bg-red-500/5 border border-red-500/15 text-red-400 rounded-xl text-xs font-medium flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                    {error}
                </div>
            )}
            {message && (
                <div className="px-4 py-3 bg-emerald-500/5 border border-emerald-500/15 text-emerald-400 rounded-xl text-xs font-medium flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" />
                    {message}
                </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Stats */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Knowledge Base Stats</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { l: 'Indexed Documents', v: stats.total_documents, color: 'text-primary' },
                                { l: 'Active Sources', v: sources.length, color: 'text-emerald-400' },
                                { l: 'Engine Cost', v: '$0.00', color: 'text-white' },
                                { l: 'Model', v: '1.5 Flash', color: 'text-violet-400' },
                            ].map((m, i) => (
                                <GlassCard key={i} className="!p-5 text-center">
                                    <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-2">{m.l}</p>
                                    <p className={`text-2xl font-heading font-bold ${m.color} tracking-tight`}>{m.v}</p>
                                </GlassCard>
                            ))}
                        </div>
                    </div>

                    {/* Operations */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Operations</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <GlassCard className="flex flex-col gap-4">
                                <h4 className="text-xs font-semibold text-slate-400">Seed Sample Data</h4>
                                <button
                                    onClick={handleSeed}
                                    disabled={seeding}
                                    className="px-4 py-3 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold rounded-lg hover:bg-primary/20 disabled:opacity-30 transition-all"
                                >
                                    {seeding ? '⟳ Seeding...' : '⬇ Initialize Sample Data'}
                                </button>
                                <p className="text-[11px] text-slate-600 leading-relaxed">
                                    Inject default knowledge fragments into ChromaDB to populate the RAG context index.
                                </p>
                            </GlassCard>

                            <GlassCard className="flex flex-col gap-4">
                                <h4 className="text-xs font-semibold text-slate-400">Clear All Data</h4>
                                <button
                                    onClick={handleClearAll}
                                    disabled={clearing}
                                    className="px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-lg hover:bg-red-500/20 disabled:opacity-30 transition-all"
                                >
                                    {clearing ? '⟳ Clearing...' : '🗑 Clear All Documents'}
                                </button>
                                <p className="text-[11px] text-slate-600 leading-relaxed">
                                    Remove all documents from the knowledge base. This resets the vector store.
                                </p>
                            </GlassCard>
                        </div>

                        {/* Upload */}
                        <DocumentUpload onUploadComplete={fetchData} />
                    </div>
                </div>

                {/* Document Sources */}
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Indexed Sources · {sources.length} documents
                    </h3>
                    <GlassCard noPadding>
                        {sources.length === 0 ? (
                            <div className="py-16 text-center">
                                <p className="text-sm text-slate-600">No documents indexed yet.</p>
                                <p className="text-xs text-slate-700 mt-1">Upload documents or seed sample data to get started.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/[0.04]">
                                {sources.map(s => (
                                    <div key={s} className="px-5 py-4 flex justify-between items-center hover:bg-white/[0.02] transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-xs">📄</div>
                                            <span className="text-sm font-medium text-slate-300">{s}</span>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(s)}
                                            className="text-xs font-medium text-red-500/40 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/5"
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
