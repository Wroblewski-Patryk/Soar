# V1MARKET-01 - Deactivated Bot Market-Edit Guard

## Header
- ID: V1MARKET-01
- Title: Allow market universe edits after linked bot deactivation
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: V1BOT-CONDITIONS-01
- Priority: P0
- Iteration: operator-hotfix-2026-05-02
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] No loop step was skipped.
- [x] Exactly one priority task was selected.
- [x] Operation mode is BUILDER for this operator hotfix.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator still saw `Markets entry is currently used by an active bot` after disabling the bot and trying to edit the linked market universe. `V1BOT-CONDITIONS-01` already proved inactive bots should allow market edits, but the bot update path could leave canonical market-group lifecycle state as `ACTIVE` after deactivation.

## Goal
After a bot is deactivated through `PUT /dashboard/bots/:id`, linked market universe symbol edits must save and synchronize linked symbol groups. Reactivating the bot must restore canonical runtime group activity and re-enable the active-bot market-edit guard.

## Success Signal
- User or operator problem: a stopped bot no longer blocks market universe edits.
- Expected product or reliability outcome: market edits behave like strategy edits after bot deactivation.
- How success will be observed: API regression covers active block -> bot deactivate -> market edit/sync -> bot reactivate -> active block.
- Post-launch learning needed: no.

## Scope
- `apps/api/src/modules/bots/botsCommand.service.ts`
- `apps/api/src/modules/markets/markets.e2e.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Implementation Plan
1. Preserve existing bot update and market universe guard architecture.
2. When `Bot.isActive` changes, synchronize enabled non-archived bot market groups to `PAUSED` on deactivation and `ACTIVE` on activation.
3. Preserve existing inactive-bot runtime graph mapping behavior for bots that were created inactive and have not gone through an activation transition.
4. Add API regression coverage for the operator flow.
5. Run focused API tests, API typecheck, and repository guardrails.

## Acceptance Criteria
- Active linked bot still blocks market universe update.
- Deactivating that bot through the bot API pauses canonical market groups.
- Market universe symbol update succeeds while the bot is inactive and syncs linked symbol groups.
- Reactivating the bot restores canonical market groups to `ACTIVE`.
- The same market universe update is blocked again after reactivation.

## Definition of Done
- [x] Existing systems reused.
- [x] No workaround path introduced.
- [x] Focused regression test added.
- [x] Relevant validations passed.
- [x] Source-of-truth context updated.

## Validation Evidence
- `pnpm --filter api run test -- src/modules/markets/markets.e2e.test.ts --run` => PASS (`14/14`)
- `pnpm --filter api run test -- src/modules/bots/bots.runtime-scope.e2e.test.ts --run` => PASS (`10/10`)
- `pnpm --filter api run test -- src/modules/bots/bots.duplicate-guard.e2e.test.ts --run` => PASS (`4/4`)
- `pnpm --filter api run typecheck` => PASS
- `pnpm run quality:guardrails` => PASS
- Note: an initial parallel run of DB-backed e2e files produced cleanup-related false failures; sequential rerun passed, matching the existing learning journal guardrail.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`, `docs/architecture/01_overview-and-principles.md`, `docs/modules/system-modules.md`, `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: none

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: market universe edit could still be blocked after bot deactivation because canonical market group lifecycle stayed `ACTIVE`.
- Gap: no regression covered the exact user flow through the bot API.
- Constraint: runtime scope still depends on enabled `ACTIVE` market groups.

### 2. Select One Priority Task
- Selected task: close the operator-reported inactive-bot market-edit blocker.
- Priority rationale: direct operator blocker for market configuration.
- Deferred: broader UI copy or market-list polish.

### 3. Plan Implementation
- Modify bot update lifecycle synchronization only.
- Add focused e2e regression in the markets module.
- Verify markets, bot runtime scope, duplicate guard, typecheck, and guardrails.

### 4. Execute Implementation
- `updateBot` now syncs enabled non-archived bot market groups to `PAUSED` only when a bot is deactivated, and back to `ACTIVE` when reactivated.
- Existing inactive-bot mapping behavior is preserved unless an activation transition occurs.

### 5. Verify and Test
- Validation performed: focused API e2e, API typecheck, repository guardrails.
- Result: PASS after sequential DB-backed e2e rerun.

### 6. Self-Review
- Simpler option considered: changing only the market universe guard. Rejected because it would not close the stale canonical lifecycle state that can keep other guards confused.
- Technical debt introduced: no.
- Scalability assessment: scoped to the singular bot market-group lifecycle contract.

### 7. Update Documentation and Knowledge
- Docs updated: this task note, task board, project state.
- Context updated: yes.
- Learning journal updated: not applicable; the parallel DB e2e pitfall was already recorded.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs/context updated.

## Result Report
- Task summary: deactivated bots now pause canonical market groups, allowing linked market universe edits; reactivation restores active groups and the active-bot guard.
- Files changed: `botsCommand.service.ts`, `markets.e2e.test.ts`, planning/context docs.
- How tested: focused API e2e, API typecheck, guardrails.
- What is incomplete: production deploy/smoke not run in this local task.
- Next steps: deploy and verify with the operator's affected bot/market pair.
