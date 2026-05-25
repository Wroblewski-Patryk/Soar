# Production Architecture Convergence Master Plan (Binance + Gate.io)

Date: 2026-05-24  
Status: IN_PROGRESS  
Owner: Coordinator (active chat)  
Mission: `SOAR-FULL-READINESS-COORDINATION-2026-05-23`

## 1) Why this exists

Goal is not "more fixes". Goal is deterministic production behavior aligned with architecture contracts across:

- Web runtime UX (`/dashboard`, `#positions`, `#orders`)
- API/runtime execution lifecycle
- Exchange adapters (Binance + Gate.io)
- Data persistence and reconciliation
- Deployment/operations reliability

This plan defines one closed loop:

`audit -> classify gaps -> implement by risk order -> verify -> deploy -> re-verify in production -> close`

No claim of "done" without evidence per function.

## 2) Scope and non-negotiable rules

### In scope

- Runtime position management semantics: `DCA`, `TP/SL`, `TTP/TSL`, `marginUsed`, close reasons.
- Runtime aggregate/dashboard stability (no disappearing data, no intermittent 502).
- Manual/runtime order and position lifecycle truth for Binance + Gate.io.
- Production reliability gates (health, readiness, worker readiness, deploy freshness).
- UI/API parity for operator-critical surfaces.

### Out of scope (for this mission)

- New feature invention not required by architecture parity.
- Native mobile implementation.
- AI hot-path trading expansion.

### Hard rules

- No live-money mutation without explicit operator approval and hard risk cap.
- No workaround paths that diverge from architecture contracts.
- No "verified" status without reproducible evidence.

## 3) Critical architecture contracts to enforce

Primary references:

- `docs/architecture/reference/position-management-pnl-lifecycle-contract.md`
- `docs/architecture/reference/live-protection-state-parity-contract.md`
- `docs/architecture/reference/position-lifecycle-parity-matrix.md`
- `docs/architecture/reference/runtime-execution-idempotency-contract.md`
- `docs/architecture/reference/dashboard-route-map.md`

Contract checkpoints:

1. DCA-first guard is consistent across runtime/backtest/live.
2. `TTP/TSL` never displayed stronger than runtime truth.
3. Exchange-synced margin/PnL truth drives live DCA/protection decisions where available.
4. Deduped execution state is idempotent and lifecycle-safe.
5. Dashboard runtime aggregate degrades safely (stale snapshot > 5xx blanking).

## 4) Execution stages

## Stage A — Baseline audit and evidence map (no live mutation)

### Deliverables

- Function-by-function PASS/FAIL matrix (Binance + Gate.io).
- Repro matrix for intermittent failures (frequency, endpoint, symptoms).
- Gap classification:
  - P0: money/risk integrity
  - P1: operator trust/availability
  - P2: UX/doc consistency

### Checks

- Auth/session: login, refresh, timeout/expired behavior.
- Runtime aggregate: repeated reads under load (stability and latency).
- Dashboard data surfaces: bots, runtime positions/orders snapshots.
- API lifecycle endpoints: orders/positions/bots monitoring.
- Health/readiness/build-info freshness consistency.

### Exit criteria

- Every critical function has explicit status: `PASS`, `FAIL`, `FLAKY`, or `BLOCKED`.

---

## Stage B — P0 money-flow and lifecycle correctness

### Target defects

- Wrong close reason/state transitions.
- DCA/TSL/TTP gating mismatch.
- Exchange-specific quantity/notional/margin drift.
- Inconsistent ownership/reconciliation truth for imported `EXCHANGE_SYNC`.

### Implementation pattern

For each P0 defect:

1. Add failing test first (unit/e2e where applicable).
2. Fix in canonical module boundary.
3. Re-run focused pack + typecheck.
4. Run adjacent regression pack.
5. Update architecture-linked evidence notes.

### Exit criteria

- All P0 rows move to `VERIFIED` or explicit `BLOCKED` with reason outside code.

---

## Stage C — P1 reliability and observability hardening

### Target defects

- Runtime aggregate intermittently failing (502/timeout), dashboard blanking.
- Session instability under repeated reads.
- Worker/ready mismatch vs user-visible runtime states.

### Required hardening

- Safe degradation (`stale-while-revalidate`) for runtime aggregate reads.
- Response-time and failure telemetry for aggregate/service edges.
- Deploy/worker readiness consistency checks in smoke pipeline.

### Exit criteria

- Repeated production read suite stable in target window.
- No user-facing "disappearing data" behavior in monitored runs.

---

## Stage D — P2 frontend and route parity cleanup

### Target

- Remove obsolete route surfaces and stale IA/doc drift.
- Keep runtime operation surfaces only where canonical (`/dashboard`, `#positions`, `#orders`, profile `#api`).

### Exit criteria

- Route map, module docs, and implementation match.
- No stale references in active canonical docs for removed surfaces.

---

## Stage E — Production verification and controlled live proof

### Preconditions

- Stage A-D pass for all P0/P1 and required P2 parity.
- Operator authorization for any live mutation:
  - allowed actions
  - max risk per test
  - exchanges and symbols

### Execution

1. Read-only production verification pass.
2. Controlled minimal live mutation (if approved) with strict rollback plan.
3. Post-action reconciliation proof:
   - exchange state
   - local orders/positions/trades
   - dashboard read-model parity

### Exit criteria

- Final PASS packet with evidence per critical function.

## 5) Function-level acceptance checklist (must all be explicit)

For each function below: `PASS/FAIL`, evidence link, residual risk.

1. Bot runtime session visibility (Binance + Gate.io).
2. Runtime positions snapshot correctness (`marginUsed`, `unrealizedPnl`, actionable).
3. Runtime orders snapshot correctness (state transitions, no phantom status).
4. DCA trigger and level progression.
5. TTP/TSL arming and close semantics.
6. Manual order context (quantity/notional/margin truth per exchange).
7. Manual open/cancel/close flows and fail-closed guards.
8. Imported exchange position reconciliation and ownership.
9. Runtime aggregate stability under repeated reads.
10. Dashboard continuity (no disappearing data/blank frames).
11. Health/readiness/build-info and worker readiness coherence.
12. Restart/reload persistence behavior.

## 6) Validation protocol per change

For each code change:

1. Focused tests for changed module.
2. Adjacent regression tests.
3. Typecheck/lint/guardrails.
4. Production read-only verification.
5. Evidence write-up in history artifacts and state ledgers.

No merge-to-done without all five.

## 7) Risk management and rollback

### High-risk categories

- Live money mutation.
- Lifecycle close logic.
- Exchange adapter sizing/rules.
- Runtime aggregate availability.

### Rollback rule

If any P0 regression appears in production verification:

- stop rollout,
- revert to last verified commit,
- rerun smoke and reconciliation checks,
- reopen row in confidence ledger as `BROKEN`.

## 8) Definition of complete ("ready to earn")

System is treated as commercially ready only when:

- all P0 and P1 functions above are `PASS` with fresh production evidence,
- no intermittent 5xx/timeout pattern in runtime-critical reads within verification window,
- architecture parity holds across API/runtime/UI for positions/orders lifecycle,
- operator can execute daily workflow without workaround paths.

Until then: `IN_PROGRESS`.

## 9) Next immediate checkpoint (already queued)

1. Build full Stage A PASS/FAIL matrix from current production.
2. Lock top 3 reproducible failures by severity.
3. Execute first P0 closure loop end-to-end with proof and deploy recheck.
