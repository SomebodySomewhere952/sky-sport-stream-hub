import { useEffect } from 'react';
import { useFireTvNavigation, useTvNavigationSection } from '@/hooks/use-fire-tv-navigation';
import { isTvDevice } from '@/utils/device-detection';

interface FireTvNavigationWrapperProps {
  children: React.ReactNode;
  sectionId: string;
  sectionName: string;
  priority?: number;
  className?: string;
}

export function FireTvNavigationWrapper({ 
  children, 
  sectionId, 
  sectionName, 
  priority = 1,
  className = "" 
}: FireTvNavigationWrapperProps) {
  const { registerItem, unregisterItem } = useTvNavigationSection({
    id: sectionId,
    name: sectionName,
    priority,
  });

  useEffect(() => {
    if (!isTvDevice()) return;

    // Auto-register all focusable elements in this section
    const container = document.querySelector(`[data-tv-section="${sectionId}"]`);
    if (!container) return;

    const focusableElements = container.querySelectorAll('[data-tv-id]');
    
    focusableElements.forEach((element, index) => {
      const tvId = element.getAttribute('data-tv-id');
      if (tvId) {
        // Calculate grid position based on element position
        const rect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        const row = Math.floor((rect.top - containerRect.top) / 100); // Approximate row
        const col = Math.floor((rect.left - containerRect.left) / 200); // Approximate col
        
        registerItem({
          id: tvId,
          element: element as HTMLElement,
          section: sectionId,
          row: row,
          col: col,
          focusable: true,
        });
      }
    });

    return () => {
      focusableElements.forEach(element => {
        const tvId = element.getAttribute('data-tv-id');
        if (tvId) {
          unregisterItem(tvId);
        }
      });
    };
  }, [sectionId, registerItem, unregisterItem]);

  if (!isTvDevice()) {
    return <>{children}</>;
  }

  return (
    <div 
      data-tv-section={sectionId}
      className={`tv-navigation-section ${className}`}
    >
      {children}
    </div>
  );
}