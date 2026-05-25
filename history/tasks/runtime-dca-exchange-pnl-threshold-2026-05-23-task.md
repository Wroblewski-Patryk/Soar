# Runtime DCA Exchange PnL Threshold Task

## Header
- ID: `RUNTIME-DCA-EXCHANGE-PNL-THRESHOLD-2026-05-23`
- Title: Use exchange PnL truth for LIVE imported DCA thresholds
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Priority: P1
- Module Confidence Rows: `SOAR-BOT-RUNTIME-001`, `SOAR-ENGINE-001`, `SOAR-POSITIONS-001`
- Requirement Rows: position-management DCA-first lifecycle contract
- Risk Rows: live-trading safety / operator-visible runtime truth
- Operation Mode: BUILDER
- Mission ID: `RUNTIME-DCA-EXCHANGE-PNL-THRESHOLD-2026-05-23`
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] Exactly one priority task is selected.
- [x] Source-of-truth runtime lifecycle docs were reviewed.
- [x] Affected module confidence rows were identified.
- [x] The task improves release confidence for an operator-reported runtime issue.

## Context
The operator reported that a second DCA threshold configured at `50%` did not
fire while the dashboard position row showed approximately `-62%` PnL. The
runtime lifecycle contract says DCA thresholds are evaluated from current
position PnL/ROI percent and must run before close protection.

## Goal
Make LIVE imported / exchange-synced runtime DCA threshold checks use the same
exchange PnL percent truth that operator-visible position rows rely on when
`unrealizedPnl` and margin truth are available.

## Scope
- `apps/api/src/modules/engine/runtimePositionAutomation.helpers.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.exchangePnl.test.ts`
- Source-of-truth state files for task/evidence routing.

## Implementation Plan
1. Allow runtime PnL helper calls to pass an authoritative `unrealizedPnl`.
2. For `EXCHANGE_SYNC` runtime positions, pass exchange `unrealizedPnl` into
   DCA/close threshold PnL computation while keeping lifecycle mark price as
   the execution price.
3. Add a regression for a short `SOLUSDT` position with `currentAdds=1`,
   DCA levels `-25%` and `-50%`, displayed exchange PnL about `-62.5%`, and a
   newer ticker price that would otherwise model a smaller drawdown.

## Acceptance Criteria
- A LIVE exchange-synced short position with exchange PnL below the second
  loss-side DCA threshold submits the second DCA.
- Mark price remains the order execution price.
- Existing DCA-first close parity remains green.
- No production LIVE mutation is performed by this task.

## Definition of Done
- [x] Focused runtime automation regression passes.
- [x] Position-management and DCA/close parity tests pass.
- [x] API typecheck passes.
- [x] Source-of-truth task and state files are updated.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/engine/runtimePositionAutomation.exchangePnl.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run` -> `38/38` pass.
  - `pnpm --filter api run test -- src/modules/engine/positionManagement.service.test.ts src/modules/engine/runtimePositionAutomation.dcaTpParity.test.ts --run --sequence.concurrent=false` -> `27/27` pass.
  - `pnpm --filter api run typecheck` -> pass.
- Manual checks: code review against `docs/architecture/06_execution-lifecycle.md` and `docs/architecture/reference/position-management-pnl-lifecycle-contract.md`.
- High-risk checks: no production credentials, no exchange-side order, no bot activation, and no live mutation were used.
- Reality status: verified locally.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/reference/position-management-pnl-lifecycle-contract.md`
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.

## Deployment / Ops Evidence
- Deploy impact: medium, backend runtime behavior.
- Env or secret changes: none.
- Health-check impact: none.
- Rollback note: revert the three runtime files in this task if the threshold source change causes unexpected LIVE behavior.
- Observability impact: existing `DCA_EXECUTED` and `PRETRADE_BLOCKED` telemetry remains unchanged.

## Autonomous Loop Evidence
1. Analyze Current State: screenshot and docs indicated DCA should have fired from operator-visible PnL.
2. Select One Priority Mission Objective: repair DCA threshold source truth.
3. Plan Implementation: keep execution price separate from PnL threshold truth.
4. Execute Implementation: passed exchange `unrealizedPnl` through runtime PnL helper for `EXCHANGE_SYNC` positions.
5. Verify and Test: focused runtime, DCA parity, and typecheck passed.
6. Self-Review: no new subsystem, no workaround, no duplicated DCA evaluator.
7. Update Documentation and Knowledge: task artifact and state files updated.

## Result Report
- Task summary: LIVE exchange-synced runtime threshold evaluation now uses exchange PnL truth where available, so a visible `-62%` drawdown can trigger a `-50%` DCA level even if the newer ticker-derived modeled PnL would be smaller.
- Files changed: runtime helper, runtime automation service, runtime automation exchange-PnL test, and source-of-truth state.
- How tested: focused API runtime tests and API typecheck.
- What is incomplete: production dashboard readback and any live exchange mutation remain protected-auth/operator-approval tasks.
- Next steps: deploy and run protected read-only production bot/position readback when app auth is available.
