import Link from "next/link";
import { DeleteMeetingButton } from "@/components/DeleteMeetingButton";
import { formatMeetingDate, getMeetingTypeLabel } from "@/lib/meetings-db";
import type { SacramentMeeting } from "@/lib/types";

export function MeetingCard({ meeting }: { meeting: SacramentMeeting }) {
  const speakers = meeting.speakers.filter((item) => item.type === "speaker");
  return (
    <li className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <Link
        href={`/meetings/${meeting.id}`}
        className="block rounded-t-xl p-5 transition hover:-translate-y-0.5 hover:border-[var(--church-blue)] hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[var(--church-blue-dark)]">{getMeetingTypeLabel(meeting.meetingType)}</p>
            <h2 className="mt-1 font-serif text-xl font-semibold text-stone-900">
              {formatMeetingDate(meeting.date)}
            </h2>
          </div>
          <span aria-hidden="true" className="text-lg text-stone-400">→</span>
        </div>
        <p className="mt-4 text-sm text-stone-600">
          Conducting: {meeting.conducting}
          {speakers.length > 0 && ` · ${speakers.length} speaker${speakers.length === 1 ? "" : "s"}`}
        </p>
      </Link>
      <div className="border-t border-stone-200 px-5 py-3">
        <DeleteMeetingButton meetingId={meeting.id} />
      </div>
    </li>
  );
}
