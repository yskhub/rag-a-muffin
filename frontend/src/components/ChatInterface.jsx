import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useChatStore from '../store/chatStore';
import GlassCard from './ui/GlassCard';

const LOADING_STEPS = [
    'Retrieving context fragments...',
    'Injecting neural memory...',
    'Synthesizing response...',
    'Finalizing output stream...'
];

const QUICK_ACTIONS = [
    { label: '📦 Products', prompt: 'What products do you have available?' },
    { label: '🎁 Gift Ideas', prompt: 'Can you help me find a gift?' },
    { label: '💰 Pricing', prompt: 'What are your best deals right now?' },
    { label: '🔍 Search', prompt: 'How do I search for a specific product?' },
    { label: '❓ Help', prompt: 'What can you help me with?' },
];

const ChatInterface = () => {
    const [input, setInput] = useState('');
    const [showSidebar, setShowSidebar] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const {
        messages, isLoading, error, sendMessage, clearError,
        setFeedback, clearMessages, exportChat,
        savedSessions, loadSession, deleteSession,
    } = useChatStore();
    const [loadingStep, setLoadingStep] = useState(0);
    const [copied, setCopied] = useState(false);

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

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyboard = (e) => {
            // Ctrl+K = Clear chat
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                clearMessages();
            }
            // Ctrl+E = Export chat
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                handleExport();
            }
        };
        window.addEventListener('keydown', handleKeyboard);
        return () => window.removeEventListener('keydown', handleKeyboard);
    }, [clearMessages]);

    const handleSend = async (text) => {
        const msg = text || input.trim();
        if (!msg || isLoading) return;
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

    const handleExport = async () => {
        const text = exportChat();
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { /* ignore */ }
    };

    const lastAssistantMsg = [...(messages || [])].reverse().find(m => m.role === 'assistant');

    return (
        <div className="flex flex-col h-full gap-4 overflow-hidden relative">

            {/* Session History Sidebar */}
            {showSidebar && (
                <div className="absolute inset-0 z-40 flex">
                    <div className="w-72 bg-slate-950/95 backdrop-blur-xl border-r border-white/10 flex flex-col animate-slide-up overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                            <h3 className="text-sm font-semibold text-white">Chat History</h3>
                            <button onClick={() => setShowSidebar(false)} className="text-slate-400 hover:text-white text-lg">×</button>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                            {savedSessions.length === 0 ? (
                                <p className="text-xs text-slate-500 text-center py-8">No saved sessions yet. Sessions are saved when you clear the chat.</p>
                            ) : (
                                savedSessions.map((sess) => (
                                    <div key={sess.id} className="glass-subtle p-3 rounded-xl group hover:border-primary/20 transition-all cursor-pointer"
                                        onClick={() => { loadSession(sess); setShowSidebar(false); }}
                                    >
                                        <p className="text-sm font-medium text-slate-200 truncate mb-1">{sess.title}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-slate-500">{sess.messageCount} messages</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-slate-600">
                                                    {new Date(sess.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                </span>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); deleteSession(sess.id); }}
                                                    className="text-[10px] text-red-500/30 hover:text-red-400 transition-colors"
                                                >✕</button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="flex-1 bg-black/40" onClick={() => setShowSidebar(false)} />
                </div>
            )}

            {/* Chat Area */}
            <GlassCard noPadding className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 custom-scrollbar">

                    {/* Empty State */}
                    {messages.length === 0 && !isLoading && (
                        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
                            <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mb-6 animate-float">
                                <span className="text-2xl">◆</span>
                            </div>
                            <h2 className="font-heading text-xl font-semibold text-white mb-3">Ready for input</h2>
                            <p className="text-sm text-slate-400 max-w-md leading-relaxed mb-6">
                                Ask a question to start the knowledge retrieval pipeline. Try one of the quick actions below.
                            </p>
                            {/* Quick Actions */}
                            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                                {QUICK_ACTIONS.map((action, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSend(action.prompt)}
                                        className="px-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-slate-300 hover:bg-primary/5 hover:border-primary/20 hover:text-white transition-all"
                                    >
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                            <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                                {/* Role Tag */}
                                <div className={`flex items-center gap-2 mb-1.5 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                    <div className={`w-2 h-2 rounded-full ${msg.role === 'user' ? 'bg-primary' : 'bg-emerald-400'}`} />
                                    <span className="text-xs font-medium text-slate-400">
                                        {msg.role === 'user' ? 'You' : 'AI Engine'}
                                    </span>
                                    {msg.timestamp && (
                                        <span className="text-[11px] font-mono text-slate-500">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                        </span>
                                    )}
                                    {/* Response time badge */}
                                    {msg.responseTime && (
                                        <span className="text-[10px] font-mono text-primary/50 bg-primary/5 px-1.5 py-0.5 rounded">
                                            {msg.responseTime}s
                                        </span>
                                    )}
                                </div>

                                {/* Bubble */}
                                <div className={`
                                    px-5 py-4 text-sm leading-relaxed
                                    ${msg.role === 'user'
                                        ? 'bg-cyan-950/80 border border-primary/25 text-white rounded-2xl rounded-tr-sm'
                                        : 'bg-slate-800/80 border border-white/10 text-slate-100 rounded-2xl rounded-tl-sm'
                                    }
                                `}>
                                    {msg.role === 'assistant' ? (
                                        <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-headings:text-primary prose-strong:text-white prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1 prose-code:rounded">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <div className="whitespace-pre-wrap">{msg.content}</div>
                                    )}
                                </div>

                                {/* Sources + Feedback for assistant */}
                                {msg.role === 'assistant' && (
                                    <div className="mt-2 flex items-center justify-between flex-wrap gap-2">
                                        {/* Sources */}
                                        <div className="flex flex-wrap gap-1.5">
                                            {msg.sources && msg.sources.length > 0 && msg.sources.map((s, j) => (
                                                <span key={j} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/5 border border-primary/10 rounded-md text-[11px] font-mono text-primary/70">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                                    {s.source || `source_${j}`}
                                                </span>
                                            ))}
                                        </div>
                                        {/* Feedback buttons */}
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => setFeedback(msg.id, msg.feedback === 'up' ? null : 'up')}
                                                className={`p-1.5 rounded-lg text-sm transition-all ${msg.feedback === 'up'
                                                        ? 'bg-emerald-500/10 text-emerald-400'
                                                        : 'text-slate-600 hover:text-emerald-400 hover:bg-emerald-500/5'
                                                    }`}
                                                title="Helpful response"
                                            >👍</button>
                                            <button
                                                onClick={() => setFeedback(msg.id, msg.feedback === 'down' ? null : 'down')}
                                                className={`p-1.5 rounded-lg text-sm transition-all ${msg.feedback === 'down'
                                                        ? 'bg-red-500/10 text-red-400'
                                                        : 'text-slate-600 hover:text-red-400 hover:bg-red-500/5'
                                                    }`}
                                                title="Not helpful"
                                            >👎</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Loading */}
                    {isLoading && (
                        <div className="flex justify-start animate-slide-up">
                            <div className="max-w-[70%]">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-xs font-medium text-slate-400">AI Engine</span>
                                </div>
                                <div className="px-5 py-4 bg-slate-800/50 border border-white/[0.06] rounded-2xl rounded-tl-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                                    </div>
                                    <div className="space-y-1.5">
                                        {LOADING_STEPS.map((step, i) => (
                                            <p key={i} className={`text-xs font-mono transition-all duration-300 ${i <= loadingStep ? 'text-primary/80' : 'text-slate-500'
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
                <div className="px-5 py-4 border-t border-white/[0.06] bg-black/20">
                    {/* Quick actions when there are messages */}
                    {messages.length > 0 && !isLoading && (
                        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                            {QUICK_ACTIONS.slice(0, 3).map((action, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSend(action.prompt)}
                                    className="flex-shrink-0 px-3 py-1.5 bg-white/[0.02] border border-white/[0.06] rounded-lg text-[11px] text-slate-400 hover:bg-primary/5 hover:border-primary/20 hover:text-white transition-all"
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="flex gap-3 items-center">
                        {/* History toggle */}
                        <button
                            onClick={() => setShowSidebar(true)}
                            className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
                            title="Chat history"
                        >
                            <span className="text-base">💬</span>
                        </button>
                        <div className="flex-1 relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                                placeholder="Ask something..."
                                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/10 transition-all"
                            />
                        </div>
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isLoading}
                            className="px-6 py-3.5 bg-primary/10 border border-primary/20 text-primary font-heading text-sm font-semibold tracking-wider uppercase rounded-xl hover:bg-primary/20 hover:shadow-glow disabled:opacity-20 disabled:pointer-events-none transition-all"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </GlassCard>

            {/* Retrieval Sources Panel */}
            <GlassCard className="!p-5">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-slate-300 tracking-wide">Retrieval Sources</h3>
                    <span className="text-xs font-mono text-primary/60">
                        {lastAssistantMsg?.sources?.length || 0} active
                    </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {lastAssistantMsg?.sources && Array.isArray(lastAssistantMsg.sources) && lastAssistantMsg.sources.length > 0 ? (
                        lastAssistantMsg.sources.map((s, i) => (
                            <div key={i} className="flex items-center gap-2 px-3 py-2 bg-primary/5 border border-primary/10 rounded-lg hover:border-primary/30 transition-all">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                                <span className="text-xs font-mono text-primary/80">{s.source || 'unknown'}</span>
                                <span className="text-[11px] font-mono text-slate-500">{s.relevance || 0}%</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-slate-500">No context sources yet. Upload documents via Admin to build the knowledge base.</p>
                    )}
                </div>
            </GlassCard>

            {/* Error */}
            {error && (
                <div className="px-5 py-3 bg-red-500/5 border border-red-500/15 text-red-400 rounded-xl text-sm font-medium flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    {error}
                </div>
            )}
        </div>
    );
};

export default ChatInterface;
