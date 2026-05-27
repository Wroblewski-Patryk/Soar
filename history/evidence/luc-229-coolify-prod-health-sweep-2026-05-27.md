# LUC-229 Coolify Production Deploy Health Sweep (2026-05-27)

- Timestamp (UTC): 2026-05-26T22:32:20Z
- Lane: Ops Release Lead
- Scope: Read-only production deploy health sweep (no production mutation)

## Source Ref Snapshot
- Local HEAD: 6f238533332a0916f7adc6d5d7daa439c12aa0da
- Remote origin/main: 71b8d503fd6fdfd7378dc67b2fa678799e2430f8
- Result: local workspace is ahead of production target ref; deployment source-of-truth for current prod readback is origin/main SHA.

## Public Health / Build-Info
- GET https://api.soar.luckysparrow.ch/health -> 200
- GET https://api.soar.luckysparrow.ch/ready -> 200
- GET https://soar.luckysparrow.ch/ -> 200
- GET https://soar.luckysparrow.ch/auth/login -> 200
- GET https://soar.luckysparrow.ch/api/build-info -> 200
  - gitSha: 71b8d503fd6fdfd7378dc67b2fa678799e2430f8
  - gitRef: main
  - metadataSource: github-branch

## Release Preflight Result
Command:
- pnpm run ops:release:v1:preflight -- --expected-sha 71b8d503fd6fdfd7378dc67b2fa678799e2430f8 --build-info-timeout-ms 5000

Outcome:
- Build-info freshness: PASS
- Public smoke: PASS
- Final gate: BLOCKED

Blocking classes:
- Missing protected inputs:
  - env:liveimport auth
  - env:rollback guard auth
  - env:production DB restore context
- Stale/failed required protected evidence:
  - evidence:activationAudit:stale
  - evidence:activationPlan:stale
  - evidence:rcExternalGateStatus:stale
  - evidence:rcSignoffRecord:stale
  - evidence:rcChecklist:stale
  - evidence:liveImportReadback:stale
  - evidence:prodUiClickthrough:failed
  - evidence:backupRestoreDrill:stale
  - evidence:rollbackProof:stale

## Safety / Mutation Guard
- No deploy/restart/rollback/env/database mutation was performed.
- No secret values were printed or stored.

## Ops Disposition Recommendation
- Keep issue blocked until protected credentials/context and stale protected evidence are refreshed by owners of protected lanes.
