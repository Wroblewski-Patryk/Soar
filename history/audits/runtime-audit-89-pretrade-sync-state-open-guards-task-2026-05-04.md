# Task

## Header

- ID: RUNTIME-AUDIT-89
- Title: fix(api-engine): align pre-trade open guards with sync state
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-88
- Priority: P0
- Iteration: 89
- Operation Mode: BUILDER

## Process Self-Audit

- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context

Operator-reported PAPER/LIVE runtime issues include bots not opening positions
even when dashboard conditions look ready. Previous runtime/dashboard slices
exclude stale `ORPHAN_LOCAL` rows from active truth, but the pre-trade read
store still counts any `status=OPEN` position for user/bot caps and same-symbol
guards.

## Goal

Make pre-trade open-position guards use active synced position truth by
requiring `syncState=IN_SYNC` for open-position counts and same-symbol checks.

## Success Signal

- User or operator problem: PAPER/LIVE bots can be blocked by stale local cleanup
  rows that dashboard/runtime no longer treat as active.
- Expected product or reliability outcome: pre-trade risk gates match dashboard
  active-position truth.
- How success will be observed: regression proves stale `ORPHAN_LOCAL`
  `OPEN` rows no longer block PAPER pre-trade caps or same-symbol checks.
- Post-launch learning needed: no

## Deliverable For This Stage

Implemented and verified sync-state filtering in the existing pre-trade
position read store.

## Constraints

- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Scope

- `apps/api/src/modules/engine/preTrade.service.ts`
- `apps/api/src/modules/engine/preTrade.e2e.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan

1. Add `syncState: IN_SYNC` to pre-trade user open-count reads.
2. Add `syncState: IN_SYNC` to bot direct open-count and same-symbol reads.
3. Add `syncState: IN_SYNC` to LIVE imported open-count and same-symbol reads.
4. Add a focused PAPER e2e regression for stale `ORPHAN_LOCAL` open rows.
5. Run focused pre-trade tests, API typecheck, guardrails, lint, and diff
   review.
6. Sync task, board, project state, and MVP planning evidence.

## Acceptance Criteria

- Stale `ORPHAN_LOCAL` open positions do not count toward user position limits.
- Stale `ORPHAN_LOCAL` open positions do not count toward bot position limits.
- Stale `ORPHAN_LOCAL` open positions do not trigger same-symbol conflict.
- Active `IN_SYNC` open positions remain counted and guarded.

## Definition of Done

- [x] `DEFINITION_OF_DONE.md` is satisfied for this small runtime slice.
- [x] Focused regression covers stale open-position pre-trade exclusion.
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

- Tests: `pnpm --filter api run test -- src/modules/engine/preTrade.e2e.test.ts src/modules/engine/preTrade.service.test.ts --run` => PASS (`25/25`); `pnpm --filter api run typecheck` => PASS; `pnpm run quality:guardrails` => PASS; `pnpm run lint` => PASS; `git diff --check` => PASS.
- Manual checks: diff review completed.
- Screenshots/logs: not applicable
- High-risk checks: fail-closed pre-trade active-position truth regression

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
- Rollback note: revert this commit to restore previous pre-trade open guards
- Observability or alerting impact: existing pre-trade audit logs continue
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State

- Issues: pre-trade open-position reads used `status=OPEN` without
  `syncState=IN_SYNC`.
- Gaps: no regression proved stale local cleanup rows cannot block PAPER opens.
- Inconsistencies: dashboard/runtime active reads ignore stale local rows while
  pre-trade guards could still count them.
- Architecture constraints: execution risk guards must use the same active
  position truth as runtime/dashboard.

### 2. Select One Priority Task

- Selected task: align pre-trade open-position guards with sync state.
- Priority rationale: this can directly prevent PAPER/LIVE position opening.
- Why other candidates were deferred: broader scans continue after this
  high-impact guard drift is closed.

### 3. Plan Implementation

- Files or surfaces to modify: pre-trade read store, focused e2e test,
  planning/context docs.
- Logic: require `syncState=IN_SYNC` in open-position count and same-symbol
  queries.
- Edge cases: imported LIVE positions and direct PAPER/LIVE positions should
  follow the same active-sync rule.

### 4. Execute Implementation

- Implementation notes: added `syncState=IN_SYNC` to pre-trade open-position
  user counts, bot counts, bot-scoped same-symbol checks, global same-symbol
  checks, and LIVE imported fallback reads.

### 5. Verify and Test

- Validation performed: focused pre-trade e2e/unit pack, API typecheck,
  repository guardrails, lint, and diff whitespace check.
- Result: PASS.

### 6. Self-Review

- Simpler option considered: only same-symbol guard, but caps would still drift.
- Technical debt introduced: no
- Scalability assessment: keeps guard semantics aligned with existing sync-state
  lifecycle.
- Refinements made: kept the change within existing read-store queries and
  avoided changing risk-reason semantics.

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

This is a runtime safety slice for stale cleanup rows blocking bot opens.

## Production-Grade Required Contract

- Goal: prevent stale open-position rows from blocking pre-trade.
- Scope: pre-trade read store, focused tests, source-of-truth docs.
- Implementation Plan: see above.
- Acceptance Criteria: see above.
- Definition of Done: see above and `DEFINITION_OF_DONE.md`.
- Result Report: completed below.

## Integration Evidence

## Product / Discovery Evidence

- Problem validated: yes
- User or operator affected: PAPER/LIVE bot operator
- Existing workaround or pain: manual DB/reconciliation cleanup before bot can
  open again
- Smallest useful slice: pre-trade active sync-state filtering
- Success metric or signal: regression test plus pre-trade suite pass
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: normal pre-trade audit logs/dashboard

## Reliability / Observability Evidence

- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: bot pre-trade approval before opening a position
- SLI: pre-trade guard correctness
- SLO: no known stale-row block on active pre-trade truth
- Error budget posture: not applicable
- Health/readiness check: unchanged
- Logs, dashboard, or alert route: existing pre-trade audit logs
- Smoke command or manual smoke: focused automated regression
- Rollback or disable path: revert commit

- `INTEGRATION_CHECKLIST.md` reviewed: not applicable
- Real API/service path used: yes
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: automated service-level test
- Regression check performed: focused pre-trade regression

## AI Testing Evidence

Not applicable.

## Security / Privacy Evidence

- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: trading/account metadata
- Trust boundaries: authenticated user bot/wallet/position scope
- Permission or ownership checks: pre-trade reads remain user/bot scoped
- Abuse cases: stale local row blocks valid bot open
- Secret handling: no secret changes
- Security tests or scans: typecheck/lint/guardrails
- Fail-closed behavior: active `IN_SYNC` rows still block; stale rows do not
- Residual risk: production authenticated smoke remains credential-dependent

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report

- Task summary: pre-trade open-position guards now require active
  `syncState=IN_SYNC` truth, so stale local cleanup rows no longer block PAPER
  or LIVE opens through caps or same-symbol checks.
- Files changed: `apps/api/src/modules/engine/preTrade.service.ts`,
  `apps/api/src/modules/engine/preTrade.e2e.test.ts`, and planning/context
  docs.
- How tested: focused pre-trade e2e/unit pack (`25/25`), API typecheck,
  guardrails, lint, and diff check.
- What is incomplete: authenticated production dashboard smoke remains
  credential-dependent and was not claimed in this slice.
- Next steps: continue auditing remaining LIVE/PAPER dashboard-runtime drifts.
- Decisions made: active `IN_SYNC` rows remain blocking; stale
  `ORPHAN_LOCAL` open rows are ignored by pre-trade.
