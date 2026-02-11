import React, { useState } from 'react';

const MessageBubble = ({ message }) => {
    const [showSources, setShowSources] = useState(false);
    const isUser = message.role === 'user';
    const hasSources = message.sources?.length > 0;

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full group/msg`}>
            <div className={`flex flex-col gap-1 max-w-[85%] md:max-w-[75%]`}>
                {/* Message Container */}
                <div className={`
                    relative px-5 py-3.5 rounded-[24px] text-sm leading-relaxed transition-all duration-300
                    ${isUser
                        ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-lg shadow-indigo-500/10 rounded-tr-none'
                        : 'glass text-gray-200 border-white/5 rounded-tl-none hover:border-white/10'
                    }
                `}>
                    <p className="whitespace-pre-wrap">{message.content}</p>

                    {/* Sources Section */}
                    {!isUser && hasSources && (
                        <div className="mt-4 pt-3 border-t border-white/5">
                            <button
                                onClick={() => setShowSources(!showSources)}
                                className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                                <span className={`transition-transform duration-300 ${showSources ? 'rotate-90' : ''}`}>▶</span>
                                {message.sources.length} Contextual {message.sources.length === 1 ? 'Source' : 'Sources'}
                            </button>

                            {showSources && (
                                <div className="mt-3 space-y-2 animate-slide-up">
                                    {message.sources.map((s, i) => (
                                        <div key={i} className="flex flex-col gap-1 p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                                            <div className="flex justify-between items-center text-[10px] font-semibold">
                                                <span className="text-gray-400 truncate max-w-[150px]">📄 {s.source}</span>
                                                <span className="text-indigo-400">{s.relevance}% Match</span>
                                            </div>
                                            {s.page && <span className="text-[10px] text-gray-500">Page {s.page}</span>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Timestamp */}
                <div className={`
                    text-[10px] font-medium tracking-wide flex items-center gap-2 opacity-0 group-hover/msg:opacity-100 transition-opacity duration-300
                    ${isUser ? 'justify-end text-gray-500' : 'justify-start text-gray-500'}
                `}>
                    <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isUser && <span className="text-indigo-500">✓</span>}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
