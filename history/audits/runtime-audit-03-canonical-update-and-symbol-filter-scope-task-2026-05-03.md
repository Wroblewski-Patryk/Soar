# RUNTIME-AUDIT-03 Canonical Update and Symbol Filter Scope

## Header
- ID: RUNTIME-AUDIT-03
- Title: Fail closed empty canonical update scope and keep symbol filters independent from pagination
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-02, DASHDRIFT-05, ORDDRIFT-01
- Priority: P1
- Iteration: 21
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The LIVE/PAPER audit has been closing residual places where direct legacy bot projections can override canonical `BotMarketGroup` and `MarketGroupStrategyLink` topology. After `RUNTIME-AUDIT-02` and `ORDDRIFT-01`, the remaining central update-scope helper still allowed disabled canonical strategy links or legacy `Bot.strategyId` to influence bot update defaults. During verification, the runtime symbol-stats read path also showed a selected-bot symbol-scope bug: explicit symbol filters were checked after pagination sliced configured symbols.

## Goal
Keep selected-bot runtime/update scope canonical and fail-closed:
- if canonical market-group topology exists without enabled strategy links, bot update defaults must not fall back to disabled links or direct legacy strategy ids,
- explicit runtime symbol-stat filters must validate against the full configured symbol scope before applying `limit`.

## Scope
- `apps/api/src/modules/bots/botCanonicalUpdateScope.service.ts`
- `apps/api/src/modules/bots/botCanonicalUpdateScope.service.test.ts`
- `apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.ts`
- `apps/api/src/modules/bots/bots.e2e.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/modules/api-bots.md`
- `docs/modules/api-positions.md`

## Implementation Plan
1. Update `resolveExistingCanonicalUpdateScope` so canonical topology with no enabled links returns `primaryStrategyId=null` and `enabledStrategyIds=[]`.
2. Add helper-level regression coverage for disabled-link canonical scope and legacy fallback only when canonical scope is absent.
3. Update runtime symbol-stats so configured symbols are validated before pagination limit is applied.
4. Verify focused and broader bot/runtime/position packs sequentially because DB e2e cleanup is global.
5. Update source-of-truth docs and context.

## Acceptance Criteria
- Canonical update scope with only disabled strategy links does not select disabled or legacy strategies.
- Legacy `Bot.strategyId` fallback remains available for bots without canonical market groups.
- `GET /dashboard/bots/:id/runtime-sessions/:sessionId/symbol-stats?symbol=ETHUSDT&limit=1` can return ETH when ETH is in configured scope but not first in the configured symbol list.
- Runtime symbol filters outside selected-bot canonical scope still return an empty zero-summary response.
- Relevant validation passes.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` satisfied for the touched backend slice.
- [x] Existing systems reused; no new topology or workaround introduced.
- [x] Fail-closed behavior covered by tests.
- [x] Docs and context updated.
- [x] Validation evidence recorded.

## Forbidden
- Reintroducing direct `Bot.strategyId` fallback when canonical topology exists.
- Letting `limit` decide whether a filtered symbol belongs to selected-bot scope.
- Adding alternate symbol-scope systems.
- Running DB-backed e2e evidence in parallel.

## Validation Evidence
- Tests:
  - `pnpm --filter api test -- src/modules/bots/botCanonicalUpdateScope.service.test.ts src/modules/bots/bots.duplicate-guard.e2e.test.ts src/modules/positions/livePositionReconciliation.service.test.ts --run --sequence.concurrent=false` PASS (`31/31`).
  - `pnpm --filter api test -- src/modules/bots/bots.e2e.test.ts -t "supports monitoring query filters" --run --sequence.concurrent=false` PASS (`1/1`, `25` skipped).
  - `pnpm --filter api test -- src/modules/bots/botCanonicalUpdateScope.service.test.ts src/modules/bots/bots.duplicate-guard.e2e.test.ts src/modules/bots/bots.e2e.test.ts src/modules/bots/bots.runtime-scope.e2e.test.ts src/modules/positions/livePositionReconciliation.service.test.ts src/modules/positions/positions.service.test.ts --run --sequence.concurrent=false` PASS (`68/68`).
- Manual checks: code review of update-scope helper and symbol-stats filter order.
- Screenshots/logs: not applicable.
- High-risk checks: money-impacting update/activation and LIVE reconciliation packs included.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/modules/api-bots.md`
  - `docs/modules/api-positions.md`
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: module docs updated.

## Deployment / Ops Evidence
- Deploy impact: low.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert this commit to restore previous compatibility fallback behavior.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: disabled canonical strategy links and legacy strategy ids could leak into update defaults; symbol-stats explicit filters were validated after `limit` slicing.
- Gaps: helper-level test coverage did not lock empty-link canonical scope.
- Inconsistencies: runtime selected-bot scope was canonical, but pagination could accidentally narrow the scope test.
- Architecture constraints: canonical topology is authoritative when present; legacy fields are compatibility fallback only.

### 2. Select One Priority Task
- Selected task: close residual canonical selected-bot scope drift in update defaults and runtime symbol filters.
- Priority rationale: affects dashboard truth and bot activation/update safety.
- Why other candidates were deferred: production readback/deploy work remains queued separately.

### 3. Plan Implementation
- Files or surfaces to modify: helper, symbol-stats read service, tests, docs/context.
- Logic: return no strategy from canonical scope with no enabled links; validate full configured symbol list before applying `limit`.
- Edge cases: disabled canonical link, no canonical group, filtered symbol not first in configured list.

### 4. Execute Implementation
- Implementation notes: reused existing helper and symbol resolver; no new system introduced.

### 5. Verify and Test
- Validation performed: focused helper/reconciliation tests and broader bot/runtime/position pack.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: changing only the failing e2e assertion to use BTC. Rejected because the ETH failure exposed real filter-order drift.
- Technical debt introduced: no.
- Scalability assessment: full configured symbol validation is independent from pagination and preserves existing result limiting.
- Refinements made: confirmed DB e2e false failure was caused by parallel cleanup and reran sequentially.

### 7. Update Documentation and Knowledge
- Docs updated: planning task, task board, project state, MVP queue, API module docs.
- Context updated: yes.
- Learning journal updated: not applicable; existing DB e2e sequential guardrail already covers the observed pitfall.

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
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Result Report
- Task summary: update-scope helper now fails closed for canonical groups without enabled links, and runtime symbol-stats validates explicit symbols against the full configured scope before pagination.
- Files changed: listed in `Scope`.
- How tested: validation commands listed above.
- What is incomplete: production readback/deploy verification remains queued as `LIVEIMPORT-03`.
- Next steps: continue the operator audit with the next smallest unchecked runtime/dashboard drift.
- Decisions made: ETH symbol-stats regression was treated as a real product bug, not a fixture-only issue.
