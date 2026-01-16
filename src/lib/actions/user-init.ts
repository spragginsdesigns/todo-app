"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth/user";

/**
 * Ensures the current user has their own Inbox project.
 * Creates one if it doesn't exist. Safe to call multiple times.
 */
export async function ensureUserInbox(): Promise<void> {
  const userId = await getCurrentUserId();
  const supabase = await createClient();

  // Check if user already has an inbox
  const { data: existingInbox } = await supabase
    .from("projects")
    .select("id")
    .eq("user_id", userId)
    .eq("is_default", true)
    .single();

  if (existingInbox) {
    return; // User already has an inbox
  }

  // Create inbox for this user
  const { error } = await supabase.from("projects").insert({
    name: "Inbox",
    is_default: true,
    color: "#6b7280",
    icon: "inbox",
    user_id: userId,
  });

  if (error) {
    // Ignore duplicate errors (race condition protection)
    if (!error.message.includes("duplicate")) {
      console.error("Failed to create user inbox:", error);
    }
  }
}
