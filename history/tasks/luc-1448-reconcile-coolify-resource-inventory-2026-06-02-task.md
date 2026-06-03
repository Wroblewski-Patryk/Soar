# Task

## Header
- ID: LUC-1448
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

## Constraints
- Use read-only Coolify API access only.
- Do not print or persist tokens, URLs with embedded credentials, cookies, resource ids, database URLs, or other secret-adjacent values.
- Do not deploy, restart, rollback, edit env, mutate database state, or touch live trading/account state.
- Preserve existing project documentation and avoid introducing a new release process.

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
  - `GET /api/issues/LUC-1448/heartbeat-context` -> pass.
  - Coolify env binding names present -> pass, values not printed.
  - `GET /api/v1/projects/{configured-project-id}` -> pass, project `Soar`.
  - `GET /api/v1/projects/{configured-project-id}/environments` -> pass, `production`.
  - `GET /api/v1/projects/{configured-project-id}/production` -> pass, environment id `6`.
  - `GET /api/v1/resources` -> pass, `17` total visible rows.
- Screenshots/logs: redacted evidence in `history/evidence/luc-1448-coolify-resource-inventory-reconciliation-2026-06-02.md`.
- High-risk checks: no deploy/restart/rollback/env/database/account/live-trading mutation performed.
- Module confidence ledger updated: yes.
- Module confidence rows closed or changed: SOAR-OPERATIONS-001 inventory truth refreshed.
- Requirements matrix updated: not applicable for this inventory-only heartbeat.
- Quality scenarios updated: not applicable for this inventory-only heartbeat.
- Risk register updated: not applicable; existing resource-drift risk remains controlled by this evidence.
- Reality status: verified.

## Result Report
- Fresh readback at `2026-06-02T07:04:34Z` confirmed Soar production environment id `6`.
- Redacted inventory remains eight resources: six applications (`soar-api`, `soar-web`, `workers-backtest`, `workers-execution`, `workers-market-data`, `workers-market-stream`) plus PostgreSQL and Redis.
- Application inventory status remains `running:unknown`; PostgreSQL and Redis report `running:healthy`.
- The fresh Coolify projection did not expose Dockerfile fields; Dockerfile paths remain from the existing deployment contract.
- Application readiness and protected worker readiness remain separate smoke gates.
