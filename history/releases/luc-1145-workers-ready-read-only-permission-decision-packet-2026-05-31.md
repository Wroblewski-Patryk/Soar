# LUC-1145 Read-Only Permission Decision Packet For `/workers/ready` Smoke

Date: 2026-05-31
Issue: `LUC-1145`
Parent continuity: `LUC-241`
Security owner: Security Review Lead

## Decision
- Security lane decision: `APPROVED_WITH_CONSTRAINTS`.
- Approved principal/session class:
  - authenticated Soar app session accepted by API auth middleware,
  - role restricted to `ADMIN`,
  - request path restricted to ops network,
  - read-only use limited to protected readiness verification (`GET /workers/ready`) and optional paired read-only health/readiness probes.

## Decision Scope
- This packet approves only permission class and handling controls.
- This packet does not approve mutation endpoints, deploy/restart actions, or any production runtime change.
- This packet does not assert current runtime availability; it only sets security gate conditions for the next smoke attempt.

## Evidence Reviewed
- `history/tasks/luc-241-unblock-workers-ready-smoke-principal-permissions-2026-05-27-task.md`
  - repeated protected smoke attempts with canonical hosts,
  - latest continuity evidence shows canonical runtime unavailable (`503`) and protected proof not currently actionable.
- `history/tasks/luc-1080-infra-gate-diagnose-production-dns-network-failure-for-luc-241-2026-05-31-task.md`
  - canonical DNS resolves,
  - active blocker classified as runtime availability (`503`), not canonical DNS failure.
- `history/releases/luc-657-arb-006-security-approval-read-only-principal-session-2026-05-29.md`
  - prior class-level approval model aligned to route guard chain.
- Guard contract (code and tests already cited in prior packet):
  - `apps/api/src/router/index.ts` for protected ops access chain,
  - `apps/api/src/router/workers-health-readiness.test.ts` for auth/role behavior coverage.

## Local Proof Command
- Timestamp: `2026-05-31T22:11:27.2443449+02:00`
- Command:
  - `rg -n "requireOpsAccess|workers/ready|requireRole\('ADMIN'\)|requireOpsNetwork" apps/api/src/router/index.ts apps/api/src/router/workers-health-readiness.test.ts -S`
- Result highlights:
  - `apps/api/src/router/index.ts:53` => `const requireOpsAccess = [requireAuth, requireRole('ADMIN'), requireOpsNetwork] as const;`
  - `apps/api/src/router/index.ts:128` => `router.get('/workers/ready', ...requireOpsAccess, async (_req, res) => {`
  - `apps/api/src/router/workers-health-readiness.test.ts` contains admin-agent `/workers/ready` coverage (`lines 72, 91, 107, 130, 152`).

## Security Verdict Matrix
- Permission model for read-only protected smoke: `implemented and verified` (route guard chain + test coverage already documented).
- Smoke principal artifact validity in current runner context: `blocked by error` (`503` canonical runtime window prevents useful protected authz evaluation in latest continuity fact).
- Runtime availability precondition for permission proof: `blocked by error` (canonical probes currently return `503`).
- Secret-redaction handling posture for this lane: `implemented and verified` (presence-only reporting, no secret values in evidence).

## Explicit Rejection Criteria
- Reject credentials/sessions not accepted by API auth/session contract.
- Reject non-admin principals.
- Reject non-ops-network source path.
- Reject any scope expansion beyond read-only protected readiness evidence.
- Reject repeated rerun loops without a fresh gate approval when previous approved one-shot recheck is already consumed.

## Approved One-Shot Recheck Contract (Post-Recovery)
1. Precondition A: canonical runtime returns healthy public baseline (`/health`, `/ready`, web `/`, build-info not `503`).
2. Precondition B: approved read-only principal/session artifact is fresh and accepted by API auth contract.
3. Action: run exactly one read-only protected smoke including `GET /workers/ready` on canonical hosts.
4. Evidence: store only status/result metadata; no token/cookie/session values.
5. If failure persists: classify as authn/authz vs runtime regression and return lane to `blocked` with owner/action.

## Residual Risk
- Current production interval remains runtime-degraded (`503`), so permission-path proof cannot be completed now.
- If stale/non-canonical hosts are reused, evidence quality regresses and can misclassify blocker cause.

## Unblock Owner / Action
1. Ops Release Lead + platform/Coolify runtime owner: restore canonical runtime availability from `503` to healthy responses.
2. Security/Test permission owner + API auth credential owner: confirm a fresh approved read-only principal/session artifact class for the protected check.
3. Ops Release Lead: execute one approved read-only protected `/workers/ready` smoke recheck and publish redaction-safe result.
