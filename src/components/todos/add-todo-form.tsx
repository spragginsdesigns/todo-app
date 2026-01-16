"use client";

import { useState, useTransition } from "react";
import { Plus, Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { createTodo } from "@/app/actions/todos";

interface AddTodoFormProps {
  projectId?: string;
}

export function AddTodoForm({ projectId }: AddTodoFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    startTransition(async () => {
      await createTodo({
        title: title.trim(),
        description: description.trim() || null,
        project_id: projectId ?? null,
        due_date: dueDate ? format(dueDate, "yyyy-MM-dd") : null,
      });
      setTitle("");
      setDescription("");
      setDueDate(undefined);
      setIsEditing(false);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setTitle("");
      setDescription("");
      setDueDate(undefined);
      setIsEditing(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setDueDate(date);
    setDatePickerOpen(false);
  };

  const handleClearDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDueDate(undefined);
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
                !dueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="h-3 w-3" />
              {dueDate ? format(dueDate, "MMM d") : "Due date"}
              {dueDate && (
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
              selected={dueDate}
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
          onClick={() => {
            setTitle("");
            setDescription("");
            setDueDate(undefined);
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
