# LUC-5643 Soar Protected Recheck

- Issue: [LUC-5643](/LUC/issues/LUC-5643)
- Parent gate: [LUC-241](/LUC/issues/LUC-241)
- Checked at: 2026-06-27T22:04:20+02:00
- Environment: production
- API base: `https://api.soar.luckysparrow.ch`
- Web base: `https://soar.luckysparrow.ch`
- Deployed build-info: `42177530f2a2ddc22832133b545bccab6ab404eb` on `main`
- Build metadata source: `env-runtime` (diagnostic-only provenance residual)

## Scope

Read-only DRE protected gate recheck for canonical production smoke and
protected `/workers/ready`. No deploy, push, restart, rollback, env edit,
secret/account readback, database/Redis mutation, raw log capture, production
account mutation, subscription/payment mutation, exchange mutation, order,
position, or live-trading action occurred.

## Commands

```powershell
pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result: `FAIL` only on protected worker readiness because the pre-bound
`SMOKE_AUTH_TOKEN` returned `401`.

```powershell
$env:SMOKE_AUTH_TOKEN=''; pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result: `PASS`.

## Smoke Results

| Check | Stale token path | Fresh login path |
| --- | --- | --- |
| API `/health` | `200` PASS | `200` PASS |
| API `/ready` | `200` PASS | `200` PASS |
| Web `/` | `200` PASS | `200` PASS |
| Web `/api/build-info` | `200` PASS | `200` PASS |
| API `/workers/ready` | `401` FAIL | `200` PASS |

## Protected Worker Readiness Body

The fresh-login protected readback returned:

- status: `ready`
- service: `workers`
- mode: `split`
- environment: `deployed`
- topologyStatus: `healthy`
- degradedReasons: `[]`
- required queues:
  `WORKER_BACKTEST_QUEUE`, `WORKER_EXECUTION_QUEUE`,
  `WORKER_MARKET_DATA_QUEUE`
- required worker families:
  `backtest`, `execution`, `market-data`, `market-stream`
- heartbeat status:
  `backtest=fresh`, `execution=fresh`, `market-data=fresh`,
  `market-stream=fresh`

## Disposition

`DONE / VERIFIED_PRODUCTION / PROTECTED_WORKERS_READY_PASS /
STALE_SMOKE_AUTH_TOKEN_RESIDUAL`.

The protected gate itself is healthy through the approved smoke login path.
The only recheck residual is the stale pre-bound `SMOKE_AUTH_TOKEN`; Security
or Ops should rotate/remove that token binding if it remains present in future
runners.
