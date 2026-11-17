"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ApiError, registrationApi } from "@/lib/api";

export default function RegisterButton({ workshopId }: { workshopId: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (status === "loading") return null;

  if (!session) {
    return (
      <p className="rounded-lg bg-indigo-50 p-3 text-sm text-indigo-800">
        <Link href={`/login?callbackUrl=/workshops/${workshopId}`} className="font-medium underline">
          Log in
        </Link>{" "}
        as a member to register for this workshop.
      </p>
    );
  }

  if (session.user.role === "admin") {
    return (
      <p className="rounded-lg bg-slate-100 p-3 text-sm text-slate-600">
        Admins manage workshops and cannot register for them.
      </p>
    );
  }

  async function onRegister() {
    setError("");
    setLoading(true);
    try {
      await registrationApi.create(workshopId, session!.user.token);
      setDone(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
        You are registered.{" "}
        <Link href="/registrations" className="font-medium underline">
          View my registrations
        </Link>
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </p>
      )}
      <button className="btn-primary" onClick={onRegister} disabled={loading}>
        {loading ? "Registering…" : "Register for this workshop"}
      </button>
    </div>
  );
}
