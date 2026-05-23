# V1EXCEL-05 - Production Refresh

Status: BLOCKED
Date: 2026-04-29
Owner: Codex Execution Agent

## Purpose

Refresh production confidence on the current candidate and classify what still
blocks fresh production-grade evidence.

## Executed Evidence

### Public production smoke

```powershell
pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result:

- PASS API `/health` -> `200`
- PASS API `/ready` -> `200`
- PASS WEB `/` -> `200`

### Canonical production release-gate dry-run

```powershell
pnpm run ops:release:v1:gate -- --environment prod --dry-run --skip-local-quality --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Artifact:

- [v1-release-gate-prod-2026-04-29T17-12-31-764Z.md](C:/Personal/Projekty/Aplikacje/Soar/history/releases/v1-release-gate-prod-2026-04-29T17-12-31-764Z.md)

Dry-run result:

- readiness: `not_ready`
- stale production evidence families detected:
  - activation evidence audit
  - activation execution plan
  - RC external gates status
  - RC sign-off record
  - RC checklist verification block
  - backup/restore drill evidence
  - rollback proof pack

## Blocking Evidence

### Runtime freshness without auth

```powershell
pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch
```

Result:

- FAIL with HTTP `401`

### Rollback guard without auth

```powershell
pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch
```

Result:

- `shouldRollback=true`
- reasons:
  - `runtime_freshness_endpoint_http_401`
  - `alerts_endpoint_http_401`

## Final Classification

Production public smoke is healthy, but current-day production activation is
still `BLOCKED` by two independent gaps:

1. stale production evidence families
2. missing OPS/private-route credentials required to regenerate the protected
   runtime and rollback proofs

