# Production Non-Gate.io Runtime Readback

## Status
- Result: **PARTIAL_BINANCE_LIVE_INACTIVE**
- Generated at (UTC): 2026-05-13T20:15:37.864Z
- Scope: Gate.io deferred by user on 2026-05-13; read-only Binance/PAPER/LIVE inventory and runtime monitoring readback only.
- Build SHA: 00169d7fdc3aff8317759137b05594b20e773c8e (matches expected 00169d7f)
- Raw JSON: `docs/operations/_artifacts-prod-non-gateio-runtime-readback-00169d7f-2026-05-13.json`

## Conclusions
- Both non-Gate.io PAPER Binance bots are active and expose fresh RUNNING runtime monitoring data.
- The Binance LIVE bot exists and live opt-in is enabled, but it is currently inactive; no activation was attempted in this read-only proof.
- Gate.io is intentionally out of scope for this proof per user direction on 2026-05-13.

## Bots
| Name | Mode | Exchange | Active | Running session | Heartbeat age | Classification |
| --- | --- | --- | --- | --- | --- | --- |
| Live | LIVE | BINANCE | no | - | -s | INFO_LIVE_PRESENT_INACTIVE_NO_RUNTIME_WRITE_ATTEMPTED |
| Peper bot 1m | PAPER | BINANCE | yes | RUNNING | 15s | PASS_ACTIVE_PAPER_RUNTIME_READBACK |
| Peper bot | PAPER | BINANCE | yes | RUNNING | 18s | PASS_ACTIVE_PAPER_RUNTIME_READBACK |

## Runtime Readback Summary
| Bot | Symbols | Positions total/open/closed | Open orders | Trades total/items | Aggregate status |
| --- | ---: | --- | ---: | --- | --- |
| Peper bot 1m | 8 | 93/7/86 | 0 | 218/100 | PASS |
| Peper bot | 7 | 135/7/128 | 0 | 378/100 | PASS |

## Safety Notes
- No production writes, bot activation, close-position commands, order placement, or exchange mutation were attempted.
- Credentials and session tokens are not written to this artifact.
