import { useToastStore } from '@/stores/toastStore';
import { toast } from '@/utils/toast';

export function useToast() {
  const toasts = useToastStore(state => state.toasts);

  return {
    toasts,
    show: toast.show,
    success: toast.success,
    error: toast.error,
    warning: toast.warning,
    info: toast.info,
    dismiss: toast.dismiss,
    clearAll: toast.clearAll,
  };
}
