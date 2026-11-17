# Workshop Hub

Frontend for the **Workshop Registration System** (Project 3, Software Development Practice II, 2110507).
Visitors can browse and search workshops. Members register for them and manage their own registrations.
Admins manage workshops and any member's registrations.

- Live demo: [swd2-project.vercel.app](https://swd2-project.vercel.app)
- Backend: [SWDevPrac2-69-1/PJ03-WorkshopRegist](https://github.com/SWDevPrac2-69-1/PJ03-WorkshopRegist), deployed from our fork [idealkritarat/PJ03-WorkshopRegist](https://github.com/idealkritarat/PJ03-WorkshopRegist) at https://swd2-project-api.vercel.app (API docs at `/api-docs`)
- UI flow design: [FigJam board](https://www.figma.com/board/TRanVeLfSBu3qw5tIWRsZA)
- Team Yoyo: Kritarat Moonmanee ([@idealkritarat](https://github.com/idealkritarat)) and Piranat Wadlom ([@piranatw](https://github.com/piranatw))

## Features

| Requirement | Where |
|---|---|
| Register as a member, log in, log out, two roles (admin accounts are created in advance, not through the sign up page) | `/register`, `/login`, navbar, NextAuth credentials provider |
| Anyone can view workshops | `/` and `/workshops/[id]` |
| Search by name, description, instructor or location | search bar on `/`, calls `GET /workshops?search=` |
| Admin adds, edits, deletes workshops | `/admin/workshops` |
| Member registers for a workshop | "Register for this workshop" on `/workshops/[id]` |
| Member views, changes, cancels own registration; admin does it for anyone | `/registrations` |
| Rules (capacity, one per workshop, max 3 active, no past dates) | enforced by the backend, shown to the user with the backend's own message; the UI also hides registration for past workshops and blocks past dates in the admin form |

Extras: route protection with middleware, role-aware navigation, loading, error and not-found screens, form validation, keyboard and screen reader support (labels, `aria-live`, `role=alert`), responsive layout, and 20 automated tests.

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · NextAuth v4 (credentials, JWT sessions) · Jest and Testing Library.

## Run it locally

1. Start the backend from `PJ03-WorkshopRegist` (needs a MongoDB URI in `config/config.env`, serves on port 5000).
2. Copy the env file and edit the values:

```bash
cp .env.example .env.local
npm install
npm run dev
```

| Variable | Meaning |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL, for example `http://localhost:5000/api/v1` |
| `NEXTAUTH_URL` | Public URL of this app |
| `NEXTAUTH_SECRET` | Long random string used to sign sessions |

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server on port 3000 |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm test` | Jest test suite |

## Project structure

```
src/
  app/            routes (home, workshops/[id], login, register, registrations, admin/workshops)
  components/     Navbar, WorkshopCard, SearchBar, RegisterButton, Providers
  lib/            api.ts (backend client), auth.ts (NextAuth), format.ts (dates)
  types/          shared TypeScript types
  proxy.ts        protects /registrations and /admin
__tests__/        unit and component tests
docs/             UI flow, work split, API integration, testing, deployment
```

## Documentation

- [UI flow design](docs/ui-flow.md)
- [Work split](docs/work-split.md)
- [API integration](docs/api-integration.md)
- [Testing](docs/testing.md)
- [Deployment](docs/deployment.md)
