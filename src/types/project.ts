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
  thumbnail_url: string | null;
};

export type ProjectInsert = Omit<Project, 'id' | 'created_at' | 'updated_at'>;
export type ProjectUpdate = Omit<Project, 'id' | 'created_at' | 'updated_at'>;
