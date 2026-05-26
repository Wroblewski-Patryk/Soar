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

## 2026-05-26 Push-Test And Host Recovery Addendum

After the initial Auto Deploy restoration, commit `6f9ea8d21b1dc6aadf8e34a13be33931b9859f7e` was pushed to `main` to prove the GitHub-to-Coolify trigger path. The webhook path worked: all six Applications received deployment records for the pushed SHA. The fanout then exposed two host-level blockers:

| Blocker | Evidence | Recovery |
| --- | --- | --- |
| VPS root filesystem full | `df -h /` showed `/dev/sdb1` at `100%` with `0` available; Coolify returned Redis `MISCONF`; API `/ready` returned `503`. | Pruned Docker build cache/system artifacts, vacuumed journals, truncated oversized `btmp`; free space recovered to a stable post-run `18G` available / `76%` used. |
| Coolify SSH key directory not writable | Failed deployment log reported `/data/coolify/ssh` was not writable and instructed host repair. | Applied the host permission repair from the Coolify error (`chown`/`chmod`) and restarted Coolify. |

The first push also revealed that API/worker Docker builds could create huge `apps/api/core` files in image layers and waste time/space on recursive ownership changes. Commit `71b8d503fd6fdfd7378dc67b2fa678799e2430f8` fixed this by ignoring/removing core dumps from Docker build context/output and removing redundant recursive worker-image `chown` steps. It was validated locally with:

```powershell
pnpm run quality:guardrails
pnpm run docker:app:config
pnpm run typecheck
```

Final production readback after the host repair and controlled redeploys:

| Resource | Image / SHA | Status |
| --- | --- | --- |
| `soar-api` | `k126p7vqxs5cly2zc4y4g4rq:71b8d503fd6fdfd7378dc67b2fa678799e2430f8` | running |
| `soar-web` | `ato4fqkncd6t38wzlle2m0rv:71b8d503fd6fdfd7378dc67b2fa678799e2430f8` | running |
| `workers-backtest` | `gktawk85w6826z2bs8z123mz:71b8d503fd6fdfd7378dc67b2fa678799e2430f8` | running |
| `workers-execution` | `s2qz86w8c9hc5anajdtl5d8r:71b8d503fd6fdfd7378dc67b2fa678799e2430f8` | running |
| `workers-market-data` | `sj0bh3pirqq1jf41bijaf77y:71b8d503fd6fdfd7378dc67b2fa678799e2430f8` | running |
| `workers-market-stream` | `d2oo1wwy8i55q27e5mdky0i4:71b8d503fd6fdfd7378dc67b2fa678799e2430f8` | running |
| Soar Redis | `redis:7.2` | healthy; recent RDB saves succeeded |
| Soar PostgreSQL | production Postgres container | healthy; recovered after disk pressure |
| Coolify Redis | `redis:7-alpine` | healthy |

Final public no-worker smoke:

```powershell
node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 71b8d503fd6fdfd7378dc67b2fa678799e2430f8 --no-workers
```

Result: API `/health` PASS, API `/ready` PASS, Web `/` PASS, Web `/api/build-info` PASS with `gitSha=71b8d503fd6fdfd7378dc67b2fa678799e2430f8`.

Residual notes:

- Auto Deploy is proven to trigger from GitHub push.
- Full fanout on the current small VPS is still disk-pressure-sensitive; monitor `/` usage before large deploy bursts.
- Protected worker readiness remains token-gated and was not converted into public evidence in this task.
- Production Postgres logs contain repeated duplicate-key messages from runtime execution dedupe. Containers are healthy, but that runtime behavior should be reviewed separately before treating V1 as fully release-ready.
