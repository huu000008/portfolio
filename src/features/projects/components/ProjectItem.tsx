import { Project } from "../types";
import { SafeHtml } from "@/components/ui/SafeHtml";

type Props = {
  project: Project;
};

export const ProjectItem = ({ project }: Props) => {
  return (
    <div className="wrap">
      <div className="title">{project.title}</div>
      <SafeHtml html={project.content} />
    </div>
  );
};
