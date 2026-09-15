import Link from "next/link";
import { notFound } from "next/navigation";
import { MeetingDetail } from "@/components/MeetingDetail";
import { PrintButton } from "@/components/PrintButton";
import { getMeetingById } from "@/lib/meetings-db";

type MeetingPageProps = {
  params: Promise<{ id: string }>;
};

export default async function MeetingPage({ params }: MeetingPageProps) {
  const { id } = await params;
  const meetingId = Number(id);

  if (!Number.isSafeInteger(meetingId) || id.trim() === "") {
    notFound();
  }

  const meeting = await getMeetingById(meetingId);

  if (!meeting) {
    notFound();
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
