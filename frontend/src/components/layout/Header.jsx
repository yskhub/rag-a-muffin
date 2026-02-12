import React, { useState, useEffect } from 'react';
import StatusDot from "../ui/StatusDot";
import { Link } from 'react-router-dom';
import useChatStore from '../../store/chatStore';

export default function Header() {
    const [time, setTime] = useState(new Date());
    const clearMessages = useChatStore((s) => s.clearMessages);

    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const formattedDate = time.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <header className="h-16 border-b border-white/[0.06] bg-slate-950/60 backdrop-blur-2xl flex items-center justify-between px-8 z-50">
            {/* Left: Brand */}
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center animate-pulse-glow">
                    <span className="text-primary text-sm font-bold">◆</span>
                </div>
                <div>
                    <h1 className="font-heading text-base font-semibold text-white tracking-wide">
                        AI Context Engine
                    </h1>
                    <p className="text-[10px] font-mono text-slate-500 tracking-wider">
                        Muffin.OS · v2.1.0
                    </p>
                </div>
            </div>

            {/* Center: Status */}
            <div className="hidden lg:flex items-center gap-6">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/5 border border-green-500/10">
                    <StatusDot status="active" />
                    <span className="text-[10px] font-medium text-green-400/80">System Online</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10">
                    <StatusDot status="cyan" />
                    <span className="text-[10px] font-medium text-primary/70">RAG Pipeline Active</span>
                </div>
            </div>

            {/* Right: Clock + Actions */}
            <div className="flex items-center gap-5">
                <div className="hidden md:flex flex-col items-end">
                    <span className="text-sm font-mono text-white/50 tabular-nums">{formattedTime}</span>
                    <span className="text-[9px] font-mono text-slate-600 uppercase">{formattedDate}</span>
                </div>
                <div className="w-px h-8 bg-white/[0.06]" />
                <button
                    onClick={clearMessages}
                    className="text-[10px] font-medium text-slate-500 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-400/5"
                    title="Clear chat history"
                >
                    Clear
                </button>
                <Link to="/admin" className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all">
                    <span className="text-sm">⚙</span>
                </Link>
            </div>
        </header>
    );
}
