import React, { useEffect, useState } from "react";

export default function NeuralCore() {
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setRotation((prev) => (prev + 0.3) % 360);
        }, 16);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Outer ring */}
            <div
                className="absolute w-full h-full rounded-full border border-primary/8"
                style={{ transform: `rotate(${rotation}deg)` }}
            />

            {/* Middle ring - dashed */}
            <div
                className="absolute w-[80%] h-[80%] rounded-full border border-primary/12 border-dashed"
                style={{ transform: `rotate(-${rotation * 1.3}deg)` }}
            />

            {/* Inner ring */}
            <div
                className="absolute w-[60%] h-[60%] rounded-full border border-primary/20"
                style={{ transform: `rotate(${rotation * 0.7}deg)` }}
            />

            {/* Core glow */}
            <div className="w-10 h-10 bg-primary/8 rounded-full blur-xl animate-pulse" />
            <div className="absolute w-3 h-3 bg-primary rounded-full shadow-[0_0_12px_rgba(0,240,255,0.4)]" />

            {/* Orbital nodes */}
            {[0, 120, 240].map((angle, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 bg-primary/60 rounded-full"
                    style={{
                        transform: `rotate(${rotation * 1.2 + angle}deg) translateX(48px)`
                    }}
                />
            ))}
        </div>
    );
}
