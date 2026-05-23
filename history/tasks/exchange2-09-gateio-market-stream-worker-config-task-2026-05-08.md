# EXCHANGE2-09 Gate.io Market Stream Worker Config Task (2026-05-08)

## Header
- ID: `EXCHANGE2-09-GATEIO-MARKET-STREAM-WORKER-CONFIG-2026-05-08`
- Title: Lock Gate.io market-stream worker source selection
- Task Type: refactor
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on:
  - `EXCHANGE2-05`
  - `EXCHANGE2-08`
- Priority: P0
- Iteration: EXCHANGE2-09
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Gate.io public market data can be read through the exchange-owned adapter and
the polling worker can publish canonical runtime events. Before any paper
pricing enablement, the worker bootstrap source selection must stay explicit:
Binance remains the default source and Gate.io is selected only by
`MARKET_STREAM_EXCHANGE=GATEIO`.

## Goal
Extract and test the market-stream worker configuration resolver so the
Gate.io polling source is an explicit opt-in and unsupported exchange values
fall closed to the existing Binance default path.

## Scope
- `apps/api/src/workers/marketStream.worker.ts`
- `apps/api/src/workers/marketStreamWorkerConfig.ts`
- `apps/api/src/workers/marketStreamWorkerConfig.test.ts`
- `docs/modules/api-market-stream.md`
- canonical queue/context state files

## Success Signal
- User or operator problem: Gate.io must not silently replace Binance or imply
  paper pricing readiness before target source evidence is complete.
- Expected product or reliability outcome: worker source selection is covered
  by a pure regression test.
- How success will be observed: focused worker/market-stream tests pass.
- Post-launch learning needed: no

## Deliverable For This Stage
Small worker bootstrap refactor, source-selection regression coverage, and
updated source-of-truth notes.

## Constraints
- use existing worker and market-stream adapter boundaries
- do not enable Gate.io `PAPER_PRICING_FEED`
- do not add authenticated reads, exchange writes, live submit, or cancel
- do not introduce a parallel worker system

## Implementation Plan
1. Move worker env parsing into a pure resolver.
2. Keep `marketStream.worker.ts` behavior equivalent by consuming that resolver.
3. Add focused tests for default Binance, explicit Gate.io opt-in, and invalid
   env fallback.
4. Run focused worker/market-stream tests, API typecheck, guardrails, docs
   parity, and diff checks.

## Acceptance Criteria
- Binance futures remains the default worker source.
- Gate.io polling source is selected only when `MARKET_STREAM_EXCHANGE=GATEIO`.
- Invalid exchange, market type, timing, and empty CSV env values fall back to
  safe defaults.
- Gate.io paper/live/authenticated capabilities remain disabled.

## Definition of Done
- [x] Worker config resolver added and used by the existing worker bootstrap.
- [x] Source-selection regression tests pass.
- [x] API typecheck passes.
- [x] Source-of-truth docs/context updated.

## Stage Exit Criteria
- [x] Output matches verification stage.
- [x] No runtime capability enablement was mixed into the task.
- [x] Risks and assumptions are stated clearly.

## Forbidden
- enabling `PAPER_PRICING_FEED`
- enabling `LIVE_EXECUTION`
- adding direct exchange calls outside the exchange module
- changing production deployment topology
- treating this local regression as production target-source evidence

## Validation Evidence
- Tests:
  - `apps\api\node_modules\.bin\vitest.CMD run apps/api/src/workers/marketStreamWorkerConfig.test.ts apps/api/src/workers/marketStreamSubscriptions.service.test.ts apps/api/src/modules/market-stream/exchangePollingStream.service.test.ts apps/api/src/modules/market-stream/exchangePollingStream.fanout.test.ts` => PASS (`4` files, `8/8`)
  - `apps\api\node_modules\.bin\tsc.CMD --noEmit -p apps\api\tsconfig.json` => PASS
  - `node scripts/repoGuardrails.mjs` => PASS
  - `node scripts/checkDocsParity.mjs` => PASS
  - `git diff --check` => PASS (line-ending warnings only)
- Manual checks:
  - diff review confirms `marketStream.worker.ts` still chooses between
    `ExchangePublicPollingMarketStreamWorker` and `BinanceMarketStreamWorker`
    by the same `exchange` value.
- Screenshots/logs:
  - no UI screenshots; no UI changed
- High-risk checks:
  - no secrets used
  - no production actions
  - no live-money actions

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/exchange-access-ownership-matrix.md`
  - `docs/modules/api-market-stream.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert the small worker config extraction and test commit
- Observability or alerting impact: none
- Staged rollout or feature flag: existing `MARKET_STREAM_EXCHANGE=GATEIO`
  opt-in remains the rollout switch
- Post-push production check:
  - `node scripts\waitForWebBuildInfo.mjs --web-base-url https://soar.luckysparrow.ch --expected-sha 9382d931 --timeout-seconds 180 --interval-seconds 15` => PASS
  - `node scripts\deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` => PASS
  - production build-info exposed
    `9382d9317a5ae82d404559398922a253bef9e697`

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: worker source selection lived inline in the bootstrap and was not
  directly regression-tested.
- Gaps: production target worker evidence remains separate.
- Inconsistencies: none found.
- Architecture constraints: runtime market events must enter through approved
  stream/polling adapters and canonical fanout.

### 2. Select One Priority Task
- Selected task: lock market-stream worker source selection.
- Priority rationale: this protects the Gate.io adapter rollout boundary before
  paper pricing is enabled.
- Why other candidates were deferred: protected V1 release evidence still
  requires auth/approval inputs unavailable in this shell.

### 3. Plan Implementation
- Files or surfaces to modify: worker bootstrap config and focused test.
- Logic: parse env into a narrow worker config with default Binance behavior.
- Edge cases: invalid exchange, invalid market type, invalid timing values,
  and empty CSV env values.

### 4. Execute Implementation
- Implementation notes: extracted pure config resolver and reused it in the
  existing worker bootstrap.

### 5. Verify and Test
- Validation performed: focused worker/market-stream tests and API typecheck.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: only add docs.
- Technical debt introduced: no
- Scalability assessment: future exchange stream sources can extend this
  resolver without changing the bootstrap side effects.
- Refinements made: kept the resolver pure so tests do not import the live
  worker bootstrap.

### 7. Update Documentation and Knowledge
- Docs updated: market-stream module doc, task, queue/context state.
- Context updated: yes.
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

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: operator preparing Gate.io rollout
- Existing workaround or pain: source selection was implicit in worker
  bootstrap and harder to test safely.
- Smallest useful slice: pure config resolver plus regression tests.
- Success metric or signal: focused tests pass.
- Feature flag, staged rollout, or disable path: existing env opt-in
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: market-stream source selection for runtime pricing
- SLI: worker config regression pass/fail
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: not changed
- Logs, dashboard, or alert route: not changed
- Smoke command or manual smoke: focused Vitest pack
- Rollback or disable path: leave `MARKET_STREAM_EXCHANGE` unset for Binance
  default behavior

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: public market data configuration
- Trust boundaries: env-configured worker source to approved exchange adapter
- Permission or ownership checks: not applicable
- Abuse cases: unsupported exchange env must not start an unintended source
- Secret handling: no secrets used
- Security tests or scans: repository guardrails PASS
- Fail-closed behavior: unsupported exchange values select the existing
  Binance default instead of a partial unsupported adapter
- Residual risk: production target-source evidence is still required before
  Gate.io `PAPER_PRICING_FEED` can be enabled.

## Result Report
- Task summary: locked market-stream worker config selection behind a tested
  pure resolver.
- Files changed: worker config, worker bootstrap, focused test, and context
  docs.
- How tested: focused worker/market-stream Vitest pack, API typecheck,
  repository guardrails, docs parity, and diff check.
- What is incomplete: Gate.io paper/live/authenticated support remains
  disabled; target environment worker evidence for `MARKET_STREAM_EXCHANGE=GATEIO`
  remains required before `PAPER_PRICING_FEED`.
- Next steps: wait for deploy/source evidence or add the next exact capability
  gate once operator inputs are available.
- Decisions made: no new product decisions.
