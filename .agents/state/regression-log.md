# Regression Log

Last updated: 2026-05-11

## Open Regressions

The broad V1 action audit remains open as a coverage gap, not a single code
regression. See `history/audits/v1-product-action-audit-matrix-2026-05-10.md`.

## Fixed Or Prevented In This Slice

- 2026-05-21: Fixed LIVE exchange-backed cancel entitlement drift. Symptom
  class: manual cancel or runtime stale-order lifetime cancel could call the
  exchange cancel boundary after a user subscription downgrade because cancel
  checked `riskAck` and ownership but not current `liveTrading` entitlement.
  Fix: `orders.service.cancelOrder` now checks
  `assertSubscriptionAllowsLiveTrading(userId)` before exchange-backed cancel
  boundary invocation and before local order mutation. Validation: API
  typecheck and guardrails passed; focused DB-backed regression test was added
  but local execution was blocked by unavailable Postgres/Docker.

- 2026-05-11: Fixed Security/Privacy test env restoration drift. Symptom
  class: focused security packs could leak `JWT_SECRET_PREVIOUS_UNTIL` as a
  malformed value or leave API-key encryption keyring state between files,
  causing later auth/readiness/profile/isolation tests to fail with cascading
  `500`, `503`, or `401` responses. Fix: JWT/keyring test restore helpers now
  delete originally absent env vars instead of assigning undefined-like values,
  and focused tests explicitly clear rotation env where they set standalone
  JWT secrets. Validation: red subset passed (`10` files, `63` tests), full
  API Security/Privacy proof passed (`23` files, `111` tests), and Web Auth/
  Profile proof passed (`13` files, `48` tests).

- 2026-05-11: Prevented Security/Privacy proof drift. Symptom class: auth,
  isolation, secret, rate-limit, and abuse tests could exist while V1 still
  treated Security/Privacy as unverified. Validation:
  `V1-SECURITY-PRIVACY-LOCAL-PROOF-2026-05-11` ties API Security/Privacy tests
  (`111/111`) and Web Auth/Profile tests (`48/48`) to the V1 matrix.

- 2026-05-11: Fixed worker-adjacent e2e isolation drift. Symptom class:
  runtime sessions, runtime symbol stats, signals, backtest runs, and market
  candle cache left by one focused runtime/worker test could break later
  worker freshness or owned-import tests with FK errors or stale passive
  freshness. Fix: worker runtime freshness tests now clear market candle cache
  before each case, and owned-import execution orchestrator cleanup now removes
  runtime events, symbol stats, sessions, signals, backtest artifacts, runtime
  dedupe, and assistant/subagent configs before deleting bots/users.
  Validation: `V1-WORKERS-LOCAL-PROOF-2026-05-11` API worker pack passed
  (`18` files, `88` tests).

- 2026-05-11: Prevented Workers proof drift. Symptom class: worker topology,
  readiness, runtime freshness, market-stream fanout, queue tuning, and
  backtest/runtime worker tests could exist while V1 still treated Workers as
  unverified. Validation: `V1-WORKERS-LOCAL-PROOF-2026-05-11` ties API
  Workers/stream/runtime tests (`88/88`) to the V1 matrix.

- 2026-05-11: Fixed Exchange Adapter Gate.io public catalog symbol
  normalization drift. Symptom class: generic adapter market ids such as
  `BTC_USDT` leaked into Soar market catalog symbols, while downstream market
  universe/runtime contracts expect canonical `BTCUSDT` symbols. Fix:
  `exchangeMarketCatalog.service.ts` now uses strict symbol normalization for
  market ids and ticker keys while preserving display symbols and asset
  normalization. Validation:
  `V1-EXCHANGE-ADAPTER-LOCAL-PROOF-2026-05-11` API Exchange suite (`93/93`)
  and Web Exchanges/Profile API-key suite (`17/17`) passed.

- 2026-05-11: Prevented Logs/Audit Trail proof drift. Symptom class:
  audit-log filter/pagination tests and UI route tests could exist while V1
  still treated auditability as unverified. Validation:
  `V1-LOGS-AUDIT-LOCAL-PROOF-2026-05-11` ties API Logs tests (`5/5`) and Web
  Logs tests (`4/4`) to the V1 matrix, including unauthenticated rejection,
  owner-only reads, source/actor/severity filters, pagination defaults/bounds,
  action-produced audit event visibility, route shell, empty/loaded states,
  severity filter payload, metadata trace rendering, and route-reachable
  locale copy.

- 2026-05-11: Prevented Reports proof drift. Symptom class: reporting
  aggregation and route-state tests could exist while V1 still treated
  operator performance summaries as unverified. Validation:
  `V1-REPORTS-LOCAL-PROOF-2026-05-11` ties API Reports tests (`2/2`) and Web
  Reports tests (`5/5`) to the V1 matrix, including weighted BACKTEST report
  aggregation, PAPER trade aggregation, `/dashboard/reports` route shell,
  empty state, aggregated cards/tables, and route-reachable locale copy.

- 2026-05-11: Prevented Backtests proof drift. Symptom class: backtest
  create/list/delete/report/timeline and replay parity tests could exist while
  V1 still treated simulation correctness as unverified. Validation:
  `V1-BACKTESTS-LOCAL-PROOF-2026-05-11` ties API Backtests tests (`110/110`)
  and Web Backtests tests (`32/32`) to the V1 matrix, including ownership,
  explicit ranges, pending report lifecycle, worker/job persistence, replay
  core, fill model, timeline/indicator series, runtime kernel parity,
  strategy/backtest/paper/live alignment, route shells, create form, list/
  details presentation, table actions, core-data hook, and timeline/report
  utilities.

- 2026-05-11: Prevented Orders proof drift. Symptom class: order
  lifecycle/cancel/fill/fee tests could exist while V1 still treated the order
  lifecycle as unverified. Validation: `V1-ORDERS-LOCAL-PROOF-2026-05-11`
  ties API Orders tests (`121/121`) and Web Orders tests (`3/3`) to the V1
  matrix, including ownership, active filtering, PAPER/LIVE open contracts,
  exchange-backed cancel boundaries, exchange event open/close/DCA/account
  update lifecycle, partial/underfilled/capped fill progress, fee pending and
  backfill, live fill resolution, source labels, cancel actions, and terminal
  read-only behavior.

- 2026-05-11: Prevented Positions proof drift. Symptom class: position
  list/update/close/takeover/snapshot/reconciliation tests could exist while
  V1 still treated position ownership/runtime truth as unverified. Validation:
  `V1-POSITIONS-LOCAL-PROOF-2026-05-11` ties API Positions tests (`90/90`) and
  Web Positions tests (`10/10`) to the V1 matrix, including ownership,
  exchange snapshots, takeover, orphan repair, imported history,
  reconciliation diagnostics, manual update safety, management mode, runtime
  visibility, close flows, carryover orders, external DCA separation, PnL
  derivations, and ignored/closed/pending close UI states.

- 2026-05-11: Prevented Manual Orders proof drift. Symptom class: manual
  order context/open/cancel/close tests could exist while V1 still treated the
  operator order-entry journey as unverified. Validation:
  `V1-MANUAL-ORDERS-LOCAL-PROOF-2026-05-11` ties API Manual Orders tests
  (`75/75`) and Web Manual Orders tests (`20/20`) to the V1 matrix, including
  PAPER market truth, selected-bot scope, lifecycle readback, cancel/close,
  ownership, quantity rules, LIVE risk guards, exchange-backed fail-closed
  cancel behavior, Dashboard Home submit/validation, open-order source/cancel
  actions, and submitted/waiting/ready/imported/position-opened/blocked states.

- 2026-05-11: Prevented Strategies proof drift. Symptom class: strategy
  CRUD/config/indicator tests could exist while V1 still treated trading rule
  authoring as unverified. Validation:
  `V1-STRATEGIES-LOCAL-PROOF-2026-05-11` ties API Strategies tests (`17/17`)
  and Web Strategies tests (`46/46`) to the V1 matrix, including
  export/import, ownership isolation, active-bot update/delete blocking,
  inactive bot update allowance, config validation, clone payloads, indicators,
  form mapping, numeric normalization, close validation, and taxonomy.

- 2026-05-11: Prevented Markets proof drift. Symptom class: market universe
  CRUD/symbol-composition/active-bot guard tests could exist while V1 still
  treated runtime symbol scope as unverified. Validation:
  `V1-MARKETS-LOCAL-PROOF-2026-05-11` ties API Markets e2e (`17/17`) and Web
  Markets tests (`12/12`) to the V1 matrix, including active bot update/delete
  blocking, inactive bot edit/delete, stale legacy link handling, placeholder
  catalog fail-closed behavior, ownership isolation, and preview composition.

- 2026-05-11: Prevented Wallets proof drift. Symptom class: wallet CRUD,
  capital preview, reset, and ledger tests could exist while V1 still treated
  the capital-source journey as unverified. Validation:
  `V1-WALLETS-LOCAL-PROOF-2026-05-11` ties API Wallets tests (`43/43`) and
  Web Wallets tests (`22/22`) to the V1 matrix, including ownership isolation,
  active-bot guards, LIVE API-key/allocation validation, preview fail-closed
  behavior, paper reset guards, and unavailable ledger fail-closed UI.

- 2026-05-11: Prevented Profile basic/security proof drift. Symptom class:
  profile API tests could exist while Web submit success/error states and V1
  proof state remained unverified. Validation:
  `V1-PROFILE-LOCAL-PROOF-2026-05-11` ties Profile basic/security API e2e
  (`7/7`) and focused Web Profile component tests (`5/5`) to the V1 matrix,
  including timezone persistence/rejection, password mismatch fail-closed
  behavior, valid password change, invalid/weak password rejection, and account
  deletion password confirmation.

- 2026-05-11: Prevented Profile API Keys proof drift. Symptom class: API key
  storage/probe code could have focused tests while V1 still treated the
  secrets journey as unverified. Validation:
  `V1-PROFILE-API-KEYS-LOCAL-PROOF-2026-05-11` ties API key e2e, exchange probe
  service, Web form, and Web list tests to the V1 matrix, including secret
  redaction, owner-only lifecycle actions, Binance/Gate.io probes, audit
  metadata, and delete/test UI guards.

- 2026-05-11: Prevented Auth session lifecycle over-reporting. Symptom class:
  route auth could be considered checked while logout invalidation, expired JWT
  clearing, duplicate-cookie precedence, and web expired-session redirects were
  not proven together. Validation: `V1-AUTH-SESSION-LIFECYCLE-PROOF-2026-05-11`
  adds API Auth e2e assertions and ties them to focused Web AuthProvider,
  API interceptor, middleware, login hook, and login form tests.

- 2026-05-11: Prevented Bot Runtime worker telemetry/readback drift. Symptom
  class: runtime screens could be fixture-proven while live-loop worker
  telemetry remained unproven. Validation:
  `V1-BOT-RUNTIME-WORKER-TELEMETRY-PROOF-2026-05-11` extends
  `runtime-flow.e2e.test.ts` to assert a real `RuntimeSignalLoop` PAPER
  lifecycle creates a running session, runtime events, `BTCUSDT` symbol stats,
  a closed position lifecycle, and authenticated runtime session/detail/
  symbol-stats/aggregate API readbacks.

- 2026-05-11: Prevented Bot Runtime completed-session filter/readback drift.
  Symptom class: the running session could be locally proven while completed
  session history still had no representative fixture or browser/API proof.
  Validation: `V1-BOT-RUNTIME-COMPLETED-SESSION-FIXTURE-2026-05-11` extends
  the approved snapshot import with a deterministic completed PAPER session,
  then proves API readback for completed detail/stats/positions and browser
  rendering through the Session status `COMPLETED` filter.

- 2026-05-11: Prevented Bot Runtime route/API evidence drift for a
  representative PAPER running session. Symptom class: the Bot Runtime page
  could be considered covered by table presenter tests while the canonical
  monitoring route, runtime sessions API, aggregate API, position readback,
  responsive rendering, or legacy runtime redirects were not proven together.
  Validation: `V1-BOT-RUNTIME-PAPER-SESSION-BROWSER-PROOF-2026-05-11` used the
  approved PAPER snapshot import, local API/Web, authenticated Playwright
  fallback, API readbacks for sessions/aggregate/positions/stats/trades,
  desktop/tablet/mobile screenshots, safe view switch, no console issues, and
  legacy redirect checks. The stopped/completed gap was later closed in
  `V1-BOT-RUNTIME-COMPLETED-SESSION-FIXTURE-2026-05-11`; the worker telemetry
  gap is now closed by `V1-BOT-RUNTIME-WORKER-TELEMETRY-PROOF-2026-05-11`.
  Remaining proof gap is production-safe/non-local clickthrough.

- 2026-05-11: Prevented over-reporting Dashboard Home active runtime readiness.
  `V1-DASHBOARD-HOME-ACTIVE-RUNTIME-BROWSER-PROOF-2026-05-11` proved active
  bot configuration and responsive rendering in a local browser, but recorded
  the `NO_SESSION`/`No open positions`/empty `/runtime-sessions` blocker
  instead of marking `SOAR-DASHBOARD-001` verified from fixture import alone.
- 2026-05-11: Closed the local Dashboard Home active runtime fixture gap.
  `V1-DASHBOARD-HOME-RUNTIME-SESSION-FIXTURE-2026-05-11` updated the existing
  PAPER snapshot import to create wallet/session/stat/event data and reran API
  plus browser proof until active open position rows rendered through the real
  runtime aggregate contract.
- 2026-05-11: Prevented Dashboard Home empty/onboarding browser regression and
  shared shell console-noise regression. Symptom class: an authenticated
  no-bot operator could land on Dashboard Home without browser evidence for
  responsive onboarding, or shared `ThemeSwitcher` hydration noise could make
  console health fail. Validation: local authenticated browser proof passed
  `/dashboard` empty/onboarding state on desktop `1280x720` and mobile
  `390x844`, keyboard focus on `Open wallets`, no framework overlay, and no
  console errors after the `ThemeSwitcher` hydration-noise fix.
- 2026-05-11: Prevented Dashboard Home selected-bot stale-state and recovery
  regressions. Symptom class: the runtime surface could theoretically miss
  loading/error recovery proof, or after switching active bots
  operator-visible wallet KPIs and runtime Orders/History tabs could remain
  bound to the previously selected bot without rendered proof catching it.
  Validation: rendered `HomeLiveWidgets` audit now covers loading state,
  retryable error state, selected-bot switching across two active PAPER bots,
  wallet KPI recalculation, Orders tab rows, History tab rows, and
  previous-bot row suppression; focused Dashboard pack passed (`3` files,
  `35` tests), Web typecheck passed, guardrails passed, and diff check passed
  with line-ending warnings only.
- 2026-05-11: Fixed active PAPER bot deletion being routed through LIVE-risk
  confirmation in the Bots management controller. Symptom: active PAPER bot
  deletion could look blocked or wrong because `isActive` alone triggered the
  LIVE confirmation copy. Root cause class: UI safety predicate conflated
  active PAPER state with LIVE trading context. Validation: Web Vitest passed
  (`147` files, `501` tests), API Bots e2e passed (`27/27`) with explicit
  local `DATABASE_URL`, Web typecheck passed, repository guardrails passed,
  and diff check passed with line-ending warnings only.
- 2026-05-10: Fixed bot deletion cleanup for runtime dedupe references.
  Symptom: operator could not delete a PAPER bot from the Bots UI. Root cause
  class: bot deletion relied on DB `onDelete: SetNull` for
  `RuntimeExecutionDedupe` instead of explicitly clearing that runtime-owned
  reference in the service cleanup transaction. Validation: focused DB-backed
  bot e2e proves deletion returns `204`, runtime session/event/stat rows are
  removed, and dedupe history remains with `botId=null`.
- 2026-05-10: Fixed prospective TTP display for non-positive live PnL.
  Symptom: Dashboard positions table could display prospective TTP protection
  while a position was negative. Root cause class: strategy fallback protection
  was treated as displayable prospective protection without a positive live PnL
  guard. Validation: focused Web row-builder, dashboard resolver, and presenter
  tests pass.
- 2026-05-10: Prevented evidence-model regression where route reachability was
  treated as functional UI/action completeness. The product action audit matrix
  is now the V1 readiness source for action-level coverage.
- 2026-05-08: Fixed a backend PAPER/LIVE runtime parity boundary leak in
  `executionOrchestrator`: close-settlement entry-fee aggregation now goes
  through the existing runtime trade gateway instead of a direct Prisma call in
  the shared orchestration path. Validation: focused engine parity/crash pack
  (`4/4` files, `26/26` tests), DB-backed runtime/order/exchange/import and
  readback packs, full local API suite with test-only API-key encryption env,
  API typecheck, and repository guardrails.
- 2026-05-08: Prevented market-stream worker source-selection drift for the
  Gate.io rollout. Worker env parsing now lives in a pure config resolver with
  tests proving Binance remains the default, Gate.io is explicit opt-in, and
  invalid env values fall back to safe defaults. Validation: focused
  worker/market-stream Vitest pack (`4` files, `8/8`) and API typecheck.
- 2026-05-08: Prevented Web capability-gating drift for Gate.io. Focused Web
  coverage now proves Gate.io is public-catalog only and remains blocked for
  paper pricing, live execution, and API-key probe until shared capability
  truth changes. Validation: focused Web Vitest pack (`3` files, `22/22`) and
  Web typecheck.
- 2026-05-08: Prevented product-form drift for Gate.io setup. Wallet create
  and bot create/edit form tests now prove Gate.io remains blocked for PAPER
  wallet save and bot activation while `PAPER_PRICING_FEED` is unsupported.
  Validation: focused Web Vitest pack (`3` files, `19/19`) and Web typecheck.
- 2026-05-08: Prevented direct API wallet drift for Gate.io setup. A
  DB-backed wallet e2e test now proves direct Gate.io PAPER wallet creation
  returns unsupported capability details and persists no user wallet while
  `PAPER_PRICING_FEED` is unsupported. Validation: focused wallet e2e
  (`21/21`), API typecheck, repository guardrails, docs parity, and diff check.
- 2026-05-08: Prevented wallet update bypass drift for Gate.io setup. A wallet
  CRUD e2e test now proves an existing Binance PAPER wallet cannot be updated
  to `GATEIO` while `PAPER_PRICING_FEED` is unsupported, and persisted wallet
  state remains unchanged after rejection. Validation: focused wallet CRUD e2e
  (`12/12`), API typecheck, repository guardrails, docs parity, and diff check.
- 2026-05-08: Prevented stored API-key probe drift for Gate.io setup. A profile
  API-key e2e test now proves stored Gate.io placeholder credentials remain
  untestable while `API_KEY_PROBE` is unsupported, and no connection-test audit
  log is written on the unsupported path. Validation: local Gate.io enum
  migration deploy, focused API-key e2e (`16/16`), API typecheck, repository
  guardrails, docs parity, and diff check.
- 2026-05-08: Prevented wallet balance preview drift for stored Gate.io keys.
  A wallet e2e test now proves stored Gate.io placeholder credentials remain
  unusable for balance preview while `BALANCE_PREVIEW` authenticated reads are
  unsupported, and `lastUsed` is not updated after rejection. Validation:
  focused wallet e2e (`22/22`), API typecheck, repository guardrails, docs
  parity, and diff check.
- 2026-05-08: Prevented positions snapshot drift for explicit stored Gate.io
  keys. A positions e2e test now proves `apiKeyId` selection cannot bypass the
  `POSITIONS_SNAPSHOT` capability guard via test fallback data, and `lastUsed`
  is not updated after rejection. Validation: focused positions exchange
  snapshot e2e, API typecheck, repository guardrails, docs parity, and diff
  check.
- 2026-05-08: Prevented reconciliation snapshot drift for stored Gate.io keys.
  A DB-backed service test now proves open-orders and trade-history snapshot
  calls cannot bypass unsupported capability guards through test fallback data,
  and `lastUsed` is not updated after rejection. Validation: focused
  authenticated snapshots service test, API typecheck, repository guardrails,
  docs parity, and diff check.
- 2026-05-08: Prevented live-submit boundary drift for Gate.io. A focused
  exchange boundary test now proves `LIVE_ORDER_SUBMIT` fails before
  credential resolution, connector creation, pretrade guards, leverage
  convergence, or live order adapter creation. Validation: focused exchange
  adapter boundary test, API typecheck, repository guardrails, docs parity, and
  diff check.
- 2026-05-08: Prevented exchange-backed cancel route drift. A DB-backed route
  e2e test now proves persisted exchange-backed open orders return HTTP 501
  with `LIVE_ORDER_CANCEL_UNSUPPORTED`, remain `OPEN` with `canceledAt=null`,
  and do not write `order.canceled` audit logs. Validation: focused route e2e
  (`1/1`), full orders/positions e2e (`22/22`), API typecheck, repository
  guardrails, docs parity, and diff check.
- 2026-05-08: Prevented final V1 preflight deploy-check drift on Windows. The
  preflight no longer reports false build-info/public-smoke blockers when
  global `pnpm` is missing; it spawns the bundled Node scripts directly and
  keeps protected evidence blockers fail-closed. Validation: focused
  `runV1FinalPreflight` tests and production preflight for deployed
  `90cd07d6`.
- 2026-05-07: Ran production V1 release-gate classifier in dry-run mode and
  preserved stale evidence blockers as release state. This prevents treating
  old 2026-05-02 RC/backup/rollback artifacts as fresh V1 evidence.
- 2026-05-07: Refreshed activation audit and activation plan as current
  `NO-GO` artifacts, then reran the V1 gate dry-run to confirm those families
  are fresh while protected evidence remains blocked.
- 2026-05-07: Refreshed RC status, sign-off, and checklist as blocked/open
  evidence to prevent stale RC artifacts from being mistaken for current
  approval.
- 2026-05-07: Refreshed restore/rollback proof blockers as current failed
  artifacts to prevent old 2026-05-02 PASS artifacts from masking missing
  production DB/Coolify access and protected OPS auth.
- 2026-05-07: Monitored production web build-info freshness after the collector
  hardening push. Latest pushed `main` is `21bb52f1...`, while production
  still reported `6bf5de83...` after the first canonical wait. A later
  canonical wait passed for `21bb52f1...`, so the deploy-lag monitor is closed
  for the code/tooling commit.
- 2026-05-07: Prevented a false-positive `LIVEIMPORT-03` release evidence
  path in `ops:liveimport:readback`; the collector now fails closed when no
  RUNNING runtime session produced a positions payload. Validation: local
  no-running-session harness exits non-zero with the expected error.
- Added durable anti-regression instructions in
  `.agents/core/anti-regression.md`.
- Added quality gate mapping in `.agents/core/quality-gates.md`.
- Added continuation state files so future short-nudge runs do not depend on
  hidden chat memory.

## Monitoring Rules

Future agents must append an entry here when:

- a regression is found but not fixed in the same iteration
- a regression is fixed and needs traceability
- a quality gate is skipped or blocked
- a test gap is intentionally deferred

## Entry Template

```markdown
### YYYY-MM-DD - Short title
- Status: open | fixed | monitoring
- Severity: P0 | P1 | P2
- Surface:
- Symptom:
- Root cause:
- Fix or mitigation:
- Validation:
- Follow-up:
```
