"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth/user";
import type { TodoInsert, TodoUpdate } from "@/lib/supabase/types";

export async function createTodo(data: TodoInsert) {
  const userId = await getCurrentUserId();
  const supabase = await createClient();

  const { error } = await supabase.from("todos").insert({
    ...data,
    user_id: userId,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
}

export async function updateTodo(id: string, data: TodoUpdate) {
  const userId = await getCurrentUserId();
  const supabase = await createClient();

  const { error } = await supabase
    .from("todos")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
}

export async function toggleTodo(id: string, completed: boolean) {
  const userId = await getCurrentUserId();
  const supabase = await createClient();

  const { error } = await supabase
    .from("todos")
    .update({ completed, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
}

export async function deleteTodo(id: string) {
  const userId = await getCurrentUserId();
  const supabase = await createClient();

  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
}
