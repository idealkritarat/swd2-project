export default function Loading() {
  return (
    <div role="status" aria-label="Loading" className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card h-28 animate-pulse bg-canvas" />
      ))}
    </div>
  );
}
