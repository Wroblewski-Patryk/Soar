# LUC-1160 - [Soar][Production Stability] Diagnose Coolify restart loop and runtime crash cause (2026-05-31)

## Context
Ops Release Lead heartbeat scoped to production instability report for Soar on Coolify.

## Goal
Diagnose whether a restart loop is active and identify crash cause with read-only evidence.

## Constraints
- Read-only diagnostics only.
- No deploy/restart/rollback/env mutation.
- No secret-value exposure.

## Definition of Done
- Public reachability rechecked with timestamps and status codes.
- Coolify resource/application runtime state captured read-only.
- Crash/restart indicators extracted per Soar app.
- Evidence and source-of-truth updated with final disposition.

## Forbidden
- Production mutation.
- Secret/token disclosure.

## Stage
- `verification`

## Result Report
- Outcome: `blocked` (active loop not observed; crash-cause proof still unavailable from accessible telemetry).
- What changed in this heartbeat:
  1. Revalidated public endpoints now return `200`:
     - `https://api.soar.luckysparrow.ch/health`
     - `https://api.soar.luckysparrow.ch/ready`
     - `https://soar.luckysparrow.ch/`
     - `https://soar.luckysparrow.ch/api/build-info`
  2. Captured current web build info (`gitSha=6839cd6b8884e26eca735ce32cea98c1dadccfbe`, checked at `2026-05-31T21:13:51.459Z`).
  3. Executed Coolify read-only API diagnostics:
     - list endpoints reachable (`/projects`, `/resources`, `/applications`).
     - Soar app state extracted.
  4. Identified restart/crash signal:
     - `soar-api`: `last_restart_type=crash`, `last_restart_at=2026-05-31T21:08:45.000000Z`, `restart_count=2`.
     - `soar-web` + all four workers: `restart_count=0`.
  5. Captured API app logs snapshot via Coolify app logs endpoint and persisted artifact.

- Diagnosis summary:
  - No active restart loop is visible at end of heartbeat.
  - A short API crash event occurred around `2026-05-31 21:08:45Z` and auto-recovered.
  - Protected runtime endpoints (`/workers/health`, `/workers/ready`, `/alerts`, `/metrics`) remain auth-gated (`401`) in no-auth probe, so worker-runtime internals remain unverified in this pass.
  - Available API log window contains normal 200-traffic after recovery and no fatal stack trace, so immediate crash root cause is not yet provable from retained log slice.

- Evidence:
  - `history/evidence/luc-1160-coolify-restart-loop-diagnosis-2026-05-31.md`
  - `history/artifacts/luc-1160-soar-api-logs-redacted-snippet-2026-05-31.txt`

- Residual risk:
  - API had at least one crash restart in production; without pre-crash stack trace/metrics, recurrence risk cannot be quantified.

- Next required action (owner):
  1. Ops Release Lead + platform owner: extract pre-crash container logs/events around `2026-05-31T21:08:45Z` from VPS/Coolify host-level retention (not only current app tail), then classify root cause (OOM, process exit, dependency timeout, etc.).
  2. Security-approved read-only principal (QA/Security/Ops): run protected probes (`/workers/ready`, `/alerts`) to confirm no hidden worker instability.

## Continuation Heartbeat (2026-05-31T23:31:00+02:00)
- Wake context acknowledged: `issue_continuation_needed`, no new issue comments.
- Concrete action in this continuation:
  1. Reran public smoke:
     - `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`
     - result: PASS (`/health`, `/ready`, `/`, `/api/build-info` all `200`).
  2. Attempted runtime freshness recheck:
     - `pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch`
     - result: FAIL with `HTTP 401` (protected endpoint, no approved auth principal in this lane).
  3. Added short availability sample window (`20` probes, `3s` cadence) for:
     - `https://api.soar.luckysparrow.ch/health`
     - `https://api.soar.luckysparrow.ch/ready`
     - result: `20/20` success for both endpoints (`200` only).
- Continuation diagnosis:
  - no active restart loop is visible from public probes in this window;
  - no new crash signature is observable without protected metrics/host logs.
- Blocking condition remains:
  - root-cause classification for the previously observed API crash cannot be completed without pre-crash host/Coolify retention logs/events around `2026-05-31T21:08:45Z`.
