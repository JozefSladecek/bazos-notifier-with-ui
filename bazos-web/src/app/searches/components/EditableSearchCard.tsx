"use client";

import {useState, useTransition} from "react";
import Link from "next/link";
import {updateSearch} from "@/app/searches/actions";
import {SearchActions} from "./SearchActions";

type Search = {
    id: number;
    name: string;
    source: string;
    url: string | null;
    priceMin: number | null;
    priceMax: number | null;
    maxPages: number | null;
    active: boolean;
    telegramChatId: string | null;
};

export function EditableSearchCard({search}: { search: Search }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isPending, startTransition] = useTransition();

    if (isEditing) {
        return (
            <div className="rounded-lg border border-[var(--accent)]/40 bg-[var(--panel)] p-4 sm:p-5">
                <form
                    action={(formData) => {
                        startTransition(async () => {
                            await updateSearch(search.id, formData);
                            setIsEditing(false);
                        });
                    }}
                    className="space-y-3"
                >
                    <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wide text-[var(--muted)]">
                            Názov
                        </label>
                        <input
                            name="name"
                            defaultValue={search.name}
                            required
                            className="w-full rounded-md bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wide text-[var(--muted)]">
                            Bazos URL
                        </label>
                        <input
                            name="url"
                            defaultValue={search.url ?? ""}
                            required
                            className="w-full rounded-md bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-sm font-mono outline-none focus:border-[var(--accent)]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-xs uppercase tracking-wide text-[var(--muted)]">
                                Cena od
                            </label>
                            <input
                                name="priceMin"
                                type="number"
                                defaultValue={search.priceMin ?? ""}
                                placeholder="Cena od"
                                className="w-full rounded-md bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-sm font-mono outline-none focus:border-[var(--accent)]"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs uppercase tracking-wide text-[var(--muted)]">
                                Cena do
                            </label>
                            <input
                                name="priceMax"
                                type="number"
                                defaultValue={search.priceMax ?? ""}
                                placeholder="Cena do"
                                className="w-full rounded-md bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-sm font-mono outline-none focus:border-[var(--accent)]"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wide text-[var(--muted)]">
                            Počet stránok na sledovanie
                        </label>
                        <input
                            name="maxPages"
                            type="number"
                            min="1"
                            defaultValue={search.maxPages ?? ""}
                            placeholder="3"
                            className="w-full rounded-md bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-sm font-mono outline-none focus:border-[var(--accent)]"
                        />
                        <p className="text-xs text-[var(--muted)]">1 strana ≈ 20 inzerátov</p>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wide text-[var(--muted)]">
                            Telegram Chat ID (voliteľné)
                        </label>
                        <input
                            name="telegramChatId"
                            type="text"
                            defaultValue={search.telegramChatId ?? ""}
                            placeholder="Nechaj prázdne pre default"
                            className="w-full rounded-md bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-sm font-mono outline-none focus:border-[var(--accent)]"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wide text-[var(--muted)]">
                            Počet stránok na sledovanie
                        </label>
                        <input
                            name="maxPages"
                            type="number"
                            min="1"
                            defaultValue={search.maxPages ?? ""}
                            placeholder="3"
                            className="w-full rounded-md bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-sm font-mono outline-none focus:border-[var(--accent)]"
                        />
                        <p className="text-xs text-[var(--muted)]">1 strana ≈ 20 inzerátov</p>
                    </div>

                    <div className="flex gap-2 pt-1">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="text-xs px-3 py-1.5 rounded-md bg-[var(--accent)] text-[var(--accent-fg)] font-medium disabled:opacity-50"
                        >
                            {isPending ? "Ukladám..." : "Uložiť"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="text-xs px-3 py-1.5 rounded-md border border-[var(--border)] text-[var(--muted)]"
                        >
                            Zrušiť
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div
            className="group rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4 sm:p-5 hover:border-[var(--accent)]/40 transition-colors">
            <Link href={`/searches/${search.id}`} className="block">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h2 className="font-medium truncate group-hover:text-[var(--accent)] transition-colors">
                            {search.name}
                        </h2>
                        <p className="text-xs text-[var(--muted)] mt-1 uppercase tracking-wide">
                            {search.source}
                        </p>
                    </div>
                    <span
                        className={`shrink-0 text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full ${
                            search.active
                                ? "bg-[var(--success-bg)] text-[var(--accent)]"
                                : "bg-[var(--border)] text-[var(--muted)]"
                        }`}
                    >
            {search.active ? "aktívne" : "vypnuté"}
          </span>
                </div>
                <div className="mt-3 font-mono text-sm text-[var(--price)]">
                    {search.priceMin ?? "?"}€ – {search.priceMax ?? "?"}€
                </div>
            </Link>

            <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between">
                <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs px-2.5 py-1 rounded-md border border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/40 hover:text-[var(--accent)] transition-colors"
                >
                    Upraviť
                </button>
                <SearchActions searchId={search.id} active={search.active}/>
            </div>
        </div>
    );
}