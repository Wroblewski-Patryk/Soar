# Coolify VPS Deployment Contract

Last updated: 2026-06-02

This contract describes the current Soar production deployment target. Coolify
must be treated as a hierarchy:

`project -> production environment -> resources`

Do not treat a single legacy app id as the whole deployment.

## Deployment Target

- VPS provider: managed outside repository source truth.
- Coolify project or environment: Soar / production.
- Public domains: `https://soar.luckysparrow.ch`,
  `https://api.soar.luckysparrow.ch`.
- Private services: production PostgreSQL and Redis resources.

## Runtime Inventory

Source: read-only redacted Coolify API inventory captured in
`history/evidence/luc-1371-coolify-resource-inventory-2026-06-02.md` and
refreshed/reconciled for `LUC-1399`, `LUC-1402`, `LUC-1405`, `LUC-1408`,
`LUC-1412`, `LUC-1416`, and `LUC-1418`, then refreshed for `LUC-1422` on
2026-06-02.

Latest `LUC-1422` readback: `2026-06-02T05:33:33Z`. Authenticated
read-only Coolify API calls to the configured Soar project, environment list,
production environment, and resource list succeeded. Production environment id
is `6`. Redacted inventory count is eight resources: six applications plus
PostgreSQL and Redis. Application status is `running:unknown` at the Coolify
inventory layer; data services report `running:healthy`. Application-level
readiness remains a separate release smoke requirement.

| Resource | Coolify type | Dockerfile | Public FQDN | Verification role |
| --- | --- | --- | --- | --- |
| `soar-api` | application | `/apps/api/Dockerfile` | yes | API health/readiness and protected worker-readiness surface |
| `soar-web` | application | `/apps/web/Dockerfile` | yes | Web route and build-info readback |
| `workers-backtest` | application | `/apps/api/Dockerfile.worker.backtest` | no | Backtest worker liveness/freshness |
| `workers-execution` | application | `/apps/api/Dockerfile.worker.execution` | no | Execution worker liveness/freshness |
| `workers-market-data` | application | `/apps/api/Dockerfile.worker.market-data` | no | Market-data worker liveness/freshness |
| `workers-market-stream` | application | `/apps/api/Dockerfile.worker.market-stream` | no | Market-stream worker liveness/freshness |
| `postgresql` | postgresql | n/a | no | Production database dependency |
| `redis` | redis | n/a | no | Cache/queue/rate-limit dependency |

Current inventory count: six applications plus PostgreSQL and Redis.

## Required Artifacts

- Dockerfile paths: listed in runtime inventory above.
- Compose or service-definition paths: `docker-compose.coolify.yml`,
  `docker-compose.coolify.shared-api-image.yml`, `docker-compose.vps.yml`.
- Env example files: `.env.coolify.example`, `.env.vps.example`,
  `.env.docker.example`, `apps/api/.env.example`, `apps/web/.env.example`.
- Health or readiness endpoints: API `/health`, API `/ready`, protected API
  `/workers/ready`, Web `/`, Web `/api/build-info`.
- Migration entrypoint: API deployment path must run the project-approved
  Prisma migration contract before production mutation; do not infer it from
  inventory alone.

## Env And Secrets Contract

- Env files exist as examples only; production values live in Coolify/Paperclip
  secret storage.
- Secret values, tokens, cookies, database URLs, and exchange credentials must
  never be printed or committed.
- Safe examples may contain variable names and non-secret placeholders only.
- Secret rotation ownership: Paperclip Security Review Lead with Ops Release
  Lead for Coolify/VPS execution coordination.
- Residual caveat: an earlier 2026-06-02 runner recorded
  `COOLIFY_SOAR_PROJECT_ID` binding drift, but the LUC-1399 refresh did not
  reproduce it: configured project lookup and production environment lookup
  succeeded. Treat future runner drift as a secret-binding watch item, not as
  an active blocker for the current resource inventory.
- LUC-1398 read-only binding status: `COOLIFY_SOAR_PROJECT_ID` resolves to
  Coolify project `Soar` through authenticated read-only API access. Direct
  `COOLIFY_SOAR_API_APP_ID` and `COOLIFY_SOAR_WEB_APP_ID` aliases returned
  `404` in the same runner, so project/list inventory remains the approved
  read-only status path until Security/Ops refreshes resource-specific aliases.
- LUC-1422 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; the production environment and eight-resource
  projection remain unchanged.

## Release Requirements

- Required checks before deploy: clean release source, pushed source ref,
  migration risk review, required secrets present by name, rollback path,
  resource-by-resource smoke plan.
- Required smoke checks after deploy: API `/health`, API `/ready`, Web `/`,
  Web `/api/build-info`, protected `/workers/ready` with approved read-only
  principal, and resource-level worker liveness/freshness for all four workers.
- Rollback trigger: failed health/readiness, wrong deployed SHA, worker
  non-readiness, migration failure, or security/auth regression.
- Rollback method: Coolify rollback/redeploy to the approved previous source
  ref plus post-rollback public and protected smoke evidence.

## Data Safety

- Backup strategy: production PostgreSQL backup path must be verified before
  release mutation.
- Restore verification expectation: restore drill evidence is required for
  production readiness claims.
- Risky migration policy: stop and request release approval before destructive,
  irreversible, or ambiguous migrations.
