import SearchBar from "@/components/SearchBar";
import WorkshopCard from "@/components/WorkshopCard";
import { workshopApi } from "@/lib/api";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const { data: workshops } = await workshopApi.list(search);

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Find your next workshop</h1>
        <p className="text-slate-600">
          Browse upcoming workshops, then log in to register for up to three at a time.
        </p>
      </section>

      <SearchBar initial={search ?? ""} />

      {search && (
        <p className="text-sm text-slate-600" aria-live="polite">
          {workshops.length} result{workshops.length === 1 ? "" : "s"} for “{search}”
        </p>
      )}

      {workshops.length === 0 ? (
        <div className="card text-center text-slate-600">
          {search ? "No workshops match your search." : "No workshops are available yet."}
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workshops.map((w) => (
            <li key={w._id} className="flex">
              <div className="flex w-full">
                <WorkshopCard workshop={w} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
