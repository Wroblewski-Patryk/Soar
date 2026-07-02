# LUC-5809 Soar Protected Recheck Evidence

- Issue: [LUC-5809](/LUC/issues/LUC-5809)
- Parent gate: [LUC-241](/LUC/issues/LUC-241)
- Checked at: 2026-06-28T05:02:44.010Z
- Owner lane: Deployment and Reliability Engineer
- Scope: read-only production auth/smoke recheck for protected workers readiness.

## Boundary

- No deploy, push, restart, rollback execution, env edit, secret/account
  readback, raw log capture, database/Redis mutation, production account
  mutation, subscription/payment mutation, exchange mutation, order, position,
  or live-trading action occurred.
- Secret values were not printed or written to evidence. The shell used the
  configured smoke login path after clearing only the process-local
  `SMOKE_AUTH_TOKEN` variable for the second smoke run.

## Commands

### Canonical smoke with current runner bindings

```powershell
pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result: `FAIL` because protected `/workers/ready` returned `401`.

Observed rows:

- `PASS API /health -> 200`
- `PASS API /ready -> 200`
- `PASS WEB / -> 200`
- `PASS WEB /api/build-info -> 200`
- `FAIL API /workers/ready -> status 401`

Interpretation: public API/Web are healthy. The pre-bound `SMOKE_AUTH_TOKEN`
still fails closed for the protected workers readiness endpoint.

### Canonical smoke with stale token cleared and fresh login-derived auth

```powershell
$env:SMOKE_AUTH_TOKEN='';
pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result: `PASS`.

Observed rows:

- `PASS API /health -> 200`
- `PASS API /ready -> 200`
- `PASS WEB / -> 200`
- `PASS WEB /api/build-info -> 200`
- `PASS API /workers/ready -> 200`
- `deploy-smoke all checks passed`

Interpretation: the configured smoke login path can obtain fresh auth and pass
protected workers readiness.

### Rollback guard with fresh login-derived auth

```powershell
$env:ROLLBACK_GUARD_AUTH_EMAIL=$env:SMOKE_AUTH_EMAIL;
$env:ROLLBACK_GUARD_AUTH_PASSWORD=$env:SMOKE_AUTH_PASSWORD;
$env:ROLLBACK_GUARD_AUTH_TOKEN='';
pnpm exec node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch
```

Result: `PASS / shouldRollback=false`.

Key readback:

- `shouldRollback=false`
- `reasons=[]`
- workers ready: `status=ready`, `topologyStatus=healthy`
- required worker families: `backtest`, `execution`, `market-data`,
  `market-stream`
- runtime freshness: `PASS`
- runtime sessions: `runningCount=5`, `staleSessionIds=[]`
- alerts: `[]`

### Build-info readback

```powershell
Invoke-RestMethod -Uri 'https://soar.luckysparrow.ch/api/build-info' -Method Get
```

Result:

- `buildId=Urnq8xtZUh932c0e3vKGl`
- `gitSha=42177530f2a2ddc22832133b545bccab6ab404eb`
- `gitRef=main`
- `metadataGeneratedAt=2026-06-15T21:00:54.489Z`
- `metadataSource=env-runtime`
- `checkedAt=2026-06-28T05:02:22.417Z`

Interpretation: deployed Web surface is reachable, but release-grade build
provenance remains a separate residual because `env-runtime` is diagnostic
metadata, not authoritative deploy provenance.

## Gate Result

`VERIFIED_PRODUCTION / PROTECTED_WORKERS_READY_PASS / STALE_SMOKE_AUTH_TOKEN_RESIDUAL`.

The protected recheck requested by [LUC-5809](/LUC/issues/LUC-5809) is complete.
No DRE incident is required from this heartbeat because the fresh-login smoke
path passes protected readiness and rollback guard reports no rollback reason.

## Residual Risk

- The pre-bound `SMOKE_AUTH_TOKEN` remains stale or invalid and returns `401`.
  Security/Ops should rotate or remove that binding if future DRE runners keep
  receiving it.
- Release-grade Web build provenance remains separate because build-info still
  reports `metadataSource=env-runtime`.
- Host-level VPS/proxy/container pressure and sanitized log-window proof remain
  unavailable in this DRE shell without approved read-only host-status
  credentials.
