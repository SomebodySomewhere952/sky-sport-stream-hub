import { useEffect, useCallback, useRef } from 'react';

export interface NavigationItem {
  id: string;
  element: HTMLElement | null;
  row: number;
  col: number;
}

interface UseTvNavigationProps {
  items: NavigationItem[];
  initialFocus?: string;
  onSelect?: (id: string) => void;
  onBack?: () => void;
  gridCols: number;
}

export function useTvNavigation({
  items,
  initialFocus,
  onSelect,
  onBack,
  gridCols
}: UseTvNavigationProps) {
  const currentFocusRef = useRef<string | null>(null);

  const findNextItem = useCallback((currentId: string, direction: 'up' | 'down' | 'left' | 'right') => {
    const currentItem = items.find(item => item.id === currentId);
    if (!currentItem) return null;

    const { row, col } = currentItem;
    let targetRow = row;
    let targetCol = col;

    switch (direction) {
      case 'up':
        targetRow = Math.max(0, row - 1);
        break;
      case 'down':
        targetRow = row + 1;
        break;
      case 'left':
        targetCol = Math.max(0, col - 1);
        break;
      case 'right':
        targetCol = Math.min(gridCols - 1, col + 1);
        break;
    }

    // Find item at target position
    let targetItem = items.find(item => item.row === targetRow && item.col === targetCol);
    
    // If no exact match, find closest item in that direction
    if (!targetItem) {
      if (direction === 'up' || direction === 'down') {
        // Find closest item in the same column
        const sameColItems = items.filter(item => item.col === col);
        if (direction === 'up') {
          targetItem = sameColItems
            .filter(item => item.row < row)
            .sort((a, b) => b.row - a.row)[0];
        } else {
          targetItem = sameColItems
            .filter(item => item.row > row)
            .sort((a, b) => a.row - b.row)[0];
        }
      } else {
        // Find closest item in the same row
        const sameRowItems = items.filter(item => item.row === row);
        if (direction === 'left') {
          targetItem = sameRowItems
            .filter(item => item.col < col)
            .sort((a, b) => b.col - a.col)[0];
        } else {
          targetItem = sameRowItems
            .filter(item => item.col > col)
            .sort((a, b) => a.col - b.col)[0];
        }
      }
    }

    return targetItem;
  }, [items, gridCols]);

  const setFocus = useCallback((itemId: string) => {
    const item = items.find(item => item.id === itemId);
    if (item?.element) {
      item.element.focus();
      currentFocusRef.current = itemId;
    }
  }, [items]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key } = event;
    
    // Handle D-pad navigation
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      event.preventDefault();
      
      const currentId = currentFocusRef.current;
      if (!currentId) {
        // No current focus, focus first item
        if (items.length > 0) {
          setFocus(items[0].id);
        }
        return;
      }

      let direction: 'up' | 'down' | 'left' | 'right';
      switch (key) {
        case 'ArrowUp':
          direction = 'up';
          break;
        case 'ArrowDown':
          direction = 'down';
          break;
        case 'ArrowLeft':
          direction = 'left';
          break;
        case 'ArrowRight':
          direction = 'right';
          break;
        default:
          return;
      }

      const nextItem = findNextItem(currentId, direction);
      if (nextItem) {
        setFocus(nextItem.id);
      }
    }
    
    // Handle Enter/OK button
    else if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      if (currentFocusRef.current && onSelect) {
        onSelect(currentFocusRef.current);
      }
    }
    
    // Handle Back button
    else if (key === 'Escape' || key === 'Backspace') {
      event.preventDefault();
      if (onBack) {
        onBack();
      }
    }
  }, [items, findNextItem, setFocus, onSelect, onBack]);

  useEffect(() => {
    // Set initial focus
    if (initialFocus && items.some(item => item.id === initialFocus)) {
      setFocus(initialFocus);
    } else if (items.length > 0) {
      setFocus(items[0].id);
    }
  }, [initialFocus, items, setFocus]);

  useEffect(() => {
    // Add global keyboard listener
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    currentFocus: currentFocusRef.current,
    setFocus
  };
}