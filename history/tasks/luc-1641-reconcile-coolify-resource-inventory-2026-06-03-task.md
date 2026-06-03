# Task

## Header
- ID: LUC-1641
- Title: Reconcile Coolify resource inventory
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: none
- Priority: P0
- Module Confidence Rows: `SOAR-OPERATIONS-001`
- Requirement Rows: not changed
- Quality Scenario Rows: release/deploy gate
- Risk Rows: production deploy resource-target ambiguity
- Iteration: Paperclip heartbeat 2026-06-03
- Operation Mode: BUILDER
- Mission ID: `LUC-1641-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-03`
- Mission Status: VERIFIED

## Context

Soar production is deployed in Coolify as a hierarchy:
`project -> production environment -> resources`. The release gate must not
treat a legacy single app id as the whole deployment target.

The issue was marked `blocked`, but Paperclip heartbeat context showed zero
first-class blockers and the only thread comment was a duplicate-owner
live-run janitor note. This heartbeat was the kept continuation path, so
read-only inventory reconciliation remained actionable.

## Goal

Use read-only Coolify access to list and reconcile Soar production resources,
store redacted resource names/types/statuses, and preserve the eight-resource
deploy/smoke target.

## Scope

- Paperclip issue: `LUC-1641`
- Coolify project: configured Soar project id, value not printed
- Coolify environment: `production`
- Docs/evidence:
  - `history/evidence/luc-1641-coolify-resource-inventory-reconciliation-2026-06-03.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.agents/state/system-health.md`
  - `.agents/state/module-confidence-ledger.md`
  - `docs/operations/runtime-config-ledger.csv`
  - `docs/operations/service-topology.md`
  - `docs/operations/coolify-vps-deployment-contract.md`

## Implementation Plan

1. Read the Paperclip heartbeat context for `LUC-1641`.
2. Verify Coolify binding presence by variable name only.
3. Query read-only Coolify endpoints for team selector, project, environments,
   production environment resources, and global resources.
4. Record redacted inventory evidence without raw ids or secret values.
5. Update Ops source-of-truth files with the fresh verification.
6. Close the Paperclip issue as done with evidence and residual risk.

## Acceptance Criteria

- Fresh read-only Coolify API evidence exists.
- Soar production resource count is reconciled as six applications plus
  PostgreSQL and Redis.
- The global PostgreSQL companion row is documented as non-canonical for
  production-environment deploy/smoke targeting.
- No production mutation or secret disclosure occurs.
- Paperclip issue receives a final `done` disposition.

## Validation Evidence

- `GET /api/issues/LUC-1641/heartbeat-context` -> pass; issue was
  `blocked`, priority `critical`, zero first-class blockers.
- `GET /api/issues/LUC-1641/comments` -> pass; only comment was duplicate-run
  janitor context, so no Coolify access blocker remained.
- Names-only Paperclip and Coolify env binding check -> pass without printing
  values.
- `GET /api/v1/teams/current` -> pass at `2026-06-03T02:34:56Z`, current
  selector id `0`, name `LuckySparrow`.
- `GET /api/v1/teams` -> pass, two teams visible.
- `GET /api/v1/projects/{configured-project-id}` -> pass, project `Soar`.
- `GET /api/v1/projects/{configured-project-id}/environments` -> pass,
  `production` present as the single environment.
- `GET /api/v1/projects/{configured-project-id}/production` -> pass, six
  applications, one PostgreSQL, one Redis, zero generic services.
- `GET /api/v1/resources` -> pass, `17` visible rows and `9` Soar-relevant
  global rows in the allowlisted all-resource projection due the PostgreSQL
  companion row.
- Module confidence ledger updated: yes.
- Reality status: verified.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none; inventory status is not readiness smoke.
- Smoke steps updated: resource-by-resource target list preserved.
- Rollback note: no rollback action; rollback path remains the existing
  Coolify app/version or Service Stack rollback playbook.
- Observability or alerting impact: PostgreSQL restart count `52`, Redis
  restart count `682`, and API restart count `5` remain later smoke/SLO watch
  items.
- Staged rollout or feature flag: not applicable.

## Definition of Done

- [x] Redacted Coolify production inventory captured.
- [x] Canonical production-environment resources reconciled.
- [x] Source-of-truth Ops ledgers updated.
- [x] No secret values or raw resource ids stored.
- [x] Paperclip issue updated to `done`.

## Forbidden

- Production deploy, restart, rollback, env edit, team setting mutation,
  database action, account action, or live-trading action.
- Printing secret values, tokens, cookies, database URLs, or raw resource ids.
- Treating `COOLIFY_SOAR_APP_ID` as the whole deployment.

## Result Report

- Task summary: verified Soar production inventory remains eight canonical
  resources: `soar-api`, `soar-web`, four worker applications, `postgresql`,
  and `redis`.
- Files changed: evidence/task/state/docs only.
- How tested: read-only Coolify API probes listed above.
- What is incomplete: application resource inventory still reports
  `running:unknown`; endpoint, worker, auth, and SLO readiness require later
  smoke checks.
- Next steps: use the eight-resource inventory as the deploy/smoke target for
  post-push auto-redeploy verification.
- Decisions made: global PostgreSQL companion row is not a ninth production
  environment deploy/smoke target.
