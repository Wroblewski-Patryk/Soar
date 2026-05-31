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
