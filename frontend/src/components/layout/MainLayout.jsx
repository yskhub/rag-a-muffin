import React, { useState, useEffect } from 'react';
import Header from "./Header";
import GlassCard from "../ui/GlassCard";
import NeuralCore from "../visuals/NeuralCore";
import useSystemMetrics from "../../hooks/useSystemMetrics";

export default function MainLayout({ children }) {
    const metrics = useSystemMetrics();

    return (
        <div className="min-h-screen h-screen flex flex-col bg-bg-dark scanline">
            <Header />

            {/* Main Content — 3-column grid */}
            <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 py-6 flex flex-col gap-5 overflow-hidden">
                <div className="flex-1 grid grid-cols-12 gap-5 overflow-hidden">

                    {/* Column 1: Chat Terminal (7/12) */}
                    <div className="col-span-12 xl:col-span-7 flex flex-col overflow-hidden">
                        {children}
                    </div>

                    {/* Column 2: Intelligence Metrics (3/12) */}
                    <div className="col-span-12 md:col-span-7 xl:col-span-3 flex flex-col gap-4 overflow-y-auto custom-scrollbar">

                        {/* Section Header */}
                        <SectionLabel title="Live Metrics" />

                        {/* 2x2 Metrics Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <MetricCard label="Neural Sync" value={`${metrics?.sync?.toFixed(1) || '0.0'}%`} color="text-primary" />
                            <MetricCard label="Memory Load" value={`${metrics?.memory?.toFixed(1) || '0.0'}%`} color="text-amber-400" />
                            <MetricCard label="Index Count" value={metrics?.fragments?.toLocaleString() || '0'} color="text-emerald-400" />
                            <MetricCard label="Inference" value={`${metrics?.neuroLoad || '0.0'}%`} color="text-violet-400" />
                        </div>

                        {/* Subsystem Status */}
                        <SectionLabel title="Subsystem Status" />
                        <GlassCard className="!p-4">
                            <div className="space-y-3">
                                {[
                                    { name: 'ChromaDB', status: 'Online', color: 'text-emerald-400', dot: 'bg-emerald-400' },
                                    { name: 'Gemini LLM', status: 'Ready', color: 'text-primary', dot: 'bg-primary' },
                                    { name: 'Vector Index', status: 'Synced', color: 'text-primary', dot: 'bg-primary' },
                                ].map((s, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                                            <span className="text-[11px] font-medium text-slate-400">{s.name}</span>
                                        </div>
                                        <span className={`text-[10px] font-semibold ${s.color}`}>{s.status}</span>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </div>

                    {/* Column 3: Neural Core Visualization (2/12) */}
                    <div className="col-span-12 md:col-span-5 xl:col-span-2 flex flex-col gap-4">
                        <SectionLabel title="AI Core" />
                        <GlassCard className="flex-1 flex flex-col items-center justify-center relative overflow-hidden !p-4">
                            <NeuralCore />
                            <div className="mt-6 text-center">
                                <p className="text-[10px] font-mono text-primary/40 leading-relaxed">
                                    Neural Link: <span className="text-emerald-400">Stable</span>
                                </p>
                                <p className="text-[10px] font-mono text-primary/30 leading-relaxed">
                                    Status: Active
                                </p>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </main>

            {/* Bottom: Activity Log */}
            <ActivityLog />
        </div>
    );
}

/* ─── Sub-Components ─── */

function SectionLabel({ title }) {
    return (
        <div className="flex items-center gap-3 px-1">
            <div className="h-px w-4 bg-primary/20" />
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">{title}</h3>
        </div>
    );
}

function MetricCard({ label, value, color = "text-white" }) {
    return (
        <GlassCard className="!p-4 !rounded-xl">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-2">{label}</p>
            <p className={`text-xl font-heading font-bold ${color} tracking-tight`}>{value}</p>
        </GlassCard>
    );
}

function ActivityLog() {
    const [logs, setLogs] = useState([
        { t: new Date().toLocaleTimeString([], { hour12: false }), m: 'System initialized', type: 'info' },
        { t: new Date().toLocaleTimeString([], { hour12: false }), m: 'RAG pipeline ready', type: 'success' },
        { t: new Date().toLocaleTimeString([], { hour12: false }), m: 'Awaiting operator input', type: 'info' },
    ]);

    useEffect(() => {
        const timer = setInterval(() => {
            if (Math.random() > 0.75) {
                const t = new Date().toLocaleTimeString([], { hour12: false });
                const events = [
                    { m: 'Cache validated', type: 'info' },
                    { m: 'Index heartbeat OK', type: 'success' },
                    { m: 'Token stream idle', type: 'info' },
                    { m: 'Memory checkpoint saved', type: 'success' },
                ];
                const event = events[Math.floor(Math.random() * events.length)];
                setLogs(prev => [{ t, ...event }, ...prev.slice(0, 14)]);
            }
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="h-28 bg-black/30 border-t border-white/[0.04] px-8 py-3 font-mono text-[10px] overflow-hidden relative">
            <div className="absolute top-2.5 right-8 flex items-center gap-3">
                <span className="text-[9px] font-medium text-slate-600 uppercase tracking-widest">Activity Log</span>
                <div className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-pulse" />
            </div>
            <div className="h-full overflow-y-auto custom-scrollbar flex flex-col gap-0.5 pr-32">
                {logs.map((l, i) => (
                    <div key={i} className={`flex gap-3 ${i === 0 ? 'opacity-70' : 'opacity-30'} hover:opacity-100 transition-opacity`}>
                        <span className="text-slate-600 tabular-nums">{l.t}</span>
                        <span className={`font-medium ${l.type === 'success' ? 'text-emerald-500/60' : 'text-slate-500'}`}>{l.m}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
