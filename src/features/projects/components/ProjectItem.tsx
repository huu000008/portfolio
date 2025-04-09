import { Project } from '../../../types/project';
import styles from './ProjectItem.module.scss';
import { TransitionLink } from '@/components/ui/TransitionLink/TransitionLink';
import Image from 'next/image';
import { InViewMotion } from '@/components/ui/InViewMotion';

type Props = {
  project: Project;
};

export const ProjectItem = ({ project }: Props) => {
  return (
    <InViewMotion>
      <TransitionLink className={styles.wrap} href={`/projects/${project.id}`}>
        <div className={styles.thumbnail}>
          <Image
            src={project.thumbnail_url || 'https://dummyimage.com/600x400'}
            alt={`${project.title} 썸네일`}
            width={600}
            height={400}
            priority
            className={styles.image}
          />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{project.title}</h3>
          {project.description && <p className={styles.description}>{project.description}</p>}
          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className={styles.techStack}>
              {project.tech_stack.map((tech, index) => (
                <span key={index} className={styles.techItem}>
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </TransitionLink>
    </InViewMotion>
  );
};
