# SOPR Parity Matrix (2026-04-19)

Status: PASS  
Wave: `SOPR` (`SOPR-02..SOPR-12`)

## Scope
- Selected-bot signal-context source-of-truth and fallback safety.
- `/dashboard` vs `/dashboard/bots/:id/preview` parity for selected-bot signals/positions/history.
- Runtime no-open diagnostics visibility for blocked/ignored outcomes.
- Manual-order semantics closure (`order-only` contract).

## Matrix

| ID | Area | Contract | Result | Evidence |
| --- | --- | --- | --- | --- |
| `SOPR-SIGNALS-SCOPE` | Signals | Selected-bot signal context is scope-locked; no cross-bot fallback leakage | PASS | `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`, `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` |
| `SOPR-HOME-PREVIEW-PARITY` | Signals/Positions/History | `/dashboard` and `/dashboard/bots/:id/preview` remain parity-aligned for the same selected bot | PASS | `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.preview-parity.test.tsx` |
| `SOPR-NO-OPEN-DIAGNOSTICS` | Runtime diagnostics | Blocked/ignored no-open outcomes are explicitly visible in operational payload counters/log paths | PASS | `apps/api/src/modules/engine/runtimeFinalCandleDecision.service.test.ts`, `apps/api/src/modules/bots/bots.runtime-history-parity.e2e.test.ts` |
| `SOPR-MANUAL-ORDER-SEMANTICS` | Manual order | Manual order is an explicit order-only path with audit-safe semantic metadata | PASS | `apps/api/src/modules/orders/orders.service.test.ts`, `apps/api/src/modules/orders/orders-positions.e2e.test.ts`, `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` |

## Manual-Order Decision Outcome
- Chosen path: `order-only` (no implicit runtime-orchestrator lifecycle authority on `POST /dashboard/orders/open`).
- Operator-facing clarity:
  - dashboard manual-order copy explicitly communicates `order-only` semantics;
  - runtime/sidebar keeps semantic hint visible;
  - audit metadata records semantic path (`order_only`) and lifecycle authority boundary (`runtime_or_fill_sync`).

## Artifact
- JSON snapshot: `docs/operations/_artifacts-sopr-parity-matrix-2026-04-19.json`.
