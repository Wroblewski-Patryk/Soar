# Task

## Header
- ID: LUC-6824
- Title: Production Performance And Server Health Watch
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Ops/Release
- Depends on: [LUC-6331](/LUC/issues/LUC-6331)
- Priority: P0
- Module Confidence Rows: production web, API health, protected worker readiness, runtime freshness
- Requirement Rows: release smoke, production readiness, rollback guard
- Quality Scenario Rows: reliability, availability, performance
- Risk Rows: production Web unavailable, worker readiness unavailable, rollback action required
- Iteration: 2026-07-02 DRE heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-6824-PRODUCTION-PERFORMANCE-SERVER-HEALTH-WATCH-2026-07-02
- Mission Status: BLOCKED

## Context
This is a recurring Soar production-performance and server-health watch. Recent
DRE watches have found a stable blocker: API and runtime freshness are healthy,
while Web and protected worker readiness fail with `503`.

## Goal
Collect fresh read-only production evidence for [LUC-6824](/LUC/issues/LUC-6824)
and route the issue to a clear Paperclip disposition.

## Constraints
- Read-only production checks only.
- Do not deploy, push, restart, rollback, edit env, mutate DB/Redis, read secret
  values, mutate accounts, exchange/payment state, orders, positions,
  subscriptions, or live-trading state.
- Store only sanitized operational metadata.
- Preserve existing dirty worktree changes from other lanes.

## Definition of Done
- Fresh API/Web/worker readiness evidence captured.
- Runtime freshness and rollback guard result recorded.
- Sanitized Coolify projection recorded without secret values.
- Source control and deploy impact recorded.
- Existing unblock owner/action named.
- Paperclip issue receives a clear final disposition.

## Forbidden
- Product code changes.
- Production mutation.
- Raw secret, raw token, raw log, or raw Coolify object persistence.
- Duplicate repair issue when the existing [LUC-6331](/LUC/issues/LUC-6331)
  owner path remains authoritative.

## Validation Evidence
- `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` -> FAIL on Web `503`; API `/health` and `/ready` pass.
- `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` -> FAIL on Web `503` and workers `503`; API `/health` and `/ready` pass.
- `pnpm run -s ops:deploy:runtime-freshness` -> PASS; worker/market heartbeat age `11201 ms`, runtime signal lag `0 ms`, running sessions `5`.
- `pnpm run -s ops:deploy:rollback-guard` -> FAIL with `shouldRollback=true`, reason `workers_ready_endpoint_http_503`.
- Representative HTTP timing sample -> API sub-second, Web `503` sub-second, unauthenticated workers ready `401` sub-second.
- Sanitized Coolify read-only projection -> `soar-web` and `workers-backtest` are `exited:unhealthy`; PostgreSQL/Redis are `running:healthy`; deployments show `8` queued rows.

## Source Control
- Repo: `C:\Personal\Projekty\Aplikacje\Soar`
- Branch: `main`
- HEAD: `6aeb8b8b8c4e90b99d3837189200e0667fdabf1c`
- Relation: `main...origin/main` is `[ahead 22, behind 3]`.
- Worktree: already dirty before this heartbeat.
- Commit: not created.
- Push: not attempted.
- Deploy impact: none.

## Result Report
- Task summary: production remains blocked; API health/ready and runtime
  freshness pass, Web and protected workers fail with `503`, Coolify shows
  `soar-web` and `workers-backtest` unhealthy with queued deployments.
- Files changed:
  - `history/evidence/luc-6824-production-performance-server-health-watch-2026-07-02.md`
  - `history/tasks/luc-6824-production-performance-server-health-watch-2026-07-02-task.md`
  - `.agents/state/system-health.md`
  - `.agents/state/active-mission.md`
  - `.codex/context/TASK_BOARD.md`
- What is incomplete: production restoration.
- Next steps: [LUC-6331](/LUC/issues/LUC-6331) Ops mutation owner restores or
  rolls back; DRE/QVE rerun production acceptance after restoration.
- Decisions made: no new duplicate repair issue; existing
  [LUC-6331](/LUC/issues/LUC-6331) remains authoritative.
