import React from 'react';
import styles from './Button.module.scss';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button className={cn(styles.wrap, className)} {...props}>
      {children}
    </button>
  );
};
export default Button;
