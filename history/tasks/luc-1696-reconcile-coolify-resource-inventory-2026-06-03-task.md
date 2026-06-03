# Task

## Header
- ID: LUC-1696
- Title: Reconcile Coolify resource inventory
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: prior owner-path blocker resolved
- Priority: P0
- Module Confidence Rows: operations / deployment readiness
- Requirement Rows: release resource inventory proof
- Quality Scenario Rows: deployment readiness, observability
- Risk Rows: production deploy target drift, secret exposure
- Iteration: 2026-06-03
- Operation Mode: BUILDER
- Mission ID: LUC-1696-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-03
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches this bounded Ops heartbeat.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was not fully reread because this was a scoped Paperclip heartbeat with a narrow Ops inventory deliverable.
- [x] `.agents/core/mission-control.md` was represented by the existing active mission/state files.
- [x] Missing or template-like state tables were not encountered.
- [x] Affected module confidence rows were identified as operations/deployment readiness.
- [x] Affected requirement, quality scenario, and risk rows were identified as release inventory and deploy target drift.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: refresh Soar production Coolify resource inventory using read-only Coolify API access.
- Release objective advanced: resource-by-resource deploy verification can use the current production environment inventory rather than legacy app id aliases.
- Included slices: issue wake/comment acknowledgment, read-only Coolify query, redacted evidence packet, source-of-truth sync, issue disposition.
- Explicit exclusions: push, deploy, restart, rollback, environment edit, database action, team setting change, account action, protected smoke, secret readback, live-trading action.
- Checkpoint cadence: one bounded heartbeat.
- Stop conditions: missing read-only credentials, unexpected resource drift requiring owner decision, or mutation requirement.
- Handoff expectation: none; inventory reconciliation is complete.

## Context

[LUC-1696](/LUC/issues/LUC-1696) was unblocked for single-owner read-only
Coolify inventory after the prior owner-path blocker was resolved. Soar
production is modeled as `project -> production environment -> resources`; the
task exists to prevent release verification from treating one legacy app id as
the whole deployment target.

## Goal

Verify the current Soar production Coolify resource inventory and record
redacted, durable evidence without exposing secrets or mutating production.

## Success Signal
- User or operator problem: deploy checks need exact production resources.
- Expected product or reliability outcome: release gates can target all Soar production resources.
- How success will be observed: redacted inventory confirms or updates canonical eight-resource topology.
- Post-launch learning needed: no.

## Deliverable For This Stage

A verified evidence packet and updated ops source truth that identify the
current production environment resources.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within read-only verification
- do not print or store secret values, raw resource ids, or generated database companion suffixes

## Definition of Done
- [x] Latest issue comment acknowledged and used to constrain scope.
- [x] Read-only Coolify API inventory collected using allowlisted fields.
- [x] Evidence packet written without secret values.
- [x] Operations source truth updated.
- [x] Issue updated to `done` with verification evidence.

## Forbidden
- push, deploy, restart, rollback, production/env/database/team mutation
- protected smoke or account actions
- secret value disclosure
- legacy single-app-id inventory claims

## Validation Evidence
- Tests: not applicable; no code path changed.
- Manual checks:
  - `GET /api/issues/LUC-1696/heartbeat-context`
  - names-only runtime binding check
  - `GET /api/v1/teams/current`
  - `GET /api/v1/teams`
  - `GET /api/v1/projects/{configured-project-id}`
  - `GET /api/v1/projects/{configured-project-id}/environments`
  - `GET /api/v1/projects/{configured-project-id}/production`
  - `GET /api/v1/resources`
- Screenshots/logs: not used; API projection is captured in evidence.
- High-risk checks: secret values and raw resource ids were not printed or stored.
- Module confidence ledger updated: not applicable; operations docs/state updated instead.
- Requirements matrix updated: not applicable for this narrow inventory heartbeat.
- Quality scenarios updated: not applicable for this narrow inventory heartbeat.
- Risk register updated: not applicable; existing deploy target drift risk is reduced.
- Reality status: verified.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none; inventory is not readiness smoke.
- Smoke steps updated: release interpretation reconfirmed resource-by-resource smoke requirement.
- Rollback note: no rollback action; rollback still requires exact resource and source ref.
- Observability or alerting impact: Redis restart count remains a watch item for later smoke/SLO review.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: prior owner-path blocker was resolved; inventory proof was actionable.
- Gaps: none for resource inventory.
- Inconsistencies: global `/api/v1/resources` still exposes a PostgreSQL companion row.
- Architecture constraints: Coolify is a project/environment/resource hierarchy.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: issue context/comments, Ops role, Paperclip rules, deployment gate, service topology, Coolify deployment contract, runtime config ledger, prior LUC-1673 evidence.
- Rows created or corrected: none.
- Assumptions recorded: global PostgreSQL companion row is an alias/companion, not a deploy target.
- Blocking unknowns: none.
- Why it was safe to continue: task was explicitly read-only and credentials were present by name.

### 2. Select One Priority Mission Objective
- Selected task: [LUC-1696](/LUC/issues/LUC-1696).
- Priority rationale: critical release deploy-confidence blocker.
- Why other candidates were deferred: scoped wake forbids switching issues.

### 3. Plan Implementation
- Files or surfaces to modify: operations evidence, task packet, ops source truth/context.
- Logic: query allowlisted metadata and compare against canonical topology.
- Edge cases: global PostgreSQL companion row; application `running:unknown` status.

### 4. Execute Implementation
- Implementation notes: queried Coolify read-only endpoints and projected only safe metadata.

### 5. Verify and Test
- Validation performed: read-only API calls listed above.
- Result: canonical eight-resource production environment confirmed.

### 6. Self-Review
- Simpler option considered: rely on prior LUC-1673 evidence.
- Technical debt introduced: no.
- Scalability assessment: current evidence supports resource-by-resource deploy proof.
- Refinements made: explicit release interpretation recorded.

### 7. Update Documentation and Knowledge
- Docs updated: `docs/operations/coolify-vps-deployment-contract.md`, `docs/operations/service-topology.md`, `docs/operations/runtime-config-ledger.csv`.
- Context updated: `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`, `.agents/state/system-health.md`, `.agents/state/active-mission.md`.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to the bounded Ops heartbeat.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.
- [x] Learning journal was not updated because no recurring new pitfall was confirmed.
- [x] Required responsibility lanes were integrated, rejected, or tracked as follow-up.
- [x] Parent validation ran through read-only Coolify proof.

## Result Report

- Task summary: verified current Soar production Coolify inventory as eight canonical production-environment resources: six applications plus PostgreSQL and Redis.
- Files changed: evidence packet, task packet, operations docs/state/context.
- How tested: read-only Coolify API metadata calls with redacted projection.
- What is incomplete: readiness smoke is still separate from inventory proof.
- Next steps: post-push deploy verification should check each of the eight resources and then run API/Web/worker readiness smoke.
- Decisions made: global `postgresql-database-*` remains an alias/companion row, not a ninth production-environment deploy target.

## Reopen Refresh

- Refreshed at: 2026-06-03T14:31:43Z.
- Trigger: [LUC-1696](/LUC/issues/LUC-1696) was reopened after the prior
  owner-path blocker was resolved for single-owner read-only inventory.
- Outcome: unchanged inventory; eight canonical production-environment
  resources remain confirmed.
- Additional guardrail applied: inline Windows PowerShell probes avoid `??` and
  use explicit helper functions for compatibility.
