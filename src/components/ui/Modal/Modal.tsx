'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import styles from './Modal.module.scss';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
}

export const Modal = ({
  open,
  onOpenChange,
  children,
  trigger,
  title = '모달 창',
  description = '모달 설명',
}: ModalProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <VisuallyHidden asChild>
            <Dialog.Title>{title}</Dialog.Title>
          </VisuallyHidden>
          <VisuallyHidden asChild>
            <Dialog.Description>{description}</Dialog.Description>
          </VisuallyHidden>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
