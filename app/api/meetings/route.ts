import { getMeetings } from "@/lib/meetings-db";

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const date = searchParams.get("date");

  if (date) {
    return Response.json(await getMeetings(date));
  }

  const page = Number(searchParams.get("page"));
  return Response.json(
    await getMeetings({
      query: searchParams.get("query"),
      page: Number.isSafeInteger(page) && page > 0 ? page : 1,
    }),
  );
}
