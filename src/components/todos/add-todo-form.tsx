"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createTodo } from "@/app/actions/todos";

interface AddTodoFormProps {
  projectId?: string;
}

export function AddTodoForm({ projectId }: AddTodoFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    startTransition(async () => {
      await createTodo({
        title: title.trim(),
        description: description.trim() || null,
        project_id: projectId ?? null,
      });
      setTitle("");
      setDescription("");
      setIsEditing(false);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setTitle("");
      setDescription("");
      setIsEditing(false);
    }
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
      >
        <Plus className="h-4 w-4" />
        Add task
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-3">
      <Input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Task name"
        disabled={isPending}
        className="border-0 bg-transparent px-0 text-sm placeholder:text-muted-foreground focus-visible:ring-0"
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Description"
        disabled={isPending}
        rows={2}
        className="mt-2 min-h-0 resize-none border-0 bg-transparent px-0 text-xs placeholder:text-muted-foreground focus-visible:ring-0"
      />
      <div className="mt-3 flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={() => {
            setTitle("");
            setDescription("");
            setIsEditing(false);
          }}
        >
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={!title.trim() || isPending}>
          {isPending ? "Adding..." : "Add task"}
        </Button>
      </div>
    </form>
  );
}
