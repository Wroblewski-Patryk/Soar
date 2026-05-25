# Coolify Service Stack Liveness Gate Task

## Header
- ID: `COOLIFY-SERVICE-STACK-LIVENESS-GATE-2026-05-25`
- Title: Use liveness healthcheck for first Coolify Service Stack rollout
- Task Type: release
- Current Stage: verification
- Status: IN_PROGRESS
- Owner: Ops/Release
- Depends on: `COOLIFY-SERVICE-STACK-MIGRATION-2026-05-25`
- Priority: P0
- Module Confidence Rows: `SOAR-OPERATIONS-001`, `SOAR-WORKERS-001`
- Requirement Rows: Coolify Service Stack migration, production deploy safety
- Quality Scenario Rows: deployment reliability, rollback readiness, observability
- Risk Rows: deploy fanout, readiness-gated stack startup, production VPS stability
- Iteration: 2026-05-25
- Operation Mode: BUILDER
- Mission ID: `SOAR-FULL-READINESS-COORDINATION-2026-05-23`
- Mission Status: IN_PROGRESS

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the active deployment-repair iteration.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed through the active mission packet.
- [x] `.agents/core/mission-control.md` was reviewed through the active mission packet.
- [x] Missing or template-like state tables were not introduced.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence, not only local code appearance.

## Context

The first parallel Coolify Compose Application deployed the new Soar stack build
successfully, then failed during `docker compose up -d` because `api` became
unhealthy and the dependent `web` and worker services waited on
`condition: service_healthy`.

The manifest used `/ready` as the Docker healthcheck. `/ready` is a dependency
and release-readiness gate; it must remain part of post-deploy smoke, but it is
too strict as the container liveness gate for bringing up a parallel stack.

## Goal

Let the parallel stack start through an API liveness check while preserving
explicit `/ready` verification before traffic cutover or acceptance.

## Scope

- Change only the Coolify stack API Docker healthcheck.
- Update operations docs to keep `/health` and `/ready` semantics explicit.
- Validate the manifest locally before a controlled redeploy.
- Keep the old six Coolify Applications available as rollback.

## Constraints

- Do not expose production secrets in logs, docs, or artifacts.
- Do not cut over production domains before temp-domain stack smoke passes.
- Do not delete old production Applications during this task.
- Do not run LIVE exchange-side mutations.

## Implementation Plan

1. Switch `docker-compose.coolify.yml` API healthcheck from `/ready` to `/health`.
2. Document that `/ready` is a post-deploy smoke and release-readiness gate.
3. Run local compose and env-check validation.
4. Commit and push the minimal fix.
5. Redeploy the parallel stack, then smoke temp API/Web and production public health.

## Acceptance Criteria

- `pnpm run docker:coolify:config` passes.
- `pnpm run ops:coolify-stack:env-check:test` passes.
- `pnpm run ops:coolify-stack:env-check:example` passes.
- `pnpm run quality:guardrails` passes.
- Production public `/health` and `/ready` remain healthy during work.
- Parallel stack deploy status and temp-domain smoke are recorded before any cutover decision.

## Definition Of Done

- Source, docs, and state files are synchronized.
- Validation evidence is listed in this task.
- Temporary Coolify API tokens and secret-bearing temp files are removed or explicitly handed off for revocation.
- Residual risks are documented.

## Result Report

- In progress. Local manifest validation and guardrails passed after the
  liveness change. Production public API `/health` and `/ready` remained `200`
  after VPS restart. The first redeploy of the liveness change still failed
  during `docker compose up -d` because Web/workers waited on API
  `service_healthy` before the compose command could finish. The manifest now
  changes Web/worker dependencies to API `service_started`; readiness remains
  enforced by explicit smoke before cutover. Parallel stack redeploy and token
  cleanup remain open.
