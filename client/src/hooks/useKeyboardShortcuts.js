import { useEffect } from 'react';

/**
 * useKeyboardShortcuts Hook
 * Handles keyboard shortcuts for better UX
 */
const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA' ||
        event.target.isContentEditable
      ) {
        // Allow ESC to work in inputs
        if (event.key !== 'Escape') {
          return;
        }
      }

      shortcuts.forEach(({ key, ctrl, shift, alt, callback }) => {
        const keyMatch = event.key.toLowerCase() === key.toLowerCase();
        const ctrlMatch = ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shift ? event.shiftKey : !event.shiftKey;
        const altMatch = alt ? event.altKey : !event.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          event.preventDefault();
          callback(event);
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
};

export default useKeyboardShortcuts;

// Common shortcut presets
export const SHORTCUTS = {
  NEW_TASK: { key: 'n', label: 'N - New Task' },
  NEW_PROJECT: { key: 'p', ctrl: true, label: 'Ctrl+P - New Project' },
  SEARCH: { key: 'k', ctrl: true, label: 'Ctrl+K - Search' },
  ESCAPE: { key: 'Escape', label: 'ESC - Close' },
  SAVE: { key: 's', ctrl: true, label: 'Ctrl+S - Save' },
};
