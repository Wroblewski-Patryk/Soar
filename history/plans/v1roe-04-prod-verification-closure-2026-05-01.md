# V1ROE-04 Production Verification Closure

Date: 2026-05-01
Environment: production
Scope: protected `LIVE DOGEUSDT` runtime truth and imported automation evidence
Status: PASS

## Summary

Authenticated production verification now proves the `V1ROE-04` acceptance
gate for the active `LIVE DOGEUSDT` flow:

- production is deployed from current `main`;
- public API/web smoke is green;
- protected runtime freshness is green;
- `DOGEUSDT` runtime position truth is exchange-synced, confirmed, actionable,
  and strategy-context resolved;
- `PnL %` is derived from the same margin basis as the runtime position payload;
- DCA remains idle while current PnL is above the first configured DCA trigger;
- dashboard `Positions` shows the same live row shape as protected runtime API.

No secrets, session tokens, API keys, or account credentials are recorded in
this artifact.

## Deployment Freshness

Source: `https://soar.luckysparrow.ch/api/build-info`

- `gitSha`: `e6bdcfda35698dbb29513490a953e15b9a2c0469`
- `gitRef`: `main`
- `metadataSource`: `env-runtime`
- `checkedAt`: `2026-05-01T00:16:47.011Z`

Public smoke:

- `node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`
- Result: PASS
- API `/health`: `200`
- API `/ready`: `200`
- Web `/`: `200`

## Protected Runtime Freshness

Command shape:

```powershell
node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch --timeout-ms 15000
```

Auth was supplied through the session environment and was not written to disk.

Result: PASS

Checks:

- `workerHeartbeat`: PASS, `ageMs=7198`, threshold `60000`
- `marketData`: PASS, `ageMs=7198`, threshold `120000`
- `runtimeSignalLag`: PASS, `ageMs=0`, threshold `90000`
- `runtimeSessions`: PASS, `runningCount=4`, `staleSessionIds=[]`
- `runtimeDecisionActivity`: SKIP, not required by this gate

## Protected DOGEUSDT Runtime Evidence

Read-only API evidence was captured from:

- `GET /dashboard/bots`
- `GET /dashboard/bots/:botId/runtime-sessions`
- `GET /dashboard/bots/:botId/runtime-sessions/:sessionId/positions`
- `GET /dashboard/bots/:botId/runtime-sessions/:sessionId/symbol-stats`
- `GET /dashboard/bots/:botId/runtime-sessions/:sessionId/trades`
- `GET /dashboard/bots/:botId/runtime-monitoring/aggregate`
- `GET /dashboard/strategies/:strategyId`

Sanitized context:

- Bot: `live`
- Mode: `LIVE`
- Bot active: `true`
- External-position management: `true`
- Session status: `RUNNING`
- Strategy: `RSI 20 / 80`
- Strategy DCA levels: `-20%`, `-40%`, `-60%`
- Strategy TTP levels: `5/10`, `10/20`, `20/40`, `40/80`
- Strategy TSL level: start `-20%`, step `10%`

Latest protected runtime snapshot during the verification window:

- Symbol: `DOGEUSDT`
- Side: `SHORT`
- Status: `OPEN`
- `syncState`: `IN_SYNC`
- `continuityState`: `CONFIRMED`
- `actionable`: `true`
- `strategyAutomationContextResolved`: `true`
- Quantity: `150`
- Entry price: `0.106635`
- Mark price: `0.10727508`
- Margin used: `1.06308365 USDT`
- Unrealized PnL: `-0.09601200000000018 USDT`
- Unrealized PnL percent: `-9.031462387743446%`
- DCA count: `0`
- Dynamic TTP: `null`
- Dynamic TSL: `null`

Formula check:

- Short PnL from mark: `(entryPrice - markPrice) * quantity`
- `(0.106635 - 0.10727508) * 150 = -0.096012`
- `-0.096012 / 1.06308365 * 100 = -9.031462%`

This proves the exposed `LIVE` percent is aligned to the runtime margin basis
and not to the older stale modeled-margin shortcut.

## DCA And Automation Result

The first configured DCA trigger is `-20%`. During verification, the current
runtime PnL was around `-9%`, so DCA staying at `0` is expected.

Automation is not dormant:

- the imported/exchange-synced row is `actionable=true`;
- continuity is `CONFIRMED`;
- strategy automation context is resolved;
- strategy close levels are present in the protected position payload;
- the row is visible in dashboard `Positions` and runtime APIs.

The absence of dynamic TTP/TSL is expected for this snapshot:

- TTP is profit-side and current PnL is negative;
- TSL is configured as loss-side start `-20%`, while current PnL remained above
  that boundary during verification.

## Dashboard Parity

Headless browser verification opened `https://soar.luckysparrow.ch/dashboard`
with an authenticated operator session and selected the `live` bot.

Dashboard DOM evidence at `2026-05-01T00:21:08.871Z`:

- URL: `https://soar.luckysparrow.ch/dashboard`
- `Positions` section present
- `DOGEUSDT` row present
- Selected bot: `live (LIVE - Binance Futures Live)`
- Table row showed:
  - `DOGEUSDT`
  - `SHORT`
  - margin around `1.06 USDT`
  - PnL around `-0.10 USDT`
  - PnL percent around `-9.81%`
  - DCA `0`
  - TTP `-`
  - TSL `-`

The exact percent moved between API and browser reads because the position is
live and mark price changed during the verification window. The dashboard and
protected API agree on row identity, side, margin basis shape, PnL sign/order of
magnitude, DCA state, and no armed dynamic stop.

## External Price Cross-Check

Public Binance Futures mark-price read during verification:

- Symbol: `DOGEUSDT`
- Mark price around `0.10725`

This is consistent with the protected runtime mark prices observed around
`0.10720` to `0.10728` during the same live window.

## Result

`V1ROE-04` is closed.

Residual V1 blockers are no longer this DOGEUSDT production verification gate.
The remaining open `V1EXCEL` items still require their own authenticated manual
operator/OPS evidence and should not be treated as closed by this artifact.
