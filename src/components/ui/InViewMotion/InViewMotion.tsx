'use client';

import { ElementType, useRef } from 'react';
import { motion, useInView, Variants, Transition } from 'framer-motion';

type InViewMotionProps<T extends React.ElementType> = {
  as?: T;
  children?: React.ReactNode;
  inViewOptions?: {
    once?: boolean;
    amount?: number;
  };
  variants?: Variants;
  transition?: Transition;
} & Omit<React.ComponentPropsWithoutRef<T>, 'variants' | 'transition'>;

export const InViewMotion = <T extends React.ElementType = 'div'>({
  as,
  children,
  inViewOptions = { once: true, amount: 0.3 },
  variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  transition = { duration: 0.5 },
  ...props
}: InViewMotionProps<T>) => {
  const ref = useRef(null);
  const isInView = useInView(ref, inViewOptions);

  const Component = as ? motion(as as ElementType) : motion.div;

  return (
    <Component
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={transition}
      {...props}
    >
      {children}
    </Component>
  );
};
