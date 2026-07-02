# Task

## Header
- ID: LUC-6548
- Title: Soar Production Performance And Server Health Watch
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: 11 SPM / Ops coordination
- Depends on: [LUC-6331](/LUC/issues/LUC-6331)
- Priority: P0
- Module Confidence Rows: production runtime health / worker readiness / Coolify production topology
- Requirement Rows: production deploy smoke, protected worker readiness, runtime freshness, rollback guard
- Quality Scenario Rows: reliability, availability, observability, production readiness
- Risk Rows: production Web unavailable, backtest worker unhealthy, protected auth bindings absent in runner
- Iteration: 2026-07-01 Paperclip heartbeat
- Operation Mode: BUILDER
- Mission ID: `LUC-6548-PRODUCTION-PERFORMANCE-SERVER-HEALTH-WATCH-2026-07-01`
- Mission Status: BLOCKED

## Context

[LUC-6548](/LUC/issues/LUC-6548) is the current recurring Soar production
performance and server-health watch. The wake comment
`softwarehouse-local-repair-lane-starter:v1` selected a local
repair/source-control lane: inspect the repo, run relevant read-only checks,
persist evidence, and close with a commit/no-commit decision. The issue forbids
push, deploy, production restart, protected smoke/live account mutation, and
secret disclosure until protected gate evidence exists.

## Goal

Refresh read-only production health evidence and give [LUC-6548](/LUC/issues/LUC-6548)
a clear disposition with source-control closure.

## Scope

- Production API/Web smoke against `https://api.soar.luckysparrow.ch` and
  `https://soar.luckysparrow.ch`.
- Protected runtime endpoints only through available runner bindings; no secret
  values printed.
- Coolify read-only inventory using configured binding names only.
- Local evidence/task/state updates.

## Implementation Plan

1. Read wake payload and heartbeat context.
2. Inspect Soar worktree state and recent production-watch evidence.
3. Run read-only production deploy smoke, runtime freshness, rollback guard,
   direct timing probes, and Coolify inventory projection.
4. Persist evidence and state updates.
5. Update Paperclip issue with blocked disposition and source-control closure.

## Acceptance Criteria

- Current production smoke result is recorded.
- Protected runtime/rollback guard result or credential-binding blocker is
  recorded.
- Coolify read-only resource projection is recorded.
- Source-control closure decision is recorded.
- The issue disposition names the unblock owner/action.

## Definition of Done

- [x] Current production deploy smoke captured.
- [x] Runtime freshness / protected endpoint blocker captured.
- [x] Rollback guard result captured.
- [x] Coolify read-only production projection captured.
- [x] Evidence and task notes written.
- [x] State/context notes updated.
- [x] Paperclip disposition attempted with evidence.

## Forbidden

- Push, deploy, restart, rollback execution, protected smoke/live account
  mutation, secret disclosure, DB/Redis mutation, exchange/payment mutation,
  subscription mutation, order, position, or live-trading action.

## Validation Evidence

- `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` -> FAIL: API `/health` and `/ready` passed; Web `/`, Web `/api/build-info`, and API `/workers/ready` failed.
- `pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch` -> FAIL: protected runtime freshness returned HTTP `401` because current runner has no `SMOKE_*` auth bindings.
- `pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` -> FAIL: `shouldRollback=true` with protected endpoint `401` reasons.
- Node direct timing probe -> API `/health` and `/ready` `200`; Web `/`, `/auth/login`, and `/api/build-info` `503`; unauthenticated `/workers/ready` `401`.
- Coolify read-only projection -> `soar-web` and `workers-backtest` `exited:unhealthy`; Postgres/Redis `running:healthy`.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: production Web remains unavailable; API health/ready remain up.
- Smoke steps updated: no.
- Rollback note: rollback guard recommends action, but no rollback was executed.
- Observability or alerting impact: Coolify read-only projection confirms unhealthy Web/backtest worker resources.
- Staged rollout or feature flag: not applicable.

## Result Report

- Task summary: refreshed read-only production watch and confirmed current production block.
- Files changed: this task file, matching evidence file, and state/context append notes.
- How tested: deploy smoke, runtime freshness, rollback guard, direct timing sample, Coolify read-only projection.
- What is incomplete: production Web/backtest-worker restoration and protected auth binding availability in this runner.
- Next steps: Ops Release Lead / board-approved Coolify mutation owner resolves [LUC-6331](/LUC/issues/LUC-6331), then DRE/QVE rerun production watch and acceptance.
- Decisions made: [LUC-6548](/LUC/issues/LUC-6548) should be blocked, not done.
- Commit/no-commit decision: not committed because the repository was already heavily dirty with unrelated product, docs, evidence, generated architecture, and agent-state lanes before this heartbeat; push/deploy were forbidden and not needed.
