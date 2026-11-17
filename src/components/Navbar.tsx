"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
        active ? "bg-accent-soft text-accent" : "text-muted hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-4xl flex-wrap items-center gap-2 px-4 py-3"
      >
        <Link href="/" className="font-display mr-4 text-xl font-bold text-ink">
          Workshop Hub
        </Link>
        <NavLink href="/">Workshops</NavLink>
        {user && <NavLink href="/registrations">My registrations</NavLink>}
        {user?.role === "admin" && <NavLink href="/admin/workshops">Manage workshops</NavLink>}

        <div className="ml-auto flex items-center gap-2">
          {status === "loading" ? null : user ? (
            <>
              <span className="hidden text-sm text-muted sm:inline">
                {user.name}
                <span className="ml-2 rounded-md bg-canvas px-2 py-0.5 text-xs font-semibold uppercase text-muted">
                  {user.role}
                </span>
              </span>
              <button className="btn-secondary" onClick={() => signOut({ callbackUrl: "/" })}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary">
                Log in
              </Link>
              <Link href="/register" className="btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
