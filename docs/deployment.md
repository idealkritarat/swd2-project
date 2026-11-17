# Deployment

Three parts, all online.

| Part | Where | Address |
|---|---|---|
| Frontend (this repo) | Vercel | https://swd2-project.vercel.app |
| Backend API | Vercel, from [idealkritarat/swd2-project-api](https://github.com/idealkritarat/swd2-project-api) | https://swd2-project-api.vercel.app (docs at `/api-docs`) |
| Database | MongoDB Atlas, database `workshops` | connection string is only in the backend's Vercel environment |

## Backend

The backend is the supplied PJ03-WorkshopRegist API with small changes so it runs as a Vercel function: it does not call `listen` on Vercel, trusts the proxy header, and reads the rate limit from `RATE_LIMIT`. Environment variables set on Vercel: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `JWT_COOKIE_EXPIRE`, `NODE_ENV`, `FRONTEND_URL` and `RATE_LIMIT`. `FRONTEND_URL` is the frontend address, which the backend uses for CORS.

## Frontend

Environment variables set on Vercel: `NEXT_PUBLIC_API_URL` (the backend address plus `/api/v1`), `NEXTAUTH_URL` and `NEXTAUTH_SECRET`. Pushing to `main` redeploys the site.

## Sample data

The database has an admin, a member and six sample workshops, one of them with only two seats so the "capacity reached" rule can be shown in the demo.
