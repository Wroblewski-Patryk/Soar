# Task

## Header
- ID: V1FIX-2026-04-26-A
- Title: Recover manual-order fill lifecycle when a same-symbol open position already exists
- Status: DONE
- Owner: Backend Builder
- Depends on: V1UX-01, V1UX-02, V1UX-03
- Priority: P0

## Context
Production manual order submission for selected-bot `PAPER` flow could still fail with
`Internal server error` even though manual open lifecycle had previously been hardened.
The confirmed production crash happened in `applyOrderFillLifecycle()` when a manual
same-symbol open filled while an `OPEN` position for that symbol already existed.
The database still enforces the canonical partial unique index
`Position_userId_symbol_open_key`, so blind `position.create()` was no longer valid.

## Goal
Keep the canonical `order -> fill -> position opened/updated` lifecycle truthful for manual
orders when the user already has an open same-symbol position, and fail closed with an
explicit domain error when the operator tries to open the reverse side through the open-order
command.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic

## Definition of Done
- [x] Manual same-side open reuses and updates the existing open position instead of crashing.
- [x] Reverse-side open on an already open symbol fails closed with an explicit API error.
- [x] Focused regression coverage locks both the same-side add and reverse-side conflict paths.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts src/modules/orders/orders.manual-paper-market.e2e.test.ts`
  - `pnpm --filter api run typecheck`
  - `pnpm run quality:guardrails`
- Manual checks:
  - Production root-cause reproduced in `soar-api` container before fix:
    `PrismaClientKnownRequestError P2002 Unique constraint failed on the fields: (userId,symbol)`
- Screenshots/logs:
  - Production manual order attempt for `Paper bot` on `DOGEUSDT` found an already open `LONG`
    position for the same user and symbol.
- High-risk checks:
  - Same-side add now updates `quantity` and weighted `entryPrice`.
  - Reverse-side open no longer falls through to a raw `500`.

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/reference/execution-lifecycle-parity-contract.md`
  - `docs/architecture/reference/position-lifecycle-parity-matrix.md`
  - `docs/architecture/10_safety-entitlements-and-risk.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
- Follow-up architecture doc updates: none

## Review Checklist (mandatory)
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
- `Position_userId_symbol_open_key` still exists in SQL migration history and on production,
  even though it is not directly visible in the current `schema.prisma` model block.
- The fix intentionally leaves explicit `positionId` flows unchanged, because runtime DCA and
  runtime close already own their own downstream position mutation semantics.
