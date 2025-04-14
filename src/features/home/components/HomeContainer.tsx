'use client';

import React from 'react';
import { Project } from '@/types/project';
import styles from './HomeContainer.module.scss';
import RecentProjects from './RecentProjects';
import { useEffect, useRef } from 'react';
import { useProjectStore } from '@/stores/projectStore';
import Skills from './Skills';
import Image from 'next/image';
import { InViewMotion } from '@/components/ui/InViewMotion';

/**
 * 홈 페이지 컨테이너 컴포넌트
 * React 19 최적화와 react-intersection-observer 라이브러리가 적용된 컴포넌트
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
  useEffect(() => {
    if (initialProjects?.length && !initialized.current) {
      setProjects(initialProjects);
      initialized.current = true;
    }
  }, [initialProjects, setProjects]);

  return (
    <div className={styles.wrap}>
      <div className={styles.profile}>
        <InViewMotion className={styles.image} direction="left-to-right">
          <Image
            src="/profile_2.png"
            alt="profile"
            width={100}
            height={100}
            priority
            quality={90}
            sizes="(max-width: 768px) 300px, 500px"
            placeholder="empty"
          />
        </InViewMotion>
        <InViewMotion className={styles.right} delay={0.5}>
          <div className={styles.introduce}>
            <div className={styles.name}>조혁래</div>
            <div className={styles.job}>Frontend Developer</div>
            <div className={styles.birth}>1992.07.12</div>
          </div>
          <div className={styles.description}>
            안녕하세요! 저는 &quot;Just Do&quot; 철학을 지닌 프론트엔드 개발자입니다.
            <br />
            최신 웹 기술을 활용해 사용자 경험을 극대화하는 웹 애플리케이션을 만드는 것을 좋아합니다.
            <br />이 포트폴리오는 단순히 아이디어에 머무르지 않고, 실제로 구현해내는 개발자임을
            보여줍니다.
          </div>
        </InViewMotion>
      </div>
      <div className={styles.inner}>
        <div className={styles.bottom}>
          <div className={styles.skills}>
            <Skills />
          </div>
          <div className={styles.projects}>
            <RecentProjects projects={initialProjects} isLoading={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
