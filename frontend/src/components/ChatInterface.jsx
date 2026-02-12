import React, { useState, useEffect, useRef } from 'react';
import useChatStore from '../store/chatStore';
import GlassCard from './ui/GlassCard';

const LOADING_STEPS = [
    'Retrieving context fragments...',
    'Injecting neural memory...',
    'Synthesizing response...',
    'Finalizing output stream...'
];

const ChatInterface = () => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const { messages, isLoading, error, sendMessage, clearError } = useChatStore();
    const [loadingStep, setLoadingStep] = useState(0);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    useEffect(() => {
        if (isLoading) {
            setLoadingStep(0);
            const interval = setInterval(() => {
                setLoadingStep(prev => (prev + 1) % LOADING_STEPS.length);
            }, 1200);
            return () => clearInterval(interval);
        }
    }, [isLoading]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        const msg = input.trim();
        setInput('');
        clearError?.();
        await sendMessage(msg);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Get the latest assistant message for retrieval sources
    const lastAssistantMsg = [...(messages || [])].reverse().find(m => m.role === 'assistant');

    return (
        <div className="flex flex-col h-full gap-4 overflow-hidden">

            {/* Chat Area */}
            <GlassCard noPadding className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 custom-scrollbar">

                    {/* Empty State */}
                    {messages.length === 0 && !isLoading && (
                        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                            <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mb-6 animate-float">
                                <span className="text-2xl">◆</span>
                            </div>
                            <h2 className="font-heading text-lg font-semibold text-white mb-2">Ready for input</h2>
                            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                                Ask a question to start the knowledge retrieval pipeline.
                                Upload documents via the admin panel to build the context index.
                            </p>
                        </div>
                    )}

                    {/* Messages */}
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                            <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                                {/* Role Tag */}
                                <div className={`flex items-center gap-2 mb-1.5 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${msg.role === 'user' ? 'bg-primary' : 'bg-emerald-400'}`} />
                                    <span className="text-[10px] font-medium text-slate-500">
                                        {msg.role === 'user' ? 'You' : 'AI Engine'}
                                    </span>
                                    {msg.timestamp && (
                                        <span className="text-[9px] font-mono text-slate-700">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                        </span>
                                    )}
                                </div>

                                {/* Bubble */}
                                <div className={`
                                    px-5 py-3.5 text-[13.5px] leading-relaxed
                                    ${msg.role === 'user'
                                        ? 'bg-cyan-950/80 border border-primary/25 text-white rounded-2xl rounded-tr-sm'
                                        : 'bg-slate-800/80 border border-white/10 text-slate-100 rounded-2xl rounded-tl-sm'
                                    }
                                `}>
                                    <div className="whitespace-pre-wrap">{msg.content}</div>
                                </div>

                                {/* Sources inline for assistant */}
                                {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                        {msg.sources.map((s, j) => (
                                            <span key={j} className="inline-flex items-center gap-1.5 px-2 py-1 bg-primary/5 border border-primary/10 rounded-md text-[9px] font-mono text-primary/60">
                                                <span className="w-1 h-1 rounded-full bg-primary/40" />
                                                {s.source || `source_${j}`}
                                                <span className="text-slate-600">·</span>
                                                <span className="text-slate-500">{s.relevance || 0}%</span>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Loading Indicator */}
                    {isLoading && (
                        <div className="flex justify-start animate-slide-up">
                            <div className="max-w-[70%]">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-[10px] font-medium text-slate-500">AI Engine</span>
                                </div>
                                <div className="px-5 py-4 bg-slate-800/30 border border-white/[0.04] rounded-2xl rounded-tl-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                                    </div>
                                    <div className="space-y-1">
                                        {LOADING_STEPS.map((step, i) => (
                                            <p key={i} className={`text-[11px] font-mono transition-all duration-300 ${i <= loadingStep ? 'text-primary/80' : 'text-slate-500'
                                                } ${i === loadingStep ? 'loading-step' : ''}`}>
                                                {i < loadingStep ? '✓' : i === loadingStep ? '►' : '○'} {step}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Bar */}
                <div className="px-5 py-4 border-t border-white/[0.04] bg-black/20">
                    <div className="flex gap-3 items-center">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                                placeholder="Ask something..."
                                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-5 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/10 transition-all font-normal"
                            />
                        </div>
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="px-6 py-3 bg-primary/10 border border-primary/20 text-primary font-heading text-xs font-semibold tracking-wider uppercase rounded-xl hover:bg-primary/20 hover:shadow-glow disabled:opacity-20 disabled:pointer-events-none transition-all"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </GlassCard>

            {/* Retrieval Sources Panel (RAG proof) */}
            <GlassCard className="!p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[11px] font-semibold text-slate-400 tracking-wide">Retrieval Sources</h3>
                    <span className="text-[10px] font-mono text-primary/50">
                        {lastAssistantMsg?.sources?.length || 0} active
                    </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {lastAssistantMsg?.sources && Array.isArray(lastAssistantMsg.sources) && lastAssistantMsg.sources.length > 0 ? (
                        lastAssistantMsg.sources.map((s, i) => (
                            <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/10 rounded-lg hover:border-primary/30 transition-all">
                                <div className="w-1 h-1 rounded-full bg-primary/50" />
                                <span className="text-[10px] font-mono text-primary/70">{s.source || 'unknown'}</span>
                                <span className="text-[9px] font-mono text-slate-600">{s.relevance || 0}%</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-[11px] text-slate-600 italic">No context sources in current response. Upload documents to build the index.</p>
                    )}
                </div>
            </GlassCard>

            {/* Error */}
            {error && (
                <div className="px-4 py-3 bg-red-500/5 border border-red-500/15 text-red-400 rounded-xl text-[11px] font-medium flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    {error}
                </div>
            )}
        </div>
    );
};

export default ChatInterface;
