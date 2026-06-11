# Task

## Header
- ID: LUC-2920
- Title: [Soar][QA/Test][LUC-2917] Known-state refresh run missing-test link
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-2917](/LUC/issues/LUC-2917)
- Priority: P1
- Module Confidence Rows: Architecture Evidence Graph / known-state refresh tooling
- Requirement Rows: REQ-DOC-028
- Risk Rows: graph drift / evidence-link drift
- Iteration: 2026-06-07
- Operation Mode: TESTER
- Mission ID: LUC-2920-KNOWN-STATE-REFRESH-RUN-MISSING-TEST-LINK-2026-06-07
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the QA/Test assignment.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed for mission boundaries.
- [x] Missing or template-like state tables were not encountered.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement and risk rows were identified.
- [x] The task improves release confidence by removing a concrete scanner-reported missing-test link.

## Mission Block
- Mission objective: cover or classify `scripts/runKnownStateRefresh.mjs#run` with focused local proof and scanner-readable architecture evidence.
- Release objective advanced: reduce architecture-awareness missing-test ambiguity for known-state tooling while protected production gates remain fail-closed.
- Included slices: import-safe helper export, injected local tests, direct priority-test relation row, generated graph/awareness refresh, source-of-truth update.
- Explicit exclusions: no full known-state refresh command chain, deploy, push, restart, rollback, protected smoke, account, secret, database, exchange, order, position, or live-trading mutation.
- Checkpoint cadence: one bounded heartbeat.
- Stop conditions: focused tests fail, architecture-awareness refresh fails, or the target anchor remains in Top Actionable Missing Test Links.
- Handoff expectation: close [LUC-2920](/LUC/issues/LUC-2920) with evidence if the target anchor is removed.

## Context

[LUC-2920](/LUC/issues/LUC-2920) was assigned as a QA/Test child from
[LUC-2917](/LUC/issues/LUC-2917). Wake payload had no pending comments
(`fallbackFetchNeeded=false`); checkout was already claimed by the harness and
was not repeated. The refreshed architecture-awareness report generated
`2026-06-07T19:07:10.394Z` listed
`scripts/runKnownStateRefresh.mjs#run` as an actionable missing-test link.

## Goal

Make the known-state refresh child-command runner locally testable without
executing the full broad refresh pipeline, then add direct scanner-readable
evidence for the `run` function.

## Scope

- `scripts/runKnownStateRefresh.mjs`
- `scripts/runKnownStateRefresh.test.mjs`
- `docs/architecture/relations/priority-test-links.csv`
- generated architecture graph and architecture-awareness exports
- project state/evidence files for this issue

## Implementation Plan

1. Preserve the real CLI behavior but add an import guard and exports.
2. Allow the child-process runner to accept injected `spawn`, `console`, and platform options for deterministic local tests.
3. Add focused tests for command order, spawn options, non-zero child exits, child process errors, and `main` orchestration.
4. Add a direct `LUC-2920` priority-test relation for `scripts/runKnownStateRefresh.mjs#run`.
5. Regenerate graph/awareness outputs and verify the target anchor is no longer a top actionable missing-test link.

## Acceptance Criteria

- `scripts/runKnownStateRefresh.mjs#run` has focused local test coverage.
- Direct relation row exists exactly once.
- Focused syntax and Node tests pass.
- Architecture-awareness refresh passes and removes the target anchor from Top Actionable Missing Test Links.
- Repository guardrails pass.

## Definition of Done

- [x] Focused local proof exists.
- [x] Scanner-readable architecture relation exists.
- [x] Generated graph/awareness readback verifies the target gap is closed.
- [x] No protected/runtime mutation occurred.
- [x] Evidence and source-of-truth files are updated.

## Validation Evidence

- Tests:
  - `node --check scripts/runKnownStateRefresh.mjs` PASS.
  - `node --check scripts/runKnownStateRefresh.test.mjs` PASS.
  - `node --test scripts/runKnownStateRefresh.test.mjs` PASS (`5/5`).
  - `pnpm run architecture:graph:generate` PASS (`653` nodes / `842` relations / `27` chains).
  - `node scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar` from `C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse` PASS (`15046` entities / `34456` relations / `9738` files).
  - `pnpm run quality:guardrails` PASS.
- Manual checks:
  - Direct relation readback PASS (`1` row).
  - `docs/status/architecture-awareness-report.md` generated `2026-06-07T20:07:06.809Z` reports `245` actionable missing-test links and no longer lists `scripts/runKnownStateRefresh.mjs#run` in Top Actionable Missing Test Links.
- High-risk checks: no full `ops:project:known-state` chain, protected smoke, deploy, push, restart, rollback, secret, database, exchange, order, position, or live-trading mutation occurred.
- Module confidence ledger updated: yes.
- Requirements matrix updated: yes.
- Risk register updated: yes.
- Reality status: verified.

## Architecture Evidence

- Architecture source reviewed: `.agents/core/project-memory-index.md`, `.agents/core/mission-control.md`, `docs/automation/guardrail-commands.md`, `docs/status/architecture-awareness-report.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: direct priority-test relation row and generated graph/awareness outputs refreshed.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Rollback note: not applicable; local test/traceability repair only.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `scripts/runKnownStateRefresh.mjs#run` appeared as a missing-test link.
- Gaps: file-level aggregate relation existed, but function-level scanner evidence was absent.
- Inconsistencies: the broad command runner was not import-safe for focused tests.
- Architecture constraints: keep known-state command order and avoid running the broad refresh chain during unit proof.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: Paperclip wake payload, role instructions, project memory index, mission control, current report, existing script/test patterns.
- Blocking unknowns: none.
- Why it was safe to continue: the change is local and preserves direct CLI behavior.

### 2. Select One Priority Mission Objective
- Selected task: [LUC-2920](/LUC/issues/LUC-2920).
- Priority rationale: assigned high-priority QA/Test child for the current top known-state helper missing-test anchor.
- Why other candidates were deferred: generated-index, go-live smoke, and local external gate helpers are separate issue families.

### 3. Plan Implementation
- Files or surfaces to modify: known-state runner, focused test, direct relation row, generated graph/awareness outputs, state/evidence files.
- Logic: dependency-injected child runner and guarded CLI entrypoint.
- Edge cases: non-zero child exit and child process error.

### 4. Execute Implementation
- Implementation notes: exported `commands`, `run`, and `main`; added injected local tests; added one `LUC-2920` relation row.

### 5. Verify and Test
- Validation performed: syntax checks, focused Node tests, direct relation readback, graph generation, architecture-awareness refresh, repository guardrails.
- Result: PASS; target anchor removed from Top Actionable Missing Test Links.

### 6. Self-Review
- Simpler option considered: adding only the direct relation row. Rejected because the helper was not locally testable and the issue requested missing-test link repair, not classification-only.
- Technical debt introduced: no.
- Scalability assessment: import guard and injected runner match existing script-tooling proof patterns.
- Refinements made: kept the full known-state command sequence unchanged.

### 7. Update Documentation and Knowledge
- Docs updated: this task packet, direct relation row, generated architecture evidence.
- Context updated: active mission, system health, module confidence, requirements, risk, project state, task board, next steps.
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

- Task summary: completed local QA/Test proof and architecture relation repair for `scripts/runKnownStateRefresh.mjs#run`.
- Files changed: `scripts/runKnownStateRefresh.mjs`, `scripts/runKnownStateRefresh.test.mjs`, `docs/architecture/relations/priority-test-links.csv`, generated graph/awareness outputs, and state/evidence files.
- How tested: syntax checks, focused Node tests (`5/5`), direct relation readback, graph generation, architecture-awareness refresh, repository guardrails.
- What is incomplete: remaining missing-test links belong to other families (`generateFunctionJourneyIndexes`, `goLiveSmoke`, `runLocalExternalGatesPipeline`, protected-route/browser proof, prod-auth browser proof).
- Next steps: parent queue should select the next non-duplicate family only through a new scoped issue.
- Decisions made: full `ops:project:known-state` was not run because focused local proof should not execute the broad refresh chain.
