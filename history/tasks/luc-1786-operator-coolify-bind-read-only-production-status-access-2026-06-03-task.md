# Task

## Header
- ID: LUC-1786
- Title: [Operator][Coolify] Bind Coolify read-only production status access
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: none
- Priority: P0
- Module Confidence Rows: Operations / Coolify production status access
- Requirement Rows: release evidence / production deploy confidence
- Quality Scenario Rows: deployment safety, secret handling
- Risk Rows: production mutation and secret disclosure risk
- Iteration: 2026-06-03 heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-1786-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS-2026-06-03
- Mission Status: VERIFIED

## Context
[LUC-1786](/LUC/issues/LUC-1786) was delegated to Ops Release Lead as the only
current eligible runnable lane from the autonomy governor refresh. The issue
required read-only Coolify production status metadata proof or a blocked
disposition naming the missing owner/action.

## Goal
Verify that approved runner bindings can read Coolify production status metadata
for Soar without exposing secrets or mutating production.

## Scope
- Coolify binding names in the current runner.
- Coolify read-only endpoints for current team, teams, configured project,
  environments, production environment, and resources.
- Paperclip issue evidence and source-of-truth task/evidence notes.

## Implementation Plan
1. Checkout [LUC-1786](/LUC/issues/LUC-1786) in Paperclip.
2. Read heartbeat context and acknowledge the delegated comment scope.
3. Confirm required Coolify binding names are present without printing values.
4. Run read-only Coolify API probes and keep only redacted names/status proof.
5. Run the focused env-check unit test.
6. Record evidence and close the Paperclip issue with no-mutation notes.

## Acceptance Criteria
- Required binding names are present by name without value disclosure.
- Coolify project `Soar`, production environment `production`, and resource
  inventory are readable.
- Evidence records names/status only.
- No production mutation or secret disclosure occurs.

## Definition of Done
- [x] Read-only Coolify status proof captured.
- [x] Secret and production mutation safety boundary recorded.
- [x] Focused validation run.
- [x] Paperclip issue updated to a final disposition.

## Forbidden
- Deploy, restart, rollback, env edit, database action, team setting change,
  account mutation, protected smoke, live-trading action, or other production
  mutation.
- Secret value, token, cookie, raw resource id, DB URL, or generated DB suffix
  disclosure.
- Treating `COOLIFY_SOAR_APP_ID` as the whole Soar deployment.

## Validation Evidence
- Tests: `pnpm run ops:coolify-stack:env-check:test` -> PASS (`8/8`).
- Manual checks: read-only Coolify API probes passed at
  `2026-06-03T14:35:07Z`.
- Screenshots/logs: none; no screenshots were needed or safe for this proof.
- High-risk checks: no production mutation and no secret readback occurred.
- Module confidence ledger updated: not applicable; no module behavior changed.
- Requirements matrix updated: not applicable; this issue recorded operational
  proof only.
- Reality status: verified.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none in repo; existing runner bindings were verified.
- Health-check impact: none.
- Smoke steps updated: none.
- Rollback note: no mutation occurred, so no rollback action is required.
- Observability or alerting impact: Coolify read-only status access can now be
  used for deploy confidence checks.
- Staged rollout or feature flag: not applicable.

## Result Report
- Task summary: verified read-only Coolify production status access for Soar.
- Files changed:
  - `history/evidence/luc-1786-coolify-read-only-production-status-access-2026-06-03.md`
  - `history/tasks/luc-1786-operator-coolify-bind-read-only-production-status-access-2026-06-03-task.md`
- How tested: Paperclip heartbeat context, names-only binding scan, Coolify
  read-only API probes, focused env-check unit test.
- What is incomplete: full deploy-stack env readiness is out of scope for this
  issue and remains a separate release gate.
- Next steps: use this read-only access in subsequent production deploy/status
  reconciliation lanes when a release task authorizes that check.
