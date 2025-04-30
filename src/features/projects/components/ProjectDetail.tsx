'use client';

import { Project } from '@/types/project';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { InViewMotion } from '@/components/ui/InViewMotion';
import { ProjectHeader } from './ProjectHeader';
import styles from './ProjectDetail.module.scss';

interface ProjectDetailProps {
  project: Project;
  id: string;
  userId: string;
}

const formatDateKST = (dateStr: string) => {
  const date = new Date(dateStr);
  const zoned = toZonedTime(date, 'Asia/Seoul');
  return format(zoned, 'yyyy-MM-dd');
};

export const ProjectDetail = ({ project, id, userId }: ProjectDetailProps) => {
  const formatPeriod = (period: string) => {
    if (!period.includes('~')) return period;
    const [fromStr, toStr] = period.split('~').map(d => d.trim());
    const from = new Date(fromStr);
    const to = new Date(toStr);
    return `${formatDateKST(from.toISOString())} ~ ${formatDateKST(to.toISOString())}`;
  };

  return (
    <div className={styles.projectDetailRoot}>
      <ProjectHeader id={id} userId={userId} title={project.title} />
      <div className={styles.masonry}>
        <InViewMotion className={styles.card}>
          <div className={styles.cardTitle}>📝 설명</div>
          <div className={styles.cardContent}>{project.description}</div>
        </InViewMotion>

        <InViewMotion className={styles.card}>
          <div className={styles.cardTitle}>⏳ 프로젝트 기간</div>
          <div className={styles.cardContent}>{formatPeriod(project.project_period)}</div>
        </InViewMotion>

        <InViewMotion className={styles.card}>
          <div className={styles.cardTitle}>👥 팀 구성</div>
          <div className={styles.cardContent}>{project.team}</div>
        </InViewMotion>

        <InViewMotion className={styles.card}>
          <div className={styles.cardTitle}>🧩 맡은 역할</div>
          <div className={styles.cardContent}>{project.roles}</div>
        </InViewMotion>

        <InViewMotion className={styles.card}>
          <div className={styles.cardTitle}>🛠️ 사용한 기술 스택</div>
          <div className={styles.cardTechStack}>
            {project.tech_stack?.map(tech => (
              <span key={tech} className={styles.cardTech}>
                {tech}
              </span>
            ))}
          </div>
        </InViewMotion>

        <InViewMotion className={styles.card}>
          <div className={styles.cardTitle}>🌟 주요 기여</div>
          <div className={styles.cardContent}>{project.contributions}</div>
        </InViewMotion>

        <InViewMotion className={styles.card}>
          <div className={styles.cardTitle}>🏆 프로젝트 성과</div>
          <div className={styles.cardContent}>{project.achievements}</div>
        </InViewMotion>

        <InViewMotion className={styles.card}>
          <div className={styles.cardTitle}>💡 회고 & 느낀 점</div>
          <div className={styles.cardContent}>{project.retrospective}</div>
        </InViewMotion>
      </div>
    </div>
  );
};
