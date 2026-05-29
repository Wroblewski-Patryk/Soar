# LUC-657 ARB-006 Security Approval: Read-Only Principal/Session For `GET /workers/ready`

Date: 2026-05-29  
Issue: `LUC-657`  
Scope: protected readiness endpoint `GET /workers/ready`

## Decision
- Security lane decision: `APPROVED_WITH_CONSTRAINTS`.
- Approved access class:
  - authenticated Soar app session accepted by API auth middleware (`requireAuth`),
  - role restricted to `ADMIN` (`requireRole('ADMIN')`),
  - request path restricted to ops network (`requireOpsNetwork`),
  - read-only usage for readiness/health verification only (no mutation endpoints).

## Evidence Reviewed
- Route guard chain in `apps/api/src/router/index.ts`:
  - `const requireOpsAccess = [requireAuth, requireRole('ADMIN'), requireOpsNetwork]`
  - `router.get('/workers/ready', ...requireOpsAccess, ...)`
- Test coverage in `apps/api/src/router/workers-health-readiness.test.ts`:
  - unauthenticated access is rejected (`401`),
  - authenticated admin path is accepted and evaluated for readiness outcomes.

## Explicit Rejection Criteria
- Reject any artifact that is not accepted by API auth/session contract.
- Reject non-admin or non-ops-network access attempts.
- Reject tokens/sessions with unknown format or stale/expired validation state.
- Reject any proposal that widens scope from read-only readiness checks.

## Redaction And Handling Rules
- Do not store secret values in repo files, comments, artifacts, screenshots, or logs.
- Presence/shape checks are allowed; secret values remain hidden.
- Use shortest-lived credentials feasible and rotate after the window if shared.

## Residual Risk
- Current blocker remains operational: no fresh valid approved artifact has been proven in runner context; prior probes still show `401` for protected readiness.
- Approval here is class-level only and does not prove artifact validity in production runtime.

## Unblock Contract (unchanged)
1. Auth credential owner provides a fresh valid artifact matching this approved class.
2. Ops executes exactly one read-only protected recheck on canonical hosts.
3. Evidence is attached without exposing secrets.

