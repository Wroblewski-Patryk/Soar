# Task

## Header
- ID: RUNTIME-AUDIT-122
- Title: Preserve aggregate account balance capital summary
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-121
- Priority: P1
- Iteration: 122
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The per-session runtime positions summary can return `accountBalance` even when
`referenceBalance` and `freeCash` are unavailable. Aggregate capital summary
selection currently treats only `referenceBalance` or `freeCash` as usable, so
an account-balance-only current snapshot can be skipped.

## Goal
Make aggregate capital summary selection preserve the latest usable
`accountBalance` snapshot.

## Success Signal
- User or operator problem: aggregate dashboard account balance can disappear
  or fall back to older data when the latest snapshot has only account balance.
- Expected product or reliability outcome: account balance remains visible when
  the runtime service has a valid account balance.
- How success will be observed: focused unit tests cover account-balance-only
  capital summary selection.
- Post-launch learning needed: no

## Deliverable For This Stage
Release a verified aggregate account-balance capital summary selection.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Scope
- `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Add a small tested helper for latest usable aggregate capital summary.
2. Treat finite `accountBalance` as usable capital summary evidence.
3. Run focused unit tests plus typecheck, guardrails, lint, and diff review.
4. Update task, project state, and queue docs.

## Acceptance Criteria
- A summary with only finite `accountBalance` is selected.
- A summary with all capital numbers unavailable is skipped.
- Existing `referenceBalance`/`freeCash` behavior remains valid.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` standards are satisfied for this slice.
- [x] Focused tests pass.
- [x] Typecheck, guardrails, and lint pass.
- [x] Documentation and queue state are updated.

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
  - `pnpm --filter api exec vitest run src/modules/bots/runtimeSessionPositionsRead.service.test.ts`
    PASS (`15/15`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
- Manual checks: diff review and `git diff --check` PASS
- Screenshots/logs: not applicable
- High-risk checks: read-only aggregate capital metadata

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`,
  `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous aggregate capital
  summary selection
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: account-balance-only summaries are ignored by aggregate capital
  summary selection.
- Gaps: dashboard can lose account balance even when the latest runtime
  positions summary contains it.
- Inconsistencies: per-session summary exposes `accountBalance`, aggregate
  selection only recognizes `referenceBalance`/`freeCash`.
- Architecture constraints: dashboard read-models should preserve available
  wallet/capital truth from existing service outputs.

### 2. Select One Priority Task
- Selected task: preserve aggregate account balance capital summary.
- Priority rationale: small dashboard wallet/capital visibility fix matching
  operator-reported account balance instability.
- Why other candidates were deferred: broader wallet refresh behavior needs a
  separate service/runtime audit.

### 3. Plan Implementation
- Files or surfaces to modify: aggregate read service, focused unit test,
  planning/context docs.
- Logic: select the first fresh summary with finite reference balance, free
  cash, or account balance.
- Edge cases: null numbers, account-balance-only snapshot, older fallback rows.

### 4. Execute Implementation
- Implementation notes: added `selectRuntimeAggregateLatestCapitalSummary` and
  changed aggregate capital summary selection to treat finite `accountBalance`
  as usable capital evidence.

### 5. Verify and Test
- Validation performed: focused runtime session position unit suite, API
  typecheck, repository guardrails, lint, and diff review.
- Result: PASS

### 6. Self-Review
- Simpler option considered: append `accountBalance` to the inline predicate;
  a named helper keeps the capital-summary selection contract testable.
- Technical debt introduced: no
- Scalability assessment: unchanged linear scan over already sorted session
  rows.
- Refinements made: helper typing preserves the full summary fields consumed
  by the aggregate.

### 7. Update Documentation and Knowledge
- Docs updated: task contract and queue docs.
- Context updated: project state and task board.
- Learning journal updated: not applicable

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

## Notes
This is a read-only aggregate dashboard fix. It does not change wallet
persistence, exchange synchronization, or balance fetch behavior.

## Production-Grade Required Contract

Every task must include these mandatory sections before it can move to `READY`
or `IN_PROGRESS`: Goal, Scope, Implementation Plan, Acceptance Criteria,
Definition of Done, and Result Report.

## Integration Evidence

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: focused runtime session position unit suite

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: dashboard operator reviewing aggregate wallet and
  capital summary.
- Existing workaround or pain: account balance can disappear when only
  `accountBalance` is available in the latest summary.
- Smallest useful slice: capital summary selection parity.
- Success metric or signal: focused helper tests pass.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: bot runtime monitoring aggregate wallet/capital
  summary.
- SLI: aggregate capital summary preserves available account balance.
- SLO: no change.
- Error budget posture: not applicable
- Health/readiness check: no change.
- Logs, dashboard, or alert route: no change.
- Smoke command or manual smoke: focused unit tests.
- Rollback or disable path: revert this commit.

## AI Testing Evidence
Not applicable.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: runtime dashboard wallet/capital metadata.
- Trust boundaries: no query scope changes.
- Permission or ownership checks: unchanged.
- Abuse cases: none introduced.
- Secret handling: none.
- Security tests or scans: typecheck and focused unit assertion.
- Fail-closed behavior: not applicable.
- Residual risk: DB-backed e2e remains dependent on local PostgreSQL
  availability.

## Result Report

- Task summary: aggregate capital summary selection now preserves
  account-balance-only snapshots instead of skipping them.
- Files changed:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `history/audits/runtime-audit-122-aggregate-account-balance-summary-task-2026-05-04.md`
- How tested: focused unit suite (`15/15`), API typecheck, repository
  guardrails, lint, and diff review.
- What is incomplete: nothing in this slice.
- Next steps: continue auditing wallet/capital display parity around refresh
  timing and aggregate pagination.
- Decisions made: finite `accountBalance` is valid evidence for aggregate
  capital summary selection.
