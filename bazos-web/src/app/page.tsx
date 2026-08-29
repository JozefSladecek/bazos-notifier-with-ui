import Link from "next/link";

export default function HomePage() {
  return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <header className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Bazos Monitor
          </h1>
          <p className="text-[var(--muted)] mt-3 max-w-md mx-auto">
            Automatické sledovanie nových inzerátov na Bazose s notifikáciami na Telegram.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Link
              href="/searches"
              className="group rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 hover:border-[var(--accent)]/40 transition-colors"
          >
            <div className="text-sm uppercase tracking-wide text-[var(--muted)] mb-2">
              Správa hľadaní
            </div>
            <h2 className="text-lg font-semibold mb-2 group-hover:text-[var(--accent)] transition-colors">
              Hľadania →
            </h2>
            <p className="text-sm text-[var(--muted)]">
              Pridaj a spravuj hľadania na Bazose, sleduj nájdené inzeráty.
            </p>
          </Link>

          <Link
              href="/blocked-sellers"
              className="group rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 hover:border-[var(--accent)]/40 transition-colors"
          >
            <div className="text-sm uppercase tracking-wide text-[var(--muted)] mb-2">
              Filtrovanie
            </div>
            <h2 className="text-lg font-semibold mb-2 group-hover:text-[var(--accent)] transition-colors">
              Blokovaní predajcovia →
            </h2>
            <p className="text-sm text-[var(--muted)]">
              Vylúč autobazáre a predajcov, ktorých inzeráty nechceš vidieť.
            </p>
          </Link>
        </div>
      </div>
  );
}