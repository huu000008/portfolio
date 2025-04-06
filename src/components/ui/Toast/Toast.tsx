'use client';

import React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { useToastStore, Toast as ToastType } from '@/stores/toastStore';
import styles from './Toast.module.scss';

export const ToastProvider = ToastPrimitive.Provider;
export const ToastViewport = ToastPrimitive.Viewport;

interface ToastProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

export const Toast = ({ toast, onDismiss }: ToastProps) => {
  const { id, title, description, variant } = toast;

  return (
    <ToastPrimitive.Root
      className={`${styles.toastRoot} ${styles[variant]}`}
      onOpenChange={open => {
        if (!open) onDismiss(id);
      }}
    >
      {title && <ToastPrimitive.Title className={styles.toastTitle}>{title}</ToastPrimitive.Title>}
      <ToastPrimitive.Description className={styles.toastDescription}>
        {description}
      </ToastPrimitive.Description>
      <ToastPrimitive.Close className={styles.toastClose}>
        <span aria-hidden>×</span>
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <ToastProvider>
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
      <ToastViewport className={styles.toastViewport} />
    </ToastProvider>
  );
};
