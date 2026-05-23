# Task

## Header
- ID: RUNTIME-AUDIT-28
- Title: Keep runtime open positions visible when history rows are newer
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-27
- Priority: P1
- Iteration: 46
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Operator-reported LIVE/PAPER dashboard drift still includes cases where the bot
dashboard does not show open runtime positions. The runtime positions endpoint
currently fetches one mixed position list with `limit` and only then splits it
into open and history rows.

## Goal
Ensure runtime dashboard open positions remain visible even when newer closed
history rows exist inside the same session and the dashboard requests a small
limit.

## Scope
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/bots.e2e.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: dashboard can render no open positions while an
  open bot-managed position exists.
- Expected product or reliability outcome: open and history runtime position
  tables are independently reliable.
- How success will be observed: regression test proves `limit=1` still returns
  the open row and the history row in their respective collections.
- Post-launch learning needed: no

## Deliverable For This Stage
Completed runtime read fix with validation and source-of-truth updates.

## Constraints
- use existing runtime position read systems and approved ownership filters
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- keep dashboard read behavior fail-closed by bot, wallet, symbol, and session

## Implementation Plan
1. Add an e2e regression for a runtime session with one older open position and
   one newer closed position queried with `limit=1`.
2. Split the runtime positions read into open and history queries using the same
   base ownership, symbol, session, and external-position scope.
3. Preserve downstream serialization, strategy display, capital summary, and
   open-order behavior.
4. Run focused tests, runtime read pack, typecheck, guardrails, and lint.

## Acceptance Criteria
- [x] Open runtime positions are not hidden by newer closed history rows.
- [x] History rows remain present for the same endpoint response.
- [x] Existing ownership, wallet, and configured-symbol scoping still pass.
- [x] Relevant source-of-truth docs are updated.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` is satisfied for this runtime read slice.
- [x] Regression test fails before the fix and passes after the fix.
- [x] Relevant validation commands pass.
- [x] Diff review confirms no workaround, duplicate pipeline, or unrelated
  cleanup was introduced.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - FAIL before fix:
    `pnpm --filter api run test -- src/modules/bots/bots.e2e.test.ts -t "keeps open runtime positions visible" --sequence.concurrent=false`
    returned `total=1` instead of expected `2`.
  - PASS after fix:
    `pnpm --filter api run test -- src/modules/bots/bots.runtime-scope.e2e.test.ts --sequence.concurrent=false`
    (`11/11`).
  - PASS:
    `pnpm --filter api run test -- src/modules/bots/bots.e2e.test.ts --sequence.concurrent=false`
    (`26/26`).
  - PASS: `pnpm --filter api run typecheck`.
  - PASS: `pnpm run quality:guardrails`.
  - PASS: `pnpm run lint`.
- Manual checks: diff review of runtime position scope and downstream
  serialization.
- Screenshots/logs: not applicable
- High-risk checks: ownership and fail-closed scoping covered by existing e2e

## Architecture Evidence
- Architecture source reviewed: docs/architecture/architecture-source-of-truth.md,
  docs/architecture/reference/runtime-signal-merge-contract.md,
  docs/modules/system-modules.md
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
- Rollback note: revert this commit to restore previous mixed-list runtime
  positions read behavior
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: runtime positions endpoint applies `limit` before splitting open and
  closed rows.
- Gaps: no regression covers small-limit open/history coexistence.
- Inconsistencies: dashboard collections imply separate open/history truth, but
  backend selection is a single mixed page.
- Architecture constraints: reuse existing bot ownership, symbol scope, wallet,
  and external-position ownership filters.

### 2. Select One Priority Task
- Selected task: `RUNTIME-AUDIT-28`.
- Priority rationale: directly matches operator symptom of missing paper/live
  positions on dashboard.
- Why other candidates were deferred: open-order dedupe pagination is a sibling
  issue but less directly tied to the reported missing position table.

### 3. Plan Implementation
- Files or surfaces to modify: runtime positions read service, bots e2e, task
  board, project state, next commits queue.
- Logic: query open and closed runtime positions as separate scoped collections.
- Edge cases: empty configured symbol scope, external exchange-synced ownership,
  live wallet context, small query limits.

### 4. Execute Implementation
- Implementation notes: runtime position reads now build one shared base
  ownership/symbol/session scope, then fetch `OPEN` and `CLOSED` positions as
  separate bounded collections before existing serialization and summary logic.

### 5. Verify and Test
- Validation performed: failing-then-passing regression, runtime-scope e2e,
  bots e2e, API typecheck, guardrails, lint.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: over-fetching one mixed list was rejected because
  it would remain data-shape dependent.
- Technical debt introduced: no
- Scalability assessment: separate bounded reads match dashboard collection
  semantics and avoid broad unbounded fetches.
- Refinements made: regression was moved from the oversized `bots.e2e.test.ts`
  into `bots.runtime-scope.e2e.test.ts` to satisfy repository file-size
  guardrails.

### 7. Update Documentation and Knowledge
- Docs updated: task evidence and planning queue.
- Context updated: `.codex/context/TASK_BOARD.md` and
  `.codex/context/PROJECT_STATE.md`.
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
- Task summary: fixed runtime positions dashboard read drift by preventing
  closed history rows from consuming the only limited result slot before open
  rows are serialized.
- Files changed:
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
  - `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `history/audits/runtime-audit-28-runtime-positions-open-history-limit-task-2026-05-03.md`
- How tested: failing-then-passing focused regression, runtime-scope e2e
  (`11/11`), bots e2e (`26/26`), API typecheck, guardrails, lint.
- What is incomplete: none for this slice.
- Next steps: continue auditing sibling runtime dashboard read paths, especially
  open-order dedupe after limited reads.
- Decisions made: open and history position collections use independent bounded
  reads because the dashboard renders them as independent collections.
