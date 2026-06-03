# Task

## Header
- ID: LUC-1552
- Title: [Operator][Coolify] Bind Coolify read-only production status access
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: none
- Priority: P0
- Module Confidence Rows: operations/runtime/Coolify production status
- Requirement Rows: production deploy confidence / read-only status proof
- Quality Scenario Rows: release/deploy gate, secret handling
- Risk Rows: Coolify credential access, production mutation safety
- Iteration: 2026-06-02 Ops heartbeat
- Operation Mode: TESTER
- Mission ID: Soar production deploy confidence
- Mission Status: VERIFIED

## Context
Soar production deploy confidence requires Paperclip to verify whether Coolify
can be queried for project/environment/resource status after pushes. The issue
requested read-only Coolify production status bindings and explicitly forbade
secret disclosure or production mutation.

## Goal
Verify that the Ops runtime can access Coolify production status for the Soar
project through read-only bindings, then record redacted evidence.

## Scope
- Paperclip issue: `LUC-1552`
- Runtime bindings: `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`,
  `COOLIFY_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`
- Coolify API surfaces: team list/current team, configured project,
  environments, production environment, resources list
- Evidence docs and operations ledgers only

## Implementation Plan
1. Read scoped wake payload and heartbeat context.
2. Check required Coolify env names without printing values.
3. Use authenticated read-only Coolify API calls.
4. Project API output to an allowlist only.
5. Record evidence and update ops source-of-truth files.
6. Close the Paperclip issue with verified status and no residual blocker.

## Acceptance Criteria
- Required binding names are present without values printed.
- Coolify API resolves current selector, project `Soar`, production
  environment, and resource inventory.
- Evidence records no secret values, resource UUIDs, URLs, labels, or internal
  connection details.
- No production mutation occurs.

## Definition of Done
- [x] Required read-only binding names checked.
- [x] Authenticated Coolify project/environment/resource reads succeeded.
- [x] Redacted evidence written.
- [x] Ops ledgers updated.
- [x] Paperclip issue disposition set to `done`.

## Forbidden
- Secret value disclosure.
- Deploy, restart, rollback, env edit, database action, team setting change,
  account mutation, or live-trading mutation.
- Treating one legacy resource id as the whole Soar deployment.

## Validation Evidence
- Tests: not applicable; no code changed.
- Manual checks: authenticated read-only Coolify API readback passed at
  `2026-06-02T17:04:13Z`.
- Screenshots/logs: none; no screenshots used and no raw API payloads stored.
- High-risk checks: secret values not printed; output allowlisted.
- Module confidence ledger updated: not applicable for code module behavior.
- Requirements matrix updated: not applicable; ops ledger/evidence updated.
- Quality scenarios updated: not applicable; deploy gate source updated.
- Risk register updated: not applicable; no new risk found.
- Reality status: verified.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: no repository/env mutation; existing bindings verified
  by name.
- Health-check impact: none.
- Smoke steps updated: no; status access enables later deploy/status smoke.
- Rollback note: no mutation, rollback not applicable.
- Observability or alerting impact: Coolify status access is available for
  later release gate reconciliation.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue had no comments and no first-class blockers.
- Required bindings were present by name except optional team id names.
- Existing ops docs said optional team ids are not a blocker while current-team
  and project-scoped reads succeed.

### 2. Select One Priority Mission Objective
- Selected task: verify `LUC-1552` read-only production status access.
- Priority rationale: critical release/deploy gate prerequisite.
- Why other candidates were deferred: scoped wake requires this issue only.

### 3. Plan Implementation
- Files or surfaces to modify: evidence/task docs and ops ledgers.
- Logic: read-only API checks, allowlisted output.
- Edge cases: optional team binding absent, raw Coolify payload secret-adjacent.

### 4. Execute Implementation
- Names-only env check passed.
- Coolify API reads passed for selector, project, environment, and resources.

### 5. Verify and Test
- Validation performed: API readback and redacted inventory projection.
- Result: verified.

### 6. Self-Review
- Simpler option considered: reusing prior `LUC-1532` evidence.
- Technical debt introduced: no.
- Scalability assessment: the project -> production environment -> resources
  path remains the correct hierarchy for future status checks.
- Refinements made: corrected environment-list shape interpretation before
  writing evidence.

### 7. Update Documentation and Knowledge
- Docs updated: ops deployment contract, runtime config ledger, system health,
  evidence, task packet.
- Context updated: yes.
- Learning journal updated: not applicable; no new recurring pitfall found.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.

## Result Report

- Task summary: verified read-only Coolify production status access for Soar.
- Files changed: this task packet, evidence packet, ops deployment contract,
  runtime config ledger, and system health.
- How tested: names-only env binding check and authenticated read-only Coolify
  API readback.
- What is incomplete: application readiness still requires separate release
  smoke with approved auth where needed.
- Next steps: use this access in later post-push deploy/status reconciliation;
  request a separate mutation permit before any deploy/restart/rollback/env
  change.
- Decisions made: optional team env binding remains non-blocking while current
  selector and project-scoped reads succeed.
