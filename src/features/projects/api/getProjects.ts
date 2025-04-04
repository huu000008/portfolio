import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Project } from "../types";

export const getProjects = async (): Promise<Project[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) throw error;

  return data as Project[];
};
