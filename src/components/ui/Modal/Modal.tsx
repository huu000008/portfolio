'use client';

import * as Dialog from '@radix-ui/react-dialog';
import styles from './Modal.module.scss';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  trigger?: React.ReactNode; // ✅ trigger를 prop으로 받을 수 있도록 추가
}

export const Modal = ({ open, onOpenChange, children, trigger }: ModalProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>{children}</Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
