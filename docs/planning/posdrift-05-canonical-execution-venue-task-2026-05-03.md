# POSDRIFT-05 Canonical Execution Venue Task

## Header
- ID: POSDRIFT-05
- Title: Keep pre-trade, manual open, position reads, and automation on canonical execution venue
- Task Type: fix
- Current Stage: DONE
- Status: DONE
- Owner: Backend Builder
- Depends on: POSDRIFT-04
- Priority: P0
- Iteration: 5
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator reported remaining LIVE/PAPER drift around position opening,
management, closing, wallet truth, market assignment changes, and TTP visibility.
Earlier POSDRIFT slices aligned manual-order context, imported ownership, manual
close provenance, and runtime position reads. This slice audited the next
money-impacting seam: execution venue resolution for pre-trade, manual open,
runtime position read, and runtime position automation.

## Goal
Every affected runtime and manual order path must resolve wallet-compatible
venue from the active canonical `BotMarketGroup` before legacy
`Bot.symbolGroup`, so stale direct bot projections cannot block, route, or
display trading state differently from the canonical bot market scope.

## Scope
- `apps/api/src/modules/engine/runtimeBotExecutionContext.ts`
- `apps/api/src/modules/engine/preTrade.service.ts`
- `apps/api/src/modules/engine/preTrade.e2e.test.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.helpers.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.test.ts`
- `apps/api/src/modules/orders/orders.service.ts`
- `apps/api/src/modules/orders/orders.service.test.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `docs/modules/api-orders.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/LEARNING_JOURNAL.md`

## Implementation Plan
1. Add one shared canonical venue resolver beside inherited runtime execution
   context assembly.
2. Use that resolver in pre-trade LIVE bot config, manual order open context,
   runtime position reads, and runtime position automation.
3. Extend runtime automation query selection so canonical groups include their
   market-universe venue.
4. Add stale direct `Bot.symbolGroup` regression tests for pre-trade, LIVE
   manual open, and position automation execution context.
5. Run focused money-impacting runtime/order validation and API typecheck.

## Acceptance Criteria
- Pre-trade allows a LIVE bot whose wallet and active canonical market group
  match, even if direct `Bot.symbolGroup` is stale.
- LIVE manual open passes `FUTURES` execution context from active canonical
  market group, not stale direct `SPOT`.
- Runtime position automation resolves TTP/DCA/close execution venue from active
  canonical market group before legacy direct bot group.
- Runtime position reads keep using the same shared canonical venue resolver.
- Relevant tests and docs/context updates are complete.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/engine/preTrade.e2e.test.ts src/modules/orders/orders.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/bots/bots.runtime-strategy-context.e2e.test.ts src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts src/modules/bots/runtimePositionSerialization.service.test.ts --run --sequence.concurrent=false` => PASS (`6` files / `74` tests).
- Manual checks:
  - Code review of all direct venue consumers touched by this task.
- High-risk checks:
  - Stale direct market fixtures explicitly cover `SPOT` legacy projection with canonical `FUTURES` active group.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/04_runtime-contexts.md`, `docs/modules/api-orders.md`, `docs/modules/api-bots.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, legacy direct venue was still used in pre-trade, manual open, and automation.
- Decision required from user: no.
- Follow-up architecture doc updates: module docs updated; architecture contract already required canonical active topology.

## Deployment / Ops Evidence
- Deploy impact: medium.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert this commit to return to previous legacy venue behavior; no schema change.
- Observability or alerting impact: existing pre-trade audit and runtime automation telemetry remain unchanged.
- Staged rollout or feature flag: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: pre-trade, manual open, and position automation could still validate wallet venue against direct legacy `Bot.symbolGroup`.
- Gaps: runtime position reads had a local duplicate of canonical venue selection.
- Inconsistencies: dashboard/manual context was canonical-first, but execution/automation seams still had legacy venue reads.
- Architecture constraints: active canonical `BotMarketGroup` is source of truth once present; direct bot fields are compatibility projections only.

### 2. Select One Priority Task
- Selected task: POSDRIFT-05 canonical execution venue.
- Priority rationale: money-impacting opening and management paths can drift after market changes.
- Why other candidates were deferred: aggregate wallet fallback did not reproduce as a primary drift because position summaries normally return `referenceBalance/freeCash` together.

### 3. Plan Implementation
- Files or surfaces to modify: shared execution context helper, pre-trade, orders open, runtime position automation, runtime position reads, tests, docs/context.
- Logic: resolve unique active canonical venue first; fail closed on multiple canonical venues; use direct symbol group only when no canonical venue exists.
- Edge cases: stale direct `SPOT` vs canonical `FUTURES`, missing canonical group, multiple canonical venues.

### 4. Execute Implementation
- Implementation notes: introduced `resolveCanonicalRuntimeVenueContext` and reused it across affected paths.

### 5. Verify and Test
- Validation performed: focused API runtime/order/position pack PASS (`74/74`).
- Result: green.

### 6. Self-Review
- Simpler option considered: patch each caller locally.
- Technical debt introduced: no.
- Scalability assessment: shared resolver reduces future drift and supports additional exchanges through the existing venue contract.
- Refinements made: runtime position read local duplicate was removed.

### 7. Update Documentation and Knowledge
- Docs updated: this task doc, `docs/modules/api-orders.md`.
- Context updated: `.codex/context/TASK_BOARD.md`, `.codex/context/PROJECT_STATE.md`.
- Learning journal updated: yes, with DB-backed test parallelism guardrail.

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
- [x] Learning journal was updated.

## Result Report
- Task summary: active canonical market-group venue now drives pre-trade, manual open, runtime position reads, and runtime position automation before legacy direct bot projections.
- Files changed: listed in Scope.
- How tested: focused API runtime/order/position pack PASS (`74/74`).
- What is incomplete: production deployment/readback not performed in this local slice.
- Next steps: continue auditing remaining position-management read/write seams for legacy direct projection usage.
- Decisions made: fail closed on multiple canonical venues and preserve direct symbol-group fallback only for legacy bots without active canonical groups.
