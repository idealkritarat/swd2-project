export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function dateParts(iso: string): { day: string; month: string; weekday: string } {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { day: "?", month: "", weekday: "" };
  const part = (options: Intl.DateTimeFormatOptions) =>
    d.toLocaleDateString("en-GB", { ...options, timeZone: "UTC" });
  return {
    day: part({ day: "numeric" }),
    month: part({ month: "short" }),
    weekday: part({ weekday: "short" }),
  };
}

export function monthLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
}

export function toDateInput(iso: string): string {
  return iso.slice(0, 10);
}

export function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isPast(iso: string): boolean {
  return iso.slice(0, 10) < todayUtc();
}
