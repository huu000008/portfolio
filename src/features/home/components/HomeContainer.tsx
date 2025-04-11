'use client';

import { Project } from '@/types/project';
import styles from './HomeContainer.module.scss';
import RecentProjects from './RecentProjects';
import { useRef } from 'react';
import { useProjectStore } from '@/stores/projectStore';
import { TransitionLink } from '@/components/ui/TransitionLink/TransitionLink';
import { TextShimmerWave } from '@/components/ui/TextShimmerWavw/TextShimmerWave';
import { InViewMotion } from '@/components/ui/InViewMotion';

/**
 * 홈 페이지 컨테이너 컴포넌트
 * React 19 최적화가 적용된 컴포넌트
 *
 * @param initialProjects 서버에서 미리 가져온 초기 프로젝트 데이터
 */
export default function HomeContainer({ initialProjects }: { initialProjects: Project[] }) {
  // 서버에서 받은 데이터를 직접 사용
  // 클라이언트 스토어는 필요한 경우에만 참조
  const { setProjects } = useProjectStore();

  // 서버 데이터 초기화 플래그
  const initialized = useRef(false);

  // 서버 데이터를 스토어에 한 번만 설정 (필요한 경우만)
  if (initialProjects?.length && !initialized.current) {
    setProjects(initialProjects);
    initialized.current = true;
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>
        <InViewMotion>
          <TextShimmerWave
            duration={1}
            spread={1}
            zDistance={1}
            scaleDistance={1.1}
            rotateYDistance={20}
          >
            Every line of code, a step towards mastery.
          </TextShimmerWave>
        </InViewMotion>
        <div className={styles.bottom}>
          <div className={styles.left}>
            <InViewMotion className={styles.text}>
              기술을 배우고,
              <br />
              경험으로 익히는
              <br />
              프론트엔드 개발자입니다.
            </InViewMotion>
          </div>
          {/* 서버 데이터를 직접 사용해 즉시 렌더링 */}
          <RecentProjects projects={initialProjects} isLoading={false} />
        </div>
        <div className={styles.overview}>
          <InViewMotion className={styles.title}>overniew</InViewMotion>
          <div className={styles.description}>
            <InViewMotion>
              Project 페이지에는 개인 및 팀 프로젝트와 직무에서 진행한 프로젝트의 결과가 담겨
              있습니다. 이 과정에서 고민했던 점, 해결 방법, 관련 공부 기록, 그리고 구현한 기능들을
              통해 저의 기술 스택과 문제 해결 능력을 깊이 있게 확인하실 수 있습니다.
            </InViewMotion>
            <InViewMotion>
              About 페이지에서는 제 경험과 가치관, 그리고 앞으로 프론트엔드 개발자로서 나아가고 싶은
              방향을 간략히 소개하고 있습니다.
            </InViewMotion>
          </div>
          <div className={styles.linkWrap}>
            <InViewMotion>
              <TransitionLink href="/projects" className={styles.asd}>
                Projects
              </TransitionLink>
            </InViewMotion>
            <InViewMotion>
              <TransitionLink href="/about">About</TransitionLink>
            </InViewMotion>
          </div>
        </div>
      </div>
    </div>
  );
}
