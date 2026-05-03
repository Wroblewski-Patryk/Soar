# Task

## Header
- ID: RUNTIME-AUDIT-34
- Title: Preserve bot mode in empty runtime monitoring aggregate
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-33
- Priority: P1
- Iteration: 52
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime monitoring aggregate uses a deterministic empty payload when a bot has
no runtime sessions or no complete runtime read rows. That empty payload
currently hardcodes `mode: PAPER`, which can make a LIVE bot dashboard render
the wrong runtime mode before the first session exists.

## Goal
Keep empty runtime monitoring aggregate metadata aligned with the selected bot
mode for both PAPER and LIVE bots.

## Scope
- `apps/api/src/modules/bots/botOwnership.service.ts`
- `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: a LIVE bot with no sessions can render runtime
  monitoring metadata as `PAPER`.
- Expected product or reliability outcome: dashboard aggregate metadata
  remains a faithful reflection of the bot configuration even in empty states.
- How success will be observed: regression test proves a LIVE bot without
  sessions returns an empty aggregate with `sessionDetail.mode: LIVE`.
- Post-launch learning needed: no

## Deliverable For This Stage
A failing-then-passing monitoring aggregate empty-state mode regression and a
scoped read-model fix.

## Constraints
- reuse existing owned-bot lookup
- do not create a new aggregate read path
- do not change runtime session semantics
- do not change non-empty aggregate mode resolution
- keep ownership checks unchanged

## Implementation Plan
1. Add an e2e regression for a LIVE bot with no runtime sessions.
2. Include bot mode in the owned-bot projection used by aggregate reads.
3. Pass the selected bot mode into the empty aggregate payload builder.
4. Run focused monitoring aggregate e2e, API typecheck, guardrails, lint, and
   diff review.

## Acceptance Criteria
- [x] Empty aggregate for LIVE bot reports `sessionDetail.mode: LIVE`.
- [x] Empty aggregate for PAPER bot continues to report `PAPER`.
- [x] Non-empty aggregate mode resolution is unchanged.
- [x] Source-of-truth docs are updated.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` is satisfied for this runtime read-model slice.
- [x] Regression test fails before the fix and passes after the fix.
- [x] Relevant validation commands pass.
- [x] Diff review confirms no workaround, duplicate pipeline, or unrelated
  cleanup was introduced.

## Forbidden
- dashboard-only masking
- temporary bypasses
- changing runtime session mode history
- new systems without approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- src/modules/bots/bots.monitoring-aggregate.e2e.test.ts -t "keeps LIVE bot mode in empty aggregate payload" --sequence.concurrent=false`
    failed before the fix with `PAPER` instead of `LIVE`, then passed after
    the fix.
  - `pnpm --filter api run test -- src/modules/bots/bots.monitoring-aggregate.e2e.test.ts --sequence.concurrent=false`
    PASS (`6/6`).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm run quality:guardrails` PASS.
  - `pnpm run lint` PASS.
- Manual checks: diff review confirmed the change is limited to empty runtime
  monitoring aggregate mode metadata and its regression coverage.
- Screenshots/logs: not applicable
- High-risk checks: read-model metadata only; no trading lifecycle decisions
  changed.

## Architecture Evidence
- Architecture source reviewed: docs/architecture/01_overview-and-principles.md,
  docs/modules/system-modules.md,
  docs/architecture/architecture-source-of-truth.md
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous empty aggregate mode
  metadata.
- Observability or alerting impact: dashboard empty-state metadata improves.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `buildEmptyAggregatePayload` hardcodes `mode: PAPER`.
- Gaps: monitoring aggregate e2e covers deterministic empty payload but not
  LIVE empty-state mode parity.
- Inconsistencies: non-empty aggregate derives mode from sessions, while empty
  aggregate ignores the selected bot mode.
- Architecture constraints: dashboard runtime metadata should reflect source
  truth and reuse owned bot context.

### 2. Select One Priority Task
- Selected task: `RUNTIME-AUDIT-34`.
- Priority rationale: this is a small dashboard truth drift directly affecting
  LIVE/PAPER operator interpretation.
- Why other candidates were deferred: broader aggregate limit and lifecycle
  audits remain, but this empty-state mode bug is smaller and reversible.

### 3. Plan Implementation
- Files or surfaces to modify: owned bot projection, runtime aggregate
  read-model, monitoring aggregate e2e, task board, project state, next queue.
- Logic: select bot `mode` with owned bot context and pass it into empty
  aggregate payload construction.
- Edge cases: no sessions, incomplete per-session read rows, existing PAPER
  empty aggregate, non-empty mixed session mode resolution.

### 4. Execute Implementation
- Implementation notes: `getOwnedBot` now selects the persisted bot `mode`.
  Empty monitoring aggregate payload construction receives that mode instead
  of hardcoding `PAPER`.

### 5. Verify and Test
- Validation performed: focused failing-then-passing regression, full
  monitoring aggregate e2e, API typecheck, guardrails, lint, and diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: hardcoding LIVE in the test path was rejected; the
  empty payload should use the selected bot's persisted mode.
- Technical debt introduced: no
- Scalability assessment: one additional scalar in an existing owned-bot
  projection.
- Refinements made: none needed after focused verification.

### 7. Update Documentation and Knowledge
- Docs updated: task doc and MVP next-commits queue.
- Context updated: task board and project state.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Result Report
- Task summary: empty runtime monitoring aggregate metadata now preserves the
  selected bot's persisted mode, so LIVE bots without sessions no longer render
  as PAPER in aggregate metadata.
- Files changed:
  - `apps/api/src/modules/bots/botOwnership.service.ts`
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
- How tested: focused regression, full monitoring aggregate e2e, API
  typecheck, guardrails, lint, and diff review.
- What is incomplete: nothing for this slice.
- Next steps: continue the runtime dashboard audit with the next smallest
  LIVE/PAPER position, trade, wallet, market, or strategy truth drift.
- Decisions made: non-empty aggregate mode resolution remains session-derived.
