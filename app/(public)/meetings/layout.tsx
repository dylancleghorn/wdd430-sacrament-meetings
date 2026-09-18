import { NavLinks } from "@/components/NavLinks";
import { getCurrentMeeting } from "@/lib/meetings-db";
import { connection } from "next/server";
import { Suspense } from "react";

async function MeetingNavigation() {
  await connection();
  const currentMeeting = await getCurrentMeeting();

  return <NavLinks currentMeetingId={currentMeeting?.id ?? null} />;
}

export default function MeetingsLayout({ children }: LayoutProps<"/meetings">) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-stone-100">
      <Suspense fallback={<NavLinks currentMeetingId={null} />}>
        <MeetingNavigation />
      </Suspense>
      <main className="flex-1 px-5 py-9 sm:px-8 sm:py-12">{children}</main>
    </div>
  );
}
