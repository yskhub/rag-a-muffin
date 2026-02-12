import React from 'react';

export default function CommandButton({ children, onClick, disabled, className = "", variant = "primary" }) {
    const styles = {
        primary: "border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 hover:shadow-glow hover:text-white",
        ghost: "border-white/5 bg-transparent text-slate-500 hover:text-white hover:bg-white/5",
        danger: "border-red-500/30 bg-red-500/5 text-red-500 hover:bg-red-500/10 hover:text-white",
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
        px-4 py-2 rounded-lg border font-heading text-[10px] font-bold tracking-[0.2em] uppercase
        transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:pointer-events-none
        ${styles[variant]}
        ${className}
      `}
        >
            {children}
        </button>
    );
}
