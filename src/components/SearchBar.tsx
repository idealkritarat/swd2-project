"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ initial = "" }: { initial?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initial);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/?search=${encodeURIComponent(q)}` : "/");
  }

  return (
    <form onSubmit={submit} role="search" className="flex gap-2">
      <label htmlFor="search" className="sr-only">
        Search workshops
      </label>
      <input
        id="search"
        className="input"
        placeholder="Search by name, description, instructor or location"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" className="btn-primary">
        Search
      </button>
      {initial && (
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            setValue("");
            router.push("/");
          }}
        >
          Clear
        </button>
      )}
    </form>
  );
}
