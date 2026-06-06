# LUC-2223 Coolify Resource Inventory Reconciliation Evidence

Date: 2026-06-06
Owner: 09 DRE (Deployment and Reliability Engineer)
Scope: read-only Coolify production resource inventory reconciliation for Soar

## Result

Status: verified.

[LUC-2223](/LUC/issues/LUC-2223) was handled as a narrow DRE/Ops read-only
inventory lane after the longevity doctor reassigned the stale critical issue.
The latest comment from
[LUC-2523](/LUC/issues/LUC-2523) changed the action from generic queue work to
closing this exact inventory issue with fresh read-only evidence. No protected
mutation or secret disclosure occurred.

## Wake Context

- Issue: [LUC-2223](/LUC/issues/LUC-2223)
- Wake reason: `issue_assigned`
- Latest comment:
  [5af582e5-82f6-4ffb-b540-d9a1889b4232](/LUC/issues/LUC-2223#comment-5af582e5-82f6-4ffb-b540-d9a1889b4232)
- Fallback fetch needed: no.
- Checkout: already claimed by the harness; not repeated.
- Comment impact: confirmed the issue is DRE-owned read-only Coolify resource
  inventory reconciliation; no push, deploy, restart, protected smoke,
  production mutation, or secret disclosure is permitted.

## Safety Boundary

- No push, deploy, restart, rollback, environment edit, database action, Redis
  action, team setting change, account action, protected smoke, exchange
  action, live-trading action, screenshot, or production mutation was
  performed.
- No Coolify token, secret value, cookie, generated database suffix, raw
  resource id, internal URL, label set, proxy config, screenshot, or protected
  response body was stored.
- Coolify output was projected to an allowlist: binding names only, project
  label, environment label, selector label, resource names, resource type,
  inventory status, public-FQDN presence, and aggregate counts.

## Binding Status

Present by name without value disclosure:

- `COOLIFY_BASE_URL`
- `COOLIFY_API_TOKEN`
- `COOLIFY_TOKEN`
- `COOLIFY_SOAR_PROJECT_ID`
- `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`
- `COOLIFY_SOAR_TEAM_ID`
- `COOLIFY_TEAM_ID`
- `COOLIFY_SOAR_WEB_APP_ID`
- `COOLIFY_SOAR_API_APP_ID`
- `COOLIFY_SOAR_APP_ID`
- `COOLIFY_SOAR_POSTGRES_RESOURCE_ID`
- `COOLIFY_SOAR_REDIS_RESOURCE_ID`

Missing required binding names for this proof: none.

## Redacted Read-Only Projection

Authenticated read-only Coolify API readback at `2026-06-06T18:25:12Z`
resolved:

| Check | Result |
| --- | --- |
| Project | `Soar` |
| Environment label | `production` |
| Current selector | `LuckySparrow` |
| Visible teams endpoint | `0` rows visible in this runner |
| Production applications | `6` |
| PostgreSQL resources | `1` |
| Redis resources | `1` |
| Generic services | `0` |
| Production environment inventory | `8` resources |
| Global resources endpoint | `17` visible rows; not used as release authority |

## Redacted Production Resource Inventory

| Resource | Type | Inventory status | Public FQDN |
| --- | --- | --- | --- |
| `soar-web` | application | `running:unknown` | yes |
| `workers-backtest` | application | `running:unknown` | no |
| `workers-market-stream` | application | `running:unknown` | no |
| `workers-execution` | application | `running:unknown` | no |
| `soar-api` | application | `running:unknown` | yes |
| `workers-market-data` | application | `running:unknown` | no |
| `postgresql` | postgresql | `running:healthy` | no |
| `redis` | redis | `running:healthy` | no |

## Validation

| Command / check | Result |
| --- | --- |
| Paperclip heartbeat-context | PASS; [LUC-2223](/LUC/issues/LUC-2223) read as `in_progress`, critical, no blockers, blocks [LUC-2513](/LUC/issues/LUC-2513) |
| Names-only Coolify binding scan | PASS; required names present, values not printed |
| Authenticated read-only Coolify projection | PASS; project, selector, production environment label, and canonical resource counts resolved |
| `pnpm run ops:coolify-stack:env-check:test` | PASS; `8/8` node test subtests |
| `git status --short` before artifact writes | INFO; substantial pre-existing dirty worktree observed and not reverted |

## Regression Risk And Follow-Up Gaps

- Regression risk is low for this closure because no runtime code or production
  state changed.
- Coolify application inventory status `running:unknown` is not app readiness,
  worker readiness, queue ownership, or SLO proof.
- Web/API/worker protected readiness, dashboard/account proof, rollback guard,
  SLO evidence, and authenticated smoke remain separate release gates.
- [LUC-2513](/LUC/issues/LUC-2513) can now consume this inventory proof as its
  upstream resource-scope blocker, but it is still not a deploy or mutation
  permit.

## Source-Control Decision

Commit decision: not committed in this heartbeat because the checkout already
contains broad pre-existing dirty state unrelated to this narrow read-only
inventory reconciliation.

Push status: not pushed. Push and deploy remain forbidden by the wake payload.
