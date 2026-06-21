# Task

## Header
- ID: LUC-5310
- Title: Runtime DCA/PnL PAPER-first protected proof/repair triage
- Task Type: research
- Current Stage: verification
- Status: PARTIALLY_VERIFIED
- Owner: QA/Test
- Depends on: [LUC-5307](/LUC/issues/LUC-5307)
- Priority: P1
- Module Confidence Rows: Runtime DCA/PnL; bot runtime readback; exchange boundary
- Requirement Rows: runtime DCA trigger, PnL readback, persistence, fail-closed boundary
- Quality Scenario Rows: runtime readback latency
- Risk Rows: protected production proof; runtime route performance
- Iteration: 2026-06-20
- Operation Mode: TESTER
- Mission ID: LUC-5310-RUNTIME-DCA-PNL-PAPER-FIRST-PROOF-TRIAGE-2026-06-20
- Mission Status: PARTIALLY_VERIFIED

## Context

[LUC-5307](/LUC/issues/LUC-5307) identified runtime DCA/PnL as a high-risk
proof gap. [LUC-5310](/LUC/issues/LUC-5310) requested PAPER-first protected
proof before any LIVE claim and explicit repair routing if broken.

## Goal

Classify whether the current DCA/PnL runtime contracts are locally working,
whether protected production proof can be claimed, and whether any follow-up
repair issue is required.

## Scope

- `apps/api/src/modules/engine/runtimePositionAutomation.exchangePnl.test.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.dcaTpParity.test.ts`
- `apps/api/src/modules/bots/bots.runtime-pnl-parity.e2e.test.ts`
- `apps/api/src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts`
- `apps/api/src/modules/engine/runtimeExchangeOrderGuard.service.test.ts`
- `apps/api/src/modules/engine/runtimeExecutionDedupe.service.test.ts`
- `docs/architecture/chains/CHAIN-RUNTIME-DCA-PNL.md`
- `docs/architecture/reference/runtime-signal-merge-contract.md`
- `docs/architecture/nodes/SOAR-DOC-POSITION-PNL-LIFECYCLE.md`

## Implementation Plan

1. Read issue heartbeat context and runtime DCA/PnL source-of-truth docs.
2. Run the smallest focused runtime tests that cover DCA trigger, PnL truth,
   API readback, persistence, and fail-closed boundaries.
3. Classify any failures as product, performance, test-harness, or protected
   proof gaps.
4. Route a child issue if repair is outside QA ownership.
5. Update evidence and source-of-truth state.

## Acceptance Criteria

- Focused runtime DCA/PnL local proof is executed or a blocker is recorded.
- Protected production proof is claimed only if authorized and executed.
- Any concrete failure has an owner and exact reproduction command.
- No forbidden production/live mutation occurs.

## Definition of Done

- [x] Local runtime DCA/PnL proof commands recorded.
- [x] Fail-closed exchange boundary proof recorded.
- [x] Protected production proof boundary recorded.
- [x] Backend follow-up [LUC-5319](/LUC/issues/LUC-5319) routed for the exact
      slow readback/default timeout issue.
- [x] Evidence and state files updated.

## Forbidden

- Deploy, push, restart, rollback, env edit, secret/account readback.
- Unapproved LIVE order, production fixture mutation, payment/subscription
  mutation, live-trading action.
- Broad runtime rewrite or workaround.

## Validation Evidence

- `runtimePositionAutomation.exchangePnl.test.ts`: PASS, `2/2`.
- `runtimePositionAutomation.dcaTpParity.test.ts`: PASS, `2/2`.
- `bots.runtime-pnl-parity.e2e.test.ts`: default budget FAIL on timeout;
  PASS with `--testTimeout=15000`, `2/2`.
- `bots.runtime-imported-dca-visibility.e2e.test.ts`: PASS with
  `--testTimeout=15000`, `7/7`.
- `runtimeExchangeOrderGuard.service.test.ts` +
  `runtimeExecutionDedupe.service.test.ts`: PASS, `18/18`.
- Evidence report:
  `history/evidence/luc-5310-runtime-dca-pnl-paper-first-proof-triage-2026-06-20.md`.
- Module confidence ledger updated: yes.
- Requirements matrix updated: no, status classification only.
- Risk register updated: no, risk is captured through child repair issue and
  module ledger.
- Reality status: partially verified.

## Architecture Evidence

- Architecture source reviewed:
  `docs/architecture/chains/CHAIN-RUNTIME-DCA-PNL.md`,
  `docs/architecture/reference/runtime-signal-merge-contract.md`,
  `docs/architecture/nodes/SOAR-DOC-POSITION-PNL-LIFECYCLE.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no architecture mismatch.
- Decision required from user: no.
- Follow-up architecture doc updates: none; this was proof/triage only.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: no runtime change to roll back.
- Observability or alerting impact: slow readback signal routed to backend
  child [LUC-5319](/LUC/issues/LUC-5319).

## Security / Privacy Evidence

- Data classification: local test fixtures and redaction-safe evidence.
- Trust boundaries: protected production proof not run without approval.
- Permission or ownership checks: backend follow-up routed to Core Backend.
- Abuse cases: unapproved LIVE and production mutation explicitly avoided.
- Secret handling: no secret/account readback.
- Fail-closed behavior: exchange order guard/dedupe pack passed.

## Result Report

- Task summary:
  Local runtime DCA/PnL correctness is currently proven for the focused pack,
  including DCA trigger, close precedence, PnL readback, DCA persistence, and
  exchange-boundary/dedupe fail-closed behavior. Protected production proof was
  not run. A slow runtime readback/default test-timeout issue was found and
  routed to Backend.
- Files changed:
  evidence/task/state docs only.
- How tested:
  focused API unit/e2e commands listed above.
- What is incomplete:
  production protected readback and backend classification/repair of slow
  runtime positions/symbol-stats readback.
- Next steps:
  Core Backend handles [LUC-5319](/LUC/issues/LUC-5319), the child
  performance/test-budget issue; protected production proof remains separate
  and approval-gated.
- Decisions made:
  close [LUC-5310](/LUC/issues/LUC-5310) as `done` for QA triage with
  delegated backend follow-up rather than leaving it live without an active
  continuation path.
