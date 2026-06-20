# Task

## Header
- ID: `LUC-5198`
- Title: `[Soar] Production performance and server health watch`
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: none
- Priority: P0
- Module Confidence Rows: production runtime health, protected auth/session smoke
- Requirement Rows: production health/readiness, protected route fail-closed behavior
- Quality Scenario Rows: reliability, performance, security
- Risk Rows: production latency, API readiness dependency health, observability
- Iteration: 2026-06-20 DRE heartbeat
- Operation Mode: TESTER
- Mission ID: `LUC-5198-PRODUCTION-PERFORMANCE-HEALTH-WATCH-2026-06-20`
- Mission Status: PARTIALLY_VERIFIED

## Context

[LUC-5198](/LUC/issues/LUC-5198) is the recurring DRE production performance
and server-health watch. It runs read-only public smoke, protected auth proof
when safe credentials are available, and Coolify/VPS readback when safe bindings
exist.

## Goal

Produce a current production health signal and create exactly one narrow repair
issue if a regression is found.

## Scope

- Production public Web/API endpoints.
- Production protected auth/session browser proof with approved test bindings.
- Read-only Coolify API projection.
- Evidence, task packet, and health/learning state only.

## Implementation Plan

1. Read the Paperclip heartbeat context for [LUC-5198](/LUC/issues/LUC-5198).
2. Run public production smoke.
3. Capture public endpoint timings and focused recheck if any outlier appears.
4. Run protected auth/session proof with process-local credential mapping.
5. Capture read-only Coolify status using allowlisted projection only.
6. Delegate any fresh regression to one owner issue.
7. Record evidence and update issue disposition.

## Acceptance Criteria

- Public smoke result is recorded.
- Timing evidence includes public Web/API and focused recheck for outliers.
- Protected auth proof result is recorded without secret exposure.
- Coolify read-only status is recorded with only allowlisted fields.
- Any fresh regression has a single delegated follow-up.
- Cleanup evidence is recorded.

## Definition of Done

- [x] Public production smoke run.
- [x] Public timing samples captured.
- [x] Protected auth proof run with safe credential bindings.
- [x] Coolify read-only projection captured without secret exposure.
- [x] Regression routed to exactly one repair issue.
- [x] Soar source-of-truth health state updated.

## Validation Evidence

- Tests:
  - `pnpm run -s ops:coolify-stack:env-check:test` -> PASS (`11/11`).
- Manual checks:
  - `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` -> PASS.
  - Public five-sample timing -> PARTIAL; API `/ready` max `2426 ms`.
  - Focused API ten-sample timing -> FAIL signal; API `/ready` one `000` timeout at `21048 ms`, average `2561.6 ms`.
  - Protected auth/session browser proof -> PASS artifact generated.
  - Coolify read-only projection -> PASS.
- High-risk checks:
  - No deploy, restart, rollback, env edit, account mutation, DB/Redis mutation, exchange, order, payment/subscription, or live-trading action occurred.
- Reality status: partially verified.

## Architecture Evidence

- Architecture source reviewed: `docs/operations/post-deploy-smoke-checklist.md`, `.agents/state/system-health.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no DRE-owned architecture mismatch.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: API `/ready` intermittently slow/timed out.
- Smoke steps updated: no.
- Rollback note: not applicable; no production mutation occurred.
- Observability or alerting impact: [LUC-5213](/LUC/issues/LUC-5213) created for API `/ready` investigation.
- Staged rollout or feature flag: not applicable.

## Security / Privacy Evidence

- Data classification: production health metadata and redacted auth proof.
- Trust boundaries: public Web/API, authenticated dashboard route, invalid token cookie, Coolify read-only API.
- Secret handling: credentials mapped process-locally only; values not printed or written.
- Fail-closed behavior: protected auth proof passed, including invalid-token `session=expired`.
- Residual risk: [LUC-5213](/LUC/issues/LUC-5213) must identify the API `/ready` bottleneck class.

## Result Report

- Task summary: production public smoke passed, Web stayed responsive, protected auth proof passed, Coolify read-only access worked, but API `/ready` showed intermittent timeout/latency outliers.
- Files changed:
  - `history/evidence/luc-5198-production-performance-health-watch-2026-06-20.md`
  - `history/evidence/luc-5198-prod-auth-session-browser-proof-2026-06-20.md`
  - `history/evidence/luc-5198-prod-auth-session-browser-proof-2026-06-20.json`
  - `history/tasks/luc-5198-production-performance-health-watch-2026-06-20-task.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/system-health.md`
  - `.codex/context/LEARNING_JOURNAL.md`
- How tested: public smoke, timing probes, protected auth proof, Coolify read-only projection, env checker tests.
- What is incomplete: API `/ready` bottleneck root cause is not known; validation Edge PID cleanup failed despite targeted attempts.
- Next steps: [LUC-5213](/LUC/issues/LUC-5213) owns backend/runtime investigation.
- Decisions made: no production mutation; one child incident created for the fresh `/ready` signal.
