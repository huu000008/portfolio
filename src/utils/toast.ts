import { useToastStore, ToastVariant } from '@/stores/toastStore';

interface ToastOptions {
  title?: string;
  description: string;
  variant?: ToastVariant;
  duration?: number;
}

export const toast = {
  show: (options: ToastOptions) => {
    const { addToast } = useToastStore.getState();
    addToast({
      title: options.title,
      description: options.description,
      variant: options.variant || 'info',
      duration: options.duration || 5000,
    });
  },

  success: (description: string, options?: Omit<ToastOptions, 'description' | 'variant'>) => {
    toast.show({
      description,
      variant: 'success',
      ...options,
    });
  },

  error: (description: string, options?: Omit<ToastOptions, 'description' | 'variant'>) => {
    toast.show({
      description,
      variant: 'error',
      ...options,
    });
  },

  warning: (description: string, options?: Omit<ToastOptions, 'description' | 'variant'>) => {
    toast.show({
      description,
      variant: 'warning',
      ...options,
    });
  },

  info: (description: string, options?: Omit<ToastOptions, 'description' | 'variant'>) => {
    toast.show({
      description,
      variant: 'info',
      ...options,
    });
  },

  dismiss: (id: string) => {
    const { removeToast } = useToastStore.getState();
    removeToast(id);
  },

  clearAll: () => {
    const { clearToasts } = useToastStore.getState();
    clearToasts();
  },
};
