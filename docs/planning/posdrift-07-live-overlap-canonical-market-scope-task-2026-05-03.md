# POSDRIFT-07 LIVE Overlap Canonical Market Scope Task

## Header
- ID: POSDRIFT-07
- Title: Keep active LIVE symbol-overlap guard on canonical market scope
- Task Type: fix
- Current Stage: DONE
- Status: DONE
- Owner: Backend Builder
- Depends on: POSDRIFT-06
- Priority: P0
- Iteration: 7
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator asked to continue auditing LIVE/PAPER position opening,
management, wallet, markets, and strategies for dashboard/runtime drift. The
next confirmed money-impacting drift was in bot write validation: active LIVE
symbol-overlap checks read other active bots through legacy direct
`Bot.symbolGroup` only, even though runtime ownership uses active canonical
`BotMarketGroup` rows.

## Goal
When creating, activating, or updating LIVE bots, symbol-overlap validation must
detect conflicts from the active canonical market scope of other LIVE bots,
even if their direct legacy `Bot.symbolGroupId` projection is stale.

## Scope
- `apps/api/src/modules/bots/botWriteValidation.service.ts`
- `apps/api/src/modules/bots/bots.duplicate-guard.e2e.test.ts`
- `docs/modules/api-bots.md`
- `docs/planning/mvp-next-commits.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Implementation Plan
1. Update active LIVE overlap lookup to load active enabled
   `BotMarketGroup.symbolGroup.symbols` for candidate bots.
2. Use canonical group symbols when present and direct legacy `Bot.symbolGroup`
   only for legacy bots without canonical groups.
3. Add an e2e regression that stales the direct projection after creating a
   LIVE bot, then verifies a conflicting LIVE create is still rejected by the
   canonical market group.
4. Run focused DB-backed validation sequentially and relevant repository gates.

## Acceptance Criteria
- Active LIVE overlap checks use canonical market groups before direct legacy
  bot symbol groups.
- Stale direct `Bot.symbolGroupId` cannot allow two active LIVE bots to share a
  symbol in their real assigned canonical markets.
- Existing duplicate active and overlap guard behavior remains green.
- Docs/context capture the new invariant and validation evidence.

## Definition of Done
- [x] LIVE overlap guard is canonical-first.
- [x] Stale direct projection regression passes.
- [x] Relevant docs/context are updated.
- [x] Validation evidence is recorded.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/bots/bots.duplicate-guard.e2e.test.ts --run --sequence.concurrent=false` => PASS (`1` file / `5` tests).
  - `pnpm --filter api exec vitest run src/modules/bots/bots.duplicate-guard.e2e.test.ts src/modules/bots/bots.runtime-strategy-context.e2e.test.ts src/modules/bots/bots.market-universe-contract.e2e.test.ts --run --sequence.concurrent=false` => PASS (`3` files / `11` tests).
  - `pnpm --filter api run typecheck` => PASS.
  - `pnpm run lint` => PASS.
  - `pnpm run quality:guardrails` => PASS.
  - `pnpm docs:parity:check` => PASS.
- Manual checks:
  - Code review confirmed direct `Bot.symbolGroup` remains fallback only when
    no active canonical market group exists for the candidate bot.
- High-risk checks:
  - Regression explicitly corrupts the first LIVE bot's direct
    `symbolGroupId` while leaving canonical `BotMarketGroup` intact.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/04_runtime-contexts.md`,
  `docs/modules/api-bots.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, active LIVE overlap validation used legacy direct
  bot market projection for candidate bots.
- Decision required from user: no.
- Follow-up architecture doc updates: `docs/modules/api-bots.md`.

## Deployment / Ops Evidence
- Deploy impact: medium.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert this commit to restore previous direct-projection-only
  overlap behavior; no schema or environment change.
- Observability or alerting impact: existing domain error
  `ACTIVE_LIVE_BOT_SYMBOL_OVERLAP` remains unchanged.
- Staged rollout or feature flag: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: active LIVE overlap guard loaded candidate bot symbols from direct
  `Bot.symbolGroup` only.
- Gaps: no regression covered a stale direct projection with intact canonical
  market group.
- Inconsistencies: runtime/import ownership was canonical-first, while LIVE
  activation safety could use stale direct market scope.
- Architecture constraints: active canonical `BotMarketGroup` is authoritative;
  direct bot fields are compatibility fallback only.

### 2. Select One Priority Task
- Selected task: POSDRIFT-07 active LIVE overlap canonical market scope.
- Priority rationale: LIVE activation safety and market assignment changes are
  money-impacting and directly match the operator report.
- Why other candidates were deferred: wallet-context validation and manual
  context remain valid audit targets, but this was the first confirmed write
  guard drift with a small reversible fix.

### 3. Plan Implementation
- Files or surfaces to modify: bot write validation, duplicate guard e2e,
  module docs, planning/context files.
- Logic: candidate bot symbols are active canonical market-group symbols if
  present, otherwise legacy direct symbol-group symbols.
- Edge cases: stale direct projection, legacy bots without canonical groups,
  multiple canonical rows in corrupted test data.

### 4. Execute Implementation
- Implementation notes: the guard now selects canonical candidate groups and
  preserves existing error payload shape.

### 5. Verify and Test
- Validation performed: focused duplicate guard e2e PASS (`5/5`), wider
  bot runtime/market-universe DB pack PASS (`11/11`), API typecheck PASS, lint
  PASS, repository guardrails PASS, and docs parity PASS.
- Result: green.

### 6. Self-Review
- Simpler option considered: check both direct and canonical symbols together.
- Technical debt introduced: no.
- Scalability assessment: canonical-first candidate scope aligns the guard with
  future exchange additions and current runtime ownership.
- Refinements made: kept legacy fallback for old bots without canonical groups.

### 7. Update Documentation and Knowledge
- Docs updated: this task doc, `docs/modules/api-bots.md`,
  `docs/planning/mvp-next-commits.md`.
- Context updated: `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.
- [x] Learning journal was updated if needed.

## Production-Grade Required Contract

### Goal
Keep LIVE market assignment safety aligned with canonical bot market scope.

### Scope
Listed above in `Scope`.

### Implementation Plan
Listed above in `Implementation Plan`.

### Acceptance Criteria
Listed above in `Acceptance Criteria`.

### Definition of Done
Reviewed against `DEFINITION_OF_DONE.md`; applicable code, validation, docs,
rollback, and reproducibility evidence are recorded.

### Result Report
- Task summary: active LIVE overlap validation now checks candidate bot
  canonical market-group symbols before legacy direct bot symbol groups.
- Files changed: listed in `Scope`.
- How tested: focused duplicate guard e2e PASS (`5/5`), wider bot
  runtime/market-universe DB pack PASS (`11/11`), API typecheck PASS, lint
  PASS, repository guardrails PASS, and docs parity PASS.
- What is incomplete: production deployment/readback remains outside this
  local iteration.
- Next steps: continue auditing wallet-context validation and manual/dashboard
  read/write seams for legacy projection drift.
- Decisions made: preserve legacy direct fallback only for bots without active
  canonical market groups.
