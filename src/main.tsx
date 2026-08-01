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

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

