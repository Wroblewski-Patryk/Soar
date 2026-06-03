# Task

## Header
- ID: LUC-1615
- Title: Reconcile Coolify resource inventory
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: none
- Priority: P0
- Module Confidence Rows: ops/deployment resource inventory
- Requirement Rows: production deploy confidence / resource-by-resource release proof
- Quality Scenario Rows: deployment readiness, observability handoff
- Risk Rows: production topology drift, secret disclosure
- Iteration: Paperclip heartbeat
- Operation Mode: BUILDER
- Mission ID: Soar production deploy confidence
- Mission Status: VERIFIED

## Context

Soar production deploy checks must verify each Coolify resource under the
project/environment hierarchy, not a single legacy app id.

## Goal

Confirm the current production Coolify resource inventory for Soar using
read-only API access and update the repository evidence without exposing
secrets or mutating production.

## Scope

- `history/evidence/luc-1615-coolify-resource-inventory-reconciliation-2026-06-02.md`
- `history/tasks/luc-1615-reconcile-coolify-resource-inventory-2026-06-02-task.md`
- `docs/operations/runtime-config-ledger.csv`
- `docs/operations/service-topology.md`
- `docs/operations/coolify-vps-deployment-contract.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Implementation Plan

1. Read issue context and Ops/Coolify safety instructions.
2. Check required Coolify binding names without printing values.
3. Run read-only Coolify API probes for team selector, project, environments,
   production environment resources, and global resources.
4. Record redacted inventory evidence.
5. Update source-of-truth docs and context.
6. Close the Paperclip issue with proof and deployment impact.

## Acceptance Criteria

- Read-only probe confirms whether the configured project resolves to `Soar`.
- Production environment inventory is counted and listed by redacted resource
  name/type/status/FQDN-presence/Dockerfile only.
- Global resource alias/companion rows are reconciled without changing the
  canonical production-environment target count.
- No secrets, raw resource ids, cookies, database URLs, passwords, or account
  data are stored.
- Paperclip issue receives a final `done` disposition.

## Definition of Done

- [x] Coolify resource inventory captured from read-only API.
- [x] Evidence artifact written.
- [x] Operational source-of-truth files updated.
- [x] No production mutation performed.

## Forbidden

- deploy, restart, rollback, env edit, database action, team setting mutation,
  account mutation, live trading mutation
- printing or storing secret values or raw resource ids
- treating a legacy app id alias as the full deployment

## Validation Evidence
- Tests: not run; documentation/evidence-only Ops verification.
- Manual checks: read-only Coolify API probes listed in the evidence packet.
- Screenshots/logs: none; redacted command output only.
- High-risk checks: secret values and raw ids were not printed or stored.
- Reality status: verified.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no; existing resource-by-resource smoke rule reaffirmed.
- Rollback note: no release mutation occurred; rollback not applicable.
- Observability or alerting impact: inventory remains not a readiness substitute.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Coolify has multiple Soar production resources; release gates must not
  rely on a single legacy app id.
- Gaps: application inventory status is `running:unknown`, so endpoint and
  worker readiness smoke still must run after deploy.
- Inconsistencies: global resources include a PostgreSQL companion row not
  present as a separate production-environment deploy target.
- Architecture constraints: production topology is `project -> environment -> resources`.

### 2. Select One Priority Mission Objective
- Selected task: LUC-1615 resource inventory reconciliation.
- Priority rationale: critical release/deploy gate evidence.
- Why other candidates were deferred: wake payload scoped this heartbeat to LUC-1615.

### 3. Plan Implementation
- Files or surfaces to modify: evidence packet, task packet, Ops ledgers, context.
- Logic: read-only resource projection and source-truth sync.
- Edge cases: secret redaction, global PostgreSQL companion row, stale legacy app aliases.

### 4. Execute Implementation
- Implementation notes: Coolify API probes were read-only; no mutation endpoints were called.

### 5. Verify and Test
- Validation performed: authenticated read-only Coolify probes at `2026-06-02T22:34:16Z`.
- Result: configured project `Soar`, production environment, eight canonical
  resources, and nine global Soar-relevant rows confirmed.

### 6. Self-Review
- Simpler option considered: copying LUC-1610 evidence only; rejected because
  this issue required fresh heartbeat proof.
- Technical debt introduced: no.
- Scalability assessment: release gates can continue using the eight-resource
  production environment inventory.
- Refinements made: reran the formatter after detecting a PowerShell single-row
  count issue before writing evidence.

### 7. Update Documentation and Knowledge
- Docs updated: Ops evidence, runtime config ledger, service topology, Coolify deployment contract, context.
- Context updated: yes.
- Learning journal updated: not applicable; formatter issue was corrected in-run and not a recurring project pitfall.

## Review Checklist
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.

## Result Report

- Task summary: verified current read-only Soar Coolify production inventory.
- Files changed: this task packet, LUC-1615 evidence, Ops ledgers, context.
- How tested: read-only Coolify API probes.
- What is incomplete: endpoint and protected worker readiness smoke remain
  separate release-gate proofs after a deploy/push.
- Next steps: use the eight-resource production environment inventory for
  post-push auto-redeploy verification.
- Decisions made: treat the global PostgreSQL companion row as reconciliation
  metadata, not a ninth production-environment smoke target.
