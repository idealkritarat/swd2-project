import { dateParts } from "@/lib/format";

export default function DateTile({ iso, muted = false }: { iso: string; muted?: boolean }) {
  const { day, month, weekday } = dateParts(iso);
  return (
    <div
      aria-hidden="true"
      className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-lg ${
        muted ? "bg-canvas text-muted" : "bg-accent-soft text-accent"
      }`}
    >
      <span className="text-xs font-semibold uppercase tracking-wide">{weekday}</span>
      <span className="font-display text-2xl font-bold leading-none">{day}</span>
      <span className="text-xs font-semibold uppercase tracking-wide">{month}</span>
    </div>
  );
}
