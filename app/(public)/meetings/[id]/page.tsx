import Link from "next/link";
import { notFound } from "next/navigation";
import { MeetingDetail } from "@/components/MeetingDetail";
import { PrintButton } from "@/components/PrintButton";
import { fetchMeetingsApi } from "@/lib/meetings-api";
import type { SacramentMeeting } from "@/lib/types";

type MeetingPageProps = {
  params: Promise<{ id: string }>;
};

export default async function MeetingPage({ params }: MeetingPageProps) {
  const { id } = await params;
  const meetingId = Number(id);

  if (!Number.isSafeInteger(meetingId) || id.trim() === "") {
    notFound();
  }

  const response = await fetchMeetingsApi(`/api/meetings/${meetingId}`);

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Unable to load this meeting.");
  }

  const meeting = await response.json() as SacramentMeeting;

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
