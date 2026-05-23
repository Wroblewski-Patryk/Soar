# Production Positions Proof

## Status
- Result: **PASS**
- Environment: production
- Evidence date: 2026-05-14
- Generated at (UTC): 2026-05-14T03:02:54.423Z
- Expected SHA: `2fc90a0810032f2fedb744d69505a3bd55a23779`
- Observed build-info SHA: `2fc90a0810032f2fedb744d69505a3bd55a23779`
- Selected bot: Peper bot 1m (e8651bba-258e-4b16-8dff-d4e789a0a226)
- Selected session: 74958789-93dc-4aa7-9725-88ac7bab2700
- Selected symbol: BNBUSDT
- Proof order: 9c08a656-6e94-4edc-aeca-27ed4a92d4dc
- Proof position: dd16f160-8f38-4d60-bdfb-d6b55d17fe9e
- Raw JSON: `history\artifacts\_artifacts-prod-positions-proof-2fc90a08-2026-05-14.json`

## Scope

This proof uses a controlled PAPER-only production position lifecycle on an
already-running PAPER bot. It does not submit LIVE orders, cancel LIVE orders,
close LIVE positions, mutate exchange-side state, or persist raw credentials in
artifacts. The proof-created PAPER order/position/trade records remain only as
terminal audit/history after successful close.

Covered module in this slice: Positions.

## Steps
| Step | Result | HTTP | Notes |
| --- | --- | --- | --- |
| build-info freshness | PASS | 200 | deployed build matches expected SHA |
| auth token resolved | PASS | - | login:present |
| unauthenticated positions list fail-closed | PASS | 401 | - |
| active paper runtime candidate selected | PASS | - | openBefore=5; statsSymbols=8 |
| positions list before proof mutation | PASS | 200 | selectedBotOpen=0 |
| manual order context for proof symbol | PASS | 200 | quantity=1 |
| paper market order opens proof position | PASS | 201 | order=9c08a656-6e94-4edc-aeca-27ed4a92d4dc; position=dd16f160-8f38-4d60-bdfb-d6b55d17fe9e |
| position readback after open | PASS | 200 | - |
| position management mode manual | PASS | 200 | - |
| position management mode restored bot | PASS | 200 | - |
| position manual update | PASS | 200 | - |
| positions live reconciliation status read | PASS | 200 | openPositionsSeen=0 |
| positions takeover status read | PASS | 200 | items=2 |
| positions exchange snapshot boundary | PASS | 200 | snapshot read succeeded |
| runtime position close fail-closed without ack | PASS | 400 | - |
| runtime position close with ack | PASS | 200 | closeOrder=9aea8d69-8d8c-4bbd-a5fc-9786b4e847ba |
| closed position readback | PASS | 200 | - |
| positions list after close | PASS | 200 | proof position absent from OPEN list |

## Cleanup
| Step | Result | HTTP | Notes |
| --- | --- | --- | --- |
| proof position terminal cleanup | PASS | 200 | status=CLOSED |

## Blockers
- none

## Redaction Notes
- Auth tokens, passwords, cookies, private headers, raw API-key values, API
  secrets, and response bodies that may contain secrets are not written to this
  artifact.
- Payloads are summarized only as booleans/counts/status codes.
