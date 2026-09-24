import Link from "next/link";

export default function EditMeetingNotFound() {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <h1 className="font-serif text-2xl font-semibold text-stone-950">Meeting not found</h1>
      <p className="mt-2 text-stone-600">This meeting may have been deleted or the address may be incorrect.</p>
      <Link className="mt-5 inline-block font-semibold text-[var(--church-blue-dark)] hover:text-slate-950" href="/meetings">← Back to meetings</Link>
    </div>
  );
}
