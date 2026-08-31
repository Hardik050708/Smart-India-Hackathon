import React from 'react';
import { ShieldAlert, RefreshCw, RotateCcw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Portal Error Boundary caught exception:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 font-sans">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 max-w-lg w-full text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-rose-900/50 text-rose-400 border border-rose-700/50 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            
            <div className="space-y-1.5">
              <h2 className="text-xl font-black text-white">Portal Exception Detected</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                The portal caught a runtime issue. Click below to clear stored state and re-initialize the Government of Jharkhand portal dataset.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-left font-mono text-[11px] text-rose-300 max-h-32 overflow-y-auto">
                {this.state.error.toString()}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset & Reload Jharkhand Portal</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
