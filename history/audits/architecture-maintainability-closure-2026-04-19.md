# Architecture Maintainability Closure Snapshot (2026-04-19)

Owner: ARC-E (`ARC-19..ARC-20`)  
Baseline reference: `history/audits/architecture-maintainability-audit-2026-04-18.md`

## Scope
- Finalize architecture-maintainability remediation wave closure evidence after ARC-A..ARC-D implementation.
- Capture measurable hotspot delta and remaining residual risks.
- Lock guardrail posture for post-ARC waves (`POS`, `OPV`, `UXR-H`).

## What Closed In ARC-C/E
- Shared runtime/backtest indicator projection/evaluation kernel extracted to:
  - `apps/api/src/modules/engine/strategyIndicatorKernel.ts`
- Runtime decision and strategy evaluator rewired to shared kernel:
  - `apps/api/src/modules/engine/runtimeSignalDecisionEngine.ts`
  - `apps/api/src/modules/engine/strategySignalEvaluator.ts`
- Backtest indicator timeline projection rewired to shared kernel:
  - `apps/api/src/modules/backtests/backtests.service.ts`
- Interleaved backtest portfolio simulation moved out of backtests facade:
  - `apps/api/src/modules/backtests/backtestPortfolioSimulation.service.ts`
- Runtime-vs-backtest kernel parity regression lock added:
  - `apps/api/src/modules/backtests/backtestRuntimeKernelParity.test.ts`
- Guardrails tightened:
  - `scripts/repoGuardrails.mjs`
  - source byte budgets: `api 88_000`, `web 95_000`
  - production-only source line budgets: `api 1_700`, `web 2_200`

## Quantitative Delta

### Baseline (2026-04-18 audit)
- Production files >500 lines: `30`
- Production files >700 lines: `16`
- Production files >1000 lines: `7`

### Current (2026-04-19 post-ARC closure)
- Production files >500 lines: `28`
- Production files >700 lines: `13`
- Production files >1000 lines: `4`

### Key file-size movement
- `apps/api/src/modules/backtests/backtests.service.ts`
  - from audit: `1482` lines
  - current: `854` lines
- `apps/api/src/modules/engine/runtimeSignalDecisionEngine.ts`
  - from audit: `937` lines
  - current: `710` lines

## Residual Risks (Open)
- `P1` UI monolith pressure remains in:
  - `apps/web/src/features/backtest/components/BacktestRunDetails.tsx` (`2037` lines)
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx` (`1219` lines)
  - `apps/web/src/features/bots/components/BotsManagement.tsx` (`1080` lines)
- `P2` test-surface concentration remains high (large e2e/component suites still needed for confidence packs).
- `P2` exchange-capability defaults and lifecycle parity still require POS wave closure (`POS-36..POS-42`).

## Guardrail Posture After ARC
- New budgets are intentionally tighter but currently green for repository head.
- Line-budget enforcement targets production files only (test files excluded) to avoid false positives on large regression packs while still preventing production monolith creep.

## Validation Evidence
- `pnpm --filter api run typecheck` => PASS
- Focused ARC-C pack:
  - `pnpm --filter api run test -- src/modules/engine/strategySignalEvaluator.test.ts src/modules/engine/runtimeSignalDecisionEngine.test.ts src/modules/backtests/backtestIndicatorTimelineSeries.test.ts src/modules/backtests/backtests.contract-remediation.test.ts src/modules/backtests/backtestRuntimeKernelParity.test.ts --run` => `57/57 PASS`
- `pnpm --filter api run build` => PASS
- `pnpm run quality:guardrails` => PASS

## Next Active Queue
- `POS-36` (`docs/planning/mvp-next-commits.md` NOW)
