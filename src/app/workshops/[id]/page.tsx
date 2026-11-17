import { notFound } from "next/navigation";
import Link from "next/link";
import RegisterButton from "@/components/RegisterButton";
import { ApiError, workshopApi } from "@/lib/api";
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
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/" className="text-sm text-indigo-700 hover:underline">
        ← All workshops
      </Link>
      <article className="card space-y-5">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold">{workshop.name}</h1>
          <p className="text-sm text-slate-500">Taught by {workshop.instructor}</p>
        </header>
        <p className="whitespace-pre-line text-slate-700">{workshop.description}</p>
        <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="font-medium text-slate-700">Date</dt>
            <dd className="text-slate-600">{formatDate(workshop.workshopDate)}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-700">Location</dt>
            <dd className="text-slate-600">{workshop.location}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-700">Capacity</dt>
            <dd className="text-slate-600">{workshop.capacity} seats</dd>
          </div>
        </dl>
        {past ? (
          <p className="rounded-lg bg-slate-100 p-3 text-sm text-slate-600">
            This workshop has already taken place, so registration is closed.
          </p>
        ) : (
          <RegisterButton workshopId={workshop._id} />
        )}
      </article>
    </div>
  );
}
