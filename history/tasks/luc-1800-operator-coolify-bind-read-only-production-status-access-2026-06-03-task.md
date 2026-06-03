# Task

## Header
- ID: LUC-1800
- Title: [Operator][Coolify] Bind Coolify read-only production status access
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Soar Project Manager / Ops closure lane
- Depends on: none
- Priority: P0
- Module Confidence Rows: Operations / Coolify production status access
- Requirement Rows: release evidence / production deploy confidence
- Quality Scenario Rows: deployment safety, secret handling
- Risk Rows: production mutation and secret disclosure risk
- Iteration: 2026-06-03 heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-1800-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS-2026-06-03
- Mission Status: VERIFIED

## Context
[LUC-1800](/LUC/issues/LUC-1800) was woken by comment
`d842b9d7-0366-4c35-98ca-c4831225aae5`, which selected an autonomous local
repair/source-control lane. The wake explicitly allowed local repository
inspection, relevant validation, and local commit when supported by evidence,
while forbidding push, deploy, production restart, protected smoke/live account
mutation, and secret disclosure.

## Goal
Verify that current runner bindings can read Coolify production status metadata
for Soar without exposing secrets or mutating production, then close the local
docs/evidence/source-control state if validation supports it.

## Scope
- Coolify binding names in the current runner.
- Coolify read-only endpoints for current team, teams, configured project,
  environments, production environment, and resources.
- Source-of-truth task/evidence notes for the issue.
- Local validation and commit/no-commit decision.

## Implementation Plan
1. Acknowledge the latest wake comment and preserve the fail-closed production
   boundary.
2. Classify the current dirty set before editing.
3. Confirm required Coolify binding names are present without printing values.
4. Run read-only Coolify API probes and store only redacted names/status proof.
5. Run focused Ops validation.
6. Record evidence, update source truth, and make a local commit only if the
   final dirty set is coherent and validation passes.

## Acceptance Criteria
- Required binding names are present by name without value disclosure.
- Coolify project `Soar`, production environment `production`, and resource
  inventory are readable.
- Evidence records names/status only.
- No production mutation or secret disclosure occurs.
- Local commit decision is explicit.

## Definition of Done
- [x] Read-only Coolify status proof captured.
- [x] Secret and production mutation safety boundary recorded.
- [x] Focused validation run.
- [x] Local source-control disposition recorded.
- [x] Paperclip issue updated to a final disposition.

## Forbidden
- Push, deploy, restart, rollback, env edit, database action, team setting
  change, account mutation, protected smoke, live-trading action, or other
  production mutation.
- Secret value, token, cookie, raw resource id, DB URL, or generated DB suffix
  disclosure.
- Treating `COOLIFY_SOAR_APP_ID` as the whole Soar deployment.

## Validation Evidence
- Manual checks: read-only Coolify API probes passed at
  `2026-06-03T15:59:27Z`.
- Tests: `pnpm run ops:coolify-stack:env-check:test` -> PASS (`8/8`).
- Screenshots/logs: none; no screenshots were needed or safe for this proof.
- High-risk checks: no production mutation and no secret readback occurred.
- Reality status: verified.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none in repo; existing runner bindings were verified.
- Health-check impact: none.
- Smoke steps updated: none.
- Rollback note: no mutation occurred, so no rollback action is required.
- Observability or alerting impact: confirms read-only production status access
  remains usable for deploy confidence checks.
- Staged rollout or feature flag: not applicable.

## Result Report
- Task summary: verified read-only Coolify production status access for Soar and
  prepared local docs/evidence source-control closure.
- Files changed:
  - `history/evidence/luc-1800-coolify-read-only-production-status-access-2026-06-03.md`
  - `history/tasks/luc-1800-operator-coolify-bind-read-only-production-status-access-2026-06-03-task.md`
  - `.agents/state/active-mission.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/operations/coolify-vps-deployment-contract.md`
  - `docs/operations/runtime-config-ledger.csv`
- How tested: names-only binding scan, Coolify read-only API probes, focused
  env-check unit test, and source-control validation.
- What is incomplete: full deploy-stack env readiness, protected runtime smoke,
  deploy, restart, rollback, and application readiness are separate release
  gates outside this issue.
- Next steps: use this read-only access only in future deploy/status
  reconciliation lanes that explicitly authorize the check.
