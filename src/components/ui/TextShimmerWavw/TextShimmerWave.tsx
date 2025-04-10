'use client';
import { motion, Transition } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import styles from './TextShimmerWave.module.scss';

type TextShimmerWave = {
  children: string;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  zDistance?: number;
  xDistance?: number;
  yDistance?: number;
  spread?: number;
  scaleDistance?: number;
  rotateYDistance?: number;
  transition?: Transition;
};

export function TextShimmerWave({
  children,
  as: Component = 'p',
  className = '',
  duration = 1,
  zDistance = 10,
  xDistance = 2,  
  yDistance = -2,
  spread = 1,
  scaleDistance = 1.1,
  rotateYDistance = 10,
  transition, 
}: TextShimmerWave) {
  const { theme } = useTheme();
  const textParts = children.split(/(\s+)/).filter(Boolean);
  const totalChars = children.length;

  // 테마에 따른 색상 직접 지정 (CSS 변수 사용하지 않음)
  const baseColor = theme === 'dark' ? '#fff' : '#000';
  const gradientColor = theme === 'dark' ? '#000' : '#fff';

  // 컴포넌트 타입에 따라 적절한 motion 컴포넌트 선택
  const MotionComponent =
    Component === 'div'
      ? motion.div
      : Component === 'span'
        ? motion.span
        : Component === 'h1'
          ? motion.h1
          : Component === 'h2'
            ? motion.h2
            : Component === 'h3'
              ? motion.h3
              : Component === 'h4'
                ? motion.h4
                : Component === 'h5'
                  ? motion.h5
                  : Component === 'h6'
                    ? motion.h6
                    : motion.p;

  return (
    <MotionComponent key={theme} className={`${styles.wrap} ${className}`}>
      {textParts.map((part, partIndex) => {
        let charOffset = 0;
        for (let i = 0; i < partIndex; i++) {
          charOffset += textParts[i].length;
        }

        return (
          <span key={partIndex} className="inline-block whitespace-pre">
            {part.split('').map((char, charIndex) => {
              const globalCharIndex = charOffset + charIndex;
              const delay = (globalCharIndex * duration * (1 / spread)) / totalChars;

              return (
                <motion.span
                  key={`${partIndex}-${charIndex}`}
                  className={styles.char}
                  initial={{
                    translateZ: 0,
                    scale: 1,
                    rotateY: 0,
                    color: baseColor,
                  }}
                  animate={{
                    translateZ: [0, zDistance, 0],
                    translateX: [0, xDistance, 0],
                    translateY: [0, yDistance, 0],
                    scale: [1, scaleDistance, 1],
                    rotateY: [0, rotateYDistance, 0],
                    color: [baseColor, gradientColor, baseColor],
                  }}
                  transition={{
                    duration: duration,
                    repeat: Infinity,
                    repeatDelay: (totalChars * 0.05) / spread,
                    delay,
                    ease: 'easeInOut',
                    ...(transition || {}),
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              );
            })}
          </span>
        );
      })}
    </MotionComponent>
  );
}
