# Task

## Header
- ID: LIVE-DCA-SUBMITTED-FILL-GATE-2026-05-22
- Title: Fail closed when LIVE DCA is only submitted
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Priority: P0
- Module Confidence Rows: SOAR-BOT-RUNTIME-001, SOAR-ORDERS-001, SOAR-POSITIONS-001
- Requirement Rows: not changed
- Quality Scenario Rows: live-trading safety
- Risk Rows: runtime DCA/TSL fail-open
- Iteration: 2026-05-22 emergency production fix
- Operation Mode: BUILDER
- Mission ID: LIVE-DCA-SUBMITTED-FILL-GATE-2026-05-22
- Mission Status: VERIFIED

## Process Self-Audit
- [x] One priority task selected: prevent unfilled LIVE DCA from advancing runtime close state.
- [x] Affected module confidence rows identified.
- [x] Existing runtime/order/exchange-fill systems reused.
- [x] Release confidence improved for live-trading safety.

## Mission Block
- Mission objective: keep LIVE DCA state fail-closed until exchange fill confirmation.
- Release objective advanced: prevent DCA submitted/open orders from being reported or acted on as executed DCA.
- Included slices: runtime DCA automation logic and regression test.
- Explicit exclusions: production database mutation, LIVE exchange mutation, UI redesign.
- Stop conditions: focused runtime regression and API typecheck pass.
- Handoff expectation: commit and deploy through main/Coolify after validation.

## Context
Operator feedback reported that DCA was visible as executed even though no DCA fill happened, and that TSL could execute after the false DCA state.

## Goal
When LIVE DCA order placement returns only a submitted/open order, runtime automation must not persist DCA progress, must not emit `DCA_EXECUTED`, and must not continue to stop/TSL close decisions in the same tick.

## Success Signal
- User or operator problem: unfilled LIVE DCA appeared as done and allowed later protection logic.
- Expected product or reliability outcome: LIVE DCA progress advances only after a confirmed fill.
- How success will be observed: regression test proves submitted DCA blocks same-tick stop close.
- Post-launch learning needed: yes

## Scope
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.test.ts`
- project state docs

## Implementation Plan
1. Inspect runtime DCA, order lifecycle, exchange event, and monitoring read paths.
2. Add a fail-closed guard after attempted DCA when `executeDca` returns `executed: false`.
3. Add a regression test for DCA submitted plus stop protection in the same LIVE tick.
4. Run focused runtime tests and API typecheck.
5. Update source-of-truth state files.

## Acceptance Criteria
- Submitted LIVE DCA does not increment in-memory or persisted runtime DCA state.
- Submitted LIVE DCA does not emit `DCA_EXECUTED`.
- Submitted LIVE DCA blocks same-tick stop/TSL close processing.
- Confirmed DCA fill path remains unchanged.

## Definition of Done
- [x] Runtime logic is fail-closed for unfilled LIVE DCA.
- [x] Regression test covers the reported class of bug.
- [x] Focused tests pass.
- [x] API typecheck passes.
- [x] Source-of-truth state updated.

## Forbidden
- Fake fills, placeholder state, or UI-only masking.
- Marking DCA executed before exchange fill confirmation.
- LIVE production exchange mutation during this fix.

## Validation Evidence
- Tests: `corepack pnpm --filter api exec vitest run src/modules/engine/runtimePositionAutomation.service.test.ts --run` passed (`37/37`).
- Manual checks: code inspection confirmed exchange event DCA state still advances through confirmed fill path.
- High-risk checks: `corepack pnpm --filter api run typecheck` passed.
- Module confidence ledger updated: yes
- Reality status: verified

## Architecture Evidence
- Architecture source reviewed: existing runtime/order/exchange-fill contracts.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no

## Deployment / Ops Evidence
- Deploy impact: medium
- Env or secret changes: none
- Health-check impact: none
- Rollback note: revert this commit if runtime DCA automation regresses; exchange-fill lifecycle remains separately covered.
- Observability or alerting impact: prevents false `DCA_EXECUTED` event for submitted-only orders.
- Staged rollout or feature flag: existing deploy path through main/Coolify.

## Security / Privacy Evidence
- Data classification: live trading state and order execution metadata.
- Trust boundaries: exchange fill confirmation remains the authority for LIVE DCA execution.
- Abuse cases: false local DCA progress allowing close protection despite no fill.
- Secret handling: no secrets touched.
- Fail-closed behavior: same-tick close returns early when DCA is pending exchange fill.
- Residual risk: production should be smoke-checked after deploy with read-only/runtime evidence.

## Result Report
- Task summary: runtime automation now stops the tick after submitted-only LIVE DCA and waits for exchange fill confirmation.
- Files changed: runtime DCA automation service, runtime automation test, state docs.
- How tested: focused runtime Vitest pack and API typecheck.
- What is incomplete: production deploy/readback pending in release step.
- Next steps: commit, push main, let Coolify deploy, then verify production build-info and health.
