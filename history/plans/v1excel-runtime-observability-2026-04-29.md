# V1EXCEL-06 - Runtime Observability

Status: PARTIAL PASS - production runtime observability green, stage still open
Date: 2026-04-29
Owner: Codex Execution Agent

## Purpose

Verify what can currently be proven about active stage and production runtime
observability from this session.

## Probes Executed

### Stage runtime freshness without auth

```powershell
pnpm run ops:deploy:runtime-freshness -- --base-url https://stage-api.soar.luckysparrow.ch
```

Result:

- HTTP `401`

### Production runtime freshness without auth

```powershell
pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch
```

Result:

- HTTP `401`

### Stage rollback-guard probe without auth

```powershell
pnpm run ops:deploy:rollback-guard -- --base-url https://stage-api.soar.luckysparrow.ch
```

Result:

- `shouldRollback=true`
- reasons:
  - `runtime_freshness_endpoint_http_401`
  - `alerts_endpoint_http_401`

### Production rollback-guard probe without auth

```powershell
pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch
```

Result:

- `shouldRollback=true`
- reasons:
  - `runtime_freshness_endpoint_http_401`
  - `alerts_endpoint_http_401`

## What This Proves

- protected runtime observability endpoints exist
- they are auth-gated on both stage and prod
- this session cannot prove worker freshness, alert cleanliness, or protected
  runtime health without OPS/private-route credentials

## Final Classification

Runtime observability is no longer fully blocked by missing authentication:
production protected runtime observability is green with authenticated access.
Stage runtime observability still requires its own authenticated evidence before
the broader `V1EXCEL-06` confidence gate can be considered fully closed.

## 2026-05-01 Production Authenticated Refresh

Scope: production only, read-only.

Auth was supplied through the session environment and was not written to disk.
No trading action was executed.

### Production runtime freshness with auth

```powershell
pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch --timeout-ms 15000
```

Result:

- PASS
- `workerHeartbeat`: PASS, `ageMs=20482`, threshold `60000`
- `marketData`: PASS, `ageMs=20482`, threshold `120000`
- `runtimeSignalLag`: PASS, `ageMs=0`, threshold `90000`
- `runtimeSessions`: PASS, `runningCount=4`, `staleSessionIds=[]`
- `runtimeDecisionActivity`: SKIP, not required by this gate

### Production rollback guard with auth

```powershell
pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch --timeout-ms 15000
```

Result:

- PASS
- `checkedAt`: `2026-05-01T00:35:19.429Z`
- `shouldRollback`: `false`
- `reasons`: `[]`
- runtime freshness status: PASS
- alerts: `[]`

### Operator note

The runtime freshness and rollback guard scripts use different environment
variable prefixes:

- runtime freshness reads `DEPLOY_FRESHNESS_*`
- rollback guard reads `ROLLBACK_GUARD_*`

Using the wrong prefix leaves rollback guard unauthenticated and correctly
returns `401`.
