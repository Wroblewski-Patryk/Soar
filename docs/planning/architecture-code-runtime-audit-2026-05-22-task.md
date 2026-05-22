# Architecture-Code Runtime Audit Task

## Header
- ID: `ARCH-CODE-RUNTIME-AUDIT-2026-05-22`
- Title: Coordinate architecture-vs-code audit for runtime trading contracts
- Task Type: research
- Current Stage: verification
- Status: REVIEW
- Owner: Planning Agent
- Depends on: `RUNTIME-ARCHITECTURE-DCA-TP-PARITY-2026-05-22`
- Priority: P0
- Module Confidence Rows: `SOAR-BOT-RUNTIME-001`, `SOAR-ENGINE-001`, `SOAR-BACKTESTS-001`, `SOAR-ORDERS-001`, `SOAR-OPERATIONS-001`
- Requirement Rows: runtime lifecycle parity, fill authority, idempotency, split-worker topology, runtime context ownership
- Quality Scenario Rows: live-trading safety, runtime/backtest parity, deployment readiness, regression resistance
- Risk Rows: architecture drift in money-path runtime behavior, misleading operator status, unsafe runtime actionability
- Iteration: 2026-05-22 architecture-code runtime audit
- Operation Mode: ARCHITECT
- Mission ID: `ARCH-CODE-RUNTIME-AUDIT-2026-05-22`
- Mission Status: CHECKPOINTED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the architecture audit slice.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was represented through the active mission packet.
- [x] Missing or template-like state tables were not found for this checkpoint.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence by searching for remaining architecture drift in money-path runtime behavior.

## Mission Block
- Mission objective: coordinate a broad architecture-vs-code audit after confirmed DCA close-gate drift and identify any remaining runtime trading contract mismatches.
- Release objective advanced: safer bot behavior by aligning runtime, backtest, order/fill, and operations surfaces to canonical architecture.
- Included slices: runtime lifecycle, exchange/order fill authority, backtest/report parity, operations/deployment topology.
- Explicit exclusions: production mutation, live exchange mutation, raw secret handling, broad UI redesign, and unapproved architecture rewrites.
- Checkpoint cadence: record each confirmed mismatch as a finding with source contract, code evidence, risk, and smallest fix/test.
- Stop conditions: architecture contradiction requiring user decision, production-only proof requiring unavailable access, or any live-money mutation.
- Handoff expectation: if findings are confirmed, select the highest P0/P1 local fix as the next implementation slice.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | `AGENTS.md`, `.agents/state/active-mission.md`, `.codex/context/TASK_BOARD.md` | Integration, task closure, source-of-truth updates | Mission packet and integrated findings | Parent review gate | CHECKPOINTED |
| Runtime lifecycle | Explorer lane | runtime lifecycle architecture refs | `apps/api/src/modules/engine`, `apps/api/src/modules/bots` | 2 P1 and 2 P2 findings; DCA gates confirmed aligned | File/line evidence | COMPLETE |
| Orders/exchange | Explorer lane | fill/idempotency/protection contracts | `apps/api/src/modules/orders`, exchange/runtime boundaries | 2 P0, 2 P1, 1 P2 findings; both P0 repaired locally | Unit tests | CHECKPOINTED |
| Backtest/report parity | Explorer lane | signal/lifecycle parity contracts | `apps/api/src/modules/backtests`, reports | 3 P1 and 1 P2 findings | File/line evidence | COMPLETE |
| Ops/deploy topology | Explorer lane | topology and operations contracts | workers, readiness, deploy scripts/docs | 4 P1 and 2 P2 findings | File/line evidence | COMPLETE |
| Documentation/Memory | Coordinator | Project state and ledgers | state docs and task artifact | Durable audit result and next action | Guardrails/diff check if edited | IN_PROGRESS |

### Lane Checks
- [x] `.agents/state/active-mission.md` was refreshed for broad work.
- [x] `.agents/workflows/responsibility-lanes.md` was applied through explicit lanes.
- [x] Every important responsibility from source docs has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry; explorers are read-only.
- [x] Each lane has expected output and validation/proof.
- [x] Missing or unclear ownership was recorded in `.agents/state/responsibility-learning.md` if discovered.
- [ ] Process eval will be recorded in `.agents/state/agent-evals.md` after the broad/subagent-heavy checkpoint closes.

## Context
The operator reported recurring bot behavior defects and asked to coordinate a check that code still reflects the large architecture set under `docs/architecture`. A prior checkpoint fixed confirmed DCA close-gate drift for `TP`/`TTP` and `SL`/`TSL`; this task broadens the audit to remaining runtime trading contracts.

## Goal
Produce an evidence-backed list of remaining architecture/code mismatches and fix confirmed safe local P0/P1 mismatches discovered during this checkpoint.

## Success Signal
- User or operator problem: bot and production runtime behavior diverge from documented intent.
- Expected product or reliability outcome: remaining architecture drift is either disproved with evidence or converted into concrete repair tasks.
- How success will be observed: findings include contract source, code source, risk, and smallest fix/test, with local fixes validated before commit.
- Post-launch learning needed: yes.

## Deliverable For This Stage
An integrated architecture-vs-code findings table for the four lanes, plus a selected next implementation slice if a confirmed P0/P1 mismatch exists.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new architecture structures
- do not run live-money or production mutation
- do not treat production timeout as code proof
- do not fix speculative mismatches without file/line evidence

## Definition of Done
- [ ] Runtime lifecycle lane output integrated.
- [ ] Orders/exchange lane output integrated.
- [ ] Backtest/report parity lane output integrated.
- [ ] Ops/deploy topology lane output integrated.
- [ ] Confirmed findings are ranked and converted to next action or fixed.
- [ ] State files are updated with evidence and residual risk.

## Stage Exit Criteria
- [ ] The output matches the declared `analysis` stage or explicitly advances to implementation for a confirmed local fix.
- [ ] Work from later stages was not mixed in without a confirmed finding.
- [ ] Risks and assumptions for this stage are stated clearly.

## Forbidden
- live exchange mutation
- raw secret capture
- production destructive operations
- speculative rewrites
- workaround-only fixes

## Integrated Findings

| ID | Priority | Lane | Finding | Status | Evidence / next action |
| --- | --- | --- | --- | --- | --- |
| `ARCH-RUNTIME-P0-001` | P0 | Orders/exchange | Stale `PENDING` runtime dedupe without linked order could reset to `execute`, allowing duplicate LIVE side effects after crash/retry. | FIXED_LOCALLY | `runtimeExecutionDedupe.service.ts` now keeps stale unproven pending commands `inflight`; unit regression added. |
| `ARCH-RUNTIME-P0-002` | P0 | Orders/exchange | LIVE `FILLED` without exchange fill quantity synthesized full fill from requested quantity and could advance lifecycle without fill truth. | FIXED_LOCALLY | `orders.service.ts` now keeps such LIVE responses pending/open; LIVE fill lifecycle no longer uses request price as fill price. |
| `ARCH-RUNTIME-P1-001` | P1 | Runtime lifecycle | LIVE read model may show dynamic TTP from `strategy_fallback` without canonical runtime protection state. | FIXED_LOCALLY | Imported `EXCHANGE_SYNC` positions now require canonical runtime state before dynamic strategy fallback can be displayed; plan levels may still be shown. |
| `ARCH-RUNTIME-P1-002` | P1 | Runtime lifecycle / orders | `ACCOUNT_UPDATE` scope may update the only matching position by `userId+symbol+side` without wallet/api-key source proof. | OPEN | Requires normalized stream source identity or explicit no-op when source is absent. |
| `ARCH-RUNTIME-P1-003` | P1 | Orders/exchange | LIVE retry submit path does not pass canonical `clientOrderId` through exchange boundary. | OPEN | Needs adapter-bound idempotent client order id from dedupe/fingerprint. |
| `ARCH-RUNTIME-P1-004` | P1 | Orders/exchange | `ACCOUNT_UPDATE quantity=0` can close a position without materialized close fill/trade/PnL truth. | OPEN | Needs recovery/close-pending or proven fill materialization. |
| `ARCH-RUNTIME-P1-005` | P1 | Backtest parity | Backtest candle gateway filters by `openTime <= endTime` instead of closed-candle `closeTime <= endTime`. | FIXED_LOCALLY | Gateway fetch and DB cache now use `closeTime <= endTime`; regressions cover network and DB-cache paths. |
| `ARCH-RUNTIME-P1-006` | P1 | Backtest parity | Backtest request path is single-strategy and does not implement runtime signal merge for multi-strategy bot parity. | OPEN | Product/architecture decision or implementation slice required. |
| `ARCH-RUNTIME-P1-007` | P1 | Reports | Reports count trades with `realizedPnl = null` as completed zero-PnL trades. | FIXED_LOCALLY | PAPER/LIVE report aggregation now counts only settled realized-PnL trades. |
| `ARCH-RUNTIME-P1-008` | P1 | Ops/deploy | Deploy smoke can pass on `/workers/health` even when topology is degraded. | FIXED_LOCALLY | Deploy smoke now probes `/workers/ready` and fails degraded/not-ready worker payloads. |
| `ARCH-RUNTIME-P1-009` | P1 | Ops/deploy | `docker-compose.vps.yml` does not fully encode canonical split worker env/Dockerfile ownership. | FIXED_LOCALLY | VPS compose now defaults to split worker mode, explicit worker ownership/queues, and dedicated worker Dockerfiles. |
| `ARCH-RUNTIME-P1-010` | P1 | Ops/deploy | Backtest worker entrypoint does not own durable backtest queue consumption. | OPEN | Needs durable queue/consumer or architecture narrowing. |
| `ARCH-RUNTIME-P1-011` | P1 | Ops/deploy | `/workers/ready` does not prove live worker process heartbeat across containers. | OPEN | Move heartbeat to Redis/DB and make readiness check required worker families. |
| `ARCH-RUNTIME-P1-012` | P1 | Ops/deploy | `/ready` did not check Postgres/Prisma reachability. | FIXED_LOCALLY | Runtime dependency readiness now includes bounded database `SELECT 1` with protected details diagnostics. |
| `ARCH-RUNTIME-P1-013` | P1 | Ops/deploy | Rollback proof did not include `/workers/ready`. | FIXED_LOCALLY | Rollback guard now checks `/workers/ready` before runtime freshness and alerts. |

## Validation Evidence
- Tests:
  - `corepack pnpm --filter api exec vitest run src/modules/backtests/backtestDataGateway.test.ts src/modules/reports/reports.service.test.ts src/modules/bots/runtimeSessionPositionsRead.service.test.ts src/modules/bots/bots.runtime-strategy-context.e2e.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/engine/runtimeExecutionDedupe.service.test.ts src/modules/orders/orders.service.test.ts --run --sequence.concurrent=false` => PASS, `88/88`
  - `corepack pnpm --filter api exec vitest run src/router/health-readiness.test.ts src/modules/backtests/backtestDataGateway.test.ts src/modules/reports/reports.service.test.ts --run --sequence.concurrent=false` => PASS, `20/20`
  - `node --check scripts/deploySmokeCheck.mjs; node --check scripts/evaluateRollbackGuard.mjs` => PASS
  - `docker compose -f docker-compose.vps.yml config` with required dummy env => PASS
- Manual checks: architecture/code lane inspection completed by four read-only explorer lanes and coordinator spot checks.
- Screenshots/logs: not applicable
- High-risk checks: no production or live exchange mutation authorized
- Module confidence ledger updated: pending
- Module confidence rows closed or changed: pending
- Requirements matrix updated: not applicable for initial audit
- Quality scenarios updated: not applicable for initial audit
- Risk register updated: pending if new risks are confirmed
- Reality status: partially verified; local runtime/order/backtest/report/readiness fixes are focused-test verified. Remaining open findings are account-update scoping, live retry client-order id, account-update close materialization, backtest multi-strategy merge parity, backtest `TRAILING`/`TSL` event naming, durable backtest queue ownership, and cross-container worker heartbeat proof.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/02_system-topology.md`
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/05_strategy-signal-and-decision-flow.md`
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/reference/runtime-execution-idempotency-contract.md`
  - `docs/architecture/reference/live-position-restart-continuity-contract.md`
  - `docs/architecture/reference/execution-lifecycle-parity-contract.md`
  - `docs/architecture/reference/position-management-pnl-lifecycle-contract.md`
- Fits approved architecture: yes for the two local P0 fixes.
- Mismatch discovered: yes.
- Decision required from user: no for local P0 fixes; yes or follow-up planning may be needed for multi-strategy backtest parity and durable worker queue ownership.
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none planned unless implementation truth contradicts approved architecture

## Deployment / Ops Evidence
- Deploy impact: high for P0 runtime/order safety fixes
- Env or secret changes: none
- Health-check impact: pending
- Smoke steps updated: no
- Rollback note: not applicable until implementation
- Observability or alerting impact: pending
- Staged rollout or feature flag: pending

## Autonomous Loop Evidence

### 1. Analyze Current State
- A confirmed DCA close-gate drift was repaired immediately before this task.
- Production public endpoints timed out after the last push, so production readback remains separate.

### 2. Select One Priority Mission Objective
- Selected objective: architecture-vs-code runtime audit across money-path contracts.

### 3. Plan Implementation
- Use read-only explorer lanes for separable architecture slices.
- Keep coordinator responsible for integration and final fix selection.

### 4. Execute Implementation
- Repaired `ARCH-RUNTIME-P0-001`: stale unproven runtime execution dedupe remains `inflight` instead of allowing duplicate side-effect execution.
- Repaired `ARCH-RUNTIME-P0-002`: LIVE `FILLED` without exchange fill quantity no longer synthesizes a fill or advances lifecycle; LIVE lifecycle no longer uses request price as fill price.
- Repaired safe local P1s: dynamic strategy fallback display for imported LIVE rows, closed-candle backtest gateway windowing, settled-only report aggregation, deploy smoke worker readiness, VPS split-worker compose defaults, API DB readiness, and rollback worker-readiness proof.

### 5. Verify and Test
- Focused API packs passed `88/88` and readiness/backtest/report pack passed `20/20`; script syntax checks and VPS compose config passed. Local Postgres/Redis were started through repo infra after confirming Laragon/MySQL alone did not provide Postgres.

### 6. Self-Review
- The P0 fixes are fail-closed and reuse existing services/tests. They do not add workaround paths or architecture changes.

### 7. Update Documentation and Knowledge
- This task artifact records all lane findings and local P0 remediation.
