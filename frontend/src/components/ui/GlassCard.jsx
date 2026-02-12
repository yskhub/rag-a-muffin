import React from 'react';

export default function GlassCard({ children, className = "", noPadding = false }) {
    return (
        <div className={`
      bg-cardDark backdrop-blur-xl border border-primary/10 rounded-xl shadow-glow 
      transition-all duration-300 hover:border-primary/20
      ${noPadding ? '' : 'p-6'} 
      ${className}
    `}>
            {children}
        </div>
    );
}
