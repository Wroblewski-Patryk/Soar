# Engine And Trading Decision Flow Audit - 2026-05-19

## Scope

Audit ID: `AUD-11`

Purpose: verify the discrepancy risk between runtime decision-flow
architecture and the current engine implementation.

This audit inspected and validated:

- deterministic runtime signal merge
- runtime decision engine
- final-candle decision flow
- runtime signal loop and supervision
- pre-trade and pre-trade risk checks
- execution orchestration
- runtime execution dedupe
- exchange order guard
- PAPER/LIVE decision equivalence
- runtime market-data gateway and exchange-context boundary
- runtime position automation, DCA/protection fail-closed behavior, and
  continuity handling
- DB-backed PAPER runtime flow and owned imported-position execution paths

Assistant hot-path orchestration is not included in this `AUD-11` verdict; it
remains tracked by `AUD-20`.

## Result

Status: `current local / production mutation not exercised`

The audited local engine implementation is aligned with the documented runtime
decision-flow contracts for deterministic merge, lifecycle guardrails,
fail-closed behavior, idempotency, and PAPER/LIVE decision parity.

No production journey, LIVE mutation, exchange-side mutation, or existing
production data mutation was run.

## Validation Run

| Command / Proof | Result | Notes |
| --- | --- | --- |
| `corepack pnpm --filter api exec vitest run src/modules/engine/runtimeSignalMerge.test.ts src/modules/engine/runtimeSignalDecisionEngine.test.ts src/modules/engine/runtimeFinalCandleDecision.service.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimeExecutionDedupe.service.test.ts src/modules/engine/runtimeExchangeOrderGuard.service.test.ts src/modules/engine/preTrade.service.test.ts src/modules/engine/preTradeRisk.service.test.ts src/modules/engine/paperLiveDecisionEquivalence.test.ts src/modules/engine/runtimeSignalMarketDataGateway.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts src/modules/engine/runtimeSignalLoopSupervisor.test.ts src/modules/engine/runtimeScanLoop.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/engine/runtimePositionAutomation.defaultDeps.test.ts` | PASS | `15` files, `173` tests. Expected stderr appears in tests that intentionally simulate cache/DB/restart/automation failures to assert failover and fail-closed behavior. |
| `corepack pnpm run go-live:infra:up` | PASS | Started local Postgres/Redis for DB-backed engine e2e proof. |
| `corepack pnpm --filter api exec vitest run src/modules/engine/runtime-flow.e2e.test.ts src/modules/engine/runtime-orchestration-smoke.e2e.test.ts src/modules/engine/preTrade.e2e.test.ts src/modules/engine/executionOrchestrator.owned-import.e2e.test.ts` | PASS | `4` files, `13` tests. Covers PAPER runtime order/position lifecycle, runtime orchestration smoke, DB-backed pre-trade, and owned imported-position execution behavior. |
| `corepack pnpm run go-live:infra:down` | PASS | Local Postgres/Redis containers and network were removed after validation. |

## Architecture And Documentation Parity

Reviewed sources:

- `docs/architecture/05_strategy-signal-and-decision-flow.md`
- `docs/architecture/06_execution-lifecycle.md`
- `docs/architecture/reference/runtime-signal-merge-contract.md`
- `docs/modules/api-engine.md`
- `docs/analysis/reusable-audit-registry.md`
- `.agents/state/module-confidence-ledger.md`
- `.agents/state/requirements-verification-matrix.md`
- `.agents/state/risk-register.md`

No new architecture-code mismatch was found for `AUD-11`. The current local
engine evidence supports the documented deterministic/fail-closed runtime
decision-flow contracts for the audited scope.

## Findings

| ID | Severity | Finding | Evidence | Status |
| --- | --- | --- | --- | --- |
| AUD-ENG-001 | P0 | Runtime signal merge and decision flow are current locally. | Engine service pack passed `15` files / `173` tests. | closed |
| AUD-ENG-002 | P0 | Pre-trade, execution orchestration, dedupe, and exchange-order guard fail-closed behavior are current locally. | Engine service pack passed; DB-backed engine pack passed `4` files / `13` tests. | closed |
| AUD-ENG-003 | P0 | PAPER runtime lifecycle proof is current locally. | `runtime-flow.e2e.test.ts` passed inside DB-backed pack. | closed |
| AUD-ENG-004 | P1 | Production LIVE/exchange-side mutation is not covered by this audit. | No production or exchange-side mutation was run, by design. | explicit exclusion |
| AUD-ENG-005 | P1 | Assistant hot-path runtime integration remains separate and unresolved. | `AUD-20` found no audited BACKTEST/PAPER/LIVE hot-path assistant call site. | tracked by `AUD-20` |

## Safety Notes

- No production journey was run.
- No LIVE order, cancel, close, activation, or exchange-side mutation was run.
- No existing production data was mutated.
- Local Postgres/Redis were started only for DB-backed tests and then stopped.

## Current Reusable Audit State

`AUD-11` is current for local engine/trading decision-flow behavior.

Keep this audit open for:

1. refreshing engine proof after runtime/engine/exchange lifecycle changes;
2. production-safe runtime readback after future deployments;
3. any explicit safe plan for LIVE mutation proof;
4. the separate `AUD-20` assistant hot-path architecture decision.
