import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { chatApi } from '../services/api';

const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const TRANSIENT_ERRORS = [
    'too many requests', 'rate-limited', 'rate limit', 'please wait',
    'try again', 'having trouble', 'system timeout', 'not configured',
];

function isTransientError(content) {
    if (!content) return false;
    const lower = content.toLowerCase();
    return TRANSIENT_ERRORS.some(e => lower.includes(e));
}

const useChatStore = create(
    persist(
        (set, get) => ({
            messages: [],
            sessionId: generateSessionId(),
            isLoading: false,
            error: null,
            // Session history
            savedSessions: [],

            sendMessage: async (content) => {
                const { sessionId, messages } = get();
                const userMessage = {
                    id: Date.now(),
                    role: 'user',
                    content,
                    timestamp: new Date().toISOString(),
                };

                set({ messages: [...messages, userMessage], isLoading: true, error: null });

                const startTime = Date.now();

                try {
                    const response = await chatApi.sendMessage(content, sessionId);
                    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
                    const assistantMessage = {
                        id: Date.now() + 1,
                        role: 'assistant',
                        content: response.answer,
                        sources: response.sources || [],
                        timestamp: new Date().toISOString(),
                        responseTime: elapsed,
                        feedback: null, // null = no feedback, 'up' or 'down'
                    };
                    set((state) => ({ messages: [...state.messages, assistantMessage], isLoading: false }));
                } catch (error) {
                    const errorMsg = error?.response?.data?.detail || 'Connection failed. Is the backend running?';
                    set({ isLoading: false, error: errorMsg });
                }
            },

            setFeedback: (messageId, feedback) => {
                set((state) => ({
                    messages: state.messages.map(m =>
                        m.id === messageId ? { ...m, feedback } : m
                    ),
                }));
            },

            clearMessages: () => {
                const { messages, sessionId, savedSessions } = get();
                // Save current session before clearing (if has messages)
                if (messages.length > 0) {
                    const sessionSummary = {
                        id: sessionId,
                        title: messages.find(m => m.role === 'user')?.content?.slice(0, 40) || 'Untitled',
                        messageCount: messages.length,
                        timestamp: new Date().toISOString(),
                        messages: messages.slice(-20), // Keep last 20 messages
                    };
                    set({
                        savedSessions: [sessionSummary, ...savedSessions].slice(0, 10),
                        messages: [],
                        sessionId: generateSessionId(),
                        error: null,
                    });
                } else {
                    set({ messages: [], sessionId: generateSessionId(), error: null });
                }
            },

            loadSession: (session) => {
                set({
                    messages: session.messages || [],
                    sessionId: session.id,
                    error: null,
                });
            },

            deleteSession: (sessionId) => {
                set((state) => ({
                    savedSessions: state.savedSessions.filter(s => s.id !== sessionId),
                }));
            },

            clearError: () => set({ error: null }),

            exportChat: () => {
                const { messages } = get();
                if (messages.length === 0) return '';
                const text = messages.map(m => {
                    const role = m.role === 'user' ? 'You' : 'AI Engine';
                    const time = m.timestamp ? new Date(m.timestamp).toLocaleString() : '';
                    return `[${time}] ${role}:\n${m.content}\n`;
                }).join('\n---\n\n');
                return text;
            },
        }),
        {
            name: 'chat-storage',
            partialize: (state) => ({
                messages: (state.messages || [])
                    .filter(m => !(m.role === 'assistant' && isTransientError(m.content)))
                    .slice(-50),
                sessionId: state.sessionId,
                savedSessions: (state.savedSessions || []).slice(0, 10),
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    if (!Array.isArray(state.messages)) state.messages = [];
                    if (!Array.isArray(state.savedSessions)) state.savedSessions = [];
                    state.messages = state.messages.filter(
                        m => !(m.role === 'assistant' && isTransientError(m.content))
                    );
                }
            },
        }
    )
);

export default useChatStore;
