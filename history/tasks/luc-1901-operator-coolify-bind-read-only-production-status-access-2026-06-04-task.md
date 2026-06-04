# Task

## Header
- ID: LUC-1901
- Title: [Operator][Coolify] Bind Coolify read-only production status access
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: none
- Priority: P0
- Module Confidence Rows: operations runtime / Coolify production status access
- Requirement Rows: release/deploy gate evidence
- Quality Scenario Rows: operations reliability and deployment observability
- Risk Rows: production mutation, secret disclosure, stale deploy status
- Iteration: 2026-06-04 Ops heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-1901-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS-2026-06-04
- Mission Status: VERIFIED

## Context
Paperclip assigned a critical Ops issue requesting Coolify base URL/API token
and Soar project binding through approved secret/env mechanisms so Paperclip can
reconcile production deploy status after pushes.

## Goal
Verify the read-only Coolify production status access binding for Soar and
record redacted evidence without mutating production.

## Constraints
- Use existing Coolify API and project-native env-check test.
- Do not print or store secret values, raw resource ids, generated database
  suffixes, cookies, tokens, or screenshots.
- Do not deploy, restart, rollback, edit env, mutate databases, change team
  settings, perform protected smoke, or touch live-trading/account state.
- Treat `COOLIFY_SOAR_APP_ID` as non-authoritative; use
  `project -> production environment -> resources`.

## Definition of Done
- [x] Required Coolify binding names are present without value disclosure.
- [x] Authenticated read-only Coolify calls resolve the expected Soar project,
      production environment, and resource inventory.
- [x] Native env-check test passes.
- [x] Evidence and source-of-truth files are updated.
- [x] Paperclip issue receives final `done` disposition.

## Forbidden
- New systems without approval.
- Duplicated logic or parallel implementations of the same contract.
- Temporary bypasses, hacks, or workaround-only paths.
- Architecture changes without explicit approval.
- Production mutation.

## Validation Evidence
- Tests: `pnpm run ops:coolify-stack:env-check:test` -> pass (`8/8`).
- Manual checks: names-only binding scan and read-only Coolify API calls at
  `2026-06-04T05:16:05Z`.
- Screenshots/logs: none stored.
- High-risk checks: no secret values printed; no production mutation.
- Reality status: verified.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: no repo changes; required names are present in runner.
- Health-check impact: none; this issue verifies Coolify read-only inventory,
  not app readiness.
- Rollback note: any deploy/restart/rollback remains blocked until a separate
  release mutation permit exists.
- Observability or alerting impact: production status reconciliation is
  available for Ops through the project/environment hierarchy.

## Result Report

- Task summary: verified Coolify read-only production status access for Soar.
- Files changed:
  - `.agents/state/active-mission.md`
  - `.agents/state/system-health.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/operations/coolify-vps-deployment-contract.md`
  - `docs/operations/runtime-config-ledger.csv`
  - `history/evidence/luc-1901-coolify-read-only-production-status-access-2026-06-04.md`
  - `history/tasks/luc-1901-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md`
- Validation run: `pnpm run ops:coolify-stack:env-check:test` -> pass (`8/8`).
- Deployment impact: none.
- Residual risk: application rows still report `running:unknown` in Coolify API;
  protected app/worker readiness remains a separate smoke gate.
