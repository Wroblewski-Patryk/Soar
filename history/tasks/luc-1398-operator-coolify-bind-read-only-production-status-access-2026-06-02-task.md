# Task

## Header
- ID: LUC-1398
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
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: CHECKPOINTED

## Context
Paperclip needed Coolify base URL/API token/project id access for read-only
post-push production status reconciliation. Earlier evidence showed generic
read-only API access and later noted project binding drift. This heartbeat
verified the current binding state.

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
- [x] At least one authenticated Coolify read endpoint succeeds.
- [x] `COOLIFY_SOAR_PROJECT_ID` resolves to `Soar`.
- [x] Evidence records residual app-id caveat.
- [x] No production mutation occurs.

## Validation Evidence
- Manual checks:
  - env names present without values: `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`, `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`, `COOLIFY_SOAR_API_APP_ID`, `COOLIFY_SOAR_WEB_APP_ID`;
  - `GET /api/v1/version` returned `200`;
  - `GET /api/v1/projects` returned `200` and included project `Soar`;
  - `GET /api/v1/projects/{COOLIFY_SOAR_PROJECT_ID}` returned `200` and resolved to `Soar`;
  - `GET /api/v1/applications` returned `200` and 13 application rows;
  - `GET /api/v1/resources` returned `200` and 17 resource rows;
  - direct app-id probes for `COOLIFY_SOAR_API_APP_ID` and `COOLIFY_SOAR_WEB_APP_ID` returned `404`.
- Tests: not applicable; this is an external read-only access binding check.
- Screenshots/logs: none; CLI output was allowlisted and secret-free.
- High-risk checks: no mutation performed; no secret values stored.
- Reality status: verified with caveat.

## Architecture Evidence
- Architecture source reviewed: `docs/operations/coolify-vps-deployment-contract.md`, `docs/operations/coolify-linux-vps-setup-guide.md`.
- Fits approved architecture: yes; Coolify is treated as `project -> production environment -> resources`.
- Mismatch discovered: no architecture mismatch; resource-specific aliases are stale operational bindings.
- Decision required from user: no.
- Follow-up architecture doc updates: deployment contract residual caveat updated.

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
- Abuse cases: secret output, raw UUID persistence, and mutation were explicitly avoided.
- Secret handling: values never printed or stored.
- Security tests or scans: not applicable.
- Fail-closed behavior: direct stale aliases returned `404`; no mutation fallback attempted.
- Residual risk: direct API/Web app-id aliases need Security/Ops refresh if future automation requires direct resource endpoint calls.

## Result Report
- Task summary: Coolify read-only production status access is bound for Soar project/list-level reconciliation.
- Files changed:
  - `history/evidence/luc-1398-coolify-read-only-production-status-access-2026-06-02.md`
  - `history/tasks/luc-1398-operator-coolify-bind-read-only-production-status-access-2026-06-02-task.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/operations/coolify-vps-deployment-contract.md`
- How tested: redacted env presence check plus authenticated Coolify `GET` probes.
- What is incomplete: direct API/Web app-id aliases return `404`; use project/list inventory for status checks until refreshed.
- Next steps: close LUC-1398 as done; route any direct app-id alias refresh as a separate Security/Ops follow-up only if automation requires it.
- Decisions made: no production mutation and no team setting change were needed.
