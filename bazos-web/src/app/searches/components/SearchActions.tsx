"use client";

import { toggleSearchActive, deleteSearch } from "@/app/searches/actions";
import { useTransition } from "react";

export function SearchActions({
                                  searchId,
                                  active,
                              }: {
    searchId: number;
    active: boolean;
}) {
    const [isPending, startTransition] = useTransition();

    return (
        <div className="flex gap-2" onClick={(e) => e.preventDefault()}>
            <button
                disabled={isPending}
                onClick={() => startTransition(() => toggleSearchActive(searchId, active))}
                className="text-xs px-2.5 py-1 rounded-md border border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/40 hover:text-[var(--accent)] transition-colors disabled:opacity-50"
            >
                {active ? "Vypnúť" : "Zapnúť"}
            </button>
            <button
                disabled={isPending}
                onClick={() => {
                    if (confirm("Naozaj zmazať toto hľadanie aj všetky jeho nálezy?")) {
                        startTransition(() => deleteSearch(searchId));
                    }
                }}
                className="text-xs px-2.5 py-1 rounded-md border border-[var(--border)] text-[var(--muted)] hover:border-[var(--danger)]/40 hover:text-[var(--danger)] transition-colors disabled:opacity-50"
            >
                Zmazať
            </button>
        </div>
    );
}