# LUC-2791 Function And User-Action Index Generator Missing-Test Links

Date: 2026-06-28

## Header

- ID: LUC-2791
- Title: Function and user-action index generator missing-test links
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: LUC-2789
- Priority: P1
- Module Confidence Rows: architecture awareness / test automation tooling
- Requirement Rows: not applicable
- Quality Scenario Rows: test automation evidence freshness
- Risk Rows: stale generated index evidence
- Iteration: scoped Paperclip heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-2791-FUNCTION-USER-ACTION-GENERATOR-PROOF-2026-06-28
- Mission Status: VERIFIED

## Context

LUC-2791 was created from the LUC-2789 architecture repair backlog after an
older architecture-awareness report listed missing-test links for
`scripts/generateFunctionJourneyIndexes.mjs` and
`scripts/generateUserActionIndex.mjs`.

The wake was a source-scoped recovery action. The issue had been marked blocked
by recovery/liveness handling, but Paperclip heartbeat context showed no
first-class blockers and no unresolved `blockedBy` issues.

## Goal

Verify whether the generator helper clusters now have focused local tests and
scanner-readable test-link evidence, then close or record a precise blocker.

## Scope

- `scripts/generateFunctionJourneyIndexes.mjs`
- `scripts/generateFunctionJourneyIndexes.test.mjs`
- `scripts/generateUserActionIndex.mjs`
- `scripts/generateUserActionIndex.test.mjs`
- `docs/architecture/relations/priority-test-links.csv`
- `docs/status/architecture-awareness-report.md`
- Generated journey-index outputs under `docs/graphs`, `docs/status`,
  `docs/architecture/indices`, and `history/artifacts`.

## Implementation Plan

1. Inspect issue context and confirm blocker state.
2. Inspect existing generator tests and priority test-link rows.
3. Run focused generator tests.
4. Run strict journey index generation.
5. Check architecture-awareness report for actionable missing-test rows.
6. Record closure evidence without protected/browser/production work.

## Acceptance Criteria

- Focused generator tests pass.
- Strict journey-index generation passes with zero critical gaps.
- Current architecture-awareness report has no actionable missing-test rows for
  the covered generator helper cluster, or a precise blocker is recorded.
- Closure records affected files, verification commands, source-control state,
  deploy impact, and residual risk.

## Definition of Done

- Existing focused tests are proven against the current workspace.
- Generated index proof is refreshed.
- Paperclip issue can be moved to `done` with no remaining blocker.

## Forbidden

- No protected browser proof.
- No production access, deploy, restart, push, secret readback, account
  mutation, exchange mutation, order, position, or live-trading action.
- No generator redesign.

## Validation Evidence

- Tests:
  - `node --test scripts/generateFunctionJourneyIndexes.test.mjs` PASS
    (`6/6`).
  - `node --test scripts/generateUserActionIndex.test.mjs` PASS (`6/6`).
  - `pnpm run architecture:journey:index:strict` PASS:
    function journey indexes generated `27` chains, `38` web journeys,
    `97` API surfaces, `0` critical gaps, `28` high gaps; user action index
    generated `41` actions, `0` critical gaps, `39` high gaps, `0` medium
    gaps.
- Manual checks:
  - `docs/status/architecture-awareness-report.md` reports
    `Actionable implementation entities without inferred tests: 0`.
  - `docs/status/architecture-awareness-report.md` has an empty
    `Top Actionable Missing Test Links` section.
  - `docs/architecture/relations/priority-test-links.csv` contains direct
    scanner-readable rows for `generateFunctionJourneyIndexes` helpers
    (`LUC-2871`) and `generateUserActionIndex` helpers (`LUC-2872`).
- Screenshots/logs: not applicable.
- High-risk checks: protected/runtime checks not required and not performed.
- Module confidence ledger updated: no; this was a verification-only tooling
  closure on already-linked generator tests.
- Requirements matrix updated: not applicable.
- Quality scenarios updated: not applicable.
- Risk register updated: not applicable.
- Reality status: verified.

## Architecture Evidence

- Architecture source reviewed:
  `docs/status/architecture-awareness-report.md`,
  `docs/architecture/relations/priority-test-links.csv`, and existing
  generator test files.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none required beyond regenerated
  journey-index outputs.

## Autonomous Loop Evidence

### 1. Analyze Current State

- Issue status was recovery-blocked, but heartbeat context had no unresolved
  blockers.
- Current architecture report already has zero actionable missing-test rows.
- Existing focused tests cover the helper behaviors named in the issue.

### 2. Select One Priority Mission Objective

- Selected task: close LUC-2791 by proving generator missing-test links are
  covered.
- Other candidates were deferred because the wake was issue-scoped.

### 3. Plan Implementation

- No code change was needed.
- Verification commands targeted only the two generator test files and strict
  journey-index generation.

### 4. Execute Implementation

- Ran focused tests and regenerated strict journey indexes.
- Added this closure artifact for durable evidence.

### 5. Verify and Test

- Both focused test files passed.
- Strict index generation passed with zero critical gaps.

### 6. Self-Review

- Existing systems were reused: `node:test`, the generator scripts, and
  `priority-test-links.csv`.
- No workaround, redesign, or duplicate test mechanism was introduced.

### 7. Update Documentation and Knowledge

- This task artifact records the verification closure.
- Generated journey index files were refreshed by the strict command.
- Learning journal update: not applicable; no recurring pitfall was discovered.

## Review Checklist

- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.

## Security / Privacy Evidence

- Data classification: repository metadata and local test fixtures only.
- Trust boundaries: no production, secret, account, payment, exchange, or
  browser boundary crossed.
- Secret handling: no secrets read or written.
- Residual risk: none for this generator missing-test-link closure.

## Result Report

- Task summary: verified that function journey and user-action index generator
  helper missing-test links are covered by existing focused tests and
  scanner-readable priority test-link rows.
- Files changed: generated journey-index outputs were refreshed by
  `pnpm run architecture:journey:index:strict`; this task artifact was added.
- How tested:
  `node --test scripts/generateFunctionJourneyIndexes.test.mjs`,
  `node --test scripts/generateUserActionIndex.test.mjs`, and
  `pnpm run architecture:journey:index:strict`.
- What is incomplete: nothing for LUC-2791.
- Next steps: none on this issue.
- Decisions made: close as verified/local tooling proof; do not create
  duplicate generator test-link repair children.
