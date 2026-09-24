"use client";

import { useActionState } from "react";
import { createMeeting, updateMeeting } from "@/lib/actions";
import { initialMeetingActionState } from "@/lib/meeting-form-state";
import type { SacramentMeeting } from "@/lib/types";

type MeetingFormProps = {
  meeting?: SacramentMeeting;
};

const inputClassName = "mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-950 shadow-sm focus:border-[var(--church-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--church-blue-soft)]";
const labelClassName = "block text-sm font-semibold text-stone-800";
const errorClassName = "mt-1 min-h-5 text-sm text-red-700";

export function MeetingForm({ meeting }: MeetingFormProps) {
  const action = meeting ? updateMeeting.bind(null, meeting.id) : createMeeting;
  const [state, formAction, isPending] = useActionState(action, initialMeetingActionState);
  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="mt-8 space-y-8 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldError error={errors.date} id="date-error">
          <label className={labelClassName} htmlFor="date">Meeting date</label>
          <input aria-describedby="date-error" className={inputClassName} defaultValue={meeting?.date} id="date" name="date" type="date" />
        </FieldError>
        <FieldError error={errors.meetingType} id="meetingType-error">
          <label className={labelClassName} htmlFor="meetingType">Meeting type</label>
          <select aria-describedby="meetingType-error" className={inputClassName} defaultValue={meeting?.meetingType ?? "regular"} id="meetingType" name="meetingType">
            <option value="regular">Sacrament Meeting</option>
            <option value="testimony">Fast and Testimony Meeting</option>
            <option value="stake">Stake Meeting</option>
            <option value="general">General Conference</option>
            <option value="special">Special Meeting</option>
          </select>
        </FieldError>
        <FieldError error={errors.presiding} id="presiding-error">
          <label className={labelClassName} htmlFor="presiding">Presiding</label>
          <input aria-describedby="presiding-error" className={inputClassName} defaultValue={meeting?.presiding} id="presiding" name="presiding" type="text" />
        </FieldError>
        <FieldError error={errors.conducting} id="conducting-error">
          <label className={labelClassName} htmlFor="conducting">Conducting</label>
          <input aria-describedby="conducting-error" className={inputClassName} defaultValue={meeting?.conducting} id="conducting" name="conducting" type="text" />
        </FieldError>
      </div>

      <TextAreaField defaultValue={meeting?.announcements?.join("\n")} error={errors.announcements} id="announcements" label="Announcements" name="announcements" hint="Enter one announcement per line." />

      <section aria-labelledby="opening-heading" className="space-y-5 border-t border-stone-200 pt-6">
        <h2 className="font-serif text-xl font-semibold text-stone-950" id="opening-heading">Opening</h2>
        <HymnFields errorNumber={errors.openingHymnNumber} errorTitle={errors.openingHymnTitle} heading="Opening hymn" idPrefix="openingHymn" hymn={meeting?.openingHymn} />
        <TextField defaultValue={meeting?.openingPrayer} error={errors.openingPrayer} id="openingPrayer" label="Opening prayer" name="openingPrayer" />
      </section>

      <section aria-labelledby="program-heading" className="space-y-5 border-t border-stone-200 pt-6">
        <h2 className="font-serif text-xl font-semibold text-stone-950" id="program-heading">Program</h2>
        <TextAreaField defaultValue={meeting?.wardBusiness.map((item) => item.description).join("\n")} error={errors.wardBusiness} id="wardBusiness" label="Ward business" name="wardBusiness" hint="Enter one item per line." />
        <div className="flex items-center gap-3">
          <input aria-describedby="stakeBusiness-error" defaultChecked={meeting?.stakeBusiness} id="stakeBusiness" name="stakeBusiness" type="checkbox" />
          <label className={labelClassName} htmlFor="stakeBusiness">Include stake business</label>
        </div>
        <p aria-live="polite" className={errorClassName} id="stakeBusiness-error">{errors.stakeBusiness?.join(" ")}</p>
        <HymnFields errorNumber={errors.sacramentHymnNumber} errorTitle={errors.sacramentHymnTitle} heading="Sacrament hymn" idPrefix="sacramentHymn" hymn={meeting?.sacramentHymn} />
        <TextAreaField defaultValue={meeting?.speakers.map((speaker) => `${speaker.name} | ${speaker.topic} | ${speaker.type}`).join("\n")} error={errors.speakers} id="speakers" label="Speakers and musical numbers" name="speakers" hint="Enter one per line: Name | Topic | speaker. Use musical-number as the final value for music." />
      </section>

      <section aria-labelledby="closing-heading" className="space-y-5 border-t border-stone-200 pt-6">
        <h2 className="font-serif text-xl font-semibold text-stone-950" id="closing-heading">Closing</h2>
        <HymnFields errorNumber={errors.closingHymnNumber} errorTitle={errors.closingHymnTitle} heading="Closing hymn" idPrefix="closingHymn" hymn={meeting?.closingHymn} />
        <TextField defaultValue={meeting?.closingPrayer} error={errors.closingPrayer} id="closingPrayer" label="Closing prayer" name="closingPrayer" />
      </section>

      <p aria-live="polite" className="min-h-5 text-sm text-red-700" role="status">{state.message}</p>
      <button className="rounded-md bg-[var(--church-blue-dark)] px-4 py-2 font-semibold text-white transition hover:bg-[var(--church-blue)] disabled:cursor-not-allowed disabled:opacity-60" disabled={isPending} type="submit">
        {isPending ? "Saving…" : meeting ? "Save changes" : "Create meeting"}
      </button>
    </form>
  );
}

function HymnFields({ errorNumber, errorTitle, heading, hymn, idPrefix }: { errorNumber?: string[]; errorTitle?: string[]; heading: string; hymn?: SacramentMeeting["openingHymn"]; idPrefix: "openingHymn" | "sacramentHymn" | "closingHymn" }) {
  const numberId = `${idPrefix}Number`;
  const titleId = `${idPrefix}Title`;
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-stone-800">{heading}</legend>
      <div className="mt-2 grid gap-5 sm:grid-cols-3">
        <FieldError error={errorNumber} id={`${numberId}-error`}>
          <label className={labelClassName} htmlFor={numberId}>Number</label>
          <input aria-describedby={`${numberId}-error`} className={inputClassName} defaultValue={hymn?.number} id={numberId} min="0" name={numberId} type="number" />
        </FieldError>
        <div className="sm:col-span-2">
          <FieldError error={errorTitle} id={`${titleId}-error`}>
            <label className={labelClassName} htmlFor={titleId}>Title</label>
            <input aria-describedby={`${titleId}-error`} className={inputClassName} defaultValue={hymn?.title} id={titleId} name={titleId} type="text" />
          </FieldError>
        </div>
      </div>
    </fieldset>
  );
}

function TextField({ defaultValue, error, id, label, name }: { defaultValue?: string; error?: string[]; id: string; label: string; name: string }) {
  return <FieldError error={error} id={`${id}-error`}><label className={labelClassName} htmlFor={id}>{label}</label><input aria-describedby={`${id}-error`} className={inputClassName} defaultValue={defaultValue} id={id} name={name} type="text" /></FieldError>;
}

function TextAreaField({ defaultValue, error, hint, id, label, name }: { defaultValue?: string; error?: string[]; hint: string; id: string; label: string; name: string }) {
  return <FieldError error={error} id={`${id}-error`}><label className={labelClassName} htmlFor={id}>{label}</label><textarea aria-describedby={`${id}-error ${id}-hint`} className={inputClassName} defaultValue={defaultValue} id={id} name={name} rows={3} /><p className="mt-1 text-sm text-stone-600" id={`${id}-hint`}>{hint}</p></FieldError>;
}

function FieldError({ children, error, id }: { children: React.ReactNode; error?: string[]; id: string }) {
  return <div>{children}<p aria-live="polite" className={errorClassName} id={id}>{error?.join(" ")}</p></div>;
}
