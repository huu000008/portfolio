'use client';

import { Project } from '@/types/project';
import styles from './HomeContainer.module.scss';
import RecentProjects from './RecentProjects';
import { useEffect, useRef } from 'react';
import { useProjectStore } from '@/stores/projectStore';
import { TransitionLink } from '@/components/ui/TransitionLink/TransitionLink';
import { TextShimmerWave } from '@/components/ui/TextShimmerWavw/TextShimmerWave';

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
        <TextShimmerWave
          className="[--base-color:#0D74CE] [--base-gradient-color:#5EB1EF] text-[5rem] font-[800]"
          duration={1}
          spread={1}
          zDistance={1}
          scaleDistance={1.1}
          rotateYDistance={20}
        >
          Every line of code, a step towards mastery.
        </TextShimmerWave>
        <div className={styles.bottom}>
          <div className={styles.left}>
            <div className={styles.text}>
              기술을 배우고, 경험으로 익히는 프론트엔드 개발자입니다.
            </div>
            <div className={styles.action}>
              <TransitionLink href="/projects">Projects</TransitionLink>
            </div>
          </div>
          <RecentProjects
            projects={initialProjects || projects}
            isLoading={projects ? false : isLoading}
          />
        </div>
      </div>
    </div>
  );
}
