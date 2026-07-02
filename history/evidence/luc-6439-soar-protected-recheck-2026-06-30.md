# LUC-6439 Soar Protected Recheck

- Issue: [LUC-6439](/LUC/issues/LUC-6439)
- Parent blocker: [LUC-241](/LUC/issues/LUC-241)
- Checked at: `2026-06-30T18:07:28.656Z` UTC
- Scope: read-only production protected auth/smoke recheck.
- Forbidden actions respected: no deploy, restart, runtime mutation, push,
  env edit, secret/account value readback, DB/Redis mutation, exchange/payment
  mutation, order, position, live-account mutation, or live-trading action.

## Result

`BLOCKED / PRODUCTION_WEB_503 / WORKERS_READY_503 / RUNTIME_FRESHNESS_PASS /
ROLLBACK_GUARD_ACTION_REQUIRED / NO_RUNTIME_MUTATION`

The current DRE runner has no `SMOKE_AUTH_TOKEN`; it has the fresh-login smoke
binding by name/length only. Production API `/health` and `/ready` passed, but
public Web `/`, Web `/api/build-info`, and protected `GET /workers/ready`
returned `503`. Runtime freshness passed when the same smoke binding was
mapped into the runtime-freshness script namespace. Rollback guard returned
`shouldRollback=true` only because `/workers/ready` returned `503`; runtime
freshness and alerts were healthy.

## Evidence

### Binding Shape

Command:

```powershell
@'
for (const n of ['SMOKE_AUTH_TOKEN','SMOKE_AUTH_EMAIL','SMOKE_AUTH_PASSWORD',
  'DEPLOY_FRESHNESS_AUTH_TOKEN','DEPLOY_FRESHNESS_AUTH_EMAIL',
  'DEPLOY_FRESHNESS_AUTH_PASSWORD','ROLLBACK_GUARD_AUTH_TOKEN',
  'ROLLBACK_GUARD_AUTH_EMAIL','ROLLBACK_GUARD_AUTH_PASSWORD',
  'PROD_UI_AUDIT_EMAIL','PROD_UI_AUDIT_PASSWORD']) {
  const v = process.env[n];
  console.log(n + '=' + (v ? 'PRESENT(len=' + v.length + ')' : 'ABSENT'));
}
'@ | node -
```

Result:

- `SMOKE_AUTH_TOKEN=ABSENT`
- `SMOKE_AUTH_EMAIL=PRESENT(len=26)`
- `SMOKE_AUTH_PASSWORD=PRESENT(len=9)`
- `DEPLOY_FRESHNESS_AUTH_TOKEN=ABSENT`
- `DEPLOY_FRESHNESS_AUTH_EMAIL=ABSENT`
- `DEPLOY_FRESHNESS_AUTH_PASSWORD=ABSENT`
- `ROLLBACK_GUARD_AUTH_TOKEN=ABSENT`
- `ROLLBACK_GUARD_AUTH_EMAIL=ABSENT`
- `ROLLBACK_GUARD_AUTH_PASSWORD=ABSENT`
- `PROD_UI_AUDIT_EMAIL=ABSENT`
- `PROD_UI_AUDIT_PASSWORD=ABSENT`

No secret values were printed.

### Protected Deploy Smoke

Command:

```powershell
pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result:

- `PASS API /health -> 200`
- `PASS API /ready -> 200`
- `FAIL WEB / -> status 503`
- `FAIL WEB /api/build-info -> status 503`
- `FAIL API /workers/ready -> status 503`

Exit code: `1`.

### Runtime Freshness

Initial command:

```powershell
pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch
```

Result: failed with `HTTP 401` because the script uses the
`DEPLOY_FRESHNESS_*` protected namespace and no values were bound there.

Mapped rerun command:

```powershell
$env:DEPLOY_FRESHNESS_AUTH_EMAIL=$env:SMOKE_AUTH_EMAIL
$env:DEPLOY_FRESHNESS_AUTH_PASSWORD=$env:SMOKE_AUTH_PASSWORD
pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch
```

Result:

- `PASS`
- `workerHeartbeat`: `PASS`, age `3838 ms`, threshold `60000 ms`
- `marketData`: `PASS`, age `3838 ms`, threshold `120000 ms`
- `runtimeSignalLag`: `PASS`, age `0 ms`, threshold `90000 ms`
- `runtimeSessions`: `PASS`, `runningCount=5`, `staleSessionIds=[]`
- `runtimeDecisionActivity`: `SKIP`, not required for running sessions

### Rollback Guard

Initial command:

```powershell
pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result: failed closed with `workers_ready_endpoint_http_401`,
`runtime_freshness_endpoint_http_401`, and `alerts_endpoint_http_401` because
the rollback script uses the `ROLLBACK_GUARD_*` protected namespace and no
values were bound there.

Mapped rerun command:

```powershell
$env:ROLLBACK_GUARD_AUTH_EMAIL=$env:SMOKE_AUTH_EMAIL
$env:ROLLBACK_GUARD_AUTH_PASSWORD=$env:SMOKE_AUTH_PASSWORD
pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result:

- `checkedAt=2026-06-30T18:07:28.656Z`
- `shouldRollback=true`
- `reasons=["workers_ready_endpoint_http_503"]`
- `freshness.status=PASS`
- `alerts=[]`

## Residual Risk

- [LUC-6331](/LUC/issues/LUC-6331) remains the active production Web and
  worker-readiness restoration path before this protected gate can pass.
- This recheck did not mutate production and did not prove Web availability.
- Release-grade build provenance and host-level VPS/log-window proof remain
  separate release/Ops gates.
