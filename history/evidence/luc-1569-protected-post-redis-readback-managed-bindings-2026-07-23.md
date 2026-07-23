# LUC-1569 Protected Post-Redis Readback Using Managed Bindings - 2026-07-23

## Scope

- Current Paperclip issue: `LUC-1569`
- Board approval: `aba2e3f6-d2c3-4dce-8cf5-59f25ee178b7` (`approved` at `2026-07-23T01:26:07Z`)
- Goal: execute the approved authenticated read-only Soar readiness proof and current Coolify resource health readback through managed bindings only
- Constraints: no secret disclosure, no write action, no restart, no deploy, no push, no rotation, and no other production mutation

## Read-Only Checks

- Managed Soar production smoke login using the ordinary production test account
- Managed Soar production smoke login using the admin smoke account
- Protected `GET /ready/details`
- Protected `GET /workers/ready`
- Public `GET /ready`
- Public `GET /api/build-info`
- Coolify `GET /api/v1/teams/current`
- Coolify `GET /api/v1/projects`
- Coolify `GET /api/v1/resources`
- Coolify `GET /api/v1/deployments`

## Results

### Soar protected routes

- The ordinary production test account authenticated successfully but remained unauthorized for the protected ops routes:
  - `GET /ready/details` -> `403`
  - `GET /workers/ready` -> `403`
- The admin smoke account authenticated successfully and completed the approved protected readback:
  - `GET /ready/details` -> `200`
  - `GET /workers/ready` -> `503`

### Protected readiness interpretation

- `GET /ready/details` reported:
  - `status=ready`
  - `service=api`
- `GET /workers/ready` reported:
  - `status=not_ready`
  - `service=workers`
  - `mode=split`
  - `environment=deployed`
  - `topologyStatus=healthy`
  - `staleWorkers=["execution"]`
- The protected worker readiness payload showed fresh heartbeats for:
  - `backtest`
  - `market-data`
  - `market-stream`
- The protected worker readiness payload showed the `execution` worker heartbeat as missing.

### Public production state

- Public `GET /ready` -> `200` with `status=ready`
- Public Web build info -> `200`
  - `gitSha=b0b2c2ce9477a32fcda7717f447ad46aa4327589`
  - `metadataSource=env-runtime`

### Coolify read-only state

- `GET /api/v1/teams/current` succeeded and resolved selector `LuckySparrow`
- `GET /api/v1/projects` succeeded and included project `Soar`
- `GET /api/v1/resources` succeeded and returned `17` visible rows
- Relevant Soar production resource projection by name:
  - `soar-web` -> `running:unknown`
  - `soar-api` -> `running:unknown`
  - `workers-backtest` -> `running:unknown`
  - `workers-market-data` -> `running:unknown`
  - `workers-market-stream` -> `running:unknown`
  - `workers-execution` -> `exited:unhealthy`
  - `postgresql` -> `running:healthy`
  - `redis` -> `running:healthy`
- `GET /api/v1/deployments` succeeded and returned `0` visible rows in this token context

### Coolify direct project alias note

- The configured direct project alias path remained non-authoritative in this token context:
  - `GET /api/v1/projects/{configured-project-id}` -> `404`
  - `GET /api/v1/projects/{configured-project-id}/environments` -> `404`
  - `GET /api/v1/projects/{configured-project-id}/production` -> `404`
- This did not block the read-only proof because the selector readback, project list, and global resource projection all succeeded and the Soar resource names remained visible.

### Redis check

- No approved remote `redis-cli PING` or shell execution path was exposed through the managed read-only bindings in this runner.
- Redis health was therefore proven only through the current Coolify resource status projection: `redis -> running:healthy`.

## Outcome

- The approved managed read-only proof path is now verified as executable from this runner through the admin smoke binding.
- The protected readiness blocker is no longer missing auth. It is now narrowed to runtime state:
  - API protected readiness is `ready`
  - worker protected readiness is `not_ready`
  - the stale worker is `execution`
  - Coolify simultaneously reports `workers-execution -> exited:unhealthy`
- This is secret-free, read-only evidence suitable for downstream SPA and QVE follow-up.

## Residual Risk

- The production worker plane is still degraded until the `execution` worker heartbeat and protected worker readiness recover.
- Web build provenance still reports `metadataSource=env-runtime`, so build-info remains diagnostic rather than release-grade provenance.
- No secret values, cookies, bearer tokens, passwords, private keys, raw provider ids, or raw Coolify tokens were printed, copied, or stored.
