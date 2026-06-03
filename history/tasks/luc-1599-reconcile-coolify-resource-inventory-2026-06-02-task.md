# LUC-1599 Reconcile Coolify Resource Inventory - 2026-06-02

## Header

- ID: LUC-1599
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
`project -> production environment -> resources`, not as one legacy
application id. The issue asked for a read-only resource inventory suitable for
resource-by-resource release verification.

## Goal

Use read-only Coolify access to reconcile the Soar production resource list and
record redacted evidence without exposing secrets or mutating production.

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
4. Reconcile the production-environment inventory against the global resource
   list alias/companion rows.
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
- Redacted evidence is stored in history and operations source truth is updated.
- Paperclip issue disposition is updated with verification summary.

## Definition of Done

- [x] Coolify bindings checked by name only.
- [x] Current Coolify team/workspace selector verified.
- [x] Configured project resolves to `Soar`.
- [x] Production environment inventory returns six applications plus
  PostgreSQL and Redis.
- [x] Global resource alias/companion row reconciled.
- [x] Redacted evidence stored in history and operations source truth updated.
- [x] Paperclip issue disposition updated with verification summary.

## Forbidden

- Recording Coolify tokens, environment values, database URLs, cookies, account
  data, resource ids, or secret-adjacent IDs in repo files or issue comments.
- Treating inventory status as endpoint/worker readiness proof.
- Using production mutation endpoints.

## Validation Evidence

- Tests: not applicable; read-only ops reconciliation.
- Manual checks:
  - `GET /api/issues/{issue-id}/heartbeat-context` -> pass; `LUC-1599` is
    actionable with no first-class blockers.
  - names-only Coolify env binding check -> pass.
  - `GET /api/v1/teams/current` -> pass at `2026-06-02T21:03:57Z`, id `0`,
    name `LuckySparrow`.
  - `GET /api/v1/teams` -> pass; two teams visible.
  - `GET /api/v1/projects/{configured-project-id}` -> pass; project `Soar`.
  - `GET /api/v1/projects/{configured-project-id}/environments` -> pass;
    `production` present.
  - `GET /api/v1/projects/{configured-project-id}/production` -> pass;
    production environment id `6`, six applications, one PostgreSQL, one Redis.
  - `GET /api/v1/resources` -> pass; `17` visible rows and `9`
    Soar-relevant global rows due the extra PostgreSQL alias/companion row.
- Screenshots/logs: no screenshots; command output was redacted by construction.
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

## Autonomous Loop Evidence

### 1. Analyze Current State

- Issues: release verification still needs a resource-by-resource Coolify target
  list; single app aliases are insufficient.
- Gaps: inventory status does not prove endpoint or worker readiness.
- Inconsistencies: global resources show an extra PostgreSQL companion row that
  is not present as an extra production-environment resource.
- Architecture constraints: Coolify production remains a hierarchy of project,
  production environment, and resources.

### 2. Select One Priority Mission Objective

- Selected task: `LUC-1599` Coolify resource inventory reconciliation.
- Priority rationale: critical Ops release-readiness proof.
- Why other candidates were deferred: wake payload scoped this heartbeat to
  `LUC-1599`.

### 3. Plan Implementation

- Files or surfaces to modify: evidence/task files, operations docs, state
  ledgers, and Paperclip issue disposition.
- Logic: read-only API projection only.
- Edge cases: missing team binding remains non-blocking while current selector
  and project reads pass; global PostgreSQL alias row must not be counted as a
  ninth production-environment deploy target.

### 4. Execute Implementation

- Implementation notes: queried Paperclip heartbeat context, Coolify current
  selector, visible teams, project, production environment inventory, and
  global resource list without printing secrets or storing IDs.

### 5. Verify and Test

- Validation performed: read-only Coolify API probes and source-truth
  `git diff --check`.
- Result: pass; canonical production-environment inventory remains eight
  resources.

### 6. Self-Review

- Simpler option considered: reuse `LUC-1593`/`LUC-1594` evidence; rejected
  because this issue required fresh heartbeat evidence and explicit
  reconciliation of the global PostgreSQL companion row.
- Technical debt introduced: no.
- Scalability assessment: current docs continue to point release checks at all
  eight production-environment resources.
- Refinements made: evidence explicitly states inventory is not readiness smoke
  and global aliases are not deploy targets.

### 7. Update Documentation and Knowledge

- Docs updated: operations contract, service topology, runtime config ledger.
- Context updated: project state, task board, active mission, system health,
  module confidence ledger.
- Learning journal updated: not applicable; no new recurring pitfall.

## Review Checklist

- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
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
`history/evidence/luc-1599-coolify-resource-inventory-reconciliation-2026-06-02.md`.
