# Task

## Header
- ID: LUC-5553
- Title: [Operator][Coolify] Bind Coolify read-only production status access
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: none
- Priority: P0
- Module Confidence Rows: Operations / deploy status access
- Requirement Rows: production deployment confidence / status observability
- Quality Scenario Rows: reliability, observability, deployability
- Risk Rows: production credential handling, deploy-status observability,
  production Web/worker restoration
- Iteration: 2026-07-01 SPM heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-5553-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS-2026-07-01
- Mission Status: DONE

## Context
Paperclip selected a local repair/source-control lane for
[LUC-5553](/LUC/issues/LUC-5553), allowing local repository inspection,
relevant validation, and a local commit when evidence supports closure. The
protected delivery gate remains fail-closed: no push, deploy, production
restart, protected smoke/live account mutation, or secret disclosure.

## Goal
Confirm whether the current Paperclip/Soar runner has Coolify read-only
production status access bound for Soar, without exposing secret values or
mutating production.

## Scope
- Names-only Coolify binding presence check.
- Authenticated read-only Coolify `GET` probes.
- Redacted project/environment/resource projection.
- Evidence/task packet creation.
- Local source-control closure for this narrow evidence packet.

## Implementation Plan
1. Acknowledge the scoped wake comment and role boundary.
2. Inspect the current Soar worktree and prior Coolify access evidence.
3. Verify Coolify binding names without printing values.
4. Run authenticated read-only Coolify `GET` probes.
5. Record redacted evidence and residual risk.
6. Commit only this task's new evidence/task files if the dirty worktree allows
   safe subset source-control closure.
7. Update Paperclip issue disposition.

## Acceptance Criteria
- Required Coolify binding names are present.
- Authenticated read-only Coolify endpoints return `200`.
- Configured project resolves to `Soar`.
- Production environment/resource projection is readable.
- No secret values, raw object dumps, or production mutations occur.
- Source-control closure records commit or no-commit blocker.

## Constraints
- Use existing systems and approved mechanisms.
- Do not introduce new structures or workaround paths.
- Do not duplicate existing Coolify logic.
- Preserve unrelated dirty worktree changes.
- Stay inside Product Manager coordination and verification boundary; mutation
  and credential ownership remain Ops/Security work.

## Definition of Done
- [x] Binding names checked without values.
- [x] Read-only Coolify endpoints verified.
- [x] Soar project and production environment verified.
- [x] Production status projection recorded without raw IDs or secret-bearing
      fields.
- [x] Residual production restoration risk assigned to existing Ops owner path.
- [x] Local source-control closure attempted for this narrow evidence packet.

## Forbidden
- Push, deploy, production restart, rollback, Coolify mutation, environment
  edit, credential value readback, raw Coolify object storage, raw log-body
  capture, DB/Redis mutation, production account mutation,
  exchange/payment action, order, position, subscription mutation, or
  live-trading action.

## Validation Evidence
- Commands:
  - `git status --short` -> dirty from unrelated active lanes before this
    heartbeat.
  - Names-only environment scan for `COOLIFY*`, `VPS*`, `SSH*`,
    `SOAR_PROD*` -> Coolify binding family present; values not printed.
  - Process-local Node `fetch` script for Coolify read-only endpoints ->
    `PASS`.
- Read-only Coolify endpoint results:
  - `/api/v1/version`: `200`
  - `/api/v1/teams`: `200`
  - `/api/v1/teams/current`: `200`
  - `/api/v1/projects/{COOLIFY_SOAR_PROJECT_ID}`: `200`
  - `/api/v1/projects/{COOLIFY_SOAR_PROJECT_ID}/environments`: `200`
  - `/api/v1/projects/{COOLIFY_SOAR_PROJECT_ID}/production`: `200`
  - `/api/v1/resources`: `200`
- Redacted projection:
  - team selector id `0`, name `LuckySparrow`
  - project `Soar`
  - environment `production`
  - visible resources `17`
  - production collections: `6` applications, `1` PostgreSQL, `1` Redis
  - `soar-web` and `workers-backtest` currently `exited:unhealthy`
- High-risk checks:
  - no secret values printed or stored
  - no mutation performed
  - no push/deploy/restart/rollback performed
- Reality status: verified for access binding; production restoration remains
  outside this issue.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/operations/coolify-linux-vps-setup-guide.md`
  - `docs/operations/coolify-vps-deployment-contract.md`
  - recent [LUC-6412](/LUC/issues/LUC-6412) evidence packet
- Fits approved architecture: yes; Coolify is treated as
  `project -> production environment -> resources`.
- Mismatch discovered: no.
- Decision required from user: no.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none from this issue.
- Smoke steps updated: no.
- Rollback note: not applicable; no rollback executed.
- Observability impact: confirms read-only status access needed for production
  deploy/resource reconciliation.

## Security / Privacy Evidence
- Data classification: production infrastructure metadata; secrets excluded.
- Trust boundary: Paperclip/Soar runner to Coolify API.
- Permission model: read-only `GET` status projection only.
- Abuse cases considered: secret output, raw UUID/object persistence, mutation,
  restart, deploy, rollback, and live account mutation were avoided.
- Fail-closed behavior: unhealthy resources were reported but not mutated.

## Source-Control Closure
- Application/repo path affected: `C:/Personal/Projekty/Aplikacje/Soar`
- Files changed by this heartbeat:
  - `history/evidence/luc-5553-coolify-read-only-production-status-access-2026-07-01.md`
  - `history/tasks/luc-5553-operator-coolify-bind-read-only-production-status-access-2026-07-01-task.md`
- Commit SHA: pending at task packet creation; final Paperclip issue comment
  records the resulting SHA or blocker.
- Push status: not needed / forbidden by protected delivery gate.
- Deploy impact: none.
- Coolify/resource evidence: read-only projection shows `soar-web` and
  `workers-backtest` as `exited:unhealthy`; PostgreSQL and Redis are
  `running:healthy`.
- Residual risk: production application readiness is not solved by this access
  binding issue.
- Next owner: Ops Release Lead / board-approved Coolify mutation owner remains
  responsible for [LUC-6331](/LUC/issues/LUC-6331) restoration.

## Result Report
- Task summary: Coolify read-only production status access is bound and
  verified for Soar.
- Files changed: evidence/task docs only.
- How tested: names-only binding scan and authenticated read-only Coolify
  `GET` probes.
- What is incomplete: production resource restoration, which belongs to the
  existing Ops mutation owner path.
- Decisions made: no production mutation or secret disclosure was needed.
