# Task

## Header
- ID: LUC-5206
- Title: [Soar] Authenticated production acceptance and performance sweep
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: QA / Verification Engineer
- Depends on: [LUC-5146](/LUC/issues/LUC-5146), [LUC-4811](/LUC/issues/LUC-4811)
- Priority: P0
- Operation Mode: TESTER
- Mission ID: LUC-5206-AUTHENTICATED-PRODUCTION-ACCEPTANCE-PERFORMANCE-SWEEP-2026-06-20
- Mission Status: BLOCKED / PARTIALLY_VERIFIED

## Context

[LUC-5206](/LUC/issues/LUC-5206) is the current recurring QVE production
acceptance sweep. It requires read-only authenticated production journey
evidence, public performance sampling, and server-health readback where the
runner has approved bindings.

## Goal

Refresh current authenticated production acceptance and performance evidence
without mutating production or exposing secrets.

## Constraints

- Use stored protected input references only; never print or persist secret
  values, cookies, tokens, private headers, or protected response bodies.
- Do not trade, mutate exchange keys, change billing, change production config,
  deploy, push, restart, rollback, or destroy data.
- Reuse project-native smoke/auth/clickthrough scripts.
- Keep server-health readback fail-closed if approved Coolify/VPS bindings are
  absent.
- Do not create duplicate broad QA or performance issues when exact blocker
  issues already exist.

## Definition of Done

- [x] Public smoke run.
- [x] Production build-info and timing samples recorded.
- [x] Authenticated UI module clickthrough run.
- [x] Protected auth/session browser proof run.
- [x] Coolify checker tests and current-runner binding preflight run.
- [x] Cleanup attempted and process ownership anomaly recorded.
- [x] Evidence and project state updated.
- [x] Paperclip issue moved to a final blocked disposition naming unblock
  owners/actions.

## Forbidden

- Deploy, push, restart, rollback, env mutation, production account mutation,
  API-key mutation, exchange/trading action, payment/subscription mutation,
  secret value readback, raw log capture, screenshot capture, database/Redis
  mutation, or live-money action.

## Result Report

- Task summary: application-level route reachability is partially verified on
  SHA `42177530f2a2ddc22832133b545bccab6ab404eb`, but protected auth/session
  proof fails the invalid-token expired-session redirect contract and full
  server-health readback remains blocked by missing approved bindings.
- Validation:
  - public smoke PASS
  - build-info readback PASS, `metadataSource=env-runtime`
  - public timing: Web `/` max `281 ms`; Web `/auth/login` max `225 ms`;
    Web `/api/build-info` max `2220 ms`; API `/health` max `2484 ms`;
    API `/ready` max `199 ms`
  - authenticated UI clickthrough PASS
  - auth/session browser proof FAIL on invalid-token redirect missing
    `session=expired`
  - Coolify env checker tests PASS (`11/11`)
  - current binding preflight FAIL closed with required present `0/16`
- Evidence:
  - `history/evidence/luc-5206-authenticated-production-acceptance-performance-sweep-2026-06-20.md`
  - `history/evidence/luc-5206-prod-ui-module-clickthrough-2026-06-20.md`
  - `history/evidence/_artifacts-luc-5206-prod-ui-module-clickthrough-2026-06-20.json`
  - `history/evidence/luc-5206-prod-auth-session-browser-proof-2026-06-20.md`
  - `history/evidence/_artifacts-luc-5206-prod-auth-session-browser-proof-2026-06-20.json`
- What is incomplete:
  - protected auth/session acceptance
  - Coolify/VPS/DB/worker server-health readback
- Next owner/action:
  - [LUC-5146](/LUC/issues/LUC-5146): Frontend repair or contract decision for
    invalid-token `session=expired` redirect.
  - [LUC-4811](/LUC/issues/LUC-4811): Security/Ops binding owner injects
    approved read-only Coolify/VPS/DB/worker status bindings.
- Deployment impact: none.
- Safety: no production mutation, secret readback, screenshot, raw log capture,
  account mutation, exchange action, order, position, payment/subscription, or
  live-trading action occurred. Cleanup removed the `LUC-5206` temp profile;
  later Edge rows were traced to a separate `LUC-5198` proof process and were
  left to that owning run.
