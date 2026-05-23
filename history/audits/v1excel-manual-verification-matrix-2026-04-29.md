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

Detailed mixed-origin `LIVE` lifecycle scenarios now also live in
`history/audits/v1live-mixed-origin-verification-matrix-2026-04-29.md`.
That companion matrix expands the original checklist into explicit
`exchange/app` open-close combinations plus wait-based `DCA` / `TTP` / `TSL`
flows.

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
- fresh post-deploy production `PAPER` manual close now passes truthfully:
  `200 OK`, `openCount -> 0`, closed row preserved in `historyItems`, and
  runtime capital summary moved realized PnL into `freeCash`
- authenticated production dashboard UI walkthrough also passed for the paper
  bot state:
  - selected bot switch `LIVE -> PAPER`
  - `Positions` shows `No open positions.`
  - wallet summary reflects `Delta from start 1.25% | 12.48 USDT`
  - `History` shows the expected top row `Close / Manual / User in app`
- canonical evidence: `history/plans/v1excel-paper-operator-verification-2026-04-29.md`

## Manual Matrix

| Scenario | Required surface | Current status | Notes |
| --- | --- | --- | --- |
| PAPER manual open through dashboard | real UI + API + DB | PARTIAL | authenticated API/operator path executed truthfully; dashboard state walkthrough is green, but no fresh browser-side order submission was executed in this session |
| PAPER manual close through dashboard | real UI + API + DB | PARTIAL | authenticated API/operator path now passes truthfully after deploy and dashboard state/history walkthrough is green, but no fresh browser-side close click was executed in this session |
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

1. execute the browser-side `PAPER` trade-action clicks if we want full UI-action proof instead of API-plus-UI-state proof,
2. execute the `LIVE` exchange-authority scenarios,
3. execute one manual exchange-side intervention case,
4. execute one restart / recovery case

## Final Classification

The manual matrix is no longer purely blocked by missing Soar auth. It is now
`IN_PROGRESS`, with authenticated `PAPER` API/operator evidence recorded for
truthful same-side add, truthful post-deploy manual close, and aligned
dashboard state/history truth. The remaining blockers are browser-side action
proof if required, `LIVE` exchange authority, and restart/recovery or
mixed-origin operator scenarios.
