# Task

## Header
- ID: V1DOGE-01
- Title: Audit LIVE DOGEUSDT TSL close and stale DCA state after reopen
- Task Type: research
- Current Stage: planning
- Status: DONE
- Owner: Planning Agent
- Depends on: V1DCA-02, live protection-state parity contract
- Priority: P0

## Context
The operator reported that the `LIVE` `DOGEUSDT` position was closed at a loss
even though the configured strategy still had remaining DCA levels, no maximum
position lifetime, and no visible TSL activation on the dashboard. Immediately
afterward, a newly opened `DOGEUSDT` position displayed DCA state from the
previous closed lifecycle.

This is real-money runtime behavior, so the task is limited to audit and repair
planning. No runtime implementation is performed in this stage.

## Goal
Establish the production facts, identify the most likely code-level fault
classes, and publish a detailed repair plan that covers every user-configured
strategy option across `LIVE`, `PAPER`, read models, execution, futures market
data, and lifecycle reopen behavior.

## Success Signal
- User or operator problem: a live position closed with unclear or apparently invalid strategy authority.
- Expected product or reliability outcome: the next implementation slice has a precise, testable target before touching live-money behavior.
- How success will be observed: production evidence and repository analysis are documented with concrete acceptance criteria.
- Post-launch learning needed: yes

## Deliverable For This Stage
Planning-only audit packet:

- production DOGEUSDT lifecycle facts
- code-path analysis for `DCA`, `TTP`, `TSL`, `SL/TP`, lifetime, basic vs advanced, and market-source selection
- repair plan and acceptance matrix

## Scope
- Production protected API inspection:
  - active bot runtime sessions
  - DOGEUSDT runtime positions
  - DOGEUSDT runtime trades
  - deployed build-info
- Repository modules:
  - `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
  - `apps/api/src/modules/engine/positionManagement.service.ts`
  - `apps/api/src/modules/engine/runtimeCapitalContext.service.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
  - `apps/api/src/modules/engine/runtimePositionState.store.ts`
  - exchange and market-data boundary code used by runtime prices
- Canonical contracts:
  - `docs/architecture/reference/live-protection-state-parity-contract.md`
  - `docs/architecture/reference/live-runtime-lifecycle-parity-contract.md`

## Implementation Plan
1. Capture deployed production build freshness.
2. Inspect the current `LIVE` bot, wallet, market universe, and strategy config.
3. Reconstruct the DOGEUSDT lifecycle from open, DCA, close, and reopen rows.
4. Compare production evidence to local runtime/read-model code.
5. Publish a repair plan with vertical-slice tasks and tests.

## Acceptance Criteria
- [x] The report states whether the DOGE close was caused by bot runtime, user app, exchange/user, or reconciliation.
- [x] The report identifies why a newly reopened DOGE row can show stale DCA.
- [x] The report lists required coverage for each configured strategy option.
- [x] The report identifies deployment freshness as a factor where relevant.
- [x] The report does not propose a temporary bypass.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` was considered for the next implementation stage.
- [x] Architecture source of truth was checked before proposing repair work.
- [x] No code changes were made during the planning/audit stage.
- [x] A separate implementation-ready task is queued.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- runtime changes without tests
- deployment of unverified money-path behavior
- display-only fixes that hide execution drift
- treating spot and futures market data as interchangeable
- carrying DCA/trailing state across closed and reopened lifecycles

## Validation Evidence
- Tests: not run; this was planning-only.
- Manual checks: protected production API inspection of `DOGEUSDT` runtime positions/trades.
- Screenshots/logs: production facts recorded in `docs/operations/v1doge-live-close-and-reopen-audit-2026-05-01.md`.
- High-risk checks: close attribution and strategy config inspected before conclusions.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/live-protection-state-parity-contract.md`
  - `docs/architecture/reference/live-runtime-lifecycle-parity-contract.md`
- Fits approved architecture: no
- Mismatch discovered: yes. The read model can leak stale DCA into a reopened lifecycle, and the close path can lose strategy identity on close trades.
- Decision required from user: no for the first repair slice; the architecture already forbids the observed drift.
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none required yet; implementation must align to existing contracts.

## Deployment / Ops Evidence
- Deploy impact: high for the follow-up runtime fix
- Env or secret changes: none planned
- Health-check impact: none expected
- Smoke steps updated: follow-up must add protected production runtime smoke for DOGE-style close/reopen state
- Rollback note: revert the runtime/read-model commit if protected smoke shows lifecycle state or close attribution regression
- Observability or alerting impact: follow-up should emit operator-visible protection skip/close rationale
- Staged rollout or feature flag: not applicable unless implementation changes live-close authority

## Review Checklist
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run or intentionally scoped out.
- [x] Docs or context were updated because repository truth changed.
- [ ] Learning journal was updated if a recurring pitfall was confirmed.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: LIVE operator using a Binance Futures wallet
- Existing workaround or pain: manual monitoring and uncertainty about why the bot closed a position
- Smallest useful slice: fix close/reopen lifecycle state isolation and close trade strategy attribution, then add full protection matrix coverage
- Success metric or signal: DOGE-style close/reopen fixture cannot leak old DCA and cannot close via TSL/SL while pending DCA is valid and affordable
- Feature flag, staged rollout, or disable path: no
- Post-launch feedback or metric check: yes

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable for planning
- Critical user journey: LIVE futures bot protection lifecycle
- SLI: protected positions decision correctness
- SLO: zero known invalid automated closes under configured strategy semantics
- Error budget posture: burning
- Health/readiness check: production API public checks were available; protected runtime API used for evidence
- Logs, dashboard, or alert route: follow-up should expose close rationale and DCA-funds decision
- Smoke command or manual smoke: protected DOGE-style runtime positions/trades query
- Rollback or disable path: stop bot or revert implementation commit if production smoke fails

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable for planning
- Data classification: production user trading/runtime data
- Trust boundaries: authenticated dashboard API, exchange account, live execution
- Permission or ownership checks: inspected only through authenticated owner/admin API access
- Abuse cases: unauthorized close or stale state causing live loss
- Secret handling: credentials were used transiently and not written to artifacts
- Security tests or scans: not run
- Fail-closed behavior: required in follow-up implementation
- Residual risk: high until implementation and protected production verification close

## Result Report
- Task summary: completed a planning-only audit of the live DOGE close and stale DCA after reopen.
- Files changed:
  - `docs/planning/v1doge-01-live-doge-close-and-reopen-audit-task-2026-05-01.md`
  - `docs/operations/v1doge-live-close-and-reopen-audit-2026-05-01.md`
  - queue/context files
- How tested: no code tests; production API facts and code paths inspected.
- What is incomplete: implementation of the repair plan.
- Next steps: `V1DOGE-02` implementation and verification.
- Decisions made: treat this as P0 live-money lifecycle parity work before broader confidence gates.
