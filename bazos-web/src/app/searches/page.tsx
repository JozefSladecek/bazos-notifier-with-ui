import { db } from "@/db";
import { searches } from "@/db/schema";
import { addSearch } from "./actions";
import { AddSearchForm } from "./components/AddSearchForm";
import { EditableSearchCard } from "./components/EditableSearchCard";

export default async function SearchesPage() {
  const allSearches = await db.select().from(searches);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <header className="mb-8 sm:mb-12 flex items-center gap-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5EEAD4] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#5EEAD4]"></span>
        </span>
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Bazos Monitor
          </h1>
          <p className="text-sm text-[#8B8D98]">
            {allSearches.filter((s) => s.active).length} aktívnych hľadaní
          </p>
        </div>
      </header>

      {/* Two-column on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8">
        {/* Left: list of searches */}
        <div className="space-y-3 order-2 lg:order-1">
          {allSearches.length === 0 && (
            <div className="border border-dashed border-[#2A2D38] rounded-lg p-8 text-center text-[#8B8D98]">
              Zatiaľ žiadne hľadania. Pridaj prvé vpravo →
            </div>
          )}

          {allSearches.map((s) => (
            <EditableSearchCard key={s.id} search={s} />
          ))}
        </div>

        {/* Right: add-search form (sticky on desktop) */}
            <AddSearchForm />
      </div>
    </div>
  );
}