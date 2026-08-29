"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { updateSearch } from "@/app/searches/actions";
import { SearchActions } from "./SearchActions";

type Search = {
  id: number;
  name: string;
  source: string;
  url: string | null;
  priceMin: number | null;
  priceMax: number | null;
  active: boolean;
};

export function EditableSearchCard({ search }: { search: Search }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (isEditing) {
    return (
      <div className="rounded-lg border border-[#5EEAD4]/40 bg-[#1B1E27] p-4 sm:p-5">
        <form
          action={(formData) => {
            startTransition(async () => {
              await updateSearch(search.id, formData);
              setIsEditing(false);
            });
          }}
          className="space-y-3"
        >
          <input
            name="name"
            defaultValue={search.name}
            required
            className="w-full rounded-md bg-[#12141A] border border-[#2A2D38] px-3 py-2 text-sm outline-none focus:border-[#5EEAD4]"
          />
          <input
            name="url"
            defaultValue={search.url ?? ""}
            required
            className="w-full rounded-md bg-[#12141A] border border-[#2A2D38] px-3 py-2 text-sm font-mono outline-none focus:border-[#5EEAD4]"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              name="priceMin"
              type="number"
              defaultValue={search.priceMin ?? ""}
              placeholder="Cena od"
              className="w-full rounded-md bg-[#12141A] border border-[#2A2D38] px-3 py-2 text-sm font-mono outline-none focus:border-[#5EEAD4]"
            />
            <input
              name="priceMax"
              type="number"
              defaultValue={search.priceMax ?? ""}
              placeholder="Cena do"
              className="w-full rounded-md bg-[#12141A] border border-[#2A2D38] px-3 py-2 text-sm font-mono outline-none focus:border-[#5EEAD4]"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={isPending}
              className="text-xs px-3 py-1.5 rounded-md bg-[#5EEAD4] text-[#12141A] font-medium disabled:opacity-50"
            >
              {isPending ? "Ukladám..." : "Uložiť"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs px-3 py-1.5 rounded-md border border-[#2A2D38] text-[#8B8D98]"
            >
              Zrušiť
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="group rounded-lg border border-[#2A2D38] bg-[#1B1E27] p-4 sm:p-5 hover:border-[#5EEAD4]/40 transition-colors">
      <Link href={`/searches/${search.id}`} className="block">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-medium truncate group-hover:text-[#5EEAD4] transition-colors">
              {search.name}
            </h2>
            <p className="text-xs text-[#8B8D98] mt-1 uppercase tracking-wide">
              {search.source}
            </p>
          </div>
          <span
            className={`shrink-0 text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full ${
              search.active
                ? "bg-[#5EEAD4]/10 text-[#5EEAD4]"
                : "bg-[#2A2D38] text-[#8B8D98]"
            }`}
          >
            {search.active ? "aktívne" : "vypnuté"}
          </span>
        </div>
        <div className="mt-3 font-mono text-sm text-[#FBBF24]">
          {search.priceMin ?? "?"}€ – {search.priceMax ?? "?"}€
        </div>
      </Link>

      <div className="mt-4 pt-4 border-t border-[#2A2D38] flex items-center justify-between">
        <button
          onClick={() => setIsEditing(true)}
          className="text-xs px-2.5 py-1 rounded-md border border-[#2A2D38] text-[#8B8D98] hover:border-[#5EEAD4]/40 hover:text-[#5EEAD4] transition-colors"
        >
          Upraviť
        </button>
        <SearchActions searchId={search.id} active={search.active} />
      </div>
    </div>
  );
}