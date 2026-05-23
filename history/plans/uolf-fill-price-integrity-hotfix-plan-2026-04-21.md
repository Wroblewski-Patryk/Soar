# UOLF Fill-Price Integrity Hotfix Plan (2026-04-21)

Status: Closed (2026-04-21)
Owner: Execution agent
Scope: `UOLF` regression hotfix for runtime/dashboard position correctness

## 1. Context
- Production regression showed open positions with `entryPrice=0` and broken table metrics in:
  - `/dashboard` runtime tables,
  - `/dashboard/bots/:id/preview` monitoring tables.
- Root cause was an unresolved fill-price path in unified lifecycle handling:
  - `MARKET` order could become `FILLED` without a resolved positive fill price,
  - lifecycle created position rows with invalid entry semantics.

## 2. Scope Lock
- In scope:
  - fill-price integrity hardening in API order lifecycle,
  - runtime command propagation of `markPrice` into `openOrder` command payload,
  - dashboard manual-order payload fallback for `MARKET` price,
  - focused regression tests and deploy gates.
- Out of scope:
  - historical DB backfill/migration of already broken rows,
  - UI redesign or unrelated runtime architecture refactors.

## 3. Execution Plan
1. `UOLF-HF-A` backend lifecycle hardening:
   - disallow opening position when positive fill price is unresolved,
   - prevent `entryPrice=0` position creation path.
2. `UOLF-HF-B` price propagation parity:
   - pass runtime `markPrice` to order-open command for OPEN/CLOSE/DCA flows,
   - pass dashboard reference price for `MARKET` manual orders when explicit price input is empty.
3. `UOLF-HF-C` regression and deploy safety:
   - update/add focused API+web tests for new contract,
   - run `api/web` typecheck + build + guardrails before commit.

## 4. Acceptance Criteria
- No new position can be created with `entryPrice <= 0` through unified order-fill lifecycle.
- Runtime bot `MARKET` opens/closes and DCA paths submit price-aware order-open payload.
- Dashboard manual `MARKET` submit uses explicit or reference price and no longer relies on zero-price fallback.
- Focused tests and deploy-critical gates pass.

## 5. Evidence (PASS)
- `pnpm --filter api run test -- --run src/modules/orders/orders.service.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/orders/orders-positions.e2e.test.ts`
- `pnpm --filter web run test -- --run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
- `pnpm --filter api run typecheck`
- `pnpm --filter web run typecheck`
- `pnpm --filter api run build`
- `pnpm --filter web run build`
- `pnpm run quality:guardrails`
