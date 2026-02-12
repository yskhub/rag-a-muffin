import React, { useEffect, useState } from "react";

export default function NeuralCore() {
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setRotation((prev) => (prev + 0.5) % 360);
        }, 16);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Outer Shell */}
            <div
                className="absolute w-full h-full rounded-full border border-primary/10"
                style={{ transform: `rotate(${rotation}deg)` }}
            />

            {/* Dynamic Rings */}
            <div
                className="absolute w-[85%] h-[85%] rounded-full border border-accent/20 border-dashed"
                style={{ transform: `rotate(-${rotation * 1.2}deg)` }}
            />

            <div
                className="absolute w-[70%] h-[70%] rounded-full border border-primary/30"
                style={{ transform: `rotate(${rotation * 0.8}deg)` }}
            />

            {/* Core Energy */}
            <div className="w-12 h-12 bg-primary/10 rounded-full blur-xl animate-pulse" />
            <div className="absolute w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_#00f0ff]" />

            {/* Data Nodes */}
            {[0, 90, 180, 270].map((angle, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 bg-accent rounded-full"
                    style={{
                        transform: `rotate(${rotation * 1.5 + angle}deg) translateX(55px)`
                    }}
                />
            ))}
        </div>
    );
}
