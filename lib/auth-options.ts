import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

function isBishopricEmail(email: string | null | undefined): boolean {
  if (!email) {
    return false;
  }

  const allowedEmails = (process.env.BISHOPRIC_EMAILS ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  return allowedEmails.includes(email.toLowerCase());
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  pages: { signIn: "/login" },
  callbacks: {
    signIn({ user }) {
      return isBishopricEmail(user.email);
    },
  },
};
