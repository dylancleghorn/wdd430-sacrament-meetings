import { MeetingCard } from "@/components/MeetingCard";
import { getApiUrl } from "@/lib/server-api";
import type { SacramentMeeting } from "@/lib/types";

export default async function MeetingsPage() {
  const response = await fetch(await getApiUrl("/api/meetings"), { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Unable to load meetings.");
  }

  const meetings: SacramentMeeting[] = await response.json();

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--church-blue-dark)]">Programs</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-stone-950">All meetings</h1>
      <p className="mt-3 max-w-2xl text-stone-600">Choose a meeting to view its complete agenda or print a copy of the program.</p>
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {[...meetings].reverse().map((meeting) => <MeetingCard key={meeting.id} meeting={meeting} />)}
      </ul>
    </div>
  );
}
