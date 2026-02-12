import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { chatApi } from '../services/api';

const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Error messages from the backend that indicate temporary issues — don't persist these
const TRANSIENT_ERRORS = [
    'too many requests',
    'rate-limited',
    'rate limit',
    'please wait',
    'try again',
    'having trouble',
    'system timeout',
    'not configured',
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
                    const errorMsg = error?.response?.data?.detail || 'Connection failed. Is the backend running?';
                    set({ isLoading: false, error: errorMsg });
                }
            },

            clearMessages: () => set({ messages: [], sessionId: generateSessionId(), error: null }),
            clearError: () => set({ error: null }),
        }),
        {
            name: 'chat-storage',
            partialize: (state) => ({
                // Don't persist transient error responses
                messages: (state.messages || [])
                    .filter(m => !(m.role === 'assistant' && isTransientError(m.content)))
                    .slice(-50),
                sessionId: state.sessionId,
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    // Ensure messages is always an array
                    if (!Array.isArray(state.messages)) {
                        state.messages = [];
                    }
                    // Clean out any transient error messages that slipped through
                    state.messages = state.messages.filter(
                        m => !(m.role === 'assistant' && isTransientError(m.content))
                    );
                }
            },
        }
    )
);

export default useChatStore;
