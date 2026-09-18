import type { ReactNode } from "react";
import { formatMeetingDate, getMeetingTypeLabel } from "@/lib/meetings-db";
import type { Hymn, SacramentMeeting, SpeakerItem } from "@/lib/types";

function AgendaRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-stone-200 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
      <dt className="text-sm font-semibold uppercase tracking-wide text-stone-500">{label}</dt>
      <dd className="text-stone-800">{children}</dd>
    </div>
  );
}

function HymnName({ hymn }: { hymn: Hymn }) {
  return <>{hymn.number}. {hymn.title}</>;
}

function ProgramItems({ items }: { items: SpeakerItem[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={`${item.name}-${item.topic}-${item.type}`}>
          <p className="font-medium">{item.name}</p>
          {item.topic && <p className="text-sm text-stone-600">{item.topic}</p>}
        </li>
      ))}
    </ul>
  );
}

export function MeetingDetail({ meeting }: { meeting: SacramentMeeting }) {
  const speakers = meeting.speakers.filter((item) => item.type === "speaker");
  const musicalNumbers = meeting.speakers.filter((item) => item.type === "musical-number");

  return (
    <article className="mx-auto max-w-3xl rounded-xl border border-stone-200 bg-white px-6 py-8 shadow-sm sm:px-10 print:max-w-none print:border-0 print:px-0 print:py-0 print:shadow-none">
      <header className="border-b border-stone-300 pb-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--church-blue-dark)]">Sousas Ward</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-stone-950">{getMeetingTypeLabel(meeting.meetingType)}</h1>
        <p className="mt-2 text-stone-600">{formatMeetingDate(meeting.date)}</p>
      </header>

      <dl className="mt-4">
        <AgendaRow label="Presiding">{meeting.presiding}</AgendaRow>
        <AgendaRow label="Conducting">{meeting.conducting}</AgendaRow>

        <AgendaRow label="Announcements">
          {meeting.announcements && meeting.announcements.length > 0 ? (
            <ul className="list-disc space-y-1 pl-5 marker:text-[var(--church-blue)]">
              {meeting.announcements.map((announcement) => <li key={announcement}>{announcement}</li>)}
            </ul>
          ) : <span className="text-stone-500">No announcements</span>}
        </AgendaRow>

        <AgendaRow label="Opening hymn"><HymnName hymn={meeting.openingHymn} /></AgendaRow>
        <AgendaRow label="Opening prayer">{meeting.openingPrayer}</AgendaRow>

        <AgendaRow label="Ward business">
          {meeting.wardBusiness.length > 0 ? (
            <ul className="list-disc space-y-1 pl-5 marker:text-[var(--church-blue)]">
              {meeting.wardBusiness.map((item) => <li key={item.description}>{item.description}</li>)}
            </ul>
          ) : <span className="text-stone-500">No ward business</span>}
        </AgendaRow>
        <AgendaRow label="Stake business">{meeting.stakeBusiness ? "Stake business will be conducted." : "No stake business"}</AgendaRow>

        <AgendaRow label="Sacrament hymn"><HymnName hymn={meeting.sacramentHymn} /></AgendaRow>
        {meeting.meetingType === "testimony" && (
          <AgendaRow label="Testimonies">Members of the congregation are invited to bear testimony.</AgendaRow>
        )}

        <AgendaRow label="Speakers">
          {speakers.length > 0 ? <ProgramItems items={speakers} /> : <span className="text-stone-500">No scheduled speakers</span>}
        </AgendaRow>
        <AgendaRow label="Musical number">
          {musicalNumbers.length > 0 ? <ProgramItems items={musicalNumbers} /> : <span className="text-stone-500">No musical number</span>}
        </AgendaRow>

        <AgendaRow label="Closing hymn"><HymnName hymn={meeting.closingHymn} /></AgendaRow>
        <AgendaRow label="Closing prayer">{meeting.closingPrayer}</AgendaRow>
      </dl>
    </article>
  );
}
