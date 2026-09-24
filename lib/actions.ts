"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  addMeeting,
  deleteMeeting as deleteMeetingFromDatabase,
  updateMeeting as updateMeetingInDatabase,
} from "@/lib/meetings-db";
import type { MeetingActionState } from "@/lib/meeting-form-state";
import type { SacramentMeeting } from "@/lib/types";

const requiredText = z.string().trim().min(1, "This field is required.");
const hymnNumber = z.string()
  .trim()
  .regex(/^\d+$/, "Enter a whole hymn number.")
  .transform(Number)
  .pipe(z.number().int().min(0, "Enter zero or a positive hymn number.").max(1000, "Enter a hymn number of 1000 or less."));

const MeetingFormSchema = z.object({
  date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid meeting date."),
  meetingType: z.enum(["testimony", "regular", "stake", "general", "special"], {
    error: "Choose a meeting type.",
  }),
  presiding: requiredText,
  conducting: requiredText,
  announcements: z.string(),
  openingHymnNumber: hymnNumber,
  openingHymnTitle: requiredText,
  openingPrayer: requiredText,
  wardBusiness: z.string(),
  stakeBusiness: z.preprocess((value) => value === "on", z.boolean()),
  sacramentHymnNumber: hymnNumber,
  sacramentHymnTitle: requiredText,
  speakers: z.string(),
  closingHymnNumber: hymnNumber,
  closingHymnTitle: requiredText,
  closingPrayer: requiredText,
});

export async function createMeeting(
  _prevState: MeetingActionState,
  formData: FormData,
): Promise<MeetingActionState> {
  const validatedMeeting = validateMeeting(formData);

  if (!validatedMeeting.success) {
    return validatedMeeting.state;
  }

  try {
    await addMeeting(validatedMeeting.meeting);
  } catch (error) {
    console.error("Unable to create meeting:", error);
    throw new Error("We could not create the meeting. Please try again.");
  }

  revalidatePath("/meetings");
  redirect("/meetings");
}

export async function updateMeeting(
  id: number,
  _prevState: MeetingActionState,
  formData: FormData,
): Promise<MeetingActionState> {
  const validatedMeeting = validateMeeting(formData);

  if (!validatedMeeting.success) {
    return validatedMeeting.state;
  }

  try {
    await updateMeetingInDatabase(id, validatedMeeting.meeting);
  } catch (error) {
    console.error(`Unable to update meeting ${id}:`, error);
    throw new Error("We could not update the meeting. Please try again.");
  }

  revalidatePath("/meetings");
  redirect("/meetings");
}

export async function deleteMeeting(formData: FormData): Promise<void> {
  const parsedId = z.coerce.number().int().positive().safeParse(formData.get("id"));

  if (!parsedId.success) {
    throw new Error("The meeting ID is invalid.");
  }

  try {
    await deleteMeetingFromDatabase(parsedId.data);
  } catch (error) {
    console.error(`Unable to delete meeting ${parsedId.data}:`, error);
    throw new Error("We could not delete the meeting. Please try again.");
  }

  revalidatePath("/meetings");
}

function validateMeeting(formData: FormData):
  | { success: true; meeting: Omit<SacramentMeeting, "id"> }
  | { success: false; state: MeetingActionState } {
  const rawValues = {
    date: formData.get("date"),
    meetingType: formData.get("meetingType"),
    presiding: formData.get("presiding"),
    conducting: formData.get("conducting"),
    announcements: formData.get("announcements"),
    openingHymnNumber: formData.get("openingHymnNumber"),
    openingHymnTitle: formData.get("openingHymnTitle"),
    openingPrayer: formData.get("openingPrayer"),
    wardBusiness: formData.get("wardBusiness"),
    stakeBusiness: formData.get("stakeBusiness"),
    sacramentHymnNumber: formData.get("sacramentHymnNumber"),
    sacramentHymnTitle: formData.get("sacramentHymnTitle"),
    speakers: formData.get("speakers"),
    closingHymnNumber: formData.get("closingHymnNumber"),
    closingHymnTitle: formData.get("closingHymnTitle"),
    closingPrayer: formData.get("closingPrayer"),
  };
  const parsed = MeetingFormSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      success: false,
      state: {
        errors: parsed.error.flatten().fieldErrors,
        message: "Please correct the highlighted fields.",
      },
    };
  }

  return {
    success: true,
    meeting: {
      date: parsed.data.date,
      meetingType: parsed.data.meetingType,
      presiding: parsed.data.presiding,
      conducting: parsed.data.conducting,
      announcements: toLines(parsed.data.announcements),
      openingHymn: { number: parsed.data.openingHymnNumber, title: parsed.data.openingHymnTitle },
      openingPrayer: parsed.data.openingPrayer,
      wardBusiness: toLines(parsed.data.wardBusiness).map((description) => ({ description })),
      stakeBusiness: parsed.data.stakeBusiness,
      sacramentHymn: { number: parsed.data.sacramentHymnNumber, title: parsed.data.sacramentHymnTitle },
      speakers: toSpeakers(parsed.data.speakers),
      closingHymn: { number: parsed.data.closingHymnNumber, title: parsed.data.closingHymnTitle },
      closingPrayer: parsed.data.closingPrayer,
    },
  };
}

function toLines(value: string): string[] {
  return value.split("\n").map((line) => line.trim()).filter(Boolean);
}

function toSpeakers(value: string): SacramentMeeting["speakers"] {
  return toLines(value).map((line) => {
    const [name = "", topic = "", type = "speaker"] = line.split("|").map((part) => part.trim());
    return { name, topic, type: type === "musical-number" ? "musical-number" : "speaker" };
  });
}
