import React, { useState } from 'react';

const MessageBubble = ({ message }) => {
    const [showSources, setShowSources] = useState(false);
    const isUser = message.role === 'user';
    const hasSources = message.sources?.length > 0;

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${isUser ? 'bg-blue-600 text-white rounded-br-md' : 'bg-gray-100 text-gray-800 rounded-bl-md'
                }`}>
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>

                {!isUser && hasSources && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                        <button onClick={() => setShowSources(!showSources)} className="text-xs text-blue-600 font-medium">
                            {showSources ? '▼' : '▶'} {message.sources.length} sources
                        </button>
                        {showSources && (
                            <div className="mt-2 space-y-1">
                                {message.sources.map((s, i) => (
                                    <div key={i} className="bg-gray-50 rounded px-2 py-1 text-xs flex justify-between">
                                        <span>📄 {s.source}{s.page && ` (p.${s.page})`}</span>
                                        <span className="text-green-600">{s.relevance}%</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className={`text-xs mt-2 ${isUser ? 'text-blue-200' : 'text-gray-400'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
