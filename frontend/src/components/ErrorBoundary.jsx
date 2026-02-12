import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white p-6">
                    <div className="max-w-lg w-full text-center">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                            <span className="text-2xl">⚠</span>
                        </div>
                        <h1 className="text-xl font-semibold mb-2">Something went wrong</h1>
                        <p className="text-sm text-slate-500 mb-6">An unexpected error occurred in the application.</p>

                        <div className="bg-slate-900/50 rounded-xl p-4 mb-6 text-left border border-white/[0.06]">
                            <p className="text-xs text-red-400 font-mono mb-2">{this.state.error?.message || 'Unknown error'}</p>
                            <pre className="text-[9px] text-slate-600 font-mono leading-relaxed overflow-x-auto">
                                {this.state.error?.stack?.split('\n').slice(0, 4).join('\n')}
                            </pre>
                        </div>

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-5 py-2.5 bg-white/[0.05] border border-white/[0.08] text-sm font-medium text-white rounded-lg hover:bg-white/[0.08] transition-all"
                            >
                                Reload Page
                            </button>
                            <button
                                onClick={() => { localStorage.clear(); window.location.reload(); }}
                                className="px-5 py-2.5 bg-red-500/10 border border-red-500/20 text-sm font-medium text-red-400 rounded-lg hover:bg-red-500/15 transition-all"
                            >
                                Clear Data & Reload
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
