# Current Focus

Last updated: 2026-05-12

## Active Focus

V1 action-level product correctness before any further readiness claim. Deploy
health, route reachability, and local contract tests remain useful evidence,
but they are not sufficient to call the app complete.

2026-05-12 local proof status:
`V1-SUBSCRIPTIONS-ADMIN-LOCAL-PROOF-2026-05-12` moves Subscriptions/Admin to
`PASS_LOCAL`. Dashboard Home, Bot Runtime, Auth, Profile API Keys, Profile,
Subscriptions/Admin, Wallets, Markets, Strategies, Manual Orders, Positions,
Orders, Backtests, Reports, Logs/Audit Trail, Exchange Adapter, Workers,
Security/Privacy, and UX/A11y/Mobile now have local proof. Operations is the
remaining `BLOCKED_AUTH` row and needs rollback/liveimport/SLO/release-gate/
alerts evidence before V1 can be release-ready.

2026-05-12 production read-only status:
`V1-OPERATIONS-PROD-READONLY-PROOF-2026-05-12` proves production public health
but not V1 release readiness. Production public no-worker smoke passed and
VPS Docker inventory shows API, Web, workers, Redis, and Postgres running.
Stage public smoke is `503`. The production V1 release gate is `not_ready`
because protected worker smoke returns `401` without approved app/operator
auth, LIVEIMPORT-03 production readback is missing, RC Gate 4 is not approved,
and activation/sign-off/backup-restore/rollback artifacts are stale for
2026-05-12.

2026-05-12 restore drill refresh:
`V1-PROD-RESTORE-DRILL-REFRESH-2026-05-12` refreshed the production
backup/restore evidence to current-date `PASS`. The release gate now
classifies backup/restore as `fresh` for 2026-05-12. V1 still remains
`NO-GO` until protected prod ops auth, current rollback proof, Gate 4/sign-off,
activation evidence, and LIVEIMPORT-03 are completed.

2026-05-12 activation refresh:
`V1-PRODUCTION-ACTIVATION-REFRESH-2026-05-12` refreshed the production
activation audit and activation execution plan to current-date `NO-GO`
artifacts. The release gate now classifies activation audit/plan as `fresh`
for 2026-05-12. V1 still remains `NO-GO` until protected prod ops auth,
current rollback proof, Gate 4/sign-off, and LIVEIMPORT-03 are completed.

2026-05-12 RC blocked refresh:
`V1-RC-BLOCKED-REFRESH-2026-05-12` refreshed RC external gates, RC sign-off,
and the release-candidate checklist to current-date blocked evidence. The
release gate now classifies RC artifacts as `failed` rather than stale for
2026-05-12. V1 still remains `NO-GO` until Gate 4 approver fields, protected
prod ops auth, current rollback proof, and LIVEIMPORT-03 are completed.

2026-05-12 rollback proof blocked refresh:
`V1-ROLLBACK-PROOF-BLOCKED-REFRESH-2026-05-12` refreshed production rollback
proof to current-date fail-closed evidence. The proof reports
`shouldRollback:true` because protected runtime freshness and alerts endpoints
returned `401`. The release gate now classifies rollback proof as `failed`
rather than stale for 2026-05-12. V1 still remains `NO-GO` until approved
rollback/protected auth, Gate 4 approvers, and LIVEIMPORT-03 are completed.

2026-05-12 final preflight refresh:
`V1-FINAL-PREFLIGHT-CURRENT-2026-05-12` refreshed the no-secret final
preflight for deployed build-info `00169d7f...`. Build-info and public smoke
pass, production DB restore context is satisfied, and V1 remains `NO-GO` on
missing `LIVEIMPORT_READBACK_*`, missing `ROLLBACK_GUARD_*`, failed RC
evidence, missing `LIVEIMPORT-03`, and failed rollback proof.

2026-05-12 operator unblock packet:
`V1-OPERATOR-UNBLOCK-PACKET-00169D7F-2026-05-12` is the active no-secret
operator handoff for finishing V1. It points to current deployed build-info
`00169d7f...` and orders the remaining protected steps: provide auth, collect
`LIVEIMPORT-03`, rerun rollback proof to PASS, approve Gate 4, refresh RC
artifacts, and run the final production gate without dry-run.

2026-05-12 non-dry-run gate:
`V1-RELEASE-GATE-NONDRYRUN-BLOCKED-2026-05-12` ran the production release gate
without `--dry-run`. Build-info and public smoke passed, but deploy smoke
failed on protected `/workers/health` `401`, so readiness remains `not_ready`.

2026-05-12 V1 completion scorecard:
`V1-COMPLETION-SCORECARD-2026-05-12` is the current percentage model for V1.
Use `docs/operations/v1-completion-scorecard-2026-05-12.md` when answering
"where are we in percent?" It separates implementation estimate, evidence
coverage, and release readiness. After the Subscriptions/Admin local proof
refresh, the generated values are implementation estimate `86.8%`, evidence
coverage `61.3%`, and release readiness `42.4%`.
After `V1-SUBSCRIPTIONS-FOCUSED-TESTS-2026-05-12`, the static scan has `41`
findings (`P0:1`, `P1:8`, `P2:32`) and concrete non-proof gaps are `8`.
After `V1-WEB-ORDERS-POSITIONS-DOC-TRUTH-2026-05-12`, the static scan has
`39` findings (`P0:1`, `P1:6`, `P2:32`) and concrete non-proof gaps are `6`.
After `V1-API-SUBSCRIPTIONS-DOC-TRUTH-2026-05-12`, the static scan has `38`
findings (`P0:1`, `P1:6`, `P2:31`) and concrete non-proof gaps are `5`.
After `V1-STATIC-SCAN-LEGACY-ROUTE-CLASSIFICATION-2026-05-12`, the static
scan has `34` findings (`P0:1`, `P1:2`, `P2:31`) and concrete non-proof gaps
are `1`.
V1 remains
`NO-GO`; every P0 module is still not release-ready, so the next work must
burn down proof gaps and confirmed defects from the scorecard/ledger order.

2026-05-10 V1 master state ledger:
`V1-MASTER-STATE-LEDGER-2026-05-10` is the new canonical start point for broad
V1 continuation work: `docs/operations/v1-master-state-ledger-2026-05-10.md`.
It consolidates the project index and static scan into one work ledger. Current
status remains `NO-GO`: modules are bucketed as `doneLocalNeedsProdProof: 20`
and `blocked: 1`.
The ledger carries 44 findings (`P0: 2`, `P1: 10`, `P2: 32`) and separates
concrete surface/test/doc/queue gaps from generic missing-proof rows. Future
work should start from the ledger's `Next Work Order`.

2026-05-10 project indexing baseline:
`PROJECT-INDEXING-BASELINE-2026-05-10` adds a local no-network index generator
for continuation work. Use `pnpm run ops:project:index` before broad V1 repair
planning to refresh the module/API/Web/route/worker/test/task map. The current
index confirms the active product action matrix remains `NO-GO` with
`PASS_LOCAL: 20` and `BLOCKED_AUTH: 1`; all local proof rows still require
production-safe evidence before release readiness.
`PROJECT-INDEX-V1-CROSSWALK-2026-05-10` extends that index with a prioritized
V1 audit work map for all 21 rows. Current order starts with Dashboard Home,
then Bot Runtime, then Auth/Profile API Keys/Bots.
`V1-STATIC-ISSUE-SCAN-2026-05-10` adds the current inconsistency scan:
44 findings (`P0: 2`, `P1: 10`, `P2: 32`). Treat `v1-proof-gap` as missing
evidence, not automatic code failure. Treat Web Orders/Positions route/feature
gaps and subscription/position test gaps as concrete triage candidates.

2026-05-11 Security/Privacy local proof:
`V1-SECURITY-PRIVACY-LOCAL-PROOF-2026-05-11` locally proves Security/Privacy
V1 contracts. API Security/Privacy tests passed (`23` files, `111` tests),
covering headers/cache, admin/ops diagnostics, readiness secret checks, error
redaction, crypto keyring behavior, rate-limit degradation, auth/trusted-
origin/ops-network middleware, Auth lifecycle/JWT/cookie/error contracts,
ownership isolation, Profile API-key privacy/probes, Profile security actions,
stage abuse throttling, and authenticated snapshots. Web Auth/Profile tests
passed (`13` files, `48` tests). Security/Privacy is now `PASS_LOCAL`;
production-safe protected security proof and external review remain open.

2026-05-11 Workers local proof:
`V1-WORKERS-LOCAL-PROOF-2026-05-11` locally proves the Workers V1 contracts.
API Workers/stream/runtime tests passed (`18` files, `88` tests), covering
worker ownership/topology, protected health/readiness, runtime freshness pass/
fail/skip behavior, protected `/ready` diagnostics, market-stream source/
fanout/subscription contracts, queue tuning, backtest job persistence,
execution/runtime orchestration, and PAPER runtime-flow telemetry. Workers are
now `PASS_LOCAL`; production-safe protected worker/process proof remains open.

2026-05-11 Profile local proof:
`V1-PROFILE-LOCAL-PROOF-2026-05-11` locally proves Profile basic/security
behavior. API Profile basic/security e2e covers self-delete route behavior,
legacy delete rejection, valid timezone persistence, invalid timezone
rejection, unauthenticated security access rejection, valid-current-password
change, weak/invalid password rejection, old-login failure/new-login success,
and password-confirmed account deletion. Focused Web Profile tests cover basic
profile save success/error toasts, timezone preference payload, password
mismatch short-circuit, and successful password change payload/feedback.
Profile is now `PASS_LOCAL`; production-safe browser clickthrough remains
open.

2026-05-11 Wallets local proof:
`V1-WALLETS-LOCAL-PROOF-2026-05-11` locally proves Wallets create/edit/delete,
PAPER/LIVE mode guards, API-key ownership, balance preview, paper reset guards,
and ledger readback. API Wallets tests passed (`4` files, `43` tests), and Web
Wallets tests passed (`9` files, `22` tests). Wallets is now `PASS_LOCAL`;
production-safe browser clickthrough remains open.

2026-05-11 Markets local proof:
`V1-MARKETS-LOCAL-PROOF-2026-05-11` locally proves Markets universe CRUD,
catalog import, symbol composition, placeholder capability guards, active-bot
guard behavior, inactive-bot edit/delete behavior, stale legacy link handling,
and ownership isolation. API Markets e2e passed (`17/17`), and Web Markets
tests passed (`5` files, `12` tests). Markets is now `PASS_LOCAL`;
production-safe browser clickthrough remains open.

2026-05-11 Strategies local proof:
`V1-STRATEGIES-LOCAL-PROOF-2026-05-11` locally proves Strategies CRUD,
export/import, clone payloads, config validation, indicator catalog behavior,
ownership isolation, active-bot update/delete guards, and inactive-bot update
allowance. API Strategies tests passed (`3` files, `17` tests), and Web
Strategies tests passed (`14` files, `46` tests). Strategies is now
`PASS_LOCAL`; production-safe browser clickthrough and representative
runtime/backtest compatibility proof remain open.

2026-05-11 Manual Orders local proof:
`V1-MANUAL-ORDERS-LOCAL-PROOF-2026-05-11` locally proves Manual Orders
context, PAPER market placement, validation, lifecycle readback, cancel/close,
selected-bot scope, quantity rules, ownership isolation, LIVE risk guards,
exchange-backed fail-closed cancel behavior, and Dashboard Home action states.
API Manual Orders tests passed (`7` files, `75` tests), and Web Manual Orders
tests passed (`6` files, `20` tests). Manual Orders is now `PASS_LOCAL`;
production-safe browser clickthrough remains open, and LIVE order actions
remain blocked-risk without an explicit safe plan.

2026-05-11 Positions local proof:
`V1-POSITIONS-LOCAL-PROOF-2026-05-11` locally proves Positions list/read,
manual update, management mode, close flows, takeover, exchange snapshot
selection/fail-closed behavior, live status/reconciliation, orphan repair,
imported lifecycle history, authenticated snapshots, exchange snapshot
normalization, and runtime close UI states. API Positions tests passed
(`12` files, `90` tests), and Web Positions tests passed (`3` files, `10`
tests). Positions is now `PASS_LOCAL`; production-safe browser clickthrough
remains open, and LIVE mutation remains blocked-risk without an explicit safe
plan.

2026-05-11 Orders local proof:
`V1-ORDERS-LOCAL-PROOF-2026-05-11` locally proves Orders list/read/open/
cancel/close, active-only filtering, exchange-backed cancel boundary, exchange
events, fills, fees, fee backfill, live fill resolution, quantity rules,
position scope, source labels, and open-order cancel actions. API Orders tests
passed (`10` files, `121` tests), and Web Orders tests passed (`2` files, `3`
tests). Orders is now `PASS_LOCAL`; production-safe browser clickthrough
remains open, and live mutation remains blocked-risk without an explicit safe
plan.

2026-05-11 Backtests local proof:
`V1-BACKTESTS-LOCAL-PROOF-2026-05-11` locally proves Backtests run create/
list/get/delete, explicit time ranges, pending report lifecycle, worker/job
persistence, replay/fill/timeline behavior, strategy-to-backtest-to-paper/
live parity, venue consistency, market-universe symbol formula, fail-closed
empty symbols, route shells, create form, run details, table actions, core-data
hook, view-models, pair metrics, trade segments, and timeline overlays. API
Backtests tests passed (`12` files, `110` tests), and Web Backtests tests
passed (`13` files, `32` tests). Backtests is now `PASS_LOCAL`; production-
safe browser clickthrough remains open.

2026-05-11 Reports local proof:
`V1-REPORTS-LOCAL-PROOF-2026-05-11` locally proves Reports cross-mode
performance aggregation and `/dashboard/reports` states. API Reports tests
passed (`1` file, `2` tests), covering weighted BACKTEST report aggregation
and PAPER trade aggregation. Web Reports tests passed (`3` files, `5` tests),
covering route shell, empty state, aggregated cards/tables, and route-
reachable locale copy. Reports is now `PASS_LOCAL`; production-safe browser
clickthrough remains open, and export/download is outside the current
implemented Reports surface.

2026-05-11 Logs/Audit local proof:
`V1-LOGS-AUDIT-LOCAL-PROOF-2026-05-11` locally proves authenticated audit log
reads, owner-only scoping, source/actor/severity filters, pagination defaults
and bounds, action-produced audit event visibility, `/dashboard/logs` route
shell, empty/loaded UI states, severity filter request payload, metadata trace
rendering, and route-reachable locale copy. API Logs tests passed (`2` files,
`5` tests), and Web Logs tests passed (`3` files, `4` tests). Logs/Audit
Trail is now `PASS_LOCAL`; production-safe browser clickthrough remains open.

2026-05-11 Exchange Adapter local proof:
`V1-EXCHANGE-ADAPTER-LOCAL-PROOF-2026-05-11` locally proves Exchange Adapter
capability boundaries, public/authenticated reads, API-key probes, connector
factory/registry behavior, live adapter retry/fill/fee boundaries, symbol
rules, metadata contracts, position snapshot normalization, runtime exchange
order guards, and Web exchange/profile API-key capability wiring. The slice
also fixes Gate.io public catalog symbol normalization so generic adapter ids
such as `BTC_USDT` become canonical Soar symbols such as `BTCUSDT`. API
Exchange tests passed (`19` files, `93` tests), and Web Exchanges/Profile
API-key tests passed (`5` files, `17` tests). Exchange Adapter is now
`PASS_LOCAL`; production-safe exchange-boundary proof remains open, and real
live mutation remains blocked-risk without an explicit safe plan.

2026-05-11 Auth session lifecycle proof:
`V1-AUTH-SESSION-LIFECYCLE-PROOF-2026-05-11` locally proves Auth lifecycle
behavior. API Auth e2e covers login cookie TTLs, logout cookie clearing with
subsequent `/auth/me` 401, deleted-user session expiry, expired JWT clearing
and session-expired message, and duplicate token precedence. Focused Web Auth
tests cover AuthProvider bootstrap/logout/session-expired warning, API
interceptor redirect, middleware cookie gate, login form states, and login
hook fail-closed missing-session-refresh behavior. Auth is now `PASS_LOCAL`;
production-safe browser clickthrough remains open.

2026-05-11 Profile API Keys local proof:
`V1-PROFILE-API-KEYS-LOCAL-PROOF-2026-05-11` locally proves Profile API Keys.
API tests cover encrypted-only storage, masked responses, create/update/delete/
rotate/revoke ownership, Binance and Gate.io provided/stored probes, audit log
metadata without raw secrets, placeholder exchange fail-closed probes,
bad-key/futures-missing rejection, and no persistence of provided test secrets.
Web tests cover connection-test-before-save, stored-key test action, probe
support status, placeholder exchange save behavior, and delete risk
confirmation. Profile API Keys is now `PASS_LOCAL`; production-safe browser
clickthrough and audit-log visibility remain open.

2026-05-11 Bot Runtime PAPER session browser proof:
`V1-BOT-RUNTIME-PAPER-SESSION-BROWSER-PROOF-2026-05-11` locally proves the
canonical Bot Runtime monitoring route for a representative PAPER `RUNNING`
session. API sessions, aggregate, positions, symbol stats, and trades agree
with browser evidence on desktop/tablet/mobile; legacy runtime routes redirect
to preview. The stopped/completed gap was closed by
`V1-BOT-RUNTIME-COMPLETED-SESSION-FIXTURE-2026-05-11`; worker telemetry is
covered by `V1-BOT-RUNTIME-WORKER-TELEMETRY-PROOF-2026-05-11`. Bot Runtime
still needs production-safe/non-local proof before release readiness.

2026-05-11 Bot Runtime completed session proof:
`V1-BOT-RUNTIME-COMPLETED-SESSION-FIXTURE-2026-05-11` locally proves the
completed-session side of Bot Runtime through the approved PAPER snapshot
import. API readback shows `RUNNING,COMPLETED`, completed detail
`eventsCount: 1`, `symbolsTracked: 3`, positions `openCount: 0`, and aggregate
`sessionsCount: 2`; browser proof filters to `COMPLETED` and renders completed
state. Worker telemetry/live-loop proof is now covered by
`V1-BOT-RUNTIME-WORKER-TELEMETRY-PROOF-2026-05-11`; production-safe/non-local
proof remains open.

2026-05-11 Bot Runtime worker telemetry proof:
`V1-BOT-RUNTIME-WORKER-TELEMETRY-PROOF-2026-05-11` locally proves that the real
`RuntimeSignalLoop` writes runtime telemetry consumed by Bot Runtime APIs.
Focused API e2e evidence covers a PAPER `RUNNING` session, at least three
runtime events, `BTCUSDT` symbol stats with long and exit counters, the closed
position lifecycle, and authenticated runtime session list/detail,
symbol-stats, and aggregate readbacks. This upgrades Bot Runtime's product
action row to `PASS_LOCAL`; production-safe/non-local clickthrough remains
open.

2026-05-10 Dashboard runtime table action audit:
`V1-DASHBOARD-RUNTIME-TABLE-ACTION-AUDIT-2026-05-10` is locally complete for
the presenter/action slice. Dashboard runtime table proof now covers open-order
local cancel vs terminal read-only rows, exchange-backed cancel blocked rows,
negative PnL/error styling, prospective TTP hidden at zero/negative live PnL,
backend/runtime TTP precedence over fallback and TSL, TSL-only display, and
non-actionable open-position edit/close buttons. This upgrades Dashboard Home
and Bot Runtime rows in the product action matrix only to local proof, not
full V1 readiness. Next executable task: production-safe clickthrough or the
next unverified P0 module from the master ledger.

2026-05-10 Dashboard Home rendered runtime audit:
`V1-DASHBOARD-HOME-RENDERED-RUNTIME-AUDIT-2026-05-10` adds a real rendered
`HomeLiveWidgets` proof for the operator-reported TTP class. The component now
has focused local evidence that a negative-PnL open position can render the
TTP column while hiding the prospective TTP label/value. This is still
`PARTIAL_LOCAL`.

2026-05-11 Dashboard Home selected-bot rendered audit:
`V1-DASHBOARD-HOME-SELECTED-BOT-RENDERED-AUDIT-2026-05-11` adds rendered
local proof for loading state, retryable error state, selected-bot switching
across two active PAPER bots, selected wallet KPI recalculation, open-orders
tab data, trade-history tab data, and stale previous-bot row suppression.
Dashboard Home remains `PARTIAL_LOCAL`; browser-level responsive
desktop/tablet/mobile, keyboard/touch interaction, and production-safe
clickthrough remain next.

2026-05-11 Dashboard Home browser empty/onboarding proof:
`V1-DASHBOARD-HOME-BROWSER-PROOF-2026-05-11` adds authenticated local browser
proof for `/dashboard` empty/onboarding state on desktop `1280x720` and mobile
`390x844`. The proof used local API/Web, a throwaway `/auth/register` session,
keyboard focus on `Open wallets`, framework overlay check, and console health.
A shared `ThemeSwitcher` hydration-noise console error was fixed. Dashboard
Home remains `PARTIAL_LOCAL`; active selected-bot runtime browser proof on
representative data, tablet/touch proof, and production-safe clickthrough
remain next.

2026-05-11 Dashboard Home active runtime browser proof:
`V1-DASHBOARD-HOME-RUNTIME-SESSION-FIXTURE-2026-05-11` closes the local active
runtime fixture gap discovered by the first active proof. The approved snapshot
import now creates deterministic PAPER wallet/session/stat/event data for the
imported bot, API readback proves session and aggregate `openCount: 3`, and
authenticated desktop/tablet/mobile `/dashboard` renders status `RUNNING`,
open rows for `BTCUSDT`, `BNBUSDT`, and `ETHUSDT`, wallet KPIs, and safe
`Orders` tab interaction. Dashboard Home remains `PARTIAL_LOCAL` only because
production-safe clickthrough/non-local proof is still open.

## Current System Objective

Build and maintain an AI-assisted self-improving development system for Soar.
The system must let agents continue from repository state, identify the next
smallest valuable task, protect runtime safety, and keep backend/frontend/UI
contracts synchronized.

## Current Delivery Stage

2026-05-10 Bots action audit:
`V1-BOTS-ACTION-AUDIT-2026-05-10` is complete locally. Bots list delete
success/failure behavior is covered in Web tests, and Bots API action contracts
pass for CRUD, runtime close, ownership isolation, market groups, strategy
links, LIVE opt-in guards, duplicate active guards, and runtime monitoring.
This upgrades the Bots row in the product action matrix to `PASS_LOCAL`; it
does not replace a future production-safe clickthrough.

2026-05-10 product action audit/P0 regression correction:
`V1-PRODUCT-ACTION-AUDIT-P0-2026-05-10` starts the action-level audit lane
after operator-reported production UI failures. The current slice fixes bot
deletion cleanup for runtime dedupe references, suppresses prospective TTP
display when live PnL is not positive, and publishes the module/action matrix
that must be executed before V1 can be called complete. Evidence:
`docs/planning/v1-product-action-audit-p0-task-2026-05-10.md` and
`docs/operations/v1-product-action-audit-matrix-2026-05-10.md`.

2026-05-10 LIVE runtime safety readiness diagnostics:
`LIVE-RUNTIME-SAFETY-READINESS-DIAGNOSTICS-2026-05-10` adds protected
`/ready/details` diagnostics for the LIVE no-order guard. The public `/ready`
response stays minimal, while admin/ops diagnostics can confirm
`runtimeSafety.liveNoOrderGuard.active=true` before any controlled LIVE session
proof.

2026-05-10 LIVE runtime kill-switch config:
`LIVE-RUNTIME-KILL-SWITCH-CONFIG-2026-05-10` adds
`RUNTIME_LIVE_GLOBAL_KILL_SWITCH` and `RUNTIME_LIVE_EMERGENCY_STOP` to the
runtime final-candle pre-trade path. Defaults are off. When enabled for LIVE,
the existing pre-trade guard blocks before signal creation/order orchestration,
allowing controlled runtime/session proof without intended exchange orders.

2026-05-10 production rerun after Futures-only key fixes:
Production build-info reached `8cd5c1b3f38b9594a9caf15d4b434c853a66fdfe`.
Public smoke passes and the stored Binance key now validates successfully on
production with `ok: true`, `code: OK`, `permissions.spot: true`, and
`permissions.futures: true`. `LIVEIMPORT-03` remains blocked only because the
LIVE bot has no running runtime session. Evidence:
`docs/operations/prod-api-runtime-readiness-8cd5c1b3-2026-05-10.md`.

2026-05-10 Futures-only API-key acceptance:
`FUTURES-ONLY-APIKEY-ACCEPTANCE-2026-05-10` updates profile API-key test
semantics so a key is accepted when at least one actionable scope validates.
Futures-only keys now return `ok: true` with `permissions.futures: true` and
`permissions.spot: false`; Spot-only keys are also accepted for Spot use. UI
copy now states Binance Spot & Margin permission is only for Spot bots.

2026-05-10 Binance Futures API-key probe correction:
`BINANCE-FUTURES-APIKEY-PROBE-SCOPE-FIX-2026-05-10` corrects the prior
production readiness interpretation. The old stored-key probe output is now
classified as ambiguous for Binance Futures because the probe relied on
implicit CCXT balance-scope defaults and sequential scope checks. The local fix
probes Spot and Futures independently and passes explicit Binance Futures
balance params before the endpoint is used again as readiness evidence.

2026-05-10 production API/runtime readiness:
`PROD-API-RUNTIME-READINESS-F3CB9A24-2026-05-10` captured authenticated
read-only production API evidence on deployed
`f3cb9a24c4c891479d5466a5abae4100ddda5ca8`. Core dashboard/admin API modules
are reachable, Gate.io Futures market catalog is reachable, and the LIVE bot
configuration exists. V1 remains `NO-GO` for LIVE Binance Futures because the
stored Binance key probe reports `spot: true` and `futures: false`, and
`LIVEIMPORT-03` wrote fail-closed evidence with `NO_RUNNING_SESSION`. Evidence:
`docs/operations/prod-api-runtime-readiness-f3cb9a24-2026-05-10.md`.

2026-05-10 authenticated UI evidence:
`PROD-UI-AUTH-CLICKTHROUGH-39A52703-2026-05-10` captured production UI
route/module reachability after login on deployed `39a52703`. Result PASS:
public `4/4`, dashboard `18/18`, admin `3/3`, and legacy redirects `3/3`.
This closes the route/module reachability part of the authenticated/admin UI
blocker; deeper action/form and live-money flows remain separate. Evidence:
`docs/operations/prod-ui-module-clickthrough-39a52703-2026-05-10.md`.

2026-05-10 architecture cleanup:
`V1-ARCH-BOUNDARY-CLEANUP-2026-05-10` resolved the audit's local architecture
findings. API-key probe CCXT client construction now belongs to
`modules/exchange`, profile consumes the exchange-owned factory, and the
Gate.io runtime/exchange docs are current. This makes the audited local
architecture surfaces clean; final V1 still depends on protected production
proof and formal release approval. Evidence:
`docs/planning/v1-architecture-boundary-cleanup-task-2026-05-10.md` and
`docs/operations/v1-architecture-function-audit-2026-05-10.md`.

2026-05-10 architecture function audit:
`V1-ARCH-FUNCTION-AUDIT-2026-05-10` audited V1 functions from architecture,
backend, API, frontend, exchange, runtime parity, security, UI, and ops
perspectives. Result before remediation: mostly aligned, with one exchange
boundary mismatch and two Gate.io docs drifts. Those local findings are now
resolved by `V1-ARCH-BOUNDARY-CLEANUP-2026-05-10`; keep this audit as the
historical basis for the cleanup, not as an open local architecture blocker.
Evidence:
`docs/operations/v1-architecture-function-audit-2026-05-10.md`.

2026-05-10 function coverage audit:
`V1-FUNCTION-COVERAGE-AUDIT-2026-05-10` published a function/module-oriented
answer to what remains before V1 can be called complete. The audit reviewed
architecture, the dashboard route map, API routers, Web routes, module
inventory, test inventory, current final preflight, and production UI
clickthrough evidence. Conclusion: broad implementation/local coverage exists
and no broad missing module implementation was found for the current V1 scope,
but V1 remains `NO-GO` until protected liveimport readback, rollback proof
PASS, authenticated/admin UI clickthrough, authenticated Gate 2 SLO, RC
approval/sign-off/checklist, and final non-dry-run release gate are complete.
Evidence: `docs/operations/v1-function-coverage-audit-2026-05-10.md`.

2026-05-10 final preflight refresh:
`V1-FINAL-PREFLIGHT-82205329-2026-05-10` captured the current no-secret final
preflight for production build-info
`8220532920e484da9ddaa021ac64b5de4cc5e6e1`. Build-info and public smoke pass,
production DB restore context is satisfied by fresh evidence, and V1 remains
`BLOCKED` only on protected/formal blockers: liveimport auth/readback,
rollback guard auth/proof PASS, RC gate/sign-off/checklist approval, and
authenticated/admin UI proof. Evidence:
`docs/operations/v1-final-preflight-82205329-2026-05-10.md`.

2026-05-10 UI audit refresh:
`PROD-UI-PUBLIC-CLICKTHROUGH-88313309-2026-05-10` refreshed the no-auth
production UI route/module audit for deployed build-info
`88313309200d35275ba6c0d3465c5045c4b6d99e`. Public routes pass
(`/`, `/auth/login`, `/auth/register`, `/offline`), while dashboard, admin,
and legacy protected routes return `BLOCKED_AUTH` with redirects to
`/auth/login`. This confirms current fail-closed auth behavior only; full V1
UI clickthrough still requires valid production dashboard/admin auth and
representative data. Evidence:
`docs/operations/prod-ui-module-clickthrough-88313309-2026-05-10.md`.

2026-05-10 release-gate status:
`V1-CURRENT-RELEASE-GATE-DRY-RUN-2026-05-10` captured a current no-secret
production V1 release-gate dry-run for deployed build-info
`8f8630b0ad5abd690409d6173c9b247b95948138`. Readiness is still
`not_ready`. Fresh PASS-family evidence exists for activation audit,
activation plan, and backup/restore drill, while RC external gates, RC
sign-off, RC checklist, `LIVEIMPORT-03`, rollback proof PASS, and the final
non-dry-run release-gate execution remain blockers. Evidence:
`docs/planning/v1-current-release-gate-dry-run-task-2026-05-10.md` and
`docs/operations/v1-release-gate-prod-2026-05-10Tcurrent-buildinfo-dry-run.md`.

2026-05-10 operator target hardening:
`V1-OPERATOR-RUNBOOK-DYNAMIC-SHA-2026-05-10` changed the final blocker
execution pack and operator unblock checklist so protected evidence uses
production `/api/build-info` as the default `$expectedSha` source. This avoids
repeated stale static SHA churn after docs-only deploys while preserving the
explicit rule that build-info is not protected runtime proof. Evidence:
`docs/planning/v1-operator-runbook-dynamic-sha-task-2026-05-10.md`,
`docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`, and
`docs/operations/v1-operator-unblock-checklist-2026-05-10.md`.

2026-05-10 Gate 2 probe:
`V1-SLO-GATE2-NOAUTH-PROBE-2026-05-10` captured a short unauthenticated
production SLO observation for deployed
`8c85279d13ca56421b09a5c4cd613535a81ef76d`. It is blocker evidence, not Gate
2 approval: `/health` was 100%, `/ready` was 50% during the short window,
protected workers/metrics/alerts returned `401`, and queue/API/live-order
metrics were `NO_DATA`. Follow-up public smoke passed after the window. Gate 2
still requires authenticated 30-minute production SLO evidence. Evidence:
`docs/planning/v1-slo-gate2-noauth-probe-task-2026-05-10.md`,
`docs/operations/v1-slo-gate2-noauth-probe-2026-05-10.md`, and
`docs/operations/v1-slo-observation-2026-05-10T05-09-56-366Z.md`.

2026-05-10 runbook sync:
`V1-OPERATOR-RUNBOOK-CURRENT-SHA-SYNC-2026-05-10` updated the final blocker
execution pack and operator unblock checklist to latest verified deployed audit
SHA `5515f2105d52f25a0d875cbd0b55860a00b4da32`. The runbooks still require
build-info verification before protected evidence collection and explicitly
state that docs-only deploy freshness cannot substitute for `LIVEIMPORT-03`,
rollback proof PASS, RC approval, or authenticated/admin UI clickthrough.
Evidence:
`docs/planning/v1-operator-runbook-current-sha-sync-task-2026-05-10.md`,
`docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`, and
`docs/operations/v1-operator-unblock-checklist-2026-05-10.md`.

2026-05-10 audit update:
`V1-COVERAGE-CONFIDENCE-AUDIT-2026-05-10` refreshed the current no-secret
final preflight and no-auth production UI module clickthrough for deployed
`fd8da90bd77c2ddbed800eabd98479c1bd113ac4`, then published a
perspective-by-perspective V1 coverage confidence report. The audit conclusion
is `NO-GO`: implementation and local coverage are broad, public production
checks pass, but protected production proof and formal release approval remain
open. Remaining blockers are liveimport auth/readback, rollback guard
auth/proof PASS, RC Gate 2/Gate 4 approval/sign-off, and authenticated/admin
production UI clickthrough. Evidence:
`docs/planning/v1-coverage-confidence-audit-task-2026-05-10.md`,
`docs/operations/v1-coverage-confidence-audit-2026-05-10.md`,
`docs/operations/v1-final-preflight-fd8da90b-2026-05-10.md`, and
`docs/operations/prod-ui-module-clickthrough-fd8da90b-2026-05-10.md`.

2026-05-10 verification/tooling update:
`PROD-UI-MODULE-CLICKTHROUGH-RUNNER-2026-05-10` added a canonical
`ops:ui:prod-clickthrough` runner for production UI route/module audit. The
runner verifies build-info, supports optional dashboard/admin auth, records
redacted JSON/Markdown evidence, and fails closed as `BLOCKED_AUTH` without
credentials. The current production no-auth run for
`84e7c0e012a571f18396556a97198dbed08aba7c` reports public routes PASS and
dashboard/admin/legacy protected routes `BLOCKED_AUTH`. This does not close
authenticated/admin UI clickthrough; it makes the remaining proof executable
once app/admin auth is available. Evidence:
`docs/planning/prod-ui-module-clickthrough-runner-task-2026-05-10.md` and
`docs/operations/prod-ui-module-clickthrough-84e7c0e0-2026-05-10.md`.

2026-05-10 verification update:
`V1-ROLLBACK-PROOF-BLOCKED-REFRESH-2026-05-10` refreshed production rollback
proof evidence for the current evidence date. The no-auth production run failed
closed on protected `401` responses (`runtime_freshness_endpoint_http_401` and
`alerts_endpoint_http_401`) and is recorded as current `FAIL` evidence, not
release approval. Follow-up no-secret preflight for deployed
`8df3260b8453be0a39dfa75ce2be281d6571c4de` reports build-info PASS, public
smoke PASS, production DB restore context satisfied, backup/restore fresh, and
rollback proof fresh but failed. V1 remains `BLOCKED / NO-GO` on liveimport
auth/readback, rollback guard auth/proof PASS, RC approval/gates, and
authenticated/admin production UI clickthrough. Evidence:
`docs/planning/v1-rollback-proof-blocked-refresh-task-2026-05-10.md`,
`docs/operations/v1-rollback-proof-prod-2026-05-10T00-00-00-000Z.md`, and
`docs/operations/v1-final-preflight-8df3260b-2026-05-10.md`.

2026-05-10 verification update:
`V1-PROD-RESTORE-DRILL-REFRESH-2026-05-10` captured fresh PASS production
restore-drill evidence through the approved Coolify terminal for the production
Postgres resource. The isolated backup/restore contract created a temporary
restore database, restored the dump, validated aggregate counts, dropped the
temporary database, removed the dump, and verified zero leftovers. Follow-up
no-secret preflight for deployed
`969df7c8f268146ecff3efb9de2fe1841ac8bc75` now marks production DB restore
context as satisfied and backup/restore drill evidence as fresh for
2026-05-10. V1 remains `BLOCKED / NO-GO` on protected/formal evidence:
liveimport auth/readback, rollback guard auth/proof, RC approval/gates, and
authenticated/admin production UI clickthrough. Evidence:
`docs/planning/v1-prod-restore-drill-refresh-task-2026-05-10.md`,
`docs/operations/v1-restore-drill-prod-2026-05-10T03-39-56Z.md`, and
`docs/operations/v1-final-preflight-969df7c8-2026-05-10.md`.

2026-05-10 post-release update: `V1-COOLIFY-DEPLOY-QUEUE-RECOVERY-2026-05-10`
cleared the stale Coolify deploy queue for Soar. Production Web build-info and
the fresh `soar-api` redeploy now both point to
`33a2ebc468be3dbfab7c784f375672ebead5ae16`; public API/Web smoke passes and
the Coolify queue is empty. V1 remains `BLOCKED / NO-GO` on protected/formal
release evidence only. Evidence:
`docs/operations/coolify-deploy-queue-recovery-33a2ebc4-2026-05-10.md` and
`docs/operations/v1-final-preflight-33a2ebc4-2026-05-10.md`.

2026-05-10 verification update: `V1-DEPLOY-CONTROL-READINESS-2026-05-10`
confirms production deploy control is manual Coolify/operator owned. The
repository has CI checks only, no approved no-secret production deploy trigger,
and webhook/API credentials are intentionally operator-held secrets. Evidence:
`docs/operations/v1-deploy-control-readiness-2026-05-10.md`.

2026-05-10 verification update: `DEPLOY-LAG-E70F5CF6-2026-05-10` records that
the pushed protected-input readiness commit
`e70f5cf6229d6fc4d26ea0342b81baab80851800` did not reach production build-info
during two bounded wait windows. Production still reports
`40e9b3c35c96d4acced73bbab980039f9e6b6a22`; public smoke passes. Evidence:
`docs/operations/deploy-lag-e70f5cf6-2026-05-10.md`.

2026-05-10 verification update: `V1-PROTECTED-INPUTS-READINESS-2026-05-10`
confirms this session lacks the protected env families required for
`LIVEIMPORT-03`, rollback proof, and production DB restore context. Privileged
VPS/Docker inspection was rejected by the escalation reviewer and was not
retried. V1 remains `BLOCKED / NO-GO` until the operator provides approved
credentials/context or explicit production infrastructure authorization.
Evidence: `docs/operations/v1-protected-inputs-readiness-2026-05-10.md`.

2026-05-10 verification update: `V1-FINAL-PREFLIGHT-CURRENT-9D28F682`
captured the final no-secret preflight for currently deployed
`9d28f682f23dc176dbbad790bea8ddf213c8ac01`. Build-info and public smoke PASS;
V1 remains `BLOCKED / NO-GO` on the same protected/formal blockers:
liveimport auth/readback, rollback guard auth, production DB restore context,
failed RC evidence, stale backup/restore drill, and stale rollback proof.
Evidence:
`docs/planning/v1-final-preflight-current-9d28f682-task-2026-05-10.md` and
`docs/operations/v1-final-preflight-9d28f682-2026-05-10.md`.

2026-05-10 verification update: `V1-OPERATOR-UNBLOCK-CHECKLIST-2026-05-10`
published a current no-secret operator unblock checklist for deployed
`822d92fc02067fa122e735ab6cc2783e438dc458` and retargeted the final blocker
execution pack to the same SHA. Current preflight build-info/public smoke
PASS and V1 remains `BLOCKED / NO-GO` until protected liveimport readback,
rollback proof, production restore drill, Gate 2 evidence, and real RC
approvers are provided. Evidence:
`docs/operations/v1-operator-unblock-checklist-2026-05-10.md` and
`docs/operations/v1-final-preflight-822d92fc-2026-05-10.md`.

2026-05-10 verification update: `V1-PROD-ACTIVATION-REFRESH-2026-05-10`
published fresh production activation plan and activation evidence audit
artifacts as explicit `NO-GO` for deployed
`74752f025ef49bf5026ec92e056f59947e00a18f`. Follow-up no-secret final
preflight now reports activation plan/audit fresh, build-info/public smoke
PASS, and V1 still `BLOCKED` on liveimport auth/readback, rollback guard auth,
production DB restore context, failed RC evidence, stale backup/restore drill,
and stale rollback proof. Evidence:
`docs/planning/v1-production-activation-refresh-2026-05-10-task.md` and
`docs/operations/v1-final-preflight-74752f02-2026-05-10.md`.

2026-05-10 verification update: `V1-RC-BLOCKED-REFRESH-2026-05-10`
refreshed RC external gates, RC sign-off, and the RC checklist to the active
evidence date as current blocked evidence. Final preflight for deployed
`1609929ed3b98c2b794d8a0b48ff0f39c16cd75f` now reports build-info/public
smoke PASS, RC evidence fresh but `failed`, and V1 still `BLOCKED` on
protected/formal blockers: liveimport auth/readback, rollback guard auth,
production DB restore context, stale activation audit/plan, stale
backup/restore drill, stale rollback proof, Gate 2 SLO evidence, and real RC
approvers. Evidence:
`docs/planning/v1-rc-blocked-evidence-refresh-task-2026-05-10.md` and
`docs/operations/v1-final-preflight-1609929e-2026-05-10.md`.

2026-05-10 post-release update: `DEPLOY-FRESHNESS-9C125683` proves production
Web build-info now exposes
`9c12568379ee77cda9c9e9df39879e141b5615fb`, a pushed batch that includes
`b414e523` live order cancel boundary support. Public API/Web smoke passes and
the no-secret final V1 preflight public checks pass, while V1 remains correctly
blocked on protected/formal evidence: liveimport readback auth, rollback guard
auth, production DB restore context, current activation/RC evidence,
`LIVEIMPORT-03` runtime readback, backup/restore drill, rollback proof, and
authenticated/admin UI clickthrough. Evidence:
`docs/planning/deploy-freshness-9c125683-task-2026-05-10.md`,
`docs/operations/deploy-freshness-9c125683-2026-05-10.md`, and
`docs/operations/v1-final-preflight-9c125683-2026-05-10.md`.

2026-05-10 implementation update: `EXCHANGE2-31` adds canonical
exchange-side `LIVE_ORDER_CANCEL` for Binance and Gate.io through
`orders.service.ts` -> `exchangeAdapterBoundary.service.ts` -> authenticated
connector. Exchange-backed local order state now changes only after the
boundary call succeeds; contextless exchange-backed rows remain fail-closed.
No real live-money cancel action is performed in this task. Focused exchange
tests, focused orders cancel tests, API typecheck, guardrails, docs parity, and
diff check passed. Production freshness is now covered by
`DEPLOY-FRESHNESS-9C125683`; the earlier deploy-lag artifact is superseded.
Evidence:
`docs/planning/exchange2-31-live-order-cancel-boundary-task-2026-05-10.md` and
`docs/operations/deploy-freshness-9c125683-2026-05-10.md`.

2026-05-10 implementation/deploy update: `EXCHANGE2-30` enabled Gate.io
`LIVE_ORDER_SUBMIT` through the canonical orders/exchange boundary and enables
Gate.io `LIVE_EXECUTION` compatibility gating. Gate.io exchange-side cancel
remains unsupported. No real live-money action is performed in this task.
Focused exchange tests, wallet e2e, Web capability test, API typecheck, Web
typecheck, production build-info for
`04a4204ca9090586d49ae77b0dd8c1be048d7bdf`, and public deploy smoke passed.
The no-secret final V1 preflight public checks passed and remains correctly
blocked on protected/formal evidence.
Evidence:
`docs/planning/exchange2-30-gateio-live-order-submit-task-2026-05-10.md` and
`docs/operations/deploy-freshness-04a4204c-2026-05-10.md`.

2026-05-09 implementation update: `EXCHANGE2-29` enabled only Gate.io
`WALLET_CASHFLOW_HISTORY` through the existing exchange adapter boundary.
Focused exchange/wallet cashflow tests, API typecheck, guardrails, docs
parity, and diff check passed. Production build-info now exposes
`8ea7f33b581ec0f3cf7d653168b160c31cbb23a8`, public API/Web smoke passes, and
the no-secret final V1 preflight remains correctly blocked on protected/formal
evidence. Gate.io live submit and exchange-side cancel remain unsupported.
Evidence:
`docs/planning/exchange2-29-gateio-wallet-cashflow-history-task-2026-05-09.md`
and `docs/operations/deploy-freshness-8ea7f33b-2026-05-09.md`.

2026-05-09 implementation update: `EXCHANGE2-28` enabled only Gate.io
`TRADE_HISTORY_SNAPSHOT` through the existing authenticated-read boundary.
Focused exchange tests, authenticated snapshot service test, API typecheck,
guardrails, docs parity, and diff check passed. Production build-info now
exposes `432f768701300c7ba600fa7633532c0cc9ef4b96`, public API/Web smoke
passes, and the no-secret final V1 preflight remains correctly blocked on
protected/formal evidence. Gate.io wallet cashflow history, live submit, and
exchange-side cancel remain unsupported. Evidence:
`docs/planning/exchange2-28-gateio-trade-history-snapshot-task-2026-05-09.md`
and `docs/operations/deploy-freshness-432f7687-2026-05-09.md`.

2026-05-09 implementation update: `EXCHANGE2-27` enabled only Gate.io
`OPEN_ORDERS_SNAPSHOT` through the existing authenticated-read boundary.
Production build-info now exposes
`214a9c034d38ab8670fd4b43d0f8ed692d78d90c`, public API/Web smoke passes, and
the no-secret final V1 preflight remains correctly blocked on
protected/formal evidence. Gate.io trade-history, live submit, and
exchange-side cancel remain unsupported. Evidence:
`docs/planning/exchange2-27-gateio-open-orders-snapshot-task-2026-05-09.md`
and `docs/operations/deploy-freshness-214a9c03-2026-05-09.md`.

2026-05-09 implementation update: `EXCHANGE2-26` enabled only Gate.io
`POSITIONS_SNAPSHOT` through the existing authenticated-read boundary and
positions exchange-snapshot route. Gate.io open-orders/trade-history, live
submit, and exchange-side cancel remain unsupported. Evidence:
`docs/planning/exchange2-26-gateio-positions-snapshot-task-2026-05-09.md` and
`docs/operations/deploy-freshness-4c7548ac-2026-05-09.md`.

2026-05-09 implementation update: `EXCHANGE2-25` enabled only Gate.io
`BALANCE_PREVIEW` through the existing authenticated-read boundary and wallet
preview route. Gate.io positions/open-orders/trade-history, live submit, and
exchange-side cancel remain unsupported. Evidence:
`docs/planning/exchange2-25-gateio-balance-preview-task-2026-05-09.md` and
`docs/operations/deploy-freshness-15dfacb9-2026-05-09.md`.

2026-05-09 implementation update: `EXCHANGE2-24` enabled only Gate.io
`API_KEY_PROBE` through a shared exchange-aware profile API-key probe service.
Gate.io provided and stored profile API-key connection tests now pass through
the normal endpoint and write audit-safe metadata. The slice does not enable
Gate.io balance preview, positions/open-orders, trade-history, live submit, or
exchange-side cancel. Evidence:
`docs/planning/exchange2-24-gateio-api-key-probe-task-2026-05-09.md` and
`docs/operations/deploy-freshness-e76e08a1-2026-05-09.md`.

2026-05-09 implementation update: `EXCHANGE2-23` enabled Gate.io public PAPER
pricing through the shared capability matrix and existing public market-stream
source. The scope is intentionally limited to paper pricing: Gate.io LIVE
execution, API-key probe, authenticated reads, live submit, and exchange-side
cancel remain unsupported. Production build-info now exposes
`1dc55d9623bab11dacb5b9f8ce9634778c139249`, public API/Web smoke passes, and
no-secret final V1 preflight remains correctly blocked on protected/formal
evidence. Evidence:
`docs/planning/exchange2-23-gateio-paper-pricing-enable-task-2026-05-09.md`
and `docs/operations/deploy-freshness-1dc55d96-2026-05-09.md`.

2026-05-09 current production handoff: latest observed production Web
build-info is `e8cd748e80b8693087e01beb21b0085ace747c49`. Public API/Web
smoke passes, and no-secret final V1 preflight public checks pass while the
preflight remains correctly `BLOCKED` on protected/formal evidence. This
docs/evidence batch does not change runtime behavior, close protected V1
evidence, or enable Gate.io paper/live/authenticated support. Evidence:
`docs/planning/deploy-freshness-e8cd748e-task-2026-05-09.md`,
`docs/operations/deploy-freshness-e8cd748e-2026-05-09.md`, and
`docs/operations/v1-final-preflight-e8cd748e-2026-05-09.md`.

2026-05-09 public UI access refresh: production Web build-info reached
`745b5f5a45eab3f86b02e023479c8358f760bbf6`. Public routes return HTTP 200 and
unauthenticated dashboard/admin routes redirect to `/auth/login`. This does
not satisfy the full authenticated/admin module clickthrough audit and does
not change Gate.io paper/live/authenticated support. Evidence:
`docs/planning/prod-ui-public-access-refresh-745b5f5a-task-2026-05-09.md` and
`docs/operations/prod-ui-public-access-clickthrough-745b5f5a-2026-05-09.md`.

2026-05-09 protected runtime/preflight baseline: production Web build-info was
verified at `30b027b78544f76b5b638851e8e27c98f6d22ab5`. Public API
`/health`, API `/ready`, Web `/`, and no-secret final V1 preflight public
checks pass after the protected-backlog sync batch. Full authenticated/admin
production UI module clickthrough remains blocked until valid production app
access is available. Evidence:
`docs/planning/deploy-freshness-30b027b7-task-2026-05-09.md`,
`docs/operations/deploy-freshness-30b027b7-2026-05-09.md`, and
`docs/operations/v1-final-preflight-30b027b7-2026-05-09.md`.

2026-05-09 current production handoff: production Web build-info is current at
`ba3d852d5126b625a8cf702ab647d5c644d86f9c`. Public API `/health`, API
`/ready`, Web `/`, and no-secret final V1 preflight public checks pass after
the docs/status sync batch. Full authenticated/admin production UI module
clickthrough remains blocked until valid production app access is available.
Evidence:
`docs/planning/deploy-freshness-ba3d852d-task-2026-05-09.md`,
`docs/operations/deploy-freshness-ba3d852d-2026-05-09.md`, and
`docs/operations/v1-final-preflight-ba3d852d-2026-05-09.md`.

2026-05-09 current production handoff: production Web build-info is current at
`010b4f8b6abfaf4c24d26550eb4761215d119f21`. Public API `/health`, API
`/ready`, Web `/`, and no-secret final V1 preflight public checks pass after
the Gate.io source batch. Full authenticated/admin production UI module
clickthrough remains blocked until valid production app access is available.
Evidence:
`docs/planning/deploy-freshness-010b4f8b-task-2026-05-09.md`,
`docs/operations/v1-final-preflight-010b4f8b-2026-05-09.md`, and
`docs/operations/deploy-lag-1f1d9c12-2026-05-09.md`.

2026-05-09 historical deploy lag note: pushed `origin/main`
`1f1d9c12e0cc99884eced81546802a261b0925e9` did not reach production within
the accepted 900-second build-info wait, the additional 300-second follow-up
waits, or the later 180-second follow-up wait. Later production build-info
advanced beyond that lag and now reports
`010b4f8b6abfaf4c24d26550eb4761215d119f21`, so `DEPLOY-LAG-1F1D9C12` is no
longer an active deploy-freshness blocker. Evidence:
`docs/planning/deploy-lag-1f1d9c12-task-2026-05-09.md` and
`docs/operations/deploy-lag-1f1d9c12-2026-05-09.md`.

2026-05-09 deploy follow-up: the earlier `d355df93` handoff lag is closed,
and the later Gate.io source batch `010b4f8b6abfaf4c24d26550eb4761215d119f21`
is production-current. The temporary `010b4f8b` lag classification was caused
by using an incorrect full SHA in the first wait. Evidence:
`docs/planning/deploy-freshness-010b4f8b-task-2026-05-09.md` and
`docs/operations/deploy-lag-1f1d9c12-2026-05-09.md`.

2026-05-09 no-secret V1 preflight refresh: deployed `010b4f8b` passes
build-info and public API/Web smoke, but the current release posture is
`BLOCKED` on missing live-import auth, rollback auth, production DB restore
context for the active evidence date, failed/open RC evidence, missing
`LIVEIMPORT-03`, stale 2026-05-08 restore evidence, and stale 2026-05-08
rollback proof.

2026-05-09 activation refresh: production activation plan and activation
evidence audit are fresh `NO-GO` artifacts for 2026-05-09 and target the
latest protected operator pack source-of-truth sync. Current production
build-info is `30b027b78544f76b5b638851e8e27c98f6d22ab5`.
V1 remains blocked on protected auth, production DB restore context for the
active evidence date, failed/open RC evidence, `LIVEIMPORT-03`, and rollback
proof.

2026-05-09 RC refresh: RC status, sign-off, and checklist are fresh blocked
evidence for 2026-05-09. Preflight now classifies them as `failed` rather than
`stale`, because real Gate 2 production SLO evidence and Gate 4 approver
approval are still missing.

2026-05-09 rollback proof tooling: rollback proof generation now accepts
`--today <yyyy-mm-dd>` for correct release evidence dating, but the actual
production rollback proof remains blocked on protected auth/network access.

2026-05-09 restore drill tooling: restore drill generation now accepts
`--today <yyyy-mm-dd>` for correct release evidence dating, but the actual
production restore drill remains blocked on approved DB/Coolify context.

2026-05-09 final blocker pack sync: the operator execution pack now defines
one `$releaseDate` and reuses it across supported date-aware preflight,
restore drill, rollback proof, RC evidence, and final gate commands. This is a
runbook/state synchronization only; final production evidence still requires
protected auth and DB/Coolify context.

2026-05-09 dashboard runtime deploy freshness: the dashboard runtime aggregate
behavior source is `3c5da34371e22aecb1a7aff0a185018870d35cec`, and the current
production docs/evidence handoff deploy is
`30b027b78544f76b5b638851e8e27c98f6d22ab5`, which includes that runtime
behavior. Continue protected evidence work from `30b027b7` unless a newer
intended code/tooling candidate is first deployed and proven by production
build-info.

2026-05-09 protected access readiness: final V1 evidence is blocked because
the current shell has no `LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`, or
production DB/Coolify restore context env names. Do not attempt protected
readback, rollback proof, restore drill, final gate, or authenticated/admin UI
clickthrough until operator inputs are supplied.

2026-05-09 continuation update: Gate.io second-exchange planning has been
reconciled after the deployed fail-closed foundation. The plan is complete as a
planning artifact; public catalog and public `FUTURES`/swap market-data
foundation are implemented, while paper pricing, authenticated reads, live
submit, and exchange-side cancel remain unsupported until exact operation
support and evidence exist. The next non-local blockers remain protected
production auth/readback, rollback proof auth, and RC Gate 4 approval.

The latest local backend runtime parity slice fixed
`executionOrchestrator.service` so close-settlement entry-fee aggregation uses
the existing `RuntimeTradeGateway` boundary rather than direct Prisma access
inside the shared PAPER/LIVE orchestration path. Focused engine parity/crash
coverage, DB-backed runtime/order/exchange/import/readback packs, API
typecheck, repository guardrails, and the full local API suite are green.
The first DB-backed runtime e2e attempt was blocked by an unhealthy
`desktop-linux` Docker context, but the local Postgres/Redis ports and
`default` Docker context were reachable; rerunning the packs sequentially
closed the local backend evidence gap.

Release verification is blocked on accepted production deployment plus
authenticated production readback for the first open queue item,
`LIVEIMPORT-03`. Local audit gates are closed through `FULLARCH-FIX-11`.
Production web build-info has verified the RC approval gate hardening deploy
at `1100b7fb232ce6195b24522a6a11559fe9fb8634`, which contains the V1 backend
PAPER/LIVE adapter-pure runtime fix, blocker evidence alignment, deploy wait
coordination docs, operator preflight hardening, live-import release-gate
evidence enforcement, build-info freshness enforcement, and strict RC approval
evidence enforcement. GitHub Actions is not an accepted production deploy
mechanism for this project. The latest names-only prerequisite scan still
found no production credentials or ops auth headers in the current shell, so
protected evidence collection remains blocked without an
operator-authenticated environment.

`LIVEIMPORT-03` now has one canonical read-only evidence command. First verify
the chosen deployed candidate through production build-info, then pass that
same SHA to the collector. Current protected readback target is deployed
`30b027b78544f76b5b638851e8e27c98f6d22ab5`:
`$releaseDate = Get-Date -Format yyyy-MM-dd; $expectedSha = "30b027b78544f76b5b638851e8e27c98f6d22ab5"; pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha $expectedSha --timeout-seconds 900 --interval-seconds 30; pnpm run ops:liveimport:readback -- --expected-sha $expectedSha --output "docs/operations/liveimport-03-prod-readback-$releaseDate.json"`.
The collector is hardened to fail closed when no RUNNING session produces a
runtime positions payload, so no-session output cannot be treated as V1
evidence.

Before running protected evidence commands, use the read-only aggregate
preflight:
`pnpm run ops:release:v1:preflight -- --expected-sha 30b027b78544f76b5b638851e8e27c98f6d22ab5 --today 2026-05-09`.
It verifies the build-info-proven production SHA, reports missing prerequisite
env names, and classifies current release evidence blockers without creating
protected artifacts.

Latest protected-context sweep after Coolify operator access: production
build-info for `e6e7d4a044ce80279c542412a91bae4a6a012392` passes and public
API/Web smoke passes. Coolify confirms the production Postgres container name
is `x11cfnz1dd9x0yzccftqzcoe`, but local Docker cannot see that remote
container; therefore the existing Docker-based restore drill cannot honestly
produce production PASS evidence from this workstation. The generated
no-secret status reports are
`docs/operations/_artifacts-v1-final-preflight-2026-05-08-protected-context.json`
and
`docs/operations/v1-final-preflight-2026-05-08-protected-context.md`.

Production restore drill was previously closed as PASS through approved
Coolify terminal access for the 2026-05-08 evidence date. Evidence:
`docs/operations/v1-restore-drill-prod-2026-05-08T15-16-24Z.md`. Latest
verified public/no-secret deploy is
`30b027b78544f76b5b638851e8e27c98f6d22ab5`.
Remaining V1 release blockers are protected Soar application/operator auth for
`LIVEIMPORT-03`, rollback proof auth, and real RC Gate 4 approval.

The protected auth context sweep confirmed the current API runtime env-name
surface does not expose `LIVEIMPORT_READBACK_*` or `ROLLBACK_GUARD_*` auth
variables. The final preflight now classifies fresh production restore drill
evidence as satisfying the production DB restore context prerequisite, so the
remaining preflight blockers are live-import auth, rollback guard auth, failed
RC Gate 4 approval evidence, missing `LIVEIMPORT-03`, and failed rollback
proof. Rollback proof remains fail-closed on protected `401` responses until
approved auth is available.

A production `ops:release:v1:gate` dry-run on 2026-05-07 generated current
blocker artifacts and reports `readiness=not_ready`: activation audit,
activation plan, RC external gates status, RC sign-off, RC checklist,
backup/restore drill evidence, and rollback proof pack are stale, and dry-run
mode cannot approve production.

The activation audit and activation plan have since been refreshed as
2026-05-07 `NO-GO` artifacts. The latest dry-run now reports those two
families as `fresh`; remaining release-gate blockers are RC external gates
status, RC sign-off, RC checklist, backup/restore drill evidence, rollback
proof pack, and non-dry-run protected execution.

RC external gates status, RC sign-off, and RC checklist have now also been
refreshed as current blocked/open evidence. Latest RC snapshot is `G1=PASS`,
`G2=OPEN`, `G3=PASS`, `G4=OPEN`; sign-off remains `BLOCKED`.

Backup/restore drill and rollback proof are also current for 2026-05-07 but
`FAILED`: restore drill was not executed without production DB/Coolify access,
and rollback proof failed closed on protected `401` responses. V1 remains
NO-GO.

The canonical `LIVEIMPORT-03` command now targets the latest build-info-proven
production SHA. Do not substitute local evidence-only `HEAD` unless production
build-info proves that SHA is deployed.

Latest continuation recheck: public production build-info reached the RC
approval gate hardening commit
`1100b7fb232ce6195b24522a6a11559fe9fb8634`, but the current shell exposes no
required Soar production auth variable. A no-auth `ops:liveimport:readback`
attempt failed closed before protected runtime readback.

Post-regression cleanup: GitHub Actions production promote/rollback entrypoints
and the local GitHub workflow helper are being removed. Future V1 deployment
continuation must use Coolify/manual operator controls, then local verification
scripts for build-info, release gate, readback, rollback proof, and restore
drill evidence.

## Current Priority Order

1. Stability
2. Architecture alignment
3. No regressions
4. Correct flows
5. UX quality
6. Visual polish
7. New features

## Active Constraints

- Do not touch unrelated in-progress code changes.
- Keep source-of-truth docs in English.
- Reuse existing `.codex/context`, planning, governance, and architecture
  systems.
- Do not run live-money or destructive production actions for `LIVEIMPORT-03`;
  the remaining work is authenticated read-only dashboard/API evidence.
- Keep `LIVEIMPORT-03` open until ETH/DOGE production runtime readback evidence
  is captured and redacted.
