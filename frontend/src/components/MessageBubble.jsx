import React, { useState } from 'react';

const MessageBubble = ({ message }) => {
    const isUser = message.role === 'user';
    const [showSources, setShowSources] = useState(false);

    return (
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-1.5 group/msg`}>
            {/* Header / Meta */}
            <div className="flex items-center gap-2 px-1">
                <span className={`text-[8px] font-black uppercase tracking-widest ${isUser ? 'order-2 text-indigo-400' : 'text-indigo-400/60'}`}>
                    {isUser ? 'USER_PROMPT' : 'SYSTEM_REPLY'}
                </span>
                <span className="text-[8px] font-mono text-white/20 tabular-nums">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>

            {/* Content Plate */}
            <div className={`
                relative px-5 py-3.5 transition-all duration-300 max-w-[90%] md:max-w-[75%]
                ${isUser
                    ? 'bg-indigo-600/10 border border-indigo-500/20 text-indigo-100/90 rounded-2xl rounded-tr-none'
                    : 'glass text-gray-200 border-white/5 rounded-2xl rounded-tl-none hover:border-white/10'
                }
            `}>
                <div className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {message.content}
                </div>

                {!isUser && message.sources && message.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/5">
                        <button
                            onClick={() => setShowSources(!showSources)}
                            className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-indigo-400/50 hover:text-indigo-400 transition-colors"
                        >
                            <span className="text-[10px]">{showSources ? '−' : '+'}</span>
                            Context_Fragments
                        </button>

                        {showSources && (
                            <div className="mt-3 space-y-2 animate-slide-up">
                                {message.sources.map((source, i) => (
                                    <div key={i} className="p-3 bg-white/[0.01] border border-white/5 rounded-xl hover:bg-white/[0.02] transition-all">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[9px] font-mono font-bold text-indigo-400/80 uppercase truncate pr-4">
                                                {source.filename || `node_${i}`}
                                            </span>
                                            <span className="text-[7px] font-mono text-white/20 bg-white/5 px-1 rounded uppercase">
                                                Lnk: {(source.score * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-gray-500 leading-relaxed italic line-clamp-2">
                                            "{source.content}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            {!isUser && (
                <div className="px-2 opacity-0 group-hover/msg:opacity-100 transition-opacity">
                    <button
                        onClick={() => navigator.clipboard.writeText(message.content)}
                        className="text-[8px] font-black text-white/30 hover:text-white uppercase tracking-widest transition-colors"
                    >
                        Copy_Log
                    </button>
                </div>
            )}
        </div>
    );
};

export default MessageBubble;
