# LUC-5721 Soar Protected Recheck Evidence

- Issue: [LUC-5721](/LUC/issues/LUC-5721)
- Parent gate: [LUC-241](/LUC/issues/LUC-241)
- Checked at: 2026-06-28T00:03:29.920Z
- Owner lane: Deployment and Reliability Engineer
- Scope: read-only production auth/smoke recheck for protected workers readiness.

## Boundary

- No deploy, push, restart, rollback execution, env edit, secret/account
  readback, raw log capture, database/Redis mutation, production account
  mutation, subscription/payment mutation, exchange mutation, order, position,
  or live-trading action occurred.
- Secret values were not printed or written to evidence. The shell exposed the
  protected input names `SMOKE_AUTH_EMAIL`, `SMOKE_AUTH_PASSWORD`, and
  `SMOKE_AUTH_TOKEN`; values were not inspected.

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

Interpretation: the approved smoke login path can obtain a fresh auth token
and pass protected workers readiness.

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

- `gitSha=42177530f2a2ddc22832133b545bccab6ab404eb`
- `gitRef=main`
- `metadataSource=env-runtime`
- `checkedAt=2026-06-28T00:03:29.920Z`

Interpretation: deployed Web surface is reachable, but release-grade build
provenance remains a separate residual because `env-runtime` is diagnostic
metadata, not an authoritative deploy provenance source per the post-deploy
smoke checklist.

## Gate Result

`VERIFIED_PRODUCTION / PROTECTED_WORKERS_READY_PASS / STALE_SMOKE_AUTH_TOKEN_RESIDUAL`.

The protected recheck requested by [LUC-5721](/LUC/issues/LUC-5721) is complete.
No DRE incident is required from this heartbeat because the current approved
fresh-login smoke path passes protected readiness and rollback guard reports no
rollback reason.

## Residual Risk

- The pre-bound `SMOKE_AUTH_TOKEN` remains stale or invalid and returns `401`.
  Security/Ops should rotate or remove that binding if future DRE runners keep
  receiving it.
- Release-grade Web build provenance remains separate because build-info still
  reports `metadataSource=env-runtime`.
- Host-level VPS/proxy/container pressure and sanitized log-window proof remain
  unavailable in this DRE shell without approved read-only host-status
  credentials.
