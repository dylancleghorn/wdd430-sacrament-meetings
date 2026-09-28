"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button className="text-sm font-semibold text-[var(--church-blue-dark)] hover:text-slate-950" onClick={() => signOut({ callbackUrl: "/" })} type="button">
      Sign out
    </button>
  );
}
