import React from 'react';
import type { SwipeDecision } from '../types/mod';

export const useKeyboardShortcuts = (enabled: boolean, handler: (decision: SwipeDecision) => void) => {
  React.useEffect(() => {
    if (!enabled) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isFormField = target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
      if (isFormField) return;

      const key = event.key.toLowerCase();
      if (key === 'a') {
        event.preventDefault();
        handler('reject');
      }
      if (key === 'b') {
        event.preventDefault();
        handler('approve');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enabled, handler]);
};
