import { db } from "@/db";
import { blockedSellers } from "@/db/schema";
import { addBlockedSeller } from "./actions";
import { BlockedSellerRow } from "./components/BlockedSellerRow";

export default async function BlockedSellersPage() {
  const allBlocked = await db.select().from(blockedSellers);

  return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <header className="mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Blokovaní predajcovia
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            {allBlocked.length} blokovaných predajcov
          </p>
        </header>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-5 sm:p-6 mb-8">
          <h2 className="font-medium mb-1">Zablokovať predajcu</h2>
          <p className="text-sm text-[var(--muted)] mb-5">
            Vlož seller_id alebo celú URL profilu predajcu (idphone sa vytiahne automaticky).
          </p>

          <form action={addBlockedSeller} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="sellerId" className="text-xs uppercase tracking-wide text-[var(--muted)]">
                Seller ID alebo URL profilu
              </label>
              <input
                  id="sellerId"
                  name="sellerId"
                  required
                  placeholder="4824147 alebo https://www.bazos.sk/hodnotenie.php?idphone=..."
                  className="w-full rounded-md bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-sm font-mono outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="note" className="text-xs uppercase tracking-wide text-[var(--muted)]">
                Poznámka (voliteľné)
              </label>
              <input
                  id="note"
                  name="note"
                  placeholder="napr. Autoslovakia.sk"
                  className="w-full rounded-md bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>

            <button
                type="submit"
                className="w-full rounded-md bg-[var(--accent)] text-[var(--accent-fg)] font-medium text-sm py-2.5 hover:opacity-90 transition-opacity"
            >
              Zablokovať
            </button>
          </form>
        </div>

        <div className="space-y-3">
          {allBlocked.length === 0 && (
              <div className="border border-dashed border-[var(--border)] rounded-lg p-8 text-center text-[var(--muted)]">
                Zatiaľ žiadni blokovaní predajcovia.
              </div>
          )}

          {allBlocked.map((seller) => (
              <BlockedSellerRow key={seller.sellerId} seller={seller} />
          ))}
        </div>
      </div>
  );
}