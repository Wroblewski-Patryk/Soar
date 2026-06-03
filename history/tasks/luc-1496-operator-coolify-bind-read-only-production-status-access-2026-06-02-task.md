# Task

## Header
- ID: LUC-1496
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
binding state for LUC-1496 without exposing secret values or mutating
production.

Continuation note: a later `issue_continuation_needed` wake found stale
`blocked` state caused by duplicate-run janitor context only. `GET
/api/issues/LUC-1496` showed no first-class `blockedBy` issues, so this task
remained actionable and was closed after a fresh read-only proof.

## Goal
Confirm whether the current Paperclip Ops runtime has Coolify read-only
production status access for Soar without exposing secret values or mutating
production.

## Scope
- Env-name presence check for Coolify bindings.
- Authenticated read-only Coolify `GET` probes.
- Duplicate-run janitor blocker triage.
- Redacted evidence and source-of-truth update.
- Excludes deploy, restart, rollback, env mutation, database action, team
  setting changes, and direct secret modification.

## Implementation Plan
1. Read Ops/Paperclip instructions and issue context.
2. Verify whether the latest blocked state is first-class or janitor-only.
3. Verify configured env names without printing values.
4. Run read-only Coolify `GET` probes.
5. Record redacted evidence and residual caveats.
6. Close issue with final disposition.

## Acceptance Criteria
- Binding names are present.
- Authenticated read-only Coolify endpoints succeed.
- Project binding resolves to `Soar`.
- Production environment/resource inventory is readable.
- No secrets or full ids are stored.
- No mutation occurs.
- Duplicate-run blocker is cleared only if no first-class blocker remains.

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
- [x] Production environment and eight Soar production resources are visible.
- [x] Evidence records residual team-id caveat.
- [x] Latest blocked state is confirmed as duplicate-run janitor context only.
- [x] No production mutation occurs.

## Forbidden
- New systems without approval.
- Duplicated logic or parallel implementations of the same contract.
- Temporary bypasses, hacks, or workaround-only paths.
- Architecture changes without explicit approval.
- Production mutation without a release mutation permit.

## Validation Evidence
- Manual checks:
  - env names present without values: `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`, `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`;
  - `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` absent, not required for this proof because project/environment/resource reads succeeded;
  - `GET /api/issues/LUC-1496/heartbeat-context` returned issue context;
  - `GET /api/issues/LUC-1496` showed status `blocked` with no first-class `blockedBy` issues;
  - latest comment `07b842ad-cbd3-49f0-beae-e151f53f19e9` was duplicate-run janitor context only;
  - `GET /api/v1/projects/{configured-project-id}` returned `200` and resolved to `Soar`;
  - `GET /api/v1/projects/{configured-project-id}/{configured-production-environment}` returned `200` with six applications, one PostgreSQL, and one Redis;
  - `GET /api/v1/resources` returned `200` and 17 visible resource rows.
- Tests: not applicable; this is an external read-only access binding check.
- Repository checks: `git diff --check` passed with line-ending warnings only.
- Continuation recheck: read-only Coolify probe rerun at `2026-06-02T13:03:28Z` with the same pass result.
- Screenshots/logs: none; CLI output was allowlisted and secret-free.
- High-risk checks: no mutation performed; no secret values stored.
- Reality status: verified.

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
- Fail-closed behavior: no secret metadata inspection was required for this proof.
- Residual risk: team id is not bound in this runner; not active blocker while project-scoped reads succeed.

## Result Report
- Task summary: Coolify read-only production status access is bound for Soar project/environment/resource reconciliation.
- Files changed:
  - `history/evidence/luc-1496-coolify-read-only-production-status-access-2026-06-02.md`
  - `history/tasks/luc-1496-operator-coolify-bind-read-only-production-status-access-2026-06-02-task.md`
  - `.agents/state/system-health.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/operations/coolify-vps-deployment-contract.md`
- How tested: redacted env presence check plus authenticated Coolify `GET` probes; `git diff --check` passed with line-ending warnings only.
- Continuation tested: duplicate-run blocker triage plus fresh read-only Coolify probe at `2026-06-02T13:03:28Z`.
- What is incomplete: application readiness and protected worker readiness remain separate gates.
- Next steps: close LUC-1496 as done; use this access for subsequent read-only deploy/resource reconciliation.
- Decisions made: no production mutation and no team setting change were needed.
