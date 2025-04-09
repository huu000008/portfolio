'use client';

import { Project } from '@/types/project';
import styles from './HomeContainer.module.scss';
import RecentProjects from './RecentProjects';
import { useEffect, useRef } from 'react';
import { useProjectStore } from '@/stores/projectStore';
import { TransitionLink } from '@/components/ui/TransitionLink/TransitionLink';
import { TextShimmerWave } from '@/components/ui/TextShimmerWavw/TextShimmerWave';
import { InViewMotion } from '@/components/ui/InViewMotion';

export default function HomeContainer({ initialProjects }: { initialProjects: Project[] }) {
  const { projects, isLoading, setProjects, fetchProjects } = useProjectStore();

  // ✅ 최초 1회만 초기 데이터를 세팅
  const initialized = useRef(false);

  useEffect(() => {
    if (initialProjects && !initialized.current) {
      setProjects(initialProjects);
      initialized.current = true;
    }

    if (!projects && !isLoading) {
      fetchProjects();
    }
  }, [initialProjects, projects, isLoading, setProjects, fetchProjects]);

  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>
        <InViewMotion>
          <TextShimmerWave
            className="[--base-color:color-contrast(#FFFFFF vs #0D74CE #5EB1EF)] [--base-gradient-color:color-contrast(#FFFFFF vs #5EB1EF #0D74CE)] text-[5rem] font-[800]"
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
              기술을 배우고, 경험으로 익히는 프론트엔드 개발자입니다.
            </InViewMotion>
          </div>
          <RecentProjects
            projects={initialProjects || projects}
            isLoading={projects ? false : isLoading}
          />
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
