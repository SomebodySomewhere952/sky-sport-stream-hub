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
    let el: HTMLElement | null | undefined = item?.element;

    if (!el) {
      // Fallback: query by data attribute
      el = document.querySelector(`[data-tv-id="${itemId}"]`) as HTMLElement | null;
    }

    if (el) {
      el.focus();
      currentFocusRef.current = itemId;
      return true;
    }
    return false;
  }, [items]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = (event as any).key as string | undefined;
    const code = (event as any).keyCode ?? (event as any).which;

    const isArrow = (key && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) || [19, 20, 21, 22].includes(code);
    const isSelect = (key === 'Enter' || key === ' ') || [13, 23, 66].includes(code);
    const isBack = (key === 'Escape' || key === 'Backspace') || [4, 8, 27].includes(code);

    if (isArrow) {
      const currentId = currentFocusRef.current;
      let prevented = false;

      if (!currentId) {
        if (items.length > 0) {
          prevented = setFocus(items[0].id);
        }
      } else {
        let direction: 'up' | 'down' | 'left' | 'right' = 'down';
        if (key === 'ArrowUp' || code === 19) direction = 'up';
        else if (key === 'ArrowDown' || code === 20) direction = 'down';
        else if (key === 'ArrowLeft' || code === 21) direction = 'left';
        else if (key === 'ArrowRight' || code === 22) direction = 'right';

        const nextItem = findNextItem(currentId, direction);
        if (nextItem) {
          prevented = setFocus(nextItem.id) || prevented;
        }
      }

      if (prevented) event.preventDefault();
      return;
    }

    if (isSelect) {
      if (currentFocusRef.current && onSelect) {
        onSelect(currentFocusRef.current);
        event.preventDefault();
      }
      return;
    }

    if (isBack) {
      if (onBack) {
        onBack();
        event.preventDefault();
      }
    }
  }, [items, findNextItem, setFocus, onSelect, onBack]);

  useEffect(() => {
    // Set initial focus on next frame to ensure DOM is ready
    const targetId = (initialFocus && items.some(item => item.id === initialFocus))
      ? initialFocus
      : items[0]?.id;

    let raf: number | null = null;
    if (targetId) {
      raf = requestAnimationFrame(() => {
        setFocus(targetId);
      });
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
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