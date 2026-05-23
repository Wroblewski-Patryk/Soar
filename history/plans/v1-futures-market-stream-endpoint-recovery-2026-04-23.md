# Task

## Header
- ID: V1RT-02
- Title: Fix Binance market-stream default endpoint to follow marketType truth
- Status: DONE
- Owner: Backend Builder
- Depends on: V1RT-01, V1SURF-01
- Priority: P0

## Context
Authenticated production verification after deploying `V1RT-01` and
`V1SURF-01` showed a selective runtime gap on the active `BINANCE/FUTURES`
paper bot. Symbols that exist on both Binance spot and futures
(`1000CATUSDT`, `1000CHEEMSUSDT`, `1000SATSUSDT`, `DOGEUSDT`) began producing
`latest_decision`, while futures-only symbols (`1000000MOGUSDT`,
`1000BONKUSDT`, `1000FLOKIUSDT`, `1000PEPEUSDT`, `1000SHIBUSDT`, etc.)
remained stuck at `configured_fallback`.

Production evidence matched the implementation drift in
`apps/api/src/modules/market-stream/binanceStream.service.ts`: the worker
defaulted to the spot websocket URL (`wss://stream.binance.com:9443/ws`) even
when the runtime market type was `FUTURES`.

## Goal
Make the Binance market-stream worker select the correct default websocket
endpoint for the active market type so `FUTURES` bots ingest futures candles
and tickers without requiring an env override.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic

## Definition of Done
- [x] `BinanceMarketStreamWorker` resolves its default websocket URL from
      `marketType` (`FUTURES` -> futures stream, `SPOT` -> spot stream).
- [x] Focused regression coverage locks both the resolver contract and the
      worker default behavior.
- [x] Source-of-truth docs/context reflect the production root cause and fix.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests: `pnpm --filter api exec vitest run src/modules/market-stream/binanceStream.service.test.ts`
- Manual checks: production API investigation confirmed only spot-listed
  futures symbols were receiving runtime decisions before the fix
- Screenshots/logs: production runtime symbol stats and Binance public
  `exchangeInfo` parity check (spot vs futures symbol availability)
- High-risk checks: default stream contract remains overrideable through
  explicit `BINANCE_STREAM_URL` when operators need a non-default endpoint

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  `docs/architecture/09_integrations-deployment-and-runtime-services.md`
- Fits approved architecture: yes
- Mismatch discovered: yes
- Decision required from user: no
- Approval reference if architecture changed: n/a
- Follow-up architecture doc updates:
  `docs/operations/coolify-linux-vps-setup-guide.md`

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: n/a
- Required states: success
- Responsive checks: n/a
- Accessibility checks: n/a
- Parity evidence: operator-visible dashboard markets now have a path to leave
  `CONFIGURED_ONLY` for futures-only symbols once production redeploys this fix

## Review Checklist (mandatory)
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
This is a production-critical fix because futures-only meme symbols were
effectively invisible to the runtime stream even though the canonical bot scope
and operator surfaces already considered them in scope.
