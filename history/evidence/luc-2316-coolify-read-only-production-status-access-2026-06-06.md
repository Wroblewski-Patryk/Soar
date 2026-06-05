# LUC-2316 Coolify Read-Only Production Status Access Evidence

Date: 2026-06-06
Owner: Ops Release Lead
Scope: Coolify read-only production status access

## Result

Status: verified.

[LUC-2316](/LUC/issues/LUC-2316) was handled as a narrow Ops verification lane.
The runner has read-only Coolify production status access for Soar through the
canonical `project -> production environment -> resources` hierarchy. No
production mutation or secret disclosure occurred.

## Wake Context

- Issue: [LUC-2316](/LUC/issues/LUC-2316)
- Wake reason: `issue_assigned`
- Latest comment: none in wake payload.
- Fallback fetch needed: no.
- Checkout: already claimed by the harness; not repeated.

## Safety Boundary

- No push, deploy, restart, rollback, environment edit, database action, team
  setting change, account action, protected smoke, exchange action,
  live-trading action, or production mutation was performed.
- No Coolify token, secret value, cookie, generated database suffix, raw
  resource id, internal connection URL, screenshot, or protected response body
  was stored.
- The production environment binding value was treated as an internal
  identifier and was not recorded; only the resolved label `production` is used
  in this artifact.

## Affected Capability / Chain / Files

| Item | Scope |
| --- | --- |
| Capability | Coolify read-only production status access |
| Chain | Ops release/deploy gate -> Coolify project/environment resource inventory -> redacted production status proof |
| Files added | `history/tasks/luc-2316-operator-coolify-bind-read-only-production-status-access-2026-06-06-task.md`; `history/evidence/luc-2316-coolify-read-only-production-status-access-2026-06-06.md` |
| Existing source truth referenced | `docs/operations/coolify-vps-deployment-contract.md`; `docs/operations/runtime-config-ledger.csv`; latest LUC-22xx/LUC-23xx Ops evidence packets |

## Binding Status

Present by name without value disclosure:

- `COOLIFY_BASE_URL`
- `COOLIFY_API_TOKEN`
- `COOLIFY_SOAR_PROJECT_ID`
- `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`
- `COOLIFY_SOAR_WEB_APP_ID`
- `COOLIFY_SOAR_API_APP_ID`
- `COOLIFY_SOAR_TEAM_ID`
- `COOLIFY_TEAM_ID`
- `COOLIFY_TOKEN`

Missing required binding names for this proof: none.

## Redacted Read-Only Projection

| Check | Result |
| --- | --- |
| Project | `Soar` |
| Environment label | `production` |
| Current selector | `LuckySparrow` |
| Visible teams endpoint | `1` row visible in this runner |
| Production applications | `6` |
| Database-like resources | `2` |
| Generic services | `0` |
| Global resources endpoint | `17` visible rows; not used as release authority |

## Redacted Production Resource Inventory

| Resource | Inventory status | Public FQDN |
| --- | --- | --- |
| `soar-web` | `running:unknown` | yes |
| `workers-backtest` | `running:unknown` | no |
| `workers-market-stream` | `running:unknown` | no |
| `workers-execution` | `running:unknown` | no |
| `workers-market-data` | `running:unknown` | no |
| `soar-api` | `running:unknown` | yes |
| `postgresql` | `running:healthy` | no |
| `redis` | `running:healthy` | no |

## Validation

| Command / check | Result |
| --- | --- |
| Names-only Coolify binding scan | PASS; required names present, values not printed |
| Authenticated read-only Coolify projection | PASS at `2026-06-05T22:20:38Z`; project, selector, production environment label, and canonical resource counts resolved |
| `pnpm run ops:coolify-stack:env-check:test` | PASS; `8/8` node test subtests |
| `git status --short` before artifact writes | PASS; clean output |

## Regression Risk And Follow-Up Gaps

- Regression risk is low for this local closure because no runtime code or
  production state changed.
- Coolify application status `running:unknown` is not runtime readiness proof.
- Web/API/worker protected readiness, SLO evidence, rollback/deploy recovery,
  and authenticated smoke remain separate release gates with separate owners and
  permits.

## Source-Control Decision

Commit decision: not committed in this heartbeat. The durable output is limited
to the [LUC-2316](/LUC/issues/LUC-2316) task/evidence files and source-truth
status updates.

Push status: not pushed. Push and deploy remain forbidden by the wake payload.
