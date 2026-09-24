"use client";

import { useEffect, useRef, useState } from "react";
import { deleteMeeting } from "@/lib/actions";

export function DeleteMeetingButton({ meetingId }: { meetingId: number }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  function openDialog() {
    dialogRef.current?.showModal();
    setIsOpen(true);
  }

  return (
    <>
      <button
        className="text-sm font-semibold text-red-700 hover:text-red-900"
        onClick={openDialog}
        type="button"
      >
        Delete meeting
      </button>

      <dialog
        aria-labelledby={`delete-meeting-${meetingId}-title`}
        className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-stone-200 bg-white p-0 text-stone-900 shadow-2xl backdrop:bg-slate-950/40"
        onClose={() => setIsOpen(false)}
        ref={dialogRef}
      >
        <div className="p-6">
          <h2 className="font-serif text-2xl font-semibold" id={`delete-meeting-${meetingId}-title`}>
            Delete this meeting?
          </h2>
          <p className="mt-3 text-stone-600">
            This will permanently remove the meeting program and cannot be undone.
          </p>

          <div className="mt-6 flex justify-end gap-3">
            <form method="dialog">
              <button
                autoFocus
                className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800 hover:bg-stone-100"
                type="submit"
              >
                Cancel
              </button>
            </form>
            <form action={deleteMeeting}>
              <input name="id" type="hidden" value={meetingId} />
              <button className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800" type="submit">
                Delete meeting
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
