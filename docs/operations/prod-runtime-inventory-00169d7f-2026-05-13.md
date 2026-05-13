# Production Runtime Inventory

## Status
- Result: **PARTIAL**
- Generated at (UTC): 2026-05-13T19:53:18.303Z
- Auth: login:present
- Bot count: 3
- Mode counts: {"LIVE":1,"PAPER":2,"PAPER_active":2}
- Raw JSON: `docs\operations\_artifacts-prod-runtime-inventory-00169d7f-2026-05-13.json`

## Blockers
- production has fewer than two active LIVE bots
- production has no LIVE Gate.io bot visible for this account

## Bots
| Name | Mode | Exchange | Market | Active | Live opt-in | ID |
| --- | --- | --- | --- | --- | --- | --- |
| Live | LIVE | BINANCE | FUTURES | no | yes | `46d1f560-be45-4537-ba5b-f2a51df03839` |
| Peper bot 1m | PAPER | BINANCE | FUTURES | yes | no | `e8651bba-258e-4b16-8dff-d4e789a0a226` |
| Peper bot | PAPER | BINANCE | FUTURES | yes | no | `c104a4e6-eb39-49a1-a74d-048b580b655b` |

## Latest Sessions
| Bot | Sessions HTTP | Latest status | Latest mode | Latest heartbeat | Symbols tracked | Events |
| --- | --- | --- | --- | --- | --- | --- |
| Live | 200 | CANCELED | LIVE | 2026-05-13T18:37:14.730Z | 0 | 2 |
| Peper bot 1m | 200 | RUNNING | PAPER | 2026-05-13T19:52:53.028Z | 7 | 58074 |
| Peper bot | 200 | RUNNING | PAPER | 2026-05-13T19:52:53.025Z | 7 | 6591 |

## Safety Notes
- Read-only API GET inventory only.
- No production writes, no activation, and no live orders were attempted.
- Credentials and tokens are not written to this artifact.
