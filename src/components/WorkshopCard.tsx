import Link from "next/link";
import type { Workshop } from "@/types";
import { formatDate, isPast } from "@/lib/format";

export default function WorkshopCard({ workshop }: { workshop: Workshop }) {
  const past = isPast(workshop.workshopDate);
  return (
    <article className="card flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold text-slate-900">{workshop.name}</h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            past ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {past ? "Ended" : "Open"}
        </span>
      </div>
      <p className="line-clamp-2 text-sm text-slate-600">{workshop.description}</p>
      <dl className="grid grid-cols-2 gap-2 text-xs text-slate-500">
        <div>
          <dt className="font-medium text-slate-700">Date</dt>
          <dd>{formatDate(workshop.workshopDate)}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-700">Seats</dt>
          <dd>{workshop.capacity}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-700">Instructor</dt>
          <dd>{workshop.instructor}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-700">Location</dt>
          <dd>{workshop.location}</dd>
        </div>
      </dl>
      <Link href={`/workshops/${workshop._id}`} className="btn-secondary mt-auto">
        View details
      </Link>
    </article>
  );
}
