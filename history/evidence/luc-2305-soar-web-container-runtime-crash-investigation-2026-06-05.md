# LUC-2305 Soar Web Container Runtime Crash Investigation Evidence

- Date: 2026-06-05
- Owner: Ops Release Lead
- Scope: read-only `soar-web` container/runtime crash investigation after rollback failed closed
- Resource alias: `soar-web`
- Secret handling: Coolify/VPS/Paperclip bindings were used only through configured environment/SSH bindings; no secret values were printed or persisted.

## Result

Status: verified.

`soar-web` is still unavailable in production. The current runtime failure is a Web image/startup packaging fault, not an API outage or proxy-only condition.

## Public Smoke

Run during the LUC-2305 heartbeat:

| Probe | Result |
| --- | --- |
| API `/health` | `200` |
| API `/ready` | `200` |
| Web `/` | `503` |
| Web `/api/build-info` | `503` |

Command evidence:

- `pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` failed only the two Web checks.
- Direct curl status probe confirmed API `200/200`, Web `503/503`.

## Coolify Readback

| Source | Result |
| --- | --- |
| Required binding names | `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`, `COOLIFY_SOAR_WEB_APP_ID`, and `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT` present by name |
| `GET /api/v1/applications/{soar-web}` | reachable |
| App status | `restarting:unknown` |
| Restart signal | `last_restart_type=crash`, `last_restart_at=2026-06-05T21:18:51Z`, `restart_count=18` at readback |
| Branch/source metadata | branch `main`; app metadata source prefix still reports previous rollback candidate metadata |
| App logs endpoint | `400 Bad Request`; unavailable while the application is not running |

## Host/Docker Readback

The existing approved read-only `codex-vps` SSH path was used. Raw container names, ids, labels, networks, host paths, and generated Coolify resource ids were not persisted in this artifact.

| Source | Result |
| --- | --- |
| SSH identity | non-root `codex` |
| Docker resource label | one current `soar-web` application container found |
| Current container state | `restarting` / Docker `Restarting (1)` |
| Current image tag | target SHA prefix `6e31d814...` |
| Current container created | about `2026-06-05T21:09Z` |
| Current log signature | repeated startup failure on the Web start wrapper |

Redacted log signature:

```text
web@0.1.0 start -> node ../../scripts/runWebNextProductionCommand.mjs start
Error: Cannot find module '[APP_ROOT]/scripts/runWebNextProductionCommand.mjs'
code: 'MODULE_NOT_FOUND'
Node.js v20.20.2
ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL web@0.1.0 start
Exit status 1
```

## Source Contract Check

Current local working copy shows the expected code-side repair direction already present but uncommitted in this shared workspace:

```text
apps/web/Dockerfile runtime stage copies /app/scripts/runWebNextProductionCommand.mjs
```

This investigation did not author or validate that code change as release-ready. It only confirms why the current production image crashes.

## Classification

Root cause class: `web image/startup packaging`.

Impact: production Web has no available upstream because the `soar-web` container exits during startup. API remains publicly healthy.

## Validation

- PASS `pnpm run ops:coolify-stack:env-check:test` (`8/8`).
- FAIL expected `pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` because Web remains `503`.
- Host log proof confirms repeated `MODULE_NOT_FOUND` and exit `1`.

Two attempted host projection commands had PowerShell/SSH quoting errors and were discarded as evidence. The final accepted host proof is the simple container log tail filtered for non-secret error signatures.

## Next Owner / Action

Frontend/Engineering must finish and validate the Web image/startup contract repair, then Delivery/Ops need a separate release mutation permit to deploy a fixed `soar-web` image and rerun public Web/build-info smoke.

No deploy, restart, rollback, env edit, database action, account action, protected smoke, exchange mutation, or live-trading action was performed in this heartbeat.
