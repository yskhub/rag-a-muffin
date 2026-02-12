import React from 'react';

export default function TerminalInput({ value, onChange, onKeyPress, placeholder, disabled }) {
    return (
        <div className="relative w-full group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-primary/30 font-mono font-bold">
                &gt;
            </div>
            <input
                type="text"
                value={value}
                onChange={onChange}
                onKeyPress={onKeyPress}
                disabled={disabled}
                placeholder={placeholder || "TYPE_COMMAND_PACKET..."}
                className="
          w-full bg-black/40 border border-primary/20 
          rounded-xl pl-12 pr-4 py-4 text-primary font-mono text-sm
          focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/50
          placeholder-primary/10 transition-all duration-300
        "
            />
        </div>
    );
}
