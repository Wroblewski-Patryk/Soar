# Task

## Header
- ID: V1DOGE-02
- Title: Harden DOGE-style LIVE close/reopen lifecycle state
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: V1DOGE-01, live protection-state parity contract
- Priority: P0

## Context
The operator reported a real-money `LIVE DOGEUSDT` close at a loss and a fresh
same-symbol reopen that immediately showed DCA state from the prior lifecycle.
`V1DOGE-01` confirmed the close was app-side `BOT_APP` `TSL` automation and
that stale DCA crossed the close/reopen boundary in the runtime `Positions`
read model.

This task implements the smallest safe runtime/read-model slice: preserve
strategy identity on automated closes, make same-symbol lifecycle boundaries
robust for legacy close rows without `strategyId`, prove DCA-first close
authority for `SL/TSL`, and persist an operator-visible close decision snapshot.

## Goal
Prevent closed same-symbol lifecycle state from leaking into a new `LIVE` open
row and make every automated close decision explainable through existing
runtime telemetry.

## Success Signal
- User or operator problem: a fresh DOGEUSDT position must not inherit prior lifecycle DCA/protection state.
- Expected product or reliability outcome: bot-managed close trades retain strategy identity and read models cut stale DCA at the latest close boundary.
- How success will be observed: focused runtime/read-model tests prove close/reopen isolation, DCA-first authority, and close telemetry.
- Post-launch learning needed: yes

## Deliverable For This Stage
Verified code, tests, and documentation for the runtime close/reopen hardening
slice.

## Scope
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.types.ts`
- `apps/api/src/modules/engine/runtimePositionAutomationTelemetry.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.test.ts`
- `apps/api/src/modules/engine/positionManagement.service.test.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts`
- `docs/operations/v1doge-live-close-and-reopen-audit-2026-05-01.md`
- canonical queue/context files

## Implementation Plan
1. Pass `position.strategyId` through the runtime automated close path into the existing execution orchestrator.
2. Resolve runtime `Positions` lifecycle continuity from same symbol/bot/wallet close boundaries, allowing legacy close trades with missing `strategyId` to cut off stale DCA for new opens.
3. Keep supplemental DCA attachment strict by bot/wallet/strategy/symbol/side/lifecycle window so unrelated DCA rows cannot attach.
4. Add focused close/reopen regression coverage for a legacy no-strategy close followed by a fresh same-symbol open.
5. Add `SL` and `TSL` DCA-first regression coverage for affordable pending DCA versus explicitly exhausted DCA.
6. Emit existing runtime telemetry events for DCA exhaustion and automated close decisions with DCA/protection context.
7. Rerun focused runtime/read-model/futures checks, then sync planning and context docs.

## Acceptance Criteria
- [x] Fresh same-symbol reopen after a bot close shows `dcaCount=0`.
- [x] Previous lifecycle keeps its own DCA history.
- [x] Bot-managed runtime close input carries `strategyId`.
- [x] Legacy close rows without `strategyId` still cut off old DCA for new opens when bot/wallet/symbol chronology proves the boundary.
- [x] `SL` and `TSL` remain blocked while pending DCA is valid and affordable.
- [x] `SL` and `TSL` may close only when DCA is completed or explicitly funds-exhausted.
- [x] DCA funds exhaustion and automated close decisions are operator-visible in runtime telemetry.
- [x] Existing `basic`/`advanced` and futures market-source coverage remains green.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations were applied to this money-impacting runtime slice.
- [x] Implementation stays inside existing runtime automation, execution orchestrator, read-model, and telemetry systems.
- [x] No temporary bypass, display-only fix, or duplicate lifecycle system was introduced.
- [x] Focused runtime/read-model regression tests pass.
- [x] Planning, operations, task board, and project state are synced.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new close-authority systems
- duplicated DCA/read-model logic outside the approved runtime read model
- hidden bypasses that disable protections instead of proving authority
- treating spot and futures market data as interchangeable
- carrying runtime state across closed and reopened lifecycles

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/engine/runtimePositionAutomation.service.test.ts`
  - `pnpm --filter api exec vitest run src/modules/engine/positionManagement.service.test.ts`
  - `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts`
  - `pnpm --filter api exec vitest run src/modules/engine/runtimeSignalMarketDataGateway.test.ts`
- Manual checks: code review of runtime close strategy propagation and lifecycle cutoff.
- Screenshots/logs: not applicable; backend/runtime slice.
- High-risk checks: DCA-first close authority, legacy close boundary, and futures market-source regression coverage.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/live-protection-state-parity-contract.md`
  - `docs/architecture/reference/live-runtime-lifecycle-parity-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no new mismatch after implementation
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not required; this implementation aligns with existing contracts.

## Deployment / Ops Evidence
- Deploy impact: high
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: protected production DOGE-style runtime payload verification remains recommended after deploy.
- Rollback note: revert this commit if protected smoke shows stale DCA crossing a close/reopen boundary or automated close trades missing `strategyId`.
- Observability or alerting impact: runtime telemetry now records DCA exhaustion and close-decision context.
- Staged rollout or feature flag: not applicable

## Review Checklist
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated because repository truth changed.
- [ ] Learning journal was updated if a recurring pitfall was confirmed.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: runtime state rebase and read-model tests cover same-symbol lifecycle replacement.
- Regression check performed: focused runtime/read-model/futures pack listed above.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: LIVE Binance Futures operator
- Existing workaround or pain: manual uncertainty after a bot-managed loss close
- Smallest useful slice: runtime close attribution, stale DCA cutoff, DCA-first close authority, and decision telemetry
- Success metric or signal: DOGE-style close/reopen fixture cannot leak DCA and automated closes are explainable
- Feature flag, staged rollout, or disable path: no
- Post-launch feedback or metric check: protected production smoke after deploy

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: LIVE futures bot protection lifecycle
- SLI: automated close decision correctness and explainability
- SLO: zero known invalid automated closes under configured strategy semantics
- Error budget posture: burning until deployed verification is captured
- Health/readiness check: no health endpoint changes
- Logs, dashboard, or alert route: existing `BotRuntimeEvent` `SIGNAL_DECISION` and `PRETRADE_BLOCKED`
- Smoke command or manual smoke: protected runtime `Positions` plus runtime events inspection after deploy
- Rollback or disable path: stop bot and revert commit if protected smoke fails

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: production trading/runtime data
- Trust boundaries: authenticated app runtime, exchange account, database ledger
- Permission or ownership checks: unchanged; existing runtime ownership and read ownership paths reused
- Abuse cases: stale lifecycle state causing unauthorized or unexplained live close
- Secret handling: no secrets written
- Security tests or scans: not applicable beyond existing authenticated test paths
- Fail-closed behavior: DCA-first close authority remains strict unless DCA is completed or explicitly exhausted
- Residual risk: protected production verification is still needed after deployment

## Result Report
- Task summary: hardened runtime close/reopen lifecycle handling for DOGE-style same-symbol `LIVE` positions.
- Files changed:
  - runtime close strategy propagation and telemetry
  - runtime positions lifecycle boundary read model
  - focused runtime/read-model/DCA-first tests
  - planning and operations docs
- How tested: focused API runtime/read-model/futures Vitest pack listed above.
- What is incomplete: protected production post-deploy verification is still required once deployed.
- Next steps: deploy, then verify the active production DOGE-style payload no longer leaks stale DCA and close events include strategy/decision context.
- Decisions made: reuse existing runtime telemetry instead of adding a second close-rationale system.
