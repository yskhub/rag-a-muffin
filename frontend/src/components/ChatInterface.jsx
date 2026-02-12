import React, { useState, useEffect, useRef } from 'react';
import useChatStore from '../store/chatStore';
import MessageBubble from './MessageBubble';
import GlassCard from './ui/GlassCard';
import TerminalInput from './ui/TerminalInput';
import CommandButton from './ui/CommandButton';

const ChatInterface = () => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const { messages, isLoading, error, sendMessage } = useChatStore();
    const [loadingStep, setLoadingStep] = useState('');

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isLoading) {
            const steps = [
                'RETRIEVING_CONTEXT_FRAGMENTS...',
                'INJECTING_NEURAL_MEMORY...',
                'SYNTHESIZING_RESPONSE...',
                'FINALIZING_DATA_STREAM...'
            ];
            let i = 0;
            const interval = setInterval(() => {
                setLoadingStep(steps[i]);
                i = (i + 1) % steps.length;
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isLoading]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        const msg = input.trim();
        setInput('');
        await sendMessage(msg);
    };

    // Get the latest assistant message to show retrieval sources at the bottom
    const lastAssistantMsg = [...(messages || [])].reverse().find(m => m.role === 'assistant');

    return (
        <div className="flex flex-col h-full gap-6 overflow-hidden">

            {/* Main Chat Area */}
            <GlassCard noPadding className="flex-1 flex flex-col overflow-hidden bg-slate-900/10 border-white/5">
                <div className="flex-1 overflow-y-auto px-10 py-10 space-y-10 custom-scrollbar">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center animate-pulse">
                            <div className="text-6xl mb-8 opacity-20">📡</div>
                            <h2 className="text-2xl font-bold text-white uppercase tracking-tighter italic mb-4">Awaiting_Sync_Request</h2>
                            <p className="text-[10px] font-bold text-primary/30 uppercase tracking-[0.4em] max-w-xs mx-auto leading-relaxed">
                                System ready for knowledge retrieval. <br /> Initialize command packet to begin.
                            </p>
                        </div>
                    )}

                    {messages.map((msg, i) => (
                        <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-slide-up`}>
                            {/* Role Label */}
                            <span className={`text-[9px] font-black uppercase tracking-[0.3em] mb-3 px-2 ${msg.role === 'user' ? 'text-primary' : 'text-slate-500'}`}>
                                {msg.role === 'user' ? 'OPERATOR_PROMPT' : 'SYSTEM_RESPONSE'}
                            </span>

                            {/* Message Bubble */}
                            <div className={`
                                max-w-[85%] px-6 py-4 rounded-2xl text-[14px] leading-relaxed tracking-wide
                                ${msg.role === 'user'
                                    ? 'bg-primary/10 border border-primary/30 text-white rounded-tr-none'
                                    : 'bg-slate-800/70 border border-white/5 text-slate-200 rounded-tl-none'
                                }
                            `}>
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex flex-col items-start animate-slide-up">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] mb-3 px-2 text-slate-500">SYSTEM_PROCESSING</span>
                            <div className="flex flex-col gap-2 px-6 py-4 bg-slate-800/20 border border-white/5 rounded-2xl rounded-tl-none">
                                <div className="flex gap-1.5 mb-1">
                                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                </div>
                                <span className="text-[10px] font-mono text-primary/40 uppercase tracking-widest">{loadingStep}</span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-8 border-t border-white/5 bg-slate-950/40">
                    <div className="flex gap-4 max-w-4xl mx-auto w-full">
                        <TerminalInput
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleSend()}
                            disabled={isLoading}
                        />
                        <CommandButton
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="px-10"
                        >
                            DEPLOY
                        </CommandButton>
                    </div>
                </div>
            </GlassCard>

            {/* Retrieval Sources Block (Proof of RAG) */}
            <GlassCard className="py-5 px-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Retrieval_Context_Manifest</h3>
                    <div className="h-[1px] flex-1 mx-6 bg-white/5" />
                    <span className="text-[10px] font-mono font-bold text-primary italic uppercase tracking-widest">
                        {lastAssistantMsg?.sources?.length || 0} Nodes_Active
                    </span>
                </div>

                <div className="flex flex-wrap gap-3">
                    {lastAssistantMsg?.sources && Array.isArray(lastAssistantMsg.sources) && lastAssistantMsg.sources.length > 0 ? (
                        lastAssistantMsg.sources.map((s, i) => (
                            <div key={i} className="px-3 py-1.5 bg-primary/5 border border-primary/10 rounded-lg flex items-center gap-3 group hover:border-primary/40 transition-all cursor-default">
                                <span className="text-[9px] font-mono font-bold text-primary uppercase">SRC::{s.source || 'CACHE_NODE'}</span>
                                <div className="w-[1px] h-3 bg-white/10" />
                                <span className="text-[9px] font-mono text-slate-500 uppercase">FIT: {s.relevance || 0}%</span>
                            </div>
                        ))
                    ) : (
                        <span className="text-[9px] font-mono text-slate-700 uppercase tracking-widest italic">No context nodes localized in current handshake.</span>
                    )}
                </div>
            </GlassCard>

            {error && (
                <div className="px-6 py-4 bg-red-500/5 border border-red-500/20 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-4 animate-shake">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                    System_Fault: {error}
                </div>
            )}
        </div>
    );
};

export default ChatInterface;
