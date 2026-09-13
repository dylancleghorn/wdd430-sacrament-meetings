import type { MeetingType, SacramentMeeting } from "./types";

const meetings: SacramentMeeting[] = [
  {
    id: 1,
    date: "2026-08-30",
    meetingType: "testimony",
    presiding: "Bishop Paixão",
    conducting: "Brother Lewis",
    announcements: ["Ward picnic next Saturday at 5:30 p.m.", "Choir practice today at 3:00 p.m."],
    openingHymn: { number: 2, title: "The Spirit of God" },
    openingPrayer: "Sister Flores",
    wardBusiness: [{ description: "Welcome new members of the ward." }],
    stakeBusiness: false,
    sacramentHymn: { number: 169, title: "As Now We Take the Sacrament" },
    speakers: [],
    closingHymn: { number: 85, title: "How Firm a Foundation" },
    closingPrayer: "Brother Kim",
  },
  {
    id: 2,
    date: "2026-09-06",
    meetingType: "regular",
    presiding: "Bishop Paixão",
    conducting: "Counselor Davis",
    announcements: ["Temple recommend interviews are available Thursday evening."],
    openingHymn: { number: 6, title: "Redeemer of Israel" },
    openingPrayer: "Brother Patel",
    wardBusiness: [{ description: "Sustain Aaron Miller as a teacher in the elders quorum." }],
    stakeBusiness: false,
    sacramentHymn: { number: 170, title: "God, Our Father, Hear Us Pray" },
    speakers: [
      { name: "Sister Naomi Young", topic: "Finding peace through the Savior", type: "speaker" },
      { name: "Brother Mateo Cruz", topic: "Ministering with love", type: "speaker" },
    ],
    closingHymn: { number: 89, title: "The Lord Is My Light" },
    closingPrayer: "Sister Hall",
  },
  {
    id: 3,
    date: "2026-09-13",
    meetingType: "regular",
    presiding: "Bishop Paixão",
    conducting: "Counselor Davis",
    announcements: [
      "Youth standards night will be held Wednesday at 7:00 p.m.",
      "Please welcome visiting families after the meeting.",
    ],
    openingHymn: { number: 19, title: "We Thank Thee, O God, for a Prophet" },
    openingPrayer: "Sister Harper",
    wardBusiness: [{ description: "Release and sustain Primary teachers." }],
    stakeBusiness: false,
    sacramentHymn: { number: 175, title: "O God, the Eternal Father" },
    speakers: [
      { name: "Brother Eli Thompson", topic: "Covenants that lead us to Christ", type: "speaker" },
      { name: "Sister Maren Smith", topic: "Growing faith through daily scripture study", type: "speaker" },
      { name: "Ward Choir", topic: "I Know That My Redeemer Lives", type: "musical-number" },
    ],
    closingHymn: { number: 100, title: "Nearer, My God, to Thee" },
    closingPrayer: "Brother Walker",
  },
  {
    id: 4,
    date: "2026-09-20",
    meetingType: "stake",
    presiding: "Stake President Anderson",
    conducting: "Stake Presidency",
    announcements: ["This meeting will be held at the stake center.", "There will be no ward classes following the meeting."],
    openingHymn: { number: 65, title: "Come, All Ye Saints of Zion" },
    openingPrayer: "Sister Lee",
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: { number: 0, title: "Not applicable" },
    speakers: [{ name: "Stake Presidency", topic: "Stake conference instruction", type: "speaker" }],
    closingHymn: { number: 26, title: "Joseph Smith's First Prayer" },
    closingPrayer: "Brother Martin",
  },
  {
    id: 5,
    date: "2026-09-27",
    meetingType: "general",
    presiding: "Bishop Paixão",
    conducting: "Counselor Davis",
    announcements: ["General conference broadcast begins at 10:00 a.m. in the chapel."],
    openingHymn: { number: 0, title: "Not applicable" },
    openingPrayer: "Not applicable",
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 0, title: "Not applicable" },
    speakers: [],
    closingHymn: { number: 0, title: "Not applicable" },
    closingPrayer: "Not applicable",
  },
];

export function getMeetings(date?: string | null): SacramentMeeting[] {
  return date ? meetings.filter((meeting) => meeting.date === date) : meetings;
}

export function getMeetingById(id: number): SacramentMeeting | null {
  return meetings.find((meeting) => meeting.id === id) ?? null;
}

export function getCurrentMeeting(referenceDate = new Date()): SacramentMeeting {
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());
  const sundayId = toDateId(sunday);

  return getMeetings(sundayId)[0] ?? meetings.find((meeting) => meeting.date >= sundayId) ?? meetings[meetings.length - 1];
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
  };

  return labels[type];
}

export function isSacramentMeeting(type: MeetingType): boolean {
  return type === "regular" || type === "testimony";
}

function toDateId(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
