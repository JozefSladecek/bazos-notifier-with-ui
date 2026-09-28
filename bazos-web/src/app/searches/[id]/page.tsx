import { db } from "@/db";
import { searches, listings, blockedSellers } from "@/db/schema";
import {eq, and, notInArray, or, isNull, desc} from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import {getMySearch} from "@/app/searches/queries";

export default async function SearchDetailPage({
                                                   params,
                                               }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const searchId = parseInt(id);
    if (Number.isNaN(searchId)) notFound();

    // only returns the search if it belongs to the logged-in user
    const search = await getMySearch(searchId);
    if (!search) {
        notFound();
    }

    const blocked = await db
        .select({ sellerId: blockedSellers.sellerId })
        .from(blockedSellers);
    const blockedIds = blocked.map((b) => b.sellerId);

    const foundListings = await db
        .select()
        .from(listings)
        .where(
            blockedIds.length > 0
                ? and(
                    eq(listings.searchId, searchId),
                    or(isNull(listings.sellerId), notInArray(listings.sellerId, blockedIds))
                )
                : eq(listings.searchId, searchId)
        )
        .orderBy(desc(listings.firstSeen))
        .limit((search.maxPages ?? 3) * 20);

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <Link
                href="/searches"
                className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-6"
            >
                ← Späť na hľadania
            </Link>

            <header className="mb-8 pb-6 border-b border-[var(--border)]">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
                        {search.name}
                    </h1>
                    <span
                        className={`text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full ${
                            search.active
                                ? "bg-[var(--success-bg)] text-[var(--accent)]"
                                : "bg-[var(--border)] text-[var(--muted)]"
                        }`}
                    >
            {search.active ? "aktívne" : "vypnuté"}
          </span>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-[var(--muted)]">
                    <span className="uppercase tracking-wide text-xs">{search.source}</span>
                    <span className="font-mono text-[var(--price)]">
            {search.priceMin ?? "?"}€ – {search.priceMax ?? "?"}€
          </span>
                </div>
            </header>

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm uppercase tracking-wide text-[var(--muted)]">
                    Nájdené inzeráty
                </h2>
                <span className="font-mono text-sm text-[var(--accent)]">
          {foundListings.length}
        </span>
            </div>

            {foundListings.length === 0 ? (
                <div className="border border-dashed border-[var(--border)] rounded-lg p-8 text-center text-[var(--muted)] text-sm">
                    Zatiaľ žiadne nálezy. Scraper ešte nebežal alebo nič nenašiel.
                </div>
            ) : (
                <div className="space-y-3">
                    {foundListings.map((listing) => {
                        return (
                            <a
                                key={`${listing.id}-${listing.source}`}
                                href={listing.url ?? "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex gap-4 rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4 hover:border-[var(--accent)]/40 transition-colors"
                            >
                                {listing.imageUrl ? (
                                    <img
                                        src={listing.imageUrl}
                                        alt=""
                                        className="w-20 h-20 object-cover rounded-md shrink-0 bg-[var(--bg)]"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-md shrink-0 bg-[var(--bg)] flex items-center justify-center text-[var(--border)] text-xs">
                                        bez foto
                                    </div>
                                )}

                                <div className="min-w-0 flex-1">
                                    <p className="font-medium truncate group-hover:text-[var(--accent)] transition-colors">
                                        {listing.title}
                                    </p>
                                    <p className="font-mono text-sm text-[var(--price)] mt-1">
                                        {listing.price}
                                    </p>
                                    <p className="text-xs text-[var(--muted)] mt-1 truncate">
                                        {listing.location}
                                    </p>
                                </div>
                            </a>
                        );
                    })}
                </div>
            )}
        </div>
    );
}