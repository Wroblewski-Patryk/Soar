# Task

## Header
- ID: LUC-6757
- Title: Production performance and server health watch
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Ops/Release
- Depends on: [LUC-6331](/LUC/issues/LUC-6331)
- Priority: P0
- Module Confidence Rows: production operations, deploy smoke, worker readiness
- Requirement Rows: production deploy health, authenticated acceptance readiness
- Quality Scenario Rows: reliability, operability, performance
- Risk Rows: production Web and worker readiness risk
- Iteration: routine heartbeat
- Operation Mode: TESTER
- Mission ID: `LUC-6757-PRODUCTION-PERFORMANCE-SERVER-HEALTH-WATCH-2026-07-02`
- Mission Status: BLOCKED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches this verification/watch task.
- [x] The task is aligned with repository source-of-truth documents.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence with current production evidence.

## Mission Block
- Mission objective: Rerun read-only Soar production performance and server-health watch.
- Release objective advanced: keep V1 release blocked or cleared based on live production evidence.
- Included slices: public deploy smoke, protected worker readiness, runtime freshness, rollback guard, representative timing, sanitized Coolify projection.
- Explicit exclusions: deploy, push, restart, rollback execution, env edit, secret/account value readback, DB/Redis mutation, production account mutation, exchange/payment/trading mutation.
- Checkpoint cadence: one heartbeat.
- Stop conditions: healthy proof recorded, or current blocker and next owner recorded.
- Handoff expectation: Ops Release Lead / approved Coolify mutation owner continues the existing restoration issue.

## Context
Recurring read-only production health watch for Soar. Recent evidence already
showed API health/readiness green while Web and worker readiness were red; this
heartbeat rechecked the live state and avoided duplicate repair issue creation.

## Goal
Prove the current production health state and leave a durable Paperclip
disposition with next owner.

## Constraints
- use existing smoke/runtime/rollback scripts
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate existing [LUC-6331](/LUC/issues/LUC-6331) restoration path
- stay within verification stage

## Definition of Done
- [x] production public health smoke run
- [x] protected worker/runtime proof attempted with approved env bindings
- [x] Coolify read-only projection captured without stored secret values
- [x] source-of-truth status updated
- [x] Paperclip issue updated to final disposition

## Forbidden
- new systems without approval
- duplicated repair issue for the same production failure
- temporary bypasses
- architecture changes
- implicit stage skipping

## Validation Evidence
- `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` -> `FAIL`, API `200`, Web `503`.
- `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` -> `FAIL`, API `200`, Web `503`, workers ready `503`.
- `pnpm run -s ops:deploy:runtime-freshness` with process-local auth mapping -> `PASS`.
- `pnpm run -s ops:deploy:rollback-guard` with process-local auth mapping -> `FAIL`, `shouldRollback=true`.
- `curl.exe` representative timing for API/Web/workers routes.
- Sanitized Coolify read-only projection.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: production Web and protected worker readiness fail.
- Smoke steps updated: no.
- Rollback note: rollback guard requests action, but no rollback was executed.
- Observability or alerting impact: alerts endpoint returned no rollback-critical alerts inside rollback guard.

## Review Checklist
- [x] Current stage declared and respected.
- [x] Deliverable complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems reused.
- [x] No workaround paths introduced.
- [x] No logic duplication introduced.
- [x] Definition of Done evidence attached.
- [x] Relevant validations run.
- [x] Docs/context updated.

## Result Report

- Task summary: Read-only production watch rerun; release remains blocked.
- Files changed: evidence/task/state docs only.
- How tested: production smoke, timing, runtime freshness, rollback guard, Coolify projection.
- What is incomplete: production Web and backtest worker restoration.
- Next steps: Ops Release Lead / approved mutation owner resolves [LUC-6331](/LUC/issues/LUC-6331), then DRE/QVE rerun smoke and acceptance.
- Decisions made: no duplicate repair child; block current watch on existing restoration path.
