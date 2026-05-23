# Gate.io Market Stream Source Smoke

- Status: **PASS**
- Exchange: `GATEIO`
- Market type: `FUTURES`
- Symbol: `BTCUSDT`
- Interval: `1m`
- Event count: `2`
- Ticker event: `present`
- Final candle event: `present`

## Safety
- Public market-data read only.
- No credentials used.
- No exchange writes or live orders.
- Does not enable Gate.io `PAPER_PRICING_FEED`, authenticated reads, live submit, or cancel.

## Canonical Events

```json
[
  {
    "type": "ticker",
    "exchange": "GATEIO",
    "marketType": "FUTURES",
    "symbol": "BTCUSDT",
    "eventTime": 1778348797456,
    "lastPrice": 80834.9,
    "priceChangePercent24h": 0.85
  },
  {
    "type": "candle",
    "exchange": "GATEIO",
    "marketType": "FUTURES",
    "symbol": "BTCUSDT",
    "interval": "1m",
    "eventTime": 1778348805739,
    "openTime": 1778348760000,
    "closeTime": 1778348819999,
    "open": 80817.3,
    "high": 80835,
    "low": 80817.2,
    "close": 80835,
    "volume": 1.844779,
    "isFinal": true
  }
]
```
