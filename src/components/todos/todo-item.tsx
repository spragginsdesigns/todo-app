"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { Calendar, Trash2, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { PRIORITY_COLORS } from "@/lib/constants";
import type { Todo } from "@/lib/supabase/types";
import { toggleTodo, deleteTodo, updateTodo } from "@/app/actions/todos";
import type { Priority } from "@/types";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description ?? "");
  const [isPending, startTransition] = useTransition();

  const priority = (todo.priority ?? 4) as Priority;
  const priorityColor = PRIORITY_COLORS[priority];

  const handleToggle = () => {
    startTransition(async () => {
      await toggleTodo(todo.id, !todo.completed);
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteTodo(todo.id);
    });
  };

  const handleSave = () => {
    if (!editTitle.trim()) return;

    startTransition(async () => {
      await updateTodo(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || null,
      });
      setIsEditing(false);
    });
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description ?? "");
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="rounded-lg border border-border bg-card p-3">
        <Input
          autoFocus
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Task name"
          disabled={isPending}
          className="border-0 bg-transparent px-0 text-sm placeholder:text-muted-foreground focus-visible:ring-0"
        />
        <Textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
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
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={!editTitle.trim() || isPending}
            onClick={handleSave}
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group flex items-start gap-3 rounded-lg border border-transparent px-3 py-3 transition-colors",
        "hover:border-border hover:bg-card",
        isPending && "opacity-50"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Checkbox
        checked={todo.completed ?? false}
        onCheckedChange={handleToggle}
        disabled={isPending}
        className="mt-0.5 rounded-full"
        style={{
          borderColor: todo.completed ? undefined : priorityColor,
        }}
      />

      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => setIsEditing(true)}
      >
        <p
          className={cn(
            "text-sm text-foreground",
            todo.completed && "text-muted-foreground line-through"
          )}
        >
          {todo.title}
        </p>

        {todo.description && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
            {todo.description}
          </p>
        )}

        {todo.due_date && (
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {format(new Date(todo.due_date), "MMM d")}
          </div>
        )}
      </div>

      <div
        className={cn(
          "flex items-center gap-1 transition-opacity",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isPending}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
