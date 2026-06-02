# Task

## Header
- ID: LUC-1422
- Title: Reconcile Coolify resource inventory
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: LUC-1398 read-only Coolify access binding
- Priority: P0
- Module Confidence Rows: operations/deployment
- Requirement Rows: production deploy confidence
- Quality Scenario Rows: deployment reliability, observability
- Risk Rows: deployment target drift, secret exposure
- Iteration: 2026-06-02 heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-1422-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-02
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] Exactly one priority task is selected.
- [x] The task is aligned with repository source-of-truth documents.
- [x] Affected module confidence rows were identified as operations/deployment.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: verify and record the Soar production Coolify resource inventory for LUC-1422.
- Release objective advanced: resource-by-resource post-push deploy confidence.
- Included slices: read-only Coolify API projection, ops docs/context refresh, issue closure evidence.
- Explicit exclusions: deploy, restart, rollback, env edit, DB mutation, protected app smoke.
- Stop conditions: missing Coolify read-only access, API failure, or secret-safety risk.

## Context

Soar production deploys are represented in Coolify as a project, production
environment, and multiple resources. Release verification must not rely on a
single legacy app id.

## Goal

Use read-only Coolify access to list production resources and update the
operations source of truth with redacted names, types, status classes, and
verification roles.

## Scope

- `docs/operations/coolify-vps-deployment-contract.md`
- `docs/operations/service-topology.md`
- `docs/operations/runtime-config-ledger.csv`
- `.agents/state/module-confidence-ledger.md`
- `.agents/state/active-mission.md`
- `.agents/state/system-health.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `history/evidence/luc-1422-coolify-resource-inventory-reconciliation-2026-06-02.md`
- `history/tasks/luc-1422-reconcile-coolify-resource-inventory-2026-06-02-task.md`

## Implementation Plan

1. Consume the inline wake payload first.
2. Confirm Coolify env binding names are present without values.
3. Run read-only Coolify API calls using allowlisted output fields only.
4. Update ops source truth and issue evidence.
5. Verify no secret-bearing values were written.
6. Update the Paperclip issue with final disposition.

## Acceptance Criteria

- [x] Production environment lookup succeeds.
- [x] Resource inventory count is captured.
- [x] Six application resources plus PostgreSQL and Redis are recorded.
- [x] No secret values, resource UUIDs, tokens, cookies, DB URLs, or proxy config are stored.
- [x] Issue receives a final `done` disposition.

## Definition of Done

- [x] `DEFINITION_OF_DONE.md` constraints are honored for this docs/evidence-only ops slice.
- [x] Redacted evidence exists.
- [x] Canonical ops docs and state files are updated.
- [x] Validation evidence is recorded.

## Forbidden

- Production mutation.
- Secret value disclosure.
- Treating a single app id as the whole Soar deployment.
- Claiming application readiness from inventory status alone.

## Validation Evidence

- Tests: not applicable; no application code changed.
- Manual checks:
  - `GET /api/v1/projects/{configured-project-id}` passed.
  - `GET /api/v1/projects/{configured-project-id}/environments` passed.
  - `GET /api/v1/projects/{configured-project-id}/production` passed.
  - Fresh read-only projection captured at `2026-06-02T05:33:33Z`.
  - `GET /api/v1/resources` passed with `17` total rows and `8` redacted Soar production resources.
- High-risk checks: no secret values printed; output was allowlisted.
- Reality status: verified.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Rollback note: no mutation; rollback not applicable.
- Observability or alerting impact: inventory names every resource that future smoke/monitoring must classify.

## Security / Privacy Evidence
- Data classification: production infrastructure metadata, secret-adjacent.
- Secret handling: names-only env checks; values never printed or stored.
- Result: pass.

## Result Report

- Task summary: verified Soar production Coolify resource inventory as eight resources in production environment id `6`.
- Files changed: ops docs, state/context files, evidence/task packets.
- How tested: read-only Coolify API projection with allowlisted output fields.
- What is incomplete: application readiness and protected worker readiness remain separate release gates.
- Next steps: future deploy verification must check each named resource, public smoke, build-info, protected `/workers/ready`, and worker freshness.
