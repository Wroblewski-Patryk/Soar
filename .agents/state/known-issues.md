# Known Issues

Last updated: 2026-05-14

## Active Issues

- 2026-05-14 update: `V1-POST-V1-LEDGER-RECONCILIATION-2026-05-14` reconciles
  stale module-confidence and requirement/risk/quality rows with already
  accepted production proof artifacts. The module-confidence ledger now has
  `VERIFIED:22` and no `PARTIAL`, `IMPLEMENTED_NOT_VERIFIED`, `BROKEN`, or
  `BLOCKED` rows for the current V1 scope. Remaining mitigated risks represent
  explicit future/broader scope such as LIVE mutation boundaries, scheduled
  freshness, process hygiene, and Gate.io/second-LIVE expansion rather than
  hidden current blockers.

- 2026-05-14 update: `V1-POST-V1-WALLET-BOT-CLEANUP-HARDENING-2026-05-14`
  closes a local backend hardening slice: bot deletion now removes bot-owned
  runtime/trading artifacts in one transaction while preserving the strategy,
  and PAPER wallet reset fails closed while an active bot uses the wallet.
  Wallets still require production-safe browser clickthrough before the
  module-confidence row can move from `PARTIAL` to `VERIFIED`.

- 2026-05-14 update: `V1-POST-V1-DASHBOARD-RUNTIME-LEDGER-CLOSURE-2026-05-14`
  closes stale Dashboard Home and Bot Runtime partial ledger rows for the
  current non-Gate.io V1/post-V1 scope. Local rendered/browser proofs plus
  production route and runtime readbacks cover the approved Dashboard Home and
  Bot Runtime operator truth. `RISK-002` and `RISK-003` are closed. Gate.io/
  second-LIVE production shape and LIVE mutation proof remain separate.

- 2026-05-14 update: `V1-POST-V1-AUTH-DEPLOY-RERUN-2026-05-14` closes the
  Auth stale-token replay issue found on deployed `2fc90a08`. The fixed build
  `84711599` is deployed, production build-info matches, and
  `docs/operations/prod-auth-session-browser-proof-84711599-2026-05-14.md`
  passed: unauthenticated protected route redirects to `/auth/login`,
  authenticated dashboard renders, invalid token redirects to
  `/auth/login?session=expired`, logout returns `200`, direct reuse of the
  pre-logout token returns `/auth/me` `401`, and dashboard after logout
  redirects to `/auth/login`. No active Auth blocker remains for this signal.

- 2026-05-14 update: literal V1 "100%" is no longer blocked in the tracked V1
  evidence model. Final generated state is `GO` with `PASS:21`, static findings
  `0`, implementation estimate `100%`, evidence coverage `100%`, and release
  readiness `100%`. Production proof now covers the disposable fixture/action
  set, Security/Privacy, Exchange Adapter, Positions, UX/A11y/Mobile, protected
  operations, workers, rollback, restore, runtime freshness, release gate, and
  runtime readbacks. LIVE order/cancel/close, unsafe LIVE position mutation,
  and existing production data mutation remain blocked without separate
  explicit approval.

- 2026-05-14 update: `V1-PROTECTED-OPS-GATE-457BCE05-2026-05-14` confirms the
  latest deployed `457bce05` candidate is public-smoke healthy and protected
  runtime/rollback/UI/LIVEIMPORT/RC/activation/restore healthy and release-ready.
  Build-info matches `457bce05338310c198c03a973395a9176f298dc1`; public
  API/Web smoke, protected runtime freshness, rollback proof, authenticated
  production UI clickthrough, controlled no-order-guard `LIVEIMPORT-03`, RC
  strict evidence, and activation audit/plan pass or are fresh for 2026-05-14.
  Production restore drill passed through the VPS Docker SSH context and the
  full non-dry-run release gate reports `Readiness: ready`. There is no active
  Operations blocker for the current protected release gate.

- 2026-05-14 update: V1 LIVE/PAPER simultaneous runtime evidence is now closed
  for the current production non-Gate.io scope. Local DB-backed API/runtime and
  Web Dashboard proof remains green (`25/25` API tests, `24/24` Web tests).
  Controlled no-order-guard production proof activated the existing Binance
  LIVE bot only for the observation window, verified `LIVEIMPORT-03` for
  `TRXUSDT`, captured a simultaneous read-only runtime snapshot where the
  Binance LIVE bot and both Binance PAPER bots were RUNNING, then deactivated
  the LIVE bot. Post-cleanup readback confirms the LIVE bot is inactive again.
  Gate.io/second-LIVE production shape remains unavailable/deferred rather
  than a hidden blocker for this release slice.

- 2026-05-13 update: `V1-TARGET-RELEASE-GATE-PASS-00169D7F-2026-05-13`
  resolves the active V1 production target blocker set. `LIVEIMPORT-03` passed
  for `TRXUSDT`, final preflight has no blockers, and the production
  target-only gate reports `Readiness: ready`. Remaining environment issue:
  the full local gate artifact is `not_ready` because Docker Desktop is not
  available for `pnpm run test:go-live:smoke` on this workstation, after
  guardrails, typecheck, and build had already passed.

- 2026-05-13 superseded update:
  `V1-CURRENT-DAY-BLOCKER-REFRESH-00169D7F-2026-05-13` previously confirmed
  V1 was `NO-GO` on current-day evidence before protected credentials and
  controlled LIVE proof were completed. Production build-info
  and public smoke pass for deployed
  `00169d7fdc3aff8317759137b05594b20e773c8e`, but protected input names are
  absent in the current Codex shell, production UI clickthrough is fresh
  `BLOCKED_AUTH`, `LIVEIMPORT-03` is still missing, and daily release
  artifacts that require protected or operator inputs are stale for
  2026-05-13. This is retained only as historical blocker evidence; the
  current V1 target gate status is the `V1-TARGET-RELEASE-GATE-PASS` entry
  above.

- 2026-05-12 update: `V1-PROTECTED-INPUT-READINESS-CURRENT-SWEEP-00169D7F-2026-05-12`
  confirms the current Codex shell still has no protected input environment
  variable names for the V1 unblock sequence, including `LIVEIMPORT_READBACK_*`,
  `ROLLBACK_GUARD_*`, and `PROD_UI_AUDIT_*`. No secret values were printed or
  stored. V1 remains blocked until approved auth and real Gate 4 approver
  fields are available.

- 2026-05-12 update: `V1-PROD-UI-CURRENT-BLOCKED-REFRESH-00169D7F-2026-05-12`
  replaces stale production UI clickthrough classification with current
  blocked truth for deployed build-info
  `00169d7fdc3aff8317759137b05594b20e773c8e`. Public routes pass and
  protected dashboard/admin/legacy routes fail closed to `/auth/login`, but
  this is not V1 acceptance evidence because approved `PROD_UI_AUDIT_*`
  dashboard/admin auth is still missing.

- 2026-05-12 update: `V1-RELEASE-GATE-NONDRYRUN-BLOCKED-2026-05-12` confirms
  the final production gate still blocks without protected auth. Build-info
  and public smoke pass, but protected `/workers/health` returns `401` during
  deploy smoke.

- 2026-05-12 update: `V1-OPERATOR-UNBLOCK-PACKET-00169D7F-2026-05-12`
  publishes the current no-secret operator handoff for finishing V1. The
  packet does not change `NO-GO`; it makes the remaining protected steps
  executable once auth and approver inputs are available.

- 2026-05-12 update: `V1-FINAL-PREFLIGHT-CURRENT-2026-05-12` refreshed the
  no-secret final preflight for deployed build-info
  `00169d7fdc3aff8317759137b05594b20e773c8e`. Build-info and public smoke
  pass, but preflight remains `blocked` on missing `LIVEIMPORT_READBACK_*`,
  missing `ROLLBACK_GUARD_*`, failed RC evidence, missing `LIVEIMPORT-03`, and
  failed rollback proof.

- 2026-05-12 update: `V1-ROLLBACK-PROOF-BLOCKED-REFRESH-2026-05-12`
  removes stale rollback proof classification from the current Operations
  blocker list. The new rollback proof is fresh but `FAIL` because protected
  runtime freshness and alerts endpoints returned `401`; this correctly keeps
  V1 blocked until approved rollback guard auth is available.

- 2026-05-12 update: `V1-RC-BLOCKED-REFRESH-2026-05-12` removes stale RC
  sign-off/checklist classification from the current Operations blocker list.
  RC external gates, sign-off, and checklist are fresh for 2026-05-12 but
  correctly `failed`/`OPEN` because Gate 4 approver fields are missing. V1
  remains blocked by missing LIVEIMPORT-03, failed rollback proof, and
  approved prod ops auth.

- 2026-05-12 update: `V1-PRODUCTION-ACTIVATION-REFRESH-2026-05-12`
  removes stale activation audit/plan from the current Operations blocker list.
  The new activation artifacts are fresh for 2026-05-12 and explicitly
  `NO-GO`. Remaining issue is now narrowed to protected/formal evidence:
  RC Gate 4/sign-off, LIVEIMPORT-03, rollback proof, and approved prod ops auth.

- 2026-05-12 update: `V1-PROD-RESTORE-DRILL-REFRESH-2026-05-12`
  removes stale production backup/restore evidence from the current Operations
  blocker list. The isolated production restore drill passed with cleanup
  proof (`LEFTOVER_RESTORE_DATABASES=0`, `LEFTOVER_BACKUPS=0`), and release
  gate dry-run now classifies backup/restore as `fresh` for 2026-05-12. V1
  remains blocked by failed RC Gate 4/checklist/sign-off, missing
  LIVEIMPORT-03, stale rollback proof, and missing approved protected prod ops
  auth.

- 2026-05-12 update: `V1-OPERATIONS-PROD-READONLY-PROOF-2026-05-12`
  confirms production public health but not V1 release readiness. Public
  production no-worker smoke and `/health`/`/ready` pass, and VPS Docker
  containers are running. Stage public smoke is `503`. Full production release
  gate remains `not_ready` because protected `/workers/health` returns `401`
  without approved app/operator auth, `LIVEIMPORT-03` production readback is
  missing, Gate 4 is not approved, and production activation/sign-off/
  backup-restore/rollback artifacts were stale before the current refreshes.

- 2026-05-12 update: `V1-OPERATIONS-LOCAL-PROOF-2026-05-12` partially closes
  local Operations uncertainty but keeps release approval blocked. Local
  rollback proof, short SLO collection/window report, local RC gate pipeline,
  and local release gate passed their non-destructive checks, but Gate 4
  sign-off remains blocked and LIVEIMPORT-03 local readback failed because no
  LIVE bots/running import sessions were available. Remaining issue is approved
  production/stage Operations evidence and sign-off.

- 2026-05-12 update: `V1-SUBSCRIPTIONS-ADMIN-LOCAL-PROOF-2026-05-12`
  closes the local Subscriptions/Admin proof gap. API/Web tests prove admin-
  only access, subscription catalog/entitlement validation, user list metadata,
  role/plan actions, self-demotion blocking, and admin UI loaded/error/action
  states. Local protected admin route audit passes, and Edge/CDP screenshots
  render `/admin/subscriptions` and `/admin/users` with no framework overlay.
  Remaining issue is production admin clickthrough with approved non-
  destructive data.

- 2026-05-12 update: `V1-UX-A11Y-MOBILE-LOCAL-PROOF-2026-05-11` closes the
  local UX/A11y/Mobile proof gap. Focused Web UX/a11y/state tests pass, local
  authenticated route audit passes, Edge/CDP screenshots cover representative
  desktop/mobile dashboard states, mobile menu interaction works, no framework
  overlay appears, and CDP console/exception proof has zero events. Remaining
  issue is production browser clickthrough and external accessibility review.

- 2026-05-11 update: `V1-SECURITY-PRIVACY-LOCAL-PROOF-2026-05-11` closes the
  local Security/Privacy proof gap. API/Web tests prove fail-closed auth,
  ownership isolation, trusted-origin and ops-network boundaries, no-store and
  security headers, critical secret readiness, crypto/keyring behavior, API
  error redaction, rate-limit degradation, API-key secrecy/probes, Profile
  security actions, stage abuse throttling, and Web auth/profile guard states.
  Remaining issue is production-safe protected security proof and external/
  independent security review.

- 2026-05-11 update: `V1-WORKERS-LOCAL-PROOF-2026-05-11` closes the local
  Workers proof gap. API Workers/stream/runtime tests prove worker topology
  ownership, split/inline readiness, protected worker health, runtime
  freshness pass/fail/skip behavior, protected `/ready` diagnostics, market-
  stream fanout/source/subscription behavior, queue tuning, backtest job
  persistence, execution/runtime orchestration, and PAPER runtime-flow
  telemetry. Remaining issue is production-safe protected worker/process proof
  for deployed health/readiness/freshness, queue/process lifecycle, and
  observability.

- 2026-05-11 update: `V1-EXCHANGE-ADAPTER-LOCAL-PROOF-2026-05-11` closes the
  local Exchange Adapter proof gap and fixes Gate.io public catalog symbol
  normalization from generic adapter ids like `BTC_USDT` to canonical Soar
  symbols like `BTCUSDT`. API/Web tests prove probes, capability contracts,
  public/authenticated reads, connector factory/registry, live adapter retry/
  fill/fee boundaries, symbol rules, metadata, snapshot normalization, runtime
  exchange guards, and UI capability/profile API-key integration. Remaining
  issue is production-safe exchange-boundary proof; real live mutation remains
  blocked-risk without an explicit safe plan.

- 2026-05-11 update: `V1-LOGS-AUDIT-LOCAL-PROOF-2026-05-11` closes the local
  Logs/Audit Trail proof gap. API/Web tests prove unauthenticated rejection,
  owner-only log reads, source/actor/severity filters, pagination defaults/
  bounds, action-produced audit event visibility, `/dashboard/logs` route
  shell, empty/loaded states, severity filter request payload, metadata trace
  rendering, and route-reachable locale copy. Remaining issue is production-
  safe Logs/Audit Trail browser clickthrough.

- 2026-05-11 update: `V1-REPORTS-LOCAL-PROOF-2026-05-11` closes the local
  Reports proof gap. API/Web tests prove weighted BACKTEST report aggregation,
  PAPER trade aggregation, `/dashboard/reports` route shell, empty state,
  aggregated cards/tables, and route-reachable locale copy. Remaining issue is
  production-safe Reports browser clickthrough; export/download is outside the
  current implemented Reports surface.

- 2026-05-11 update: `V1-BACKTESTS-LOCAL-PROOF-2026-05-11` closes the local
  Backtests proof gap. API/Web tests prove run create/list/get/delete,
  explicit range validation, pending report lifecycle, worker/job persistence,
  replay/fill/timeline behavior, strategy-to-backtest-to-paper/live parity,
  venue consistency, market-universe symbol formula, fail-closed empty
  symbols, failed parity diagnostics, route shells, create form, run details,
  table actions, core-data hook, view-models, pair metrics, trade segments,
  and timeline overlays. Remaining issue is production-safe Backtests browser
  clickthrough on approved representative RSI strategy and market data.

- 2026-05-14 update: Orders now has production-safe PAPER action proof on
  deployed `457bce05`. API/Web tests prove list/read/open/cancel/close,
  active-only filtering, exchange-backed cancel boundary, exchange event
  reconciliation, fills, fees, fee backfill, live fill resolution, quantity
  rules, position scope, source labels, and open-order cancel actions. The
  production fixture proof opened a disposable PAPER limit order, read it back,
  proved cancel fail-closed without `riskAck`, canceled it with `riskAck`, and
  verified terminal `CANCELED` readback. LIVE mutation remains blocked-risk
  without an explicit safe plan.

- 2026-05-11 update: `V1-POSITIONS-LOCAL-PROOF-2026-05-11` closes the local
  Positions proof gap. API/Web tests prove list/read ownership, symbol filter
  normalization, stale local exclusion, live status scoping, exchange snapshot
  selection/fail-closed behavior, authenticated snapshots, takeover
  classification/rebind, orphan repair, imported lifecycle history,
  reconciliation diagnostics, manual TP/SL safety, management-mode guards,
  runtime visibility, close flows, external DCA separation, runtime PnL
  derivations, and ignored/closed/pending close UI states. Remaining issue is
  production-safe Positions browser clickthrough; LIVE mutation remains
  blocked-risk without an explicit safe plan.

- 2026-05-14 update: Manual Orders now has production-safe PAPER action proof
  on deployed `457bce05`. API/Web tests prove manual context, PAPER market
  placement, validation, lifecycle readback, cancel/close, selected-bot scope,
  quantity rules, ownership isolation, LIVE risk guards, exchange-backed
  fail-closed cancel behavior, open-order source/cancel actions, and Dashboard
  Home submitted/waiting/ready/imported/position-opened/blocked states. The
  production fixture proof read manual order context, opened a disposable PAPER
  limit order, read it back, proved cancel fail-closed without `riskAck`,
  canceled it with `riskAck`, and verified terminal `CANCELED` readback. LIVE
  order actions remain blocked-risk without an explicit safe plan.

- 2026-05-11 update: `V1-STRATEGIES-LOCAL-PROOF-2026-05-11` closes the local
  Strategies proof gap. API/Web tests prove strategy CRUD, export/import,
  clone payloads, config validation, indicator catalog behavior, ownership
  isolation, active-bot update/delete blocking, inactive-bot update allowance,
  form mapping, numeric normalization, close validation, and taxonomy.
  Remaining issue is production-safe Strategies browser clickthrough plus
  representative runtime/backtest compatibility proof.

- 2026-05-11 update: `V1-MARKETS-LOCAL-PROOF-2026-05-11` closes the local
  Markets proof gap. API/Web tests prove market universe CRUD, symbol
  composition, catalog import, placeholder capability guards, active-bot
  update/delete blocking, inactive-bot edit/delete, stale legacy link handling,
  ownership isolation, preview composition, empty preview submit, placeholder
  submit, table clone payload, and route shells. Remaining issue is
  production-safe Markets browser clickthrough.

- 2026-05-11 update: `V1-WALLETS-LOCAL-PROOF-2026-05-11` closes the local
  Wallets proof gap. API/Web tests prove wallet CRUD, ownership isolation,
  active-bot edit/delete guards, LIVE key/allocation validation, balance
  preview allocation and fail-closed paths, paper reset guards, cashflow/open-
  PnL scoping, route wrappers, list/create/edit/preview states, reset
  success/error, partial ledger, and unavailable ledger fail-closed UI.
  Remaining issue is production-safe Wallets browser clickthrough.

- 2026-05-11 update: `V1-PROFILE-LOCAL-PROOF-2026-05-11` closes the local
  Profile basic/security proof gap. API/Web tests prove profile save
  success/error, timezone persistence/rejection, unauthenticated security
  rejection, password mismatch fail-closed behavior, valid-current-password
  change, weak/invalid password rejection, old-login failure/new-login success,
  and account deletion password confirmation. Remaining issue is production-
  safe Profile browser clickthrough.

- 2026-05-11 update: `V1-PROFILE-API-KEYS-LOCAL-PROOF-2026-05-11` closes the
  local Profile API Keys proof gap. API/Web tests prove encrypted storage,
  masked responses, owner-only lifecycle actions, Binance/Gate.io probes,
  audit metadata redaction, placeholder probe fail-closed behavior, and UI
  connection-test/delete-risk guards. Remaining issue is production-safe
  browser clickthrough and audit-log visibility.

- 2026-05-11 update: `V1-AUTH-SESSION-LIFECYCLE-PROOF-2026-05-11` closes the
  local Auth session lifecycle proof gap. API and focused Web tests prove
  login cookie TTLs, logout fail-closed behavior, deleted-user and expired-JWT
  session expiry, duplicate-token precedence, AuthProvider logout/expired
  warning behavior, API interceptor expired-session redirect, middleware cookie
  gate, and login fail-closed handling. Remaining Auth issue is
  production-safe browser clickthrough.

- 2026-05-11 update: `V1-BOT-RUNTIME-COMPLETED-SESSION-FIXTURE-2026-05-11`
  closes the local stopped/completed-session proof gap for Bot Runtime. The
  approved PAPER snapshot import now creates one deterministic completed
  session, and API/browser proof shows the completed filter rendering
  completed PAPER state with zero open positions. Worker telemetry is now
  covered by `V1-BOT-RUNTIME-WORKER-TELEMETRY-PROOF-2026-05-11`; remaining
  Bot Runtime issue is production-safe/non-local clickthrough.

- 2026-05-11 update: `SOAR-BOT-RUNTIME-001` now has local authenticated
  browser evidence for the canonical Bot Runtime route with a representative
  PAPER `RUNNING` session. API sessions, aggregate, positions, symbol stats,
  and trades returned `200`; the UI rendered bot `asd`, PAPER mode, running
  status, three symbols, wallet KPI text, responsive desktop/tablet/mobile
  states, safe view switch, and legacy runtime redirects to preview. The row
  remains `PARTIAL` because production-safe/non-local clickthrough is still
  open.

- 2026-05-11 update: `V1-BOT-RUNTIME-WORKER-TELEMETRY-PROOF-2026-05-11`
  closes the local worker telemetry/live-loop proof gap. Focused
  `runtime-flow.e2e.test.ts` evidence proves a real `RuntimeSignalLoop` PAPER
  lifecycle writes runtime sessions, events, symbol stats, positions, and
  aggregate data read back through authenticated Bot Runtime APIs.

- 2026-05-11 update: `V1-DASHBOARD-HOME-RUNTIME-SESSION-FIXTURE-2026-05-11`
  fixed the local active Dashboard proof gap found earlier in the day. The
  approved PAPER snapshot import now creates the missing wallet/session/stat/
  event data needed by the existing runtime API contract, and local browser
  proof renders 3 open PAPER positions. Remaining Dashboard Home issue is
  production-safe clickthrough/non-local proof, plus restricted-network
  resource console noise classification during local browser runs.

- 2026-05-11 update: `SOAR-DASHBOARD-001` now has local authenticated browser
  evidence for Dashboard Home empty/onboarding state on desktop and mobile,
  with console health clean after the shared `ThemeSwitcher` hydration-noise
  fix. The row remains `PARTIAL` because representative active runtime data
  was not available for selected-bot wallet KPI/table tab browser proof, and
  tablet/touch plus production-safe clickthrough remain open.

- 2026-05-11 update: `SOAR-BOTS-001` is no longer `BROKEN` for the local
  active PAPER delete controller path. `BOT-DELETE-ACTIVE-PAPER-2026-05-11`
  removed the misleading LIVE confirmation from active PAPER deletion while
  preserving LIVE/live-opt-in confirmation. Local evidence passed, but the
  row remains `PARTIAL` until production-safe clickthrough or operator
  confirmation proves the reported UI failure is gone.

- 2026-05-11 update: current V1 percentages are defined by
  `docs/operations/v1-completion-scorecard-2026-05-11.md`, not by intuition.
  The scorecard reports implementation estimate `70.7%`, evidence coverage
  `38.9%`, and release readiness `26.9%`. This explains why a lot of code can
  exist while V1 still feels unreliable: most module actions still lack
  accepted proof, and all 13 P0 rows are not release-ready.

- 2026-05-10 update: the current consolidated V1 state entrypoint is
  `docs/operations/v1-master-state-ledger-2026-05-10.md`. Use it before
  future broad audit or repair work. It keeps V1 at `NO-GO` and classifies the
  state into module buckets: `toProve: 7`, `blocked: 2`, and
  `doneLocalNeedsProdProof: 12`. It also carries all 50
  static findings with buckets for missing proof, capability-gate review,
  concrete Web/API/test/doc gaps, queue cleanup, and planning classification.

- 2026-05-10 update: static V1 inconsistency scan is available at
  `docs/operations/v1-static-issue-scan-2026-05-11.md`. The scan reports 54
  findings (`P0: 5`, `P1: 12`, `P2: 33`). Most P0/P1 items are proof gaps
  from the V1 action matrix, not confirmed code bugs. Concrete surface/test/doc
  gaps that need triage: empty Web `orders`, no `/dashboard/orders` or
  `/dashboard/positions` page, no focused Web `positions` tests, no focused API
  `subscriptions` tests, Web orders/positions docs still described as
  placeholders, and unchecked queue markers that need blocked/executable/
  historical classification.

- 2026-05-11 update: Dashboard Home now has additional rendered local proof
  for loading state, retryable error state, selected-bot switching across two
  active PAPER bots, selected wallet KPI recalculation, open-orders tab data,
  trade-history tab data, and suppression of stale previous-bot rows.
  Remaining Dashboard Home risk is browser-level responsive/keyboard proof
  plus production-safe clickthrough.
  Evidence:
  `docs/planning/v1-dashboard-home-selected-bot-rendered-audit-task-2026-05-11.md`.

- 2026-05-10 update: Dashboard runtime table presenter/action audit is locally
  closed for the high-risk table slice. Focused tests cover prospective TTP
  hiding at zero/negative PnL, backend/runtime TTP precedence, TSL-only display,
  negative PnL styling, non-actionable position actions, local open-order
  cancel, terminal order read-only behavior, and exchange-backed cancel blocked
  rows.

- 2026-05-10 update: the rendered Dashboard Home component now has focused
  local proof that a negative-PnL position does not display prospective TTP,
  while the TTP column remains present. This closes the first rendered
  component bridge for the operator-reported TTP issue. Remaining Dashboard
  Home risk is still broader than this single rendered case.

- 2026-05-10 update: Bots action audit is locally closed for safe fixtures.
  Remaining risk is not an unverified Bots implementation contract; it is
  production-safe action clickthrough and the rest of the product action matrix
  outside Bots, especially Dashboard runtime tables.

- 2026-05-10 update: V1 readiness is no longer limited to protected/formal
  release evidence. Operator-reported UI/action failures showed that previous
  route/module audits overstated functional readiness. The active product
  issue is action-level coverage: every module action in
  `docs/operations/v1-product-action-audit-matrix-2026-05-10.md` must be
  verified as `PASS` or carried as an explicit `BLOCKED_*` item with a safe
  operator plan.

- 2026-05-10 update: the first two confirmed P0 product regressions are fixed
  locally and covered by focused tests: bot deletion now clears runtime dedupe
  references before deleting a bot, and prospective TTP display is hidden when
  live PnL is not positive. Production still needs deployment and
  non-destructive action proof after the commit reaches build-info.

- 2026-05-10 update: controlled LIVE session proof should wait until
  `LIVE-RUNTIME-KILL-SWITCH-CONFIG-2026-05-10` is deployed and the production
  API/execution-worker env has `RUNTIME_LIVE_GLOBAL_KILL_SWITCH=true` and/or
  `RUNTIME_LIVE_EMERGENCY_STOP=true`. The follow-up readiness diagnostics task
  adds protected `/ready/details` evidence for
  `runtimeSafety.liveNoOrderGuard.active=true`; do not activate a LIVE bot for
  proof until that diagnostic is deployed and confirms the running process sees
  the guard. This precondition is now satisfied on production for
  `b139152672aa9f6b0e26f1cab5ba0203beb54741`, but LIVE activation remains a
  money-impacting operator step and still requires a narrow observation window.
  Without those flags, activating a LIVE bot can reach real order orchestration
  if a strategy emits an entry signal.

- 2026-05-10 update: controlled LIVE proof is planned but not executed.
  Preactivation `LIVEIMPORT-03` on `b1391526` confirms the configured LIVE
  Binance Futures bot still has `NO_RUNNING_SESSION`. The task is blocked on
  explicit operator approval for a short LIVE activation window. Evidence:
  `docs/planning/controlled-live-session-proof-task-2026-05-10.md` and
  `docs/operations/_artifacts-liveimport-readback-preactivation-b1391526-2026-05-10.json`.

- 2026-05-10 update: the Binance key-readiness blocker is closed after
  deployment of `8cd5c1b3`. Stored key production test now passes with both
  Spot and Futures permissions true. The remaining live-runtime blocker is
  `LIVEIMPORT-03` returning `NO_RUNNING_SESSION`; a controlled runtime session
  proof is still required before V1 can claim live readback readiness. Evidence:
  `docs/operations/prod-api-runtime-readiness-8cd5c1b3-2026-05-10.md`.

- 2026-05-10 update: before
  `FUTURES-ONLY-APIKEY-ACCEPTANCE-2026-05-10`, a Futures-only key could still
  fail profile validation because the generic probe treated missing Spot as
  total failure. This is fixed locally and pending deployment. After deploy,
  production key readiness must be rerun with the corrected endpoint before
  deciding whether the LIVE Futures bot can be started.

- 2026-05-10 update: the production Binance key probe evidence in
  `PROD-API-RUNTIME-READINESS-F3CB9A24-2026-05-10` is ambiguous, not
  authoritative. The operator confirmed the key is Futures-capable; local code
  review found the probe relied on implicit CCXT balance-scope defaults and
  sequential scope checks. `BINANCE-FUTURES-APIKEY-PROBE-SCOPE-FIX-2026-05-10`
  fixes this locally by probing scopes independently and passing explicit
  Binance Futures balance params. The fixed probe still needs deployment and a
  production rerun before key readiness is accepted.

- 2026-05-10 update: LIVE Binance Futures startup is blocked by production
  account/runtime readiness, not by route reachability. Authenticated API
  modules are reachable, but the stored Binance key probe reports
  `spot: true` and `futures: false`; `LIVEIMPORT-03` also cannot pass because
  the configured LIVE bot has no running runtime session. Do not start the
  LIVE Futures bot until the Binance Futures key is remediated and readback is
  rerun successfully. Evidence:
  `docs/operations/prod-api-runtime-readiness-f3cb9a24-2026-05-10.md`.

- 2026-05-10 update: authenticated/admin production UI route/module
  reachability is no longer blocked after
  `PROD-UI-AUTH-CLICKTHROUGH-39A52703-2026-05-10`. The current PASS evidence
  covers route/module reachability only; deeper production action/form
  clickthrough, live-money actions, `LIVEIMPORT-03`, rollback proof PASS,
  Gate 2 SLO, and RC approval remain separate V1 proof lanes. Evidence:
  `docs/operations/prod-ui-module-clickthrough-39a52703-2026-05-10.md`.
- 2026-05-10 update: the architecture function audit's local implementation
  and docs findings are closed by
  `V1-ARCH-BOUNDARY-CLEANUP-2026-05-10`. API-key probe CCXT client
  construction now lives behind `modules/exchange`, and Gate.io runtime/
  exchange docs are refreshed. Remaining V1 issues are protected proof and
  formal approval lanes, not this local architecture mismatch. Evidence:
  `docs/planning/v1-architecture-boundary-cleanup-task-2026-05-10.md` and
  `docs/operations/v1-architecture-function-audit-2026-05-10.md`.
- 2026-05-10 update: function/module coverage audit confirms the remaining V1
  issue is not a broad missing implementation backlog, but protected proof and
  formal release approval. V1 remains blocked on `LIVEIMPORT-03` protected
  runtime readback, rollback proof PASS, authenticated/admin production UI
  clickthrough, authenticated Gate 2 SLO, RC approval/sign-off/checklist, and
  final non-dry-run release gate. Evidence:
  `docs/operations/v1-function-coverage-audit-2026-05-10.md`.
- 2026-05-10 update: final no-secret preflight for production build-info
  `8220532920e484da9ddaa021ac64b5de4cc5e6e1` is current and `BLOCKED`.
  Build-info, public smoke, activation artifacts, and production restore drill
  are fresh/satisfied; remaining blockers are liveimport auth/readback,
  rollback guard auth/proof PASS, RC external gates/sign-off/checklist, and
  authenticated/admin UI proof. Evidence:
  `docs/operations/v1-final-preflight-82205329-2026-05-10.md`.
- 2026-05-10 update: latest no-auth production UI audit for build-info
  `88313309200d35275ba6c0d3465c5045c4b6d99e` passes public routes and shows
  dashboard/admin/legacy protected routes as `BLOCKED_AUTH` redirecting to
  `/auth/login`. This is current fail-closed evidence only; full UI module
  clickthrough still requires valid production dashboard/admin auth and
  representative data. Evidence:
  `docs/operations/prod-ui-module-clickthrough-88313309-2026-05-10.md`.
- 2026-05-10 update: the current production V1 release-gate dry-run for
  build-info `8f8630b0ad5abd690409d6173c9b247b95948138` is `not_ready`.
  Remaining release-gate blockers are failed RC external gates, failed RC
  sign-off, failed RC checklist, missing `LIVEIMPORT-03` runtime readback,
  failed rollback proof, and the fact that production release gate still needs
  a non-dry-run execution once protected inputs are available. Evidence:
  `docs/operations/v1-release-gate-prod-2026-05-10Tcurrent-buildinfo-dry-run.md`.
- 2026-05-10 update: RC Gate 2 SLO evidence cannot be completed without
  protected ops auth. A one-minute no-auth production SLO probe produced
  blocker evidence only: `/health` PASS, `/ready` transient 50% availability
  in the short window, protected workers/metrics/alerts `401`, and queue/API/
  live-order metrics `NO_DATA`. Follow-up public smoke passed, so treat the
  `/ready` result as a monitoring signal and keep Gate 2 blocked on an
  authenticated 30-minute SLO run.
- 2026-05-10 update: authenticated/admin production UI clickthrough remains
  blocked on app/admin auth. The new `ops:ui:prod-clickthrough` runner proves
  public route reachability and fail-closed protected redirects, but the
  accepted V1 UI proof still requires a rerun with production dashboard/admin
  credentials and representative data.
- 2026-05-10 update: rollback proof is fresh for the current evidence date but
  still failed, as expected, because no protected `ROLLBACK_GUARD_*` auth is
  available. The production rollback guard endpoints returned protected `401`
  responses, so the proof correctly reports `shouldRollback=true` and must not
  be treated as release PASS evidence.
- 2026-05-10 update: production restore drill is fresh again for the current
  evidence date. Approved Coolify terminal access produced PASS evidence and
  no-secret preflight now treats production DB restore context as satisfied by
  evidence. This closes only the restore-context lane; remaining V1 blockers
  are liveimport app auth/readback, rollback guard auth/proof, real RC approval
  evidence, and authenticated/admin production UI clickthrough.
- 2026-05-10 update: the `e70f5cf6` deploy lag is superseded. Coolify showed
  stale `soar-api` jobs still queued/in progress after production Web
  build-info had advanced. The stale jobs were cancelled through the
  operator-approved Coolify UI, one fresh `soar-api` redeploy finished on
  `33a2ebc468be3dbfab7c784f375672ebead5ae16`, public API/Web smoke passed,
  and the Coolify queue was empty. Future agents should inspect Coolify before
  pushing another batch when the queue is non-empty.
- Local Docker Desktop `desktop-linux` context is unhealthy on this
  workstation and can return pipe `500 Internal Server Error`, but the
  `default` Docker context and local Postgres/Redis ports were reachable on
  2026-05-08. DB-backed runtime e2e packs passed sequentially after verifying
  the reachable stack. Future runs should check both contexts/ports before
  declaring DB-backed validation blocked.
- Production build-info reached
  `1100b7fb232ce6195b24522a6a11559fe9fb8634`, which contains the V1 backend
  parity runtime fix, blocker evidence alignment, deploy-wait coordination
  docs, live-import release-gate evidence enforcement, build-info freshness
  enforcement, and strict RC approval evidence enforcement. Do not use GitHub
  Actions for production deployment; the operator confirmed that path is not
  allowed and creates unwanted email noise. If a future task depends on a
  pushed commit being deployed, wait for build-info before continuing.
- Production build-info later reached
  `90cd07d602f0a31f315719b8a5cd5be3fd112313`, which contains the Gate.io
  fail-closed regression batch through `EXCHANGE2-19`; public API/Web smoke
  passed. This closes the immediate deploy-freshness lag for that batch, but
  protected/authenticated UI audit and release evidence remain blocked on
  credentials/access.
- After the c50e1e7c evidence/public-access batch was pushed, `origin/main`
  advanced to `1f1d9c12e0cc99884eced81546802a261b0925e9` while production
  build-info remained on `c50e1e7cf1e37d9c799031cacbb30a834f57e81d` for a
  full 900-second wait, two additional 300-second follow-up waits, and a later
  180-second follow-up wait. Treat this as a deploy lag note, not protected
  runtime or final V1 evidence. Current
  shell also has no Coolify deploy hook/API token env names and no working
  authenticated SSH/VPS inspection context.
- 2026-05-09 update: production build-info later advanced to `d355df93`,
  closing that prior handoff lag, and then to the Gate.io source batch
  `010b4f8b6abfaf4c24d26550eb4761215d119f21`. The temporary
  pushed-but-not-deployed classification for `010b4f8b` was caused by using an
  incorrect full SHA in the first wait, not by an actual production lag.
- Final V1 preflight previously depended on global `pnpm` for its internal
  public deploy checks and could falsely report build-info/public-smoke
  blockers on this workstation. The command now invokes bundled Node scripts
  directly for those checks; remaining preflight blockers after deployed
  `90cd07d6` are protected auth/readback, rollback auth/proof, and RC Gate 4
  approval evidence.
- Production restore drill is no longer an active blocker after the approved
  Coolify terminal PASS evidence. `ops:release:v1:preflight` now treats fresh
  restore evidence as satisfying the production DB restore context
  prerequisite, while raw env prerequisite evaluation remains fail-closed.
  Remaining V1 preflight blockers are protected live-import auth/readback,
  rollback guard auth/proof, and real RC Gate 4 approval evidence.
- Production deployment freshness initially lagged after the pushed V1 audit
  candidate, but a later build-info wait passed and production now reports
  `1f816362c93e117e47cfe52a35e0fec93bd0b37d`.
- After the readback collector/docs push, `origin/main` advanced to
  `6bf5de83a482eda08543138d8518e0aa23ccb3c6` while production remained on
  `1f816362c93e117e47cfe52a35e0fec93bd0b37d`. Treat this as a docs/tooling
  deploy-lag note, not a runtime blocker for `LIVEIMPORT-03`.
- After the collector hardening push, `origin/main` advanced to
  `21bb52f1e4b8865aab0dbb83ecffe698061fd7a3` while production build-info
  remained on `6bf5de83b8ed285410ecc10ecc50a2567ac68ee1` after a 180-second
  canonical wait. Public API `/health` and `/ready` are healthy. Treat this as
  another ops-tooling deploy-lag note, not authenticated runtime readback
  evidence. A later canonical wait passed for `21bb52f1...`, so this deploy
  lag is closed for the code/tooling commit.
- `FULLARCH-FIX-01` fixed the confirmed bot runtime visibility regression for
  recovered imported LIVE positions with
  `continuityState=RECOVERED_UNACTIONABLE` and `syncState=DRIFT`. Remaining
  live-import risk is now per-symbol diagnostics and authenticated production
  readback.
- `FULLARCH-FIX-02` added local DB-backed evidence that the approved happy path
  imports six exchange positions into six selected-bot visible runtime
  positions when all six symbols are inside canonical bot ownership scope.
- `FULLARCH-FIX-03` added structured per-symbol reconciliation diagnostics.
  `V1-LIVE-IMPORT-STATUS-ISOLATION-2026-05-07` then fixed the authenticated
  live-status route so those diagnostics are user-scoped instead of global.
  Remaining live-import risk is authenticated production readback and, if
  needed, Web/operator presentation of those diagnostics.
- `FULLARCH-FIX-04` repaired broad Web test harness drift around local
  `next/navigation` mocks missing `usePathname`; full Web tests are green
  again (`145/145` files, `482/482` tests).
- `FULLARCH-FIX-05` repaired the API e2e root-suite blockers around bot
  market-group creation, single-active-scope fixtures, manual LIVE
  exchange-synced open-order wallet proof, and stale DB cleanup. Root workspace
  tests are green again (`api 174/174 files, 1163/1163 tests`; `web 145/145
  files, 482/482 tests`).
- `FULLARCH-FIX-06` closed the remaining local Binance futures snapshot
  normalization coverage gap. Signed `positionAmt` now normalizes to positive
  `contracts`, `positionSide=BOTH` derives one-way side from amount sign, and
  explicit adapter side remains highest-priority truth.
- `FULLARCH-FIX-07` closed the local post-repair runtime validation follow-up:
  focused runtime signal, pre-trade/risk, order lifecycle, exchange events,
  imported-position DCA visibility, takeover readback, and position automation
  suites passed (`16/16` files, `240/240` tests).
- `FULLARCH-FIX-08` closed the local security/isolation release-gate follow-up:
  focused auth/session, trusted origin, rate limit, security headers,
  API-key/profile/admin/subscription/upload, bot entitlement, and
  cross-module data-isolation suites passed (`18/18` files, `87/87` tests).
- `FULLARCH-FIX-09` closed focused local API+Web evidence for strategy,
  backtests, reports, and logs/audit trail after the Web harness repair: API
  pack passed (`12/12` files, `92/92` tests) and Web pack passed (`21/21`
  files, `49/49` tests).
- `FULLARCH-FIX-10` closed focused local API+Web evidence for market stream
  and dashboard/bot monitoring after the Web harness repair: API pack passed
  (`9/9` files, `63/63` tests) and Web pack passed (`19/19` files, `79/79`
  tests).
- `FULLARCH-FIX-11` closed focused local API+Web evidence for wallet/capital,
  market universe, and bot topology configuration paths that support
  exchange-position import and selected-bot runtime scope: API pack passed
  (`11/11` files, `80/80` tests) and Web pack passed (`21/21` files, `49/49`
  tests).
- Operator-reported one-of-six live position import is most likely an exact
  ownership/symbol-scope mismatch until production readback proves otherwise:
  only positions matching `apiKeyId + marketType + symbol` for one active,
  opted-in, wallet-backed bot with `manageExternalPositions=true` can become
  bot-managed.
- `LIVEIMPORT-03` remains open because authenticated read-only production
  runtime positions readback for the reported LIVE ETH/DOGE rows has not been
  captured on current production build-info
  `c50e1e7cf1e37d9c799031cacbb30a834f57e81d`.
  `ops:liveimport:readback` is now the canonical read-only collector once
  credentials are available. It is hardened to fail closed when no RUNNING
  session produces runtime positions readback, so a no-session artifact cannot
  satisfy the release gate.
- `BOTMULTI-09` remains open for protected runtime readback and broader V1
  release gate evidence, even though public build-info now contains the
  original BOTMULTI candidate.
- Production V1 release-gate dry-run on 2026-05-07 reports stale required
  evidence for activation audit, activation plan, RC external gates status, RC
  sign-off, RC checklist, backup/restore drill evidence, and rollback proof
  pack. This is separate from `LIVEIMPORT-03` authenticated runtime readback.
- Activation audit and activation plan were refreshed as 2026-05-07 `NO-GO`
  artifacts. The remaining stale release-gate evidence is RC external gates
  status, RC sign-off, RC checklist, backup/restore drill evidence, and
  rollback proof pack.
- RC external gates status, RC sign-off, and RC checklist are now fresh for
  2026-05-07 but intentionally blocked/open. Remaining stale release-gate
  artifacts are backup/restore drill evidence and rollback proof pack.
- Backup/restore drill and rollback proof are now fresh but failed for
  2026-05-07. Restore needs production DB/Coolify access; rollback proof needs
  protected OPS auth.
- Final blocker prerequisite recheck after the execution pack found only
  `FIGMA_OAUTH_TOKEN` and `IGCCSVC_DB` by names-only env scan in this shell.
  Production build-info is now current through the backend parity runtime fix
  at `da1e52cf...`, but no Soar production readback, rollback, or DB/Coolify
  access is available locally.
- 2026-05-08 backend parity production readback attempt found the same local
  auth blocker: `ops:liveimport:readback` against deployed
  `da1e52cfec0b70e5a94e59d75fe702a55c348d74` failed closed with missing
  read-only production auth token or login credentials. Names-only env scan
  found only `FIGMA_OAUTH_TOKEN` and `IGCCSVC_DB`.
- 2026-05-08 V1 release-gate dry-run is `not_ready`:
  `docs/operations/v1-release-gate-prod-2026-05-08T05-36-43-320Z.md` marks
  activation, RC external gates, RC sign-off, and RC checklist fresh for
  2026-05-08. Backup/restore drill is fresh but failed due to missing
  production DB/Coolify access. Rollback proof is fresh but failed because
  protected runtime freshness and alerts endpoints return HTTP `401` without
  auth.
- Follow-up production build-info check observed production at
  `e6ccbedaa1d0074d5dc335935bb6b51a9bb1e387` while latest `main` was
  `d1755b45fc5a6fa901b86519366188efe743a05a`. This is docs/state deploy lag;
  the runtime fix remains deployed. A `LIVEIMPORT-03` collector attempt
  against deployed `e6ccbeda...` still failed closed with missing read-only
  production auth.
- RC strict production evidence check now narrows RC blockers to Gate 4:
  missing Engineering/Product/Operations/RC owner names and final status still
  `BLOCKED`. Gate 1, Gate 2, and Gate 3 are `PASS`.
- 2026-05-08 deploy coordination follow-up: the docs/state deploy wait commit
  `0a2e2353177c15d4a4934c03837835785e01d710` reached production build-info
  and public deploy smoke passed. The remaining blockers are still protected
  access and sign-off blockers, not public deploy freshness.
- 2026-05-08 live-import auth preflight hardening is closed: the collector now
  names the exact accepted auth variable choices when missing auth blocks
  readback, and no-auth validation still creates no artifact. This improves
  operator handoff but does not close `LIVEIMPORT-03`.
- 2026-05-08 recovery proof preflight hardening is closed: restore and
  rollback proof tooling now names exact production DB/auth env choices on
  help or fail-closed paths. This improves operator handoff but does not close
  restore drill or rollback proof evidence.
- 2026-05-08 RC sign-off preflight hardening is closed: blocked sign-off builds
  now print the exact missing required Gate 4 fields, while owner contact is
  reported as recommended handoff metadata. This improves operator handoff but
  does not approve Gate 4.
- 2026-05-08 current deployed-HEAD release-gate dry-run is fresh and still
  `not_ready`: activation and RC evidence families are fresh, backup/restore
  drill and rollback proof are fresh but failed, and dry-run mode blocks final
  approval. This confirms the remaining blockers are protected evidence and
  approval inputs, not deploy freshness.
- 2026-05-08 release-gate live-import evidence enforcement is closed:
  production V1 release gate now requires the protected `LIVEIMPORT-03`
  runtime readback artifact. The latest dry-run blocks on
  `evidence:liveImportReadback:missing`, so final `ready` cannot bypass the
  active bot live-import blocker.
- 2026-05-08 release-gate build-info freshness hardening is closed:
  production V1 release gate now accepts `--expected-sha` and runs the existing
  web build-info wait step before deploy smoke. Final `ready` cannot bypass a
  stale production deploy when the final blocker pack command is used.
- 2026-05-08 release-gate RC approval evidence hardening is closed:
  production V1 release gate now fails fresh RC external-gate, sign-off, and
  checklist artifacts unless Gate 4 is `PASS`, `RC status: APPROVED` is
  present, and the checklist shows `G4=PASS`. Latest dry-run
  `docs/operations/v1-release-gate-prod-2026-05-08Trc-approval-required-dry-run.md`
  reports `evidence:rcExternalGateStatus:failed`,
  `evidence:rcSignoffRecord:failed`, and `evidence:rcChecklist:failed`, so
  final `ready` cannot bypass real Gate 4 approval.
- 2026-05-08 final V1 preflight command is available:
  `pnpm run ops:release:v1:preflight` is the safe first operator command. In
  this shell it passes build-info for current `HEAD`, then blocks on missing
  production auth/DB env names and current release evidence blockers without
  creating protected artifacts.
- 2026-05-08 final V1 preflight prerequisite checks are now regression-locked
  with focused tests. This prevents incomplete production auth/DB env sets from
  being silently accepted by the preflight.
- 2026-05-08 protected-context Coolify sweep confirms deploy freshness and
  public smoke, and identifies production Postgres container
  `x11cfnz1dd9x0yzccftqzcoe`. This does not close restore evidence because the
  existing restore drill runs through `docker exec`, and the local Docker
  daemon does not contain the production container. A VPS shell or Docker
  context that can reach that container is still required.
- 2026-05-08 update: production restore drill is now closed as PASS through
  approved Coolify terminal access for `x11cfnz1dd9x0yzccftqzcoe`. The
  remaining protected evidence blockers are `LIVEIMPORT-03` auth/readback,
  rollback proof auth, and RC Gate 4 approval.

## Known Environment Pitfalls

- `rg` can fail on this Windows workstation with `Odmowa dostepu`; use
  PowerShell `Get-ChildItem` and `Select-String` as fallback.
- Browser plugin validation can fail if it resolves system Node `v22.13.0`
  instead of the bundled Codex runtime. See
  `.codex/context/LEARNING_JOURNAL.md`.
- DB-backed API packs that share cleanup tables should run sequentially when
  used as closure evidence.
- Local Prisma may have migration-history drift; inspect before treating it as
  a current repository regression.

## Product Risk Watchlist

- LIVE/PAPER runtime parity and dashboard truth remain the highest-risk areas.
- Backend/frontend runtime label and lifecycle mappings must stay centralized
  where shared semantics exist.
- Operator-visible UI should stay production-grade and avoid debug-looking
  badges or invented fallback truth.
- Production release evidence tasks that need credentials must not be marked
  done from public health/build-info checks or local regression packs alone.
