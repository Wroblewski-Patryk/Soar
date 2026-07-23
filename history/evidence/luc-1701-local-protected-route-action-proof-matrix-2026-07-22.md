# LUC-1701 Local Protected Route Action Proof Matrix

## Status

- Result: **PASS**
- Environment: local-only
- Evidence date: 2026-07-22
- Generated at (UTC): 2026-07-23T00:44:21.775Z
- Raw JSON: `history\artifacts\luc-1701-local-protected-route-action-proof-matrix-2026-07-22.json`
- Dynamic fixtures: disabled
- Fixture API interception: disabled

## Covered Actions

| Action ID | Route | Result | Observed path | Notes |
| --- | --- | --- | --- | --- |
| SOAR-ACTION-VISIT-PAGE-BACKTESTS-LIST | `/dashboard/backtests/list` | PASS | `/auth/login` | unauthenticated protected backtests list route fails closed to login |
| SOAR-ACTION-VISIT-PAGE-BACKTESTS-LIST | `/dashboard/backtests/list` | PASS | `/dashboard/backtests/list` | route reached expected backtests route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-BACKTEST-CREATE | `/dashboard/backtests/create` | PASS | `/dashboard/backtests/create` | route reached expected backtests route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-BACKTEST-DETAIL | `/dashboard/backtests/luc-2139-local-fixture-run` | PASS | `/dashboard/backtests/luc-2139-local-fixture-run` | route reached expected backtests route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-BACKTEST-CREATE | `backtests list-page add action` | PASS | `/dashboard/backtests/create` | clicked create/add action (Create), expected create route |
| SOAR-ACTION-VISIT-PAGE-REPORTS | `/dashboard/reports` | PASS | `/dashboard/reports` | route reached expected reports route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-LOGS | `/dashboard/logs` | PASS | `/dashboard/logs` | route reached expected logs route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-PROFILE | `/dashboard/profile` | PASS | `/dashboard/profile` | route reached expected profile route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-ADMIN-SUBSCRIPTIONS | `/admin/subscriptions` | PASS | `/admin/subscriptions` | route reached expected admin route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-ADMIN-USERS | `/admin/users` | PASS | `/admin/users` | route reached expected admin route with local cookie gate |

## Source And Test References

| Path | Status |
| --- | --- |
| `apps/web/src/app/dashboard/backtests/list/page.tsx` | present |
| `apps/web/src/app/dashboard/backtests/create/page.tsx` | present |
| `apps/web/src/app/dashboard/backtests/[id]/page.tsx` | present |
| `apps/web/src/features/backtest/components/BacktestsListView.tsx` | present |
| `apps/web/src/features/backtest/components/BacktestCreateForm.tsx` | present |
| `apps/web/src/features/backtest/components/BacktestRunDetails.tsx` | present |
| `apps/web/src/app/dashboard/backtests/list/page.test.tsx` | present |
| `apps/web/src/app/dashboard/backtests/[id]/page.test.tsx` | present |
| `docs/modules/web-backtest.md` | present |
| `docs/modules/api-backtests.md` | present |
| `apps/web/src/app/dashboard/reports/page.tsx` | present |
| `apps/web/src/app/dashboard/reports/page.test.tsx` | present |
| `apps/web/src/features/reports/components/PerformanceReportsView.tsx` | present |
| `apps/web/src/features/reports/components/PerformanceReportsView.test.tsx` | present |
| `docs/modules/web-reports.md` | present |
| `docs/modules/api-reports.md` | present |
| `apps/web/src/app/dashboard/logs/page.tsx` | present |
| `apps/web/src/app/dashboard/logs/page.test.tsx` | present |
| `apps/web/src/features/logs/components/AuditTrailView.tsx` | present |
| `apps/web/src/features/logs/components/AuditTrailView.test.tsx` | present |
| `docs/modules/web-logs.md` | present |
| `docs/modules/api-logs.md` | present |
| `apps/web/src/app/dashboard/profile/page.tsx` | present |
| `apps/web/src/app/dashboard/profile/page.test.tsx` | present |
| `apps/web/src/features/profile/pages/ProfilePage.tsx` | present |
| `apps/web/src/features/profile/components/ApiKeysList.test.tsx` | present |
| `apps/web/src/features/profile/components/ApiKeyForm.test.tsx` | present |
| `docs/modules/web-profile.md` | present |
| `docs/modules/api-profile.md` | present |
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
| backtests | 3 | `GET /dashboard/backtests`<br>`POST /dashboard/backtests`<br>`GET /dashboard/backtests/:id`<br>`DELETE /dashboard/backtests/:id`<br>`GET /dashboard/backtests/:id/trades`<br>`GET /dashboard/backtests/:id/report`<br>`GET /dashboard/backtests/:id/timeline` | `docs/modules/web-backtest.md`<br>`docs/modules/api-backtests.md` |
| reports | 1 | `GET /dashboard/reports/cross-mode-performance`<br>`GET /dashboard/backtests/runs`<br>`GET /dashboard/backtests/runs/:id/report` | `docs/modules/web-reports.md`<br>`docs/modules/api-reports.md` |
| logs | 1 | `GET /dashboard/logs` | `docs/modules/web-logs.md`<br>`docs/modules/api-logs.md` |
| profile | 1 | `GET /dashboard/profile/basic`<br>`PUT /dashboard/profile/basic`<br>`GET /dashboard/profile/apiKeys`<br>`POST /dashboard/profile/apiKeys`<br>`POST /dashboard/profile/apiKeys/:id/test`<br>`GET /dashboard/profile/subscription` | `docs/modules/web-profile.md`<br>`docs/modules/api-profile.md` |
| admin | 2 | `GET /admin/subscriptions/plans`<br>`PUT /admin/subscriptions/plans/:id`<br>`GET /admin/users`<br>`PUT /admin/users/:id` | `docs/modules/web-admin.md`<br>`docs/modules/api-admin.md`<br>`docs/modules/api-subscriptions.md` |

## Existing Focused Tests

- backtests: `app/dashboard/backtests/list/page.test.tsx`, `app/dashboard/backtests/[id]/page.test.tsx`, `BacktestCreateForm.test.tsx`, `BacktestsListView.test.tsx`, `apps/api/src/modules/backtests/backtests.e2e.test.ts`
- reports: `app/dashboard/reports/page.test.tsx`, `PerformanceReportsView.test.tsx`, `apps/api/src/modules/reports/reports.e2e.test.ts`
- logs: `app/dashboard/logs/page.test.tsx`, `AuditTrailView.test.tsx`, `apps/api/src/modules/logs/logs.e2e.test.ts`
- profile: `app/dashboard/profile/page.test.tsx`, `ApiKeysList.test.tsx`, `ApiKeyForm.test.tsx`, `apps/api/src/modules/profile/apiKeys.e2e.test.ts`
- admin: `AdminSubscriptionsPage tests`, `AdminUsersPage tests`, `apps/api/src/modules/admin/admin.e2e.test.ts`, `apps/api/src/modules/subscriptions/subscriptions.e2e.test.ts`

## Blockers

- none

## Safety Notes

- This proof uses a synthetic local cookie value only to exercise the Web middleware gate.
- Dynamic fixture mode uses synthetic IDs only: `none`. Optional CDP API interception is available behind `--intercept-fixture-api`, but is disabled by default to keep the local proof non-hanging.
- It does not submit forms, does not create/update/delete wallets, strategies, markets, bots, backtests, profile settings, admin records, logs, or reports, does not call exchange APIs, and does not touch production accounts.
- Production protected proof remains outside this local harness and is still linked to [LUC-241](/LUC/issues/LUC-241) for approved auth/session access.
