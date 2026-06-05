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

## Recovery Heartbeat (2026-06-05T22:32:00+02:00)
- Wake context acknowledged: `source_scoped_recovery_action`; no new operator comments were included.
- Concrete action in this recovery:
  1. Inspected prior run `98515aaa-b0f4-474c-b4d7-8250b22e2eb9` through Paperclip control-plane metadata.
     - result: `status=cancelled`, `errorCode=cancelled`, no `errorMessage`.
     - run events show lifecycle `run cancelled` with `exitCode=1`.
  2. Read the issue thread and confirmed an earlier board mutation guard comment:
     - protected dirty group: `product-code`.
     - sample path: `apps/api/src/router/workers-health-readiness.test.ts`.
  3. Checked current local Soar source-control state:
     - result: clean worktree; the earlier mutation guard is not an active local dirty-state blocker now.
  4. Compared recorded deployed build evidence with current local main:
     - deployed evidence from 2026-05-31: `6839cd6b8884e26eca735ce32cea98c1dadccfbe`.
     - current local `main` HEAD during recovery: `6e31d814046b640ad529d1cd57f968ba6f67b05e`.
     - conclusion: do not mix this diagnostic lane with deploy or source mutation; deployed crash evidence belongs to the older SHA.
  5. Created first-class follow-up blocker:
     - `LUC-2279` - `[Soar][Ops][LUC-1160] Retrieve redacted pre-crash Coolify host logs for soar-api restart`.
- Recovery diagnosis:
  - prior cancellation was a control-plane/adapter interruption, not a new Soar runtime crash finding;
  - active public restart loop remains unproven;
  - previously observed `soar-api` crash restart remains real but root-cause class is still `unknown` pending host/Coolify pre-crash evidence;
  - protected runtime readiness remains gated by the existing auth-binding path (`LUC-1438` -> `LUC-1439`).
- Final disposition for this heartbeat:
  - LUC-1160 should remain `blocked`;
  - first-class blockers: `LUC-2279` for host/Coolify pre-crash logs and `LUC-1438` for protected workers/ready auth binding.

## LUC-2279 Child Evidence Attempt (2026-06-05T20:39:04Z)
- Ops Release Lead attempted the requested read-only pre-crash log retrieval
  for `soar-api` around `2026-05-31T21:08:45Z`.
- Coolify application metadata and deployment history were reachable, but the
  accessible runtime app log tail starts at `2026-06-03T14:35:04.875Z`, so it
  does not cover the parent incident window.
- May 31 deployment logs prove the preceding deploy/build/rolling update
  completed and started a new `soar-api` container at `2026-05-31T15:52:24Z`;
  raw deployment logs were not persisted because they contain build-time
  secret-adjacent material and internal generated network names.
- Current readback shows restart drift after the parent incident:
  `last_restart_type=crash`, `last_restart_at=2026-06-01T16:14:03Z`,
  `restart_count=5`.
- Root-cause classification remains `unknown`; host-level Docker/journal or
  Coolify terminal/event retention is still required for exit code, OOM reason,
  and pre-crash stack evidence.
- Evidence:
  `history/evidence/luc-2279-soar-api-pre-crash-host-log-retrieval-2026-06-05.md`.

## LUC-2279 Child Closure (2026-06-05T20:50:00Z)
- After [LUC-2281](/LUC/issues/LUC-2281) approved the bounded host-log export
  path, Ops retrieved redacted read-only Docker evidence from the production
  VPS for the `soar-api` crash window.
- Crash signature:
  - `2026-05-31T21:07:45.498997780Z`:
    `FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed -
    JavaScript heap out of memory`.
  - API restarted, ran Prisma migrate deploy successfully, and emitted
    `server_started` at `2026-05-31T21:08:00.014Z`.
- Classification:
  - root cause class: `memory/OOM/resource pressure`;
  - not supported: Coolify healthcheck loop, May 31 deploy/build failure, or
    post-restart migration/startup failure.
- Residual gap:
  - exact endpoint/job/leak source is unknown and belongs to Backend API
    follow-up.
- Evidence:
  `history/evidence/luc-2279-soar-api-pre-crash-host-log-retrieval-2026-06-05.md`.

## LUC-2279 Host-Log Closure (2026-06-05T20:48:00Z)
- [LUC-2281](/LUC/issues/LUC-2281) approved a bounded read-only host-log export
  path.
- Ops used the configured VPS SSH path as non-root `codex`; raw host output was
  kept only in process memory and not persisted.
- The initial post-security filter used literal `soar-api`; the blocker-resolved
  resume corrected this to the approved Coolify resource alias and found the
  resource-named API container.
- Docker logs for `2026-05-31T20:50:00Z..2026-05-31T21:20:00Z` retained `373`
  lines and contained the missing crash signature:
  - `2026-05-31T21:07:45.498655705Z`: V8 Mark-Compact allocation pressure near
    heap limit, approximately `2044 MB` used.
  - `2026-05-31T21:07:45.498997780Z`: Node fatal
    `JavaScript heap out of memory`.
  - `2026-05-31T21:07:58.001286541Z`: restart path ran
    `prisma migrate deploy`.
  - `2026-05-31T21:07:59.244404245Z`: Prisma migration finished successfully
    with no pending migrations.
  - `2026-05-31T21:08:00.015720071Z`: API emitted `server_started`.
- Classification: `memory/OOM/resource pressure`.
- Current inspect state does not preserve the historical crash exit code; Docker
  events for the current container returned `0` retained rows for the incident
  window. Docker/Coolify healthchecks were not a cause signal because Docker
  health is `none` and Coolify healthchecks are disabled.
- [LUC-2291](/LUC/issues/LUC-2291) was routed to Backend API Engineer for
  durable memory/OOM investigation.

## LUC-2279 Security-Approved Host Export Result (2026-06-05T20:50Z)
- [LUC-2281](/LUC/issues/LUC-2281) approved a constrained read-only export path
  for Docker events, Docker inspect lifecycle fields, journal snippets, and
  retained Coolify terminal/event snippets for the May 31 incident window.
- Ops used the existing `codex-vps` SSH alias after that approval.
- Result: no visible `soar-api` container row in that SSH/Docker context, no
  retained Docker events for `2026-05-31T20:50:00Z` through
  `2026-05-31T21:20:00Z` filtered to `soar-api`, and no matching journal lines
  for `soar-api`, Docker, container, restart, exit, OOM, or Coolify terms in
  that window.
- Final child classification remains `unknown`; the approved path did not
  expose exit code, OOM reason, pre-crash stack trace, or container health state.
- No raw env, mounts, network settings, raw ids, host paths, connection strings,
  account data, exchange credentials, secrets, deploy, restart, rollback, env
  edit, database action, protected smoke, account action, or live-trading action
  occurred.
