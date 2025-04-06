import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  title?: string;
  description: string;
  variant: ToastVariant;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastStore>(set => ({
  toasts: [],
  addToast: toast => {
    const id = uuidv4();
    const newToast = { ...toast, id };

    set(state => ({
      toasts: [...state.toasts, newToast],
    }));

    if (toast.duration) {
      setTimeout(() => {
        set(state => ({
          toasts: state.toasts.filter(t => t.id !== id),
        }));
      }, toast.duration);
    }
  },
  removeToast: id => {
    set(state => ({
      toasts: state.toasts.filter(toast => toast.id !== id),
    }));
  },
  clearToasts: () => {
    set({ toasts: [] });
  },
}));
