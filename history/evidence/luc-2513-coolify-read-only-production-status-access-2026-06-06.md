# LUC-2513 Coolify Read-Only Production Status Access Evidence

Date: 2026-06-06
Owner: 09 DRE (Deployment and Reliability Engineer)
Scope: Coolify read-only production status access binding

## Result

Status: verified.

[LUC-2513](/LUC/issues/LUC-2513) was routed to DRE by the longevity
doctor/control tick after the access-binding issue was found open. The latest
comment explicitly kept the gate fail-closed: no secret exposure, push, deploy,
restart, protected smoke, or production mutation.

This heartbeat verified that the current runner has the Coolify production
status bindings needed to inspect Soar through the canonical
`project -> production environment -> resources` hierarchy. No production
mutation or secret disclosure occurred.

## Wake Context

- Issue: [LUC-2513](/LUC/issues/LUC-2513)
- Wake reason: `issue_assigned`
- Latest routed comment:
  [153865a3-2a50-4bca-ac41-33015f17b061](/LUC/issues/LUC-2513#comment-153865a3-2a50-4bca-ac41-33015f17b061)
- Fallback fetch needed: no.
- Checkout: already claimed by the harness; not repeated.
- Comment impact: the lane was treated as DRE-owned Coolify access/status
  proof, with Security/Ops gates remaining fail-closed.

## Safety Boundary

- No push, deploy, restart, rollback, environment edit, database action, Redis
  action, team setting change, account action, protected smoke, exchange
  action, live-trading action, screenshot, or production mutation was
  performed.
- No Coolify token, secret value, cookie, generated database suffix, raw
  resource id, internal URL, or protected response body was stored.
- The production environment binding value was treated as an internal selector
  and was not recorded; only the resolved label `production` is used here.

## Binding Status

Present by name without value disclosure:

- `COOLIFY_BASE_URL`
- `COOLIFY_API_TOKEN`
- `COOLIFY_SOAR_PROJECT_ID`
- `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`
- `COOLIFY_SOAR_TEAM_ID`
- `COOLIFY_TEAM_ID`

Missing required binding names for this proof: none.

## Redacted Read-Only Projection

Authenticated read-only Coolify API readback at `2026-06-06T18:25:30Z`
resolved:

| Check | Result |
| --- | --- |
| Project | `Soar` |
| Environment label | `production` |
| Current selector | `LuckySparrow` |
| Visible teams endpoint | `1` row visible in this runner |
| Production applications | `6` |
| PostgreSQL resources | `1` |
| Redis resources | `1` |
| Generic services | `0` |
| Production environment inventory | `8` resources |
| Global resources endpoint | `1` visible row; not used as release authority |

## Redacted Production Resource Inventory

| Resource | Inventory status | Public FQDN |
| --- | --- | --- |
| `soar-web` | `running:unknown` | yes |
| `workers-backtest` | `running:unknown` | no |
| `workers-market-stream` | `running:unknown` | no |
| `workers-execution` | `running:unknown` | no |
| `soar-api` | `running:unknown` | yes |
| `workers-market-data` | `running:unknown` | no |
| `postgresql` | `running:healthy` | no |
| `redis` | `running:healthy` | no |

## Validation

| Command / check | Result |
| --- | --- |
| Names-only Coolify binding scan | PASS; required names present, values not printed |
| Authenticated read-only Coolify projection | PASS; project, selector, production environment label, and canonical resource counts resolved |
| `git status --short` before artifact writes | INFO; pre-existing dirty source-truth and evidence files from earlier lanes were present and were not reverted |

## Relationship To LUC-2223

[LUC-2223](/LUC/issues/LUC-2223) remains the broader resource-inventory
reconciliation lane. This access-binding checkpoint proves the read-only path
needed for that lane, but it does not certify app-level readiness, worker
freshness, deploy freshness, protected smoke, rollback readiness, or SLO health.

## Source-Control Decision

Commit decision: not committed in this heartbeat. The repository already had a
large dirty worktree from other active lanes, and this checkpoint only added
narrow evidence/task artifacts.

Push status: not pushed. Push and deploy remain outside this read-only access
binding lane.
