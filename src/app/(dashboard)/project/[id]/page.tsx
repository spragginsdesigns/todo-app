import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TodoList } from "@/components/todos/todo-list";
import { AddTodoForm } from "@/components/todos/add-todo-form";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch the project
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (projectError || !project) {
    notFound();
  }

  // Fetch todos for this project
  const { data: todos, error: todosError } = await supabase
    .from("todos")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false });

  if (todosError) {
    console.error("Error fetching todos:", todosError);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-3">
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: project.color || "#6b7280" }}
        />
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
