# Task

## Header
- ID: LUC-1707
- Title: [Operator][Coolify] Bind Coolify read-only production status access
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Soar Project Manager / Ops closure lane
- Depends on: none
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001
- Requirement Rows: not applicable
- Quality Scenario Rows: production observability/readiness evidence
- Risk Rows: Coolify credential binding drift; production mutation safety
- Iteration: 2026-06-03 Ops heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-1707
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed through the active project contract context.
- [x] `.agents/core/mission-control.md` was reviewed through the active project contract context.
- [x] Missing or template-like state tables were bootstrapped from repository sources, or confirmed not needed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified or marked not applicable.
- [x] The task or mission improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: verify read-only Coolify production status access for the configured Soar project.
- Release objective advanced: production status and resource reconciliation access remains available without production mutation.
- Included slices: latest wake-comment acknowledgement, names-only binding check, Coolify current team readback, configured project readback, production environment readback, global resource safe projection, source-control closure.
- Explicit exclusions: push, deploy, restart, rollback, env edit, database action, team setting change, account mutation, live-trading mutation, protected smoke.
- Checkpoint cadence: single heartbeat proof.
- Stop conditions: missing required binding, authentication failure, project mismatch, production environment missing, or mutation requirement.
- Handoff expectation: close issue with evidence and no follow-up if read-only proof succeeds.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Soar Project Manager | Paperclip wake payload, project AGENTS.md, Softwarehouse contracts | Integration, task closure | Final issue disposition | Paperclip heartbeat context | DONE |
| Security/Ops | Soar Project Manager under local repair authorization | credential and deploy safety contracts | Coolify read-only API status path | Binding proof without secret values | Coolify read-only API calls | DONE |
| Documentation/Memory | Soar Project Manager | task/evidence history, project state | `history/tasks`, `history/evidence`, `.codex/context`, ops ledger | Durable evidence packet | File updates | DONE |

## Context

This issue was assigned to bind or verify read-only Coolify production status
access for Soar. The latest comment explicitly allowed narrow local
repair/source-control closure but forbade push, deploy, production restart,
protected smoke/live account mutation, and secret disclosure.

## Goal

Prove that read-only Coolify status access is available for the Soar production
scope and that the configured project/environment resolve to the expected
resource topology.

## Success Signal
- User or operator problem: operators need current production status access without granting mutation authority.
- Expected product or reliability outcome: Soar production status can be inspected through least-privilege read-only proof.
- How success will be observed: required binding names exist and read-only Coolify API calls resolve selector, project, environment, and resource counts.
- Post-launch learning needed: no.

## Deliverable For This Stage

Verification evidence packet and source-of-truth refresh for `LUC-1707`.

## Constraints

- Never print or store secret values.
- Use only read-only Coolify API endpoints.
- Do not deploy, restart, roll back, edit env, mutate database state, change
  team/account settings, run protected smoke, or touch live-trading state.
- Treat Coolify as `project -> production environment -> resources`, not as a
  single legacy app id.

## Scope

- Paperclip issue context: `LUC-1707`
- Coolify API status endpoints:
  - `GET /api/v1/teams/current`
  - `GET /api/v1/teams`
  - `GET /api/v1/projects/{configured-project-id}`
  - `GET /api/v1/projects/{configured-project-id}/environments`
  - `GET /api/v1/projects/{configured-project-id}/production`
  - `GET /api/v1/resources`
- Documentation and evidence:
  - `history/evidence/luc-1707-coolify-read-only-production-status-access-2026-06-03.md`
  - `history/tasks/luc-1707-operator-coolify-bind-read-only-production-status-access-2026-06-03-task.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/module-confidence-ledger.md`
  - `docs/operations/runtime-config-ledger.csv`
  - `docs/operations/coolify-vps-deployment-contract.md`

## Implementation Plan

1. Acknowledge the latest wake comment and apply the narrow local repair/source-control lane.
2. Perform names-only binding presence checks without printing secret values.
3. Run authenticated read-only Coolify status reads.
4. Record redacted project, selector, environment, and resource inventory.
5. Update project memory, validate scoped docs/state changes, commit if clean and coherent, and close the Paperclip issue as done.

## Acceptance Criteria

- Required Paperclip and Coolify binding names are present without values printed.
- Current Coolify selector resolves to `0` / `LuckySparrow`.
- Configured Coolify project resolves to `Soar`.
- Production environment resolves to `production`.
- Redacted inventory confirms six applications plus PostgreSQL and Redis by production environment id/global readback reconciliation.
- No production mutation, protected smoke, or secret readback occurs.
- Local source-control closure records commit/no-commit decision.

## Definition of Done

- [x] Read-only Coolify API status proof completed.
- [x] Evidence packet written without secrets.
- [x] Project task board/state updated.
- [x] Scoped validation completed.
- [x] Commit/no-commit decision recorded.
- [x] Issue updated to `done` with verification summary.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- New systems without approval.
- Duplicated logic or parallel implementations of the same contract.
- Temporary bypasses, hacks, or workaround-only paths.
- Architecture changes without explicit approval.
- Production mutation, push, deploy, restart, protected smoke, live account mutation, or secret disclosure.

## Validation Evidence
- Tests:
  - `pnpm run ops:coolify-stack:env-check:test` -> pass, `8/8` node test subtests.
  - `git diff --check` -> pass with line-ending warnings only.
  - `pnpm run quality:guardrails` -> failed outside this issue's Coolify binding proof: architecture graph drift `812/816` covered with four unrelated API test paths missing, plus existing file-size budget failures in two API test files.
- Manual checks: authenticated read-only Coolify API calls listed in the evidence packet.
- Screenshots/logs: none stored; output summarized without secrets.
- High-risk checks: no deploy, restart, rollback, env edit, database action, team setting change, account mutation, protected smoke, live-trading mutation, or secret readback.
- Module confidence ledger updated: yes.
- Module confidence rows closed or changed: `SOAR-OPERATIONS-001` operational override refreshed.
- Requirements matrix updated: not applicable.
- Quality scenarios updated: not applicable.
- Risk register updated: not applicable.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: Coolify/VPS operations contract and existing production resource inventory evidence.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none; no topology change.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none; binding names were verified only.
- Health-check impact: none.
- Smoke steps updated: no; this is access binding proof, not endpoint smoke.
- Rollback note: no production change to roll back.
- Observability or alerting impact: confirms read-only production status access remains available.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: current issue required read-only Coolify status access binding.
- Gaps: optional team id binding remains absent in the runner.
- Inconsistencies: production environment endpoint exposed six application rows, while global resources by production environment id provided the canonical eight-row resource reconciliation including PostgreSQL and Redis.
- Architecture constraints: project -> production environment -> resources remains the verified hierarchy.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: Paperclip wake payload, project AGENTS.md, Softwarehouse contracts, active mission, project state, task board, nearby Coolify evidence packets.
- Rows created or corrected: `LUC-1707` evidence/task records and source-of-truth pointers.
- Assumptions recorded: optional team-id absence is non-blocking while readbacks succeed.
- Blocking unknowns: none for read-only status binding.
- Why it was safe to continue: all work was read-only and credential values were not printed.

### 2. Select One Priority Mission Objective
- Selected task: `LUC-1707`.
- Priority rationale: critical issue assigned directly by scoped wake payload.
- Why other candidates were deferred: scoped wake contract forbids switching before handling this issue.

### 3. Plan Implementation
- Files or surfaces to modify: task/evidence history and source-of-truth status files.
- Logic: run read-only API probes and record redacted status.
- Edge cases: missing optional team binding; global PostgreSQL companion row; production endpoint application-only bucket.

### 4. Execute Implementation
- Implementation notes: read-only API proof completed with no mutation.

### 5. Verify and Test
- Validation performed: names-only binding check; Paperclip heartbeat context; Coolify current team, teams, project, environments, production environment, and resources reads; scoped repository checks.
- Result: pass.

### 6. Self-Review
- Simpler option considered: rely on previous access proof only.
- Technical debt introduced: no.
- Scalability assessment: same proof pattern is reusable for later Ops status checks.
- Refinements made: recorded global PostgreSQL companion row as reconciliation context, not as an extra deploy target.

### 7. Update Documentation and Knowledge
- Docs updated: task and evidence history; project state; task board; active mission; module confidence ledger; runtime config ledger; Coolify deployment contract.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.
- [x] Required responsibility lanes were integrated, rejected, or tracked as follow-up.
- [x] Parent validation ran after accepted lane integration.

## Result Report

- Task summary: verified Coolify read-only production status access for Soar.
- Files changed:
  - `history/evidence/luc-1707-coolify-read-only-production-status-access-2026-06-03.md`
  - `history/tasks/luc-1707-operator-coolify-bind-read-only-production-status-access-2026-06-03-task.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/module-confidence-ledger.md`
  - `docs/operations/runtime-config-ledger.csv`
  - `docs/operations/coolify-vps-deployment-contract.md`
- How tested: read-only Coolify API proof at `2026-06-03T07:08:32Z`; scoped docs/state validation.
- What is incomplete: endpoint readiness smoke remains separate release-gate work.
- Commit decision: not committed. Required guardrail failed on unrelated repository blockers; sidecar `LUC-1709` is assigned to Engineering Delivery Lead to restore guardrails or record an accepted exception before committing this dirty docs/evidence set.
- Remaining dirty paths:
  - `.agents/state/active-mission.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/operations/coolify-vps-deployment-contract.md`
  - `docs/operations/runtime-config-ledger.csv`
  - `history/evidence/luc-1707-coolify-read-only-production-status-access-2026-06-03.md`
  - `history/tasks/luc-1707-operator-coolify-bind-read-only-production-status-access-2026-06-03-task.md`
- Next steps: none for the read-only access proof; source-control closure continues through `LUC-1709`.
- Decisions made: optional team-id binding absence is non-blocking while selector and project-scoped readbacks succeed.
