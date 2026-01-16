"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { updateProject } from "@/lib/actions/projects";
import { PROJECT_COLORS, PROJECT_ICONS, DEFAULT_PROJECT_ICON } from "@/lib/constants";
import { ProjectIcon } from "./project-icon";
import type { Project } from "@/lib/supabase/types";

interface EditProjectDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProjectDialog({ project, open, onOpenChange }: EditProjectDialogProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(PROJECT_COLORS[5]);
  const [icon, setIcon] = useState(DEFAULT_PROJECT_ICON);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Reset form when project changes
  useEffect(() => {
    if (project) {
      setName(project.name);
      setColor(project.color || PROJECT_COLORS[5]);
      setIcon(project.icon || DEFAULT_PROJECT_ICON);
      setError(null);
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!project) return;

    if (!name.trim()) {
      setError("Project name is required");
      return;
    }

    startTransition(async () => {
      const result = await updateProject(project.id, {
        name: name.trim(),
        color,
        icon,
      });

      if (result.error) {
        setError(result.error);
      } else {
        onOpenChange(false);
      }
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setError(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit project</DialogTitle>
            <DialogDescription>
              Update the project name, icon, and color.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="edit-project-name"
                className="text-sm font-medium text-foreground"
              >
                Name
              </label>
              <Input
                id="edit-project-name"
                placeholder="Project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Icon
              </label>
              <div className="grid grid-cols-8 gap-2">
                {PROJECT_ICONS.map((iconName) => (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setIcon(iconName)}
                    className={`flex h-8 w-8 items-center justify-center rounded-md border transition-all ${
                      icon === iconName
                        ? "border-foreground bg-accent scale-110"
                        : "border-border hover:bg-accent/50"
                    }`}
                  >
                    <ProjectIcon icon={iconName} color={color} size="sm" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Color
              </label>
              <div className="flex flex-wrap gap-2">
                {PROJECT_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-6 w-6 rounded-full transition-transform ${
                      color === c ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110" : ""
                    }`}
                    style={{ backgroundColor: c }}
                  >
                    <span className="sr-only">Select color {c}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
