# LUC-973 [Soar][Coolify] Verify last failed deploys and route repair - 2026-05-31

## Context
- Wake: `issue_assigned` for critical `LUC-973`.
- Objective in this heartbeat: execute concrete read-only deploy verification to confirm current failed-deploy and route-repair status.

## Goal
- Produce fresh, timestamped evidence for production/temp deploy status and route readiness behavior.

## Scope
- Included: read-only smoke and env-presence checks.
- Excluded: deploy/restart/rollback/env mutation, credential changes, protected secret disclosure.

## Method
1. Run production smoke on prior closure-target SHA `71b8d503...`.
2. If mismatched, rerun smoke on observed deployed SHA.
3. Run temp-domain smoke on observed SHA.
4. Run Coolify stack env presence check (redaction-safe) for route/deploy diagnostics.

## Verification Evidence
- `corepack pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 71b8d503fd6fdfd7378dc67b2fa678799e2430f8`
  - result: `FAIL` (`WEB /api/build-info` mismatch observed `2dc983ced4a4c66e31e7f37264710c124955e57b`; `API /workers/ready` -> `401`)
- `corepack pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 2dc983ced4a4c66e31e7f37264710c124955e57b`
  - result: public checks `PASS`; protected `API /workers/ready` -> `401`
- `corepack pnpm run -s ops:deploy:smoke -- --base-url https://soar-temp.luckysparrow.ch --api-url https://temp-api.soar.luckysparrow.ch --expected-sha 2dc983ced4a4c66e31e7f37264710c124955e57b --skip-workers`
  - result: `FAIL` (`fetch failed` on API/Web endpoints)
- `corepack pnpm run -s ops:coolify-stack:env-check`
  - result: `FAIL` (`required present 0/16`; names-only output, values redacted)

## Interpretation
- Latest public deploy SHA is now `2dc983ce...` (not `71b8d503...`).
- Public route health is up (`/health`, `/ready`, `/`, `/api/build-info` pass on `2dc983ce...`).
- Protected route proof remains blocked by auth boundary (`/workers/ready` returns `401`).
- Temp stack routes remain unreachable (`fetch failed`), so failed-temp-deploy/route-repair closure is still not proven.

## Result
- Heartbeat disposition: `blocked`.
- Deploy/runtime mutation: `none`.
- Commit/push: `not committed` / `not needed`.

## Unblock Owner/Action
1. Soar API auth credential owner + Security/Test permission owner: provide approved read-only principal/session accepted by API auth for protected `GET /workers/ready`.
2. Coolify operator + release controller: provide temp-domain recovery decision/evidence (`restored and smoke-pass` or explicit accepted no-temp-stack decision for this issue chain).
3. Ops Release Lead: rerun exactly one read-only protected and temp smoke checkpoint after the above inputs land.

## Continuation Checkpoint (finish_successful_run_handoff) - 2026-05-31

### Additional objective coverage completed
- Verified Coolify secret/binding presence in this runner (names-only):
  - `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`/`COOLIFY_TOKEN`, `COOLIFY_LOGIN_*`, `COOLIFY_SOAR_*` IDs present.
- Queried Coolify read-only endpoints:
  - `GET /api/v1/applications` => `200` (Soar app inventory visible).
  - `GET /api/v1/deployments` and `GET /api/v1/deployments?status=failed` => `200 []` in this API context.
  - `GET /api/v1/applications/{soar-api|soar-web}/logs` => `200` with runtime/build logs.

### Last two failed deploys (reconstructed from Coolify evidence)
Because `/api/v1/deployments` currently returns an empty list in this API scope, the failed deploy events were reconstructed from app restart metadata plus log failures.

1. `soar-api` (`k126p7vqxs5cly2zc4y4g4rq`)
- failure timestamp evidence: `last_restart_at=2026-05-31T00:25:11.000000Z`
- status: `running:unknown`, `last_restart_type=crash`, `restart_count=2`
- source ref mode: `git_branch=main`, `git_commit_sha=HEAD`
- failure phase/log excerpt: no explicit build/deploy error line exposed in current logs payload; crash restart is observable.

2. `soar-web` (`ato4fqkncd6t38wzlle2m0rv`)
- failure timestamp evidence: `last_restart_at=2026-05-31T00:52:12.000000Z`
- status: `running:unknown`, `last_restart_type=crash`, `restart_count=25`
- source ref mode: `git_branch=main`, `git_commit_sha=HEAD`
- failure phase/log excerpt (redacted-safe): repeated Corepack/pnpm cache creation failures during startup/build bootstrap:
  - `Error: ENOSPC: no space left on device, mkdir '/home/node/.cache/node/corepack/v1/corepack-...'`
  - `errno: -28`, `code: 'ENOSPC'`, `syscall: 'mkdir'`

### SHA parity comparison against LUC-962
- Prior checkpoint already proved public build-info parity on `2dc983ced4a4c66e31e7f37264710c124955e57b` (LUC-962 pushed SHA).
- This continuation confirms Coolify apps still deploy from floating `main/HEAD` references, so deterministic expected-SHA closure requires deployment-record visibility or pinned-source proof in Coolify.

### Repair-lane routing (narrow)
- Owning lane: **Ops Release / Coolify operator**.
- Concrete repair scope (no mutation executed in this issue):
  1. recover disk headroom on Coolify host path used by Node/Corepack cache (ENOSPC root cause),
  2. re-run only `soar-web` deploy under explicit release permit,
  3. re-check `ops:deploy:smoke` on expected SHA and capture `/api/build-info` parity,
  4. attach deployment-object evidence (if endpoint remains empty, include UI/API screenshot-equivalent artifact or platform log export proving the deploy id/result).
- Suggested validation command after operator repair:
  - `corepack pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 2dc983ced4a4c66e31e7f37264710c124955e57b`

### Artifacts captured
- `history/artifacts/luc-973-soar-api-logs-2026-05-31.json`
- `history/artifacts/luc-973-soar-web-logs-2026-05-31.json`

### Disposition for this continuation
- `blocked` (repair mutation requires explicit release permit + operator action).

## Continuation Checkpoint (issue_commented) - 2026-05-31

- Comment acknowledged first: `69b9fc09-6eaa-45ad-8bf8-215bbb7c9e0b` (local-board).
- Comment impact: disposition sync only. Lane must stay `blocked` (not `in_progress`) after read-only diagnosis.
- Confirmed unchanged fact set from prior checkpoint:
  - production build-info/public smoke aligns to `2dc983ce...`,
  - protected `GET /workers/ready` remains `401`,
  - temp route smoke remains `fetch failed`,
  - no redeploy/restart/protected smoke approval exists in this wake.
- No new mutation action is legal in current scope.
- Unblock owner/action unchanged:
  1. approved read-only principal/session for protected `/workers/ready`,
  2. Coolify/temp-domain recovery evidence or accepted no-temp-stack decision,
  3. then one read-only recheck by Ops.
- Disposition: `blocked`.
