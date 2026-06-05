# LUC-2279 - Retrieve Redacted Pre-Crash Coolify Host Logs For soar-api Restart

## Context

[LUC-1160](/LUC/issues/LUC-1160) observed a transient `soar-api` Coolify crash
restart at `2026-05-31T21:08:45Z`, but retained application log evidence in the
parent lane started after recovery. This issue asks Ops to retrieve
host/Coolify pre-crash evidence and classify the crash cause.

## Goal

Retrieve redacted host/Coolify pre-crash evidence for `soar-api` around
`2026-05-31T21:08:45Z`, including restart timestamp/count, exit reason when
available, healthcheck status, and pre-crash startup/runtime snippets.

## Constraints

- Read-only diagnostics only.
- No deploy, restart, rollback, env/DNS/database mutation, protected smoke, or
  production account mutation.
- Do not disclose secrets, cookies, tokens, account data, exchange credentials,
  raw unredacted logs, raw resource ids, generated database suffixes, or
  internal connection URLs.
- Prefer host/Coolify retained logs over public endpoint probes.

## Definition of Done

- Redacted evidence is posted or linked back to [LUC-1160](/LUC/issues/LUC-1160).
- Root cause is classified as startup crash, healthcheck loop,
  migration/startup job failure, queue/worker boot failure,
  memory/OOM/resource pressure, env/config validation, reverse-proxy/Coolify
  routing, or unknown.
- Follow-up lane is created when another ownership lane must unblock the proof.

## Forbidden

- Production mutation.
- Secret or raw host-log disclosure.
- Claiming root cause from public 200 probes alone.

## Stage

- `verification`

## Result Report

Status: `done`.

Concrete action:

1. Read the scoped issue context for [LUC-2279](/LUC/issues/LUC-2279) and used
   the parent incident window `2026-05-31T21:08:45Z`.
2. Queried Coolify read-only application metadata for `soar-api`.
3. Queried Coolify runtime application logs with default and expanded tails.
4. Queried Coolify deployment history for `soar-api` and inspected the May 31
   successful deployment log in memory.
5. Avoided persisting raw deployment logs because they include build-time
   secret-adjacent ARG material and internal generated network names.
6. Ran the relevant local Ops guardrail test.
7. Resumed after [LUC-2281](/LUC/issues/LUC-2281) approved the bounded
   redaction-safe host-log export path.
8. Used existing SSH alias `codex-vps` to run only read-only Docker
   log/inspect/event projections for the configured Coolify `soar-api`
   resource alias in the approved May 31 crash window.
9. Redacted host output before persisting evidence.

Evidence:

- `history/evidence/luc-2279-soar-api-pre-crash-host-log-retrieval-2026-06-05.md`
- `pnpm run ops:coolify-stack:env-check:test` -> pass (`8/8`)

Findings:

- Current `soar-api` metadata still reports crash restart drift:
  `last_restart_type=crash`, `last_restart_at=2026-06-01T16:14:03Z`,
  `restart_count=5`.
- The parent May 31 signal remains real but historical:
  `last_restart_type=crash`, `last_restart_at=2026-05-31T21:08:45Z`,
  `restart_count=2`.
- Accessible runtime log tail starts at `2026-06-03T14:35:04.875Z`, so it does
  not cover the May 31 pre-crash window.
- The retained May 31 deployment log proves build/start/rolling update success
  before the crash, but not the later runtime exit.
- Coolify metadata has healthchecks disabled for `soar-api`, so a Coolify
  healthcheck loop is not supported by available evidence.
- Docker logs contain the crash signature at
  `2026-05-31T21:07:45.498997780Z`: `FATAL ERROR: Ineffective mark-compacts
  near heap limit Allocation failed - JavaScript heap out of memory`.
- The API restarted immediately afterward, ran Prisma migrate deploy
  successfully, and emitted `server_started` at `2026-05-31T21:08:00.014Z`.
- Docker events returned `0` retained rows for the current container in the
  approved window; current inspect no longer preserves the May 31 exit code.

Root cause classification:

- `memory/OOM/resource pressure`

Post-security export:

- [LUC-2281](/LUC/issues/LUC-2281) approved the constrained read-only host-log
  export path.
- Ops used the existing `codex-vps` SSH alias after approval.
- `docker ps -a --filter name=soar-api` returned no visible `soar-api`
  container rows in that SSH/Docker context.
- `docker events` for `2026-05-31T20:50:00Z` through
  `2026-05-31T21:20:00Z`, filtered to `soar-api`, returned no retained events.
- first literal-name lookup returned no `soar-api` rows because Coolify uses a
  generated resource alias for the container name;
- lookup by configured Coolify resource alias found the current `soar-api`
  container and retained Docker logs for the May 31 crash window;
- no raw env, mounts, network settings, host paths, raw ids, connection
  strings, account data, exchange credentials, or secret values were persisted.

Follow-up:

- Backend API must investigate the source of the API heap growth and add
  memory-pressure regression/observability coverage. Ops evidence does not
  identify which endpoint, background job, import path, query, cache, or leak
  caused the heap pressure.

Deployment impact:

- none; this heartbeat was read-only and performed no mutation.

## Blocker-Resolved Resume Closure

Status: `done`.

[LUC-2281](/LUC/issues/LUC-2281) resolved the Security approval blocker. On
resume, Ops corrected the Docker lookup from literal `soar-api` to the approved
Coolify resource alias for the `soar-api` application. The resource-named
container was present, and Docker logs retained the requested May 31 incident
window.

Redacted host-log facts:

- Raw host output stayed in process memory only and was not persisted.
- Docker logs retained `373` lines for
  `2026-05-31T20:50:00Z..2026-05-31T21:20:00Z`.
- `2026-05-31T21:07:45.498655705Z`: V8 Mark-Compact allocation pressure near
  heap limit, approximately `2044 MB` used.
- `2026-05-31T21:07:45.498997780Z`: Node fatal
  `JavaScript heap out of memory`.
- `2026-05-31T21:07:58.001286541Z`: restart path ran
  `prisma migrate deploy`.
- `2026-05-31T21:07:59.244404245Z`: Prisma migration completed successfully
  with no pending migrations.
- `2026-05-31T21:08:00.015720071Z`: API emitted `server_started`.
- Current inspect state reports Docker health `none`, current
  `OOMKilled=false`, current `ExitCode=0`, and current Docker
  `RestartCount=0`; it does not preserve the historical crash exit code.
- Docker events returned `0` retained rows for the current container in the
  incident window.

Root cause classification:

- `memory/OOM/resource pressure`

Follow-up:

- [LUC-2291](/LUC/issues/LUC-2291) assigned to Backend API Engineer to
  investigate the API Node heap OOM path and propose or implement the smallest
  safe durable fix.
