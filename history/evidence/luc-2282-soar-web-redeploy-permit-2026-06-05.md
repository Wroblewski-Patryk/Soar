# LUC-2282 Soar Web Redeploy Permit Evidence

Date: 2026-06-05
Owner: Ops Release Lead
Scope: read-only preparation for persistent production `soar-web` 503

## Result

Status: permit prepared; production mutation not performed.

The current production failure remains isolated to `soar-web` public
readiness. A read-only public smoke showed the API is healthy while the web app
returns `503` for both the root route and build-info route. Read-only Coolify
metadata shows the `soar-web` application is crash-restarting.

## Current Evidence

| Probe | Result |
| --- | --- |
| `git rev-parse HEAD` | `6e31d814046b640ad529d1cd57f968ba6f67b05e` |
| `git ls-remote --heads origin main` | `6e31d814046b640ad529d1cd57f968ba6f67b05e refs/heads/main` |
| Public API `/health` | pass, `200` |
| Public API `/ready` | pass, `200` |
| Public Web `/` | fail, `503` |
| Public Web `/api/build-info` | fail, `503` |
| Coolify app name | `soar-web` |
| Coolify app status | `restarting:unknown` |
| Coolify last restart type | `crash` |
| Coolify last restart time | `2026-06-05T20:36:37Z` |
| Coolify restart count | `54` |
| Coolify app log endpoint | blocked by app state: `400`, `Application is not running.` |

## Prepared Permit

Authorize one controlled redeploy of the `Soar / production / soar-web`
application from pushed branch `main` at exact SHA
`6e31d814046b640ad529d1cd57f968ba6f67b05e`.

Do not mutate API, database, Redis, workers, environment variables, team
settings, accounts, exchange settings, or live-trading state. Use existing
Coolify/Paperclip secret bindings only and do not print secret values.

## Smoke Plan

After the single redeploy attempt:

1. Poll `https://soar.luckysparrow.ch/` and
   `https://soar.luckysparrow.ch/api/build-info` up to eight times at
   15-second intervals.
2. Require `WEB /` to return `2xx` or `3xx`.
3. Require `WEB /api/build-info` to return JSON with
   `gitSha=6e31d814046b640ad529d1cd57f968ba6f67b05e`.
4. Recheck public API `/health` and `/ready` remain `200`.
5. Run `pnpm run ops:coolify-stack:env-check:test` locally for the reusable
   Ops env-contract regression.

## Stop Condition

Stop immediately after the single redeploy attempt if:

- `soar-web` remains `503` after eight 15-second polls;
- Coolify readback returns `restarting:unknown` again;
- build-info is missing or reports a different SHA;
- API `/health` or `/ready` regresses.

## Rollback Boundary

This evidence does not authorize rollback execution because the read-only
endpoints used in this heartbeat did not expose a named previous stable
deployment/image. If redeploy fails, the next legal action is a separate
rollback permit after Security/Ops-approved host/Coolify deployment-log export
or Coolify UI deployment-history readback names the exact previous stable
deployment/image.

## Safety

No deploy, rollback, restart, env edit, database action, team setting change,
protected smoke, account action, secret readback, exchange mutation, or
live-trading action occurred in this preparation heartbeat.
