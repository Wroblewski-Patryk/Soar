# Task

## Header
- ID: LUC-1459
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
- Iteration: 2026-06-02 heartbeat
- Operation Mode: BUILDER
- Mission ID: Soar production deploy confidence
- Mission Status: CHECKPOINTED

## Context
Paperclip needed Coolify base URL/API token/project id access for read-only
post-push production status reconciliation. This heartbeat verified the current
binding state for LUC-1459 without exposing secret values or mutating
production.

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
- Production environment/resource inventory is readable.
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
- [x] Production environment id `6` and eight Soar production resources are visible.
- [x] Evidence records residual team-id caveat.
- [x] No production mutation occurs.

## Validation Evidence
- Manual checks:
  - env names present without values: `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`;
  - `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` absent, not required for this proof because project/environment/resource reads succeeded;
  - `GET /api/v1/projects/{configured-project-id}` returned `200` and resolved to `Soar`;
  - `GET /api/v1/projects/{configured-project-id}/environments` returned `200` with `production` present;
  - `GET /api/v1/projects/{configured-project-id}/production` returned `200` with production environment id `6`;
  - `GET /api/v1/resources` returned `200` and 17 visible resource rows;
  - Paperclip secret metadata list returned `Board access required`, so secret-store metadata was not inspected by this role.
- Tests: not applicable; this is an external read-only access binding check.
- Screenshots/logs: none; CLI output was allowlisted and secret-free.
- High-risk checks: no mutation performed; no secret values stored.
- Reality status: verified with caveat.

## Architecture Evidence
- Architecture source reviewed: `docs/operations/coolify-vps-deployment-contract.md`.
- Fits approved architecture: yes; Coolify is treated as `project -> production environment -> resources`.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: deployment contract binding status updated.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none performed.
- Health-check impact: none.
- Smoke steps updated: not needed.
- Rollback note: not applicable.
- Observability or alerting impact: improves deploy-status observability through read-only access.
- Staged rollout or feature flag: not applicable.

## Security / Privacy Evidence
- Data classification: production infrastructure metadata, secrets excluded.
- Trust boundaries: Paperclip Ops runtime to Coolify API.
- Permission or ownership checks: least-privilege read/status/log access preferred; token proved read access.
- Abuse cases: secret output, raw id persistence, and mutation were explicitly avoided.
- Secret handling: values never printed or stored.
- Security tests or scans: not applicable.
- Fail-closed behavior: Paperclip secret metadata endpoint denied this agent with `Board access required`.
- Residual risk: team id is not bound in this runner; not active blocker while project-scoped reads succeed.

## Result Report
- Task summary: Coolify read-only production status access is bound for Soar project/environment/resource reconciliation.
- Files changed:
  - `history/evidence/luc-1459-coolify-read-only-production-status-access-2026-06-02.md`
  - `history/tasks/luc-1459-operator-coolify-bind-read-only-production-status-access-2026-06-02-task.md`
  - `.agents/state/system-health.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/operations/coolify-vps-deployment-contract.md`
- How tested: redacted env presence check plus authenticated Coolify `GET` probes.
- What is incomplete: Paperclip secret metadata is board-only for this agent; team id is not bound in the run environment.
- Next steps: close LUC-1459 as done; use this access for subsequent read-only deploy/resource reconciliation. Route team-id or direct resource alias refresh as separate Security/Ops follow-up only if automation requires it.
- Decisions made: no production mutation and no team setting change were needed.
