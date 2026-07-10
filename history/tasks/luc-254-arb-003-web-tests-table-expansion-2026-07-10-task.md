# Task

## Header
- ID: LUC-254
- Title: [Soar][ARB-003] Expand module deep dives with exact `Tests` tables for web features with inferred coverage
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: LUC-25 Stage 1 app-factory scope
- Priority: P2
- Module Confidence Rows: Web shared/module docs, Web icons/module docs
- Requirement Rows: not applicable; documentation/source-truth verification slice
- Quality Scenario Rows: maintainability/traceability
- Risk Rows: documentation drift
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-254-ARB-003-WEB-TESTS-TABLES
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was represented by existing module deep-dive/state governance.
- [x] `.agents/core/mission-control.md` was represented by the scoped Paperclip wake mission.
- [x] Missing or template-like state tables were not needed for this docs-only slice.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified or marked not applicable.
- [x] The task improves release confidence by replacing inferred coverage prose with exact test evidence.

## Mission Block
- Mission objective: close the ARB-003 documentation repair slice for web features with inferred/shared coverage wording.
- Release objective advanced: Soar/Roost usable VPS production traceability.
- Included slices: `web-shared` exact grouped `Tests` tables; `web-icons` explicit consumer-driven test evidence.
- Explicit exclusions: product code, runtime behavior, generated index refresh, push, deploy, protected smoke, production restart, secrets, DB/Redis, exchange/payment/subscription/order/position/live trading.
- Checkpoint cadence: single heartbeat.
- Stop conditions: missing test paths, unrelated dirty state, or validation failure.
- Handoff expectation: local commit when scoped validation passes.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | QVE heartbeat | Wake payload, AGENTS.md | Integration, task closure, issue update | Closure packet | Final validation + commit | DONE |
| QA/Test | QVE heartbeat | `docs/modules/web-shared.md`, `docs/modules/web-icons.md` | Test evidence classification | Exact `Tests` tables | Path existence check | DONE |
| Documentation/Memory | QVE heartbeat | Project state/task board/module confidence | Source-of-truth updates | Task/evidence/state entries | `git diff --check` | DONE |

### Lane Checks
- [x] This was single-lane and did not require subagent delegation.
- [x] No overlapping write lanes were created.
- [x] No missing or unclear ownership was found.

## Context
The wake payload assigned [LUC-254](/LUC/issues/LUC-254) as a local repair/source-control lane for ARB-003. An older ARB-003 slice had repaired `web-orders`, `web-positions`, `web-icons`, and `web-shared`, but `web-shared` still carried residual inferred/scanner-incomplete prose for shared UI/lib/i18n surfaces.

## Goal
Replace residual inferred coverage wording with exact, file-backed `Tests` tables in affected web module deep dives.

## Success Signal
- User or operator problem: module docs no longer force reviewers to infer which tests cover shared web surfaces.
- Expected product or reliability outcome: more auditable release traceability.
- How success will be observed: exact paths exist and documentation records the remaining scanner-relation limitation as maintenance, not missing coverage.
- Post-launch learning needed: no.

## Deliverable For This Stage
Verified documentation update plus task/evidence/source-truth records.

## Constraints
- Use existing docs and evidence structure.
- Do not introduce new runtime behavior or generated index changes.
- Do not claim protected, browser, production, deployment, or release readiness proof.

## Definition of Done
- [x] `web-shared` residual inferred coverage wording replaced by exact grouped `Tests` tables.
- [x] `web-icons` evidence wording names exact current consumer-driven coverage and the future dedicated-test trigger.
- [x] All documented test paths checked for local existence.
- [x] Source-of-truth state updated.
- [x] Local commit created if dirty set remains scoped.

## Stage Exit Criteria
- [x] The output matches `verification`.
- [x] No later-stage release/deploy work was mixed in.
- [x] Residual scanner relation risk is stated.

## Forbidden
- Push, deploy, production restart, protected smoke, secret disclosure, paid-resource mutation, destructive operation, or LIVE trading action.

## Validation Evidence
- Tests: PowerShell `Test-Path` existence check over `40` documented test files -> PASS.
- Manual checks: reviewed `web-shared` and `web-icons` updated sections for exact test-table semantics.
- Screenshots/logs: not applicable.
- High-risk checks: no protected/prod action attempted.
- Module confidence ledger updated: yes.
- Module confidence rows closed or changed: Web shared/module docs, Web icons/module docs.
- Requirements matrix updated: not applicable.
- Quality scenarios updated: not applicable.
- Risk register updated: not applicable.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `docs/modules/web-shared.md`, `docs/modules/web-icons.md`, prior ARB-003 task record.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: docs-only; revert the commit if needed.
- Observability or alerting impact: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: residual inferred/scanner-incomplete prose remained in `web-shared`.
- Gaps: exact tests were present but not grouped as formal `Tests` tables for all shared surfaces.
- Inconsistencies: two i18n paths were initially documented with `.ts` instead of existing `.tsx`; validation caught and fixed this before closure.
- Architecture constraints: module deep dives are source-of-truth docs.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: module docs, prior ARB-003 task evidence, git state.
- Blocking unknowns: none.

### 2. Select One Priority Mission Objective
- Selected task: [LUC-254](/LUC/issues/LUC-254).
- Priority rationale: assigned scoped wake and actionable local docs repair.
- Why other candidates were deferred: wake contract forbids switching before handling this issue.

### 3. Plan Implementation
- Files or surfaces to modify: `docs/modules/web-shared.md`, `docs/modules/web-icons.md`, state/evidence/task records.
- Logic: replace inference with exact test file tables and validate paths.
- Edge cases: avoid claiming direct scanner relation closure or fresh runtime proof.

### 4. Execute Implementation
- Implementation notes: converted shared UI/shell, feature helper, i18n/lib/support evidence into grouped `Tests` tables and clarified icon consumer-driven coverage.

### 5. Verify and Test
- Validation performed: path existence check and `git diff --check`.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: only updating task state. Rejected because the module deep-dive source remained the actual drift.
- Technical debt introduced: no.
- Scalability assessment: grouped tables are maintainable and point future changes at exact suites.
- Refinements made: corrected `.tsx` i18n test path extensions after failed path check.

### 7. Update Documentation and Knowledge
- Docs updated: module deep dives, task/evidence, project state, task board, module confidence ledger.
- Context updated: yes.
- Learning journal updated: not applicable.

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
- [x] Docs/context were updated.

## Result Report
- Task summary: expanded residual web shared/icon module deep-dive coverage documentation into exact test-file tables.
- Files changed:
  - `docs/modules/web-shared.md`
  - `docs/modules/web-icons.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `.agents/state/module-confidence-ledger.md`
  - `history/evidence/luc-254-arb-003-web-tests-table-expansion-2026-07-10.md`
  - `history/tasks/luc-254-arb-003-web-tests-table-expansion-2026-07-10-task.md`
- How tested: path existence check for `40` documented files; `git diff --check`.
- What is incomplete: architecture-awareness scanner relation count reduction was not attempted; this was documentation/source-truth repair.
- Next steps: scanner/registry owner may add direct relation generation if count reduction is desired.
- Decisions made: treat shared Web residual signal as exact local test evidence plus scanner relation maintenance, not a current coverage blocker.
