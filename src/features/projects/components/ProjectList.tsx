import { Project } from "../types";
import { ProjectItem } from "./ProjectItem";
import styles from "./ProjectList.module.scss";

type Props = {
  projects: Project[];
};

export const ProjectList = ({ projects }: Props) => {
  return (
    <div className={styles.wrap}>
      {projects.map((project) => (
        <ProjectItem key={project.id} project={project} />
      ))}
    </div>
  );
};
