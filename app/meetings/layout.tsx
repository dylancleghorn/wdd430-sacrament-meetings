import { NavLinks } from "@/components/NavLinks";
import { getCurrentMeeting } from "@/lib/meetings-db";

export const dynamic = "force-dynamic";

export default function MeetingsLayout({ children }: LayoutProps<"/meetings">) {
  const currentMeeting = getCurrentMeeting();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-stone-100">
      <NavLinks currentMeetingId={currentMeeting.id} />
      <main className="flex-1 px-5 py-9 sm:px-8 sm:py-12">{children}</main>
    </div>
  );
}
