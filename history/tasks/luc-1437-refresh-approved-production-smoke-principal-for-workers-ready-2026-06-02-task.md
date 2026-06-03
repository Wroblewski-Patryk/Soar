# Task

## Header
- ID: LUC-1437
- Title: [Security][Soar] Refresh approved production smoke principal for protected workers/ready
- Task Type: security
- Current Stage: verification
- Status: BLOCKED
- Owner: Security Review Lead
- Depends on: LUC-1435
- Blocks: LUC-1435
- Blocked by: LUC-1438
- Priority: high
- Date: 2026-06-02

## Context
Parent issue `LUC-1435` verified public production API/Web health after the
DCA-before-close redeploy, but protected `GET /workers/ready` stayed
unverified because the current smoke credential bindings failed (`401` token
path, `400 Validation failed` login fallback).

## Goal
Refresh or provide an approved read-only production smoke principal/session
handoff path for protected `GET /workers/ready` without exposing secret values.

## Scope
- `history/evidence/luc-1435-coolify-redeploy-production-smoke-2026-06-02.md`
- `history/releases/luc-1190-workers-ready-smoke-principal-authorization-gate-2026-06-01.md`
- `scripts/deploySmokeCheck.mjs`
- `scripts/resolveOpsAuthToken.mjs`
- `history/evidence/luc-1437-workers-ready-smoke-principal-refresh-gate-2026-06-02.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Constraints
- Do not print, persist, screenshot, or comment secret values.
- Do not use the user's real account unless explicitly approved for this exact
  narrow check.
- Do not mutate deploys, runtime, database, user settings, subscriptions,
  payment, exchange API keys, live trading, or production account state.

## Definition of Done
- [x] Existing security gate for principal scope revalidated.
- [x] Current binding/session usability classified without printing values.
- [x] First-class unblock owner/action created when refresh could not be
  completed in this runner.
- [x] Parent issue disposition updated with blocker.

## Forbidden
- No live trading, exchange setting, subscription, payment, API-key, database,
  deploy, restart, rollback, or user-account mutation.
- No secret values in repo files, issue comments, logs, screenshots, or final
  reports.

## Implementation Plan
1. Read issue context and previous `LUC-1190` security gate.
2. Inspect current smoke script/auth token resolution contract.
3. Run redacted binding presence/shape checks only.
4. Create a first-class credential refresh blocker for QA when current
   bindings cannot be approved.
5. Update Paperclip and repo evidence with blocked disposition.

## Acceptance Criteria
- Valid binding/session handoff path is either provided or explicitly blocked
  with a named owner/action.
- Principal scope remains read-only, admin, ops-network, and production-smoke
  appropriate.
- Rerun command for Ops remains documented.
- No sensitive values are exposed.

## Validation Evidence
- `GET /api/issues/LUC-1437/heartbeat-context` confirmed current issue scope
  and `LUC-1435` blocker relationship.
- `Get-ChildItem Env:SMOKE_AUTH*,Env:SOAR_API*,Env:SOAR_SESSION*` confirmed
  only binding names and lengths.
- Redacted shape check result:
  - `SMOKE_AUTH_TOKEN`: present, length 36, not JWT-shaped;
  - `SMOKE_AUTH_EMAIL`: present, length 36, not email-shaped;
  - `SMOKE_AUTH_PASSWORD`: present, length 39, value not inspected.
- `LUC-1438` was created and assigned to QA Regression Lead for credential
  binding refresh.

## Security / Privacy Evidence
- Data classification: production auth/session credential path for protected
  operations readiness endpoint.
- Trust boundaries: app auth session, admin role, ops-network guard, read-only
  readiness scope.
- Abuse cases preserved:
  - stale/invalid token -> deny;
  - malformed login binding -> deny;
  - non-admin/off-network principal -> deny;
  - mutation endpoints -> out of scope.
- Secret handling: no credential values printed or persisted.

## Result Report
- Current production smoke principal cannot be refreshed or approved from this
  runner because the injected token does not match the expected bearer/session
  shape and the email binding does not match the login contract.
- Created blocker `LUC-1438` for QA to refresh/provide valid production smoke
  auth bindings.
- Disposition: `blocked` by `LUC-1438`.
