import { redirect } from "next/navigation";
import { getMeetings } from "@/lib/meetings-db";

export const dynamic = "force-dynamic";

export default function CurrentMeetingPage() {
  const today = new Date();
  const mostRecentSunday = new Date(today);
  mostRecentSunday.setDate(today.getDate() - today.getDay());
  const date = toIsoDate(mostRecentSunday);
  const meeting = getMeetings(date)[0];

  redirect(meeting ? `/meetings/${meeting.id}` : "/meetings");
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
