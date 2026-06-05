# LUC-2285 Clear Soar Web Queued Deployments And Redeploy Main SHA

## Header

- ID: `LUC-2285-CLEAR-SOAR-WEB-QUEUE-REDEPLOY-MAIN-SHA-2026-06-05`
- Title: Clear `soar-web` queued deployments and redeploy main SHA
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Ops Release Lead
- Issue: [LUC-2285](/LUC/issues/LUC-2285)
- Priority: critical

## Context

[LUC-2280](/LUC/issues/LUC-2280) exhausted a single restart permit without
recovering production Web. [LUC-2282](/LUC/issues/LUC-2282) prepared a narrow
redeploy permit after read-only evidence showed `soar-web` was `503` and
Coolify had stale queued deployment rows for
`6e31d814046b640ad529d1cd57f968ba6f67b05e`.

## Goal

Use the LUC-2285 release mutation permit to drain only the `soar-web` queue
and verify one controlled redeploy path for `main` at
`6e31d814046b640ad529d1cd57f968ba6f67b05e`.

## Constraints

- Mutate only the Coolify `soar-web` application resource.
- Use existing Paperclip/Coolify secret bindings without printing values.
- Do not deploy dirty local source assumptions.
- Do not mutate API, workers, database, Redis, env, DNS, team/account,
  protected credentials, exchange settings, or live-trading state.
- Do not chain rollback, second redeploy, or restart from this permit.

## Definition Of Done

- Pre-state confirms source SHA and current Web/API readiness.
- Coolify readback identifies the target `soar-web` deployment state.
- Exactly the permitted Web-only recovery path is observed/performed.
- Post-state smoke and Coolify readback are recorded.
- If Web remains unhealthy, stop and block with owner/action.

## Forbidden

- Secret value logging
- rollback execution under this permit
- API/worker/database/env/account/exchange/live-trading mutation
- duplicate deploy after stop condition fires
- treating public Web failure as V1 readiness

## Result Report

Status: blocked.

Evidence:

- `history/evidence/luc-2285-soar-web-queue-clear-redeploy-main-sha-2026-06-05.md`

Summary:

- local `HEAD` and `origin/main` both matched
  `6e31d814046b640ad529d1cd57f968ba6f67b05e`
- Coolify exposed one active `soar-web` deployment for that exact SHA and no
  stale queued `soar-web` rows at inspection time
- `ops:deploy:wait-web-build-info` timed out after six minutes with Web still
  `503`/one `502` and no build-info metadata
- final public deploy smoke kept API healthy but Web failed:
  - API `/health` PASS `200`
  - API `/ready` PASS `200`
  - Web `/` FAIL `503`
  - Web `/api/build-info` FAIL `503`
- final Coolify app readback: `soar-web=restarting:unknown`,
  `last_restart_type=crash`, `last_restart_at=2026-06-05T20:58:25Z`
- deployment list then returned zero visible `soar-web` rows
- app logs endpoint returned `400 Application is not running.`
- `pnpm run ops:coolify-stack:env-check:test` passed (`8/8`)

Deployment impact: production Web remains unavailable. API stayed healthy.

Residual risk: the deploy queue symptom appears cleared, but the Web container
crash/start failure remains. A fresh rollback or host-level recovery permit is
required before any further production mutation.

## Resume Update

[LUC-2294](/LUC/issues/LUC-2294) resolved the Security blocker by approving a
constrained read-only retrieval path, but did not authorize rollback or any
production mutation. Ops created [LUC-2298](/LUC/issues/LUC-2298) as the
separate follow-up lane for redacted `soar-web` deployment-history retrieval
and rollback-permit preparation.

[LUC-2285](/LUC/issues/LUC-2285) is complete as a queue-clear/redeploy permit
and must not be used for another deploy, restart, rollback, env edit, or broader
queue cleanup.
