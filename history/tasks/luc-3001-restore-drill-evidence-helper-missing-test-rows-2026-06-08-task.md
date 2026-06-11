# Task

## Header
- ID: LUC-3001
- Title: Resolve restore drill evidence helper missing-test rows
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-2998](/LUC/issues/LUC-2998)
- Priority: P0
- Module Confidence Rows: Architecture Evidence Graph / release Ops restore drill helper traceability
- Requirement Rows: REQ-DOC-031
- Quality Scenario Rows: QA-021
- Risk Rows: RISK-021
- Iteration: 2026-06-08
- Operation Mode: TESTER
- Mission ID: LUC-3001-RESTORE-DRILL-EVIDENCE-HELPER-MISSING-TEST-ROWS-2026-06-08
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] Exactly one priority task is selected.
- [x] The task is aligned with repository source-of-truth documents.
- [x] Affected module confidence, requirement, quality, and risk rows were identified.
- [x] The task improves release confidence by repairing local traceability without claiming protected restore-drill proof.

## Mission Block
- Mission objective: resolve or explicitly classify the current local-safe missing-test rows for `scripts/runRestoreDrillEvidence.mjs`.
- Release objective advanced: architecture evidence graph and release Ops helper traceability.
- Included slices: import-safe helper refactor, focused local Node test, scanner-readable relation rows, graph/guardrail proof.
- Explicit exclusions: no real restore drill, protected proof, secret, deploy, push, restart, rollback, database mutation, exchange credential, order, position, account, payment/subscription, or live-trading action.
- Stop conditions: focused helper proof passes, relation readback passes, graph and guardrails pass, or blocker recorded.
- Handoff expectation: parent [LUC-2998](/LUC/issues/LUC-2998) can consume local traceability closure; broader protected restore drill evidence remains separate.

## Context
[LUC-2998](/LUC/issues/LUC-2998) identified `scripts/runRestoreDrillEvidence.mjs` as the next non-duplicate local-safe missing-test family in the architecture-awareness report generated `2026-06-08T00:37:30.029Z`. Existing [LUC-2252](/LUC/issues/LUC-2252) evidence only covered a wrapper relation, not the function-level anchors.

## Goal
Add focused local proof and direct scanner-readable relation rows for:

- `evidenceStamp`
- `main`
- `nowStamp`
- `parseArgs`
- `printUsage`
- `readLatestByPrefix`
- `run`

## Scope
- `scripts/runRestoreDrillEvidence.mjs`
- `scripts/runRestoreDrillEvidence.test.mjs`
- `docs/architecture/relations/priority-test-links.csv`
- generated architecture graph outputs from `pnpm run architecture:graph:generate`
- project state and evidence notes

## Implementation Plan
1. Make the helper import-safe behind a guarded direct CLI entrypoint.
2. Add dependency injection for CLI args, process exit, command execution, filesystem reads/writes, timestamps, and console streams.
3. Add focused `node:test` coverage that mocks backup verification artifacts and does not run a real restore drill.
4. Add direct relation rows for the seven anchors.
5. Run focused syntax/test proof, relation readback, architecture graph generation, and repository guardrails.

## Acceptance Criteria
- Direct CLI `--help` remains safe.
- Focused local tests pass without running restore-drill commands.
- Fail-closed behavior is covered when command/artifact evidence fails.
- Seven direct [LUC-3001](/LUC/issues/LUC-3001) relation rows exist.
- Graph generation and guardrails pass.

## Validation Evidence
- Tests:
  - `node --check scripts/runRestoreDrillEvidence.mjs` PASS.
  - `node --check scripts/runRestoreDrillEvidence.test.mjs` PASS.
  - `node scripts/runRestoreDrillEvidence.mjs --help` PASS.
  - `node --test scripts/runRestoreDrillEvidence.test.mjs` PASS (`7/7`).
  - Direct relation readback PASS (`7` rows).
  - `pnpm run architecture:graph:generate` PASS (`653` nodes / `842` relations / `27` chains).
  - `pnpm run quality:guardrails` PASS.
- Manual checks: `Test-Path scripts/build-architecture-awareness-index.mjs` returned `False`; broader architecture-awareness top-list refresh could not run in this checkout.
- High-risk checks: no real restore drill or protected production command was run.
- Module confidence ledger updated: yes.
- Requirements matrix updated: yes.
- Risk register updated: yes.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/relations/priority-test-links.csv`, `docs/status/architecture-awareness-report.md`, parent issue context.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: graph generated successfully; architecture-awareness refresh remains unavailable because `scripts/build-architecture-awareness-index.mjs` is absent.

## Security / Privacy Evidence
- Data classification: local release-tooling test code and non-secret evidence paths.
- Trust boundaries: production restore drill remains protected/Ops-owned.
- Secret handling: no secret values read, printed, or written.
- Abuse cases: helper tests mock command execution and verify fail-closed behavior instead of executing protected commands.
- Security tests or scans: repository guardrails PASS.
- Fail-closed behavior: covered by focused test where command exit and artifact result fail.
- Residual risk: this proves only local helper logic and traceability, not a real production backup/restore drill.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: missing direct function-level test rows for restore-drill evidence helper.
- Gaps: no `scripts/runRestoreDrillEvidence.test.mjs` before this task.
- Architecture constraints: use priority relation rows and graph generation; do not fake protected proof.

### 2. Select One Priority Mission Objective
- Selected task: [LUC-3001](/LUC/issues/LUC-3001).
- Priority rationale: critical release-evidence traceability backlog item delegated by [LUC-2998](/LUC/issues/LUC-2998).
- Why other candidates were deferred: scoped wake requires this issue only.

### 3. Plan Implementation
- Files or surfaces to modify: restore-drill helper, focused test, priority relation rows, generated graph outputs, state/evidence notes.
- Logic: expose deterministic helper functions and inject side effects for tests.
- Edge cases: help path, dated stamp vs generated stamp, latest artifact selection, PASS and FAIL evidence outcomes.

### 4. Execute Implementation
- Implementation notes: direct CLI behavior preserved through `isDirectRun()` guard; production command execution remains only in direct CLI mode.

### 5. Verify and Test
- Validation performed: focused checks listed above.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: relation-only classification.
- Technical debt introduced: no.
- Scalability assessment: the helper now follows the existing local proof pattern used by adjacent release Ops scripts.
- Refinements made: restored direct CLI stdout/stderr streaming while keeping streams injectable for tests.

### 7. Update Documentation and Knowledge
- Docs updated: task artifact and project state notes.
- Context updated: yes.
- Learning journal updated: not applicable; no recurring new pitfall confirmed.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode selected for a test-automation proof lane.
- [x] Current stage declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems reused.
- [x] No workaround paths introduced.
- [x] No logic duplication introduced.
- [x] Definition of Done evidence attached.
- [x] Relevant validations run.
- [x] Source-of-truth files updated.

## Result Report
- Task summary: `scripts/runRestoreDrillEvidence.mjs` is now import-safe and locally testable, with focused proof and seven scanner-readable relation rows for [LUC-3001](/LUC/issues/LUC-3001).
- Files changed: `scripts/runRestoreDrillEvidence.mjs`, `scripts/runRestoreDrillEvidence.test.mjs`, `docs/architecture/relations/priority-test-links.csv`, generated architecture graph outputs, and state/evidence notes.
- How tested: syntax checks, safe help, focused Node test (`7/7`), relation readback, graph generation, guardrails.
- What is incomplete: broader architecture-awareness refresh/top-list removal could not run because `scripts/build-architecture-awareness-index.mjs` is absent.
- Next steps: parent routing can move to the next non-duplicate missing-test family; protected restore-drill evidence remains an Ops/release gate.
- Decisions made: unit-level helper proof is valid for deterministic command/artifact orchestration; real restore-drill execution remains outside this lane.
