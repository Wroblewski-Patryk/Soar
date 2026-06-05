# LUC-2286 Soar Web Redeploy Failed Closed Evidence

Date: 2026-06-05
Owner: Ops Release Lead
Scope: production `soar-web` recovery permit execution

## Summary

Ops selected the prepared [LUC-2282](/LUC/issues/LUC-2282) recovery path and
triggered exactly one `soar-web` redeploy for `Soar / production` from pushed
`main` at `6e31d814046b640ad529d1cd57f968ba6f67b05e`. The action was accepted
and queued by Coolify, but it did not restore public Web readiness.

The permit stop condition is met. No second mutation was performed.

## Evidence

| Probe | Result |
| --- | --- |
| `git ls-remote --heads origin main` | `6e31d814046b640ad529d1cd57f968ba6f67b05e refs/heads/main` |
| Coolify deploy endpoint | one `soar-web` deploy accepted and queued; raw ids not recorded |
| `pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha 6e31d814046b640ad529d1cd57f968ba6f67b05e --timeout-seconds 150 --interval-seconds 15` | failed; 10 attempts returned status `503`, `gitSha=n/a` |
| `pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 6e31d814046b640ad529d1cd57f968ba6f67b05e --no-workers` | failed only Web checks |
| API `/health` after redeploy | `200` |
| API `/ready` after redeploy | `200` |
| Web `/` after redeploy | `503` |
| Web `/api/build-info` after redeploy | `503` |
| Coolify `soar-web` status after redeploy | `restarting:unknown` |
| Coolify deployment history after redeploy | new queued `HEAD` rows; earlier queued `6e31d814...`; prior finished row remains `b894e5dd...` |
| `pnpm run ops:coolify-stack:env-check:test` | passed (`8/8`) |

## Interpretation

The failure remains isolated to the Web resource from the public edge
perspective. API health and readiness stayed green. Web did not expose
build-info and therefore did not prove deployment freshness.

Because the prepared permit allowed only one redeploy and rollback still lacks
an exact approved previous stable deployment/image, the next legal action is
not another mutation. The next legal action is Security-approved redacted
deployment-log/history export, tracked by [LUC-2289](/LUC/issues/LUC-2289).

## Resume Decision After Security Approval

[LUC-2289](/LUC/issues/LUC-2289) approved constrained read-only deployment
history, deployment-log, and host lifecycle readback for `Soar / production /
soar-web`.

Ops then retrieved a redacted projection only:

| Item | Result |
| --- | --- |
| Current public smoke | API `/health` `200`; API `/ready` `200`; Web `/` `503`; Web `/api/build-info` `503` |
| Current Coolify app status | `soar-web` remains `restarting:unknown` |
| Same-SHA deployment | `6e31d814046b640ad529d1cd57f968ba6f67b05e` reached a finished deployment row with normalized `docker image build completed`, `new container started`, and `rolling update completed` events, but public Web remained `503` |
| App log endpoint | `400`; raw output not persisted |
| Previous finished source candidate | `b894e5dd30614dfd2035e91e3d848c842d3ff380`, finished at `2026-06-05T19:51:01Z` with normalized build/start/rolling-update completion events |

Decision: create [LUC-2293](/LUC/issues/LUC-2293) as the next explicit
release permit for one controlled `soar-web` rollback/redeploy to
`b894e5dd30614dfd2035e91e3d848c842d3ff380`.

## Safety

No API, worker, database, Redis, environment, team, account, protected-smoke,
secret, exchange, live-trading, rollback, force-start, or second restart
mutation was performed. The resume heartbeat performed only read-only public
smoke, redacted Coolify history/log projection, and Paperclip issue creation.
