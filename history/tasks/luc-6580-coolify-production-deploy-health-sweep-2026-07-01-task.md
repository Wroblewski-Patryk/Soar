# Task

## Header
- ID: LUC-6580
- Title: Coolify Production Deploy Health Sweep
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Ops/Release
- Depends on: [LUC-6331](/LUC/issues/LUC-6331)
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001 production runtime health
- Requirement Rows: production deploy smoke, worker readiness, rollback guard
- Quality Scenario Rows: reliability, deployability, observability
- Risk Rows: production Web unavailable, worker readiness unavailable
- Iteration: 2026-07-01 DRE heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-6580-COOLIFY-PRODUCTION-DEPLOY-HEALTH-SWEEP-2026-07-01
- Mission Status: BLOCKED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the issue lane.
- [x] The task is aligned with repository source-of-truth documents.
- [x] Deployment and rollback docs were reviewed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence with current production evidence.

## Context
LUC-6580 is a DRE-scoped production deploy health sweep. The wake payload had
no pending comments and did not require a thread refetch. Prior same-day
evidence already pointed to API healthy, Web unavailable, protected worker
readiness unavailable, and unhealthy Coolify resources. This heartbeat reran
the bounded read-only checks.

## Goal
Verify the current Soar production deploy health posture without mutating
production and leave a clear disposition for the release path.

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
- Tests:
  - `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` -> `FAIL`; API `200`, Web `503`.
  - `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` -> `FAIL`; API `200`, Web `503`, workers ready `503`.
  - runtime freshness with `DEPLOY_FRESHNESS_*` mapped from existing `SMOKE_AUTH_*` names -> `PASS`.
  - rollback guard with `ROLLBACK_GUARD_*` mapped from existing `SMOKE_AUTH_*` names -> `FAIL`, `shouldRollback=true`, reason `workers_ready_endpoint_http_503`.
  - Coolify read-only projection -> API endpoints `200`; `soar-web` and `workers-backtest` `exited:unhealthy`; Postgres/Redis `running:healthy`; deployments endpoint has `8` queued rows.
- Recheck:
  - 2026-07-01 second DRE heartbeat reran the same bounded read-only checks.
  - public deploy smoke still failed on Web `503` while API health/readiness passed.
  - protected deploy smoke still failed on Web `503` and `/workers/ready -> 503`.
  - runtime freshness still passed; rollback guard still returned `shouldRollback=true` for `workers_ready_endpoint_http_503`.
  - Coolify read-only projection still shows `soar-web` and `workers-backtest` as `exited:unhealthy`, PostgreSQL/Redis `running:healthy`, and `8` queued deployments.
  - Paperclip final `PATCH` to `blocked` aborted after `20s`; `/api/health`
    also aborted after `8s` from this runner, so board mutation is unconfirmed.
- Manual checks: source-control state inspected; branch is `main`, HEAD `6aeb8b8b8c4e90b99d3837189200e0667fdabf1c`, branch is ahead `22` and behind `3`.
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

Control-plane caveat:
Paperclip issue mutation to `blocked` was attempted but could not be confirmed
because PATCH and health/readback calls timed out from this runner. On
control-plane recovery, apply this same blocked disposition if it did not land.
