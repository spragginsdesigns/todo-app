"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth/user";
import type { ProjectInsert, ProjectUpdate } from "@/lib/supabase/types";

export async function createProject(
  data: Pick<ProjectInsert, "name" | "color" | "icon">
) {
  const userId = await getCurrentUserId();
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      name: data.name,
      color: data.color || "#6b7280",
      icon: data.icon || "hash",
      user_id: userId,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { project };
}

export async function updateProject(
  projectId: string,
  data: Pick<ProjectUpdate, "name" | "color" | "icon">
) {
  const userId = await getCurrentUserId();
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .update({
      name: data.name,
      color: data.color,
      icon: data.icon,
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { project };
}

export async function deleteProject(projectId: string) {
  const userId = await getCurrentUserId();
  const supabase = await createClient();

  // Check if it's the default project (and belongs to user)
  const { data: project } = await supabase
    .from("projects")
    .select("is_default")
    .eq("id", projectId)
    .eq("user_id", userId)
    .single();

  if (!project) {
    return { error: "Project not found" };
  }

  if (project.is_default) {
    return { error: "Cannot delete the default Inbox project" };
  }

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .eq("user_id", userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function getProjects() {
  const userId = await getCurrentUserId();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("name", { ascending: true });

  if (error) {
    return { error: error.message, projects: [] };
  }

  return { projects: data };
}

export async function getProjectsWithCounts() {
  const userId = await getCurrentUserId();
  const supabase = await createClient();

  // Get all projects for this user
  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("name", { ascending: true });

  if (projectsError) {
    return { error: projectsError.message, projects: [] };
  }

  // Get todo counts per project for this user
  const { data: todos } = await supabase
    .from("todos")
    .select("project_id, completed")
    .eq("user_id", userId)
    .eq("completed", false);

  // Calculate counts
  const countMap = new Map<string, number>();
  todos?.forEach((todo) => {
    if (todo.project_id) {
      countMap.set(todo.project_id, (countMap.get(todo.project_id) || 0) + 1);
    }
  });

  const projectsWithCounts = projects.map((project) => ({
    ...project,
    todoCount: countMap.get(project.id) || 0,
  }));

  return { projects: projectsWithCounts };
}
