import React from 'react';

export default function StatusDot({ status = "active" }) {
    const colors = {
        active: "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.4)]",
        warning: "bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.4)]",
        error: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]",
        cyan: "bg-primary shadow-[0_0_8px_rgba(0,240,255,0.4)]",
    };

    return (
        <div className={`w-2 h-2 rounded-full ${colors[status]} animate-pulse`} />
    );
}
