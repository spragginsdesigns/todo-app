import { auth } from "@clerk/nextjs/server";

/**
 * Get the current user's Clerk ID from the session.
 * Throws if not authenticated - use in protected routes only.
 */
export async function getCurrentUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}
