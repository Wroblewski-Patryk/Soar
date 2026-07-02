# LUC-6369 Production Performance And Server Health Watch - Task Record

## Header

- ID: LUC-6369
- Title: Production performance and server health watch
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Ops/Release
- Depends on: [LUC-6331](/LUC/issues/LUC-6331)
- Priority: P0
- Mission ID: LUC-6369-PRODUCTION-PERFORMANCE-SERVER-HEALTH-WATCH-2026-06-30
- Mission Status: BLOCKED

## Context

[LUC-6369](/LUC/issues/LUC-6369) is the recurring DRE production performance
and server-health watch for Soar. The prior watch
[LUC-6329](/LUC/issues/LUC-6329) found public Web unavailable and protected
worker readiness failing, with incident [LUC-6331](/LUC/issues/LUC-6331)
already created for restoration.

## Goal

Run the smallest read-only production proof that can determine whether Soar has
recovered or remains blocked on the existing restoration incident.

## Scope

- Public API/Web smoke
- Protected workers readiness through approved runner auth resolver
- Runtime freshness
- Rollback guard
- Representative public/authenticated API timing
- Coolify production resource projection
- Evidence and state update

## Constraints

- No deploy, push, restart, rollback execution, env edit, secret/account value
  readback, DB/Redis mutation, raw log capture, production account mutation,
  subscription/payment mutation, exchange mutation, order, position, or
  live-trading action.
- Use canonical production domains.
- Do not create duplicate incident work when the existing restoration incident
  remains open.

## Implementation Plan

1. Read Paperclip heartbeat context and current Soar state.
2. Run read-only production smoke and runtime checks.
3. Run representative timing probes and compare with previous watch residuals.
4. Run redacted Coolify read-only projection.
5. Link or block on the existing incident if the same production regression is
   still present.
6. Record evidence, update source-of-truth state, and close the watch with a
   clear disposition.

## Acceptance Criteria

- Production smoke result recorded.
- Runtime freshness and rollback guard result recorded.
- Timing result recorded with Web and market-catalog interpretation.
- Coolify projection recorded without secret values.
- Existing repair incident reused when the same regression is still present.
- Paperclip issue status reflects the result.

## Definition of Done

- Evidence file exists:
  `history/evidence/luc-6369-production-performance-server-health-watch-2026-06-30.md`.
- Project state summaries reference the current health result.
- Issue [LUC-6369](/LUC/issues/LUC-6369) is blocked by
  [LUC-6331](/LUC/issues/LUC-6331) while production Web and workers readiness
  remain unhealthy.

## Validation Evidence

- Tests:
  - `pnpm run ops:deploy:smoke` -> FAIL: Web `/`, Web `/api/build-info`, and
    protected `/workers/ready` returned `503`.
  - `pnpm run ops:deploy:runtime-freshness` -> PASS.
  - `pnpm run ops:deploy:rollback-guard` -> FAIL with
    `shouldRollback=true`, reason `workers_ready_endpoint_http_503`.
- Manual checks:
  - Direct public probe: API `/health` and `/ready` returned `200`; Web `/`
    and Web `/api/build-info` returned `503`.
  - Coolify read-only projection: `soar-web` and `workers-backtest` are
    `exited:unhealthy`; deployments list has `8` queued rows.
- Reality status: blocked.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: production Web and protected worker readiness are red.
- Smoke steps updated: no.
- Rollback note: rollback guard recommends action; DRE did not execute
  rollback/restart/deploy in this read-only heartbeat.
- Observability or alerting impact: alerts endpoint returned no critical alerts
  through rollback guard.
- Staged rollout or feature flag: not applicable.

## Result Report

Status:
`BLOCKED / WATCH_COMPLETED / PRODUCTION_WEB_DOWN / WORKERS_READY_503 /
RUNTIME_FRESHNESS_PASS / ROLLBACK_GUARD_ACTION_REQUIRED`.

Validation:

- Deploy smoke FAIL: API `/health` and `/ready` returned `200`; Web `/`, Web
  `/api/build-info`, and protected `/workers/ready` returned `503`.
- Runtime freshness PASS with worker/market heartbeat age around `24.1s`,
  runtime signal lag `0 ms`, and `5` running sessions.
- Protected `/workers/ready` FAIL: status `not_ready`, topology `healthy`.
- Rollback guard returned `shouldRollback=true` with reason
  `workers_ready_endpoint_http_503`; no rollback was executed.
- Representative timing showed dashboard API responsive but Web unavailable;
  `/dashboard/markets/catalog` cold sample `1586.9 ms`, then `24.7 ms`.
- Coolify production projection confirmed `soar-web` and `workers-backtest` as
  `exited:unhealthy`.

Follow-up:

- Keep restoration on existing incident [LUC-6331](/LUC/issues/LUC-6331).

Source-control closure:

- Application/repo path: `C:/Personal/Projekty/Aplikacje/Soar`
- Commit: not committed, because this heartbeat produced evidence/state only
  and the shared workspace is pre-existing dirty/divergent.
- Push: not needed.
- Deploy impact: none from this heartbeat.
