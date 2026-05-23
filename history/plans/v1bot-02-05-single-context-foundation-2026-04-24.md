# Task

## Header
- ID: V1BOT-02..05
- Title: Add direct single-context bot refs and align bot command/read contracts
- Status: DONE
- Owner: Backend Builder
- Depends on: V1BOT-01
- Priority: P0

## Context
The approved single-context bot architecture is already frozen in canonical
docs, but the implementation still persisted bot runtime context indirectly
through compatibility topology (`BotMarketGroup`, `MarketGroupStrategyLink`).
That forced API reads to reconstruct the bot's active strategy and symbol
scope from legacy graph state even though create/edit UX already behaves like
`1 bot = 1 wallet + 1 market group + 1 strategy`.

This slice closes the first implementation gap by making the bot itself carry
direct `strategyId` and `symbolGroupId` references, while keeping the legacy
topology only as an explicit compatibility bridge during migration.

## Goal
Land the data-model, migration, command, and read-contract foundation for the
single-context bot architecture without regressing current bot CRUD/runtime
surfaces.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- keep legacy topology compatibility-only, not canonical
- keep bot create/edit payloads compatible with the current web UX

## Definition of Done
- [x] `Bot` persists direct `strategyId` and `symbolGroupId` references.
- [x] Migration/backfill fills direct refs from canonical active topology and
      falls back to a single legacy row only when unambiguous.
- [x] Bot create/update commands write direct refs while still syncing legacy
      compatibility topology.
- [x] Bot list/get/runtime-graph reads expose singular inherited bot context
      without needing callers to reconstruct active strategy/scope from the
      legacy graph.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/bots/bots.e2e.test.ts src/modules/bots/bots.runtime-scope.e2e.test.ts`
  - `pnpm --filter web exec vitest run src/features/bots/components/BotCreateEditForm.test.tsx`
- Manual checks:
  - `pnpm dlx prisma@6.19.3 db push --schema prisma/schema.prisma` from `apps/api`
- Screenshots/logs:
  - not applicable
- High-risk checks:
  - verified create/update/list/get/runtime-graph parity for direct `strategyId`
    and `symbolGroupId`
  - verified current web edit flow remains compatible with inherited symbol
    group + strategy reads

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/03_domain-model.md`
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/05_strategy-signal-and-decision-flow.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
  - user approval on 2026-04-24 for the full single-context bot model
- Follow-up architecture doc updates:
  - no new architecture change in this slice; implementation now catches up to
    the already approved contract

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: existing bot create/edit UX already reflects the
  singular bot contract
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks: preserved existing form interactions
- Parity evidence:
  - bot edit form now prefers direct inherited `strategy`/`symbolGroup`
    response data before falling back to runtime-graph compatibility data

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
This slice intentionally stops before runtime execution rewiring. Legacy
`BotMarketGroup` and `MarketGroupStrategyLink` stay in place only so the next
runtime slice can migrate incrementally without breaking deployed rows.
