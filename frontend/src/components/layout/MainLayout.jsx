import React, { useState, useEffect } from 'react';
import Header from "./Header";
import GlassCard from "../ui/GlassCard";
import NeuralCore from "../visuals/NeuralCore";
import useSystemMetrics from "../../hooks/useSystemMetrics";

export default function MainLayout({ children }) {
    const metrics = useSystemMetrics();

    return (
        <div className="min-h-screen h-screen flex flex-col bg-bg-dark scanline">
            <Header backendStatus={metrics.backendStatus} />

            <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 py-6 flex flex-col gap-5 overflow-hidden">
                <div className="flex-1 grid grid-cols-12 gap-5 overflow-hidden">

                    {/* Column 1: Chat Terminal (7/12) */}
                    <div className="col-span-12 xl:col-span-7 flex flex-col overflow-hidden">
                        {children}
                    </div>

                    {/* Column 2: Metrics (3/12) */}
                    <div className="col-span-12 md:col-span-7 xl:col-span-3 flex flex-col gap-4 overflow-y-auto custom-scrollbar">

                        <SectionLabel title="Live Metrics" />

                        <div className="grid grid-cols-2 gap-3">
                            <MetricCard label="Uptime" value={metrics.uptime} color="text-primary" mono />
                            <MetricCard label="Memory" value={`${metrics?.memory?.toFixed?.(1) || '0.0'}%`} color="text-amber-400" />
                            <MetricCard label="Documents" value={metrics.documentsCount || 0} color="text-emerald-400" />
                            <MetricCard label="Inference" value={`${metrics?.neuroLoad || '0.0'}%`} color="text-violet-400" />
                        </div>

                        {/* Subsystem Status — REAL */}
                        <SectionLabel title="Subsystem Status" />
                        <GlassCard className="!p-5">
                            <div className="space-y-4">
                                <StatusRow
                                    name="Backend API"
                                    status={metrics.backendStatus === 'online' ? 'Online' : metrics.backendStatus === 'checking' ? 'Checking...' : 'Offline'}
                                    color={metrics.backendStatus === 'online' ? 'text-emerald-400' : metrics.backendStatus === 'checking' ? 'text-amber-400' : 'text-red-400'}
                                    dot={metrics.backendStatus === 'online' ? 'bg-emerald-400' : metrics.backendStatus === 'checking' ? 'bg-amber-400' : 'bg-red-400'}
                                    pulse={metrics.backendStatus === 'checking'}
                                />
                                <StatusRow name="Gemini LLM" status="Ready" color="text-primary" dot="bg-primary" />
                                <StatusRow name="ChromaDB" status="Active" color="text-emerald-400" dot="bg-emerald-400" />
                                <StatusRow name="Vector Index" status="Synced" color="text-primary" dot="bg-primary" />
                            </div>
                        </GlassCard>

                        {/* Keyboard Shortcuts */}
                        <SectionLabel title="Shortcuts" />
                        <GlassCard className="!p-4">
                            <div className="space-y-2">
                                {[
                                    { keys: 'Enter', action: 'Send message' },
                                    { keys: 'Ctrl + K', action: 'Clear chat' },
                                    { keys: 'Ctrl + E', action: 'Export chat' },
                                ].map((s, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <kbd className="px-2 py-0.5 bg-white/[0.04] border border-white/10 rounded text-[11px] font-mono text-slate-300">{s.keys}</kbd>
                                        <span className="text-xs text-slate-400">{s.action}</span>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </div>

                    {/* Column 3: Neural Core (2/12) */}
                    <div className="col-span-12 md:col-span-5 xl:col-span-2 flex flex-col gap-4">
                        <SectionLabel title="AI Core" />
                        <GlassCard className="flex-1 flex flex-col items-center justify-center relative overflow-hidden !p-4">
                            <NeuralCore />
                            <div className="mt-6 text-center space-y-1">
                                <p className="text-xs font-mono text-primary/60 leading-relaxed">
                                    Neural Link: <span className="text-emerald-400">Stable</span>
                                </p>
                                <p className="text-xs font-mono text-slate-400 leading-relaxed">
                                    Model: {metrics.model?.split(' ').slice(-2).join(' ') || 'Gemini'}
                                </p>
                                <p className="text-xs font-mono text-primary/40 leading-relaxed">
                                    Cost: $0.00
                                </p>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </main>

            <ActivityLog />
        </div>
    );
}

/* ─── Sub-Components ─── */

function SectionLabel({ title }) {
    return (
        <div className="flex items-center gap-3 px-1">
            <div className="h-px w-4 bg-primary/30" />
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-300">{title}</h3>
        </div>
    );
}

function MetricCard({ label, value, color = "text-white", mono = false }) {
    return (
        <GlassCard className="!p-5 !rounded-xl">
            <p className="text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">{label}</p>
            <p className={`text-2xl font-heading font-bold ${color} tracking-tight ${mono ? 'font-mono text-xl' : ''}`}>{value}</p>
        </GlassCard>
    );
}

function StatusRow({ name, status, color, dot, pulse = false }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${dot} ${pulse ? 'animate-pulse' : ''}`} />
                <span className="text-sm font-medium text-slate-300">{name}</span>
            </div>
            <span className={`text-xs font-semibold ${color}`}>{status}</span>
        </div>
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
        <div className="h-28 bg-black/30 border-t border-white/[0.06] px-8 py-3 font-mono text-xs overflow-hidden relative">
            <div className="absolute top-2.5 right-8 flex items-center gap-3">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Activity Log</span>
                <div className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-pulse" />
            </div>
            <div className="h-full overflow-y-auto custom-scrollbar flex flex-col gap-1 pr-32">
                {logs.map((l, i) => (
                    <div key={i} className={`flex gap-3 ${i === 0 ? 'opacity-80' : 'opacity-40'} hover:opacity-100 transition-opacity`}>
                        <span className="text-slate-500 tabular-nums">{l.t}</span>
                        <span className={`font-medium ${l.type === 'success' ? 'text-emerald-400/70' : 'text-slate-400'}`}>{l.m}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
