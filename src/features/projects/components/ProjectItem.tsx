import { Project } from '../../../types/project';
import styles from './ProjectItem.module.scss';
import { TransitionLink } from '@/components/TransitionLink';

type Props = {
  project: Project;
};

export const ProjectItem = ({ project }: Props) => {
  return (
    <TransitionLink className={styles.wrap} href={`/projects/${project.id}`}>
      <div className="title">{project.title}</div>
    </TransitionLink>
  );
};
