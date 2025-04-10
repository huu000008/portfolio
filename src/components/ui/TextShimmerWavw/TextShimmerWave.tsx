'use client';
import { type JSX } from 'react';
import { motion, Transition } from 'framer-motion';
import classNames from 'classnames';

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
  // 텍스트를 단어로 분할하고 원래 공백을 보존
  const textParts = children.split(/(\s+)/).filter(Boolean);
  // 전체 글자 수 계산
  const totalChars = children.length;

  return (
    <MotionComponent
      className={classNames(
        'relative inline-flex flex-wrap [perspective:500px]',
        '[--base-color:#000] [--base-gradient-color:#fff]',
        className,
      )}
      style={{ color: 'var(--base-color)' }}
    >
      {textParts.map((part, partIndex) => {
        // 각 부분(단어 또는 공백)의 위치 계산
        let charOffset = 0;
        for (let i = 0; i < partIndex; i++) {
          charOffset += textParts[i].length;
        }

        return (
          // 단어는 하나의 단위로 처리
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
                    color: 'var(--base-color)',
                  }}
                  animate={{
                    translateZ: [0, zDistance, 0],
                    translateX: [0, xDistance, 0],
                    translateY: [0, yDistance, 0],
                    scale: [1, scaleDistance, 1],
                    rotateY: [0, rotateYDistance, 0],
                    color: ['var(--base-color)', 'var(--base-gradient-color)', 'var(--base-color)'],
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
