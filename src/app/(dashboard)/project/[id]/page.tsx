import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth/user";
import { TodoList } from "@/components/todos/todo-list";
import { AddTodoForm } from "@/components/todos/add-todo-form";
import { ProjectIcon } from "@/components/projects/project-icon";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const userId = await getCurrentUserId();
  const supabase = await createClient();

  // Fetch the project (only if it belongs to this user)
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  // Return 404 if project doesn't exist or doesn't belong to user
  if (projectError || !project) {
    notFound();
  }

  // Fetch todos for this project (user filter for defense in depth)
  const { data: todos, error: todosError } = await supabase
    .from("todos")
    .select("*")
    .eq("project_id", id)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (todosError) {
    console.error("Error fetching todos:", todosError);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ backgroundColor: project.color ? `${project.color}20` : undefined }}
        >
          <ProjectIcon icon={project.icon} color={project.color} size="lg" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {todos?.length || 0} task{todos?.length !== 1 ? "s" : ""}
      </p>

      <div className="mt-6 space-y-4">
        <TodoList
          todos={todos ?? []}
          emptyMessage={`No tasks in ${project.name}. Add one below!`}
        />
        <AddTodoForm projectId={project.id} />
      </div>
    </div>
  );
}
