# Task

## Header
- ID: LUC-1455
- Title: [Ops][Soar] Reconcile Coolify resource inventory
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: none
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001
- Requirement Rows: operations production inventory truth
- Quality Scenario Rows: deployment readiness / observability
- Risk Rows: production deployment resource drift
- Iteration: 2026-06-02 Ops heartbeat
- Operation Mode: BUILDER
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: CHECKPOINTED

## Context
Soar production is not a single Coolify app id. The release lane needs a current read-only resource inventory so future post-push deploy verification checks each production resource separately.

## Goal
Verify the current Soar Coolify production resource inventory without exposing secrets and update operational source truth with the latest readback.

## Success Signal
- User or operator problem: Paperclip needs current redacted resource truth for Soar production instead of relying on a legacy app-id assumption.
- Expected product or reliability outcome: resource-by-resource deploy and smoke checks can target the real Coolify production topology.
- How success will be observed: configured project and production environment resolve through read-only Coolify API, and the redacted inventory count/name/type/status projection is recorded.
- Post-launch learning needed: no

## Scope
- `history/evidence/luc-1455-coolify-resource-inventory-reconciliation-2026-06-02.md`
- `history/tasks/luc-1455-reconcile-coolify-resource-inventory-2026-06-02-task.md`
- `docs/operations/coolify-vps-deployment-contract.md`
- `docs/operations/runtime-config-ledger.csv`
- `docs/operations/service-topology.md`
- `.agents/state/module-confidence-ledger.md`
- `.agents/state/active-mission.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`

## Implementation Plan
1. Read Paperclip wake payload and heartbeat context.
2. Verify required Coolify env binding names without printing values.
3. Run authenticated read-only Coolify API project/environment/resource probes.
4. Record only allowlisted resource names, types, inventory statuses, FQDN presence, and known Dockerfile paths.
5. Update operations source truth and Paperclip issue disposition.

## Constraints
- Use read-only Coolify API access only.
- Do not print or persist tokens, URLs with embedded credentials, cookies, resource ids, database URLs, labels, or other secret-adjacent values.
- Do not deploy, restart, rollback, edit env, mutate database state, or touch live trading/account state.
- Preserve existing project documentation and avoid introducing a new release process.

## Acceptance Criteria
- Required Coolify binding names are checked without values.
- Configured Coolify project resolves to `Soar`.
- Production environment id and redacted resource inventory are recorded.
- Operations source truth references the latest inventory readback.
- Paperclip issue receives final disposition with evidence.

## Definition of Done
- [x] Required Coolify binding names checked without values.
- [x] Configured Coolify project resolves to `Soar`.
- [x] Production environment id and redacted resource inventory are recorded.
- [x] Operations source truth updated.
- [x] Paperclip issue receives final disposition with evidence.

## Forbidden
- Secret disclosure.
- Production mutation.
- Treating `COOLIFY_SOAR_APP_ID` or any single app alias as the whole deployment.
- Claiming application readiness from inventory status alone.

## Validation Evidence
- Tests: not applicable; read-only ops inventory task.
- Manual checks:
  - `GET /api/issues/LUC-1455/heartbeat-context` -> pass.
  - Coolify env binding names present -> pass, values not printed.
  - `GET /api/v1/projects/{configured-project-id}` -> pass, project `Soar`.
  - `GET /api/v1/projects/{configured-project-id}/environments` -> pass, `production`.
  - `GET /api/v1/projects/{configured-project-id}/production` -> pass, environment id `6`.
  - `GET /api/v1/resources` -> pass, `17` total visible rows.
- Screenshots/logs: redacted evidence in `history/evidence/luc-1455-coolify-resource-inventory-reconciliation-2026-06-02.md`.
- High-risk checks: no deploy/restart/rollback/env/database/account/live-trading mutation performed.
- Module confidence ledger updated: yes.
- Module confidence rows closed or changed: SOAR-OPERATIONS-001 inventory truth refreshed.
- Requirements matrix updated: not applicable for this inventory-only heartbeat.
- Quality scenarios updated: not applicable for this inventory-only heartbeat.
- Risk register updated: not applicable; existing resource-drift risk remains controlled by this evidence.
- Reality status: verified.

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no; existing resource-by-resource smoke requirement remains.
- Rollback note: no production mutation, so rollback not applicable.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: current issue requests a read-only Coolify resource inventory reconciliation.
- Gaps: application inventory status is not application readiness proof.
- Inconsistencies: none found; latest readback matches the existing eight-resource topology.
- Architecture constraints: Coolify is `project -> production environment -> resources`.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: Paperclip heartbeat context, Coolify deployment contract, runtime config ledger, service topology, prior inventory evidence.
- Assumptions recorded: Dockerfile paths are retained from deployment contract because current Coolify projection did not expose them.
- Blocking unknowns: none for inventory; protected worker readiness remains a separate gate.
- Why it was safe to continue: task is read-only and uses allowlisted output only.

### 2. Select One Priority Mission Objective
- Selected task: `LUC-1455` Coolify production inventory reconciliation.
- Priority rationale: critical Ops release-gate truth for resource-by-resource deploy verification.
- Why other candidates were deferred: wake payload scoped this heartbeat to `LUC-1455`.

### 3. Plan Implementation
- Files or surfaces to modify: evidence/task packet plus operations source truth and state/context ledgers.
- Logic: no application logic changes.
- Edge cases: avoid exposing secret-adjacent ids/URLs and avoid claiming app readiness from inventory.

### 4. Execute Implementation
- Implementation notes: ran read-only Coolify API probes and documented redacted projection.

### 5. Verify and Test
- Validation performed: heartbeat context plus Coolify project/environment/resource readback.
- Result: pass; eight-resource inventory confirmed.

### 6. Self-Review
- Simpler option considered: relying on `LUC-1448` was rejected because this issue needed its own fresh heartbeat evidence.
- Technical debt introduced: no.
- Scalability assessment: resource-by-resource inventory remains explicit and reusable for deploy verification.
- Refinements made: kept output allowlisted to names/types/status/FQDN presence only.

### 7. Update Documentation and Knowledge
- Docs updated: operations deployment contract, runtime config ledger, service topology.
- Context updated: active mission, project state, task board, module confidence ledger.
- Learning journal updated: not applicable; no new recurring pitfall discovered.

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
- [x] Docs or context were updated because repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.
- [x] Required responsibility lanes were integrated, rejected, or tracked as follow-up.
- [x] Parent validation ran after accepted lane integration.

## Result Report
- Fresh readback at `2026-06-02T07:33:30Z` confirmed Soar production environment id `6`.
- Redacted inventory remains eight resources: six applications (`soar-api`, `soar-web`, `workers-backtest`, `workers-execution`, `workers-market-data`, `workers-market-stream`) plus PostgreSQL and Redis.
- Application inventory status remains `running:unknown`; PostgreSQL and Redis report `running:healthy`.
- The fresh Coolify projection did not expose Dockerfile fields; Dockerfile paths remain from the existing deployment contract.
- Application readiness and protected worker readiness remain separate smoke gates.
