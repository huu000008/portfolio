'use client';
import { type JSX } from 'react';
import { motion, Transition } from 'framer-motion';
import classNames from 'classnames';
import { useTheme } from '@/hooks/useTheme';

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
  className,
  duration = 1,
  zDistance = 10,
  xDistance = 2,
  yDistance = -2,
  spread = 1,
  scaleDistance = 1.1,
  rotateYDistance = 10,
  transition,
}: TextShimmerWave) {
  const MotionComponent = motion.create(Component as keyof JSX.IntrinsicElements);
  const { theme } = useTheme();
  const textParts = children.split(/(\s+)/).filter(Boolean);
  const totalChars = children.length;

  // 테마에 따른 색상 직접 지정 (CSS 변수 사용하지 않음)
  const baseColor = theme === 'dark' ? '#d0d5dd' : '#3d3121';
  const gradientColor = theme === 'dark' ? '#e67e22' : '#e67e22';

  return (
    <MotionComponent
      key={theme}
      className={classNames('relative inline-flex flex-wrap [perspective:500px]', className)}
      style={{ color: baseColor }}
    >
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
                  className="inline-block [transform-style:preserve-3d]"
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
                    ...transition,
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
