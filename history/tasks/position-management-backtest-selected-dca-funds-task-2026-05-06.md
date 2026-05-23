# Task

## Header
- ID: PMPLC-07
- Title: fix(api-backtests): estimate DCA funds from selected level size
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-05, PMPLC-06
- Priority: P1
- Iteration: 7
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Backtest replay and interleaved portfolio simulation now carry executed DCA
level indices. Their affordability estimates still used aggregate
`currentAdds`/`dcaCount` to pick the next multiplier. In mixed positive and
negative DCA lanes, the selected pending level can have a different index and
size than the aggregate count implies.

## Goal
Make DCA funds exhaustion use the selected DCA level size from the shared
position-management core instead of guessing the multiplier from aggregate add
count.

## Success Signal
- User or operator problem: backtests could treat a selected high-size DCA as
  fundable because a lower-size multiplier happened to sit at `currentAdds`.
- Expected product or reliability outcome: replay and portfolio affordability
  now match the actual DCA candidate selected by runtime lifecycle semantics.
- How success will be observed: regression proves TTP can release after a
  mixed-lane position reaches an unaffordable selected DCA level.
- Post-launch learning needed: no.

## Deliverable For This Stage
Production replay/portfolio fix, focused regression, validation evidence, and
source-of-truth updates.

## Constraints
- Reuse `evaluatePositionManagement` result fields.
- Do not duplicate DCA level selection logic.
- Do not change strategy schema limits.
- Keep this slice limited to affordability estimation for selected DCA level
  size.

## Definition of Done
- [x] Replay DCA funds estimate uses `dcaProbeResult.dcaAddedQuantity`.
- [x] Portfolio DCA funds estimate uses `dcaProbeResult.dcaAddedQuantity`.
- [x] Regression covers mixed-lane selected-level multiplier mismatch.
- [x] Relevant validations pass.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- Guessing selected DCA level size from `currentAdds`.
- Parallel DCA-selection implementations.
- Silent close-protection blocking after selected DCA is actually
  funds-exhausted.

## Validation Evidence
- Tests: `pnpm --filter api exec vitest run src/modules/backtests/backtestReplayCore.test.ts --run` PASS (`28/28`).
- Runtime/backtest suite: `pnpm --filter api exec vitest run src/modules/backtests/backtestReplayCore.test.ts src/modules/engine/positionManagement.service.test.ts --run` PASS (`50/50`).
- Typecheck: `pnpm --filter api run typecheck` PASS.
- Guardrails: `pnpm run quality:guardrails` PASS.
- Lint: `pnpm run lint` PASS.
- Diff check: `git diff --check` PASS with line-ending warnings only.
- Manual checks: reviewed replay and portfolio DCA affordability paths.
- High-risk checks: regression covers negative-lane DCA followed by
  unaffordable positive-lane DCA with a larger selected multiplier.

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
- Rollback note: revert selected DCA affordability estimate change if needed.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: affordability used `dcaCount` to select multiplier.
- Gaps: mixed-lane selected DCA index could differ from aggregate add count.
- Inconsistencies: a selected large DCA could be classified fundable using a
  smaller multiplier from a different level.
- Architecture constraints: backtest must preserve runtime lifecycle semantics
  and use shared decision core wherever possible.

### 2. Select One Priority Task
- Selected task: align affordability estimate with selected DCA level size.
- Priority rationale: wrong funds exhaustion can block close protection or
  misstate risk in money-impacting simulations.
- Why other candidates were deferred: broader shared-wallet reserve accounting
  remains a larger follow-up.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `apps/api/src/modules/backtests/backtestReplayCore.ts`
  - `apps/api/src/modules/backtests/backtestPortfolioSimulation.service.ts`
  - `apps/api/src/modules/backtests/backtestReplayCore.test.ts`
- Logic: use `dcaProbeResult.dcaAddedQuantity` for estimated DCA margin in
  replay and portfolio paths.
- Edge cases: selected positive DCA after negative lane progress with a larger
  multiplier than `currentAdds` would imply.

### 4. Execute Implementation
- Implementation notes: removed multiplier lookup by count for funds estimate
  and used the core-selected added quantity.

### 5. Verify and Test
- Validation performed: focused replay suite, runtime/backtest suite, API
  typecheck, guardrails, lint, and diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: expose selected DCA index and reuse multipliers.
  Using `dcaAddedQuantity` is safer because the core already calculated the
  exact selected add size.
- Technical debt introduced: no.
- Scalability assessment: works for positive, negative, repeated, and mixed
  DCA lanes.
- Refinements made: adjusted regression multiplier to schema-valid `2` and
  set balance so the old estimate would be fundable while the selected DCA
  size is not.

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
Residual risk: shared-wallet reserve accounting across several open symbols
still deserves a dedicated parity audit against runtime capital snapshots.

## Production-Grade Required Contract
- Goal: estimate DCA funds from the selected DCA candidate, not aggregate add
  count.
- Scope: replay core, portfolio simulation, focused regression, planning and
  context evidence.
- Implementation Plan: inspect drift, use core result added quantity, validate
  mixed-lane multiplier mismatch.
- Acceptance Criteria: selected-level funds regression passes and quality gates
  pass.
- Definition of Done: satisfied for this money-impacting parity slice.
- Result Report: PMPLC-07 closed locally with validation evidence.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: not applicable for internal simulation
  parity slice.
- Real API/service path used: existing replay and portfolio simulation paths.
- Endpoint and client contract match: not applicable.
- DB schema and migrations verified: not applicable.
- Loading state verified: not applicable.
- Error state verified: not applicable.
- Refresh/restart behavior verified: deterministic replay state covered by
  focused tests.
- Regression check performed: focused replay/runtime suites.

## Product / Discovery Evidence
- Problem validated: yes.
- User or operator affected: strategy authors reviewing DCA-heavy backtests.
- Existing workaround or pain: none acceptable.
- Smallest useful slice: selected DCA level affordability estimate.
- Success metric or signal: regression remains green.
- Feature flag, staged rollout, or disable path: not applicable.
- Post-launch feedback or metric check: no.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not
  applicable.
- Critical user journey: strategy backtest lifecycle reporting.
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
- Abuse cases: misleading simulation output by misclassifying selected DCA
  affordability.
- Secret handling: unchanged.
- Security tests or scans: not applicable.
- Fail-closed behavior: focused regression fails on selected-level estimate
  drift.
- Residual risk: shared-wallet multi-symbol reserve accounting still needs
  audit.

## AI Testing Evidence
Not applicable.
