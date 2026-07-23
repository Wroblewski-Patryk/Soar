# LUC-1694-retry Local Protected Route Action Proof Matrix

## Status

- Result: **PASS**
- Environment: local-only
- Evidence date: 2026-07-23
- Generated at (UTC): 2026-07-23T00:32:08.949Z
- Raw JSON: `history\artifacts\luc-1694-retry-local-protected-route-action-proof-matrix-2026-07-23.json`
- Dynamic fixtures: disabled
- Fixture API interception: enabled

## Covered Actions

| Action ID | Route | Result | Observed path | Notes |
| --- | --- | --- | --- | --- |
| SOAR-ACTION-VISIT-PAGE-REPORTS | `/dashboard/reports` | PASS | `/auth/login` | unauthenticated protected reports list route fails closed to login |
| SOAR-ACTION-VISIT-PAGE-REPORTS | `/dashboard/reports` | PASS | `/dashboard/reports` | route reached expected reports route with local cookie gate |

## Source And Test References

| Path | Status |
| --- | --- |
| `apps/web/src/app/dashboard/reports/page.tsx` | present |
| `apps/web/src/app/dashboard/reports/page.test.tsx` | present |
| `apps/web/src/features/reports/components/PerformanceReportsView.tsx` | present |
| `apps/web/src/features/reports/components/PerformanceReportsView.test.tsx` | present |
| `docs/modules/web-reports.md` | present |
| `docs/modules/api-reports.md` | present |

## Cluster References

| Cluster | Actions | API routes | Docs |
| --- | ---: | --- | --- |
| reports | 1 | `GET /dashboard/reports/cross-mode-performance`<br>`GET /dashboard/backtests/runs`<br>`GET /dashboard/backtests/runs/:id/report` | `docs/modules/web-reports.md`<br>`docs/modules/api-reports.md` |

## Existing Focused Tests

- reports: `app/dashboard/reports/page.test.tsx`, `PerformanceReportsView.test.tsx`, `apps/api/src/modules/reports/reports.e2e.test.ts`

## Blockers

- none

## Safety Notes

- This proof uses a synthetic local cookie value only to exercise the Web middleware gate.
- Dynamic fixture mode uses synthetic IDs only: `none`. Optional CDP API interception is available behind `--intercept-fixture-api`, but is disabled by default to keep the local proof non-hanging.
- It does not submit forms, does not create/update/delete wallets, strategies, markets, bots, backtests, profile settings, admin records, logs, or reports, does not call exchange APIs, and does not touch production accounts.
- Production protected proof remains outside this local harness and is still linked to [LUC-241](/LUC/issues/LUC-241) for approved auth/session access.
