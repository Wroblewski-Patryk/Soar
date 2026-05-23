# Production API And Runtime Readiness Audit

## Status
- Result: **BLOCKED / NO-GO for starting LIVE Futures bot**
- Correction note: the stored API-key probe result in this artifact is now
  classified as **ambiguous** for Binance Futures readiness. Follow-up task
  `BINANCE-FUTURES-APIKEY-PROBE-SCOPE-FIX-2026-05-10` found that the probe
  relied on implicit CCXT balance-scope defaults and sequential scope checks,
  so the `spot/futures` booleans below must not be treated as authoritative
  proof of the operator's Binance key permissions until the fixed probe is
  deployed and rerun.
- Environment: production
- Evidence date: 2026-05-10
- Deployed build-info SHA: `f3cb9a24c4c891479d5466a5abae4100ddda5ca8`
- Auth source: approved app login
- Raw liveimport artifact:
  `history/artifacts/_artifacts-liveimport-readback-f3cb9a24-2026-05-10.json`

## Plain Answer
The application routes and authenticated API modules are reachable, and the
LIVE bot configuration exists. Do not treat this artifact as proof that the
Binance key lacks Futures access. The reliable blocker captured here is that
`LIVEIMPORT-03` cannot collect runtime readback because there is no running
LIVE runtime session. The key-permission probe must be rerun after the
scope-handling fix is deployed.

## What Passed
- Production Web build-info matches `f3cb9a24`.
- Authenticated UI route/module clickthrough already passes for public,
  dashboard, admin, and legacy routes.
- Authenticated API read-only reachability passed for the core V1 modules:
  - `/auth/me`
  - `/dashboard`
  - `/dashboard/profile/apiKeys`
  - `/dashboard/wallets`
  - `/dashboard/markets/universes`
  - `/dashboard/markets/catalog?exchange=GATEIO&marketType=FUTURES`
  - `/dashboard/strategies`
  - `/dashboard/strategies/indicators`
  - `/dashboard/bots`
  - `/dashboard/bots/strategy-drift`
  - `/dashboard/backtests/runs`
  - `/dashboard/reports/cross-mode-performance`
  - `/dashboard/logs`
  - `/admin`
  - `/admin/users`
  - `/admin/subscriptions/plans`
- Gate.io Futures market catalog route is reachable through the approved API.

## Current Production Account Shape
- API keys: one stored Binance key.
- Wallets:
  - `Paper wallet 2`: Binance Futures, Paper, no stored API key.
  - `Paper walletv`: Binance Futures, Paper, no stored API key.
  - `Binance Futures Live`: Binance Futures, Live, stored API key attached.
- Bots:
  - `Live`: Binance Futures, LIVE, inactive, live opt-in enabled.
  - `Peper bot 1m`: Binance Futures, PAPER, active.
  - `Peper bot`: Binance Futures, PAPER, active.

## Stored Exchange-Key Probe
The stored Binance key test endpoint returned HTTP 200 with a failed validation
payload, but this result is now considered ambiguous for Binance Futures:

| Field | Value |
| --- | --- |
| `ok` | `false` |
| `code` | `UNKNOWN` |
| message | `Binance validation failed.` |
| permissions.spot | `true` |
| permissions.futures | `false` |

This was a fail-closed application response, but it should not be interpreted
as definitive exchange-permission truth. The follow-up fix makes scope probing
independent and passes explicit balance-scope parameters before this endpoint
is used again as readiness evidence.

## LIVEIMPORT-03 Readback
Command family:
`node scripts/collectLiveImportReadbackEvidence.mjs`

Result: **blocked fail-closed**

The collector logged in successfully, verified build-info, discovered the
configured LIVE bot, and wrote a redacted artifact. It then failed as designed:

| Check | Result |
| --- | --- |
| LIVE bots checked | `1` |
| LIVE bots with runtime readback | `0` |
| LIVE bots without running session | `1` |
| LIVE bot status | `NO_RUNNING_SESSION` |

This proves the collector and auth path are usable, but it does not prove live
runtime import/readback yet. A protected runtime session must exist before this
gate can pass.

## Safety Notes
- No live bot was activated.
- No exchange order was submitted.
- No wallet, market, strategy, bot, API key, cookie, token, or password was
  written to repository artifacts.
- No destructive account cleanup was performed in this task.

## V1 Impact
V1 remains `BLOCKED / NO-GO` for live launch. The next concrete unblock is to
deploy and rerun the corrected Binance Futures key probe, then run a controlled
runtime/readback session. The remaining formal gates are rollback proof PASS,
authenticated Gate 2 SLO, RC approval/sign-off/checklist, and final
non-dry-run release gate.
