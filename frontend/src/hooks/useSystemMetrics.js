import { useEffect, useState } from "react";

export default function useSystemMetrics() {
    const [metrics, setMetrics] = useState({
        sync: 92.2,
        memory: 67.4,
        fragments: 14382,
        neuroLoad: 12.4,
        uptime: '00:00:00'
    });

    useEffect(() => {
        const start = Date.now();
        const interval = setInterval(() => {
            setMetrics((prev) => {
                const diff = Math.floor((Date.now() - start) / 1000);
                const h = Math.floor(diff / 3600).toString().padStart(2, '0');
                const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
                const s = (diff % 60).toString().padStart(2, '0');

                return {
                    sync: Math.min(100, prev.sync + (Math.random() * 0.1 - 0.05)),
                    memory: Math.min(100, prev.memory + (Math.random() * 0.2 - 0.1)),
                    fragments: prev.fragments + (Math.random() > 0.98 ? 1 : 0),
                    neuroLoad: (12 + Math.random() * 1).toFixed(1),
                    uptime: `${h}:${m}:${s}`
                };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return metrics;
}
