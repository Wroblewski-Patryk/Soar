# Task

## Header
- ID: LUC-1757
- Title: [Soar][ARB-006][Data] Produce PROD_DB_CHECK protected evidence
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Data Persistence Engineer
- Depends on: LUC-1762 protected production DB restore-check profile inputs
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001 / production DB restore-readiness
- Requirement Rows: ARB-006 protected production evidence
- Quality Scenario Rows: recovery readiness / protected evidence safety
- Risk Rows: protected input availability
- Iteration: 2026-06-03 Paperclip heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-1757-PROD-DB-CHECK-PROTECTED-EVIDENCE-2026-06-03
- Mission Status: BLOCKED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] No loop step was skipped.
- [x] Exactly one priority task was selected.
- [x] Operation mode selected as bounded builder/verification heartbeat.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was not fully reread because this was a scoped Paperclip wake with explicit issue context; relevant runbook/task-register docs were reviewed.
- [x] `.agents/core/mission-control.md` was represented through active mission/state update.
- [x] Missing protected input state was verified by names-only runner readback.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified at issue/evidence level.
- [x] The task improves release confidence by proving the exact current blocker instead of claiming production DB readiness.

## Mission Block
- Mission objective: produce or fail-close the ARB-006 production DB check evidence without exposing secrets or mutating production.
- Release objective advanced: ARB-006 protected evidence recovery map for data lane.
- Included slices: Paperclip context readback, runbook/script inspection, protected input presence check, native prod profile command check, repo evidence/state update.
- Explicit exclusions: schema change, migration, data write, restore execution, env change, deploy, restart, rollback, secret readback, live trading.
- Checkpoint cadence: single heartbeat.
- Stop conditions: missing protected DB profile inputs or any risk of secret disclosure/mutation.
- Handoff expectation: Security Review Lead completes `LUC-1762` with Ops coordination as needed; then the data lane reruns the same command.

## Context

`LUC-1757` is a critical child of ARB-006 and blocks `LUC-1758` plus `LUC-1759`. The issue asks for redaction-safe read-only production DB integrity/restore-readiness evidence and permits explicit blocked owner/action if protected DB access is unavailable.

## Goal

Produce a redaction-safe production DB check evidence packet or name the exact protected input blocker.

## Scope

Files/surfaces:
- `scripts/runBackupVerificationProfile.mjs`
- `docs/operations/v1-rc-external-gates-runbook.md`
- `docs/operations/v1-release-candidate-checklist.md`
- `history/evidence/luc-1757-prod-db-check-protected-evidence-2026-06-03.md`
- `.agents/state/module-confidence-ledger.md`
- `.agents/state/active-mission.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`

## Implementation Plan

1. Read scoped issue heartbeat context.
2. Inspect production DB check scripts and runbook contract.
3. Check accepted protected input family presence without values.
4. Run the native production profile command as the smallest verification.
5. Record redaction-safe evidence and project state.
6. Patch Paperclip issue to the correct final disposition.

## Acceptance Criteria

- Evidence states data source/account class, command/probe class, target SHA/date, result, redaction handling, and exact blocked owner/action.
- No secret values are persisted.
- No schema, migration, data, deployment, or production mutation occurs.
- Paperclip issue disposition is not left as false-live `in_progress`.

## Definition of Done

- [x] Relevant script/runbook contract inspected.
- [x] Protected input availability checked by names only.
- [x] Native production DB verification profile executed.
- [x] Evidence artifact created.
- [x] State files updated.
- [ ] Protected production DB check passed. This remains blocked on missing protected input family.

## Validation Evidence

- Tests:
  - `pnpm run ops:db:backup-verify:prod` -> `FAIL` before DB access due to missing production profile container input.
- Manual checks:
  - names-only env readback found both `PROD_DB_CHECK_*` and `PRODUCTION_DB_CHECK_*` families missing.
  - `git rev-parse HEAD` -> `d182a9e1d6c9fe129f4567cacb0bfd35fb3c3458`.
- Screenshots/logs: not applicable.
- High-risk checks:
  - No secret values recorded.
  - No DB connection attempted.
  - No production mutation performed.
- Module confidence ledger updated: yes.
- Requirements matrix updated: no, issue-level evidence and task board/state updated.
- Quality scenarios updated: no, blocked evidence packet records recovery-readiness gap.
- Risk register updated: no, blocker recorded in evidence/task/Paperclip.
- Reality status: blocked.

## Architecture Evidence

- Architecture source reviewed: ARB-006 task register and operations runbooks.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: no rollback path needed because no change/mutation occurred.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue `LUC-1757` is `in_progress`, critical, unblocked, assigned to Data Persistence Engineer.
- It blocks `LUC-1758` and `LUC-1759`.
- Existing repo scripts require complete production DB profile inputs.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: issue context, ARB-006 task register, RC runbook/checklist, backup verification script.
- Blocking unknowns: protected production DB profile input values are absent in runner.
- Why it was safe to continue: names-only checks and native fail-closed command do not expose values or mutate production.

### 2. Select One Priority Mission Objective
- Selected task: produce `PROD_DB_CHECK` evidence for `LUC-1757`.
- Priority rationale: critical ARB-006 data lane blocker.
- Why other candidates were deferred: scoped wake forbids switching issues.

### 3. Plan Implementation
- Files or surfaces to modify: evidence/task/state files only.
- Logic: no code change.
- Edge cases: missing protected inputs must block rather than downgrade proof.

### 4. Execute Implementation
- Implementation notes: created redaction-safe evidence packet and state updates.

### 5. Verify and Test
- Validation performed: protected input names-only readback and native `ops:db:backup-verify:prod` command.
- Result: blocked before DB access because production profile envs are absent.

### 6. Self-Review
- Simpler option considered: only comment in issue. Rejected because repository evidence/state must remain durable for ARB-006.
- Technical debt introduced: no.
- Scalability assessment: existing profile script/runbook remains the reusable path.
- Refinements made: explicitly separated protected-input blocker from DB restore-readiness failure.

### 7. Update Documentation and Knowledge
- Docs updated: evidence/task/state files.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was handled.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validation was run.
- [x] Docs/context were updated.
- [x] Parent validation disposition will be applied through Paperclip issue update.

## Result Report

- Task summary: attempted the redaction-safe production DB check path and proved it is blocked by missing accepted protected input families.
- Files changed: this task artifact, evidence artifact, project state files.
- How tested: `pnpm run ops:db:backup-verify:prod` plus names-only env family readback.
- What is incomplete: actual production DB restore-readiness proof cannot run until protected input family is present.
- Next steps: `LUC-1762` provides complete production DB check profile family, then rerun `pnpm run ops:db:backup-verify:prod`.
- Decisions made: keep the issue blocked rather than producing stale or local-only data readiness proof.
