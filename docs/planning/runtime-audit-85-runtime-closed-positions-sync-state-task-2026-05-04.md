# Task

## Header
- ID: RUNTIME-AUDIT-85
- Title: Align runtime closed-position history with sync state
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: QA/Test
- Depends on: RUNTIME-AUDIT-84
- Priority: P0
- Iteration: 85
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The previous slices aligned active order and active position truth with
`syncState=IN_SYNC`. Tester-mode review found that closed runtime position
history and bot portfolio close points still accepted any `status=CLOSED`
position in scope, including local repair cleanup rows.

## Goal
Ensure runtime closed-position dashboard history and portfolio close points are
derived only from confirmed synced closed positions.

## Scope
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/botPortfolioHistoryRead.service.ts`
- `apps/api/src/modules/bots/bots.portfolio-history.e2e.test.ts`
- `apps/api/src/modules/engine/runtimeCapitalContext.service.ts`
- Canonical planning/context files for closure evidence

## Success Signal
- User or operator problem: stale local cleanup rows can inflate realized PnL
  and portfolio close history.
- Expected product or reliability outcome: closed-position counts, realized
  PnL, fees, and portfolio points reflect only confirmed runtime history.
- How success will be observed: focused portfolio e2e keeps summary/points at
  the synced close value while a scoped `ORPHAN_LOCAL` closed row is ignored.
- Post-launch learning needed: no

## Deliverable For This Stage
Verified code and regression test for runtime closed-position sync-state
filtering.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Add `syncState=IN_SYNC` to runtime closed-position read predicates.
2. Apply the same confirmed-history predicate to closed-position fee and
   continuity candidate branches.
3. Add `syncState=IN_SYNC` to portfolio direct close-point position reads.
4. Add `syncState=IN_SYNC` to runtime capital open/closed paper position
   queries so reference/free-cash capital cannot include cleanup rows.
5. Extend portfolio e2e coverage with a scoped closed `ORPHAN_LOCAL` row and
   assert it does not change summary or close points.
6. Run focused tests and repository validation gates.

## Acceptance Criteria
- Runtime closed history excludes `ORPHAN_LOCAL` closed positions.
- Portfolio history close points exclude `ORPHAN_LOCAL` closed positions.
- Synced closed positions remain counted and charted.
- Focused tests and relevant gates pass.

## Definition of Done
- [x] Implementation completed in the declared scope.
- [x] Regression coverage proves stale closed-position exclusion.
- [x] Relevant validations pass.
- [x] Canonical context and planning files are synchronized.
- [x] Result report is complete.

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
  - `pnpm --filter api run test -- src/modules/bots/bots.portfolio-history.e2e.test.ts --run` PASS (`3/3`)
  - `pnpm --filter api run test -- src/modules/bots/bots.runtime-scope.e2e.test.ts --run` PASS (`16/16`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
- Manual checks: `git diff --check` PASS
- Screenshots/logs: not applicable
- High-risk checks: focused regression covers realized PnL and portfolio point
  drift

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/README.md`,
  `docs/architecture/01_overview-and-principles.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not required

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore prior closed-position history
  filtering
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: closed runtime and portfolio reads accepted scoped local cleanup rows.
- Gaps: active rows had confirmed sync-state filtering, but closed history did
  not.
- Inconsistencies: aggregate summary and portfolio points could disagree with
  active-state cleanup semantics.
- Architecture constraints: runtime decisions and operator-facing history must
  be explainable and fail-closed.

### 2. Select One Priority Task
- Selected task: align runtime closed-position and portfolio close-point reads
  with sync state.
- Priority rationale: realized PnL and portfolio history are direct operator
  trust surfaces.
- Why other candidates were deferred: other wallet/strategy display audits
  remain lower priority than PnL/history correctness.

### 3. Plan Implementation
- Files or surfaces to modify: runtime positions read service, portfolio
  history read service, runtime capital context, portfolio e2e test,
  planning/context docs.
- Logic: require `syncState=IN_SYNC` wherever closed positions feed runtime
  dashboard history, portfolio close points, or paper runtime capital.
- Edge cases: scoped symbols, paper reset capital, open PnL partial
  completeness, stale local cleanup row with large realized PnL.

### 4. Execute Implementation
- Implementation notes: added confirmed sync-state filtering to runtime closed
  position reads, portfolio close-point reads, and runtime paper capital
  open/closed position queries.

### 5. Verify and Test
- Validation performed: focused portfolio-history e2e, runtime-scope e2e, API
  typecheck, repository guardrails, lint, and diff whitespace review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: filtering only portfolio points; rejected because
  aggregate realized PnL/closedCount would still drift.
- Technical debt introduced: no
- Scalability assessment: reuses existing Prisma predicates.
- Refinements made: kept the runtime positions read service under the
  production monolith line budget without adding an allowlist.

### 7. Update Documentation and Knowledge
- Docs updated: this task file, `docs/planning/mvp-next-commits.md`,
  `docs/planning/mvp-execution-plan.md`.
- Context updated: `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`.
- Learning journal updated: not applicable.

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

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: portfolio-history e2e (`3/3`) and runtime-scope
  e2e (`16/16`)

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: bot operator reviewing runtime/portfolio history
- Existing workaround or pain: stale local cleanup row can distort realized PnL
- Smallest useful slice: closed-position runtime/portfolio read predicates
- Success metric or signal: focused regression stays green
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: no
- Critical user journey: bot portfolio and runtime closed-history review
- SLI: correctness of closed-position read model
- SLO: closed dashboard rows reflect confirmed synced runtime state
- Error budget posture: not applicable
- Health/readiness check: unchanged
- Logs, dashboard, or alert route: unchanged
- Smoke command or manual smoke: focused API e2e
- Rollback or disable path: revert commit

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: no
- Data classification: user trading/runtime data
- Trust boundaries: authenticated user-owned bot/session endpoint
- Permission or ownership checks: unchanged existing ownership checks
- Abuse cases: stale local cleanup rows should not distort active operator PnL
  history
- Secret handling: none
- Security tests or scans: ownership path unchanged
- Fail-closed behavior: closed runtime rows require `IN_SYNC`
- Residual risk: generic unfiltered position history remains audit-oriented and
  intentionally out of scope

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report
- Task summary: runtime closed history, portfolio close points, and paper
  runtime capital now require confirmed synced positions for operator-facing
  closed-position truth.
- Files changed:
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
  - `apps/api/src/modules/bots/botPortfolioHistoryRead.service.ts`
  - `apps/api/src/modules/engine/runtimeCapitalContext.service.ts`
  - `apps/api/src/modules/bots/bots.portfolio-history.e2e.test.ts`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `docs/planning/runtime-audit-85-runtime-closed-positions-sync-state-task-2026-05-04.md`
- How tested: portfolio-history e2e (`3/3`), runtime-scope e2e (`16/16`),
  API typecheck, repository guardrails, lint, and `git diff --check`.
- What is incomplete: no work remains in this slice.
- Next steps: continue wallet/strategy dashboard drift audit.
- Decisions made: generic positions history remains unfiltered for audit; bot
  runtime and portfolio operator truth requires `IN_SYNC`.
