"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function MeetingSearch() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== query) {
      inputRef.current.value = query;
    }
  }, [query]);

  const updateSearch = useCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (term.trim()) {
      params.set("query", term.trim());
    } else {
      params.delete("query");
    }

    params.delete("page");
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }, [pathname, router, searchParams]);

  const debouncedSearch = useDebouncedCallback(updateSearch, 300);

  return (
    <label className="mt-8 block max-w-xl">
      <span className="text-sm font-semibold text-stone-800">Search meetings</span>
      <input
        ref={inputRef}
        type="search"
        name="query"
        defaultValue={query}
        onChange={(event) => debouncedSearch(event.target.value)}
        placeholder="Speaker, presiding, conducting, or meeting type"
        className="mt-2 w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-[var(--church-blue)] focus:ring-2 focus:ring-[var(--church-blue)]/20"
      />
    </label>
  );
}
