import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { documentsApi, adminApi } from '../services/api';
import DocumentUpload from './DocumentUpload';
import GlassCard from './ui/GlassCard';
import CommandButton from './ui/CommandButton';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ total_documents: 0 });
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            setError("Sync Failure: Context Engine Unreachable");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSeed = async () => {
        try { await adminApi.seedSampleData(); fetchData(); } catch (e) { }
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
        <div className="flex-1 flex flex-col gap-10 overflow-hidden">

            {/* Control Panel Header */}
            <div className="flex justify-between items-end border-b border-primary/10 pb-8 px-2">
                <div className="flex flex-col">
                    <h2 className="text-3xl font-heading font-black text-white tracking-widest uppercase italic">
                        Control_Panel
                    </h2>
                    <p className="text-[10px] font-mono text-primary/40 tracking-[0.4em] uppercase mt-2">Engine_Management // Security_Auth_Level_01</p>
                </div>
                <div className="flex gap-4">
                    <CommandButton onClick={fetchData} variant="ghost">Refresh_Data</CommandButton>
                    <Link to="/">
                        <CommandButton variant="danger">Terminate_Session</CommandButton>
                    </Link>
                </div>
            </div>

            {error && (
                <div className="p-6 bg-red-500/5 border border-red-500/20 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-4">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                    {error}
                </div>
            )}

            {/* Dashboard Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-12">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* Stats Module */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 pl-2 border-l-2 border-primary/30">Persistence_Metrics</h3>
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { l: 'Indexed_Vectors', v: stats.total_documents },
                                { l: 'Active_Nodes', v: sources.length },
                                { l: 'Engine_Cost', v: '$0.00' },
                                { l: 'Uptime_Rating', v: '99.9%' }
                            ].map((m, i) => (
                                <GlassCard key={i} className="py-8 text-center hover:scale-[1.02] transition-transform">
                                    <p className="text-[9px] font-black text-primary/40 uppercase tracking-widest mb-2">{m.l}</p>
                                    <p className="text-4xl font-mono font-bold text-white tracking-tighter">{m.v}</p>
                                </GlassCard>
                            ))}
                        </div>
                    </div>

                    {/* Operations Module */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 pl-2 border-l-2 border-primary/30">System_Operations</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                            <GlassCard className="flex flex-col gap-6">
                                <h4 className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Initialization_Protocols</h4>
                                <CommandButton onClick={handleSeed} className="py-4">Seed_Sample_Data</CommandButton>
                                <p className="text-[9px] font-mono text-slate-500 leading-relaxed italic">
                                    Inject default knowledge fragments into the ChromaDB vector engine to populate the RAG context.
                                </p>
                            </GlassCard>
                            <DocumentUpload onUploadComplete={fetchData} />
                        </div>
                    </div>
                </div>

                {/* Node Manager */}
                <div className="flex flex-col gap-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 pl-2 border-l-2 border-primary/30">Localized_Context_Nodes</h3>
                    <GlassCard noPadding className="overflow-hidden">
                        <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                            <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Source_Manifest // {sources.length} Objects</span>
                        </div>
                        {sources.length === 0 ? (
                            <div className="py-24 text-center text-[11px] font-bold uppercase tracking-[0.8em] text-white/5 italic">
                                NO_NODES_LOCALIZED_IN_ENGINE
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
                                {sources.map(s => (
                                    <div key={s} className="p-6 border border-white/5 flex justify-between items-center hover:bg-primary/[0.02] transition-all group">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <span className="text-2xl opacity-20 group-hover:opacity-100 transition-opacity">💿</span>
                                            <span className="text-xs font-mono font-bold text-slate-400 truncate uppercase tracking-widest">{s}</span>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(s)}
                                            className="text-[9px] font-black text-red-500/20 hover:text-red-500 transition-colors uppercase"
                                        >
                                            Purge
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
