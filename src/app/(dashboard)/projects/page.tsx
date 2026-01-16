import { createClient } from "@/lib/supabase/server";
import { ProjectCard } from "@/components/projects/project-card";
import { AddProjectButton } from "@/components/projects/add-project-button";

export default async function ProjectsPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("is_default", { ascending: false })
    .order("name", { ascending: true });

  // Get task counts per project
  const { data: todos } = await supabase
    .from("todos")
    .select("id, project_id")
    .eq("completed", false);

  const projectsWithCounts = (projects || []).map((project) => ({
    ...project,
    taskCount: todos?.filter((t) => t.project_id === project.id).length || 0,
  }));

  return (
    <div className="mx-auto max-w-2xl">
      {/* Page header - hidden on mobile since MobileHeader shows title */}
      <div className="hidden md:block">
        <h1 className="text-2xl font-bold text-foreground">Projects</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Organize your tasks by project
        </p>
      </div>

      <div className="mt-2 space-y-3 md:mt-6">
        {projectsWithCounts.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}

        <AddProjectButton />
      </div>
    </div>
  );
}
