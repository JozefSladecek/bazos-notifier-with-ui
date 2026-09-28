import "server-only";
import {and, eq} from "drizzle-orm";
import { db } from "@/db";
import { searches } from "@/db/schema";
import { getCurrentUserId } from "@/lib/session";

export async function getMySearches() {
  const userId = await getCurrentUserId();
  return db.select().from(searches).where(eq(searches.userId, userId));
}

export async function getMySearch(searchId: number) {
  const userId = await getCurrentUserId();
  const [search] = await db
    .select()
    .from(searches)
    .where(and(eq(searches.id, searchId), eq(searches.userId, userId)));
  return search ?? null;
}