# LUC-1707 Coolify Read-Only Production Status Access Evidence

Date: 2026-06-03
Owner: Soar Project Manager / Ops closure lane
Scope: bind and verify read-only Coolify production status access for Soar

## Result

Status: verified.

At `2026-06-03T07:08:32Z`, authenticated read-only Coolify API calls confirmed
that the current runner can access the configured Soar production status scope.
The binding resolves the current Coolify team/workspace selector, configured
project, production environment, and redacted production resource inventory.

## Wake Context

- Issue: `LUC-1707`
- Wake reason: `issue_assigned`
- Inline wake comments: `1/1`
- Latest comment id: `f82fc684-1b5f-4c9f-8bbd-644e0470f1fa`
- Fallback fetch needed: `no`
- Checkout: already claimed by the harness; no duplicate checkout was called.
- Latest comment impact: opened a narrow local repair/source-control lane for
  this issue while keeping push, deploy, production restart, protected smoke,
  live account mutation, and secret disclosure forbidden.

## Safety Boundary

- No secret values, token values, cookies, database URLs, exchange credentials,
  screenshots, full raw resource ids, or internal connection URLs were printed
  or stored.
- No deploy, restart, rollback, environment edit, database action, team setting
  change, account mutation, live-trading mutation, protected smoke, or secret
  readback was performed.
- Legacy direct app id aliases were not used as release authority. The verified
  status path remains `project -> production environment -> resources`.

## Commands And Checks

| Check | Result |
| --- | --- |
| Paperclip heartbeat context `GET /api/issues/LUC-1707/heartbeat-context` | pass; issue `LUC-1707` read back as `in_progress`, priority `critical`, zero first-class blockers |
| Names-only Paperclip and Coolify binding check | pass; `12` required binding names present without values printed |
| Coolify current team `GET /api/v1/teams/current` | pass; selector id `0`, name `LuckySparrow` |
| Coolify team list `GET /api/v1/teams` | pass; two teams visible |
| Coolify project read `GET /api/v1/projects/{configured-project-id}` | pass; resolves to project `Soar` |
| Coolify environments read `GET /api/v1/projects/{configured-project-id}/environments` | pass; single environment `production` present |
| Coolify production environment read `GET /api/v1/projects/{configured-project-id}/production` | pass; six applications, zero generic services |
| Coolify resources list `GET /api/v1/resources` | pass; `17` visible rows, `8` rows matching production environment id `6`, and `9` Soar-relevant safe projection rows because of one redacted PostgreSQL companion row |
| `pnpm run ops:coolify-stack:env-check:test` | pass; `8/8` node test subtests passed |
| `git diff --check` | pass with line-ending warnings only |
| `pnpm run quality:guardrails` | failed outside this issue's Coolify binding proof: architecture graph drift `812/816` covered with four unrelated API test paths missing, plus existing file-size budget failures in two API test files |

## Binding Status

- Present by name: `PAPERCLIP_API_URL`, `PAPERCLIP_API_KEY`,
  `PAPERCLIP_RUN_ID`, `PAPERCLIP_AGENT_ID`, `PAPERCLIP_COMPANY_ID`,
  `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`,
  `COOLIFY_SOAR_PROJECT_ID`, `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`,
  `COOLIFY_SOAR_WEB_APP_ID`, and `COOLIFY_SOAR_API_APP_ID`.
- Optional team binding absent in this runner: `COOLIFY_SOAR_TEAM_ID` /
  `COOLIFY_TEAM_ID`.
- Team binding absence is not an active blocker for this issue because
  `GET /api/v1/teams/current` and project-scoped readbacks succeeded under
  selector id `0`, name `LuckySparrow`.

## Redacted Production Inventory

| Resource | Coolify type | Inventory status | Public FQDN |
| --- | --- | --- | --- |
| `workers-backtest` | application | `running:unknown` | no |
| `soar-web` | application | `running:unknown` | yes |
| `workers-market-stream` | application | `running:unknown` | no |
| `workers-execution` | application | `running:unknown` | no |
| `workers-market-data` | application | `running:unknown` | no |
| `soar-api` | application | `running:unknown` | yes |
| `postgresql` | standalone-postgresql | `running:healthy` from global resource readback | no |
| `redis` | standalone-redis | `running:healthy` from global resource readback | no |

Count: eight canonical Soar production-environment resources by environment id:
six applications, one PostgreSQL resource, and one Redis resource.

## Global Resource Reconciliation

The global resources endpoint returned nine Soar-relevant rows in the safe
allowlisted projection:

- the six production applications listed above;
- `postgresql`;
- `redis`;
- one `postgresql-database-*` PostgreSQL companion row with the generated
  suffix redacted.

Release interpretation: the production environment id remains the canonical
resource-by-resource deploy/smoke target and contains one PostgreSQL resource.
The extra global PostgreSQL row is a Coolify global-list alias/companion row,
not an additional Soar deployable application or a ninth production-environment
smoke target.

## Notes

- Coolify read-only production status access is verified for
  project/environment/resource reconciliation.
- Application readiness remains a separate release smoke requirement: API
  `/health`, API `/ready`, Web `/`, Web `/api/build-info`, and protected
  `/workers/ready` with an approved read-only principal.
- This issue does not authorize a production mutation. Any deploy, restart,
  rollback, env change, database action, protected smoke, or live-account
  mutation still requires a separate release mutation permit.

## Source-Control Closure

- Commit decision: not committed in this heartbeat.
- No-commit blocker: required repository guardrail `pnpm run quality:guardrails`
  failed on unrelated architecture graph drift and file-size budget blockers
  outside the Coolify read-only binding proof.
- Sidecar keeping closure active: `LUC-1709`
  `[Guardrails][Source Control] Restore Soar guardrails so LUC-1707 docs/evidence can commit`,
  assigned to Engineering Delivery Lead.
- Remaining dirty paths:
  - `.agents/state/active-mission.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/operations/coolify-vps-deployment-contract.md`
  - `docs/operations/runtime-config-ledger.csv`
  - `history/evidence/luc-1707-coolify-read-only-production-status-access-2026-06-03.md`
  - `history/tasks/luc-1707-operator-coolify-bind-read-only-production-status-access-2026-06-03-task.md`
