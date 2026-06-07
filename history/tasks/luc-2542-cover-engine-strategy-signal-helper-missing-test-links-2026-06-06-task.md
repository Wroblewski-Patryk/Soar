# Task

## Header
- ID: LUC-2542
- Title: Cover engine strategy signal helper missing-test links
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Runtime and Adapter Engineer
- Depends on: none
- Priority: P1
- Module Confidence Rows: SOAR-FEATURE-ENGINE-RUNTIME-CORE, architecture evidence graph confidence
- Requirement Rows: not applicable, evidence-link repair only
- Quality Scenario Rows: architecture traceability, test evidence discoverability
- Risk Rows: no runtime behavior changed
- Iteration: 2026-06-06
- Operation Mode: BUILDER
- Mission ID: LUC-2542-COVER-ENGINE-STRATEGY-SIGNAL-HELPER-MISSING-TEST-LINKS-2026-06-06
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the assigned issue scope.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed through active mission state.
- [x] Missing or template-like state tables were not applicable.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified or marked not applicable.
- [x] The task improves release confidence by reducing architecture evidence scanner drift.

## Mission Block
- Mission objective: close scanner-readable missing-test links for `strategySignalAnalysis.ts` private helper rows.
- Release objective advanced: architecture awareness and test evidence traceability for engine runtime core.
- Included slices: priority test-link registry update, focused engine tests, architecture graph/report regeneration, project state update.
- Explicit exclusions: runtime behavior, trading logic, production deploy, protected smoke, live exchange mutation.
- Checkpoint cadence: one heartbeat.
- Stop conditions: focused tests fail or regenerated report still lists the target helper rows.
- Handoff expectation: issue can close when target helper rows no longer appear in top actionable missing-test links.

## Context
`docs/status/architecture-awareness-report.md` generated on 2026-06-06 listed `strategySignalAnalysis.ts` helper functions such as `ensureAdx`, `ensureAtr`, `ensureBollinger`, `pushRule`, and `withFallback` under top actionable missing test links. Existing focused tests already exercise this helper family through `strategySignalAnalysis.test.ts` and `strategyIndicatorRegistryParity.test.ts`; the gap was scanner-readable relation coverage.

## Goal
Map the strategy signal analysis helper family to existing focused tests through `docs/architecture/relations/priority-test-links.csv` and verify the generated architecture awareness report no longer surfaces those helper rows as top missing-test links.

## Scope
- `docs/architecture/relations/priority-test-links.csv`
- generated architecture graph/status artifacts
- Soar state files and this task packet

## Implementation Plan
1. Add direct helper-to-test relation rows for the strategy signal analysis helper family.
2. Run focused engine tests that prove the referenced behavior.
3. Regenerate architecture graph/status outputs.
4. Run strict graph drift and guardrails.
5. Update project state and module confidence evidence.

## Acceptance Criteria
- `strategySignalAnalysis.ts#ensure*`, `pushRule`, `pushIndicatorSummary`, `pushConditionLine`, and `withFallback` rows are mapped to focused tests.
- Focused strategy signal tests pass.
- Regenerated architecture awareness report no longer lists the LUC-2542 target helper rows in top actionable missing-test links.
- No runtime/deploy/protected/live mutation occurs.

## Definition of Done
- [x] Existing architecture relation mechanism reused.
- [x] Focused test proof recorded.
- [x] Architecture graph/report proof recorded.
- [x] Source-of-truth state updated.
- [x] No workaround or behavior change introduced.

## Forbidden
- runtime trading behavior changes
- new scanner framework or bypass
- fake coverage claims without runnable test proof
- deploy, restart, rollback, env, account, secret, protected-smoke, exchange, or live-trading mutation

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/engine/strategySignalAnalysis.test.ts src/modules/engine/strategyIndicatorRegistryParity.test.ts --run`
  - `pnpm run architecture:graph:generate`
  - `pnpm run architecture:graph:drift:strict`
  - `pnpm run quality:guardrails`
- Manual checks:
  - `docs/status/architecture-awareness-report.md` top actionable missing-test links checked for LUC-2542 target rows.
- Screenshots/logs: not applicable.
- High-risk checks: no secrets or production mutations.
- Module confidence ledger updated: yes.
- Requirements matrix updated: not applicable.
- Quality scenarios updated: not applicable.
- Risk register updated: not applicable.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `.agents/core/project-memory-index.md`, `docs/architecture/architecture-evidence-graph-system.md` by reference through project memory, `docs/architecture/relations/priority-test-links.csv`, generated architecture awareness report.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable, evidence-relation repair only.
- Follow-up architecture doc updates: generated graph/status outputs refreshed.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert relation/state/doc changes if needed.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: generated report listed strategy signal analysis helper rows as top actionable missing-test links despite existing focused engine tests.
- Gaps: direct scanner-readable priority test links were missing for most helper functions.
- Inconsistencies: test proof existed, but relation granularity was incomplete.
- Architecture constraints: use existing priority test-link relation mechanism.

### 2. Select One Priority Mission Objective
- Selected task: LUC-2542.
- Priority rationale: assigned high-priority runtime/architecture evidence issue.
- Why other candidates were deferred: scoped wake forbids switching issues.

### 3. Plan Implementation
- Files or surfaces to modify: priority test-link CSV, generated graph/status outputs, state/task evidence files.
- Logic: map helper paths to the existing focused tests that exercise all registry indicators and unavailable-series fallback.
- Edge cases: avoid claiming production/runtime behavior changes from evidence-link repair.

### 4. Execute Implementation
- Implementation notes: added direct rows for the strategy analysis helper family to `priority-test-links.csv`.

### 5. Verify and Test
- Validation performed: focused API tests, architecture graph generation, strict graph drift, guardrails, report row check.
- Result: PASS; target helper rows no longer appear in the top actionable missing-test links.

### 6. Self-Review
- Simpler option considered: suppressing the scanner signal. Rejected because the existing priority relation registry is the approved mechanism.
- Technical debt introduced: no.
- Scalability assessment: direct rows follow existing LUC-2230/LUC-2254 pattern and keep helper-level evidence explicit.
- Refinements made: mapped aggregate indicator helpers to the parity test and fallback/condition-line helpers to the focused analysis test.

### 7. Update Documentation and Knowledge
- Docs updated: architecture relation registry and generated architecture status artifacts.
- Context updated: task board, project state, module confidence, active mission, next steps.
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
- [x] Docs and context were updated.

## Result Report
- Task summary: closed engine strategy signal helper missing-test relation rows by mapping them to existing focused tests.
- Files changed: `docs/architecture/relations/priority-test-links.csv`, generated architecture graph/status artifacts, state files, task packet.
- How tested: focused engine tests, architecture graph generate, strict drift, guardrails.
- What is incomplete: production runtime confidence is unchanged and was outside scope.
- Next steps: continue remaining architecture-awareness missing-test families such as bots repository/read helpers and runtime position state helpers in separate owner-scoped issues.
- Decisions made: use direct priority test links instead of new tests because focused tests already cover the helper family.
