import { addSearch } from "@/app/searches/actions";

export function AddSearchForm() {
  return (
      <div className="order-1 lg:order-2">
        <div className="lg:sticky lg:top-8 rounded-lg border border-[var(--border)] bg-[var(--panel)] p-5 sm:p-6">
          <h2 className="font-medium mb-1">Pridať hľadanie</h2>
          <p className="text-sm text-[var(--muted)] mb-5">
            Vlož URL vyhľadávania z Bazosu.
          </p>

          <form action={addSearch} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs uppercase tracking-wide text-[var(--muted)]">
                Názov
              </label>
              <input
                  id="name"
                  name="name"
                  required
                  placeholder="Fiat Panda"
                  className="w-full rounded-md bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="url" className="text-xs uppercase tracking-wide text-[var(--muted)]">
                Bazos URL
              </label>
              <input
                  id="url"
                  name="url"
                  required
                  placeholder="https://auto.bazos.sk/?..."
                  className="w-full rounded-md bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-sm font-mono outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="priceMin" className="text-xs uppercase tracking-wide text-[var(--muted)]">
                  Cena od
                </label>
                <input
                    id="priceMin"
                    name="priceMin"
                    type="number"
                    placeholder="2000"
                    className="w-full rounded-md bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-sm font-mono outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="priceMax" className="text-xs uppercase tracking-wide text-[var(--muted)]">
                  Cena do
                </label>
                <input
                    id="priceMax"
                    name="priceMax"
                    type="number"
                    placeholder="15000"
                    className="w-full rounded-md bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-sm font-mono outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
            </div>

            <button
                type="submit"
                className="w-full rounded-md bg-[var(--accent)] text-[var(--accent-fg)] font-medium text-sm py-2.5 hover:opacity-90 transition-opacity"
            >
              Pridať hľadanie
            </button>
          </form>
        </div>
      </div>
  );
}