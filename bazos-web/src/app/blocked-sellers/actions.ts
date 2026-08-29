"use server";

import { db } from "@/db";
import { blockedSellers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addBlockedSeller(formData: FormData) {
  const rawInput = formData.get("sellerId") as string;
  const note = formData.get("note") as string;

  const sellerId = extractSellerId(rawInput);

  if (!sellerId) {
    throw new Error("Nepodarilo sa nájsť seller_id v zadanej hodnote/URL");
  }

  await db.insert(blockedSellers).values({
    sellerId,
    note: note || null,
  });

  revalidatePath("/blocked-sellers");
}
export async function removeBlockedSeller(sellerId: string) {
  await db.delete(blockedSellers).where(eq(blockedSellers.sellerId, sellerId));

  revalidatePath("/blocked-sellers");
}

function extractSellerId(input: string): string | null {
  // idphone parameter extraction
  const urlMatch = input.match(/idphone=(\d+)/);
  if (urlMatch) {
    return urlMatch[1];
  }

  // plain idphone
  if (/^\d+$/.test(input.trim())) {
    return input.trim();
  }

  return null;
}