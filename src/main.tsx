import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { applyTvOptimizations, logPerformanceMetrics } from './utils/device-detection'

// Apply TV optimizations before rendering
applyTvOptimizations();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Log performance metrics for debugging
if (import.meta.env.DEV) {
  logPerformanceMetrics();
}
