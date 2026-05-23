# Task

## Header

- ID: RUNTIME-AUDIT-91
- Title: fix(api-engine): align execution open lookup with sync state
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-90
- Priority: P0
- Iteration: 91
- Operation Mode: BUILDER

## Process Self-Audit

- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context

Runtime/dashboard active-position reads, pre-trade guards, and runtime loop
repository reads now ignore stale `ORPHAN_LOCAL` open rows. Execution
orchestration still resolves an "open position by symbol" with `status=OPEN`
only, which can make a stale row look active during LONG/SHORT/EXIT execution.

## Goal

Make runtime execution open-position lookup use active synced position truth by
requiring `syncState=IN_SYNC` for direct and LIVE imported fallback position
reads.

## Success Signal

- User or operator problem: a bot can ignore valid opens or close stale rows
  because execution lookup still sees cleanup rows as open.
- Expected product or reliability outcome: execution decisions match
  dashboard/pre-trade active-position truth.
- How success will be observed: focused regression proves open lookup predicate
  includes `syncState=IN_SYNC`.
- Post-launch learning needed: no

## Deliverable For This Stage

Implemented and verified sync-state filtering in execution open-position
lookup.

## Constraints

- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Scope

- `apps/api/src/modules/engine/executionOrchestrator.service.ts`
- `apps/api/src/modules/engine/executionOrchestrator.service.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan

1. Add `syncState=IN_SYNC` to the shared direct open-position lookup predicate.
2. Add `syncState=IN_SYNC` to LIVE imported fallback lookup.
3. Update focused execution orchestrator tests for the active lookup contract.
4. Run focused execution orchestrator tests, API typecheck, guardrails, lint,
   and diff review.
5. Sync task, board, project state, and MVP planning evidence.

## Acceptance Criteria

- Direct runtime execution open-position lookup excludes stale local rows.
- LIVE imported fallback lookup excludes stale local rows.
- Active `IN_SYNC` positions remain discoverable.
- Existing execution orchestrator behavior remains green.

## Definition of Done

- [x] `DEFINITION_OF_DONE.md` is satisfied for this small runtime slice.
- [x] Focused regression covers direct lookup predicate.
- [x] Relevant validation commands pass.
- [x] Context and planning docs are updated with evidence.

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

- Tests: `pnpm --filter api run test -- src/modules/engine/executionOrchestrator.service.test.ts --run` => PASS (`17/17`); `pnpm --filter api run typecheck` => PASS; `pnpm run quality:guardrails` => PASS; `pnpm run lint` => PASS; `git diff --check` => PASS.
- Manual checks: diff review completed.
- Screenshots/logs: not applicable
- High-risk checks: fail-closed execution lookup active-position truth

## Architecture Evidence

- Architecture source reviewed: `docs/architecture/01_overview-and-principles.md`,
  `docs/architecture/architecture-source-of-truth.md`,
  `docs/modules/system-modules.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not expected

## Deployment / Ops Evidence

- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous execution lookup
- Observability or alerting impact: existing runtime execution events continue
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State

- Issues: execution open-position lookup used `status=OPEN` without
  `syncState=IN_SYNC`.
- Gaps: lookup predicate test did not lock active sync-state truth.
- Inconsistencies: dashboard/pre-trade/runtime-loop active reads excluded stale
  rows while execution lookup could still include them.
- Architecture constraints: execution decisions must use canonical active
  position lifecycle truth.

### 2. Select One Priority Task

- Selected task: align execution open-position lookup with sync state.
- Priority rationale: this can directly affect open/close/no-flip decisions.
- Why other candidates were deferred: order/dedupe scans continue after this
  high-impact lookup drift is closed.

### 3. Plan Implementation

- Files or surfaces to modify: execution orchestrator service, focused test,
  planning/context docs.
- Logic: require `syncState=IN_SYNC` wherever execution resolves active open
  position by symbol.
- Edge cases: active LIVE imported bot-managed fallback remains included when
  synced; stale imported/local rows are excluded.

### 4. Execute Implementation

- Implementation notes: added `syncState=IN_SYNC` to the shared direct
  open-position lookup predicate and LIVE imported fallback lookup.

### 5. Verify and Test

- Validation performed: focused execution orchestrator suite, API typecheck,
  repository guardrails, lint, and diff whitespace check.
- Result: PASS.

### 6. Self-Review

- Simpler option considered: only direct predicate, but LIVE imported fallback
  would still drift.
- Technical debt introduced: no
- Scalability assessment: keeps execution lookup aligned with existing
  sync-state lifecycle.
- Refinements made: kept the change at the lookup boundary and preserved
  existing execution decision semantics.

### 7. Update Documentation and Knowledge

- Docs updated: this task, MVP next commits, MVP execution plan.
- Context updated: task board and project state.
- Learning journal updated: not applicable.

## Review Checklist

- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected for this iteration.
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

This is an execution safety slice for stale cleanup rows affecting runtime
open/close decisions.

## Production-Grade Required Contract

- Goal: prevent stale open-position rows from execution lookup truth.
- Scope: execution orchestrator lookup, focused tests, source-of-truth docs.
- Implementation Plan: see above.
- Acceptance Criteria: see above.
- Definition of Done: see above and `DEFINITION_OF_DONE.md`.
- Result Report: completed below.

## Integration Evidence

## Product / Discovery Evidence

- Problem validated: yes
- User or operator affected: PAPER/LIVE bot operator
- Existing workaround or pain: manual reconciliation/DB cleanup before runtime
  execution decisions line up
- Smallest useful slice: execution lookup active sync-state filtering
- Success metric or signal: focused execution tests plus validation pass
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: normal runtime execution logs/dashboard

## Reliability / Observability Evidence

- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: runtime execution opens/closes a bot position
- SLI: execution lookup correctness
- SLO: no known stale-row inclusion in active execution lookup
- Error budget posture: not applicable
- Health/readiness check: unchanged
- Logs, dashboard, or alert route: existing runtime execution events
- Smoke command or manual smoke: focused automated regression
- Rollback or disable path: revert commit

- `INTEGRATION_CHECKLIST.md` reviewed: not applicable
- Real API/service path used: yes
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: automated service-level test
- Regression check performed: focused execution lookup regression

## AI Testing Evidence

Not applicable.

## Security / Privacy Evidence

- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: trading/account metadata
- Trust boundaries: authenticated user bot/wallet/position scope
- Permission or ownership checks: execution reads remain user/bot/wallet scoped
- Abuse cases: stale local row blocks valid open or triggers invalid close
- Secret handling: no secret changes
- Security tests or scans: typecheck/lint/guardrails
- Fail-closed behavior: active `IN_SYNC` rows still drive execution; stale rows
  do not
- Residual risk: production authenticated smoke remains credential-dependent

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report

- Task summary: runtime execution open-position lookup now requires
  `syncState=IN_SYNC` for direct and LIVE imported fallback reads.
- Files changed:
  `apps/api/src/modules/engine/executionOrchestrator.service.ts`,
  `apps/api/src/modules/engine/executionOrchestrator.service.test.ts`, and
  planning/context docs.
- How tested: focused execution orchestrator suite (`17/17`), API typecheck,
  guardrails, lint, and diff check.
- What is incomplete: authenticated production dashboard smoke remains
  credential-dependent and was not claimed in this slice.
- Next steps: continue auditing order/dedupe active-row drifts.
- Decisions made: active `IN_SYNC` rows remain execution truth; stale open rows
  are excluded from runtime execution lookup.
