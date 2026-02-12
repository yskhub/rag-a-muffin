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
        {
            name: 'chat-storage',
            partialize: (state) => ({ messages: state.messages.slice(-50), sessionId: state.sessionId }),
            onRehydrateStorage: (state) => {
                if (state && !Array.isArray(state.messages)) {
                    state.messages = [];
                }
            }
        }
    )
);

export default useChatStore;
