"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function MeetingsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-red-50 p-6 text-red-950">
      <h1 className="font-serif text-2xl font-semibold">We couldn’t load the meetings</h1>
      <p className="mt-2">Please try again. If the problem continues, return to the meetings list and try later.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button className="rounded-md bg-red-800 px-4 py-2 font-semibold text-white hover:bg-red-900" onClick={reset} type="button">Try Again</button>
        <Link className="rounded-md border border-red-300 bg-white px-4 py-2 font-semibold text-red-900 hover:bg-red-100" href="/meetings">Back to meetings</Link>
      </div>
    </div>
  );
}
