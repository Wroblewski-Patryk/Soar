# Task

## Header
- ID: LUC-6624
- Title: Production performance and server health watch
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: DRE / Ops Release
- Depends on: [LUC-6331](/LUC/issues/LUC-6331)
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001 production runtime health
- Requirement Rows: production deploy smoke, worker readiness, rollback guard
- Quality Scenario Rows: reliability, deployability, observability
- Risk Rows: production Web unavailable, worker readiness unavailable
- Iteration: 2026-07-01 DRE heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-6624-PRODUCTION-PERFORMANCE-SERVER-HEALTH-WATCH-2026-07-01
- Mission Status: BLOCKED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] No loop step was skipped.
- [x] Exactly one priority task was selected.
- [x] Operation mode matches the issue lane.
- [x] The task is aligned with repository source-of-truth documents.
- [x] Deployment and rollback docs were reviewed through the active DRE
  contract and prior same-day watch evidence.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence with current production evidence.

## Context
LUC-6624 is a DRE-scoped production performance and server health watch. The
wake payload had no pending comments and did not require a thread refetch.
Prior same-day evidence already pointed to API healthy, Web unavailable,
protected worker readiness unavailable, and unhealthy Coolify resources. This
heartbeat reran bounded read-only checks.

## Goal
Verify the current Soar production runtime and deploy health posture without
mutating production and leave a clear disposition for the release path.

## Constraints
- Use read-only checks only.
- Do not deploy, push, restart, roll back, edit env, read secret values,
  mutate DB/Redis, mutate production accounts, mutate exchange/payment state,
  create orders/positions, change subscriptions, or perform live-trading
  action.
- Do not commit or push from the dirty/divergent worktree.
- Do not store secret values, tokens, raw logs, or private account data.

## Definition of Done
- [x] Public production deploy smoke rerun.
- [x] Protected deploy smoke / worker readiness rerun.
- [x] Runtime freshness checked with process-local protected binding.
- [x] Rollback guard checked with process-local protected binding.
- [x] Coolify production projection checked through read-only endpoints.
- [x] Evidence and state updated.
- [x] Issue has a clear final disposition.

## Forbidden
- Production mutation outside approved owner path.
- Secret value readback or storage.
- Commit/push/deploy from dirty divergent source state.
- Workaround paths or bypasses.

## Validation Evidence
- `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` -> `FAIL`; API `/health` and `/ready` returned `200`, Web `/` and `/api/build-info` returned `503`.
- `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` -> `FAIL`; API `/health` and `/ready` returned `200`, Web `/` and `/api/build-info` returned `503`, `/workers/ready` returned `503`.
- Runtime freshness with `DEPLOY_FRESHNESS_*` mapped from existing `SMOKE_AUTH_*` names -> `PASS`; worker/market age `29076 ms`, runtime signal lag `0 ms`, running sessions `5`, stale sessions `0`.
- Rollback guard with `ROLLBACK_GUARD_*` mapped from existing `SMOKE_AUTH_*` names -> `FAIL`, `shouldRollback=true`, reason `workers_ready_endpoint_http_503`.
- Coolify read-only projection -> endpoints `200`; `soar-web` and `workers-backtest` `exited:unhealthy`; PostgreSQL/Redis `running:healthy`; deployments endpoint has `8` queued rows.
- Source-control state inspected: branch `main`, HEAD `6aeb8b8b8c4e90b99d3837189200e0667fdabf1c`, branch `ahead 22, behind 3`, shared worktree dirty before this heartbeat.
- Screenshots/logs: none; no raw production logs captured.
- High-risk checks: no protected production mutation occurred.
- Module confidence ledger updated: yes.
- Requirements matrix updated: no; existing production health rows remain blocked.
- Quality scenarios updated: no; existing reliability/deployability scenario remains blocked.
- Risk rows changed: no new risk; existing production Web/worker readiness risk remains active.
- Reality status: blocked.

## Deployment / Ops Evidence
- Deploy impact: none from this heartbeat.
- Env or secret changes: none.
- Health-check impact: API healthy, Web and protected workers unhealthy.
- Smoke steps updated: no; existing smoke commands remain valid.
- Rollback note: rollback guard says `shouldRollback=true`, but rollback was not executed because production mutation is gated to the approved Ops/Coolify owner path.
- Observability or alerting impact: no change.
- Staged rollout or feature flag: not applicable.

## Result Report
Current disposition:
`BLOCKED / API_HEALTH_READY_PASS / PRODUCTION_WEB_503 /
WORKERS_READY_503 / SOAR_WEB_EXITED_UNHEALTHY /
WORKERS_BACKTEST_EXITED_UNHEALTHY / RUNTIME_FRESHNESS_PASS /
ROLLBACK_GUARD_ACTION_REQUIRED`.

Next owner/action:
Ops Release Lead / board-approved Coolify mutation owner continues
[LUC-6331](/LUC/issues/LUC-6331), inspects queued deployments and unhealthy
`soar-web` / `workers-backtest`, then performs approved restart/redeploy or
rollback. DRE/QVE rerun production smoke and acceptance after restoration.
