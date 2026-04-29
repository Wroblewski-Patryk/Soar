# V1EXCEL-03 - Manual Verification Matrix

Status: IN_PROGRESS
Date: 2026-04-29
Owner: Codex Execution Agent

## Purpose

Freeze the exact operator-facing manual matrix required by repository rules and
separate:

- what was executed today from this Codex session,
- what is already covered by fresh automated evidence,
- and what still requires a real authenticated operator session with exchange
  authority.

## Executed Today

### Automated confidence evidence

- `pnpm run test:go-live:smoke`
  - PASS
- latest closed focused `LIVE` hardening packs remain the current engineering
  baseline:
  - `V1SAFE-A`
  - `V1GUARD-A`
  - `V1MARK-A`
  - `V1TRUTH-A`

### Public target smoke

- stage public smoke:
  - `pnpm run ops:deploy:smoke -- --base-url https://stage-api.soar.luckysparrow.ch --web-base-url https://stage.soar.luckysparrow.ch --no-workers`
  - PASS
- prod public smoke:
  - `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`
  - PASS

### Authenticated production API/operator evidence

- authenticated Soar production login succeeded for an `ADMIN` account
- production bots/runtime sessions were inspected through real protected API
- production `PAPER` manual-order context was verified on the active paper bot
- production `PAPER` manual same-side add on the active managed position passed
  truthfully
- production `PAPER` manual close attempt exposed a real command/read drift:
  `POSITION_CLOSE_PRICE_UNAVAILABLE` despite visible `markPrice`
- remediation commit `f12f3efb` was pushed to `main`; fresh post-deploy
  confirmation is still pending
- canonical evidence: `docs/operations/v1excel-paper-operator-verification-2026-04-29.md`

## Manual Matrix

| Scenario | Required surface | Current status | Notes |
| --- | --- | --- | --- |
| PAPER manual open through dashboard | real UI + API + DB | PARTIAL | authenticated API/operator path executed; full real-UI walkthrough still pending |
| PAPER manual close through dashboard | real UI + API + DB | PARTIAL | authenticated API/operator path executed and exposed `POSITION_CLOSE_PRICE_UNAVAILABLE`; fix pushed, post-deploy and real-UI confirmation still pending |
| LIVE manual open through dashboard | real UI + real exchange | NOT EXECUTED | requires authenticated operator and exchange account |
| LIVE manual close through dashboard | real UI + real exchange | NOT EXECUTED | requires authenticated operator and exchange account |
| Pending external exchange order stays in `orders` until fill | real exchange + dashboard | NOT EXECUTED | requires real external order lifecycle |
| Same-symbol DCA on managed LIVE position | real exchange + runtime | NOT EXECUTED | requires live managed position |
| `TTP` / `TSL` / `SL` after DCA | runtime + operator surface | NOT EXECUTED | requires controlled market/account scenario |
| Manual exchange-side intervention and dashboard truth | exchange UI + Soar UI | NOT EXECUTED | requires authenticated exchange access |
| Restart / recovery truth after dashboard reopen | runtime + persistent state | NOT EXECUTED | requires running target session and operator flow |

## Why This Is Blocked

This Codex session still does not have:

- authenticated exchange credentials for real `LIVE` order placement or
  exchange-side intervention,
- a confirmed browser session already wired to the real target environment.

Without those inputs, claiming this matrix as manually executed would violate:

- `DEFINITION_OF_DONE.md`
- `INTEGRATION_CHECKLIST.md`
- `v1-production-activation-contract.md`

## Required Operator Run

The smallest truthful next step is:

1. confirm the pushed `PAPER` manual-close fix after deploy,
2. execute the still-missing real-UI walkthrough for `PAPER`,
3. execute the `LIVE` exchange-authority scenarios,
4. execute one manual exchange-side intervention case,
5. execute one restart / recovery case

## Final Classification

The manual matrix is no longer purely blocked by missing Soar auth. It is now
`IN_PROGRESS`, with authenticated `PAPER` API/operator evidence recorded and
one real `PAPER` close drift surfaced. The remaining blockers are real-UI
execution, `LIVE` exchange authority, and fresh post-deploy confirmation of the
pushed `PAPER` close fix.
