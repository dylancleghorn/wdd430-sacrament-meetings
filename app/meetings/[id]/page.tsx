import Link from "next/link";
import { notFound } from "next/navigation";
import { MeetingDetail } from "@/components/MeetingDetail";
import { PrintButton } from "@/components/PrintButton";
import { getApiUrl } from "@/lib/server-api";
import type { SacramentMeeting } from "@/lib/types";

export default async function MeetingPage({ params }: PageProps<"/meetings/[id]">) {
  const { id } = await params;
  const response = await fetch(await getApiUrl(`/api/meetings/${encodeURIComponent(id)}`), { cache: "no-store" });

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Unable to load meeting.");
  }

  const meeting: SacramentMeeting = await response.json();

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
