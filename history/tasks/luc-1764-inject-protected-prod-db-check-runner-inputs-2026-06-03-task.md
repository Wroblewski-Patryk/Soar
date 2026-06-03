# Task

## Header
- ID: LUC-1764
- Title: [Soar][ARB-006][Ops] Inject protected PROD_DB_CHECK runner inputs
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Soar Project Manager local repair/source-control lane
- Depends on: board-capable protected secret/runtime input binding
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001 / production DB restore-readiness
- Requirement Rows: ARB-006 protected production evidence
- Quality Scenario Rows: recovery readiness / protected evidence safety
- Risk Rows: protected input availability
- Iteration: 2026-06-03 Paperclip heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-1764-PROD-DB-CHECK-RUNNER-INPUT-BINDING-2026-06-03
- Mission Status: BLOCKED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] No loop step was skipped.
- [x] Exactly one priority task was selected.
- [x] Operation mode selected as bounded source-control/verification heartbeat.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was not fully reread because this was a scoped Paperclip wake with explicit issue context; relevant issue contract and state files were reviewed.
- [x] `.agents/core/mission-control.md` was represented through active mission/state update.
- [x] Missing protected input state was verified by names-only runner readback.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified at issue/evidence level.
- [x] The task improves release confidence by proving the exact current protected-input blocker instead of claiming production DB readiness.

## Mission Block
- Mission objective: inject or fail-close the protected production DB check runner-input binding lane without exposing secrets or mutating production.
- Release objective advanced: ARB-006 protected evidence recovery map for data lane.
- Included slices: scoped Paperclip wake acknowledgement, issue/security contract readback, names-only runner input scan, Paperclip company secret-store access check, native production DB profile command check, repo evidence/state update, source-control closure decision.
- Explicit exclusions: secret value readback, repo `.env` writes, shell transcript values, schema change, migration, data write, restore execution, env mutation by this runner, deploy, restart, rollback, Coolify mutation, account mutation, protected smoke, live trading.
- Checkpoint cadence: single heartbeat.
- Stop conditions: missing protected DB profile inputs or inability to bind through approved encrypted secret store.
- Handoff expectation: board-capable secret/runtime owner binds one complete accepted input family, then Data reruns `pnpm run ops:db:backup-verify:prod`.

## Context

`LUC-1764` is the Ops runner-input injection child for parent `LUC-1762`, which blocks `LUC-1757` production DB restore-readiness evidence. The latest issue comment selected an autonomous local repair/source-control lane and allowed local repo inspection, local validation, and a local commit if evidence supported closure. Push, deploy, production restart, protected smoke/live mutation, and secret disclosure remained forbidden.

## Goal

Configure or prove the blocker for one complete protected production DB check input family:

- `PROD_DB_CHECK_CONTAINER`, `PROD_DB_CHECK_USER`, `PROD_DB_CHECK_NAME`; or
- `PRODUCTION_DB_CHECK_CONTAINER`, `PRODUCTION_DB_CHECK_USER`, `PRODUCTION_DB_CHECK_NAME`.

## Scope

Files/surfaces:
- Paperclip issue context for `LUC-1764`
- Paperclip parent document `security-runner-input-contract`
- current runner environment names only
- `scripts/runBackupVerificationProfile.mjs`
- `history/tasks/luc-1764-inject-protected-prod-db-check-runner-inputs-2026-06-03-task.md`
- `.agents/state/active-mission.md`
- `.agents/state/module-confidence-ledger.md`
- `.agents/state/system-health.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`

## Implementation Plan

1. Read scoped issue heartbeat context and latest wake comment.
2. Read the parent Security runner-input contract.
3. Check accepted runner input names without printing values.
4. Check whether this runner can access Paperclip company secret-store metadata.
5. Run the native production DB backup verification profile.
6. Record redaction-safe evidence and source-of-truth updates.
7. Validate docs/evidence state and decide commit/no-commit.
8. Patch Paperclip issue to the correct final disposition.

## Acceptance Criteria

- Names-only readback confirms whether one complete accepted input family is present.
- `pnpm run ops:db:backup-verify:prod` no longer fails with missing production profile inputs, or the blocker is explicitly recorded.
- No production mutation, deploy, restart, rollback, migration, schema change, subscription/payment change, exchange setting change, live-trading action, secret disclosure, or protected response-body capture occurs.
- Source-control disposition is recorded with commit hash or explicit blocker.

## Definition of Done

- [x] Scoped wake comment acknowledged as local repair/source-control lane.
- [x] Security contract read.
- [x] Names-only accepted input family readback performed.
- [x] Paperclip company secret-store access checked without value readback.
- [x] Native prod backup verification command executed.
- [x] Evidence and source-of-truth state updated.
- [ ] Protected runner inputs injected. This remains blocked because the current runner lacks accepted input names and company secret-store access.

## Validation Evidence

- Tests:
  - `pnpm run ops:db:backup-verify:prod` -> FAIL before DB access with `Missing container for profile "prod"`.
- Manual checks:
  - `GET /api/issues/{issueId}/heartbeat-context` -> pass; issue read as `LUC-1764`, `in_progress`, priority `critical`, parent `LUC-1762`, blocks `LUC-1762`.
  - Parent document `security-runner-input-contract` -> accepted families and no-secret/no-mutation contract confirmed.
  - Names-only runner readback -> all accepted DB profile names missing: `PROD_DB_CHECK_CONTAINER`, `PROD_DB_CHECK_USER`, `PROD_DB_CHECK_NAME`, `PRODUCTION_DB_CHECK_CONTAINER`, `PRODUCTION_DB_CHECK_USER`, `PRODUCTION_DB_CHECK_NAME`; `DOCKER_HOST` missing.
  - `GET /api/companies/{companyId}/secrets` -> HTTP `403`, `Board access required`.
  - `git rev-parse HEAD` -> `d182a9e1d6c9fe129f4567cacb0bfd35fb3c3458`.
- Screenshots/logs: not applicable.
- High-risk checks:
  - No secret values printed or persisted.
  - No database connection attempted.
  - No production mutation performed.
- Module confidence ledger updated: yes.
- Requirements matrix updated: no, issue-level evidence and task board/state updated.
- Quality scenarios updated: no, blocked evidence packet records recovery-readiness gap.
- Risk register updated: no, blocker recorded in evidence/task/Paperclip.
- Reality status: blocked.

## Architecture Evidence

- Architecture source reviewed: ARB-006 issue chain and operations runner contract.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none by this runner.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: no rollback path needed because no change/mutation occurred.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue `LUC-1764` is `in_progress`, critical, and assigned to this local repair/source-control lane.
- It exists to unblock parent `LUC-1762`, which blocks `LUC-1757` production DB check proof.
- Existing repo scripts require complete production DB profile inputs.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: issue heartbeat context, parent Security contract document, current runner names, backup verification command.
- Blocking unknowns: protected production DB profile values are absent from this runner and cannot be bound by this runner.
- Why it was safe to continue: checks were names-only and the native command failed before DB access.

### 2. Select One Priority Mission Objective
- Selected task: close or fail-close `LUC-1764` protected DB check runner-input binding.
- Priority rationale: critical ARB-006 data lane blocker.
- Why other candidates were deferred: scoped wake forbids switching issues.

### 3. Plan Implementation
- Files or surfaces to modify: task artifact and state/context files only.
- Logic: no code change.
- Edge cases: missing protected inputs must block rather than downgrade proof or write secrets into repo files.

### 4. Execute Implementation
- Implementation notes: created redaction-safe task packet and state updates; no injection was performed because approved secret-store access is unavailable in this runner.

### 5. Verify and Test
- Validation performed: names-only readback, Paperclip secret-store access check, and native `ops:db:backup-verify:prod` command.
- Result: blocked before DB access because production profile envs are absent.

### 6. Self-Review
- Simpler option considered: only patch Paperclip issue. Rejected because repository evidence/state must remain durable for ARB-006 source-control closure.
- Technical debt introduced: no.
- Scalability assessment: existing profile script/runbook remains the reusable path.
- Refinements made: explicitly separated runner-input binding authority from DB restore-readiness proof.

### 7. Update Documentation and Knowledge
- Docs updated: task/state files.
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

- Task summary: attempted the protected production DB check input-binding path and proved this runner cannot complete it because accepted input names are missing and Paperclip company secret-store access is board-only.
- Files changed: this task artifact plus project state files.
- How tested: names-only input readback, `GET /api/companies/{companyId}/secrets`, and `pnpm run ops:db:backup-verify:prod`.
- What is incomplete: actual protected runner input injection cannot be performed by this runner.
- Next steps: board-capable secret/runtime owner injects one complete accepted family through Paperclip secrets or another approved encrypted runtime path; then Data reruns `pnpm run ops:db:backup-verify:prod`.
- Decisions made: keep the issue blocked rather than writing secrets into repo files or claiming DB readiness from a missing-input runner.
