# Task

## Header
- ID: RUNTIME-AUDIT-33
- Title: Attach effective strategy to imported open trade anchors
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-32
- Priority: P1
- Iteration: 51
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime trade history creates synthetic `position-open:*` anchors for imported
open positions that have no persisted trade row yet. Those anchors currently
use only `position.strategyId`, so strategy-null imported positions can render
without the bot's canonical strategy even when the active bot market group has
one unambiguous strategy link.

## Goal
Keep runtime trades and monitoring aggregate strategy attribution aligned with
canonical bot strategy provenance for imported open position anchors.

## Scope
- `apps/api/src/modules/bots/runtimeSessionTradesRead.repository.ts`
- `apps/api/src/modules/bots/runtimeSessionTradesRead.service.ts`
- `apps/api/src/modules/bots/bots.runtime-history-parity.e2e.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: dashboard trade history can show an imported open
  position anchor with an empty strategy even though the bot has a single
  configured canonical strategy.
- Expected product or reliability outcome: runtime trades read model uses the
  same effective single-strategy provenance as runtime automation and position
  reads.
- How success will be observed: regression test proves a strategy-null imported
  open anchor returns the bot's canonical strategy id.
- Post-launch learning needed: no

## Deliverable For This Stage
A failing-then-passing runtime trade anchor strategy attribution regression and
scoped fix.

## Constraints
- reuse existing canonical bot market-group strategy link model
- do not change persisted position/trade data
- do not assign strategy when canonical provenance is ambiguous
- keep runtime trade scope and ownership filters unchanged

## Implementation Plan
1. Add an e2e regression for a strategy-null imported open anchor.
2. Load active canonical strategy links in runtime trade bot context.
3. Resolve a single effective strategy id for anchors when `position.strategyId`
   is null.
4. Run focused runtime history parity e2e, related runtime scope e2e,
   typecheck, guardrails, lint, and diff review.

## Acceptance Criteria
- [x] Strategy-null imported open anchors use single canonical strategy id.
- [x] Ambiguous/missing canonical strategy provenance remains empty.
- [x] Persisted trade rows keep their own strategy ids unchanged.
- [x] Source-of-truth docs are updated.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` is satisfied for this runtime read-model slice.
- [x] Regression test fails before the fix and passes after the fix.
- [x] Relevant validation commands pass.
- [x] Diff review confirms no workaround, duplicate pipeline, or unrelated
  cleanup was introduced.

## Forbidden
- mutating persisted historical rows for display-only attribution
- dashboard-only fallback masking
- temporary bypasses
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- src/modules/bots/bots.runtime-history-parity.e2e.test.ts -t "uses canonical strategy for imported OPEN trade anchors" --sequence.concurrent=false`
    failed before the service fix with an empty anchor `strategyId`, then
    passed after the fix.
  - `pnpm --filter api run test -- src/modules/bots/bots.runtime-history-parity.e2e.test.ts --sequence.concurrent=false`
    PASS (`6/6`).
  - `pnpm --filter api run test -- src/modules/bots/bots.runtime-scope.e2e.test.ts --sequence.concurrent=false`
    PASS (`12/12`).
  - `pnpm --filter api run test -- src/modules/bots/bots.runtime-strategy-context.e2e.test.ts --sequence.concurrent=false`
    PASS (`5/5`).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm run quality:guardrails` PASS.
  - `pnpm run lint` PASS.
- Manual checks: diff review confirmed the change is limited to runtime trade
  anchor strategy attribution and regression coverage.
- Screenshots/logs: not applicable
- High-risk checks: read-model only; no order/position lifecycle decisions
  changed.

## Architecture Evidence
- Architecture source reviewed: docs/architecture/01_overview-and-principles.md,
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
- Rollback note: revert this commit to restore previous anchor strategy
  attribution.
- Observability or alerting impact: dashboard read-model provenance improves.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: runtime trade anchors use `position.strategyId ?? ''`.
- Gaps: no test covers strategy-null imported open anchors with one canonical
  bot strategy link.
- Inconsistencies: runtime automation and positions can resolve effective
  strategy provenance, but trade anchors do not.
- Architecture constraints: explicit provenance, no hidden fallbacks, dashboard
  as operator-facing runtime truth.

### 2. Select One Priority Task
- Selected task: `RUNTIME-AUDIT-33`.
- Priority rationale: ARCHITECT-mode audit found another read-model provenance
  drift in the runtime dashboard tree.
- Why other candidates were deferred: broader lifecycle audits remain, but
  this is a small, reversible read-model fix.

### 3. Plan Implementation
- Files or surfaces to modify: runtime trades repository/service, runtime
  history parity e2e, task board, project state, next commits queue.
- Logic: select active strategy links on bot market groups and resolve exactly
  one strategy id for synthetic anchors when the position has no strategy.
- Edge cases: persisted trade rows, ambiguous multi-strategy groups, no
  configured strategy.

### 4. Execute Implementation
- Implementation notes: `getRuntimeTradeBotContext` now loads active
  `MarketGroupStrategyLink` rows from canonical bot market groups. The runtime
  trades service resolves exactly one canonical strategy id for synthetic
  imported open anchors when `position.strategyId` is null, while leaving
  ambiguous or missing provenance empty.

### 5. Verify and Test
- Validation performed: focused failing-then-passing regression, full runtime
  history parity e2e, runtime scope e2e, runtime strategy context e2e, API
  typecheck, guardrails, lint, and diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: mutating imported positions was rejected because
  this is a read-model display provenance issue.
- Technical debt introduced: no
- Scalability assessment: bounded to already-loaded bot context and synthetic
  anchor creation.
- Refinements made: test fixtures were aligned to the bot's configured market
  symbol so existing scope guards continue to exercise the canonical selected
  bot market group.

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
- Task summary: imported open `position-open:*` runtime trade anchors now use
  the single canonical strategy from active bot market-group links when the
  imported position has no persisted `strategyId`.
- Files changed:
  - `apps/api/src/modules/bots/runtimeSessionTradesRead.repository.ts`
  - `apps/api/src/modules/bots/runtimeSessionTradesRead.service.ts`
  - `apps/api/src/modules/bots/bots.runtime-history-parity.e2e.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
- How tested: focused regression, full runtime history parity e2e, runtime
  scope e2e, runtime strategy context e2e, API typecheck, guardrails, lint,
  and diff review.
- What is incomplete: nothing for this slice.
- Next steps: continue the runtime dashboard audit with the next smallest
  unchecked LIVE/PAPER management drift.
- Decisions made: ambiguous multi-strategy provenance remains empty instead of
  guessing a strategy for display.
