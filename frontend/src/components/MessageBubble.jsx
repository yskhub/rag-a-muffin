import React, { useState } from 'react';

const MessageBubble = ({ message }) => {
    const isUser = message.role === 'user';
    const [showSources, setShowSources] = useState(false);

    return (
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-2 group/msg`}>
            {/* Header Metadata */}
            <div className="flex items-center gap-3 px-1">
                <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isUser ? 'order-2 text-indigo-400' : 'text-purple-400'}`}>
                    {isUser ? 'Operator_Log' : 'Muffin_Pulse'}
                </span>
                <span className="text-[9px] font-mono text-gray-600 tabular-nums">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
            </div>

            {/* Bubble Content */}
            <div className={`
                relative px-6 py-4 transition-all duration-300 max-w-[85%]
                ${isUser
                    ? 'bg-indigo-600/10 border border-indigo-500/30 text-indigo-100 rounded-2xl rounded-tr-none'
                    : 'glass text-gray-200 border-white/10 rounded-2xl rounded-tl-none hover:border-white/20'
                }
            `}>
                <div className="text-[13px] leading-relaxed font-medium whitespace-pre-wrap">
                    {message.content}
                </div>

                {!isUser && message.sources && message.sources.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                        <button
                            onClick={() => setShowSources(!showSources)}
                            className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-indigo-400 transition-colors"
                        >
                            <span>{showSources ? '▼' : '▶'}</span>
                            KNOWLEDGE_FRAGMENTS ({message.sources.length})
                        </button>

                        {showSources && (
                            <div className="mt-4 space-y-2 animate-slide-up">
                                {message.sources.map((source, i) => (
                                    <div key={i} className="p-3 bg-white/[0.02] border border-white/5 rounded-lg group/source hover:bg-white/[0.04] transition-all">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-[10px] font-mono font-bold text-indigo-400/80 truncate pr-4 uppercase">
                                                {source.filename || `node_pk_${i}`}
                                            </span>
                                            <span className="text-[8px] font-mono text-gray-600 bg-white/5 px-1.5 py-0.5 rounded">
                                                SCORE: {(source.score * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-gray-500 italic leading-relaxed line-clamp-2 italic">
                                            "{source.content}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className={`
                flex items-center gap-4 opacity-0 group-hover/msg:opacity-100 transition-opacity duration-300 px-1
                ${isUser ? 'flex-row-reverse' : ''}
            `}>
                {!isUser && (
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(message.content);
                        }}
                        className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-white transition-colors"
                    >
                        Copy
                    </button>
                )}
                {isUser && <span className="text-indigo-500 text-[10px]">SYNC_COMPLETE</span>}
            </div>
        </div>
    );
};

export default MessageBubble;
