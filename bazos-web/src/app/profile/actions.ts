"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateChatId(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = String(formData.get("telegramChatId") ?? "").trim();
  // Telegram chat ids are integers, negative for groups
  if (raw && !/^-?\d+$/.test(raw)) throw new Error("Invalid chat id");

  await db
    .update(users)
    .set({ telegramChatId: raw || null })
    .where(eq(users.id, Number(session.user.id)));

  revalidatePath("/profile");
}