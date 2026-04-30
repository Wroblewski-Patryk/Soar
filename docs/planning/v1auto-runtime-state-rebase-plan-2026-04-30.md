# V1AUTO-A - Imported LIVE Runtime-State Rebase Hardening

Status: Closed
Date: 2026-04-30
Owner: Codex Execution Agent

## Goal

Close the remaining imported `LIVE` automation continuity gap in two parts:

1. stale persisted runtime continuity must not survive canonical
   exchange-synced basis drift on the same imported row
2. freshly adopted canonically owned imported rows must not stay dormant until
   a later ticker-path event finally wakes runtime automation

Both parts must stay fail-closed and reuse the canonical runtime engine.

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
2. `V1AUTO-02 fix(api-reconcile): hydrate imported LIVE automation prospectively from fresh exchange-sync truth`
3. `V1AUTO-03 qa(closure): run focused runtime automation and reconciliation pack and sync context`

## Validation Target

- focused `runtimePositionAutomation.service.test.ts`
- `pnpm --filter api run typecheck`
- `pnpm run quality:guardrails`

## Definition of Done

- Imported `LIVE` runtime automation cannot reuse stale persisted state when
  the canonical exchange-synced position basis changed materially.
- Canonically owned imported `LIVE` rows can hydrate automation prospectively
  from fresh reconciliation truth without waiting for a later ticker-path wake-up.
- Focused tests cover both the stale-state and hydration seams.
- Queue/context truth is synchronized.
