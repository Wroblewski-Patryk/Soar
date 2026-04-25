# LEARNING_JOURNAL

Purpose: keep a compact memory of recurring execution pitfalls and verified fixes for this repository.

## Update Rules
- Add or update an entry when a failure pattern is reproducible or documented.
- Prefer updating an existing entry over creating duplicates.
- Keep entries in English and free of secrets.
- Apply the new guardrail in the same task where the learning is captured.

## Entry Template
```markdown
### YYYY-MM-DD - Short Title
- Context:
- Symptom:
- Root cause:
- Guardrail:
- Preferred pattern:
- Avoid:
- Evidence:
```

## Entries

### 2026-04-25 - Do not run DB-backed vitest packs in parallel against the same local database
- Context: while closing `V1TAKE-08`, multiple DB-backed API test commands were launched at the same time against the same local Postgres instance.
- Symptom: otherwise green takeover/runtime/manual-order tests failed with contradictory results, including missing runtime open orders and bot-create assertions that passed when rerun alone.
- Root cause: separate Vitest processes were mutating and cleaning the same database concurrently (`deleteMany`-heavy `beforeEach` plus overlapping fixture setup), so the failure was caused by cross-test interference rather than product behavior.
- Guardrail: run DB-backed test packs sequentially unless each process is isolated to its own database/schema.
- Preferred pattern:
```text
1) Group focused DB-backed files into one awaited command when possible.
2) If multiple DB-backed commands are needed, execute them sequentially.
3) Reserve parallel execution for pure unit tests or suites that do not share mutable infra.
4) If a failure appears only in the parallel closure pack, rerun the same files sequentially before changing product code.
```
- Avoid: launching multiple `pnpm --filter api exec vitest run ...` commands in parallel when they touch the same local Postgres state.
- Evidence:
  - 2026-04-25 `V1TAKE-08`: parallel DB-backed closure runs produced false red results in `bots.runtime-takeover.e2e.test.ts` and `orders-positions.e2e.test.ts`; the same pack passed when rerun sequentially.

### 2026-04-25 - Do not run parallel Git writes in this repo from PowerShell
- Context: while closing `XVENUE-02` and `XVENUE-03`, commit/stage/status
  operations were executed in parallel tool calls from the same working tree.
- Symptom: repeated `.git/index.lock` collisions blocked `git commit` even
  though no interactive Git process was intentionally open.
- Root cause: parallel Git write operations against the same repository can
  race in this environment, especially when one call creates or retains
  `index.lock` while another Git command starts immediately.
- Guardrail: run Git write operations (`add`, `commit`, `reset`, etc.)
  sequentially in one shell invocation or in separate awaited steps, never in
  parallel tool calls for the same repo.
- Preferred pattern:
```text
1) Finish file edits and validation first.
2) Run `git add` on the intended paths.
3) Run `git commit` only after the add step finishes.
4) Check `git status` after the commit in a separate awaited step.
5) If a stale `.git/index.lock` remains from a failed attempt, remove it only after confirming no other Git process is still running.
```
- Avoid: launching `git add`, `git commit`, and `git status` in parallel
  against the same worktree.
- Evidence:
  - 2026-04-25 `XVENUE-02` / `XVENUE-03`: parallel Git tool calls reproduced
    `fatal: Unable to create '.git/index.lock': File exists.` and were
    resolved by sequential Git execution.

### 2026-04-24 - Runtime close must never synthesize market truth from entry price
- Context: production paper-bot investigation after manual/runtime close and
  paper-capital parity work.
- Symptom: positions visibly closed on profit could persist as losses in
  runtime history, while paper wallet/runtime capital summary did not increase.
- Root cause: the manual dashboard close path could still fall back to
  `position.entryPrice` when no live ticker was available, so realized PnL was
  computed from a synthetic flat exit price minus fees and then reused by
  history/capital reads as if it were canonical truth.
- Guardrail: any runtime/manual close path must derive exit price from one
  canonical market-truth resolver and fail closed when that price cannot be
  proven.
- Preferred pattern:
```text
1) Share one close-price resolver between automated runtime lifecycle and manual dashboard close.
2) Accept only canonical market sources such as runtime ticker or the latest recent runtime candle close.
3) If no market truth is available, return an explicit fail-closed error instead of using entry price or another synthetic placeholder.
4) Lock parity with regression coverage that checks persisted position/trade realized PnL and downstream runtime capital/history reads together.
```
- Avoid: using `position.entryPrice`, `1`, or another placeholder as a close
  fallback in money-impacting runtime flows.
- Evidence:
  - 2026-04-24 `PAPERPNL-01`: extracted shared
    `runtimeLifecycleMarkPrice.service.ts`, added
    `POSITION_CLOSE_PRICE_UNAVAILABLE`, and proved profitable PAPER manual
    close raises persisted realized PnL and runtime `referenceBalance/freeCash`
    in API e2e coverage.

### 2026-04-24 - Post-V1BOT e2e fixtures must use direct singular bot context
- Context: after `V1BOT-A` and `V1IND-A`, the remaining red full-API cases sat
  in `backtests/orders` suites rather than in runtime/indicator code.
- Symptom: full `pnpm --filter api run test -- --run` still failed in a small
  cluster of e2e tests even though focused runtime, orders, and indicator packs
  were green. The failing cases created LIVE/PAPER bots with only partial
  context and then expected singular-bot runtime behavior for pre-trade,
  manual-order ownership, carryover open orders, and exchange-synced runtime
  position visibility.
- Root cause: older fixtures were still building bots through legacy or
  half-populated topology assumptions (`walletId` missing, `symbolGroupId`
  missing, `strategyId` missing, or only legacy link rows present) after the
  canonical runtime/API path had already moved to one direct bot context.
- Guardrail: any new or updated API e2e that asserts runtime, manual-order, or
  pre-trade behavior must create bots with direct singular refs unless the test
  is explicitly about legacy compatibility handling.
- Preferred pattern:
```text
1) Create wallet, market universe, symbol group, and strategy explicitly.
2) Create the bot with direct `walletId`, `symbolGroupId`, and `strategyId` when the scenario depends on runtime or selected-bot truth.
3) Use legacy graph rows only in tests that are specifically verifying compatibility or repair paths.
4) When a full-suite failure appears after an architecture migration, classify stale fixtures before changing runtime code.
```
- Avoid: creating partially configured LIVE bots and expecting them to behave
  like canonical singular-context bots, or treating legacy topology rows as the
  default fixture path after the direct refs are the approved contract.
- Evidence:
  - 2026-04-24 `V1POSTBOT-A`: the last 7 red full-API cases in
    `backtests/orders` were cleared by aligning fixtures to direct
    `walletId/symbolGroupId/strategyId`, after which full
    `pnpm --filter api run test -- --run` passed.

### 2026-04-24 - Dashboard manual order must derive truth from bot scope, and PAPER market opens need a canonical fill price
- Context: authenticated production investigation after the singular bot
  runtime migration and paper-capital fix, when a newly created paper bot was
  otherwise healthy but dashboard manual order still did not result in a
  visible opened position.
- Symptom: `GET /dashboard/orders/manual-context` could show coherent bot and
  strategy context, yet `POST /dashboard/orders/open` for a paper `MARKET`
  order without explicit request `price` returned `201` with `Order.status=OPEN`
  and `positionId=null`; the selected-bot aggregate still showed no open
  position. On the web side, manual-order symbol availability depended on
  already surfaced runtime rows and open positions instead of the bot's linked
  symbol-group scope.
- Root cause: the paper manual-order lifecycle required a resolved fill price
  before applying immediate fill authority, but the open-order path did not
  source a canonical price when a market order omitted request `price`.
  Separately, the dashboard manual-order surface still treated runtime/open
  rows as the symbol source instead of using the selected bot's canonical
  market scope.
- Guardrail: manual order must follow the same singular truth model as runtime:
  symbol availability comes from the linked `symbolGroup`, strategy semantics
  come from the linked `strategy`, execution mode and capital come from the
  linked `wallet`, and paper `MARKET` orders must resolve one canonical fill
  price instead of waiting indefinitely for a fill that paper mode owns.
- Preferred pattern:
```text
1) Resolve manual-order context from bot direct refs first; use legacy topology only as compatibility fallback when direct refs are absent.
2) For PAPER MARKET opens without explicit request price, resolve one canonical mark/reference price and apply the existing order->fill->position lifecycle immediately.
3) On the dashboard, build manual-order symbol options from the bot's attached symbol group, not from already active runtime rows only.
4) Expose truthful operator states: loading, context unavailable, submitted, waiting for fill, position opened, and error.
```
- Avoid: treating dashboard manual order as a preview-only helper, deriving
  symbol availability from activity instead of configuration scope, or
  persisting paper market orders as permanently waiting for fill when the
  system itself is the paper fill authority.
- Evidence:
  - 2026-04-24 production call to `/dashboard/orders/manual-context` for bot
    `dec24168-7bba-4c44-aac9-97b3c6c60ce1` returned strategy-derived `25x`
    leverage and `ISOLATED` margin for `1000000BOBUSDT`.
  - 2026-04-24 production call to `POST /dashboard/orders/open` for the same
    bot and symbol returned `201`, but persisted `status=OPEN`,
    `positionId=null`, and left aggregate open positions empty.

### 2026-04-24 - Dashboard runtime KPIs should prefer aggregate capital summary over bot paper baseline math
- Context: a wider dashboard truth audit after the singular bot migration and
  manual-order production investigation on `2026-04-24`.
- Symptom: the selected-bot dashboard can already expose authoritative runtime
  capital summary fields (`referenceBalance`, `freeCash`, `capitalSource`,
  `paperResetAt`), but some paper KPI and equity calculations in the web
  view-model/sidebar still begin from `bot.paperStartBalance` and session
  delta math. This risks a second display drift after paper resets or future
  capital-authority changes even when the API summary itself is correct.
- Root cause: dashboard web code evolved in layers; newer runtime capital
  summary fields were added, but legacy paper-baseline calculations were left
  in place as a parallel display authority.
- Guardrail: for selected-bot dashboard wallet and equity surfaces, runtime
  capital summary must be the first authority for both `PAPER` and `LIVE`;
  legacy baseline math may exist only as explicit fallback when the
  authoritative summary fields are absent.
- Preferred pattern:
```text
1) Read selected-bot runtime capital from positions.summary first.
2) Use capitalSource/accountBalance/referenceBalance/freeCash/paperResetAt as the display truth.
3) Keep bot or wallet baseline fields only as compatibility fallback when summary fields are missing.
4) Lock the behavior with focused dashboard KPI regression tests, especially for paper reset checkpoints and pending open orders.
```
- Avoid: mixing bot-owned paper baseline math with authoritative runtime
  capital summary in the same dashboard KPI path.
- Evidence:
  - 2026-04-24 production aggregate for paper bot
    `dec24168-7bba-4c44-aac9-97b3c6c60ce1` showed authoritative
    `referenceBalance=1000`, `freeCash=1000`, `capitalSource=PAPER_INITIAL_BALANCE`,
    while web code in `useRuntimeSelectionViewModel.ts` and
    `RuntimeSidebarSection.tsx` still seeded paper display math from
    `bot.paperStartBalance` / `paperInit`.

### 2026-04-24 - PAPER runtime capital must not reuse wallet-wide historical lifecycle rows for selected-bot authority
- Context: production investigation for a selected PAPER bot showed the wallet
  module at `100 USDT`, strategy config at `walletRisk=2` and `leverage=25`,
  but the runtime dashboard reported `referenceBalance ~= 96,695 USDT` and
  opened ~`48k USDT` notional paper positions.
- Symptom: selected-bot dashboard wallet KPIs and paper order sizing inflated
  far beyond the configured paper baseline, even though strategy leverage and
  wallet risk were configured sanely.
- Root cause: the PAPER runtime capital snapshot still allowed wallet-scoped
  lifecycle rows to contribute realized PnL and reserved margin, so historical
  or legacy bot rows sharing the same wallet could contaminate the currently
  selected bot runtime authority.
- Guardrail: for `PAPER`, selected-bot runtime capital must be bot-scoped
  under the linked wallet; for `LIVE`, wallet-wide authenticated exchange
  balance remains the authority.
- Preferred pattern:
```text
1) Derive runtime execution context from wallet + market-universe truth, not deprecated bot-owned mode/venue fields.
2) In PAPER capital reads, filter lifecycle truth by both walletId and botId when bot identity is known.
3) Keep LIVE capital wallet-authoritative from authenticated exchange balance and wallet allocation policy.
4) Lock the distinction with focused capital tests plus selected-bot aggregate e2e coverage.
```
- Avoid: reusing wallet-wide paper lifecycle rows as the selected-bot capital authority or inferring safe sizing from sidebar portfolio figures without tracing the capital snapshot source.
- Evidence:
  - 2026-04-24 production audit artifacts `.tmp-prod-wallet-audit.json` and
    `.tmp-prod-bot-runtime.json` showed `paperInitialBalance=100` but
    `positions.summary.referenceBalance ~= 96,695`.
  - 2026-04-24 `V1BOT-07B` fixed the scope in
    `apps/api/src/modules/engine/runtimeCapitalContext.service.ts` and aligned
    selected-bot monitoring reads in
    `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`.

### 2026-04-24 - Local Prisma CLI runs must match the repository Prisma version
- Context: `V1BOT-02..05` added new Prisma fields/migration work for the
  single-context bot model and required local client regeneration plus schema
  sync before DB-backed e2e validation.
- Symptom: `pnpm dlx prisma` pulled Prisma `7.x`, which rejected the repo's
  Prisma `6.x` config/schema contract; local validation also drifted until the
  database schema was pushed after adding new columns.
- Root cause: `pnpm dlx prisma` defaults to the latest CLI, not the repo's
  pinned Prisma version, and the Prisma CLI only reads the correct local
  `DATABASE_URL` when invoked from `apps/api` where `.env` lives.
- Guardrail: for local Prisma maintenance in this repo, use the pinned Prisma
  version and run schema-changing commands from `apps/api`.
- Preferred pattern:
```text
1) Use `pnpm dlx prisma@6.19.3 ...` instead of unversioned `pnpm dlx prisma`.
2) Run `generate` or `db push` from `apps/api` when the command needs the local `.env`.
3) Regenerate Prisma Client before TypeScript validation after schema edits.
4) Push the local schema before DB-backed e2e if new columns/relations were added.
```
- Avoid: using the latest Prisma CLI ad hoc or running DB-backed validation
  before the local schema is synced.
- Evidence:
  - 2026-04-24 `V1BOT-02..05`: unversioned `pnpm dlx prisma` used Prisma
    `7.8.0` and failed against the repo's schema/config contract, while
    `pnpm dlx prisma@6.19.3 generate --schema apps/api/prisma/schema.prisma`
    plus `pnpm dlx prisma@6.19.3 db push --schema prisma/schema.prisma` from
    `apps/api` restored correct client/types and green DB-backed bot e2e runs.

### 2026-04-23 - Binance runtime stream defaults must follow market type, not assume spot
- Context: production verification after `V1RT-01` fixed canonical symbol
  subscriptions and `V1SURF-01` made the dashboard market surface truthful.
- Symptom: a `BINANCE/FUTURES` paper bot still produced runtime decisions only
  for symbols listed on both spot and futures (`1000CATUSDT`,
  `1000CHEEMSUSDT`, `1000SATSUSDT`, `DOGEUSDT`), while futures-only symbols
  remained stuck at `configured_fallback`.
- Root cause: `BinanceMarketStreamWorker` defaulted to the spot websocket URL
  (`wss://stream.binance.com:9443/ws`) whenever `BINANCE_STREAM_URL` was not
  explicitly configured, even for `FUTURES` runtime.
- Guardrail: exchange stream defaults must derive from explicit market-type
  truth. `FUTURES` must default to the futures websocket
  (`wss://fstream.binance.com/ws`), and `SPOT` must default to the spot
  websocket.
- Preferred pattern:
```text
1) When a runtime stream supports more than one market type, centralize the default endpoint resolver.
2) Make market type part of the resolver input, not an env-only convention.
3) Lock the resolver and worker default behavior with focused regression tests.
4) Verify suspicious production symbol gaps against public exchange metadata before changing strategy logic.
```
- Avoid: using one implicit Binance websocket default for both spot and
  futures or relying on operators to remember an override env for canonical
  production behavior.
- Evidence:
  - 2026-04-23 production investigation showed only symbols present in both
    Binance spot and futures received `latest_decision`, while futures-only
    symbols stayed at `configured_fallback`; public `exchangeInfo` parity check
    matched that split exactly until the default endpoint contract was fixed in
    `apps/api/src/modules/market-stream/binanceStream.service.ts`.

### 2026-04-23 - Route-aware web tests must unmount before resetting history
- Context: `V1CONF-06` confidence cleanup after route-sensitive auth, reports,
  backtests, and dashboard suites still emitted false i18n and `act(...)`
  noise despite otherwise passing assertions.
- Symptom: suites logged missing-namespace warnings or `I18nProvider` act
  warnings after each test, especially when cleanup logic pushed the browser
  back to `/` in `afterEach`.
- Root cause: tests were resetting `window.history` while provider trees were
  still mounted, so route listeners and provider effects observed an extra
  route change during teardown.
- Guardrail: in route-aware web tests, call `cleanup()` before any
  `window.history.pushState(...)` reset, and wait for the intended route/lang
  state after render before asserting.
- Preferred pattern:
```text
1) Render the suite under its real route context.
2) Await the provider-owned locale/route hydration signal.
3) In afterEach, unmount first with cleanup().
4) Only then reset localStorage and window.history back to the neutral route.
```
- Avoid: resetting the route to `/` while `I18nProvider` or other route-aware
  providers are still mounted.
- Evidence:
  - 2026-04-23 `V1CONF-06`: adding `cleanup()` before history reset in the
    affected auth/reports/backtests suites removed false teardown noise while
    the same tests kept passing under the real route context.

### 2026-04-23 - DataTable component tests must not hit profile preference hydration by default
- Context: post-approval V1 confidence hardening after dashboard table suites still emitted `AggregateError` even after route-context cleanup.
- Symptom: otherwise passing component tests for bots, wallets, and backtests logged jsdom XHR failures against `/dashboard/profile/basic`.
- Root cause: shared `DataTable` column-visibility hydration calls `profileBasicCache`, and ordinary rendering tests were not isolating that profile-preference side effect.
- Guardrail: Vitest web setup should default-mock `profileBasicCache` for component tests, and only suites explicitly covering profile preference behavior should opt into real cache mocking.
- Preferred pattern:
```text
1) Trace unexpected jsdom XHR noise to the exact endpoint before changing production code.
2) If the endpoint is orthogonal to the component assertion, mock that service in the shared test harness.
3) Keep component tests focused on rendering/interaction contracts, not profile preference persistence.
4) Re-run both focused suites and a wider pack after the harness change.
```
- Avoid: changing production components just to suppress test-only profile-preference requests.
- Evidence:
  - 2026-04-23 focused tracing showed repeated `GET /dashboard/profile/basic` from `useDataTableColumnVisibilityState`; adding a default `profileBasicCache` mock in `apps/web/vitest.setup.ts` removed the `AggregateError` noise from the affected suites.

### 2026-04-23 - Optional i18n helpers used above providers must return stable function references
- Context: production auth follow-up after cached auth pages were fixed, but login still bounced back to `/auth/login` under real browser traffic.
- Symptom: the web app spammed `/auth/me` from the login chunk until the API rate limiter returned `429`, after which the dashboard session fell back to the login screen.
- Root cause: `AuthProvider` lives above the route `I18nProvider`, so `useOptionalI18n()` runs in fallback mode there. Its fallback `t` function was recreated on every render, which changed `fetchUser`, retriggered the mount effect, and looped `auth/me`.
- Guardrail: optional hooks that can run outside their provider must memoize fallback callbacks/objects, especially when downstream effects depend on them.
- Preferred pattern:
```text
1) Treat fallback hook return values as part of render stability, not just correctness.
2) Wrap fallback callbacks in `useCallback`.
3) Wrap returned helper objects in `useMemo` when callers may place them in dependency arrays.
4) Add a rerender identity test for provider-less usage.
```
- Avoid: returning a fresh fallback translator/helper function from hooks that are consumed by providers or effects during app bootstrap.
- Evidence:
  - 2026-04-23 production Playwright tracing showed 21 rapid `/auth/me` requests from the login page chunk before rate limiting; stabilizing `useOptionalI18n()` removes the changing dependency that retriggered `AuthContext` bootstrap fetches.

### 2026-04-23 - Public auth entry pages must stay dynamic after production auth hotfixes
- Context: production login follow-up after the API-base fallback fix was already deployed and direct API/browser automation confirmed auth worked on a fresh session.
- Symptom: a user could still see `Could not confirm session. Please sign in again.` even though `POST /auth/login` and the immediate `GET /auth/me` succeeded in fresh production reproduction.
- Root cause: public auth entry pages remained eligible for aggressive shared-cache delivery, so stale login shells could continue serving outdated client code after an auth hotfix deploy.
- Guardrail: `/auth/login` and `/auth/register` must explicitly opt out of static revalidation in the App Router, and the cache contract must be locked with a focused regression test.
- Preferred pattern:
```text
1) Reproduce auth against production with a fresh browser session.
2) If fresh login works, inspect auth page HTML cache behavior before changing API code.
3) Mark public auth entry pages as `dynamic = 'force-dynamic'` with `revalidate = 0`.
4) Add a focused contract test so auth pages cannot silently return to stale-cache mode.
```
- Avoid: treating a post-hotfix production auth complaint as automatic proof of backend/session failure before checking whether users are still receiving a cached auth shell.
- Evidence:
  - 2026-04-23 production reproduction: `curl` and Playwright both confirmed `POST https://api.soar.luckysparrow.ch/auth/login` -> `GET /auth/me` succeeded with valid cookies, while `curl -I https://soar.luckysparrow.ch/auth/login` still showed aggressive cache headers until the auth page contract was hardened in source.

### 2026-04-22 - Same-day release-gate evidence must sort by full artifact timestamp, not date bucket only
- Context: prod activation follow-up after a fresh passing restore-drill artifact was generated later on the same UTC day as an earlier failing restore-drill artifact.
- Symptom: `ops:release:v1:gate` still selected the older same-day `FAIL` restore proof even though a later `PASS` artifact existed, so the gate stayed `not_ready` until the selector logic was fixed.
- Root cause: `scripts/runV1ReleaseGate.mjs` compared only the captured `YYYY-MM-DD` portion from filename match groups, collapsing multiple same-day artifacts into one sort bucket and letting directory iteration order decide which file won.
- Guardrail: when release-gate evidence families can emit multiple artifacts on the same day, select the latest file by the full timestamp-bearing filename, then validate in-file freshness/PASS state.
- Preferred pattern:
```text
1) Filter files by the evidence-family filename matcher.
2) Sort candidates by the full artifact filename (or explicit full timestamp key).
3) Pick the newest same-day candidate.
4) Parse the chosen artifact body for freshness and PASS/FAIL status.
```
- Avoid: comparing only the `YYYY-MM-DD` capture group for evidence families that can produce more than one artifact per day.
- Evidence:
  - 2026-04-22 prod follow-up: `v1-restore-drill-prod-2026-04-22T22-31-28-000Z.md` was newer and `PASS`, but the gate still picked `v1-restore-drill-prod-2026-04-22T21-08-26-470Z.md` until `scripts/runV1ReleaseGate.mjs` switched to full-filename sorting and `runV1ReleaseGate.test.mjs` locked the same-day selection regression.

### 2026-04-22 - Release-gate proof freshness is not enough without PASS-state validation
- Context: V1 production activation follow-up after generating a fresh prod rollback proof and a fresh-but-failing prod restore-drill artifact.
- Symptom: the release gate initially classified the prod restore-drill family as acceptable because a same-day `v1-restore-drill-prod-*.md` file existed, even though the artifact itself reported `Status: **FAIL**`.
- Root cause: evidence readiness only checked artifact presence and freshness date, not the proof outcome encoded inside the artifact body.
- Guardrail: release-gate evidence families that represent PASS/FAIL operator proofs must validate both freshness and an explicit in-artifact `PASS` status before counting as ready evidence.
- Preferred pattern:
```text
1) Find the latest required artifact for the evidence family.
2) Validate freshness against the target day/environment.
3) Parse the artifact body for an explicit PASS contract.
4) Mark the family as failed when the artifact is fresh but not PASS.
```
- Avoid: treating same-day ops evidence files as valid proof without checking whether the proof itself succeeded.
- Evidence:
  - 2026-04-22 prod activation follow-up: `v1-restore-drill-prod-2026-04-22T21-08-26-470Z.md` was fresh but `FAIL` because `PROD_DB_CHECK_CONTAINER`-style envs were missing; `scripts/runV1ReleaseGate.mjs` and `runV1ReleaseGate.test.mjs` were updated so fresh failed proofs now keep the gate `not_ready`.

### 2026-04-22 - Missing NEXT_PUBLIC_API_BASE_URL makes prod web post auth to itself
- Context: production login incident on `https://soar.luckysparrow.ch` after the app and API were otherwise healthy.
- Symptom: login from the web UI fails even though `POST https://api.soar.luckysparrow.ch/auth/login` works and returns a valid session cookie; direct `POST https://soar.luckysparrow.ch/auth/login` returns `405 Method Not Allowed`.
- Root cause: when `NEXT_PUBLIC_API_BASE_URL` is missing from the web deploy, Axios falls back to same-origin requests, so auth and other API calls hit the Next.js web host instead of the API host.
- Guardrail: web runtime must have a safe fallback for public API base resolution in production/stage domains (`soar -> api`, `stage.soar -> stage-api`) so login and dashboard API calls do not depend on a single fragile public env var.
- Preferred pattern:
```text
1) Resolve API base from NEXT_PUBLIC_API_BASE_URL when present.
2) If it is missing in the browser, infer canonical API host from the current web hostname.
3) Keep localhost host-only/relative for local development.
4) Lock the inference with focused unit tests.
```
- Avoid: assuming a missing public API base env only breaks "some requests"; it can silently reroute login to the web app and fail with `405`.
- Evidence:
  - 2026-04-22 prod incident reproduction: `POST https://api.soar.luckysparrow.ch/auth/login` with valid credentials returned `200`, while `POST https://soar.luckysparrow.ch/auth/login` returned `405 Method Not Allowed`; web fix added `publicApiBaseUrl` inference and tests.

### 2026-04-22 - Protected prod OPS endpoints can stay externally blocked even when runtime is healthy
- Context: V1 production activation rehearsal after stage succeeded and prod deploy on SHA `49ea8e0c` was already live.
- Symptom: public prod API and web smoke pass, internal prod runtime checks pass from inside the API runtime, but external `/workers/*`, `/workers/runtime-freshness`, and `/alerts` probes remain `403`.
- Root cause: production protected OPS endpoints are intentionally still behind stricter access than stage/public smoke, so external gate commands cannot be assumed to work from the operator workstation without explicit prod-private auth exposure.
- Guardrail: treat public prod smoke and internal prod runtime verification as separate evidence classes; if protected prod OPS stays externally blocked, keep prod proof artifacts and sign-off blocked instead of loosening access or pretending the external proof exists.
- Preferred pattern:
```text
1) Verify public prod smoke (`/health`, `/ready`, web root`) separately.
2) Verify protected runtime probes from an approved internal context when needed.
3) Keep release-gate/proof artifacts fail-closed until explicit prod proof packs are generated.
4) Record the remaining blocker as operator-only, not as missing code truth.
```
- Avoid: reclassifying internal runtime diagnostics as complete prod activation proof or weakening prod OPS protection only to satisfy a script.
- Evidence:
  - 2026-04-22 production deploy on `49ea8e0c`: public smoke PASS, internal `/workers/health`, `/workers/runtime-freshness`, `/alerts` PASS, but external protected OPS endpoints remained `403`, leaving prod proof generation and final activation sign-off still blocked.

### 2026-04-25 - Final activation status must fail closed when RC sign-off artifacts disagree with gate snapshots
- Context: `V1READY-2026-04-25-A` audited the post-hardening activation artifacts after `V1COH-A` closed.
- Symptom: the repository simultaneously claimed V1 `APPROVED` in the activation pack and project state, while the RC sign-off record still captured gate values `PASS, PASS, PASS, OPEN`.
- Root cause: final activation truth had been inferred from a green-looking checklist/status surface instead of checking that the sign-off artifact itself was internally consistent with the frozen activation contract.
- Guardrail: never treat V1 activation as approved when any canonical sign-off artifact still reports mixed gate truth; rebuild the sign-off record and resync checklist/status before publishing `READY`.
- Preferred pattern:
```text
1. Compare activation pack, activation closure, RC gate status, RC checklist, and RC sign-off record together.
2. If any artifact says approval while the sign-off snapshot still contains an open gate, classify V1 as BLOCKED.
3. Queue only an operator-owned sign-off refresh, not a new engineering wave.
```
- Avoid: preserving an `APPROVED` launch claim just because named sign-offs exist somewhere in the repo while the canonical sign-off artifact still encodes `OPEN`.
- Evidence:
  - 2026-04-25 reconciliation found `docs/operations/v1-rc-signoff-record.md` reporting `PASS, PASS, PASS, OPEN` alongside `RC status: APPROVED`, so activation docs were downgraded to a fail-closed operator-blocked state and `V1READY-2026-04-25-B` was queued.

### 2026-04-22 - Coolify project visibility depends on the active team
- Context: Stage V1 rehearsal work required logging into Coolify and opening the real `Soar` project and `stage` environment.
- Symptom: direct project URLs returned `404` even though the same admin account could see the project in the browser.
- Root cause: Coolify login landed on `luckysparrow's Team`, while the live `Soar` project and `stage` environment were owned by `Root Team`; project URLs are not resolvable until the session switches to the owning team.
- Guardrail: when a Coolify project or environment URL returns `404` after successful login, inspect the team selector immediately and retry from the owning team before treating the URL as stale or the account as underprivileged.
- Preferred pattern:
```text
1) Log into Coolify.
2) Check the active team selector first.
3) Switch to `Root Team` when opening Soar production/stage project URLs.
4) Only after team verification debug missing project/environment links.
```
- Avoid: assuming project `404` means the link is wrong before checking the active team context.
- Evidence:
  - 2026-04-22 Stage access: `project/ogy0ozce7lub39mnwjwb4lwe` returned `404` under `luckysparrow's Team`, then resolved correctly after switching to `Root Team`, revealing `production` and `stage` environments plus the `stage-api` resource.

### 2026-04-21 - Docker CLI availability is not enough for local API closure packs
- Context: `CQLT-33` API closure attempt on Windows Codex desktop using local Docker-based Postgres/Redis.
- Symptom: `docker --version` succeeds, but `docker compose up -d postgres redis` fails with `//./pipe/dockerDesktopLinuxEngine` missing; DB-backed API e2e suites still fail against `localhost:5432`.
- Root cause: Docker Desktop engine is not running or not reachable even though the Docker CLI is installed on the machine.
- Guardrail: before planning DB-backed API closure or smoke packs, verify both Docker CLI and Docker Desktop engine availability; if engine pipe is missing, record the blocker immediately and avoid treating DB-test failures as app regressions.
- Preferred pattern:
```text
1) Run `docker --version`.
2) Run a lightweight `docker compose up -d postgres redis` sanity check.
3) Only then schedule Prisma migrate / DB-backed vitest packs.
4) If engine is unavailable, fall back to non-DB seam tests + build/guardrails and log the blocker in queue/context docs.
```
- Avoid: assuming `docker` command presence means local Postgres can be started for API closure validation.
- Evidence:
  - 2026-04-21 `CQLT-33` attempt: `docker compose up -d postgres redis` failed with `open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified`, while API e2e suites continued to fail with `Can't reach database server at localhost:5432`.

### 2026-04-21 - Backtest report placeholder changes e2e assumptions
- Context: ARCCON backtest lifecycle hardening introduced placeholder report records at run creation and explicit `runLifecycle` status.
- Symptom: backtests e2e scenarios failed with unique constraint collisions (`backtestRunId`) and brittle lifecycle assertions expecting only `PENDING`.
- Root cause: tests still assumed no report row exists until job completion and treated immediate post-create lifecycle state as single-value `PENDING`.
- Guardrail: for backtest-run e2e under placeholder contract, use `upsert` when seeding report rows and assert pre-ready lifecycle as `PENDING | RUNNING` with `reportReady=false`.
- Preferred pattern:
```text
1) Seed report with upsert(where: { backtestRunId }) in tests.
2) Treat post-create report contract as eventual in-progress state.
3) Reserve strict terminal assertions for `reportReady=true` paths.
```
- Avoid: direct `create` of report rows tied to runs that already initialize placeholder report state.
- Evidence:
  - 2026-04-21 ARCCON closure run: focused `backtests.e2e` failed before test adaptation, then passed (`14/14`) after adopting upsert + in-progress lifecycle assertion.

### 2026-04-21 - Inventory and guardrails must precede maintainability refactors
- Context: repository-wide code-quality audit covering hardcoded copy, oversized modules, duplicated helpers, exchange bootstrap ownership, and fallback/default drift.
- Symptom: codebase already contains multiple local copy dictionaries, several production files near or above 1k lines, repeated shared logic, and scattered fallback behavior; broad cleanup without sequencing would risk regressions in runtime/dashboard flows.
- Root cause: maintainability debt accumulated through local convenience patterns (`copyByLocale`, repeated async state choreography, helper duplication, file growth) faster than shared guardrails and extraction seams were added.
- Guardrail: for maintainability waves, always execute `inventory -> contract freeze -> guardrails/tests -> helper extraction -> module decomposition -> closure`; never start with broad rewrites of a large file or module family.
- Preferred pattern:
```text
1) Catalogue concrete offenders with file ownership and target seams.
2) Add tests/guardrails that block new debt before refactoring old debt.
3) Extract shared helpers first, then split monoliths behind stable tests.
4) Treat hardcoded user strings and hidden fallbacks as architecture decisions, not harmless shortcuts.
```
- Avoid: "cleanup" commits that mix i18n migration, helper extraction, and large structural refactors in one slice.
- Evidence:
  - 2026-04-21 audit found 34 web files with local `copy`/`copyByLocale` dictionaries, multiple oversized production modules (`HomeLiveWidgets`, `BacktestRunDetails`, `orders.service`, `BotsManagement`, `botsCommand.service`), duplicated DCA/runtime formatting logic, and uncatalogued fallback patterns across web/API layers.

### 2026-04-21 - Backtest report contract is eventually consistent, not immediately readable
- Context: grouped go-live API smoke with Docker-backed local Postgres after enabling backtest explicit-range flow.
- Symptom: `test:go-live:api` can fail in the backtests pack because `/dashboard/backtests/runs/:id/report` returns `404`, while the same file passes when rerun standalone.
- Root cause: backtest run creation is synchronous, but report persistence is asynchronous and currently driven by a local in-process queue; the e2e helper waits only a bounded polling window before asserting readiness.
- Guardrail: when validating backtest report behavior, treat report availability as eventual unless the API contract is explicitly hardened; grouped smoke failures here are more likely lifecycle-contract timing drift than deterministic simulation logic failure.
- Preferred pattern:
```text
1) Distinguish "run exists" from "report ready" in tests and planning.
2) If API keeps async report generation, expose explicit pending/degraded semantics instead of raw 404 ambiguity.
3) Do not treat a single grouped-run report 404 as proof of trading-logic regression until standalone reproduction fails too.
```
- Avoid: assuming asynchronous report unavailability means symbol/strategy/backtest math drift without checking standalone reproduction and job completion path.
- Evidence:
  - 2026-04-21 local audit: grouped `pnpm run test:go-live:api` produced one `404` at `backtests.e2e.test.ts:911`, while rerunning `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts` passed `14/14`.

### 2026-04-21 - UOLF fill-price integrity must be fail-closed
- Context: unified `order -> fill -> position` flow for runtime and dashboard manual opens.
- Symptom: runtime/dashboard tables showed broken position metrics because some opened positions had `entryPrice=0`.
- Root cause: MARKET lifecycle could persist `FILLED` order and open position without a resolved positive fill price.
- Guardrail: position-open transition must require positive fill price; unresolved fill price must stay in waiting lifecycle state (no synthetic zero-entry fallback).
- Preferred pattern:
```text
1) Propagate runtime markPrice/reference price into MARKET open-order payloads.
2) In fill lifecycle, open position only when fill price is positive and resolved.
3) Lock regressions with focused API+web tests and run deploy-critical build gates.
```
- Avoid: implicit fallback from unresolved fill price to `entryPrice=0`.
- Evidence:
  - 2026-04-21 `UOLF-HF-01` hotfix + focused validation pack (`orders.service`, `executionOrchestrator`, `orders-positions`, `HomeLiveWidgets`, `api/web build`, `quality:guardrails`).

### 2026-04-12 - PowerShell command chaining compatibility
- Context: running multi-step commands in Windows shell workflows.
- Symptom: command chains using `&&` fail in environments pinned to Windows PowerShell 5.1.
- Root cause: pipeline chain operators (`&&`, `||`) are available in PowerShell 7+, not in Windows PowerShell 5.1.
- Guardrail: use sequential commands with explicit exit-code checks for compatibility.
- Preferred pattern:
```powershell
pnpm lint
if ($LASTEXITCODE -eq 0) { pnpm test }
if ($LASTEXITCODE -eq 0) { pnpm -r build }
```
- Avoid: `pnpm lint && pnpm test && pnpm -r build`
- Evidence:
  - https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_pipeline_chain_operators?view=powershell-7.5
  - Team-reported failure pattern in this repository workflow on Windows.

### 2026-04-15 - ripgrep access denied in this workspace
- Context: repository exploration on Windows PowerShell in Codex desktop environment.
- Symptom: `rg --files <path>` fails with `Program 'rg.exe' failed to run: Access denied`.
- Root cause: environment-level execution restriction for `rg.exe` in this session.
- Guardrail: fallback to PowerShell-native discovery commands when `rg` is unavailable or blocked.
- Preferred pattern:
```powershell
Get-ChildItem -Recurse -File <path> | ForEach-Object { $_.FullName }
```
- Avoid: retry loops with `rg` after first deterministic `Access denied` failure.
- Evidence:
  - Observed on 2026-04-15 while inspecting `apps/web/src/features/*` directories in this repository.
  - Reconfirmed on 2026-04-16 while triaging `apps/api/src/modules/engine/*` and `apps/api/src/modules/market-stream/*`; `Select-String` fallback worked without retries.

### 2026-04-15 - PowerShell 5.1 UTC timestamp compatibility
- Context: generating timestamped evidence artifact names in Windows PowerShell shell scripts.
- Symptom: `Get-Date -AsUTC` fails with parameter binding error in this environment.
- Root cause: `-AsUTC` is not available in Windows PowerShell 5.1.
- Guardrail: use explicit conversion with `.ToUniversalTime()` when building UTC file-name timestamps.
- Preferred pattern:
```powershell
$ts = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH-mm-ss-fffZ')
```
- Avoid: `Get-Date -AsUTC -Format ...`
- Evidence:
  - Observed on 2026-04-15 while generating `docs/operations/_artifacts-docs-parity-*.json` in this repository.

### 2026-04-16 - Long soak load-test summary overflow
- Context: running 30-minute load soak via `apps/api/scripts/load-test.mjs`.
- Symptom: process exits with `RangeError: Maximum call stack size exceeded` at summary stage (`Math.min(...result.latenciesMs)` / `Math.max(...result.latenciesMs)`).
- Root cause: spread operator over very large latency arrays exceeds call stack for long/high-throughput runs.
- Guardrail: for 30-minute soak evidence, always persist pre/post `/metrics` snapshots and raw load output; treat script summary as optional unless load-test implementation is hardened.
- Preferred pattern:
```powershell
# capture pre/post metrics + raw runner output as primary evidence
# do not rely only on load-test JSON summary for long windows
```
- Avoid: using spread (`Math.min(...arr)`, `Math.max(...arr)`) over unbounded large arrays in long-duration load runners.
- Evidence:
  - Observed on 2026-04-16 in `docs/operations/_artifacts-cpdb24-soak-2026-04-16T02-03-29-605Z.json` (`RangeError` in `apps/api/scripts/load-test.mjs`).

### 2026-04-16 - API e2e shared-db concurrency collision
- Context: running multiple API e2e files in one `vitest` invocation against the shared local test database.
- Symptom: suites that pass individually fail in batch with FK cleanup errors (for example `BacktestRun_userId_fkey` during `wallets.crud.e2e` teardown).
- Root cause: file-level parallel execution causes cleanup order races between suites that mutate overlapping relational tables.
- Guardrail: run DB-mutating API e2e suites sequentially per file for planning/QA evidence runs unless an isolated database per worker is configured.
- Preferred pattern:
```powershell
pnpm --filter api test -- src/modules/strategies/strategies.e2e.test.ts
if ($LASTEXITCODE -eq 0) { pnpm --filter api test -- src/modules/wallets/wallets.crud.e2e.test.ts }
if ($LASTEXITCODE -eq 0) { pnpm --filter api test -- src/modules/bots/bots.wallet-contract.e2e.test.ts }
```
- Avoid: bundling several DB-mutating e2e files into a single `vitest` call in this environment.
- Evidence:
  - Reproduced on 2026-04-16 while executing WLT-23 QA pack; grouped run failed with FK cleanup collisions, sequential per-file execution passed.

### 2026-04-17 - Coolify secret-env mount requires Dockerfile syntax 1.10
- Context: Docker builds on Coolify with "Use Docker Build Secrets" enabled.
- Symptom: deployment fails early during Dockerfile parse/solve with errors like `unexpected key 'env' in 'env=COOLIFY_URL'`, often before app build steps run.
- Root cause: Coolify injects `RUN --mount=type=secret,...,env=...` options that are not supported by Dockerfile frontend `1.7`.
- Guardrail: keep all deploy Dockerfiles on `# syntax=docker/dockerfile:1.10` (or newer) when builds can receive Coolify secret mounts.
- Preferred pattern:
```Dockerfile
# syntax=docker/dockerfile:1.10
FROM node:20-bookworm-slim
```
- Avoid: mixing Coolify build-secret injection with Dockerfile frontend `1.7`.
- Evidence:
  - Local reproduction on 2026-04-17: minimal Dockerfile with `1.7` + `--mount=type=secret,env=...` failed with `unexpected key 'env'`; same file with `1.10` succeeded.
  - Applied across `apps/api/Dockerfile*` and `apps/web/Dockerfile` in this repository.

### 2026-04-17 - SCOPE LOCK, SMALL COMMITS, GROUP-END PUSH
- Context: UI/task execution in planning waves.
- Symptom: unnecessary rework caused by changing UI detail (footer language-switcher flags) without explicit request and by oversized multi-topic commits.
- Root cause: assumption-driven change beyond requested scope + bundling too many concerns in one commit.
- Guardrail:
  - `IF NOT EXPLICITLY REQUESTED, DO NOT CHANGE IT.`
  - `ONE TASK GROUP -> SMALL SCOPE-LOCKED COMMITS -> PUSH AFTER LAST COMMIT IN THAT GROUP.`
- Preferred pattern:
```text
SCOPE LOCK: implement only explicitly requested behavior.
If unsure, leave existing UI/UX unchanged.
Bridge/add-on changes are allowed only when required by failing tests/build/contracts for the requested feature.
Prefer smaller, single-purpose commits over large mixed commits.
After completing the full planned group: push immediately after the final commit.
```
- Avoid: "cleanup" or visual tweaks not listed in task acceptance criteria.
- Evidence:
  - User-reported rework caused by unnecessary footer language-switcher flag change (2026-04-17).
  - User feedback that large, multi-thread commits increase drift risk and rework (2026-04-17).

### 2026-04-17 - PLANNING SOURCE-OF-TRUTH CROSS-CHECK
- Context: answering "what is planned next" in a repository with both canonical queues and historical checklists/templates.
- Symptom: assistant reports "nothing planned" from canonical queue, while other docs still contain unchecked boxes; later tasks are rediscovered and cause context churn.
- Root cause: no explicit two-tier planning read (active canonical queue vs non-canonical/historical docs) before status response.
- Guardrail:
  - `BEFORE SAYING "NO TASKS PLANNED", RUN TWO-TIER CHECK:`
  - `TIER 1 (ACTIVE): canonical planning files only.`
  - `TIER 2 (BACKGROUND): all docs unchecked items, explicitly labeled as historical/template/non-active when applicable.`
- Preferred pattern:
```text
When user asks "what is planned":
1) Report ACTIVE queue from canonical files.
2) Separately report any non-canonical open checklists as "background/historical".
3) If mismatch exists, propose sync/archival update to avoid future drift.
```
- Avoid: collapsing all unchecked boxes into one queue or ignoring non-canonical unchecked docs entirely.
- Evidence:
  - Observed mismatch on 2026-04-17: canonical planning files had 0 open tasks while legacy docs still had many unchecked checklists (including EXCTX/VPS readiness artifacts).

### 2026-04-17 - Planning must activate executable NOW queue
- Context: user asks for a large implementation plan and expects executor to start immediately with `start` intent.
- Symptom: executor reports "nothing to do" even when a detailed plan document exists.
- Root cause: plan was documented, but canonical execution queue (`mvp-next-commits.md`) and fallback source (`mvp-execution-plan.md`) were not populated with active unchecked task commits.
- Guardrail: every new wave plan must be followed in the same turn by queue activation in canonical planning files.
- Preferred pattern:
```text
1) Write detailed wave plan file.
2) Promote first 3-5 concrete commit tasks to `NOW`.
3) Place next slice in `NEXT`, remaining slice in `PIPELINE`.
4) Mirror unchecked tasks in `mvp-execution-plan.md` so automatic refill works.
5) Add grouped batch map (A/B/C/...) for executor clarity.
```
- Avoid: leaving `NOW/NEXT/PIPELINE` as `none` after publishing a new plan.
- Evidence:
  - 2026-04-17 user report: executor had no actionable tasks despite existing UXR plan.

### 2026-04-18 - Next.js typecheck depends on fresh `.next/types` snapshot
- Context: running `pnpm --filter web run typecheck` during closure packs.
- Symptom: `tsc --noEmit` fails with many `TS6053` missing files under `apps/web/.next/types/app/...` despite unchanged route files.
- Root cause: web tsconfig includes `.next/types/**/*.ts`; if a prior `next build` fails before finishing type generation (for example lint error), cached `.next/types` can become stale/incomplete.
- Guardrail: in closure/CI-like verification, run `pnpm --filter web run build` (or `next typegen`) before final standalone `typecheck` when route tree changed or after interrupted builds.
- Preferred pattern:
```powershell
pnpm --filter web run build
if ($LASTEXITCODE -eq 0) { pnpm --filter web run typecheck }
```
- Important: do not run `web build` and `web typecheck` in parallel in this repo;
  parallel execution can race on `.next/types` generation and cause false `TS6053`.
- Canonical command shortcut added on 2026-04-18:
  - `pnpm run web:verify:build-typecheck`
  - prefer this over manual two-step command invocation in closure packs.
- Avoid: treating missing `.next/types` errors as app-code regressions before refreshing Next.js generated types.
- Evidence:
  - Observed on 2026-04-18 during `L10NQ-D-18`: `typecheck` failed with missing `.next/types/app/...`; after fixing build blocker and running `next build`, `typecheck` passed.

### 2026-04-18 - Sandbox `spawn EPERM` for `next build` / `vitest` requires escalation
- Context: running web validation commands in Codex desktop `workspace-write` sandbox.
- Symptom: `next build` and `vitest` fail early with `Error: spawn EPERM` (esbuild/child-process startup), and follow-up checks (`tsc`) can fail from stale/missing `.next/types`.
- Root cause: sandbox process-spawn restriction for toolchain subprocesses in this environment.
- Guardrail: if build/test commands fail with `spawn EPERM`, rerun those exact commands with `require_escalated`; then rerun `tsc --noEmit` after successful `next build`.
- Preferred pattern:
```text
1) Run next build (if EPERM -> rerun with escalation).
2) Run focused vitest pack (if EPERM -> rerun with escalation).
3) Run tsc --noEmit after build to validate `.next/types`.
```
- Avoid: treating `spawn EPERM` as application-code failure or closing a QA task before retrying with escalation.
- Evidence:
  - Observed on 2026-04-18 during `UXR-E-12` closure pack; non-escalated `next/vitest` failed with `spawn EPERM`, escalated reruns passed (`next build` PASS, focused Vitest pack `30/30` PASS).

### 2026-04-18 - API e2e requires active Docker Engine / local Postgres
- Context: running focused API e2e regression for bots runtime scope (`BRS-A`) in local Codex desktop environment, then revisiting the same failure during the 2026-04-25 takeover/manual-order investigation.
- Symptom: e2e run fails at setup (`prisma.log.deleteMany`) with `Can't reach database server at localhost:5432`; `docker compose up -d postgres redis` can also fail with missing `dockerDesktopLinuxEngine` pipe or with `Bind for 0.0.0.0:5432 failed: port is already allocated`.
- Root cause: DB-backed API tests depend on two things at once: a healthy Docker Desktop engine and one reachable Postgres listener on `localhost:5432`. If the `desktop-linux` engine is down, compose cannot start. If port `5432` is already bound by another local Postgres container, compose fails even though DB-backed tests may already be runnable.
- Guardrail: before DB-backed API e2e runs, verify Docker context + server health first, then verify whether `localhost:5432` is already occupied by a usable local Postgres before starting new compose services. If Docker server is unavailable, restore it first; if port `5432` is already allocated, inspect the existing container/process instead of blindly retrying compose.
- Preferred pattern:
```powershell
docker context ls
docker info
docker context use desktop-linux
Start-Process "$Env:ProgramFiles\Docker\Docker\Docker Desktop.exe"
docker compose up -d postgres redis
docker ps -a
pnpm --filter api run typecheck
pnpm run quality:guardrails
```
- Avoid: repeatedly rerunning DB-backed e2e tests before engine health is restored, or assuming a compose port-collision means Postgres is unavailable.
- Evidence:
  - Observed on 2026-04-18 during `BRS-02..BRS-04` validation (`bots.e2e.test.ts` targeted run).
  - Reconfirmed on 2026-04-25 during the takeover/manual-order investigation: `docker info` recovered after Docker Desktop was available, `docker compose up -d postgres redis` failed only because port `5432` was already allocated by `cryptosparrow-postgres-1`, and DB-backed verification then passed with `positions.takeover-status.e2e.test.ts`.

### 2026-04-19 - Domain drift in ops smoke targets after brand-domain switch
- Context: running `OPV-01` stage/prod deployment rehearsal and smoke checks.
- Symptom: smoke checks fail with `fetch failed` when targeting legacy domains (`cryptosparrow.luckysparrow.ch`, `api.cryptosparrow.luckysparrow.ch`), while current production Soar domains pass.
- Root cause: operations docs/context still referenced legacy hostnames after deployment traffic/domain switched to `soar.luckysparrow.ch` + `api.soar.luckysparrow.ch`.
- Guardrail: before rehearsal/smoke, resolve DNS for target domains and prefer canonical active production domains from latest evidence docs; if DNS is missing, record explicit external blocker instead of retry loops.
- Preferred pattern:
```powershell
Resolve-DnsName api.soar.luckysparrow.ch
Resolve-DnsName soar.luckysparrow.ch
$env:SMOKE_API_BASE_URL='https://api.soar.luckysparrow.ch'
$env:SMOKE_WEB_BASE_URL='https://soar.luckysparrow.ch'
node scripts/deploySmokeCheck.mjs --no-workers
```
- Avoid: assuming older domain contracts in smoke/release docs remain valid after brand/domain migration.
- Evidence:
  - 2026-04-19 `OPV-01` evidence pack: production smoke PASS on Soar domains, stage smoke blocked due missing stage DNS records for `stage-soar`/`stage-api.soar`.

### 2026-04-19 - RC gate status can appear stale without fresh window-report rebuild
- Context: refreshing OPV production release evidence (`OPV-03`) after collecting a new SLO observation artifact.
- Symptom: `ops:rc:gates:status` still showed old `PASS` state until rolling window reports were regenerated.
- Root cause: gate-status builder prefers latest `v1-slo-window-report-*.json` over raw `_artifacts-slo-window-*.json`; if only raw SLO is new, status can be computed from an older window report.
- Guardrail: after `ops:slo:collect`, always regenerate window reports (`7d`, `30d`) before running `ops:rc:gates:status`, or explicitly pass `--input` to the intended fresh artifact.
- Preferred pattern:
```powershell
pnpm run ops:slo:collect -- --base-url https://api.soar.luckysparrow.ch --environment production
pnpm run ops:slo:window-report -- --window-days 7
pnpm run ops:slo:window-report -- --window-days 30
pnpm run ops:rc:gates:status
```
- Avoid: treating the first post-collect gate snapshot as final when window reports were not rebuilt.
- Evidence:
  - Observed on 2026-04-19 during OPV-03 refresh. Fresh window rebuild changed snapshot from stale `PASS` to current `Gate 2 = OPEN` and `RC status = BLOCKED`.

### 2026-04-19 - Queue drift from duplicated historical phase tasks
- Context: active queue reopened `POS-37..POS-42` even though the same tasks were already marked completed in earlier canonical phase history.
- Symptom: executor receives already-delivered tasks as READY/NOW, causing repeated planning cycles and unnecessary token/work spend.
- Root cause: queue section (`NOW/NEXT` and late `Phase POS` block) was not reconciled against earlier completed phase log entries before activation.
- Guardrail: before activating or executing a queued task, cross-check task IDs against prior completed phase sections in `mvp-execution-plan.md`; if completed, close as queue-drift with verification evidence instead of re-implementing.
- Preferred pattern:
```text
1) Detect duplicate task IDs across plan phases.
2) Validate behavior with focused tests for the duplicated scope.
3) Publish closure evidence (verification + references).
4) Sync queue/board/state so duplicated tasks are marked closed.
```
- Avoid: reopening historical tasks into `NOW` without an explicit regression/new-scope reason.
- Evidence:
  - Observed on 2026-04-19 while reconciling `POS-A/POS-B` (`POS-37..POS-42`) queue state.

### 2026-04-19 - Gate status follow-ups must be state-derived, not static
- Context: RC external-gates status output used by operators during release closure.
- Symptom: generated status report always listed all manual follow-ups, including already-completed Gate 1/3 evidence.
- Root cause: follow-up section was hardcoded and not derived from current gate state.
- Guardrail: status/report scripts must generate operator follow-ups from computed gate outcomes to avoid stale or misleading required actions.
- Preferred pattern:
```text
1) Compute gate states.
2) Build follow-up list only for unresolved gates.
3) Always append checklist-sync reminder as the final step.
```
- Avoid: static "required actions" sections that ignore already-closed gates.
- Evidence:
  - Observed and fixed on 2026-04-19 in `scripts/buildRcExternalGateStatus.mjs` (`OPV-05`).

### 2026-04-19 - Private OPS auth layer can mask Gate2 probes as 401
- Context: production RC Gate2 pipeline against protected OPS endpoints (`/workers/*`, `/alerts`, `/metrics`).
- Symptom: stage smoke passes but Gate2 remains `OPEN`; probes return `401` and queue/5xx metrics become `n/a` even with valid app token flow.
- Root cause: production path can require layered auth (for example gateway basic auth or custom header) in addition to API session auth; scripts sent only bearer/cookie token.
- Guardrail: when running OPS/Gate pipelines on private routes, support and pass the additional auth layer together with app token auth.
- Preferred pattern:
```text
pnpm run ops:rc:gates:prod-pipeline -- --base-url https://<target-api> --auth-token <ADMIN_JWT> --ops-basic-user <user> --ops-basic-password <pass>
# or
pnpm run ops:rc:gates:prod-pipeline -- --base-url https://<target-api> --auth-token <ADMIN_JWT> --ops-auth-header-name <header> --ops-auth-header-value <value>
```
- Avoid: assuming `--auth-token` (or auto-login) alone is sufficient for all production OPS endpoints.
- Evidence:
  - 2026-04-19 report: stage `PASS`, prod Gate2 `FAIL/OPEN`, `/workers/*` + `/alerts` + `/metrics` returned `401`.

### 2026-04-19 - Enforce pnpm lockfile in repo config for frozen-lockfile builds
- Context: Coolify/CI Docker install step uses `pnpm install --frozen-lockfile`.
- Symptom: install can fail unless command is forced with `--config.lockfile=true`.
- Root cause: repository `.npmrc` lacked explicit pnpm `lockfile=true` safeguard in environments with config drift.
- Guardrail: keep `lockfile=true` in repository `.npmrc` so frozen-lockfile behavior is deterministic across local/CI/Coolify.
- Preferred pattern:
```text
.npmrc:
package-lock=false
lockfile=true
```
- Avoid: relying on per-command `--config.lockfile=true` overrides as the only protection in deployment pipelines.
- Evidence:
  - 2026-04-19 operator report: `pnpm install --frozen-lockfile` failed, while `pnpm install --frozen-lockfile --config.lockfile=true` passed.

### 2026-04-19 - External RC result must trigger immediate canonical docs sync
- Context: OPV/RC evidence is sometimes produced by a separate VPS operator/agent run and then pasted back into this thread.
- Symptom: canonical queue/context/docs can keep stale `OPEN/BLOCKED` gate text after final RC pass, causing drift and repeated "what is still blocked?" confusion.
- Root cause: external evidence update arrived after local doc updates, but no immediate mandatory resync step was executed.
- Guardrail: when external run evidence is received, perform a same-turn canonical sync of `PROJECT_STATE`, `TASK_BOARD`, `mvp-next-commits`, `mvp-execution-plan`, and current RC docs (`v1-rc-external-gates-status`, `v1-rc-signoff-record`, checklist if needed) before continuing feature work.
- Preferred pattern:
```text
1) Treat external evidence payload as latest source-of-truth.
2) Update canonical queue/context + RC operation docs in one tiny docs commit.
3) Run guardrails.
4) Continue normal execution queue only after sync commit is merged/pushed.
```
- Avoid: leaving known stale gate state (`G2/G4 OPEN`) in canonical docs after receiving final PASS evidence.
- Evidence:
  - 2026-04-19 handoff where final RC snapshot was `G1=PASS`, `G2=PASS`, `G3=PASS`, `G4=PASS` but local canonical docs still reflected an earlier `OPEN/BLOCKED` snapshot until synced.

### 2026-04-19 - API e2e cleanup order must include runtime dedupe/session tables
- Context: running full `pnpm --filter api run test -- --run` after SOPR closure.
- Symptom: suites passing in isolation failed in full run with FK teardown errors (`RuntimeExecutionDedupe_userId_fkey`, `BotRuntimeSession_botId_fkey`).
- Root cause: several e2e `beforeEach` cleanups deleted `user`/`bot` rows before cleaning `runtimeExecutionDedupe` and `botRuntime*` tables.
- Guardrail: in API e2e teardown, always delete `runtimeExecutionDedupe`, `botRuntimeEvent`, `botRuntimeSymbolStat`, and `botRuntimeSession` before `bot.deleteMany()`/`user.deleteMany()`.
- Preferred pattern:
```powershell
await prisma.runtimeExecutionDedupe.deleteMany();
await prisma.botRuntimeEvent.deleteMany();
await prisma.botRuntimeSymbolStat.deleteMany();
await prisma.botRuntimeSession.deleteMany();
await prisma.bot.deleteMany();
await prisma.user.deleteMany();
```
- Avoid: deleting `bot` or `user` first in suites that can inherit runtime artifacts from other files.
- Evidence:
  - 2026-04-19 full API suite failures in `auth.e2e.test.ts` and `profile/basic.e2e.test.ts` before cleanup-order fix.
  - Full rerun PASS after applying the same cleanup guardrail to `auth`, `profile/basic`, `preTrade`, `marketStream.routes`, and `positions-live-status` suites.

### 2026-04-20 - Guardrails enforce per-file test-size budgets
- Context: closing MURC wave with added e2e scenarios in `apps/api/src/modules/bots/bots.e2e.test.ts`.
- Symptom: `pnpm run quality:guardrails` failed with `Source file size budget exceeded` (`bots.e2e.test.ts: 91131 bytes`, budget `88000`).
- Root cause: adding multiple new contract tests to an already large e2e file breached repository per-file size budget.
- Guardrail: when adding new e2e coverage to near-budget files, move new scenarios into a dedicated sibling test file instead of growing existing monolith tests.
- Preferred pattern:
```text
1) Keep legacy large suite stable.
2) Add new scenario family in `*.e2e.test.ts` sibling file with shared helpers.
3) Rerun guardrails before final commit.
```
- Avoid: appending several long scenarios into a file already close to guardrail threshold.
- Evidence:
  - 2026-04-20 MURC closure: moved market-universe parity scenarios from `bots.e2e.test.ts` into `bots.market-universe-contract.e2e.test.ts`; guardrails PASS afterward.

### 2026-04-20 - Web dashboard regressions must use split test files near budget limit
- Context: closing DAWR web regression wave for dashboard wallet/sidebar.
- Symptom: `pnpm run quality:guardrails` failed on web side with `HomeLiveWidgets.test.tsx` over size budget (`99474` > `95000`).
- Root cause: appending one more long integration scenario to an already near-limit dashboard widget test file.
- Guardrail: when `HomeLiveWidgets.test.tsx` (or similar high-traffic UI test files) is close to budget, place new scenario families in dedicated sibling files (for example `HomeLiveWidgets.aggregate-wallet.test.tsx`) instead of extending the monolith.
- Preferred pattern:
```text
1) Keep legacy wide integration suite stable.
2) Add new scenario contract in a focused sibling test file.
3) Run targeted web tests + guardrails before commit.
```
- Avoid: adding large fixture-heavy regressions directly into near-limit dashboard test monoliths.
- Evidence:
  - 2026-04-20 DAWR closure: moved aggregate-success LIVE wallet regression from `HomeLiveWidgets.test.tsx` to `HomeLiveWidgets.aggregate-wallet.test.tsx`; guardrails PASS afterward.

### 2026-04-20 - Canonical planning closure must be mirrored in `mvp-execution-plan`
- Context: checking "what is planned next" after `DASHR` was already closed in queue/context docs.
- Symptom: `mvp-next-commits` and `TASK_BOARD` showed `DASHR` closed, but `mvp-execution-plan` still had `DASHR-01..DASHR-11` unchecked, causing false "pending group" signals.
- Root cause: closure sync missed one canonical planning file update in a previous wave.
- Guardrail: every group closure must include a same-turn parity pass across all four canonical files: `mvp-next-commits`, `mvp-execution-plan`, `TASK_BOARD`, `PROJECT_STATE`.
- Preferred pattern:
```text
After closing a wave:
1) Mark tasks done in queue (`mvp-next-commits`).
2) Mirror checkbox/phase status in `mvp-execution-plan`.
3) Sync `TASK_BOARD` done state.
4) Add `PROJECT_STATE` progress note.
5) Run `pnpm run quality:guardrails`.
```
- Avoid: leaving any canonical planning file with stale unchecked tasks for already-closed waves.
- Evidence:
  - 2026-04-20: `DASHR-01..DASHR-11` remained unchecked only in `mvp-execution-plan.md` until parity-sync fix.

### 2026-04-20 - Web deploy gate requires `next build` even for test-only web changes
- Context: Coolify production deploy for commit `b345a009` failed after docs/planning sync because recent web test files still contained lint-invalid `any` casts.
- Symptom: Docker build failed at `pnpm --filter web build` with `@typescript-eslint/no-explicit-any` in test files.
- Root cause: local closure pack for prior wave did not include rerun at the exact commit being deployed; test-only web changes still participate in Next.js lint/type gate during build.
- Guardrail: if any file under `apps/web/**` changed (including `*.test.tsx`), run local `pnpm --filter web run build` before push/deploy.
- Preferred pattern:
```text
1) Edit web files.
2) Run `pnpm --filter web run build`.
3) Only then commit/push for deploy.
```
- Avoid: assuming test-only edits are excluded from production build lint gates.
- Evidence:
  - 2026-04-20 Coolify log: `HomeLiveWidgets.aggregate-wallet.test.tsx` and `RuntimeSidebarSection.test.tsx` failed build on `no-explicit-any`; local web build PASS after replacing casts.
  - 2026-04-25 Coolify log for commit `0dd951d1696bd45ac11983c67e72213134a632d3` failed again inside `pnpm --filter web build`, this time on `HomeLiveWidgets.test-helpers.ts` plus a hook-deps warning in `WalletsListTable.tsx`, confirming that even helper/test-only web edits must be revalidated with a real web build before push.

### 2026-04-20 - Queue-idle mode still requires stale-status sweep before "nothing planned"
- Context: canonical queue reports `NOW/NEXT/PIPELINE = none` after major wave closures.
- Symptom: executor says there is no planned work, but several planning docs still show `queued`/`ready-for-implementation` for already-closed waves.
- Root cause: closure sync updated queue/context, but not all plan-level status headers and phase headings.
- Guardrail: when queue is idle, run a planning status sweep before confirming "nothing planned":
  - `docs/planning/*` status headers,
  - `mvp-execution-plan` phase headings,
  - `planning-catalog-index` classification rows.
- Preferred pattern:
```text
1) Confirm canonical queue idle.
2) Sweep and sync stale `queued/ready` statuses for closed waves.
3) Mirror closure in `TASK_BOARD` and `PROJECT_STATE`.
4) Re-run guardrails.
```
- Avoid: treating queue idle as fully synchronized planning state without a stale-status pass.
- Evidence:
  - 2026-04-20 PLNC-C parity sweep: stale headers found in `UXR-I`, `DAGG`, `SBSC`, `UXR`, `POS`, `PLNC`, and V1/LBT planning docs while canonical queue was already closed.

### 2026-04-20 - Prisma Windows engine lock can break `prisma generate` with `EPERM`
- Context: local API setup/validation on Windows before DB-backed wallet e2e runs.
- Symptom: `prisma generate` fails with `EPERM: operation not permitted, rename ... query_engine-windows.dll.node`.
- Root cause: stale Node processes hold file locks on Prisma engine binaries in `node_modules/.prisma/client`.
- Guardrail: if Prisma reports `EPERM` on engine rename, clear stale Node processes first, then rerun `prisma generate` before migrations/tests.
- Preferred pattern:
```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
pnpm --filter api exec prisma generate
pnpm --filter api exec prisma migrate deploy
```
- Avoid: repeated `prisma generate` retries without releasing locked Node processes.
- Evidence:
  - Observed on 2026-04-20 during WAPR closure validation setup; after stopping stale Node processes, `prisma generate` and follow-up wallet API e2e passed.

### 2026-04-23 - Full API pack needs explicit test encryption env for API-key suites
- Context: `V1ALIGN-06` closure validation on local Codex desktop after runtime truth-alignment changes.
- Symptom: `pnpm --filter api run test -- --run` fails in API-key-related suites unless encryption env is present, even when the touched runtime code is otherwise correct.
- Root cause: full API coverage includes authenticated API-key encryption paths that require versioned test encryption material; the local shell does not always provide those env vars by default.
- Guardrail: before treating full API-pack failures as regressions, set the test-only encryption env explicitly:
  - `API_KEY_ENCRYPTION_KEYS`
  - `API_KEY_ENCRYPTION_ACTIVE_VERSION`
- Preferred pattern:
```powershell
$env:API_KEY_ENCRYPTION_KEYS='v1:test-key-material'
$env:API_KEY_ENCRYPTION_ACTIVE_VERSION='v1'
pnpm --filter api run test -- --run
```
- Avoid: assuming the API pack is self-contained on a fresh shell when it exercises encrypted API-key flows.
- Evidence:
  - 2026-04-23 `V1ALIGN-06`: focused runtime pack, typecheck, and guardrails passed first; the full API pack also passed once the explicit test encryption env was exported in the same shell.
