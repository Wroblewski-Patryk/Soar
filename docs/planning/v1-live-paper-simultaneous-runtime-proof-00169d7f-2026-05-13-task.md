# V1 LIVE/PAPER Simultaneous Runtime Proof - 00169d7f - 2026-05-13

## Context

- Stage: verification
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

- 2026-05-14 refresh after production deploy `457bce05`:
  - production build-info passed for
    `457bce05338310c198c03a973395a9176f298dc1`;
  - focused API LIVE/PAPER isolation pack passed (`5` files, `25/25` tests);
  - focused Web Dashboard selected-bot/runtime pack passed (`2` files,
    `24/24` tests);
  - controlled no-order-guard production LIVE proof activated the existing
    Binance LIVE bot only for the observation window, verified `LIVEIMPORT-03`
    for `TRXUSDT`, collected a simultaneous read-only runtime snapshot where
    the Binance LIVE bot and both Binance PAPER bots were RUNNING, and then
    deactivated the LIVE bot;
  - post-cleanup readback confirmed the Binance LIVE bot was inactive again
    while both PAPER bots remained healthy;
  - evidence:
    `docs/planning/v1-live-paper-simultaneous-runtime-proof-refresh-457bce05-2026-05-14-task.md`,
    `docs/operations/liveimport-03-prod-readback-live-paper-457bce05-2026-05-14.json`,
    `docs/operations/prod-live-paper-simultaneous-runtime-readback-457bce05-2026-05-14.md`,
    and
    `docs/operations/prod-live-paper-post-cleanup-readback-457bce05-2026-05-14.md`.
  - Status is verified for the current production non-Gate.io simultaneous
    LIVE/PAPER runtime scope. The requested 2x PAPER + 2x LIVE production
    shape remains unavailable because production has no visible second
    LIVE/Gate.io bot for this user-deferred slice.

- Checkpoint 1 implemented and verified a focused architecture fix and
  regression coverage:
  - `runtimeMarketDataFallback.service.ts` no longer routes non-Binance candle
    and ticker fallback through Binance public REST. Gate.io and other
    supported exchanges now use the exchange-owned public market-data boundary.
  - Binance-only derivative fallbacks remain Binance-only and return empty
    degraded data for Gate.io instead of mixing exchange domains.
  - active LIVE symbol-overlap validation is now venue-scoped. A Binance LIVE
    bot and a Gate.io LIVE bot may use the same symbol because their
    `(exchange, marketType)` contexts are different; same-venue LIVE overlap
    remains blocked.
  - added `bots.live-paper-concurrent.e2e.test.ts` for the requested shape:
    two PAPER bots plus one Binance LIVE bot and one Gate.io LIVE bot, with
    runtime position readback isolation for wallet-owned imported LIVE rows.
- Validation:
  - PASS: `pnpm --filter api run typecheck`
  - PASS:
    `pnpm --filter api test -- src/modules/bots/bots.live-paper-concurrent.e2e.test.ts --run`
    (`1/1`)
  - PASS:
    `pnpm --filter api test -- src/modules/bots/bots.duplicate-guard.e2e.test.ts --run`
    (`6/6`)
  - PASS:
    `pnpm --filter api test -- src/modules/bots/bots.runtime-pnl-parity.e2e.test.ts --run`
    (`2/2`)
  - PASS: `pnpm --filter api test -- src/modules/bots/runtimeMarketDataFallback.service.test.ts src/modules/bots/runtimeSessionPositionCommand.service.test.ts --run`
    (`14/14`)
  - PASS: `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx --run`
    (`20/20`)
  - PASS:
    `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.runtime-table-audit.test.tsx --run`
    (`4/4`) after adding the exact 2 PAPER + Binance LIVE + Gate.io LIVE
    selector/readback regression.
  - PASS:
    `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.runtime-table-audit.test.tsx --run`
    (`24/24`)
  - PASS: `pnpm --filter web run typecheck`
- Current status: checkpoint verified locally. The proof now covers the exact
  requested local DB-backed shape: two active PAPER bots plus active Binance
  LIVE and Gate.io LIVE bots, with selected runtime position reads isolated by
  mode, wallet, API key, exchange, and market type. The focused Web regression
  also proves the dashboard selector exposes all four bots and re-scopes wallet
  and runtime rows when switching between PAPER, Binance LIVE, and Gate.io
  LIVE. Broader production-safe authenticated browser clickthrough and real
  live multi-bot runtime operation remain separate V1 evidence lanes.
