# LUC-1190 Workers-Ready Smoke Principal Authorization Gate

Date: 2026-06-01
Issue: `LUC-1190`
Owner: Security Review Lead
Scope: protected read-only smoke checks for `GET /workers/ready`

## Security Gate Decision
- Decision: `APPROVED_WITH_CONSTRAINTS`.
- Protected smoke for `GET /workers/ready` is allowed only when all conditions hold:
  1. valid authenticated Soar app session accepted by `requireAuth`;
  2. principal role is `ADMIN` (`requireRole('ADMIN')`);
  3. request source passes ops-network restriction (`requireOpsNetwork`);
  4. action remains read-only and limited to readiness/health verification.

## Canonical Guard Contract
- Source guard chain:
  - `apps/api/src/router/index.ts`
  - `const requireOpsAccess = [requireAuth, requireRole('ADMIN'), requireOpsNetwork]`
  - `router.get('/workers/ready', ...requireOpsAccess, ...)`
- Regression intent:
  - unauthenticated request denied (`401`),
  - authenticated non-admin principal denied (`403`).

## Fail-Closed Smoke Checks
1. `401` gate check: unauthenticated request to `/workers/ready` must fail.
2. `403` gate check: authenticated non-admin principal to `/workers/ready` must fail.
3. `403` network check: authenticated admin outside allowed ops network must fail.
4. Scope check: any attempt to include mutation endpoints in this smoke packet is rejected.
5. Artifact check: if principal/session freshness or validity is unknown, smoke stays blocked.

## Ops Execution Checklist (No Policy Interpretation Required)
1. Confirm principal artifact class: authenticated Soar session + `ADMIN` role + ops-network path + read-only scope.
Expected: all four constraints are explicitly true before runtime smoke.
2. Run negative check without auth against `GET /workers/ready`.
Expected: `401`.
3. Run negative check with authenticated non-admin principal against `GET /workers/ready`.
Expected: `403`.
4. Run negative check with authenticated admin from disallowed network path against `GET /workers/ready`.
Expected: `403`.
5. Run protected approved smoke with valid read-only admin principal/session.
Expected: authz gate passes (non-`401`/`403`), then readiness status reflects runtime truth (`200` or `503`).
6. Record only redacted evidence (`endpoint`, `status`, `timestamp`, `classification`).
Expected: no token/cookie/session/secret values in outputs.

## Rejection Criteria
- Reject expired/invalid/unknown principal artifacts.
- Reject non-admin principals.
- Reject non-ops-network source path.
- Reject scope expansion beyond read-only readiness checks.
- Reject evidence containing secret values (token/cookie/session content).

## Evidence Handling Rules
- Only record status/result metadata (HTTP code, endpoint, timestamp, classification).
- Redact secrets fully; never store credential/session values.
- If a check cannot run due to runtime/auth bootstrap failure, classify as `blocked`.

## Current Reality Classification (2026-06-01)
- Authorization policy design: `implemented and verified` (source-level).
- Fail-closed test intent: `implemented and verified` (coverage intent present).
- Fresh principal runtime smoke execution: `blocked by error` (auth/bootstrap precondition instability in current runner).

## Safety Decision For Current Smoke Window
- Policy safety: `safe to run` only under this gate contract.
- Operational disposition right now: `blocked` until fresh approved principal/session artifact and stable auth-bootstrap preconditions are available.

## Unblock Owner / Action
1. Backend auth owner: stabilize auth bootstrap path used by readiness test setup.
2. Security/Test credential owner: provide fresh approved read-only principal/session artifact.
3. Ops Release Lead: run exactly one protected read-only `/workers/ready` smoke and publish redacted evidence.
