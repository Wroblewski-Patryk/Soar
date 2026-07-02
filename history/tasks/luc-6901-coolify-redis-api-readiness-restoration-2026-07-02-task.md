# Task - LUC-6901 Coolify/Redis/API Readiness Restoration

## Context

[LUC-6901](/LUC/issues/LUC-6901) is the recovery child for
[LUC-6898](/LUC/issues/LUC-6898). The parent diagnosis found production API
`/ready` returning `503`, admin login returning `503`, and Coolify read-only
API calls returning `500`, with Redis dependency failure suspected.

## Goal

Determine whether the production API readiness failure still reproduces and
leave a durable Paperclip disposition without performing unauthorized
production mutation.

## Constraints

- COO owns coordination, evidence, and blocker routing, not silent production
  lifecycle mutation.
- No secret disclosure.
- No deploy, push, restart, rollback execution, env edit, DB/Redis mutation,
  account mutation, exchange/payment mutation, order, position, subscription
  mutation, or live-trading action.
- Use the smallest proof that demonstrates current readiness state.

## Current Stage

verification

Expected output: public readiness proof, resource-readback limitation, issue
disposition, and parent-handoff note.

## Definition of Done

- Fresh production public smoke is recorded.
- Coolify/Redis readback availability is recorded without exposing secrets.
- Source-control closure is explicit.
- Paperclip issue receives a final disposition.

## Implementation Plan

1. Read the inline wake payload and [LUC-6901](/LUC/issues/LUC-6901)
   heartbeat context.
2. Review [LUC-6898](/LUC/issues/LUC-6898) diagnosis evidence.
3. Rerun public deploy smoke with workers excluded.
4. Probe API/Web endpoints and build-info.
5. Check only Coolify binding-name presence, without printing secret values.
6. Record evidence and close the issue according to the current state.

## Acceptance Criteria

- API `/health` and `/ready` return `200`, or the failure is routed to the
  correct owner with a blocker.
- Web `/` and `/api/build-info` return `200`.
- Any missing resource-level proof is named as residual risk.
- No production mutation is performed without approval.

## Validation Evidence

- `corepack pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`
  -> pass.
- Manual probes:
  - API `/health` -> `200`.
  - API `/ready` -> `200`.
  - Web `/` -> `200`.
  - Web `/api/build-info` -> `200`, SHA
    `c357d957741f56835f27a1fc3a948dad43a91036`.
  - API `/workers/ready` unauthenticated -> `401`, expected fail-closed.
- Coolify binding-name check -> required names absent in this COO runner, so
  resource-level Coolify/Redis proof was not performed.

## Result Report

- Task summary: the public API readiness failure from
  [LUC-6898](/LUC/issues/LUC-6898) no longer reproduces; public deploy smoke
  now passes.
- Files changed:
  - `history/evidence/luc-6901-coolify-redis-api-readiness-restoration-2026-07-02.md`
  - `history/tasks/luc-6901-coolify-redis-api-readiness-restoration-2026-07-02-task.md`
- Verification command/result: public deploy smoke passed; manual public probes
  passed except unauthenticated protected worker readiness, which returned the
  expected `401`.
- Commit SHA: not committed; evidence-only COO heartbeat in an already dirty
  and divergent shared Soar worktree.
- Push status: not needed.
- Deploy impact: none from this heartbeat; no mutation performed.
- Coolify/resource evidence: blocked in this runner by missing Coolify binding
  names; public API readiness is restored.
- Residual risk: DRE/QVE should rerun protected `/ready/details`, runtime
  freshness, rollback guard, authenticated acceptance, and resource inventory
  through the parent flow if release acceptance needs full protected proof.

## Forbidden

- Secret disclosure.
- Live trading/account mutation.
- Production restart, deploy, rollback, DNS edit, provider mutation, DB/Redis
  mutation, or env edit without explicit permit.
- Push from dirty/divergent checkout.

