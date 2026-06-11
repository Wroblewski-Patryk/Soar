# LUC-3461 Coolify Production Deploy Health Sweep

- Checked at: 2026-06-11T12:52:30Z
- Owner: 09 DRE (Deployment and Reliability Engineer)
- Mode: read-only production health sweep
- Scope: Soar Coolify production project/environment/resources and public API/Web health

## Result

Status: partially verified / public smoke pass / protected gates still open.

[LUC-3461](/LUC/issues/LUC-3461) refreshed the production health picture without
deploy, restart, rebuild, rollback, environment edit, database action, Redis
action, team setting change, account action, protected smoke, raw log capture,
screenshot, or live-trading mutation.

## Secret Handling

Runtime bindings were checked by name only. Coolify token values, raw resource
IDs, internal URLs, cookies, passwords, database values, and raw log bodies were
not printed or stored.

## Public Smoke

Command:

```bash
pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result:

| Check | Result |
| --- | --- |
| API `/health` | PASS `200` |
| API `/ready` | PASS `200` |
| Web `/` | PASS `200` |
| Web `/api/build-info` | PASS `200` |

Worker readiness was intentionally skipped because `/workers/ready` remains a
protected gate and this sweep had no fresh approval to run protected smoke.

## Build Info

Read-only build-info readback:

| Field | Value |
| --- | --- |
| HTTP status | `200` |
| Response time | `219ms` |
| `gitSha` | `56d8d440bfe0fd9ee692e9f669e35414d85d2493` |
| `gitRef` | `main` |
| `metadataSource` | `github-branch` |
| `buildId` | `Xnn0H5fuVVTeahYMA8tvy` |

Deploy provenance caveat: `github-branch` is diagnostic only under the Soar
Coolify setup guide. It proves public build-info reachability and branch-head
reporting, but it is not release-grade deployed image provenance.

## Coolify Read-Only Inventory

Authenticated read-only Coolify API calls succeeded for:

| Check | Result |
| --- | --- |
| Version | pass |
| Current team selector | pass; `LuckySparrow` |
| Project | pass; `Soar` |
| Configured production environment binding | pass |
| Global resources | pass; `17` visible rows |
| Global active deployments | pass; `0` visible rows |

Production environment resources:

| Resource | Type | Coolify status | Server status | Commit metadata | Dockerfile | Restart count | Last restart type |
| --- | --- | --- | --- | --- | --- | ---: | --- |
| `soar-web` | application | `running:unknown` | `true` | `b894e5dd` | n/a | 0 | n/a |
| `soar-api` | application | `running:unknown` | `true` | `HEAD` | n/a | 0 | n/a |
| `workers-backtest` | application | `running:unknown` | `true` | `HEAD` | n/a | 0 | n/a |
| `workers-execution` | application | `running:unknown` | `true` | `HEAD` | n/a | 2 | `crash` |
| `workers-market-data` | application | `running:unknown` | `true` | `HEAD` | n/a | 0 | n/a |
| `workers-market-stream` | application | `running:unknown` | `true` | `HEAD` | n/a | 0 | n/a |
| `postgresql` | postgresql | `running:healthy` | `true` | n/a | n/a | 52 | `crash` |
| `redis` | redis | `running:healthy` | `true` | n/a | n/a | 682 | `crash` |

## Diagnosis

- Public API/Web smoke is currently healthy for the read-only endpoints covered
  by the no-worker smoke.
- Coolify production inventory remains the canonical eight-resource topology:
  API, Web, four workers, PostgreSQL, and Redis.
- PostgreSQL and Redis report `running:healthy`.
- Application rows still report `running:unknown`, so Coolify application
  status alone is not sufficient release readiness proof.
- `workers-execution` still retains failure-adjacent restart metadata
  (`restartCount=2`, `lastRestartType=crash`).
- Global active deployments remain `0`; this sweep did not prove failed deploy
  log/root-cause visibility.
- Existing [LUC-3382](/LUC/issues/LUC-3382) already completed the separate
  read-only failed-deploy diagnosis lane for recent failed-deploy observations.

## Verification Notes

- `pnpm softwarehouse:control-tick` is unavailable in this checkout:
  `Command "softwarehouse:control-tick" not found`.
- A direct PowerShell endpoint probe was discarded as evidence because the local
  wrapper failed on null/header formatting after request handling. The
  authoritative endpoint proof for this packet is the project
  `ops:deploy:smoke` command plus the separate Node build-info readback.

## Residual Risk

- Full production release readiness is not proven by this sweep.
- Protected auth smoke, `/workers/ready`, worker runtime freshness, rollback
  proof, restore drill, SLO evidence, release approval, and release-grade
  source provenance remain separate gates.
- Any deploy, restart, redeploy, rollback, environment edit, or protected smoke
  must remain fail-closed until explicitly approved with target resource,
  rollback path, and smoke plan.
