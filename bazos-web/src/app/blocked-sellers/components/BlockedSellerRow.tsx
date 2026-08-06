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
    <div className="flex items-center justify-between rounded-lg border border-[#2A2D38] bg-[#1B1E27] p-4">
      <div>
        <p className="font-mono text-sm text-[#E8E6E0]">{seller.sellerId}</p>
        {seller.note && (
          <p className="text-xs text-[#8B8D98] mt-1">{seller.note}</p>
        )}
      </div>
      <button
        disabled={isPending}
        onClick={() => {
          if (confirm("Naozaj odblokovať tohto predajcu?")) {
            startTransition(() => removeBlockedSeller(seller.sellerId));
          }
        }}
        className="text-xs px-2.5 py-1 rounded-md border border-[#2A2D38] text-[#8B8D98] hover:border-red-400/40 hover:text-red-400 transition-colors disabled:opacity-50"
      >
        Odblokovať
      </button>
    </div>
  );
}