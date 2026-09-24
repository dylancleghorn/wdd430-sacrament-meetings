export type MeetingActionState = {
  errors?: Partial<Record<MeetingFormField, string[]>>;
  message: string;
};

type MeetingFormField =
  | "date"
  | "meetingType"
  | "presiding"
  | "conducting"
  | "announcements"
  | "openingHymnNumber"
  | "openingHymnTitle"
  | "openingPrayer"
  | "wardBusiness"
  | "stakeBusiness"
  | "sacramentHymnNumber"
  | "sacramentHymnTitle"
  | "speakers"
  | "closingHymnNumber"
  | "closingHymnTitle"
  | "closingPrayer";

export const initialMeetingActionState: MeetingActionState = { message: "" };
