import Link from "next/link";
import { SignOutButton } from "@/components/SignOutButton";
import { isBishopricAuthenticated } from "@/lib/auth";

export async function Header() {
  const isAuthenticated = await isBishopricAuthenticated();
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <header className="border-b border-stone-200 bg-white print:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-5 sm:px-8">
        <Link href="/" className="group border-l-4 border-[var(--church-blue)] pl-3">
          <p className="font-serif text-xl font-semibold tracking-tight text-slate-900 group-hover:text-[var(--church-blue-dark)]">
            Sousas Ward
          </p>
          <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-slate-500">The Church of Jesus Christ of Latter-day Saints</p>
        </Link>
        <div className="text-right">
          <p className="hidden text-sm text-stone-500 sm:block">{today}</p>
          {isAuthenticated ? (
            <div className="mt-1 flex items-center justify-end gap-3">
              <Link className="text-sm font-semibold text-[var(--church-blue-dark)] hover:text-slate-950" href="/meetings">Leader tools</Link>
              <SignOutButton />
            </div>
          ) : (
            <Link className="mt-1 inline-block text-sm font-semibold text-[var(--church-blue-dark)] hover:text-slate-950" href="/login">Leader sign in</Link>
          )}
        </div>
      </div>
    </header>
  );
}
