# Task

## Header
- ID: LUC-6891
- Title: Missing-test-link smoke selector for V1 high-risk flows
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-241](/LUC/issues/LUC-241) for protected production smoke only
- Priority: P1
- Module Confidence Rows: Account access; Exchange connection/configuration; Subscription and entitlement; Dashboard overview; Trading operation; Admin operation
- Requirement Rows: V1 high-risk local smoke selector coverage
- Quality Scenario Rows: regression proof repeatability
- Risk Rows: generated missing-test-link noise; protected production proof unavailable
- Iteration: 2026-07-02
- Operation Mode: TESTER
- Mission ID: LUC-6891-MISSING-TEST-LINK-SMOKE-SELECTOR-2026-07-02
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the issue lane.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was represented through AGENTS startup scope.
- [x] `.agents/core/mission-control.md` was represented through scoped Paperclip wake.
- [x] Missing or template-like state tables were confirmed not needed for this documentation-only selector lane.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: classify generated missing-test-link rows for V1 high-risk flows and publish the smallest repeatable local smoke selectors.
- Release objective advanced: V1 audit-to-completion local regression proof routing.
- Included slices: Account access, Exchange connection/configuration, Subscription/admin, Dashboard overview, Trading operation.
- Explicit exclusions: production/protected smoke, secret access, deploy, push, broad test churn, new runtime tests without a concrete uncovered behavior.
- Checkpoint cadence: one heartbeat, one durable evidence packet, one source-of-truth smoke selector update.
- Stop conditions: selector evidence recorded, focused script tests pass or fail with residual risk.
- Handoff expectation: QVE/CBE/DSM can route remaining rows using the classification.

## Context
`docs/status/app-completion-index.md` reports `1042` generated
`missing_test_link` rows, but the architecture-awareness state says actionable
missing test links are already curated down to zero. This issue asked TAE to
separate scanner/linkage noise from true behavior gaps.

## Goal
Publish a repeatable V1 high-risk local smoke selector table and classify the
sampled missing-test-link rows without adding duplicate tests.

## Scope
- `history/evidence/luc-6891-missing-test-link-smoke-selector-2026-07-02.md`
- `docs/operations/v1-go-live-smoke-pack.md`
- `history/tasks/luc-6891-missing-test-link-smoke-selector-2026-07-02-task.md`

## Implementation Plan
1. Read the scoped [LUC-6891](/LUC/issues/LUC-6891) wake and heartbeat context.
2. Sample generated missing-test-link rows from `docs/status/app-completion-index.md`.
3. Compare samples to existing local tests and `docs/architecture/relations/priority-test-links.csv`.
4. Publish selector recommendations in the V1 smoke pack.
5. Run focused script tests for the smoke selector runners.
6. Update issue state with evidence and residual routing.

## Acceptance Criteria
- Classification covers Account access, Exchange connection/configuration, Subscription/admin, Dashboard overview, and Trading operation.
- Selector list names the smallest useful local commands before protected production gates.
- No duplicate tests are added unless a concrete uncovered behavior is found.
- Verification command evidence is recorded.

## Definition of Done
- [x] Classification table produced.
- [x] Selector list updated.
- [x] Focused verification run completed.
- [x] Residual owner routing recorded.

## Forbidden
- Production/protected smoke.
- Secret access or secret value readback.
- Deploy, push, or runtime mutation.
- Broad test churn or duplicate tests for already-covered behavior.

## Validation Evidence
- Tests:
  - `pnpm exec node --test scripts/goLiveSmoke.test.mjs scripts/runQaRepeatableSmokeE2e.test.mjs`
- Manual checks:
  - sampled `docs/status/app-completion-index.md`
  - searched existing test files and priority-test-link overrides
- Screenshots/logs: not applicable
- High-risk checks: no protected credentials, production mutation, deploy, or live trading action
- Module confidence ledger updated: no, no module implementation state changed
- Requirements matrix updated: no, local selector artifact only
- Quality scenarios updated: no, local selector artifact only
- Risk register updated: no, residual risk is documented in evidence packet
- Reality status: verified

## Architecture Evidence
- Architecture source reviewed: `docs/status/app-completion-index.md`, `docs/architecture/relations/priority-test-links.csv`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: DSM/architecture graph curation only if the board wants generated count reduction.

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: `docs/operations/v1-go-live-smoke-pack.md`
- Rollback note: documentation-only; revert the doc/evidence/task changes if needed
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: generated missing-test-link rows are noisy and overcount existing proof gaps.
- Gaps: protected/browser production proof still blocked outside local test selectors.
- Inconsistencies: app-completion index reports missing links while priority-test relations already cover many representative paths.
- Architecture constraints: do not add duplicate tests or invent a parallel proof system.

### 2. Select One Priority Mission Objective
- Selected task: classify [LUC-6891](/LUC/issues/LUC-6891) missing-test-link rows and publish selector guidance.
- Priority rationale: high-risk V1 proof routing before protected acceptance gates.
- Why other candidates were deferred: no concrete uncovered behavior was found.

### 3. Plan Implementation
- Files or surfaces to modify: evidence packet, V1 smoke pack, task record.
- Logic: classify sampled rows against existing tests and relation overrides.
- Edge cases: protected proof cannot be replaced by local tests.

### 4. Execute Implementation
- Implementation notes: documentation/source-of-truth update only.

### 5. Verify and Test
- Validation performed: focused script tests for smoke selector runners.
- Result: pass.

### 6. Self-Review
- Simpler option considered: issue comment only.
- Technical debt introduced: no.
- Scalability assessment: selector table reuses existing commands and can be reused by QVE/CBE/DSM.
- Refinements made: no duplicate tests added.

### 7. Update Documentation and Knowledge
- Docs updated: `docs/operations/v1-go-live-smoke-pack.md`
- Context updated: task/evidence packet added.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to the issue lane.
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
- Task summary: Classified high-risk missing-test-link rows as mostly scanner/linkage noise over existing proof and published repeatable selector commands.
- Files changed: `docs/operations/v1-go-live-smoke-pack.md`, `history/evidence/luc-6891-missing-test-link-smoke-selector-2026-07-02.md`, `history/tasks/luc-6891-missing-test-link-smoke-selector-2026-07-02-task.md`.
- How tested: `pnpm exec node --test scripts/goLiveSmoke.test.mjs scripts/runQaRepeatableSmokeE2e.test.mjs`.
- What is incomplete: protected production/browser acceptance remains blocked by [LUC-241](/LUC/issues/LUC-241) and protected input/account gates.
- Next steps: QVE uses selectors for local high-risk regression; CBE repairs only if a selector fails; DSM/architecture graph reduces generated row counts if desired.
- Decisions made: no new tests were added because sampled behavior already has local proof.

