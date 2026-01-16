"use client";

import { TodoItem } from "./todo-item";
import type { Todo } from "@/lib/supabase/types";

interface TodoListProps {
  todos: Todo[];
  emptyMessage?: string;
}

export function TodoList({ todos, emptyMessage = "No tasks yet" }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
