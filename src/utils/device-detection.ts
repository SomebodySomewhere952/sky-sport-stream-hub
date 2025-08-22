// Device detection utilities for optimizing performance on different platforms
export function detectDevice() {
  if (typeof window === 'undefined') return 'unknown';
  
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Fire TV detection
  if (userAgent.includes('afts') || userAgent.includes('aftm') || userAgent.includes('aftb')) {
    return 'fire-tv';
  }
  
  // Android TV detection
  if (userAgent.includes('android tv')) {
    return 'android-tv';
  }
  
  // Apple TV detection
  if (userAgent.includes('apple tv')) {
    return 'apple-tv';
  }
  
  // Generic smart TV detection
  if (userAgent.includes('smart-tv') || userAgent.includes('smarttv')) {
    return 'smart-tv';
  }
  
  // Check for TV-like characteristics
  const isLargeScreen = window.screen?.width >= 1920;
  const isTouchDevice = 'ontouchstart' in window;
  const hasCoarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches;
  
  if (isLargeScreen && !isTouchDevice && hasCoarsePointer) {
    return 'tv-like';
  }
  
  return 'desktop';
}

export function isTvDevice() {
  const device = detectDevice();
  return ['fire-tv', 'android-tv', 'apple-tv', 'smart-tv', 'tv-like'].includes(device);
}

export function isFireTv() {
  return detectDevice() === 'fire-tv';
}

export function applyTvOptimizations() {
  if (typeof document === 'undefined') return;
  
  const device = detectDevice();
  
  // Apply device-specific CSS classes
  document.body.className = document.body.className.replace(/\b(fire-tv|android-tv|apple-tv|smart-tv|tv-like|desktop)\b/g, '');
  document.body.classList.add(device);
  
  if (isTvDevice()) {
    document.body.classList.add('tv-mode');
    
    // Disable smooth scrolling on TV devices for better performance
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Add performance optimizations
    const style = document.createElement('style');
    style.textContent = `
      /* TV Performance Optimizations */
      * {
        will-change: transform, opacity;
      }
      
      .performance-optimized {
        contain: layout style paint;
        transform: translateZ(0);
      }
      
      /* Reduce animation complexity on TV */
      @media (hover: none) {
        * {
          animation-duration: 0.1s !important;
          transition-duration: 0.1s !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Performance monitoring
export function logPerformanceMetrics() {
  if (typeof window === 'undefined' || !window.performance) return;
  
  const device = detectDevice();
  
  setTimeout(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    console.log(`Device: ${device}`);
    if (navigation) {
      console.log(`DOM Content Loaded: ${navigation.domContentLoadedEventEnd - navigation.fetchStart}ms`);
      console.log(`Page Load Complete: ${navigation.loadEventEnd - navigation.fetchStart}ms`);
    }
    
    const firstPaint = performance.getEntriesByName('first-paint')[0];
    if (firstPaint) {
      console.log(`First Paint: ${firstPaint.startTime}ms`);
    }
  }, 1000);
}