# LUC-2200 Money-Facing Runtime Residual Missing-Test Families

## Header
- ID: LUC-2200
- Title: Audit money-facing runtime residual missing-test families
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Integration Trading Engineer
- Depends on: LUC-241 for protected/authenticated production proof
- Priority: P1
- Module Confidence Rows: SOAR-ENGINE-001; SOAR-EXCHANGE-ADAPTER-001; SOAR-ORDERS-001; SOAR-MANUAL-ORDERS-001; SOAR-POSITIONS-001
- Mission ID: LUC-2200-MONEY-FACING-RUNTIME-RESIDUAL-MISSING-TEST-FAMILIES-2026-06-05
- Mission Status: VERIFIED_CLASSIFICATION

## Context
The scoped Paperclip wake assigned LUC-2200 to Integration Trading Engineer.
The wake had no pending comments and `fallbackFetchNeeded=false`; checkout was
already claimed by the harness and was not repeated.

The lane follows up LUC-2175 and LUC-2187 by narrowing the missing-test audit
to money-facing runtime, order, position, and exchange chains. Scope stayed
local/read-only. No live order, exchange mutation, protected production smoke,
secret readback, deploy, restart, rollback, or database mutation was performed.

## Goal
Identify whether the current architecture-awareness missing-test signal still
contains real uncovered money-facing runtime helper behavior, or whether the
remaining rows are existing coverage relation gaps / protected proof blockers.

## Scope
- `docs/architecture/traceability-matrix.md`
- `docs/architecture/chains/CHAIN-ENGINE-RUNTIME-CORE.md`
- `docs/architecture/chains/CHAIN-EXCHANGE-ADAPTER-DEEP.md`
- `docs/architecture/chains/CHAIN-MANUAL-ORDER-DEEP.md`
- `docs/architecture/chains/CHAIN-POSITIONS-CORE.md`
- `docs/status/architecture-awareness-report.md`
- `docs/graphs/architecture-awareness.json`
- `docs/graphs/architecture-graph.json`

## Row-Level Findings
Current architecture-awareness report generated
`2026-06-05T12:00:45.591Z` reports `898` actionable implementation entities
without inferred tests. Filtering the four requested money-facing chains to API
runtime/order/position/exchange implementation paths found `43` chain-file rows
with `228` function/entity-level missing direct `tests` links.

These are direct relation gaps at function granularity, not confirmed missing
local behavior, because every filtered implementation file has a curated graph
test relation to an existing focused or aggregate test file.

| Family | Chain rows | Missing direct links | Status | Existing proof relation / blocker |
| --- | ---: | ---: | --- | --- |
| Engine runtime core helpers | 14 | 54 | existing coverage relation gap | Curated graph maps runtime guard, dedupe, final candle, order/position lifetime, telemetry, simulator, paper runtime, runtime automation, and pre-trade risk files to engine/runtime tests. Focused subset below passed for pre-trade risk. |
| Exchange adapter helpers | 19 | 72 | existing coverage relation gap | Curated graph maps capability, auth-read, adapter boundary, live-order adapter, fee reconciliation, symbol rules, public read/market data, connector factory, CCXT futures connector, API-key probe, market catalog, positions/orders crossover, and runtime position command files to focused exchange/profile/bots/orders tests. |
| Manual order/order lifecycle helpers | 9 | 74 | existing coverage relation gap | Curated graph maps orders service/controller/manual context/quantity rules/pre-trade/execution orchestrator/lifecycle/exchange events to order service, order-position e2e, quantity rules, exchange-event, and manual-context tests. Focused pure subset below passed for fill math and exchange-event helpers. DB-backed lifecycle proof remains separate. |
| Positions reconciliation/manual update helpers | 8 | 48 | existing coverage relation gap | Curated graph maps positions controller/service/snapshot normalization/live reconciliation/runtime automation to positions service, snapshot, takeover/orphan, live reconciliation, and runtime DCA/PnL tests. Full DB-backed reconciliation proof remains blocked locally by Postgres per LUC-2187; protected/live readback remains LUC-241 gated. |
| Protected production/live proof collectors | n/a | n/a | blocked by protected/live gate | Any production-authenticated readback or LIVE mutation proof is outside this issue and remains blocked by LUC-241 plus Security/Ops/QA approval gates. |
| Confirmed missing local pure-function test | 0 | 0 | verified absent | This audit did not isolate a new uncovered pure helper after LUC-2187 added order fill math coverage. |

## Representative Highest-Signal Rows
The largest direct-relation rows are:

| Chain | Path | Missing direct links | Existing test relation | Finding |
| --- | --- | ---: | --- | --- |
| CHAIN-ENGINE-RUNTIME-CORE | `apps/api/src/modules/engine/runtimeExecutionDedupe.service.ts` | 15 | `runtimeExchangeOrderGuard.service.test.ts` in curated graph | Existing coverage relation gap; no new focused test added in this lane. |
| CHAIN-MANUAL-ORDER-DEEP / CHAIN-EXCHANGE-ADAPTER-DEEP | `apps/api/src/modules/orders/orders.service.ts` | 15 | `orders.manualContext.contractSize.service.test.ts` plus broader order service/e2e chain tests | Existing coverage relation gap; DB-backed lifecycle proof remains separate. |
| CHAIN-MANUAL-ORDER-DEEP | `apps/api/src/modules/orders/orders.exchangeEvents.service.ts` | 11 | `orders.exchangeEvents.service.test.ts` plus helper/fee/account tests | Existing coverage relation gap; pure helper subset passed. |
| CHAIN-MANUAL-ORDER-DEEP | `apps/api/src/modules/orders/orders.quantityRules.ts` | 11 | `orders.quantityRules.test.ts`; `orders.manualContext.contractSize.service.test.ts` | Existing coverage relation gap; focused quantity rule test exists. |
| CHAIN-POSITIONS-CORE | `apps/api/src/modules/positions/positions.controller.ts` | 9 | positions service/snapshot/takeover tests | Existing coverage relation gap. |
| CHAIN-POSITIONS-CORE / CHAIN-EXCHANGE-ADAPTER-DEEP | `apps/api/src/modules/positions/positions.service.ts` | 9 | positions service/snapshot/takeover tests | Existing coverage relation gap. |
| CHAIN-EXCHANGE-ADAPTER-DEEP | `apps/api/src/modules/exchange/exchangeSymbolRules.service.ts` | 8 | `exchangeSymbolRules.service.test.ts` | Existing coverage relation gap; focused subset passed. |
| CHAIN-EXCHANGE-ADAPTER-DEEP | `apps/api/src/modules/exchange/exchangeMarketCatalog.service.ts` | 7 | `exchangeMarketCatalog.service.test.ts` | Existing coverage relation gap. |
| CHAIN-ENGINE-RUNTIME-CORE / CHAIN-POSITIONS-CORE | `apps/api/src/modules/engine/runtimePositionAutomation.helpers.ts` | 6 | `runtimePositionAutomation.exchangePnl.test.ts` | Existing coverage relation gap. |
| CHAIN-POSITIONS-CORE | `apps/api/src/modules/positions/livePositionReconciliation.service.ts` | 6 | `livePositionReconciliation.service.test.ts` | Existing coverage relation gap; full default-deps rerun remains local Postgres blocked per LUC-2187. |

## Validation Evidence
- Static graph readback:
  - Parsed `docs/graphs/architecture-awareness.json` and `docs/graphs/architecture-graph.json`.
  - Filtered chain nodes from `CHAIN-ENGINE-RUNTIME-CORE`, `CHAIN-EXCHANGE-ADAPTER-DEEP`, `CHAIN-MANUAL-ORDER-DEEP`, and `CHAIN-POSITIONS-CORE`.
  - Result: `43` API implementation file rows, `228` function/entity-level missing direct `tests` links, all with curated graph test relations.
- Focused local DB-free representative proof:
  - `pnpm --filter api exec vitest run src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts src/modules/exchange/exchangeSymbolRules.service.test.ts src/modules/orders/positionFillMath.test.ts src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/engine/preTradeRisk.service.test.ts --pool=forks --maxWorkers=1 --minWorkers=1 --testTimeout=30000`
  - Result: PASS, `6` files / `45` tests.
- Broad representative command attempt:
  - A larger 18-file DB-free/adapter pack timed out after about 124 seconds before producing a final report. It is not counted as proof.
- Process cleanup/readback:
  - `Get-CimInstance Win32_Process -Filter "name = 'node.exe'" | Where-Object { $_.CommandLine -match 'vitest|pnpm|tsx' }`
  - Result: no lingering `vitest` process from this lane; remaining matching Node processes were existing Paperclip dev/control processes.

## Architecture Evidence
- Architecture source reviewed: traceability matrix, requested chain docs, architecture-awareness report, architecture graph JSON, architecture awareness JSON, LUC-2175 task packet, LUC-2187 task packet, LUC-2145 readback matrix.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none required for this audit; future graph work may add more function-level test relations to reduce scanner noise.

## Security / Privacy Evidence
- Data classification: local source metadata and local test output only.
- Trust boundaries: protected production proof and exchange account/API-key readback remain outside scope.
- Secret handling: no secret values, cookies, tokens, API keys, exchange credentials, account identifiers, or production payloads were read or stored.
- Fail-closed behavior: no LIVE mutation path was executed; protected/live proof remains gated by LUC-241 and explicit approvals.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Runtime/database mutation: none.
- Rollback note: not applicable.

## Result Report
- Task summary: audited the requested money-facing runtime chains and found residual direct test-link gaps, not a new confirmed missing local pure-function test family.
- Files changed:
  - `history/tasks/luc-2200-money-facing-runtime-residual-missing-test-families-2026-06-05-task.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.agents/state/system-health.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested: focused local DB-free representative API test pack passed (`6` files / `45` tests); graph readback classified `43` rows / `228` direct missing links.
- What is incomplete: DB-backed positions/order lifecycle proof remains local-Postgres dependent; production/protected/live proof remains LUC-241 gated.
- Commit: not committed because the workspace already contains broad mixed dirty state from prior/concurrent lanes.
- Push status: not needed.
- Deploy impact: none.
