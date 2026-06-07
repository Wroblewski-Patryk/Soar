# LUC-2618 Smoke Auth Binding For Workers Ready

## Header
- ID: LUC-2618
- Title: Install accepted smoke auth binding for workers/ready
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Ops/Release
- Depends on: LUC-2505
- Priority: P1
- Mission ID: LUC-2618-SMOKE-AUTH-BINDING-WORKERS-READY-2026-06-07
- Mission Status: BLOCKED

## Context
[LUC-2618](/LUC/issues/LUC-2618) is the Ops child for [LUC-2505](/LUC/issues/LUC-2505). It exists because supported smoke auth variable names were present, but no available binding had been accepted by Soar API auth for `GET /workers/ready`.

The wake payload had no pending comments and `fallbackFetchNeeded=false`; checkout was already claimed by the harness and was not repeated.

## Goal
Install or prove an accepted production-smoke auth binding through exactly one supported path:

- `SMOKE_AUTH_TOKEN`, or
- `SMOKE_AUTH_EMAIL` + `SMOKE_AUTH_PASSWORD`.

## Scope
- Supported auth binding names in the current heartbeat environment.
- Existing deploy smoke runner `scripts/deploySmokeCheck.mjs`.
- Production API/Web smoke for `https://api.soar.luckysparrow.ch` and `https://soar.luckysparrow.ch`.

## Constraints
- Do not print or store secret values.
- No deploy, restart, rollback, database mutation, exchange mutation, live-trading mutation, or account mutation.
- Do not treat public smoke success as protected workers-ready success.

## Implementation Plan
1. Confirm supported binding variable names are present without printing values.
2. Run existing deploy smoke with workers included against production API/Web.
3. Test whether the alternate injected production UI auth material can satisfy the same worker-ready path without exposing values.
4. Record exact no-secret evidence and disposition.

## Acceptance Criteria
- `GET /workers/ready` returns an accepted protected response with the supported smoke binding, or the issue is blocked with exact owner/action evidence.
- Public smoke status is recorded separately from protected worker readiness.
- No secret values are written to artifacts or comments.

## Definition of Done
- The accepted binding is proven and [LUC-1438](/LUC/issues/LUC-1438) can rerun worker-included smoke, or [LUC-2618](/LUC/issues/LUC-2618) is blocked with first-class unblock action.

## Validation Evidence
- Supported binding names present: `SMOKE_AUTH_TOKEN`, `SMOKE_AUTH_EMAIL`, and `SMOKE_AUTH_PASSWORD` were populated in the heartbeat environment. Values were not printed or stored.
- Shape check: `SMOKE_AUTH_TOKEN` length was `36`; `SMOKE_AUTH_EMAIL` was present but did not match email shape; `SMOKE_AUTH_PASSWORD` was present.
- Command:
  - `node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`
- Result:
  - `PASS API /health -> 200`
  - `PASS API /ready -> 200`
  - `PASS WEB / -> 200`
  - `PASS WEB /api/build-info -> 200`
  - `FAIL API /workers/ready -> status 401`
- Alternate token check:
  - Temporarily mapped the injected production UI audit token to `SMOKE_AUTH_TOKEN` for the command process only.
  - Public API/Web checks still passed.
  - `GET /workers/ready` still returned `401`.
- Alternate login check:
  - Temporarily mapped injected production UI audit email/password to `SMOKE_AUTH_EMAIL` and `SMOKE_AUTH_PASSWORD` for the command process only.
  - Login failed before token issuance: `login failed (400): Validation failed`.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none performed.
- Health-check impact: public API/Web healthy; protected workers-ready remains blocked by auth.
- Smoke steps updated: no.
- Rollback note: no runtime mutation occurred; rollback not applicable.
- Observability or alerting impact: none.

## Security / Privacy Evidence
- Secret handling: only variable names, boolean presence, and lengths were recorded. Secret values, cookies, tokens, passwords, private account data, and headers were not printed or stored.
- Permission boundary: route code shows `/workers/ready` requires `requireAuth`, `requireRole('ADMIN')`, then `requireOpsNetwork`. The observed `401` means the binding fails before role/network authorization.
- Fail-closed behavior: verified. Public smoke passes, protected worker readiness rejects the current binding.

## Result Report
- Task summary: Current injected `SMOKE_*` auth material is not an accepted Soar API session for production `/workers/ready`.
- Files changed: this evidence file only.
- How tested: existing deploy smoke runner plus no-secret binding shape checks.
- What is incomplete: accepted smoke auth binding is still missing.
- Next steps: Security/Ops secret-store owner must rotate or provision one production-smoke appropriate `ADMIN` principal/session accepted by Soar API auth and bind it to exactly one supported path, preferably `SMOKE_AUTH_TOKEN` or valid `SMOKE_AUTH_EMAIL` + `SMOKE_AUTH_PASSWORD`. After that, wake [LUC-1438](/LUC/issues/LUC-1438) for worker-included smoke rerun.
- Decisions made: [LUC-2618](/LUC/issues/LUC-2618) must remain blocked, not `done` or passive `in_progress`.
