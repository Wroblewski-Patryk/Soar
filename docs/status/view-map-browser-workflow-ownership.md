# View Map And Browser Workflow Ownership

Updated: 2026-05-27
Issue: `LUC-38` (Frontend)
Owner lane: `frontend-engineer`

Purpose: define route-to-view ownership and browser workflow proof expectations for Web UI work, using the canonical dashboard route map and current app routes.

## Sources

- `docs/architecture/reference/dashboard-route-map.md`
- `apps/web/src/app/**/page.tsx`
- `docs/status/function-journey-index.md`
- `docs/status/user-action-index.md`

## Route-To-View Ownership

| Surface | Route pattern | Primary page/component | Feature ownership | Browser workflow owner |
| --- | --- | --- | --- | --- |
| Public home | `/` | `apps/web/src/app/(public)/page.tsx` | `app/(public)` | `frontend-engineer` |
| Auth login/register | `/auth/login`, `/auth/register` | `apps/web/src/app/(public)/auth/*/page.tsx` | `features/auth` | `frontend-engineer` |
| Dashboard runtime home | `/dashboard` | `apps/web/src/app/dashboard/page.tsx` | `features/dashboard-home` | `frontend-engineer` |
| Bots flows | `/dashboard/bots*` | `apps/web/src/app/dashboard/bots/**/page.tsx` | `features/bots` | `frontend-engineer` |
| Wallet flows | `/dashboard/wallets*` | `apps/web/src/app/dashboard/wallets/**/page.tsx` | `features/wallets` | `frontend-engineer` |
| Market flows | `/dashboard/markets*` | `apps/web/src/app/dashboard/markets/**/page.tsx` | `features/markets` | `frontend-engineer` |
| Strategy flows | `/dashboard/strategies*` | `apps/web/src/app/dashboard/strategies/**/page.tsx` | `features/strategies` | `frontend-engineer` |
| Backtest flows | `/dashboard/backtests*` | `apps/web/src/app/dashboard/backtests/**/page.tsx` | `features/backtest` | `frontend-engineer` |
| Reports | `/dashboard/reports` | `apps/web/src/app/dashboard/reports/page.tsx` | `features/reports` | `frontend-engineer` |
| Logs | `/dashboard/logs` | `apps/web/src/app/dashboard/logs/page.tsx` | `features/logs` | `frontend-engineer` |
| Profile/API keys/security | `/dashboard/profile` | `apps/web/src/app/dashboard/profile/page.tsx` | `features/profile`, `features/exchanges` | `frontend-engineer` |
| Admin users/subscriptions | `/admin/users`, `/admin/subscriptions` | `apps/web/src/app/admin/**/page.tsx` | `features/admin/*` | `frontend-engineer` |
| Offline | `/offline` | `apps/web/src/app/offline/page.tsx` | `app/offline` | `frontend-engineer` |

## Route-To-Client-API Mapping

| Surface | Route pattern | Primary view/component | Client API calls (web) |
| --- | --- | --- | --- |
| Auth | `/auth/login`, `/auth/register` | `features/auth/*Form` | `POST /auth/login`, `POST /auth/register`, `GET /auth/me`, `POST /auth/logout` |
| Dashboard runtime home | `/dashboard` | `features/dashboard-home/HomeLiveWidgets` | `GET /dashboard/bots`, `GET /dashboard/bots/:id/runtime-monitoring/aggregate`, `GET /dashboard/market-stream/events`, `GET /dashboard/icons/lookup` |
| Bots | `/dashboard/bots*` | `features/bots/BotsManagement`, `BotCreateEditForm` | `GET/POST/PUT/DELETE /dashboard/bots*`, `GET /dashboard/bots/:id/runtime-sessions*`, `POST /dashboard/orders/open`, `POST /dashboard/orders/:id/cancel`, `GET /dashboard/orders/manual-context` |
| Wallets | `/dashboard/wallets*` | `features/wallets/*` | `GET/POST/PUT/DELETE /dashboard/wallets*`, `POST /dashboard/wallets/:id/reset-paper`, `POST /dashboard/wallets/preview-balance` |
| Markets | `/dashboard/markets*` | `features/markets/*` | `GET/POST/PUT/DELETE /dashboard/markets/universes*`, `GET /dashboard/markets/catalog` |
| Strategies | `/dashboard/strategies*` | `features/strategies/*` | `GET/POST/PUT/DELETE /dashboard/strategies*`, `GET /dashboard/strategies/indicators` |
| Backtests | `/dashboard/backtests*` | `features/backtest/*` | `GET/POST/DELETE /dashboard/backtests/runs*`, `GET /dashboard/backtests/runs/:id/report`, `GET /dashboard/backtests/runs/:id/timeline` |
| Reports | `/dashboard/reports` | `features/reports/PerformanceReportsView` | `GET /dashboard/reports/cross-mode-performance` |
| Logs | `/dashboard/logs` | `features/logs/LogsView` | `GET /dashboard/logs` |
| Profile & security | `/dashboard/profile` | `features/profile/pages/ProfilePage` | `GET/PATCH /dashboard/profile/basic`, `GET/POST/PATCH/DELETE /dashboard/profile/apiKeys*`, `PATCH /dashboard/profile/security/password`, `DELETE /dashboard/profile/security/account`, `GET /dashboard/profile/subscription` |
| Admin users | `/admin/users` | `features/admin/users/AdminUsersPage` | `GET /admin/users`, `PATCH /admin/users/:userId` |
| Admin subscriptions | `/admin/subscriptions` | `features/admin/subscriptions/AdminSubscriptionsPage` | `GET /admin/subscriptions/plans`, `PUT /admin/subscriptions/plans/:code` |

## Browser Workflow Contract

For each changed route, frontend ownership includes proving:

1. Route render and redirect behavior (`public`, `protected`, `admin`).
2. User-visible states for changed surface: `loading`, `empty`, `error`, `success`.
3. Responsive sanity for `desktop`, `tablet`, `mobile`.
4. Accessibility sanity for keyboard navigation and visible labels on touched controls.
5. Proof artifact update in a task file under `history/tasks/`.

## Verification Entry Points

- Full Web tests: `pnpm --filter web run test -- --run`
- Focused route tests: `pnpm --filter web run test -- <page.test.tsx paths>`
- Route map drift check:
  `Get-ChildItem -Path apps/web/src/app -Recurse -Filter page.tsx`
- Journey/action evidence checks:
  `pnpm run architecture:journey:index`
  `pnpm run architecture:journey:triage -- --query <route-or-action>`

## Current Evidence Status

- Route/component ownership map: `implemented and verified` (from code inspection and canonical route map parity).
- Route/view/client-API mapping: `implemented and verified` (from code inspection of `features/*/services` and `features/*/api` clients).
- Browser workflow ownership contract: `implemented but not verified` for full protected production flows (depends on auth-gated browser proof lanes).
- Action-level proof gaps remain in `docs/status/user-action-index.md` and `docs/status/function-journey-index.md`.

## 2026-05-26 Autonomous Drift Sweep (`LUC-193`)

- Route map drift check re-run against `apps/web/src/app/**/page.tsx`: `37`
  page entries discovered.
- Canonical route inventory parity against
  `docs/architecture/reference/dashboard-route-map.md`:
  `implemented and verified` for current route families (`public`, `dashboard`,
  `admin`, `offline`).
- No new route-family drift found in this sweep.
- Protected browser journey proof remains a separate gate and is still
  `implemented but not verified`.

## 2026-05-27 Autonomous Drift Sweep (`LUC-227`)

- Route map drift check re-run against `apps/web/src/app/**/page.tsx`: `37`
  page entries discovered.
- Canonical route inventory parity against
  `docs/architecture/reference/dashboard-route-map.md` remains
  `implemented and verified` for route families (`public`, `dashboard`,
  `admin`, `offline`).
- Idle-lane fail-closed posture rechecked in active state files; no passive
  `in_progress` policy drift detected in PM no-stall routing clauses.
- Protected browser journey proof remains a separate gate and is still
  `implemented but not verified`.

## Regression Reproduction Status

- User-visible regression reproduced in this lane: `missing` (no concrete frontend regression report attached to `LUC-38`).
- Exact blocker for protected browser proof: authenticated production context is required for protected/admin routes.
- Cross-lane blocker observed in current repo health: backtests API smoke failure remains backend-owned (`src/modules/backtests/backtests.e2e.test.ts`), owner lane: `backend/api`.
