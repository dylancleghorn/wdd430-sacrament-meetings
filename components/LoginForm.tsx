"use client";

import { signIn } from "next-auth/react";

export function LoginForm({ returnTo }: { returnTo: string }) {
  return (
    <form onSubmit={(event) => { event.preventDefault(); void signIn("google", { callbackUrl: returnTo }); }} className="mt-8 space-y-5 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <button className="w-full rounded-md bg-[var(--church-blue-dark)] px-4 py-2.5 font-semibold text-white transition hover:bg-[var(--church-blue)]" type="submit">
        Continue with Google
      </button>
    </form>
  );
}
