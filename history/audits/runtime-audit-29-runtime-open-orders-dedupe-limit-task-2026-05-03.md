# Task

## Header
- ID: RUNTIME-AUDIT-29
- Title: Keep distinct runtime open orders visible after dedupe
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-28
- Priority: P1
- Iteration: 47
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The runtime positions endpoint also returns `openOrders` for the dashboard.
Those rows are deduplicated by exchange order identity after a limited database
read. If the limited read contains duplicates, a distinct order just outside
the raw limit can disappear from the dashboard.

## Goal
Ensure runtime dashboard open-order rows are limited after exchange/local
deduplication, not before it.

## Scope
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: open-order dashboard rows can under-report when a
  local order and exchange-synced order share one `exchangeOrderId`.
- Expected product or reliability outcome: distinct open orders remain visible
  up to the requested dashboard limit after canonical dedupe.
- How success will be observed: regression test proves `limit=2` returns two
  distinct open-order identities even when the two newest raw rows are a
  duplicate pair.
- Post-launch learning needed: no

## Deliverable For This Stage
Completed runtime open-order read fix with validation and source-of-truth
updates.

## Constraints
- use existing runtime open-order read and dedupe systems
- preserve exchange-synced preference for duplicate exchange identities
- do not change order write/import semantics
- do not introduce unbounded reads
- keep bot, wallet, session, symbol, and ownership scoping fail-closed

## Implementation Plan
1. Add an e2e regression with duplicate open-order rows sharing
   `exchangeOrderId` plus a distinct order behind the raw limit.
2. Fetch a bounded candidate set for runtime open-order dedupe, then apply the
   requested response `limit` after dedupe.
3. Reuse the same helper in both no-position and with-position response paths.
4. Run focused regression, runtime-scope e2e, bots e2e, typecheck,
   guardrails, lint, and diff review.

## Acceptance Criteria
- [x] Duplicate local/exchange open-order rows do not consume visible result
  slots before distinct orders are considered.
- [x] Duplicate identity preference still chooses `EXCHANGE_SYNC` over local.
- [x] `openOrdersCount` matches the visible deduped response rows.
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
    `pnpm --filter api run test -- src/modules/bots/bots.runtime-scope.e2e.test.ts -t "keeps distinct runtime open orders" --sequence.concurrent=false`
    returned `openOrdersCount=1` instead of expected `2`.
  - PASS after fix:
    `pnpm --filter api run test -- src/modules/bots/bots.runtime-scope.e2e.test.ts -t "keeps distinct runtime open orders" --sequence.concurrent=false`.
  - PASS:
    `pnpm --filter api run test -- src/modules/bots/bots.runtime-scope.e2e.test.ts --sequence.concurrent=false`
    (`12/12`).
  - PASS:
    `pnpm --filter api run test -- src/modules/bots/bots.e2e.test.ts --sequence.concurrent=false`
    (`26/26`).
  - PASS: `pnpm --filter api run typecheck`.
  - PASS: `pnpm run quality:guardrails`.
  - PASS: `pnpm run lint`.
- Manual checks: diff review of open-order read scope, bounded candidate limit,
  dedupe preference, and visible result slicing.
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
- Rollback note: revert this commit to restore previous runtime open-order
  limited-read behavior.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `openOrders` are deduped after a limited raw read.
- Gaps: no regression covers duplicate exchange/local open orders consuming
  visible slots.
- Inconsistencies: dashboard `limit` is a visible-row contract, but backend
  applies it to pre-deduplication rows.
- Architecture constraints: reuse existing repository read and
  `dedupeRuntimeOpenOrders` behavior.

### 2. Select One Priority Task
- Selected task: `RUNTIME-AUDIT-29`.
- Priority rationale: sibling dashboard visibility drift to the just-closed
  runtime positions limit issue.
- Why other candidates were deferred: strategy/import write flows need broader
  slices; this read drift is small, reversible, and directly dashboard-facing.

### 3. Plan Implementation
- Files or surfaces to modify: runtime positions read service, runtime-scope
  e2e, task board, project state, next commits queue.
- Logic: read bounded open-order candidates, dedupe, then slice to query limit.
- Edge cases: no positions path, positions-present path, duplicate exchange
  order identity, local-only identity, small limits.

### 4. Execute Implementation
- Implementation notes: added `RUNTIME_OPEN_ORDER_DEDUPE_CANDIDATE_LIMIT` and
  `selectVisibleRuntimeOpenOrders`, reused in both no-position and
  positions-present response paths.

### 5. Verify and Test
- Validation performed: failing-then-passing focused regression, runtime-scope
  e2e, bots e2e, API typecheck, guardrails, lint.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: increasing the raw `take` ad hoc at call sites was
  rejected in favor of one named helper/constant.
- Technical debt introduced: no
- Scalability assessment: bounded candidate read respects the endpoint max
  while making visible limiting happen after dedupe.
- Refinements made: kept the helper local to the existing runtime positions
  read service to avoid a new abstraction for one endpoint contract.

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
- Task summary: fixed runtime dashboard open-order visibility by applying the
  requested limit after exchange/local dedupe.
- Files changed:
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
  - `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `history/audits/runtime-audit-29-runtime-open-orders-dedupe-limit-task-2026-05-03.md`
- How tested: failing-then-passing focused regression, runtime-scope e2e
  (`12/12`), bots e2e (`26/26`), API typecheck, guardrails, lint.
- What is incomplete: none for this slice.
- Next steps: continue auditing runtime dashboard read/write parity for bot
  position management, especially strategy/market update effects.
- Decisions made: candidate rows are capped at the endpoint maximum of `500`
  before dedupe, then sliced to the requested visible `limit`.
