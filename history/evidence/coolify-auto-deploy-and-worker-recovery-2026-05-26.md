# Coolify Auto Deploy And Worker Recovery Evidence - 2026-05-26

## Scope

This packet records the operator-requested Coolify deployment repair for Soar. It covers deploy-trigger configuration and the stopped `workers-market-stream` Application only. It does not certify full V1 release readiness.

## Findings

| Finding | Evidence | Status |
| --- | --- | --- |
| Soar project was accessible under the `LuckySparrow` Coolify team. | Coolify project list showed `Soar`; project environment opened successfully. | verified |
| `workers-market-stream` was not running before repair. | Coolify resource list showed `workers-market-stream exited`; runtime logs reported no running container for that service. | verified |
| A long `workers-market-stream` webhook deployment had failed after an extended run. | Deployment `c2m7apqjjncg3wyop6b6fy1c` on commit `ac9a5ea9e7da2e7dd6a5343153bb1b906f094918` started `2026-05-25 04:00:50 UTC`, ended `2026-05-26 16:21:29 UTC`, status `Failed`, source `Webhook`. | verified |
| Push-triggered deployment behavior was disabled. | Advanced settings readback showed `Auto Deploy = off` on all six Soar Applications. | verified |
| The Applications use the official Git App path, not a manual webhook-only setup. | Coolify source settings showed the official Git App for repository `Wroblewski-Patryk/Soar`, branch `main`; Webhooks page said manual webhooks were not needed for the official Git App flow. | verified |

## Mutations Performed

| Surface | Action | Result |
| --- | --- | --- |
| `soar-api` | Enabled `Auto Deploy` and saved. | persisted |
| `soar-web` | Enabled `Auto Deploy` and saved. | persisted |
| `workers-backtest` | Enabled `Auto Deploy` and saved. | persisted |
| `workers-execution` | Enabled `Auto Deploy` and saved. | persisted |
| `workers-market-data` | Enabled `Auto Deploy` and saved. | persisted |
| `workers-market-stream` | Enabled `Auto Deploy`, saved, then triggered one manual recovery deploy. | persisted and recovered |

No secrets, environment variable values, cookies, tokens, passwords, API keys, subscriptions, live trading settings, exchange settings, or external service states were intentionally changed or recorded.

## Recovery Deploy

| Application | Deployment ID | Commit | Started | Ended | Duration | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `workers-market-stream` | `gqpmafky0oe2jr3rszkov2is` | `3fedb7a9170097b40accb6ccea1915064f383f11` | `2026-05-26 16:25:21 UTC` | `2026-05-26 16:30:45 UTC` | `05m 24s` | `Success` |

## Resource Readback After Repair

| Resource | Status |
| --- | --- |
| `soar-api` | running |
| `soar-web` | running |
| `workers-backtest` | running |
| `workers-execution` | running |
| `workers-market-data` | running |
| `workers-market-stream` | running |
| PostgreSQL | running |
| Redis | running |

## Public Smoke Evidence

Command:

```powershell
node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11 --no-workers
```

Result:

| Probe | Result |
| --- | --- |
| API `/health` | PASS, HTTP 200 |
| API `/ready` | PASS, HTTP 200 |
| Web `/` | PASS, HTTP 200 |
| Web `/api/build-info` | PASS, `gitSha=3fedb7a9170097b40accb6ccea1915064f383f11`, `metadataSource=github-branch` |

Direct public readback also confirmed protected worker endpoints return `401` without the required token, so protected worker readiness remains outside this no-secret proof.

## Source Control Caveat

At the time of repair, local `main` was ahead of `origin/main` by `38` commits:

| Ref | SHA |
| --- | --- |
| local `HEAD` | `62e8c4c719d41be8e59cae18e8e09f3b9f775be7` |
| `origin/main` and production build-info | `3fedb7a9170097b40accb6ccea1915064f383f11` |

Coolify can deploy only pushed commits. A later coherent commit/push is still required before the local `HEAD` becomes production.

## Residual Risk

- Full V1 readiness is still not proven by this task because protected worker-token checks, authenticated browser journeys, release-controller signoff, SLO/RC observation, rollback/restore packets, and any LIVE exchange mutation approval remain separate gates.
- Auto Deploy fanout across six Applications is restored by direct operator request. If future deployment fanout causes queue pressure again, disablement must be an explicit recorded release decision with a replacement manual deploy plan.
- The newer single Service Stack migration remains a separate blocked/cutover path and was not attempted here.
