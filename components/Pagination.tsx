"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = currentPage;

  if (totalPages <= 1) {
    return null;
  }

  function hrefFor(targetPage: number) {
    const params = new URLSearchParams(searchParams.toString());

    if (targetPage === 1) {
      params.delete("page");
    } else {
      params.set("page", String(targetPage));
    }

    const queryString = params.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
  }

  return (
    <nav aria-label="Meetings pagination" className="mt-8 flex items-center justify-between gap-4">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 transition hover:bg-stone-100">
          ← Previous
        </Link>
      ) : <span />}
      <p className="text-sm font-medium text-stone-700">Page {currentPage} of {totalPages}</p>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 transition hover:bg-stone-100">
          Next →
        </Link>
      ) : <span />}
    </nav>
  );
}
