import { Sidebar } from "@/components/layout/sidebar";
import { createClient } from "@/lib/supabase/server";

async function getNavCounts() {
  const supabase = await createClient();

  const today = new Date().toISOString().split("T")[0];

  // Get inbox project
  const { data: inbox } = await supabase
    .from("projects")
    .select("id")
    .eq("is_default", true)
    .single();

  // Get all incomplete todos
  const { data: todos } = await supabase
    .from("todos")
    .select("id, project_id, due_date")
    .eq("completed", false);

  const inboxCount =
    todos?.filter(
      (t) => t.project_id === null || t.project_id === inbox?.id
    ).length || 0;

  const todayCount = todos?.filter((t) => t.due_date === today).length || 0;

  const upcomingCount =
    todos?.filter((t) => t.due_date && t.due_date > today).length || 0;

  return { inbox: inboxCount, today: todayCount, upcoming: upcomingCount };
}

async function getProjects() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("is_default", { ascending: false })
    .order("name", { ascending: true });

  return data || [];
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [projects, counts] = await Promise.all([getProjects(), getNavCounts()]);

  return (
    <div className="flex h-screen">
      <Sidebar projects={projects} counts={counts} />
      <main className="flex-1 overflow-auto bg-background p-6">{children}</main>
    </div>
  );
}
