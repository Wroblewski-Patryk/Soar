# V1AUTO-A - Imported LIVE Runtime-State Rebase Hardening

Status: Active
Date: 2026-04-30
Owner: Codex Execution Agent

## Goal

Close the remaining `LIVE` automation continuity gap where an `EXCHANGE_SYNC`
position can keep the same local `positionId` after exchange truth changes, but
still inherit stale runtime management state (`currentAdds`, trailing state,
entry basis, quantity basis). This must fail closed and rebase the runtime state
to canonical exchange-synced position truth before `DCA/TTP/TSL` decisions are
made.

## Why This Exists

Protected production verification after the `V1ROE-04` deploy showed that price
truth is now much closer to exchange truth, yet the active `LIVE DOGEUSDT`
position still appears unmanaged:

- `DCA` stays idle despite drawdown deep enough for the configured ladder
- `dynamicTtpStopLoss` / `dynamicTslStopLoss` remain `null`
- runtime/session telemetry looks too weak for the currently open imported row

The strongest remaining code-level hypothesis is that exchange sync can update
an imported position row in place while runtime automation still loads stale
persisted state from `runtimePositionStateStore`.

## Scope

- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.test.ts`
- canonical queue/context docs

## Canonical Direction

- Keep the existing singular runtime engine and canonical exchange-sync model.
- Do not add a parallel imported-position automation path.
- When canonical `EXCHANGE_SYNC` position basis materially differs from
  persisted runtime state, rebase to the canonical position state instead of
  continuing with stale local continuity.
- Preserve existing bot-origin continuity behavior.

## Task Breakdown

1. `V1AUTO-01 fix(api-runtime): rebase stale imported runtime state to canonical exchange-synced basis`
2. `V1AUTO-02 test(api-runtime): lock imported same-row basis drift against stale DCA state reuse`
3. `V1AUTO-03 qa(closure): run focused runtime automation pack and sync context`

## Validation Target

- focused `runtimePositionAutomation.service.test.ts`
- `pnpm --filter api run typecheck`
- `pnpm run quality:guardrails`

## Definition of Done

- Imported `LIVE` runtime automation cannot reuse stale persisted state when the
  canonical exchange-synced position basis changed materially.
- The new regression is covered by focused tests.
- Queue/context truth is synchronized.
