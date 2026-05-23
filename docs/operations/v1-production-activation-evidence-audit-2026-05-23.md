# V1 Production Activation Evidence Audit (2026-05-23)

## Context
- Environment: production only for V1.
- API URL: `https://api.soar.luckysparrow.ch`
- Web URL: `https://soar.luckysparrow.ch`
- Public Web build-info SHA:
  `72b547e12351e078c49807fb25d56c27f64c6567`.
- Current final preflight:
  `docs/operations/v1-final-preflight-72b547e1-2026-05-23.md`.
- Current production UI clickthrough:
  `docs/operations/prod-ui-module-clickthrough-2026-05-23.md`.
- Current `LIVEIMPORT-03` runtime readback:
  `docs/operations/liveimport-03-prod-readback-2026-05-23.json`.
- Current rollback proof:
  `docs/operations/v1-rollback-proof-prod-2026-05-23T00-00-00-000Z.md`.
- Current restore drill:
  `docs/operations/v1-restore-drill-prod-2026-05-23T00-00-00-000Z.md`.
- Current SLO observation:
  `docs/operations/v1-slo-observation-2026-05-23T04-38-07-393Z.md`.
- Current RC external gates status:
  `docs/operations/v1-rc-external-gates-status.md`.
- Current RC sign-off record:
  `docs/operations/v1-rc-signoff-record.md`.
- Current RC checklist:
  `docs/operations/v1-release-candidate-checklist.md`.

## Evidence Reviewed
- Public production build-info: PASS, deployed Web SHA
  `72b547e12351e078c49807fb25d56c27f64c6567`.
- Production deploy smoke: PASS for `/health`, `/ready`, Web `/`, and
  authenticated `/workers/ready` after Coolify split-worker topology repair.
- Worker topology: PASS after production API was moved to `WORKER_MODE=split`
  and all required worker families reported fresh heartbeats.
- Production UI clickthrough: PASS for public, dashboard, admin, and legacy
  redirect route groups.
- `LIVEIMPORT-03`: FAIL. A running LIVE Binance Futures bot/session was found,
  but the required runtime readback had no open positions or orders for
  `ETHUSDT` and `DOGEUSDT`; both symbols were marked
  `MISSING_FROM_RUNTIME_READBACK`.
- Rollback proof: PASS with `shouldRollback=false`, fresh runtime checks, and
  no alerts.
- Production DB restore drill: PASS through the VPS Docker SSH context using
  the isolated restore-drill contract and no secret-bearing output.
- SLO observation: PASS for health/readiness/worker availability and 5xx/queue
  lag objectives; live order failure ratio remains `NO_DATA` because no live
  order attempts occurred in the observation window.
- RC external gates: PASS for Gates 1-4 with strict evidence check passing.

## Findings
- The deployed production build is current for the code commit under audit.
- Production service topology is materially healthier than the previous
  degraded inline-worker state.
- Protected UI, rollback, restore, SLO, and RC evidence are fresh for
  2026-05-23.
- V1 activation cannot be marked ready because the required `LIVEIMPORT-03`
  runtime readback did not prove an open runtime payload.
- The missing `LIVEIMPORT-03` proof must not be bypassed by marking DCA/SL/TSL
  behavior as executed without a corresponding runtime-visible action.

## Result
- Status: **NO-GO**
- Satisfied for 2026-05-23:
  - production public build-info readback
  - production public and authenticated smoke
  - split-worker production readiness
  - authenticated production UI clickthrough
  - production rollback proof
  - production DB restore drill
  - 30-minute production SLO observation, except live order ratio `NO_DATA`
  - RC external gates, sign-off, and checklist evidence
- Remaining blockers:
  - `LIVEIMPORT-03` production runtime readback failed because no qualifying
    open runtime position/order payload was visible.
  - Final V1 release gate must remain `not_ready` until `LIVEIMPORT-03` is
    rerun against a real qualifying runtime payload or an explicitly approved
    controlled LIVE proof.

