# Task

## Header
- ID: LUC-1898
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
- Mission ID: LUC-1898-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS-2026-06-04
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the current bounded Ops heartbeat.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was not fully reread because this
      scoped heartbeat is a narrow repeat Ops binding proof; active mission and
      operations source truth were refreshed.
- [x] `.agents/core/mission-control.md` was not fully reread because this was
      not a long-running mission.
- [x] Missing or template-like state tables were not encountered.
- [x] Affected module confidence rows were identified as operations runtime.
- [x] Affected requirement, quality scenario, and risk rows were identified at
      the release/deploy gate level.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: verify that Ops has read-only Coolify production status
  access for Soar without exposing secrets or mutating production.
- Release objective advanced: Soar production deploy confidence.
- Included slices: Paperclip scoped wake, names-only binding scan, read-only
  Coolify current-team/project/environment/resource reads, native env-check
  test, source-of-truth/evidence update, issue closure.
- Explicit exclusions: deploy, restart, rollback, environment edit, database
  action, team setting change, account action, protected smoke, live-trading
  action, secret value readback, raw resource id storage.
- Checkpoint cadence: one heartbeat.
- Stop conditions: any missing required binding, failed authenticated read, or
  accidental need for mutation.
- Handoff expectation: close issue as `done` if read-only access is verified;
  otherwise block with named owner/action.

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
  `2026-06-04T05:04:58Z`.
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
  available for Ops.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: `LUC-1898` in progress, critical, no blockers.
- Gaps: optional team-id env refs remain absent.
- Inconsistencies: none; selector readback succeeds under `LuckySparrow`.
- Architecture constraints: Coolify is a hierarchy, not a single app id.

### 2. Select One Priority Mission Objective
- Selected task: verify Coolify read-only production status access for
  `LUC-1898`.
- Priority rationale: critical production deploy confidence gate.
- Why other candidates were deferred: scoped wake required staying on
  `LUC-1898`.

### 3. Plan Implementation
- Files or surfaces to modify: evidence/task docs and ops source-of-truth
  ledgers only.
- Logic: names-only env scan, read-only Coolify API calls, native test.
- Edge cases: optional team binding absent; application inventory status remains
  `running:unknown`.

### 4. Execute Implementation
- Implementation notes: no code changes; redacted status evidence captured.

### 5. Verify and Test
- Validation performed: authenticated Coolify read-only calls and
  `pnpm run ops:coolify-stack:env-check:test`.
- Result: pass.

### 6. Self-Review
- Simpler option considered: relying on `LUC-1890` evidence only; rejected
  because this issue needed fresh binding proof.
- Technical debt introduced: no.
- Scalability assessment: repeatable proof remains the native env-check test
  plus read-only Coolify projections.

### 7. Update Documentation and Knowledge
- Docs updated: `docs/operations/coolify-vps-deployment-contract.md`,
  `docs/operations/runtime-config-ledger.csv`.
- Context updated: `.agents/state/active-mission.md`,
  `.agents/state/system-health.md`, `.codex/context/PROJECT_STATE.md`,
  `.codex/context/TASK_BOARD.md`.
- Learning journal updated: not applicable; no new recurring pitfall was
  discovered.

## Result Report

- Task summary: verified Coolify read-only production status access for Soar.
- Files changed:
  - `.agents/state/active-mission.md`
  - `.agents/state/system-health.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/operations/coolify-vps-deployment-contract.md`
  - `docs/operations/runtime-config-ledger.csv`
  - `history/evidence/luc-1898-coolify-read-only-production-status-access-2026-06-04.md`
  - `history/tasks/luc-1898-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md`
- Validation run: `pnpm run ops:coolify-stack:env-check:test` -> pass (`8/8`).
- Deployment impact: none.
- Residual risk: application rows still report `running:unknown` in Coolify API;
  protected app/worker readiness remains a separate smoke gate.
