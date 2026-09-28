import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  async function login(formData: FormData) {
    "use server";
    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo: "/searches",
      });
    } catch (e) {
      if (e instanceof AuthError) redirect("/login?error=1");
      throw e; // the redirect after a successful login is also thrown, so rethrow it
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-xl font-semibold mb-6">Prihlásenie</h1>
      <form action={login} className="space-y-4">
        <input name="email" type="email" required placeholder="Email"
          className="w-full rounded-md bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]" />
        <input name="password" type="password" required placeholder="Heslo"
          className="w-full rounded-md bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]" />
        {error && <p className="text-sm text-[var(--danger)]">Nesprávny email alebo heslo.</p>}
        <button type="submit"
          className="w-full rounded-md bg-[var(--accent)] text-[var(--accent-fg)] font-medium text-sm py-2.5">
          Prihlásiť
        </button>
      </form>
    </div>
  );
}