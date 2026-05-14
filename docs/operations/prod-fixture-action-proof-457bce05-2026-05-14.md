# Production Fixture Action Proof

## Status
- Result: **PASS**
- Environment: production
- Evidence date: 2026-05-14
- Generated at (UTC): 2026-05-14T02:22:14.083Z
- Expected SHA: `457bce05338310c198c03a973395a9176f298dc1`
- Observed build-info SHA: `457bce05338310c198c03a973395a9176f298dc1`
- Fixture prefix: `Codex V1 Proof 20260514T0222`
- Raw JSON: `docs\operations\_artifacts-prod-fixture-action-proof-457bce05-2026-05-14.json`

## Scope

This proof used approved disposable production fixtures only. It did not submit
LIVE orders, cancel LIVE orders, close LIVE positions, or mutate exchange-side
state.

Covered modules in this slice: Profile, Profile API Keys, Wallets, Markets,
Strategies, Bots, Manual Orders, Orders, Backtests, Reports, Logs/Audit Trail,
and Exchange Adapter probe fail-closed behavior.

## Steps
| Step | Result | HTTP | Notes |
| --- | --- | --- | --- |
| build-info freshness | PASS | 200 | deployed build matches expected SHA |
| auth token resolved | PASS | - | login:present |
| profile read | PASS | 200 | - |
| profile reversible update | PASS | 200 | - |
| profile api key create masked | PASS | 201 | - |
| profile api key stored probe fail-closed | PASS | 200 | probe ok=false |
| wallet create | PASS | 201 | - |
| wallet update | PASS | 200 | - |
| wallet readback | PASS | 200 | - |
| market universe create | PASS | 201 | - |
| market universe update | PASS | 200 | - |
| market catalog read | PASS | 200 | - |
| strategy create | PASS | 201 | - |
| strategy export | PASS | 200 | - |
| strategy update | PASS | 200 | - |
| bot create inactive paper | PASS | 201 | - |
| bot readback | PASS | 200 | - |
| bot update inactive paper | PASS | 200 | - |
| bot runtime graph read | PASS | 200 | - |
| bot market groups readback | PASS | 200 | - |
| bot strategy links readback | PASS | 200 | - |
| bot assistant config update | PASS | 200 | - |
| manual order context read | PASS | 200 | - |
| manual paper limit order open | PASS | 201 | - |
| manual paper limit order readback | PASS | 200 | - |
| manual paper limit cancel fail-closed without ack | PASS | 400 | - |
| manual paper limit order cancel | PASS | 200 | - |
| manual paper canceled order readback | PASS | 200 | - |
| backtest run create | PASS | 201 | - |
| backtest run readback | PASS | 200 | - |
| backtest report readback | PASS | 200 | lifecycle=undefined |
| backtest trades readback | PASS | 200 | - |
| backtest timeline readback | PASS | 200 | candles=49 |
| audit logs readback | PASS | 200 | api key probe event visible |

## Cleanup
| Step | Result | HTTP | Notes |
| --- | --- | --- | --- |
| manual paper limit order terminal cleanup | PASS | - | order left canceled as audit history |
| backtest run cleanup | PASS | 204 | - |
| bot cleanup | PASS | 204 | - |
| strategy cleanup | PASS | 204 | - |
| market universe cleanup | PASS | 204 | - |
| wallet cleanup | PASS | 204 | - |
| profile api key cleanup | PASS | 204 | - |
| profile restore | PASS | 200 | - |

## Blockers
- none

## Redaction Notes
- Auth tokens, passwords, cookies, private headers, raw API-key values, API
  secrets, and response bodies are not written to this artifact.
- Fixture IDs may be recorded only to prove cleanup.
