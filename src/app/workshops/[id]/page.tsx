import { notFound } from "next/navigation";
import Link from "next/link";
import RegisterButton from "@/components/RegisterButton";
import { ApiError, workshopApi } from "@/lib/api";
import DateTile from "@/components/DateTile";
import { formatDate, isPast } from "@/lib/format";
import type { Workshop } from "@/types";

export default async function WorkshopDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let workshop: Workshop;
  try {
    workshop = (await workshopApi.get(id)).data;
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 400 || e.status === 500)) {
      notFound();
    }
    throw e;
  }
  const past = isPast(workshop.workshopDate);

  return (
    <div className="space-y-6">
      <Link href="/" className="inline-flex min-h-11 items-center text-sm font-semibold text-accent hover:underline">
        ← All workshops
      </Link>
      <article className="card space-y-5">
        <header className="flex gap-4">
          <DateTile iso={workshop.workshopDate} muted={past} />
          <div className="min-w-0 space-y-1">
            <h1 className="font-display text-3xl font-bold leading-tight">{workshop.name}</h1>
            <p className="text-muted">Taught by {workshop.instructor}</p>
          </div>
        </header>
        <p className="whitespace-pre-line text-lg text-ink">{workshop.description}</p>
        <dl className="grid grid-cols-1 divide-y divide-line border-y border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="py-3 sm:px-4 sm:first:pl-0">
            <dt className="text-sm text-muted">Date</dt>
            <dd className="font-semibold">{formatDate(workshop.workshopDate)}</dd>
          </div>
          <div className="py-3 sm:px-4">
            <dt className="text-sm text-muted">Location</dt>
            <dd className="font-semibold">{workshop.location}</dd>
          </div>
          <div className="py-3 sm:px-4">
            <dt className="text-sm text-muted">Capacity</dt>
            <dd className="font-semibold">{workshop.capacity} seats</dd>
          </div>
        </dl>
        {past ? (
          <p className="rounded-lg bg-canvas p-3 text-muted">
            This workshop has already taken place, so registration is closed.
          </p>
        ) : (
          <RegisterButton workshopId={workshop._id} />
        )}
      </article>
    </div>
  );
}
