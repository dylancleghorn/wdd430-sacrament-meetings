import { getMeetings } from "@/lib/meetings-db";

export function GET(request: Request) {
  const date = new URL(request.url).searchParams.get("date");
  return Response.json(getMeetings(date));
}
