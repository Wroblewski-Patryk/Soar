# V1EXCEL-03 - Manual Verification Matrix

Status: BLOCKED
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

## Manual Matrix

| Scenario | Required surface | Current status | Notes |
| --- | --- | --- | --- |
| PAPER manual open through dashboard | real UI + API + DB | NOT EXECUTED | requires running app and operator walkthrough |
| PAPER manual close through dashboard | real UI + API + DB | NOT EXECUTED | same as above |
| LIVE manual open through dashboard | real UI + real exchange | NOT EXECUTED | requires authenticated operator and exchange account |
| LIVE manual close through dashboard | real UI + real exchange | NOT EXECUTED | requires authenticated operator and exchange account |
| Pending external exchange order stays in `orders` until fill | real exchange + dashboard | NOT EXECUTED | requires real external order lifecycle |
| Same-symbol DCA on managed LIVE position | real exchange + runtime | NOT EXECUTED | requires live managed position |
| `TTP` / `TSL` / `SL` after DCA | runtime + operator surface | NOT EXECUTED | requires controlled market/account scenario |
| Manual exchange-side intervention and dashboard truth | exchange UI + Soar UI | NOT EXECUTED | requires authenticated exchange access |
| Restart / recovery truth after dashboard reopen | runtime + persistent state | NOT EXECUTED | requires running target session and operator flow |

## Why This Is Blocked

This Codex session does not have:

- authenticated Soar operator credentials for the protected operator flows,
- authenticated exchange credentials for real `LIVE` order placement or
  exchange-side intervention,
- a confirmed browser session already wired to the real target environment.

Without those inputs, claiming this matrix as manually executed would violate:

- `DEFINITION_OF_DONE.md`
- `INTEGRATION_CHECKLIST.md`
- `v1-production-activation-contract.md`

## Required Operator Run

The smallest truthful next step is one authenticated operator pass covering the
table above on:

1. `PAPER`
2. `LIVE`
3. one manual exchange-side intervention case
4. one restart / recovery case

## Final Classification

The manual matrix is now explicit and ready to execute, but it is still
`BLOCKED` by missing authenticated operator and exchange access.

