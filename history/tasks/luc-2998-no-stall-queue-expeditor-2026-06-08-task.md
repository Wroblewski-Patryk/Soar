# Task

## Header
- ID: LUC-2998
- Title: [Soar][PM] No-stall queue expeditor
- Task Type: research
- Current Stage: planning
- Status: DONE
- Owner: Soar Product Manager
- Depends on: LUC-12
- Priority: P0
- Module Confidence Rows: not applicable - PM queue routing only
- Requirement Rows: not applicable - evidence backlog routing only
- Quality Scenario Rows: not applicable
- Risk Rows: V1 release confidence evidence backlog
- Iteration: 2026-06-08 heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-2998-NO-STALL-QUEUE-EXPEDITOR-2026-06-08
- Mission Status: CHECKPOINTED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the PM queue heartbeat scope.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was covered by the active Soar startup contract; this heartbeat used the current state files and awareness report.
- [x] `.agents/core/mission-control.md` was covered by the active Soar startup contract; this heartbeat continued the no-stall mission pattern.
- [x] Missing or template-like state tables were not part of this bounded coordination task.
- [x] Affected module confidence rows were identified as not applicable.
- [x] Affected requirement, quality scenario, and risk rows were identified as not applicable for code behavior.
- [x] The task improves release confidence by routing the next evidence backlog row.

## Mission Block
- Mission objective: keep the Soar V1 audit-to-completion evidence queue moving without opening duplicate or protected lanes.
- Release objective advanced: reduce architecture-awareness actionable missing-test backlog through one next local-safe delegated lane.
- Included slices: issue heartbeat-context readback, architecture-awareness top-list review, duplicate/protected lane filtering, child issue creation, state/evidence update.
- Explicit exclusions: code implementation, production/stage restore drill, protected proof, secret, deploy, push, restart, rollback, database mutation, exchange/order/position/account/payment/subscription/live-trading action.
- Checkpoint cadence: one PM decision/handoff in this heartbeat.
- Stop conditions: one child issue created with owner, scope, proof, and forbidden actions; parent issue closed with evidence.
- Handoff expectation: Test Automation executes LUC-3001 or explicitly classifies untestable anchors.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Soar Product Manager | LUC-2998 wake payload; heartbeat-context; architecture-awareness report | Paperclip issue and Soar state/evidence files | Child issue and parent closure | API readback and local checks | DONE |
| QA/Test | Test Automation Engineer | LUC-3001 | `scripts/runRestoreDrillEvidence.mjs`; possible test/relation rows | Focused helper proof or explicit classification | Focused Node proof, graph/guardrails as needed | DELEGATED |

### Lane Checks
- [x] `.agents/state/active-mission.md` was refreshed.
- [x] Responsibility lanes were applied through Paperclip issue ownership.
- [x] Every important responsibility has an owner or explicit omission.
- [x] No two write lanes own the same file in this PM checkpoint.
- [x] Each lane has expected output and validation/proof.
- [x] Missing ownership was not discovered.

## Context
LUC-2998 was assigned as a critical Soar PM no-stall routine under LUC-12. The latest wake had no pending comments and did not require fallback thread fetch. The issue description requires concrete action, not a plan-only heartbeat.

## Goal
Find the next actionable non-duplicate Soar evidence backlog item and route it to the correct specialist with clear proof expectations.

## Success Signal
- User or operator problem: the audit-to-completion queue must not stall on stale report rows or protected evidence families.
- Expected product or reliability outcome: a concrete Test Automation lane exists for the next local-safe missing-test family.
- How success will be observed: LUC-3001 exists with owner, scope, proof, and forbidden actions.
- Post-launch learning needed: no.

## Deliverable For This Stage
A PM queue checkpoint with child issue delegation and durable project memory.

## Constraints
- use existing Paperclip issue routing and Soar source-truth files
- do not introduce new structures
- do not implement specialist work as PM
- do not run protected or production restore drill commands
- preserve dirty worktree changes from other lanes

## Definition of Done
- [x] Current issue context and state evidence reviewed.
- [x] Next non-duplicate local-safe family selected.
- [x] Child issue created for the correct specialist with proof expectations.
- [x] Parent issue disposition updated to done.
- [x] Soar state/evidence files updated.

## Stage Exit Criteria
- [x] The output matches the declared `planning` coordination stage.
- [x] Work from later stages was not mixed in.
- [x] Risks and assumptions are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations
- temporary bypasses or workaround-only paths
- architecture changes without explicit approval
- production/stage restore drill execution
- protected proof, secrets, deploy, push, restart, rollback, database mutation, exchange/order/position/account/payment/subscription/live-trading action

## Validation Evidence
- Tests:
  - `node --check scripts/runRestoreDrillEvidence.mjs` -> PASS.
  - `pnpm softwarehouse:control-tick` -> blocked/unavailable: `Command "softwarehouse:control-tick" not found`.
- Manual checks:
  - Paperclip heartbeat-context readback for LUC-2998 -> PASS: status `in_progress`, priority `critical`, parent LUC-12, no comments, no first-class blockers.
  - `docs/status/architecture-awareness-report.md` generated `2026-06-08T00:37:30.029Z` reports `115` actionable missing-test links, `0` actionable missing-doc links, `0` ownerless entities, and `0` disconnected entities.
  - `scripts/runRestoreDrillEvidence.test.mjs` absent.
  - `docs/architecture/relations/priority-test-links.csv` has only a LUC-2252 wrapper relation for `scripts/runRestoreDrillEvidence.mjs`.
- Screenshots/logs: not applicable.
- High-risk checks: no protected/prod/deploy/db/trading action run.
- Module confidence ledger updated: not applicable.
- Requirements matrix updated: not applicable.
- Quality scenarios updated: not applicable.
- Risk register updated: not applicable.
- Reality status: verified for PM delegation; implementation deferred to LUC-3001.

## Architecture Evidence
- Architecture source reviewed: `docs/status/architecture-awareness-report.md`; `docs/architecture/relations/priority-test-links.csv`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: LUC-3001 should add direct relation rows if it implements focused proof.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: not applicable.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: architecture-awareness top rows include protected/browser/process families, stale RC strict helper rows, then restore drill evidence helper rows.
- Gaps: `scripts/runRestoreDrillEvidence.test.mjs` is absent; only script-level wrapper relation exists.
- Inconsistencies: LUC-2997 completed RC strict helper proof but local awareness report still lists RC rows because the refresh script is absent in this checkout.
- Architecture constraints: use scanner-readable relation rows; do not fake proof for side-effect orchestration.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: heartbeat-context, awareness report, task board/state files, runRestoreDrillEvidence script, priority-test-links.
- Rows created or corrected: LUC-2998 state/evidence rows.
- Assumptions recorded: stale RC rows are not reopened because LUC-2997 owns proof and relation evidence.
- Blocking unknowns: none for PM routing.
- Why it was safe to continue: selected work is delegated local helper proof/classification only.

### 2. Select One Priority Mission Objective
- Selected task: create Test Automation child for `scripts/runRestoreDrillEvidence.mjs` missing-test rows.
- Priority rationale: first non-duplicate local-safe family after protected/browser/process families and stale LUC-2997 rows.
- Why other candidates were deferred: protected browser/prod rows require existing proof lanes or protected context; RC strict rows already have LUC-2997 proof.

### 3. Plan Implementation
- Files or surfaces to modify: Paperclip issue only for delegated specialist; Soar state/evidence files for PM checkpoint.
- Logic: route exact anchors with proof and forbidden actions.
- Edge cases: classify side-effect orchestration rather than unit-claiming false coverage.

### 4. Execute Implementation
- Implementation notes: created LUC-3001 assigned to Test Automation Engineer.

### 5. Verify and Test
- Validation performed: heartbeat-context readback, awareness report review, syntax check, issue creation readback.
- Result: PASS for PM delegation; control-tick unavailable.

### 6. Self-Review
- Simpler option considered: comment-only recommendation.
- Technical debt introduced: no.
- Scalability assessment: follows existing one-child-per-family expeditor pattern.
- Refinements made: explicitly excluded real restore drill/protected operations.

### 7. Update Documentation and Knowledge
- Docs updated: this task file; active mission; next steps; task board; project state.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to the PM heartbeat scope.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs/context updated.
- [x] Learning journal update not required.
- [x] Required responsibility lanes were integrated or tracked as follow-up.
- [x] Parent validation ran through PM issue disposition.

## Notes
- Child issue: [LUC-3001](/LUC/issues/LUC-3001).
- Parent issue: [LUC-2998](/LUC/issues/LUC-2998).
- Ancestor: [LUC-12](/LUC/issues/LUC-12).

## Production-Grade Required Contract

### Goal
Route the next local-safe missing-test family to the correct specialist without protected operations.

### Scope
- Paperclip issue: LUC-2998.
- Created child issue: LUC-3001.
- Evidence candidate: `scripts/runRestoreDrillEvidence.mjs`.
- State/evidence files updated in this PM checkpoint.

### Implementation Plan
1. Read wake and role constraints.
2. Review heartbeat-context and architecture-awareness report.
3. Filter duplicate/protected/stale families.
4. Create child issue for the next local-safe family.
5. Update source-of-truth state/evidence.
6. Close parent with evidence.

### Acceptance Criteria
- LUC-3001 exists and is assigned to Test Automation.
- LUC-3001 names exact anchors and forbidden actions.
- LUC-2998 closes as delegated, not left passively in progress.

### Definition of Done
Satisfied for PM coordination with evidence above. Product/runtime implementation remains delegated.

## Integration Evidence
- Real API/service path used: Paperclip API issue heartbeat-context and issue create/update.
- Regression check performed: local syntax check only; no runtime mutation.

## Security / Privacy Evidence
- Data classification: repo metadata and public issue coordination only.
- Trust boundaries: no secrets, no protected auth, no production account.
- Permission or ownership checks: child assigned to Test Automation; PM did not implement specialist work.
- Abuse cases: avoid running production restore drill or mutating DB from a PM heartbeat.
- Secret handling: no secret read or written.
- Security tests or scans: not applicable.
- Fail-closed behavior: protected/prod actions explicitly forbidden in child issue.
- Residual risk: LUC-3001 must verify or classify anchors.

## Result Report

- Task summary: selected `scripts/runRestoreDrillEvidence.mjs` as the next non-duplicate local-safe missing-test family and created [LUC-3001](/LUC/issues/LUC-3001) for Test Automation.
- Files changed: `history/tasks/luc-2998-no-stall-queue-expeditor-2026-06-08-task.md`, `.agents/state/active-mission.md`, `.agents/state/next-steps.md`, `.codex/context/TASK_BOARD.md`, `.codex/context/PROJECT_STATE.md`.
- How tested: heartbeat-context readback, awareness report review, `node --check scripts/runRestoreDrillEvidence.mjs`.
- What is incomplete: focused helper proof or classification remains owned by LUC-3001.
- Next steps: Test Automation runs LUC-3001; do not reopen duplicate protected/browser/prod-proof lanes.
- Decisions made: stale RC strict rows are not reopened because LUC-2997 owns proof; real restore drill execution is forbidden in this local helper lane.
