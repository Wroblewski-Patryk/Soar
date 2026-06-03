# LUC-1610 Reconcile Coolify Resource Inventory - 2026-06-02

## Header

- ID: LUC-1610
- Title: Reconcile Coolify resource inventory
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops Release Lead
- Depends on: none
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001
- Requirement Rows: not applicable; source-truth operations proof refresh only
- Quality Scenario Rows: production deploy readiness
- Risk Rows: production inventory drift / legacy single-resource alias risk
- Iteration: 2026-06-02 ops heartbeat
- Operation Mode: BUILDER
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: CHECKPOINTED

## Context

Soar production deploy verification must treat Coolify as
`project -> production environment -> resources`, not as one legacy application
id. The issue asked for a read-only resource inventory suitable for
resource-by-resource release verification.

## Goal

Use read-only Coolify access to reconcile the Soar production resource list and
record redacted evidence without exposing secrets or mutating production.

## Constraints

- Keep all credential values, resource ids, URLs containing secrets, account
  data, and database URLs out of repository files and issue comments.
- Use only read-only Coolify API calls.
- Do not deploy, restart, rollback, edit environments, change team settings, or
  touch database state.

## Scope

- Coolify runtime bindings checked by name only.
- Read-only Coolify API probes for heartbeat context, current team selector,
  configured Soar project, production environment inventory, and global
  resource rows.
- Source-truth updates in operations docs, project state, task board, active
  mission, system health, and module confidence ledger.

## Implementation Plan

1. Confirm required runtime bindings by name without printing values.
2. Run read-only Coolify API probes only.
3. Record a redacted resource projection.
4. Reconcile the production-environment inventory against global resource rows.
5. Update Soar evidence and source-truth files.
6. Post Paperclip disposition as `done`.

## Acceptance Criteria

- Coolify bindings are verified by name only.
- Current Coolify team/workspace selector is verified.
- Configured project resolves to `Soar`.
- Production environment inventory returns six applications plus PostgreSQL and
  Redis.
- Global resource list discrepancy is explicitly classified without inventing a
  ninth production-environment deploy target.
- Redacted evidence is stored in history and operations source truth is
  updated.
- Paperclip issue disposition is updated with verification summary.

## Definition of Done

- [x] Coolify bindings checked by name only.
- [x] Current Coolify team/workspace selector verified.
- [x] Configured project resolves to `Soar`.
- [x] Production environment inventory returns six applications plus
  PostgreSQL and Redis.
- [x] Global PostgreSQL alias/companion row reconciled.
- [x] Redacted evidence stored in history and operations source truth updated.
- [x] Paperclip issue disposition updated with verification summary.

## Forbidden

- Recording Coolify tokens, environment values, database URLs, cookies, account
  data, raw resource ids, or secret-adjacent IDs in repo files or issue
  comments.
- Treating inventory status as endpoint/worker readiness proof.
- Using production mutation endpoints.

## Validation Evidence

- Tests:
  - `pnpm run quality:guardrails` -> failed on pre-existing repository
    guardrails unrelated to this read-only inventory packet: architecture graph
    drift `812/816` covered with `4` missing, and source size budgets exceeded
    in `apps/api/src/modules/bots/bots.e2e.test.ts` plus
    `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`.
- Manual checks:
  - `GET /api/issues/{issue-id}/heartbeat-context` -> pass; `LUC-1610` had a
    stale duplicate-run janitor blocker comment but no first-class blockers.
  - names-only Coolify env binding check -> pass.
  - `GET /api/v1/teams/current` -> pass at `2026-06-02T22:11:28Z`, id `0`,
    name `LuckySparrow`.
  - `GET /api/v1/teams` -> pass; two teams visible.
  - `GET /api/v1/projects/{configured-project-id}` -> pass; project `Soar`.
  - `GET /api/v1/projects/{configured-project-id}/environments` -> pass;
    `production` present.
  - `GET /api/v1/projects/{configured-project-id}/production` -> pass; six
    applications, one PostgreSQL, one Redis, zero generic services.
  - `GET /api/v1/resources` -> pass; `17` visible rows and `9`
    Soar-relevant global rows due the extra PostgreSQL alias/companion row.
- Screenshots/logs: no screenshots; command output was redacted by
  construction.
- High-risk checks: secret values were not printed or stored; no mutation
  endpoint was called.
- Module confidence ledger updated: yes.
- Reality status: verified.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none; inventory is not readiness proof.
- Smoke steps updated: no.
- Rollback note: not applicable because no production mutation occurred.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Review Checklist

- [x] Process self-audit completed before implementation.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs and context were updated.

## Result Report

Read-only Coolify inventory remains stable for Soar production: `soar-api`,
`soar-web`, `workers-backtest`, `workers-execution`, `workers-market-data`,
`workers-market-stream`, `postgresql`, and `redis`. Application inventory rows
report `running:unknown`; PostgreSQL and Redis report `running:healthy`.
The global resources endpoint also exposes
`postgresql-database-w5gql24ddjrgjaid7110rcqo`; this is recorded as a global
PostgreSQL alias/companion row and not as a ninth production-environment deploy
or smoke target. Release gates must still run API/Web/protected worker
readiness checks after any deploy.

Evidence file:
`history/evidence/luc-1610-coolify-resource-inventory-reconciliation-2026-06-02.md`.
