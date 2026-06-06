# Task

## Header
- ID: LUC-2499
- Title: Coolify production deploy health sweep
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: none for read-only public/Coolify checks; production mutation
  remains approval-gated.
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001
- Requirement Rows: not changed
- Quality Scenario Rows: operations reliability / deployment health
- Risk Rows: production deploy mismatch, protected proof unavailable
- Iteration: 2026-06-06
- Operation Mode: TESTER
- Mission ID: LUC-2499-COOLIFY-PRODUCTION-DEPLOY-HEALTH-SWEEP-2026-06-06
- Mission Status: PARTIALLY_VERIFIED

## Context

Paperclip woke DRE for [LUC-2499](/LUC/issues/LUC-2499) after a prior adapter
run failed with an `EBUSY` copy of Codex auth state and left no issue comment.
The issue objective required read-only production deploy health evidence and
explicit separation between failed-deploy diagnosis and any redeploy, restart,
rollback, or protected-smoke approval.

## Goal

Verify current public production health, Coolify project/environment/resource
projection, logs, source/build-info freshness, and rollback posture without
exposing credentials or mutating production.

## Scope

- Public routes: API `/health`, API `/ready`, API `/workers/ready`
  unauthenticated, Web `/`, Web `/api/build-info`.
- Coolify read-only scope: current selector, Soar project, production
  environment, application/data resource projection, Web/API app metadata, and
  Web/API log summaries.
- Evidence files:
  `history/evidence/luc-2499-coolify-production-deploy-health-sweep-2026-06-06.md`.
- Paperclip issue disposition and child diagnosis lane.

## Implementation Plan

1. Consume wake payload and heartbeat context; do not repeat checkout because
   the harness already claimed it.
2. Run public no-workers deploy smoke against expected pushed SHA.
3. Run direct Node status probes for public endpoints.
4. Run Coolify stack env checker regression tests.
5. Query Coolify read-only project/environment/resource/app/log endpoints.
6. Record evidence and update project state.
7. Create a separate read-only child lane for deeper Web deploy-history/log
   correlation; keep mutation fail-closed.

## Acceptance Criteria

- Public API/Web health and build-info status recorded.
- Coolify project/environment/resource topology recorded without secret values.
- Logs summarized without secret values.
- Any production mutation need is separated into an approval-gated path.
- Issue receives a final Paperclip disposition.

## Definition of Done

- [x] Evidence is recorded.
- [x] No production mutation occurred.
- [x] Residual risks and next owner/action are explicit.
- [x] Relevant state files are updated.

## Validation Evidence

- Tests:
  - `pnpm run ops:coolify-stack:env-check:test` -> PASS, `8/8`.
- Manual checks:
  - `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 56d8d440bfe0fd9ee692e9f669e35414d85d2493 --no-workers` -> PASS.
  - Node public probes -> API `/health` `200`, API `/ready` `200`, Web `/`
    `200`, Web `/api/build-info` `200`, unauthenticated `/workers/ready`
    `401`.
  - Coolify read-only projection -> selector `LuckySparrow`, project `Soar`,
    environment `production`, six applications, PostgreSQL, Redis, zero generic
    services, `17` global resource rows.
- Screenshots/logs:
  - Web/API logs summarized in
    `history/evidence/luc-2499-coolify-production-deploy-health-sweep-2026-06-06.md`.
- High-risk checks:
  - No deploy, restart, rollback, env edit, DB/Redis mutation, account change,
    protected smoke, exchange action, or live-trading action occurred.
- Module confidence ledger updated: yes.
- Requirements matrix updated: not applicable.
- Quality scenarios updated: not applicable.
- Risk register updated: not applicable.
- Reality status: partially verified.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: no rollback trigger from public health; Web metadata/log
  mismatch requires read-only child diagnosis before any mutation request.
- Observability or alerting impact: Web log mismatch noted.
- Staged rollout or feature flag: not applicable.

## Forbidden

- Deploy, restart, rollback, or clear queues without explicit approval.
- Protected smoke without approved principal.
- Secret value/cookie/token/account/exchange credential readback.
- Treat public smoke as full release readiness.

## Result Report

- Task summary: Current public production health is green at pushed SHA
  `56d8d440bfe0fd9ee692e9f669e35414d85d2493`; Coolify topology resolves; API
  logs are clean in the sampled tail; Web logs show Server Action mismatch
  errors and Web app metadata reports `b894e5dd...` while public build-info
  reports `56d8d440...`.
- Files changed:
  - `history/evidence/luc-2499-coolify-production-deploy-health-sweep-2026-06-06.md`
  - `history/tasks/luc-2499-coolify-production-deploy-health-sweep-2026-06-06-task.md`
  - state/context files updated with the mission summary.
- How tested: public smoke, direct Node probes, Coolify env checker test,
  read-only Coolify API projections.
- What is incomplete: protected worker/dashboard/account/SLO/rollback/live
  runtime proof; deeper Web deploy-history/log correlation.
- Next steps: read-only child diagnosis lane should correlate recent failed
  Web deploy/rollback history and Server Action mismatch logs, then either
  close as no-mutation-needed or request a separate mutation approval with
  resource/source/rollback/smoke details.
