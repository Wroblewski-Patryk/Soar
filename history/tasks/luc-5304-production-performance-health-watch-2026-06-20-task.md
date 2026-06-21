# Task

## Header
- ID: LUC-5304
- Title: [Soar] Production performance and server health watch
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Ops/Release
- Depends on: [LUC-4811](/LUC/issues/LUC-4811)
- Priority: P0
- Module Confidence Rows: Production Health / Auth Session / Operations Runtime
- Requirement Rows: production public reachability; protected session fail-closed; Coolify/VPS health readback
- Quality Scenario Rows: reliability; performance; security redaction
- Risk Rows: intermittent latency; missing read-only server-health bindings
- Iteration: 2026-06-20 DRE heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-5304-PRODUCTION-PERFORMANCE-HEALTH-WATCH-2026-06-20
- Mission Status: PARTIALLY_VERIFIED / BLOCKED

## Context

[LUC-5304](/LUC/issues/LUC-5304) is a recurring production-performance and
server-health watch. Recent same-day DRE checks found public app reachability
mostly healthy, intermittent API/Web low-second tails, and full Coolify/VPS
server-health readback blocked by missing approved read-only bindings.

## Goal

Refresh current production reachability, timing, auth/session, and server-health
access posture without mutating production.

## Scope

- Public smoke: API `/health`, API `/ready`, Web `/`, Web `/api/build-info`.
- Public timing: Web `/`, Web `/auth/login`, Web `/api/build-info`, API
  `/health`, API `/ready`.
- Protected auth/session proof through existing redacted proof runner.
- Coolify/VPS access preflight through existing env-check scripts.
- Repository files: task/evidence/state only.

## Implementation Plan

1. Read issue heartbeat context and current Soar state.
2. Run public smoke and timing checks.
3. Run protected auth/session proof if approved audit credential names are present.
4. Run Coolify env-check tests and current-runner binding preflight.
5. Check browser process cleanup.
6. Write evidence/task/state updates and set Paperclip disposition.

## Acceptance Criteria

- Public smoke passes or a narrow incident is created.
- Timing results are recorded with route-specific max/average.
- Auth/session proof passes or a narrow auth/security follow-up is routed.
- Full server-health access either runs or is blocked on a first-class owner.
- No production mutation or secret disclosure occurs.

## Definition of Done

- [x] Public production smoke completed.
- [x] Public timing sample captured.
- [x] Protected auth/session proof run with redacted artifacts.
- [x] Coolify/VPS binding preflight result captured.
- [x] Evidence and state files updated.
- [x] Issue final disposition set to blocked by the existing binding owner path.

## Validation Evidence

- `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` -> PASS.
- Five-sample `curl.exe` route timing -> API/Web root/build-info healthy; login low-second WARN.
- `pnpm run -s ops:prod-auth:proof -- --i-understand-production-auth-proof --expected-sha 42177530f2a2ddc22832133b545bccab6ab404eb --output-json history/artifacts/luc-5304-prod-auth-session-browser-proof-2026-06-20.json --output-md history/evidence/luc-5304-prod-auth-session-browser-proof-2026-06-20.md` -> PASS.
- `pnpm run -s ops:coolify-stack:env-check:test` -> PASS (`11/11`).
- `pnpm run -s ops:coolify-stack:env-check` -> FAIL closed, required present `0/16`.
- Post-proof process check found no active Edge/Chrome/Chromium/headless browser rows.

## Deployment / Ops Evidence

- Deploy impact: none
- Env or secret changes: none
- Health-check impact: public `/health` and `/ready` currently pass.
- Smoke steps updated: no
- Rollback note: no rollout occurred; rollback not applicable.
- Observability or alerting impact: full server-health observability remains blocked by [LUC-4811](/LUC/issues/LUC-4811).
- Staged rollout or feature flag: not applicable

## Security / Privacy Evidence

- Data classification: production route status/timing and redacted auth proof summaries.
- Trust boundaries: production app and approved audit credential runtime.
- Permission or ownership checks: existing proof runner login path only; no account mutation.
- Abuse cases: invalid token redirects to `/auth/login?session=expired`; `/auth/me` after logout fails closed with `401`.
- Secret handling: no secret values, cookies, tokens, private headers, response bodies, or screenshots stored.
- Security tests or scans: protected auth/session proof PASS.
- Fail-closed behavior: Coolify binding preflight failed closed with required present `0/16`.
- Residual risk: full server-health readback blocked until [LUC-4811](/LUC/issues/LUC-4811) resolves.

## Result Report

- Task summary: refreshed read-only production performance and health posture.
- Files changed:
  - `history/evidence/luc-5304-production-performance-health-watch-2026-06-20.md`
  - `history/evidence/luc-5304-prod-auth-session-browser-proof-2026-06-20.md`
  - `history/artifacts/luc-5304-prod-auth-session-browser-proof-2026-06-20.json`
  - `history/tasks/luc-5304-production-performance-health-watch-2026-06-20-task.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.agents/state/active-mission.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested: public smoke PASS; timing samples captured; auth/session proof PASS; Coolify env-check tests PASS; current-runner binding preflight FAIL closed.
- What is incomplete: full Coolify/VPS/DB/worker server-health readback.
- Next steps: [LUC-4811](/LUC/issues/LUC-4811) owner injects approved read-only binding families, then DRE reruns full server-health projection.
- Decisions made: no duplicate latency or binding issue was created.
