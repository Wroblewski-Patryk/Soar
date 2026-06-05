# LUC-2124 Local Protected Route Action Proof Matrix

## Status

- Result: **PASS**
- Environment: local-only
- Evidence date: 2026-06-05
- Generated at (UTC): 2026-06-05T08:55:45.806Z
- Raw JSON: `history\artifacts\luc-2124-local-protected-route-action-proof-matrix-2026-06-05.json`

## Covered Actions

| Action ID | Route | Result | Observed path | Notes |
| --- | --- | --- | --- | --- |
| SOAR-ACTION-VISIT-PAGE-WALLETS-LIST | `/dashboard/wallets/list` | PASS | `/auth/login` | unauthenticated protected wallets list route fails closed to login |
| SOAR-ACTION-VISIT-PAGE-WALLETS-ROOT | `/dashboard/wallets` | PASS | `/dashboard/wallets/list` | redirect reached expected wallets route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-WALLETS-LIST | `/dashboard/wallets/list` | PASS | `/dashboard/wallets/list` | route reached expected wallets route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-WALLET-CREATE | `/dashboard/wallets/create` | PASS | `/dashboard/wallets/create` | route reached expected wallets route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-WALLET-CREATE | `wallets list-page add action` | PASS | `/dashboard/wallets/create` | clicked create/add action (Create), expected create route |
| SOAR-ACTION-VISIT-PAGE-STRATEGIES-LIST | `/dashboard/strategies/list` | PASS | `/dashboard/strategies/list` | route reached expected strategies route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-STRATEGY-CREATE | `/dashboard/strategies/create` | PASS | `/dashboard/strategies/create` | route reached expected strategies route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-STRATEGY-CREATE | `strategies list-page add action` | PASS | `/dashboard/strategies/create` | clicked create/add action (Create), expected create route |

## Source And Test References

| Path | Status |
| --- | --- |
| `apps/web/src/app/dashboard/wallets/page.tsx` | present |
| `apps/web/src/app/dashboard/wallets/list/page.tsx` | present |
| `apps/web/src/app/dashboard/wallets/create/page.tsx` | present |
| `apps/web/src/app/dashboard/wallets/_components/WalletFormPageContent.tsx` | present |
| `apps/web/src/features/wallets/components/WalletsListTable.test.tsx` | present |
| `apps/web/src/features/wallets/components/WalletCreateEditForm.test.tsx` | present |
| `docs/modules/web-wallets.md` | present |
| `docs/modules/api-wallets.md` | present |
| `apps/web/src/app/dashboard/strategies/list/page.tsx` | present |
| `apps/web/src/app/dashboard/strategies/create/page.tsx` | present |
| `apps/web/src/features/strategies/components/StrategiesList.test.tsx` | present |
| `apps/web/src/features/strategies/components/StrategyForm.test.tsx` | present |
| `docs/modules/web-strategies.md` | present |
| `docs/modules/api-strategies.md` | present |

## Cluster References

| Cluster | Actions | API routes | Docs |
| --- | ---: | --- | --- |
| wallets | 3 | `GET /dashboard/wallets`<br>`POST /dashboard/wallets`<br>`GET /dashboard/wallets/metadata`<br>`GET /dashboard/wallets/:id`<br>`PUT /dashboard/wallets/:id`<br>`DELETE /dashboard/wallets/:id`<br>`POST /dashboard/wallets/:id/reset-paper` | `docs/modules/web-wallets.md`<br>`docs/modules/api-wallets.md` |
| strategies | 2 | `GET /dashboard/strategies`<br>`POST /dashboard/strategies`<br>`GET /dashboard/strategies/:id`<br>`PUT /dashboard/strategies/:id`<br>`DELETE /dashboard/strategies/:id`<br>`GET /dashboard/strategies/indicators`<br>`POST /dashboard/strategies/import`<br>`GET /dashboard/strategies/:id/export` | `docs/modules/web-strategies.md`<br>`docs/modules/api-strategies.md` |

## Existing Focused Tests

- wallets: `WalletsListTable.test.tsx`, `WalletCreateEditForm.test.tsx`, `wallet route page tests`, `apps/api/src/modules/wallets/wallets.e2e.test.ts`, `apps/api/src/modules/wallets/wallets.crud.e2e.test.ts`
- strategies: `app/dashboard/strategies/list/page.test.tsx`, `app/dashboard/strategies/create/page.test.tsx`, `StrategiesList.test.tsx`, `StrategyForm.test.tsx`, `apps/api/src/modules/strategies/strategies.e2e.test.ts`, `apps/api/src/modules/strategies/indicators/indicators.service.test.ts`

## Blockers

- none

## Safety Notes

- This proof uses a synthetic local cookie value only to exercise the Web middleware gate.
- It does not submit forms, does not create/update/delete wallets or strategies, does not call exchange APIs, and does not touch production accounts.
- Production protected proof remains outside this local harness and is still linked to [LUC-241](/LUC/issues/LUC-241) for approved auth/session access.
