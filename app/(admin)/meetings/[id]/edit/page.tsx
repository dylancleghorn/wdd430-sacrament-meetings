import { MeetingForm } from "@/components/MeetingForm";
import { getMeetingById } from "@/lib/meetings-db";
import { notFound } from "next/navigation";

type EditMeetingPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditMeetingPage({ params }: EditMeetingPageProps) {
  const { id } = await params;
  const meetingId = Number(id);

  if (!Number.isSafeInteger(meetingId) || meetingId < 1) {
    notFound();
  }

  const meeting = await getMeetingById(meetingId);

  if (!meeting) {
    notFound();
  }

  return (
    <>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--church-blue-dark)]">Leader tools</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-stone-950">Edit meeting</h1>
      <p className="mt-3 text-stone-600">Update the meeting program, then save your changes.</p>
      <MeetingForm meeting={meeting} />
    </>
  );
}
