"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ApiError, registrationApi, workshopApi } from "@/lib/api";
import { formatDate, isPast } from "@/lib/format";
import type { Registration, UserSummary, Workshop } from "@/types";

export default function RegistrationsPage() {
  const { data: session } = useSession();
  const token = session?.user.token;
  const isAdmin = session?.user.role === "admin";

  const [items, setItems] = useState<Registration[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [target, setTarget] = useState("");
  const [busy, setBusy] = useState(false);

  const [reloadKey, setReloadKey] = useState(0);
  const reload = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    Promise.all([registrationApi.list(token), workshopApi.list()])
      .then(([regs, ws]) => {
        if (cancelled) return;
        setItems(regs.data);
        setWorkshops(ws.data);
        setError("");
        setLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof ApiError ? e.message : "Could not load registrations.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token, reloadKey]);

  async function save(id: string) {
    if (!token || !target) return;
    setBusy(true);
    setError("");
    try {
      await registrationApi.update(id, target, token);
      setEditing(null);
      reload();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not change workshop.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!token || !window.confirm("Cancel this registration?")) return;
    setBusy(true);
    setError("");
    try {
      await registrationApi.remove(id, token);
      reload();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not cancel registration.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p role="status">Loading registrations…</p>;

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">
          {isAdmin ? "All registrations" : "My registrations"}
        </h1>
        <p className="text-sm text-slate-600">
          {isAdmin
            ? "As an admin you can move or cancel any member's registration."
            : "You can hold up to 3 active registrations at once."}
        </p>
      </header>

      {error && (
        <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      {items.length === 0 ? (
        <div className="card space-y-3 text-center text-slate-600">
          <p>No registrations yet.</p>
          <Link href="/" className="btn-primary">
            Browse workshops
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((r) => {
            const w = typeof r.workshop === "string" ? null : r.workshop;
            const u = typeof r.user === "string" ? null : (r.user as UserSummary);
            const past = w ? isPast(w.workshopDate) : false;
            return (
              <li key={r._id} className="card space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="font-semibold">{w?.name ?? "Removed workshop"}</h2>
                    {w && (
                      <p className="text-sm text-slate-600">
                        {formatDate(w.workshopDate)} · {w.location} · {w.instructor}
                      </p>
                    )}
                    {isAdmin && u && (
                      <p className="text-xs text-slate-500">
                        {u.name} ({u.email})
                      </p>
                    )}
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      past || !w?.isActive
                        ? "bg-slate-100 text-slate-500"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {past || !w?.isActive ? "History" : "Active"}
                  </span>
                </div>

                {editing === r._id ? (
                  <div className="flex flex-wrap items-end gap-2">
                    <div className="min-w-56 flex-1 space-y-1">
                      <label htmlFor={`w-${r._id}`} className="text-sm font-medium">
                        Move to workshop
                      </label>
                      <select
                        id={`w-${r._id}`}
                        className="input"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                      >
                        <option value="">Choose a workshop</option>
                        {workshops
                          .filter((x) => !isPast(x.workshopDate))
                          .map((x) => (
                            <option key={x._id} value={x._id}>
                              {x.name} · {formatDate(x.workshopDate)}
                            </option>
                          ))}
                      </select>
                    </div>
                    <button className="btn-primary" disabled={busy || !target} onClick={() => save(r._id)}>
                      Save
                    </button>
                    <button className="btn-secondary" onClick={() => setEditing(null)}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      className="btn-secondary"
                      disabled={busy}
                      onClick={() => {
                        setEditing(r._id);
                        setTarget("");
                      }}
                    >
                      Change workshop
                    </button>
                    <button className="btn-danger" disabled={busy} onClick={() => remove(r._id)}>
                      Cancel registration
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
