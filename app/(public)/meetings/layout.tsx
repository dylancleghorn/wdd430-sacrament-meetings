import { NavLinks } from "@/components/NavLinks";
import { getCurrentMeeting } from "@/lib/meetings-db";
import { connection } from "next/server";

export default async function MeetingsLayout({ children }: LayoutProps<"/meetings">) {
  await connection();
  const currentMeeting = await getCurrentMeeting();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-stone-100">
      <NavLinks currentMeetingId={currentMeeting?.id ?? null} />
      <main className="flex-1 px-5 py-9 sm:px-8 sm:py-12">{children}</main>
    </div>
  );
}
