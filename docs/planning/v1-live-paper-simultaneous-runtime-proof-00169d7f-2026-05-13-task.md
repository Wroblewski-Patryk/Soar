# V1 LIVE/PAPER Simultaneous Runtime Proof - 00169d7f - 2026-05-13

## Context

- Stage: analysis
- Operation mode: TESTER
- The production target release gate passed for deployed SHA `00169d7f`, but
  the user correctly challenged whether that proves simultaneous LIVE and PAPER
  bot behavior across the architecture.

## Goal

Prove or falsify the claim that an active LIVE bot and an active PAPER bot can
run at the same time while preserving Soar's canonical runtime architecture.

## Scope

- Selected-bot runtime reads.
- Dashboard bot selector and runtime surfaces.
- Runtime signal/decision parity between PAPER and LIVE where only the
  execution adapter differs.
- LIVE imported-position ownership and isolation from PAPER runtime decisions.
- PAPER runtime independence from LIVE exchange/import state.

## Implementation Plan

1. Map architecture invariants from `docs/architecture/03_domain-model.md`,
   `docs/architecture/04_runtime-contexts.md`, and
   `docs/architecture/reference/runtime-signal-merge-contract.md`.
2. Run focused existing API/Web tests for runtime scope, PAPER/LIVE parity,
   LIVE imported ownership, duplicate active LIVE overlap guards, and dashboard
   selected-bot switching.
3. Add missing regression coverage if no existing test proves simultaneous
   active LIVE + active PAPER isolation end to end.
4. Run relevant guardrails and update module confidence.

## Acceptance Criteria

- One active LIVE bot and one active PAPER bot remain separated by wallet,
  mode, symbol scope, and runtime session/read models.
- Dashboard surfaces expose both bots without cross-contaminating selected-bot
  runtime rows, wallet KPIs, strategy context, or signal context.
- PAPER decisions do not inherit LIVE imported positions.
- LIVE imported positions do not block or pollute PAPER decisions.
- PAPER/LIVE parity is preserved for strategy/merge decisions where only the
  execution adapter differs.

## Definition of Done

- Evidence is recorded with exact test commands and results.
- Any discovered mismatch is fixed or recorded as a blocker with a narrow next
  action.
- `.agents/state/module-confidence-ledger.md`, `.agents/state/known-issues.md`,
  `.agents/state/next-steps.md`, `.codex/context/TASK_BOARD.md`, and
  `.codex/context/PROJECT_STATE.md` reflect the proof result.

## Forbidden

- Do not claim broad simultaneous LIVE/PAPER correctness from the production
  target release gate alone.
- Do not place LIVE orders.
- Do not use production mutation for this proof without a separate explicit
  live-risk plan.
- Do not treat selected-bot UI rendering as proof of runtime decision
  isolation unless API/runtime evidence also exists.

## Result Report

- Pending.
