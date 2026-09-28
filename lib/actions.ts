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
import { requireBishopric } from "@/lib/auth";

const requiredText = z.string().trim().min(1, "This field is required.").max(255, "Use 255 characters or fewer.");
const hymnNumber = z.string()
  .trim()
  .regex(/^\d+$/, "Enter a whole hymn number.")
  .transform(Number)
  .pipe(z.number().int().min(0, "Enter zero or a positive hymn number.").max(1000, "Enter a hymn number of 1000 or less."));

const MeetingFormSchema = z.object({
  date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid meeting date.").refine(isValidIsoDate, "Enter a real calendar date."),
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
  speakers: z.string().superRefine(validateSpeakerRows),
  closingHymnNumber: hymnNumber,
  closingHymnTitle: requiredText,
  closingPrayer: requiredText,
});

export async function createMeeting(
  _prevState: MeetingActionState,
  formData: FormData,
): Promise<MeetingActionState> {
  await requireBishopric();
  const validatedMeeting = validateMeeting(formData);

  if (!validatedMeeting.success) {
    return validatedMeeting.state;
  }

  try {
    await addMeeting(validatedMeeting.meeting);
  } catch (error) {
    if (isDuplicateMeetingDate(error)) {
      return duplicateDateState();
    }
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
  await requireBishopric();
  const validatedMeeting = validateMeeting(formData);

  if (!validatedMeeting.success) {
    return validatedMeeting.state;
  }

  try {
    await updateMeetingInDatabase(id, validatedMeeting.meeting);
  } catch (error) {
    if (isDuplicateMeetingDate(error)) {
      return duplicateDateState();
    }
    console.error(`Unable to update meeting ${id}:`, error);
    throw new Error("We could not update the meeting. Please try again.");
  }

  revalidatePath("/meetings");
  redirect("/meetings");
}

export async function deleteMeeting(formData: FormData): Promise<void> {
  await requireBishopric();
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
    const [name, topic, type] = line.split("|").map((part) => part.trim()) as [string, string, "speaker" | "musical-number"];
    return { name, topic, type };
  });
}

function isValidIsoDate(value: string): boolean {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function validateSpeakerRows(value: string, context: z.RefinementCtx): void {
  for (const [index, line] of toLines(value).entries()) {
    const parts = line.split("|").map((part) => part.trim());

    if (parts.length !== 3) {
      context.addIssue({ code: "custom", message: `Line ${index + 1} must include a name, topic, and type.` });
      continue;
    }

    const row = z.object({
      name: requiredText,
      topic: requiredText,
      type: z.enum(["speaker", "musical-number"], { error: "Use speaker or musical-number." }),
    }).safeParse({ name: parts[0], topic: parts[1], type: parts[2] });

    if (!row.success) {
      context.addIssue({ code: "custom", message: `Line ${index + 1}: ${row.error.issues[0]?.message ?? "is invalid."}` });
    }
  }
}

function isDuplicateMeetingDate(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && (error as { code?: unknown }).code === "23505";
}

function duplicateDateState(): MeetingActionState {
  return {
    errors: { date: ["A meeting is already scheduled for this date."] },
    message: "Please choose a different meeting date.",
  };
}
