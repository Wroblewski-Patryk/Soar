# Coolify Linux VPS Setup Guide (Service Mapping + Domains)

Date: 2026-04-03  
Owner: Ops + Release Engineering  
Scope: `DPL-03`

## Purpose
Provide one repeatable setup path for hosting CryptoSparrow on a Linux VPS with Coolify, including:
- service split (`postgres`, `redis`, `api`, `web`, `workers`),
- domain routing,
- deployment checks.

This guide is for the active PROD environment. Stage is intentionally parked as
of 2026-04-29 to avoid unused redeploy queues and duplicated VPS resource usage.
Reintroduce it only when the project again needs pre-production validation.

## Target Topology

For the active `prod` environment deploy:
1. Postgres service
2. Redis service
3. API service (`apps/api`)
4. Web service (`apps/web`)
5. Workers service (`apps/api` workers)

Do not run workers inside API process in VPS deployment.
Deployed worker ownership contract:
- canonical healthy state = split workers
- inline worker ownership is not a normal VPS topology
- if inline is ever used as an emergency fallback, treat the environment as
  degraded until split ownership is restored

## Domain Routing Contract

Production:
- Web: `soar.luckysparrow.ch`
- API: `api.soar.luckysparrow.ch`

Stage:
- currently disabled/removed from active Coolify deployment
- previous pattern, if reintroduced later:
  - Web: `stage.soar.luckysparrow.ch`
  - API: `stage-api.soar.luckysparrow.ch`

## Prerequisites

On VPS host:
- Docker Engine installed
- Coolify installed and reachable
- DNS records prepared for web/api domains
- Firewall open for HTTPS (`443`) and Coolify access path

Repository requirements:
- monorepo available to Coolify
- lockfile present (`pnpm-lock.yaml`)

## Step 1: Create Coolify Project and Environment

1. In Coolify, create project: `cryptosparrow`.
2. Create or keep only the `production` environment active.
3. If stage is reintroduced later, keep stage and prod resources separate and
   disable auto-deploy until the stage workflow is intentionally restored.

## Step 2: Provision Data Services

### Postgres
- Add managed Postgres service.
- Persistent volume required.
- Set database name/user/password.
- Capture internal connection string for app services.

### Redis
- Add managed Redis service.
- Persistent volume recommended.
- Capture internal connection string.

## Step 3: Add API Service (`apps/api`)

Docker build configuration (Coolify):
- Source: repository root (monorepo)
- Build pack: `Dockerfile`
- Docker build context: repository root (`.`)
- Dockerfile location: `apps/api/Dockerfile`
- Exposed port: `3001`

Runtime command:
- keep image default command (`node scripts/start-with-migrate.mjs`)
- startup behavior:
  1. run `prisma migrate deploy`,
  2. start API only if migrations succeed.

Health checks:
- `/health`
- `/ready`

Container liveness for the Coolify Service Stack uses `/health`. Do not use
`/ready` as the Docker healthcheck because it is a dependency/readiness gate
and can block Web/workers from starting during a parallel-stack rollout. Always
verify `/ready` separately in the post-deploy smoke before accepting traffic.
Web and worker services depend on API `service_started`, not `service_healthy`,
so `docker compose up -d` can finish while readiness is still being verified by
explicit smoke checks.

Required environment variables:
- `NODE_ENV=production`
- `DATABASE_URL=<coolify-postgres-url>`
- `REDIS_URL=<coolify-redis-url>`
- `SERVER_URL=https://api.<env-domain>`
- `CLIENT_URL=https://<web-env-domain>`
- `CORS_ORIGINS=https://<web-env-domain>`
- `JWT_SECRET=<secret>`
- `COOKIE_DOMAIN=<shared-parent-domain>` (optional, for shared subdomain sessions, e.g. `luckysparrow.ch`)
- `COOKIE_SAME_SITE=<lax|strict|none>` (optional, default `lax`; use `none` only when web/api are cross-site)
- `API_KEY_ENCRYPTION_KEYS=<versioned-keys>`
- `API_KEY_ENCRYPTION_ACTIVE_VERSION=<active-version>`
- `COINGECKO_API_BASE_URL=https://api.coingecko.com/api/v3`
- `COIN_ICON_CACHE_TTL_MINUTES=360` (recommended baseline; tune per traffic profile)

Optional but recommended in PROD:
- `COINGECKO_API_KEY=<secret>`

Optional migration toggle:
- `API_AUTO_MIGRATE=true` (default behavior in API image)
- set `API_AUTO_MIGRATE=false` only for emergency/maintenance windows

Reference: `docs/operations/dev-stage-prod-environment-matrix.md`

## Step 4: Add Web Service (`apps/web`)

Docker build configuration (Coolify):
- Source: repository root (monorepo)
- Build pack: `Dockerfile`
- Docker build context: repository root (`.`)
- Dockerfile location: `apps/web/Dockerfile`
- Exposed port: `3002`

Runtime command:
- keep image default command (`pnpm --filter web start`)

Required environment variables:
- `NODE_ENV=production`
- `NEXT_PUBLIC_API_BASE_URL=https://api.<env-domain>`

Build-time deploy identity variables:
- `SOURCE_COMMIT=$SOURCE_COMMIT` when deploy-proof endpoints must expose the active web commit SHA
- `SOURCE_BRANCH=$COOLIFY_BRANCH` when deploy-proof endpoints must expose the active deployed branch

Deploy-proof note:
- In Coolify `Advanced` settings for the web application, enable `Include Source Commit in Build` when the build process must see `SOURCE_COMMIT`.
- The current Soar web build metadata path reads sources in this order:
  `SOURCE_COMMIT` / `SOURCE_BRANCH` environment or build args, repository
  `git`, repository `.git` files, GitHub `main` branch readback, then
  `unknown`.
- Dockerfile stages that consume Coolify build args must declare the matching
  `ARG SOURCE_COMMIT`, `ARG SOURCE_BRANCH`, and `ARG COOLIFY_BRANCH` names in
  that stage before the Web build command; otherwise the deployment can import
  the right commit while `/api/build-info` still reports `gitSha: null`.

## Step 5: Add Workers Service

Create dedicated worker services from the same API image.
Process ownership contract: `api` does not own worker lifecycle in production.

For deterministic production behavior create separate services:
- `workers-market-data`
- `workers-market-stream`
- `workers-backtest`
- `workers-execution`

Each worker service config:
- Build pack: `Dockerfile`
- Docker build context: repository root (`.`)
- Dockerfile location:
  - `workers-market-data` -> `apps/api/Dockerfile.worker.market-data`
  - `workers-market-stream` -> `apps/api/Dockerfile.worker.market-stream`
  - `workers-backtest` -> `apps/api/Dockerfile.worker.backtest`
  - `workers-execution` -> `apps/api/Dockerfile.worker.execution`
- Exposed port: none

On the 8 GiB production VPS, configure Coolify **Resource Limits** for each
separate application before redeploying: API memory `2g` and memory+swap `3g`,
web `1g` and memory+swap `1536m`, each worker `768m` and memory+swap `1g`.
Save and restart/redeploy the applications, then verify the recreated containers
with `docker inspect --format '{{.HostConfig.Memory}} {{.HostConfig.MemorySwap}}' <container>`.
These values are initial host-protection limits after the 2026-10-17 global OOM;
adjust only against measured peak usage and keep capacity for Coolify,
PostgreSQL, Redis, other applications, and builds. A direct `docker update` on
the current container does not persist through Coolify container replacement.

Shared worker env:
- `NODE_ENV=production`
- `DATABASE_URL=<coolify-postgres-url>`
- `REDIS_URL=<coolify-redis-url>`
- runtime/queue keys required by current worker contract (`WORKER_*`, selected `RUNTIME_*`)
- `BINANCE_STREAM_URL` only when intentionally overriding the canonical default
  market-type endpoint

Binance stream endpoint contract:
- `SPOT` workers default to `wss://stream.binance.com:9443/ws`
- `FUTURES` workers default to `wss://fstream.binance.com/ws`
- do not point `FUTURES` runtime to the spot websocket unless an explicit
  degraded/test scenario is documented

Operational rule:
- a deployment is not considered topology-complete unless the split worker
  services are present and healthy

## Step 5A: Local Docker Parity Before VPS Changes

Before changing Coolify Dockerfiles, service commands, worker ownership,
runtime env wiring, or deploy smoke scripts, run the local Docker app stack from
the repository root:

```bash
pnpm run docker:app:config
pnpm run docker:app:build
pnpm run docker:app:up
pnpm run docker:app:ps
```

The local parity stack uses `docker-compose.vps.yml` with `.env.docker`, starts
local Postgres and Redis through the `infra` profile, and runs the same split
service shape expected in Coolify:
- `api`
- `web`
- `workers-market-data`
- `workers-market-stream`
- `workers-backtest`
- `workers-execution`

Use `pnpm run docker:app:down` after verification. Keep production secrets and
live exchange credentials out of `.env.docker` unless a protected read-only
proof has been explicitly authorized for the current task.

## Step 5B: Preferred Coolify Service Stack Migration

As of 2026-05-25, the preferred production shape for app processes is a single
Coolify Service Stack using `docker-compose.coolify.yml`.

Why this exists:
- the previous production shape used six separate Coolify Applications for API,
  Web, and four workers;
- each application could enqueue an independent build/deploy, increasing queue
  pressure and making same-SHA rollout harder;
- recent production evidence showed API heap pressure and VPS reachability
  instability, so deploy fanout should be reduced before further release gates.
- the active stack manifest builds the API image once and runs all four workers
  from that image with command overrides, avoiding repeated API/worker image
  builds on the VPS.

First migration scope:
- include app processes only:
  - `api`
  - `web`
  - `workers-market-data`
  - `workers-market-stream`
  - `workers-backtest`
  - `workers-execution`
- keep existing production Postgres and Redis resources external to the stack;
- do not migrate database or Redis persistent data in the same task.

Required Coolify setup:
1. Create a new Resource in the Soar production environment using Docker
   Compose / Service Stack.
2. Paste `docker-compose.coolify.yml`.
3. Copy environment values from the existing production resources into Coolify
   stack variables. Use `.env.coolify.example` only as a key checklist, never
   as production secret material.
4. Set:
   - `SOURCE_COMMIT=<exact candidate SHA>`
   - `SOURCE_BRANCH=main`
   - `COOLIFY_BRANCH=main`
   - `SERVICE_FQDN_API_3001=https://api.soar.luckysparrow.ch`
   - `SERVICE_FQDN_WEB_3002=https://soar.luckysparrow.ch`
5. Use the existing production `DATABASE_URL` and `REDIS_URL`.
6. Confirm `API_KEY_ENCRYPTION_KEYS` and
   `API_KEY_ENCRYPTION_ACTIVE_VERSION` match current production. Do not rotate
   encryption keys during this topology migration.
7. Keep the old six Application resources registered for rollback until the
   stack passes smoke and the release owner accepts cutover. Their worker
   processes must not overlap the new stack workers.

Cutover order:
1. Freeze normal deploy promotion.
2. Record current stable SHA and current Coolify resource list.
3. Confirm backup/restore status for Postgres and Redis/AOF sanity.
4. Prepare the candidate API image from the selected exact Git SHA **without
   starting any candidate process**, using the isolated Buildx path below.
   Preserve its builder-generated metadata file. It must bind the resolved Git
   source SHA, Buildx build ID and OCI index digest. The revision label is copied
   from the build ARG and is only a consistency check. Both Compose files now
   require `API_STACK_IMAGE=repository@sha256:<OCI index digest>` and have no API
   build stanza; a missing image reference fails configuration. A tag, label or
   web build-info alone is not provenance. Confirm separately that the actual
   Coolify start consumes this digest without rebuilding it, or this cutover is
   NO-GO.
5. Stop the old four worker Applications and old API. This conservative cutover
   does not rely on an unverified claim that the old API has no inline worker.
   Wait for every old worker and API container to report `Running=false` and
   `Pid=0`; do not merely request a stop. Keep the old Applications registered
   and do not delete their data.
6. Capture a fresh, complete, no-secret Coolify resource inventory and run the
   [worker switch preflight](#worker-switch-preflight) **before** starting the
   new stack on the target VPS with the same resolved `SOURCE_COMMIT` and
   `API_STACK_IMAGE` values intended for Compose. It checks local Git HEAD and
   clean status, builder metadata, the pinned OCI index/platform/config digests,
   the API image ID and the rendered image references of all five roles in both
   Compose files. It also cross-checks the snapshot against a live, read-only
   enumeration of all Docker containers. A FAIL,
   missing or additional Soar container, unknown state, stale snapshot, source
   mismatch, or image mismatch blocks the start. Its local procedural PASS is
   not deployed proof: separately bind the actual Coolify resource/deployment
   ID and running image digest to the Buildx record. If that readback is
   unavailable or does not match, **NO-GO**.
7. Start the new stack from the verified immutable candidate image. Do not
   rebuild from a moving branch between preflight and start. If the deployment
   mechanism rebuilds or changes the image ID, stop acceptance and investigate.
8. Confirm API health:
   - stack `api` is healthy through the container liveness `/health` check;
   - public `https://api.soar.luckysparrow.ch/health` returns `200`;
   - public `https://api.soar.luckysparrow.ch/ready` returns `200`.
9. Confirm Web health:
   - stack `web` is healthy;
   - public `https://soar.luckysparrow.ch/` returns `200`;
   - `https://soar.luckysparrow.ch/api/build-info` reports the expected
     `SOURCE_COMMIT`.
10. Confirm worker state:
   - all four worker containers are running;
    - the running API and all four workers have the preflight image ID and
      revision label; no old worker container is running;
   - no crash-loop or restart storm is visible in stack logs;
   - worker readiness/runtime freshness proof passes.
11. Run the post-deploy smoke checklist and release/SLO gate appropriate for the
   candidate.
12. Only after the stack is accepted, detach old API/Web domains if needed.
    Leave old worker Applications stopped. Do not delete old resources until at
    least one stable monitoring window is captured.

### Worker switch preflight

Build the runtime image from a full, immutable Git commit in an isolated
registry/builder first. This is a **build**, never a production deploy. Use a
registry and repository authorized for candidate images; do not put credentials
in the metadata file or repository. The example uses a shell on the isolated
builder, with `SOURCE_COMMIT` set to the exact pushed Git SHA and `CANDIDATE_TAG`
set to a temporary registry tag. Preserve the generated metadata alongside the
candidate release evidence, outside the source tree:

```bash
docker buildx build --platform linux/amd64 --target runtime \
  --provenance=mode=min --metadata-file "$BUILD_METADATA" \
  --build-arg "SOURCE_COMMIT=$SOURCE_COMMIT" \
  -f apps/api/Dockerfile -t "$CANDIDATE_TAG" --push \
  "https://github.com/Wroblewski-Patryk/Soar.git#$SOURCE_COMMIT"
# Read containerimage.digest from BUILD_METADATA, then pin the registry digest.
API_STACK_IMAGE="${CANDIDATE_TAG%:*}@$(node -p \
  "require(process.argv[1])['containerimage.digest']" "$BUILD_METADATA")"
docker pull "$API_STACK_IMAGE"
pnpm run ops:worker-switch:build-record -- \
  --build-metadata "$BUILD_METADATA" --expected-sha "$SOURCE_COMMIT"
```

The metadata must describe `target=runtime`; a base-stage probe does not pass.
The validator checks the builder's resolved Git digest and source material,
Buildx build ID, OCI index digest, unique `linux/amd64` manifest, its config
digest and the locally resolved image/label. When Docker retains a local build
reference, that ID must also match. The OCI index digest,
platform manifest digest and config digest are different identities. This local
record can still be edited by a party with file access; protect its custody and
obtain an independent production readback before GO.

Run this only after the candidate image is built and the old workers **and old
API** have stopped, immediately before the candidate starts. The script reads
the operator's Coolify resource snapshot and independently calls `docker ps`
and a field-limited `docker inspect` on **all** containers on the target VPS.
It also reads Git HEAD and clean status in this checkout, the Buildx metadata,
OCI manifests, rendered Compose image references, and the ID and revision label
of the immutable `API_STACK_IMAGE` reference. Export
`SOURCE_COMMIT` and `API_STACK_IMAGE` from the same resolved build/start plan
before running it; missing values, a mutable tag, or a dirty checkout fail.
It reads no container environment values and performs no Docker mutation. It
does not contact Coolify, Redis, or the database; the operator must obtain the
Coolify resource list through authorized read-only access. Do not put an
environment dump, credential, user data, or backtest ID in the snapshot.

```bash
git rev-parse HEAD
git status --porcelain=v1 --untracked-files=all
docker compose -f docker-compose.coolify.yml config --images
pnpm run ops:worker-switch:preflight -- --snapshot <fresh-no-secret-snapshot.json> --expected-sha <full-candidate-sha> --build-metadata "$BUILD_METADATA"
```

If Compose needs an explicit environment file, pass `--compose-env-file <path>`
to the preflight; the validator parses the rendered configuration in memory and
never prints its environment section. Run only in an authorized environment.

The snapshot has `schemaVersion: 1`, a UTC `capturedAt` no more than five
minutes old, `inventoryComplete: true`, `coolifyProjectName` matching the
Coolify project label on the target host, and
`inventorySource: "coolify-and-docker-readback"`. `oldApplications` must contain
exactly one resource entry each for `api`, `workers-market-data`,
`workers-market-stream`, `workers-backtest`, and `workers-execution`, with all
their container IDs and `running`/`pid` readbacks. Every old API and worker
container must be stopped. `passiveResources` identifies the old Web resource
and any Soar Postgres/Redis resources that may remain running; the preflight
rejects unlisted or ambiguous Soar containers. The
`provenance` object needs `coolifyResourceId`, `coolifyDeploymentId`, the
Coolify-resolved source `coolifyResolvedSha`, pinned `apiImageRef`, the built
`apiImageId`, its
`apiImageRevision` label, and `plannedImageIds` for the API and four workers.
All SHA fields must equal the exact candidate SHA, and every planned image ID
must equal the candidate API image ID. The preflight compares `apiImageRef` to
the local `API_STACK_IMAGE`, its resolved image ID and the independent Buildx
metadata. The pasted Compose Service has no Git source. Do not infer source
provenance from an operator-entered `coolifyResolvedSha`; verify the actual
Coolify deployment and running image against the pinned digest before GO. Do not
mark `inventoryComplete` until every old Soar worker resource and container on
the host is accounted for.
Use Coolify resource UUIDs, not numeric database IDs, for `resourceId`; use the
exact `coolify.projectName` label for `coolifyProjectName`. If the host or
resource labels cannot establish that mapping, the preflight must fail.

The snapshot structure is:

```json
{
  "schemaVersion": 1,
  "capturedAt": "<current UTC ISO time>",
  "inventoryComplete": true,
  "inventorySource": "coolify-and-docker-readback",
  "coolifyProjectName": "<exact Soar project label>",
  "passiveResources": [
    { "role": "web", "resourceId": "<old Web resource UUID>" },
    { "role": "postgres", "resourceId": "<Soar Postgres resource UUID, if in project>" },
    { "role": "redis", "resourceId": "<Soar Redis resource UUID, if in project>" }
  ],
  "provenance": {
    "coolifyResourceId": "<candidate stack resource ID>",
    "coolifyDeploymentId": "<candidate build record ID>",
    "coolifyResolvedSha": "<40-character source SHA from Coolify>",
    "apiImageRef": "<immutable sha256:image-ID or repository@sha256:digest>",
    "apiImageId": "sha256:<64-character image ID>",
    "apiImageRevision": "<40-character OCI revision label>",
    "plannedImageIds": {
      "api": "sha256:<same image ID>",
      "workers-market-data": "sha256:<same image ID>",
      "workers-market-stream": "sha256:<same image ID>",
      "workers-backtest": "sha256:<same image ID>",
      "workers-execution": "sha256:<same image ID>"
    }
  },
  "oldApplications": [
    { "role": "api", "resourceId": "<old API resource>", "containers": [
      { "id": "<64-character container ID>", "running": false, "pid": 0 }
    ] },
    { "role": "workers-market-data", "resourceId": "<old resource>", "containers": [] },
    { "role": "workers-market-stream", "resourceId": "<old resource>", "containers": [] },
    { "role": "workers-backtest", "resourceId": "<old resource>", "containers": [] },
    { "role": "workers-execution", "resourceId": "<old resource>", "containers": [] }
  ]
}
```

Replace every placeholder from live readbacks; omit Postgres/Redis entries only
when those resources are outside this Coolify project. Each API/worker
`containers` array must contain every old container, including stopped
replicas. Empty arrays deliberately fail. Keep the filled snapshot outside the
repository.

The script reports `PASS_LOCAL_PROCEDURAL_ONLY` or failure codes and fails closed when
Docker access is unavailable, the container set or running state changes during
the read, an extra replica appears, or an active container cannot be attributed
to a declared resource. On a shared VPS, an active unrelated infrastructure
container also blocks this strict gate; investigate its ownership rather than
guessing that it is safe to ignore. The Coolify
resource list is still operator supplied; `inventoryComplete: true` is never
sufficient by itself. If its completeness cannot be established or legacy
labels leave ownership uncertain, the result is FAIL.
The live Docker read is a point-in-time gate: keep deployments frozen and run
it immediately before start. `PASS_LOCAL_PROCEDURAL_ONLY` is **not** deployment
GO. Git HEAD/clean status and `docker image inspect` are separate local
readbacks; neither binds the image contents to that Git tree. The ARG-supplied
revision label is only a consistency check. An independent Coolify build record
or trusted build attestation must identify the resolved Git SHA and resulting
image ID under the same deployment/build ID, then match the pinned reference's
Docker readback. We have no authorized production read of such a binding in
this task; production cutover remains **NO-GO** until it is obtained and
independently reviewed. The post-start image-ID and Web build-info checks are
separate acceptance gates.
Public `/health`, `/ready`, and worker heartbeats do not prove that old code
has stopped or that a backtest moved from `PENDING` to a terminal state.

### Rollback from stack cutover

From the first start of **any** new stack process (including Web, before domain
cutover), every rollback to an old API or worker follows mode D below. A
complete Coolify deployment history and host readback may establish that no new
stack process has ever started in this cutover; only then may the operator use
the schema-compatible app-version mode A after resolving in-flight and
`UNKNOWN` work. Missing or uncertain start history
requires mode D, and missing mode D evidence is **STOP/NO-GO**, never a reason
to fall back to mode A or a one-click restore. This order applies to routing,
API, worker-only, and schema failures. The old API may still consume work inline.
The operator performs these steps; a failed gate does not trigger an automatic
destructive rollback.

1. **Stop all new stack processes.** Freeze promotion, then request stop of the
   new `api`, `web`, `workers-market-data`, `workers-market-stream`,
   `workers-backtest`, and `workers-execution`. Keep Postgres, Redis/AOF, and
   evidence intact. Prevent automatic restart or redeploy of these six new
   processes during rollback. Do not start any old API or worker yet.
2. **Verify all new processes stopped.** On the target host, enumerate every
   container for the new `api`, `web`, `workers-market-data`,
   `workers-market-stream`, `workers-backtest`, and `workers-execution` resources,
   including replicas. Read back `Running=false` and `Pid=0` for each container;
   also check for unassigned Soar consumers. A missing resource, active process,
   incomplete inventory, or unknown state is **STOP/NO-GO** for old API or worker
   startup. A stop request or green `/health` is not proof of exit.
3. **Resolve in-flight and unknown work.** Inspect authorized queue, database,
   and order-intent status readbacks before choosing a recovery version. Any
   unresolved in-flight job or `UNKNOWN` exchange outcome is **STOP/NO-GO** for
   restarting an older consumer until the incident owner records a safe
   reconciliation decision. Preserve the original run/order identity; do not
   blindly requeue backtests, replay orders, or infer completion from health.
4. **Confirm rollback compatibility.** Record the exact old API/worker SHAs and
   prove they are compatible with the current database schema, Redis state,
   execution tokens, and LIVE order-intent contract. If compatibility is
   unproven, keep the old consumers stopped and choose a compatible recovery
   version. No ad hoc destructive schema rollback or automatic restore.
5. **Restore old applications.** Only after steps 2–4 pass, repeat the
   `Running=false`/`Pid=0` readback immediately before starting the old API and
   four worker Applications as one compatible set; any changed state is
   **STOP/NO-GO**. Then restore the old Web route if needed. Confirm the old
   consumers' exact SHA and worker ownership, queue
   readiness, one terminal result for any recovered backtest, and no duplicate
   effects. Keep all six new stack processes stopped throughout this check.

Run `pnpm run ops:worker-switch:rollback-order:test` to check the documented
stop-before-start sequence. This static check does not prove target-host state.

Local validation before using the stack manifest:

```bash
pnpm run docker:coolify:config
pnpm run docker:coolify:shared-api:config
pnpm run ops:coolify-stack:env-check:example
```

For a real copied Coolify environment, run the env check without
`--allow-placeholders` from the environment that has the stack variables. The
check validates required variable names, rejects placeholders, checks production
URL/secret/keyring shapes, and reports only variable names:

```bash
pnpm run ops:coolify-stack:env-check
```

The env check reports only variable names. It must not print secret values.

Follow-up queue-reduction option:
- `docker-compose.coolify.shared-api-image.yml` is an experimental second-stage
  reference manifest for the same shared-image semantics now used by the
  primary `docker-compose.coolify.yml`.
- Keep validating both manifests until the reference file is removed or folded
  into a single canonical manifest.

It fails if required variables are missing or still use placeholder material.

These checks validate syntax and required variable wiring only. They do not
prove production secrets, domains, Coolify proxy behavior, or protected app
journeys.

## Step 6: Attach Domains and TLS

1. Attach web domain to web service.
2. Attach api domain to api service.
3. Enable managed TLS in Coolify.
4. Verify certificates issued and routing healthy.

## Step 6A: Reverse-Proxy Cache Rules (Critical)

Cache policy must be fail-closed for authenticated/runtime surfaces.

Never cache (reverse proxy, CDN, edge):
- `/auth/*`
- `/dashboard/*`
- `/admin/*`
- API responses containing `Set-Cookie`
- SSE/event streams (`/dashboard/market-stream/*`)

Allowed cache scope (static only):
- `/_next/static/*`
- `/icons/*`
- immutable static assets (`*.js`, `*.css`, `*.png`, `*.svg`, `*.webp`, `*.woff2`, etc.)

Operational rules:
1. Respect origin `Cache-Control` headers from API (especially `no-store` on sensitive namespaces).
2. Do not override `no-store` with proxy defaults.
3. Do not enable HTML/document caching for dashboard/auth/admin pages.
4. Keep service-worker caching aligned to static-only contract (no runtime/API payload caching).

Quick verification checklist:
1. `curl -I https://api.<env-domain>/auth/me` should include `Cache-Control: no-store...`
2. `curl -I https://api.<env-domain>/dashboard` should include `Cache-Control: no-store...`
3. `curl -I https://api.<env-domain>/admin` should include `Cache-Control: no-store...`
4. `curl -I https://<web-env-domain>/_next/static/...` should be cacheable (`public, max-age` or equivalent immutable policy)
5. Dashboard runtime data should update after hard refresh without stale payload replay.

## Step 7: Migrations Before Go-Live

Before first stage/prod release:
1. Run DB migration job against target DB.
2. Confirm Prisma schema is up to date.
3. Confirm API starts without migration drift errors.

If migration fails, do not continue deployment.

Note:
- API startup runs `prisma migrate deploy` automatically (safe/idempotent path).
- Do **not** use destructive commands like `prisma migrate reset` or reseeding in production.

## Step 8: Production Rollout

1. Deploy the selected SHA to PROD during a controlled window.
2. Run same health checks.
3. Run smoke checks from runbook:
   - `docs/operations/v1-ops-runbook.md`
4. Record deployment evidence.

## Rollback Baseline

If post-deploy health fails:
1. After any new Service Stack process starts, or if its start history is
   uncertain, follow mode D in the
   [rollback stop-before-start sequence](#rollback-from-stack-cutover) before
   starting any old API or worker, even before domain cutover.
2. Use a previous stable, schema-compatible release; preserve DB/Redis state.
3. Re-validate `/health`, `/ready`, worker readiness, and queue outcomes.
4. Log the incident, rollback decision, and exact SHAs.

## Common Failure Points

1. Wrong `NEXT_PUBLIC_API_BASE_URL` -> web cannot reach API.
2. Reintroduced stage using prod DB/Redis by mistake.
3. Missing worker service -> runtime data stale.
4. Wrong/missing cookie session config (`COOKIE_DOMAIN`, `COOKIE_SAME_SITE`) for deployed domains.
5. API CORS not matching web domain.
6. Wrong Dockerfile path in Coolify (must point to `apps/api/Dockerfile` or `apps/web/Dockerfile`).
7. Using Docker mode without repository Dockerfile artifacts.
8. Coolify build-secrets injection + old Dockerfile frontend (`1.7`) can fail with `unexpected key 'env' in 'env=COOLIFY_URL'`; keep deploy Dockerfiles on `# syntax=docker/dockerfile:1.10` or newer.

## References
- `docs/operations/dev-stage-prod-environment-matrix.md`
- `docs/operations/coolify-trigger-wiring.md`
- `docs/engineering/local-development.md`
- `history/plans/deployment-dev-prod-coolify-plan-2026-04-02.md`
- `docs/operations/v1-ops-runbook.md`
