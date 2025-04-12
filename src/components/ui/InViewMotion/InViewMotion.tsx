'use client';

import { ElementType, useRef, useMemo, memo } from 'react';
import { motion, useInView, Variants, Transition } from 'framer-motion';

// 방향성 타입 정의
type Direction = 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top';

// 방향별 기본 variants 미리 정의 (재사용 가능)
const DIRECTION_VARIANTS: Record<Direction, (distance: number) => Variants> = {
  'left-to-right': distance => ({
    hidden: { opacity: 0, x: -distance },
    visible: { opacity: 1, x: 0 },
  }),
  'right-to-left': distance => ({
    hidden: { opacity: 0, x: distance },
    visible: { opacity: 1, x: 0 },
  }),
  'top-to-bottom': distance => ({
    hidden: { opacity: 0, y: -distance },
    visible: { opacity: 1, y: 0 },
  }),
  'bottom-to-top': distance => ({
    hidden: { opacity: 0, y: distance },
    visible: { opacity: 1, y: 0 },
  }),
};

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

// 제네릭 타입을 유지하면서 memo 적용을 위한 구현
function InViewMotionBase<T extends React.ElementType = 'div'>(props: InViewMotionProps<T>) {
  const {
    as,
    children,
    direction = 'bottom-to-top',
    distance = 20,
    delay = 0,
    inViewOptions = { once: true, amount: 0.3 },
    variants,
    transition,
    ...rest
  } = props;

  const ref = useRef(null);
  const isInView = useInView(ref, inViewOptions);

  // variants 메모이제이션 - direction이나 distance가 변경될 때만 재계산
  const finalVariants = useMemo(() => {
    // 사용자 정의 variants가 있으면 그대로 사용
    if (variants) return variants;

    // 미리 정의된 방향별 variants 사용
    return DIRECTION_VARIANTS[direction](distance);
  }, [variants, direction, distance]);

  // transition 객체 메모이제이션 - 의존성이 변경될 때만 재계산
  const finalTransition = useMemo(() => {
    if (!transition) {
      return {
        duration: 0.5,
        delay,
      };
    }

    return {
      ...transition,
      delay: transition.delay ?? delay,
    };
  }, [transition, delay]);

  // 컴포넌트 생성
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

// memo로 감싸기
export const InViewMotion = memo(InViewMotionBase);

// 디버깅용 displayName 수동 설정
InViewMotionBase.displayName = 'InViewMotionBase';
(InViewMotion as any).displayName = 'InViewMotion';
