import { headers } from "next/headers";

export async function fetchMeetingsApi(path: string): Promise<Response> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

  if (!host) {
    throw new Error("Unable to determine the request host for the meetings API.");
  }

  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";

  return fetch(`${protocol}://${host}${path}`, { cache: "no-store" });
}
