# Capability Map

Last updated: 2026-05-25

## Purpose

Capture which product capabilities must be complete and proven before Soar is trusted for private-use sale/use cases. This map uses implementation evidence, test proof, and release-state constraints from canonical docs.

## Capability Hierarchy

```text
Capability -> Workflow -> Module -> Route/API -> Tests -> Evidence
```

## Readiness View (Sellable / Private-Use)

| Capability ID | Capability | Priority | Primary Workflow | Current Evidence | Acceptance Criteria | Status |
| --- | --- | --- | --- | --- | --- | --- |
| CAP-001 | Account and session control | P0 | Register, login, session lifecycle, logout/session rotation | `v1-auth-session-lifecycle-proof-task-2026-05-11`, `v1-auth-session-lifecycle-proof-2026-05-14`, `prod-auth-session-browser-proof-84711599-2026-05-14.md` | A user can create an account, authenticate, keep session scope isolated per user, refresh/expiry flow works, and logout invalidates session state including reused JWT/sessionVersion behavior. | implemented, verified (local + protected production proof at the time collected; production hash freshness is environment-dependent) |
| CAP-002 | Exchange connectivity and API-key stewardship | P0 | Add API key, run probe, persist encrypted secret material, protect visibility | `v1-exchange-adapter-local-proof-task-2026-05-11`, `v1-profile-api-keys-local-proof-task-2026-05-11`, `prod-security-exchange-proof-84711599-2026-05-14.md` | A private operator can attach an exchange safely with encrypted storage, protected list/read behavior, key probe/reuse checks, and fail-closed catalog/probe handling for unsupported/invalid providers. | implemented, verified (local + production security/exchange read-only proof) |
| CAP-003 | Strategy authoring and market-rule context | P0 | Create/edit strategy, validate rule schema and risk controls, attach presets | `v1-strategies-local-proof-task-2026-05-11` | Strategy JSON (entry/exit/risk/rules/timeframes), presets, and indicator settings can be created/edited/validated and remain tied to owned resources; invalid rules and invalid import shapes are blocked. | implemented, verified (local) |
| CAP-004 | Market universe + strategy binding | P0 | Build market groups, bind symbols, enforce active bot scope | `v1-markets-local-proof-task-2026-05-11`, `v1-bots-action-audit-task-2026-05-10` | A user can define symbol sets, resolve catalog symbols, and bind them to bots with expected active-bot and ownership guards. | implemented, verified (local) |
| CAP-005 | Bot lifecycle and execution topology setup | P0 | Bot create/update/delete, wallet/market/strategy linkage, entitlement gates | `v1-bot-delete-active-confirmation-task-2026-05-11`, `v1-bot-runtime-completed-session-fixture-task-2026-05-11`, `v1-bot-runtime-paper-session-browser-proof-task-2026-05-11` | A bot has deterministic ownership context, supports paper/live mode transitions with explicit confirmation/risk constraints, and can be observed in a runtime session with wallet-mode context. | implemented, partially verified (local; production session proof is production-hash dependent) |
| CAP-006 | Backtest confidence loop before runtime risk | P0 | Run backtest, inspect report/replay, validate snapshots | `v1-backtests-local-proof-task-2026-05-11`, `v1-reports-local-proof-task-2026-05-11` | A strategy-market pair can be simulated, persisted as an immutable run snapshot, and reviewed through report timelines before enabling operational trust. | implemented, verified (local) |
| CAP-007 | Paper and live execution pathways | P0 | Manual order open/cancel/close + runtime automation in PAPER/LIVE with consent | `v1-manual-orders-local-proof-task-2026-05-11`, `v1-orders-local-proof-task-2026-05-11`, `v1-positions-local-proof-task-2026-05-11`, `v1-production-positions-proof-2fc90a08-2026-05-14` | Manual and automated execution follows pre-trade guards, requires consent for LIVE operations, blocks unauthorized transitions, and updates order/position state coherently across UI and API. | implemented, partially verified (local + production positions proof; full safe LIVE mutation path remains approval-gated) |
| CAP-008 | Monitoring and operation safety telemetry | P0 | Dashboard runtime read/controls, bot runtime aggregate telemetry, logs/audit trace | `v1-dashboard-home-runtime-session-fixture-task-2026-05-11`, `v1-dashboard-home-browser-proof-task-2026-05-11`, `v1-dashboard-runtime-table-action-audit-task-2026-05-10`, `v1-logs-audit-local-proof-task-2026-05-11` | Operators can observe run-time state, inspect orders/positions, detect risk/consent boundaries, and review audit actions in a filtered trail. | implemented, partially verified (local with documented production-readiness blockers remaining) |
| CAP-009 | Wallet and capital visibility | P1 | Wallet create/edit/reset, exchange read path, cashflow and PnL decomposition | `v1-wallets-local-proof-task-2026-05-11`, `api-local-regression-sweep-2026-05-24` | Private-use operators can allocate wallets, reset/pause paper assets safely, inspect wallet/portfolio values, and keep execution capital source-of-truth aligned with exchange read boundaries. | implemented, verified (local) |
| CAP-010 | Subscription entitlements and plan gates | P1 | Apply account mode entitlements to bot/live behavior, plan-aware limits | `v1-post-v1-release-confidence-row-2026-05-14-task.md`, `.agents/state/module-confidence-ledger.md`, `.agents/state/requirements-verification-matrix.md` | Plan state changes are bounded by entitlement logic and visibly locked UI states, preventing unentitled live or plan-ineligible actions. | implemented, verified via module/release ledgers (runtime-heavy behaviors remain production-evidence-gated) |
| CAP-011 | Release and security evidence chain for private sale readiness | P0 | Guardrails, graph parity, module-confidence updates, protected proof readiness | `quality:guardrails`, `architecture:graph:generate`, `history/releases/v1-final-handoff-packet-2026-05-14.md` | A private deployment claim is allowed only when protected read/write evidence gates are fresh for the target hash and runtime stability is stable in SLO/RC observations. | blocked (V1 production readiness remains NO-GO until protected evidence gates reopen) |

## Top Product Workflows for Trustworthy Private Use

### Workflow 1: Onboard and Protect an Operator
- User can sign in/out and reset sensitive sessions predictably.
- Exchange credentials are captured with strict masking and encryption.
- Ownership boundaries and rate-limit/risk controls are active at auth/API edges.
- **Acceptance**: A newly provisioned account can authenticate, perform protected reads/writes where allowed, and prove failed/invalid edge requests remain fail-closed.
- **Evidence source(s)**: `history/evidence/v1-auth-session-lifecycle-proof-task-2026-05-11.md`, `history/evidence/v1-auth-session-lifecycle-proof-2026-05-14.md`, `history/evidence/v1-security-privacy-local-proof-task-2026-05-11.md`, production security artifact set.

### Workflow 2: Build a Controlled Trading Stack
- Configure strategies with risk constraints.
- Configure markets/universe and attach to bots.
- Start in PAPER mode, then move to LIVE only with explicit consent.
- **Acceptance**: Bot topology is deterministic, and illegal active transitions are blocked in both API and UI.
- **Evidence source(s)**: `history/evidence/v1-strategies-local-proof-task-2026-05-11.md`, `history/evidence/v1-markets-local-proof-task-2026-05-11.md`, bot action/audit proofs, strategy-to-bot setup paths.

### Workflow 3: Validate Before Money-Impact Execution
- Run backtests and review report outputs.
- Inspect order/position lifecycle behavior with risk gates.
- **Acceptance**: A strategy can move from simulation artifacts to run context without violating risk or ownership rules.
- **Evidence source(s)**: `history/evidence/v1-backtests-local-proof-task-2026-05-11.md`, `history/evidence/v1-orders-local-proof-task-2026-05-11.md`, `history/evidence/v1-positions-local-proof-task-2026-05-11.md`.

### Workflow 4: Run and Monitor Paper Trading
- Run automated signals and monitor runtime session outputs.
- Update runtime parameters, review health/signal trail, and close/adjust exposures.
- **Acceptance**: Paper runtime loops and dashboard tables remain coherent during active markets with stable symbol/order/position readback.
- **Evidence source(s)**: `history/evidence/v1-bot-runtime-paper-session-browser-proof-task-2026-05-11.md`, `history/evidence/v1-dashboard-home-runtime-session-fixture-task-2026-05-11.md`, `history/evidence/v1-dashboard-runtime-table-action-audit-task-2026-05-10.md`.

### Workflow 5: Control LIVE Exposure (When Approved)
- Manual open/cancel/close with explicit confirmation and risk acknowledgment.
- Exchange-safe execution boundaries with fail-closed handling.
- **Acceptance**: LIVE transitions are auditable, consented, and cannot bypass consent gates or ownership checks.
- **Evidence source(s)**: `history/evidence/v1-manual-orders-local-proof-task-2026-05-11.md`, `history/evidence/v1-orders-local-proof-task-2026-05-11.md`, `history/evidence/v1-production-positions-proof-2fc90a08-2026-05-14.md`.

## Current High-Risk Gaps (Priority for Readiness Closure)

1. `REQ-FUNC-021` remains production activation-blocked until protected SLO/RC and protected-input chain are fully reopened.
2. Runtime aggregate stability in production is the current blocker for claiming immediate READY despite local/runtime function fixes.
3. Production-safe, operator-approved LIVE mutation remains an explicit policy gate; proof paths must treat it as separate from local + mock proof.

## Maintenance Rule

When a workflow changes, update this capability map, requirements evidence row, and any affected proof matrix row in lockstep:
- `docs/product/capability-map.md` (this map)
- `docs/architecture/architecture-evidence-graph-system.md` when architecture contracts change
- `history/artifacts/*`, `history/evidence/*`, and `history/tasks/*` when proof changes
- `.agents/state/module-confidence-ledger.md` or `.agents/state/requirements-verification-matrix.md` when implementation/proof status changes
