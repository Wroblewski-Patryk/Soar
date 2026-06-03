# Task

## Header
- ID: LUC-1639
- Title: [Operator][Coolify] Bind Coolify read-only production status access
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: none
- Priority: P0
- Module Confidence Rows: Operations / deploy status access
- Requirement Rows: not applicable
- Quality Scenario Rows: release/deploy gate
- Risk Rows: production credential handling, deploy-status observability
- Iteration: 2026-06-03 heartbeat
- Operation Mode: BUILDER
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: CHECKPOINTED

## Context
Paperclip needed Coolify base URL/API token/project id access for read-only
post-push production status reconciliation. This heartbeat verified the
current binding state for `LUC-1639`.

## Goal
Confirm whether the current Paperclip Ops runtime has Coolify read-only
production status access for Soar without exposing secret values or mutating
production.

## Scope
- Env-name presence check for Coolify bindings.
- Authenticated read-only Coolify `GET` probes.
- Redacted evidence and source-of-truth update.
- Excludes deploy, restart, rollback, env mutation, database action, team
  setting changes, and direct secret modification.

## Implementation Plan
1. Read Ops/Paperclip instructions and issue context.
2. Verify configured env names without printing values.
3. Run read-only Coolify `GET` probes.
4. Record redacted evidence and residual caveats.
5. Close issue with final disposition.

## Acceptance Criteria
- Binding names are present.
- Authenticated read-only Coolify endpoints succeed.
- Project binding resolves to `Soar`.
- Current team/workspace selector is known without requiring team mutation.
- No secrets or full ids are stored.
- No mutation occurs.

## Constraints
- Use existing systems and approved mechanisms.
- Do not introduce new structures without approval.
- Do not implement workarounds.
- Do not duplicate logic.
- Stay within verification stage.

## Definition of Done
- [x] Required binding names are present without printing values.
- [x] Authenticated Coolify read endpoints succeed.
- [x] `COOLIFY_SOAR_PROJECT_ID` resolves to `Soar`.
- [x] Current selector resolves to id `0`, name `LuckySparrow`.
- [x] Evidence records optional team-binding absence.
- [x] No production mutation occurs.

## Validation Evidence
- Manual checks:
  - env names present without values: `COOLIFY_BASE_URL`,
    `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`,
    `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`, `COOLIFY_SOAR_WEB_APP_ID`,
    `COOLIFY_SOAR_API_APP_ID`;
  - optional env names absent: `COOLIFY_SOAR_TEAM_ID`, `COOLIFY_TEAM_ID`;
  - `GET /api/v1/teams` returned success and one visible team under this
    read-only token;
  - `GET /api/v1/teams/current` returned success, selector id `0`, name
    `LuckySparrow`;
  - `GET /api/v1/projects/{COOLIFY_SOAR_PROJECT_ID}` returned success and
    resolved to `Soar`;
  - `GET /api/v1/projects/{COOLIFY_SOAR_PROJECT_ID}/environments` returned
    success and included `production`;
  - `GET /api/v1/projects/{COOLIFY_SOAR_PROJECT_ID}/production` returned
    success and eight production resources;
  - `GET /api/v1/resources` returned success and `1` visible global resource
    row under this read-only token.
- Tests: not applicable; this is an external read-only access binding check.
- Screenshots/logs: none; CLI output was allowlisted and secret-free.
- High-risk checks: no mutation performed; no secret values stored.
- Module confidence ledger updated: yes.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `docs/operations/coolify-vps-deployment-contract.md`,
  `docs/operations/runtime-config-ledger.csv`.
- Fits approved architecture: yes; Coolify is treated as
  `project -> production environment -> resources`.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: deployment contract and config ledger
  refreshed with current issue evidence.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none performed.
- Health-check impact: none.
- Smoke steps updated: not needed.
- Rollback note: not applicable.
- Observability or alerting impact: improves deploy-status observability
  through read-only access.
- Staged rollout or feature flag: not applicable.

## Security / Privacy Evidence
- Data classification: production infrastructure metadata, secrets excluded.
- Trust boundaries: Paperclip Ops runtime to Coolify API.
- Permission or ownership checks: least-privilege read/status/log access
  preferred; token proved read access.
- Abuse cases: secret output, raw UUID persistence, and mutation were explicitly
  avoided.
- Secret handling: values never printed or stored.
- Security tests or scans: not applicable.
- Fail-closed behavior: optional team-id binding absence was not worked around
  by team mutation; current team/project reads succeeded.
- Residual risk: `running:unknown` application status is Coolify inventory
  status only, not application readiness.

## Result Report
- Task summary: Coolify read-only production status access is bound for Soar
  project/list-level reconciliation.
- Files changed:
  - `history/evidence/luc-1639-coolify-read-only-production-status-access-2026-06-03.md`
  - `history/tasks/luc-1639-operator-coolify-bind-read-only-production-status-access-2026-06-03-task.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.agents/state/system-health.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/operations/coolify-vps-deployment-contract.md`
  - `docs/operations/runtime-config-ledger.csv`
- How tested: redacted env presence check plus authenticated Coolify `GET`
  probes.
- What is incomplete: application readiness and protected worker readiness are
  separate release smoke gates.
- Next steps: close `LUC-1639` as done; use project/environment/resource
  inventory path for future status reconciliation.
- Decisions made: no production mutation and no team setting change were
  needed.
