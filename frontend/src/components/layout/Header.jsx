import React, { useState, useEffect } from 'react';
import StatusDot from "../ui/StatusDot";
import { Link } from 'react-router-dom';
import useChatStore from '../../store/chatStore';

export default function Header({ backendStatus = 'checking' }) {
    const [time, setTime] = useState(new Date());
    const clearMessages = useChatStore((s) => s.clearMessages);
    const exportChat = useChatStore((s) => s.exportChat);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const formattedDate = time.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

    const statusConfig = {
        online: { dot: 'active', label: 'Online', color: 'text-green-400/80 bg-green-500/5 border-green-500/10' },
        checking: { dot: 'warning', label: 'Connecting...', color: 'text-amber-400/80 bg-amber-500/5 border-amber-500/10' },
        offline: { dot: 'error', label: 'Offline', color: 'text-red-400/80 bg-red-500/5 border-red-500/10' },
        waking: { dot: 'warning', label: 'Waking up...', color: 'text-amber-400/80 bg-amber-500/5 border-amber-500/10' },
    };

    const status = statusConfig[backendStatus] || statusConfig.checking;

    const handleExport = async () => {
        const text = exportChat();
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback: download as file
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'chat-export.txt';
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    return (
        <header className="h-16 border-b border-white/[0.08] bg-slate-950/60 backdrop-blur-2xl flex items-center justify-between px-8 z-50">
            {/* Left: Brand */}
            <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center animate-pulse-glow">
                    <span className="text-primary text-base font-bold">◆</span>
                </div>
                <div>
                    <h1 className="font-heading text-lg font-semibold text-white tracking-wide">
                        AI Context Engine
                    </h1>
                    <p className="text-xs font-mono text-slate-400 tracking-wider">
                        Muffin.OS · v2.2.0
                    </p>
                </div>
            </div>

            {/* Center: Live Status */}
            <div className="hidden lg:flex items-center gap-4">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${status.color}`}>
                    <StatusDot status={status.dot} />
                    <span className={`text-xs font-medium`}>{status.label}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10">
                    <StatusDot status="cyan" />
                    <span className="text-xs font-medium text-primary/70">RAG Active</span>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col items-end mr-2">
                    <span className="text-sm font-mono text-white/60 tabular-nums">{formattedTime}</span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{formattedDate}</span>
                </div>
                <div className="w-px h-8 bg-white/[0.08]" />

                {/* Architecture Diagram */}
                <a
                    href="/architecture.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-slate-400 hover:text-primary transition-colors px-2 py-1 rounded hover:bg-primary/5"
                    title="View Architecture Diagram"
                >
                    🏗️ Architecture_Diagram
                </a>

                {/* Export */}
                <button
                    onClick={handleExport}
                    className="text-xs font-medium text-slate-400 hover:text-primary transition-colors px-2 py-1 rounded hover:bg-primary/5"
                    title="Export chat (Ctrl+E)"
                >
                    {copied ? '✓ Copied' : '📋 Export'}
                </button>

                {/* Clear */}
                <button
                    onClick={clearMessages}
                    className="text-xs font-medium text-slate-400 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-400/5"
                    title="Clear chat (Ctrl+K)"
                >
                    Clear
                </button>

                {/* Admin */}
                <Link to="/admin" className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all">
                    <span className="text-sm">⚙</span>
                </Link>
            </div>
        </header>
    );
}
