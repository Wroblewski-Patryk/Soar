# Dated MVP Implementation Limits and Current Boundaries

These MVP implementation notes were last reconciled in May 2026. The
[Current Version Product Contract](./current-version-contract.md) owns current
required scope. Statements about shipped behavior below require fresh
environment-specific proof; they are not current-version acceptance.

## Scope Boundaries (MVP)
- Current required exchange scope includes Binance and Gate.io for PAPER and
  LIVE. Exact market-type and operation support is governed by the
  [exchange capability matrix](../architecture/reference/exchange-access-ownership-matrix.md).
- Trading mode: paper + live available.
- Strategy model: flat rule model only (no deep nested logic trees).
- Historical order-book snapshots are not currently sourced by the backtest
  data gateway. `ORDER_BOOK_*` rules are supported in PAPER/LIVE runtime only;
  backtests now fail closed instead of returning misleading no-trade results.
- Derivatives indicators (`FUNDING_RATE_*`, `OPEN_INTEREST_*`, `ORDER_BOOK_*`)
  require a FUTURES market context. Bot writes reject these strategies for SPOT.
- Auth recovery: no forgot-password flow in MVP.
- Logs UX: dashboard logs supports core filtering (`source`, `actor`, `severity`) but no advanced query builder.
- Rate limiting: Redis-backed counters enabled, but no distributed abuse analytics or adaptive throttling.
- API key crypto: AEAD + key versioning shipped; no automated key rotation workflow yet.
- English and Polish are the current supported languages; complete route and
  production verification remains evidence-dependent.

## Operational Limits (MVP)
- Single-region deployment assumption.
- No formal SLO/SLA commitments yet.
- Manual incident handling with runbook guidance (no full incident automation).
- Backup/restore relies on infrastructure-level routines, not app-managed snapshots.
- LIVE wallet capital currently uses authenticated exchange balance as the
  runtime authority, but does not yet persist a full wallet cashflow ledger for
  deposits, withdrawals, transfers, fees/funding, and historical equity charting.
  Until that ledger ships, wallet performance analytics can show current balance
  and bot PnL-derived dashboard deltas, but cannot fully reconstruct all
  user-added or user-removed capital over time.

## Security and Risk Limits (MVP)
- User consent and audit logging are enforced for live-risk actions.
- Platform does not provide financial advice.
- No automated portfolio-level risk optimizer in MVP.
- No advanced anomaly detection on account behavior yet.

## Explicit Post-MVP Items (V1 Track)
- Additional exchanges beyond Binance and Gate.io (adapter-based rollout).
- Advanced risk controls (daily loss, drawdown, cooldowns).
- Full production observability stack (metrics + alerts + incident drills).
- Expanded logs explorer and decision-trace UX.
- Strategy import/export versioning and compatibility policy.
- Hardened auth recovery and account security workflows.
- LIVE wallet cashflow ledger and equity timeline, including user
  deposits/withdrawals/transfers and unclassified exchange adjustments.

## Release Note
Use this file with:
- `docs/operations/mvp-ops-runbook.md`
- `docs/security/mvp-risk-consent-text.md`
- `docs/planning/v1-live-release-plan.md`
