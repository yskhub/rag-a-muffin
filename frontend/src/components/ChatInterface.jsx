import React, { useState, useEffect, useRef } from 'react';
import useChatStore from '../store/chatStore';
import MessageBubble from './MessageBubble';

const ChatInterface = () => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const { messages, isLoading, error, sendMessage, clearMessages } = useChatStore();

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        const msg = input.trim();
        setInput('');
        await sendMessage(msg);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xl">🤖</div>
                    <div>
                        <h1 className="font-bold text-gray-800">RAG-a-Muffin Assistant</h1>
                        <p className="text-xs text-gray-500">Powered by Gemini & ChromaDB</p>
                    </div>
                </div>
                <button onClick={clearMessages} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">🗑️</button>
            </header>

            <main className="flex-1 overflow-y-auto p-4">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="text-4xl mb-4">🛍️</div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome!</h2>
                        <p className="text-gray-500 mb-4">Ask me about products, shipping, returns...</p>
                    </div>
                )}
                {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
                {isLoading && (
                    <div className="flex justify-start mb-4">
                        <div className="bg-gray-100 rounded-2xl px-4 py-3">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
                {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-700 text-sm">{error}</div>}
                <div ref={messagesEndRef} />
            </main>

            <footer className="bg-white border-t px-4 py-3">
                <div className="flex gap-2">
                    <input
                        type="text" value={input} onChange={e => setInput(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about products..." disabled={isLoading}
                        className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button onClick={handleSend} disabled={!input.trim() || isLoading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 disabled:opacity-50">
                        Send
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default ChatInterface;
