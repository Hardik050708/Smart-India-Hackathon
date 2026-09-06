import React from 'react';
import { ShieldAlert, RefreshCw, RotateCcw } from 'lucide-react';

/**
 * Scoped boundary for a single role panel.
 * A crash inside one stakeholder view must degrade to that panel only --
 * the header, role switcher and remaining views stay usable.
 */
export const ViewErrorBoundary = ({ children, resetKey }) => (
  <ErrorBoundary variant="inline" resetKey={resetKey}>
    {children}
  </ErrorBoundary>
);

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  componentDidUpdate(prevProps) {
    // Recover automatically when the caller switches context (e.g. new role panel)
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, error: null });
    }
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
      if (this.props.variant === 'inline') {
        return (
          <div className="bg-white rounded-3xl p-8 sm:p-10 text-center border border-rose-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="font-black text-sm text-slate-900">This panel could not be displayed</div>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              The rest of the portal is still available &mdash; switch role above, or retry this view.
            </p>
            {this.state.error && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-[10px] text-rose-600 max-w-lg mx-auto text-left break-words">
                {String(this.state.error).slice(0, 180)}
              </div>
            )}
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Panel</span>
              </button>
              <button
                onClick={this.handleReset}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset & Reload Portal</span>
              </button>
            </div>
          </div>
        );
      }

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
