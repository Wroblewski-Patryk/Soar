# Task

## Header
- ID: PMPLC-08
- Title: fix(api-backtests): release final-candle reserved margin from portfolio state
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-06, PMPLC-07
- Priority: P1
- Iteration: 8
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The runtime capital snapshot computes free cash as reference balance minus
reserved margin from currently open positions. Interleaved portfolio backtest
simulation similarly tracks `cashBalance` and open-position `marginUsed`.
During final-candle closure, the simulation returned margin to cash but left
the closed position in `openPositions`, causing `finalBalance` to add the same
reserved margin again through `calcReservedMargin()`.

## Goal
Ensure portfolio backtest final balance represents cash after all final-candle
closures without double-counting released margin.

## Success Signal
- User or operator problem: portfolio backtests could overstate final capital
  after positions closed at the final candle.
- Expected product or reliability outcome: final portfolio balance equals
  initial balance plus realized trade PnL after all final positions close.
- How success will be observed: regression checks `finalBalance` against
  `initialBalance + totalPnl`.
- Post-launch learning needed: no.

## Deliverable For This Stage
Production fix, focused regression, validation evidence, and source-of-truth
updates.

## Constraints
- Reuse existing portfolio simulation cash/margin model.
- Do not change fill model or trade PnL formulas.
- Do not introduce a new capital accounting system.
- Keep this slice limited to final-candle margin release.

## Definition of Done
- [x] Final-candle closed positions are removed from `openPositions`.
- [x] Final balance no longer double-counts released margin.
- [x] Focused regression covers the final-candle close path.
- [x] Relevant validations pass.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- Ad hoc final-balance correction without updating lifecycle state.
- Duplicated reserve accounting.
- Fake/manual adjustment that hides still-open positions.

## Validation Evidence
- Tests: `pnpm --filter api exec vitest run src/modules/backtests/backtests.contract-remediation.test.ts --run` PASS (`9/9`).
- Backtest/runtime suite: `pnpm --filter api exec vitest run src/modules/backtests/backtests.contract-remediation.test.ts src/modules/backtests/backtestReplayCore.test.ts src/modules/engine/positionManagement.service.test.ts --run` PASS (`59/59`).
- Typecheck: `pnpm --filter api run typecheck` PASS.
- Guardrails: `pnpm run quality:guardrails` PASS.
- Lint: `pnpm run lint` PASS.
- Diff check: `git diff --check` PASS with line-ending warnings only.
- Manual checks: reviewed runtime capital snapshot reserved-margin semantics
  and portfolio simulation finalization.
- High-risk checks: regression verifies final balance equals initial balance
  plus realized PnL after final-candle close.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/position-management-pnl-lifecycle-contract.md`
- Fits approved architecture: yes.
- Mismatch discovered: yes, resolved in this slice.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none.

## UX/UI Evidence
Not applicable.

## Deployment / Ops Evidence
- Deploy impact: low.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert final-candle open-position deletion if needed.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: final-candle closed portfolio positions remained in `openPositions`.
- Gaps: no regression tied final balance to realized PnL after final close.
- Inconsistencies: margin was returned to cash and still counted as reserved.
- Architecture constraints: capital views must not misstate available or final
  funds for money-impacting reports.

### 2. Select One Priority Task
- Selected task: release final-candle reserved margin from portfolio state.
- Priority rationale: overstated final balance directly misleads backtest
  evaluation.
- Why other candidates were deferred: deeper shared-wallet runtime parity can
  continue after this concrete accounting bug is fixed.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `apps/api/src/modules/backtests/backtestPortfolioSimulation.service.ts`
  - `apps/api/src/modules/backtests/backtests.contract-remediation.test.ts`
  - planning/context docs
- Logic: delete each final-candle closed symbol from `openPositions` after the
  close event and decision trace are written.
- Edge cases: single-symbol final close, multi-symbol final close, final
  balance should have no remaining reserved margin for closed positions.

### 4. Execute Implementation
- Implementation notes: added `openPositions.delete(symbol)` in the final close
  loop and a regression asserting `finalBalance` matches `initial + pnl`.

### 5. Verify and Test
- Validation performed: focused contract remediation suite,
  backtest/runtime/DCA suite, API typecheck, guardrails, lint, and diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: return `cashBalance` instead of
  `cashBalance + calcReservedMargin()`. That would be wrong while genuine open
  positions remain, so lifecycle state deletion is the cleaner fix.
- Technical debt introduced: no.
- Scalability assessment: works for every symbol closed in the final loop.
- Refinements made: regression checks accounting identity rather than an
  implementation detail.

### 7. Update Documentation and Knowledge
- Docs updated: this task evidence file, MVP planning queue, MVP execution log.
- Context updated: project state and task board.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
Residual risk: final-balance accounting is fixed for final-candle closure.
Future work should still compare runtime capital snapshots and portfolio
simulation under multiple simultaneously open positions and partial DCA adds.

## Production-Grade Required Contract
- Goal: prevent final portfolio backtest balance from double-counting released
  margin.
- Scope: portfolio simulation finalization, focused regression, planning and
  context evidence.
- Implementation Plan: inspect runtime reserve semantics, identify finalization
  drift, delete closed positions from `openPositions`, validate.
- Acceptance Criteria: final balance equals initial balance plus realized PnL
  after final-candle close.
- Definition of Done: satisfied for this money-impacting accounting slice.
- Result Report: PMPLC-08 closed locally with validation evidence.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: not applicable for internal simulation
  accounting slice.
- Real API/service path used: existing interleaved portfolio simulation path.
- Endpoint and client contract match: not applicable.
- DB schema and migrations verified: not applicable.
- Loading state verified: not applicable.
- Error state verified: not applicable.
- Refresh/restart behavior verified: deterministic simulation covered by
  focused tests.
- Regression check performed: focused remediation and backtest/runtime suites.

## Product / Discovery Evidence
- Problem validated: yes.
- User or operator affected: strategy authors reviewing final backtest capital.
- Existing workaround or pain: none acceptable.
- Smallest useful slice: final-candle margin release.
- Success metric or signal: final-balance regression remains green.
- Feature flag, staged rollout, or disable path: not applicable.
- Post-launch feedback or metric check: no.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not
  applicable.
- Critical user journey: portfolio backtest final report.
- SLI: not applicable.
- SLO: not applicable.
- Error budget posture: not applicable.
- Health/readiness check: not applicable.
- Logs, dashboard, or alert route: unchanged.
- Smoke command or manual smoke: focused unit suites.
- Rollback or disable path: revert this slice.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable.
- Data classification: no user data path changed.
- Trust boundaries: internal simulation only.
- Permission or ownership checks: unchanged.
- Abuse cases: misleading capital report by double-counting margin.
- Secret handling: unchanged.
- Security tests or scans: not applicable.
- Fail-closed behavior: focused regression fails if final margin is counted
  twice.
- Residual risk: multi-position partial reserve parity still needs audit.

## AI Testing Evidence
Not applicable.
