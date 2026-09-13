import Link from "next/link";

export function Header() {
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
        <p className="hidden text-right text-sm text-stone-500 sm:block">{today}</p>
      </div>
    </header>
  );
}
