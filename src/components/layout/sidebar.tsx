"use client";

import { useState, useTransition } from "react";
import { Inbox, Calendar, CalendarDays } from "lucide-react";
import { UserButton, SignedIn } from "@clerk/nextjs";
import { NavItem } from "./nav-item";
import { ProjectList } from "./project-list";
import { AddProjectDialog } from "@/components/projects/add-project-dialog";
import { EditProjectDialog } from "@/components/projects/edit-project-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { deleteProject } from "@/lib/actions/projects";
import type { Project } from "@/lib/supabase/types";

interface NavCount {
  inbox: number;
  today: number;
  upcoming: number;
}

interface SidebarProps {
  projects: Project[];
  counts?: NavCount;
}

export function Sidebar({ projects, counts }: SidebarProps) {
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [, startTransition] = useTransition();

  const handleDeleteProject = (projectId: string) => {
    startTransition(async () => {
      const result = await deleteProject(projectId);
      if (result.error) {
        console.error(result.error);
      }
    });
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
  };

  return (
    <>
      <aside className="flex h-full w-64 flex-col border-r border-border bg-sidebar">
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <h1 className="text-lg font-semibold text-foreground">TodoIt</h1>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />
          </SignedIn>
        </div>

        <ScrollArea className="flex-1">
          <nav className="space-y-1 p-2">
            <NavItem
              href="/inbox"
              label="Inbox"
              icon={Inbox}
              count={counts?.inbox}
            />
            <NavItem
              href="/today"
              label="Today"
              icon={Calendar}
              count={counts?.today}
            />
            <NavItem
              href="/upcoming"
              label="Upcoming"
              icon={CalendarDays}
              count={counts?.upcoming}
            />

            <div className="my-4 border-t border-border" />

            <ProjectList
              projects={projects}
              onAddProject={() => setShowAddProject(true)}
              onEditProject={handleEditProject}
              onDeleteProject={handleDeleteProject}
            />
          </nav>
        </ScrollArea>
      </aside>

      <AddProjectDialog
        open={showAddProject}
        onOpenChange={setShowAddProject}
      />

      <EditProjectDialog
        project={editingProject}
        open={editingProject !== null}
        onOpenChange={(open) => {
          if (!open) setEditingProject(null);
        }}
      />
    </>
  );
}
