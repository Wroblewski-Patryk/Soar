# LUC-2285 Soar Web Queue Clear And Redeploy Evidence

Date: 2026-06-05
Owner: Ops Release Lead
Stage: release

## Scope

Release mutation permit for `Soar / production / soar-web` only.

Authorized action: clear/cancel stale queued or in-progress `soar-web`
deployments, then trigger one controlled redeploy from branch `main` at exact
source SHA `6e31d814046b640ad529d1cd57f968ba6f67b05e`.

Explicit exclusions: no API, worker, database, Redis, environment, DNS, team
setting, account, protected-smoke credential, exchange, or live-trading
mutation.

## Source And Pre-State

| Check | Result |
| --- | --- |
| Local `main` SHA | `6e31d814046b640ad529d1cd57f968ba6f67b05e` |
| `origin/main` SHA | `6e31d814046b640ad529d1cd57f968ba6f67b05e` |
| Dirty tree | Existing state/evidence/task files present; no local dirty file was used as deploy source |
| Public API `/health` before action | `200` |
| Public API `/ready` before action | `200` |
| Public Web `/` before action | `503` |
| Public Web `/api/build-info` before action | `503` |
| Coolify app metadata | `soar-web`, branch `main`, commit setting `HEAD`, app status `restarting:unknown`, exposed port `3002` |

## Coolify Queue Action

The app-specific deployment-list endpoint documented by Coolify returned `404`
on this instance even though `/applications/{uuid}` resolved the bound
`soar-web` application. The global `/deployments` endpoint was used instead,
with strict filtering to `application_name == soar-web`.

Observed stale/fresh `soar-web` queued rows during the heartbeat included rows
created at:

- `2026-06-05T20:08:51.000000Z`
- `2026-06-05T20:33:16.000000Z`
- duplicate queued rows created while Coolify returned "already queued for
  this commit"

Targeted cancellation was performed only for the remaining `soar-web` queued
row visible at the cancellation moment. Coolify returned:

- `Deployment cancelled successfully.`
- resulting status: `cancelled-by-user`

No non-web deployment rows were cancelled.

## Redeploy Action

After the targeted cancellation, a single fresh deploy trigger was sent for the
bound `soar-web` application resource.

Coolify response:

- `Application soar-web deployment queued.`

Follow-up readback showed the fresh `soar-web` deployment in progress:

- created at `2026-06-05T20:53:02.000000Z`, then a later in-progress row at
  `2026-06-05T20:55:43.000000Z`
- no start or finish timestamp exposed by the deployment-list readback during
  the poll window

## Post-State Smoke

Eight-plus public polls after the redeploy trigger did not recover web
readiness.

| Probe | Result |
| --- | --- |
| Public Web `/` | remained `503` |
| Public Web `/api/build-info` | remained `503`; no `gitSha` available |
| Public API `/health` | remained `200` |
| Public API `/ready` | remained `200` |
| Coolify app metadata after action | `soar-web` status `restarting:unknown`, branch `main`, commit setting `HEAD`, health check disabled, exposed port `3002` |
| Coolify deployment state after action | latest visible `soar-web` row `in_progress`, created `2026-06-05T20:55:43.000000Z`, no start/finish timestamp exposed |

Project-native deploy smoke:

```text
pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers

PASS API /health -> 200
PASS API /ready -> 200
FAIL WEB / -> status 503
FAIL WEB /api/build-info -> status 503
exit code 1
```

## Result

Initial status: blocked after permitted mutation attempt.

The controlled queue cleanup/redeploy did not restore `soar-web`. The permit
stop condition is met because web remained `503`, build-info stayed
unavailable, and Coolify still reported the web app as unhealthy/restarting or
the deployment as not converged.

Next legal owner/action was routed to Security as
[LUC-2294](/LUC/issues/LUC-2294). Security approved a constrained read-only
retrieval path and confirmed that rollback still requires a separate Ops permit
naming the exact previous stable `soar-web` deployment/image.

After [LUC-2294](/LUC/issues/LUC-2294) resolved, Ops created
[LUC-2298](/LUC/issues/LUC-2298) as the separate follow-up lane to retrieve
redacted `soar-web` deployment history and prepare a rollback permit if the
evidence supports one. Do not chain another deploy, restart, rollback, env
edit, or broader queue cleanup under [LUC-2285](/LUC/issues/LUC-2285).

## Safety

No secret values, cookies, webhook URLs, raw resource ids, generated database
suffixes, unredacted logs, screenshots, account data, exchange settings, or
live-trading state were printed or stored.
