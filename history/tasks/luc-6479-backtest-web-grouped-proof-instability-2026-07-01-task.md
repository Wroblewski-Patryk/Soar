# Task

## Header
- ID: LUC-6479
- Title: Isolate deterministic Backtest Web grouped proof instability
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-6466](/LUC/issues/LUC-6466)
- Priority: P1
- Module Confidence Rows: `SOAR-BACKTESTS-001`
- Requirement Rows: app-completion Backtest Web journey proof rows from [LUC-6466](/LUC/issues/LUC-6466)
- Quality Scenario Rows: regression evidence loop
- Risk Rows: grouped Web Vitest timeout/cross-talk risk
- Iteration: 2026-07-01
- Operation Mode: TESTER
- Mission ID: `LUC-6479-BACKTEST-WEB-GROUPED-PROOF-INSTABILITY-2026-07-01`
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the issue role: TAE verification.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was represented through active Soar state files.
- [x] `.agents/core/mission-control.md` was represented through active mission/next-step readback.
- [x] Missing or template-like state tables were not encountered in this narrow lane.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence by removing a false FEW escalation path.

## Mission Block
- Mission objective: determine whether grouped Backtest Web instability is test cross-talk/runner behavior or a real UI defect.
- Release objective advanced: Backtest/Strategy/Reports/Public shell proof from [LUC-6466](/LUC/issues/LUC-6466).
- Included slices: BacktestsList focused test, Backtest grouped Web packet, harness isolation cleanup.
- Explicit exclusions: product UI redesign, API work, production smoke, deploy, push, live trading, account/secret access.
- Checkpoint cadence: close this heartbeat with evidence and issue disposition.
- Stop conditions: product defect reproduced, grouped proof passes, or command guard blocks reliable proof.
- Handoff expectation: FEW only if product UI defect is reproduced; otherwise close TAE lane.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| QA/Test | 09 TAE | [LUC-6466](/LUC/issues/LUC-6466) evidence, Backtest Web tests | `BacktestsList.test.tsx` | Isolation hardening and proof | Focused and grouped Vitest | DONE |
| Frontend | FEW | Not activated | Product UI | No handoff unless defect reproduced | Not applicable | OMITTED |
| Documentation/Memory | 09 TAE | Project state files | history evidence/task, state ledgers | Durable proof | File updates | DONE |

## Context

[LUC-6466](/LUC/issues/LUC-6466) verified Strategy, Reports/logs, Public shell,
route i18n, and API contracts, but left Backtest grouped Web proof unstable.
The prior signal was one grouped failure in `BacktestsList.test.tsx`, while the
focused rerun passed.

## Goal

Close the TAE follow-up by proving whether the grouped failure is test
cross-talk/runner instability or an actual Backtest UI defect.

## Success Signal
- User or operator problem: [LUC-6466](/LUC/issues/LUC-6466) could not close because Backtest Web proof was unstable.
- Expected product or reliability outcome: deterministic Backtest Web proof path.
- How success will be observed: focused and grouped Backtest Web tests pass or a concrete product defect is reproduced.
- Post-launch learning needed: yes.

## Scope

Changed file:

- `apps/web/src/features/backtest/components/BacktestsList.test.tsx`

Evidence/state files:

- `history/evidence/luc-6479-backtest-web-grouped-proof-instability-2026-07-01.md`
- `history/tasks/luc-6479-backtest-web-grouped-proof-instability-2026-07-01-task.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/LEARNING_JOURNAL.md`
- `.agents/state/active-mission.md`
- `.agents/state/next-steps.md`
- `.agents/state/module-confidence-ledger.md`
- `.agents/state/regression-log.md`

## Implementation Plan

1. Read prior [LUC-6466](/LUC/issues/LUC-6466) evidence and locate Backtest Web tests.
2. Run the grouped Backtest Web command and focused BacktestsList repetition.
3. Compare cleanup/mock reset patterns across neighboring Backtest component tests.
4. Harden `BacktestsList.test.tsx` with cleanup and mock/local browser state reset.
5. Rerun focused and grouped Backtest Web proofs.
6. Record evidence and close issue disposition without FEW escalation unless product evidence exists.

## Acceptance Criteria

- BacktestsList focused proof passes.
- Backtest grouped Web packet passes after harness hardening.
- Any remaining timeout is classified separately from product UI defect evidence.
- Project memory and Paperclip issue disposition record whether FEW escalation is needed.

## Definition of Done

- [x] Concrete isolation result recorded.
- [x] Relevant validation commands run.
- [x] No product workaround introduced.
- [x] No FEW handoff created without product defect evidence.
- [x] Source-of-truth files updated.

## Forbidden

- New systems without approval.
- Duplicated logic or parallel implementations of the same contract.
- Temporary bypasses, hacks, or workaround-only paths.
- Architecture changes without explicit approval.
- Production mutation, deploy, push, restart, secret/account readback, exchange/payment mutation, order, position, subscription mutation, or live-trading action.

## Validation Evidence
- Tests: see evidence packet.
- Manual checks: code inspection of neighboring Backtest tests.
- Screenshots/logs: no screenshots; command summaries recorded.
- High-risk checks: no production or live-risk actions performed.
- Module confidence ledger updated: yes.
- Module confidence rows closed or changed: `SOAR-BACKTESTS-001`.
- Requirements matrix updated: not applicable; no product requirement changed.
- Quality scenarios updated: not applicable.
- Risk register updated: not applicable; regression log captures the test risk.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: [LUC-6466](/LUC/issues/LUC-6466) evidence and Soar state files.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: none.
- Rollback note: revert the single test-harness cleanup edit if needed.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: grouped Backtest Web proof had one prior assertion failure and broader timeouts.
- Gaps: `BacktestsList.test.tsx` lacked cleanup/reset.
- Inconsistencies: focused BacktestsList passed while grouped packet had failed once.
- Architecture constraints: TAE owns test automation; FEW only owns real UI defect repair.

### 2. Select One Priority Mission Objective
- Selected task: [LUC-6479](/LUC/issues/LUC-6479).
- Priority rationale: blocks [LUC-6466](/LUC/issues/LUC-6466).
- Why other candidates were deferred: scoped wake required this issue.

### 3. Plan Implementation
- Files or surfaces to modify: one Backtest Web test file.
- Logic: add standard cleanup/reset after each test.
- Edge cases: avoid product code changes and avoid broad runner rewrites.

### 4. Execute Implementation
- Implementation notes: added `cleanup`, `afterEach`, `vi.clearAllMocks`, localStorage clear, and history reset.

### 5. Verify and Test
- Validation performed: focused and grouped Backtest Web commands.
- Result: pass; oversized combined packets still timeout.

### 6. Self-Review
- Simpler option considered: evidence-only closure. Rejected because a one-file harness isolation fix reduces future cross-talk risk.
- Technical debt introduced: no.
- Scalability assessment: aligns this file with existing neighboring test pattern.
- Refinements made: none beyond scoped cleanup.

### 7. Update Documentation and Knowledge
- Docs updated: evidence, task, active mission, next steps, module confidence, regression log, task board, project state, learning journal.
- Context updated: yes.
- Learning journal updated: yes.

## Result Report

- Task summary: isolated the instability as test harness/runner behavior, not a reproduced Backtest product UI defect.
- Files changed: `apps/web/src/features/backtest/components/BacktestsList.test.tsx` plus evidence/state docs.
- How tested: focused BacktestsList and grouped Backtest Web Vitest commands pass.
- What is incomplete: oversized combined Web packet still times out under the command guard; no assertion failure returned.
- Next steps: close [LUC-6479](/LUC/issues/LUC-6479) and unblock [LUC-6466](/LUC/issues/LUC-6466) using the grouped Backtest proof; do not create FEW repair.
- Decisions made: no FEW escalation because no product UI defect was reproduced.
