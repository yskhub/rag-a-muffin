import React, { useState, useEffect, useRef } from 'react';
import useChatStore from '../store/chatStore';
import MessageBubble from './MessageBubble';

const ChatInterface = () => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const { messages, isLoading, error, sendMessage, clearMessages } = useChatStore();
    const [loadingMessage, setLoadingMessage] = useState('SYNCING DATA...');
    const [systemTime, setSystemTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const timer = setInterval(() => setSystemTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (isLoading) {
            const statusMessages = [
                'SCANNING DOCUMENTS...',
                'RETRIEVING CONTEXT...',
                'SYNTHESIZING ANSWER...',
                'FINALIZING OUTPUT...'
            ];
            let i = 0;
            const interval = setInterval(() => {
                i = (i + 1) % statusMessages.length;
                setLoadingMessage(statusMessages[i]);
            }, 1200);
            return () => clearInterval(interval);
        }
    }, [isLoading]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        const msg = input.trim();
        setInput('');
        await sendMessage(msg);
    };

    return (
        <div className="relative flex flex-col h-screen overflow-hidden font-sans selection:bg-indigo-500/30 scanline bg-[#020408]">
            <div className="grid-bg" />

            {/* Background Glows */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-5%] left-[5%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[15%] right-[5%] w-[30%] h-[30%] bg-purple-600/10 blur-[100px] rounded-full" />
            </div>

            {/* Main Container Wrapper - Centers content and adds horizontal breath */}
            <div className="flex flex-col h-full max-w-6xl mx-auto w-full px-6 md:px-12">

                {/* Header Section */}
                <header className="glass-header z-50 py-6 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 mb-4">
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-2xl shadow-xl shadow-indigo-500/20 border border-indigo-400/30">
                                🤖
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-[#04060c] rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-black text-white tracking-widest uppercase">
                                    MUFFIN.<span className="text-indigo-400">OS</span>
                                </h1>
                                <span className="text-[10px] font-black bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20 tracking-tighter">V2.0.4</span>
                            </div>
                            <p className="text-[10px] font-bold text-gray-500 tracking-[0.4em] uppercase mt-1">
                                Advanced RAG Intelligence Unit
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="hidden sm:flex flex-col items-end pr-8 border-r border-white/10">
                            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">System_Clock</span>
                            <span className="text-sm font-mono text-white/70 tabular-nums">{systemTime}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={clearMessages}
                                className="group flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 hover:text-white bg-indigo-500/5 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-xl transition-all active:scale-95"
                            >
                                <span className="text-lg leading-none">+</span> New_Session
                            </button>
                            <button
                                onClick={clearMessages}
                                className="p-3 text-gray-500 hover:text-red-400 hover:bg-red-400/5 border border-transparent hover:border-red-400/10 rounded-xl transition-all"
                                title="Purge Repository"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                </header>

                {/* Chat Stream Viewport */}
                <main className="flex-1 overflow-y-auto py-8 space-y-10 scroll-smooth custom-scrollbar pr-2">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center animate-slide-up py-16">
                            <div className="relative mb-10 group">
                                <div className="w-28 h-28 bg-white/[0.03] rounded-[40px] border border-white/10 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-500">
                                    👋
                                </div>
                                <div className="absolute inset-0 bg-indigo-500/10 blur-[50px] rounded-full -z-10 group-hover:bg-indigo-500/20 transition-colors" />
                            </div>
                            <h2 className="text-4xl font-black text-white mb-6 tracking-tighter uppercase italic">Ready_To_Sync</h2>
                            <p className="text-gray-500 max-w-sm mx-auto text-sm font-medium leading-relaxed tracking-wide mb-12">
                                Neural knowledge fragments prioritized. Standing by for command ingestion. Deploy a query to begin synchronization.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg w-full">
                                {['Check return policy', 'Compare tech products', 'Global shipping rates', 'View new arrivals'].map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => setInput(tag)}
                                        className="px-6 py-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-indigo-500/5 hover:border-indigo-500/30 text-gray-400 hover:text-indigo-300 text-[10px] font-black uppercase tracking-widest transition-all text-left flex justify-between items-center group/tag"
                                    >
                                        {tag}
                                        <span className="opacity-0 group-hover/tag:opacity-100 transition-opacity text-indigo-400">[→]</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-12">
                        {messages.map(msg => (
                            <div key={msg.id} className="animate-slide-up">
                                <MessageBubble message={msg} />
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start animate-slide-up">
                                <div className="glass px-8 py-5 rounded-2xl border-indigo-500/20 max-w-md shadow-2xl shadow-indigo-500/5">
                                    <div className="flex gap-6 items-center">
                                        <div className="flex gap-2">
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-[10px] font-black text-indigo-400/70 tracking-[0.3em] uppercase mb-1">Thinking...</p>
                                            <p className="text-xs font-mono text-gray-400 animate-pulse">{loadingMessage}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="mx-auto max-w-max bg-red-500/5 border border-red-500/20 text-red-100 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-4 animate-slide-up shadow-xl shadow-red-500/5">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                            {error}
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </main>

                {/* Input Control Center */}
                <footer className="py-8 bg-gradient-to-t from-[#020408] via-[#020408] to-transparent">
                    <div className="relative group transition-all duration-300">
                        {/* Status Tags above input */}
                        <div className="flex justify-between px-3 mb-4 opacity-40 group-focus-within:opacity-100 transition-all duration-500">
                            <div className="flex gap-6">
                                <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.3em]">Status: Ready</span>
                                <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.3em]">Link: Secure</span>
                            </div>
                            <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em]">Neural_Interface_V1</span>
                        </div>

                        {/* Input Field */}
                        <div className="relative glass rounded-[28px] p-2 flex items-center gap-4 border-white/5 group-focus-within:border-indigo-500/40 shadow-2xl">
                            <div className="pl-6 text-indigo-500/30 font-mono font-black select-none text-xl group-focus-within:text-indigo-400 transition-colors">
                                &gt;
                            </div>
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleSend()}
                                placeholder="TYPE COMMAND PACKET..."
                                disabled={isLoading}
                                className="flex-1 bg-transparent px-2 py-4 text-white placeholder-gray-800 text-sm font-medium tracking-wide focus:outline-none"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className={`px-10 py-4 rounded-[22px] font-black uppercase tracking-[0.3em] transition-all duration-300 text-xs shadow-xl ${!input.trim() || isLoading
                                        ? 'bg-white/5 text-gray-700 pointer-events-none'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-[1.03] hover:shadow-indigo-500/20 active:scale-95'
                                    }`}
                            >
                                {isLoading ? 'SYNC...' : 'DEPLOY'}
                            </button>
                        </div>

                        {/* Bottom Decoration */}
                        <div className="mt-8 flex justify-center items-center gap-10">
                            <div className="hidden md:flex items-center gap-3">
                                <span className="text-[8px] font-black text-white/5 uppercase tracking-[0.8em]">Quantum_Compute_Idle</span>
                            </div>
                            <div className="flex gap-2">
                                <div className="h-1 w-1 rounded-full bg-indigo-500/20" />
                                <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                                <div className="h-1 w-1 rounded-full bg-indigo-500/20" />
                            </div>
                            <div className="hidden md:flex items-center gap-3">
                                <span className="text-[8px] font-black text-white/5 uppercase tracking-[0.8em]">End_To_End_Encrypted</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ChatInterface;
