import Link from "next/link";
import Image from "next/image";
import { connection } from "next/server";
import { formatMeetingDate, getCurrentMeeting, getMeetingTypeLabel } from "@/lib/meetings-db";

export default async function Home() {
  await connection();
  const currentMeeting = await getCurrentMeeting();

  return (
    <main className="flex flex-1 items-start bg-stone-100 px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="text-center lg:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--church-blue-dark)]">Sousas Ward</p>
          <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            Sacrament Meeting Planner
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-stone-600 lg:mx-0">
            View a meeting program, review upcoming agendas, and print a clear program for Sunday.
          </p>

          <section className="mt-10 rounded-2xl border border-stone-200 bg-white p-7 text-left shadow-sm sm:p-9">
            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--church-blue-dark)]">Current program</p>
            {currentMeeting ? (
              <>
                <h2 className="mt-2 font-serif text-2xl font-semibold text-stone-950">{getMeetingTypeLabel(currentMeeting.meetingType)}</h2>
                <p className="mt-1 text-stone-600">{formatMeetingDate(currentMeeting.date)}</p>
              </>
            ) : <p className="mt-2 text-stone-600">A meeting program has not been published yet.</p>}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={currentMeeting ? "/meetings/current" : "/meetings"} className="rounded-lg bg-[var(--church-blue)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--church-blue-dark)]">
                View current program
              </Link>
              <Link href="/meetings" className="rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-800 transition hover:bg-stone-100">
                Browse all meetings
              </Link>
            </div>
          </section>
        </div>

        <Image
          src="/meeting-program.svg"
          alt="Illustration of a printed sacrament meeting program"
          width={640}
          height={440}
          priority
          className="mx-auto w-full max-w-md"
        />
      </div>
    </main>
  );
}
