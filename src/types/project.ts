export type Project = {
  id: string;
  title: string;
  description: string;
  project_period: string;
  team: string;
  roles: string;
  tech_stack: string[];
  contributions: string;
  achievements: string;
  retrospective: string;
  created_at: string;
  updated_at: string | null;
};
