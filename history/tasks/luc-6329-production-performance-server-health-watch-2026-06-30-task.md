# LUC-6329 Production Performance And Server Health Watch - Task Record

## Context

[LUC-6329](/LUC/issues/LUC-6329) is the recurring DRE production performance
and server-health watch for Soar.

The prior same-day DRE watch [LUC-6290](/LUC/issues/LUC-6290) was healthy for
public/protected smoke, runtime freshness, and rollback guard, while keeping
market-catalog cold-sample, Coolify queued rows, host-level proof, and build
provenance as residual watch items.

## Goal

Run the smallest read-only production proof that can determine whether Soar is
currently healthy or needs a narrow incident/repair lane.

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
- Do not create duplicate work for already-known residual gates unless this
  heartbeat finds a new regression.

## Implementation Plan

1. Read Paperclip heartbeat context and current Soar state.
2. Run read-only production smoke and runtime checks.
3. Run representative timing probes and compare with previous watch residuals.
4. Run redacted Coolify read-only projection.
5. Create one narrow incident/repair child if a new regression is confirmed.
6. Record evidence, update source-of-truth state, and close the watch with a
   clear disposition.

## Acceptance Criteria

- Production smoke result recorded.
- Runtime freshness and rollback guard result recorded.
- Timing result recorded with Web and market-catalog interpretation.
- Coolify projection recorded without secret values.
- New repair child created only if a new regression is found.
- Paperclip issue status reflects the result.

## Definition Of Done

- Evidence file exists:
  `history/evidence/luc-6329-production-performance-server-health-watch-2026-06-30.md`.
- Project state summaries reference the current health result.
- Incident/repair child exists when production is not healthy.
- Paperclip issue [LUC-6329](/LUC/issues/LUC-6329) is marked `done` when the
  read-only watch completes and the next owner path is explicit.

## Result Report

Status:
`DONE / WATCH_COMPLETED / PRODUCTION_WEB_DOWN / BACKTEST_WORKER_NOT_READY /
RUNTIME_FRESHNESS_PASS / ROLLBACK_GUARD_ACTION_REQUIRED`.

Validation:

- Deploy smoke FAIL: API `/health` and `/ready` returned `200`; Web `/`, Web
  `/api/build-info`, and protected `/workers/ready` returned `503`.
- Focused Web retry confirmed stable `503 no available server`.
- Runtime freshness PASS with worker/market heartbeat age around `2.1s`,
  runtime signal lag `0 ms`, and `5` running sessions.
- Protected `/workers/ready` FAIL: status `not_ready`, topology `healthy`,
  backtest heartbeat missing, other worker families fresh.
- Rollback guard returned `shouldRollback=true` with reason
  `workers_ready_endpoint_http_503`; no rollback was executed.
- Representative timing showed dashboard API responsive but Web unavailable;
  `/dashboard/markets/catalog` cold sample `1612.4 ms`, then `33.5 ms`.
- Coolify production projection PASS for read-only access and confirmed
  `soar-web` and `workers-backtest` as `exited:unhealthy`.

Follow-up:

- Created [LUC-6331](/LUC/issues/LUC-6331) as the critical incident/repair child
  for restoring production Web and backtest worker health.

Source-control closure:

- Application/repo path: `C:/Personal/Projekty/Aplikacje/Soar`
- Commit: not committed, because this heartbeat produced evidence/state only
  and the shared workspace is pre-existing dirty/divergent.
- Push: not needed.
- Deploy impact: none from this heartbeat.
