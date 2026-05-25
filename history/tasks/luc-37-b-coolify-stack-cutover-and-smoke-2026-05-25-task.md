# Task

## Header
- ID: LUC-37-B
- Title: [Soar][Delivery] Finish Coolify single-stack cutover and candidate smoke
- Task Type: release
- Current Stage: planning
- Status: IN_PROGRESS
- Owner: Ops/Release Engineer
- Depends on: LUC-37 planning packet
- Priority: P1
- Module Confidence Rows: runtime/ops readiness rows for API/Web/workers
- Requirement Rows: Deployment and SLO readiness requirements in release tooling
- Risk Rows: deploy rollback ambiguity, stale deploy candidate risk
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: PLANNED

## Context
Parallel Coolify stack migration is implemented locally and the next hard dependency is a reproducible, smoke-verified deploy candidate on temp domains after the API liveness correction.

## Goal
Own the production deployment lane that validates a stable stack, enables real protected-proof execution, and provides clean rollback path.

## Scope
- `docker-compose.coolify.yml` and shared-API optional variant.
- `.env.coolify.example` + env-check checks.
- Coolify deployment sequencing, rollout/rollback docs, health/readiness smoke.

## Success Signal
- API `/health` 200, `/ready` 200, Web `/`, and `/api/build-info` all pass on deployed stack candidate.
- Worker containers healthy and running on the same expected SHA.
- Rollback plan executed once as a documented simulation.

## Lane Plan
1. Prepare temp-domain stack deployment with copied production env values (secret-safe workflow).
2. Deploy and run smoke sequence: API health/readiness, Web root, build-info, worker liveness.
3. Validate log-level stability and container count on candidate domain.
4. Update evidence packet with rollback/cutover decision.
5. Handover candidate to QA/security lanes.

## Dependencies
- No active deployment blockers in `.env.coolify` or `docker compose` config.
- Coordination with `LUC-37-C`/`LUC-37-D` for sequencing protected proof on candidate.

## Required Output
- Deployment evidence package (artifact paths).
- Rollback/cleanup checklist for temporary stack.
- Candidate SHA mapping in release-doc artifacts.

## Validation
- `ops:coolify-stack:env-check:test`
- `pnpm docker:coolify:config` and/or equivalent stack config validation
- Build-info/web/api/builds smoke proof on temp domain.

## Acceptance Criteria
- [ ] Single-stack deploy candidate is reproducible and documented.
- [ ] Worker/API/Web status proof exists for the same SHA.
- [ ] Rollback route is explicit and tested by dry-run.
- [ ] Candidate handed over with explicit readiness blockers list to QA/security lanes.

