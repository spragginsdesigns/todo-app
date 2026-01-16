import { createClient } from "@/lib/supabase/server";
import { TodoList } from "@/components/todos/todo-list";
import { AddTodoForm } from "@/components/todos/add-todo-form";

export default async function InboxPage() {
  const supabase = await createClient();

  // Get the default inbox project
  const { data: inbox } = await supabase
    .from("projects")
    .select("*")
    .eq("is_default", true)
    .single();

  // Fetch todos for inbox - only those with null project_id or matching inbox id
  let query = supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: false });

  // Build the filter based on whether inbox exists
  if (inbox?.id) {
    query = query.or(`project_id.is.null,project_id.eq.${inbox.id}`);
  } else {
    // If no inbox project, just get todos with null project_id
    query = query.is("project_id", null);
  }

  const { data: todos, error } = await query;

  if (error) {
    console.error("Error fetching todos:", error);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground">Inbox</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Your tasks without a project
      </p>

      <div className="mt-6 space-y-4">
        <TodoList
          todos={todos ?? []}
          emptyMessage="No tasks in inbox. Add one below!"
        />
        <AddTodoForm projectId={inbox?.id} />
      </div>
    </div>
  );
}
