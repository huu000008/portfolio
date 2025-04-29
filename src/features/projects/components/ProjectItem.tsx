import { Project } from '../../../types/project';
import Link from 'next/link';
import Image from 'next/image';
import { InViewMotion } from '@/components/ui/InViewMotion';

type Props = {
  project: Project;
};

export const ProjectItem = ({ project }: Props) => {
  return (
    <InViewMotion>
      <Link
        className="flex flex-col gap-4 transition-transform overflow-hidden no-underline border border-[var(--color-border)] rounded-md hover:-translate-y-1 focus:-translate-y-1"
        href={{ pathname: `/projects/${project.id}` }}
        aria-label={`${project.title} 프로젝트 상세 정보 보기`}
      >
        <div className="flex items-center justify-center w-full h-72 p-8 relative overflow-hidden bg-white">
          <Image
            src={project.thumbnail_url || 'https://dummyimage.com/600x400'}
            alt={`${project.title} 썸네일`}
            width={600}
            height={400}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            className="w-full h-full object-contain object-center transition-transform rounded-sm will-change-transform"
            priority={false}
            quality={80}
            fetchPriority="low"
            decoding="async"
          />
        </div>
        <div className="flex flex-col gap-3 flex-1 w-full p-12">
          <h3 className="text-2xl font-bold m-0">{project.title}</h3>
          {project.description && (
            <p className="text-lg text-[var(--color-text-secondary)] m-0 line-clamp-2 overflow-hidden text-ellipsis">
              {project.description}
            </p>
          )}
          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {project.tech_stack.map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-[var(--color-bg-elevated)] rounded whitespace-nowrap text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </InViewMotion>
  );
};
