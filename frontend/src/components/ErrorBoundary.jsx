import React from 'react';

class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white font-mono p-4">
                    <div className="max-w-2xl w-full bg-red-950/20 border border-red-500/30 rounded-2xl p-8 shadow-2xl">
                        <div className="text-6xl mb-6">😵</div>
                        <h1 className="text-2xl font-bold mb-2 uppercase tracking-tighter text-red-500">System_Critical_Failure</h1>
                        <p className="text-slate-400 mb-8 text-sm">A terminal error occurred in the neural core. Diagnostics required.</p>

                        <div className="bg-black/40 rounded-lg p-4 mb-8 overflow-x-auto text-left">
                            <p className="text-red-400 font-bold mb-2">Error: {this.state.error?.message || 'Unknown Error'}</p>
                            <pre className="text-[10px] text-slate-500 leading-tight">
                                {this.state.error?.stack?.split('\n').slice(0, 5).join('\n')}
                            </pre>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => window.location.reload()}
                                className="px-6 py-3 bg-red-500/20 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500/30 transition-all uppercase text-[10px] font-bold tracking-widest">
                                Re-Initialize_Engine
                            </button>
                            <button onClick={() => { localStorage.clear(); window.location.reload(); }}
                                className="px-6 py-3 bg-slate-800 border border-white/10 text-white rounded-lg hover:bg-slate-700 transition-all uppercase text-[10px] font-bold tracking-widest">
                                WIPE_PERSISTENCE (FIX_STORAGE)
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
