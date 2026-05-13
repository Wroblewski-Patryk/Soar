# V1 LIVE/PAPER Simultaneous Runtime Proof Refresh - 457bce05 - 2026-05-14

## Task Contract

### Context

- Stage: verification
- Operation mode: TESTER
- The latest adapter/runtime candidate is deployed on production Web build-info
  as `457bce05338310c198c03a973395a9176f298dc1`.
- Protected production ops/runtime checks require approved admin/ops access and
  fail closed without it.
- The user asked to continue toward V1 and specifically challenged whether
  LIVE and PAPER bots can operate together correctly.

### Goal

Refresh the existing LIVE/PAPER simultaneous runtime proof against the latest
deployed candidate and keep the remaining production evidence gap explicit.

### Scope

- Local DB-backed API/runtime regression for 2x PAPER + Binance LIVE + Gate.io
  LIVE coexistence.
- Local Dashboard Home selected-bot/runtime table regression for the same
  shape.
- Production deploy freshness identity for `457bce05`.
- No production mutation, no LIVE activation, and no exchange order action.

### Implementation Plan

1. Verify production build-info still reports `457bce05`.
2. Rerun focused API LIVE/PAPER isolation tests.
3. Rerun focused Web Dashboard selected-bot/runtime table tests.
4. Record the result in planning, state, requirements, risks, and module
   confidence.

### Acceptance Criteria

- API tests prove the 2x PAPER + Binance LIVE + Gate.io LIVE local runtime
  shape remains isolated by mode, wallet, API key, exchange, and market type.
- Web tests prove the dashboard selector and selected runtime rows re-scope
  across the same representative bot modes.
- Production build-info identity is fresh for `457bce05`.
- Remaining production/protected evidence gaps are not hidden.

### Definition Of Done

- Exact commands and results are recorded.
- No secrets are stored in repository artifacts.
- No production writes or LIVE orders are attempted.
- Source-of-truth files are updated.

### Forbidden

- Do not activate production LIVE bots in this refresh.
- Do not place LIVE orders.
- Do not claim full V1 LIVE/PAPER production proof without authenticated
  production runtime/action evidence.
- Do not treat local component rendering as a substitute for production
  protected readback.

## Result Report

Status: `partially verified`.

Validation:

- PASS:
  `pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha 457bce05 --timeout-seconds 30 --interval-seconds 10`
  -> attempt 1 reported production build-info
  `457bce05338310c198c03a973395a9176f298dc1`.
- PASS:
  `pnpm --filter api run test -- src/modules/bots/bots.live-paper-concurrent.e2e.test.ts src/modules/bots/bots.duplicate-guard.e2e.test.ts src/modules/bots/bots.runtime-pnl-parity.e2e.test.ts src/modules/bots/runtimeMarketDataFallback.service.test.ts src/modules/bots/runtimeSessionPositionCommand.service.test.ts --run --sequence.concurrent=false`
  -> `5` files, `25/25` tests passed.
- PASS:
  `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.runtime-table-audit.test.tsx --run`
  -> `2` files, `24/24` tests passed.

Result:

- Local API/runtime and Web Dashboard regression evidence remains green after
  the latest adapter/runtime deploy.
- Production build-info is fresh for `457bce05`.
- Full production simultaneous LIVE/PAPER proof remains incomplete because the
  approved production inventory previously had 2 active PAPER bots, 1 inactive
  Binance LIVE bot, no visible LIVE Gate.io bot, and protected runtime/action
  checks require approved admin/ops access.
