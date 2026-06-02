# LUC-1186 Coolify Production Deploy Health Sweep (2026-06-01)

- Timestamp (UTC): 2026-05-31T22:32:16Z
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
- `checkedAt=2026-05-31T22:32:16.482Z`

## Safety / Mutation Guard
- No deploy/restart/rollback/env/database mutation was performed.
- No secret values were printed or stored.

## Ops Disposition
- `done`

## Residual Risk
- Protected worker/auth readiness checks are intentionally out of scope for this read-only public sweep.
