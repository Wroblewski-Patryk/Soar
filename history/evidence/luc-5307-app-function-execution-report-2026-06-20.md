# LUC-5307 App Function Execution Report - 2026-06-20

## Status

- Issue: [LUC-5307](/LUC/issues/LUC-5307)
- Result: `DONE / REPORT_PUBLISHED / FOLLOW_UP_REPAIR_LANES_IDENTIFIED`
- Scope: current Soar V1 / V1.x function execution posture from architecture
  indexes, production evidence, local proof ledgers, and same-day Paperclip
  closure records.
- Production Web: `https://soar.luckysparrow.ch`
- Production API: `https://api.soar.luckysparrow.ch`
- Current deployed SHA in latest production evidence:
  `42177530f2a2ddc22832133b545bccab6ab404eb`
- Build-info source: `env-runtime` (`diagnostic-only`, not release-grade
  provenance)

## Executive Summary

Soar has a broad V1 function map and most planned product areas are implemented
enough to have local tests or local proof. The current truth is not "all
features are production-verified." It is:

- Public production reachability is currently healthy for Web `/`, Web
  `/api/build-info`, API `/health`, and API `/ready`.
- Protected auth/session behavior is currently passing in the latest redacted
  production proofs, including invalid-token redirect to
  `/auth/login?session=expired`.
- The architecture/function indexes exist and are usable: function chains, Web
  journeys, API surfaces, and user actions are generated from architecture graph
  source-of-truth files.
- Most business functions are `verified_local`, not production-verified. This
  means implementation and tests exist, but fresh protected browser or
  production readback proof is missing.
- Money/exchange/runtime functions remain the highest-risk area: manual order,
  DCA/PnL, positions, wallets, exchange adapter, bot runtime, market streams,
  and LIVE/PAPER behavior need focused production-safe proof before they can be
  called correctly working in the deployed app.
- Full server-health readback is still blocked by missing approved read-only
  Coolify/VPS/DB/worker bindings through [LUC-4811](/LUC/issues/LUC-4811).

## Function Index Status

Generated function evidence exists.

| Index | Current count / status |
| --- | --- |
| Function chains | `27` |
| Web journeys/pages | `38` |
| API surfaces | `96` |
| User actions | `41` |
| Critical generated gaps | `0` in current function and user-action indexes |
| High generated gaps | `28` function-chain gaps; `39` user-action gaps |

The `0` critical gap count is good, but it does not mean V1 is production
complete. The high gaps are mainly proof gaps: protected, money-facing, or
runtime actions have local proof but still need fresh browser/production proof.

Primary source files:

- `docs/status/function-journey-index.md`
- `docs/status/user-action-index.md`
- `docs/architecture/indices/function-chain-evidence-index.csv`
- `docs/architecture/indices/web-journey-index.csv`
- `docs/architecture/indices/api-surface-evidence-index.csv`
- `docs/architecture/indices/user-action-index.csv`

## Function Posture By Area

| Area | Current posture | What this means |
| --- | --- | --- |
| Auth/session | `verified` / latest production proof passing | Login/session core has the best evidence. Older invalid-token redirect failure is superseded by later same-day PASS proofs. |
| Public app shell | `partially verified` in production | Web and API public smoke pass. Build metadata is diagnostic-only `env-runtime`, so release provenance is not fully closed. |
| Dashboard runtime | `partially_verified` | Dashboard exists and has tests, but runtime data/positions/live widgets need fresh protected production proof. |
| Manual order | `verified_local` | Local proof exists. Approval-gated LIVE mutation proof and production readback are missing. |
| Runtime DCA/PnL | `verified_local` | Local proof exists for the latest DCA/PnL chain, but protected production readback is missing. |
| Positions | `verified_local` | Local/API proof exists. Production-safe positions clickthrough and LIVE/PAPER readback are missing. |
| Wallets | `verified_local` | UI/API proof exists locally. Fresh authenticated browser proof and approved LIVE/PAPER readback are missing. This matches the user's wallet concern as an unclosed proof/repair lane. |
| Bot setup/runtime | `verified_local` | Bot creation/runtime paths have local proof. Fresh production runtime readback and LIVE activation proof are missing. |
| Strategies | `verified_local` | Strategy screens and APIs are locally verified. Production mutation/readback proof is missing. |
| Markets | `verified_local` | Market UI/API behavior is locally verified. Production market mutation/readback proof is missing. Gate.io selected-market position creation requires a focused reproduction/proof lane. |
| Backtests | `verified_local` | Backtest API/Web behavior is well covered locally. Production-safe clickthrough and heavy replay performance proof are missing. |
| Reports | `verified_local` | Reports are locally verified. Production report readback is missing. |
| Logs/audit | `verified_local` | Logs are locally verified. Production action-produced readback is missing. |
| Exchange adapter | `verified_local` | Exchange adapters have strong local tests. Fresh approved production proof, especially Gate.io selected-market behavior and LIVE/PAPER parity, is missing. |
| Market data streams | `verified_local` | Local stream/adapter proof exists. Fresh live exchange stream proof is missing. |
| Subscriptions/admin | `verified_local` | Local admin/subscription proof exists. Production admin proof and checkout callback/provider proof remain separate. |
| AI assistant foundation | `verified_local` | Foundation exists, but hot-path AI trading is deferred and requires separate red-team proof before runtime authority. |
| Ops/config/release tooling | `verified_local` / partially blocked | Local tooling and guardrails are strong; protected production inputs and full Coolify/VPS readback remain blocked. |

## Current Production Evidence

Latest same-day production evidence supports this current posture:

- [LUC-5304](/LUC/issues/LUC-5304) public smoke passed for API `/health`, API
  `/ready`, Web `/`, and Web `/api/build-info` on SHA
  `42177530f2a2ddc22832133b545bccab6ab404eb`.
- [LUC-5304](/LUC/issues/LUC-5304) five-sample timing was healthy for Web `/`
  max `238 ms`, Web `/api/build-info` max `109 ms`, API `/health` max
  `107 ms`, and API `/ready` max `110 ms`; Web `/auth/login` had a watch-only
  WARN max `1169 ms`.
- [LUC-5304](/LUC/issues/LUC-5304) protected auth/session proof passed with
  redacted artifacts.
- [LUC-5252](/LUC/issues/LUC-5252) earlier API correlation found successful
  low-second tails on public API health/readiness, but no outage: `/health`
  30/30 `200`, `/ready` 30/30 `200`.
- [LUC-5298](/LUC/issues/LUC-5298) and [LUC-5300](/LUC/issues/LUC-5300)
  reconciled the stale protected-route redirect blocker. No Web auth runtime
  patch is currently required from that older failure.

## User-Reported Risk Interpretation

The user's observations are consistent with the current evidence model:

1. Gate.io may not create new positions in selected markets.
   - Current index posture: exchange adapter, markets, manual order, positions,
     and DCA/PnL are mostly `verified_local`.
   - Current conclusion: this is not disproven. It needs a focused
     production-safe reproduction/readback lane for Gate.io selected-market
     position creation and market-symbol mapping.

2. Wallet section may not work correctly across LIVE/PAPER exchanges.
   - Current index posture: wallets are `verified_local`, with missing fresh
     authenticated browser proof and approved LIVE mutation/readback.
   - Current conclusion: wallet production behavior is not fully verified.
     This should be treated as a real high-priority proof/repair lane.

3. DCA may not work correctly.
   - Current index posture: runtime DCA/PnL is `verified_local`, with missing
     protected production readback.
   - Current conclusion: local implementation evidence exists, but production
     runtime correctness is not proven. DCA should get a protected PAPER-first
     runtime proof before any LIVE claim.

4. Other documented functions may exist but not work end-to-end.
   - Current index posture: this is accurate. Many functions have local proof
     and architecture mapping, but not fresh protected production proof.
   - Current conclusion: Soar should not be sold or described as fully
     production-complete until the high-risk function proof lanes close.

## What Is Correctly Implemented Enough To Trust Today

Use this category carefully: it means current evidence is strong for the stated
boundary, not that every downstream workflow is production-complete.

| Function boundary | Confidence |
| --- | --- |
| Public Web/API reachability | Current production smoke passing. |
| Auth/session fail-closed behavior | Current protected auth/session production proofs passing. |
| Architecture/function index generation | Present and usable; current generated indexes report no critical gaps. |
| API surface map and Web journey map | Present and generated; useful for routing repair work. |
| Local implementation coverage across major modules | Broadly present; most major V1 areas are locally verified. |
| Guardrail and release tooling local checks | Strong locally, but protected production gates remain blocked. |

## What Is Still To Do

| Priority | Work | Owner lane |
| --- | --- | --- |
| P0 | Gate.io selected-market position creation proof/repair: reproduce with safe PAPER-first path, verify symbol mapping, order -> position creation, and position readback. | Integration Trading + Backend + QA |
| P0 | Wallet dashboard LIVE/PAPER readback proof/repair: verify balances, selected wallet state, exchange adapter data, and UI section rendering against approved safe data. | Backend + Frontend + Integration Trading + QA |
| P0 | Runtime DCA/PnL protected proof/repair: verify DCA trigger path, position/PnL updates, and fail-closed boundaries in production-safe PAPER mode before any LIVE claim. | Backend Runtime + Integration Trading + QA |
| P0 | Full Coolify/VPS/DB/worker read-only server-health projection after [LUC-4811](/LUC/issues/LUC-4811) bindings exist. | Security/Ops + DRE |
| P1 | Fresh protected browser proof for dashboard runtime, bots, markets, strategies, backtests, reports, logs, profile/API keys, and admin. | QA + Frontend + Backend |
| P1 | Production-safe readback for market data streams and exchange adapter parity. | Integration Trading + Backend |
| P1 | Release-grade build-info provenance: stop relying on diagnostic-only `env-runtime` before release claims. | Ops/Release |
| P1 | Convert the 39 high user-action proof gaps into a bounded proof queue ordered by money/exchange risk first. | QA/Test Automation + Product |

## Recommended Follow-Up Issue Set

The next work should not be one giant "fix everything" ticket. It should be
split into focused proof/repair lanes:

1. [LUC-5308](/LUC/issues/LUC-5308): Gate.io selected-market position creation
   proof and repair triage.
2. [LUC-5309](/LUC/issues/LUC-5309): Wallet dashboard LIVE/PAPER readback proof
   and repair triage.
3. [LUC-5310](/LUC/issues/LUC-5310): Runtime DCA/PnL PAPER-first protected
   proof and repair triage.
4. Protected function proof sweep for remaining high-risk user actions.
5. Coolify/VPS full server-health readback after [LUC-4811](/LUC/issues/LUC-4811)
   unblocks approved read-only bindings.

## Final Disposition

The current version of Soar has the planned V1 function inventory and broad
implementation coverage, but it is not fully production-proven. The app is
reachable and auth/session is currently healthy. The highest-risk remaining
work is production-safe proof and repair for exchange, wallet, position, DCA,
runtime, and protected dashboard flows.

No code, deploy, push, restart, rollback, env edit, secret/account readback,
database/Redis mutation, exchange action, order, position, payment/subscription
mutation, or live-trading action occurred during this report task.
