'use client';

import { memo, useMemo } from 'react';
import { motion, Transition, MotionProps } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import styles from './TextShimmerWave.module.scss';

// 타입 정의 개선
interface TextShimmerWaveProps {
  children: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  duration?: number;
  zDistance?: number;
  xDistance?: number;
  yDistance?: number;
  spread?: number;
  scaleDistance?: number;
  rotateYDistance?: number;
  transition?: Transition;
  baseColor?: string;
  gradientColor?: string;
  disableAnimation?: boolean;
}

// 모션 컴포넌트 맵핑을 객체로 간소화
const motionComponentMap: Record<string, any> = {
  div: motion.div,
  span: motion.span,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
};

// 개별 문자를 렌더링하는 메모이즈된 컴포넌트
const AnimatedCharacter = memo(
  ({
    char,
    delay,
    baseColor,
    gradientColor,
    animationConfig,
    disableAnimation,
  }: {
    char: string;
    delay: number;
    baseColor: string;
    gradientColor: string;
    animationConfig: {
      duration: number;
      repeatDelay: number;
      zDistance: number;
      xDistance: number;
      yDistance: number;
      scaleDistance: number;
      rotateYDistance: number;
    };
    disableAnimation?: boolean;
    transition?: Transition;
  }) => {
    const {
      duration,
      repeatDelay,
      zDistance,
      xDistance,
      yDistance,
      scaleDistance,
      rotateYDistance,
    } = animationConfig;

    const motionProps: MotionProps = disableAnimation
      ? { style: { color: baseColor } }
      : {
          initial: {
            translateZ: 0,
            scale: 1,
            rotateY: 0,
            color: baseColor,
          },
          animate: {
            translateZ: [0, zDistance, 0],
            translateX: [0, xDistance, 0],
            translateY: [0, yDistance, 0],
            scale: [1, scaleDistance, 1],
            rotateY: [0, rotateYDistance, 0],
            color: [baseColor, gradientColor, baseColor],
          },
          transition: {
            duration,
            repeat: Infinity,
            repeatDelay,
            delay,
            ease: 'easeInOut',
          },
        };

    return (
      <motion.span className={styles.char} {...motionProps}>
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    );
  },
);

AnimatedCharacter.displayName = 'AnimatedCharacter';

export const TextShimmerWave = memo(function TextShimmerWave({
  children,
  as = 'p',
  className = '',
  duration = 1,
  zDistance = 10,
  xDistance = 2,
  yDistance = -2,
  spread = 1,
  scaleDistance = 1.1,
  rotateYDistance = 10,
  transition,
  baseColor: customBaseColor,
  gradientColor: customGradientColor,
  disableAnimation = false,
}: TextShimmerWaveProps) {
  const { theme } = useTheme();

  // 테마별 기본 색상 계산 (사용자 정의 색상이 없을 경우)
  const baseColor = customBaseColor || (theme === 'dark' ? '#fff' : '#000');
  const gradientColor = customGradientColor || (theme === 'dark' ? '#000' : '#fff');

  // 컴포넌트 선택 로직 간소화
  const MotionComponent = motionComponentMap[as] || motion.p;

  // 텍스트 파싱 및 애니메이션 설정 메모이제이션
  const { parsedTextParts, totalChars } = useMemo(() => {
    const textParts = children.split(/(\s+)/).filter(Boolean);
    const totalChars = children.length;
    return { parsedTextParts: textParts, totalChars };
  }, [children]);

  // 애니메이션 구성 메모이제이션
  const animationConfig = useMemo(
    () => ({
      duration,
      repeatDelay: (totalChars * 0.05) / spread,
      zDistance,
      xDistance,
      yDistance,
      scaleDistance,
      rotateYDistance,
    }),
    [duration, totalChars, spread, zDistance, xDistance, yDistance, scaleDistance, rotateYDistance],
  );

  return (
    <MotionComponent
      key={theme}
      className={`${styles.wrap} ${className}`}
      // 스크린 리더를 위한 접근성 추가
      aria-label={children}
    >
      {parsedTextParts.map((part, partIndex) => {
        // 현재 단어 이전까지의 문자 수 계산
        let charOffset = 0;
        for (let i = 0; i < partIndex; i++) {
          charOffset += parsedTextParts[i].length;
        }

        return (
          <span key={partIndex} className="inline-block whitespace-pre">
            {part.split('').map((char, charIndex) => {
              const globalCharIndex = charOffset + charIndex;
              const delay = (globalCharIndex * duration * (1 / spread)) / totalChars;

              return (
                <AnimatedCharacter
                  key={`${partIndex}-${charIndex}`}
                  char={char}
                  delay={delay}
                  baseColor={baseColor}
                  gradientColor={gradientColor}
                  animationConfig={animationConfig}
                  disableAnimation={disableAnimation}
                />
              );
            })}
          </span>
        );
      })}
    </MotionComponent>
  );
});
