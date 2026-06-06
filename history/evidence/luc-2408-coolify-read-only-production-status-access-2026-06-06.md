# LUC-2408 Coolify Read-Only Production Status Access Evidence

Date: 2026-06-06
Owner: 09 DRE (Deployment and Reliability Engineer)
Scope: Coolify read-only production status access binding

## Result

Status: verified.

[LUC-2408](/LUC/issues/LUC-2408) was handled as a narrow DRE/Ops read-only
verification lane after ownership triage from [LUC-2427](/LUC/issues/LUC-2427).
The current runner has the Coolify production status bindings needed to inspect
Soar through the canonical `project -> production environment -> resources`
hierarchy. No production mutation or secret disclosure occurred.

## Wake Context

- Issue: [LUC-2408](/LUC/issues/LUC-2408)
- Wake reason: `issue_assigned`
- Latest comment:
  [0b5b74fe-48d4-4ea1-a9c7-94fdda56e1c2](/LUC/issues/LUC-2408#comment-0b5b74fe-48d4-4ea1-a9c7-94fdda56e1c2)
- Fallback fetch needed: no.
- Checkout: already claimed by the harness; not repeated.
- Comment impact: the issue was confirmed as DRE-owned Coolify/runtime
  evidence work with no deploy, restart, production mutation, or secret access
  beyond approved read-only status binding checks.

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
- `COOLIFY_TOKEN`
- `COOLIFY_SOAR_PROJECT_ID`
- `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`
- `COOLIFY_SOAR_TEAM_ID`
- `COOLIFY_TEAM_ID`

Missing required binding names for this proof: none.

## Redacted Read-Only Projection

Authenticated read-only Coolify API readback at `2026-06-06T05:26:58Z`
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
| `soar-api` | `running:unknown` | yes |
| `soar-web` | `running:unknown` | yes |
| `workers-backtest` | `running:unknown` | no |
| `workers-execution` | `running:unknown` | no |
| `workers-market-data` | `running:unknown` | no |
| `workers-market-stream` | `running:unknown` | no |
| `postgresql` | `running:healthy` | no |
| `redis` | `running:healthy` | no |

## Validation

| Command / check | Result |
| --- | --- |
| Names-only Coolify binding scan | PASS; required names present, values not printed |
| Authenticated read-only Coolify projection | PASS; project, selector, production environment label, and canonical resource counts resolved |
| `pnpm run ops:coolify-stack:env-check:test` | PASS; `8/8` node test subtests |
| `git status --short` before artifact writes | INFO; pre-existing dirty source-of-truth and evidence files from earlier LUC-24xx lanes were present and were not reverted |

## Regression Risk And Follow-Up Gaps

- Regression risk is low for this closure because no runtime code or production
  state changed.
- Coolify application status `running:unknown` is inventory status, not worker
  readiness or app-level SLO proof.
- Web/API/worker protected readiness, dashboard/account proof, rollback guard,
  SLO evidence, and authenticated smoke remain separate release gates.

## Source-Control Decision

Commit decision: not committed in this heartbeat. The durable output is limited
to the [LUC-2408](/LUC/issues/LUC-2408) task/evidence files and source-truth
status updates.

Push status: not pushed. Push and deploy remain outside this read-only access
binding lane.
