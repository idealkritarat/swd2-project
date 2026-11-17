import Link from "next/link";
import type { Workshop } from "@/types";
import { formatDate, isPast } from "@/lib/format";
import DateTile from "@/components/DateTile";

export default function WorkshopCard({ workshop }: { workshop: Workshop }) {
  const past = isPast(workshop.workshopDate);
  return (
    <article className="card flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 gap-4">
        <DateTile iso={workshop.workshopDate} muted={past} />
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="font-display text-lg font-semibold leading-snug">{workshop.name}</h3>
            {past && (
              <span className="rounded-md bg-canvas px-2 py-0.5 text-sm font-medium text-muted">
                Ended
              </span>
            )}
          </div>
          <p className="line-clamp-2 text-muted">{workshop.description}</p>
          <p className="text-sm text-muted">
            <span className="sr-only">{formatDate(workshop.workshopDate)}. </span>
            {workshop.instructor} · {workshop.location} · {workshop.capacity} seats
          </p>
        </div>
      </div>
      <Link href={`/workshops/${workshop._id}`} className="btn-secondary sm:shrink-0">
        View details
      </Link>
    </article>
  );
}
