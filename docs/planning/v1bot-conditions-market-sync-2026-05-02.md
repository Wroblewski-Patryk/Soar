# V1BOT-CONDITIONS-01 Runtime Conditions And Market Sync

## Header
- ID: V1BOT-CONDITIONS-01
- Title: fix(api-runtime-read): prevent stale signal conditions after bot context edits
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: none
- Priority: P0
- Iteration: 2026-05-02
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] Exactly one priority task is selected.
- [x] Operation mode is `BUILDER`.
- [x] Source-of-truth docs and runtime architecture constraints were reviewed.

## Context
Operator-reported production behavior: after stopping a paper bot, changing the
strategy, and starting the bot again, `Markets / Signals` continued showing
old condition indicators. A related concern was whether market universe edits
while paper/live bots are inactive still save and sync to the bot scope.

## Goal
Keep dashboard runtime signal conditions aligned with the current selected bot
strategy context after bot strategy changes, while preserving market universe
edit behavior for inactive paper/live bots.

## Scope
- API runtime symbol-stats read model:
  - `apps/api/src/modules/bots/runtimeSymbolStatsReadModel.service.ts`
  - `apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.ts`
  - `apps/api/src/modules/bots/botsRuntimeRead.repository.ts`
- Regression tests:
  - `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`
  - `apps/api/src/modules/markets/markets.e2e.test.ts`
- Context docs:
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/LEARNING_JOURNAL.md`
  - `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Inspect runtime monitoring symbol-stats source and market universe update
   path.
2. Detect stale signal context when the latest signal references a strategy
   superseded by the current configured strategy, or when a signal predates a
   later edit of the same strategy config.
3. Fall back to current configured strategy context for condition summaries and
   condition lines until a fresh runtime decision arrives.
4. Add focused regression proving old RSI condition lines cannot override a
   newly configured Momentum strategy after stop/change/start.
5. Add market regressions proving inactive PAPER and LIVE bots do not block
   universe symbol sync.

## Acceptance Criteria
- Stale pre-update signal conditions no longer appear as the effective
  dashboard condition context.
- Fresh/latest runtime signal behavior remains supported.
- Inactive PAPER and LIVE linked bots allow market universe symbol edits and
  linked symbol-group sync.
- No UI layout or visual module changes.

## Validation Evidence
- `pnpm --filter api run test -- src/modules/bots/bots.runtime-scope.e2e.test.ts --run` => PASS (`10/10`).
- `pnpm --filter api run test -- src/modules/markets/markets.e2e.test.ts --run` => PASS (`13/13`).
- `pnpm --filter api run typecheck` => PASS.
- `pnpm --filter api run build` => PASS.
- `pnpm run quality:guardrails` => PASS.
- Production pre-smoke edge case found after first deploy attempt: switching
  to an already-existing older strategy must still treat pre-restart signal
  context as stale. Follow-up local validation after the aggregate merge
  hardening remained PASS for the same focused bots/markets e2e, API
  typecheck, API build, and guardrails.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
  - `docs/modules/system-modules.md`
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.

## Deployment / Ops Evidence
- Deploy impact: low.
- Env or secret changes: none.
- Health-check impact: none.
- Rollback note: revert the runtime read-model change and tests.
- Observability impact: operator-facing monitoring becomes less stale after
  context edits; runtime execution path is unchanged.

## Autonomous Loop Evidence
### 1. Analyze Current State
- Runtime monitoring aggregates multiple sessions and uses latest
  `SIGNAL_DECISION` payloads for displayed conditions.
- Market universe update already blocks active bots but should allow inactive
  paper/live bots.

### 2. Select One Priority Task
- Selected task: fix stale runtime condition display after bot strategy changes.
- Deferred: production authenticated account inspection, because this local
  task can close the deterministic code path and regression first.

### 3. Plan Implementation
- Reuse existing symbol-stats read model and strategy metadata, adding
  `updatedAt` only to strategy projections used for staleness detection.

### 4. Execute Implementation
- Runtime condition context now ignores superseded signal strategy payloads and
  edited-strategy stale payloads, falling back to current configured strategy.
- Runtime monitoring aggregate now keeps current configured fallback context
  ahead of superseded historical signal context when a fresh restarted session
  has no accepted signal yet.
- Market tests were expanded without changing market save logic.

### 5. Verify and Test
- Focused bots runtime-scope e2e passed.
- Focused markets e2e passed.
- API typecheck, API build, and repository guardrails passed.

### 6. Self-Review
- Existing systems reused: yes.
- Workaround introduced: no.
- Logic duplication introduced: no.
- UI changed: no.

### 7. Update Documentation and Knowledge
- Planning, board, project state, and learning journal updated.

## Result Report
- Task summary: stale condition indicators after strategy changes are fixed in
  the API read model; market edit behavior for inactive paper/live bots is
  regression-locked.
- Files changed: listed in Scope.
- How tested: focused API e2e packs listed above.
- What is incomplete: authenticated production account recheck still needs a
  deployed build containing this fix.
- Next steps: deploy and manually repeat stop -> edit strategy/markets -> start
  on the production account.
