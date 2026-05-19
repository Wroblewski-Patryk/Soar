# Documentation Drift Report

Updated: 2026-05-19

Purpose: record known gaps between documentation and implementation so future
agents can repair them deliberately. This is a living report, not a proof that
all behavior is fully verified.

## Current Drift Findings
| Finding | Evidence | Impact | Status / Repair |
|---|---|---|---|
| Exchange-scope wording was inconsistent across architecture docs. | `DEC-AUD-001` accepted Binance + Gate.io as current implementation scope, not Binance-only. `docs/architecture/01_overview-and-principles.md` and `docs/architecture/03_domain-model.md` now separate implementation scope from evidence-bound production/live readiness. | Future agents still need to avoid promoting production/live readiness without exact exchange, market type, operation, and proof. | Repaired for current source-of-truth; reopen only on renewed architecture/code drift or overbroad production claims. |
| Assistant architecture previously overstated hot-path runtime integration. | Assistant config/dry-run/orchestrator tests exist, but the audited runtime/backtest/PAPER/LIVE hot path does not call `orchestrateAssistantDecision`. `DEC-AUD-002` narrowed current truth to foundation/dry-run and deferred hot-path assistant orchestration. | Operators and agents may still overclaim runtime AI if future docs or plans skip the deferred-scope boundary. | Repaired for current source-of-truth; hot-path assistant orchestration requires separate implementation, persisted traces, fail-closed integration, and AI red-team proof before any runtime AI trading claim. |
| Exchange capability architecture targets an exact matrix. | 2026-05-19 `AUD-09` follow-up refactored `supportsExchangeExecutionCapability` and authenticated-read support to accept `(exchange, marketType, operation)`, with exchange boundary, wallet preview, and positions snapshot consumers passing market type. Non-exchange modules now import neutral `ExchangeOrderFill` / `ExchangeWalletCashflowHistoryEntry` aliases instead of CCXT-named connector types. Focused exchange/orders/wallet tests and API typecheck pass. | Future exchange/market-type expansion still needs to preserve this exact contract and neutral type boundary. | Repaired for `AUD-EXCH-002` and `AUD-EXCH-007`. |
| No central engineering system-map entrypoint existed. | `docs/README.md` existed, but no `docs/index.md`. | New agents had to jump between architecture, module, route, and planning docs manually. | Repaired in this task with `docs/index.md`. |
| Route map, module docs, and planning evidence were separate without one traceability matrix. | Existing `dashboard-route-map.md` and module docs were present. | Feature-to-route-to-data-to-test links could be missed. | Repaired with `docs/architecture/traceability-matrix.md`; endpoint-level API docs parity automation now also exists. |
| Pipeline registry was missing. | No `docs/pipelines/` folder before this task. | End-to-end system flows were hidden across architecture/planning/module docs. | Repaired with `docs/pipelines/index.md` and core pipeline docs. |
| Module deep dives were published but not connected to pipelines in one registry. | `module-doc-status-index.md` showed published docs. | Agents could know module docs exist without seeing system-flow usage. | Repaired with `docs/modules/index.md`. |
| Historical planning files can look active because of unchecked template boxes or superseded gates. | Large `docs/planning/` set with dated V1/V1EXCEL/V1FINAL files. | Agents may pick stale work if they skip active queue/context files. | Partially repaired by documenting the rule here; active queue sync remains a separate planning task. |
| Mobile implementation exists as `apps/mobile`, but V1 traceability is web/API-centric. | `apps/mobile` directory exists; no active module docs found in inspected docs. | Future mobile work could drift from API/web contracts. | GAP: create mobile module registry when mobile becomes active. |
| Endpoint-level docs parity was not generated from route files. | Route files are source; `scripts/auditApiEndpointDocsParity.mjs` now generates endpoint parity from Express routes and module docs. 2026-05-19 rerun reports `109` endpoints, `109` documented, `0` gaps. | Route additions can still drift from docs if the parity command is skipped. | Repaired; rerun `pnpm run docs:parity:endpoints:api` whenever API routes or module docs change. |
| Some web feature test mappings are not fully enumerated. | Static pass saw web feature files; exact tests were not exhaustively mapped in this iteration. | Traceability can point to module-level coverage instead of exact test files. | GAP: expand module deep dives during future feature edits. |

## Endpoint Drift Watchlist
Endpoint docs must be checked whenever these route files change:
- `apps/api/src/router/index.ts`
- `apps/api/src/router/dashboard.routes.ts`
- `apps/api/src/router/admin.routes.ts`
- `apps/api/src/modules/*/*.routes.ts`
- `apps/api/src/modules/*/**/*.routes.ts`
- `apps/web/src/app/**/page.tsx`

## Model Drift Watchlist
Data/model docs must be checked whenever these change:
- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/*/migration.sql`
- `docs/architecture/03_domain-model.md`
- module docs for the affected API module.

## Pipeline Drift Watchlist
Pipeline docs must be checked whenever these areas change:
- runtime signal loop, market stream, or engine services,
- order/position/trade lifecycle services,
- wallet/bot/strategy/market configuration contracts,
- backtest worker or parity kernel,
- deployment, readiness, Redis/Postgres, or smoke scripts.

## Unverified Areas
- `UNVERIFIED / NEEDS CONFIRMATION`: exact mobile scope.
- `UNVERIFIED / NEEDS CONFIRMATION`: exact web reports test file mapping.
- `UNVERIFIED / NEEDS CONFIRMATION`: whether every historical planning file is
  correctly classified as active, superseded, deferred, or archival.

## Next Recommended Repair Slices
1. Keep `AUD-19` fresh before any new production readiness claim.
2. Plan hot-path assistant orchestration only as a separate future AI/security
   slice with persisted traces, fail-closed integration, and red-team proof.
4. Add an automated route/docs parity check that compares `apps/web/src/app`
   and API route files against `dashboard-route-map.md` and
   `traceability-matrix.md`.
5. Continue planning-status cleanup so historical unchecked boxes cannot be
   mistaken for active work.
6. Expand each module deep dive with a normalized `Pipelines` and `Tests`
   table as the module is next touched.
