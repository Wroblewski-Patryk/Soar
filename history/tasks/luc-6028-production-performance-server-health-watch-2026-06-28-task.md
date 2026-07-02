# Task

## Header
- ID: LUC-6028
- Title: Production performance and server health watch
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: none
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001 / production runtime health / production smoke / worker readiness / Coolify read-only status
- Requirement Rows: production performance watch, read-only server health watch
- Quality Scenario Rows: availability, latency, freshness, rollback safety
- Risk Rows: stale smoke token, market catalog cold latency, Coolify queued deployments, host-level observability gap
- Iteration: 2026-06-28 DRE heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-6028-PRODUCTION-PERFORMANCE-SERVER-HEALTH-WATCH-2026-06-28
- Mission Status: VERIFIED

## Context

[LUC-6028](/LUC/issues/LUC-6028) is the recurring Soar production performance
and server-health watch. Prior same-day DRE watches showed green public/API
health, fresh-login worker readiness, healthy runtime freshness, repeated stale
`SMOKE_AUTH_TOKEN` false negatives, a recurring market-catalog cold sample that
normalizes, and Coolify queued deployment rows without matching runtime
failure.

## Goal

Verify whether production is healthy and responsive enough for the current
release-readiness posture, and determine whether to create a narrow
incident/repair issue.

## Constraints

- use existing smoke/freshness/rollback scripts and Coolify GET projection
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay in verification stage

## Definition of Done

- [x] public API/Web smoke completed
- [x] protected workers readiness checked through safe fresh-login path
- [x] runtime freshness and rollback guard checked
- [x] representative timing evidence captured
- [x] Coolify/VPS read-only availability boundary recorded
- [x] durable evidence and state updates written
- [x] Paperclip issue updated to clear disposition

## Forbidden

- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping
- deploy, push, restart, rollback execution, env edit, secret/account
  readback, DB/Redis mutation, raw logs, production account mutation,
  subscription/payment mutation, exchange mutation, order, position,
  live-trading action

## Validation Evidence

- Stale-token deploy smoke: public checks passed; protected `/workers/ready`
  returned `401`.
- Fresh-login deploy smoke: all checks passed including protected
  `/workers/ready`.
- Runtime freshness: PASS.
- Rollback guard: PASS, `shouldRollback=false`.
- Public timing: all sampled public targets returned `200:8`, max `350.2 ms`.
- Authenticated timing: representative dashboard/admin reads returned `200:3`;
  `/dashboard/markets/catalog` had one cold `1691.9 ms` sample, then focused
  follow-up returned `200:8`, max `255.7 ms`.
- Coolify GET projection: pass; six application rows visible, PostgreSQL/Redis
  `running:healthy`, four queued deployment rows visible.

## Result Report

- Task summary: read-only Soar production watch completed; app is healthy in
  this evidence window.
- Files changed: `history/evidence/luc-6028-production-performance-server-health-watch-2026-06-28.md`,
  `history/tasks/luc-6028-production-performance-server-health-watch-2026-06-28-task.md`,
  and local state summary entries.
- How tested: deploy smoke, runtime freshness, rollback guard, timing samples,
  Coolify GET projection.
- What is incomplete: host-level VPS pressure/log-window proof, stale token
  cleanup, release-grade build provenance, Coolify queued deployment row
  follow-up if rows persist with runtime symptoms.
- Next steps: continue recurring watch; route only if market catalog cold
  sample becomes persistent, queued deployment rows persist with runtime
  symptoms, or timing grows toward human-visible stall territory.
- Decisions made: no duplicate incident/repair issue required from this
  heartbeat.

## Source-Control Closure

- Repository: `C:/Personal/Projekty/Aplikacje/Soar`.
- Branch state at start: `main...origin/main [ahead 15, behind 2]`.
- Dirty state: pre-existing mixed state/evidence/package/code changes from
  multiple lanes.
- Commit: not created because this heartbeat produced evidence/state only in a
  mixed dirty/divergent shared checkout.
- Push: not needed and not authorized.
- Deploy impact: none.

## Evidence

- `history/evidence/luc-6028-production-performance-server-health-watch-2026-06-28.md`
