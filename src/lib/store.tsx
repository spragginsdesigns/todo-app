"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type {
  Todo,
  CreateTodoInput,
  UpdateTodoInput,
  Project,
  CreateProjectInput,
  UpdateProjectInput,
} from "@/types";
import { INBOX_PROJECT_ID, DEFAULT_PROJECT_COLOR } from "./constants";

// Generate unique IDs (will be replaced by Supabase UUIDs later)
function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Initial default project
const defaultInboxProject: Project = {
  id: INBOX_PROJECT_ID,
  name: "Inbox",
  color: DEFAULT_PROJECT_COLOR,
  isDefault: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

interface StoreContextType {
  // Todos
  todos: Todo[];
  addTodo: (input: CreateTodoInput) => Todo;
  updateTodo: (id: string, input: UpdateTodoInput) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;

  // Projects
  projects: Project[];
  addProject: (input: CreateProjectInput) => Project;
  updateProject: (id: string, input: UpdateProjectInput) => void;
  deleteProject: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [projects, setProjects] = useState<Project[]>([defaultInboxProject]);

  // Todo operations
  const addTodo = useCallback((input: CreateTodoInput): Todo => {
    const newTodo: Todo = {
      id: generateId(),
      title: input.title,
      description: input.description ?? null,
      completed: false,
      priority: input.priority ?? 4,
      dueDate: input.dueDate ?? null,
      projectId: input.projectId ?? INBOX_PROJECT_ID,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTodos((prev) => [newTodo, ...prev]);
    return newTodo;
  }, []);

  const updateTodo = useCallback((id: string, input: UpdateTodoInput) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, ...input, updatedAt: new Date() }
          : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
          : todo
      )
    );
  }, []);

  // Project operations
  const addProject = useCallback((input: CreateProjectInput): Project => {
    const newProject: Project = {
      id: generateId(),
      name: input.name,
      color: input.color ?? DEFAULT_PROJECT_COLOR,
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProjects((prev) => [...prev, newProject]);
    return newProject;
  }, []);

  const updateProject = useCallback((id: string, input: UpdateProjectInput) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id
          ? { ...project, ...input, updatedAt: new Date() }
          : project
      )
    );
  }, []);

  const deleteProject = useCallback((id: string) => {
    // Don't allow deleting the default inbox project
    setProjects((prev) =>
      prev.filter((project) => project.id !== id || project.isDefault)
    );
    // Move todos from deleted project to inbox
    setTodos((prev) =>
      prev.map((todo) =>
        todo.projectId === id
          ? { ...todo, projectId: INBOX_PROJECT_ID, updatedAt: new Date() }
          : todo
      )
    );
  }, []);

  return (
    <StoreContext.Provider
      value={{
        todos,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleTodo,
        projects,
        addProject,
        updateProject,
        deleteProject,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
