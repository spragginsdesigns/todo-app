import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { MobileHeader } from "@/components/layout/mobile-header";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth/user";
import { ensureUserInbox } from "@/lib/actions/user-init";

async function getNavCounts(userId: string) {
  const supabase = await createClient();

  const today = new Date().toISOString().split("T")[0];

  // Get inbox project for this user
  const { data: inbox } = await supabase
    .from("projects")
    .select("id")
    .eq("user_id", userId)
    .eq("is_default", true)
    .single();

  // Get all incomplete todos for this user
  const { data: todos } = await supabase
    .from("todos")
    .select("id, project_id, due_date")
    .eq("user_id", userId)
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

async function getProjects(userId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("name", { ascending: true });

  return data || [];
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await getCurrentUserId();

  // Ensure user has their own Inbox project
  await ensureUserInbox();

  const [projects, counts] = await Promise.all([
    getProjects(userId),
    getNavCounts(userId),
  ]);

  return (
    <div className="flex h-screen">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar projects={projects} counts={counts} />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header - visible only on mobile */}
        <MobileHeader />

        {/* Main content - padding-bottom on mobile for bottom nav */}
        <main className="flex-1 overflow-auto bg-background p-4 pb-20 md:p-6 md:pb-6">
          {children}
        </main>
      </div>

      {/* Bottom nav - visible only on mobile */}
      <BottomNav counts={counts} />
    </div>
  );
}
