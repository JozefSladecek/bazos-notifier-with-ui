"use client";

import { useTransition } from "react";
import { removeBlockedSeller } from "../actions";

type BlockedSeller = {
    sellerId: string;
    note: string | null;
    blockedAt: Date;
};

export function BlockedSellerRow({ seller }: { seller: BlockedSeller }) {
    const [isPending, startTransition] = useTransition();

    return (
        <div className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4">
            <div>
                <p className="font-mono text-sm text-[var(--text)]">{seller.sellerId}</p>
                {seller.note && (
                    <p className="text-xs text-[var(--muted)] mt-1">{seller.note}</p>
                )}
            </div>
            <button
                disabled={isPending}
                onClick={() => {
                    if (confirm("Naozaj odblokovať tohto predajcu?")) {
                        startTransition(() => removeBlockedSeller(seller.sellerId));
                    }
                }}
                className="text-xs px-2.5 py-1 rounded-md border border-[var(--border)] text-[var(--muted)] hover:border-[var(--danger)]/40 hover:text-[var(--danger)] transition-colors disabled:opacity-50"
            >
                Odblokovať
            </button>
        </div>
    );
}