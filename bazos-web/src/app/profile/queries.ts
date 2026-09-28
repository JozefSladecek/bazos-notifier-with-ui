import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getCurrentUserId } from "@/lib/session";

export async function getUserProfile() {
  const userId = await getCurrentUserId();

  const [user] = await db
    .select({ email: users.email, telegramChatId: users.telegramChatId })
    .from(users)
    .where(eq(users.id, userId));

  return user ?? null;
}