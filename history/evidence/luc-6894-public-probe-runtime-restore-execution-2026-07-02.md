# LUC-6894 Public Probe Runtime Restore Execution

Date: 2026-07-02

## Scope

Execution heartbeat for [LUC-6894](/LUC/issues/LUC-6894) after the
issue-thread confirmation was accepted by `local-board`.

Approved mutation scope was limited to the affected Coolify production
applications `soar-web` and `workers-backtest`.

No commit, push, code deploy from the dirty/divergent checkout, env edit,
database/Redis mutation, account mutation, exchange/payment mutation, order,
position, subscription mutation, live-trading action, secret value readback, raw
Coolify object storage, or raw log capture was performed.

## Source / Target

- Repository path: `C:/Personal/Projekty/Aplikacje/Soar`
- Branch state: `main...origin/main` ahead `22`, behind `3`; worktree already
  dirty before this heartbeat.
- Mutation method: Coolify application lifecycle API only.
- Target resources:
  - `soar-web`
  - `workers-backtest`
- Pre-mutation resource state:
  - `soar-web`: `exited:unhealthy`, branch `main`, commit short
    `b894e5dd3061`
  - `workers-backtest`: `exited:unhealthy`, branch `main`, commit field
    `HEAD`
- Rollback path retained:
  Coolify rollback/redeploy to the last known stable compatible app artifact per
  `docs/operations/deployment-rollback-playbook.md`; no rollback was executed.

## Actions

1. Confirmed the accepted request-confirmation interaction for the narrow
   runtime mutation permit.
2. Read Coolify production inventory using the project/environment hierarchy.
3. Queued `restart` for `soar-web` and `workers-backtest`.
4. Observed `workers-backtest` detailed status move to `running:unknown`, while
   `soar-web` remained `exited:unhealthy`.
5. Queued the narrower `start` action for `soar-web` on its existing
   application artifact.
6. Observed `soar-web` detailed status move to `running:unknown`.

## Public Smoke

Command:

```powershell
corepack pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result: `PASS`

- API `/health` -> `200`
- API `/ready` -> `200`
- Web `/` -> `200`
- Web `/api/build-info` -> `200`

Direct public Web build-info readback:

- `gitSha`: `c357d957741f...`
- `gitRef`: `main`
- `metadataSource`: `env-runtime`

## Protected Runtime / Rollback Checks

Protected freshness and rollback guard were attempted only through existing
protected environment variables, without printing values.

Email/password auth path:

- `ops:deploy:runtime-freshness` failed before runtime proof:
  login returned `503 Rate limit temporarily unavailable`.
- `ops:deploy:rollback-guard` failed before runtime proof:
  login returned `503 Rate limit temporarily unavailable`.

Token auth path:

- `ops:deploy:runtime-freshness` failed closed with HTTP `401`.
- `ops:deploy:rollback-guard` returned `shouldRollback=true` because
  `/workers/ready`, `/workers/runtime-freshness`, and `/alerts` each returned
  HTTP `401`.

## Coolify Residual

After Web restoration, public smoke passed, but Coolify project-scoped
inventory endpoints returned HTTP `500` on repeated read-only checks. This
prevented a clean final resource-list projection in the same heartbeat.

## Disposition

`PARTIALLY_DONE / PUBLIC_PROBE_RESTORED / API_HEALTH_READY_PASS /
WEB_ROOT_PASS / WEB_BUILD_INFO_PASS / PROTECTED_RUNTIME_PROOF_BLOCKED_BY_AUTH /
COOLIFY_INVENTORY_500_AFTER_RESTORE`.

The user-visible public Web probe is restored. Full runtime acceptance remains
blocked by protected auth/ops endpoint access and Coolify inventory readback
stability.
