"use client";

import { useEffect, useState } from "react";
import { MeetingCard } from "@/components/MeetingCard";
import type { SacramentMeeting } from "@/lib/types";

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<SacramentMeeting[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMeetings() {
      try {
        const response = await fetch("/api/meetings");

        if (!response.ok) {
          throw new Error("Unable to load meetings.");
        }

        const data: SacramentMeeting[] = await response.json();
        setMeetings(data);
      } catch {
        setError("The meeting programs could not be loaded. Please refresh the page and try again.");
      }
    }

    void loadMeetings();
  }, []);

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--church-blue-dark)]">Programs</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-stone-950">All meetings</h1>
      <p className="mt-3 max-w-2xl text-stone-600">Choose a meeting to view its complete agenda or print a copy of the program.</p>

      {error ? (
        <p role="alert" className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">{error}</p>
      ) : meetings.length === 0 ? (
        <div aria-live="polite" className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="h-40 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-40 animate-pulse rounded-xl bg-slate-200" />
        </div>
      ) : (
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {[...meetings].reverse().map((meeting) => <MeetingCard key={meeting.id} meeting={meeting} />)}
        </ul>
      )}
    </div>
  );
}
