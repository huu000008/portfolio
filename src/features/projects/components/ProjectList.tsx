import { Project } from '@/types/project';
import { ProjectItem } from './ProjectItem';
import styles from './ProjectList.module.scss';

interface Props {
  projects: Project[];
}

export const ProjectList = ({ projects }: Props) => {
  if (!projects.length) return <div>프로젝트가 없습니다.</div>;

  return (
    <div className={styles.wrap}>
      {projects.map(project => (
        <ProjectItem key={project.id} project={project} />
      ))}
    </div>
  );
};
