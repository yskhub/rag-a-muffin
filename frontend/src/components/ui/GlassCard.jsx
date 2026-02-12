import React from 'react';

export default function GlassCard({ children, className = "", noPadding = false, hover = true }) {
    return (
        <div className={`
            glass
            ${hover ? 'hover:border-primary/20 hover:shadow-glow transition-all duration-300' : ''}
            ${noPadding ? '' : 'p-6'} 
            ${className}
        `}>
            {children}
        </div>
    );
}
