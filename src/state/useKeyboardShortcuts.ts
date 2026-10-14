import { useEffect } from 'react';
import { useDocumentStore } from './documentStore';

const isTextTarget = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName));

/** Ctrl/Cmd+Z undo, Ctrl/Cmd+Shift+Z or Ctrl/Cmd+Y redo; text fields keep their native undo. */
export const useKeyboardShortcuts = () =>
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || isTextTarget(e.target)) return;
      const key = e.key.toLowerCase();
      const action = key === 'z' ? (e.shiftKey ? 'redo' : 'undo') : key === 'y' ? 'redo' : null;
      if (!action) return;
      e.preventDefault();
      useDocumentStore.getState()[action]();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
