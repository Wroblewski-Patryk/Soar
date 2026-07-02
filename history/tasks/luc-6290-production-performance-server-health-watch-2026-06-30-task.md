# LUC-6290 Production Performance And Server Health Watch - Task Record

## Context

[LUC-6290](/LUC/issues/LUC-6290) is the recurring DRE production performance
and server-health watch for Soar.

The prior watch [LUC-6271](/LUC/issues/LUC-6271) was healthy but kept these
watch items open: market-catalog cold first sample, Coolify queued deployment
rows, mixed Coolify application source projections, host-level VPS proof, and
release-grade build provenance.

## Goal

Run the smallest read-only production proof that can determine whether Soar is
currently healthy or needs a narrow incident/repair lane.

## Scope

- Public API/Web smoke
- Protected workers readiness through approved runner auth resolver
- Runtime freshness
- Rollback guard
- Representative public/authenticated API timing
- Coolify production resource projection
- Evidence and state update

## Constraints

- No deploy, push, restart, rollback execution, env edit, secret/account value
  readback, DB/Redis mutation, raw log capture, production account mutation,
  subscription/payment mutation, exchange mutation, order, position, or
  live-trading action.
- Use canonical production domains.
- Do not create duplicate work for already-known residual gates unless this
  heartbeat finds a new regression.

## Implementation Plan

1. Read Paperclip heartbeat context and current Soar state.
2. Run read-only production smoke and runtime checks.
3. Run representative timing probes and compare with previous watch residuals.
4. Run redacted Coolify read-only projection.
5. Record evidence, update source-of-truth state, and close the issue with a
   clear disposition.

## Acceptance Criteria

- Production smoke result recorded.
- Runtime freshness and rollback guard result recorded.
- Timing result recorded with market-catalog interpretation.
- Coolify projection recorded without secret values.
- New repair child created only if a new regression is found.
- Paperclip issue status reflects the result.

## Definition Of Done

- Evidence file exists:
  `history/evidence/luc-6290-production-performance-server-health-watch-2026-06-30.md`.
- Project state summaries reference the current health result.
- Paperclip issue [LUC-6290](/LUC/issues/LUC-6290) is marked `done` when the
  read-only watch completes without a new repair requirement.

## Result Report

Status:
`DONE / VERIFIED_READ_ONLY / PRODUCTION_RUNTIME_HEALTHY / ROLLBACK_NOT_REQUIRED /
MARKET_CATALOG_COLD_SAMPLE_WATCH / COOLIFY_QUEUE_WATCH`.

Validation:

- Deploy smoke PASS on expected Web SHA
  `c357d957741f56835f27a1fc3a948dad43a91036`.
- Runtime freshness PASS with worker/market heartbeat age around `1.6s`.
- Rollback guard PASS with `shouldRollback=false`, reasons `[]`, alerts `[]`.
- Representative timing PASS; market catalog cold sample `1227.0 ms`, then
  focused follow-up max `90.1 ms`.
- Coolify production projection PASS for project/environment/resource reads;
  PostgreSQL and Redis `running:healthy`; global deployments endpoint still
  shows `8` queued rows.

No new repair child was created.

Source-control closure:

- Application/repo path: `C:/Personal/Projekty/Aplikacje/Soar`
- Commit: not committed, because this heartbeat produced evidence/state only
  and the shared workspace is pre-existing dirty/divergent.
- Push: not needed.
- Deploy impact: none.
