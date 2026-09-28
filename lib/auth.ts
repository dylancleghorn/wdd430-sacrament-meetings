import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function isBishopricAuthenticated(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return Boolean(session?.user?.email);
}

export async function requireBishopric(returnTo = "/meetings/new"): Promise<void> {
  if (!await isBishopricAuthenticated()) {
    redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  }
}
