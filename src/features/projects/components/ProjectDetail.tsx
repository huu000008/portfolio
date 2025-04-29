'use client';

import { Project } from '@/types/project';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { InViewMotion } from '@/components/ui/InViewMotion';
import { ProjectHeader } from './ProjectHeader';

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
    <div className="relative">
      <ProjectHeader id={id} userId={userId} title={project.title} />
      <div className="container mx-auto columns-1 gap-8 p-8 [column-fill:_balance] sm:columns-2 lg:columns-3">
        <InViewMotion className="mb-8 w-full break-inside-avoid rounded-md border border-[var(--color-border)] bg-[var(--color-card)] p-8 shadow">
          <div className="md:text-md mb-4 text-lg font-bold md:font-medium">📝 설명</div>
          <div className="text-md whitespace-pre-wrap md:text-sm">{project.description}</div>
        </InViewMotion>

        <InViewMotion className="mb-8 w-full break-inside-avoid rounded-md border border-[var(--color-border)] bg-[var(--color-card)] p-8 shadow">
          <div className="md:text-md mb-4 text-lg font-bold md:font-medium">⏳ 프로젝트 기간</div>
          <div className="text-md md:text-sm">{formatPeriod(project.project_period)}</div>
        </InViewMotion>

        <InViewMotion className="mb-8 w-full break-inside-avoid rounded-md border border-[var(--color-border)] bg-[var(--color-card)] p-8 shadow">
          <div className="md:text-md mb-4 text-lg font-bold md:font-medium">👥 팀 구성</div>
          <div className="text-md whitespace-pre-wrap md:text-sm">{project.team}</div>
        </InViewMotion>

        <InViewMotion className="mb-8 w-full break-inside-avoid rounded-md border border-[var(--color-border)] bg-[var(--color-card)] p-8 shadow">
          <div className="md:text-md mb-4 text-lg font-bold md:font-medium">🧩 맡은 역할</div>
          <div className="text-md whitespace-pre-wrap md:text-sm">{project.roles}</div>
        </InViewMotion>

        <InViewMotion className="mb-8 w-full break-inside-avoid rounded-md border border-[var(--color-border)] bg-[var(--color-card)] p-8 shadow">
          <div className="md:text-md mb-4 text-lg font-bold md:font-medium">
            🛠️ 사용한 기술 스택
          </div>
          <div className="text-md mt-2 flex flex-wrap gap-2 md:text-sm">
            {project.tech_stack?.map(tech => (
              <span
                key={tech}
                className="rounded bg-[var(--color-bg-elevated)] px-2 py-1 text-sm whitespace-nowrap"
              >
                {tech}
              </span>
            ))}
          </div>
        </InViewMotion>

        <InViewMotion className="mb-8 w-full break-inside-avoid rounded-md border border-[var(--color-border)] bg-[var(--color-card)] p-8 shadow">
          <div className="md:text-md mb-4 text-lg font-bold md:font-medium">🌟 주요 기여</div>
          <div className="text-md whitespace-pre-wrap md:text-sm">{project.contributions}</div>
        </InViewMotion>

        <InViewMotion className="mb-8 w-full break-inside-avoid rounded-md border border-[var(--color-border)] bg-[var(--color-card)] p-8 shadow">
          <div className="md:text-md mb-4 text-lg font-bold md:font-medium">🏆 프로젝트 성과</div>
          <div className="text-md whitespace-pre-wrap md:text-sm">{project.achievements}</div>
        </InViewMotion>

        <InViewMotion className="mb-8 w-full break-inside-avoid rounded-md border border-[var(--color-border)] bg-[var(--color-card)] p-8 shadow">
          <div className="md:text-md mb-4 text-lg font-bold md:font-medium">💡 회고 & 느낀 점</div>
          <div className="text-md whitespace-pre-wrap md:text-sm">{project.retrospective}</div>
        </InViewMotion>
      </div>
    </div>
  );
};
