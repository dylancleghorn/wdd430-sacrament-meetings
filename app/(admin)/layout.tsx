import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 bg-stone-100 px-5 py-10 sm:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8 flex items-center justify-between border-b border-stone-200 pb-4">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--church-blue-dark)]">Leader tools</p>
          <Link href="/meetings" className="text-sm font-semibold text-[var(--church-blue-dark)] hover:text-slate-950">View meetings</Link>
        </div>
        {children}
      </div>
    </main>
  );
}
