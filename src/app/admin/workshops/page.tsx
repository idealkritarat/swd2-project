"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ApiError, workshopApi } from "@/lib/api";
import { formatDate, toDateInput, todayUtc } from "@/lib/format";
import type { Workshop, WorkshopInput } from "@/types";

const empty: WorkshopInput = {
  name: "",
  description: "",
  instructor: "",
  workshopDate: "",
  location: "",
  capacity: 10,
};

export default function AdminWorkshopsPage() {
  const { data: session, status } = useSession();
  const token = session?.user.token;

  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [form, setForm] = useState<WorkshopInput>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [reloadKey, setReloadKey] = useState(0);
  const reload = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    let cancelled = false;
    workshopApi
      .list()
      .then((res) => {
        if (!cancelled) setWorkshops(res.data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof ApiError ? e.message : "Could not load workshops.");
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  if (status === "loading") return <p role="status">Loading…</p>;
  if (session?.user.role !== "admin") {
    return (
      <div className="card mx-auto max-w-md space-y-3 text-center">
        <h1 className="text-xl font-semibold">Admins only</h1>
        <p className="text-sm text-slate-600">You need an admin account to manage workshops.</p>
        <Link href="/" className="btn-primary">
          Back to workshops
        </Link>
      </div>
    );
  }

  function set<K extends keyof WorkshopInput>(key: K, value: WorkshopInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setError("");
    if (form.workshopDate < todayUtc()) {
      setError("The workshop date cannot be before today.");
      return;
    }
    if (!Number.isInteger(form.capacity) || form.capacity < 1) {
      setError("Capacity must be a whole number of at least 1.");
      return;
    }
    setBusy(true);
    try {
      if (editingId) await workshopApi.update(editingId, form, token);
      else await workshopApi.create(form, token);
      setForm(empty);
      setEditingId(null);
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save workshop.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(w: Workshop) {
    if (!token || !window.confirm(`Delete “${w.name}”? Registration history is kept.`)) return;
    setError("");
    try {
      await workshopApi.remove(w._id, token);
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete workshop.");
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Manage workshops</h1>

      {error && (
        <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      <form onSubmit={onSubmit} className="card grid gap-4 sm:grid-cols-2" aria-label="Workshop form">
        <h2 className="text-lg font-semibold sm:col-span-2">
          {editingId ? "Edit workshop" : "Add a workshop"}
        </h2>
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input id="name" required className="input" value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div className="space-y-1">
          <label htmlFor="instructor" className="text-sm font-medium">
            Instructor
          </label>
          <input
            id="instructor"
            required
            className="input"
            value={form.instructor}
            onChange={(e) => set("instructor", e.target.value)}
          />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            required
            rows={3}
            className="input"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="date" className="text-sm font-medium">
            Date
          </label>
          <input
            id="date"
            type="date"
            required
            min={todayUtc()}
            className="input"
            value={form.workshopDate}
            onChange={(e) => set("workshopDate", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="location" className="text-sm font-medium">
            Location
          </label>
          <input
            id="location"
            required
            className="input"
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="capacity" className="text-sm font-medium">
            Capacity
          </label>
          <input
            id="capacity"
            type="number"
            min={1}
            required
            className="input"
            value={form.capacity}
            onChange={(e) => set("capacity", Number(e.target.value))}
          />
        </div>
        <div className="flex items-end gap-2 sm:col-span-2">
          <button type="submit" className="btn-primary" disabled={busy}>
            {editingId ? "Save changes" : "Add workshop"}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setEditingId(null);
                setForm(empty);
              }}
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>

      <section aria-labelledby="existing" className="space-y-3">
        <h2 id="existing" className="text-lg font-semibold">
          Existing workshops ({workshops.length})
        </h2>
        {workshops.length === 0 ? (
          <p className="card text-center text-slate-600">No workshops yet. Add the first one above.</p>
        ) : (
          <ul className="space-y-3">
            {workshops.map((w) => (
              <li key={w._id} className="card flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{w.name}</p>
                  <p className="text-sm text-slate-600">
                    {formatDate(w.workshopDate)} · {w.location} · {w.capacity} seats
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setEditingId(w._id);
                      setForm({
                        name: w.name,
                        description: w.description,
                        instructor: w.instructor,
                        workshopDate: toDateInput(w.workshopDate),
                        location: w.location,
                        capacity: w.capacity,
                      });
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Edit
                  </button>
                  <button className="btn-danger" onClick={() => remove(w)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
