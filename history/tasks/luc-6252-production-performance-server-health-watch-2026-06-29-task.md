# LUC-6252 Production Performance And Server Health Watch - Task Contract

## Header

- ID: [LUC-6252](/LUC/issues/LUC-6252)
- Title: Production performance and server health watch
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Priority: P0
- Mission ID:
  `LUC-6252-PRODUCTION-PERFORMANCE-SERVER-HEALTH-WATCH-2026-06-29`
- Mission Status: VERIFIED

## Context

[LUC-6252](/LUC/issues/LUC-6252) asks DRE to continue the recurring Soar
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

## Implementation Plan

1. Review the latest DRE production-watch evidence pattern.
2. Run read-only deploy smoke against production API/Web.
3. Run authenticated runtime freshness and rollback guard checks.
4. Run representative public/authenticated timing samples.
5. Read Coolify project/resource/deployment projection without printing secrets.
6. Update evidence, local state, and Paperclip disposition.

## Acceptance Criteria

- Deploy smoke passes or fails with exact endpoint evidence.
- Runtime freshness and rollback guard are recorded.
- Timing sample is recorded for public and authenticated production endpoints.
- Coolify resource/deployment projection is recorded without secret values.
- Residual risk and next owner/action are explicit.

## Constraints

- No deploy, push, restart, rollback execution, environment edit, secret value
  readback, DB/Redis mutation, raw log capture, production account mutation,
  subscription/payment mutation, exchange mutation, order, position, or
  live-trading action.
- Do not commit or push from the dirty/divergent shared worktree.
- Keep credential evidence to env-name/presence only.

## Definition Of Done

- [x] Production deploy smoke completed.
- [x] Runtime freshness completed.
- [x] Rollback guard completed.
- [x] Public and authenticated timing completed.
- [x] Coolify read-only projection completed.
- [x] Evidence and source-truth state updated.
- [x] Paperclip disposition attempted with evidence.

## Forbidden

- Do not expose secret values, cookies, tokens, account passwords, API keys,
  payment data, or exchange credentials.
- Do not run a deploy, restart, rollback, migration, DB/Redis write, live
  exchange action, order, or position.
- Do not create a duplicate repair child unless the watch proves an actionable
  production defect.

## Validation Evidence

- Tests:
  - `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` PASS
  - `pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch` PASS with auth env aliases
  - `pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch` PASS with auth env aliases
- Manual checks:
  - public/authenticated timing sample PASS
  - Coolify read-only projection PASS
- Screenshots/logs: not applicable; no browser or raw log capture used.
- High-risk checks: no secret value readback; no production mutation.
- Reality status: verified

## Deployment / Ops Evidence

- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: rollback guard returned `shouldRollback=false`
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Result Report

Done as `DONE / VERIFIED_READ_ONLY / APP_HEALTHY /
MARKET_CATALOG_COLD_SAMPLE_WATCH / COOLIFY_QUEUE_WATCH`.

Evidence:

- `history/evidence/luc-6252-production-performance-server-health-watch-2026-06-29.md`

Validation summary:

- deploy smoke PASS for API `/health`, API `/ready`, Web `/`, Web
  `/api/build-info`, and protected API `/workers/ready`.
- runtime freshness PASS; worker/market heartbeat age `8270 ms`.
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
- Paperclip status update: attempted PATCH to `done`; unconfirmed because the
  local Paperclip API timed out on health probes and issue PATCH.
