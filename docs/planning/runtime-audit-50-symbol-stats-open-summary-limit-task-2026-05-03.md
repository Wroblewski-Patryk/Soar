# Task

## Header
- ID: RUNTIME-AUDIT-50
- Title: Preserve symbol-stats open-position summary under item limits
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-49
- Priority: P1
- Iteration: 68
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime symbol stats build visible rows from the selected bot market group.
When no symbol filter is provided, the visible symbol list is limited. Live
open-position summary fields were derived from those visible symbols.

## Goal
Keep symbol-stats summary open-position metrics truthful for the full assigned
market group when `limit` hides some symbol rows.

## Success Signal
- User or operator problem: dashboard signal/market cards must not say only one
  symbol has an open position when another assigned hidden symbol also has one.
- Expected product or reliability outcome: `summary.openPositionCount`,
  `summary.openPositionQty`, and `summary.unrealizedPnl` reflect all configured
  symbols while `items` remains limited.
- How success will be observed: `limit=1` with BTC and ETH open positions
  returns one visible item and summary count/qty for both.
- Post-launch learning needed: no

## Deliverable For This Stage
Implement one backend read-model fix with focused runtime symbol-stats
regression coverage.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Symbol-stats summary live open metrics use the full configured symbol
  scope when no symbol filter is active.
- [x] Visible symbol-stat items remain limited.
- [x] Relevant runtime tests, typecheck, guardrails, lint, and diff checks pass.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests: failing-then-passing focused symbol-stats regression; runtime-scope
  e2e (`13/13`); monitoring aggregate e2e (`12/12`); API typecheck; lint;
  repository guardrails
- Manual checks: `git diff --check`
- Screenshots/logs: not applicable
- High-risk checks: read-only dashboard aggregation path, no trading side
  effects

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: runtime read models are backend-composed
  dashboard truth.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not applicable

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this single read-model commit if symbol-stats summary
  regresses.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `listBotRuntimeSessionSymbolStats` limited configured symbols before
  loading live open-position metrics.
- Gaps: no regression covered summary open-position metrics when `limit` hides
  assigned symbols.
- Inconsistencies: positions endpoint summaries already use full scoped rows,
  while symbol-stats summary could follow visible item limits.
- Architecture constraints: keep the existing symbol-stats read model and
  compose full-summary truth without adding a parallel endpoint.

### 2. Select One Priority Task
- Selected task: preserve symbol-stats open-position summary under item limits.
- Priority rationale: directly affects dashboard market/signal cards and the
  operator-reported PAPER/LIVE visibility issues.
- Why other candidates were deferred: imported LIVE ownership inside
  symbol-stats can be audited as a separate risk slice.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.ts`
  - `apps/api/src/modules/bots/runtimeSymbolStatsReadModel.service.ts`
  - `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`
  - canonical context and planning docs
- Logic: load live open-position metrics for full configured symbols for
  summary, keep visible items limited, and let filtered symbol requests remain
  symbol-scoped.
- Edge cases: visible item list remains limited; aggregate historical stats
  still use existing DB aggregate; no symbol filter means full configured
  live-summary scope.

### 4. Execute Implementation
- Implementation notes: added a regression with BTC and ETH open positions
  under `limit=1`; split visible symbol rows from full live-summary symbols;
  added persisted unrealized-PnL fallback when live price is unavailable.

### 5. Verify and Test
- Validation performed: focused regression before and after the fix,
  runtime-scope e2e, monitoring aggregate e2e, API typecheck, guardrails, lint,
  and diff check.
- Result: PASS. The pre-fix focused regression returned open-position count
  `1` instead of `2`; after the fix it returns full count, quantity, and
  persisted unrealized PnL while visible `items` remains length `1`.

### 6. Self-Review
- Simpler option considered: increase `limit`; rejected because dashboard
  pagination must not change summary truth.
- Technical debt introduced: no
- Scalability assessment: reuses existing live metric builder and avoids new
  persistence or endpoint contracts.
- Refinements made: kept historical aggregate stats on the existing DB
  aggregate path; only live open summary metrics use the full configured symbol
  scope.

### 7. Update Documentation and Knowledge
- Docs updated: this task doc, planning queue
- Context updated: project state and task board
- Learning journal updated: not applicable

## Review Checklist (mandatory)
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected for this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.

## Notes
This is read-model-only. It must not change signal generation, order creation,
position lifecycle, or exchange sync behavior.

## Scope
- Runtime session symbol-stats read model.
- Runtime scope E2E regression coverage.
- Canonical planning and context documentation.

## Implementation Plan
1. Add failing regression for two configured symbols with open positions and
   `limit=1`.
2. Preserve visible item limit while using full configured live metrics for
   summary.
3. Run focused and relevant runtime validations.
4. Update task, project state, task board, and planning queue.

## Acceptance Criteria
- `items` respects `limit`.
- `summary.openPositionCount`, `summary.openPositionQty`, and
  `summary.unrealizedPnl` include hidden configured symbols.
- Existing symbol filter behavior remains scoped to the requested symbol.

## Result Report

- Task summary: symbol-stats summary now reports full configured live
  open-position metrics even when visible `items` is limited.
- Files changed:
  - `apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.ts`
  - `apps/api/src/modules/bots/runtimeSymbolStatsReadModel.service.ts`
  - `apps/api/src/modules/bots/runtimeSymbolStatsEnrichment.service.ts`
  - `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/runtime-audit-50-symbol-stats-open-summary-limit-task-2026-05-03.md`
- How tested: focused failing-then-passing regression, runtime-scope e2e
  (`13/13`), monitoring aggregate e2e (`12/12`), API typecheck, repository
  guardrails, lint, and `git diff --check`.
- What is incomplete: nothing for this slice.
- Next steps: continue auditing remaining dashboard parity around LIVE import,
  wallet/capital, markets, strategies, and close-management state.
- Decisions made: visible symbol rows remain paginated; live open summary uses
  full configured symbols, and persisted position `unrealizedPnl` is used when
  no fresh price is available.
