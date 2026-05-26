# LUC-153 - Coolify production deploy health sweep (2026-05-26)

## Context
Issue assigned as critical Ops Release Lead heartbeat for fresh production deploy-health truth on Soar.

## Goal
Capture fresh no-secret read-only production health evidence and set a clear lane disposition.

## Constraints
- Read-only checks only.
- No deploy/restart/rollback/env mutation.
- No secret value exposure.

## Delivery Stage
`verification`

## Definition of Done
- Public production probes captured (`/health`, `/ready`, `/api/build-info`).
- Coolify production resource snapshot captured for Soar production environment.
- Final disposition with unblock owner/action recorded when needed.

## Forbidden
- Production mutation without explicit release mutation permit.
- Secret/token leakage in output artifacts.

## Actions Executed
1. Ran no-secret production smoke:
   - `node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --skip-workers`
2. Read build metadata:
   - `GET https://soar.luckysparrow.ch/api/build-info`
3. Queried Coolify read-only inventory (`/api/v1/projects`, `/api/v1/applications`, `/api/v1/resources`) and filtered Soar production resources (`environment_id=6`).

## Verification Result
- Public probes: `verified` (`200` for API `/health`, API `/ready`, Web `/`, Web `/api/build-info`).
- Build-info SHA: `3fedb7a9170097b40accb6ccea1915064f383f11` (`metadataSource=github-branch`).
- Coolify resource model visibility: `verified` (8 production resources).
- Fleet health gate: `failed` due to `workers-market-stream=exited:unhealthy`.

## Residual Risk
- Runtime market-stream continuity for production remains unproven/failed while the worker stays unhealthy.

## Unblock Owner / Action
- Owner: Ops Release Lead + host operator with Coolify mutation authority.
- Action: execute authenticated worker recovery (restart/redeploy per release permit), then attach expected-SHA temp-domain smoke/readiness packet + worker readiness + rollback note.

## Final Disposition
`blocked`

## 2026-05-26 Resume Delta (finish_successful_run_handoff)
- Wake reconciled with current packet state: no pending comments (`0/0`), no
  new blocker-closure evidence, and no scope-change request.
- Anti-stale closure applied: this issue remains `blocked` and should not
  return to passive `in_progress` without fresh recovery evidence for
  `workers-market-stream` plus expected-SHA temp-domain acceptance packet.

## 2026-05-26 Resume Delta (source_scoped_recovery_action)
- Wake reconciled against inline payload first (no thread refetch required):
  pending comments remain `0/0`, latest comment id remains `unknown`, and no
  fresh recovery packet was provided.
- Capacity-governor-safe action: status-only reconciliation executed; no wake,
  reopen, reassign, or new parallel lane creation.
- Final disposition preserved as `blocked` with unchanged unblock owner/action:
  Ops Release Lead + host operator must provide authenticated
  `workers-market-stream` recovery evidence plus expected-SHA temp-domain
  smoke/readiness packet and rollback note.
