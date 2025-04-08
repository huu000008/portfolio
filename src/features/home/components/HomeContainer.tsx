'use client';

import { Project } from '@/types/project';
import styles from './HomeContainer.module.scss';
import RecentProjects from './RecentProjects';
import { useEffect, useRef } from 'react';
import { useProjectStore } from '@/stores/projectStore';
import { TransitionLink } from '@/components/TransitionLink';

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
        {/* <div className={styles.visual}>
          <span className={styles.text1}>FRONT END & Web Publisher</span>
          <span className={styles.text2}>
            PORTFOLI
            <br />
            WEB DEVELOPER
          </span>
        </div> */}
        <div className={styles.bottom}>
          <div className={styles.left}>
            <div className={styles.text}>
              저의 포트폴리오에 방문해 주셔서 감사합니다.
              <br />
              더욱 전문성 있는 프론트엔드 개발자로 성장하고자 합니다.
              <br />
              새로운 기술을 학습하며, 익숙해지는 것에 전념하고 있습니다.
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
