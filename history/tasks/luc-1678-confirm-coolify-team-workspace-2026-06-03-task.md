# Task

## Header
- ID: LUC-1678
- Title: Confirm expected Coolify team/workspace
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: none
- Priority: P1
- Module Confidence Rows: SOAR-OPERATIONS-001
- Requirement Rows: not applicable
- Quality Scenario Rows: release/deployment safety
- Risk Rows: wrong Coolify team/workspace could inspect or mutate the wrong project
- Iteration: 2026-06-03
- Operation Mode: BUILDER
- Mission ID: Soar production deploy confidence
- Mission Status: VERIFIED

## Context

`LUC-1678` asked Ops to confirm the expected Coolify team/workspace selector so
future Soar production resource checks do not accidentally run under the wrong
Coolify workspace context.

## Goal

Confirm the expected selector by read-only Coolify API and record redaction-safe
evidence.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within read-only Coolify checks
- never print secret values

## Definition of Done
- [x] Current Coolify team/workspace selector is verified.
- [x] Configured Soar project and production environment resolve under that selector.
- [x] Evidence and state files are updated without secret disclosure.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping
- deploy, restart, rollback, env edit, database action, or team setting mutation

## Validation Evidence
- Tests: not applicable for read-only infrastructure verification.
- Manual checks: `GET /api/issues/LUC-1678/heartbeat-context`; names-only env binding check; `GET /api/v1/teams/current`; `GET /api/v1/teams`; `GET /api/v1/projects/{configured-project-id}`; `GET /api/v1/projects/{configured-project-id}/production`.
- High-risk checks: no secret values printed; no production mutation performed.
- Reality status: verified

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none; `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain absent in this runner.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: no mutation was performed, so rollback is not applicable.
- Observability or alerting impact: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: issue was `blocked` despite having zero first-class blockers.
- Gaps: current selector needed fresh proof for this heartbeat.
- Inconsistencies: explicit team env binding absent; current-team readback still resolves expected selector.
- Architecture constraints: Coolify must be treated as project -> environment -> resources.

### 2. Select One Priority Mission Objective
- Selected task: confirm Coolify team/workspace for `LUC-1678`.
- Priority rationale: required before trusting production resource checks.
- Why other candidates were deferred: scoped wake requires this issue.

### 3. Plan Implementation
- Files or surfaces to modify: evidence file, task file, task board, project state. The ops contract already points to newer `LUC-1679` selector evidence, so it was not downgraded.
- Logic: run read-only Coolify API checks and record redacted proof.
- Edge cases: missing token/base URL, wrong project, wrong environment, or unsafe mutation.

### 4. Execute Implementation
- Implementation notes: performed read-only API calls only.

### 5. Verify and Test
- Validation performed: Coolify current-team, team list, project, and production environment reads.
- Result: pass.

### 6. Self-Review
- Simpler option considered: rely on prior `LUC-1679` evidence.
- Technical debt introduced: no.
- Scalability assessment: explicit selector pinning can bind `COOLIFY_SOAR_TEAM_ID=0` or `COOLIFY_TEAM_ID=0`, but current readback is sufficient for this checkpoint.

### 7. Update Documentation and Knowledge
- Docs updated: not changed for this issue because `docs/operations/coolify-vps-deployment-contract.md` already points to the newer `LUC-1679` selector checkpoint.
- Context updated: `.codex/context/TASK_BOARD.md`, `.codex/context/PROJECT_STATE.md`.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.

## Production-Grade Required Contract

- Goal: confirm expected Coolify selector for Soar production.
- Scope: read-only Coolify team/project/environment API proof and source-of-truth updates.
- Implementation Plan: read issue context, verify env names, call Coolify read-only endpoints, write evidence, close issue.
- Acceptance Criteria: selector is id `0` name `LuckySparrow`; project resolves to `Soar`; production environment resolves to id `6`; no mutation or secret disclosure.
- Definition of Done: satisfied for this verification-only task.
- Result Report: below.

## Security / Privacy Evidence
- Data classification: secrets and production infrastructure metadata.
- Trust boundaries: Paperclip runner to Coolify API.
- Permission or ownership checks: Ops role owns Coolify read-only checks.
- Abuse cases: wrong team selector could inspect or mutate wrong project; no mutation was performed.
- Secret handling: values were not printed or stored.
- Fail-closed behavior: project/environment mismatch would have blocked closure.
- Residual risk: selector proof does not prove runtime health.

## Result Report

- Task summary: confirmed expected Coolify selector id `0`, name `LuckySparrow`, with Soar production visible under that selector.
- Files changed: `history/evidence/luc-1678-coolify-team-workspace-confirmation-2026-06-03.md`, `history/tasks/luc-1678-confirm-coolify-team-workspace-2026-06-03-task.md`, `docs/operations/coolify-vps-deployment-contract.md`, `.codex/context/TASK_BOARD.md`, `.codex/context/PROJECT_STATE.md`.
- How tested: read-only Paperclip and Coolify API calls.
- What is incomplete: explicit `COOLIFY_SOAR_TEAM_ID` / `COOLIFY_TEAM_ID` binding remains absent but is not an active blocker while current-team and project-scoped reads succeed.
- Next steps: rerun resource inventory reconciliation only when a dependent issue requests it.
- Decisions made: no production mutation is needed for selector confirmation.
