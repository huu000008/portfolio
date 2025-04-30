import { Project } from '../../../types/project';
import Link from 'next/link';
import Image from 'next/image';
import { InViewMotion } from '@/components/ui/InViewMotion';
import styles from './ProjectItem.module.scss';

type Props = {
  project: Project;
};

export const ProjectItem = ({ project }: Props) => {
  return (
    <InViewMotion>
      <Link
        className={styles.itemLink}
        href={{ pathname: `/projects/${project.id}` }}
        aria-label={`${project.title} 프로젝트 상세 정보 보기`}
      >
        <div className={styles.thumbnailWrapper}>
          <Image
            src={project.thumbnail_url || 'https://dummyimage.com/600x400'}
            alt={`${project.title} 썸네일`}
            width={600}
            height={400}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            className={styles.thumbnail}
            priority={false}
            quality={80}
            fetchPriority="low"
            decoding="async"
          />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{project.title}</h3>
          {project.description && <p className={styles.description}>{project.description}</p>}
          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className={styles.techStack}>
              {project.tech_stack.map((tech, index) => (
                <span key={index} className={styles.tech}>
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
