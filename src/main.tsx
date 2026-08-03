// Safeguard window.fetch setter against read-only window.fetch in iframe/sandboxed environments
try {
  if (typeof window !== 'undefined' && window.fetch) {
    const origFetch = window.fetch;
    let currentFetch = origFetch;
    Object.defineProperty(window, 'fetch', {
      configurable: true,
      enumerable: true,
      get: () => currentFetch,
      set: (val) => { currentFetch = val; }
    });
  }
} catch (e) {
  // Ignore if already redefined or non-configurable
}

import React, { StrictMode, Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('anonym_store_info_v1');
      sessionStorage.clear();
    } catch (e) {
      console.error(e);
    }
    window.location.href = window.location.pathname;
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-[#121212] border-2 border-[#D4AF37] rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-amber-950/60 border border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37]">
              ✨
            </div>
            <h1 className="text-xl font-serif font-bold text-[#D4AF37]">
              ANONYM — Espace Récupération
            </h1>
            <p className="text-xs text-gray-300 leading-relaxed">
              Une interruption d'affichage a été interceptée par le système. Cliquez sur le bouton ci-dessous pour réinitialiser la session et charger le tableau de bord.
            </p>
            {this.state.error && (
              <div className="p-3 bg-black border border-gray-800 rounded-xl text-[11px] font-mono text-rose-300 text-left overflow-x-auto max-h-28">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="w-full bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl hover:bg-[#F3E5AB] transition-all cursor-pointer shadow-lg"
            >
              Recharger & Réinitialiser la Session
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </StrictMode>,
);
