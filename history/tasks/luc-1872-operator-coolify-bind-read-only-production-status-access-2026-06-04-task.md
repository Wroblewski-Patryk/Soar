# Task

## Header
- ID: LUC-1872
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
- Mission ID: LUC-1872-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS-2026-06-04
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

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Ops | Ops Release Lead | `DEPLOYMENT_GATE.md`, `docs/operations/coolify-vps-deployment-contract.md`, `docs/operations/runtime-config-ledger.csv` | Coolify read-only status proof and ops evidence | Verified binding evidence | Coolify API reads and env-check test | DONE |
| Documentation/Memory | Ops Release Lead | `.agents/state/active-mission.md`, `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md` | Task/evidence/state updates | Durable source truth | Diff review | DONE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was refreshed.
- [x] Responsibility was single-lane Ops.
- [x] No two write lanes owned the same file.
- [x] Each lane has expected output and validation/proof.
- [x] Missing or unclear ownership was not found.

## Context
Paperclip assigned a critical Ops issue requesting Coolify base URL/API token
and Soar project binding through approved secret/env mechanisms so Paperclip can
reconcile production deploy status after pushes.

## Goal
Verify the read-only Coolify production status access binding for Soar and
record redacted evidence without mutating production.

## Success Signal
- User or operator problem: Paperclip needs production status reconciliation
  access after source updates.
- Expected product or reliability outcome: Ops can read Coolify project,
  production environment, and resource status metadata.
- How success will be observed: names-only binding scan and authenticated
  read-only API calls pass.
- Post-launch learning needed: no.

## Deliverable For This Stage
Verification evidence and source-of-truth updates for `LUC-1872`.

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

## Stage Exit Criteria
- [x] The output matches the declared `verification` stage.
- [x] Work from later stages was not mixed in.
- [x] Risks and assumptions are stated clearly.

## Forbidden
- New systems without approval.
- Duplicated logic or parallel implementations of the same contract.
- Temporary bypasses, hacks, or workaround-only paths.
- Architecture changes without explicit approval.
- Production mutation.

## Validation Evidence
- Tests: `pnpm run ops:coolify-stack:env-check:test` -> pass (`8/8`).
- Manual checks: names-only binding scan and read-only Coolify API calls at
  `2026-06-04T02:18:26Z`.
- Screenshots/logs: none stored.
- High-risk checks: no secret values printed; no production mutation.
- Module confidence ledger updated: not applicable for this narrow Ops binding
  refresh; operations source truth was updated.
- Requirements matrix updated: not applicable.
- Quality scenarios updated: not applicable.
- Risk register updated: not applicable.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `DEPLOYMENT_GATE.md`,
  `docs/operations/coolify-vps-deployment-contract.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: no repo changes; required names are present in runner.
- Health-check impact: none; this issue verifies Coolify read-only inventory,
  not app readiness.
- Smoke steps updated: no.
- Rollback note: any deploy/restart/rollback remains blocked until a separate
  release mutation permit exists.
- Observability or alerting impact: production status reconciliation is
  available for Ops.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `LUC-1872` in progress, critical, no blockers.
- Gaps: optional team-id env refs remain absent.
- Inconsistencies: none; selector readback succeeds under `LuckySparrow`.
- Architecture constraints: Coolify is a hierarchy, not a single app id.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: Paperclip heartbeat context, deployment gate, Coolify
  deployment contract, runtime config ledger, prior `LUC-1850`/`LUC-1857`
  evidence.
- Assumptions recorded: optional team-id absence is not active blocker because
  current-team and project-scoped reads pass.
- Blocking unknowns: none for this issue.
- Why it was safe to continue: issue requested read-only access verification
  and required bindings were present.

### 2. Select One Priority Mission Objective
- Selected task: verify Coolify read-only production status access for
  `LUC-1872`.
- Priority rationale: critical production deploy confidence gate.
- Why other candidates were deferred: scoped wake required staying on
  `LUC-1872`.

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
- Simpler option considered: relying on `LUC-1857` evidence only; rejected
  because this issue needed fresh binding proof.
- Technical debt introduced: no.
- Scalability assessment: repeatable proof remains the native env-check test
  plus read-only Coolify projections.
- Refinements made: recorded PowerShell projection parser retry.

### 7. Update Documentation and Knowledge
- Docs updated: `docs/operations/coolify-vps-deployment-contract.md`,
  `docs/operations/runtime-config-ledger.csv`.
- Context updated: `.agents/state/active-mission.md`,
  `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`.
- Learning journal updated: not applicable.

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
- [x] Docs or context were updated because repository truth changed.
- [x] Required responsibility lanes were integrated.

## Result Report

- Task summary: verified Coolify read-only production status access for Soar.
- Files changed:
  - `.agents/state/active-mission.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/operations/coolify-vps-deployment-contract.md`
  - `docs/operations/runtime-config-ledger.csv`
  - `history/evidence/luc-1872-coolify-read-only-production-status-access-2026-06-04.md`
  - `history/tasks/luc-1872-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md`
- How tested:
  - names-only binding scan;
  - read-only Coolify API calls for current team, teams, project,
    environments, production environment, and resources;
  - `pnpm run ops:coolify-stack:env-check:test`.
- What is incomplete: application readiness/protected worker readiness remain
  separate smoke gates.
- Next steps: use this access for future deploy status reconciliation; request
  a separate release mutation permit for any deploy, restart, rollback, or env
  action.
- Decisions made: optional team-id bindings remain non-blocking while current
  selector and project-scoped reads pass.
