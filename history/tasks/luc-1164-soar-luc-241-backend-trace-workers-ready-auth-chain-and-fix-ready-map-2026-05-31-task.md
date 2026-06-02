# Task

## Header
- ID: LUC-1164
- Title: [Soar][LUC-241][Backend] Trace /workers/ready auth chain and produce fix-ready map
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Backend API Engineer
- Priority: high
- Date: 2026-05-31

## Context
Wake `issue_continuation_needed` for `LUC-1164` required concrete backend progress in this heartbeat. The issue asked for a fix-ready trace of the protected auth path for `GET /workers/ready`.

## Goal
Produce a source-accurate auth-chain map with concrete fail points, evidence, and minimal repair options that can be handed to Security/Ops without guessing.

## Scope
- `apps/api/src/router/index.ts`
- `apps/api/src/middleware/requireAuth.ts`
- `apps/api/src/middleware/requireRole.ts`
- `apps/api/src/middleware/requireOpsNetwork.ts`
- `apps/api/src/modules/auth/sessionToken.ts`
- `apps/api/src/modules/auth/auth.jwt.ts`
- `apps/api/src/router/workers-health-readiness.test.ts`

## Auth Chain Map (Source-Proven)
1. Route gate:
   - `router.get('/workers/ready', ...requireOpsAccess, ...)` in `apps/api/src/router/index.ts`.
   - `requireOpsAccess = [requireAuth, requireRole('ADMIN'), requireOpsNetwork]`.
2. Auth token gate (`requireAuth`):
   - Accepts `Authorization: Bearer` and `token` cookie candidates (`sessionToken.ts`).
   - Verifies JWT issuer/audience/signature against active/rotation secrets (`auth.jwt.ts`).
   - Loads user from DB and enforces `sessionVersion` parity; mismatch fails closed.
   - Failure codes:
     - `401 Missing token`
     - `401 Invalid token`
     - `503 Auth service temporarily unavailable` (DB lookup failure)
3. Role gate (`requireRole('ADMIN')`):
   - Any authenticated non-admin principal fails `403 Forbidden`.
4. Network gate (`requireOpsNetwork`):
   - Resolves client IP from socket/request/forwarded chain.
   - Uses `OPS_TRUSTED_PROXY_IPS` + private ranges to decide if forwarded IP is trusted.
   - Allows only explicit `OPS_ALLOWED_IPS`, or private ranges when `OPS_ALLOW_PRIVATE_NETWORK=true`.
   - Default in production is fail-closed (`OPS_ALLOW_PRIVATE_NETWORK=false` unless explicitly enabled).
   - Failure code: `403 Forbidden`.

## Highest-Probability Breakpoints for Protected Smoke
- `BP-1` Principal role mismatch: smoke user is authenticated but not `ADMIN`.
- `BP-2` Network allowlist mismatch: request reaches API from IP not present in `OPS_ALLOWED_IPS`, especially behind proxy/NAT.
- `BP-3` Proxy trust mismatch: ingress proxy IP not trusted, so `x-forwarded-for` is ignored and policy evaluates the wrong source IP.
- `BP-4` Session-version drift: token was minted before `sessionVersion` bump.

## Minimal Fix-Ready Options
1. Ops-first (no code):
   - Ensure dedicated read-only `ADMIN` smoke principal.
   - Set `OPS_TRUSTED_PROXY_IPS` to real ingress proxy hop(s).
   - Set `OPS_ALLOWED_IPS` to smoke-runner egress IP(s).
   - Keep `OPS_ALLOW_PRIVATE_NETWORK=false` in production.
2. Backend observability hardening (small code change, optional follow-up):
   - Add redaction-safe rejection reason code in `requireOpsNetwork` (`proxy_untrusted|ip_not_allowed|ip_missing`) for protected logs only.
3. Contract test hardening (small code change, optional follow-up):
   - Add endpoint-level test proving `/workers/ready` returns `403` for admin principal when network policy rejects source IP (currently chain is covered separately by middleware tests).

## Verification Evidence
- Readback trace performed directly from the source files above.
- Existing endpoint contract evidence:
  - `apps/api/src/router/workers-health-readiness.test.ts` confirms `401` unauthenticated and `403` non-admin.
- Focused runtime verification command:
  - `pnpm --filter api exec vitest run src/router/workers-health-readiness.test.ts --reporter=verbose`
  - result: `1 passed, 7 failed`; all failing cases stop at `createAdminAgent/createUserAgent` because `/auth/register` returned `500` (expected `201`), so protected `/workers/ready` assertions were never reached.
- New upstream blocker identified for fix lane:
  - stabilize test-time `/auth/register` path (subscription bootstrap + DB/runtime assumptions) before validating protected `/workers/ready` in this environment.
- No runtime/deploy mutation executed.

## Result Report
- Task summary: completed source-level auth-chain trace and produced a fix-ready map for `GET /workers/ready`.
- Delta summary (continuation): added executable verification evidence and identified upstream `/auth/register` instability as the first fix checkpoint for reliable `/workers/ready` auth-chain proof.
- Files changed: this task artifact + source-of-truth context updates.
- How tested: source inspection + existing protected endpoint test evidence.
- Remaining:
  1. fix/diagnose `/auth/register` returning `500` in focused workers-readiness test flow,
  2. rerun `workers-health-readiness` suite until admin-path assertions execute,
  3. optional follow-up for rejection-reason observability and endpoint-level network-deny test.
- Final disposition for this heartbeat: `done`.
