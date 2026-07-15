# LUC-1220 Local Protected Route Action Proof Matrix

## Status

- Result: **FAIL**
- Environment: local-only
- Evidence date: 2026-07-15
- Generated at (UTC): 2026-07-15T01:34:07.886Z
- Raw JSON: `history\artifacts\luc-1220-local-protected-route-action-proof-matrix-2026-07-15.json`
- Dynamic fixtures: disabled
- Fixture API interception: disabled

## Covered Actions

| Action ID | Route | Result | Observed path | Notes |
| --- | --- | --- | --- | --- |
| SOAR-ACTION-VISIT-PAGE-ADMIN-SUBSCRIPTIONS | `/admin/subscriptions` | PASS | `/auth/login` | unauthenticated protected admin list route fails closed to login |
| SOAR-ACTION-VISIT-PAGE-ADMIN-SUBSCRIPTIONS | `/admin/subscriptions` | PASS | `/admin/subscriptions` | route reached expected admin route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-ADMIN-USERS | `/admin/users` | FAIL | `/auth/login` | expected /admin/users, got /auth/login; preview=Skip to main content
Soar
Login
Register
Sign in to Soar

Access your control center and monitor markets, positions, and bot runtime in one place.

Email
Password
Remember this dev |

## Source And Test References

| Path | Status |
| --- | --- |
| `apps/web/src/app/admin/layout.tsx` | present |
| `apps/web/src/app/admin/page.tsx` | present |
| `apps/web/src/app/admin/subscriptions/page.tsx` | present |
| `apps/web/src/app/admin/users/page.tsx` | present |
| `apps/web/src/features/admin/subscriptions/pages/AdminSubscriptionsPage.tsx` | present |
| `apps/web/src/features/admin/users/pages/AdminUsersPage.tsx` | present |
| `docs/modules/web-admin.md` | present |
| `docs/modules/api-admin.md` | present |
| `docs/modules/api-subscriptions.md` | present |

## Cluster References

| Cluster | Actions | API routes | Docs |
| --- | ---: | --- | --- |
| admin | 2 | `GET /admin/subscriptions/plans`<br>`PUT /admin/subscriptions/plans/:id`<br>`GET /admin/users`<br>`PUT /admin/users/:id` | `docs/modules/web-admin.md`<br>`docs/modules/api-admin.md`<br>`docs/modules/api-subscriptions.md` |

## Existing Focused Tests

- admin: `AdminSubscriptionsPage tests`, `AdminUsersPage tests`, `apps/api/src/modules/admin/admin.e2e.test.ts`, `apps/api/src/modules/subscriptions/subscriptions.e2e.test.ts`

## Blockers

- none

## Safety Notes

- This proof uses a synthetic local cookie value only to exercise the Web middleware gate.
- Dynamic fixture mode uses synthetic IDs only: `none`. Optional CDP API interception is available behind `--intercept-fixture-api`, but is disabled by default to keep the local proof non-hanging.
- It does not submit forms, does not create/update/delete wallets, strategies, markets, bots, backtests, profile settings, admin records, logs, or reports, does not call exchange APIs, and does not touch production accounts.
- Production protected proof remains outside this local harness and is still linked to [LUC-241](/LUC/issues/LUC-241) for approved auth/session access.
