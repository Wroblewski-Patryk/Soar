# V1 Production Activation Evidence Audit (2026-05-23)

## Context
- Environment: production only for V1.
- API URL: `https://api.soar.luckysparrow.ch`
- Web URL: `https://soar.luckysparrow.ch`
- Public Web build-info SHA:
  `b1ba69edccc639e97943f37fb2b1e6249a62e87c`.
- Current final preflight:
  `history/releases/v1-final-preflight-b1ba69ed-2026-05-23-after-liveimport.md`.
- Current production UI clickthrough:
  `history/plans/prod-ui-module-clickthrough-2026-05-23.md`.
- Current `LIVEIMPORT-03` runtime readback:
  `history/artifacts/liveimport-03-prod-readback-2026-05-23.json`.
- Current rollback proof:
  `history/evidence/v1-rollback-proof-prod-2026-05-23T00-00-00-000Z.md`.
- Current restore drill:
  `history/evidence/v1-restore-drill-prod-2026-05-23T00-00-00-000Z.md`.
- Current SLO observation:
  `history/evidence/v1-slo-observation-2026-05-23T04-38-07-393Z.md`.
- Current RC external gates status:
  `docs/operations/v1-rc-external-gates-status.md`.
- Current RC sign-off record:
  `docs/operations/v1-rc-signoff-record.md`.
- Current RC checklist:
  `docs/operations/v1-release-candidate-checklist.md`.

## Evidence Reviewed
- Public production build-info: PASS, deployed Web SHA
  `b1ba69edccc639e97943f37fb2b1e6249a62e87c`.
- Production deploy smoke: PASS for `/health`, `/ready`, Web `/`, and
  authenticated `/workers/ready` after Coolify split-worker topology repair.
- Worker topology: PASS after production API was moved to `WORKER_MODE=split`
  and all required worker families reported fresh heartbeats.
- Production UI clickthrough: PASS for public, dashboard, admin, and legacy
  redirect route groups.
- `LIVEIMPORT-03`: PASS. A running LIVE Binance Futures bot/session was found,
  and read-only auto-discovery selected the real open runtime symbols
  `SOLUSDT` and `BNBUSDT`; both positions are `EXCHANGE_SYNC`,
  `BOT_MANAGED`, `OWNED_AND_MANAGED`, and `IN_SYNC`.
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
- V1 activation can be marked ready for this production proof packet because
  `LIVEIMPORT-03`, final preflight, and the full non-dry-run production release
  gate now pass.
- The `LIVEIMPORT-03` proof was not bypassed by weaker signals; it uses the
  runtime positions readback for the real open symbols currently visible in
  production.

## Result
- Status: **READY**
- Satisfied for 2026-05-23:
  - production public build-info readback
  - production public and authenticated smoke
  - split-worker production readiness
  - authenticated production UI clickthrough
  - production rollback proof
  - production DB restore drill
  - 30-minute production SLO observation, except live order ratio `NO_DATA`
  - RC external gates, sign-off, and checklist evidence
  - `LIVEIMPORT-03` runtime readback for `SOLUSDT` and `BNBUSDT`
  - final preflight with no blockers
  - full non-dry-run production release gate `ready`
- Remaining blockers:
  - none.
