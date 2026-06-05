# LUC-2297 - Retrieve Redacted soar-web Crash Logs After Queue Clear

## Context

[LUC-2287](/LUC/issues/LUC-2287) cleared the visible stale `soar-web` Coolify deploy queue and showed target-SHA deployment rows `5536` and `5537` as finished, but production Web still returned `503` and Coolify reported `soar-web` crash-restarting at `2026-06-05T20:58:25Z`.

## Goal

Retrieve redacted deployment/app/host evidence for only `soar-web` in the `2026-06-05T20:52Z` to `2026-06-05T20:59Z` window, identify the runtime crash cause or document why logs are unavailable, and leave a clear next owner/action.

## Constraints

- Use bound Coolify/VPS/Paperclip secrets only; never print or store values.
- Read-only diagnostics only.
- Do not mutate API, workers, Postgres, Redis, env vars, accounts, secrets, exchange settings, rollback/deploy state, or live data.
- Persist only redacted summaries, timestamps, and normalized runtime facts.

## Definition Of Done

- [x] Redacted evidence artifact exists.
- [x] Evidence names timestamps and source surfaces.
- [x] Crash cause is classified or log unavailability is documented.
- [x] Minimal public smoke covers API `/health`, API `/ready`, Web `/`, and Web `/api/build-info`.
- [x] Next owner/action is explicit.

## Forbidden

- Production mutation.
- Raw secret, env, host path, container id, network id, volume id, or full log disclosure.
- Claiming recovery from public API health while Web remains `503`.

## Stage

- `verification`

## Result Report

Status: `done`.

Concrete action:

1. Consumed the scoped wake for [LUC-2297](/LUC/issues/LUC-2297); no new human comments were present in the wake payload.
2. Reviewed parent [LUC-2287](/LUC/issues/LUC-2287) comments and local evidence for deployment rows `5536` and `5537`.
3. Queried Coolify app metadata and log/deployment surfaces for `soar-web`.
4. Used existing `codex-vps` SSH alias for read-only Docker log/inspect/event projections against only the `soar-web` resource alias.
5. Ran minimal public smoke.
6. Created redacted evidence: `history/evidence/luc-2297-soar-web-crash-log-retrieval-2026-06-05.md`.

Findings:

- Coolify still reports `soar-web` as `restarting:unknown` with `last_restart_type=crash` and crash timestamp `2026-06-05T20:58:25Z`.
- Coolify app logs endpoint returned `400 Bad Request`; deployment-log variants returned `404` or timed out.
- The current Docker container was created after the requested window, so Docker logs/events for `20:52Z..20:59Z` were not retained on that current container.
- Current container logs show repeated `MODULE_NOT_FOUND` for `[APP_ROOT]/scripts/runWebNextProductionCommand.mjs`, then pnpm recursive start failure and exit `1`.
- The repo start contract is `apps/web/package.json` -> `node ../../scripts/runWebNextProductionCommand.mjs start`.

Classification:

- `web image/startup packaging`

Validation:

- API `/health` -> `200`
- API `/ready` -> `200`
- Web `/` -> `503`, `no available server`
- Web `/api/build-info` -> `503`, `no available server`

Next owner/action:

- Frontend/Engineering follow-up [LUC-2304](/LUC/issues/LUC-2304) must repair the production Web image/startup contract so the runtime image either includes `scripts/runWebNextProductionCommand.mjs` at the expected repo-root path or stops depending on a repo-root script that is absent in the deployed image.
- Ops must wait for a code fix and a separate release mutation permit before any deploy/restart/rollback recovery action.

Deployment impact:

- none in this heartbeat; read-only diagnostics only.
