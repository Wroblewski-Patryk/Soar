# Task

## Header
- ID: V1SIG-A
- Title: Restore deterministic runtime signal delivery and truthful operator diagnostics for PAPER and LIVE bots
- Status: IN_PROGRESS
- Owner: Planning Agent
- Depends on: V1 approved baseline, XLIFE-A, SAFEV1-A, REVIEW-D
- Priority: P0

## Context
Production verification on 2026-04-23 confirmed that the currently active PAPER
and LIVE bots for the same owner are heartbeat-healthy but are not producing
persisted runtime trading signals, positions, or trades.

Observed production facts:
- `PAPER` bot `859fd4f7-cbb1-4f8e-b52a-5d119442e265` is `RUNNING`, but
  aggregate runtime summary reports `totalSignals=0`, `openPositionCount=0`,
  `positionsTotal=0`, and `tradesTotal=0`.
- `LIVE` bot `7204173d-af68-494a-bca8-95d3c1ba8ef1` is `RUNNING`, but aggregate
  runtime summary reports `totalSignals=0`, `openPositionCount=0`,
  `positionsTotal=0`, and `tradesTotal=0`.
- Symbol rows in runtime monitoring currently surface
  `lastSignalContextSource='configured_fallback'` and strategy-condition
  snapshots even when no runtime `Signal` row was emitted. This makes operator
  UI look like "signals exist" when canonical runtime truth says no signal was
  accepted.
- Recent production runtime snapshots for both bots show repeated
  `No trade decision after strategy merge` / `No votes` outcomes on tracked
  symbols rather than accepted `LONG`/`SHORT` decisions.
- The PAPER runtime capital snapshot also shows suspiciously inflated
  `referenceBalance` compared with wallet `paperInitialBalance`, which suggests
  a secondary reset/accounting parity issue that can undermine operator trust
  even if it is not the primary cause of missing entries.

This must be resolved inside the approved architecture:
- `PAPER` and `LIVE` keep one canonical domain lifecycle.
- Runtime must stay fail-closed.
- Operator surfaces must distinguish configured strategy context from actual
  runtime trading signals.

## Goal
Restore a truthful and debuggable V1 runtime path where:
- accepted runtime `LONG`/`SHORT` decisions reliably become persisted signals
  and then positions/trades in `PAPER` and `LIVE` when the shared contract
  allows it,
- blocked or absent entries expose explicit operator-readable reasons instead
  of looking like silent inactivity,
- runtime monitoring no longer conflates configured strategy context with
  emitted signal truth,
- wallet reset and runtime capital snapshots stay consistent with the canonical
  `PAPER` lifecycle contract.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic

## Definition of Done
- [ ] Production-backed root cause is narrowed to explicit runtime categories
      (for example `NO_ROUTE`, `NO_VOTES`, `PRETRADE_BLOCKED`,
      `ORCHESTRATION_IGNORED`, capital/reset drift) with reproducible evidence.
- [ ] Runtime telemetry and operator read models expose truthful distinction
      between configured fallback context and actual emitted runtime signal
      truth.
- [ ] One shared V1 execution path is validated end-to-end for backtest ->
      paper -> live decision parity, with approved adapter differences only.
- [ ] PAPER reset and runtime capital snapshots are verified/fixed so wallet
      reset checkpoints do not leave misleading capital truth for active bots.
- [ ] Canonical queue/context/docs and high-risk validation evidence are
      synchronized with the implemented recovery path.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests:
  - focused API unit/integration coverage for runtime signal loop, final-candle
    decision flow, symbol-stats read model, runtime monitoring aggregate, and
    wallet reset capital context
  - targeted production-scenario regression packs for `PAPER` and `LIVE`
    runtime signal delivery
- Manual checks:
  - verify production/stage bot runtime aggregate before and after fixes
  - verify runtime UI differentiates fallback strategy context from accepted
    signals
- Screenshots/logs:
  - production API snapshots for bot runtime aggregate/session evidence
  - explicit runtime event samples for blocked/no-trade states
- High-risk checks:
  - `pnpm --filter api run test -- --run`
  - `pnpm --filter api run typecheck`
  - `pnpm run quality:guardrails`
  - targeted go-live smoke if runtime/deployment behavior changes

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/05_strategy-signal-and-decision-flow.md`
  - `docs/architecture/07_modes-parity-and-data.md`
  - `docs/architecture/reference/live-paper-runtime-safety-contract.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
- Follow-up architecture doc updates:
  - update architecture/module docs only if implemented behavior or operator
    truth contracts change

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: runtime monitoring and dashboard bot operator
  surfaces already implemented in repository
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks: explicit labels/status text for fallback-context versus
  accepted-signal truth
- Parity evidence: web operator view must match canonical API/runtime truth

## Review Checklist (mandatory)
- [ ] Architecture alignment confirmed.
- [ ] Existing systems were reused where applicable.
- [ ] No workaround paths were introduced.
- [ ] No logic duplication was introduced.
- [ ] Definition of Done evidence is attached.
- [ ] Relevant validations were run.
- [ ] Docs or context were updated if repository truth changed.
- [ ] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
- Planned execution slices:
  - `V1SIG-01 diagnose(prod-runtime-truth)`: capture focused production/stage
    evidence and reproduce the missing-entry path locally with the same
    topology assumptions.
  - `V1SIG-02 refactor(api-runtime-events)`: make no-trade and route/block
    reasons first-class runtime telemetry instead of silent absences where
    architecture allows explicit diagnostics.
  - `V1SIG-03 fix(api-operator-signal-truth)`: separate configured fallback
    context from emitted runtime signal truth in symbol stats / monitoring
    aggregate read models and web consumers.
  - `V1SIG-04 audit(api-paper-reset-capital)`: verify/fix paper reset and
    runtime capital snapshot parity under wallet-scoped bots.
  - `V1SIG-05 qa(runtime-parity)`: run focused backtest/paper/live runtime
    parity and production-readiness validation, then sync canonical docs.
- Current production facts do not support the hypothesis that the main failure
  is the paper execution adapter itself. The stronger hypothesis is that
  runtime never reaches accepted signal state for the active bots, while the UI
  currently overstates signal-like context through fallback strategy snapshots.
