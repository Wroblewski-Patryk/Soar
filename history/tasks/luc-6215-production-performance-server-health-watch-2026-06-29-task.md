# LUC-6215 Production Performance And Server Health Watch - Task Contract

## Context

[LUC-6215](/LUC/issues/LUC-6215) asks DRE to continue the recurring Soar
production performance and server-health watch. The latest inline wake payload
had no pending comments and `fallbackFetchNeeded=false`, so the heartbeat did
not need thread refetch before concrete verification.

## Goal

Produce a read-only production health watch that distinguishes real production
failure from recurring residual watch items.

## Scope

- Check Soar production API/Web endpoints.
- Check protected workers readiness through the approved smoke login path.
- Check runtime freshness and rollback guard.
- Check representative public and authenticated API timing.
- Check Coolify project/environment/resource/deployment projection.
- Record source/build snapshot and residual risks.

## Constraints

- No deploy, push, restart, rollback execution, environment edit, secret value
  readback, DB/Redis mutation, raw log capture, production account mutation,
  subscription/payment mutation, exchange mutation, order, position, or
  live-trading action.
- Do not commit or push from the dirty/divergent shared worktree.
- Keep credential evidence to env-name/presence only.

## Definition Of Done

- Deploy smoke passes or fails with exact endpoint evidence.
- Runtime freshness and rollback guard are recorded.
- Timing sample is recorded for public and authenticated production endpoints.
- Coolify resource/deployment projection is recorded without secret values.
- Residual risk and next owner/action are explicit.
- Local state and Paperclip issue disposition are updated.

## Forbidden

- Do not expose secret values, cookies, tokens, account passwords, API keys,
  payment data, or exchange credentials.
- Do not run a deploy, restart, rollback, migration, DB/Redis write, live
  exchange action, order, or position.
- Do not create a duplicate repair child unless the watch proves an actionable
  production defect.

## Stage

`verification`

## Result Report

Done as `DONE / VERIFIED_READ_ONLY / APP_HEALTHY /
MARKET_CATALOG_COLD_SAMPLE_WATCH / COOLIFY_QUEUE_WATCH`.

Evidence:

- `history/evidence/luc-6215-production-performance-server-health-watch-2026-06-29.md`

Validation summary:

- deploy smoke PASS for API `/health`, API `/ready`, Web `/`, Web
  `/api/build-info`, and protected API `/workers/ready`.
- runtime freshness PASS; worker/market heartbeat age `10341 ms`.
- rollback guard PASS with `shouldRollback=false`, no reasons, no alerts.
- public timing returned HTTP `200` for all sampled endpoints.
- authenticated dashboard/admin timing returned HTTP `200` for all sampled
  endpoints; market-catalog cold sample normalized in focused follow-up.
- Coolify read-only projection PASS for version, current team, project,
  environments, production, resources, and deployments.

Residual:

- Coolify deployment queue still shows eight queued rows across
  `3bd65e21d09f294a18d3317d2f59f7a0d4e577b4` and
  `c357d957741f56835f27a1fc3a948dad43a91036`.
- Coolify application status remains `running:unknown`.
- market-catalog cold sample remains a watch item.
- build provenance remains diagnostic through `metadataSource=env-runtime`.
- host-level VPS/log-window proof remains approval-gated.

Source-control closure:

- Repo path: `C:/Personal/Projekty/Aplikacje/Soar`
- Files changed by this task: evidence/task/state updates only.
- Commit: not committed; shared worktree was already dirty/divergent and no
  deployable code changed.
- Push: not needed and not authorized.
- Deploy impact: none.
