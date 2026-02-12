import React, { useState } from 'react';

const MessageBubble = ({ message }) => {
    const isUser = message.role === 'user';
    const [showSources, setShowSources] = useState(false);

    return (
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-3 group/msg max-w-full`}>
            {/* Header / Meta - Added more spacing and clearer icons */}
            <div className={`flex items-center gap-4 px-2 ${isUser ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 ${isUser ? 'text-indigo-400' : 'text-indigo-400/70'}`}>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                        {isUser ? 'Human_Operator' : 'Muffin_Unit'}
                    </span>
                    <div className={`w-1 h-1 rounded-full ${isUser ? 'bg-indigo-500' : 'bg-indigo-400/50'}`} />
                </div>
                <span className="text-[9px] font-mono text-white/20 tabular-nums tracking-widest uppercase">
                    PKT_{new Date(message.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
            </div>

            {/* Content Plate - Improved padding and rounded corners */}
            <div className={`
                relative px-7 py-5 transition-all duration-300 w-full md:w-auto md:max-w-[80%] lg:max-w-[70%]
                shadow-xl
                ${isUser
                    ? 'bg-indigo-600/10 border border-indigo-500/30 text-indigo-100/90 rounded-[24px] rounded-tr-none shadow-indigo-500/5'
                    : 'glass text-gray-200 border-white/10 rounded-[24px] rounded-tl-none hover:border-white/20'
                }
            `}>
                <div className="text-sm md:text-base leading-[1.7] whitespace-pre-wrap font-medium tracking-wide">
                    {message.content}
                </div>

                {!isUser && message.sources && message.sources.length > 0 && (
                    <div className="mt-8 pt-5 border-t border-white/5">
                        <button
                            onClick={() => setShowSources(!showSources)}
                            className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400/60 hover:text-indigo-300 transition-all group/btn"
                        >
                            <span className="bg-indigo-500/10 p-1 rounded-md group-hover/btn:bg-indigo-500/20 transition-colors">
                                {showSources ? '−' : '+'}
                            </span>
                            Localized_Context_Nodes ({message.sources.length})
                        </button>

                        {showSources && (
                            <div className="mt-6 space-y-3 animate-slide-up">
                                {message.sources.map((source, i) => (
                                    <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] hover:border-white/10 transition-all group/source">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-mono font-bold text-indigo-400/80 uppercase truncate pr-6">
                                                SRC::{source.filename || `NODE_${i}`}
                                            </span>
                                            <span className="text-[8px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 uppercase">
                                                Match: {(source.score * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-gray-500 leading-relaxed italic line-clamp-3 pl-2 border-l border-white/10">
                                            {source.content}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer Actions - Added copy feedback and cleaner look */}
            {!isUser && (
                <div className="px-4 opacity-0 group-hover/msg:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(message.content);
                        }}
                        className="flex items-center gap-2 text-[9px] font-black text-gray-600 hover:text-white uppercase tracking-widest transition-all"
                    >
                        <span className="text-xs">📋</span> Copy_Transcript
                    </button>
                </div>
            )}
        </div>
    );
};

export default MessageBubble;
