# LUC-119 - LUC-98 Release Permit Evidence Closure (2026-05-26)

## Scope
Ops Release heartbeat for `LUC-98` blocker evidence closure using allowed operations only (`read/restart/read`) on `workers-market-stream`.

## Commands
1. `corepack pnpm run ops:operator-unblock:check -- --packet history/artifacts/v1-operator-unblock-packet-3fedb7a9-2026-05-26.json --json`
2. Coolify API `GET /api/v1/applications` (pre-state)
3. Coolify API `POST /api/v1/applications/d2oo1wwy8i55q27e5mdky0i4/restart`
4. Coolify API `GET /api/v1/applications` x6 (10s poll cadence, 60s total)

## Results
- Operator unblock packet check: `PASS`.
- Pre-state for `workers-market-stream` (`d2oo1wwy8i55q27e5mdky0i4`):
  - `status=exited:unhealthy`
  - `health_check_enabled=false`
  - `last_restart_at=null`
- Restart request response:
  - `message=Deployment already queued for this commit.`
- Post-action polling (`6/6` checks):
  - `status` remained `exited:unhealthy` on all checks.
  - no `last_restart_at` transition observed.

## Disposition
`blocked`

## Blocker
- `workers-market-stream` recovery did not complete after permitted restart path.
- Temp-domain parallel-stack acceptance packet for expected SHA `3fedb7a9170097b40accb6ccea1915064f383f11` remains missing for release permit closure.

## Unblock Owner/Action
- Owner: Ops Release Lead + Coolify operator + local-board release controller.
- Action:
  1. clear deployment queue and crash-loop cause for `workers-market-stream`,
  2. attach recovery proof showing healthy worker state,
  3. publish temp-domain acceptance packet (temp API/Web smoke, expected-SHA build-info, worker readiness, rollback note).
