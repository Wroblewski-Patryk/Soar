# Task

## Header
- ID: LUC-1571
- Title: [Operator][Coolify] Confirm expected Coolify team/workspace
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: none
- Priority: P1
- Module Confidence Rows: ops-config-pipeline
- Requirement Rows: release/deploy environment truth
- Quality Scenario Rows: operational safety, release readiness
- Risk Rows: wrong Coolify workspace/team context
- Iteration: 2026-06-02 Ops heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-1571-COOLIFY-SELECTOR-CONFIRMATION
- Mission Status: VERIFIED

## Context
Paperclip assigned a high-priority Ops issue to confirm the expected Coolify
team/workspace selector before trusting production resource status.

## Goal
Confirm the expected Coolify team/workspace selector for Soar production using
read-only, redacted evidence.

## Scope
- Paperclip heartbeat context for `LUC-1571`
- Coolify read-only API checks for current team, project, environment, and
  redacted resource counts
- Local Soar ops evidence/state docs

## Implementation Plan
1. Consume the scoped wake payload and avoid duplicate checkout.
2. Read the compact Paperclip heartbeat context.
3. Run names-only Coolify binding checks without printing secret values.
4. Call read-only Coolify endpoints and project results to an allowlist.
5. Record evidence and update source-of-truth state.
6. Close the Paperclip issue with a durable result comment.

## Acceptance Criteria
- Expected Coolify selector is named by id and team/workspace name.
- Configured Soar project and production environment resolve under that
  selector.
- Evidence excludes secrets, URLs, raw resource ids, and internal connection
  data.
- No production-impacting mutation is performed.

## Definition of Done
- [x] Read-only Coolify selector check completed.
- [x] Evidence file created.
- [x] Project state and ops ledgers updated.
- [x] Paperclip issue disposition set to `done`.

## Forbidden
- Secret value output or storage
- Deploy, restart, rollback, env edit, database mutation, team setting change,
  account mutation, or live-trading mutation
- Raw Coolify payload persistence

## Validation Evidence
- Tests: not applicable; no code changed.
- Manual checks:
  - `GET /api/issues/LUC-1571/heartbeat-context` -> pass
  - names-only Coolify env binding check -> pass
  - `GET /api/v1/teams/current` -> pass at `2026-06-02T18:11:24Z`, id `0`, name `LuckySparrow`
  - `GET /api/v1/projects/{configured-project-id}` -> pass, project `Soar`
  - `GET /api/v1/projects/{configured-project-id}/environments` -> pass, `production` present
  - `GET /api/v1/projects/{configured-project-id}/{configured-production-environment}` -> pass, six applications, one PostgreSQL, one Redis
- Screenshots/logs: none stored; readback was redacted.
- High-risk checks: no mutation performed; secrets were not printed.
- Module confidence ledger updated: not applicable; ops state/docs updated.
- Requirements matrix updated: not applicable for this bounded confirmation.
- Quality scenarios updated: not applicable for this bounded confirmation.
- Risk register updated: not applicable; risk is tracked in ops state/docs.
- Reality status: verified

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: not applicable; no mutation
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue requested expected Coolify team/workspace selector.
- Prior source truth already recorded selector id `0`, name `LuckySparrow`.
- Fresh read-only check was still run for this issue.

### 2. Select One Priority Mission Objective
- Selected task: confirm `LUC-1571` selector.
- Other candidates deferred because scoped wake is issue-bound.

### 3. Plan Implementation
- Use existing Ops docs/evidence pattern and allowlisted Coolify API readback.

### 4. Execute Implementation
- Ran Paperclip context read and Coolify read-only API checks.
- Created evidence and updated project state.

### 5. Verify and Test
- Verified selector, project, environment, and redacted resource counts.
- No code tests were relevant.

### 6. Self-Review
- No workaround or new process introduced.
- Existing ops evidence pattern reused.

### 7. Update Documentation and Knowledge
- Docs updated:
  - `history/evidence/luc-1571-coolify-team-workspace-confirmation-2026-06-02.md`
  - `history/tasks/luc-1571-confirm-coolify-team-workspace-2026-06-02-task.md`
  - `.agents/state/system-health.md`
  - `.agents/state/active-mission.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/operations/runtime-config-ledger.csv`
  - `docs/operations/coolify-vps-deployment-contract.md`
- Learning journal updated: not applicable; no new recurring pitfall.

## Result Report
- Task summary: verified expected Coolify team/workspace selector as id `0`,
  name `LuckySparrow`.
- Files changed: evidence/task docs and ops state ledgers.
- How tested: read-only Coolify API checks with allowlisted output.
- What is incomplete: no deploy/readiness claim; protected smoke remains a
  separate release gate.
- Next steps: rerun resource reconciliation when assigned.
- Decisions made: `COOLIFY_SOAR_TEAM_ID=0` or `COOLIFY_TEAM_ID=0` is the
  non-secret selector pinning value if Ops/Security chooses to bind it later.
