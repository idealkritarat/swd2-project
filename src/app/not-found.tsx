import Link from "next/link";

export default function NotFound() {
  return (
    <div className="card mx-auto max-w-md space-y-3 text-center">
      <h1 className="font-display text-xl font-semibold">Page not found</h1>
      <p className="text-sm text-muted">That workshop or page does not exist.</p>
      <Link href="/" className="btn-primary">
        Back to workshops
      </Link>
    </div>
  );
}
