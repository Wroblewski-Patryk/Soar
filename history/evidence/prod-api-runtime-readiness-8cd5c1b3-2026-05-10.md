# Production API And Runtime Readiness Refresh

## Status
- Result: **PARTIAL PASS / LIVEIMPORT blocked by no running LIVE session**
- Environment: production
- Evidence date: 2026-05-10
- Deployed build-info SHA: `8cd5c1b3f38b9594a9caf15d4b434c853a66fdfe`
- Auth source: approved app login
- Raw liveimport artifact:
  `history/artifacts/_artifacts-liveimport-readback-8cd5c1b3-2026-05-10.json`

## Plain Answer
The previous Binance key warning is resolved after the probe fixes deployed.
The stored Binance key now validates successfully on production:
`ok: true`, `code: OK`, `permissions.spot: true`, `permissions.futures: true`.

The remaining live-runtime blocker is not the key. `LIVEIMPORT-03` still cannot
pass because the configured LIVE bot has no running runtime session.

## What Passed
- Production Web build-info matches `8cd5c1b3`.
- Public deploy smoke passes:
  - API `/health` 200
  - API `/ready` 200
  - Web `/` 200
- Stored Binance key test passes on production after deployment:

| Field | Value |
| --- | --- |
| `ok` | `true` |
| `code` | `OK` |
| message | `Binance API key permissions validated.` |
| permissions.spot | `true` |
| permissions.futures | `true` |

## LIVEIMPORT-03 Readback
Command family:
`node scripts/collectLiveImportReadbackEvidence.mjs`

Result: **blocked fail-closed**

| Check | Result |
| --- | --- |
| LIVE bots checked | `1` |
| LIVE bots with runtime readback | `0` |
| LIVE bots without running session | `1` |
| LIVE bot status | `NO_RUNNING_SESSION` |

## Safety Notes
- No live bot was activated.
- No exchange order was submitted.
- No wallet, market, strategy, bot, API key, cookie, token, or password was
  written to repository artifacts.
- No destructive account cleanup was performed in this task.

## V1 Impact
V1 remains blocked for full LIVE runtime proof until a controlled LIVE runtime
session exists and `LIVEIMPORT-03` can read back expected symbols/positions.
The exchange-key blocker from the previous artifact is closed by the deployed
probe fix and successful production rerun.
