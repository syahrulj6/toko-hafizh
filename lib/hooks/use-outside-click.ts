import { RefObject, useEffect } from 'react';

export function useOutsideClick<T extends HTMLElement>(ref: RefObject<T>, onOutsideClick: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!ref.current || !target || ref.current.contains(target)) {
        return;
      }

      onOutsideClick();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOutsideClick();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [enabled, onOutsideClick, ref]);
}
