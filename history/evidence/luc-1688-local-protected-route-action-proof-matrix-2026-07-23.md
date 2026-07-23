# LUC-1688 Local Protected Route Action Proof Matrix

## Status

- Result: **FAIL**
- Environment: local-only
- Evidence date: 2026-07-23
- Generated at (UTC): 2026-07-23T00:22:12.247Z
- Raw JSON: `history\artifacts\luc-1688-local-protected-route-action-proof-matrix-2026-07-23.json`
- Dynamic fixtures: disabled
- Fixture API interception: enabled

## Covered Actions

| Action ID | Route | Result | Observed path | Notes |
| --- | --- | --- | --- | --- |
| SOAR-ACTION-VISIT-PAGE-MARKETS-LIST | `/dashboard/markets/list` | PASS | `/auth/login` | unauthenticated protected markets list route fails closed to login |
| SOAR-ACTION-VISIT-PAGE-MARKETS-LIST | `/dashboard/markets/list` | PASS | `/dashboard/markets/list` | route reached expected markets route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-MARKET-CREATE | `/dashboard/markets/create` | PASS | `/dashboard/markets/create` | route reached expected markets route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-MARKET-CREATE | `markets list-page add action` | FAIL | `/dashboard/markets/list` | create/add button not found |

## Source And Test References

| Path | Status |
| --- | --- |
| `apps/web/src/app/dashboard/markets/list/page.tsx` | present |
| `apps/web/src/app/dashboard/markets/create/page.tsx` | present |
| `apps/web/src/app/dashboard/markets/[id]/edit/page.tsx` | present |
| `apps/web/src/features/markets/components/MarketUniversesTable.tsx` | present |
| `apps/web/src/features/markets/components/MarketUniverseForm.tsx` | present |
| `apps/web/src/features/markets/components/MarketUniverseForm.test.tsx` | present |
| `apps/web/src/app/dashboard/markets/list/page.test.tsx` | present |
| `apps/web/src/app/dashboard/markets/[id]/edit/page.test.tsx` | present |
| `docs/modules/web-markets.md` | present |
| `docs/modules/api-markets.md` | present |

## Cluster References

| Cluster | Actions | API routes | Docs |
| --- | ---: | --- | --- |
| markets | 2 | `GET /dashboard/markets`<br>`POST /dashboard/markets`<br>`GET /dashboard/markets/:id`<br>`PUT /dashboard/markets/:id`<br>`DELETE /dashboard/markets/:id`<br>`GET /dashboard/markets/catalog` | `docs/modules/web-markets.md`<br>`docs/modules/api-markets.md` |

## Existing Focused Tests

- markets: `app/dashboard/markets/list/page.test.tsx`, `app/dashboard/markets/[id]/edit/page.test.tsx`, `MarketUniverseForm.test.tsx`, `MarketUniversesTable.test.tsx`, `apps/api/src/modules/markets/markets.e2e.test.ts`, `apps/api/src/modules/exchanges/marketCatalog.service.test.ts`

## Blockers

- none

## Safety Notes

- This proof uses a synthetic local cookie value only to exercise the Web middleware gate.
- Dynamic fixture mode uses synthetic IDs only: `none`. Optional CDP API interception is available behind `--intercept-fixture-api`, but is disabled by default to keep the local proof non-hanging.
- It does not submit forms, does not create/update/delete wallets, strategies, markets, bots, backtests, profile settings, admin records, logs, or reports, does not call exchange APIs, and does not touch production accounts.
- Production protected proof remains outside this local harness and is still linked to [LUC-241](/LUC/issues/LUC-241) for approved auth/session access.
