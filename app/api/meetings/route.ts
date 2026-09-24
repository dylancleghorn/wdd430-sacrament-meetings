import { getMeetings } from "@/lib/meetings-db";

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const date = searchParams.get("date");

  if (date) {
    if (!isIsoDate(date)) {
      return Response.json({ error: "Date must use the YYYY-MM-DD format" }, { status: 400 });
    }

    const meetings = await getMeetings(date);
    return Response.json(meetings);
  }

  if (!searchParams.has("query") && !searchParams.has("page")) {
    return Response.json(await getMeetings());
  }

  const page = Number(searchParams.get("page"));
  return Response.json(
    await getMeetings({
      query: searchParams.get("query"),
      page: Number.isSafeInteger(page) && page > 0 ? page : 1,
    }),
  );
}

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}
