# LUC-6904 Production Performance And Server Health Watch

- Date: 2026-07-02
- Owner: DRE / Ops Release
- Scope: read-only production performance and server-health watch.
- Disposition: `DONE / VERIFIED_READ_ONLY / PUBLIC_AND_PROTECTED_SMOKE_PASS / ROLLBACK_GUARD_PASS / MARKET_CATALOG_COLD_SAMPLE_WATCH / COOLIFY_QUEUE_WATCH`.

## Boundary

No product code, commit, push, deploy, restart, rollback execution, env edit,
secret/account value readback, DB/Redis mutation, production account mutation,
exchange/payment mutation, order, position, subscription mutation, or
live-trading action occurred.

## Paperclip Context

- Wake payload: `issue_assigned`, no pending comments, fallback fetch not needed.
- Scoped issue: [LUC-6904](/LUC/issues/LUC-6904), status `in_progress`.
- Paperclip readback:
  - `/api/issues/{issueId}/heartbeat-context` -> `200`
  - issue priority: `critical`
  - first-class blockers on [LUC-6904](/LUC/issues/LUC-6904): none before update

## Source Control

- Repo: `C:\Personal\Projekty\Aplikacje\Soar`
- Branch relation before evidence write: `main...origin/main [ahead 22, behind 3]`.
- Worktree: already dirty before this heartbeat from existing lanes.
- Commit/push: not attempted.
- Deploy impact: none.

## Public Deploy Smoke

Command:

```powershell
corepack pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result: `PASS`.

- API `/health` -> `200`
- API `/ready` -> `200`
- Web `/` -> `200`
- Web `/api/build-info` -> `200`

Focused route timings:

| Route | Result |
| --- | --- |
| API `/health` | `200`, `655 ms` |
| API `/ready` | `200`, `44 ms` |
| Web `/` | `200`, `190 ms` |
| Web `/auth/login` | `200`, `102 ms` |
| Web `/api/build-info` | `200`, `59 ms`, SHA `c357d957741f56835f27a1fc3a948dad43a91036`, ref `main`, metadata source `env-runtime` |

## Protected Worker Readiness

First check with the runner's existing `SMOKE_AUTH_TOKEN` failed closed with
`401`; no secret value was printed. A second check used the present
`PROD_UI_AUDIT_AUTH_EMAIL` and `PROD_UI_AUDIT_AUTH_PASSWORD` names to mint a
fresh read-only session through the existing ops auth helper.

Command:

```powershell
$env:SMOKE_AUTH_TOKEN=''
$env:SMOKE_AUTH_EMAIL=$env:PROD_UI_AUDIT_AUTH_EMAIL
$env:SMOKE_AUTH_PASSWORD=$env:PROD_UI_AUDIT_AUTH_PASSWORD
corepack pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result: `PASS`.

- API `/health` -> `200`
- API `/ready` -> `200`
- Web `/` -> `200`
- Web `/api/build-info` -> `200`
- API `/workers/ready` -> `200`

## Rollback Guard

Command:

```powershell
$env:ROLLBACK_GUARD_API_BASE_URL='https://api.soar.luckysparrow.ch'
$env:ROLLBACK_GUARD_AUTH_TOKEN=''
$env:ROLLBACK_GUARD_AUTH_EMAIL=$env:PROD_UI_AUDIT_AUTH_EMAIL
$env:ROLLBACK_GUARD_AUTH_PASSWORD=$env:PROD_UI_AUDIT_AUTH_PASSWORD
corepack pnpm run -s ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch
```

Result: `PASS`.

- checked at: `2026-07-02T14:22:10.898Z`
- `shouldRollback`: `false`
- reasons: `[]`
- workers ready status: `ready`
- topology status: `healthy`
- required worker families: `backtest`, `execution`, `market-data`, `market-stream`
- runtime freshness: `PASS`
- worker/market heartbeat age: `21208 ms`
- runtime signal lag: `0 ms`
- running sessions: `5`
- alerts: `[]`

## Authenticated Dashboard API Timing

Read-only authenticated timing used the same fresh-login ops helper path. Three
requests were sampled per endpoint.

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| `/dashboard/bots` | `200` | 685 | 333 | 252, 63, 685 |
| `/dashboard/wallets` | `200` | 157 | 79 | 27, 54, 157 |
| `/dashboard/markets/catalog` | `200` | 1614 | 578 | 1614, 68, 51 |
| `/dashboard/strategies` | `200` | 31 | 27 | 31, 25, 26 |
| `/dashboard/backtests/runs` | `200` | 46 | 35 | 46, 27, 31 |
| `/dashboard/reports/cross-mode-performance` | `200` | 72 | 68 | 66, 67, 72 |
| `/dashboard/logs` | `200` | 245 | 190 | 162, 162, 245 |
| `/dashboard/profile/subscription` | `200` | 165 | 132 | 165, 96, 134 |
| `/admin/users` | `200` | 98 | 71 | 98, 70, 44 |
| `/admin/subscriptions/plans` | `200` | 206 | 129 | 70, 111, 206 |

Focused market-catalog follow-up, eight requests:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| `/dashboard/markets/catalog` | `200` | 823 | 271 | 823, 239, 139, 293, 175, 148, 183, 165 |

Interpretation: the known market-catalog cold sample repeated once in the
low-second range and normalized in focused follow-up. No persistent dashboard
stall or 60-second-class performance failure reproduced in this window.

## Coolify Read-Only Projection

Sanitized allowlist read-only API probe. No tokens, resource ids, raw URLs, raw
logs, or secret values are stored in this evidence packet.

- `/api/v1/version`: `200`
- `/api/v1/teams/current`: `200`, team `LuckySparrow`
- `/api/v1/projects/{project}`: `200`, project `Soar`
- `/api/v1/projects/{project}/environments`: `200`, `1` row
- `/api/v1/projects/{project}/production`: `200`, `6` applications, `1` PostgreSQL, `1` Redis
- `/api/v1/resources`: `200`, `17` rows
- `/api/v1/deployments`: `200`, `8` rows, `7` queued
- production application statuses:
  - `soar-web`: `running:unknown`
  - `workers-backtest`: `running:unknown`
  - `workers-market-stream`: `running:unknown`
  - `workers-execution`: `running:unknown`
  - `soar-api`: `running:unknown`
  - `workers-market-data`: `running:unknown`
- data services:
  - `postgresql`: `running:healthy`
  - `redis`: `running:healthy`

## Result

Current production health is read-only verified for the sampled window. Public
smoke, protected worker readiness, runtime freshness, rollback guard, and
representative authenticated dashboard API timings passed. No new incident or
repair child is warranted from [LUC-6904](/LUC/issues/LUC-6904).

Residual risks:

- Web build-info still reports `metadataSource=env-runtime`, so release-grade
  build provenance remains a separate source/build gate.
- Coolify application rows still report `running:unknown` and deployment rows
  still include queued items; keep this as a watch item while public/protected
  smoke remains healthy.
- Host-level VPS pressure and log-window proof were not run in this heartbeat;
  they require the approved read-only host-status path.
- The stale `SMOKE_AUTH_TOKEN` path returned `401`; fresh login with the
  approved production audit auth family passed. Security/Ops should rotate or
  rebind stale token aliases if downstream agents still depend on token-only
  auth.

