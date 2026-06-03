# Task

## Header
- ID: LUC-1790
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
- Mission ID: LUC-1790-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS-2026-06-03
- Mission Status: VERIFIED

## Context
[LUC-1790](/LUC/issues/LUC-1790) required binding or verification of read-only
Coolify production status access for Soar. The wake payload contained no new
comments and stated that the issue was already checked out by the harness.

## Goal
Verify that the current Ops runner can read Coolify production status metadata
for Soar without exposing secrets or mutating production.

## Constraints
- Use only read-only Coolify API calls.
- Never print or store secret values, tokens, cookies, raw resource ids,
  database URLs, generated DB suffixes, or screenshots.
- Treat Coolify as `project -> production environment -> resources`.
- Do not use legacy single-resource aliases as whole-stack release authority.

## Definition of Done
- [x] Required binding names are present without value disclosure.
- [x] Coolify project `Soar`, environment `production`, and production resources
  are readable.
- [x] Evidence records only names, counts, labels, and status summaries.
- [x] Focused Ops env-check test passes.
- [x] Paperclip issue receives final status disposition.

## Forbidden
- Deploy, restart, rollback, environment edit, database action, team setting
  change, account mutation, protected smoke, live-trading action, or other
  production mutation.
- Secret value, token, cookie, raw resource id, DB URL, or generated DB suffix
  disclosure.
- Treating `COOLIFY_SOAR_APP_ID` as the whole Soar deployment.

## Validation Evidence
- Manual checks: read-only Coolify API probes passed at
  `2026-06-03T15:03:21Z`.
- Tests: `pnpm run ops:coolify-stack:env-check:test` -> PASS (`8/8`).
- Screenshots/logs: none; no screenshots were needed or safe for this proof.
- High-risk checks: no production mutation and no secret readback occurred.
- Reality status: verified.

## Result Report
- Task summary: verified read-only Coolify production status access for Soar.
- Files changed:
  - `history/evidence/luc-1790-coolify-read-only-production-status-access-2026-06-03.md`
  - `history/tasks/luc-1790-operator-coolify-bind-read-only-production-status-access-2026-06-03-task.md`
  - `docs/operations/coolify-vps-deployment-contract.md`
- How tested: Paperclip heartbeat context, names-only binding scan, Coolify
  read-only API probes, focused env-check unit test.
- What is incomplete: full deploy-stack env readiness, protected runtime smoke,
  deploy, restart, rollback, and application readiness are separate release
  gates outside this issue.
- Next steps: use this read-only access in deploy/status reconciliation lanes
  only when a release task authorizes that check.
