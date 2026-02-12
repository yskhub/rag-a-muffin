import React, { useState, useEffect } from 'react';
import StatusDot from "../ui/StatusDot";
import { Link } from 'react-router-dom';
import useChatStore from '../../store/chatStore';

export default function Header() {
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const clearMessages = useChatStore((s) => s.clearMessages);

    useEffect(() => {
        const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(t);
    }, []);

    return (
        <header className="h-20 border-b border-primary/10 bg-slate-950/20 backdrop-blur-xl flex items-center justify-between px-10 z-50">
            <div className="flex flex-col">
                <h1 className="text-3xl font-heading font-black text-primary tracking-widest uppercase italic">
                    AI_CONTEXT_ENGINE
                </h1>
                <p className="text-[9px] font-mono font-bold text-slate-500 tracking-[0.4em] uppercase">Muffin.OS // Build v2.0.5</p>
            </div>

            <div className="flex items-center gap-10">
                <div className="hidden md:flex flex-col items-end pr-8 border-r border-white/5">
                    <span className="text-[9px] font-bold text-primary/40 uppercase tracking-widest mb-1">System_Clock</span>
                    <span className="text-sm font-mono text-white/40 tabular-nums">{time}</span>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 px-4 py-2 bg-primary/5 rounded-full border border-primary/10">
                        <StatusDot status="active" />
                        <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Secure_Link</span>
                    </div>
                    <button
                        onClick={clearMessages}
                        className="text-[9px] font-bold text-slate-600 hover:text-red-400 uppercase tracking-widest transition-colors"
                        title="Clear chat history"
                    >
                        🗑️ Clear
                    </button>
                    <Link to="/admin" className="text-lg opacity-40 hover:opacity-100 transition-opacity">⚙️</Link>
                </div>
            </div>
        </header>
    );
}
