# V1EXCEL-04 - Stage Refresh

Status: BLOCKED
Date: 2026-04-29
Owner: Codex Execution Agent

## Purpose

Refresh stage confidence on the current repository candidate and record the
exact difference between:

- public stage reachability that can be exercised from this session,
- and the authenticated private-route evidence still required by contract.

## Executed Evidence

### Public stage smoke

```powershell
pnpm run ops:deploy:smoke -- --base-url https://stage-api.soar.luckysparrow.ch --web-base-url https://stage.soar.luckysparrow.ch --no-workers
```

Result:

- PASS API `/health` -> `200`
- PASS API `/ready` -> `200`
- PASS WEB `/` -> `200`

### Canonical stage rehearsal dry-run

```powershell
pnpm run ops:release:v1:stage-rehearsal -- --dry-run --base-url https://stage-api.soar.luckysparrow.ch --web-base-url https://stage.soar.luckysparrow.ch
```

Artifacts:

- [v1-release-gate-stage-2026-04-29T17-12-31-748Z.md](C:/Personal/Projekty/Aplikacje/Soar/history/releases/v1-release-gate-stage-2026-04-29T17-12-31-748Z.md)
- [v1-stage-rehearsal-2026-04-29T17-12-31-748Z.md](C:/Personal/Projekty/Aplikacje/Soar/history/releases/v1-stage-rehearsal-2026-04-29T17-12-31-748Z.md)

Dry-run result:

- readiness: `not_ready`
- stale stage evidence families detected:
  - activation evidence audit
  - activation execution plan
- remote stage OPS/private-route execution was not exercised

## Blocking Evidence

### Runtime freshness without auth

```powershell
pnpm run ops:deploy:runtime-freshness -- --base-url https://stage-api.soar.luckysparrow.ch
```

Result:

- FAIL with HTTP `401`

### Rollback guard without auth

```powershell
pnpm run ops:deploy:rollback-guard -- --base-url https://stage-api.soar.luckysparrow.ch
```

Result:

- `shouldRollback=true`
- reasons:
  - `runtime_freshness_endpoint_http_401`
  - `alerts_endpoint_http_401`

## Final Classification

Stage is publicly reachable and healthy at the smoke level, but the required
authenticated stage release gate is still `BLOCKED` by missing OPS/private-route
credentials.

