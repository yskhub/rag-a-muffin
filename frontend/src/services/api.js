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
