# Local Windows / Production Coolify Environment Matrix and Secrets Policy

Date: 2026-04-03  
Owner: Ops + Backend + Frontend  
Scope: canonical contract for the two Soar environments: local Windows and the existing Coolify production VPS.

## Purpose
- Define one immutable environment contract for all runtime services (`api`, `web`, `workers`).
- Prevent secret drift between environments.
- Keep local validation and production deployment on an exact candidate SHA without implying a separate STAGE or a second VPS.

This document is canonical for environment/secrets policy. If another doc differs, this doc wins.

## Environment Matrix

| Environment | Runtime intent | Infra source | Data isolation | Deploy source | Secret source |
|---|---|---|---|---|---|
| LOCAL (Windows) | Development, isolated `_test`/Redis and authenticated local acceptance | Local services/containers | Local test data only | Selected checkout/SHA; no production deploy | Local `.env` files (never committed) |
| PROD (existing Coolify VPS) | User-facing runtime and production proof | Existing Coolify Postgres/Redis, API, Web and workers | Production data only | Operator-controlled deploy of exact approved SHA | Coolify env vars only |

## Service Variable Contract

### API (`apps/api`)

Required in PROD:
- `NODE_ENV=production`
- `DATABASE_URL`
- `REDIS_URL`
- `SERVER_URL`
- `CLIENT_URL`
- `CORS_ORIGINS`
- `JWT_SECRET`
- `API_KEY_ENCRYPTION_KEYS`
- `API_KEY_ENCRYPTION_ACTIVE_VERSION`

Optional but supported:
- `JWT_SECRET_PREVIOUS`
- `JWT_SECRET_PREVIOUS_UNTIL`
- `COOKIE_DOMAIN`
- `COOKIE_SAME_SITE`
- `API_AUTO_MIGRATE` (default `true`; controls `prisma migrate deploy` on API startup)
- Runtime tuning flags (`RUNTIME_*`, `WORKER_*`, `MARKET_STREAM_*`, `OPS_*`)

### Web (`apps/web`)

Required in PROD:
- `NODE_ENV=production`
- `NEXT_PUBLIC_API_BASE_URL`

### Workers (`apps/api` worker process)

Required in PROD:
- `NODE_ENV=production`
- `DATABASE_URL`
- `REDIS_URL`
- Queue/runtime keys used by workers (`WORKER_*`, selected `RUNTIME_*`)

## Secrets Classification

### Class A (critical secrets)
- `DATABASE_URL`
- `REDIS_URL` (if credentialed)
- `JWT_SECRET`
- `JWT_SECRET_PREVIOUS`
- `API_KEY_ENCRYPTION_KEYS`

Rules:
- Never stored in repository.
- Never printed in logs, errors, CI output, screenshots, or docs.
- Managed in Coolify secrets for PROD; local test secrets stay local and distinct.
- Rotation must preserve continuity (for JWT and encryption keys).

### Class B (sensitive operational configuration)
- `CORS_ORIGINS`
- `SERVER_URL`, `CLIENT_URL`
- `OPS_ALLOWED_IPS`
- Exchange test toggles and runtime tuning flags.

Rules:
- Keep environment-specific values separated per env.
- Changes require change note in operations/planning logs.

### Class C (public/non-secret runtime config)
- `NODE_ENV`
- `NEXT_PUBLIC_API_BASE_URL`
- Non-sensitive feature toggles.

Rules:
- Safe to document.
- Still environment-scoped; local validation must not use production endpoints or credentials.

## Non-Negotiable Policy Rules

1. No secrets in git history.
- `.env`, `.env.*`, local dumps, and copied production env snapshots must stay untracked.

2. Local and production credentials stay separate.
- Local tests must not use production secrets or production data.

3. Production deployment uses the selected exact SHA.
- Record the local gate SHA and the deployed image/source SHA; a local PASS is not production evidence.
- A SHA or image mismatch blocks release sign-off.

4. Secret rotation is mandatory and auditable.
- `JWT_SECRET_PREVIOUS` + `JWT_SECRET_PREVIOUS_UNTIL` used for safe JWT rotation windows.
- `API_KEY_ENCRYPTION_KEYS` is versioned; `API_KEY_ENCRYPTION_ACTIVE_VERSION` must point to active key.

5. Log redaction is mandatory.
- Any diagnostic output that may include env values must be sanitized.

## Validation Checklist (per environment)

Before declaring env ready:
- API `/health` and `/ready` return `200`.
- Web can reach API via configured `NEXT_PUBLIC_API_BASE_URL`.
- Workers report healthy heartbeat.
- DB and Redis point to expected environment resources.
- Class A secrets present and non-empty.
- Local configuration does not point to PROD data; PROD endpoints and credentials match the approved Coolify deployment.
- Before PROD: owner approval, backup/restore and rollback proof, migration plan, stop-before-start worker switch, and protected signed-in acceptance are recorded.

## Related Documents
- `history/plans/deployment-dev-prod-coolify-plan-2026-04-02.md`
- `docs/operations/v1-ops-runbook.md`
- `docs/operations/v1-rc-external-gates-runbook.md`
