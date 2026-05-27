# Task

## Header
- ID: LUC-241
- Title: [Soar][LUC-99-B] Unblock workers/ready smoke principal permissions
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Ops/Release
- Priority: P1
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: BLOCKED

## Context
Wake payload assigned `LUC-241` to run a concrete unblock checkpoint for the protected worker readiness proof path.

## Goal
Verify whether current smoke principal can authenticate and pass protected `GET /workers/ready` in production.

## Constraints
- Read-only verification only.
- No deploy/restart/rollback/runtime mutation.
- No secret value output.

## Definition of Done
- [x] Re-run production smoke with worker probe.
- [x] Verify auth-path inputs available in runner.
- [x] Isolate whether failure is authn/authz vs endpoint/runtime outage.

## Validation Evidence
- Tests:
  - `corepack pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 71b8d503fd6fdfd7378dc67b2fa678799e2430f8`
- Manual checks:
  - Presence scan: `SOAR_API_TOKEN=False`, `SOAR_API_KEY=False`, `SOAR_SESSION_COOKIE=False`, `SMOKE_AUTH_EMAIL=True`, `SMOKE_AUTH_PASSWORD=True`, `COOLIFY_API_TOKEN=True`.
  - Direct login probe with `SMOKE_AUTH_EMAIL/SMOKE_AUTH_PASSWORD` to `POST /auth/login` returned `400` and no session token.
- Result:
  - Public checks pass (`/health`, `/ready`, web root, `build-info` expected SHA).
  - Protected check still fails: `API /workers/ready -> 401`.
  - Blocker class sharpened: current smoke principal credentials do not establish a valid app session in this runner (login 400), so protected readiness cannot be proven.
- Reality status: blocked

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Rollback note: none
- Observability or alerting impact: none

## Result Report
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action:
  1. Soar API auth credential owner + Security/Test permission owner must provide a valid approved read-only smoke principal/session path that successfully authenticates (`/auth/login`) and is authorized for `GET /workers/ready`.
  2. Ops Release Lead reruns one full production smoke with worker probe and publishes parent closure packet for `LUC-98` / `LUC-47` / `LUC-12` if the protected check passes.

## Continuation Checkpoint (finish_successful_run_handoff, 2026-05-27)
- Wake delta processed with concrete recheck action.
- New secret-path signal in this run:
  - `SMOKE_AUTH_TOKEN=True` (previously absent),
  - `SMOKE_AUTH_EMAIL=True`,
  - `SMOKE_AUTH_PASSWORD=True`.
- Production full smoke rerun result remains unchanged:
  - PASS `API /health`, `API /ready`, `WEB /`, `WEB /api/build-info` (expected SHA matched),
  - FAIL `API /workers/ready -> 401`.
- Token validity probe with provided `SMOKE_AUTH_TOKEN`:
  - `GET /auth/me -> 401` (`Session expired. Please sign in again.`),
  - `GET /workers/health -> 401` (`Invalid token`),
  - `GET /workers/ready -> 401` (`Invalid token`).
- Blocker class is now explicit:
  - a token exists but is not accepted by API session/auth validation, so protected worker-readiness proof still cannot be produced.
- Disposition for continuation heartbeat: `blocked`.

## Continuation Checkpoint (issue_continuation_needed, 2026-05-27)
- Executed another read-only recheck for the same expected SHA:
  - `ops:deploy:smoke` still PASS on public checks and FAIL on
    `API /workers/ready -> 401`.
- Token-shape probe for `SMOKE_AUTH_TOKEN`:
  - present: `true`,
  - length: `36`,
  - JWT parts: `1` (not a bearer JWT shape `x.y.z`).
- Direct protected probes with provided token remain unauthorized:
  - `GET /auth/me -> 401` (`Session expired. Please sign in again.`),
  - `GET /workers/ready -> 401` (`Invalid token`).
- Blocker precision tightened:
  - current `SMOKE_AUTH_TOKEN` value format/path does not satisfy API bearer
    auth contract for protected OPS endpoints.
- Disposition for this continuation heartbeat: `blocked`.

## Continuation Checkpoint (issue_assigned, 2026-05-27, comment f38ed02c-300f-4d13-8012-46528c87634e)
- Latest board comment acknowledged first: runtime secret refs were declared bound for Ops Release Lead and requested one narrow read-only recheck.
- Concrete read-only verification executed (no deploy/restart/runtime mutation):
  - `corepack pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 71b8d503fd6fdfd7378dc67b2fa678799e2430f8`
  - token probe (`Authorization: Bearer SMOKE_AUTH_TOKEN`) for:
    - `GET /auth/me`
    - `GET /workers/health`
    - `GET /workers/ready`
- Results:
  - Smoke summary: public checks PASS (`/health`, `/ready`, web `/`, `build-info` expected SHA), protected check FAIL (`/workers/ready -> 401`).
  - Token probe: `/auth/me -> 401`, `/workers/health -> 401`, `/workers/ready -> 401`.
- Final disposition for this heartbeat: `blocked`.
- First-class blocker:
  - smoke principal credential path is still invalid for current API auth/session validation, so protected readiness proof remains unavailable.
- Unblock owner/action (exact next step):
  1. Soar API auth credential owner + Security/Test permission owner must rotate/refresh an approved read-only smoke principal/session path that authenticates successfully and is authorized for `GET /workers/ready`.
  2. Ops Release Lead reruns one worker-included read-only smoke and publishes parent closure packet only if `/workers/ready` returns success.

## Continuation Checkpoint (issue_reopened_via_comment, 2026-05-27, comment 5e3f1b49-782a-438b-bc58-ac3dc6f9fc15)
- Latest board comment acknowledged first: lane should be closed back to `blocked` and no further reruns should be executed until credential owner provides a valid approved principal/session path.
- Concrete action in this heartbeat:
  - applied status-sync only (no deploy/restart/runtime mutation, no additional smoke reruns),
  - kept fail-closed blocker routing unchanged and explicit.
- Final disposition for this heartbeat: `blocked`.
- Resume gate for next active verification:
  1. credential owner provides refreshed/valid approved read-only principal/session artifact,
  2. then run exactly one worker-included smoke recheck.

## Continuation Checkpoint (issue_continuation_needed, 2026-05-27)
- No new board comment or unblock artifact class was provided in this wake (`0/0`).
- Concrete action in this heartbeat:
  - checked credential-artifact presence only (no smoke/probe reruns per active fail-closed instruction),
  - observed same artifact class as before (`SMOKE_AUTH_TOKEN`, `SMOKE_AUTH_EMAIL`, `SMOKE_AUTH_PASSWORD` present; no new approved session-path artifact).
- Final disposition for this heartbeat: `blocked`.
- Resume gate unchanged:
  1. credential owner provides refreshed/valid approved read-only principal/session artifact,
  2. then run exactly one worker-included smoke recheck.
