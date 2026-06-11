# Task

## Header
- ID: LUC-3461
- Title: Coolify Production Deploy Health Sweep
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: none
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001 / Coolify production deploy health
- Requirement Rows: production public health/readiness and resource inventory proof
- Quality Scenario Rows: deployment readiness, release safety, observability
- Risk Rows: production deploy confidence, protected smoke gap, worker readiness gap
- Iteration: 2026-06-11 DRE heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-3461
- Mission Status: PARTIALLY_VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] Exactly one priority task is selected.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` and current ops state were reviewed through the AGENTS startup set.
- [x] Affected module confidence and risk rows were identified.
- [x] The task improves release confidence without claiming full release readiness.

## Context

[LUC-3461](/LUC/issues/LUC-3461) is a DRE scoped wake for a Soar Coolify
production deploy health sweep. The wake payload had no pending comments and
`fallbackFetchNeeded=false`; checkout was already claimed by the harness and
was not repeated.

## Goal

Refresh the current no-mutation production health picture for public API/Web
routes and Coolify production resource status, then close the issue with
evidence and explicit residual gates.

## Scope

- Public no-auth smoke:
  - `https://api.soar.luckysparrow.ch/health`
  - `https://api.soar.luckysparrow.ch/ready`
  - `https://soar.luckysparrow.ch/`
  - `https://soar.luckysparrow.ch/api/build-info`
- Read-only Coolify API `GET` projection for team selector, project,
  production environment, resources, and active deployments.
- Evidence and state files:
  - `history/evidence/luc-3461-coolify-production-health-sweep-2026-06-11.md`
  - `history/tasks/luc-3461-coolify-production-deploy-health-sweep-2026-06-11-task.md`
  - `.agents/state/system-health.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`

## Implementation Plan

1. Read DRE safety and evidence contracts.
2. Run the project-native public no-worker deploy smoke.
3. Confirm Coolify binding names without printing values.
4. Query only read-only Coolify `GET` endpoints and record redacted counts,
   names, and statuses.
5. Update evidence/state and close the Paperclip issue.

## Acceptance Criteria

- Public API/Web smoke passes or failures are recorded.
- Coolify production inventory readback succeeds or blocker is named.
- No deploy, restart, rollback, env edit, database/Redis mutation, secret
  readback, raw log dump, protected smoke, account action, or live-trading
  action occurs.
- Residual protected gates remain explicit.

## Definition of Done

- [x] Public no-worker smoke command completed.
- [x] Read-only Coolify projection completed.
- [x] Evidence file updated with current results.
- [x] Source-of-truth state updated.
- [x] Paperclip issue can be marked `done` with partial-verification caveat.

## Forbidden

- Deploy, restart, rebuild, rollback, environment edit, database mutation,
  Redis mutation, secret mutation/readback, account mutation, protected smoke,
  raw log capture, screenshot, or live-trading action.

## Validation Evidence

- Tests:
  - `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`
    PASS: API `/health` `200`, API `/ready` `200`, Web `/` `200`, Web
    `/api/build-info` `200`.
- Manual checks:
  - Read-only Coolify API projection at `2026-06-11T12:52:30Z`: selector
    `LuckySparrow`, project `Soar`, one production environment, `17` visible
    global resources, `0` active deployment rows, and eight canonical
    production resources.
  - Web build-info readback at `2026-06-11T12:52Z`: HTTP `200`, `gitSha`
    `56d8d440bfe0fd9ee692e9f669e35414d85d2493`, `gitRef` `main`,
    `metadataSource` `github-branch`, `buildId`
    `Xnn0H5fuVVTeahYMA8tvy`.
- Screenshots/logs: none; raw logs intentionally not captured.
- High-risk checks: mutation boundary preserved; only public reads and
  Coolify `GET` calls were used.
- Reality status: partially verified.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: no rollback required because no production state changed.
- Observability or alerting impact: no alert-route changes.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Existing ops docs list [LUC-3437](/LUC/issues/LUC-3437) as the latest fresh
  Coolify inventory baseline.
- The issue-specific evidence draft existed and was revalidated before closure.

### 2. Select One Priority Mission Objective
- Selected [LUC-3461](/LUC/issues/LUC-3461) because it is the scoped wake issue.

### 3. Plan Implementation
- Use existing project smoke tooling and read-only Coolify API calls only.

### 4. Execute Implementation
- Ran no-worker public smoke.
- Ran names-only Coolify binding scan.
- Ran null-safe read-only Coolify projection.
- Updated evidence/state.

### 5. Verify and Test
- Public smoke passed.
- Coolify projection passed.

### 6. Self-Review
- Existing release/deploy model was reused.
- No workaround path, duplicate deployment model, or production mutation was
  introduced.

### 7. Update Documentation and Knowledge
- Updated task/evidence/state entries.
- Learning journal update: not applicable; the local null summarizer issue was
  corrected in the same heartbeat and did not affect project tooling.

## Review Checklist
- [x] Process self-audit completed.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validation was run.

## Result Report

- Task summary: public production API/Web smoke and read-only Coolify resource
  health were refreshed.
- Files changed: this task file, the [LUC-3461](/LUC/issues/LUC-3461) evidence
  file, and narrow state summaries.
- How tested: project-native no-worker deploy smoke plus authenticated
  read-only Coolify `GET` projection.
- What is incomplete: protected `/workers/ready`, worker runtime freshness,
  release-grade source provenance, rollback proof, restore drill, SLO evidence,
  and release approval remain separate gates.
- Next steps: keep release readiness fail-closed until protected gates have
  approved inputs and owner signoff.
