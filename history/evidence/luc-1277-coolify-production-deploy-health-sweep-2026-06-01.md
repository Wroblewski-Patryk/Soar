# LUC-1277 Coolify Production Deploy Health Sweep (2026-06-01)

- Timestamp (UTC): 2026-06-01T10:33:57Z
- Lane: Ops Release Lead
- Scope: Read-only production deploy health sweep (no production mutation)
- Wake acknowledgement: `issue_assigned` consumed from inline payload (`fallbackFetchNeeded=false`, comments `0/0`).

## Source Ref Snapshot
- Local `HEAD`: `89bbf392dfb89c0a17c0326d9bff423b7f93033f`
- Local `origin/main`: `6839cd6b8884e26eca735ce32cea98c1dadccfbe`

## Public Health / Build-Info (Canonical Hosts)
- `GET https://api.soar.luckysparrow.ch/health -> 200`
- `GET https://api.soar.luckysparrow.ch/ready -> 200`
- `GET https://soar.luckysparrow.ch/ -> 200`
- `GET https://soar.luckysparrow.ch/api/build-info -> 200`

Command:
- `node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --skip-workers`

Build info readback:
- `buildId=9_MzvzTWKAhz25Nco5xPY`
- `gitSha=6839cd6b8884e26eca735ce32cea98c1dadccfbe`
- `gitRef=main`
- `metadataGeneratedAt=2026-05-31T15:39:59.210Z`
- `metadataSource=github-branch`
- `checkedAt=2026-06-01T10:33:31.497Z`

## Protected Endpoint Spot Check (No Credentials)
- `GET https://api.soar.luckysparrow.ch/workers/ready -> 401`
- Interpretation: fail-closed behavior is intact for unauthenticated probe.

## Safety / Mutation Guard
- No deploy/restart/rollback/env/database mutation was performed.
- No secret values were printed or stored.

## Ops Disposition
- `done`

## Residual Risk
- This sweep confirms only public health/deploy freshness and unauthenticated fail-closed behavior.
- It does not replace protected principal-based worker readiness validation.

## Continuation Delta (finish_successful_run_handoff, 2026-06-01)

### Read-only failed-deploy diagnosis slice
- Timestamp (UTC): 2026-06-01T10:37:03Z
- Command: `node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch`
- Result: failed with HTTP 401 (no protected credentials in this lane)
- Classification: protected runtime-freshness probe path is correctly fail-closed for unauthenticated requests.
- Safety: no deploy/restart/rollback/env/database mutation performed.

### Decision gate separation
- This diagnosis slice remains separate from any deploy/restart/protected-smoke mutation approval.
- If production mutation is required, explicit approval must name resource, action, rollback path, and smoke plan.
