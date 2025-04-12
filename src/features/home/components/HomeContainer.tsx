'use client';

import { Project } from '@/types/project';
import styles from './HomeContainer.module.scss';
import RecentProjects from './RecentProjects';
import { useRef } from 'react';
import { useProjectStore } from '@/stores/projectStore';
import { TransitionLink } from '@/components/ui/TransitionLink/TransitionLink';
import { InViewMotion } from '@/components/ui/InViewMotion';
import Skills from './Skills';

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
        <div className={styles.bottom}>
          <div className={styles.left}>
            <Skills />
          </div>
          {/* 서버 데이터를 직접 사용해 즉시 렌더링 */}
          <RecentProjects projects={initialProjects} isLoading={false} />
        </div>
        <div className={styles.overview}>
          <div className={styles.title}>overniew</div>
          <div className={styles.description}>
            <p>
              Project 페이지에는 개인 및 팀 프로젝트와 직무에서 진행한 프로젝트의 결과가 담겨
              있습니다. 이 과정에서 고민했던 점, 해결 방법, 관련 공부 기록, 그리고 구현한 기능들을
              통해 저의 기술 스택과 문제 해결 능력을 깊이 있게 확인하실 수 있습니다.
            </p>
            <p>
              About 페이지에서는 제 경험과 가치관, 그리고 앞으로 프론트엔드 개발자로서 나아가고 싶은
              방향을 간략히 소개하고 있습니다.
            </p>
          </div>

          <div className={styles.linkWrap}>
            <InViewMotion>
              <TransitionLink href="/projects" className={styles.asd}>
                Projects
              </TransitionLink>
            </InViewMotion>
            <InViewMotion delay={0.3}>
              <TransitionLink href="/" scrollToTop={true}>
                comming soon{' '}
              </TransitionLink>
            </InViewMotion>
          </div>
        </div>
      </div>
    </div>
  );
}
