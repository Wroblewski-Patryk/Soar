# LUC-2279 Soar API Pre-Crash Host Log Retrieval Evidence

Date: 2026-06-05
Owner: Ops Release Lead
Scope: read-only retrieval attempt for `soar-api` pre-crash Coolify/host logs

## Result

Status: verified after Security-approved host-log retrieval.

At `2026-06-05T20:39:04Z`, authenticated read-only Coolify API checks
confirmed the `soar-api` crash signal still exists in application metadata, but
the accessible application log tail no longer covers the incident window around
`2026-05-31T21:08:45Z`.

After [LUC-2281](/LUC/issues/LUC-2281) approved the constrained host-log export
path, Ops used the existing `codex-vps` SSH alias and queried only read-only
Docker log/inspect/event projections for the approved incident window. Raw host
output was kept in memory only and was not persisted.

## Wake Context

- Issue: [LUC-2279](/LUC/issues/LUC-2279)
- Parent blocker: [LUC-1160](/LUC/issues/LUC-1160)
- Target incident timestamp from parent: `2026-05-31T21:08:45Z`
- Parent signal: `last_restart_type=crash`, `restart_count=2`
- Scope stayed read-only; no deploy, restart, rollback, environment edit,
  database action, protected smoke, account action, or live-trading action
  occurred.

## Evidence Collected

| Source | Result |
| --- | --- |
| Coolify application metadata, `soar-api` | reachable; current status `running:unknown`, server status `true` |
| Coolify application restart fields | current readback shows `last_restart_at=2026-06-01T16:14:03Z`, `last_restart_type=crash`, `restart_count=5`; this is drift after the parent May 31 signal |
| Coolify health-check config | `health_check_enabled=false`, configured path `/`, return code `200`; no Coolify healthcheck loop evidence from metadata |
| Coolify runtime app logs, `lines=2000` | reachable, `1996` non-empty lines; timestamp range `2026-06-03T14:35:04.875Z` to `2026-06-05T20:34:59.649Z`; does not cover `2026-05-31T21:08:45Z` |
| Coolify deployment history for `soar-api` | reachable; May 31 successful deploy `2026-05-31T15:39:25Z` to `2026-05-31T15:52:24Z` for commit `6839cd6b8884e26eca735ce32cea98c1dadccfbe` |
| May 31 successful deployment log | retained and read; not persisted raw because it includes build-time secret-adjacent material and internal network names |
| Host/VPS SSH bindings | not present in this runner by environment name scan |
| `codex-vps` SSH alias | present; read-only connection verified as user `codex` |
| Docker logs for the Coolify `soar-api` resource alias | retained; `373` timestamped lines in `2026-05-31T20:50:00Z` to `2026-05-31T21:20:00Z` |
| Docker inspect lifecycle projection | current container exists and is running; current inspect no longer preserves the May 31 exit code |
| Docker event stream for current container in the approved window | `0` retained event rows |

## Redacted Startup Facts

The May 31 deployment log supports only these redaction-safe facts:

- deployment server reported Docker `29.5.2` with BuildKit and Buildx;
- deployment targeted `Wroblewski-Patryk/Soar:main` to localhost;
- API Dockerfile runtime command was `node scripts/start-with-migrate.mjs`;
- Prisma generate completed during build;
- rolling update created and started a new `soar-api` container at
  `2026-05-31T15:52:24Z`;
- the deployment finished successfully at `2026-05-31T15:52:24Z`.

The deployment log did not contain the later runtime process exit around
`2026-05-31T21:08:45Z`.

## Redacted Crash Excerpt

Only this redacted, field-limited excerpt is persisted from the approved Docker
log export:

```text
2026-05-31T21:07:45.498655705Z [node] Mark-Compact near ~2044 MB heap with allocation pressure.
2026-05-31T21:07:45.498997780Z FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory.
2026-05-31T21:07:45.506966082Z node::OOMErrorHandler(... redacted stack frame ...)
2026-05-31T21:07:45.507856854Z v8::internal::V8::FatalProcessOutOfMemory(... redacted stack frame ...)
2026-05-31T21:07:58.001286541Z [api/start] Running prisma migrate deploy...
2026-05-31T21:07:59.222645535Z No pending migrations to apply.
2026-05-31T21:07:59.244404245Z [api/start] prisma migrate deploy finished successfully.
2026-05-31T21:07:59.244473228Z [api/start] Starting API server...
2026-05-31T21:08:00.014Z {"level":"info","module":"api.server","event":"server_started","serverPort":3001}
```

Redactions applied before persistence: resource/container ids, generated host
names, connection targets, URLs, internal network names, and unnecessary stack
detail.

## Classification

Root cause class: `memory/OOM/resource pressure`.

What can be ruled out from accessible evidence:

- Active restart loop at readback time: not proven by current metadata or
  current public availability lineage.
- Coolify healthcheck loop: not supported by metadata because Coolify
  healthchecks are disabled for `soar-api`.
- Deployment/build failure for the last successful May 31 deploy: not
  supported; the deployment completed and started the new container.
- Migration/startup job failure after restart: not supported; the API restarted
  and `prisma migrate deploy` completed successfully before `server_started`.

What remains unproven:

- exact May 31 process exit code; current Docker inspect no longer preserves
  that historical exit code;
- Docker daemon event row for the May 31 restart; current container event query
  returned `0` retained rows in the approved window;
- exact source of heap growth: endpoint, background job, import path, query,
  cache, or leak.

## Required Follow-Up

Backend API follow-up is required to identify why the production API process
was operating near a roughly 2 GB V8 heap limit before the crash and to add
memory-pressure regression/observability coverage.

## Validation

- `pnpm run ops:coolify-stack:env-check:test` -> pass (`8/8`).
- SSH host diagnostics were read-only Docker log/inspect/event projections
  only. No deploy, restart, rollback, env/DNS/database mutation, protected
  smoke, production account action, or live-trading action occurred.

## Post-Security Approved Export Attempt

[LUC-2281](/LUC/issues/LUC-2281) approved a constrained read-only export path
for the `2026-05-31T20:50:00Z` through `2026-05-31T21:20:00Z` window. Ops then
used the existing `codex-vps` SSH alias without running env, mount, network, or
secret readback commands.

Initial redacted results:

- `docker ps -a --filter name=soar-api` returned no visible `soar-api`
  container rows because Coolify names the container by generated resource
  alias, not literal service name.
- Retrying with the configured Coolify resource alias found the active
  `soar-api` container created during the May 31 deployment and exposed the
  Docker log excerpt above.
- `docker events --since 2026-05-31T20:50:00Z --until 2026-05-31T21:20:00Z`
  for the current container returned no events.
- `journalctl --since 2026-05-31 20:50:00 UTC --until 2026-05-31 21:20:00 UTC`
  filtered for `soar-api`, Docker, container, restart, exit, OOM, and Coolify
  terms returned no matching retained lines.
- A visible-container scan showed only Coolify control-plane/helper containers
  matching `api` or `coolify`; no Soar application container name was visible
  in that context. Raw generated helper names were not persisted.

Final classification is `memory/OOM/resource pressure`: Docker logs contain the
Node/V8 heap out-of-memory crash immediately before the API restart. Exact
application-level cause remains for Backend API follow-up.

## Blocker-Resolved Resume Correction

Status: verified.

The earlier post-security attempt used the literal `soar-api` name as a Docker
container filter. On resume, Ops used the approved Coolify resource alias
already bound for `soar-api`, found the resource-named container, and extracted
only a redacted, field-limited summary from the approved incident window. Raw
host output stayed in process memory and was not written to disk or attached to
the issue.

Additional redacted evidence:

| Source | Result |
| --- | --- |
| VPS SSH identity probe | pass as non-root `codex`; no mutation |
| Docker container projection | `soar-api` resource-named container present; created `2026-05-31T15:52:23Z`; current state `running`; Docker health object `none`; current state `OOMKilled=false`; current state `ExitCode=0`; current Docker `RestartCount=0` |
| Docker logs, approved incident window | retained; `373` lines for `2026-05-31T20:50:00Z..2026-05-31T21:20:00Z` |
| Docker events, approved incident window, current container filter | `0` retained events |

Redacted crash sequence:

- `2026-05-31T21:07:45.498655705Z`: V8 Mark-Compact allocation pressure near
  the heap limit at approximately `2044 MB` used.
- `2026-05-31T21:07:45.498997780Z`: Node emitted
  `FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed -
  JavaScript heap out of memory`.
- `2026-05-31T21:07:58.001286541Z`: restart path ran
  `prisma migrate deploy`.
- `2026-05-31T21:07:59.244404245Z`: Prisma migration check finished
  successfully with no pending migrations.
- `2026-05-31T21:08:00.015720071Z`: API emitted `server_started`.

Final classification: `memory/OOM/resource pressure`.

Exit code and event caveat: current Docker inspect no longer preserves the
historical crash exit code, and Docker events returned no retained rows for the
current container in the incident window. The retained Docker log is sufficient
to classify the root cause as a Node/V8 heap out-of-memory crash.

Follow-up: [LUC-2291](/LUC/issues/LUC-2291) is assigned to Backend API Engineer
to investigate the API memory/OOM path and propose or implement a durable fix.
