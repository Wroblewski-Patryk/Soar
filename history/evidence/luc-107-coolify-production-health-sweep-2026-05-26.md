# LUC-107 Coolify Production Health Sweep (2026-05-26)

## Scope
Read-only production health sweep for Soar (no mutation).

## Checked At
- `2026-05-26T04:31:33.3405853Z`

## Public Endpoint Health
- API `/health` -> `200`
- API `/ready` -> `200`
- Web `/api/build-info` -> `200`
- Deployed SHA -> `3fedb7a9170097b40accb6ccea1915064f383f11`
- Build metadata source -> `github-branch`

## Coolify Production Resource Snapshot (`environment_id=6`)
- `postgresql` -> `running:healthy`
- `redis` -> `running:healthy`
- `soar-api` -> `running:unknown`
- `soar-web` -> `running:unknown`
- `workers-backtest` -> `running:unknown`
- `workers-execution` -> `running:unknown`
- `workers-market-data` -> `running:unknown`
- `workers-market-stream` -> `exited:unhealthy`

## Interpretation
- Public API/Web reachability is healthy on expected SHA.
- Production worker fleet is not fully healthy because `workers-market-stream` is unhealthy.

## Safety
- No deploy/restart/rollback/env change was executed.
- No secret values were recorded.

## Disposition
`blocked` for lane closure until worker recovery + temp-domain acceptance proof is attached.

