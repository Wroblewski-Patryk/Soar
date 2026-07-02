# LUC-6850 Production Performance And Server Health Watch Task

## Context

[LUC-6850](/LUC/issues/LUC-6850) is a recurring DRE routine execution for Soar
production performance and server health. The wake payload was
`issue_assigned`, had no pending comments, and did not require fallback thread
fetch. The issue was already checked out by the harness for this run.

## Goal

Run the smallest read-only production watch that proves whether Soar production
is healthy, slow, or blocked, then leave a clear Paperclip disposition.

## Constraints

- Read-only production checks only.
- No deploy, restart, rollback execution, env edit, secret/account value
  readback, DB/Redis mutation, production account mutation, exchange/payment
  mutation, order, position, subscription mutation, or live-trading action.
- Use existing protected smoke bindings only by process-local mapping; do not
  print or store secret values.
- Do not create a duplicate incident when an existing owner path already covers
  the failure.

## Stage

`verification` -> expected output: current production smoke, runtime freshness,
rollback guard, timing, Coolify read-only projection, evidence packet, and final
issue disposition.

## Implementation Plan

1. Read scoped Paperclip heartbeat context and issue state.
2. Run public and protected production deploy smoke.
3. Run runtime freshness and rollback guard with process-local protected auth
   mapping.
4. Capture representative HTTP timing.
5. Capture sanitized Coolify read-only production projection.
6. Update local evidence/state and block [LUC-6850](/LUC/issues/LUC-6850) on
   existing restoration issue [LUC-6331](/LUC/issues/LUC-6331).

## Acceptance Criteria

- API `/health` and `/ready` result captured.
- Web `/`, `/auth/login`, and `/api/build-info` timing/status captured.
- Protected `/workers/ready` result captured without exposing secret values.
- Runtime freshness and rollback guard result captured.
- Coolify production resource status summarized without raw secrets/ids/logs.
- Existing incident/repair path reused if applicable.

## Definition Of Done

- Evidence exists in
  `history/evidence/luc-6850-production-performance-server-health-watch-2026-07-02.md`.
- Source-control closure is recorded.
- Paperclip issue has final disposition with blocker or closure.
- No production mutation occurred.

## Result Report

- Disposition: `BLOCKED / API_HEALTH_READY_PASS / PRODUCTION_WEB_503 / WORKERS_READY_503 / SOAR_WEB_EXITED_UNHEALTHY / WORKERS_BACKTEST_EXITED_UNHEALTHY / RUNTIME_FRESHNESS_PASS / ROLLBACK_GUARD_ACTION_REQUIRED`.
- Public smoke failed: API `/health` and `/ready` passed; Web `/` and
  `/api/build-info` returned `503`.
- Protected smoke failed: API `/workers/ready` returned `503`.
- Runtime freshness passed with worker/market heartbeat age `1487 ms`,
  runtime signal lag `0 ms`, `5` running sessions, and no stale session ids.
- Rollback guard returned `shouldRollback=true` for
  `workers_ready_endpoint_http_503`; rollback was not executed.
- Timing samples were sub-second but failing where Web returned `503`.
- Coolify read-only projection showed `soar-web` and `workers-backtest` as
  `exited:unhealthy`, PostgreSQL/Redis as `running:healthy`, and `8` queued
  deployment rows.
- Source control: no commit or push; repo was already dirty/divergent
  (`main...origin/main` ahead `22`, behind `3`). This run added only DRE
  evidence/task/state notes.
- Deploy impact: none.
- Next owner/action: Ops Release Lead / board-approved Coolify mutation owner
  continues [LUC-6331](/LUC/issues/LUC-6331); DRE/QVE rerun production smoke,
  rollback guard, and authenticated acceptance after restoration.

## Forbidden

- Do not deploy, restart, rollback, mutate env, read or print secrets, mutate
  DB/Redis, mutate production accounts, mutate exchange/payment state, place
  orders, open positions, or perform live-trading actions from this task.
