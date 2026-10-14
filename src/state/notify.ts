import { create } from 'zustand';

export type ToastLevel = 'info' | 'success' | 'warning' | 'error';
export interface Toast {
  id: number;
  level: ToastLevel;
  text: string;
}

const DURATION_MS = 4000;

/** Messages shown by <Toaster/>; anything can raise one, including code that runs before React renders. */
export const useToasts = create<{ toasts: Toast[] }>(() => ({ toasts: [] }));

let nextId = 0;

export const dismissToast = (id: number) =>
  useToasts.setState((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));

const send = (level: ToastLevel) => (text: string) => {
  const id = ++nextId;
  useToasts.setState((s) => ({ toasts: [...s.toasts, { id, level, text }] }));
  setTimeout(() => dismissToast(id), DURATION_MS);
};

export const notify = { info: send('info'), success: send('success'), warning: send('warning'), error: send('error') };
