import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bazos Monitor",
  description: "Sledovanie inzerátov na Bazose",
};

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="sk" className={`${inter.variable} ${mono.variable}`}>
      <body className="font-sans bg-[var(--bg)] text-[var(--text)] min-h-screen antialiased">
      <nav className="border-b border-[var(--border)] bg-[var(--panel)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight">
            Bazos Monitor
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/searches" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
              Hľadania
            </Link>
            <Link href="/blocked-sellers" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
              Blokovaní predajcovia
            </Link>
          </div>
        </div>
      </nav>
      {children}
      </body>
      </html>
  );
}