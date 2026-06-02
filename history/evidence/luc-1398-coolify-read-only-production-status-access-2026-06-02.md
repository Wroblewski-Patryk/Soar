# LUC-1398 Coolify Read-Only Production Status Access

- Issue: `LUC-1398`
- Title: `[Operator][Coolify] Bind Coolify read-only production status access`
- Date: 2026-06-02
- Owner: Ops Release Lead
- Stage: verification
- Status: verified with caveat

## Scope

Read-only Coolify production-status access binding verification for Soar.
No deploy, restart, rollback, environment edit, database action, team setting
change, or service mutation was performed.

## Safety

- Secret values were not stored in this artifact.
- Coolify base URL, token values, resource UUIDs, database URLs, labels, proxy
  configuration, and environment values are excluded.
- Output is allowlisted to env-name presence, endpoint success, resource names,
  resource types, status, branch, Dockerfile path when available, and public
  FQDN presence.

## Required Binding Readback

| Binding name | Result |
| --- | --- |
| `COOLIFY_BASE_URL` | present |
| `COOLIFY_API_TOKEN` | present |
| `COOLIFY_SOAR_PROJECT_ID` | present and resolves to project `Soar` |
| `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT` | present |
| `COOLIFY_SOAR_API_APP_ID` | present but stale or not resolvable by app-specific endpoint |
| `COOLIFY_SOAR_WEB_APP_ID` | present but stale or not resolvable by app-specific endpoint |

Optional team binding names were not required for this proof because the
configured token could list projects and resolve the Soar project directly.

## Read-Only API Probes

| Probe | Result | Notes |
| --- | --- | --- |
| `GET /api/v1/version` | `200` | Confirms authenticated read access to Coolify API. |
| `GET /api/v1/projects` | `200` | Returned project list containing `Soar`. |
| `GET /api/v1/projects/{COOLIFY_SOAR_PROJECT_ID}` | `200` | Bound project id resolves to `Soar`. |
| `GET /api/v1/applications` | `200` | Returned 13 applications, including Soar API/Web/workers by name. |
| `GET /api/v1/resources` | `200` | Returned 17 resources, including Soar production app/data resources by name. |
| `GET /api/v1/applications/{COOLIFY_SOAR_API_APP_ID}` | `404` | Resource-specific alias needs Security/Ops refresh before direct app-id automation. |
| `GET /api/v1/applications/{COOLIFY_SOAR_WEB_APP_ID}` | `404` | Resource-specific alias needs Security/Ops refresh before direct app-id automation. |

## Redacted Production Status Signal

The read-only list endpoints expose enough production status signal to support
resource-by-resource reconciliation without a legacy single-app assumption.

Observed Soar production resources by name:

| Resource | Type | Status | Branch |
| --- | --- | --- | --- |
| `soar-api` | application | `running:unknown` | `main` |
| `soar-web` | application | `running:unknown` | `main` |
| `workers-backtest` | application | `running:unknown` | `main` |
| `workers-execution` | application | `running:unknown` | `main` |
| `workers-market-data` | application | `running:unknown` | `main` |
| `workers-market-stream` | application | `running:unknown` | `main` |
| `postgresql` | standalone-postgresql | `running:healthy` | n/a |
| `redis` | standalone-redis | `running:healthy` | n/a |

## Result

Read-only Coolify production status access is bound for list-level and
project-scoped reconciliation:

- the configured token can authenticate to Coolify read endpoints;
- the configured project binding resolves to `Soar`;
- Soar production resources can be inventoried through read-only list endpoints;
- no production mutation is needed or allowed under this issue.

## Residual Risk

- `COOLIFY_SOAR_API_APP_ID` and `COOLIFY_SOAR_WEB_APP_ID` are stale or not
  accepted by the app-specific endpoint in this runner. Future automation should
  use the project/list inventory path until Security/Ops refreshes direct
  resource-id secret bindings.
- `running:unknown` is Coolify resource status readback, not full application
  readiness. Post-push release verification still needs public route smoke and
  protected worker-readiness evidence under the relevant gates.
