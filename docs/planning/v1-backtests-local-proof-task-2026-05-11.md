# Task

## Header
- ID: V1-BACKTESTS-LOCAL-PROOF-2026-05-11
- Title: Prove Backtests local V1 contracts
- Task Type: test
- Current Stage: release
- Status: DONE
- Owner: QA/Test
- Depends on: V1-ORDERS-LOCAL-PROOF-2026-05-11
- Priority: P0
- Module Confidence Rows: SOAR-BACKTESTS-001
- Requirement Rows: REQ-FUNC-013
- Quality Scenario Rows: QA-013
- Risk Rows: RISK-013
- Iteration: 13
- Operation Mode: BUILDER
- Mission ID: V1-LOCAL-PROOF-BACKTESTS-2026-05-11
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed in the active V1 mission context.
- [x] `.agents/core/mission-control.md` was reviewed in the active V1 mission context.
- [x] Missing or template-like state tables were bootstrapped from repository sources, or confirmed not needed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task or mission improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: move Backtests from `UNVERIFIED` to evidence-backed `PASS_LOCAL` if focused API and Web proofs pass.
- Release objective advanced: V1 local proof coverage for backtest create/list/details/delete/report/timeline and replay/worker parity.
- Included slices: API Backtests lifecycle/replay/job/queue/parity tests, Web Backtests route/component/hook/util tests, source-of-truth state updates, regenerated V1 reports.
- Explicit exclusions: production-safe authenticated browser clickthrough, live-money actions, new feature work, architecture changes.
- Checkpoint cadence: one checkpoint after focused proof commands, one checkpoint after documentation/report sync.
- Stop conditions: failing focused test that indicates product behavior risk, architecture mismatch, missing local database configuration, or unapproved production/auth/live requirement.
- Handoff expectation: future agent can continue from the updated V1 ledger, scorecard, and Backtests task evidence without hidden chat context.

## Context
The refreshed V1 ledger marks Backtests as the next unblocked local module after Orders. API architecture is governed by `docs/modules/api-backtests.md`; Web architecture is governed by `docs/modules/web-backtest.md`.

## Goal
Prove the existing Backtests vertical slice locally across API and Web, then synchronize the V1 evidence ledgers if proof passes.

## Success Signal
- User or operator problem: V1 readiness is blocked by modules that have implementation but no focused action proof.
- Expected product or reliability outcome: Backtests local behavior is evidence-backed for run creation, lifecycle, reports, timeline, worker persistence, and UI actions.
- How success will be observed: focused API and Web test commands pass, Backtests state changes to `PASS_LOCAL`, and generated V1 scorecard reflects improved evidence coverage.
- Post-launch learning needed: yes

## Deliverable For This Stage
Focused verification evidence and synchronized source-of-truth files for Backtests local V1 proof.

## Scope
- `apps/api/src/modules/backtests/*`
- `apps/web/src/app/dashboard/backtests/*`
- `apps/web/src/features/backtest/*`
- `docs/operations/v1-product-action-audit-matrix-2026-05-10.md`
- `.agents/state/*` evidence ledgers touched by V1 module proof
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`
- `scripts/buildProjectIndex.mjs`
- generated `docs/operations/project-index-2026-05-11.*`, `v1-static-issue-scan-2026-05-11.*`, `v1-master-state-ledger-2026-05-11.*`, and `v1-completion-scorecard-2026-05-11.*`

## Implementation Plan
1. Run the focused API Backtests proof with local Postgres `DATABASE_URL` and test encryption env.
2. Run the focused Web Backtests route/component/hook/util proof.
3. If both pass, update Backtests rows in the product action matrix, ledgers, state files, and planning context.
4. Regenerate project index, static scan, master ledger, and completion scorecard.
5. Run relevant final gates and process cleanup checks.
6. Close this task with evidence and residual risk.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it
- keep production/live/authenticated browser proof separate from local proof

## Acceptance Criteria
- Focused API Backtests test command passes.
- Focused Web Backtests test command passes.
- Backtests is recorded as `PASS_LOCAL` with exact evidence.
- V1 generated reports are refreshed.
- Final gates pass or any failure is recorded with risk and next action.

## Definition of Done
- [x] Focused API Backtests proof passes.
- [x] Focused Web Backtests proof passes.
- [x] Product action matrix, module confidence, requirement, quality, risk, regression, project state, task board, and next-step docs are updated.
- [x] Generated V1 reports are refreshed.
- [x] Relevant final validation commands and process cleanup checks pass.

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
- production or live-money mutation

## Validation Evidence
- Tests: API Backtests proof passed (`12` files, `110` tests); Web Backtests proof passed (`13` files, `32` tests).
- Manual checks: regenerated project index, static scan, master ledger, and completion scorecard.
- Screenshots/logs: not applicable for this local proof
- High-risk checks: ownership, pending report, empty symbol fail-closed, parity diagnostics, worker persistence, and route/component state coverage included in focused tests.
- Module confidence ledger updated: yes
- Module confidence rows closed or changed: SOAR-BACKTESTS-001
- Requirements matrix updated: yes
- Requirement rows closed or changed: REQ-FUNC-013
- Quality scenarios updated: yes
- Quality scenario rows closed or changed: QA-013
- Risk register updated: yes
- Risk rows closed or changed: RISK-013
- Reality status: partially verified

## Architecture Evidence
- Architecture source reviewed: `docs/modules/api-backtests.md`, `docs/modules/web-backtest.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing Backtests routes and dashboard design system
- Canonical visual target: existing Backtests module implementation
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: existing V1 mission context
- Visual-direction brief reviewed: existing V1 mission context
- Existing shared pattern reused: Backtests list/create/details components and shared table/form primitives
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Visual gap audit completed: not applicable
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: no
- Remaining mismatches: production-safe clickthrough remains open
- Required states: loading, empty, error, success via focused component tests
- Responsive checks: deferred to production-safe/browser clickthrough
- Input-mode checks: deferred to production-safe/browser clickthrough
- Accessibility checks: focused route/component coverage only
- Parity evidence: API Backtests proof covers strategy-to-backtest-to-paper/live parity, 3-symbol paper alignment, and runtime kernel parity.

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: docs/test evidence only; revert this slice by reverting doc/report updates if needed
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Backtests is still `UNVERIFIED` in the V1 product action matrix.
- Gaps: production-safe browser clickthrough is not available in this local proof.
- Inconsistencies: none discovered before execution.
- Architecture constraints: use existing Backtests API/Web contracts, queue/job flow, and shared replay/runtime parity contracts.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files: none for this task
- Sources scanned: Backtests module docs, V1 matrix, current next steps, task board
- Rows created or corrected: SOAR-BACKTESTS-001, REQ-FUNC-013, QA-013, RISK-013, PAA-014
- Assumptions recorded: local focused tests are acceptable `PASS_LOCAL` proof but not release-ready production proof
- Blocking unknowns: none for local proof
- Why it was safe to continue: work is read/test/doc synchronization only, no production mutation

### 2. Select One Priority Mission Objective
- Selected task: Backtests local V1 proof.
- Priority rationale: first unblocked local module after Orders in the refreshed V1 queue.
- Why other candidates were deferred: production-safe clickthrough/auth/live blockers need operator inputs; Backtests can increase local evidence now.

### 3. Plan Implementation
- Files or surfaces to modify: evidence/state/docs only unless tests reveal a real regression.
- Logic: run focused tests, update state only after evidence.
- Edge cases: DB env loading, heavy replay suite duration, pending-report lifecycle, timeline/report fallback states.

### 4. Execute Implementation
- Implementation notes: no product code changes were needed; this slice verified existing Backtests contracts and synchronized evidence ledgers.

### 5. Verify and Test
- Validation performed: focused API Backtests suite, focused Web Backtests suite, generated V1 reports.
- Result: API `12` files / `110` tests PASS; Web `13` files / `32` tests PASS; generated reports show `PASS_LOCAL:13`, `UNVERIFIED:6`, `BLOCKED_AUTH:2`, implementation `72.3%`, evidence `41.1%`, release readiness `28.4%`.

### 6. Self-Review
- Simpler option considered: only changing the matrix without focused tests was rejected because it would be chat-only evidence.
- Technical debt introduced: no
- Scalability assessment: evidence updates reuse the existing V1 report generators and ledgers.
- Refinements made: Backtests next proof was narrowed to production-safe browser clickthrough on representative RSI strategy and market data.

### 7. Update Documentation and Knowledge
- Docs updated: V1 matrix, state ledgers, planning queue, generated reports, and this task.
- Context updated: yes
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
Safe assumption: existing focused API and Web test suites are the accepted local proof surface for Backtests. Risky assumption: local proof does not replace authenticated production clickthrough. Blocking assumptions: none for this local iteration.

## Production-Grade Required Contract
- Goal: prove Backtests local V1 behavior.
- Scope: Backtests API, Web, generated reports, and V1 evidence ledgers listed above.
- Implementation Plan: run focused tests, update evidence, regenerate reports, validate final gates.
- Acceptance Criteria: focused proof passes and source-of-truth files are synchronized.
- Definition of Done: this task follows `DEFINITION_OF_DONE.md` through targeted evidence, guardrails, and explicit residual risk.
- Result Report: complete below.

## Integration Evidence
API proof used local DB-backed routes/services and replay/worker contracts. Web proof used the Backtests route/component/hook/utility test surfaces. Production-safe browser clickthrough remains open.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: V1 release operator
- Existing workaround or pain: V1 status cannot honestly advance without module-specific proof.
- Smallest useful slice: local focused Backtests proof.
- Success metric or signal: Backtests `PASS_LOCAL` and scorecard evidence coverage increases.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: production-safe clickthrough remains next proof.

## User Feedback Evidence
- `docs/governance/user-feedback-loop.md` reviewed: existing V1 continuation context
- Feedback item IDs: not applicable
- Feedback accepted: continue until V1 is reached
- Feedback needs clarification: none for local proof
- Feedback conflicts: none
- Feedback deferred or rejected: live/production actions require explicit approved context
- Active task changed by feedback: yes
- New task created from feedback: yes
- Design memory updated: not applicable
- Learning journal updated: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: existing V1 continuation context
- Critical user journey: create backtest run and inspect/delete/report/timeline results
- SLI: focused proof command pass/fail
- SLO: local proof must pass before module is marked `PASS_LOCAL`
- Error budget posture: not applicable
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: not applicable
- Smoke command or manual smoke: focused API/Web proof commands
- Rollback or disable path: revert doc/report evidence updates if proof is invalidated
- `INTEGRATION_CHECKLIST.md` reviewed: existing V1 continuation context
- Real API/service path used: yes, local DB-backed API tests
- Endpoint and client contract match: yes
- DB schema and migrations verified: via focused tests
- Loading state verified: yes
- Error state verified: yes
- Refresh/restart behavior verified: not applicable
- Regression check performed: focused API/Web Backtests proof plus generated V1 report refresh

## AI Testing Evidence
Not applicable; Backtests proof does not change AI behavior.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: existing V1 continuation context
- Data classification: local test data only
- Trust boundaries: authenticated dashboard API and user-owned backtest resources
- Permission or ownership checks: verified via API tests
- Abuse cases: cross-user ownership, empty symbol fail-closed, missing report fallback
- Secret handling: no secrets written; local env variables only
- Security tests or scans: focused ownership tests and guardrails
- Fail-closed behavior: empty symbol, ownership, and pending report paths covered by focused tests
- Residual risk: production-safe authenticated proof remains open

## Result Report

- Task summary: Backtests moved from `UNVERIFIED` to `PASS_LOCAL` based on focused local API/Web proof.
- Files changed: evidence/state docs, V1 matrix, `scripts/buildProjectIndex.mjs`, generated V1 reports, and this task file.
- How tested: API Backtests suite (`12` files, `110` tests); Web Backtests suite (`13` files, `32` tests); V1 report generators.
- What is incomplete: production-safe browser clickthrough for Backtests remains open.
- Next steps: continue from generated ledger priority order; next unblocked local `toProve` module is Reports, while top release blockers remain production-safe clickthroughs and auth/ops gates.
- Decisions made: Backtests local proof is sufficient for `PASS_LOCAL`, not for release-ready `PASS`.
