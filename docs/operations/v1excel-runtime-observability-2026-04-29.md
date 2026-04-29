# V1EXCEL-06 - Runtime Observability

Status: BLOCKED
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

Runtime observability for the current candidate is still `BLOCKED` by missing
OPS/private-route authentication.

