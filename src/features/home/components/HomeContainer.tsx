'use client';

import { Project } from '@/types/project';
import styles from './HomeContainer.module.scss';
import RecentProjects from './RecentProjects';
import { useEffect, useRef, useTransition, useDeferredValue } from 'react';
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
  // 최적화된 스토어 사용
  const { projects, isLoading, setProjects, fetchProjectsFromServer, refreshProjects } =
    useProjectStore();

  // React 19 Concurrent Mode 최적화
  const [isPending, startTransition] = useTransition();

  // 프로젝트 데이터에 낮은 우선순위 할당 (UI 블로킹 방지)
  const deferredProjects = useDeferredValue(projects || initialProjects);

  // ✅ 최초 1회만 초기 데이터를 세팅 (최적화 유지)
  const initialized = useRef(false);

  // 초기 데이터 설정 및 필요시 서버에서 데이터 페칭
  useEffect(() => {
    // 1. 초기 데이터가 있고 아직 초기화되지 않았으면 스토어에 설정
    if (initialProjects?.length && !initialized.current) {
      setProjects(initialProjects);
      initialized.current = true;
      return;
    }

    // 2. 스토어에 데이터가 없고 로딩 중이 아니면 Server Action으로 데이터 가져오기
    if (!projects?.length && !isLoading && initialized.current) {
      // 트랜지션으로 UI 응답성 유지하며 데이터 페칭
      startTransition(() => {
        fetchProjectsFromServer();
      });
    }
  }, [initialProjects, projects, isLoading, setProjects, fetchProjectsFromServer]);

  // 데이터 새로고침 핸들러 (필요시 컴포넌트에서 호출)
  const handleRefresh = () => {
    startTransition(() => {
      refreshProjects();
    });
  };

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
          {/* 데이터 페칭 중이어도 UI 응답성 유지 */}
          <RecentProjects projects={deferredProjects} isLoading={isLoading || isPending} />
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
