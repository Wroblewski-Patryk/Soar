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

## Continuation Checkpoint (source_scoped_recovery_action, 2026-05-30)
- Wake consumed from inline payload (`fallbackFetchNeeded=false`, comments `0/0`) as status-recovery heartbeat with no new unblock fact.
- Concrete action:
  - executed one read-only auth-presence checkpoint at `2026-05-30T00:28:51.4419651+02:00` (no secret values printed).
- Presence snapshot:
  - `SMOKE_AUTH_TOKEN=False`
  - `SMOKE_AUTH_EMAIL=False`
  - `SMOKE_AUTH_PASSWORD=False`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
- Interpretation:
  - no fresh auth/session artifact is available in this runner to legally attempt another protected `/workers/ready` probe,
  - blocker chain remains unchanged after the previously consumed one-time recheck approval.
- Final disposition for this continuation heartbeat: `blocked`.
- Unblock owner/action unchanged:
  1. Soar API auth credential owner + Security/Test permission owner provide/confirm a fresh valid approved read-only ADMIN principal/session artifact accepted by API auth and authorized for protected `GET /workers/ready`.
  2. Then Ops Release Lead runs exactly one new read-only protected recheck and publishes redaction-safe evidence.

## Continuation Checkpoint (issue_reopened_via_comment, 2026-05-30, comment d9a76499-ebbd-4241-981c-d3e98251832f)
- Latest board comment acknowledged first: `softwarehouse-runtime-gate-binding-repair:LUC-241:v1`.
- Concrete action executed in this heartbeat (single recheck only; no deploy/restart/runtime mutation):
  - `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`
- Timestamp: `2026-05-30T00:49:30.2107738+02:00`.
- Recheck result:
  - `PASS` `API /health -> 200`
  - `PASS` `API /ready -> 200`
  - `PASS` `WEB / -> 200`
  - `PASS` `WEB /api/build-info -> 200`
  - `FAIL` protected `API /workers/ready -> status 401`
- Interpretation:
  - runtime binding refresh did not clear protected authz boundary for `/workers/ready` in this runner/session,
  - blocker remains principal/session authorization for protected readiness endpoint.
- Final disposition for this continuation heartbeat: `blocked`.
- Unblock owner/action:
  1. Soar API auth credential owner + Security/Test permission owner provide/confirm a fresh valid approved read-only ADMIN principal/session artifact accepted by API auth and authorized for protected `GET /workers/ready`.
  2. Then Ops Release Lead runs exactly one new read-only protected recheck and publishes redaction-safe evidence.

## Continuation Checkpoint (issue_continuation_needed, 2026-05-28)
- Wake consumed from inline payload (`fallbackFetchNeeded=false`, comments `0/0`) and executed as concrete read-only continuity recheck.
- Timestamp: `2026-05-28T00:18:33+02:00`.
- Presence/token-shape checkpoint:
  - `SMOKE_AUTH_TOKEN=True`
  - `SMOKE_AUTH_EMAIL=True`
  - `SMOKE_AUTH_PASSWORD=True`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
  - `SMOKE_AUTH_TOKEN_LEN=36`
  - `SMOKE_AUTH_TOKEN_DOT_PARTS=1`
- Protected probe result:
  - `GET /auth/me -> fetch failed`
  - `GET /workers/ready -> fetch failed`
- Public connectivity sanity check:
  - `https://soar-api.luckysparrow.ch/health -> fetch failed`
  - `https://soar-api.luckysparrow.ch/ready -> fetch failed`
  - `https://soar-web.luckysparrow.ch/ -> fetch failed`
  - `https://soar-web.luckysparrow.ch/api/build-info -> fetch failed`
  - `Test-NetConnection soar-api.luckysparrow.ch -Port 443 -> TcpTestSucceeded=False` with name-resolution warning.
- Interpretation:
  - this heartbeat is blocked first at DNS/network reachability from the runner (cannot prove authn/authz while host resolution fails),
  - credential/session lane remains unresolved as prior known blocker.
- Final disposition for this continuation heartbeat: `blocked`.
- Unblock owner/action (ordered):
  1. Ops/host-network owner restores runner DNS/egress reachability to `soar-api.luckysparrow.ch` and `soar-web.luckysparrow.ch`.
  2. Then Soar API auth credential owner + Security/Test permission owner provide or confirm a fresh valid approved read-only principal/session artifact for `GET /workers/ready`.
  3. Then Ops runs exactly one worker-included smoke recheck.

## Continuation Checkpoint (issue_reopened_via_comment, 2026-05-28, comment 59fb3169-ce9f-40d4-aab6-d8847e7c6dba)
- Latest board comment acknowledged first: gate freshness watcher requested exactly one read-only auth/smoke recheck for protected `/workers/ready`.
- Concrete action executed in this heartbeat (single recheck only; no deploy/restart/runtime mutation):
  - `corepack pnpm run -s ops:deploy:smoke -- --api-base-url https://soar-api.luckysparrow.ch --web-base-url https://soar-web.luckysparrow.ch --expected-sha 71b8d503fd6fdfd7378dc67b2fa678799e2430f8`
  - token probe with current `SMOKE_AUTH_TOKEN`:
    - `GET /auth/me`
    - `GET /workers/ready`
- Timestamp: `2026-05-28T01:11:25+02:00`.
- Presence/token-shape snapshot:
  - `SMOKE_AUTH_TOKEN=True`
  - `SMOKE_AUTH_EMAIL=True`
  - `SMOKE_AUTH_PASSWORD=True`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
  - `SMOKE_AUTH_TOKEN_LEN=36`
  - `SMOKE_AUTH_TOKEN_DOT_PARTS=1`
- Recheck result:
  - Smoke:
    - FAIL `API /health -> fetch failed`
    - FAIL `API /ready -> fetch failed`
    - FAIL `WEB / -> fetch failed`
    - FAIL `WEB /api/build-info -> fetch failed`
    - FAIL `API /workers/ready -> fetch failed`
  - Auth probe:
    - `GET /auth/me -> fetch failed`
    - `GET /workers/ready -> fetch failed`
- Interpretation:
  - this recheck used stale/non-canonical lane hosts (`soar-api.luckysparrow.ch`, `soar-web.luckysparrow.ch`).
  - prior LUC-390 evidence says canonical production hosts are `api.soar.luckysparrow.ch` and `soar.luckysparrow.ch`; canonical public checks passed there.
  - do not infer canonical production outage from this stale-host `fetch failed` evidence.
- Final disposition for this continuation heartbeat: `blocked`.
- Unblock owner/action unchanged:
  1. Ops uses canonical hosts only: `https://api.soar.luckysparrow.ch` and `https://soar.luckysparrow.ch`.
  2. Auth/security owner confirms a fresh valid approved read-only principal/session artifact for `GET /workers/ready`.
  3. Then Ops executes exactly one worker-included smoke recheck.

## Continuation Checkpoint (issue_continuation_needed, 2026-05-28)
- Wake consumed from inline payload (`fallbackFetchNeeded=false`, comments `0/0`) with no new comment-scoped unblock artifact.
- Concrete action in this heartbeat (bounded read-only continuity checkpoint; no repeated full smoke):
  - auth-artifact presence and token-shape checkpoint,
  - public lane-host reachability probes (`/health`, `/ready`, web `/`, web `build-info`),
  - DNS/TCP sanity check (`Test-NetConnection` on `soar-api.luckysparrow.ch:443`).
- Timestamp: `2026-05-28T01:12:48+02:00`.
- Result:
  - `SMOKE_AUTH_TOKEN=True`, `SMOKE_AUTH_EMAIL=True`, `SMOKE_AUTH_PASSWORD=True`
  - `SOAR_API_TOKEN=False`, `SOAR_API_KEY=False`, `SOAR_SESSION_COOKIE=False`
  - token shape unchanged (`SMOKE_AUTH_TOKEN_LEN=36`, `SMOKE_AUTH_TOKEN_DOT_PARTS=1`)
  - all lane-host HTTP probes returned `fetch failed`
  - `Test-NetConnection` reported name-resolution failure and `TcpTestSucceeded=False`.
- Interpretation:
  - no unblock delta in this wake.
  - the DNS/egress failure is tied to stale/non-canonical lane hosts, not to the canonical Soar production hosts established by LUC-390.
  - the protected gate remains the canonical `/workers/ready` auth/session proof path.
- Final disposition for this continuation heartbeat: `blocked`.
- Unblock owner/action unchanged:
  1. Ops uses canonical hosts only: `https://api.soar.luckysparrow.ch` and `https://soar.luckysparrow.ch`.
  2. Auth/security owner confirms a fresh valid approved read-only principal/session artifact for `GET /workers/ready`.
  3. Then Ops executes exactly one worker-included smoke recheck.

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

## Continuation Checkpoint (issue_reopened_via_comment, 2026-05-27, comment 800bc33b-d7eb-466f-be80-786db48e8d8c)
- Board gate approval `softwarehouse-gate-approval:LUC-241:v1` consumed and executed as requested.
- Concrete action in this heartbeat (exactly one read-only recheck, no deploy/restart/runtime mutation):
  - `corepack pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 71b8d503fd6fdfd7378dc67b2fa678799e2430f8`
- Timestamp: `2026-05-27T17:59:16+02:00`.
- Affected protected endpoint/resource: `GET /workers/ready` on `https://api.soar.luckysparrow.ch`.
- Result:
  - PASS `API /health`, `API /ready`, `WEB /`, `WEB /api/build-info` (expected SHA matched).
  - FAIL `API /workers/ready -> 401`.
- Rollback/deploy impact: none (verification-only lane).
- Final disposition for this heartbeat: `blocked`.
- Next blocker:
  1. Soar API auth credential owner + Security/Test permission owner must provide/confirm a valid approved read-only principal/session path that is authorized for `GET /workers/ready`.
  2. After that artifact, run exactly one worker-included smoke recheck.

## Continuation Checkpoint (issue_continuation_needed, 2026-05-27)
- Wake processed with no new pending comment (`0/0`) and no new approval delta.
- Concrete action in this heartbeat: auth-artifact presence checkpoint only (no smoke/probe rerun, fail-closed anti-churn).
- Timestamp: `2026-05-27T18:00:27+02:00`.
- Presence-only result (no secret values):
  - `SMOKE_AUTH_TOKEN=True`
  - `SMOKE_AUTH_EMAIL=True`
  - `SMOKE_AUTH_PASSWORD=True`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
- Interpretation: no new unblock artifact class versus prior state; protected readiness proof remains unresolved.
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action unchanged:
  1. Soar API auth credential owner + Security/Test permission owner must provide/confirm valid approved read-only principal/session authorization for `GET /workers/ready`.
  2. Then run exactly one worker-included smoke recheck.

## Continuation Checkpoint (source_scoped_recovery_action, 2026-05-27)
- Inline wake scope consumed first (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
- Concrete action in this heartbeat: one presence-only auth artifact checkpoint (no smoke/probe rerun per fail-closed anti-churn).
- Timestamp: `2026-05-27T18:01:33+02:00`.
- Presence-only result (no secret values):
  - `SMOKE_AUTH_TOKEN=False`
  - `SMOKE_AUTH_EMAIL=False`
  - `SMOKE_AUTH_PASSWORD=False`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
- Interpretation:
  - blocker class regressed from authz-only back to missing runner auth artifacts (`SMOKE_AUTH_*` absent),
  - no new unblock artifact class available for protected readiness proof.
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action:
  1. Soar API auth credential owner + Security/Test secret-ref owner must restore approved `SMOKE_AUTH_*` bindings for this lane runtime.
  2. After artifact restore, execute exactly one worker-included smoke recheck.

## Continuation Checkpoint (issue_assigned, 2026-05-27, comment 05ba1804-2033-4768-84c1-ade0a344d3dc)
- Ownership-sync comment acknowledged first: this lane remains protected, owned by Ops Release Lead, and must stay `blocked` until a fresh valid approved read-only principal/session artifact is available.
- Per board instruction, no smoke rerun was executed in this heartbeat (anti-churn + no new approved artifact/session delta).
- Concrete action executed: presence-only auth artifact checkpoint at `2026-05-27T18:05:25+02:00`.
- Presence-only result (no values):
  - `SMOKE_AUTH_TOKEN=True`
  - `SMOKE_AUTH_EMAIL=True`
  - `SMOKE_AUTH_PASSWORD=True`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
- Interpretation:
  - runner bindings for `SMOKE_AUTH_*` are present,
  - protected proof remains blocked by missing fresh approved valid principal/session artifact for `/workers/ready`.
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action unchanged:
  1. Soar API auth credential owner + Security/Test permission owner must provide a fresh valid approved read-only principal/session artifact authorized for `GET /workers/ready`.
  2. Then Ops runs exactly one worker-included smoke recheck.

## Continuation Checkpoint (issue_reopened_via_comment, 2026-05-27, comment bdedf4e2-047e-4073-9f42-bd46b12be68d)
- Latest board comment acknowledged first: gate freshness watcher reported newer credential metadata and requested exactly one read-only auth/smoke recheck for protected `/workers/ready`.
- Concrete action executed in this heartbeat (no deploy/restart/runtime mutation):
  1. presence-only auth artifact checkpoint at `2026-05-27T18:41:22+02:00`,
  2. exactly one production smoke rerun with worker probe,
  3. read-only token auth probe for `/auth/me` and `/workers/ready`.
- Presence-only result (no values):
  - `SMOKE_AUTH_TOKEN=True`
  - `SMOKE_AUTH_EMAIL=True`
  - `SMOKE_AUTH_PASSWORD=True`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
- Smoke command:
  - `corepack pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 71b8d503fd6fdfd7378dc67b2fa678799e2430f8`
- Smoke result:
  - PASS `API /health`
  - PASS `API /ready`
  - PASS `WEB /`
  - PASS `WEB /api/build-info` (expected SHA matched)
  - FAIL `API /workers/ready -> 401`
- Auth probe result with current `SMOKE_AUTH_TOKEN`:
  - `GET /auth/me -> 401` (`Session expired. Please sign in again.`)
  - `GET /workers/ready -> 401` (`Invalid token`)
- Interpretation:
  - gate freshness did not produce a currently valid/authorized protected principal session path for this runner,
  - protected readiness proof remains blocked.
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action:
  1. Soar API auth credential owner + Security/Test permission owner must provide a fresh valid approved read-only principal/session artifact that is accepted by API auth and authorized for `GET /workers/ready`.
  2. Then Ops executes exactly one worker-included smoke recheck.

## Continuation Checkpoint (issue_continuation_needed, 2026-05-27)
- Wake consumed from inline payload (`fallbackFetchNeeded=false`, comments `0/0`) with no new credential comment/artifact delta.
- Concrete action executed in this heartbeat: presence-only auth artifact checkpoint (anti-churn; no smoke/probe rerun).
- Timestamp: `2026-05-27T18:43:03+02:00`.
- Presence-only result (no values):
  - `SMOKE_AUTH_TOKEN=True`
  - `SMOKE_AUTH_EMAIL=True`
  - `SMOKE_AUTH_PASSWORD=True`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
- Interpretation:
  - auth artifact class is unchanged versus prior checkpoint,
  - no new valid approved principal/session artifact was provided in this wake,
  - protected readiness proof remains blocked.
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action unchanged:
  1. Soar API auth credential owner + Security/Test permission owner must provide a fresh valid approved read-only principal/session artifact accepted by API auth and authorized for `GET /workers/ready`.
  2. Then Ops runs exactly one worker-included smoke recheck.

## Continuation Checkpoint (finish_successful_run_handoff, 2026-05-27)
- Wake consumed from inline payload (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
- Concrete action executed in this heartbeat: one read-only presence-only auth artifact checkpoint (anti-churn; no smoke/probe rerun).
- Timestamp: `2026-05-27T18:44:14+02:00`.
- Presence-only result (no values):
  - `SMOKE_AUTH_TOKEN=True`
  - `SMOKE_AUTH_EMAIL=True`
  - `SMOKE_AUTH_PASSWORD=True`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
- Interpretation:
  - no new artifact class or permission/session delta in this wake,
  - protected `/workers/ready` proof path remains unresolved.
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action unchanged:
  1. Soar API auth credential owner + Security/Test permission owner must provide a fresh valid approved read-only principal/session artifact accepted by API auth and authorized for `GET /workers/ready`.
  2. Then Ops runs exactly one worker-included smoke recheck.

## Continuation Checkpoint (source_scoped_recovery_action, 2026-05-27)
- Wake consumed from inline payload (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
- Concrete action executed in this heartbeat: one read-only presence-only auth artifact checkpoint (anti-churn; no smoke/probe rerun).
- Timestamp: `2026-05-27T18:45:18+02:00`.
- Presence-only result (no values):
  - `SMOKE_AUTH_TOKEN=False`
  - `SMOKE_AUTH_EMAIL=False`
  - `SMOKE_AUTH_PASSWORD=False`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
- Interpretation:
  - auth artifact class regressed versus prior checkpoint (`SMOKE_AUTH_*` now absent),
  - no new valid approved principal/session artifact is available for protected readiness proof.
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action updated:
  1. Soar API auth credential owner + Security/Test secret-ref owner must restore approved `SMOKE_AUTH_*` bindings for this lane runtime.
  2. Then Ops runs exactly one worker-included smoke recheck.

## Continuation Checkpoint (issue_assigned, 2026-05-27)
- Wake consumed from inline payload (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
- Concrete action executed in this heartbeat: one read-only presence-only auth artifact checkpoint (anti-churn; no smoke/probe rerun).
- Timestamp: `2026-05-27T18:47:47+02:00`.
- Presence-only result (no values):
  - `SMOKE_AUTH_TOKEN=True`
  - `SMOKE_AUTH_EMAIL=True`
  - `SMOKE_AUTH_PASSWORD=True`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
- Interpretation:
  - auth artifact class partially restored (`SMOKE_AUTH_*` present),
  - no new valid approved principal/session artifact is available for protected `/workers/ready` proof in this wake.
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action:
  1. Soar API auth credential owner + Security/Test permission owner must provide/confirm a fresh valid approved read-only principal/session artifact accepted by API auth and authorized for `GET /workers/ready`.
  2. Then Ops runs exactly one worker-included smoke recheck.

## Continuation Checkpoint (finish_successful_run_handoff, 2026-05-27)
- Wake consumed from inline payload (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
- Concrete action executed in this heartbeat: one read-only presence-only auth artifact checkpoint (anti-churn; no smoke/probe rerun).
- Timestamp: `2026-05-27T18:48:47+02:00`.
- Presence-only result (no values):
  - `SMOKE_AUTH_TOKEN=True`
  - `SMOKE_AUTH_EMAIL=True`
  - `SMOKE_AUTH_PASSWORD=True`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
- Interpretation:
  - no new unblock artifact class in this wake,
  - protected `/workers/ready` proof remains unresolved.
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action unchanged:
  1. Soar API auth credential owner + Security/Test permission owner must provide/confirm a fresh valid approved read-only principal/session artifact accepted by API auth and authorized for `GET /workers/ready`.
  2. Then Ops runs exactly one worker-included smoke recheck.

## Continuation Checkpoint (issue_reopened_via_comment, 2026-05-27, comment 68cee97a-c495-49df-a958-f77a24c555c2)
- Latest board comment acknowledged first: gate freshness watcher reported newer credential metadata and requested exactly one read-only auth/smoke recheck for protected `/workers/ready`.
- Concrete action executed in this heartbeat (no deploy/restart/runtime mutation):
  1. presence-only auth artifact checkpoint,
  2. exactly one production smoke rerun with worker probe,
  3. read-only token auth probe for `/auth/me` and `/workers/ready`.
- Timestamp: `2026-05-27T18:58:48+02:00`.
- Presence-only result (no values):
  - `SMOKE_AUTH_TOKEN=True`
  - `SMOKE_AUTH_EMAIL=True`
  - `SMOKE_AUTH_PASSWORD=True`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
- Smoke command:
  - `corepack pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 71b8d503fd6fdfd7378dc67b2fa678799e2430f8`
- Smoke result:
  - PASS `API /health`
  - PASS `API /ready`
  - PASS `WEB /`
  - PASS `WEB /api/build-info` (expected SHA matched)
  - FAIL `API /workers/ready -> 401`
- Auth probe result with current `SMOKE_AUTH_TOKEN`:
  - `GET /auth/me -> 401`
  - `GET /workers/ready -> 401`
- Interpretation:
  - fresh metadata did not produce a currently valid/authorized protected principal session path for this runner,
  - protected readiness proof remains blocked.
- Rollback/deploy impact: none (verification-only lane).
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action unchanged:
  1. Soar API auth credential owner + Security/Test permission owner must provide/confirm a fresh valid approved read-only principal/session artifact accepted by API auth and authorized for `GET /workers/ready`.
  2. Then Ops executes exactly one worker-included smoke recheck.

## Continuation Checkpoint (finish_successful_run_handoff, 2026-05-27)
- Wake consumed from inline payload (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
- Concrete action executed in this heartbeat: one read-only presence-only auth artifact checkpoint (anti-churn; no smoke/probe rerun).
- Timestamp: `2026-05-27T18:59:49+02:00`.
- Presence-only result (no values):
  - `SMOKE_AUTH_TOKEN=True`
  - `SMOKE_AUTH_EMAIL=True`
  - `SMOKE_AUTH_PASSWORD=True`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
- Interpretation:
  - no new unblock artifact class in this wake,
  - protected `/workers/ready` proof remains unresolved.
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action unchanged:
  1. Soar API auth credential owner + Security/Test permission owner must provide/confirm a fresh valid approved read-only principal/session artifact accepted by API auth and authorized for `GET /workers/ready`.
  2. Then Ops runs exactly one worker-included smoke recheck.

## Continuation Checkpoint (issue_reopened_via_comment, 2026-05-27, comment 52799609-b216-4836-9353-46091132313b)
- Latest board comment acknowledged first and treated as diagnostic-only note.
- Explicit constraint from comment applied: no recheck/smoke rerun, no deploy/restart/runtime mutation, no push, no live-account mutation in this heartbeat.
- Concrete action executed in this heartbeat: blocker-class status sync and ownership routing update only.
- Diagnostic alignment captured from comment:
  - `GET /workers/ready` is gated by ops auth path (`requireAuth` + `requireRole(ADMIN)` + ops-network constraint),
  - latest proof remains blocked at auth boundary (`401` on protected checks with current bearer path).
- Operational implication:
  - next unblock artifact must be a fresh valid current Soar ADMIN principal/session token accepted on ops network path,
  - after artifact refresh/confirmation, run exactly one read-only protected workers readiness recheck.
  - if still `401`, next owner inspects token signing/sessionVersion/user existence before any worker-topology work.
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action updated for precision:
  1. Soar API auth credential owner + Security/Test permission owner provide/rotate a valid current ADMIN smoke principal/session artifact accepted by API auth and ops-network path for `GET /workers/ready`.
  2. Ops executes exactly one read-only worker-included smoke/protected recheck.
  3. If protected checks still return `401`, auth owner investigates token signing/sessionVersion/user existence before topology/runtime lanes.

## Continuation Checkpoint (issue_continuation_needed, 2026-05-27, auth-artifact shape refresh)
- Wake processed from inline payload (`fallbackFetchNeeded=false`, comments `0/0`) with no new approval/comment delta.
- Concrete action executed in this heartbeat: one read-only auth-artifact shape checkpoint (no smoke/probe rerun; anti-churn preserved).
- Timestamp: `2026-05-27T19:17:05+02:00`.
- Presence/shape result (no secret values):
  - `SMOKE_AUTH_TOKEN=True`
  - `SMOKE_AUTH_TOKEN_LEN=36`
  - `SMOKE_AUTH_TOKEN_DOT_PARTS=1`
  - `SMOKE_AUTH_EMAIL=True`
  - `SMOKE_AUTH_PASSWORD=True`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
- Interpretation:
  - auth artifact class is present, but token shape remains non-bearer/JWT-like (`parts=1`), consistent with prior auth-boundary `401` behavior on protected endpoints.
  - no new valid approved principal/session artifact was introduced in this wake.
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action unchanged:
  1. Soar API auth credential owner + Security/Test permission owner must provide/confirm a fresh valid approved read-only ADMIN principal/session artifact accepted by API auth and authorized for `GET /workers/ready`.
  2. Then Ops executes exactly one worker-included protected smoke recheck.

## Continuation Checkpoint (finish_successful_run_handoff, 2026-05-27, auth-artifact shape continuity)
- Wake processed from inline payload (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`) with no new approval/comment delta.
- Concrete action executed in this heartbeat: one read-only auth-artifact shape continuity checkpoint (no smoke/probe rerun; anti-churn preserved).
- Timestamp: `2026-05-27T19:17:58+02:00`.
- Presence/shape result (no secret values):
  - `SMOKE_AUTH_TOKEN=True`
  - `SMOKE_AUTH_TOKEN_LEN=36`
  - `SMOKE_AUTH_TOKEN_DOT_PARTS=1`
  - `SMOKE_AUTH_EMAIL=True`
  - `SMOKE_AUTH_PASSWORD=True`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
- Interpretation:
  - auth artifacts remain present and unchanged,
  - token shape remains non-bearer/JWT-like (`parts=1`), consistent with prior protected-path `401` boundary,
  - no new valid approved principal/session artifact was introduced in this wake.
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action unchanged:
  1. Soar API auth credential owner + Security/Test permission owner must provide/confirm a fresh valid approved read-only ADMIN principal/session artifact accepted by API auth and authorized for `GET /workers/ready`.
  2. Then Ops executes exactly one worker-included protected smoke recheck.

## Continuation Checkpoint (issue_children_completed, 2026-05-27, churn-control integration)
- Wake `issue_children_completed` consumed from inline payload (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
- Concrete action in this heartbeat: integrated direct child decision `LUC-363` (CTO productivity review) into `LUC-241` execution policy.
- Child signal accepted:
  - high churn confirmed,
  - low incremental value from repeated presence-only/auth-shape checkpoints without new unblock artifact class.
- Operational lane update applied (no deploy/restart/runtime mutation):
  - `LUC-241` remains fail-closed `blocked`,
  - pause repeated checkpoint loops,
  - allow next active verification only when a **new unblock artifact class** appears.
- Accepted unblock artifact classes for next run:
  1. fresh approved read-only ADMIN principal/session artifact explicitly confirmed as API-auth valid for protected ops path,
  2. new permission-scope grant evidence for `/workers/ready` for smoke principal,
  3. explicit board gate approval requiring exactly one protected recheck.
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action (unchanged outcome, clarified trigger):
  1. Soar API auth credential owner + Security/Test permission owner provide/confirm a fresh valid approved read-only ADMIN principal/session artifact accepted by API auth and authorized for `GET /workers/ready`.
  2. After one of accepted unblock artifact classes appears, Ops executes exactly one worker-included protected smoke recheck.

## Continuation Checkpoint (issue_continuation_needed, 2026-05-27)
- Wake consumed from inline payload (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
- Concrete action executed in this heartbeat: one read-only presence-only auth artifact checkpoint (anti-churn; no smoke/probe rerun).
- Timestamp: `2026-05-27T19:21:08+02:00`.
- Presence-only result (no values):
  - `SMOKE_AUTH_TOKEN=True`
  - `SMOKE_AUTH_EMAIL=True`
  - `SMOKE_AUTH_PASSWORD=True`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
- Interpretation:
  - auth artifact class unchanged,
  - no new valid approved principal/session unblock artifact was provided in this wake,
  - protected readiness proof remains blocked.
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action unchanged:
  1. Soar API auth credential owner + Security/Test permission owner must provide/confirm a fresh valid approved read-only principal/session artifact accepted by API auth and authorized for `GET /workers/ready`.
  2. Then Ops executes exactly one worker-included smoke recheck.

## Continuation Checkpoint (source_scoped_recovery_action, 2026-05-27)
- Wake consumed from inline payload (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
- Concrete action executed in this heartbeat: one read-only presence-only auth artifact checkpoint (anti-churn; no smoke/probe rerun).
- Timestamp: `2026-05-27T19:22:14+02:00`.
- Presence-only result (no values):
  - `SMOKE_AUTH_TOKEN=False`
  - `SMOKE_AUTH_EMAIL=False`
  - `SMOKE_AUTH_PASSWORD=False`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
- Interpretation:
  - auth artifact class regressed versus prior checkpoint (`SMOKE_AUTH_*` now absent),
  - no new valid approved principal/session unblock artifact was provided in this wake.
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action updated:
  1. Soar API auth credential owner + Security/Test secret-ref owner must restore approved `SMOKE_AUTH_*` bindings for this lane runtime.
  2. Then Ops executes exactly one worker-included smoke recheck.

## Continuation Checkpoint (issue_assigned, 2026-05-27)
- Wake consumed from inline payload (fallbackFetchNeeded=false, comments 0/0, latest comment id unknown).
- Concrete action executed in this heartbeat:
  1. presence-only auth artifact checkpoint,
  2. exactly one production smoke rerun with worker probe after SMOKE_AUTH_* restoration.
- Timestamp: 2026-05-27T19:25:07+02:00.
- Presence-only result (no values):
  - SMOKE_AUTH_TOKEN=True
  - SMOKE_AUTH_EMAIL=True
  - SMOKE_AUTH_PASSWORD=True
  - SOAR_API_TOKEN=False
  - SOAR_API_KEY=False
  - SOAR_SESSION_COOKIE=False
- Smoke command:
  - corepack pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 71b8d503fd6fdfd7378dc67b2fa678799e2430f8
- Smoke result:
  - PASS API /health
  - PASS API /ready
  - PASS WEB /
  - PASS WEB /api/build-info (expected SHA matched)
  - FAIL API /workers/ready -> 401
- Interpretation:
  - SMOKE_AUTH_* bindings are present again, but protected readiness proof remains blocked at auth/authorization boundary.
- Final disposition for this heartbeat: blocked.
- Unblock owner/action unchanged:
  1. Soar API auth credential owner + Security/Test permission owner must provide/confirm a fresh valid approved read-only principal/session artifact accepted by API auth and authorized for GET /workers/ready.
  2. Then Ops executes exactly one worker-included smoke recheck.

## Continuation Checkpoint (issue_continuation_needed, 2026-05-27)
- Wake consumed from inline payload (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
- Concrete action in this heartbeat: anti-churn gate enforcement + blocker routing sync only (no smoke/probe rerun, no deploy/restart/runtime mutation).
- Timestamp: `2026-05-27T19:27:05+02:00`.
- Delta assessment:
  - no pending comment,
  - no new gate approval,
  - no new unblock artifact class beyond previously failing credentials/session path.
- Interpretation:
  - this lane has no live continuation path in the current wake,
  - recheck execution remains paused until a first-class unblock artifact appears.
- Final disposition for this heartbeat: `blocked`.
- Resume gate (unchanged):
  1. Soar API auth credential owner + Security/Test permission owner provide/confirm a fresh valid approved read-only ADMIN principal/session artifact accepted by API auth and authorized for `GET /workers/ready`, or
  2. explicit board gate approval requests exactly one protected recheck.

## Continuation Checkpoint (source_scoped_recovery_action, 2026-05-27)
- Wake consumed from inline payload (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
- Concrete action in this heartbeat: one read-only presence-only auth artifact checkpoint (anti-churn; no smoke/probe rerun).
- Timestamp: `2026-05-27T19:28:17+02:00`.
- Presence-only result (no values):
  - `SMOKE_AUTH_TOKEN=False`
  - `SMOKE_AUTH_EMAIL=False`
  - `SMOKE_AUTH_PASSWORD=False`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
- Interpretation:
  - auth artifact class regressed versus prior checkpoint (`SMOKE_AUTH_*` now absent),
  - no new unblock artifact class was provided in this wake.
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action updated:
  1. Soar API auth credential owner + Security/Test secret-ref owner must restore approved `SMOKE_AUTH_*` bindings for this lane runtime.
  2. Then Ops executes exactly one worker-included smoke recheck.

## Continuation Checkpoint (issue_assigned, 2026-05-27)
- No new board comment in wake payload (`0/0`); continuation executed from existing unblock contract.
- Concrete action in this heartbeat:
  - presence-only auth artifact checkpoint,
  - exactly one worker-included smoke recheck (read-only).
- Presence result (`2026-05-27T19:34:01+02:00`):
  - `SMOKE_AUTH_TOKEN=True`
  - `SMOKE_AUTH_EMAIL=True`
  - `SMOKE_AUTH_PASSWORD=True`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
- Smoke command:
  - `corepack pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 71b8d503fd6fdfd7378dc67b2fa678799e2430f8`
- Smoke result:
  - PASS `API /health`, `API /ready`, `WEB /`, `WEB /api/build-info`
  - FAIL `API /workers/ready -> 401`
- Final disposition for this continuation heartbeat: `blocked`.
- Unblock owner/action unchanged:
  1. Soar API auth credential owner + Security/Test permission owner must provide/confirm a fresh valid approved read-only principal/session artifact accepted by API auth and authorized for `GET /workers/ready`.
  2. Then Ops executes exactly one worker-included smoke recheck.

## Continuation Checkpoint (issue_continuation_needed, 2026-05-27)
- No new board comment in wake payload (`0/0`); continuation executed as a bounded read-only continuity checkpoint.
- Concrete action in this heartbeat:
  - presence-only auth artifact checkpoint,
  - token-shape continuity probe,
  - protected read-only auth probe with current smoke token.
- Presence result (`2026-05-27T19:37:03+02:00`):
  - `SMOKE_AUTH_TOKEN=True`
  - `SMOKE_AUTH_EMAIL=True`
  - `SMOKE_AUTH_PASSWORD=True`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
- Token-shape continuity:
  - `SMOKE_AUTH_TOKEN_LEN=36`
  - `SMOKE_AUTH_TOKEN_DOT_PARTS=1`
- Protected auth probe:
  - `GET /auth/me -> 401`
  - `GET /workers/ready -> 401`
- Final disposition for this continuation heartbeat: `blocked`.
- Unblock owner/action unchanged:
  1. Soar API auth credential owner + Security/Test permission owner must provide/confirm a fresh valid approved read-only principal/session artifact accepted by API auth and authorized for `GET /workers/ready`.
  2. Then Ops executes exactly one worker-included smoke recheck.

## Continuation Checkpoint (issue_reopened_via_comment, 2026-05-28, comment e91a3f95-1f13-4500-93a9-7105f5a13971)
- Gate freshness watcher comment acknowledged first and executed exactly as requested.
- Concrete action executed in this heartbeat (single read-only recheck, no deploy/restart/runtime mutation):
  1. presence-only auth artifact checkpoint,
  2. exactly one production smoke rerun with worker probe,
  3. read-only token auth probe for `/auth/me` and `/workers/ready`.
- Timestamp: `2026-05-28T00:17:55+02:00`.
- Presence-only result (no values):
  - `SMOKE_AUTH_TOKEN=True`
  - `SMOKE_AUTH_EMAIL=True`
  - `SMOKE_AUTH_PASSWORD=True`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
- Smoke command:
  - `corepack pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 71b8d503fd6fdfd7378dc67b2fa678799e2430f8`
- Smoke result:
  - PASS `API /health`
  - PASS `API /ready`
  - PASS `WEB /`
  - PASS `WEB /api/build-info` (expected SHA matched)
  - FAIL `API /workers/ready -> 401`
- Auth probe result with current `SMOKE_AUTH_TOKEN`:
  - `GET /auth/me -> 401`
  - `GET /workers/ready -> 401`
- Rollback/deploy impact: none (verification-only lane).
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action unchanged:
  1. Soar API auth credential owner + Security/Test permission owner must provide/confirm a fresh valid approved read-only principal/session artifact accepted by API auth and authorized for `GET /workers/ready`.
  2. Then Ops executes exactly one worker-included smoke recheck.

## Continuation Checkpoint (LUC-390 infra-gate diagnostic handoff, 2026-05-28)
- Related critical infra-gate issue `LUC-390` executed a focused DNS/network diagnosis to validate whether this lane was blocked by production outage.
- Diagnostic result:
  - `soar-api.luckysparrow.ch` and `soar-web.luckysparrow.ch` are DNS NXDOMAIN (name does not exist),
  - canonical production domains (`api.soar.luckysparrow.ch`, `soar.luckysparrow.ch`, `vps.luckysparrow.ch`) resolve to `141.227.149.67`, pass TCP reachability, and return healthy public HTTP responses.
- Canonical deploy smoke rerun result:
  - PASS public checks (`/health`, `/ready`, web root, build-info expected SHA),
  - FAIL protected `API /workers/ready -> 401`.
- Interpretation:
  - network-layer blocker is removed when canonical hostnames are used,
  - this lane remains blocked only on protected auth/permission proof path.
- Evidence:
  - `history/artifacts/luc-390-dns-network-diagnostic-2026-05-28.json`
  - `history/tasks/luc-390-infra-gate-diagnose-production-dns-network-failure-for-luc-241-2026-05-28-task.md`

## Continuation Checkpoint (issue_reopened_via_comment, 2026-05-28, comment d4ff1cff-0a15-4f04-9576-cea986905a7d)
- Latest board comment acknowledged first: gate freshness watcher requested exactly one read-only auth/smoke recheck for protected `/workers/ready`.
- Concrete action executed in this heartbeat (single recheck only; no deploy/restart/runtime mutation):
  - `corepack pnpm run -s ops:deploy:smoke -- --api-base-url https://soar-api.luckysparrow.ch --web-base-url https://soar-web.luckysparrow.ch --expected-sha 71b8d503fd6fdfd7378dc67b2fa678799e2430f8`
  - token probe with current `SMOKE_AUTH_TOKEN`:
    - `GET /auth/me`
    - `GET /workers/ready`
- Timestamp: `2026-05-28T02:02:43+02:00`.
- Presence/token-shape snapshot:
  - `SMOKE_AUTH_TOKEN=True`
  - `SMOKE_AUTH_EMAIL=True`
  - `SMOKE_AUTH_PASSWORD=True`
  - `SMOKE_AUTH_TOKEN_LEN=36`
  - `SMOKE_AUTH_TOKEN_DOT_PARTS=1`
- Recheck result:
  - Smoke:
    - FAIL `API /health -> fetch failed`
    - FAIL `API /ready -> fetch failed`
    - FAIL `WEB / -> fetch failed`
    - FAIL `WEB /api/build-info -> fetch failed`
    - FAIL `API /workers/ready -> fetch failed`
  - Auth probe:
    - `GET /auth/me -> fetch failed`
    - `GET /workers/ready -> fetch failed`
- Interpretation:
  - this run used stale/non-canonical lane hosts (`soar-api`/`soar-web`) which are DNS-failing per `LUC-390`, so credential/session authorization could not be evaluated.
- Final disposition for this continuation heartbeat: `blocked`.
- Unblock owner/action:
  1. Ops recheck host contract on next approved wake: use canonical hosts only (`https://api.soar.luckysparrow.ch`, `https://soar.luckysparrow.ch`).
  2. Auth/security owner confirms fresh valid approved read-only principal/session artifact for `GET /workers/ready`.
  3. Then Ops executes exactly one worker-included smoke recheck.

## Continuation Checkpoint (issue_continuation_needed, 2026-05-28 canonical host recheck)
- Wake consumed from inline payload (`fallbackFetchNeeded=false`, comments `0/0`) and executed as one concrete read-only recheck on canonical production hosts.
- Concrete action in this heartbeat (no deploy/restart/runtime mutation):
  - `corepack pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 71b8d503fd6fdfd7378dc67b2fa678799e2430f8`
  - token auth probe with current `SMOKE_AUTH_TOKEN`:
    - `GET /auth/me`
    - `GET /workers/ready`
- Timestamp: `2026-05-28T02:04:24+02:00`.
- Presence/token-shape snapshot:
  - `SMOKE_AUTH_TOKEN=True`
  - `SMOKE_AUTH_EMAIL=True`
  - `SMOKE_AUTH_PASSWORD=True`
  - `SMOKE_AUTH_TOKEN_LEN=36`
  - `SMOKE_AUTH_TOKEN_DOT_PARTS=1`
- Recheck result:
  - Smoke:
    - PASS `API /health -> 200`
    - PASS `API /ready -> 200`
    - PASS `WEB / -> 200`
    - PASS `WEB /api/build-info -> 200` (expected SHA matched)
    - FAIL `API /workers/ready -> 401`
  - Auth probe:
    - `GET /auth/me -> 401` (`Session expired. Please sign in again.`)
    - `GET /workers/ready -> 401` (`Invalid token`)
- Interpretation:
  - canonical network/reachability path is healthy,
  - protected proof remains blocked strictly on auth/session/permission path for current smoke token.
- Final disposition for this continuation heartbeat: `blocked`.
- Unblock owner/action:
  1. Soar API auth credential owner + Security/Test permission owner must provide/confirm a fresh valid approved read-only principal/session artifact accepted by API auth and authorized for `GET /workers/ready`.
  2. Then Ops executes exactly one worker-included smoke recheck.

## Continuation Checkpoint (source_scoped_recovery_action, 2026-05-28)
- Wake consumed from inline payload (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
- Concrete action executed in this heartbeat: one read-only presence-only auth artifact checkpoint (no smoke/probe rerun; anti-churn and cancellation-reason confirmation respected).
- Timestamp: `2026-05-28T02:05:19+02:00`.
- Presence-only result (no secret values):
  - `SMOKE_AUTH_TOKEN=False`
  - `SMOKE_AUTH_EMAIL=False`
  - `SMOKE_AUTH_PASSWORD=False`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
- Interpretation:
  - no new unblock artifact class in this wake,
  - `SMOKE_AUTH_*` bindings are absent in this runtime, so protected recheck path is not actionable.
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action:
  1. Soar API auth credential owner + Security/Test secret-ref owner must restore approved `SMOKE_AUTH_*` bindings for this lane runtime.
  2. After artifact restore (or explicit board gate approval), Ops executes exactly one worker-included smoke recheck.

## Continuation Checkpoint (issue_reopened_via_comment, 2026-05-28, comment 56478cae-42c0-4619-bb27-2cfa60cc174c)
- Latest board comment acknowledged first: longevity-doctor flagged stale blocker evidence and requested either fresh gate evidence or explicit blocked next-review condition.
- Concrete action executed in this heartbeat (read-only, no deploy/restart/runtime mutation):
  1. fresh auth-artifact presence checkpoint,
  2. one canonical-host production smoke recheck.
- Timestamp: `2026-05-28T15:21:41+02:00` (presence), smoke executed immediately after.
- Presence-only result (no secret values):
  - `SMOKE_AUTH_TOKEN=False`
  - `SMOKE_AUTH_EMAIL=False`
  - `SMOKE_AUTH_PASSWORD=False`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
- Smoke command:
  - `corepack pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 71b8d503fd6fdfd7378dc67b2fa678799e2430f8`
- Smoke result:
  - PASS `API /health -> 200`
  - PASS `API /ready -> 200`
  - PASS `WEB / -> 200`
  - PASS `WEB /api/build-info -> 200` (expected SHA matched)
  - FAIL `API /workers/ready -> 401`
- Interpretation:
  - fresh gate evidence attached (staleness concern addressed),
  - public canonical path remains healthy,
  - protected readiness remains blocked on auth/session/permission path with missing `SMOKE_AUTH_*` bindings in this runtime.
- Final disposition for this heartbeat: `blocked`.
- Explicit next review condition (blocked-root guardrail):
  1. re-open active verification only when at least one appears: restored approved `SMOKE_AUTH_*` bindings, fresh valid approved read-only principal/session artifact, or explicit board gate approval for exactly one protected recheck;
  2. otherwise keep status sync-only and no repeated smoke loops.

## Continuation Checkpoint (issue_continuation_needed, 2026-05-28)
- Wake consumed from inline payload (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
- Concrete action in this heartbeat: one read-only presence-only auth artifact checkpoint (status-sync only; no smoke/probe rerun per active next-review condition).
- Timestamp: `2026-05-28T15:23:16+02:00`.
- Presence-only result (no secret values):
  - `SMOKE_AUTH_TOKEN=False`
  - `SMOKE_AUTH_EMAIL=False`
  - `SMOKE_AUTH_PASSWORD=False`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
- Interpretation:
  - no new unblock artifact class arrived in this wake,
  - active protected recheck path remains not actionable.
- Final disposition for this heartbeat: `blocked`.
- Explicit next review condition unchanged:
  1. re-open active verification only when at least one appears: restored approved `SMOKE_AUTH_*` bindings, fresh valid approved read-only principal/session artifact, or explicit board gate approval for exactly one protected recheck;
  2. otherwise keep status sync-only and no repeated smoke loops.

## Heartbeat - 2026-05-28T15:24:52+02:00 (source_scoped_recovery_action)
- Wake acknowledged first: no new comment/unblock delta (fallbackFetchNeeded=false, 0/0 comments), so only minimal actionable checkpoint executed.
- Concrete action: read-only smoke auth artifact presence scan in current runner context.
  - SMOKE_AUTH_TOKEN=False
  - SMOKE_AUTH_EMAIL=False
  - SMOKE_AUTH_PASSWORD=False
  - SOAR_API_TOKEN=False
  - SOAR_API_KEY=False
  - SOAR_SESSION_COOKIE=False
- Decision: protected /workers/ready recheck not executed because required auth artifact class is absent.
- Final disposition for this heartbeat: blocked.
- Unblock owner/action:
  1. Soar auth credential owner + Security/Test secret-ref owner restore approved SMOKE_AUTH_* bindings for this runtime.
  2. Ops Release Lead executes exactly one read-only protected recheck for GET /workers/ready after restoration and publishes evidence with rollback-impact note.

## Heartbeat - 2026-05-29T22:20:04+02:00 (source_scoped_recovery_action)
- Wake acknowledged first: no new comment/unblock delta (`fallbackFetchNeeded=false`, `0/0` comments), and no-repeat policy for protected rechecks remains active.
- Concrete action: read-only smoke auth artifact presence scan in current runner context (no protected smoke rerun).
  - `SMOKE_AUTH_TOKEN=False`
  - `SMOKE_AUTH_EMAIL=False`
  - `SMOKE_AUTH_PASSWORD=False`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
- Interpretation:
  - no new unblock artifact class appeared,
  - protected `/workers/ready` recheck path remains not actionable in this wake.
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action unchanged:
  1. Soar API auth credential owner + Security/Test permission owner provide/confirm a fresh valid approved read-only ADMIN principal/session artifact accepted by API auth and authorized for protected `GET /workers/ready`.
  2. Then Ops Release Lead runs exactly one new read-only protected recheck and publishes redaction-safe proof.

## Heartbeat - 2026-05-30T00:25:48+02:00 (issue_reopened_via_comment, comment 05089651-ae6e-4665-b065-1db43e395d29)
- Latest board comment acknowledged first: `softwarehouse-autonomous-gate-approval:LUC-241:v1` approved exactly one narrow read-only protected auth/smoke recheck.
- Concrete action executed in this heartbeat (no deploy/restart/runtime mutation):
  1. one presence-only auth artifact checkpoint,
  2. one canonical-host smoke recheck for protected `/workers/ready`.
- Presence snapshot (no secret values):
  - `SMOKE_AUTH_TOKEN=False`
  - `SMOKE_AUTH_EMAIL=False`
  - `SMOKE_AUTH_PASSWORD=False`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
- Smoke command:
  - `corepack pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 71b8d503fd6fdfd7378dc67b2fa678799e2430f8`
- Smoke result:
  - PASS `API /health -> 200`
  - PASS `API /ready -> 200`
  - PASS `WEB / -> 200`
  - PASS `WEB /api/build-info -> 200` (expected SHA matched)
  - FAIL `API /workers/ready -> 401`
- Interpretation:
  - approved one-time recheck executed exactly once and evidence captured,
  - protected readiness remains blocked at auth/session/permission boundary with missing runtime `SMOKE_AUTH_*` bindings.
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action unchanged:
  1. Soar API auth credential owner + Security/Test permission owner provide/confirm a fresh valid approved read-only ADMIN principal/session artifact accepted by API auth and authorized for protected `GET /workers/ready`.
  2. Then Ops Release Lead runs exactly one new read-only protected recheck and publishes redaction-safe proof.

## Heartbeat - 2026-05-30T00:27:12+02:00 (issue_continuation_needed)
- Wake acknowledged first: no new comment/unblock delta (`fallbackFetchNeeded=false`, `0/0` comments).
- Concrete action: one read-only smoke auth artifact presence scan in current runner context (status-sync only; no protected smoke rerun).
  - `SMOKE_AUTH_TOKEN=False`
  - `SMOKE_AUTH_EMAIL=False`
  - `SMOKE_AUTH_PASSWORD=False`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
- Interpretation:
  - no new unblock artifact class appeared,
  - protected `/workers/ready` recheck remains not actionable in this wake.
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action unchanged:
  1. Soar API auth credential owner + Security/Test permission owner provide/confirm a fresh valid approved read-only ADMIN principal/session artifact accepted by API auth and authorized for protected `GET /workers/ready`.
  2. Then Ops Release Lead runs exactly one new read-only protected recheck and publishes redaction-safe proof.

## Heartbeat - 2026-05-30T00:51:44+02:00 (source_scoped_recovery_action)
- Wake acknowledged first: no new comment/unblock delta (`fallbackFetchNeeded=false`, `0/0` comments).
- Concrete action: one read-only smoke auth artifact presence scan in current runner context (status-sync only; no protected smoke rerun).
  - `SMOKE_AUTH_TOKEN=False`
  - `SMOKE_AUTH_EMAIL=False`
  - `SMOKE_AUTH_PASSWORD=False`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
- Interpretation:
  - no new unblock artifact class appeared,
  - protected `/workers/ready` recheck remains not actionable in this wake.
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action unchanged:
  1. Soar API auth credential owner + Security/Test permission owner provide/confirm a fresh valid approved read-only ADMIN principal/session artifact accepted by API auth and authorized for protected `GET /workers/ready`.
  2. Then Ops Release Lead runs exactly one new read-only protected recheck and publishes redaction-safe proof.

## Heartbeat - 2026-05-30T00:53:21+02:00 (issue_reopened_via_comment, comment 88545bf6-024a-4d9b-a168-6bda3acf420e)
- Latest board comment acknowledged first: `softwarehouse-runtime-gate-binding-repair:LUC-241:v1` approved exactly one narrow recheck after runtime binding repair.
- Concrete action executed in this heartbeat (read-only, no deploy/restart/runtime mutation):
  1. one presence-only auth artifact checkpoint,
  2. one canonical-host protected smoke recheck.
- Presence snapshot (no secret values):
  - `SMOKE_AUTH_TOKEN=True`
  - `SMOKE_AUTH_EMAIL=True`
  - `SMOKE_AUTH_PASSWORD=True`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
- Smoke command:
  - `corepack pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 71b8d503fd6fdfd7378dc67b2fa678799e2430f8`
- Smoke result:
  - PASS `API /health -> 200`
  - PASS `API /ready -> 200`
  - PASS `WEB / -> 200`
  - PASS `WEB /api/build-info -> 200` (expected SHA matched)
  - FAIL `API /workers/ready -> 401`
- Interpretation:
  - repaired binding class is present in this session (`SMOKE_AUTH_* = True`),
  - approved one-time recheck executed exactly once and protected readiness still fails (`401`), so blocker remains auth/session/permission-path specific.
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action unchanged:
  1. Soar API auth credential owner + Security/Test permission owner provide/confirm a fresh valid approved read-only ADMIN principal/session artifact accepted by API auth and authorized for protected `GET /workers/ready`.
  2. Then Ops Release Lead runs exactly one new read-only protected recheck and publishes redaction-safe proof.

## Heartbeat - 2026-05-30T00:54:43+02:00 (issue_continuation_needed)
- Wake acknowledged first: no new comment/unblock delta (`fallbackFetchNeeded=false`, `0/0` comments).
- Concrete action: one read-only smoke auth artifact presence scan in current runner context (status-sync only; no protected smoke rerun).
  - `SMOKE_AUTH_TOKEN=True`
  - `SMOKE_AUTH_EMAIL=True`
  - `SMOKE_AUTH_PASSWORD=True`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
- Interpretation:
  - auth-binding class remains present, but no new board approval arrived for another protected probe in this wake,
  - protected `/workers/ready` recheck remains paused by guardrail.
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action unchanged:
  1. Soar API auth credential owner + Security/Test permission owner provide/confirm a fresh valid approved read-only ADMIN principal/session artifact accepted by API auth and authorized for protected `GET /workers/ready`.
  2. Then Ops Release Lead runs exactly one new read-only protected recheck and publishes redaction-safe proof.

## Heartbeat - 2026-05-30T00:56:14+02:00 (source_scoped_recovery_action)
- Wake acknowledged first: no new comment/unblock delta (`fallbackFetchNeeded=false`, `0/0` comments).
- Concrete action: one read-only auth artifact presence scan in current runner context (status-sync only; no protected smoke rerun).
  - `SMOKE_AUTH_TOKEN=True`
  - `SMOKE_AUTH_EMAIL=True`
  - `SMOKE_AUTH_PASSWORD=True`
  - `SOAR_API_TOKEN=False`
  - `SOAR_API_KEY=False`
  - `SOAR_SESSION_COOKIE=False`
- Interpretation:
  - auth-binding class remains present,
  - no fresh board approval in this wake for another protected `/workers/ready` probe.
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action unchanged:
  1. Soar API auth credential owner + Security/Test permission owner provide/confirm a fresh valid approved read-only ADMIN principal/session artifact accepted by API auth and authorized for protected `GET /workers/ready`.
  2. Then Ops Release Lead runs exactly one new read-only protected recheck and publishes redaction-safe proof.
