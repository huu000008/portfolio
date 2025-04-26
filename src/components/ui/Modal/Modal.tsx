'use client';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
} from '@/components/ui/dialog';
import styles from './Modal.module.scss';

interface ModalProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  children: React.ReactNode;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
}

export const Modal = ({
  open,
  onOpenChangeAction,
  children,
  trigger,
  title = '모달 창',
  description = '모달 설명',
}: ModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogPortal>
        <DialogOverlay className={styles.overlay} />
        <DialogContent className={styles.content}>
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <DialogDescription className="sr-only">{description}</DialogDescription>
          {children}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
