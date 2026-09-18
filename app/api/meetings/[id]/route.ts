import { getMeetingById } from "@/lib/meetings-db";

export async function GET(_request: Request, context: RouteContext<"/api/meetings/[id]">) {
  const { id } = await context.params;
  const meetingId = Number(id);

  if (!Number.isSafeInteger(meetingId) || id.trim() === "") {
    return Response.json({ error: "Meeting ID must be a whole number" }, { status: 400 });
  }

  const meeting = await getMeetingById(meetingId);

  if (!meeting) {
    return Response.json({ error: "Meeting not found" }, { status: 404 });
  }

  return Response.json(meeting);
}
