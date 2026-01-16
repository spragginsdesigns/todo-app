export type Priority = 1 | 2 | 3 | 4;

export interface Todo {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: Priority;
  dueDate: Date | null;
  projectId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateTodoInput = Pick<Todo, "title"> &
  Partial<Pick<Todo, "description" | "priority" | "dueDate" | "projectId">>;

export type UpdateTodoInput = Partial<
  Pick<Todo, "title" | "description" | "completed" | "priority" | "dueDate" | "projectId">
>;
