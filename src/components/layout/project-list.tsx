"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoreHorizontal, Plus, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Project } from "@/lib/supabase/types";
import { ProjectIcon } from "@/components/projects/project-icon";

interface ProjectListProps {
  projects: Project[];
  onAddProject: () => void;
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (projectId: string) => void;
}

export function ProjectList({
  projects,
  onAddProject,
  onEditProject,
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
                <ProjectIcon
                  icon={project.icon}
                  color={project.color}
                  size="md"
                />
                <span className="truncate">{project.name}</span>
              </Link>

              {!project.is_default && (onEditProject || onDeleteProject) && (
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
                    {onEditProject && (
                      <DropdownMenuItem
                        onClick={() => onEditProject(project)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit project
                      </DropdownMenuItem>
                    )}
                    {onEditProject && onDeleteProject && (
                      <DropdownMenuSeparator />
                    )}
                    {onDeleteProject && (
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDeleteProject(project.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete project
                      </DropdownMenuItem>
                    )}
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
