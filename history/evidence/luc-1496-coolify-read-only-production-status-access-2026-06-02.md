# LUC-1496 Coolify Read-Only Production Status Access Evidence

Date: 2026-06-02
Owner: Ops Release Lead
Scope: read-only Coolify production status access binding for Soar

## Wake

- Issue: `LUC-1496` `[Operator][Coolify] Bind Coolify read-only production status access`
- Wake reason: `process_lost_retry`
- Inline wake payload: `fallbackFetchNeeded=false`, pending comments `0/0`, latest comment id `unknown`
- The issue thread contained one janitor comment noting a duplicate owner run was cancelled. This heartbeat still received a scoped continuation and the harness had already claimed the issue, so checkout was not repeated and the concrete read-only binding proof was performed.
- Continuation recheck: a later `issue_continuation_needed` wake for the same
  issue again had `fallbackFetchNeeded=false`, pending comments `0/0`, and
  checkout already claimed by the harness. `GET /api/issues/LUC-1496` showed
  status `blocked` with no first-class `blockedBy` issues; latest comment
  `07b842ad-cbd3-49f0-beae-e151f53f19e9` was duplicate-run janitor context
  only, so the kept owner lane completed this verification.

## Safety Boundary

- No secret values were printed, copied to files, or committed.
- No deploy, restart, rollback, env edit, database action, team setting change, account action, or live trading action was performed.
- Resource ids, direct URLs, internal connection URLs, labels, server/proxy settings, and token values are treated as secret-adjacent and are not recorded here.

## Commands And Proof

| Check | Result |
| --- | --- |
| Paperclip heartbeat context `GET /api/issues/LUC-1496/heartbeat-context` | pass |
| Paperclip issue read `GET /api/issues/LUC-1496` | pass: no first-class blockers |
| Paperclip latest comments read `GET /api/issues/LUC-1496/comments` | pass: duplicate-run janitor note only |
| Names-only Coolify env binding check | pass: required names present; values not printed |
| Coolify project read `GET /api/v1/projects/{configured-project-id}` | pass: `200`, resolves to project `Soar` |
| Coolify production environment read `GET /api/v1/projects/{configured-project-id}/{configured-production-environment}` | pass: `200`, six applications, one PostgreSQL, one Redis |
| Coolify resources list `GET /api/v1/resources` | pass: `200`, `17` total rows visible to read-only token |

Fresh redacted readback timestamp: `2026-06-02T13:02:43Z`.
Continuation recheck timestamp: `2026-06-02T13:03:28Z`.

## Binding Status

- Present by name: `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`, `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`.
- Optional team binding absent in this runner: `COOLIFY_SOAR_TEAM_ID` / `COOLIFY_TEAM_ID`.
- Team binding absence is not an active blocker for this issue because project-scoped authenticated reads succeeded and resolved the Soar production resource inventory.

## Redacted Inventory

| Resource | Type | Inventory status | Public FQDN | Dockerfile |
| --- | --- | --- | --- | --- |
| `soar-api` | application | `running:unknown` | yes | not exposed by this projection |
| `soar-web` | application | `running:unknown` | yes | not exposed by this projection |
| `workers-backtest` | application | `running:unknown` | no | not exposed by this projection |
| `workers-execution` | application | `running:unknown` | no | not exposed by this projection |
| `workers-market-data` | application | `running:unknown` | no | not exposed by this projection |
| `workers-market-stream` | application | `running:unknown` | no | not exposed by this projection |
| `postgresql` | postgresql | `running:healthy` | no | n/a |
| `redis` | redis | `running:healthy` | no | n/a |

Count: eight Soar production resources: six applications, one PostgreSQL resource, and one Redis resource.

## Notes

- Coolify read-only production status access is verified for project/environment/resource reconciliation.
- Application readiness must still be proven separately through release smoke: API `/health`, API `/ready`, Web `/`, Web `/api/build-info`, and protected `/workers/ready` with an approved read-only principal.
- Direct resource alias freshness and team id binding can remain a separate Security/Ops maintenance item if future automation needs them; they are not blockers for this project-scoped status access proof.
- PowerShell compatibility note: the continuation probe initially failed before
  external API calls completed because this shell rejected the `??`
  null-coalescing operator. The command was rerun successfully with explicit
  version-safe conditionals.
