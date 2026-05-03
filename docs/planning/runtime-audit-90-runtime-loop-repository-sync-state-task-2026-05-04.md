# Task

## Header

- ID: RUNTIME-AUDIT-90
- Title: fix(api-engine): align runtime loop repository with sync state
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: RUNTIME-AUDIT-89
- Priority: P0
- Iteration: 90
- Operation Mode: TESTER

## Process Self-Audit

- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context

Runtime/dashboard active-position reads and pre-trade guards now ignore stale
`ORPHAN_LOCAL` open rows. The runtime signal loop repository still reads
`status=OPEN` rows without requiring `syncState=IN_SYNC` in two foundational
queries used to hydrate managed external positions and count open positions for
bot/group caps.

## Goal

Make runtime signal loop repository reads use active synced position truth by
requiring `syncState=IN_SYNC` for managed external position hydration and
bot-symbol open-position counts.

## Success Signal

- User or operator problem: PAPER/LIVE bots can appear not to open despite
  conditions when stale rows are counted in runtime caps or managed imports.
- Expected product or reliability outcome: runtime loop cap/hydration reads
  match dashboard active-position truth.
- How success will be observed: repository-level regression proves both raw
  queries include `syncState=IN_SYNC`.
- Post-launch learning needed: no

## Deliverable For This Stage

Implemented and verified sync-state filtering in the runtime signal loop
repository.

## Constraints

- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Scope

- `apps/api/src/modules/engine/runtimeSignalLoop.repository.ts`
- `apps/api/src/modules/engine/runtimeSignalLoop.repository.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan

1. Add `syncState=IN_SYNC` to managed external position hydration query.
2. Add `syncState=IN_SYNC` to bot-symbol open-position count query.
3. Add focused repository regression coverage for both raw query predicates.
4. Run focused repository tests, API typecheck, guardrails, lint, and diff
   review.
5. Sync task, board, project state, and MVP planning evidence.

## Acceptance Criteria

- Runtime managed external position hydration excludes stale local rows.
- Runtime open-position cap counts exclude stale local rows.
- Focused tests assert query predicates directly.
- Existing validation remains green.

## Definition of Done

- [x] `DEFINITION_OF_DONE.md` is satisfied for this small runtime slice.
- [x] Focused regression covers both repository query predicates.
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

- Tests: `pnpm --filter api run test -- src/modules/engine/runtimeSignalLoop.repository.test.ts src/modules/engine/runtimeSignalLoopDefaults.test.ts --run` => PASS (`12/12`); `pnpm --filter api run typecheck` => PASS; `pnpm run quality:guardrails` => PASS; `pnpm run lint` => PASS; `git diff --check` => PASS.
- Manual checks: diff review completed.
- Screenshots/logs: not applicable
- High-risk checks: fail-closed repository predicate regression

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
- Rollback note: revert this commit to restore previous runtime repository reads
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State

- Issues: runtime loop repository raw reads used `status=OPEN` without
  `syncState=IN_SYNC`.
- Gaps: no direct predicate regression guarded these repository reads.
- Inconsistencies: dashboard/runtime/pre-trade active truth excludes stale rows,
  while runtime loop cap/hydration reads could still include them.
- Architecture constraints: runtime loop must use the canonical active position
  lifecycle truth.

### 2. Select One Priority Task

- Selected task: align runtime loop repository open-position reads with sync
  state.
- Priority rationale: this can directly affect bot opening decisions and managed
  external ownership hydration.
- Why other candidates were deferred: execution orchestrator lookup sync-state
  audit remains next candidate after this repository slice.

### 3. Plan Implementation

- Files or surfaces to modify: runtime loop repository, focused repository
  tests, planning/context docs.
- Logic: require `syncState=IN_SYNC` where repository reads active open position
  truth.
- Edge cases: historical closed rows remain outside these active queries; active
  `IN_SYNC` imports and bot positions remain included.

### 4. Execute Implementation

- Implementation notes: added `syncState=IN_SYNC` to managed external position
  hydration and bot-symbol open-position cap raw repository reads.

### 5. Verify and Test

- Validation performed: focused repository/runtime defaults tests, API
  typecheck, repository guardrails, lint, and diff whitespace check.
- Result: PASS.

### 6. Self-Review

- Simpler option considered: only cap count query, but managed external
  hydration would still drift.
- Technical debt introduced: no
- Scalability assessment: keeps repository predicates aligned with existing
  lifecycle semantics.
- Refinements made: added direct predicate-level repository tests instead of
  relying only on higher-level mocks.

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

This is a tester-mode active-truth lock for runtime loop repository reads.

## Production-Grade Required Contract

- Goal: prevent stale open-position rows from runtime loop cap/hydration truth.
- Scope: runtime loop repository, focused tests, source-of-truth docs.
- Implementation Plan: see above.
- Acceptance Criteria: see above.
- Definition of Done: see above and `DEFINITION_OF_DONE.md`.
- Result Report: completed below.

## Integration Evidence

## Product / Discovery Evidence

- Problem validated: yes
- User or operator affected: PAPER/LIVE bot operator
- Existing workaround or pain: manual reconciliation/DB cleanup before runtime
  cap and ownership truth line up
- Smallest useful slice: repository active sync-state filtering
- Success metric or signal: focused repository tests plus runtime validations
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: normal runtime dashboard/loop behavior

## Reliability / Observability Evidence

- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: runtime signal loop decides whether a bot can open
- SLI: runtime cap/hydration correctness
- SLO: no known stale-row inclusion in active runtime loop repository reads
- Error budget posture: not applicable
- Health/readiness check: unchanged
- Logs, dashboard, or alert route: existing runtime logs/dashboard
- Smoke command or manual smoke: focused automated regression
- Rollback or disable path: revert commit

- `INTEGRATION_CHECKLIST.md` reviewed: not applicable
- Real API/service path used: yes
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: automated repository-level test
- Regression check performed: focused repository predicate regression

## AI Testing Evidence

Not applicable.

## Security / Privacy Evidence

- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: trading/account metadata
- Trust boundaries: authenticated user bot/wallet/position scope
- Permission or ownership checks: repository reads remain user/bot scoped
- Abuse cases: stale local row blocks valid bot open or hydrates stale external
  ownership
- Secret handling: no secret changes
- Security tests or scans: typecheck/lint/guardrails
- Fail-closed behavior: active `IN_SYNC` rows still count; stale rows do not
- Residual risk: production authenticated smoke remains credential-dependent

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report

- Task summary: runtime loop repository active-position reads now require
  `syncState=IN_SYNC` for managed external hydration and bot-symbol cap counts.
- Files changed:
  `apps/api/src/modules/engine/runtimeSignalLoop.repository.ts`,
  `apps/api/src/modules/engine/runtimeSignalLoop.repository.test.ts`, and
  planning/context docs.
- How tested: focused runtime repository/defaults pack (`12/12`), API
  typecheck, guardrails, lint, and diff check.
- What is incomplete: authenticated production dashboard smoke remains
  credential-dependent and was not claimed in this slice.
- Next steps: continue auditing execution orchestrator lookup sync-state drift.
- Decisions made: active `IN_SYNC` rows remain counted/hydrated; stale rows are
  excluded.
