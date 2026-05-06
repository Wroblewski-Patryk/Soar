# V1MONEY Paper-Safe Close Evidence

Date: 2026-05-07
Operator: Codex
Branch: `codex/v1-app-function-check`

## Purpose

Capture fresh local/paper-safe evidence for the remaining V1 money close rows
without creating live exposure. This evidence supports the next production or
paper-safe operator pass for TP, SL, TTP, TSL, and DCA-first close boundaries.

## Validation

Command:

```powershell
pnpm --filter api run test -- src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/engine/lifecycleCloseParity.golden.test.ts src/modules/engine/paperLifecycle.service.test.ts src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts --run --sequence.concurrent=false --pool forks --poolOptions.forks.singleFork=true
```

Result: PASS (`45/45`).

## Evidence Coverage

| V1 row | Evidence in this pass | Remaining V1 proof |
| --- | --- | --- |
| `BOT-LIVE-CLOSE-001` | Runtime automation close orchestration and close parity paths are covered locally; close calls carry bot, wallet, strategy, symbol, mode, and reason in focused tests. | Production or paper-safe close sample with redacted payload on current deployed SHA. |
| `BOT-LIVE-CLOSE-002` | DCA-first behavior is covered locally, including DCA execution before close protection and no forced close when only DCA fallback is active. | Paper-safe or operator-approved tiny live DCA-first boundary sample. |
| `BOT-LIVE-CLOSE-003` | DCA funds-exhausted telemetry emits `PRETRADE_BLOCKED` with effective strategy for imported strategy-null positions. | Production or paper-safe event evidence tying exhausted/unaffordable DCA to operator-visible telemetry. |
| `STRAT-BASIC-TP-001` | Lifecycle parity golden fixtures keep TP close reason consistent across BACKTEST, PAPER, and LIVE logic. | Paper-safe TP close sample or accepted production event. |
| `STRAT-BASIC-SL-001` | Lifecycle parity golden fixtures keep SL close reason consistent across BACKTEST, PAPER, and LIVE logic. | Paper-safe SL close sample or accepted production event. |
| `STRAT-ADV-TSL-001` | Dynamic stop operator truth e2e covers planned pre-arm trailing levels and imported LIVE TTP visibility from canonical truth; runtime automation covers advanced close mode guards. | Paper-safe or production TSL arm/close event plus dashboard display proof. |

## Interpretation

The local/paper-safe close foundation is green. This is not a live-money V1
closure by itself. It reduces the remaining work to controlled operator
evidence: run paper-safe close samples first, or use already-existing production
events, and only use tiny live mutations with explicit operator approval.

## Next Safe Slice

1. Create or reuse a paper bot/position that can trigger TP and SL without live
   exposure.
2. Capture runtime positions/trades payloads with close reason and initiator.
3. Capture dynamic stop visibility for TSL/TTP on the dashboard/runtime payload.
4. If any paper-safe sample fails, convert that exact row into a narrow fix.
