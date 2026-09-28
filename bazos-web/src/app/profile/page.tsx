import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { updateChatId } from "./actions";
import {getUserProfile} from "@/app/profile/queries";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await getUserProfile();

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-xl sm:text-2xl font-semibold tracking-tight mb-1">Profil</h1>
      <p className="text-sm text-[var(--muted)] mb-6">{user?.email}</p>

      <form action={updateChatId} className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-5 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="telegramChatId" className="text-xs uppercase tracking-wide text-[var(--muted)]">
            Telegram Chat ID
          </label>
          <input
            id="telegramChatId"
            name="telegramChatId"
            defaultValue={user?.telegramChatId ?? ""}
            placeholder="napr. 123456789"
            className="w-full rounded-md bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-sm font-mono outline-none focus:border-[var(--accent)]"
          />
          <p className="text-xs text-[var(--muted)]">
            Napíš botovi správu a zisti ID cez getUpdates. Notifikácie ti budú chodiť na toto ID.
          </p>
        </div>
        <button type="submit" className="w-full rounded-md bg-[var(--accent)] text-[var(--accent-fg)] font-medium text-sm py-2.5 hover:opacity-90 transition-opacity">
          Uložiť
        </button>
      </form>
    </div>
  );
}