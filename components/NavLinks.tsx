"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/meetings/current", label: "Current meeting" },
  { href: "/meetings", label: "All meetings" },
];

export function NavLinks({ currentMeetingId }: { currentMeetingId: number | null }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Meeting navigation" className="border-b border-stone-200 bg-stone-50 print:hidden">
      <div className="mx-auto flex max-w-6xl gap-1 px-5 sm:px-8">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href === "/meetings/current" && currentMeetingId !== null && pathname === `/meetings/${currentMeetingId}`);

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`border-b-2 px-3 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "border-[var(--church-blue)] text-[var(--church-blue-dark)]"
                  : "border-transparent text-stone-600 hover:border-stone-300 hover:text-stone-950"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
