# Task

## Header
- ID: LUC-5085
- Title: [Soar] Production performance and server health watch
- Task Type: release
- Current Stage: verification
- Status: INCIDENT_DELEGATED
- Owner: DRE / Ops Release
- Depends on: [LUC-4811](/LUC/issues/LUC-4811) for Coolify/VPS readback
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001 / production performance and server-health readiness
- Requirement Rows: release health/readiness evidence
- Quality Scenario Rows: production availability, latency, protected auth/session, operational observability
- Risk Rows: Web home route latency; Coolify/VPS binding availability; release provenance
- Iteration: 2026-06-20 heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-5085-PRODUCTION-PERFORMANCE-HEALTH-WATCH-2026-06-20
- Mission Status: INCIDENT_DELEGATED

## Context

[LUC-5085](/LUC/issues/LUC-5085) is a critical recurring DRE production health
watch. Prior same-day watches showed app checks green while full Coolify/VPS
server-health readback stayed blocked by missing read-only bindings.

## Goal

Produce current read-only production health evidence and end the heartbeat with
a clear disposition.

## Constraints

- No deploy, push, restart, rollback, env edits, DB/Redis mutation, raw log
  capture, account mutation, trading action, or secret readback.
- Create or update exactly one narrow incident/repair issue if a new regression
  appears.
- Use existing blocker chain for missing Coolify/VPS bindings instead of
  creating duplicate broad incidents.

## Definition of Done

- Public API/Web smoke result recorded.
- Build-info SHA/ref/build id/source recorded.
- Public timing samples recorded.
- Protected auth/session proof recorded with redacted artifacts.
- Coolify binding preflight recorded.
- New Web `/` latency regression routed to one narrow follow-up issue:
  [LUC-5087](/LUC/issues/LUC-5087).
- Paperclip issue moved out of idle `in_progress`.

## Validation Evidence

- `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` -> PASS.
- Build-info readback -> SHA `42177530f2a2ddc22832133b545bccab6ab404eb`, ref `main`, build id `Urnq8xtZUh932c0e3vKGl`, `metadataSource=env-runtime`.
- Three-sample timing maxes: Web `/` `10512 ms`, Web `/auth/login` `117 ms`, Web `/api/build-info` `65 ms`, API `/health` `136 ms`, API `/ready` `73 ms`.
- Focused Web `/` recheck: `14701`, `634`, `266`, `6293`, `21953 ms`; average `8769.4 ms`.
- Initial `ops:prod-auth:proof` without name mapping -> failed before browser work with `auth token was not available`.
- Process-local mapping from `PROD_UI_AUDIT_AUTH_EMAIL/PASSWORD` to `PROD_AUTH_EMAIL/PASSWORD` and rerun -> PASS.
- `pnpm run -s ops:coolify-stack:env-check:test` -> PASS (`11/11`).
- `pnpm run -s ops:coolify-stack:env-check` -> FAIL closed with required present `0/16`.
- Cleanup: validation-created `.tmp/prod-auth-cdp-1781958233614` removed; no browser process rows remained.

## Result Report

- Public app availability is partially verified: endpoints returned `200`, API
  health/ready stayed fast, login/build-info stayed fast, and protected
  auth/session proof passed.
- Production Web `/` is not healthy enough to call the watch green: repeated
  spikes reached `21.953s` on 200 responses.
- Full server-health readback remains blocked by missing approved
  Coolify/VPS/DB/worker read-only binding families through [LUC-4811](/LUC/issues/LUC-4811).
- New Web latency follow-up: [LUC-5087](/LUC/issues/LUC-5087), assigned to 09
  CTO for owner routing while FE is paused.
- Evidence file:
  `history/evidence/luc-5085-production-performance-health-watch-2026-06-20.md`
- Source-control closure: not committed; workspace was already dirty with
  prior same-day state/evidence/architecture work, and this heartbeat added
  only LUC-5085 evidence plus the auth proof artifacts.
- Push status: not needed.
- Deploy impact: none.
