# Task

## Header
- ID: RUNTIME-AUDIT-84
- Title: Align runtime open-position dashboard truth with sync state
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-83
- Priority: P0
- Iteration: 84
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Operator follow-up audit continues after active-order, active-position list,
wallet, repair, and symbol KPI sync-state fixes. The bot runtime positions
endpoint already treats active open orders as `syncState=IN_SYNC`, but the
runtime open-position read model still accepted any `status=OPEN` row in the
bot scope.

## Goal
Ensure bot runtime dashboard position truth includes only confirmed active open
positions while preserving closed history behavior for audit and realized PnL.

## Scope
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`
- Canonical planning/context files for closure evidence

## Success Signal
- User or operator problem: stale local orphan positions can appear on the bot
  runtime dashboard as active positions.
- Expected product or reliability outcome: dashboard open-position count,
  quantity, margin, and unrealized PnL reflect only synced active position
  truth.
- How success will be observed: focused runtime-scope e2e regression proves an
  `ORPHAN_LOCAL` open row is excluded while an `IN_SYNC` open row remains.
- Post-launch learning needed: no

## Deliverable For This Stage
Verified code and regression test for runtime open-position sync-state
filtering.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Add `syncState=IN_SYNC` to the runtime open-position read predicate.
2. Apply the same active-state predicate to open-position fee aggregation and
   continuity candidate reads so stale open rows cannot re-enter derived
   dashboard state.
3. Add a focused e2e regression with one confirmed open position and one stale
   local orphan open position in the same assigned market group.
4. Run focused runtime tests plus API/repository validation gates.

## Acceptance Criteria
- Runtime `openItems` excludes `ORPHAN_LOCAL` open positions.
- Runtime `openCount`, total, quantity, unrealized PnL, and capital free cash
  are derived from `IN_SYNC` active positions only.
- Closed position history behavior is not changed by this slice.
- Focused tests and relevant gates pass.

## Definition of Done
- [x] Implementation completed in the declared scope.
- [x] Regression coverage proves the stale-open-position exclusion.
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
  - `pnpm --filter api run test -- src/modules/bots/bots.runtime-scope.e2e.test.ts --run` PASS (`16/16`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
- Manual checks: `git diff --check` PASS
- Screenshots/logs: not applicable
- High-risk checks: fail-closed active-state filtering is covered by e2e

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/README.md`,
  `docs/architecture/01_overview-and-principles.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not required; implementation aligns with
  existing fail-closed runtime truth principle

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore prior runtime positions query
  behavior
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: runtime open orders already require `syncState=IN_SYNC`, but runtime
  open positions used only `status=OPEN`.
- Gaps: stale local-orphan open rows could affect `openItems`, `openCount`,
  open quantity, unrealized PnL, margin/free cash, and continuity-derived trade
  context.
- Inconsistencies: generic positions list, close commands, wallet reset, wallet
  PnL, and symbol live rows already use active sync-state semantics.
- Architecture constraints: runtime dashboard must be fail-closed and source of
  truth ownership must be explicit.

### 2. Select One Priority Task
- Selected task: align runtime open-position dashboard reads with sync state.
- Priority rationale: this is directly visible in the operator dashboard and
  can make stale local database rows appear as live bot positions.
- Why other candidates were deferred: portfolio closed-history local-orphan
  cleanup remains separate and lower priority than active dashboard truth.

### 3. Plan Implementation
- Files or surfaces to modify: runtime positions read service, runtime-scope
  e2e test, planning/context docs.
- Logic: require `syncState=IN_SYNC` for active open-position reads and open
  branches of derived fee/continuity predicates.
- Edge cases: scoped assigned symbols, mixed active/stale rows, capital summary
  derived from visible margin.

### 4. Execute Implementation
- Implementation notes: added active sync-state filtering to runtime open
  position reads, open-position fee aggregation, and continuity candidate
  reads; added focused runtime-scope e2e coverage.

### 5. Verify and Test
- Validation performed: focused runtime-scope e2e, API typecheck, repository
  guardrails, lint, and diff whitespace review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: filtering only serialized `openItems`; rejected
  because aggregate counts/PnL/margin would still drift.
- Technical debt introduced: no
- Scalability assessment: reuses existing Prisma predicate model and does not
  add a new abstraction.
- Refinements made: kept the runtime read service inside the existing
  production monolith line budget by tightening the predicate formatting
  instead of adding an allowlist.

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
- Regression check performed: runtime-scope e2e (`16/16`)

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: bot operator monitoring paper/live positions
- Existing workaround or pain: dashboard can show stale active position rows
- Smallest useful slice: active runtime positions read predicate
- Success metric or signal: focused regression stays green
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: no
- Critical user journey: bot runtime dashboard position monitoring
- SLI: correctness of active position read model
- SLO: active dashboard rows reflect confirmed synced runtime state
- Error budget posture: not applicable
- Health/readiness check: unchanged
- Logs, dashboard, or alert route: unchanged
- Smoke command or manual smoke: focused API e2e
- Rollback or disable path: revert commit

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: no
- Data classification: user trading/runtime data
- Trust boundaries: authenticated user-owned bot/session endpoint
- Permission or ownership checks: unchanged existing bot/session ownership
- Abuse cases: stale local row should not be actionable or visible as active
- Secret handling: none
- Security tests or scans: ownership path unchanged
- Fail-closed behavior: active rows require `IN_SYNC`
- Residual risk: closed local-orphan history parity remains a future audit
  candidate

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report
- Task summary: runtime open-position dashboard reads now require
  `syncState=IN_SYNC` for active position truth and derived open-state
  aggregates.
- Files changed:
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
  - `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `history/audits/runtime-audit-84-runtime-open-positions-sync-state-task-2026-05-04.md`
- How tested: runtime-scope e2e (`16/16`), API typecheck, repository
  guardrails, lint, and `git diff --check`.
- What is incomplete: no work remains in this slice.
- Next steps: continue runtime dashboard closed-history/portfolio audit.
- Decisions made: closed history remains out of scope for this active-state
  slice.
