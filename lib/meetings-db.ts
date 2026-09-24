import { neon } from "@neondatabase/serverless";
import type { MeetingType, SacramentMeeting } from "./types";

const MEETINGS_PER_PAGE = 4;

type MeetingRow = {
  id: number;
  date: string | Date;
  meeting_type: MeetingType;
  presiding: string;
  conducting: string;
  announcements: string[] | null;
  opening_hymn: SacramentMeeting["openingHymn"];
  opening_prayer: string;
  ward_business: SacramentMeeting["wardBusiness"] | null;
  stake_business: boolean | null;
  sacrament_hymn: SacramentMeeting["sacramentHymn"];
  speakers: SacramentMeeting["speakers"] | null;
  closing_hymn: SacramentMeeting["closingHymn"];
  closing_prayer: string;
};

export type MeetingListQuery = {
  query?: string | null;
  page?: number;
  pageSize?: number;
};

export type MeetingListResult = {
  meetings: SacramentMeeting[];
  currentPage: number;
  totalPages: number;
  totalMeetings: number;
};

type MeetingPageTotals = Pick<MeetingListResult, "totalMeetings" | "totalPages">;

export function getMeetings(date?: string | null): Promise<SacramentMeeting[]>;
export function getMeetings(query: MeetingListQuery): Promise<MeetingListResult>;
export async function getMeetings(
  input: string | null | MeetingListQuery = null,
): Promise<SacramentMeeting[] | MeetingListResult> {
  if (typeof input === "string" || input === null) {
    const sql = getDatabaseClient();
    const rows = typeof input === "string"
      ? await sql`
          SELECT *
          FROM meetings
          WHERE date = ${input}::date
          ORDER BY date ASC
        ` as MeetingRow[]
      : await sql`
          SELECT *
          FROM meetings
          ORDER BY date ASC
        ` as MeetingRow[];

    return rows.map(toSacramentMeeting);
  }

  const query = input?.query?.trim() ?? "";
  const searchPattern = toSearchPattern(query);
  const pageSize = Math.max(1, Math.floor(input?.pageSize ?? MEETINGS_PER_PAGE));
  const requestedPage = Math.max(1, Math.floor(input?.page ?? 1));
  const { totalMeetings, totalPages } = await getMeetingsTotalPages(query, pageSize);
  const currentPage = Math.min(requestedPage, totalPages);
  const offset = (currentPage - 1) * pageSize;
  const sql = getDatabaseClient();
  const rows = await sql`
    SELECT *
    FROM meetings
    WHERE (
      ${query} = ''
      OR presiding ILIKE ${searchPattern} ESCAPE '\\'
      OR conducting ILIKE ${searchPattern} ESCAPE '\\'
      OR meeting_type ILIKE ${searchPattern} ESCAPE '\\'
      OR speakers::text ILIKE ${searchPattern} ESCAPE '\\'
    )
    ORDER BY date DESC
    LIMIT ${pageSize}
    OFFSET ${offset}
  ` as MeetingRow[];

  return {
    meetings: rows.map(toSacramentMeeting),
    currentPage,
    totalPages,
    totalMeetings,
  };
}

export async function getMeetingsTotalPages(
  query: string | null = null,
  pageSize = MEETINGS_PER_PAGE,
): Promise<MeetingPageTotals> {
  const normalizedQuery = query?.trim() ?? "";
  const searchPattern = toSearchPattern(normalizedQuery);
  const normalizedPageSize = Math.max(1, Math.floor(pageSize));
  const sql = getDatabaseClient();
  const countRows = await sql`
    SELECT COUNT(*)::text AS count
    FROM meetings
    WHERE (
      ${normalizedQuery} = ''
      OR presiding ILIKE ${searchPattern} ESCAPE '\\'
      OR conducting ILIKE ${searchPattern} ESCAPE '\\'
      OR meeting_type ILIKE ${searchPattern} ESCAPE '\\'
      OR speakers::text ILIKE ${searchPattern} ESCAPE '\\'
    )
  ` as { count: string }[];
  const totalMeetings = Number(countRows[0]?.count ?? 0);
  return {
    totalPages: Math.max(1, Math.ceil(totalMeetings / normalizedPageSize)),
    totalMeetings,
  };
}

export async function getMeetingById(id: number): Promise<SacramentMeeting | null> {
  const sql = getDatabaseClient();
  const rows = await sql`
    SELECT *
    FROM meetings
    WHERE id = ${id}
  ` as MeetingRow[];

  return rows[0] ? toSacramentMeeting(rows[0]) : null;
}

export async function getCurrentMeeting(referenceDate = new Date()): Promise<SacramentMeeting | null> {
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());
  const sundayId = toDateId(sunday);
  const sql = getDatabaseClient();
  const rows = await sql`
    SELECT *
    FROM meetings
    WHERE date = ${sundayId}::date
    ORDER BY date ASC
    LIMIT 1
  ` as MeetingRow[];

  if (rows[0]) {
    return toSacramentMeeting(rows[0]);
  }

  const upcomingRows = await sql`
    SELECT *
    FROM meetings
    WHERE date >= ${sundayId}::date
    ORDER BY date ASC
    LIMIT 1
  ` as MeetingRow[];

  return upcomingRows[0] ? toSacramentMeeting(upcomingRows[0]) : null;
}

// These mutations are intentionally deferred until the Week 04 forms are built.
export async function addMeeting(_meeting: Omit<SacramentMeeting, "id">): Promise<never> {
  void _meeting;
  throw new Error("Creating meetings will be available in Week 04.");
}

export async function updateMeeting(
  _id: number,
  _meeting: Omit<SacramentMeeting, "id">,
): Promise<never> {
  void _id;
  void _meeting;
  throw new Error("Updating meetings will be available in Week 04.");
}

export async function deleteMeeting(_id: number): Promise<never> {
  void _id;
  throw new Error("Deleting meetings will be available in Week 04.");
}

export function formatMeetingDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export function getMeetingTypeLabel(type: MeetingType): string {
  const labels: Record<MeetingType, string> = {
    testimony: "Fast and Testimony Meeting",
    regular: "Sacrament Meeting",
    stake: "Stake Meeting",
    general: "General Conference",
    special: "Special Meeting",
  };

  return labels[type];
}

export function isSacramentMeeting(type: MeetingType): boolean {
  return type === "regular" || type === "testimony";
}

function getDatabaseClient() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured. Pull the Vercel environment variables into .env.local.");
  }

  return neon(databaseUrl);
}

function toSacramentMeeting(row: MeetingRow): SacramentMeeting {
  return {
    id: Number(row.id),
    date: toIsoDate(row.date),
    meetingType: row.meeting_type,
    presiding: row.presiding,
    conducting: row.conducting,
    announcements: row.announcements ?? [],
    openingHymn: row.opening_hymn,
    openingPrayer: row.opening_prayer,
    wardBusiness: row.ward_business ?? [],
    stakeBusiness: row.stake_business ?? false,
    sacramentHymn: row.sacrament_hymn,
    speakers: row.speakers ?? [],
    closingHymn: row.closing_hymn,
    closingPrayer: row.closing_prayer,
  };
}

function toDateId(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toIsoDate(date: string | Date): string {
  if (date instanceof Date) {
    return date.toISOString().slice(0, 10);
  }

  const match = /^(\d{4}-\d{2}-\d{2})/.exec(date);

  if (!match) {
    throw new Error(`The database returned an invalid meeting date: ${date}`);
  }

  return match[1];
}

function toSearchPattern(query: string): string {
  return `%${query.replace(/[\\%_]/g, "\\$&")}%`;
}
