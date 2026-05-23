# Task

## Header
- ID: RUNTIME-AUDIT-83
- Title: Align runtime symbol live rows with synced active positions
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-82
- Priority: P1
- Iteration: 83
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime symbol stats enrich current market rows from live position rows. The
repository query already scopes by owner, bot, symbol, management mode, and
`status=OPEN`, but it did not require `syncState=IN_SYNC`. That can let stale
local rows inflate symbol-level open count, quantity, unrealized PnL, and
runtime market state.

## Goal
Ensure runtime symbol live rows use only active synced open positions.

## Scope
- `apps/api/src/modules/bots/botsRuntimeRead.repository.ts`
- `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`
- this task file

## Success Signal
- User or operator problem: market/symbol dashboard summaries must not count
  stale local open positions.
- Expected product or reliability outcome: symbol open-state summary matches
  active runtime position truth.
- How success will be observed: a scoped `OPEN + ORPHAN_LOCAL` position does
  not change symbol-stats open count, quantity, or unrealized PnL.
- Post-launch learning needed: no.

## Deliverable For This Stage
Implement the synced-state guard in symbol live-row reads, add focused e2e
coverage, run relevant API/repository validations, and sync canonical
planning/context.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- preserve `OPEN + IN_SYNC` symbol summary behavior

## Implementation Plan
1. Add `syncState=IN_SYNC` to `getRuntimeSymbolLiveRows` position query.
2. Extend runtime-scope e2e coverage with a scoped `OPEN + ORPHAN_LOCAL`
   position that must not alter symbol-stats summary.
3. Run focused runtime-scope e2e, API typecheck, guardrails, lint, and diff
   review.
4. Update canonical task, project-state, and MVP planning files.

## Acceptance Criteria
- Runtime symbol-stats summary excludes stale local open positions.
- Existing active synced open positions still contribute to summary counts.
- Focused validation passes and evidence is recorded.
- Canonical docs/context are updated.

## Definition of Done
- [ ] Runtime symbol live-row query requires `OPEN + IN_SYNC`.
- [ ] Regression coverage proves stale local live rows are ignored.
- [ ] Relevant validation commands pass.
- [ ] Canonical docs/context are updated.

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
- Tests:
  - `pnpm --filter api run test -- src/modules/bots/bots.runtime-scope.e2e.test.ts --run` PASS (`15/15`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
- Manual checks: `git diff --check` PASS with line-ending warnings only
- Screenshots/logs: not applicable
- High-risk checks: e2e proves a scoped `OPEN + ORPHAN_LOCAL` position does not
  change runtime symbol-stats open count, quantity, or unrealized PnL summary.

## Architecture Evidence
- Architecture source reviewed: `docs/governance/autonomous-engineering-loop.md`,
  prior active-state audit slices, and runtime symbol-stats read pipeline.
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
- Rollback note: revert this small repository/test/docs commit.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: symbol live-row query filters `OPEN` positions but not sync state.
- Gaps: stale local rows can inflate runtime symbol open-state KPIs.
- Inconsistencies: runtime positions and wallet KPIs now require synced active
  row truth.
- Architecture constraints: preserve configured symbol summary behavior and
  `IN_SYNC` active rows.

### 2. Select One Priority Task
- Selected task: align runtime symbol live rows with synced active positions.
- Priority rationale: symbol stats drive dashboard market truth and signal
  readiness displays.
- Why other candidates were deferred: this is a confirmed single-query drift in
  a current-state dashboard path.

### 3. Plan Implementation
- Files or surfaces to modify: bots runtime read repository, runtime-scope e2e,
  and canonical docs/context.
- Logic: add `syncState=IN_SYNC` to the live position query.
- Edge cases: `ORPHAN_LOCAL` ignored; `IN_SYNC` rows still contribute.

### 4. Execute Implementation
- Implementation notes: `getRuntimeSymbolLiveRows` now requires
  `syncState=IN_SYNC` for live position rows used by symbol-stats enrichment.

### 5. Verify and Test
- Validation performed: focused runtime-scope e2e, API typecheck, repository
  guardrails, lint, and diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: predicate-only repository fix, covered through
  existing API e2e path.
- Technical debt introduced: no
- Scalability assessment: query-level guard keeps downstream read-model
  composition unchanged.
- Refinements made: adjusted the e2e fixture to add a distinct scoped symbol so
  the regression respects the `userId + botId + symbol` uniqueness contract.

### 7. Update Documentation and Knowledge
- Docs updated: task file and MVP planning files.
- Context updated: `.codex/context/TASK_BOARD.md` and
  `.codex/context/PROJECT_STATE.md`.
- Learning journal updated: not applicable

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

## Notes
This task affects runtime symbol live metrics only. Position list/read models
and wallet PnL paths are covered by prior audit slices.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: not applicable for this narrow service
  guard.
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes, no schema change
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: pending

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable for
  this narrow owner-scoped read guard.
- Data classification: user-owned runtime symbol and position state
- Trust boundaries: authenticated user to owned bot runtime symbol endpoint
- Permission or ownership checks: existing `userId` and `botId` retained
- Abuse cases: stale local position cannot inflate dashboard symbol state
- Secret handling: none
- Security tests or scans: pending relevant validation
- Fail-closed behavior: only synced active rows contribute to symbol live rows
- Residual risk: authenticated production dashboard smoke is not claimed in
  this local slice

## Result Report
- Task summary: runtime symbol live rows now require `OPEN + IN_SYNC`, so stale
  local open positions no longer inflate symbol-stats open-state metrics.
- Files changed:
  - `apps/api/src/modules/bots/botsRuntimeRead.repository.ts`
  - `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `history/audits/runtime-audit-83-symbol-live-rows-sync-state-task-2026-05-04.md`
- How tested: focused runtime-scope e2e (`15/15`), API typecheck, guardrails,
  lint, and diff review all passed.
- What is incomplete: authenticated production dashboard smoke is not claimed
  in this local slice.
- Next steps: continue scanning bot portfolio/runtime aggregate projections.
- Decisions made: keep the fix at repository predicate level.
