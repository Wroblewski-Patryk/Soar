# Task

## Header
- ID: PMPLC-45
- Title: Include imported externally closed positions in aggregate PnL
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: QA/Test
- Depends on: PMPLC-44
- Priority: P0
- Iteration: 45
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
PMPLC-44 validation exposed that runtime monitoring could omit an imported
`ORPHAN_LOCAL` / `EXTERNAL_CLOSE_CONFIRMED` closed position from aggregate
realized PnL when no local trade rows existed. Adjacent runtime history checks
also showed that carry-over lifetime `OPEN` trades and legacy wallet-scoped DCA
continuity needed to remain visible without broadening the money aggregate.

## Goal
Keep runtime aggregate PnL, positions history, trades history, and DCA
continuity aligned with canonical position lifecycle truth for imported or
carry-over bot-managed positions.

## Scope
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/runtimeSessionTradesRead.service.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`
- `apps/api/src/modules/bots/bots.e2e.fixtures.ts`
- planning and context source-of-truth files

## Success Signal
- User or operator problem: imported closed exchange position PnL could read as
  `0` in monitoring while position truth held realized PnL.
- Expected product or reliability outcome: aggregate and runtime history remain
  financially truthful for external close confirmations and carry-over
  lifecycles.
- How success will be observed: focused aggregate regression returns
  `realizedPnl=37.5`, and runtime history/DCA suites remain green.
- Post-launch learning needed: no

## Deliverable For This Stage
Post-release evidence that PMPLC-45 is implemented, verified, reviewed, and
documented.

## Constraints
- Do not include stale open orphan positions in runtime truth.
- Do not widen aggregate PnL beyond the runtime session closed-position window.
- Reuse existing position sync and continuity states.
- Keep legacy wallet-scoped continuity limited to lifecycle lookup, not primary
  aggregate ownership.

## Acceptance Criteria
- Imported `ORPHAN_LOCAL` / `EXTERNAL_CLOSE_CONFIRMED` closed positions count in
  closed-position aggregate PnL.
- Carry-over bot-managed `OPEN` lifetime trades remain visible in session trade
  history.
- Legacy wallet-scoped DCA continuity remains visible for imported lifecycle
  replacement rows.
- Existing runtime aggregate, history, scope, DCA, and portfolio regressions
  remain green.

## Definition of Done
- [x] Regression fails before the fix and passes after it.
- [x] Existing architecture path is reused.
- [x] Relevant validations pass.
- [x] Source-of-truth documentation is updated.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- New lifecycle systems or parallel read models.
- Temporary bypasses or fake PnL/trade rows.
- Counting unresolved stale orphan open positions as runtime truth.
- Broadening money aggregates outside the explicit runtime window.

## Validation Evidence
- Tests:
  - Pre-fix `pnpm --filter api run test -- src/modules/bots/bots.monitoring-aggregate.e2e.test.ts -t "keeps aggregate header PnL aligned with imported closed position summary when trades are missing" --run --sequence.concurrent=false` FAILED as expected: `positions.summary.realizedPnl=0` instead of `37.5`.
  - Post-fix focused aggregate regression PASS (`1/1`).
  - Focused external-close runtime history regression PASS (`1/1`).
  - `pnpm --filter api run test -- src/modules/bots/bots.monitoring-aggregate.e2e.test.ts src/modules/bots/bots.runtime-history-parity.e2e.test.ts src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts src/modules/bots/bots.runtime-scope.e2e.test.ts src/modules/bots/bots.portfolio-history.e2e.test.ts --run --sequence.concurrent=false --pool forks --poolOptions.forks.singleFork=true` PASS (`51/51`).
  - `pnpm --filter api run test -- src/modules/bots/runtimeSessionPositionsRead.service.test.ts --run` PASS (`16/16`).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm run quality:guardrails` PASS.
- Manual checks: reviewed closed-position aggregate window, continuity lookup,
  carry-over trade window, and DCA fixture validation.
- Screenshots/logs: not applicable.
- High-risk checks: money-impacting aggregate PnL and lifecycle continuity
  regressions included.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/01_overview-and-principles.md`
  - `docs/architecture/reference/execution-lifecycle-parity-contract.md`
  - `docs/modules/system-modules.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not required

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert the PMPLC-45 commit to restore prior runtime read-model
  filtering.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: imported external close confirmations were excluded by
  `syncState='IN_SYNC'` closed-position filters.
- Gaps: full runtime history parity also exposed carry-over `OPEN` trade and
  legacy wallet-scoped DCA continuity gaps.
- Inconsistencies: positions could show lifecycle truth while trades or
  aggregate PnL omitted it.
- Architecture constraints: lifecycle and money read models must remain
  explainable, scoped, and fail-closed.

### 2. Select One Priority Task
- Selected task: PMPLC-45 runtime aggregate imported closed-position PnL.
- Priority rationale: it is a user-facing money read model and can understate
  realized PnL.
- Why other candidates were deferred: broader architectural decomposition was
  deferred; this slice stayed inside existing read services and tests.

### 3. Plan Implementation
- Files or surfaces to modify:
  - runtime positions read model
  - runtime trades carry-over window helper
  - runtime helper/unit fixture tests
- Logic: include confirmed imported closed positions in closed-position PnL
  windows, keep continuity lookup broader than aggregate PnL, and show scoped
  carry-over lifetime `OPEN` trades.
- Edge cases: stale open orphans remain excluded; legacy wallet-scoped
  continuity is not promoted into primary aggregate ownership.

### 4. Execute Implementation
- Implementation notes: added a reusable closed-position sync predicate,
  widened only continuity lookup for legacy wallet-scoped imported rows, and
  corrected DCA fixtures to satisfy current strategy validation.

### 5. Verify and Test
- Validation performed: focused red/green regression, focused history check,
  full runtime/portfolio focused pack, helper unit suite, typecheck, and
  repository guardrails.
- Result: PMPLC-45 validations passed.

### 6. Self-Review
- Simpler option considered: remove `syncState` filtering for all closed
  positions. Rejected because it would admit stale drift states into money
  truth.
- Technical debt introduced: no
- Scalability assessment: added predicates stay scoped by user, bot/wallet,
  symbol set, and session windows.
- Refinements made: kept the service under the monolith line budget without an
  allowlist.

### 7. Update Documentation and Knowledge
- Docs updated:
  - this task evidence
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
- Context updated:
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
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
- DB-backed e2e files that share global cleanup were run in a single fork for
  the combined validation pack.
- The DCA fixture update aligns test data with the existing strategy
  reachability validator; it does not change production validation behavior.

## Production-Grade Required Contract

## Scope
- Exact files are listed in the main Scope section.

## Implementation Plan
1. Include confirmed imported external-close states in the closed-position
   runtime aggregate filter.
2. Preserve broader lifecycle continuity lookup for carry-over and legacy
   wallet-scoped imported rows.
3. Keep helper/unit expectations aligned with the carry-over lifetime trade
   contract.
4. Run focused, combined, and quality-gate validation.

## Acceptance Criteria
- See main Acceptance Criteria section.

## Result Report
- Task summary: runtime aggregate PnL and lifecycle history now include
  confirmed imported closed/carry-over truth without admitting stale open
  orphan positions.
- Files changed:
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
  - `apps/api/src/modules/bots/runtimeSessionTradesRead.service.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`
  - `apps/api/src/modules/bots/bots.e2e.fixtures.ts`
  - source-of-truth docs
- How tested: focused red/green, runtime/portfolio pack, unit helper,
  typecheck, guardrails, lint, and diff check.
- What is incomplete: nothing in this slice.
- Next steps: continue the next NOW/NEXT money-impacting V1 hardening item.
- Decisions made: confirmed imported external-close states are aggregate truth;
  legacy wallet-scoped rows are continuity-only lookup support.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: yes
- Regression check performed: yes

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: user trading/runtime position and trade data
- Trust boundaries: authenticated dashboard runtime endpoints with existing
  user, bot, wallet, and symbol scoping
- Permission or ownership checks: reused existing bot, wallet, external
  ownership, and symbol filters
- Abuse cases: stale orphan open positions must not enter runtime truth
- Secret handling: no secret changes
- Security tests or scans: ownership/scope regressions in runtime-scope pack
- Fail-closed behavior: unconfirmed open orphan positions remain excluded
- Residual risk: low
