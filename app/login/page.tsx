import type { Metadata } from "next";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Bishopric sign in",
  description: "Secure access for bishopric members to manage sacrament meeting programs.",
  robots: { index: false, follow: false },
};

type LoginPageProps = {
  searchParams: Promise<{ returnTo?: string | string[]; error?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const returnTo = typeof params.returnTo === "string" ? params.returnTo : "/meetings/new";
  const accessDenied = params.error === "AccessDenied";

  return (
    <main className="flex flex-1 items-center bg-stone-100 px-5 py-12 sm:px-8">
      <div className="mx-auto w-full max-w-md">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--church-blue-dark)]">Leader tools</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-stone-950">Bishopric sign in</h1>
        <p className="mt-3 text-stone-600">Sign in with your approved Google account to create, update, and manage sacrament meeting programs.</p>
        {accessDenied && <p className="mt-5 rounded-md bg-red-50 p-3 text-sm text-red-800">This Google account is not approved for bishopric tools.</p>}
        <LoginForm returnTo={returnTo} />
      </div>
    </main>
  );
}
