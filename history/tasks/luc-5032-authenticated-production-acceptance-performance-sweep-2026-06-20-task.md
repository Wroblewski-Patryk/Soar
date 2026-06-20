# Task

## Header
- ID: LUC-5032
- Title: [Soar] Authenticated production acceptance and performance sweep
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: QA / Verification Engineer
- Depends on: [LUC-4811](/LUC/issues/LUC-4811)
- Priority: P0
- Operation Mode: TESTER
- Mission ID: LUC-5032-AUTHENTICATED-PRODUCTION-ACCEPTANCE-PERFORMANCE-SWEEP-2026-06-20
- Mission Status: BLOCKED / PARTIALLY_VERIFIED

## Context

[LUC-5032](/LUC/issues/LUC-5032) is the current QVE production acceptance
sweep. The issue requires read-only authenticated production journey evidence,
performance sampling, and server-health readback where the runner has approved
bindings.

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

## Definition of Done

- [x] Public smoke passed.
- [x] Production build-info and timing samples recorded.
- [x] Authenticated UI module clickthrough passed.
- [x] Protected auth/session browser proof passed.
- [x] Coolify checker tests passed and current-runner binding check failed closed.
- [x] Cleanup verified.
- [x] Evidence and project state updated.
- [x] Paperclip issue moved to a final blocked disposition naming unblock owner/action.

## Result Report

- Task summary: application-level production acceptance is healthy on SHA
  `42177530f2a2ddc22832133b545bccab6ab404eb`; full server-health readback
  remains blocked by missing approved read-only Coolify/VPS/DB/worker bindings.
- Validation:
  - public smoke PASS
  - build-info/timing readback PASS
  - authenticated UI clickthrough PASS
  - auth/session browser proof PASS
  - Coolify env checker tests PASS (`11/11`)
  - current binding preflight FAIL closed with required present `0/16`
- Evidence:
  - `history/evidence/luc-5032-authenticated-production-acceptance-performance-sweep-2026-06-20.md`
  - `history/evidence/luc-5032-prod-ui-module-clickthrough-2026-06-20.md`
  - `history/evidence/_artifacts-luc-5032-prod-ui-module-clickthrough-2026-06-20.json`
  - `history/evidence/luc-5032-prod-auth-session-browser-proof-2026-06-20.md`
  - `history/evidence/_artifacts-luc-5032-prod-auth-session-browser-proof-2026-06-20.json`
- What is incomplete: Coolify/VPS/DB/worker server-health readback.
- Next owner/action: Security/Ops binding owner for [LUC-4811](/LUC/issues/LUC-4811)
  must inject approved read-only bindings, then wake Ops/QVE to rerun full
  server-health projection.
- Deployment impact: none.
- Safety: no production mutation, secret readback, screenshot, raw log capture,
  account mutation, exchange action, order, position, payment/subscription, or
  live-trading action occurred.
