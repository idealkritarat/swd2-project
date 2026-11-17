"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { ApiError, authApi } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email")).trim();
    const password = String(form.get("password"));
    const tel = String(form.get("tel")).trim();

    if (!/^[0-9+\-\s]{9,15}$/.test(tel)) {
      setError("Enter a valid phone number (digits only, 9 to 15 characters).");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== String(form.get("confirm"))) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await authApi.register({
        name: String(form.get("name")).trim(),
        email,
        tel,
        password,
        role: "member",
      });
      await signIn("credentials", { email, password, redirect: false });
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card mx-auto max-w-md space-y-4" noValidate>
      <h1 className="text-2xl font-bold">Create an account</h1>
      {error && (
        <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </p>
      )}
      {[
        ["name", "Full name", "text", "name"],
        ["email", "Email", "email", "email"],
        ["tel", "Phone number", "tel", "tel"],
        ["password", "Password", "password", "new-password"],
        ["confirm", "Confirm password", "password", "new-password"],
      ].map(([id, label, type, auto]) => (
        <div key={id} className="space-y-1">
          <label htmlFor={id} className="text-sm font-medium">
            {label}
          </label>
          <input id={id} name={id} type={type} required autoComplete={auto} className="input" />
        </div>
      ))}
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? "Creating account…" : "Sign up"}
      </button>
      <p className="text-center text-sm text-slate-600">
        Already registered?{" "}
        <Link href="/login" className="text-indigo-700 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
