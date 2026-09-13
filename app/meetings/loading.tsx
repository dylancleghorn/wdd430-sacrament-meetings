export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse">
      <div className="h-8 w-48 rounded bg-stone-200" />
      <div className="mt-3 h-5 w-80 max-w-full rounded bg-stone-200" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="h-40 rounded-xl bg-stone-200" />
        <div className="h-40 rounded-xl bg-stone-200" />
      </div>
    </div>
  );
}
