# LUC-1528 Local Protected Route Action Proof Matrix

## Status

- Result: **PASS**
- Environment: local-only
- Evidence date: 2026-07-20
- Generated at (UTC): 2026-07-20T21:36:05.281Z
- Raw JSON: `history\artifacts\luc-1528-local-protected-route-action-proof-matrix-2026-07-20.json`
- Dynamic fixtures: disabled
- Fixture API interception: enabled

## Covered Actions

| Action ID | Route | Result | Observed path | Notes |
| --- | --- | --- | --- | --- |
| SOAR-ACTION-VISIT-PAGE-DASHBOARD-HOME-UNAUTH | `/dashboard` | PASS | `/auth/login` | unauthenticated protected dashboard list route fails closed to login |
| SOAR-ACTION-VISIT-PAGE-DASHBOARD | `/dashboard` | PASS | `/dashboard` | route reached expected dashboard route with local cookie gate |

## Source And Test References

| Path | Status |
| --- | --- |
| `apps/web/src/app/dashboard/page.tsx` | present |
| `apps/web/src/app/dashboard/dashboard.a11y.smoke.test.tsx` | present |
| `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx` | present |
| `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` | present |
| `apps/web/src/features/dashboard-home/hooks/useHomeLiveWidgetsController.test.tsx` | present |
| `docs/modules/web-dashboard-home.md` | present |
| `docs/modules/api-bots.md` | present |

## Cluster References

| Cluster | Actions | API routes | Docs |
| --- | ---: | --- | --- |
| dashboard | 1 | `GET /dashboard/bots`<br>`GET /dashboard/bots/:id/runtime-graph`<br>`GET /dashboard/bots/:id/runtime-sessions`<br>`GET /dashboard/bots/:id/runtime-monitoring/aggregate`<br>`GET /dashboard/bots/:id/runtime-sessions/:sessionId/symbol-stats`<br>`GET /dashboard/bots/:id/runtime-sessions/:sessionId/positions`<br>`GET /dashboard/bots/:id/runtime-sessions/:sessionId/trades`<br>`GET /dashboard/market-stream/events` | `docs/modules/web-dashboard-home.md`<br>`docs/modules/api-bots.md` |

## Existing Focused Tests

- dashboard: `app/dashboard/dashboard.a11y.smoke.test.tsx`, `HomeLiveWidgets.test.tsx`, `useHomeLiveWidgetsController.test.tsx`, `apps/api/src/modules/bots/bots.e2e.test.ts`

## Blockers

- none

## Safety Notes

- This proof uses a synthetic local cookie value only to exercise the Web middleware gate.
- Dynamic fixture mode uses synthetic IDs only: `none`. Optional CDP API interception is available behind `--intercept-fixture-api`, but is disabled by default to keep the local proof non-hanging.
- It does not submit forms, does not create/update/delete wallets, strategies, markets, bots, backtests, profile settings, admin records, logs, or reports, does not call exchange APIs, and does not touch production accounts.
- Production protected proof remains outside this local harness and is still linked to [LUC-241](/LUC/issues/LUC-241) for approved auth/session access.
