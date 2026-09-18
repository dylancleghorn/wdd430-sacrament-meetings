import { MeetingCard } from "@/components/MeetingCard";
import { MeetingSearch } from "@/components/MeetingSearch";
import { Pagination } from "@/components/Pagination";
import { getMeetings } from "@/lib/meetings-db";

type MeetingsPageProps = {
  searchParams: Promise<{ query?: string | string[]; page?: string | string[] }>;
};

export default async function MeetingsPage({ searchParams }: MeetingsPageProps) {
  const params = await searchParams;
  const query = typeof params.query === "string" ? params.query : "";
  const requestedPage = typeof params.page === "string" ? Number(params.page) : 1;
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const { meetings, currentPage, totalPages, totalMeetings } = await getMeetings({ query, page });

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--church-blue-dark)]">Programs</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-stone-950">All meetings</h1>
      <p className="mt-3 max-w-2xl text-stone-600">Choose a meeting to view its complete agenda or print a copy of the program.</p>

      <MeetingSearch />

      {meetings.length === 0 ? (
        <p className="mt-8 rounded-xl border border-stone-200 bg-white p-6 text-stone-600">
          No meetings match {query ? `“${query}”` : "your search"}.
        </p>
      ) : (
        <>
          <p className="mt-6 text-sm text-stone-600">
            Showing {meetings.length} of {totalMeetings} meeting{totalMeetings === 1 ? "" : "s"}.
          </p>
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {meetings.map((meeting) => <MeetingCard key={meeting.id} meeting={meeting} />)}
          </ul>
        </>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
