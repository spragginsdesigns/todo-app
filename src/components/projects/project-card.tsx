"use client";

import Link from "next/link";
import { Hash, ChevronRight } from "lucide-react";
import type { Project } from "@/lib/supabase/types";

interface ProjectCardProps {
  project: Project & { taskCount: number };
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/project/${project.id}`}
      className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-card/80"
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-md"
          style={{ backgroundColor: project.color ? `${project.color}20` : undefined }}
        >
          <Hash className="h-4 w-4" style={{ color: project.color ?? undefined }} />
        </div>
        <div>
          <h3 className="font-medium text-foreground">{project.name}</h3>
          <p className="text-xs text-muted-foreground">
            {project.taskCount} {project.taskCount === 1 ? "task" : "tasks"}
          </p>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </Link>
  );
}
