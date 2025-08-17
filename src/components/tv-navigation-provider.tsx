import { createContext, useContext, useEffect, useState } from 'react';

interface TvNavigationContextType {
  isFireTv: boolean;
  isTvMode: boolean;
}

const TvNavigationContext = createContext<TvNavigationContextType>({
  isFireTv: false,
  isTvMode: false
});

export function TvNavigationProvider({ children }: { children: React.ReactNode }) {
  const [isFireTv, setIsFireTv] = useState(false);
  const [isTvMode, setIsTvMode] = useState(false);

  useEffect(() => {
    // Detect if running on Fire TV
    const userAgent = navigator.userAgent.toLowerCase();
    const isFireTvDevice = userAgent.includes('afts') || // Fire TV Stick
                          userAgent.includes('aftb') || // Fire TV Box  
                          userAgent.includes('aftm') || // Fire TV
                          userAgent.includes('aft'); // General Fire TV

    const isTvLikeDevice = isFireTvDevice || 
                          window.screen.width >= 1920 || // Large screens
                          userAgent.includes('tv') ||
                          userAgent.includes('smarttv');

    setIsFireTv(isFireTvDevice);
    setIsTvMode(isTvLikeDevice);

    // Add TV-specific CSS class to body
    if (isTvLikeDevice) {
      document.body.classList.add('tv-mode');
    }

    // Optimize for TV input
    if (isFireTvDevice) {
      document.body.classList.add('fire-tv');
      
      // Prevent default behaviors that don't work well on TV
      document.addEventListener('contextmenu', (e) => e.preventDefault());
      document.addEventListener('selectstart', (e) => e.preventDefault());
    }

    return () => {
      document.body.classList.remove('tv-mode', 'fire-tv');
    };
  }, []);

  return (
    <TvNavigationContext.Provider value={{ isFireTv, isTvMode }}>
      {children}
    </TvNavigationContext.Provider>
  );
}

export const useTvNavigation = () => {
  const context = useContext(TvNavigationContext);
  if (!context) {
    throw new Error('useTvNavigation must be used within TvNavigationProvider');
  }
  return context;
};