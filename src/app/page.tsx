import SearchBar from "@/components/SearchBar";
import WorkshopCard from "@/components/WorkshopCard";
import { workshopApi } from "@/lib/api";
import { isPast, monthLabel } from "@/lib/format";
import type { Workshop } from "@/types";

function groupByMonth(workshops: Workshop[]): { label: string; items: Workshop[] }[] {
  const byDate = (a: Workshop, b: Workshop) => a.workshopDate.localeCompare(b.workshopDate);
  const upcoming = workshops.filter((w) => !isPast(w.workshopDate)).sort(byDate);
  const ended = workshops.filter((w) => isPast(w.workshopDate)).sort((a, b) => byDate(b, a));

  const groups: { label: string; items: Workshop[] }[] = [];
  for (const w of upcoming) {
    const label = monthLabel(w.workshopDate);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(w);
    else groups.push({ label, items: [w] });
  }
  if (ended.length > 0) groups.push({ label: "Ended", items: ended });
  return groups;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const { data: workshops } = await workshopApi.list(search);
  const groups = groupByMonth(workshops);

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="font-display text-3xl font-bold tracking-tight">Workshops</h1>
        <p className="text-muted">
          Pick a date, log in, and register. You can hold up to three active registrations.
        </p>
      </section>

      <SearchBar initial={search ?? ""} />

      {search && (
        <p className="text-muted" aria-live="polite">
          {workshops.length} result{workshops.length === 1 ? "" : "s"} for “{search}”
        </p>
      )}

      {workshops.length === 0 ? (
        <div className="card text-center text-muted">
          {search ? "No workshops match your search." : "No workshops are available yet."}
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map((g) => (
            <section key={g.label} aria-labelledby={`m-${g.label}`} className="space-y-3">
              <h2 id={`m-${g.label}`} className="text-sm font-semibold uppercase tracking-wide text-muted">
                {g.label}
              </h2>
              <ul className="space-y-3">
                {g.items.map((w) => (
                  <li key={w._id}>
                    <WorkshopCard workshop={w} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
