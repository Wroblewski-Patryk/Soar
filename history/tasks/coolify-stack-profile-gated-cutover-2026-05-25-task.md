# Coolify Stack Profile-Gated Cutover - 2026-05-25

## Context

The Soar production deployment is still represented by six Coolify
Applications. A previous parallel stack deploy proved that the shared API image
reduces build fanout, but starting API, Web, and all workers together is too
risky while production workers already own the queues.

## Goal

Make the Coolify stack migration safe to perform in two phases:

1. deploy and smoke only API/Web on temporary domains;
2. enable workers only during the final cutover with `COMPOSE_PROFILES=workers`.

## Constraints

- Keep production Postgres and Redis external.
- Do not duplicate worker queue consumers during the temporary smoke phase.
- Keep `/health` as Docker liveness and `/ready` as explicit post-deploy
  readiness proof.
- Do not print or commit production secrets.

## Definition Of Done

- Worker services are profile-gated in the Coolify stack manifests.
- API healthcheck has enough startup grace for migration/startup work.
- Operations documentation describes the two-phase rollout.
- Local stack syntax and env checks pass.

## Result Report

- Updated `docker-compose.coolify.yml` and
  `docker-compose.coolify.shared-api-image.yml` so all four worker services use
  the `workers` Compose profile.
- Increased API healthcheck startup grace to `180s` and retries to `20`.
- Updated `.env.coolify.example` and env validation to document
  `COMPOSE_PROFILES=workers` as final-cutover configuration.
- Updated `docs/operations/coolify-linux-vps-setup-guide.md` with the
  temporary API/Web smoke phase and final worker/domain cutover sequence.

## Verification

- `corepack pnpm run docker:coolify:config` - PASS.
- `corepack pnpm run docker:coolify:shared-api:config` - PASS.
- `docker compose -f docker-compose.coolify.yml config --services` with
  required variables and no `COMPOSE_PROFILES` - PASS, only `api` and `web`.
- `corepack pnpm run ops:coolify-stack:env-check:test` - PASS.
- `corepack pnpm run ops:coolify-stack:env-check:example` - PASS.
- `corepack pnpm run quality:guardrails` - PASS.

## Residual Risk

Production cutover still requires Coolify API execution and smoke proof. The
old six Applications must remain available as rollback until the single stack
passes API, Web, build-info, worker, and monitoring-window checks.
