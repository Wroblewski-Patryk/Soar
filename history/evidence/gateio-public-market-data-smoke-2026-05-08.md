# Gate.io Public Market Data Smoke (2026-05-08)

Generated: 2026-05-08T20:22:35.606Z

## Result
PASS

## Scope
This was a public read-only adapter smoke from the local workstation. It used
the existing exchange-owned public market-data boundary:

- `apps/api/src/modules/exchange/exchangePublicMarketData.service.ts`
- exchange: `GATEIO`
- market type: `FUTURES`
- symbol: `BTCUSDT`
- candle interval: `1m`

No secrets, authenticated exchange reads, exchange writes, live orders, or
production mutations were used.

## Checks
| Check | Status | Evidence |
| --- | --- | --- |
| Ticker snapshot | PASS | `lastPrice=80258`, `eventTime=1778271747427`, `priceChangePercent24h=0.15` |
| Recent candles | PASS | `count=2`, latest close `80258`, latest volume `0.000119` |

## Limitations
- This is not authenticated Gate.io readback.
- This is not a production worker smoke.
- This does not enable Gate.io `PAPER_PRICING_FEED`.
- This does not test LIVE order submit or cancel.

## Artifact
Machine-readable artifact:
`history/artifacts/_artifacts-gateio-public-market-data-smoke-2026-05-08.json`
