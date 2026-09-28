"use server";

import { db } from "@/db";
import { searches } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { getCurrentUserId } from "@/lib/session";

export async function addSearch(formData: FormData) {
  const userId = await getCurrentUserId();

  const name = formData.get("name") as string;
  const url = formData.get("url") as string;
  const priceMin = formData.get("priceMin") as string;
  const priceMax = formData.get("priceMax") as string;
  const maxPages = formData.get("maxPages") as string;

  await db.insert(searches).values({
    userId,
    name,
    source: "bazos_sk",
    url,
    priceMin: priceMin ? parseInt(priceMin) : null,
    priceMax: priceMax ? parseInt(priceMax) : null,
    maxPages: maxPages ? parseInt(maxPages) : 3,
    active: true,
  });

  revalidatePath("/searches");
}

export async function toggleSearchActive(searchId: number, currentlyActive: boolean) {
  const userId = await getCurrentUserId();

  await db
    .update(searches)
    .set({ active: !currentlyActive })
    .where(and(eq(searches.id, searchId), eq(searches.userId, userId)));

  revalidatePath("/searches");
}

export async function deleteSearch(searchId: number) {
  const userId = await getCurrentUserId();

  await db
    .delete(searches)
    .where(and(eq(searches.id, searchId), eq(searches.userId, userId)));

  revalidatePath("/searches");
}

export async function updateSearch(searchId: number, formData: FormData) {
  const userId = await getCurrentUserId();

  const name = formData.get("name") as string;
  const url = formData.get("url") as string;
  const priceMin = formData.get("priceMin") as string;
  const priceMax = formData.get("priceMax") as string;
  const maxPages = formData.get("maxPages") as string;

  await db
    .update(searches)
    .set({
      name,
      url,
      priceMin: priceMin ? parseInt(priceMin) : null,
      priceMax: priceMax ? parseInt(priceMax) : null,
      maxPages: maxPages ? parseInt(maxPages) : 3,
    })
    .where(and(eq(searches.id, searchId), eq(searches.userId, userId)));

  revalidatePath("/searches");
}