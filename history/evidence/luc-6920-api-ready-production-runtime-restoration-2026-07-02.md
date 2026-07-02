# LUC-6920 API Ready Production Runtime Restoration

Date: 2026-07-02
Owner: DRE / Ops Release
Disposition: `DONE / PUBLIC_API_READY_RESTORED / PROTECTED_WORKERS_READY_PASS / ROLLBACK_GUARD_PASS / PROJECT_TRUTH_INDEX_REFRESHED / NO_PRODUCTION_MUTATION`

## Scope

Read-only production diagnosis for [LUC-6920](/LUC/issues/LUC-6920), which was
created from a stale project-truth/runtime-error index row reporting
`https://api.soar.luckysparrow.ch/ready -> 503`.

No product code, commit, push, deploy, restart, rollback execution, env edit,
secret/account value readback, DB/Redis mutation, production account mutation,
exchange/payment mutation, order, position, subscription mutation, or
live-trading action occurred.

## Source Control

- Repo: `C:\Personal\Projekty\Aplikacje\Soar`
- Branch: `main`
- Local HEAD: `6aeb8b8b`
- Relation: `HEAD...origin/main` was `22` ahead and `3` behind before this
  evidence write.
- Worktree: already dirty before this heartbeat; this heartbeat changed only
  scoped truth/evidence/task/context files.
- Commit/push: not attempted.
- Deploy impact: none.

## Public Smoke

Command:

```powershell
corepack pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result: `PASS`.

- API `/health` -> `200`
- API `/ready` -> `200`
- Web `/` -> `200`
- Web `/api/build-info` -> `200`

Focused manual readback:

| Route | Status | Timing | Body class |
| --- | ---: | ---: | --- |
| `https://api.soar.luckysparrow.ch/health` | 200 | 853 ms | health response |
| `https://api.soar.luckysparrow.ch/ready` | 200 | 121 ms | `{"status":"ready","service":"api"}` |
| `https://soar.luckysparrow.ch/` | 200 | 853 ms | web root |
| `https://soar.luckysparrow.ch/api/build-info` | 200 | 106 ms | SHA `c357d957741f56835f27a1fc3a948dad43a91036`, ref `main`, metadata source `env-runtime` |

## Protected Worker Readiness

Approved production audit auth family names were present in the runner. Values
were not printed or persisted.

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

- checked at: `2026-07-02T15:19:04.175Z`
- `shouldRollback`: `false`
- reasons: `[]`
- workers ready status: `ready`
- topology status: `healthy`
- required worker families: `backtest`, `execution`, `market-data`, `market-stream`
- runtime freshness: `PASS`
- worker/market heartbeat age: `4194 ms`
- runtime signal lag: `0 ms`
- running sessions: `5`
- alerts: `[]`

## Diagnosis

The indexed `api_ready -> 503` finding is stale. Fresh public and protected
runtime probes show the production API, Web root, Web build-info, workers
readiness, runtime freshness, and rollback guard are healthy in the sampled
window.

Project truth files refreshed in this heartbeat:

- `docs/status/runtime-error-index.json`
- `docs/status/runtime-error-index.md`
- `docs/status/operational-readiness-index.json`
- `docs/status/operational-readiness-index.md`
- `docs/status/project-truth-index.json`
- `docs/status/project-truth-index.md`

## Residual Risk

- Web build-info still reports `metadataSource=env-runtime`; release-grade
  build provenance remains a separate source/build gate.
- Host-level VPS pressure and raw log-window proof were not run in this
  heartbeat.
- The repository remains dirty/divergent from pre-existing work; no
  source-control closure was attempted for this read-only runtime restoration
  heartbeat.
