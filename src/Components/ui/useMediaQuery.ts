import { useSyncExternalStore } from 'react';

/** The breakpoint where both definition panels fit side by side. */
export const WIDE = '(min-width: 992px)';

export const useMediaQuery = (query: string) =>
  useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches
  );
