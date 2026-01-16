"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Hash, MoreHorizontal, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Project } from "@/lib/supabase/types";

interface ProjectListProps {
  projects: Project[];
  onAddProject: () => void;
  onDeleteProject?: (projectId: string) => void;
}

export function ProjectList({
  projects,
  onAddProject,
  onDeleteProject,
}: ProjectListProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Projects
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-6 w-6"
          onClick={onAddProject}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add project</span>
        </Button>
      </div>

      {projects.length === 0 ? (
        <p className="px-3 py-2 text-sm text-muted-foreground">
          No projects yet
        </p>
      ) : (
        projects.map((project) => {
          const isActive = pathname === `/project/${project.id}`;

          return (
            <div
              key={project.id}
              className={cn(
                "group flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-foreground"
                  : "text-muted-foreground hover:bg-sidebar-muted hover:text-foreground"
              )}
            >
              <Link
                href={`/project/${project.id}`}
                className="flex flex-1 items-center gap-3"
              >
                <Hash
                  className="h-4 w-4"
                  style={{ color: project.color || "#6b7280" }}
                />
                <span className="truncate">{project.name}</span>
              </Link>

              {!project.is_default && onDeleteProject && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Project options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => onDeleteProject(project.id)}
                    >
                      Delete project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
