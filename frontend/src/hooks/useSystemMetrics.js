import { useEffect, useState, useCallback } from "react";
import { chatApi, documentsApi, adminApi } from "../services/api";

export default function useSystemMetrics() {
    const [metrics, setMetrics] = useState({
        sync: 0,
        memory: 0,
        fragments: 0,
        neuroLoad: 0,
        uptime: '00:00:00',
        backendStatus: 'checking', // 'online', 'waking', 'offline', 'checking'
        documentsCount: 0,
        model: 'unknown',
    });

    const fetchRealMetrics = useCallback(async () => {
        try {
            setMetrics(prev => ({ ...prev, backendStatus: 'checking' }));

            const health = await chatApi.healthCheck();

            // Try to get document stats
            let docCount = 0;
            try {
                const stats = await documentsApi.getStats();
                docCount = stats?.total_documents || 0;
            } catch (e) { /* ignore */ }

            setMetrics(prev => ({
                ...prev,
                backendStatus: 'online',
                documentsCount: docCount,
                fragments: docCount,
                model: health?.services?.llm || 'Gemini',
                sync: 98.5 + Math.random() * 1.5,
                memory: 40 + Math.random() * 30,
                neuroLoad: (8 + Math.random() * 6).toFixed(1),
            }));
        } catch (e) {
            setMetrics(prev => ({ ...prev, backendStatus: 'offline' }));
        }
    }, []);

    useEffect(() => {
        // Initial fetch
        fetchRealMetrics();

        // Poll every 30 seconds
        const pollInterval = setInterval(fetchRealMetrics, 30000);

        // Uptime counter
        const start = Date.now();
        const uptimeInterval = setInterval(() => {
            const diff = Math.floor((Date.now() - start) / 1000);
            const h = Math.floor(diff / 3600).toString().padStart(2, '0');
            const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
            const s = (diff % 60).toString().padStart(2, '0');
            setMetrics(prev => ({ ...prev, uptime: `${h}:${m}:${s}` }));
        }, 1000);

        return () => {
            clearInterval(pollInterval);
            clearInterval(uptimeInterval);
        };
    }, [fetchRealMetrics]);

    return { ...metrics, refresh: fetchRealMetrics };
}
