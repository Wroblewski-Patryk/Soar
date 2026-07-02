# LUC-6161 Soar Protected Recheck

- Issue: [LUC-6161](/LUC/issues/LUC-6161)
- Parent blocker: [LUC-241](/LUC/issues/LUC-241)
- Checked at: `2026-06-29T02:04:37.588Z` UTC
- Scope: read-only production protected auth/smoke recheck.
- Forbidden actions respected: no deploy, restart, runtime mutation, push,
  env edit, secret/account value readback, DB/Redis mutation, exchange/payment
  mutation, order, position, or live-trading action.

## Result

`VERIFIED_PRODUCTION / PROTECTED_WORKERS_READY_PASS / RUNTIME_FRESHNESS_PASS /
ROLLBACK_GUARD_PASS / NO_RUNTIME_MUTATION`

The current DRE runner no longer has `SMOKE_AUTH_TOKEN`; it has the approved
fresh-login smoke binding by name/length only. Current-binding deploy smoke
passed public API/Web checks and protected `GET /workers/ready -> 200`.
Runtime freshness passed after mapping the same fresh-login binding into the
runtime-freshness script namespace. Rollback guard returned
`shouldRollback=false`.

## Evidence

### Binding Shape

Command:

```powershell
$names = 'SMOKE_AUTH_TOKEN','SMOKE_AUTH_EMAIL','SMOKE_AUTH_PASSWORD',
  'SOAR_PROD_AUTH_TOKEN','SOAR_PROD_EMAIL','SOAR_PROD_PASSWORD',
  'DEPLOY_FRESHNESS_AUTH_TOKEN','ROLLBACK_GUARD_AUTH_TOKEN'
foreach ($name in $names) {
  $v = [Environment]::GetEnvironmentVariable($name)
  if ($null -eq $v -or $v.Length -eq 0) { "$name=ABSENT" }
  else { "$name=PRESENT(len=$($v.Length))" }
}
```

Result:

- `SMOKE_AUTH_TOKEN=ABSENT`
- `SMOKE_AUTH_EMAIL=PRESENT(len=26)`
- `SMOKE_AUTH_PASSWORD=PRESENT(len=9)`
- `SOAR_PROD_AUTH_TOKEN=ABSENT`
- `SOAR_PROD_EMAIL=ABSENT`
- `SOAR_PROD_PASSWORD=ABSENT`
- `DEPLOY_FRESHNESS_AUTH_TOKEN=ABSENT`
- `ROLLBACK_GUARD_AUTH_TOKEN=ABSENT`

No secret values were printed.

### Protected Deploy Smoke

Command:

```powershell
pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result:

- `PASS API /health -> 200`
- `PASS API /ready -> 200`
- `PASS WEB / -> 200`
- `PASS WEB /api/build-info -> 200`
- `PASS API /workers/ready -> 200`

### Runtime Freshness

First command:

```powershell
pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch
```

Result: failed with `HTTP 401` because the script uses the
`DEPLOY_FRESHNESS_*` protected namespace and no values were bound there.

Mapped rerun command:

```powershell
$env:DEPLOY_FRESHNESS_AUTH_EMAIL=$env:SMOKE_AUTH_EMAIL
$env:DEPLOY_FRESHNESS_AUTH_PASSWORD=$env:SMOKE_AUTH_PASSWORD
node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch
```

Result:

- `PASS`
- `workerHeartbeat`: `PASS`, age `20754 ms`, threshold `60000 ms`
- `marketData`: `PASS`, age `20754 ms`, threshold `120000 ms`
- `runtimeSignalLag`: `PASS`, age `0 ms`, threshold `90000 ms`
- `runtimeSessions`: `PASS`, `runningCount=5`, `staleSessionIds=[]`
- `runtimeDecisionActivity`: `SKIP`, not required for running sessions

### Rollback Guard

Command:

```powershell
$env:ROLLBACK_GUARD_AUTH_EMAIL=$env:SMOKE_AUTH_EMAIL
$env:ROLLBACK_GUARD_AUTH_PASSWORD=$env:SMOKE_AUTH_PASSWORD
node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch
```

Result:

- `shouldRollback=false`
- `reasons=[]`
- workers ready status `ready`
- topology `healthy`
- required worker families:
  `backtest`, `execution`, `market-data`, `market-stream`
- runtime freshness `PASS`
- alerts `[]`

### Build Info Readback

Command:

```powershell
Invoke-RestMethod -Uri 'https://soar.luckysparrow.ch/api/build-info' |
  Select-Object gitSha,metadataSource,generatedAt
```

Result:

- `gitSha=c357d957741f56835f27a1fc3a948dad43a91036`
- `metadataSource=env-runtime`
- `generatedAt=null`

## Residual Risk

- This closes only the protected workers/runtime recheck requested by
  [LUC-6161](/LUC/issues/LUC-6161).
- Release-grade build provenance remains a separate source-control/release
  gate because Web build-info still reports `metadataSource=env-runtime`.
- Host-level VPS pressure/log-window proof remains gated by approved read-only
  host-status credentials.
- This heartbeat did not run full browser auth acceptance or mutate production.
