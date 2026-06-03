# LUC-1459 Coolify Read-Only Production Status Access

- Issue: `LUC-1459`
- Title: `[Operator][Coolify] Bind Coolify read-only production status access`
- Date: 2026-06-02
- Owner: Ops Release Lead
- Stage: verification
- Status: verified with caveat

## Scope

Verify that the current Paperclip Ops runtime has Coolify read-only production
status access for Soar. This issue did not perform deploy, restart, rollback,
environment edit, database action, team setting change, or service mutation.

## Safety

- Secret values were not printed or stored.
- Coolify token values, resource ids, database URLs, labels, proxy
  configuration, and environment values are excluded.
- Output is restricted to binding-name presence, endpoint success, resource
  names, resource types, coarse inventory status, and public FQDN presence.

## Required Binding Readback

| Binding name | Result |
| --- | --- |
| `COOLIFY_BASE_URL` | present |
| `COOLIFY_API_TOKEN` | present |
| `COOLIFY_TOKEN` | present compatibility alias |
| `COOLIFY_SOAR_PROJECT_ID` | present and resolves to project `Soar` |
| `COOLIFY_SOAR_TEAM_ID` / `COOLIFY_TEAM_ID` | absent; not required for this proof because project/environment/resource lookups succeeded |

Paperclip secret metadata inspection was attempted with the agent token and
failed closed with `Board access required`. Runtime binding and Coolify API
readback are verified; secret-store metadata remains board-only from this role.

## Read-Only API Probes

Fresh redacted readback timestamp: `2026-06-02T08:04:42Z`.

| Probe | Result | Notes |
| --- | --- | --- |
| Paperclip heartbeat context `GET /api/issues/LUC-1459/heartbeat-context` | pass | Issue context loaded; no comments were pending. |
| Names-only Coolify env binding check | pass | Required names present; values were not printed. |
| Coolify project read `GET /api/v1/projects/{configured-project-id}` | pass | Bound project id resolves to project `Soar`. |
| Coolify environment list `GET /api/v1/projects/{configured-project-id}/environments` | pass | `production` environment present. |
| Coolify production environment read `GET /api/v1/projects/{configured-project-id}/production` | pass | Production environment id `6`. |
| Coolify resources list `GET /api/v1/resources` | pass | `17` total rows visible to the token. |

## Redacted Production Status Signal

The read-only project/environment/resource endpoints expose enough production
status signal to support Soar resource-by-resource reconciliation without a
legacy single-app assumption.

| Resource | Type | Inventory status | Public FQDN |
| --- | --- | --- | --- |
| `soar-api` | application | `running:unknown` | yes |
| `soar-web` | application | `running:unknown` | yes |
| `workers-backtest` | application | `running:unknown` | no |
| `workers-execution` | application | `running:unknown` | no |
| `workers-market-data` | application | `running:unknown` | no |
| `workers-market-stream` | application | `running:unknown` | no |
| `postgresql` | postgresql | `running:healthy` | no |
| `redis` | redis | `running:healthy` | no |

Count: eight Soar production resources: six applications, one PostgreSQL
resource, and one Redis resource.

## Result

Read-only Coolify production status access is bound for Soar
project/environment/resource reconciliation:

- the configured token can authenticate to Coolify read endpoints;
- the configured project binding resolves to `Soar`;
- the production environment and eight Soar production resources can be
  inventoried through read-only endpoints;
- no production mutation is needed or allowed under this issue.

## Residual Risk

- Team id is not bound in this runner. It is not an active blocker because the
  configured project/environment/resource reads succeeded, but future team
  selector drift should be handled by Security/Ops secret binding refresh.
- `running:unknown` is Coolify inventory-layer status for applications, not full
  application readiness. Post-push release verification still needs public
  route smoke and protected worker-readiness evidence under the relevant gates.
