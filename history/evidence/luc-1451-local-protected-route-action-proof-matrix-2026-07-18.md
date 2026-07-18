# LUC-1451 Local Protected Route Action Proof Matrix

## Status

- Result: **PASS**
- Environment: local-only
- Evidence date: 2026-07-18
- Generated at (UTC): 2026-07-18T22:07:51.400Z
- Raw JSON: `history\artifacts\luc-1451-local-protected-route-action-proof-matrix-2026-07-18.json`
- Dynamic fixtures: enabled
- Fixture API interception: enabled

## Covered Actions

| Action ID | Route | Result | Observed path | Notes |
| --- | --- | --- | --- | --- |
| SOAR-ACTION-VISIT-PAGE-BACKTESTS-LIST | `/dashboard/backtests/list` | PASS | `/auth/login` | unauthenticated protected backtests list route fails closed to login |
| SOAR-ACTION-VISIT-PAGE-BACKTESTS-LIST | `/dashboard/backtests/list` | PASS | `/dashboard/backtests/list` | route reached expected backtests route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-BACKTEST-CREATE | `/dashboard/backtests/create` | PASS | `/dashboard/backtests/create` | route reached expected backtests route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-BACKTEST-DETAIL | `/dashboard/backtests/luc-2139-local-fixture-run` | PASS | `/dashboard/backtests/luc-2139-local-fixture-run` | route reached expected backtests route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-BACKTEST-DETAIL | `/dashboard/backtests/luc-2188-backtest-run` | PASS | `/dashboard/backtests/luc-2188-backtest-run` | route reached expected backtests route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-BACKTEST-CREATE | `backtests list-page add action` | PASS | `/dashboard/backtests/create` | clicked create/add action (Create), expected create route |

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

## Cluster References

| Cluster | Actions | API routes | Docs |
| --- | ---: | --- | --- |
| backtests | 4 | `GET /dashboard/backtests`<br>`POST /dashboard/backtests`<br>`GET /dashboard/backtests/:id`<br>`DELETE /dashboard/backtests/:id`<br>`GET /dashboard/backtests/:id/trades`<br>`GET /dashboard/backtests/:id/report`<br>`GET /dashboard/backtests/:id/timeline` | `docs/modules/web-backtest.md`<br>`docs/modules/api-backtests.md` |

## Existing Focused Tests

- backtests: `app/dashboard/backtests/list/page.test.tsx`, `app/dashboard/backtests/[id]/page.test.tsx`, `BacktestCreateForm.test.tsx`, `BacktestsListView.test.tsx`, `apps/api/src/modules/backtests/backtests.e2e.test.ts`

## Blockers

- none

## Safety Notes

- This proof uses a synthetic local cookie value only to exercise the Web middleware gate.
- Dynamic fixture mode uses synthetic IDs only: `luc-2188-backtest-run`. Optional CDP API interception is available behind `--intercept-fixture-api`, but is disabled by default to keep the local proof non-hanging.
- It does not submit forms, does not create/update/delete wallets, strategies, markets, bots, backtests, profile settings, admin records, logs, or reports, does not call exchange APIs, and does not touch production accounts.
- Production protected proof remains outside this local harness and is still linked to [LUC-241](/LUC/issues/LUC-241) for approved auth/session access.
