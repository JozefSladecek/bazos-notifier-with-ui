"use server";

import { db } from "@/db";
import { searches } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function addSearch(formData: FormData) {
  const name = formData.get("name") as string;
  const url = formData.get("url") as string;
  const priceMin = formData.get("priceMin") as string;
  const priceMax = formData.get("priceMax") as string;

  await db.insert(searches).values({
    name,
    source: "bazos_sk",
    url,
    priceMin: priceMin ? parseInt(priceMin) : null,
    priceMax: priceMax ? parseInt(priceMax) : null,
    maxPages: 1,
    active: true,
  });

  revalidatePath("/searches");
}

export async function toggleSearchActive(searchId: number, currentlyActive: boolean) {
  await db
    .update(searches)
    .set({ active: !currentlyActive })
    .where(eq(searches.id, searchId));

  revalidatePath("/searches");
}

export async function deleteSearch(searchId: number) {
  await db.delete(searches).where(eq(searches.id, searchId));

  revalidatePath("/searches");
}

export async function updateSearch(searchId: number, formData: FormData) {
  const name = formData.get("name") as string;
  const url = formData.get("url") as string;
  const priceMin = formData.get("priceMin") as string;
  const priceMax = formData.get("priceMax") as string;

  await db
    .update(searches)
    .set({
      name,
      url,
      priceMin: priceMin ? parseInt(priceMin) : null,
      priceMax: priceMax ? parseInt(priceMax) : null,
    })
    .where(eq(searches.id, searchId));

  revalidatePath("/searches");
}