# API integration

All backend calls live in `src/lib/api.ts`. Every function returns the backend's `{ success, data }` shape or throws an `ApiError` carrying the backend's message and HTTP status, so screens show the real reason a request was refused.

| Frontend function | Endpoint | Used by |
|---|---|---|
| `authApi.login` | `POST /auth/login` | NextAuth `authorize` |
| `authApi.register` | `POST /auth/register` | `/register` |
| `workshopApi.list(search)` | `GET /workshops?search=` | `/`, `/registrations`, `/admin/workshops` |
| `workshopApi.get` | `GET /workshops/:id` | `/workshops/[id]` |
| `workshopApi.create/update/remove` | `POST/PUT/DELETE /workshops` | `/admin/workshops` |
| `registrationApi.list` | `GET /registrations` | `/registrations` |
| `registrationApi.create` | `POST /registrations` | `RegisterButton` |
| `registrationApi.update` | `PUT /registrations/:id` | change workshop |
| `registrationApi.remove` | `DELETE /registrations/:id` | cancel |

## Authentication

NextAuth's credentials provider calls `POST /auth/login`. The backend JWT is stored inside the NextAuth session (`session.user.token`) together with the role, then sent as `Authorization: Bearer <token>`. The backend ignores cookies, so logging out only clears the NextAuth session.

## Error mapping

| Status | Meaning | UI |
|---|---|---|
| 400 | Invalid input or date | Alert with the message |
| 401 | Missing or expired token | Redirect to login |
| 403 | Role not allowed | Alert, admin page shows "Admins only" |
| 404 | Not found | Not-found screen |
| 409 | Full, duplicate, or over the 3-workshop limit | Alert with the message |
| 0 | Network failure | "Cannot reach the server" |
