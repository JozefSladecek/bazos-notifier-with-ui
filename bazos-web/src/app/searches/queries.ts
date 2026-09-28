import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { searches } from "@/db/schema";
import { getCurrentUserId } from "@/lib/session";

export async function getMySearches() {
  const userId = await getCurrentUserId();
  return db.select().from(searches).where(eq(searches.userId, userId));
}