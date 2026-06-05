# LUC-2297 Soar Web Crash Log Retrieval Evidence

- Date: 2026-06-05
- Owner: Ops Release Lead
- Scope: read-only `soar-web` crash/deployment/host log retrieval after queue clear
- Resource alias: `soar-web`
- Coolify resource UUID: `ato4fqkncd6t38wzlle2m0rv`
- Target source SHA: `6e31d814046b640ad529d1cd57f968ba6f67b05e`
- Requested incident window: `2026-06-05T20:52:00Z` to `2026-06-05T20:59:59Z`
- Secret handling: bound Paperclip/Coolify/VPS secrets were used only through configured bindings; no secret values were printed or persisted.

## Result

Status: verified.

Ops retrieved redacted Coolify metadata, attempted Coolify app/deployment log surfaces, and used the approved read-only `codex-vps` SSH path for Docker log/inspect/event projections. Raw host output stayed in process memory and was not written to repo artifacts or issue comments.

## Coolify API Evidence

| Source | Result |
| --- | --- |
| `GET /api/v1/applications/{soar-web}` | reachable |
| App status | `restarting:unknown` |
| App restart signal | `last_restart_type=crash`, `last_restart_at=2026-06-05T20:58:25Z`, restart count `5` at API readback |
| App image/source metadata | Coolify app metadata still reported old app metadata SHA `b894e5dd...`; Docker host later showed the active image tag was the target SHA `6e31d814...` |
| Active deployments list | empty for `soar-web` at readback |
| App logs endpoint | `400 Bad Request`; unavailable while the app is not running |
| Deployment-log URL variants | `404` or timeout; no additional retained deployment log body was available through the API in this runner |

Existing parent evidence had already captured deployment rows `5536` and `5537` as `finished` after the queue clear. This heartbeat did not re-export raw deployment rows because the endpoint became slow/unreliable and the row status evidence was already present in [LUC-2287](/LUC/issues/LUC-2287).

## Host/Docker Evidence

The existing Security-approved host-log pattern for Soar production diagnostics was used: `codex-vps`, read-only Docker projections only, no env/mount/network secret readback.

| Source | Result |
| --- | --- |
| SSH identity | connected as non-root `codex` |
| Docker container projection | one `soar-web` resource-named container visible |
| Current container created | `2026-06-05T21:09:17Z`, after the requested `20:52Z..20:59Z` incident window |
| Current state | `restarting`, `Restarting (1)`, Docker restart count reached `10` during readback |
| Current image tag | `soar-web` resource image tagged with `6e31d814046b640ad529d1cd57f968ba6f67b05e` |
| Docker logs for requested window | no retained lines for the current container because that container was created after the window |
| Docker events for requested window | no retained rows for the current container |

## Redacted Crash Excerpt

The current container repeats the same startup failure after the requested window. Redacted, field-limited facts:

```text
2026-06-05T21:09:20Z web@0.1.0 start -> node ../../scripts/runWebNextProductionCommand.mjs start
2026-06-05T21:09:20Z Error: Cannot find module '[APP_ROOT]/scripts/runWebNextProductionCommand.mjs'
2026-06-05T21:09:20Z code: 'MODULE_NOT_FOUND'
2026-06-05T21:09:20Z Node.js v20.20.2
2026-06-05T21:09:20Z ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL web@0.1.0 start
2026-06-05T21:09:20Z Exit status 1
```

The same sequence repeated at `21:09:21Z`, `21:09:22Z`, `21:09:23Z`, `21:09:26Z`, `21:09:30Z`, `21:09:37Z`, `21:09:50Z`, `21:10:17Z`, and `21:11:09Z`.

## Root Cause Classification

Root cause class: `web image/startup packaging`.

The production `soar-web` container starts from the target SHA image but the runtime image cannot resolve the repo-level start wrapper required by `apps/web/package.json`:

```text
start = node ../../scripts/runWebNextProductionCommand.mjs start
```

Because that module is missing from the runtime image path, Node exits with `MODULE_NOT_FOUND`, pnpm reports recursive start failure, Docker restarts the container, and the public proxy returns `503 no available server`.

## Public Smoke

Run at `2026-06-05T21:12:35Z`.

| Probe | Result |
| --- | --- |
| API `/health` | `200` |
| API `/ready` | `200` |
| Web `/` | `503`, body `no available server` |
| Web `/api/build-info` | `503`, body `no available server` |

## Next Owner / Action

Frontend/Engineering must fix the production Web image/start script contract so the runtime image contains the required start wrapper or no longer depends on a repo-root script absent from the deployed image. Follow-up [LUC-2304](/LUC/issues/LUC-2304) is assigned to Frontend Engineer for that code-side repair. After that code fix is pushed, Ops needs a separate release mutation permit to deploy/recover `soar-web`.

No deploy, restart, rollback, env edit, database action, team/account change, protected smoke, exchange mutation, or live-trading action was performed in this heartbeat.
