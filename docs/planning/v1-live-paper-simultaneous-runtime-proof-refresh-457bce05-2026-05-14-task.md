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
deployed candidate and close the production non-Gate.io simultaneous runtime
evidence gap without hiding the deferred Gate.io/second-LIVE production shape.

### Scope

- Local DB-backed API/runtime regression for 2x PAPER + Binance LIVE + Gate.io
  LIVE coexistence.
- Local Dashboard Home selected-bot/runtime table regression for the same
  shape.
- Production deploy freshness identity for `457bce05`.
- Controlled production Binance LIVE activation only while no-order guard is
  active, with automatic cleanup.
- Production read-only simultaneous PAPER+LIVE runtime readback during the LIVE
  observation window.
- No exchange order action.

### Implementation Plan

1. Verify production build-info still reports `457bce05`.
2. Rerun focused API LIVE/PAPER isolation tests.
3. Rerun focused Web Dashboard selected-bot/runtime table tests.
4. Run controlled no-order-guard LIVE proof for the existing Binance LIVE bot.
5. Collect simultaneous production read-only PAPER+LIVE runtime readback before
   the controlled runner deactivates the LIVE bot.
6. Collect a post-cleanup readback proving the LIVE bot is inactive again.
7. Record the result in planning, state, requirements, risks, and module
   confidence.

### Acceptance Criteria

- API tests prove the 2x PAPER + Binance LIVE + Gate.io LIVE local runtime
  shape remains isolated by mode, wallet, API key, exchange, and market type.
- Web tests prove the dashboard selector and selected runtime rows re-scope
  across the same representative bot modes.
- Production build-info identity is fresh for `457bce05`.
- Production readback proves the existing Binance LIVE bot and both Binance
  PAPER bots expose simultaneous runtime state in the same observation window.
- Post-cleanup readback proves the controlled LIVE bot is inactive again.
- Deferred Gate.io/second-LIVE production shape is not hidden.

### Definition Of Done

- Exact commands and results are recorded.
- No secrets are stored in repository artifacts.
- No LIVE orders are attempted.
- The only production write is the guarded temporary LIVE bot activation and
  deactivation performed by `runControlledLiveSessionProof.mjs`.
- Source-of-truth files are updated.

### Forbidden

- Do not place LIVE orders.
- Do not claim full V1 LIVE/PAPER production proof without authenticated
  production runtime/action evidence.
- Do not treat local component rendering as a substitute for production
  protected readback.

## Result Report

Status: `verified for production non-Gate.io simultaneous LIVE/PAPER runtime`.

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
- PASS:
  `node scripts/runControlledLiveSessionProof.mjs --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 457bce05338310c198c03a973395a9176f298dc1 --symbols TRXUSDT --output docs/operations/liveimport-03-prod-readback-live-paper-457bce05-2026-05-14.json --simultaneous-readback-output-json docs/operations/_artifacts-prod-live-paper-simultaneous-runtime-readback-457bce05-2026-05-14.json --simultaneous-readback-output-md docs/operations/prod-live-paper-simultaneous-runtime-readback-457bce05-2026-05-14.md --poll-seconds 180 --dry-run`
  -> printed a redacted plan and did not activate LIVE.
- PASS:
  `node scripts/runControlledLiveSessionProof.mjs --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 457bce05338310c198c03a973395a9176f298dc1 --symbols TRXUSDT --output docs/operations/liveimport-03-prod-readback-live-paper-457bce05-2026-05-14.json --simultaneous-readback-output-json docs/operations/_artifacts-prod-live-paper-simultaneous-runtime-readback-457bce05-2026-05-14.json --simultaneous-readback-output-md docs/operations/prod-live-paper-simultaneous-runtime-readback-457bce05-2026-05-14.md --poll-seconds 180 --i-understand-live-risk`
  -> build-info matched `457bce05`, no-order guard was active
  (`globalKillSwitch=true`, `emergencyStop=true`, `active=true`), target LIVE
  Binance Futures bot activated only for the observation window, LIVEIMPORT
  readback passed for `TRXUSDT`, simultaneous PAPER+LIVE runtime readback
  returned `PASS`, and the runner deactivated the LIVE bot in cleanup.
- PASS:
  `node scripts/collectNonGateioRuntimeReadback.mjs` with
  `NON_GATEIO_READBACK_EXPECTED_SHA=457bce05338310c198c03a973395a9176f298dc1`
  and post-cleanup outputs
  `docs/operations/_artifacts-prod-live-paper-post-cleanup-readback-457bce05-2026-05-14.json`
  / `docs/operations/prod-live-paper-post-cleanup-readback-457bce05-2026-05-14.md`
  -> `paperPass=true`, `currentLiveRunning=false`.

Result:

- Local API/runtime and Web Dashboard regression evidence remains green after
  the latest adapter/runtime deploy.
- Production build-info is fresh for `457bce05`.
- Production non-Gate.io simultaneous LIVE/PAPER runtime proof is now verified:
  the controlled LIVE window had one Binance LIVE bot RUNNING and both Binance
  PAPER bots RUNNING with fresh runtime monitoring data in the same readback.
- `LIVEIMPORT-03` also passed for the LIVE bot's runtime-visible `TRXUSDT`
  position during that window.
- Post-cleanup readback proves the Binance LIVE bot returned to inactive state
  while both PAPER bots remained healthy.
- The missing production 2x LIVE/Gate.io shape remains deferred/out of scope
  for this slice rather than a hidden failure.
