"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Trash2, MoreHorizontal, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  const [editDueDate, setEditDueDate] = useState<Date | undefined>(
    todo.due_date ? new Date(todo.due_date) : undefined
  );
  const [datePickerOpen, setDatePickerOpen] = useState(false);
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
        due_date: editDueDate ? format(editDueDate, "yyyy-MM-dd") : null,
      });
      setIsEditing(false);
    });
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description ?? "");
    setEditDueDate(todo.due_date ? new Date(todo.due_date) : undefined);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setEditDueDate(date);
    setDatePickerOpen(false);
  };

  const handleClearDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditDueDate(undefined);
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

        <div className="mt-3 flex items-center gap-2">
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isPending}
                className={cn(
                  "h-7 gap-1.5 text-xs",
                  !editDueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="h-3 w-3" />
                {editDueDate ? format(editDueDate, "MMM d") : "Due date"}
                {editDueDate && (
                  <X
                    className="h-3 w-3 hover:text-foreground"
                    onClick={handleClearDate}
                  />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={editDueDate}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

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
            <CalendarIcon className="h-3 w-3" />
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
