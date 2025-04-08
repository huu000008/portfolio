import { Project } from '../../../types/project';
import styles from './ProjectItem.module.scss';
import { TransitionLink } from '@/components/ui/TransitionLink/TransitionLink';
import Image from 'next/image';

type Props = {
  project: Project;
};

export const ProjectItem = ({ project }: Props) => {
  return (
    <TransitionLink className={styles.wrap} href={`/projects/${project.id}`}>
      {project.thumbnail_url && (
        <div className={styles.thumbnail}>
          <Image
            src={project.thumbnail_url}
            alt={`${project.title} 썸네일`}
            width={300}
            height={180}
            className={styles.image}
          />
        </div>
      )}
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
  );
};
