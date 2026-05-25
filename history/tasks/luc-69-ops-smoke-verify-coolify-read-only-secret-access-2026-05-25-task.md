# Task

## Header
- ID: LUC-69
- Title: [Soar][Ops Smoke] Verify Coolify read-only secret access
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Priority: P0

## Context
Ops lane needed a minimal, non-mutating proof that configured Coolify credentials can perform authenticated read-only API access without exposing secret values.

## Goal
Confirm whether current Coolify secret configuration allows read-only inventory access required for ops smoke and release supervision.

## Scope
- Runtime env var presence checks for Coolify auth inputs.
- Read-only Coolify API probes (`GET` only).
- Source-of-truth sync in task/state docs.

## Implementation Plan
1. Verify required environment variables are present, without printing values.
2. Execute read-only Coolify API probes with bearer auth.
3. Record evidence and classify residual risk.

## Acceptance Criteria
- At least one authenticated Coolify read endpoint returns success.
- No secret value is logged.
- Task board and project state reflect the verified outcome and any blocker.

## Constraints
- Use existing systems and approved mechanisms.
- No mutating Coolify operations.
- No credential disclosure.

## Definition of Done
- [x] Read-only auth probe executed with evidence.
- [x] Result classified with explicit residual risk.
- [x] Canonical project state files updated.

## Forbidden
- Deploy/restart/rollback actions.
- Secret value output in logs/docs.
- Workarounds that bypass proper Coolify auth.

## Validation Evidence
- Manual checks:
  - Env names present (values redacted): `COOLIFY_API_TOKEN`, `COOLIFY_BASE_URL`, `COOLIFY_SOAR_APP_ID`, `VPS_HOST`, `VPS_SSH_PRIVATE_KEY`, `VPS_SSH_USER`.
  - `GET /api/v1/applications` => `200`, array length `13`.
  - `GET /api/v1/resources` => `200`, array length `17`.
  - `GET /api/v1/applications/{COOLIFY_SOAR_APP_ID}` in previous run returned `404` due to mismatched env value.
  - `GET /api/v1/applications/k126p7vqxs5cly2zc4y4g4rq` (`soar-api`) => `200` (name `soar-api`, status `running:unknown`).
  - `GET /api/v1/applications/ato4fqkncd6t38wzlle2m0rv` (`soar-web`) => `200` (name `soar-web`, status `running:unknown`).
  - `/api/v1/applications/{id}/deployments` => `404` for both app ids (endpoint not present in this Coolify version).
- Reality status: partially verified.

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Rollback note: not applicable (read-only verification only)

## Result Report
- Task summary: Coolify bearer token is valid for read-only inventory endpoints. Secret-access verification is successful for generic resource listing.
- Files changed:
  - `history/tasks/luc-69-ops-smoke-verify-coolify-read-only-secret-access-2026-05-25-task.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
- What is incomplete: `COOLIFY_SOAR_APP_ID` does not resolve (`404`), so app-specific targeting remains misconfigured/stale.
- Next steps:
  1. Refresh `COOLIFY_SOAR_APP_ID` to `ato4fqkncd6t38wzlle2m0rv` (Soar Web) or `k126p7vqxs5cly2zc4y4g4rq` (Soar API) based on this session.
  2. Re-run a single read-only app-specific probe after id refresh.
  3. If deployment metadata is required, query the Coolify UI endpoint that exposes active image/tag for these app IDs, because `/api/v1/deployments` and nested deployment APIs are not exposed in this environment.
