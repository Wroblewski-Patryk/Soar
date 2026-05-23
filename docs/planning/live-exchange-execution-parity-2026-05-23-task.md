# Task

## Header
- ID: LIVE-EXCHANGE-EXECUTION-PARITY-2026-05-23
- Title: Verify Binance and Gate.io LIVE execution parity for manual and automated bot channels
- Task Type: release
- Current Stage: verification
- Status: IN_PROGRESS
- Owner: Ops/Release
- Depends on: protected production app account context, explicit operator approval for any live exchange-side mutation
- Priority: P0
- Module Confidence Rows: SOAR-ORDERS-001, SOAR-BOT-RUNTIME-001, SOAR-OPERATIONS-001
- Requirement Rows: REQ-LIVE-EXCHANGE-PARITY-2026-05-23
- Quality Scenario Rows: QAS-LIVE-TRADING-SAFETY-2026-05-23
- Risk Rows: RISK-LIVE-EXCHANGE-MUTATION-2026-05-23
- Iteration: protected live-trading parity checkpoint
- Operation Mode: BUILDER
- Mission ID: LIVE-EXCHANGE-EXECUTION-PARITY-2026-05-23
- Mission Status: PARTIALLY_VERIFIED_PROD_PUBLIC

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed through active mission context.
- [x] `.agents/core/mission-control.md` was reviewed for long-running work.
- [x] Missing or template-like state tables were bootstrapped from repository sources, or confirmed not needed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task or mission improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: determine and close the gap between Binance and Gate.io LIVE execution for manual order and automated bot order channels.
- Release objective advanced: provide evidence-backed confidence that both supported live exchanges can open positions through the intended production paths, or identify the exact blocker without unsafe mutation.
- Included slices:
  - inspect manual order context and submit paths for exchange-specific rule resolution;
  - inspect automated bot runtime signal-to-order paths for Binance and Gate.io;
  - verify whether Gate.io minimum-notional blocking came from Gate.io market rules or an incorrect Binance default;
  - add focused tests or code fixes if a confirmed gap is found;
  - run read-only production preflights before any live order attempt;
  - perform only minimum-size, explicitly approved live mutations when preflight proves the expected bounded risk.
- Explicit exclusions:
  - no raw secret persistence in repository artifacts;
  - no order larger than the operator-approved cap for a specific proof;
  - no hidden risk-ack bypass, fake fill, or simulated claim as live exchange proof;
  - no broad strategy rewrites or unrelated dashboard changes.
- Checkpoint cadence: update this task after analysis, after any implementation, after each proof attempt, and before final handoff.
- Stop conditions: missing explicit approval for live mutation size/symbol/side, exchange minimum exceeds approved risk, wallet/API key mismatch, failed pretrade guard, production health/readiness failure, or architecture mismatch requiring owner decision.
- Handoff expectation: final report lists files changed, tests/proofs run, live mutations attempted or blocked, positions/orders readback, and residual risk.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | AGENTS, active mission, live trading task evidence | Integration, live-mutation decision gate, source-of-truth updates | Mission packet, final acceptance | Parent validation gate | IN_PROGRESS |
| Manual order path | Explorer lane + coordinator | Orders services, exchange boundary, prior Gate.io fail-closed evidence | Read-only findings; possible focused tests | Manual path parity findings | File/line evidence, focused tests if changed | IN_PROGRESS |
| Automated bot path | Explorer lane + coordinator | Runtime bot execution, exchange boundary, strategy/order services | Read-only findings; possible focused tests | Auto path parity findings | File/line evidence, focused tests if changed | IN_PROGRESS |
| Production preflight and proof | Coordinator | Production API/Web health and protected app context | Authenticated readbacks and bounded live attempts | Preflight and live proof report | Public build-info/smoke passed; protected app readback blocked without transient Soar auth | PARTIAL |
| Documentation/Memory | Coordinator | State files and task board | Planning/state updates | Durable evidence and residual risk | Secret scan, diff check | IN_PROGRESS |

### Lane Checks
- [x] `.agents/state/active-mission.md` was created or refreshed for broad work.
- [x] `.agents/workflows/responsibility-lanes.md` was reviewed.
- [x] Every important responsibility from source docs has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [ ] Missing or unclear ownership was recorded in `.agents/state/responsibility-learning.md` if discovered.
- [x] Process eval will be recorded in `.agents/state/agent-evals.md` because this is broad, subagent-assisted, and money-impacting work.

## Context
The operator repaired Gate.io configuration and approved one bounded ADAUSDT short attempt below `1 USDT`. The order failed before exchange placement with `LIVE_PRETRADE_NOTIONAL_BELOW_MIN`. The operator now asks whether this could be a Binance-notional leak and requests coordinated proof that Binance and Gate.io work through manual and automated bot channels.

## Goal
Produce evidence-backed parity for Binance and Gate.io LIVE execution paths, or a precise blocker with code-level cause and safe next action.

## Success Signal
- User or operator problem: uncertainty whether Gate.io order failure is caused by wrong code, exchange API support, or leverage/minimum settings.
- Expected product or reliability outcome: both supported exchanges use the correct venue-specific context and fail or execute for explainable, operator-visible reasons.
- How success will be observed: focused code/tests plus production preflight/readback; live proof only when explicitly approved and bounded.
- Post-launch learning needed: yes

## Deliverable For This Stage
Verification-stage deliverable: focused local proof that Binance/Gate.io symbol
resolution, manual pretrade, manual context, runtime pretrade, runtime sizing,
and runtime wallet funds checks use exchange-specific market rules including
derivative contract size.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it
- protect secrets and live-money boundaries

## Definition of Done
- [ ] Manual order path parity is verified or a specific blocker is documented.
- [ ] Automated bot order path parity is verified or a specific blocker is documented.
- [ ] Gate.io min-notional source is proven from code/runtime data, not guessed.
- [ ] Any confirmed code gap has focused tests or is tracked as blocked.
- [ ] Production proof attempts, if performed, have health/readiness preflight, bounded order parameters, and final order/position readback.
- [ ] Source-of-truth state and residual risks are updated.

## Stage Exit Criteria
- [ ] The output matches the declared `Current Stage`.
- [ ] Work from later stages was not mixed in without explicit approval.
- [ ] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping
- unbounded live trading mutation
- raw secret persistence

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/orders/orders.quantityRules.test.ts src/modules/exchange/ccxtFuturesConnector.service.test.ts src/modules/exchange/exchangeSymbolRules.service.test.ts src/modules/exchange/exchangeMetadataContract.service.test.ts src/modules/engine/runtimeExchangeOrderGuard.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/engine/runtimeFinalCandleDecision.service.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts src/modules/engine/runtimeCapitalContext.service.test.ts --run --reporter=dot` => PASS, `9` files / `129` tests.
  - `pnpm --filter api run typecheck` => PASS.
  - `pnpm run quality:guardrails` => PASS.
  - `git diff --check` => PASS with line-ending normalization warnings only.
  - `pnpm run quality:guardrails` => PASS before production redeploy.
  - `git diff --check` => PASS before production redeploy.
- Manual checks:
  - Local read-only CCXT connector probe after the fix resolved `GATEIO / FUTURES/swap / ADAUSDT` to swap rules: `minAmount=1`, `amountPrecision=1`, `contractSize=10`, `mark=0.2421`, so one contract notional was about `2.421 USDT` and `quantity=4` would be about `9.684 USDT`.
  - Local read-only CCXT connector probe for Binance ADAUSDT futures returned `minAmount=1`, `minNotional=5`, `contractSize=1`, `mark=0.2421`.
- Production deploy/readback:
  - Commit `9d1a83875767cd0227be9e2a899b2170a74034cf` was pushed to `main`.
  - Coolify did not converge automatically from the previous public build, so the coordinator manually triggered approved Coolify redeploy/force-start for `soar-web`, `soar-api`, and `workers-execution`.
  - `pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha 9d1a8387 --timeout-seconds 1200 --interval-seconds 30` => PASS; production Web build-info reported `gitSha=9d1a83875767cd0227be9e2a899b2170a74034cf`, `gitRef=main`, `metadataSource=github-branch`, `buildId=1tCeTjS9PmOJLsdQ6fVIG`.
  - `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` => PASS for API `/health`, API `/ready`, and Web `/`.
  - Fresh readback at `2026-05-23T16:23:36.987Z` still reported the same `9d1a8387` build-info tuple.
- Screenshots/logs: pending
- High-risk checks: no new production LIVE mutation was attempted after finding the contract-size bug. Public deployment proof is complete for `9d1a8387`; protected manual/bot readbacks remain blocked because this shell has no Soar app password, API token, session cookie, or private ops auth env vars. A future live mutation still requires fresh explicit operator approval for exchange, symbol, side, and minimum executable size.
- Secret checks: full repo scan still finds pre-existing test/seed references to the default test password; changed-diff scan found no newly added raw password secret in this mission.
- Module confidence ledger updated: yes
- Module confidence rows closed or changed: SOAR-ORDERS-001, SOAR-BOT-RUNTIME-001, SOAR-OPERATIONS-001
- Requirements matrix updated: yes
- Requirement rows closed or changed: REQ-LIVE-EXCHANGE-PARITY-2026-05-23
- Quality scenarios updated: yes
- Quality scenario rows closed or changed: QAS-LIVE-TRADING-SAFETY-2026-05-23
- Risk register updated: yes
- Risk rows closed or changed: RISK-LIVE-EXCHANGE-MUTATION-2026-05-23
- Reality status: partially verified with public production deploy proof

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/06_execution-lifecycle.md`, exchange/order services, runtime execution state.
- Fits approved architecture: yes. The fix keeps LIVE order truth in the exchange/rules boundary and shared pretrade/runtime guards.
- Mismatch discovered: no architecture mismatch; implementation was missing Gate.io derivative market disambiguation and contract-size propagation.
- Decision required from user: yes, but only for protected app credentials/readback execution or the next live mutation size because Gate.io ADAUSDT cannot satisfy the previous `<= 1 USDT` cap.
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: pending

## Deployment / Ops Evidence
- Deploy impact: medium; deployed publicly as `9d1a8387`
- Env or secret changes: none planned
- Health-check impact: none planned
- Smoke steps updated: public no-worker deploy smoke passed for the deployed candidate.
- Rollback note: live mutation proof must include final readback and cleanup/deactivation where applicable.
- Observability or alerting impact: none in this local slice
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Gate.io ADAUSDT order under `1 USDT` failed closed with `LIVE_PRETRADE_NOTIONAL_BELOW_MIN`.
- Gaps: source of `minNotional` and manual context parity need proof; automated bot path needs Binance/Gate.io parity proof.
- Inconsistencies: live order adapter naming references Binance while implementation appears generic CCXT; must verify.
- Architecture constraints: LIVE exchange fill/order truth must come from exchange-backed boundaries and fail closed.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files: none for this stage
- Sources scanned: active mission, next steps, task board, order/exchange code.
- Rows created or corrected: task board, active mission, next steps, requirements matrix, risk register, quality scenarios, module confidence ledger, and agent eval row.
- Assumptions recorded: live mutation remains approval-gated by symbol, side, exchange, and max notional.
- Blocking unknowns: exact exchange minimums and Binance proof target.
- Why it was safe to continue: analysis and read-only preflights do not mutate exchange state.

### 2. Select One Priority Mission Objective
- Selected task: LIVE-EXCHANGE-EXECUTION-PARITY-2026-05-23
- Priority rationale: money-impacting LIVE execution is P0 confidence scope.
- Why other candidates were deferred: unrelated local cleanup/deploy follow-ups do not answer the operator's live execution concern.

### 3. Plan Implementation
- Files or surfaces to modify: exchange CCXT connector, symbol/rules metadata, manual order context, live pretrade guards, runtime LIVE sizing/funds guard, focused tests, and source-of-truth docs.
- Logic: verify venue-specific rule resolution and auto/manual execution parity.
- Edge cases: Gate.io swap symbol mapping, min notional vs leverage margin, stale cache, manual context submit mismatch, automated signal sizing.

### 4. Execute Implementation
- Implementation notes: fixed CCXT market symbol resolution to prefer the configured market type when spot and swap markets normalize to the same symbol/id; filtered `loadMarketsMap()` to the configured market type; added `contractSize` to symbol trading rules and metadata; updated manual context and live pretrade notional checks to compute `quantity * markPrice * contractSize`; updated runtime exchange order guard, runtime signal sizing, and runtime wallet funds guard to account for derivative contract size before auto orchestration.

### 5. Verify and Test
- Validation performed: focused exchange/orders/runtime tests, API typecheck, guardrails, diff check, production Web build-info freshness wait, and public API/Web smoke listed above.
- Result: PASS locally and PASS for public production deploy freshness.

### 6. Self-Review
- Simpler option considered: answer from existing failed order evidence only.
- Technical debt introduced: no
- Scalability assessment: exchange-specific contract sizes now flow through the shared CCXT/rules boundary instead of a Gate.io-only workaround.
- Refinements made: expanded from symbol-resolution fix to contract-size notional/sizing because otherwise auto LIVE proof could oversize Gate.io derivative orders.

### 7. Update Documentation and Knowledge
- Docs updated: this task file
- Context updated: active mission, task board, next steps, project state, requirements matrix, risk register, quality scenarios, module confidence ledger, and agent eval row.
- Learning journal updated: not applicable yet

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
- [x] Learning journal was updated if a recurring pitfall was confirmed or marked not applicable.
- [x] Required responsibility lanes were integrated, rejected, or tracked as follow-up.
