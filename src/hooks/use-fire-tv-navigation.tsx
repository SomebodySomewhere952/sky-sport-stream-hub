import { useEffect, useCallback, useState, useRef, createContext, useContext } from 'react';
import { isTvDevice } from '@/utils/device-detection';

// Fire TV Remote Button Mappings
const FIRE_TV_KEYS = {
  // D-Pad Navigation
  UP: ['ArrowUp', 'Up', 19],
  DOWN: ['ArrowDown', 'Down', 20],
  LEFT: ['ArrowLeft', 'Left', 21], 
  RIGHT: ['ArrowRight', 'Right', 22],
  
  // Action Buttons
  SELECT: ['Enter', ' ', 13, 23, 66],
  BACK: ['Escape', 'Backspace', 4, 8, 27],
  HOME: ['Home', 3, 172],
  MENU: ['Menu', 'ContextMenu', 82, 139],
  
  // Media Controls
  PLAY_PAUSE: ['MediaPlayPause', 'Play', 'Pause', 85, 126, 127, 179],
  REWIND: ['MediaRewind', 'Rewind', 89, 168],
  FAST_FORWARD: ['MediaFastForward', 'FastForward', 90, 208],
  
  // Volume Controls
  VOLUME_UP: ['VolumeUp', 24],
  VOLUME_DOWN: ['VolumeDown', 25],
  MUTE: ['VolumeMute', 164],
  
  // Additional Fire TV Buttons
  INFO: ['Info', 'MediaSelect', 165],
  OPTIONS: ['Options', 'Settings', 'F1', 112],
} as const;

export interface NavigationItem {
  id: string;
  element: HTMLElement | null;
  section: string;
  row: number;
  col: number;
  focusable?: boolean;
  onSelect?: () => void;
  onBack?: () => void;
}

interface NavigationSection {
  id: string;
  name: string;
  items: NavigationItem[];
  defaultFocus?: string;
  priority: number;
}

interface FireTvNavigationState {
  currentSection: string;
  currentFocus: string | null;
  sections: NavigationSection[];
  isNavigationActive: boolean;
}

interface FireTvNavigationContextValue {
  state: FireTvNavigationState;
  registerSection: (section: NavigationSection) => void;
  unregisterSection: (sectionId: string) => void;
  setFocus: (itemId: string) => void;
  navigateToSection: (sectionId: string) => void;
  handleRemoteButton: (buttonType: keyof typeof FIRE_TV_KEYS) => void;
}

const FireTvNavigationContext = createContext<FireTvNavigationContextValue | null>(null);

export function useFireTvNavigation() {
  const context = useContext(FireTvNavigationContext);
  if (!context) {
    throw new Error('useFireTvNavigation must be used within FireTvNavigationProvider');
  }
  return context;
}

export function FireTvNavigationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<FireTvNavigationState>({
    currentSection: 'main',
    currentFocus: null,
    sections: [],
    isNavigationActive: isTvDevice(),
  });

  const lastActionTime = useRef<number>(0);
  const DEBOUNCE_DELAY = 150;

  const registerSection = useCallback((section: NavigationSection) => {
    setState(prev => ({
      ...prev,
      sections: [...prev.sections.filter(s => s.id !== section.id), section]
        .sort((a, b) => a.priority - b.priority)
    }));
  }, []);

  const unregisterSection = useCallback((sectionId: string) => {
    setState(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== sectionId)
    }));
  }, []);

  const findElement = useCallback((itemId: string): HTMLElement | null => {
    // First try to find by data attribute
    let element = document.querySelector(`[data-tv-id="${itemId}"]`) as HTMLElement | null;
    
    // Fallback to searching in registered sections
    if (!element) {
      for (const section of state.sections) {
        const item = section.items.find(item => item.id === itemId);
        if (item?.element) {
          element = item.element;
          break;
        }
      }
    }
    
    return element;
  }, [state.sections]);

  const setFocus = useCallback((itemId: string) => {
    const element = findElement(itemId);
    if (element && element.focus) {
      element.focus();
      
      // Smooth scroll to element
      try {
        element.scrollIntoView({ 
          block: 'nearest', 
          inline: 'nearest', 
          behavior: 'smooth' 
        });
      } catch (error) {
        // Fallback for older browsers
        element.scrollIntoView(false);
      }

      // Update visual focus state
      element.setAttribute('data-tv-focused', 'true');
      
      // Remove focus from other elements
      document.querySelectorAll('[data-tv-focused="true"]')
        .forEach(el => {
          if (el !== element) {
            el.setAttribute('data-tv-focused', 'false');
          }
        });

      setState(prev => ({ ...prev, currentFocus: itemId }));
      return true;
    }
    return false;
  }, [findElement]);

  const navigateToSection = useCallback((sectionId: string) => {
    const section = state.sections.find(s => s.id === sectionId);
    if (section) {
      setState(prev => ({ ...prev, currentSection: sectionId }));
      
      // Focus on default item or first item in section
      const focusItem = section.defaultFocus || section.items[0]?.id;
      if (focusItem) {
        setFocus(focusItem);
      }
    }
  }, [state.sections, setFocus]);

  const findNextItem = useCallback((
    currentId: string, 
    direction: 'up' | 'down' | 'left' | 'right'
  ): NavigationItem | null => {
    const currentSection = state.sections.find(s => s.id === state.currentSection);
    if (!currentSection) return null;

    const currentItem = currentSection.items.find(item => item.id === currentId);
    if (!currentItem) return null;

    const { row, col } = currentItem;
    let candidates: NavigationItem[] = [];

    switch (direction) {
      case 'up':
        candidates = currentSection.items.filter(item => 
          item.row < row && item.focusable !== false
        ).sort((a, b) => {
          const rowDiff = Math.abs(a.row - row);
          const colDiff = Math.abs(a.col - col);
          return rowDiff + colDiff * 0.1;
        });
        break;

      case 'down': 
        candidates = currentSection.items.filter(item => 
          item.row > row && item.focusable !== false
        ).sort((a, b) => {
          const rowDiff = Math.abs(a.row - row);
          const colDiff = Math.abs(a.col - col);
          return rowDiff + colDiff * 0.1;
        });
        break;

      case 'left':
        candidates = currentSection.items.filter(item => 
          item.col < col && item.focusable !== false
        ).sort((a, b) => {
          const colDiff = Math.abs(a.col - col);
          const rowDiff = Math.abs(a.row - row);
          return colDiff + rowDiff * 0.1;
        });
        break;

      case 'right':
        candidates = currentSection.items.filter(item => 
          item.col > col && item.focusable !== false
        ).sort((a, b) => {
          const colDiff = Math.abs(a.col - col);
          const rowDiff = Math.abs(a.row - row);
          return colDiff + rowDiff * 0.1;
        });
        break;
    }

    return candidates[0] || null;
  }, [state.sections, state.currentSection]);

  const handleRemoteButton = useCallback((buttonType: keyof typeof FIRE_TV_KEYS) => {
    const now = Date.now();
    if (now - lastActionTime.current < DEBOUNCE_DELAY) return;
    lastActionTime.current = now;

    const currentSection = state.sections.find(s => s.id === state.currentSection);
    const currentItem = currentSection?.items.find(item => item.id === state.currentFocus);

    switch (buttonType) {
      case 'UP':
      case 'DOWN':
      case 'LEFT':
      case 'RIGHT': {
        if (!state.currentFocus) {
          // No current focus, focus on first item of current section
          const firstItem = currentSection?.items[0];
          if (firstItem) setFocus(firstItem.id);
          return;
        }

        const direction = buttonType.toLowerCase() as 'up' | 'down' | 'left' | 'right';
        const nextItem = findNextItem(state.currentFocus, direction);
        
        if (nextItem) {
          setFocus(nextItem.id);
        } else {
          // Try to navigate to adjacent section
          if (direction === 'left' || direction === 'right') {
            const sections = state.sections.filter(s => s.items.length > 0);
            const currentIndex = sections.findIndex(s => s.id === state.currentSection);
            
            if (direction === 'left' && currentIndex > 0) {
              navigateToSection(sections[currentIndex - 1].id);
            } else if (direction === 'right' && currentIndex < sections.length - 1) {
              navigateToSection(sections[currentIndex + 1].id);
            }
          }
        }
        break;
      }

      case 'SELECT': {
        if (currentItem?.onSelect) {
          currentItem.onSelect();
        } else if (state.currentFocus) {
          const element = findElement(state.currentFocus);
          if (element) {
            element.click();
          }
        }
        break;
      }

      case 'BACK': {
        if (currentItem?.onBack) {
          currentItem.onBack();
        } else {
          // Navigate back to previous section or home
          navigateToSection('main');
        }
        break;
      }

      case 'HOME': {
        navigateToSection('main');
        break;
      }

      case 'MENU': {
        // Open app menu/settings
        navigateToSection('menu');
        break;
      }

      case 'PLAY_PAUSE':
      case 'REWIND':
      case 'FAST_FORWARD': {
        // Handle media controls if in video player
        if (state.currentSection === 'player') {
          const element = document.querySelector('[data-media-player]');
          if (element) {
            element.dispatchEvent(new CustomEvent(`firetv-${buttonType.toLowerCase()}`, {
              bubbles: true,
              detail: { buttonType }
            }));
          }
        }
        break;
      }
    }
  }, [state, findNextItem, setFocus, navigateToSection, findElement]);

  const isFireTvKey = useCallback((event: KeyboardEvent): keyof typeof FIRE_TV_KEYS | null => {
    const key = event.key;
    const code = event.keyCode || event.which;

    for (const [buttonType, keyCodes] of Object.entries(FIRE_TV_KEYS)) {
      if (keyCodes.some(k => 
        (typeof k === 'string' && k === key) || 
        (typeof k === 'number' && k === code)
      )) {
        return buttonType as keyof typeof FIRE_TV_KEYS;
      }
    }
    return null;
  }, []);

  useEffect(() => {
    if (!state.isNavigationActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const buttonType = isFireTvKey(event);
      if (buttonType) {
        event.preventDefault();
        handleRemoteButton(buttonType);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.isNavigationActive, isFireTvKey, handleRemoteButton]);

  // Initialize with main section focus
  useEffect(() => {
    if (state.isNavigationActive && !state.currentFocus && state.sections.length > 0) {
      const mainSection = state.sections.find(s => s.id === 'main') || state.sections[0];
      if (mainSection && mainSection.items.length > 0) {
        const focusItem = mainSection.defaultFocus || mainSection.items[0].id;
        setTimeout(() => setFocus(focusItem), 100);
      }
    }
  }, [state.sections, state.currentFocus, state.isNavigationActive, setFocus]);

  const contextValue: FireTvNavigationContextValue = {
    state,
    registerSection,
    unregisterSection,
    setFocus,
    navigateToSection,
    handleRemoteButton,
  };

  return (
    <FireTvNavigationContext.Provider value={contextValue}>
      {children}
    </FireTvNavigationContext.Provider>
  );
}

// Hook for individual components to register with navigation system
export function useTvNavigationSection(section: Omit<NavigationSection, 'items'>) {
  const { registerSection, unregisterSection } = useFireTvNavigation();
  const [items, setItems] = useState<NavigationItem[]>([]);

  const registerItem = useCallback((item: NavigationItem) => {
    setItems(prev => [...prev.filter(i => i.id !== item.id), item]);
  }, []);

  const unregisterItem = useCallback((itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
  }, []);

  useEffect(() => {
    registerSection({ ...section, items });
    return () => unregisterSection(section.id);
  }, [section, items, registerSection, unregisterSection]);

  return { registerItem, unregisterItem };
}