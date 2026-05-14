# Production Non-Gate.io Runtime Readback

## Status
- Result: **PASS**
- Generated at (UTC): 2026-05-14T01:25:37.937Z
- Scope: Gate.io deferred by user on 2026-05-13; read-only Binance/PAPER/LIVE inventory and runtime monitoring readback only.
- Build SHA: 457bce05338310c198c03a973395a9176f298dc1 (matches expected 457bce05338310c198c03a973395a9176f298dc1)
- Raw JSON: `docs/operations/_artifacts-prod-live-paper-simultaneous-runtime-readback-457bce05-2026-05-14.json`

## Conclusions
- Both non-Gate.io PAPER Binance bots are active and expose fresh RUNNING runtime monitoring data.
- A non-Gate.io LIVE bot is currently RUNNING.
- Gate.io is intentionally out of scope for this proof per user direction on 2026-05-13.

## Bots
| Name | Mode | Exchange | Active | Running session | Heartbeat age | Classification |
| --- | --- | --- | --- | --- | --- | --- |
| Live | LIVE | BINANCE | yes | RUNNING | 4s | WARN_LIVE_RUNNING_NOT_DEEP_READ_WITHOUT_OPERATOR_ACTION |
| Peper bot 1m | PAPER | BINANCE | yes | RUNNING | 4s | PASS_ACTIVE_PAPER_RUNTIME_READBACK |
| Peper bot | PAPER | BINANCE | yes | RUNNING | 9s | PASS_ACTIVE_PAPER_RUNTIME_READBACK |

## Runtime Readback Summary
| Bot | Symbols | Positions total/open/closed | Open orders | Trades total/items | Aggregate status |
| --- | ---: | --- | ---: | --- | --- |
| Peper bot 1m | 8 | 97/7/90 | 0 | 228/100 | PASS |
| Peper bot | 7 | 138/7/131 | 0 | 385/100 | PASS |

## Safety Notes
- No production writes, bot activation, close-position commands, order placement, or exchange mutation were attempted.
- Credentials and session tokens are not written to this artifact.
