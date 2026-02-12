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
                <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-indigo-600/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-[10%] right-[-5%] w-[25%] h-[25%] bg-purple-600/10 blur-[90px] rounded-full" />
            </div>

            {/* Header */}
            <header className="glass-header sticky top-0 z-50 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20">
                            🤖
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#04060c] rounded-full animate-pulse" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-black text-white tracking-tight uppercase">
                                MUFFIN.<span className="text-indigo-400">OS</span>
                            </h1>
                            <span className="text-[9px] font-bold bg-indigo-500/10 text-indigo-400/80 px-1.5 py-0.5 rounded border border-indigo-500/20 tracking-tighter">v2.0.4</span>
                        </div>
                        <p className="text-[9px] font-bold text-gray-500 tracking-[0.2em] uppercase leading-none mt-1">
                            RAG Intelligence Unit
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end pr-4 border-r border-white/5">
                        <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Chronos</span>
                        <span className="text-xs font-mono text-white/50 tabular-nums">{systemTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={clearMessages}
                            className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/20 rounded-md transition-all"
                        >
                            + New Session
                        </button>
                        <button
                            onClick={clearMessages}
                            className="p-2 text-gray-500 hover:text-red-400 transition-all"
                            title="Clear History"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
            </header>

            {/* Chat Body */}
            <main className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center animate-slide-up py-12">
                        <div className="relative mb-6">
                            <div className="w-24 h-24 bg-white/[0.02] rounded-[32px] border border-white/5 flex items-center justify-center text-5xl animate-float">
                                👋
                            </div>
                            <div className="absolute inset-0 bg-indigo-500/5 blur-[40px] rounded-full -z-10" />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-4 tracking-tight uppercase">Init_System_Loop</h2>
                        <p className="text-gray-500 max-w-sm mx-auto text-xs font-medium leading-relaxed tracking-wide">
                            Knowledge base synchronized. Deploying conversational parameters. Standing by for instructions.
                        </p>

                        <div className="grid grid-cols-2 gap-3 mt-8 max-w-sm w-full">
                            {['Check return policy', 'Compare products', 'Shipping rates', 'New arrivals'].map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setInput(tag)}
                                    className="px-4 py-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-widest transition-all text-left"
                                >
                                    {tag} [→]
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="max-w-4xl mx-auto space-y-8 w-full">
                    {messages.map(msg => (
                        <div key={msg.id} className="animate-slide-up">
                            <MessageBubble message={msg} />
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start animate-slide-up">
                            <div className="glass px-6 py-4 rounded-2xl border-indigo-500/10 max-w-xs">
                                <div className="flex gap-4 items-center">
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                    </div>
                                    <p className="text-[10px] font-mono text-indigo-400/80 tracking-tighter uppercase">{loadingMessage}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="mx-auto max-w-max bg-red-500/5 border border-red-500/10 text-red-400 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-slide-up">
                        <span>⚠️</span> {error}
                    </div>
                )}
                <div ref={messagesEndRef} />
            </main>

            {/* Input Bar */}
            <footer className="p-6 bg-gradient-to-t from-[#020408] to-transparent">
                <div className="max-w-3xl mx-auto">
                    <div className="relative glass rounded-2xl p-1.5 flex items-center gap-2 group transition-all duration-300 focus-within:border-indigo-500/30">
                        <div className="pl-4 text-indigo-500/40 font-mono font-bold select-none text-sm">
                            &gt;
                        </div>
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleSend()}
                            placeholder="Awaiting instruction packet..."
                            disabled={isLoading}
                            className="flex-1 bg-transparent px-2 py-3 text-white placeholder-gray-700 text-sm focus:outline-none"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className={`px-6 py-2.5 rounded-xl font-black uppercase tracking-widest transition-all duration-300 text-[10px] ${!input.trim() || isLoading
                                    ? 'bg-white/5 text-gray-600'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-500 glow-pulse'
                                }`}
                        >
                            {isLoading ? '...' : 'Deploy'}
                        </button>
                    </div>
                    <div className="mt-4 flex justify-center items-center gap-4">
                        <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.5em]">Quantum Search Active</span>
                        <div className="h-px w-8 bg-white/5" />
                        <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.5em]">Neural Link Stable</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ChatInterface;
