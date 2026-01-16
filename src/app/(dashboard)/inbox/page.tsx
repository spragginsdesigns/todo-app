import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth/user";
import { TodoList } from "@/components/todos/todo-list";
import { AddTodoForm } from "@/components/todos/add-todo-form";

export default async function InboxPage() {
  const userId = await getCurrentUserId();
  const supabase = await createClient();

  // Get the default inbox project for this user
  const { data: inbox } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .eq("is_default", true)
    .single();

  // Fetch todos for inbox - only those with null project_id or matching inbox id
  let query = supabase
    .from("todos")
    .select("*")
    .eq("user_id", userId)
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
      {/* Page header - hidden on mobile since MobileHeader shows title */}
      <div className="hidden md:block">
        <h1 className="text-2xl font-bold text-foreground">Inbox</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your tasks without a project
        </p>
      </div>

      <div className="mt-2 space-y-4 md:mt-6">
        <TodoList
          todos={todos ?? []}
          emptyMessage="No tasks in inbox. Add one below!"
        />
        <AddTodoForm projectId={inbox?.id} />
      </div>
    </div>
  );
}
