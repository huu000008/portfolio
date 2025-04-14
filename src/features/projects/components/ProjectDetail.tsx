'use client';

import { Project } from '@/types/project';
import styles from './ProjectDetail.module.scss';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { InViewMotion } from '@/components/ui/InViewMotion';
import { ProjectHeader } from './ProjectHeader';
import { cn } from '@/lib/utils';

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
    <div className={styles.wrap}>
      <ProjectHeader id={id} userId={userId} className={styles.actions} title={project.title} />
      {/* <div className={styles.date}>{formatDateKST(project.created_at)}</div> */}
      <div className={styles.inner}>
        <InViewMotion className={styles.info}>
          <div className={styles.label}>📝 설명</div>
          <div className={styles.value} style={{ whiteSpace: 'pre-wrap' }}>
            {project.description}
          </div>
        </InViewMotion>

        <InViewMotion className={styles.info}>
          <div className={styles.label}>⏳ 프로젝트 기간</div>
          <div className={styles.value}>{formatPeriod(project.project_period)}</div>
        </InViewMotion>

        <InViewMotion className={styles.info}>
          <div className={styles.label}>👥 팀 구성</div>
          <div className={styles.value} style={{ whiteSpace: 'pre-wrap' }}>
            {project.team}
          </div>
        </InViewMotion>

        <InViewMotion className={styles.info}>
          <div className={styles.label}>🧩 맡은 역할</div>
          <div className={styles.value} style={{ whiteSpace: 'pre-wrap' }}>
            {project.roles}
          </div>
        </InViewMotion>

        <InViewMotion className={styles.info}>
          <div className={styles.label}>🛠️ 사용한 기술 스택</div>
          <div className={cn(styles.value, styles.techStack)}>
            {project.tech_stack?.map(tech => (
              <span key={tech} className={styles.techItem}>
                {tech}
              </span>
            ))}
          </div>
        </InViewMotion>

        <InViewMotion className={styles.info}>
          <div className={styles.label}>🌟 주요 기여</div>
          <div className={styles.value} style={{ whiteSpace: 'pre-wrap' }}>
            {project.contributions}
          </div>
        </InViewMotion>

        <InViewMotion className={styles.info}>
          <div className={styles.label}>🏆 프로젝트 성과</div>
          <div className={styles.value} style={{ whiteSpace: 'pre-wrap' }}>
            {project.achievements}
          </div>
        </InViewMotion>

        <InViewMotion className={styles.info}>
          <div className={styles.label}>💡 회고 & 느낀 점</div>
          <div className={styles.value} style={{ whiteSpace: 'pre-wrap' }}>
            {project.retrospective}
          </div>
        </InViewMotion>
      </div>
    </div>
  );
};
