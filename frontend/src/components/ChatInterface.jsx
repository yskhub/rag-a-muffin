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
                'UPLOADING SECURE PACKETS...',
                'SCANNING KNOWLEDGE NODES...',
                'RETRIEVING NEURAL CONTEXT...',
                'SYNTHESIZING RESPONSE...',
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
        <div className="relative flex flex-col h-screen overflow-hidden font-sans selection:bg-indigo-500/30 scanline">
            {/* Background Layers */}
            <div className="absolute inset-0 -z-10 bg-[#07090e]">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[130px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
            </div>

            {/* Header / System Bar */}
            <header className="glass-dark sticky top-0 z-50 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="relative group cursor-pointer">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                            🤖
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-[#07090e] rounded-full animate-pulse" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <h1 className="text-2xl font-black text-white tracking-tight uppercase">
                                MUFFIN.<span className="text-indigo-500">OS</span>
                            </h1>
                            <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/30 uppercase tracking-widest">v2.0.4</span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-500 tracking-[0.3em] uppercase">
                            Advanced RAG Intelligence Unit
                        </p>
                    </div>
                </div>

                <div className="hidden lg:flex flex-col items-end gap-1 px-6 border-r border-white/5 mr-6">
                    <span className="text-[10px] font-black text-indigo-400 tracking-widest uppercase">System Chronos</span>
                    <span className="text-sm font-mono text-white/80 tabular-nums">{systemTime}</span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={clearMessages}
                        className="hidden md:flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg transition-all"
                    >
                        NEW_SESSION
                    </button>
                    <button
                        onClick={clearMessages}
                        className="p-3 text-gray-500 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all group"
                        title="Purge Logs"
                    >
                        <span className="group-hover:scale-110 block transition-transform">❌</span>
                    </button>
                </div>
            </header>

            {/* Terminal Feed */}
            <main className="flex-1 overflow-y-auto px-8 py-10 space-y-8 scroll-smooth scrollbar-none">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center min-h-[65vh] text-center animate-slide-up">
                        <div className="relative mb-12">
                            <div className="w-40 h-40 bg-indigo-500/5 rounded-[40px] border border-indigo-500/10 flex items-center justify-center text-8xl animate-float cyber-border">
                                👋
                            </div>
                            <div className="absolute inset-0 bg-indigo-500/10 blur-[80px] rounded-full -z-10" />
                        </div>
                        <h2 className="text-5xl font-black text-white mb-6 tracking-tighter">INIT_CONVERSATION_LOOP</h2>
                        <p className="text-gray-500 max-w-lg mx-auto text-sm font-medium leading-relaxed tracking-wide">
                            Neural knowledge base synchronized. Deploying conversational parameters. Standing by for user instruction packets.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4 mt-12 max-w-2xl">
                            {['Check return policy', 'Compare headphones', 'Shipping rates', 'New arrivals'].map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setInput(tag)}
                                    className="px-6 py-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-indigo-500/10 hover:border-indigo-500/30 text-gray-400 hover:text-indigo-400 text-xs font-black uppercase tracking-widest transition-all glow-pulse"
                                >
                                    {tag} [→]
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map(msg => (
                    <div key={msg.id} className="animate-slide-up">
                        <MessageBubble message={msg} />
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start animate-slide-up">
                        <div className="glass px-8 py-6 rounded-2xl border-indigo-500/20 max-w-sm">
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-2 items-center">
                                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
                                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
                                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" style={{ animationDelay: '0.4s' }} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-indigo-400 tracking-[0.3em] uppercase mb-1">Processing...</p>
                                    <p className="text-xs font-mono text-gray-400">{loadingMessage}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mx-auto max-w-max bg-red-500/5 border border-red-500/20 text-red-400 px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-3 animate-slide-up">
                        <span className="p-1 bg-red-500/20 rounded">ERR</span> {error}
                    </div>
                )}
                <div ref={messagesEndRef} />
            </main>

            {/* Input Terminal */}
            <footer className="px-8 pb-8 pt-4">
                <div className="max-w-5xl mx-auto relative group">
                    <div className="absolute -top-12 left-0 right-0 flex justify-between px-2 opacity-0 group-focus-within:opacity-100 transition-opacity">
                        <span className="text-[9px] font-black text-indigo-500/50 uppercase tracking-[0.2em]">Input Active</span>
                        <span className="text-[9px] font-black text-indigo-500/50 uppercase tracking-[0.2em]">Ready to Receive</span>
                    </div>
                    <div className="relative glass p-2.5 rounded-2xl flex gap-3 border-indigo-500/20 group-focus-within:border-indigo-500/50 transition-colors">
                        <div className="hidden md:flex items-center pl-4 pr-1 text-indigo-500/50 font-mono font-bold text-lg select-none">
                            &gt;_
                        </div>
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleSend()}
                            placeholder="INITIALIZE INPUT PACKET..."
                            disabled={isLoading}
                            className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-700 font-mono text-sm focus:outline-none"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className={`px-10 py-3 rounded-xl font-black uppercase tracking-[0.2em] transition-all duration-300 text-xs ${!input.trim() || isLoading
                                    ? 'bg-white/5 text-gray-700'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-[1.02] active:scale-95 glow-pulse'
                                }`}
                        >
                            {isLoading ? '---' : 'DEPLOY'}
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ChatInterface;
