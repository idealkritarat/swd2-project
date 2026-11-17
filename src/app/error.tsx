"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="card mx-auto max-w-md space-y-3 text-center" role="alert">
      <h1 className="font-display text-xl font-semibold">Something went wrong</h1>
      <p className="text-sm text-muted">
        {error.message || "We could not load this page."}
      </p>
      <button className="btn-primary" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
