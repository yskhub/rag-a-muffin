# Phase 4: Frontend Development

> **Duration: 4 Days** | **Difficulty: Intermediate** | **Cost: $0.00**

---

## 🎯 Phase Objectives

By the end of this phase, you will have:
- ✅ React chat interface with Tailwind CSS
- ✅ Message bubbles with source citations  
- ✅ Admin dashboard for document management
- ✅ Document upload with progress tracking
- ✅ Zustand state management
- ✅ Axios API service layer

---

## 📋 Day 10-11: Core Components

### Step 4.1: Create API Service

Create `frontend/src/services/api.js`:

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

export const chatApi = {
  sendMessage: async (message, sessionId = null) => {
    const response = await api.post('/chat', { message, session_id: sessionId });
    return response.data;
  },
  clearSession: async (sessionId) => {
    const response = await api.delete(`/session/${sessionId}`);
    return response.data;
  },
  healthCheck: async () => api.get('/health').then(r => r.data),
};

export const documentsApi = {
  uploadDocument: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => onProgress?.(Math.round((e.loaded * 100) / e.total)),
    });
    return response.data;
  },
  getStats: async () => api.get('/documents/stats').then(r => r.data),
  getSources: async () => api.get('/documents/sources').then(r => r.data),
  deleteDocument: async (name) => api.delete(`/documents/source/${encodeURIComponent(name)}`).then(r => r.data),
  clearAll: async () => api.delete('/documents/clear').then(r => r.data),
};

export const adminApi = {
  getDashboard: async () => api.get('/admin/dashboard').then(r => r.data),
  seedSampleData: async () => api.post('/admin/seed-sample-data').then(r => r.data),
};

export default api;
```

### Step 4.2: Create Zustand Store

Create `frontend/src/store/chatStore.js`:

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { chatApi } from '../services/api';

const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const useChatStore = create(
  persist(
    (set, get) => ({
      messages: [],
      sessionId: generateSessionId(),
      isLoading: false,
      error: null,

      sendMessage: async (content) => {
        const { sessionId, messages } = get();
        const userMessage = { id: Date.now(), role: 'user', content, timestamp: new Date().toISOString() };
        
        set({ messages: [...messages, userMessage], isLoading: true, error: null });

        try {
          const response = await chatApi.sendMessage(content, sessionId);
          const assistantMessage = {
            id: Date.now() + 1,
            role: 'assistant',
            content: response.answer,
            sources: response.sources || [],
            timestamp: new Date().toISOString(),
          };
          set((state) => ({ messages: [...state.messages, assistantMessage], isLoading: false }));
        } catch (error) {
          set({ isLoading: false, error: 'Failed to send message. Please try again.' });
        }
      },

      clearMessages: () => set({ messages: [], sessionId: generateSessionId(), error: null }),
      clearError: () => set({ error: null }),
    }),
    { name: 'chat-storage', partialize: (state) => ({ messages: state.messages.slice(-50), sessionId: state.sessionId }) }
  )
);

export default useChatStore;
```

### Step 4.3: Create Message Bubble

Create `frontend/src/components/MessageBubble.jsx`:

```jsx
import React, { useState } from 'react';

const MessageBubble = ({ message }) => {
  const [showSources, setShowSources] = useState(false);
  const isUser = message.role === 'user';
  const hasSources = message.sources?.length > 0;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
        isUser ? 'bg-blue-600 text-white rounded-br-md' : 'bg-gray-100 text-gray-800 rounded-bl-md'
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
```

### Step 4.4: Create Chat Interface

Create `frontend/src/components/ChatInterface.jsx`:

```jsx
import React, { useState, useEffect, useRef } from 'react';
import useChatStore from '../store/chatStore';
import MessageBubble from './MessageBubble';

const ChatInterface = () => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const { messages, isLoading, error, sendMessage, clearMessages, clearError } = useChatStore();

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
            <h1 className="font-bold text-gray-800">E-Commerce Assistant</h1>
            <p className="text-xs text-gray-500">Powered by FREE AI</p>
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
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}} />
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
```

---

## 📋 Day 12-13: Admin Dashboard

### Step 4.5: Create Document Upload

Create `frontend/src/components/DocumentUpload.jsx`:

```jsx
import React, { useState, useRef } from 'react';
import { documentsApi } from '../services/api';

const DocumentUpload = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(null);
  const fileRef = useRef();

  const handleFile = async (file) => {
    if (!file.name.endsWith('.pdf')) { setMessage({ type: 'error', text: 'Only PDF files allowed' }); return; }
    if (file.size > 10 * 1024 * 1024) { setMessage({ type: 'error', text: 'Max 10MB' }); return; }

    setUploading(true); setProgress(0); setMessage(null);
    try {
      const result = await documentsApi.uploadDocument(file, setProgress);
      setMessage({ type: 'success', text: `Uploaded: ${result.filename} (${result.chunks} chunks)` });
      onUploadComplete?.();
    } catch (e) {
      setMessage({ type: 'error', text: 'Upload failed' });
    } finally { setUploading(false); }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="font-bold mb-4">📄 Upload Documents</h3>
      <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-blue-300">
        <input ref={fileRef} type="file" accept=".pdf" onChange={e => e.target.files[0] && handleFile(e.target.files[0])} className="hidden" />
        <div className="text-4xl mb-2">📁</div>
        <p className="text-gray-600">Click to upload PDF (max 10MB)</p>
      </div>
      {uploading && <div className="mt-4 w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{width:`${progress}%`}} /></div>}
      {message && <div className={`mt-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message.text}</div>}
    </div>
  );
};

export default DocumentUpload;
```

### Step 4.6: Create Admin Dashboard

Create `frontend/src/components/AdminDashboard.jsx`:

```jsx
import React, { useState, useEffect } from 'react';
import { documentsApi, adminApi } from '../services/api';
import DocumentUpload from './DocumentUpload';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [s, src] = await Promise.all([documentsApi.getStats(), documentsApi.getSources()]);
    setStats(s); setSources(src.sources || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSeed = async () => { await adminApi.seedSampleData(); fetchData(); };
  const handleDelete = async (name) => { await documentsApi.deleteDocument(name); fetchData(); };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div><h1 className="text-2xl font-bold">⚙️ Admin Dashboard</h1><p className="text-gray-500">Manage documents</p></div>
          <a href="/" className="px-4 py-2 bg-blue-500 text-white rounded-lg">← Back to Chat</a>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 text-center"><div className="text-2xl">📊</div><p className="text-gray-500 text-sm">Documents</p><p className="text-2xl font-bold">{stats?.total_documents || 0}</p></div>
          <div className="bg-white rounded-xl p-6 text-center"><div className="text-2xl">📁</div><p className="text-gray-500 text-sm">Sources</p><p className="text-2xl font-bold">{sources.length}</p></div>
          <div className="bg-white rounded-xl p-6 text-center"><div className="text-2xl">💰</div><p className="text-gray-500 text-sm">Cost</p><p className="text-2xl font-bold text-green-600">$0</p></div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <DocumentUpload onUploadComplete={fetchData} />
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-bold mb-4">⚡ Actions</h3>
            <button onClick={handleSeed} className="w-full mb-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">🌱 Seed Sample Data</button>
            <button onClick={fetchData} className="w-full px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100">🔄 Refresh</button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
          <h3 className="font-bold mb-4">📚 Sources</h3>
          {sources.length === 0 ? <p className="text-gray-500 text-center py-4">No documents yet</p> : (
            <div className="space-y-2">
              {sources.map(s => (
                <div key={s} className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3">
                  <span>📄 {s}</span>
                  <button onClick={() => handleDelete(s)} className="text-red-500 hover:text-red-700">Delete</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
```

### Step 4.7: Update App.jsx

```jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ChatInterface from './components/ChatInterface';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatInterface />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      {window.location.pathname === '/' && (
        <Link to="/admin" className="fixed bottom-4 right-4 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700">⚙️</Link>
      )}
    </BrowserRouter>
  );
}

export default App;
```

---

## ✅ Phase 4 Checklist

- [ ] API service layer created
- [ ] Zustand store configured
- [ ] MessageBubble with sources
- [ ] ChatInterface complete
- [ ] DocumentUpload working
- [ ] AdminDashboard functional
- [ ] Routing configured

## 🔄 Git Commit

```bash
git add . && git commit -m "Phase 4: Frontend complete" && git push
```

---

**Next: [Phase 5: Integration & Testing](./Phase_5_Integration_Testing.md)**
