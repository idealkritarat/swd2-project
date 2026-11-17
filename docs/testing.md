# Testing

Run everything with `npm test`. Tests use Jest, jsdom and Testing Library, with the network and NextAuth mocked.

| File | What it checks |
|---|---|
| `__tests__/format.test.ts` | Date formatting, UTC past or today logic |
| `__tests__/api.test.ts` | Search encoding, bearer header, backend error to `ApiError`, network failure |
| `__tests__/RegisterButton.test.tsx` | Visitor, admin and member states, success, refused by a rule |
| `__tests__/WorkshopCard.test.tsx` | Card content, link, Ended badge |
| `__tests__/SearchBar.test.tsx` | Encoded query, clear |
| `__tests__/RegisterPage.test.tsx` | Password match, phone check, valid submit |

## Manual checklist

1. Log in as the admin that was created in advance, add three workshops.
2. Sign up as a new member, search, open a workshop, register.
3. Register for a fourth workshop: expect the limit message.
4. Register twice for one workshop: expect the duplicate message.
5. Change a registration to another workshop, then cancel it.
6. Open `/admin/workshops` as a member: expect "Admins only".
7. Open `/registrations` logged out: expect a redirect to login.
