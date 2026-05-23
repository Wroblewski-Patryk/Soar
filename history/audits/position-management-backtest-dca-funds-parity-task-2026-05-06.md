# Task

## Header
- ID: PMPLC-06
- Title: fix(api-backtests): respect tracked wallet funds before replay DCA adds
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-01, PMPLC-05
- Priority: P1
- Iteration: 6
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The position-management lifecycle contract says pending DCA must not be treated
as blocking protection unless runtime knows the next add can be funded. The
portfolio simulation already estimated next DCA margin against cash balance,
but single-symbol replay only considered DCA funds exhausted when tracked
balance was `<= 0`. That allowed replay to execute an unaffordable DCA while
runtime and portfolio paths would release close protection instead.

## Goal
Align single-symbol backtest replay with the DCA funds policy by checking
whether the next DCA add can be funded before mutating replay position state.

## Success Signal
- User or operator problem: backtests could show larger DCA-scaled positions
  than the tracked wallet balance could fund.
- Expected product or reliability outcome: replay does not invent DCA adds
  that available balance cannot support.
- How success will be observed: regression proves an underfunded DCA touch does
  not emit `DCA`, does not increase trade quantity, and still lets TP close
  after DCA is classified funds-exhausted.
- Post-launch learning needed: no.

## Deliverable For This Stage
Production replay fix, focused regression, and task evidence.

## Constraints
- Reuse existing replay state and runtime position-management core.
- Do not create a separate DCA funds policy system.
- Do not change portfolio simulation behavior except through previous shared
  DCA probe parity.
- Keep this slice limited to single-symbol replay affordability.

## Definition of Done
- [x] Replay estimates next DCA margin before applying DCA state.
- [x] Replay skips unaffordable DCA state mutation and event emission.
- [x] Close protection can proceed when DCA is funds-exhausted.
- [x] Relevant tests and quality gates pass.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- Mock-only affordability behavior.
- Silent execution of unaffordable DCA.
- Temporary bypasses around DCA-first close semantics.
- Duplicating runtime position-management close logic.

## Validation Evidence
- Tests: `pnpm --filter api exec vitest run src/modules/backtests/backtestReplayCore.test.ts --run` PASS (`27/27`).
- Runtime/backtest suite: `pnpm --filter api exec vitest run src/modules/backtests/backtestReplayCore.test.ts src/modules/engine/positionManagement.service.test.ts --run` PASS (`49/49`).
- Typecheck: `pnpm --filter api run typecheck` PASS.
- Guardrails: `pnpm run quality:guardrails` PASS.
- Lint: `pnpm run lint` PASS.
- Diff check: `git diff --check` PASS with line-ending warnings only.
- Manual checks: reviewed replay DCA affordability against portfolio simulation
  margin estimate.
- High-risk checks: regression covers small positive balance that is still
  insufficient for the next DCA.

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
- Rollback note: revert replay DCA affordability change if needed.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: replay considered DCA funds exhausted only at zero balance.
- Gaps: replay did not estimate next DCA margin before applying DCA state.
- Inconsistencies: portfolio simulation and runtime had stronger
  affordability semantics than single-symbol replay.
- Architecture constraints: `release_protection` is the safer default when DCA
  cannot be funded.

### 2. Select One Priority Task
- Selected task: fix single-symbol replay DCA affordability.
- Priority rationale: money-impacting backtest output must not invent
  unaffordable risk additions.
- Why other candidates were deferred: broader multi-symbol policy audit remains
  future work.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `apps/api/src/modules/backtests/backtestReplayCore.ts`
  - `apps/api/src/modules/backtests/backtestReplayCore.test.ts`
  - planning/context docs
- Logic: estimate next DCA added quantity and margin, classify
  `dcaFundsExhausted` when margin exceeds tracked balance, and apply DCA state
  only if the add can be funded.
- Edge cases: positive but insufficient tracked balance; untracked balance
  remains unlimited for legacy/default replay.

### 4. Execute Implementation
- Implementation notes: reused the portfolio simulation margin formula and
  guarded replay DCA state mutation/event emission.

### 5. Verify and Test
- Validation performed: focused replay suite, runtime/backtest suite, API
  typecheck, guardrails, lint, and diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: only set `dcaFundsExhausted` without guarding
  state mutation. That still allowed an unaffordable DCA event, so the mutation
  guard was required.
- Technical debt introduced: no.
- Scalability assessment: formula matches existing portfolio simulation and
  stays local to replay adapter state.
- Refinements made: regression asserts no DCA event, TP close allowed, and
  final quantity stays at initial size.

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
Residual risk: this slice aligns single-symbol replay affordability. A future
slice should compare multi-symbol portfolio reserve accounting against runtime
capital context for shared wallets.

## Production-Grade Required Contract
- Goal: prevent backtest replay from executing unaffordable DCA adds.
- Scope: replay core, focused regression, and planning/context evidence.
- Implementation Plan: inspect architecture and runtime/portfolio semantics,
  add affordability check, guard state mutation, validate.
- Acceptance Criteria: underfunded replay DCA does not emit `DCA` or increase
  quantity, while close protection can proceed.
- Definition of Done: satisfied for this money-impacting parity slice.
- Result Report: PMPLC-06 closed locally with validation evidence.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: not applicable for internal replay
  parity slice.
- Real API/service path used: existing backtest replay code path.
- Endpoint and client contract match: not applicable.
- DB schema and migrations verified: not applicable.
- Loading state verified: not applicable.
- Error state verified: not applicable.
- Refresh/restart behavior verified: deterministic replay state covered by
  focused tests.
- Regression check performed: focused backtest/runtime suites.

## Product / Discovery Evidence
- Problem validated: yes.
- User or operator affected: strategy authors reviewing DCA simulations.
- Existing workaround or pain: none acceptable for money-impacting simulation.
- Smallest useful slice: single-symbol replay affordability.
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
- Abuse cases: misleading simulation output by inventing unaffordable DCA risk.
- Secret handling: unchanged.
- Security tests or scans: not applicable.
- Fail-closed behavior: focused regression fails on unaffordable DCA execution.
- Residual risk: shared-wallet multi-symbol parity still needs audit.

## AI Testing Evidence
Not applicable.
