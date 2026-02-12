import React from 'react';
import Header from "./Header";
import GlassCard from "../ui/GlassCard";
import NeuralCore from "../visuals/NeuralCore";
import useSystemMetrics from "../../hooks/useSystemMetrics";

export default function MainLayout({ children }) {
    const metrics = useSystemMetrics();

    return (
        <div className="min-h-screen flex flex-col bg-bgDark selection:bg-primary/30 scanline">
            <Header />

            <main className="flex-1 max-w-[1600px] w-full mx-auto px-10 py-10 flex flex-col gap-10 overflow-hidden">

                {/* Dynamic Ops Grid */}
                <div className="flex-1 grid grid-cols-12 gap-8 overflow-hidden">

                    {/* COL 1: Primary Chat Interface (7/12) */}
                    <div className="col-span-12 xl:col-span-7 flex flex-col overflow-hidden">
                        {children}
                    </div>

                    {/* COL 2: Intelligence HUD (3/12) */}
                    <div className="col-span-12 md:col-span-7 xl:col-span-3 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
                        <div className="flex items-center gap-3 px-2">
                            <div className="h-[1px] w-6 bg-primary/20" />
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500">System_Metrics</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Neural Sync', val: (metrics?.sync?.toFixed(1) || '0.0') + '%' },
                                { label: 'Memory Load', val: (metrics?.memory?.toFixed(1) || '0.0') + '%' },
                                { label: 'Index Count', val: (metrics?.fragments?.toLocaleString() || '0') },
                                { label: 'Neuro Load', val: (metrics?.neuroLoad || '0.0') + '%' }
                            ].map((m, i) => (
                                <GlassCard key={i} className="p-4 border-white/5 hover:border-primary/30">
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">{m.label}</p>
                                    <p className="text-xl font-mono font-bold text-white tracking-tighter">{m.val}</p>
                                </GlassCard>
                            ))}
                        </div>

                        <GlassCard className="flex flex-col gap-4">
                            <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">Subsystem_Status</h4>
                            {[
                                { name: 'CHROMA_DB', s: 'ONLINE', c: 'text-green-500' },
                                { name: 'GEMINI_LINK', s: 'READY', c: 'text-primary' },
                                { name: 'VAULT_INDEX', s: 'SYNCED', c: 'text-primary' }
                            ].map((s, i) => (
                                <div key={i} className="flex justify-between items-center text-[10px] font-mono">
                                    <span className="text-slate-500">{s.name}</span>
                                    <span className={`${s.c} font-black`}>{s.s}</span>
                                </div>
                            ))}
                        </GlassCard>
                    </div>

                    {/* COL 3: Neural Core (2/12) */}
                    <div className="col-span-12 md:col-span-5 xl:col-span-2 flex flex-col gap-6">
                        <div className="flex items-center gap-3 px-2">
                            <div className="h-[1px] w-6 bg-primary/20" />
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500">AI_Core</h3>
                        </div>
                        <GlassCard className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                            <div className="absolute top-4 left-6 text-[8px] font-black text-primary/20 uppercase tracking-[0.3em]">Reactor_V4</div>
                            <NeuralCore />
                            <div className="mt-8 text-[9px] font-mono text-center text-primary/30 uppercase leading-relaxed">
                                Neural_Link: Stable <br />
                                Energy_Pulse: Active
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </main>

            {/* Activity Log (Bottom) */}
            <ActivityLog />
        </div>
    );
}

function ActivityLog() {
    const [logs, setLogs] = useState([
        { t: '21:20:01', m: 'SYNAPSE_LINK_INITIALIZED' },
        { t: '21:20:05', m: 'KNOWLEDGE_FRAGMENTS_READY' },
        { t: '21:20:06', m: 'AWAITING_OPERATOR_DIRECTIVE' }
    ]);

    useEffect(() => {
        const timer = setInterval(() => {
            if (Math.random() > 0.8) {
                const t = new Date().toLocaleTimeString([], { hour12: false });
                const events = ['CACHE_PURGE_COMPLETE', 'INDEX_REVALIDATED', 'HANDSHAKE_PULSE_SENT', 'TOKEN_STREAM_IDLE'];
                const m = events[Math.floor(Math.random() * events.length)];
                setLogs(prev => [{ t, m }, ...prev.slice(0, 19)]);
            }
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="h-40 bg-black/40 border-t border-primary/20 px-10 py-5 font-mono text-[10px] overflow-hidden relative">
            <div className="absolute top-2 right-10 flex items-center gap-4 text-primary/20 uppercase font-black tracking-[0.4em]">
                <span>Standard_Output_Terminal</span>
                <div className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-ping" />
            </div>
            <div className="h-full overflow-y-auto custom-scrollbar flex flex-col gap-1 opacity-50 hover:opacity-100 transition-opacity">
                {logs.map((l, i) => (
                    <div key={i} className="flex gap-4">
                        <span className="text-primary/40">[{l.t}]</span>
                        <span className="text-slate-400 font-bold uppercase tracking-widest">{l.m}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
