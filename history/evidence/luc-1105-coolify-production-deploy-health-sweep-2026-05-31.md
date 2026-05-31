# LUC-1105 - Coolify Production Deploy Health Sweep (2026-05-31)

## Scope
- Read-only public production health check on canonical domains.
- No deploy/restart/rollback/env mutation.

## Execution Timestamp
- 2026-05-31T18:31:27+02:00

## Source Snapshot
- local `HEAD`: `a314b8742a2318f5fe22b0442ccc7f68ed67a54d`
- remote `origin/main`: `6839cd6b8884e26eca735ce32cea98c1dadccfbe`

## Probe Results
- `https://api.soar.luckysparrow.ch/health -> 200`
- `https://api.soar.luckysparrow.ch/ready -> 200`
- `https://soar.luckysparrow.ch/ -> 200`
- `https://soar.luckysparrow.ch/api/build-info -> 200`

## Build Info Snapshot
- `gitSha`: `6839cd6b8884e26eca735ce32cea98c1dadccfbe`
- `gitRef`: `main`
- `metadataSource`: `github-branch`
- `metadataGeneratedAt`: `2026-05-31T15:39:59.210Z`
- `checkedAt`: `2026-05-31T16:31:21.477Z`

## Tool Output Summary
- `node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --skip-workers`
  - `PASS API /health -> 200`
  - `PASS API /ready -> 200`
  - `PASS WEB / -> 200`
  - `PASS WEB /api/build-info -> 200`
  - `all checks passed`
- `curl` spot-check confirmed all four `200` statuses.

## Disposition
- `done` (canonical production public health is reachable and green in this heartbeat).

## Residual Risk
1. Sweep was read-only and public-endpoint scoped (workers/protected paths were not part of this issue heartbeat).
2. Local `HEAD` differs from `origin/main`; no deploy mutation was attempted.

## Continuation - finish_successful_run_handoff
- Execution timestamp: 2026-05-31T18:33:10+02:00.
- Additional read-only continuity recheck executed:
  - 
ode scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --skip-workers`n  - curl https://soar.luckysparrow.ch/api/build-info`n- Continuation outcome:
  - PASS API /health -> 200`n  - PASS API /ready -> 200`n  - PASS WEB / -> 200`n  - PASS WEB /api/build-info -> 200`n  - build-info unchanged: gitSha=6839cd6b8884e26eca735ce32cea98c1dadccfbe, gitRef=main, metadataSource=github-branch.
- Continuation disposition: done (no mutation path required in this wake).
