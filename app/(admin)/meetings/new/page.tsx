import { MeetingForm } from "@/components/MeetingForm";

export default function NewMeetingPage() {
  return (
    <>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--church-blue-dark)]">Leader tools</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-stone-950">Create meeting</h1>
      <p className="mt-3 text-stone-600">Add the agenda for an upcoming sacrament meeting.</p>
      <MeetingForm />
    </>
  );
}
