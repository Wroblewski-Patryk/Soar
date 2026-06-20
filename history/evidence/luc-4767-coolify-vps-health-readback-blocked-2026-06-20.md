# LUC-4767 Coolify/VPS Health Readback Blocked

- Issue: [LUC-4767](/LUC/issues/LUC-4767)
- Parent: [LUC-4766](/LUC/issues/LUC-4766)
- Checked at: 2026-06-20T04:27:50+02:00
- Role: Deployment and Reliability Engineer
- Status: `BLOCKED / READ_ONLY_BINDINGS_MISSING / NO_MUTATION`

## Scope

Restore or read the missing Coolify/VPS production health evidence path after
[LUC-4766](/LUC/issues/LUC-4766) verified public and protected production app
health but could not run Coolify/VPS readback.

This heartbeat stayed read-only. It performed no deploy, push, restart,
rollback, env edit, database/Redis mutation, account mutation, secret readback,
screenshot, raw log capture, or live-trading action.

## Names-Only Binding Scan

The current DRE heartbeat runner exposed no environment variable names matching
the required Coolify/VPS production-readback families:

- `COOLIFY*`
- `VPS*`
- `SSH*`
- `SOAR_PROD*`
- `PROD_DB_CHECK*`
- `PRODUCTION_DB_CHECK*`
- `ROLLBACK_GUARD*`
- `RC_*`
- `GATE*`

The runner did expose `LIVEIMPORT_READBACK_*` names, but those do not provide
Coolify/VPS deployment status, resource pressure, PostgreSQL/Redis/container
health, deployment queue, or worker resource-health readback for this issue.
Values were not printed or stored.

## Readback Result

Coolify/VPS server-health projection could not run because the required
read-only binding families are absent from this runtime. Missing proof remains:

- current Coolify deployment status and active deployment queue
- restart/resource pressure by canonical resource
- PostgreSQL and Redis current health from Coolify/VPS view
- container health/status projection for `soar-api`, `soar-web`, and four
  worker applications
- redacted recent log or pressure signals, if available through approved
  read-only tooling
- worker backlog/health projection from the Coolify/VPS or protected worker
  readiness path

## Local Tooling Proof

Focused local proof passed:

```text
pnpm run -s ops:coolify-stack:env-check:test
```

Result: PASS, `11/11` tests. This confirms the local Coolify stack environment
checker still reports only variable names and does not print secret values.

## Unblock Owner And Action

Owner: Paperclip Security/Ops secret-binding owner, with DRE as verification
runner after binding.

Required action: inject approved read-only Coolify/VPS status bindings into the
DRE heartbeat environment, at minimum the Coolify API access family used by
prior verified read-only checks:

- `COOLIFY_BASE_URL`
- `COOLIFY_API_TOKEN` or `COOLIFY_TOKEN`
- `COOLIFY_SOAR_PROJECT_ID`
- `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`
- selector/resource bindings when available by approved name only:
  `COOLIFY_SOAR_TEAM_ID`, `COOLIFY_TEAM_ID`,
  `COOLIFY_SOAR_WEB_APP_ID`, `COOLIFY_SOAR_API_APP_ID`,
  `COOLIFY_SOAR_POSTGRES_RESOURCE_ID`, and
  `COOLIFY_SOAR_REDIS_RESOURCE_ID`

After those bindings are present by name, DRE can rerun the read-only Coolify
projection and publish redaction-safe health evidence.

## Residual Risk

[LUC-4766](/LUC/issues/LUC-4766) remains valid for public smoke, timing samples,
and protected auth/session dashboard proof. The production watch is still
partially verified because server-side Coolify/VPS resource health was not
observable in this runner.
