import { db } from "@/db";
import { searches, listings, blockedSellers } from "@/db/schema";
import { eq, and, notInArray, or, isNull } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function SearchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const searchId = parseInt(id);

  const [search] = await db
    .select()
    .from(searches)
    .where(eq(searches.id, searchId));

  if (!search) {
    notFound();
  }

  const blocked = await db.select({ sellerId: blockedSellers.sellerId }).from(blockedSellers);
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
      .orderBy(listings.firstSeen);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Back link */}
      <Link
        href="/searches"
        className="inline-flex items-center gap-1.5 text-sm text-[#8B8D98] hover:text-[#5EEAD4] transition-colors mb-6"
      >
        ← Späť na hľadania
      </Link>

      {/* Header */}
      <header className="mb-8 pb-6 border-b border-[#2A2D38]">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            {search.name}
          </h1>
          <span
            className={`text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full ${
              search.active
                ? "bg-[#5EEAD4]/10 text-[#5EEAD4]"
                : "bg-[#2A2D38] text-[#8B8D98]"
            }`}
          >
            {search.active ? "aktívne" : "vypnuté"}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-[#8B8D98]">
          <span className="uppercase tracking-wide text-xs">{search.source}</span>
          <span className="font-mono text-[#FBBF24]">
            {search.priceMin ?? "?"}€ – {search.priceMax ?? "?"}€
          </span>
        </div>
      </header>

      {/* Listings */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm uppercase tracking-wide text-[#8B8D98]">
          Nájdené inzeráty
        </h2>
        <span className="font-mono text-sm text-[#5EEAD4]">
          {foundListings.length}
        </span>
      </div>

      {foundListings.length === 0 ? (
        <div className="border border-dashed border-[#2A2D38] rounded-lg p-8 text-center text-[#8B8D98] text-sm">
          Zatiaľ žiadne nálezy. Scraper ešte nebežal alebo nič nenašiel.
        </div>
      ) : (
        <div className="space-y-3">
          {foundListings.map((listing) => (
            <a
              key={`${listing.id}-${listing.source}`}
              href={listing.url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex gap-4 rounded-lg border border-[#2A2D38] bg-[#1B1E27] p-4 hover:border-[#5EEAD4]/40 transition-colors"
            >
              {listing.imageUrl ? (
                <img
                  src={listing.imageUrl}
                  alt=""
                  className="w-20 h-20 object-cover rounded-md shrink-0 bg-[#12141A]"
                />
              ) : (
                <div className="w-20 h-20 rounded-md shrink-0 bg-[#12141A] flex items-center justify-center text-[#2A2D38] text-xs">
                  bez foto
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="font-medium truncate group-hover:text-[#5EEAD4] transition-colors">
                  {listing.title}
                </p>
                <p className="font-mono text-sm text-[#FBBF24] mt-1">
                  {listing.price}
                </p>
                <p className="text-xs text-[#8B8D98] mt-1 truncate">
                  {listing.location}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}