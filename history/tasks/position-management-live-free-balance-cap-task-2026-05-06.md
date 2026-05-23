# Task

## Header
- ID: PMPLC-11
- Title: Cap LIVE runtime free cash by exchange free balance
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-10
- Priority: P0
- Iteration: 11
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
LIVE runtime capital snapshots use exchange balances and local reserved margin
to decide whether DCA adds are fundable. The previous resolver treated a single
extracted exchange balance as account balance, so if the exchange returned both
`total` and lower `free`, runtime could overestimate available DCA cash.

## Goal
Use exchange `total` for account/allocation reference while capping LIVE
`freeCash` and DCA affordability by exchange `free` when available.

## Scope
- `apps/api/src/modules/engine/runtimeCapitalContext.service.ts`
- `apps/api/src/modules/engine/runtimeCapitalContext.service.test.ts`
- Planning/context documentation for the completed slice.

## Success Signal
- User or operator problem: LIVE DCA must not be considered fundable when
  exchange free balance is lower than locally estimated free cash.
- Expected product or reliability outcome: LIVE runtime capital checks fail
  closed against exchange free balance.
- How success will be observed: regression proves DCA is exhausted when
  required margin exceeds exchange free balance even though total balance is
  higher.
- Post-launch learning needed: no

## Deliverable For This Stage
Verified code and documentation update for the completed fix slice.

## Constraints
- Reuse existing wallet balance payload shape.
- Do not add a new ledger or wallet subsystem.
- Do not change PAPER capital behavior.
- Keep reference balance allocation based on account/total balance.

## Implementation Plan
1. Return `{ accountBalance, freeBalance }` from LIVE balance extraction.
2. Keep numeric dependency responses compatible for existing tests/callers.
3. Cache `freeBalance` with the LIVE balance snapshot.
4. Resolve LIVE `freeCash` as the lower of allocated local free cash and
   exchange free balance when exchange free is present.
5. Record live wallet snapshots with the actual exchange free balance.
6. Add a regression for total balance higher than free balance.
7. Run focused runtime tests and repository quality gates.

## Acceptance Criteria
- LIVE account/reference balance remains based on account/total balance.
- LIVE free cash is capped by exchange free balance when present.
- Cached LIVE snapshots preserve the free-balance cap.
- DCA funds exhaustion uses capped LIVE free cash.
- Focused regression and quality gates pass.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations satisfied for this tiny runtime
  capital slice.
- [x] Focused runtime tests pass.
- [x] API typecheck passes.
- [x] Repository guardrails, lint, and diff check pass.
- [x] Source-of-truth docs are updated.

## Forbidden
- New systems without approval.
- Duplicated logic or parallel implementations of the same contract.
- Temporary bypasses, hacks, or workaround-only paths.
- Architecture changes without explicit approval.
- Implicit stage skipping.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/engine/runtimeCapitalContext.service.test.ts --run` PASS (`18/18`).
  - `pnpm --filter api exec vitest run src/modules/engine/runtimeCapitalContext.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/engine/positionManagement.service.test.ts --run` PASS (`76/76`).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm run quality:guardrails` PASS.
  - `pnpm run lint` PASS.
  - `git diff --check` PASS with CRLF warnings only.
- Manual checks: reviewed focused diff for fail-closed LIVE DCA affordability
  and cache consistency.
- Screenshots/logs: not applicable.
- High-risk checks: LIVE DCA funding now caps by exchange free balance.

## Architecture Evidence
- Architecture source reviewed:
  `docs/architecture/reference/position-management-pnl-lifecycle-contract.md`,
  `docs/architecture/reference/runtime-signal-merge-contract.md`.
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
- Rollback note: revert this slice to restore previous LIVE free-cash estimate.
- Observability or alerting impact: wallet balance snapshots now preserve
  exchange free balance when available.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: LIVE balance extraction preferred total and discarded exchange free
  balance.
- Gaps: DCA affordability could be checked against locally estimated free cash
  above the exchange free balance.
- Inconsistencies: wallet preview already preserved account/free separately,
  while runtime capital did not.
- Architecture constraints: money-impacting LIVE automation must fail closed
  when fundability is uncertain or insufficient.

### 2. Select One Priority Task
- Selected task: cap LIVE runtime free cash by exchange free balance.
- Priority rationale: prevents live DCA from being attempted with unavailable
  exchange funds.
- Why other candidates were deferred: exchange protection-order placement is a
  larger vertical slice and remains separate.

### 3. Plan Implementation
- Files or surfaces to modify: runtime capital context, runtime capital tests,
  planning/context docs.
- Logic: preserve account total for allocation, cap free cash by exchange free.
- Edge cases: cached balance, fixed/percent allocation, missing free balance,
  legacy numeric test dependency responses.

### 4. Execute Implementation
- Implementation notes: added a small normalizer and free-cash resolver inside
  the existing runtime capital context.

### 5. Verify and Test
- Validation performed: focused capital suite, wider runtime DCA/position suite,
  API typecheck, guardrails, lint, diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: replacing account balance with free balance would
  break allocation semantics, so the fix keeps both values.
- Technical debt introduced: no
- Scalability assessment: keeps compatibility with existing dependency stubs
  while allowing richer exchange balance truth.
- Refinements made: cached LIVE snapshots include free balance and wallet
  ledger snapshots receive actual free balance.

### 7. Update Documentation and Knowledge
- Docs updated: this task doc, MVP queue, MVP execution plan.
- Context updated: project state and task board.
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
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: yes

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: LIVE runtime operator.
- Existing workaround or pain: runtime could estimate DCA funds above exchange
  free balance.
- Smallest useful slice: preserve exchange free balance and cap runtime free
  cash with it.
- Success metric or signal: regression and focused suites pass.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: LIVE DCA fundability checks.
- SLI: runtime capital correctness test pass rate.
- SLO: relevant regression suites pass before release.
- Error budget posture: healthy
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: wallet balance ledger receives actual
  `freeBalance` when available.
- Smoke command or manual smoke: focused vitest suites.
- Rollback or disable path: revert this slice.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: exchange balance and trading automation data.
- Trust boundaries: exchange read adapter to runtime capital resolver.
- Permission or ownership checks: existing API key ownership checks retained.
- Abuse cases: stale or overestimated free cash can cause invalid live DCA
  attempts.
- Secret handling: no changes.
- Security tests or scans: not applicable.
- Fail-closed behavior: DCA required margin above exchange free balance is
  exhausted.
- Residual risk: exchange protection-order vertical slice remains separate.

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report
- Task summary: LIVE runtime capital now preserves exchange account/free
  balance separately and caps free cash by exchange free balance.
- Files changed:
  - `apps/api/src/modules/engine/runtimeCapitalContext.service.ts`
  - `apps/api/src/modules/engine/runtimeCapitalContext.service.test.ts`
  - `history/tasks/position-management-live-free-balance-cap-task-2026-05-06.md`
- How tested: focused and widened runtime vitest suites, API typecheck,
  guardrails, lint, and diff check.
- What is incomplete: no known incomplete work in this slice.
- Next steps: continue with the next smallest money-impacting v1 gap from the
  active PMPLC queue.
- Decisions made: LIVE account allocation remains based on account/total
  balance, while DCA fundability is capped by exchange free balance.
