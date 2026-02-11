import React, { useState, useEffect, useRef } from 'react';
import useChatStore from '../store/chatStore';
import MessageBubble from './MessageBubble';

const ChatInterface = () => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const { messages, isLoading, error, sendMessage, clearMessages } = useChatStore();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        const msg = input.trim();
        setInput('');
        await sendMessage(msg);
    };

    return (
        <div className="relative flex flex-col h-screen overflow-hidden font-sans selection:bg-indigo-500/30">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[20%] right-[-5%] w-[35%] h-[35%] bg-purple-600/10 blur-[100px] rounded-full" />
                <div className="absolute top-[30%] right-[10%] w-[20%] h-[20%] bg-blue-600/10 blur-[80px] rounded-full animate-float" />
            </div>

            {/* Header */}
            <header className="glass-dark sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/20 rotate-3 hover:rotate-0 transition-transform duration-300">
                            🧁
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-[#0c0e14] rounded-full" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400">
                            RAG-a-Muffin
                        </h1>
                        <p className="text-[10px] uppercase tracking-widest font-semibold text-indigo-400/80">
                            Intelligent AI Concierge
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={clearMessages}
                        className="p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
                        title="Clear History"
                    >
                        <span className="group-hover:scale-110 block transition-transform">🗑️</span>
                    </button>
                </div>
            </header>

            {/* Chat Content */}
            <main className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scroll-smooth">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-slide-up">
                        <div className="relative mb-8">
                            <div className="w-32 h-32 bg-indigo-500/10 rounded-full flex items-center justify-center text-7xl animate-float">
                                👋
                            </div>
                            <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full -z-10" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-3">How can I help you today?</h2>
                        <p className="text-gray-400 max-w-sm mx-auto leading-relaxed">
                            I'm your AI-powered shopping assistant. Ask me about our latest products, policies, or technical specs!
                        </p>
                        <div className="grid grid-cols-2 gap-3 mt-10 max-w-lg w-full">
                            {['Check return policy', 'Compare headphones', 'Shipping rates', 'New arrivals'].map(tag => (
                                <button 
                                    key={tag}
                                    onClick={() => setInput(tag)}
                                    className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 text-gray-300 text-sm font-medium transition-all text-left"
                                >
                                    {tag} →
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
                        <div className="glass px-6 py-4 rounded-2xl border-indigo-500/20">
                            <div className="flex gap-1.5 items-center">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                                <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                            </div>
                        </div>
                    </div>
                )}
                
                {error && (
                    <div className="mx-auto max-w-max bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-3 rounded-2xl text-sm flex items-center gap-3 animate-slide-up">
                        <span className="text-lg">⚠️</span> {error}
                    </div>
                )}
                <div ref={messagesEndRef} />
            </main>

            {/* Input Footer */}
            <footer className="p-6">
                <div className="max-w-4xl mx-auto relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[28px] blur opacity-10 group-focus-within:opacity-25 transition-opacity duration-300" />
                    <div className="relative glass-dark rounded-[24px] border border-white/10 p-2 flex gap-2">
                        <input
                            type="text" 
                            value={input} 
                            onChange={e => setInput(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleSend()}
                            placeholder="Type your message here..." 
                            disabled={isLoading}
                            className="flex-1 bg-transparent px-6 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-0"
                        />
                        <button 
                            onClick={handleSend} 
                            disabled={!input.trim() || isLoading}
                            className={`px-8 py-3 rounded-2xl font-bold tracking-wide transition-all duration-300 ${
                                !input.trim() || isLoading 
                                ? 'bg-white/5 text-gray-600' 
                                : 'bg-white text-black hover:scale-[1.02] active:scale-95 glow-pulse'
                            }`}
                        >
                            {isLoading ? '...' : 'Send'}
                        </button>
                    </div>
                </div>
                <p className="text-center text-[10px] text-gray-600 mt-4 uppercase tracking-[0.2em] font-medium">
                    Secured by Chromadb Persistent Engine &bull; Zero Data Costs
                </p>
            </footer>
        </div>
    );
};

export default ChatInterface;
