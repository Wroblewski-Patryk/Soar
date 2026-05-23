# Task

## Header
- ID: BOTLIVE-2026-04-28-A
- Title: Block active LIVE bot market-group overlap against other active LIVE bot scopes
- Status: Closed
- Stage: implementation
- Owner: Backend Builder
- Priority: P0

## Context
The repository already blocked exact duplicate active bots by the tuple
`wallet + strategy + market group`, but it still allowed a more dangerous LIVE
collision: two active opted-in `LIVE` bots under the same user could use market
groups with partially overlapping symbols even when the groups were not the same
entity.

Example:
- bot A: `BTCUSDT`, `ETHUSDT`, `DOGEUSDT`
- bot B: `ETHUSDT`, `DOTUSDT`, `POLUSDT`

That creates competing LIVE ownership over `ETHUSDT`, which can make imported
positions, runtime execution scope, and operator expectations ambiguous.

## Goal
Fail closed on bot create/update when a bot would become an active opted-in
`LIVE` bot whose selected market group overlaps any symbol already covered by
another active opted-in `LIVE` bot for the same user.

## Constraints
- reuse the existing bot command and validation layers
- do not add a parallel ownership or topology system
- keep the rule scoped to `LIVE vs LIVE`
- allow `PAPER` and `LIVE` to share the same market group or overlapping symbols
- return operator-readable conflict details naming the blocking bot and symbols

## Definition of Done
- [x] Creating an active opted-in `LIVE` bot fails when its market group overlaps
      symbols already used by another active opted-in `LIVE` bot.
- [x] Updating a bot into active opted-in `LIVE` state fails under the same
      overlap condition.
- [x] Conflict response identifies the conflicting symbol list and active bot
      name.
- [x] Focused DB-backed API regression coverage is green.
- [x] API typecheck and repository guardrails are green.

## Forbidden
- UI-only validation without backend enforcement
- blocking `PAPER` bots because of `LIVE` scope
- treating inactive or non-opted-in LIVE drafts as active runtime conflicts
- silently auto-removing symbols from user-owned market groups

## Validation Evidence
- `pnpm --filter api exec vitest run src/modules/bots/bots.duplicate-guard.e2e.test.ts`
- `pnpm --filter api run typecheck`
- `pnpm run quality:guardrails`

## Review Checklist
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated because repository truth changed.
- [ ] Learning journal update not needed; no new recurring environment/tooling pitfall was confirmed.
