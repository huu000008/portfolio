'use client';

import { ElementType, useRef, useMemo, memo } from 'react';
import { motion, useInView, Variants, Transition } from 'framer-motion';

// 방향성 타입 정의
export type Direction = 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top';

// 애니메이션 미리 정의
const ANIMATIONS = {
  leftToRight: (distance: number): Variants => ({
    hidden: { opacity: 0, x: -distance },
    visible: { opacity: 1, x: 0 },
  }),
  rightToLeft: (distance: number): Variants => ({
    hidden: { opacity: 0, x: distance },
    visible: { opacity: 1, x: 0 },
  }),
  topToBottom: (distance: number): Variants => ({
    hidden: { opacity: 0, y: -distance },
    visible: { opacity: 1, y: 0 },
  }),
  bottomToTop: (distance: number): Variants => ({
    hidden: { opacity: 0, y: distance },
    visible: { opacity: 1, y: 0 },
  }),
};

// 방향별 기본 variants 미리 정의 (재사용 가능)
const DIRECTION_VARIANTS: Record<Direction, (distance: number) => Variants> = {
  'left-to-right': ANIMATIONS.leftToRight,
  'right-to-left': ANIMATIONS.rightToLeft,
  'top-to-bottom': ANIMATIONS.topToBottom,
  'bottom-to-top': ANIMATIONS.bottomToTop,
};

// 기본 InView 옵션
const DEFAULT_INVIEW_OPTIONS = { once: true, amount: 0.3 };

type InViewMotionProps<T extends React.ElementType> = {
  as?: T;
  children?: React.ReactNode;
  direction?: Direction;
  distance?: number;
  delay?: number;
  inViewOptions?: {
    once?: boolean;
    amount?: number;
  };
  variants?: Variants;
  transition?: Transition;
} & Omit<React.ComponentPropsWithoutRef<T>, 'variants' | 'transition'>;

function InViewMotionBase<T extends React.ElementType = 'div'>(props: InViewMotionProps<T>) {
  const {
    as,
    children,
    direction = 'bottom-to-top',
    distance = 20,
    delay = 0,
    inViewOptions = DEFAULT_INVIEW_OPTIONS,
    variants,
    transition,
    ...rest
  } = props;

  const ref = useRef(null);
  const isInView = useInView(ref, inViewOptions);

  // variants 메모이제이션
  const finalVariants = useMemo(
    () => variants || DIRECTION_VARIANTS[direction](distance),
    [variants, direction, distance],
  );

  // transition 객체 메모이제이션
  const finalTransition = useMemo(
    () => ({
      duration: 0.5,
      ...(transition || {}),
      delay: transition?.delay ?? delay,
    }),
    [transition, delay],
  );

  const Component = as ? motion(as as ElementType) : motion.div;

  return (
    <Component
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={finalVariants}
      transition={finalTransition}
      {...rest}
    >
      {children}
    </Component>
  );
}

export const InViewMotion = memo(InViewMotionBase);
