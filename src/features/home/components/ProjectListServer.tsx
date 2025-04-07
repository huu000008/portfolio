import { ProjectItem } from '../../projects/components/ProjectItem';
import { Project } from '@/types/project';
import styles from './ProjectListServer.module.scss';

interface Props {
  projects: Project[];
}

export default function ProjectListServer({ projects }: Props) {
  return (
    <div className={styles.wrap}>
      {projects?.length ? (
        <div className={styles.grid}>
          {projects.map(project => (
            <ProjectItem key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className={styles.empty} role="status">
          등록된 프로젝트가 없습니다.
        </p>
      )}
    </div>
  );
}
