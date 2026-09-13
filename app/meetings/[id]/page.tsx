"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MeetingDetail } from "@/components/MeetingDetail";
import { PrintButton } from "@/components/PrintButton";
import type { SacramentMeeting } from "@/lib/types";

export default function MeetingPage() {
  const { id } = useParams<{ id: string }>();
  const [meeting, setMeeting] = useState<SacramentMeeting | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMeeting() {
      try {
        const response = await fetch(`/api/meetings/${encodeURIComponent(id)}`);

        if (response.status === 404) {
          setError("This meeting program could not be found.");
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to load meeting.");
        }

        const data: SacramentMeeting = await response.json();
        setMeeting(data);
      } catch {
        setError("The meeting program could not be loaded. Please refresh the page and try again.");
      }
    }

    void loadMeeting();
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl">
        <Link href="/meetings" className="text-sm font-semibold text-[var(--church-blue-dark)] hover:text-slate-950">← All meetings</Link>
        <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">{error}</p>
      </div>
    );
  }

  if (!meeting) {
    return <div aria-live="polite" className="mx-auto h-96 max-w-3xl animate-pulse rounded-xl bg-slate-200" />;
  }

  return (
    <div>
      <div className="mx-auto mb-6 flex max-w-3xl items-center justify-between gap-4 print:hidden">
        <Link href="/meetings" className="text-sm font-semibold text-[var(--church-blue-dark)] hover:text-slate-950">← All meetings</Link>
        <PrintButton />
      </div>
      <MeetingDetail meeting={meeting} />
    </div>
  );
}
