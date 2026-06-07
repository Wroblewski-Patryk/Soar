# Task

## Header
- ID: LUC-2639
- Title: [Soar][Architecture QA][LUC-2638] Repair API endpoint docs parity script missing-test links
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: LUC-2638
- Priority: P1
- Module Confidence Rows: Architecture/docs parity confidence
- Requirement Rows: REQ-DOC-031
- Quality Scenario Rows: not applicable
- Risk Rows: RISK-DOC-005
- Iteration: 2026-06-07
- Operation Mode: TESTER
- Mission ID: LUC-2639-API-ENDPOINT-DOCS-PARITY-SCRIPT-MISSING-TEST-LINKS-2026-06-07
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the Test Automation issue ownership.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement and risk rows were identified.
- [x] The task improves release confidence by making architecture QA proof traceable.

## Mission Block
- Mission objective: close the current missing-test link family for `scripts/auditApiEndpointDocsParity.mjs`.
- Release objective advanced: V1 audit-to-completion architecture QA traceability.
- Included slices: import-safe script exports, focused Node test coverage, scanner-readable relation rows, local validation.
- Explicit exclusions: deploy, push, restart, rollback, production smoke, production browser, account, secret, exchange, database, and live-trading mutation.
- Checkpoint cadence: one bounded heartbeat.
- Stop conditions: focused proof fails, endpoint parity fails, graph generation fails, or guardrails fail.
- Handoff expectation: issue can close when proof and state updates are recorded.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | Wake payload; `.agents/state/next-steps.md` | Integration and final disposition | Task evidence and board update | Parent validation gate | DONE |
| QA/Test | Test Automation Engineer | `docs/status/architecture-awareness-report.md` | `scripts/auditApiEndpointDocsParity.mjs`, test file | Focused script proof | `node --test scripts/auditApiEndpointDocsParity.test.mjs` | DONE |
| Documentation/Memory | Active chat | `docs/architecture/relations/priority-test-links.csv` | Direct relation rows | Scanner-readable proof links | `pnpm run architecture:graph:generate` | DONE |

## Context
[LUC-2638](/LUC/issues/LUC-2638) delegated [LUC-2639](/LUC/issues/LUC-2639) after the current architecture-awareness report listed missing-test samples for `scripts/auditApiEndpointDocsParity.mjs` helper functions.

## Goal
Make the API endpoint docs parity script import-safe, add focused local tests for its parser/route collection helpers, and add direct architecture relation rows so the scanner can connect the proof to the missing-test anchors.

## Scope
- `scripts/auditApiEndpointDocsParity.mjs`
- `scripts/auditApiEndpointDocsParity.test.mjs`
- `docs/architecture/relations/priority-test-links.csv`
- `history/artifacts/luc-2639-api-endpoint-docs-parity-2026-06-07/*`
- source-of-truth state files updated for closure

## Implementation Plan
1. Refactor the script to export helper functions and guard `main()` behind a direct-run check.
2. Fix relative import resolution to choose an existing candidate file.
3. Add Node fixture tests for argument parsing, route joining, module/doc mapping, import parsing, import resolution, and mounted route collection.
4. Add direct `priority-test-links.csv` rows for the reported script anchors.
5. Run focused proof, endpoint docs parity, architecture graph generation, and repository guardrails.

## Acceptance Criteria
- `node --test scripts/auditApiEndpointDocsParity.test.mjs` passes.
- `pnpm run docs:parity:endpoints:api -- --date 2026-06-07 --out-dir history/artifacts/luc-2639-api-endpoint-docs-parity-2026-06-07` passes with `109/109` documented and `0` gaps.
- `pnpm run architecture:graph:generate` passes.
- `pnpm run quality:guardrails` passes.
- No protected/runtime/deploy/account/secret/database/exchange/live-trading mutation occurs.

## Definition of Done
- [x] Focused test coverage exists for the assigned script helper family.
- [x] Direct scanner-readable relation rows exist for the assigned anchors.
- [x] Local proof commands pass and evidence is recorded.

## Forbidden
- new systems without approval
- duplicated tooling or parallel parity checker implementation
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- deploy, push, restart, rollback, protected smoke, account, secret, exchange, database, or live-trading mutation

## Validation Evidence
- Tests: `node --test scripts/auditApiEndpointDocsParity.test.mjs` PASS (`5/5`).
- Manual checks: code inspection of import-safe direct-run guard and existing-candidate import resolution.
- Screenshots/logs: not applicable.
- High-risk checks: no protected or production actions.
- Module confidence ledger updated: yes.
- Module confidence rows closed or changed: Architecture/docs parity confidence local traceability entry added.
- Requirements matrix updated: no; existing `REQ-DOC-031` remains active architecture-backed gap governance.
- Quality scenarios updated: not applicable.
- Risk register updated: no; existing `RISK-DOC-005` remains mitigated by graph/guardrail workflow.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `.agents/core/project-memory-index.md`, `docs/status/architecture-awareness-report.md`, `docs/architecture/relations/priority-test-links.csv`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none beyond relation rows.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: local-only script/test relation change; revert commit if needed.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: architecture-awareness listed `auditApiEndpointDocsParity.mjs` helper functions as missing direct tests.
- Gaps: script was not import-safe for focused helper tests and lacked direct relation rows.
- Inconsistencies: aggregate tooling proof existed, but current issue requested focused missing-test link repair.
- Architecture constraints: use existing graph relation CSV and Node test patterns.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: wake payload, next steps, project memory, mission-control, current awareness report, existing route/API matrix checker pattern.
- Why it was safe to continue: scope was local tooling/test traceability only.

### 2. Select One Priority Mission Objective
- Selected task: [LUC-2639](/LUC/issues/LUC-2639).
- Priority rationale: high-priority assigned issue and current active next-step lane from [LUC-2638](/LUC/issues/LUC-2638).
- Why other candidates were deferred: wake payload scoped the heartbeat to this issue.

### 3. Plan Implementation
- Files or surfaces to modify: parity script, focused test, priority test relation CSV, state/evidence.
- Logic: export helpers, direct-run guard, existing-file import resolution.
- Edge cases: index-file router imports, dynamic route mentions, root/admin/profile docs path mapping.

### 4. Execute Implementation
- Implementation notes: added focused `node:test` fixture coverage and direct relation rows for the current script helper anchors.

### 5. Verify and Test
- Validation performed:
  - `node --test scripts/auditApiEndpointDocsParity.test.mjs` PASS (`5/5`)
  - `pnpm run docs:parity:endpoints:api -- --date 2026-06-07 --out-dir history/artifacts/luc-2639-api-endpoint-docs-parity-2026-06-07` PASS (`109` endpoints / `109` documented / `0` gaps)
  - `pnpm run architecture:graph:generate` PASS (`653` nodes / `842` relations / `27` chains)
  - `pnpm run quality:guardrails` PASS
- Result: verified.

### 6. Self-Review
- Simpler option considered: only adding aggregate relation rows. Rejected because the issue specifically asked to repair missing-test links for this script family.
- Technical debt introduced: no.
- Scalability assessment: focused exports make future parser regressions testable without invoking the CLI.
- Refinements made: import resolution now checks for existing candidates before following mounted routers.

### 7. Update Documentation and Knowledge
- Docs updated: `docs/architecture/relations/priority-test-links.csv`.
- Context updated: task board, project state, active mission, next steps, module confidence, system health.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.

## Result Report
- Task summary: repaired focused testability and architecture test-link traceability for API endpoint docs parity script helpers.
- Files changed: `scripts/auditApiEndpointDocsParity.mjs`, `scripts/auditApiEndpointDocsParity.test.mjs`, `docs/architecture/relations/priority-test-links.csv`, source-of-truth state files, and generated LUC-2639 parity artifact files.
- How tested: focused Node test, endpoint docs parity command, architecture graph generation, repository guardrails.
- What is incomplete: local architecture-awareness refresh was not run because the known builder scripts are absent in this checkout; exact top-sample removal is not claimed.
- Next steps: do not reopen this script family unless a future refreshed architecture-awareness report reintroduces a concrete row or the focused test fails.
- Decisions made: no product/architecture behavior change; this is local tooling proof and graph relation repair only.
