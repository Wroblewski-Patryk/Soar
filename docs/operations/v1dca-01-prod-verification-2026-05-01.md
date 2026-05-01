# V1DCA-01 Production Verification

Date: 2026-05-01
Environment: production
Scope: protected `LIVE DOGEUSDT` runtime `Positions` DCA visibility
Status: PASS

## Summary

Authenticated production verification confirms that the deployed `V1DCA-01`
read-model fix is active and resolves the operator-visible DOGEUSDT DCA gap.

No secrets, session tokens, API keys, or account credentials are recorded in
this artifact.

## Deployment Freshness

Source: `https://soar.luckysparrow.ch/api/build-info`

- `gitSha`: `9460317c7d9409062ff2ddd284a179a60ac89f1a`
- `gitRef`: `main`
- `metadataSource`: `env-runtime`
- `checkedAt`: `2026-05-01T01:19:53.294Z`

Public API baseline:

- `GET https://api.soar.luckysparrow.ch/health` => `200`
- `GET https://api.soar.luckysparrow.ch/ready` => `200`

## Protected Runtime Evidence

Read-only API evidence was captured from:

- `GET /dashboard/bots`
- `GET /dashboard/bots/:botId/runtime-sessions`
- `GET /dashboard/bots/:botId/runtime-sessions/:sessionId/positions`
- `GET /dashboard/bots/:botId/runtime-sessions/:sessionId/trades?limit=200`

Sanitized runtime context:

- Bot: `live`
- Bot id: `50a15ab3-b89c-45d1-8dcb-29bc103349d8`
- Mode: `LIVE`
- Bot active: `true`
- External-position management: `true`
- Session id: `016050d0-3ac0-43bd-8392-7c226d16e53d`
- Session status: `RUNNING`
- Session started: `2026-04-30T20:45:50.258Z`

Runtime positions summary:

- Open positions: `4`
- Closed positions in session window: `6`
- Dynamic stop columns: `true`

Current protected DOGEUSDT `Positions` row:

- Position id: `d06cd442-1249-4b3f-b46e-7bc69e1355c0`
- Symbol: `DOGEUSDT`
- Side: `SHORT`
- Status: `OPEN`
- Origin: `EXCHANGE_SYNC`
- Management mode: `BOT_MANAGED`
- `syncState`: `IN_SYNC`
- `continuityState`: `CONFIRMED`
- Takeover status: `OWNED_AND_MANAGED`
- Quantity: `300`
- Entry price: `0.1073875`
- `dcaCount`: `1`
- `dcaExecutedLevels`: `[-20]`
- `tradesCount`: `2`
- `firstTradeAt`: `2026-05-01T01:05:19.346Z`
- `lastTradeAt`: `2026-05-01T01:05:20.250Z`

Relevant DOGEUSDT trade ledger rows:

- `BOT` `DCA`, position id `e934dbf4-e929-41d9-9db8-2ecee88fa88e`,
  price `0.10814`, quantity `150`, executed at
  `2026-05-01T01:05:20.250Z`.
- `EXCHANGE_SYNC` `OPEN`, position id
  `d06cd442-1249-4b3f-b46e-7bc69e1355c0`, price `0.1073875`,
  quantity `300`, executed at `2026-05-01T01:05:19.346Z`.
- Older DOGEUSDT lifecycle rows remain present in the trade ledger and are not
  counted into the current open row once they fall outside the current
  lifecycle window.

## Result

`V1DCA-01` production verification passes.

The dashboard `Positions` API now exposes the current DOGEUSDT open row with
the DCA count and last trade timestamp derived from the real persisted DCA
trade even though that DCA trade is linked to the superseded local
`positionId`. This confirms the intended strict supplemental DCA read-model
bridge is active on the deployed candidate.

## Residual Risk

This verification proves the protected API shape. A browser visual smoke can
still be run if the operator wants screenshot evidence of the rendered table,
but the dashboard table consumes the verified positions payload.
