# LUC-1307 Coolify Production Deploy Health Sweep (2026-06-01)

- Timestamp (UTC): 2026-06-01T16:32:40Z
- Lane: Ops Release Lead
- Scope: Read-only production deploy health sweep (no production mutation)
- Wake acknowledgement: `issue_continuation_needed` consumed from inline payload (`fallbackFetchNeeded=false`, comments `0/0`).

## Source Ref Snapshot
- Local `HEAD`: `af31302eaf3abb18fa89be6789bee0641d434806`
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
- `checkedAt=2026-06-01T16:32:33.022Z`

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
