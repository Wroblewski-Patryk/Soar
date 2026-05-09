# MVP Next Commits Queue

Operational queue for one-task execution runs.

## Start Intent
- User sends any short "start work" nudge (`rob`, `rób`, `dzialaj`, `start`, `go`, `next`).
- Agent executes exactly one unchecked task from `NOW`.

## NOW
- [x] `EXCHANGE2-27-GATEIO-OPEN-ORDERS-SNAPSHOT-2026-05-09 feature(exchange): enable Gate.io open-orders snapshot`
  - 2026-05-09: Enable only `GATEIO` `OPEN_ORDERS_SNAPSHOT` through the
    existing authenticated-read boundary, while keeping Gate.io
    trade-history/live/cancel unsupported. Focused exchange tests,
    authenticated snapshot service test, API typecheck, guardrails, docs
    parity, and diff check passed. Production build-info and public smoke pass
    for `214a9c034d38ab8670fd4b43d0f8ed692d78d90c`. Evidence:
    `docs/planning/exchange2-27-gateio-open-orders-snapshot-task-2026-05-09.md`
    and `docs/operations/deploy-freshness-214a9c03-2026-05-09.md`.

- [x] `EXCHANGE2-26-GATEIO-POSITIONS-SNAPSHOT-2026-05-09 feature(exchange): enable Gate.io positions snapshot`
  - 2026-05-09: Enable only `GATEIO` `POSITIONS_SNAPSHOT` through the existing
    authenticated-read boundary and positions exchange-snapshot route, while
    keeping Gate.io open-orders/trade-history/live/cancel unsupported. Focused
    exchange tests, positions e2e, authenticated snapshot service tests, API
    typecheck, guardrails, docs parity, and diff check passed. Production
    build-info and public smoke pass for
    `4c7548acc74295f27676c1f00d79dbf58b873942`. Evidence:
    `docs/planning/exchange2-26-gateio-positions-snapshot-task-2026-05-09.md`
    and `docs/operations/deploy-freshness-4c7548ac-2026-05-09.md`.

- [x] `EXCHANGE2-25-GATEIO-BALANCE-PREVIEW-2026-05-09 feature(exchange): enable Gate.io balance preview`
  - 2026-05-09: Enable only `GATEIO` `BALANCE_PREVIEW` through the existing
    authenticated-read boundary and wallet preview route, while keeping Gate.io
    positions/open-orders/trade-history/live/cancel unsupported. Focused
    exchange tests, wallet e2e, API typecheck, guardrails, docs parity, and
    diff check passed. Production build-info and public smoke pass for
    `15dfacb9882fc4904a2bfcd91d8b58c05d3ac5dd`. Evidence:
    `docs/planning/exchange2-25-gateio-balance-preview-task-2026-05-09.md` and
    `docs/operations/deploy-freshness-15dfacb9-2026-05-09.md`.

- [x] `EXCHANGE2-24-GATEIO-API-KEY-PROBE-2026-05-09 feature(exchange): enable Gate.io API-key probe`
  - 2026-05-09: Replace the Binance-only profile API-key probe with a shared
    exchange-aware probe service, enable only `GATEIO` `API_KEY_PROBE`, keep
    non-Gate.io placeholders fail-closed, and preserve Gate.io
    balance/positions/open-orders/trade-history/live/cancel as unsupported.
    Focused API/Web tests, API/Web typechecks, guardrails, docs parity, and
    diff check passed. Production build-info and public smoke pass for
    `e76e08a1a20b12abaeabf4edc44a38ba37619005`. Evidence:
    `docs/planning/exchange2-24-gateio-api-key-probe-task-2026-05-09.md` and
    `docs/operations/deploy-freshness-e76e08a1-2026-05-09.md`.

- [x] `DEPLOY-FRESHNESS-1DC55D96-2026-05-09 release: verify Gate.io PAPER pricing batch deployment`
  - 2026-05-09: Verified production Web build-info for
    `1dc55d9623bab11dacb5b9f8ce9634778c139249`, ran public API/Web smoke with
    `--no-workers`, and refreshed no-secret final V1 preflight. Public checks
    pass; protected/formal V1 evidence remains blocked. Evidence:
    `docs/planning/deploy-freshness-1dc55d96-task-2026-05-09.md` and
    `docs/operations/deploy-freshness-1dc55d96-2026-05-09.md`.

- [x] `EXCHANGE2-23-GATEIO-PAPER-PRICING-ENABLE-2026-05-09 feature(exchange): enable Gate.io public PAPER pricing`
  - 2026-05-09: Enabled only `GATEIO` `PAPER_PRICING_FEED` in the shared
    capability matrix, updated API/Web wallet/bot/runtime regressions from
    paper-blocked to paper-supported, and kept Gate.io
    LIVE/authenticated/cancel capabilities fail-closed. Focused validation
    passed for Web exchange/wallet/bot UI, API runtime loop, API wallet
    create/update, and focused API bot Gate.io/placeholder gating. Evidence:
    `docs/planning/exchange2-23-gateio-paper-pricing-enable-task-2026-05-09.md`.

- [x] `V1-COMPLETION-GAP-AUDIT-2026-05-09 research: explain what blocks 100% V1 readiness`
  - 2026-05-09: Created a concise evidence-backed completion gap report that
    separates implemented/proven work, implemented-but-not-production-proven
    work, missing implementation, protected operator inputs, and release
    blockers. Evidence:
    `docs/planning/v1-completion-gap-audit-task-2026-05-09.md` and
    `docs/operations/v1-completion-gap-report-2026-05-09.md`.

- [x] `DEPLOY-FRESHNESS-E8CD748E-2026-05-09 release: verify docs/evidence batch deployment`
  - 2026-05-09: Verified production build-info for the docs/evidence batch
    ending at `e8cd748e80b8693087e01beb21b0085ace747c49`, ran public API/Web
    smoke with `--no-workers`, and refreshed no-secret final V1 preflight.
    Public checks pass; protected/formal V1 evidence remains blocked. Evidence:
    `docs/planning/deploy-freshness-e8cd748e-task-2026-05-09.md` and
    `docs/operations/deploy-freshness-e8cd748e-2026-05-09.md`.

- [x] `CURRENT-PROD-BUILDINFO-745B5F5A-SYNC-2026-05-09 release: sync latest public build-info truth`
  - 2026-05-09: Synchronized active source-of-truth files after public UI
    evidence showed latest observed production build-info at
    `745b5f5a45eab3f86b02e023479c8358f760bbf6`. This SHA is docs/evidence
    only over protected runtime/preflight baseline
    `30b027b78544f76b5b638851e8e27c98f6d22ab5`; protected V1 evidence and
    Gate.io paper/live/authenticated blockers remain open. Evidence:
    `docs/planning/current-production-build-info-745b5f5a-sync-task-2026-05-09.md`.

- [x] `PROD-UI-PUBLIC-ACCESS-REFRESH-745B5F5A-2026-05-09 qa: refresh public production UI access evidence`
  - 2026-05-09: Refreshed public/unauthenticated production access evidence
    for deployed `745b5f5a45eab3f86b02e023479c8358f760bbf6`. Build-info
    matches the expected SHA, API health/readiness and public Web routes return
    HTTP 200, and unauthenticated dashboard/admin routes redirect to
    `/auth/login`. The full module clickthrough remains blocked on
    authenticated/admin production app access. Evidence:
    `docs/planning/prod-ui-public-access-refresh-745b5f5a-task-2026-05-09.md`
    and
    `docs/operations/prod-ui-public-access-clickthrough-745b5f5a-2026-05-09.md`.

- [x] `DEPLOY-FRESHNESS-30B027B7-2026-05-09 release: verify protected-backlog sync batch deployment`
  - 2026-05-09: Pushed the protected-backlog sync batch ending at
    `30b027b78544f76b5b638851e8e27c98f6d22ab5`, verified production Web
    build-info reached that SHA on the follow-up wait, ran public API/Web
    smoke with `--no-workers`, and refreshed no-secret final V1 preflight.
    Public checks pass; protected/formal V1 evidence remains blocked.
    Evidence:
    `docs/planning/deploy-freshness-30b027b7-task-2026-05-09.md` and
    `docs/operations/deploy-freshness-30b027b7-2026-05-09.md`.

- [x] `OPEN-PROTECTED-BACKLOG-BA3D852D-SYNC-2026-05-09 release: sync protected backlog target`
  - 2026-05-09: Retargeted the active protected V1 backlog and final blocker
    pack to deployed `ba3d852d5126b625a8cf702ab647d5c644d86f9c` without
    closing protected evidence. `LIVEIMPORT-03`, rollback proof, restore
    proof, RC approval, and authenticated/admin UI audit remain blocked on
    operator inputs. Evidence:
    `docs/planning/open-protected-backlog-ba3d852d-sync-task-2026-05-09.md`.

- [x] `DEPLOY-FRESHNESS-BA3D852D-2026-05-09 release: verify docs/status sync batch deployment`
  - 2026-05-09: Pushed the docs/status sync batch ending at
    `ba3d852d5126b625a8cf702ab647d5c644d86f9c`, verified production Web
    build-info reached that SHA, ran public API/Web smoke with `--no-workers`,
    and refreshed no-secret final V1 preflight. Public checks pass;
    protected/formal V1 evidence remains blocked. Evidence:
    `docs/planning/deploy-freshness-ba3d852d-task-2026-05-09.md` and
    `docs/operations/deploy-freshness-ba3d852d-2026-05-09.md`.

- [x] `DEPLOY-FRESHNESS-010B4F8B-2026-05-09 release: verify Gate.io source batch deployment`
  - 2026-05-09: Verified production build-info for the three-commit Gate.io
    source batch ending at `010b4f8b6abfaf4c24d26550eb4761215d119f21`, ran
    public API/Web smoke, and refreshed no-secret final V1 preflight. Public
    checks pass; protected/formal V1 evidence remains blocked. Evidence:
    `docs/planning/deploy-freshness-010b4f8b-task-2026-05-09.md`.

- [x] `EXCHANGE2-22-GATEIO-PUBLIC-SYMBOL-RULES-2026-05-09 fix(exchange): decouple public symbol rules from live execution`
  - 2026-05-09: Changed public symbol-rule resolution to use
    `MARKET_CATALOG` support instead of `LIVE_EXECUTION`, added Gate.io
    regression coverage, and preserved fail-closed null/no-load behavior for
    exchanges without market catalog. Gate.io paper/live/authenticated
    capabilities remain unsupported. Evidence:
    `docs/planning/exchange2-22-gateio-public-symbol-rules-task-2026-05-09.md`.

- [x] `EXCHANGE2-21-GATEIO-MARKET-STREAM-SOURCE-SMOKE-2026-05-09 qa: add Gate.io public market-stream source smoke`
  - 2026-05-09: Added a public-read-only smoke runner for the existing Gate.io
    polling market-stream source and captured real `GATEIO/FUTURES/BTCUSDT`
    ticker plus final `1m` candle events. The artifact records no credentials,
    exchange writes, live orders, or paper pricing enablement. Gate.io
    `PAPER_PRICING_FEED`, authenticated reads, live submit, and cancel remain
    unsupported until exact support and deployment/protected evidence exist.
    Evidence:
    `docs/planning/exchange2-21-gateio-market-stream-source-smoke-task-2026-05-09.md`.

- [x] `DEPLOY-LAG-D355DF93-FOLLOW-UP-2026-05-09 release: record deploy lag follow-up after pushed operator handoff`
  - 2026-05-09: Recorded that pushed operator handoff/source-of-truth commit
    `d355df93107f4d7ff9d6231107528295cbc873c2` did not reach production
    build-info during a bounded 120-second follow-up wait. Production remains
    build-info-proven at `c50e1e7c`; the next deploy action requires
    operator-side Coolify inspection or an approved trigger, not empty
    retrigger commits. Evidence:
    `docs/planning/deploy-lag-d355df93-follow-up-task-2026-05-09.md`.

- [x] `UX-UI-MEMORY-AUTONOMY-2026-05-08 design: make UX/UI feedback memory autonomous`
  - 2026-05-08: Extended the existing user feedback loop, design memory, and
    screen quality checklist so future UX/UI work autonomously classifies user
    guidance, stores reusable memory in the matching source of truth, performs
    memory preflight before implementation, and asks the user only for
    conflicts or global visual-direction changes. Evidence:
    `docs/planning/ux-ui-memory-autonomy-process-task-2026-05-08.md`.

- [x] `EXCHANGE2-LIVE-READINESS-PLAN-2026-05-08 planning: stage second exchange adapter after V1 live readiness`
  - 2026-05-09: Reconciled
    `docs/planning/second-exchange-live-readiness-plan-2026-05-08.md` after
    the deployed Gate.io foundation. Planning is complete and now records the
    exact current truth: `GATEIO` is selected, public catalog and public
    `FUTURES`/swap market-data foundation are implemented, while paper
    pricing, authenticated reads, live submit, and exchange-side cancel remain
    unsupported until exact operation support and evidence exist. Do not enable
    broad exchange capabilities for a second exchange before exact operation
    support is implemented and verified.

- [x] `EXCHANGE2-20 planning: reconcile Gate.io second-exchange plan`
  - 2026-05-09: Updated the second-exchange plan, queue, and state docs so
    completed Gate.io foundation work is separated from remaining
    paper/live/auth blockers. Evidence:
    `docs/planning/exchange2-20-plan-reconciliation-task-2026-05-09.md`.
- [x] `EXCHANGE2-01 chore(exchange): register GATEIO as fail-closed placeholder`
  - 2026-05-08: Add `GATEIO` to the Prisma/shared exchange catalogs and exact
    operation matrices with every execution/read capability disabled. This is
    the required fail-closed foundation before implementing any Gate.io
    adapter surface. Evidence:
    `docs/planning/exchange2-01-gateio-fail-closed-placeholder-task-2026-05-08.md`.
- [x] `EXCHANGE2-02 feat(exchange): enable Gate.io public market catalog`
  - 2026-05-08: Enable only `MARKET_CATALOG` for `GATEIO` and route catalog
    reads through the existing exchange adapter boundary. Gate.io adapter
    failures must fail closed instead of returning sample markets. Paper
    pricing, authenticated reads, LIVE submit, and cancel remain unsupported.
    Evidence:
    `docs/planning/exchange2-02-gateio-public-market-catalog-task-2026-05-08.md`.

- [x] `EXCHANGE2-03 runtime: generalize market-event exchange boundary`
  - 2026-05-08: Widen runtime market events to carry any registered exchange
    so future Gate.io adapters can publish canonical ticker/candle events
    without pretending to be Binance. Keep Binance stream normalization
    Binance-only and keep Gate.io paper/live/authenticated capabilities
    disabled. Evidence:
    `docs/planning/exchange2-03-runtime-market-event-exchange-boundary-task-2026-05-08.md`.

- [x] `EXCHANGE2-04 feat(exchange): add Gate.io public ticker/candle reader`
  - 2026-05-08: Add the exchange-module public market-data reader for Gate.io
    ticker and candle reads through the existing CCXT adapter registry. Map
    app `GATEIO/FUTURES` to CCXT `swap` for perpetual futures while preserving
    Binance `future` behavior. Gate.io paper/live/authenticated capabilities
    remain disabled. Evidence:
    `docs/planning/exchange2-04-gateio-public-market-data-reader-task-2026-05-08.md`.

- [x] `EXCHANGE2-05 feat(market-stream): publish Gate.io public data as canonical events`
  - 2026-05-08: Add an opt-in `MARKET_STREAM_EXCHANGE=GATEIO` market-stream
    polling worker that reads public ticker/candle data through
    `exchangePublicMarketData.service.ts` and publishes canonical
    `MarketStreamEvent` payloads with `exchange: GATEIO`. Binance websocket
    remains the default path, and Gate.io paper/live/authenticated
    capabilities remain disabled. Evidence:
    `docs/planning/exchange2-05-gateio-market-stream-polling-task-2026-05-08.md`.

- [x] `EXCHANGE2-06 test(runtime): lock Gate.io event consumption context`
  - 2026-05-08: Add focused runtime regressions proving Gate.io ticker events
    and final-candle fallback ticker events preserve exact `exchange: GATEIO`
    and market-type context for runtime automation. Keep Gate.io
    `PAPER_PRICING_FEED` disabled until deployed source evidence is available.
    Evidence:
    `docs/planning/exchange2-06-gateio-runtime-consumption-regression-task-2026-05-08.md`.

- [x] `EXCHANGE2-07 test(market-stream): lock Gate.io polling source to fanout`
  - 2026-05-08: Added a focused mocked Redis regression proving
    `ExchangePublicPollingMarketStreamWorker` can publish Gate.io ticker and
    final-candle events through `publishMarketStreamEvent`, and subscribers
    receive canonical `MarketStreamEvent` payloads with exact `exchange:
    GATEIO`, `marketType: FUTURES`, symbol, and interval context. Gate.io
    `PAPER_PRICING_FEED`, authenticated reads, LIVE submit, and cancel remain
    disabled. Evidence:
    `docs/planning/exchange2-07-gateio-market-stream-fanout-regression-task-2026-05-08.md`.

- [x] `EXCHANGE2-08 qa(exchange): capture Gate.io public market-data smoke`
  - 2026-05-08: Captured a real public read-only Gate.io adapter smoke through
    `exchangePublicMarketData.service.ts`. `GATEIO/FUTURES/BTCUSDT` ticker and
    `1m` candle reads passed without secrets, authenticated reads, exchange
    writes, or live orders. Gate.io `PAPER_PRICING_FEED`, authenticated reads,
    LIVE submit, and cancel remain disabled until target worker/source evidence
    and explicit operation support are complete. Evidence:
    `docs/planning/exchange2-08-gateio-public-market-data-smoke-task-2026-05-08.md`
    and `docs/operations/gateio-public-market-data-smoke-2026-05-08.md`.

- [x] `EXCHANGE2-09 refactor(market-stream): lock Gate.io worker source selection`
  - 2026-05-08: Extracted market-stream worker env parsing into a pure config
    resolver and added regression coverage proving Binance remains the default
    source, Gate.io polling is selected only by
    `MARKET_STREAM_EXCHANGE=GATEIO`, and unsupported/invalid env values fall
    back to safe defaults. Gate.io `PAPER_PRICING_FEED`, authenticated reads,
    LIVE submit, and cancel remain disabled until target source evidence and
    exact operation support are complete. Evidence:
    `docs/planning/exchange2-09-gateio-market-stream-worker-config-task-2026-05-08.md`.

- [x] `EXCHANGE2-10 test(web): lock Gate.io capability gating`
  - 2026-05-08: Added a focused Web regression proving `GATEIO` is present in
    shared exchange options, supports only `MARKET_CATALOG`, and remains
    blocked for `PAPER_PRICING_FEED`, `LIVE_EXECUTION`, and `API_KEY_PROBE`.
    Unknown/nullish exchange values fail closed in UI gating. Evidence:
    `docs/planning/exchange2-10-gateio-web-capability-gating-task-2026-05-08.md`.

- [x] `EXCHANGE2-11 test(web): lock Gate.io wallet and bot form gating`
  - 2026-05-08: Added focused Web form regressions proving Gate.io PAPER wallet
    submit stays blocked while `PAPER_PRICING_FEED` is unsupported, and Gate.io
    bot activation keeps the Active toggle disabled. Evidence:
    `docs/planning/exchange2-11-gateio-wallet-bot-ui-gating-task-2026-05-08.md`.

- [x] `EXCHANGE2-12 test(api): lock Gate.io wallet create fail closed`
  - 2026-05-08: Added a DB-backed wallet API regression proving direct
    Gate.io PAPER wallet creation returns `EXCHANGE_NOT_IMPLEMENTED` for
    `PAPER_PRICING_FEED` and leaves no wallet persisted for the user. Gate.io
    paper/live/authenticated capabilities remain disabled. Evidence:
    `docs/planning/exchange2-12-gateio-api-wallet-fail-closed-task-2026-05-08.md`.

- [x] `EXCHANGE2-13 test(api): lock Gate.io wallet update fail closed`
  - 2026-05-08: Added a wallet CRUD regression proving an existing Binance
    PAPER wallet cannot be updated to `GATEIO` while `PAPER_PRICING_FEED` is
    unsupported, and the persisted wallet remains unchanged after rejection.
    Evidence:
    `docs/planning/exchange2-13-gateio-api-wallet-update-fail-closed-task-2026-05-08.md`.

- [x] `EXCHANGE2-14 test(api): lock Gate.io stored API-key probe fail closed`
  - 2026-05-08: Added API-key e2e coverage proving a stored Gate.io placeholder
    key can exist, but `POST /dashboard/profile/apiKeys/:id/test` fails closed
    with `EXCHANGE_NOT_IMPLEMENTED` for `API_KEY_PROBE` and writes no misleading
    connection-test audit log. Evidence:
    `docs/planning/exchange2-14-gateio-stored-api-key-probe-fail-closed-task-2026-05-08.md`.

- [x] `EXCHANGE2-15 test(api): lock Gate.io wallet balance preview fail closed`
  - 2026-05-08: Added wallet e2e coverage proving a stored Gate.io placeholder
    API key cannot be used for wallet balance preview while `BALANCE_PREVIEW`
    authenticated reads are unsupported, and the key is not marked used after
    rejection. Evidence:
    `docs/planning/exchange2-15-gateio-wallet-balance-preview-fail-closed-task-2026-05-08.md`.

- [x] `EXCHANGE2-16 fix(api): lock Gate.io positions snapshot explicit key fail closed`
  - 2026-05-08: Added positions snapshot e2e coverage proving an explicit
    Gate.io `apiKeyId` cannot reach test fallback data while
    `POSITIONS_SNAPSHOT` is unsupported. The service now enforces the existing
    adapter capability guard before fixture or connector reads, the route maps
    unsupported capability errors to HTTP 501, and the Gate.io key remains
    unused after rejection. Evidence:
    `docs/planning/exchange2-16-gateio-positions-snapshot-fail-closed-task-2026-05-08.md`.

- [x] `EXCHANGE2-17 fix(api): lock Gate.io reconciliation snapshots fail closed`
  - 2026-05-08: Added DB-backed service coverage proving stored Gate.io keys
    cannot reach open-orders or trade-history test fallback data while
    `OPEN_ORDERS_SNAPSHOT` and `TRADE_HISTORY_SNAPSHOT` are unsupported. Both
    paths now enforce the existing adapter capability guard before fallback or
    connector reads, preserve unsupported capability errors, and leave
    `lastUsed` unchanged after rejection. Evidence:
    `docs/planning/exchange2-17-gateio-reconciliation-snapshots-fail-closed-task-2026-05-08.md`.

- [x] `EXCHANGE2-18 test(api): lock Gate.io live submit boundary`
  - 2026-05-08: Added an exchange boundary regression proving Gate.io
    `LIVE_ORDER_SUBMIT` fails closed with unsupported capability details
    before credential resolution, connector construction, pretrade guards,
    leverage convergence, or live order adapter creation. Evidence:
    `docs/planning/exchange2-18-gateio-live-submit-boundary-task-2026-05-08.md`.

- [x] `EXCHANGE2-19 test(api): lock exchange-backed cancel route fail closed`
  - 2026-05-08: Added route-level API coverage proving exchange-backed open
    orders return HTTP 501 with `LIVE_ORDER_CANCEL_UNSUPPORTED` through
    `POST /dashboard/orders/:id/cancel`, while persisted order state remains
    `OPEN`, `canceledAt` stays null, and no `order.canceled` audit log is
    written. Gate.io and all other exchange-side cancel capabilities remain
    disabled until a canonical adapter operation exists. Evidence:
    `docs/planning/exchange2-19-exchange-backed-cancel-route-fail-closed-task-2026-05-08.md`.

- [x] `DEPLOY-FRESHNESS-90CD07D6-2026-05-08 release: verify Gate.io fail-closed batch deployment`
  - 2026-05-08: Production Web build-info now exposes
    `90cd07d602f0a31f315719b8a5cd5be3fd112313`, and public API/Web smoke passed
    for API `/health`, API `/ready`, and Web `/`. Evidence:
    `docs/planning/deploy-freshness-90cd07d6-task-2026-05-08.md` and
    `docs/operations/deploy-freshness-90cd07d6-2026-05-08.md`.

- [x] `V1-FINAL-PREFLIGHT-NODE-DEPLOY-CHECKS-2026-05-08 fix(ops): remove pnpm dependency from preflight deploy checks`
  - 2026-05-08: Final V1 preflight now runs bundled Node scripts directly for
    build-info and public smoke instead of spawning global `pnpm`, preventing
    false deploy blockers on this Windows workstation. Focused tests lock the
    command shape and remediation hints. Refreshed no-secret preflight for
    deployed `90cd07d6` reports build-info PASS and public smoke PASS, then
    blocks only on protected auth/readback, rollback proof, and RC Gate 4
    evidence. Evidence:
    `docs/planning/v1-final-preflight-node-deploy-checks-task-2026-05-08.md`
    and `docs/operations/v1-final-preflight-90cd07d6-2026-05-08.md`.

- [ ] `PROD-UI-AUDIT-PLAN-2026-05-08 qa: execute production UI module clickthrough audit`
  - 2026-05-08: Planning artifact is ready for a production-wide UI audit that
    visits all canonical public, dashboard, admin, and legacy redirect routes,
    clicks all module-level functions that are safe to exercise, captures
    screenshots/console/network evidence, and classifies every flow as PASS,
    FAIL, BLOCKED, or NOT_APPLICABLE.
  - 2026-05-09: Current production build-info and public UI access evidence are
    fresh for `745b5f5a45eab3f86b02e023479c8358f760bbf6`. Execution is now blocked
    on authenticated/admin production app access, required representative
    production test data, and explicit operator approval before live-money or
    destructive actions. Evidence plan:
    `docs/planning/prod-ui-module-clickthrough-audit-plan-2026-05-08.md`.

- [x] `PROD-UI-PUBLIC-ACCESS-CLICKTHROUGH-2026-05-08 qa: verify production public access and auth gates`
  - 2026-05-08: Captured a safe public/unauthenticated production route audit.
    API `/health` and `/ready` passed, public Web routes `/`, `/auth/login`,
    `/auth/register`, `/offline`, and `/api/build-info` returned HTTP 200, and
    protected dashboard/admin routes returned HTTP 307 to `/auth/login`.
    Build-info remains stale at
    `d0dc6459e5fa33a8e5f68c5fc36dd29cc1df440d` versus expected `373a0ceb`,
    so the full UI module clickthrough remains blocked on latest deploy plus
    authenticated/admin production app access. Evidence:
    `docs/planning/prod-ui-public-access-clickthrough-task-2026-05-08.md` and
    `docs/operations/prod-ui-public-access-clickthrough-2026-05-08.md`.

- [x] `PROD-UI-PUBLIC-ACCESS-REFRESH-90CD07D6-2026-05-09 qa: refresh public production UI access evidence`
  - 2026-05-09: Refreshed the public/unauthenticated production access audit
    after the Gate.io fail-closed batch reached production. Web build-info now
    matches `90cd07d602f0a31f315719b8a5cd5be3fd112313`, API `/health` and
    `/ready` return HTTP 200, public Web routes return HTTP 200, and protected
    dashboard/admin routes return HTTP 307 to `/auth/login`. This still does
    not satisfy the full authenticated/admin module clickthrough audit.
    Evidence:
    `docs/planning/prod-ui-public-access-refresh-90cd07d6-task-2026-05-09.md`
    and
    `docs/operations/prod-ui-public-access-clickthrough-90cd07d6-2026-05-09.md`.

- [x] `V1-FINAL-PREFLIGHT-REFRESH-90CD07D6-2026-05-09 release: refresh current no-secret V1 blocker report`
  - 2026-05-09: Ran the existing read-only final preflight against deployed
    `90cd07d602f0a31f315719b8a5cd5be3fd112313`. Build-info and public API/Web
    smoke passed, but V1 remains `BLOCKED` on missing live-import auth,
    rollback auth, production DB restore context, missing `LIVEIMPORT-03`, and
    stale 2026-05-08 release evidence for the 2026-05-09 date. Evidence:
    `docs/planning/v1-final-preflight-refresh-90cd07d6-task-2026-05-09.md`
    and `docs/operations/v1-final-preflight-90cd07d6-2026-05-09.md`.

- [x] `V1-PROD-ACTIVATION-REFRESH-2026-05-09 release: refresh production activation plan and audit`
  - 2026-05-09: Added fresh 2026-05-09 production activation plan and
    activation evidence audit as explicit `NO-GO` artifacts. Later 2026-05-09
    sync retargeted those operator-facing artifacts to current production
    build-info `4ee1672e7a3ac6d9b549b4d461120afd7f89d68f`. Follow-up
    no-secret final preflight reports activation plan and activation audit as
    `fresh`, while V1 remains `BLOCKED` on protected auth, production DB
    restore context, RC failed/open evidence, missing `LIVEIMPORT-03`, and
    rollback proof. Evidence:
    `docs/planning/v1-production-activation-refresh-2026-05-09-task.md`,
    `docs/planning/v1-production-activation-and-evidence-plan-2026-05-09.md`,
    and `docs/operations/v1-production-activation-evidence-audit-2026-05-09.md`.

- [x] `V1-RC-BLOCKED-REFRESH-2026-05-09 release: refresh RC evidence as current blocked`
  - 2026-05-09: Added explicit `--today` support to the RC status, sign-off,
    and checklist scripts so release evidence can target the operator's
    evidence date before UTC midnight. Refreshed RC gates, sign-off, and
    checklist as current `BLOCKED` evidence; follow-up preflight now reports
    RC evidence as fresh `failed` instead of stale. Evidence:
    `docs/planning/v1-rc-blocked-evidence-refresh-task-2026-05-09.md`.

- [x] `V1-ROLLBACK-PROOF-DATE-OVERRIDE-2026-05-09 fix(ops): date rollback proof evidence`
  - 2026-05-09: Added `--today <yyyy-mm-dd>` support to
    `scripts/runRollbackProofEvidence.mjs` so the next authenticated operator
    rollback proof can generate an artifact for the intended release evidence
    date. No rollback proof artifact was accepted from the sandbox-blocked
    no-auth run; rollback proof remains open until protected production auth
    and network access are available. Evidence:
    `docs/planning/v1-rollback-proof-date-override-task-2026-05-09.md`.

- [x] `V1-RESTORE-DRILL-DATE-OVERRIDE-2026-05-09 fix(ops): date restore drill evidence`
  - 2026-05-09: Added `--today <yyyy-mm-dd>` support to
    `scripts/runRestoreDrillEvidence.mjs` so the next production DB/Coolify
    restore drill can generate artifacts for the intended release evidence
    date. No restore drill artifact was accepted in this tooling-only task;
    production restore evidence remains open until approved DB/Coolify context
    is available. Evidence:
    `docs/planning/v1-restore-drill-date-override-task-2026-05-09.md`.

- [x] `V1-FINAL-BLOCKER-PACK-DATE-OVERRIDES-2026-05-09 release: sync final blocker pack date overrides`
  - 2026-05-09: Synced the final blocker execution pack with the new
    evidence-date support by declaring one `$releaseDate` and passing it to
    supported preflight, restore drill, rollback proof, RC status/sign-off,
    checklist sync, and final release gate commands. This is a runbook/state
    update only; protected production evidence remains blocked until operator
    auth and DB/Coolify context are available. Evidence:
    `docs/planning/v1-final-blocker-pack-date-overrides-task-2026-05-09.md`.

- [x] `DEPLOY-FRESHNESS-4792FBCA-2026-05-09 release: verify current V1 evidence batch deployment`
  - 2026-05-09: Pushed the batch ending at
    `4792fbca9ab3ca44d08c312f219f70d648707886`, waited until production Web
    build-info exposed that SHA, and reran safe public API/Web smoke. API
    `/health`, API `/ready`, and Web `/` passed. This does not close protected
    runtime, restore, rollback, RC approval, or authenticated UI evidence.
    Evidence:
    `docs/planning/deploy-freshness-4792fbca-task-2026-05-09.md` and
    `docs/operations/deploy-freshness-4792fbca-2026-05-09.md`.

- [x] `V1-FINAL-PREFLIGHT-4792FBCA-2026-05-09 release: refresh final preflight for deployed batch`
  - 2026-05-09: Generated no-secret final V1 preflight JSON/Markdown for
    deployed `4792fbca`. Build-info and public API/Web smoke pass; V1 remains
    correctly `BLOCKED` on missing live-import auth, rollback auth, production
    DB restore context, failed RC evidence, missing `LIVEIMPORT-03`, and stale
    restore/rollback evidence for 2026-05-09. Evidence:
    `docs/planning/v1-final-preflight-4792fbca-task-2026-05-09.md` and
    `docs/operations/v1-final-preflight-4792fbca-2026-05-09.md`.

- [x] `V1-FINAL-BLOCKER-PACK-CANDIDATE-SHA-SYNC-2026-05-09 release: sync final blocker pack candidate SHA`
  - 2026-05-09: Updated the final blocker execution pack so protected
    evidence commands use the verified deployed candidate
    `4792fbca9ab3ca44d08c312f219f70d648707886` as `$expectedSha`, while
    documenting that local evidence-only `HEAD` must not be used until
    production build-info proves it is deployed. Evidence:
    `docs/planning/v1-final-blocker-pack-candidate-sha-sync-task-2026-05-09.md`.

- [x] `V1-CONTINUATION-EXPECTED-SHA-SNIPPETS-2026-05-09 release: align continuation expected-sha snippets`
  - 2026-05-09: Updated active `.agents/state` continuation snippets so
    build-info waits and `LIVEIMPORT-03` readback examples use the verified
    deployed candidate `4792fbca9ab3ca44d08c312f219f70d648707886` and
    date-aware output paths instead of local evidence-only `HEAD`. Evidence:
    `docs/planning/v1-continuation-expected-sha-snippets-task-2026-05-09.md`.

- [x] `DASH-RUNTIME-CURRENT-AGGREGATE-2026-05-09 fix(api): prefer running runtime rows for dashboard current aggregate state`
  - 2026-05-09: Added explicit current-row selection in the runtime monitoring
    aggregate read model so dashboard current open positions, open orders,
    dynamic-stop visibility, unrealized PnL, open counts, and capital summary
    prefer the freshest `RUNNING` session row when one exists. Historical
    closed-position/trade projection continues to use the existing aggregate
    projection rows. Evidence:
    `docs/planning/dashboard-runtime-current-state-aggregate-task-2026-05-09.md`.

- [x] `DASH-RUNTIME-WIDGET-AGGREGATE-CURRENT-RENDER-2026-05-09 test(web): lock dashboard aggregate current-row rendering`
  - 2026-05-09: Added focused `HomeLiveWidgets` coverage proving a running
    bot's aggregate current open-position row renders on the dashboard while
    completed-session history remains visible in the history tab. Evidence:
    `docs/planning/dashboard-runtime-widget-aggregate-current-render-task-2026-05-09.md`.

- [x] `DEPLOY-FRESHNESS-3C5DA343-2026-05-09 release: verify dashboard runtime aggregate batch deployment`
  - 2026-05-09: Pushed the accumulated dashboard runtime aggregate batch
    ending at `3c5da34371e22aecb1a7aff0a185018870d35cec`, waited until
    production Web build-info exposed that SHA, and reran safe public API/Web
    smoke with `--no-workers`. API `/health`, API `/ready`, and Web `/`
    passed. This does not close protected runtime, restore, rollback, RC
    approval, or authenticated UI evidence. Evidence:
    `docs/planning/deploy-freshness-3c5da343-task-2026-05-09.md` and
    `docs/operations/deploy-freshness-3c5da343-2026-05-09.md`.

- [x] `V1-FINAL-PREFLIGHT-3C5DA343-2026-05-09 release: refresh final preflight for dashboard runtime batch`
  - 2026-05-09: Generated no-secret final V1 preflight JSON/Markdown for
    deployed `3c5da343`. Build-info and public API/Web smoke pass; V1 remains
    correctly `BLOCKED` on missing live-import auth, rollback auth, production
    DB restore context, failed RC evidence, missing `LIVEIMPORT-03`, and stale
    restore/rollback evidence for 2026-05-09. Evidence:
    `docs/operations/v1-final-preflight-3c5da343-2026-05-09.md`.

- [x] `V1-FINAL-BLOCKER-PACK-CANDIDATE-SHA-SYNC-3C5DA343-2026-05-09 release: retarget protected blocker commands to deployed dashboard runtime batch`
  - 2026-05-09: Updated the final blocker execution pack and active
    continuation state so protected evidence commands use verified deployed
    candidate `3c5da34371e22aecb1a7aff0a185018870d35cec` as `$expectedSha`,
    while documenting that local evidence-only `HEAD` must not be used until
    production build-info proves it is deployed. Evidence:
    `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`.

- [x] `PROD-UI-PUBLIC-ACCESS-REFRESH-3C5DA343-2026-05-09 qa: refresh public production UI access evidence for dashboard runtime batch`
  - 2026-05-09: Refreshed the public/unauthenticated production access
    evidence for deployed `3c5da34371e22aecb1a7aff0a185018870d35cec`.
    Build-info matches the expected SHA, API health/readiness and public Web
    routes return HTTP 200, and unauthenticated dashboard/admin routes redirect
    to `/auth/login`. Full authenticated/admin module clickthrough remains
    blocked on valid production app access. Evidence:
    `docs/planning/prod-ui-public-access-refresh-3c5da343-task-2026-05-09.md`
    and
    `docs/operations/prod-ui-public-access-clickthrough-3c5da343-2026-05-09.md`.

- [x] `CURRENT-EXECUTABLE-V1-BOUNDARY-3C5DA343-2026-05-09 release: clarify current executable V1 boundary`
  - 2026-05-09: Updated active continuation state so the next V1 step starts
    from the verified deployed `3c5da34371e22aecb1a7aff0a185018870d35cec`
    boundary. Completed public/no-secret evidence is listed, and protected V1
    work remains blocked on authenticated/admin production app access,
    live-import auth, rollback auth, production DB/Coolify context, and RC
    approval identities. Evidence:
    `docs/planning/current-executable-v1-boundary-3c5da343-task-2026-05-09.md`.

- [x] `V1-PROTECTED-OPERATOR-HANDOFF-3C5DA343-2026-05-09 release: publish protected operator handoff`
  - 2026-05-09: Published a concise no-secret handoff for the remaining V1
    protected blockers on deployed `3c5da34371e22aecb1a7aff0a185018870d35cec`.
    It lists required protected input names, command order, acceptance
    criteria, and evidence that must not be accepted as protected proof.
    Evidence:
    `docs/planning/v1-protected-operator-handoff-task-2026-05-09.md` and
    `docs/operations/v1-protected-operator-handoff-3c5da343-2026-05-09.md`.

- [x] `DEPLOY-FRESHNESS-4EE1672E-2026-05-09 release: verify docs/evidence handoff batch deployment`
  - 2026-05-09: Pushed the accumulated docs/evidence handoff batch ending at
    `4ee1672e7a3ac6d9b549b4d461120afd7f89d68f`, waited until production Web
    build-info exposed that SHA, ran public API/Web smoke with `--no-workers`,
    and refreshed no-secret final V1 preflight for the same SHA. Build-info
    and public smoke pass; protected V1 evidence remains blocked on auth,
    production DB restore context, failed RC evidence, `LIVEIMPORT-03`, stale
    restore evidence, and stale rollback proof. Evidence:
    `docs/planning/deploy-freshness-4ee1672e-task-2026-05-09.md` and
    `docs/operations/deploy-freshness-4ee1672e-2026-05-09.md`.

- [x] `PROD-UI-PUBLIC-ACCESS-REFRESH-4EE1672E-2026-05-09 qa: refresh public production UI access evidence for docs/evidence handoff batch`
  - 2026-05-09: Refreshed the public/unauthenticated production access
    evidence for deployed `4ee1672e7a3ac6d9b549b4d461120afd7f89d68f`.
    Build-info matches the expected SHA, API health/readiness and public Web
    routes return HTTP 200, and unauthenticated dashboard/admin routes redirect
    to `/auth/login`. Full authenticated/admin module clickthrough remains
    blocked on valid production app access. Evidence:
    `docs/planning/prod-ui-public-access-refresh-4ee1672e-task-2026-05-09.md`
    and
    `docs/operations/prod-ui-public-access-clickthrough-4ee1672e-2026-05-09.md`.

- [x] `V1-NEXT-STEPS-PROTECTED-SHA-SYNC-2026-05-09 release: align protected continuation backlog with deployed SHA`
  - 2026-05-09: Corrected active `.agents/state/next-steps.md` backlog
    instructions so `LIVEIMPORT-03` and the final release gate target
    build-info-proven `4ee1672e7a3ac6d9b549b4d461120afd7f89d68f` unless a
    newer intended code/tooling candidate is deployed and proven. This is
    docs-only state synchronization; protected V1 evidence remains blocked on
    auth/operator inputs. Evidence:
    `docs/planning/v1-next-steps-protected-sha-sync-task-2026-05-09.md`.

- [x] `CURRENT-FOCUS-4EE1672E-SYNC-2026-05-09 release: align active focus with current production SHA`
  - 2026-05-09: Updated the top active delivery-stage summary in
    `.agents/state/current-focus.md` to point at current production
    `4ee1672e7a3ac6d9b549b4d461120afd7f89d68f`, its public/no-secret
    evidence, and the protected preflight command for that SHA. Historical
    notes remain intact. Evidence:
    `docs/planning/current-focus-4ee1672e-sync-task-2026-05-09.md`.

- [x] `MVP-EXECUTION-PLAN-4EE1672E-PROGRESS-SYNC-2026-05-09 docs(planning): prepend current production progress`
  - 2026-05-09: Prepended the latest `4ee1672e` continuation and protected
    readiness sync entries to `docs/planning/mvp-execution-plan.md` so the
    SYSFINAL progress log opens with current production truth while preserving
    historical entries. Evidence:
    `docs/planning/mvp-execution-plan-4ee1672e-progress-sync-task-2026-05-09.md`.

- [x] `SYSTEM-HEALTH-4EE1672E-TOPLINE-SYNC-2026-05-09 release: sync system health topline`
  - 2026-05-09: Prepended the current production health snapshot in
    `.agents/state/system-health.md` so the first operator-facing health entry
    names deployed `4ee1672e7a3ac6d9b549b4d461120afd7f89d68f`, public/no-secret
    PASS evidence, `LIVEIMPORT-03` target sync, and the protected V1 blockers
    that still keep release readiness blocked. Evidence:
    `docs/planning/system-health-4ee1672e-topline-sync-task-2026-05-09.md`.

- [x] `DEPLOY-FRESHNESS-55469CDC-2026-05-09 release: verify source-of-truth sync batch deployment`
  - 2026-05-09: Pushed the 10-commit source-of-truth sync batch ending at
    `55469cdc2ad888b822c8cdbd86660c4ed5166e1c`, waited until production Web
    build-info exposed that SHA, ran safe public API/Web smoke with
    `--no-workers`, and refreshed no-secret final V1 preflight for the same
    SHA. Build-info and public smoke pass; protected V1 evidence remains
    blocked. Evidence:
    `docs/planning/deploy-freshness-55469cdc-task-2026-05-09.md` and
    `docs/operations/deploy-freshness-55469cdc-2026-05-09.md`.

- [x] `V1-PROTECTED-OPERATOR-DOCS-55469CDC-SYNC-2026-05-09 release: retarget protected operator docs`
  - 2026-05-09: Retargeted protected-access readiness, production activation,
    activation audit, and operator handoff docs to current production
    build-info `55469cdc2ad888b822c8cdbd86660c4ed5166e1c`. Protected V1
    remains blocked on auth/operator inputs, `LIVEIMPORT-03`, restore,
    rollback, RC approval, and authenticated/admin UI access. Evidence:
    `docs/planning/v1-protected-operator-docs-55469cdc-sync-task-2026-05-09.md`.

- [x] `MVP-EXECUTION-PLAN-55469CDC-PROGRESS-SYNC-2026-05-09 docs(planning): prepend current production progress`
  - 2026-05-09: Prepended `55469cdc` deploy freshness and protected
    operator-doc sync entries to the SYSFINAL progress log so
    `docs/planning/mvp-execution-plan.md` opens with current production truth
    while preserving older `4ee1672e` history below. Evidence:
    `docs/planning/mvp-execution-plan-55469cdc-progress-sync-task-2026-05-09.md`.

- [x] `PROD-UI-PUBLIC-ACCESS-REFRESH-55469CDC-2026-05-09 qa: refresh public production UI access evidence`
  - 2026-05-09: Refreshed public/unauthenticated production access evidence
    for deployed `55469cdc2ad888b822c8cdbd86660c4ed5166e1c`. Build-info
    matches the expected SHA, API health/readiness and public Web routes
    return HTTP 200, and unauthenticated dashboard/admin routes redirect to
    `/auth/login`. The full module clickthrough remains blocked on
    authenticated/admin production app access. Evidence:
    `docs/planning/prod-ui-public-access-refresh-55469cdc-task-2026-05-09.md`
    and
    `docs/operations/prod-ui-public-access-clickthrough-55469cdc-2026-05-09.md`.

- [x] `PROD-UI-AUDIT-CURRENT-BLOCKER-SYNC-55469CDC-2026-05-09 qa: sync production UI audit blocker`
  - 2026-05-09: Updated the production UI module clickthrough audit plan and
    active queue/context docs so the stale deploy/build-info blocker is not
    treated as current after `55469cdc` reached production. The full audit
    remains open and blocked on authenticated/admin production app access,
    representative test data, and explicit operator approval for any
    live-money or destructive action. Evidence:
    `docs/planning/prod-ui-audit-current-blocker-sync-55469cdc-task-2026-05-09.md`.

- [x] `DEPLOY-FRESHNESS-6C54BB5D-2026-05-09 release: verify protected-backlog sync batch deployment`
  - 2026-05-09: Pushed the six-commit protected-backlog/source-of-truth sync
    batch ending at `6c54bb5d02e433af2e6ba1c1d3ed76c685ff6623`, verified
    production Web build-info reached that SHA, ran public API/Web smoke with
    `--no-workers`, and refreshed no-secret final V1 preflight. Build-info and
    public smoke pass; protected V1 evidence remains blocked. Evidence:
    `docs/planning/deploy-freshness-6c54bb5d-task-2026-05-09.md` and
    `docs/operations/deploy-freshness-6c54bb5d-2026-05-09.md`.

- [x] `PROD-UI-PUBLIC-ACCESS-REFRESH-6C54BB5D-2026-05-09 qa: refresh public production UI access evidence`
  - 2026-05-09: Refreshed the public/unauthenticated production access audit
    after the protected-backlog sync batch reached production. Web build-info
    now matches `6c54bb5d02e433af2e6ba1c1d3ed76c685ff6623`, API `/health`
    and `/ready` return HTTP 200, public Web routes return HTTP 200, and
    protected dashboard/admin routes return HTTP 307 to `/auth/login`. This
    still does not satisfy the full authenticated/admin module clickthrough
    audit. Evidence:
    `docs/planning/prod-ui-public-access-refresh-6c54bb5d-task-2026-05-09.md`
    and
    `docs/operations/prod-ui-public-access-clickthrough-6c54bb5d-2026-05-09.md`.

- [x] `OPERATOR-PROTECTED-PACK-6C54BB5D-SYNC-2026-05-09 release: retarget protected operator pack`
  - 2026-05-09: Retargeted active protected command examples, activation plan,
    activation evidence audit, and current known-issue state to deployed
    `6c54bb5d02e433af2e6ba1c1d3ed76c685ff6623`. Protected V1 evidence remains
    blocked on operator auth, DB/Coolify context, RC approval, `LIVEIMPORT-03`,
    restore proof, rollback proof, and authenticated/admin UI access. Evidence:
    `docs/planning/operator-protected-pack-6c54bb5d-sync-task-2026-05-09.md`.

- [x] `DEPLOY-FRESHNESS-C50E1E7C-2026-05-09 release: verify protected operator pack deployment`
  - 2026-05-09: Verified the protected operator pack/source-of-truth sync batch
    reached production build-info
    `c50e1e7cf1e37d9c799031cacbb30a834f57e81d`, ran public API/Web smoke with
    `--no-workers`, and refreshed no-secret final V1 preflight. Build-info and
    public smoke pass; protected V1 evidence remains blocked. Evidence:
    `docs/planning/deploy-freshness-c50e1e7c-task-2026-05-09.md` and
    `docs/operations/deploy-freshness-c50e1e7c-2026-05-09.md`.

- [x] `PROD-UI-PUBLIC-ACCESS-REFRESH-C50E1E7C-2026-05-09 qa: refresh public production UI access evidence`
  - 2026-05-09: Refreshed the public/unauthenticated production access audit
    after the protected operator pack sync batch reached production. Web
    build-info now matches `c50e1e7cf1e37d9c799031cacbb30a834f57e81d`, API
    `/health` and `/ready` return HTTP 200, public Web routes return HTTP 200,
    and protected dashboard/admin routes return HTTP 307 to `/auth/login`.
    This still does not satisfy the full authenticated/admin module
    clickthrough audit. Evidence:
    `docs/planning/prod-ui-public-access-refresh-c50e1e7c-task-2026-05-09.md`
    and
    `docs/operations/prod-ui-public-access-clickthrough-c50e1e7c-2026-05-09.md`.

- [x] `DEPLOY-LAG-1F1D9C12-2026-05-09 release: wait for pushed evidence batch deployment`
  - 2026-05-09: Pushed the two-commit docs/evidence batch ending at
    `1f1d9c12e0cc99884eced81546802a261b0925e9`, then waited 900 seconds plus
    two additional 300-second follow-up waits and a later 180-second follow-up
    wait for production build-info. Production
    remained on
    `c50e1e7cf1e37d9c799031cacbb30a834f57e81d`, so `1f1d9c12` is pushed but
    not production-current. Current shell has no deploy hook/API token env
    names or working authenticated SSH/VPS inspection context. Public smoke
    for the still-deployed `c50e1e7c` surface remains PASS. The deploy-lag
    artifact includes the operator handoff, non-accepted evidence list, and
    diff scope proving no `apps`, `packages`, `prisma`, or `scripts` changes
    between `c50e1e7c` and `1f1d9c12`.
  - 2026-05-09 closure: later production build-info advanced beyond this lag
    and now reports the Gate.io source batch
    `010b4f8b6abfaf4c24d26550eb4761215d119f21`. This entry is historical and
    no longer an active deploy-freshness blocker.
    Evidence:
    `docs/planning/deploy-lag-1f1d9c12-task-2026-05-09.md` and
    `docs/operations/deploy-lag-1f1d9c12-2026-05-09.md`.

- [ ] `V1-PROTECTED-ACCESS-READINESS-2026-05-09 release: provide protected final evidence inputs`
  - 2026-05-09: Names-only readiness check found missing live-import auth,
    rollback auth, and production DB/Coolify restore context in the current
    shell. 2026-05-09 refresh: the documented protected-readiness candidate is
    current production build-info
    `30b027b78544f76b5b638851e8e27c98f6d22ab5`. Final V1 evidence remains
    blocked until protected app/operator auth, DB/Coolify context, RC approval
    identities, and authenticated/admin UI access are supplied. Evidence:
    `docs/planning/v1-protected-access-readiness-task-2026-05-09.md` and
    `docs/operations/v1-protected-access-readiness-2026-05-09.md`.

- [x] `V1-CURRENT-PREFLIGHT-STATUS-SNAPSHOT-2026-05-08 release: publish current no-secret V1 preflight snapshot`
  - 2026-05-08: Generated and committed the current no-secret final V1
    preflight JSON/Markdown snapshot for deployed SHA
    `052df82244ea0f81e8611ff8bb2b677db115bd19`. The snapshot reports
    build-info PASS, public smoke PASS, production DB restore context
    SATISFIED, and current blockers limited to live-import auth/readback,
    rollback guard auth/proof, and RC Gate 4 approval evidence. Evidence:
    `docs/operations/_artifacts-v1-final-preflight-current.json`,
    `docs/operations/v1-final-preflight-current.md`, and
    `docs/planning/v1-current-preflight-status-snapshot-task-2026-05-08.md`.
- [x] `V1-FINAL-BLOCKER-PACK-RESTORE-STATE-SYNC-2026-05-08 release: sync final blocker pack after restore evidence`
  - 2026-05-08: Synchronized the active final blocker pack and continuation
    state after deployed commit `721fe8482922835a9419f0e529baeef4ff6a74c9`
    confirmed build-info PASS, public smoke PASS, and production DB restore
    context SATISFIED by fresh backup/restore drill evidence. Current V1
    blockers are limited to live-import auth/readback, rollback guard
    auth/proof, and RC Gate 4 approval evidence. Evidence:
    `docs/planning/v1-final-blocker-pack-restore-state-sync-task-2026-05-08.md`.
- [x] `V1-PROTECTED-AUTH-CONTEXT-SWEEP-2026-05-08 release: classify protected auth context after restore drill`
  - 2026-05-08: Inspected approved Coolify/API runtime context without
    persisting secret values, confirmed no `LIVEIMPORT_READBACK_*` or
    `ROLLBACK_GUARD_*` auth env names are present, reran rollback proof and
    captured the expected fail-closed `401` evidence, and corrected
    `ops:release:v1:preflight` so fresh production restore drill evidence
    satisfies the production DB restore prerequisite. Current preflight still
    blocks on live-import auth, rollback auth, RC Gate 4 approval evidence,
    missing `LIVEIMPORT-03`, and failed rollback proof. Evidence:
    `docs/planning/v1-protected-auth-context-sweep-task-2026-05-08.md`.
- [x] `V1-PROD-RESTORE-DRILL-COOLIFY-TERMINAL-2026-05-08 release: verify production restore drill execution path`
  - 2026-05-08: Used approved Coolify terminal access for production Postgres
    container `x11cfnz1dd9x0yzccftqzcoe` to execute the isolated production
    restore drill. The corrected `set -eu` run created a compressed backup,
    created and restored into `postgres_restore_check_20260508151624`,
    validated key table counts, dropped the restore DB, removed the backup
    dump, and returned `RESULT: PASS`. Cleanup verification returned `0`
    matching restore databases and no `/tmp/postgres_backup_*.dump` files.
    Final preflight now reports backup/restore drill evidence as fresh.
    Evidence:
    `docs/planning/v1-prod-restore-drill-coolify-terminal-task-2026-05-08.md`.
- [x] `V1-PROTECTED-EVIDENCE-COOLIFY-CONTEXT-2026-05-08 release: resolve protected V1 evidence context`
  - 2026-05-08: Used the approved Coolify operator path after the latest
    `main` deploy reached production build-info
    `e6e7d4a044ce80279c542412a91bae4a6a012392`. Public API/Web smoke passed.
    Coolify confirms the production Postgres container name is
    `x11cfnz1dd9x0yzccftqzcoe`, but local Docker cannot see that remote
    container, so the existing Docker-based restore drill cannot produce honest
    production PASS evidence from this workstation. A no-secret protected
    context preflight report was generated and remains `blocked` only on
    protected auth/DB/RC/evidence inputs. Evidence:
    `docs/planning/v1-protected-evidence-coolify-context-task-2026-05-08.md`.
- [x] `V1-FINAL-PREFLIGHT-MARKDOWN-REPORT-2026-05-08 release: add no-secret markdown report`
  - 2026-05-08: Added optional `--markdown-output <path>` support to
    `ops:release:v1:preflight`. The Markdown report is generated from the
    same no-secret preflight report object as JSON and summarizes context,
    public checks, protected prerequisites, release evidence, blockers,
    blocker details, and next actions for operator/Web handoff. It is not
    final V1 release evidence. Evidence:
    `docs/planning/v1-final-preflight-markdown-report-task-2026-05-08.md`.
- [x] `V1-FINAL-PREFLIGHT-BLOCKER-DETAILS-2026-05-08 release: add structured blocker details`
  - 2026-05-08: Added additive no-secret `blockerDetails` metadata to final
    V1 preflight JSON reports. Known and unknown blocker keys now expose
    category, severity, protected-input requirement, final-evidence
    requirement, required capability tags, and remediation availability for
    later Web/operator status rendering without parsing blocker strings.
    Evidence:
    `docs/planning/v1-final-preflight-blocker-details-task-2026-05-08.md`.
- [x] `V1-FINAL-PREFLIGHT-REMEDIATION-HINTS-2026-05-08 release: add preflight next actions`
  - 2026-05-08: Added no-secret remediation hints to final V1 preflight
    CLI/JSON output. Known blocker IDs now point to approved final blocker
    commands for build-info, public smoke, live-import readback, production
    restore drill, rollback proof, RC sign-off, gate refresh, and checklist
    sync without printing secret values or adding bypass paths. Evidence:
    `docs/planning/v1-final-preflight-remediation-hints-task-2026-05-08.md`.
- [x] `V1-FINAL-PREFLIGHT-PUBLIC-SMOKE-2026-05-08 release: include public smoke in preflight`
  - 2026-05-08: Extended `ops:release:v1:preflight` with the existing public
    deploy smoke command using `--no-workers`, added public-smoke state to the
    optional JSON report, and covered the skip path in focused tests. Current
    preflight reports build-info PASS and public API/Web smoke PASS before
    blocking on protected auth/DB/approval and evidence inputs. Evidence:
    `docs/planning/v1-final-preflight-public-smoke-task-2026-05-08.md`.
- [x] `V1-FINAL-PREFLIGHT-JSON-REPORT-2026-05-08 release: add machine-readable preflight report`
  - 2026-05-08: Added optional `--json-output <path>` support to
    `ops:release:v1:preflight`. The generated JSON is a no-secret status
    snapshot for later Web/operator visualization with deploy freshness,
    prerequisite readiness, release evidence states, and blockers. It is not
    final release evidence. Evidence:
    `docs/planning/v1-final-preflight-json-report-task-2026-05-08.md`.
- [x] `V1-FINAL-PREFLIGHT-REGRESSION-TESTS-2026-05-08 release: lock final V1 preflight checks`
  - 2026-05-08: Added focused regression tests for
    `ops:release:v1:preflight` prerequisite classification. Missing production
    auth/DB envs fail closed; complete token or email/password alternatives
    pass; production DB env families must be complete; optional OPS layers stay
    separate; and build-info wait can be skipped in local unit tests. Evidence:
    `docs/planning/v1-final-preflight-regression-tests-task-2026-05-08.md`.
- [x] `V1-FINAL-PREFLIGHT-COMMAND-2026-05-08 release: add final V1 operator preflight`
  - 2026-05-08: Added `pnpm run ops:release:v1:preflight`, a read-only
    operator command that verifies current `HEAD` through web build-info,
    reports missing protected prerequisite env names, and classifies current
    release evidence blockers through the existing release-gate evidence model.
    In this shell it exits non-zero on missing production auth/DB/approval
    inputs and creates no protected production evidence artifacts. Evidence:
    `docs/planning/v1-final-preflight-command-task-2026-05-08.md`.
- [x] `V1-RELEASE-STATE-SHA-HANDOFF-2026-05-08 release: keep deploy SHA verification dynamic`
  - 2026-05-08: Updated the active final blocker handoff and continuation
    state so future protected readback and final V1 release-gate work verifies
    the currently checked-out `HEAD` through the existing web build-info wait
    command before collecting protected evidence. The previously verified RC
    approval hardening deploy
    `1100b7fb232ce6195b24522a6a11559fe9fb8634` remains historical evidence,
    not a permanent target SHA. Evidence:
    `docs/planning/v1-release-state-sha-handoff-task-2026-05-08.md`.
- [x] `V1-RELEASE-GATE-RC-APPROVAL-EVIDENCE-2026-05-08 release: require RC approval in V1 gate`
  - 2026-05-08: Aligned the final production release gate with the real Gate 4
    approval requirement. `ops:release:v1:gate` now fails fresh RC external
    gates, sign-off, and checklist artifacts unless all RC gates are `PASS`,
    the sign-off record reports `RC status: APPROVED`, and the checklist shows
    `G4=PASS`. The refreshed dry-run
    `docs/operations/v1-release-gate-prod-2026-05-08Trc-approval-required-dry-run.md`
    remains `not_ready` and reports RC external gates, RC sign-off, and RC
    checklist as failed while Gate 4 remains open/blocked. Evidence:
    `docs/planning/v1-release-gate-rc-approval-evidence-task-2026-05-08.md`.
- [x] `V1-RELEASE-GATE-BUILD-INFO-FRESHNESS-2026-05-08 release: require deployed SHA in V1 gate`
  - 2026-05-08: Added deployed SHA freshness enforcement to the final V1
    release gate. `ops:release:v1:gate` now accepts `--expected-sha` /
    `RELEASE_GATE_EXPECTED_SHA` and runs the existing
    `ops:deploy:wait-web-build-info` step before deploy smoke. The final
    blocker pack now passes `git rev-parse HEAD` into the release gate. The
    dry-run `docs/operations/v1-release-gate-prod-2026-05-08Tbuild-info-required-dry-run.md`
    shows the planned build-info freshness step and remains `not_ready` for
    protected evidence blockers. Evidence:
    `docs/planning/v1-release-gate-build-info-freshness-task-2026-05-08.md`.
- [x] `V1-RELEASE-GATE-LIVEIMPORT-EVIDENCE-2026-05-08 release: require live-import readback in V1 gate`
  - 2026-05-08: Aligned the final production release gate with the active
    `LIVEIMPORT-03` blocker. `ops:release:v1:gate` now requires
    `docs/operations/liveimport-03-prod-readback-YYYY-MM-DD.json` for
    production and validates that it contains runtime readback visibility with
    no missing expected symbols. The refreshed dry-run
    `docs/operations/v1-release-gate-prod-2026-05-08Tliveimport-required-dry-run.md`
    remains `not_ready` and now includes
    `evidence:liveImportReadback:missing`. Evidence:
    `docs/planning/v1-release-gate-liveimport-evidence-task-2026-05-08.md`.
- [x] `V1-RELEASE-GATE-CURRENT-DRY-RUN-2026-05-08 release: refresh deployed-head V1 release gate dry-run`
  - 2026-05-08: Generated a fresh production V1 release-gate dry-run on
    deployed HEAD `3f065ac5c24ff159f97a94a0bc98948a1739eadf`. The new report
    `docs/operations/v1-release-gate-prod-2026-05-08Tcurrent-deployed-head-dry-run.md`
    remains `not_ready`: activation and RC families are fresh, backup/restore
    drill and rollback proof are fresh but failed, and dry-run mode still
    blocks final approval. No protected production credentials, exchange
    writes, DB writes, live-money actions, or destructive operations were
    used. Evidence:
    `docs/planning/v1-release-gate-current-dry-run-task-2026-05-08.md`.
- [x] `V1-RC-SIGNOFF-PREFLIGHT-HARDENING-2026-05-08 release(ops): clarify Gate 4 sign-off blockers`
  - 2026-05-08: Hardened the existing `ops:rc:signoff:build` operator output
    so blocked Gate 4 builds now print the missing required fields:
    Engineering, Product, Operations, and RC owner names. Missing
    `--owner-contact` is reported as a recommended rollback-authority handoff
    field without changing the approved-status logic. Validation PASS: script
    syntax, help path, blocked temp-output path, approved temp-output path,
    guardrails, docs parity, and diff check. Evidence:
    `docs/planning/v1-rc-signoff-preflight-hardening-task-2026-05-08.md`.
- [x] `V1-RECOVERY-PROOF-PREFLIGHT-HARDENING-2026-05-08 release(ops): clarify recovery proof prerequisites`
  - 2026-05-08: Clarified production restore drill and rollback proof
    prerequisite handoff without adding new auth/DB paths. Restore help and
    missing-container failures now name the accepted production DB env choices
    (`PROD_DB_CHECK_*` or `PRODUCTION_DB_CHECK_*`). Rollback proof help now
    names `ROLLBACK_GUARD_API_BASE_URL`, token or email/password auth choices,
    and optional OPS basic/header envs. Final blocker pack and continuation
    state now repeat those exact requirements. Validation PASS: script syntax,
    help paths, missing prod DB container fail-closed path, guardrails, docs
    parity, and diff check. Evidence:
    `docs/planning/v1-recovery-proof-preflight-hardening-task-2026-05-08.md`.
- [x] `V1-LIVEIMPORT-AUTH-PREFLIGHT-HARDENING-2026-05-08 release(ops): clarify live-import auth preflight`
  - 2026-05-08: Hardened the existing `ops:liveimport:readback` fail-closed
    missing-auth path so it names the exact accepted production auth variable
    choices without printing secret values:
    `LIVEIMPORT_READBACK_AUTH_TOKEN`, or
    `LIVEIMPORT_READBACK_AUTH_EMAIL` plus
    `LIVEIMPORT_READBACK_AUTH_PASSWORD`, with optional private OPS basic/header
    envs when that layer is enabled. The no-auth validation exits non-zero and
    creates no readback artifact. No runtime, API, DB, Web, exchange, deploy,
    or live-money behavior changed. Evidence:
    `docs/planning/v1-liveimport-auth-preflight-hardening-task-2026-05-08.md`.
- [x] `V1-DEPLOY-FRESHNESS-STATE-SYNC-2026-05-08 docs(release): sync final blocker state to deployed SHA`
  - 2026-05-08: Synchronized active V1 release state and the final blocker
    execution pack to production build-info SHA
    `0a2e2353177c15d4a4934c03837835785e01d710`, after waiting for Coolify
    deployment and confirming public deploy smoke. This SHA contains the
    backend PAPER/LIVE parity runtime fix, blocker evidence alignment, and
    deploy-wait coordination docs. No runtime, API, DB, Web, exchange, or
    live-money behavior changed. Remaining V1 blockers stay explicit:
    authenticated `LIVEIMPORT-03`, production restore drill, rollback proof,
    and Gate 4 sign-off identities/final approval. Evidence:
    `docs/planning/v1-deploy-freshness-state-sync-task-2026-05-08.md`.
- [x] `V1-PAPER-LIVE-BACKEND-RUNTIME-PARITY-2026-05-08 fix(api-runtime): keep execution orchestration adapter-pure`
  - 2026-05-08: Fixed the shared PAPER/LIVE runtime execution orchestration
    close path so entry-fee aggregation is owned by `RuntimeTradeGateway`
    instead of a direct Prisma call inside `orchestrateRuntimeSignal`. This
    keeps injected adapter gateways authoritative for parity/crash-retry tests
    while preserving the default Prisma-backed runtime implementation.
    Validation PASS: focused engine parity/crash pack (`4/4` files,
    `26/26` tests), API typecheck, repository guardrails, sequential
    DB-backed runtime/order/exchange/import/readback packs, and full local API
    suite with test-only API-key encryption env. API build and workspace build
    also pass. The initial DB-backed attempt was an environment false blocker
    from the unhealthy `desktop-linux` Docker context; `default` context plus
    `localhost:5432`/`6379` were reachable and sequential reruns passed.
    Evidence:
    `docs/planning/v1-paper-live-backend-runtime-parity-task-2026-05-08.md`.
- [x] `V1-LIVE-IMPORT-STATUS-ISOLATION-2026-05-07 fix(api): scope live import diagnostics status`
  - 2026-05-07: Fixed `/dashboard/positions/live-status` so authenticated
    users receive only their own live-import reconciliation diagnostics,
    summary, and counted open-position diagnostics. The endpoint now filters
    by `req.user.id` and recomputes the diagnostic summary/count from the
    scoped payload, preserving the existing worker status route without
    leaking or mixing another user's import symbols/API-key diagnostics.
    Validation PASS: pre-fix regression failed as expected, post-fix focused
    e2e (`3/3`), import diagnostics/service pack (`35/35`), API typecheck,
    repository guardrails, docs parity, and diff check. Evidence:
    `docs/planning/v1-live-import-status-isolation-task-2026-05-07.md`.
- [x] `V1-DASHBOARD-CRYPTO-ICONS-REGRESSION-2026-05-07 fix(web): restore dashboard crypto icon recovery`
  - 2026-05-07: Fixed the shared `AssetSymbol` renderer so dashboard asset
    rows recover from a previous image-load failure when the rendered symbol or
    icon URL changes. This keeps the existing architecture-approved icon lookup
    flow and prevents async icon resolution or table row reuse from leaving
    rows stuck on fallback letters. Validation PASS: pre-fix regression failed
    as expected, post-fix component test (`4/4`), dashboard widget pack
    (`25/25`), Web typecheck, Web lint, repository guardrails, docs parity,
    and diff check. Evidence:
    `docs/planning/v1-dashboard-crypto-icons-regression-task-2026-05-07.md`.
- [x] `V1-PROD-GITHUB-ACTIONS-REGRESSION-CLEANUP-2026-05-07 release: remove GitHub Actions production path`
  - 2026-05-07: Removed the invalid GitHub Actions production promotion and
    rollback path after operator correction. Deleted
    `.github/workflows/promote-prod.yml`, `.github/workflows/prod-rollback.yml`,
    and the local `ops:prod:promote` helper. Active deployment docs/state now
    require Coolify/manual operator deployment followed by repository-local
    build-info and V1 evidence gates. Evidence:
    `docs/planning/v1-prod-github-actions-regression-cleanup-task-2026-05-07.md`.
- [x] `V1-FINAL-BLOCKER-PREREQ-RECHECK-2026-05-07 release: recheck final blocker prerequisites`
  - 2026-05-07: Rechecked the final V1 blocker prerequisites after publishing
    the execution pack. Public production build-info is current at
    `21bb52f1e4b8865aab0dbb83ecffe698061fd7a3`, but the current shell still
    lacks Soar production auth/access. Names-only env scan found
    `FIGMA_OAUTH_TOKEN` and `IGCCSVC_DB`; a no-auth
    `ops:liveimport:readback` attempt failed closed before protected runtime
    readback; a refreshed release-gate dry-run remains `not_ready`. Evidence:
    `docs/planning/v1-final-blocker-prerequisite-recheck-task-2026-05-07.md`.
- [x] `V1-FINAL-BLOCKER-PACK-2026-05-07 release: publish final blocker execution pack`
  - 2026-05-07: Published
    `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`, a single
    current operator execution pack for the remaining V1 blockers. The pack is
    tied to production SHA `21bb52f1e4b8865aab0dbb83ecffe698061fd7a3` and lists
    the required auth/access plus exact commands for `LIVEIMPORT-03`,
    production restore drill, rollback proof, RC gates/sign-off, and final
    non-dry-run release gate. It does not approve V1. Evidence:
    `docs/planning/v1-final-blocker-execution-pack-task-2026-05-07.md`.
- [x] `V1-CONTINUATION-STATE-SYNC-2026-05-07 release: sync continuation state after recovery blockers`
  - 2026-05-07: Synchronized continuation state after the recovery-proof
    blocker refresh. The canonical `LIVEIMPORT-03` command now targets
    production build-info SHA
    `21bb52f1e4b8865aab0dbb83ecffe698061fd7a3`. System health now clearly
    distinguishes pushed/deployed code-tooling from local docs/evidence-only
    commits that are intentionally unpushed. Evidence:
    `docs/planning/v1-continuation-state-sync-task-2026-05-07.md`.
- [x] `V1-PROD-RECOVERY-PROOF-BLOCKED-REFRESH-2026-05-07 release: refresh restore and rollback blockers`
  - 2026-05-07: Replaced stale 2026-05-02 recovery proof blockers with fresh
    2026-05-07 failed/blocked evidence. Rollback proof was executed through
    the existing read-only script and failed closed on protected `401` results
    for runtime freshness and alerts. Restore drill was not executed because
    this shell lacks production database/Coolify access; a fresh failed
    artifact records that blocker. Follow-up V1 production release-gate dry-run
    now classifies backup/restore drill and rollback proof as `FAILED` rather
    than `stale`. Evidence:
    `docs/planning/v1-prod-recovery-proof-blocked-refresh-task-2026-05-07.md`.
- [x] `V1-RC-BLOCKED-REFRESH-2026-05-07 release: refresh RC evidence as blocked`
  - 2026-05-07: Refreshed RC external gates status, RC sign-off, and RC
    checklist using existing scripts without secrets or protected production
    calls. The refreshed status is intentionally blocked/open:
    `G1=PASS`, `G2=OPEN`, `G3=PASS`, `G4=OPEN`; sign-off final decision is
    `BLOCKED`. A follow-up V1 production release-gate dry-run now classifies
    activation plan/audit, RC status, RC sign-off, and RC checklist as `fresh`.
    Remaining release-gate blockers are stale backup/restore drill evidence,
    stale rollback proof pack, and dry-run mode. Evidence:
    `docs/planning/v1-rc-blocked-evidence-refresh-task-2026-05-07.md`.
- [x] `V1-PROD-ACTIVATION-REFRESH-2026-05-07 release: refresh production activation plan and audit`
  - 2026-05-07: Added fresh 2026-05-07 production activation plan and
    activation evidence audit as explicit `NO-GO` artifacts. A follow-up V1
    production release-gate dry-run now classifies activation audit and
    activation plan as `fresh`, while RC external gates status, RC sign-off, RC
    checklist, backup/restore drill evidence, rollback proof pack, and dry-run
    mode remain blockers. No protected OPS endpoint, exchange endpoint,
    live-money path, or secret was used. Evidence:
    `docs/planning/v1-production-activation-plan-refresh-task-2026-05-07.md`.
- [x] `V1-PROD-GATE-DRY-RUN-2026-05-07 release: classify current production V1 gate blockers`
  - 2026-05-07: Ran the existing V1 release-gate script in production
    dry-run mode with protected execution steps skipped. Generated JSON and
    Markdown artifacts under `docs/operations` showing `readiness=not_ready`.
    Required production evidence families are stale: activation audit,
    activation plan, RC external gates status, RC sign-off, RC checklist,
    backup/restore drill evidence, and rollback proof pack. Dry-run mode also
    correctly blocks final approval with
    `mode:prod_dry_run_requires_remote_execution`. Evidence:
    `docs/planning/v1-prod-release-gate-dry-run-task-2026-05-07.md`.
- [x] `PROD-BUILDINFO-LAG-2026-05-07 release: record build-info lag after collector hardening push`
  - 2026-05-07: Rechecked public production freshness after `origin/main`
    advanced to `21bb52f1e4b8865aab0dbb83ecffe698061fd7a3`. The canonical
    build-info wait command timed out after six HTTP 200 polls; production web
    still reported `6bf5de83b8ed285410ecc10ecc50a2567ac68ee1`. Public API
    `/health` and `/ready` passed. This is a deploy-freshness lag for the
    latest ops-tooling/docs hardening commit, not `LIVEIMPORT-03` completion
    evidence and not a live-money/runtime API change. A later recheck passed
    for `21bb52f1e4b8865aab0dbb83ecffe698061fd7a3`, so the deploy-lag note is
    closed for the code/tooling commit. Evidence:
    `docs/planning/prod-build-info-lag-after-collector-hardening-task-2026-05-07.md`.
- [x] `LIVEIMPORT-03-COLLECTOR-HARDENING-2026-05-07 fix(ops): fail closed empty runtime readback`
  - 2026-05-07: Hardened `ops:liveimport:readback` so a discovered LIVE bot
    with no RUNNING runtime session can no longer produce a successful
    evidence run. The collector now summarizes bots with runtime readback, bots
    without a running session, and unique visible symbols, then fails closed if
    no runtime positions payload was collected or if expected symbols are not
    visible in any collected readback. Validation PASS: syntax check, help
    path, dry-run path, missing-auth fail-closed path, and a local no-running
    session harness. Authenticated production ETH/DOGE readback remains the
    next blocker. Evidence:
    `docs/planning/liveimport-03-readback-collector-hardening-task-2026-05-07.md`.
- [x] `LIVEIMPORT-03-COLLECTOR-2026-05-07 release(ops): add redacted live-import readback collector`
  - 2026-05-07: Added `ops:liveimport:readback`, a read-only production
    evidence collector that reuses existing ops auth helpers, optionally checks
    web build-info against the expected SHA, discovers LIVE bots and the latest
    RUNNING session or accepts explicit bot/session ids, and reads only
    protected runtime positions for target symbols (`ETHUSDT,DOGEUSDT` by
    default). Output redacts ids with hashes and records only the runtime truth
    needed by `LIVEIMPORT-03`: visibility, ownership/management state,
    continuity/sync/takeover state, strategy/TTP/DCA context presence, and
    actionable state. Validation PASS: help path, dry-run path, and
    missing-auth fail-closed path. Actual production readback remains blocked
    until read-only auth is available. The collector/docs commit was pushed to
    `origin/main` at `6bf5de83a482eda08543138d8518e0aa23ccb3c6`; production
    build-info still reports runtime candidate `1f816362`, which contains the
    required runtime fixes, so the remaining blocker is auth rather than
    runtime deploy freshness. Evidence:
    `docs/planning/liveimport-03-readback-collector-task-2026-05-07.md`.
- [x] `PROD-PROMOTE-PREQ-2026-05-07 release: recheck production promotion prerequisites after validated push`
  - 2026-05-07: After validated local audit commits were pushed to
    `origin/main` at `1f816362c93e117e47cfe52a35e0fec93bd0b37d`, public
    production web build-info still reported the previous deployed SHA
    `834f83711ba11288829746338d1097abb6bf1c44`. The repository
    `ops:deploy:wait-web-build-info` gate timed out after six HTTP 200 polls
    that all returned the old SHA. A later rerun passed on attempt 1 with
    production build-info reporting `1f816362c93e117e47cfe52a35e0fec93bd0b37d`;
    public API `/health`, API `/ready`, and web `/auth/login` are healthy.
    `LIVEIMPORT-03` remains blocked only on authenticated read-only production
    runtime evidence, not deploy freshness. Evidence:
    `docs/planning/prod-promotion-prerequisite-sweep-task-2026-05-07.md`.
- [x] `PLAN-SWEEP-2026-05-07 release: sync planning status after local audit gates`
  - 2026-05-07: Swept active planning after `LIVEIMPORT-03` remained blocked
    by missing production read-only auth. Synchronized the top
    `mvp-execution-plan.md` progress log with local audit closure through
    `FULLARCH-FIX-11` and the production-readback prerequisite sweep. No
    runtime, API, DB, Web, deployment, exchange, or live-money behavior
    changed. Evidence:
    `docs/planning/planning-status-sweep-after-local-audit-gates-task-2026-05-07.md`.
- [x] `LIVEIMPORT-03-PREQ-2026-05-07 release: recheck production readback prerequisites`
  - 2026-05-07: Rechecked whether this shell can execute the remaining
    authenticated read-only production runtime readback after local audit gates
    closed through `FULLARCH-FIX-11`. Names-only environment scan returned only
    `FIGMA_OAUTH_TOKEN` and `STITCH_API_KEY`; no production admin token,
    operator login, ops basic auth, bearer/session cookie, or Soar production
    auth variable name is present. `LIVEIMPORT-03` remains open and must not be
    downgraded to local tests or public health/build-info evidence. Evidence:
    `docs/planning/liveimport-03-production-readback-prerequisite-sweep-task-2026-05-07.md`.
- [x] `FULLARCH-FIX-11 test(api-web): validate wallet market bot topology gate`
  - 2026-05-07: Closed a BUILDER-mode local API+Web release evidence slice for
    wallet/capital handling, market universe scope, bot create/edit/list
    behavior, single active bot market scope, multi-strategy links,
    subscription entitlements, and UI forms/tables that configure those
    contracts. Validation PASS: API pack (`11/11` files, `80/80` tests) and
    Web pack (`21/21` files, `49/49` tests). Evidence:
    `docs/planning/fullarch-fix-11-wallet-market-bot-topology-gate-task-2026-05-07.md`.
- [x] `FULLARCH-FIX-10 test(api-web): validate market stream dashboard monitoring gate`
  - 2026-05-07: Closed an ARCHITECT-mode local API+Web release evidence slice
    for market stream ingestion/fanout/routes and dashboard/bot monitoring
    surfaces after the Web navigation mock harness repair. Validation PASS:
    API pack (`9/9` files, `63/63` tests) and Web pack (`19/19` files,
    `79/79` tests). Evidence:
    `docs/planning/fullarch-fix-10-market-dashboard-monitoring-gate-task-2026-05-07.md`.
- [x] `FULLARCH-FIX-09 test(api-web): validate strategy backtest reports logs gate`
  - 2026-05-07: Closed a BUILDER-mode local API+Web release evidence slice for
    strategy/indicator parity, backtest execution/replay, reports, and
    logs/audit trail after the Web navigation mock harness repair. Validation
    PASS: API pack (`12/12` files, `92/92` tests) and Web pack (`21/21` files,
    `49/49` tests). Evidence:
    `docs/planning/fullarch-fix-09-strategy-backtest-reports-logs-gate-task-2026-05-07.md`.
- [x] `FULLARCH-FIX-08 test(api-security): validate local security and isolation release gate`
  - 2026-05-07: Closed a TESTER-mode local security/isolation release-gate
    evidence slice after the full architecture repair chain. The focused
    sequential API pack covered rate limiting, auth/session, trusted origin,
    security headers, API-key ownership/encryption, profile security,
    subscription/admin authorization, upload, bot entitlements, and
    cross-module user-data isolation. Validation PASS: `18/18` files and
    `87/87` tests with test-only API-key encryption env. Evidence:
    `docs/planning/fullarch-fix-08-security-isolation-release-gate-task-2026-05-07.md`.
- [x] `FULLARCH-FIX-07 test(api-runtime): validate runtime repair closure pack after import fixes`
  - 2026-05-07: Closed an ARCHITECT-mode validation-only slice after the
    import/readback/normalization repairs. The focused sequential API pack
    covered runtime signal merge/final-candle/loop, pre-trade and risk gates,
    execution orchestration, exchange events, order and position lifecycle,
    imported-position DCA visibility, takeover readback, and position
    automation. Validation PASS: `16/16` files and `240/240` tests. Evidence:
    `docs/planning/fullarch-fix-07-runtime-repair-closure-validation-task-2026-05-07.md`.
- [x] `FULLARCH-FIX-06 fix(api-positions): lock Binance futures position snapshot normalization`
  - 2026-05-07: Closed a BUILDER-mode local live-import hardening slice. The
    exchange snapshot normalizer now converts signed Binance futures
    `positionAmt` into positive `contracts`, derives one-way side from
    `positionSide=BOTH` plus amount sign, and preserves explicit adapter
    `position.side` as highest-priority truth. Validation PASS: pre-fix
    normalizer regression failed as expected (`3 failed`), normalizer suite
    (`5/5`), focused import/reconciliation/takeover pack (`42/42`), and API
    typecheck. Evidence:
    `docs/planning/fullarch-fix-06-binance-futures-position-normalization-task-2026-05-07.md`.
- [x] `FULLARCH-FIX-05 fix(api-bots): close single active bot scope root-suite failures`
  - 2026-05-07: Closed a BUILDER-mode API root-suite repair slice. Bot
    market-group writes now fail closed with a controlled `409` when a request
    would create or activate a second enabled `ACTIVE` market scope for the
    same bot. Stale API e2e fixtures now match the approved post-V1 topology:
    one active bot market scope with multiple ordered strategy links. Manual
    order fixtures now include wallet ownership proof for exchange-synced LIVE
    open orders and clean backtest rows before user cleanup. Validation PASS:
    focused API blocker pack (`6/6` files, `59/59` tests), API typecheck, root
    workspace tests (`api 174/174 files, 1163/1163 tests; web 145/145 files,
    482/482 tests`), lint, guardrails, docs parity, and diff check. Evidence:
    `docs/planning/fullarch-fix-05-api-single-active-bot-scope-task-2026-05-07.md`.
- [x] `FULLARCH-FIX-04 fix(web-tests): repair next/navigation mock harness drift`
  - 2026-05-07: Closed a BUILDER-mode Web test harness repair slice. Local
    Web tests that mock `next/navigation` now expose the `usePathname`
    contract required by `I18nProvider`, matching the global Vitest setup and
    restoring trustworthy Web regression evidence. No production Web, API, DB,
    exchange, deployment, or live-money behavior changed. Validation PASS:
    focused route/form harness pack (`13/13` files, `22/22` tests), full Web
    test suite (`145/145` files, `482/482` tests), Web typecheck, and local
    mock scan. Root workspace tests now proceed past Web and expose remaining
    API e2e blockers around bot market-group creation/unique `botId`
    constraints, manual LIVE exchange-synced open-order visibility, and stale
    DB cleanup FK residue. Evidence:
    `docs/planning/fullarch-fix-04-web-navigation-mock-harness-task-2026-05-07.md`.
- [x] `AOS-STATE-2026-05-07 docs(agent-os): sync continuation state to production readback queue`
  - 2026-05-07: Closed a TESTER-mode docs/state synchronization slice after
    the first open queue task proved blocked by missing authenticated
    production access in this shell. `.agents/state/*` now points future
    continuations to `LIVEIMPORT-03` authenticated read-only ETH/DOGE runtime
    readback on current production `main`, keeps `BOTMULTI-09` as the next
    protected runtime/readiness evidence item, and explicitly forbids treating
    public health/build-info checks or local regression packs as completion
    evidence for those production readbacks. No runtime, API, DB, deployment,
    or UI behavior changed. Evidence:
    `docs/planning/agent-state-production-readback-sync-task-2026-05-07.md`.
- [x] `AOS-2026-05-07 docs(agent-os): establish autonomous agent operating system`
  - 2026-05-07: Closed the requested agent operating system foundation.
    `.agents/core` now defines operating behavior, the 15-step execution loop,
    anti-regression checks, and quality gates. `.agents/state` now provides
    current focus, known issues, regression log, system health, and next-step
    memory for future "rób dalej" / "kontynuuj" runs. Agent-readable
    `docs/flows`, `docs/contracts`, and `docs/testing` indexes were added
    without moving canonical architecture truth. Evidence:
    `docs/planning/agent-operating-system-task-2026-05-07.md`.
- [x] `V1UI-41 fix(web-runtime): fail closed dashboard open-order status`
  - 2026-05-07: Closed a BUILDER-mode Dashboard Home open-order status
    hardening slice. Known backend status values still use the shared runtime
    suffix mapper and route-owned labels, while unsupported future status
    values now render the existing compact unknown display instead of raw API
    strings. No new dashboard labels, badges, or status markers were added.
    Validation PASS: focused Dashboard Home table presenter test (`17/17`),
    Web typecheck, root API+Web typecheck, Web lint, repository guardrails,
    route-reachable i18n audit (`findings=0`), full workspace build,
    `git diff --check`, and authenticated rendered `/dashboard` smoke with no
    framework overlay or post-auth console errors. Browser plugin validation
    was attempted first but local `node_repl` resolved Node `v22.13.0` while
    requiring `>=22.22.0`, so rendered validation used bundled Codex Node plus
    Playwright. Evidence:
    `docs/planning/v1ui-41-open-order-status-fail-closed-task-2026-05-07.md`.
- Operator-reported LIVE/PAPER runtime follow-ups are now queued after
  `LIVEIMPORT-02`; execute exactly one unchecked task per iteration.
- [x] `V1UI-40 fix(web-runtime): fail closed unknown runtime signal labels`
  - 2026-05-07: Closed a TESTER-mode runtime signal label hardening slice.
    Shared Dashboard/Bots runtime signal label resolvers now explicitly
    tolerate unknown backend strings and fail closed to unresolved suffixes.
    Focused Dashboard Home and Bots Monitoring tests prove unexpected market
    state and context source values render existing unresolved labels instead
    of raw backend strings or invented semantics. No backend, database,
    exchange execution, displayed copy, or styling behavior changed.
    Validation PASS: focused suffix/Dashboard/Bots tests (`10/10`), Web
    typecheck, Web lint, repository guardrails, route-reachable i18n audit
    (`findings=0`), `git diff --check`, full workspace build, and
    authenticated rendered `/dashboard` smoke after dev-server restart with no
    visible framework overlay, console warnings/errors, page errors, or 5xx
    responses. Browser plugin validation was attempted first but local
    `node_repl` resolved Node `v22.13.0` while requiring `>=22.22.0`, so
    rendered validation used bundled Codex Node plus Playwright. Evidence:
    `docs/planning/v1ui-40-runtime-signal-label-unknown-values-task-2026-05-07.md`.
- [x] `V1UI-39 refactor(web-runtime): share runtime signal label suffixes`
  - 2026-05-07: Closed an ARCHITECT-mode Dashboard/Bots runtime label
    semantics slice. Dashboard Home and Bots Monitoring both render backend
    runtime signal context source and market state values, but their
    enum-to-label branching could drift. Web now resolves those backend values
    through shared suffix helpers while Dashboard Home keeps
    `dashboard.home.runtime.*` labels and Bots Monitoring keeps
    `dashboard.bots.monitoring.*` labels. No backend, database, exchange
    execution, displayed copy, or styling behavior changed. Validation PASS:
    focused suffix/Dashboard/Bots tests (`8/8`), route-reachable i18n audit
    (`findings=0`), Web typecheck, Web lint, repository guardrails,
    `git diff --check`, full workspace build, and authenticated rendered
    `/dashboard` smoke after dev-server restart with no visible framework
    overlay, console warnings/errors, page errors, or 5xx responses. Browser
    plugin validation was attempted first but local `node_repl` resolved Node
    `v22.13.0` while requiring `>=22.22.0`, so rendered validation used
    bundled Codex Node plus Playwright. Evidence:
    `docs/planning/v1ui-39-shared-runtime-signal-label-suffixes-task-2026-05-07.md`.
- [x] `V1UI-38 feat(web-runtime): show dashboard session failure detail`
  - 2026-05-07: Closed a BUILDER-mode Dashboard Home session diagnostics
    parity slice. Runtime session read models already expose `errorMessage`
    and `stopReason`; Dashboard Home now renders that backend detail inside
    the existing inactive-session warning using message-first, stop-reason
    fallback precedence and keeps the warning generic when both fields are
    absent. Validation PASS: focused RuntimeSidebarSection tests (`13/13`),
    route-reachable i18n audit (`findings=0`), Web typecheck, Web lint,
    repository guardrails, `git diff --check`, full workspace build, and
    authenticated rendered `/dashboard` smoke after dev-server restart with no
    visible framework overlay, console warnings/errors, page errors, or 5xx
    responses. Browser plugin validation was attempted first but local
    `node_repl` resolved Node `v22.13.0` while requiring `>=22.22.0`, so
    rendered validation used bundled Codex Node plus Playwright. Evidence:
    `docs/planning/v1ui-38-dashboard-session-failure-detail-task-2026-05-07.md`.
- [x] `V1UI-37 feat(web-runtime): show dashboard signal market state`
  - 2026-05-07: Closed a BUILDER-mode Dashboard Home runtime-state parity
    slice. The operator surface architecture requires runtime market surfaces
    to distinguish open-position, accepted-signal, evaluated/no-trade,
    configured-only snapshot, and unresolved states. Dashboard Home signal
    cards now render a compact badge from the backend `runtimeMarketState`
    field using route-owned `dashboard.home.runtime.marketState*` labels,
    while keeping existing context source, score, detail, and condition
    rendering intact. Validation PASS: focused RuntimeSignalsSection tests
    (`5/5`), route-reachable i18n audit (`findings=0`), Web typecheck, Web
    lint, repository guardrails, `git diff --check`, full workspace build, and
    authenticated rendered `/dashboard` smoke after dev-server restart with no
    visible framework overlay, console warnings/errors, page errors, or 5xx
    responses. Browser plugin validation was attempted first but local
    `node_repl` resolved Node `v22.13.0` while requiring `>=22.22.0`, so
    rendered validation used bundled Codex Node plus Playwright. Evidence:
    `docs/planning/v1ui-37-dashboard-signal-market-state-badge-task-2026-05-07.md`.
- [x] `V1UI-36 fix(web-i18n): restore de-CH exchange order id parity`
  - 2026-05-07: Closed an ARCHITECT-mode i18n structure slice. Runtime order
    surfaces already render backend `exchangeOrderId` in Dashboard Home and
    Bots Monitoring, and EN/PL/PT namespaces already had the matching labels,
    but `de-CH` was missing `dashboard.home.runtime.exchangeOrderId` and
    `dashboard.bots.monitoring.table.exchangeOrderId`. The German-Swiss
    namespaces now include both labels as `Exchange-ID`, restoring full
    supported-locale key parity for the exchange order identifier. Validation
    PASS: focused i18n parity tests (`9/9`), route-reachable i18n audit
    (`findings=0`), Web typecheck, Web lint, repository guardrails,
    `git diff --check`, and full workspace build. Evidence:
    `docs/planning/v1ui-36-de-ch-exchange-order-id-i18n-parity-task-2026-05-07.md`.
- [x] `V1UI-35 feat(web-runtime): show dashboard signal runtime detail`
  - 2026-05-07: Closed a TESTER-mode Dashboard Home signal diagnostics
    parity slice. API runtime symbol stats and Web types already expose
    `lastSignalMessage` and `lastSignalReason`, and Bots Monitoring already
    renders those fields as runtime detail; Dashboard Home signal cards now
    render the same backend detail using message-first, reason-second
    precedence and render no invented fallback when both fields are absent.
    Validation PASS: focused RuntimeSignalsSection tests (`4/4`),
    route-reachable i18n audit (`findings=0`), Web typecheck, Web lint,
    repository guardrails, `git diff --check`, full workspace build, and
    authenticated rendered `/dashboard` smoke after dev-server restart with no
    visible framework overlay, console warnings/errors, page errors, or 5xx
    responses. Browser plugin validation was attempted first but local
    `node_repl` resolved Node `v22.13.0` while requiring `>=22.22.0`, so
    rendered validation used bundled Codex Node plus Playwright. Evidence:
    `docs/planning/v1ui-35-dashboard-signal-runtime-detail-task-2026-05-07.md`.
- [x] `V1UI-34 feat(web-runtime): show signal score summary`
  - 2026-05-07: Closed a BUILDER-mode Dashboard Home signal diagnostics
    parity slice. API runtime symbol stats already expose
    `lastSignalScoreSummary.longScore/shortScore`; Dashboard Home now renders
    those backend scores as a compact localized LONG/SHORT score row on signal
    cards when present, and renders no score row when the backend summary is
    absent. Validation PASS: focused RuntimeSignalsSection tests (`3/3`),
    route-reachable i18n audit (`findings=0`), Web typecheck, Web lint,
    repository guardrails, `git diff --check`, full workspace build, and
    authenticated rendered `/dashboard` smoke with reload and account-menu
    interaction with no visible framework overlay, console errors, page
    errors, or 5xx responses. Browser plugin validation was attempted first
    but local `node_repl` resolved Node `v22.13.0` while requiring
    `>=22.22.0`, so rendered validation used bundled Codex Node plus
    Playwright. Evidence:
    `docs/planning/v1ui-34-dashboard-signal-score-summary-task-2026-05-07.md`.
- [x] `V1UI-33 refactor(web-runtime): share mark-price source label suffix`
  - 2026-05-07: Closed an ARCHITECT-mode Dashboard Home/Bots runtime label
    semantics slice. Mark-price source kind suffix mapping now lives in the
    shared open-position derivation utility, while Bots keeps
    `dashboard.bots.monitoring.*` keys and Dashboard Home keeps
    `dashboard.home.runtime.*` keys. This removes duplicated source-kind
    mapping without changing backend runtime data handling or displayed copy.
    Validation PASS: focused Dashboard Home presenter tests (`16/16`),
    focused runtime open-position derivation tests (`4/4`), Web typecheck, Web
    lint, repository guardrails, `git diff --check`, full workspace build, and
    authenticated rendered `/dashboard` smoke with reload and CTA interaction
    with no visible framework overlay, console errors, page errors, or 5xx
    responses. Browser plugin validation was attempted first but local
    `node_repl` resolved Node `v22.13.0` while requiring `>=22.22.0`, so
    rendered validation used bundled Codex Node plus Playwright. Evidence:
    `docs/planning/v1ui-33-shared-mark-price-source-suffix-task-2026-05-07.md`.
- [x] `V1UI-32 fix(web-dashboard): close route-owned copy leaks`
  - 2026-05-07: Closed a BUILDER-mode Dashboard Home copy-ownership slice.
    Remaining `/dashboard` runtime presentation labels no longer depend on
    `dashboard.bots.*`: placeholder badge/hint, strategy labels, and
    mark-price source labels now resolve through `dashboard.home.runtime.*`
    across all supported locales. Shared Bots mark-price semantics remain
    unchanged for Bots surfaces. Validation PASS: focused Dashboard Home
    presenter/sidebar tests (`25/25`), route-reachable i18n audit
    (`findings=0`), Web typecheck, Web lint, repository guardrails,
    `git diff --check`, full workspace build, and authenticated rendered
    `/dashboard` smoke with no console errors or page errors. Evidence:
    `docs/planning/v1ui-32-dashboard-home-route-owned-copy-closure-task-2026-05-07.md`.
- [x] `V1UI-31 fix(web-dashboard): keep runtime labels route-owned`
  - 2026-05-07: Closed a BUILDER-mode route ownership cleanup slice.
    Dashboard Home runtime/history presentation no longer borrows
    `dashboard.bots.monitoring.*` labels for closed-position entry/exit
    columns or the advanced-options control. The route now owns those labels
    through `dashboard.home.runtime.*` across all supported locales while
    backend runtime data mapping remains unchanged. Validation PASS: focused
    runtime table presenter tests (`15/15`), route-reachable i18n audit
    (`findings=0`), Web typecheck, Web lint, repository guardrails,
    `git diff --check`, full workspace build, and authenticated rendered
    `/dashboard` smoke with no console errors or page errors. Evidence:
    `docs/planning/v1ui-31-dashboard-home-route-owned-runtime-labels-task-2026-05-07.md`.
- [x] `V1UI-30 fix(web-auth): fail closed pre-hydration auth submit`
  - 2026-05-07: Closed a TESTER-mode auth entrypoint safety slice. Rendered
    smoke found that a very early Login/Register submit could fall through to
    native browser behavior before hydration and place credentials in the URL
    query string. Auth forms now render as native `POST` forms with disabled
    fieldsets before hydration, enable controls only after the client is
    ready, and use document navigation after successful session confirmation
    so `/dashboard` starts from a stable authenticated document boundary.
    Success auth toasts were removed from the redirect path while error toasts
    and inline errors remain intact. Validation PASS: focused Web
    auth/navigation tests (`19/19`), Web typecheck, Web lint,
    route-reachable i18n audit (`findings=0`), repository guardrails,
    `git diff --check`, full workspace build, and rendered auth smoke covering
    SSR `/auth/register` and `/auth/login` plus desktop register and mobile
    login flows to `/dashboard` with no credential URL leak and no relevant
    console/page/5xx errors. Evidence:
    `docs/planning/v1ui-30-auth-form-prehydration-fail-closed-task-2026-05-07.md`.
- [x] `V1UI-29 fix(runtime-orders): fail closed exchange-backed local cancel`
  - 2026-05-07: Closed a BUILDER-mode API/Web order-action
    parity slice. The exchange execution boundary keeps `LIVE_ORDER_CANCEL`
    unsupported, so exchange-backed open orders carrying `exchangeOrderId`
    must not be locally canceled or locally marked filled from dashboard
    actions. API cancel now fails closed with an explicit unsupported cancel
    error, API close refuses exchange-backed local fill closure, and Dashboard
    Home renders an unsupported-cancel action state instead of a cancel button.
    Validation PASS: focused API orders tests (`38/38`), focused Web runtime
    table presenter tests (`15/15`), API typecheck, Web typecheck, Web lint,
    route-reachable i18n audit (`findings=0`), repository guardrails, full
    workspace build, and authenticated rendered `/dashboard` smoke on desktop
    and mobile with no console errors, page errors, or 5xx responses. Evidence:
    `docs/planning/v1ui-29-exchange-backed-order-cancel-fail-closed-task-2026-05-07.md`.
- [x] `V1UI-28 fix(web-runtime): show manual-order blocked reason`
  - 2026-05-07: Closed a BUILDER-mode manual-order diagnostics parity slice.
    `UOLF` requires manual-order lifecycle states to include a blocked reason,
    but failed `POST /dashboard/orders/open` submissions were only visible in
    a transient toast. Dashboard Home now persists the resolved backend/API
    submit error, renders it in the manual-order action-state panel with
    blocked/error semantics, and clears stale blocked truth when the operator
    edits the next draft. Validation PASS: focused manual-order/sidebar tests
    (`25/25`), Web typecheck, Web lint, route-reachable i18n audit
    (`findings=0`), repository guardrails, full workspace build, and
    authenticated rendered `/dashboard` smoke on desktop and mobile with no
    console warnings, console errors, or page errors. Evidence:
    `docs/planning/v1ui-28-manual-order-blocked-reason-state-task-2026-05-07.md`.
- [x] `V1UI-27 fix(web-runtime): show manual-order exchange id`
  - 2026-05-07: Closed an ARCHITECT-mode manual-order response parity slice.
    `POST /dashboard/orders/open` already returns `exchangeOrderId` for LIVE
    exchange-backed orders, but the Web manual-order response type and
    lifecycle panel hid it. Dashboard Home now types the field, shows Exchange
    ID in the action-state block when present, and maps `OPEN + exchange id`
    to the existing imported-open-order lifecycle copy. Validation PASS:
    focused manual-order/sidebar tests (`20/20`), Web typecheck, Web lint,
    route-reachable i18n audit (`findings=0`), repository guardrails, full
    workspace build, and authenticated rendered `/dashboard` smoke on desktop
    and mobile with no console warnings, console errors, or page errors.
    Evidence:
    `docs/planning/v1ui-27-manual-order-exchange-id-state-task-2026-05-07.md`.
- [x] `V1UI-26 fix(web-runtime): show open-order exchange id`
  - 2026-05-07: Closed a BUILDER-mode backend-to-Web parity slice. Runtime
    open-order reads already carry backend `exchangeOrderId` for LIVE and
    exchange-synced rows, but Dashboard Home and Bot Monitoring did not type
    or render it. Web now adds an Exchange ID column to both Open Orders
    surfaces and renders `-` when the backend value is absent. Validation
    PASS: focused Web regressions (`28/28`), Web typecheck, Web lint,
    route-reachable i18n audit (`findings=0`), repository guardrails, full
    workspace build, and authenticated rendered `/dashboard` smoke on desktop
    and mobile with no console warnings, console errors, or page errors.
    Evidence:
    `docs/planning/v1ui-26-open-order-exchange-id-parity-task-2026-05-07.md`.
- [x] `V1UI-25 fix(web-runtime): show submitted manual-order state`
  - 2026-05-07: Closed a TESTER-mode UOLF lifecycle visibility slice.
    Dashboard Home now renders the localized `order submitted` action state in
    the manual-order panel while `POST /dashboard/orders/open` is in flight,
    without showing a synthetic order id before backend persistence. The
    response-derived waiting/fill/position state still takes over after the
    API resolves. Validation PASS: focused manual-order/sidebar tests
    (`19/19`), Web typecheck, Web lint, route-reachable i18n audit
    (`findings=0`), repository guardrails, full workspace build, and
    authenticated rendered `/dashboard` smoke on desktop and mobile with no
    console warnings, console errors, or page errors. Evidence:
    `docs/planning/v1ui-25-dashboard-manual-order-submitted-state-task-2026-05-07.md`.
- [x] `V1UI-24 fix(web-runtime): show dashboard open-position fees`
  - 2026-05-07: Closed an ARCHITECT-mode Dashboard Home open-position parity
    slice. Open Positions now renders backend `feesPaid` with the existing
    dashboard runtime fee label and amount formatter, matching bot monitoring
    so open-position fee truth is visible on the primary runtime surface
    before closure. Validation PASS: focused runtime table presenter test
    (`14/14`), Web typecheck, Web lint, route-reachable i18n audit
    (`findings=0`), repository guardrails, full workspace build, and
    authenticated rendered `/dashboard` smoke on desktop and mobile with no
    console warnings, console errors, or page errors. Evidence:
    `docs/planning/v1ui-24-dashboard-open-position-fee-parity-task-2026-05-07.md`.
- [x] `V1UI-23 fix(web-runtime): show dashboard manual-order lifecycle state`
  - 2026-05-07: Closed a BUILDER-mode UOLF backend-to-Web parity slice.
    Dashboard Home now types and retains the `POST /dashboard/orders/open`
    response in the manual-order controller, maps returned `status` plus
    optional `positionId` into existing localized lifecycle labels, and
    renders an `aria-live` action-state block in the manual-order sidebar.
    Stale response truth clears when the operator edits the next manual-order
    inputs. Validation PASS: focused manual-order, hook, and sidebar tests
    (`22/22`), Web typecheck, Web lint, route-reachable i18n audit
    (`findings=0`), repository guardrails, full workspace build, and
    authenticated rendered `/dashboard` smoke on desktop and mobile with no
    console warnings, console errors, or page errors. Evidence:
    `docs/planning/v1ui-23-dashboard-manual-order-lifecycle-state-task-2026-05-07.md`.
- [x] `V1UI-22 fix(web-runtime): show dashboard signal context source`
  - 2026-05-07: Closed a BUILDER-mode Dashboard Home signal-source parity
    slice. Dashboard signal cards now render localized context-source badges
    for latest signal, legacy latest decision, configured fallback, and
    unresolved contexts. The shared Web runtime market-state helper also
    treats current `latest_signal` source as evaluated runtime context instead
    of unresolved when no explicit `runtimeMarketState` is present. Validation
    PASS: focused helper and signal-card tests (`8/8`), broader Dashboard
    Home and preview parity tests (`22/22`), Web typecheck, Web lint,
    route-reachable i18n audit (`findings=0`), repository guardrails, full
    workspace build, and authenticated rendered `/dashboard` smoke on desktop
    and mobile with no console warnings, console errors, or page errors.
    Evidence:
    `docs/planning/v1ui-22-dashboard-signal-source-parity-task-2026-05-07.md`.
- [x] `V1UI-21 fix(web-runtime): keep aggregate wallet capital strict`
  - 2026-05-07: Closed an ARCHITECT-mode aggregate wallet source-of-truth
    slice. Dashboard Home now uses strict aggregate capital helpers for
    selected `AGGREGATE` snapshots, so missing aggregate
    `referenceBalance/freeCash` remains visible as unresolved instead of being
    masked by compatibility fields such as `accountBalance` or
    `availableBalance`. Non-aggregate fallback reads still support
    compatibility capital fields. Validation PASS: focused runtime helper,
    aggregate wallet, and sidebar tests (`13/13`), broader Dashboard Home
    regression (`20/20`), Web typecheck, Web lint, route-reachable i18n audit
    (`findings=0`), repository guardrails, full workspace build, and
    authenticated rendered `/dashboard` smoke on desktop and mobile with no
    console warnings, console errors, or page errors. Evidence:
    `docs/planning/v1ui-21-dashboard-aggregate-wallet-strict-capital-task-2026-05-07.md`.
- [x] `V1UI-20 fix(web-runtime): show dashboard closed-position history`
  - 2026-05-07: Closed a TESTER-mode architecture-to-Web runtime history
    parity slice. Dashboard Home now renders aggregate `positions.historyItems`
    as a dedicated closed-position table above trade history, preserving
    selected-bot scope and exposing backend duration, DCA, fees paid, close
    reason, close initiator, and realized PnL. Validation PASS: focused
    presenter plus aggregate-history tests (`16/16`), broader Dashboard Home
    plus sidebar regressions (`28/28`), Web typecheck, Web lint,
    route-reachable i18n audit (`findings=0`), repository guardrails, full
    workspace build, and authenticated rendered `/dashboard` smoke with no
    console warnings, console errors, or page errors. Evidence:
    `docs/planning/v1ui-20-dashboard-closed-history-table-task-2026-05-07.md`.
- [x] `V1UI-19 fix(web-runtime): show dashboard history close reason`
  - 2026-05-07: Closed a BUILDER-mode backend-to-Web runtime history parity
    slice. Dashboard home Closed Positions history now renders backend
    `closeReason` with shared close-reason suffix and pill semantics also used
    by bot monitoring. Missing values render `-`. Validation PASS: focused
    shared formatter plus dashboard presenter tests (`22/22`), dashboard
    widget plus bot monitoring regressions (`33/33`), Web typecheck, Web
    lint, route-reachable i18n audit (`findings=0`), repository guardrails,
    full workspace build, and authenticated rendered `/dashboard` smoke with
    no console warnings, console errors, or page errors. Evidence:
    `docs/planning/v1ui-19-dashboard-history-close-reason-task-2026-05-07.md`.
- [x] `V1UI-18 fix(web-runtime): show dashboard trade fee finality`
  - 2026-05-07: Closed an ARCHITECT-mode backend-to-Web runtime trade parity
    slice. Dashboard home Trade History now renders backend `fee` amount plus
    `feeSource`, `feePending`, and `feeCurrency` metadata through a shared Web
    runtime formatter also used by bot monitoring, keeping estimated,
    exchange-final, and pending fee truth visible on the primary runtime
    surface. Validation PASS: focused shared formatter plus dashboard
    presenter tests (`20/20`), dashboard widget regression pack (`20/20`),
    Web typecheck, Web lint, route-reachable i18n audit (`findings=0`),
    repository guardrails, full workspace build, and authenticated rendered
    `/dashboard` smoke with no console or page errors. Evidence:
    `docs/planning/v1ui-18-dashboard-trade-fee-parity-task-2026-05-07.md`.
- [x] `V1UI-17 fix(web-runtime): show dashboard open-position entry and quantity`
  - 2026-05-07: Closed a BUILDER-mode backend-to-Web runtime position parity
    slice. Dashboard home Open Positions now renders backend `quantity` and
    `entryPrice` beside existing margin/PnL/mark/DCA/protection fields,
    matching the detailed bot monitoring table so position size and entry
    truth stay visible on the primary runtime surface. Validation PASS:
    focused Web presenter test (`11/11`), dashboard widget regression pack
    (`20/20`), Web typecheck, Web lint, route-reachable i18n audit
    (`findings=0`), repository guardrails, full workspace build, and
    authenticated rendered `/dashboard` smoke with no post-auth console
    errors. Evidence:
    `docs/planning/v1ui-17-dashboard-open-position-entry-quantity-task-2026-05-07.md`.
- [x] `V1UI-16 fix(web-runtime): show dashboard open-order execution terms`
  - 2026-05-07: Closed a BUILDER-mode backend-to-Web runtime order parity
    slice. Dashboard home Open Orders now renders backend `type` and
    `stopPrice` beside existing price/fill fields, matching the detailed bot
    monitoring table so conditional execution terms stay visible on the
    primary runtime surface. Validation PASS: focused Web presenter test
    (`10/10`), dashboard open-order regression tests (`3/3`), Web typecheck,
    Web lint, route-reachable i18n audit (`findings=0`), repository
    guardrails, full workspace build, and authenticated rendered `/dashboard`
    smoke with no post-auth console errors. Evidence:
    `docs/planning/v1ui-16-dashboard-open-order-execution-terms-task-2026-05-07.md`.
- [x] `V1UI-15 fix(web-runtime): show dashboard open-order filled quantity`
  - 2026-05-07: Closed a TESTER-mode backend-to-Web runtime order parity
    slice. Dashboard home Open Orders now renders backend `filledQuantity`
    beside total `quantity`, matching the detailed bot monitoring table so
    partial fill progress stays visible on the primary runtime surface.
    Validation PASS: focused Web presenter test (`10/10`), dashboard
    open-order regression tests (`3/3`), Web typecheck, Web lint,
    route-reachable i18n audit (`findings=0`), repository guardrails, full
    workspace build, and authenticated rendered `/dashboard` smoke with no
    post-auth console errors. Evidence:
    `docs/planning/v1ui-15-dashboard-open-order-fill-quantity-task-2026-05-07.md`.
- [x] `V1UI-14 fix(web-runtime): align open-order status labels`
  - 2026-05-07: Closed a BUILDER-mode runtime order lifecycle label parity
    slice. Dashboard home and bot monitoring now share open-order status suffix
    semantics, and bot monitoring renders backend `OPEN`/`PENDING` status as
    route-owned waiting-for-fill lifecycle text instead of a raw status code.
    Unknown statuses remain raw and visible. Validation PASS: focused Web
    runtime formatter/dashboard/bot monitoring tests (`29/29`), Web typecheck,
    Web lint, route-reachable i18n audit (`findings=0`), repository guardrails,
    Web build, and authenticated rendered `/dashboard/bots` route smoke with
    no console errors. Evidence:
    `docs/planning/v1ui-14-runtime-open-order-status-label-task-2026-05-07.md`.
- [x] `V1UI-13 fix(web-runtime): show bot monitoring open-order source labels`
  - 2026-05-07: Closed a BUILDER-mode backend-to-Web runtime order parity
    slice. Bot monitoring open-order rows now render backend `origin` truth as
    route-owned `Origin` labels, while dashboard home and bot monitoring share
    one runtime order-source suffix helper for manual, bot, and imported
    sources. Validation PASS: focused Web runtime formatter/dashboard/bot
    monitoring tests (`28/28`), Web typecheck, Web lint, route-reachable i18n
    audit (`findings=0`), repository guardrails, Web build, and authenticated
    rendered `/dashboard/bots` route smoke with no console errors. Evidence:
    `docs/planning/v1ui-13-bot-open-orders-source-label-task-2026-05-07.md`.
- [x] `V1UI-03 fix(web-public): hide auth CTAs while session state is loading`
  - 2026-05-07: Closed an ARCHITECT-mode public access shell/i18n route slice.
    Public header auth CTAs now render only after auth loading resolves with no
    user, preventing logged-out login/register CTAs from flashing while session
    truth is unknown. Route translations now use the current Next pathname
    during render, eliminating public-to-auth client navigation i18n
    missing-key warnings seen when clicking Login from `/`. Validation PASS:
    focused header/i18n tests (`7/7`), Web typecheck, lint, production build,
    local desktop/mobile rendered smoke, route-reachable i18n audit
    (`findings=0`), guardrails, and diff check. Evidence:
    `docs/planning/v1ui-03-public-access-header-route-contract-task-2026-05-07.md`.
- [x] `V1UI-02 fix(web-auth): persist register errors and seed auth i18n route`
  - 2026-05-07: Closed a BUILDER-mode auth register UI/i18n slice.
    Registration failures now persist inline in the form with `role="alert"`
    while preserving existing toast feedback and auth behavior. `I18nProvider`
    now seeds route-scoped dictionaries from Next's `usePathname`, removing
    first-render auth namespace warning noise seen in rendered `/auth/register`
    smoke. Validation PASS: focused i18n/register tests (`13/13`), Web
    typecheck, local desktop/mobile rendered smoke, route-reachable i18n audit
    (`findings=0`), guardrails, and diff check. Evidence:
    `docs/planning/v1ui-02-auth-register-error-i18n-task-2026-05-07.md`.
- [x] `V1UI-01 fix(web-auth): announce login server errors`
  - 2026-05-07: Closed a BUILDER-mode auth UI accessibility slice. Rendered
    public/protected route smoke confirmed unauthenticated `/dashboard`
    redirects to `/auth/login`, and the login fail state now announces the
    inline server error with `role="alert"` while preserving the existing
    visual alert styling and auth behavior. Browser plugin validation was
    blocked by an old Node REPL runtime, so the rendered smoke used bundled
    Codex Node `v24.14.0` plus bundled Playwright without changing project
    dependencies. Validation PASS: focused LoginForm tests (`4/4`), Web
    typecheck, local desktop/mobile rendered smoke, guardrails, and diff check.
    Evidence: `docs/planning/v1ui-01-auth-login-error-alert-task-2026-05-07.md`.
- [x] `V1GATE-04 fix(ops): report skipped go-live smoke when local quality is skipped`
  - 2026-05-07: Closed a BUILDER-mode release-gate tooling fix. The V1 release
    gate now reports `goLiveSmoke: skipped` whenever `--skip-local-quality` is
    used, matching the actual step plan because go-live smoke is nested under
    local quality execution. Added focused regression coverage. Production
    dry-run artifacts were regenerated with readiness `not_ready`; current
    blockers remain stale activation, RC, restore, and rollback evidence plus
    the broader stage/protected/manual/live-money gates. Validation PASS:
    release-gate tests (`8/8`). Evidence:
    `docs/planning/v1gate-04-release-gate-plan-summary-task-2026-05-07.md`.
- [x] `V1GATE-03 release(ops): refresh OPS deploy freshness ledger row`
  - 2026-05-07: Closed a BUILDER-mode deploy freshness ledger sync. Re-read
    production public `/api/build-info` and confirmed
    `gitSha=6a7c9889d24a55c870b32aa10cb284ede6db1c59`, `gitRef=main`, matching
    `origin/main`. `OPS-DEPLOY-001` in the V1 function coverage matrix now
    references the current `V1GATE-02` public target refresh instead of the
    older 2026-05-01 SHA. This does not close restore, stage, GO/NO-GO,
    protected/manual, or live-money evidence blockers. Evidence:
    `docs/planning/v1gate-03-deploy-ledger-refresh-task-2026-05-07.md`.
- [x] `V1MANUAL-01 qa(web): align V1 manual route evidence with runtime IA`
  - 2026-05-07: Closed an ARCHITECT-mode V1 manual evidence sync. The V1
    orders/positions rows now distinguish authenticated API
    `/dashboard/orders*` and `/dashboard/positions*` read-only proof from web
    legacy redirect proof, matching the canonical dashboard route map. Added a
    focused web middleware regression for legacy orders/positions redirects and
    unauthenticated fail-closed login behavior. Validation PASS: focused
    middleware test (`3/3`). Evidence:
    `docs/planning/v1manual-web-legacy-route-evidence-sync-task-2026-05-07.md`.
- [x] `V1MONEY-02 qa(money): capture paper-safe close evidence for TP SL TTP TSL and DCA guards`
  - 2026-05-07: Closed a BUILDER-mode paper-safe close evidence slice. Focused
    API close validation passed (`45/45`) across runtime position automation,
    lifecycle close parity, paper lifecycle, and dynamic stop operator truth.
    Evidence now maps TP, SL, TTP, TSL, DCA-first, and DCA-exhausted rows to
    covered local behavior and remaining production/paper-sample proof. No
    live-money mutations were run. Evidence:
    `docs/planning/v1money-paper-safe-close-evidence-task-2026-05-07.md`.
- [x] `MARKETDATA-FUT-01 feat(api-runtime): expose runtime mark-price source for futures evidence`
  - 2026-05-07: Closed a BUILDER-mode futures market-data evidence slice.
    Runtime position rows now include additive `markPriceSource` metadata beside
    `markPrice`, with source labels for runtime symbol stats, runtime ticker,
    fallback ticker, exchange-unrealized-PnL derived price, runtime candidate,
    and unavailable states. Existing numeric price helper remains compatible.
    Validation PASS: focused runtime lifecycle/position PnL tests (`8/8`), API
    typecheck, Web typecheck, guardrails, and diff check. Evidence:
    `docs/planning/marketdata-fut-runtime-mark-price-source-task-2026-05-07.md`.
- [x] `V1MONEY-01 qa(money): build local and paper-safe V1 money scenario matrix`
  - 2026-05-07: Closed a TESTER-mode local/paper-safe V1 money matrix. The
    matrix routes `V1MONEY-A` rows through local, paper-safe, read-only
    production, or explicit operator/live-money evidence paths. Focused API
    money-engine validation passed (`49/49`) across order types, pre-trade
    allow/block/audit, position/order lifetime, strategy lifetime policy,
    lifecycle mark-price, and close parity. This does not close production-only
    TP/SL/TSL/live-close rows; it defines the next safe evidence path. Evidence:
    `docs/planning/v1money-local-paper-safe-matrix-task-2026-05-07.md`.
- [x] `LIVEIMPORT-03A qa(planning): triage stale imported-position release candidate against current main`
  - 2026-05-07: Closed a BUILDER-mode release-candidate triage. The old
    `LIVEIMPORT-03` promotion candidate `39146d2e` is not an ancestor of
    deployed production `6a7c9889` and is not patch-equivalent to deployed
    `main`, while a focused current-main imported-position/runtime strategy
    regression pack passed (`51/51`). `LIVEIMPORT-03` remains open only for
    authenticated ETH/DOGE production readback on current `main`; do not
    promote stale `39146d2e`. BOTMULTI stale build-info blocker text was also
    refreshed because production now contains `f3aaa3d`. Evidence:
    `docs/planning/liveimport-03-current-main-candidate-triage-task-2026-05-07.md`.
- [x] `V1GATE-02 release(ops): refresh public production and stage target truth after PMPLC merge`
  - 2026-05-07: Closed an ARCHITECT-mode public target refresh after the PMPLC
    hardening merge reached `main`. Production public API/Web smoke is healthy
    and build-info reports `gitSha=6a7c9889d24a55c870b32aa10cb284ede6db1c59`,
    matching `origin/main`. Unauthenticated `/dashboard` redirects fail-closed
    to `/auth/login`, and the post-deploy smoke checklist now names
    `/auth/login` as the canonical login page. Stage remains blocked (`503` on
    `stage-api.soar.luckysparrow.ch` and `stage.soar.luckysparrow.ch`; DNS miss
    on `stage-soar.luckysparrow.ch`). Evidence:
    `docs/planning/v1gate-02-public-target-refresh-task-2026-05-07.md`.
- [x] `APPCHECK-01 qa(app): verify main after PMPLC merge with local function sweep`
  - 2026-05-06: Closed a BUILDER-mode local post-merge app-function sweep on
    branch `codex/v1-app-function-check` after `codex/v1-pmplc-hardening` was
    fast-forward merged into `main` and pushed at `6a7c9889`. Validation PASS:
    repository guardrails, API typecheck, Web typecheck, lint, focused
    runtime/order API pack (`90/90`), focused dashboard/strategy Web pack
    (`32/32`), and full workspace build. No executable local regression was
    isolated in this sweep. Evidence:
    `docs/planning/app-function-check-main-sweep-task-2026-05-06.md`.
- [x] `PMPLC-46 docs(planning): clear stale PMPLC-45 follow-up after closure`
  - 2026-05-06: Closed a BUILDER-mode planning truth sync slice after
    PMPLC-45. Canonical PMPLC planning truth no longer lists `PMPLC-45` as a
    queued follow-up after it was implemented and pushed. Runtime/order
    discovery pack remained green (`64/64` plus exchange-event pack `46/46`)
    before the docs-only sync, so no new executable money-runtime regression
    was isolated in this iteration.
    Evidence: `docs/planning/pmplc-queue-sync-task-2026-05-06.md`.
- [x] `PMPLC-45 fix(api-bots): include imported externally closed positions in aggregate PnL`
  - 2026-05-06: Closed a TESTER-mode runtime read-model money-truth slice.
    Runtime aggregate positions now include imported `ORPHAN_LOCAL` /
    `EXTERNAL_CLOSE_CONFIRMED` closed positions in closed-position realized
    PnL, while stale open orphans remain excluded. Runtime history also keeps
    carry-over bot-managed `OPEN` trades and legacy wallet-scoped imported DCA
    continuity visible without broadening the primary aggregate ownership
    filter. Validation PASS: pre-fix aggregate regression failed as expected
    (`realizedPnl=0` received vs `37.5` expected), focused aggregate
    regression, focused external-close history regression, runtime/portfolio
    pack (`51/51`), helper unit suite (`16/16`), API typecheck, repository
    guardrails, and lint. Evidence:
    `docs/planning/runtime-aggregate-imported-closed-position-pnl-task-2026-05-06.md`.
- [x] `PMPLC-44 fix(api-bots): mark portfolio history partial for pending fees`
  - 2026-05-06: Closed a BUILDER-mode LIVE portfolio completeness slice.
    Portfolio history now marks LIVE history as `PARTIAL` with
    `FEE_RECONCILIATION_PENDING` when any scoped trade in the history window
    has `feePending=true`, so provisional fee-adjusted PnL is not presented as
    fully complete. Validation PASS: pre-fix e2e regression failed as expected
    (`completeness=COMPLETE` received vs `PARTIAL` expected), focused
    regression, portfolio-history e2e (`4/4`), API typecheck, repository
    guardrails, and lint. Evidence:
    `docs/planning/portfolio-history-pending-fee-completeness-task-2026-05-06.md`.
- [x] `PMPLC-43 fix(api-orders): keep pending after incomplete partial fee backfill`
  - 2026-05-06: Closed a BUILDER-mode LIVE fee reconciliation finality slice.
    Exchange-event fee finality now refuses to treat a filled order's existing
    exchange fee as settled while another known `OrderFill` still has missing
    fee truth, and lifecycle trade fee backfill now preserves the computed
    pending decision instead of unconditionally clearing pending. Validation
    PASS: pre-fix DB-backed regression failed as expected
    (`Order.feePending=false` received vs `true` expected), focused
    regression, helper suite (`24/24`), DB-backed exchange-event suite
    (`21/21`), dedicated fee-backfill suite (`1/1`), focused runtime/order
    suites (`105/105`), API typecheck, repository guardrails, lint, and diff
    check. Evidence:
    `docs/planning/position-management-exchange-partial-backfill-still-pending-task-2026-05-06.md`.
- [x] `PMPLC-42 fix(api-orders): refresh close PnL after missing partial close fee backfill`
  - 2026-05-06: Closed an ARCHITECT-mode LIVE fee/PnL reconciliation slice.
    Exchange-event fee backfill now refreshes close lifecycle
    `Trade.realizedPnl` and linked `Position.realizedPnl` after a delayed
    missing partial close fee settles aggregate exchange fee truth, preventing
    closed-position PnL from remaining overstated after fee reconciliation.
    Validation PASS: pre-fix DB-backed regression failed as expected (`8.8`
    close PnL received vs `8.7` expected), focused regression, helper suite
    (`24/24`), DB-backed exchange-event suite (`21/21`), focused runtime/order
    suites (`104/104`), API typecheck, repository guardrails, lint, and diff
    check. Evidence:
    `docs/planning/position-management-exchange-close-pnl-fee-backfill-task-2026-05-06.md`.
- [x] `PMPLC-41 fix(api-orders): settle lifecycle fee after missing partial fee backfill`
  - 2026-05-06: Closed a BUILDER-mode LIVE fee reconciliation backfill slice.
    Fee backfill propagation now updates unresolved lifecycle trades by
    `orderId` when the aggregate exchange fee becomes complete, so order,
    `OrderFill`, and lifecycle `Trade` fee truth settle together after a
    delayed partial-fill fee arrives. Validation PASS: pre-fix DB-backed
    regression failed as expected (`0.02` lifecycle fee received vs `0.03`
    expected), helper suite (`24/24`), DB-backed exchange-event suite
    (`20/20`), focused runtime/order suites (`103/103`), API typecheck,
    repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-missing-partial-fee-backfill-task-2026-05-06.md`.
- [x] `PMPLC-40 fix(api-orders): keep pending when earlier partial fill fee is missing`
  - 2026-05-06: Closed a TESTER-mode LIVE fee reconciliation finality slice.
    Exchange-event reconciliation now refuses to clear pending from a terminal
    current-fill exact fee while any earlier `OrderFill` for the order still
    has missing fee truth, preserving final fee-total visibility without
    downgrading the current exact fee. Validation PASS: pre-fix DB-backed
    regression failed as expected (`feePending=false` received vs `true`
    expected), helper suite (`24/24`), DB-backed exchange-event suite
    (`19/19`), focused runtime/order suites (`102/102`), API typecheck,
    repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-missing-partial-fee-pending-task-2026-05-06.md`.
- [x] `PMPLC-39 fix(api-orders): keep final fill pending after partial fee truth`
  - 2026-05-06: Closed an ARCHITECT-mode LIVE fee reconciliation finality
    slice. Exchange-event reconciliation now treats an existing exact exchange
    fee as final settled truth only when the order was already terminal
    `FILLED` before the incoming event, so a terminal fill without fee after a
    partial exact fee cannot falsely clear reconciliation pending. Validation
    PASS: pre-fix DB-backed regression failed as expected (`feePending=false`
    received vs `true` expected), helper suite (`24/24`), DB-backed
    exchange-event suite (`18/18`), focused runtime/order suites (`101/101`),
    API typecheck, repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-final-fee-pending-task-2026-05-06.md`.
- [x] `PMPLC-38 fix(api-orders): keep fee pending for partial exchange fills`
  - 2026-05-06: Closed a BUILDER-mode LIVE fee reconciliation finality slice.
    Exchange fee-pending decisions now require terminal `FILLED` status before
    accepted or settled exact exchange fee truth clears final reconciliation
    pending, so non-terminal partial fills can persist exact current-fill fee
    truth without falsely appearing final. Validation PASS: pre-fix helper and
    DB-backed regressions failed as expected (`feePending=false` received vs
    `true` expected), helper suite (`24/24`), DB-backed exchange-event suite
    (`17/17`), focused runtime/order suites (`100/100`), API typecheck,
    repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-partial-fee-pending-task-2026-05-06.md`.
- [x] `PMPLC-37 fix(api-orders): clear pending drift when exchange fee is settled`
  - 2026-05-06: Closed a BUILDER-mode LIVE fee reconciliation drift recovery
    slice. Exchange fee-pending decisions now give already-settled exact
    `EXCHANGE_FILL` fee truth precedence over local `feePending=true` drift, so
    exact fee availability reliably clears pending reconciliation state.
    Validation PASS: pre-fix helper regression failed as expected
    (`feePending=true` received vs `false` expected), DB-backed exchange-event
    suite (`16/16`), focused runtime/order suites (`98/98`), API typecheck,
    repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-settled-fee-pending-recovery-task-2026-05-06.md`.
- [x] `PMPLC-36 refactor(api-orders): centralize exchange fee pending decision`
  - 2026-05-06: Closed an ARCHITECT-mode exchange fee-pending decision
    boundary slice. Exchange fee-pending decisions now live in the pure
    `orders.exchangeEvents.helpers` boundary with no-DB coverage for accepted
    exact fee, rejected raw event fee, existing pending preservation, and
    already-settled exact fee cases, while DB-backed PMPLC-34/35 behavior
    remains unchanged. Validation PASS: helper suite (`22/22`), DB-backed
    exchange-event suite (`15/15`), focused runtime/order suites (`96/96`),
    API typecheck, repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-fee-pending-helper-task-2026-05-06.md`.
- [x] `PMPLC-35 fix(api-orders): recover pending truth when rejected fee leaves estimate unresolved`
  - 2026-05-06: Closed a TESTER-mode LIVE fee reconciliation recovery slice.
    Exchange order-trade event handling now bases pending recovery on accepted
    fee truth rather than raw event fee and restores `feePending=true` on
    unresolved estimated lifecycle trades for the order, so rejected stale
    unknown `exchangeTradeId` fees cannot hide reconciliation drift. Validation
    PASS: pre-fix DB-backed regression failed as expected (`feePending=false`
    received vs `true` expected), DB-backed exchange-event suite (`15/15`),
    focused runtime/order suites (`92/92`), API typecheck, repository
    guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-stale-fee-pending-recovery-task-2026-05-06.md`.
- [x] `PMPLC-34 fix(api-orders): keep fee pending when stale unknown fee is rejected`
  - 2026-05-06: Closed a BUILDER-mode LIVE fee reconciliation visibility
    guard. Exchange order-trade event handling now clears `feePending` from
    finite event fee only when that fee is actually accepted by the fee
    refresh/backfill decision, so a rejected stale unknown `exchangeTradeId`
    cannot hide unresolved LIVE fee reconciliation. Validation PASS: pre-fix
    DB-backed regression failed as expected (`feePending=false` received vs
    `true` expected), DB-backed exchange-event suite (`14/14`), focused
    runtime/order suites (`91/91`), API typecheck, repository guardrails, lint,
    and diff check. Evidence:
    `docs/planning/position-management-exchange-stale-fee-pending-guard-task-2026-05-06.md`.
- [x] `PMPLC-33 refactor(api-orders): centralize exchange fee refresh decision`
  - 2026-05-06: Closed an ARCHITECT-mode exchange fee decision boundary slice.
    Exchange fee refresh/backfill decisions now live in the pure
    `orders.exchangeEvents.helpers` boundary with no-DB coverage for normal
    refresh, known-fill missing-fee backfill, stale unknown-fill blocking, and
    already-settled fill fee cases, while DB-backed PMPLC-31/32 behavior
    remains unchanged. Validation PASS: helper suite (`18/18`), DB-backed
    exchange-event suite (`13/13`), focused runtime/order suites (`90/90`),
    API typecheck, repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-fee-refresh-helper-task-2026-05-06.md`.
- [x] `PMPLC-32 fix(api-orders): ignore stale terminal fee events for unknown fills`
  - 2026-05-06: Closed a BUILDER-mode LIVE fee idempotency guard. Exchange
    order-trade event handling now keeps fee-only refreshes limited to known
    `OrderFill` rows with missing fee truth, so a stale terminal event with an
    unknown `exchangeTradeId`, no local fill progress, and finite fee cannot
    inflate settled `Order.fee`. Validation PASS: pre-fix DB-backed regression
    failed as expected (`0.13` received vs `0.04` expected), DB-backed
    exchange-event suite (`13/13`), focused runtime/order suites (`86/86`),
    API typecheck, repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-stale-fee-event-guard-task-2026-05-06.md`.
- [x] `PMPLC-31 fix(api-orders): backfill missing exchange fill fee truth`
  - 2026-05-06: Closed a BUILDER-mode LIVE fee-truth backfill slice. Exchange
    order-trade event handling now treats a later finite exchange fee for an
    already recorded `exchangeTradeId` as a monotonic fee-truth upgrade,
    backfilling `Order.fee`, `OrderFill.feeCost`, and unresolved lifecycle
    `Trade.fee` without duplicating fill/trade rows or reapplying terminal
    lifecycle. Validation PASS: focused DB-backed regression, DB-backed
    exchange-event suite (`12/12`), focused runtime/order suites (`85/85`),
    API typecheck, repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-fill-fee-backfill-task-2026-05-06.md`.
- [x] `PMPLC-30 fix(api-orders): aggregate exchange fill fees across partial fills`
  - 2026-05-06: Closed a TESTER-mode LIVE fee aggregation slice. Exchange
    order-trade event handling now aggregates accepted per-fill
    `OrderFill.feeCost` values across partial and final fills, adding the
    current event fee only when its `exchangeTradeId` is not already recorded,
    so `Order.fee` and lifecycle `Trade.fee` represent total exchange fee
    truth instead of the latest fill fee. Validation PASS: pre-fix DB-backed
    regression failed as expected (`0.02` received vs `0.03` expected),
    DB-backed exchange-event suite (`11/11`), focused runtime/order suites
    (`84/84`), API typecheck, repository guardrails, lint, and diff check.
    Evidence:
    `docs/planning/position-management-exchange-fill-fee-aggregation-task-2026-05-06.md`.
- [x] `PMPLC-29 fix(api-orders): recover unresolved exchange fee pending truth`
  - 2026-05-06: Closed a BUILDER-mode LIVE fee-truth recovery slice. Exchange
    order-trade event handling now restores `feePending=true` for filled LIVE
    orders and generated lifecycle trades when fee truth remains unresolved
    (`feeSource=ESTIMATED`, no finite fee, and no finite event fee), even if
    the local row previously drifted to `feePending=false`. Validation PASS:
    pre-fix DB-backed regression failed as expected, DB-backed exchange-event
    suite (`10/10`), focused runtime/order suites (`83/83`), API typecheck,
    repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-fee-pending-recovery-task-2026-05-06.md`.
- [x] `PMPLC-28 fix(api-orders): preserve exchange fee pending truth without fee`
  - 2026-05-06: Closed a BUILDER-mode LIVE fee truth slice. Exchange
    order-trade event handling now keeps `feePending=true` on filled LIVE
    orders and generated lifecycle trades when the exchange event confirms fill
    quantity but provides no finite fee truth, preserving operator-visible
    reconciliation state instead of hiding missing fees as settled. Validation
    PASS: pre-fix DB-backed regression failed as expected, DB-backed
    exchange-event suite (`10/10`), focused runtime/order suites (`83/83`),
    API typecheck, repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-fee-pending-truth-task-2026-05-06.md`.
- [x] `PMPLC-27 refactor(api-orders): centralize exchange recordable fill details`
  - 2026-05-06: Closed an ARCHITECT-mode exchange event recordability slice.
    Exchange order-trade event handling now resolves recordable fill quantity
    and proportional fee through one private decision helper, keeping
    order-fill quantity and fee parity centralized without behavior changes.
    Validation PASS: local Postgres availability check, DB-backed
    exchange-event suite (`9/9`), focused runtime/order suites (`82/82`), API
    typecheck, repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-recordable-fill-details-task-2026-05-06.md`.
- [x] `PMPLC-26 fix(api-orders): scale exchange fill fee to accepted local quantity`
  - 2026-05-06: Closed a BUILDER-mode exchange event fee parity slice.
    Exchange order-trade event handling now scales finite event fee by accepted
    local last-fill quantity when exchange `lastFilledQuantity` is capped, so
    order, order-fill, and trade fee truth stays proportional to accepted local
    quantity under over-reported fills. Validation PASS: DB-backed
    exchange-event suite (`9/9`), focused runtime/order suites (`82/82`), API
    typecheck, repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-fill-fee-cap-task-2026-05-06.md`.
- [x] `PMPLC-25 fix(api-orders): cap exchange order-fill rows to local fill progress`
  - 2026-05-06: Closed a TESTER-mode exchange event child-fill quantity slice.
    Exchange order-trade event handling now records `OrderFill.quantity` from
    accepted local fill progress instead of raw exchange `lastFilledQuantity`,
    so over-reported last-fill events cannot inflate child fill rows above the
    locally capped order, trade, or position quantity. Validation PASS:
    DB-backed exchange-event suite (`9/9`), focused runtime/order suites
    (`82/82`), API typecheck, repository guardrails, lint, and diff check.
    Evidence:
    `docs/planning/position-management-exchange-orderfill-quantity-cap-task-2026-05-06.md`.
- [x] `PMPLC-24 refactor(api-orders): centralize exchange fill quantity normalization`
  - 2026-05-06: Closed an ARCHITECT-mode exchange fill quantity helper slice.
    Exchange fill progress now uses one private quantity normalizer for both
    existing local fill progress and incoming exchange cumulative fill
    quantity, keeping local order-quantity caps centralized without behavior
    changes. Validation PASS: helper plus DB-backed exchange-event suite
    (`22/22`), focused runtime/order suites (`81/81`), API typecheck,
    repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-fill-quantity-normalizer-task-2026-05-06.md`.
- [x] `PMPLC-23 fix(api-orders): cap existing exchange fill progress to order quantity`
  - 2026-05-06: Closed a BUILDER-mode exchange fill quantity cap slice.
    Exchange fill progress now caps both incoming cumulative fill quantity and
    previously persisted local filled quantity to the local order quantity when
    requested quantity truth is available, preventing inherited over-reported
    fill progress from inflating lifecycle truth. Validation PASS: no-DB helper
    regression (`14/14`), DB-backed exchange-event suite (`8/8`), focused
    runtime/order suites (`81/81`), API typecheck, repository guardrails, lint,
    and diff check. Evidence:
    `docs/planning/position-management-exchange-existing-fill-cap-task-2026-05-06.md`.
- [x] `PMPLC-22 fix(api-orders): keep known underfilled exchange events partial`
  - 2026-05-06: Closed a BUILDER-mode exchange event fail-closed slice.
    Exchange order-trade event reconciliation now passes local requested order
    quantity into the fill-progress helper, caps over-reported cumulative fill
    quantity to local order truth, and keeps known below-request `FILLED`
    events as `PARTIALLY_FILLED` without applying filled lifecycle. Validation
    PASS: no-DB helper regression (`13/13`), focused runtime/order suites
    (`72/72`), API typecheck, repository guardrails, lint, and diff check.
    Evidence:
    `docs/planning/position-management-exchange-event-underfilled-entry-task-2026-05-06.md`.
- [x] `PMPLC-21 refactor(api-orders): make exchange persisted status decision explicit`
  - 2026-05-06: Closed an ARCHITECT-mode exchange fill helper refactor slice.
    Exchange fill progress now resolves persisted order status through an
    explicit pure decision helper instead of nested inline branching, keeping
    terminal-filled, malformed-filled, stale-open, partial-progress, and
    terminal-cancel semantics visible and no-DB testable without behavior
    changes. Validation PASS: no-DB helper regression (`11/11`), focused
    runtime/order suites (`70/70`), API typecheck, repository guardrails, lint,
    and diff check. Evidence:
    `docs/planning/position-management-exchange-fill-status-helper-refactor-task-2026-05-06.md`.
- [x] `PMPLC-20 fix(api-orders): fail closed on exchange FILLED without quantity`
  - 2026-05-06: Closed a TESTER-mode exchange fill fail-closed slice. Exchange
    fill progress now refuses to terminalize non-terminal local orders when a
    `FILLED` event arrives without positive cumulative fill quantity,
    preserving `OPEN` or `PARTIALLY_FILLED` truth and skipping
    lifecycle/detail refresh until quantity truth is present. Validation PASS:
    no-DB helper regression (`10/10`), focused runtime/order suites (`69/69`),
    API typecheck, repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-filled-without-quantity-task-2026-05-06.md`.
- [x] `PMPLC-19 fix(api-orders): keep exchange partial fill status monotonic`
  - 2026-05-06: Closed a BUILDER-mode exchange fill status monotonicity slice.
    Exchange fill progress now preserves `PARTIALLY_FILLED` when stale `OPEN`
    events arrive after local partial progress, preventing known partial
    execution from being hidden as a plain open order. Validation PASS: no-DB
    helper regression (`8/8`), focused runtime/order suites (`67/67`), API
    typecheck, repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-partial-status-monotonicity-task-2026-05-06.md`.
- [x] `PMPLC-18 refactor(api-orders): extract pure exchange fill helper boundary`
  - 2026-05-06: Closed an ARCHITECT-mode exchange fill helper boundary slice.
    Pure exchange close-fill completeness and fill-progress/idempotency
    decisions now live in `orders.exchangeEvents.helpers.ts`, while the
    DB-backed exchange event service imports them. The no-DB helper regression
    now imports only the pure helper module, reducing coupling to
    Prisma/runtime orchestration without behavior changes. Validation PASS:
    no-DB helper regression (`6/6`), focused runtime/order suites (`65/65`),
    API typecheck, repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-fill-helper-boundary-task-2026-05-06.md`.
- [x] `PMPLC-17 fix(api-orders): keep stale exchange events from overwriting terminal fill details`
  - 2026-05-06: Closed a BUILDER-mode money-impacting exchange-event
    idempotency slice. Exchange order-trade updates now refresh terminal fill
    details only before completion or when cumulative fill progress advances,
    so stale or duplicate events for already-`FILLED` orders cannot rewrite
    average fill price, filled timestamp, fee, fee currency, or exchange trade
    id while still preserving monotonic fill quantity. Validation PASS: no-DB
    exchange fill-progress helper regression (`6/6`), focused runtime/order
    suites (`65/65`), API typecheck, repository guardrails, lint, and diff
    check. DB-backed exchange-event lifecycle suites remain pending because
    local Postgres at `localhost:5432` is unavailable. Evidence:
    `docs/planning/position-management-exchange-terminal-fill-details-idempotency-task-2026-05-06.md`.
- [x] `PMPLC-16 fix(api-orders): keep duplicate exchange FILLED events idempotent`
  - 2026-05-06: Closed a BUILDER-mode money-impacting exchange-event
    idempotency slice. Exchange order-trade fill progress now stays monotonic
    and already-`FILLED` local orders do not reapply position lifecycle when a
    duplicate or stale exchange `FILLED` event arrives, preventing double-add
    or double-close exposure drift. Validation PASS: no-DB exchange
    fill-progress helper regression (`5/5`), focused runtime/order suites
    (`64/64`), API typecheck, repository guardrails, lint, and diff check.
    DB-backed exchange-event lifecycle suites remain pending because local
    Postgres at `localhost:5432` is unavailable. Evidence:
    `docs/planning/position-management-exchange-filled-event-idempotency-task-2026-05-06.md`.
- [x] `PMPLC-15 test(api-orders): lock LIVE entry lifecycle gate for partial fills`
  - 2026-05-06: Closed a TESTER-mode money-impacting lifecycle gate
    regression slice. Open-order persistence and immediate lifecycle decisions
    now share a pure helper that keeps underfilled LIVE entry orders
    `PARTIALLY_FILLED`, persists the confirmed exchange fill quantity, and
    blocks immediate position lifecycle until a complete fill is resolved,
    while preserving PAPER and no-fill-row LIVE compatibility. Validation
    PASS: no-DB lifecycle gate regression (`5/5`), focused runtime/order suites
    (`61/61`), API typecheck, repository guardrails, lint, and diff check.
    DB-backed order lifecycle suites remain pending because local Postgres at
    `localhost:5432` is unavailable. Evidence:
    `docs/planning/position-management-live-entry-lifecycle-gate-task-2026-05-06.md`.
- [x] `PMPLC-14 fix(api-orders): keep underfilled LIVE entry from opening full position`
  - 2026-05-06: Closed a BUILDER-mode money-impacting LIVE order creation
    safety slice. LIVE order creation now derives persisted status and filled
    quantity from exchange fill rows when available, persists below-request
    `FILLED` responses as `PARTIALLY_FILLED`, and skips immediate position
    lifecycle until the fill is complete, preventing local position quantity
    inflation. Validation PASS: no-DB live fill resolver and focused
    runtime/order suites (`58/58`), API typecheck, repository guardrails, lint,
    and diff check. DB-backed order lifecycle suites remain pending because
    local Postgres at `localhost:5432` is unavailable. Evidence:
    `docs/planning/position-management-live-entry-underfill-task-2026-05-06.md`.
- [x] `PMPLC-13 fix(api-orders): keep exchange underfilled close from closing full position`
  - 2026-05-06: Closed a BUILDER-mode money-impacting exchange-event
    reconciliation safety slice. Exchange order-trade close reconciliation now
    returns before full local close settlement when cumulative close fill
    quantity is below the local open position quantity, preventing local
    `CLOSED` state and close trade creation while residual exposure may remain.
    Validation PASS: no-DB exchange helper and focused runtime suites
    (`56/56`), API typecheck, repository guardrails, lint, and diff check.
    Full DB-backed exchange-events suite remains pending because local Postgres
    at `localhost:5432` is unavailable. Evidence:
    `docs/planning/position-management-exchange-event-underfilled-close-task-2026-05-06.md`.
- [x] `PMPLC-12 fix(api-runtime): keep underfilled close from closing full position`
  - 2026-05-06: Closed an ARCHITECT-mode money-impacting runtime close safety
    slice. Runtime close orchestration now keeps an underfilled close
    confirmation in submitted/waiting state when the reported filled quantity
    is below local open position quantity, preventing local `CLOSED` state and
    close trade creation while residual exposure may remain. Validation PASS:
    focused runtime orchestrator suite (`18/18`), focused runtime
    orchestrator/automation suites (`54/54`), API typecheck, repository
    guardrails, lint, and diff check. DB-backed exchange-events suite was
    blocked by unavailable local Postgres at `localhost:5432`. Evidence:
    `docs/planning/position-management-underfilled-close-fail-closed-task-2026-05-06.md`.
- [x] `PMPLC-11 fix(api-runtime): cap LIVE free cash by exchange free balance`
  - 2026-05-06: Closed a BUILDER-mode money-impacting LIVE runtime capital
    slice. Runtime capital now preserves exchange account and free balances
    separately, keeps allocation/reference balance based on account total, caps
    LIVE free cash by exchange free balance when present, and records wallet
    snapshots with the actual free balance. Validation PASS: focused runtime
    capital suite (`18/18`), focused runtime DCA/position suites (`76/76`),
    API typecheck, repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-live-free-balance-cap-task-2026-05-06.md`.
- [x] `PMPLC-10 fix(api-backtests): reserve entry margin in tracked replay balance`
  - 2026-05-06: Closed a TESTER-mode money-impacting replay accounting slice.
    Single-symbol replay now reserves entry margin, accumulates DCA margin in
    open position state, returns reserved margin during close/final settlement,
    and checks DCA affordability against remaining free cash. Validation PASS:
    focused backtest replay suite (`29/29`), focused backtest/runtime DCA
    suites (`61/61`), API typecheck, repository guardrails, lint, and diff
    check. Evidence:
    `docs/planning/position-management-replay-tracked-balance-reserve-task-2026-05-06.md`.
- [x] `PMPLC-09 fix(api-backtests): use DCA fill price for replay reserve accounting`
  - 2026-05-06: Closed an ARCHITECT-mode money-impacting backtest accounting
    slice. Backtest replay now uses the selected DCA fill price for DCA event
    price, affordability checks, and interleaved portfolio reserved-margin
    accounting, preventing false cash exhaustion after wick-priced DCA fills.
    Validation PASS: focused contract remediation suite (`10/10`), focused
    backtest/runtime DCA suites (`60/60`), API typecheck, repository
    guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-portfolio-dca-fill-margin-task-2026-05-06.md`.
- [x] `PMPLC-08 fix(api-backtests): release final-candle reserved margin from portfolio state`
  - 2026-05-06: Closed a BUILDER-mode money-impacting portfolio accounting
    slice. Interleaved portfolio simulation now removes positions closed in
    the final-candle loop from `openPositions`, so returned margin is not
    counted again in `finalBalance`. Validation PASS: focused contract
    remediation suite (`9/9`), focused backtest/runtime DCA suites (`59/59`),
    API typecheck, repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-portfolio-final-margin-release-task-2026-05-06.md`.
- [x] `PMPLC-07 fix(api-backtests): estimate DCA funds from selected level size`
  - 2026-05-06: Closed a BUILDER-mode money-impacting backtest/runtime parity
    slice. Backtest replay and interleaved portfolio simulation now estimate
    DCA funds from the core-selected `dcaAddedQuantity` instead of guessing the
    multiplier from aggregate add count, preventing mixed-lane selected-level
    affordability drift. Validation PASS: focused backtest replay suite
    (`28/28`), focused backtest/runtime DCA suites (`50/50`), API typecheck,
    repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-backtest-selected-dca-funds-task-2026-05-06.md`.
- [x] `PMPLC-06 fix(api-backtests): respect tracked wallet funds before replay DCA adds`
  - 2026-05-06: Closed a BUILDER-mode money-impacting backtest/runtime parity
    slice. Single-symbol replay now estimates the next DCA add margin against
    tracked wallet balance before mutating position state, skips unaffordable
    DCA events, and still releases close protection when DCA is
    funds-exhausted. Validation PASS: focused backtest replay suite (`27/27`),
    focused backtest/runtime DCA suites (`49/49`), API typecheck, repository
    guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-backtest-dca-funds-parity-task-2026-05-06.md`.
- [x] `PMPLC-05 fix(api-backtests): preserve mixed DCA lane parity with runtime`
  - 2026-05-06: Closed a TESTER-mode money-impacting backtest/runtime parity
    slice. Backtest replay now chooses DCA probe prices from the candle
    extreme that matches the pending DCA lane direction, carries
    `executedDcaLevelIndices` across replay state, and interleaved portfolio
    simulation reuses the same resolver so adverse and favorable DCA lanes stay
    aligned with runtime. Validation PASS: focused backtest replay suite
    (`26/26`), focused backtest/runtime DCA suites (`48/48`), API typecheck,
    repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-backtest-mixed-dca-parity-task-2026-05-06.md`.
- [x] `PMPLC-04 test(api-runtime): lock LIVE close order contract before venue protection work`
  - 2026-05-06: Closed a BUILDER-mode money-impacting runtime contract slice.
    Runtime close coverage now explicitly locks the current LIVE close payload
    as a runtime-owned reduce-only `MARKET` order and asserts no hidden
    `stopPrice`, `stopLoss`, or `takeProfit` fields are sent before the future
    exchange-backed protection-order vertical slice exists. Validation PASS:
    focused runtime orchestrator suite (`17/17`), API typecheck, repository
    guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-live-close-order-contract-task-2026-05-06.md`.
- [x] `PMPLC-03 fix(strategy-config): block unreachable basic DCA levels`
  - 2026-05-06: Closed a BUILDER-mode money-impacting strategy validation
    slice. Strategy create/update/import validation now rejects basic-mode
    configs where positive DCA levels sit above hard `TP` or negative DCA
    levels sit below hard `SL`, and the strategy form blocks the same invalid
    payload with localized validation feedback. Validation PASS: focused API
    strategy config validation suite (`5/5`), focused web strategy
    validation/form suite (`12/12`), API/web typecheck, route-reachable i18n
    audit, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/position-management-basic-dca-reachability-task-2026-05-06.md`.
- [x] `PMPLC-02 fix(api-runtime): preserve mixed DCA lane progress`
  - 2026-05-06: Closed a BUILDER-mode money-impacting runtime lifecycle
    slice. Position-management state now records executed DCA level indices,
    letting positive and negative DCA lanes execute independently from the
    closest pending threshold while preserving `currentAdds` as the
    compatibility count. Validation PASS: focused position management suite
    (`22/22`), runtime automation suite (`36/36`), runtime serialization suite
    (`8/8`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/position-management-dca-lane-state-task-2026-05-06.md`.
- [x] `PMPLC-01 docs(architecture): freeze PnL position-management lifecycle contract`
  - 2026-05-06: Closed an ARCHITECT-mode source-of-truth update for
    operator-clarified DCA/TP/SL/TTP/TSL behavior. Added canonical positive
    and negative DCA lanes, DCA-first close gating, basic-mode unreachable DCA
    warnings, advanced TTP/TSL activation-versus-trail semantics,
    unaffordable-DCA policy, live order/position reconciliation,
    imported-position adoption-point rules, and backtest parity requirements.
    Validation PASS: repository guardrails and architecture diff review.
    Evidence:
    `docs/planning/position-management-pnl-lifecycle-contract-task-2026-05-06.md`.
- [x] `RUNTIME-AUDIT-143 test(web-dashboard): lock dynamic stop display precedence`
  - 2026-05-04: Closed a money-impacting dynamic stop display coverage gap.
    Resolver-level tests now lock TSL display only when TTP is inactive,
    backend TTP suppression of TSL, fallback TTP suppression of TSL, and
    backend TTP precedence over fallback TTP. Validation PASS: focused runtime
    derivations suite (`5/5`), web typecheck, repository guardrails, lint, and
    diff review. Evidence:
    `docs/planning/runtime-audit-143-dynamic-stop-display-contract-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-142 test(web-dashboard): lock backend TTP precedence`
  - 2026-05-04: Closed a money-impacting dashboard regression gap. Runtime
    view-model coverage now proves backend dynamic TTP protection wins over
    fallback TTP display when both values exist. Validation PASS: focused
    runtime selection view-model suite (`9/9`), web typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-142-backend-ttp-precedence-regression-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-141 fix(web-dashboard): scope fallback TTP sticky state`
  - 2026-05-04: Closed an ARCHITECT-mode money-impacting runtime display
    boundary fix. Fallback TTP sticky favorable-move state is now keyed by bot
    id, runtime session id, and position id, with regression coverage
    preventing cross-runtime leakage. Validation PASS: focused runtime
    selection view-model suite (`8/8`), web typecheck, repository guardrails,
    lint, and diff review. Evidence:
    `docs/planning/runtime-audit-141-scope-fallback-ttp-sticky-state-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-140 test(web-dashboard): lock fallback TTP disarm behavior`
  - 2026-05-04: Closed a TESTER-mode money-impacting dashboard regression gap.
    Selected runtime view-model coverage now proves fallback TTP protection
    clears when live PnL drops below the first trailing take-profit disarm
    floor, while planned TTP row truth can keep dynamic stop columns visible.
    Validation PASS: focused runtime selection view-model suite (`7/7`), web
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-140-fallback-ttp-disarm-regression-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-139 fix(web-dashboard): show fallback TTP protection`
  - 2026-05-04: Closed a BUILDER-mode dashboard TTP display drift. Selected
    runtime open-position rows now compute fallback TTP protected percent from
    existing trailing take-profit levels and live PnL, and the TTP display
    resolver uses that fallback before backend dynamic stop price arrives.
    Validation PASS: focused runtime selection view-model suite (`6/6`),
    runtime table presenter suite, web typecheck, repository guardrails, lint,
    and diff review. Evidence:
    `docs/planning/runtime-audit-139-dashboard-fallback-ttp-display-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-138 fix(web-ui): clamp manual total pages with visible rows`
  - 2026-05-04: Closed an ARCHITECT-mode shared table pagination contract
    drift. Manual pagination now preserves `totalPages=0` for empty tables
    only and reports at least one page when rows are visible, preventing
    `Page 1/0` summaries with rendered runtime rows. Validation PASS: focused
    `DataTable` suite (`9/9`), web typecheck, repository guardrails, lint, and
    diff review. Evidence:
    `docs/planning/runtime-audit-138-manual-total-pages-visible-rows-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-137 fix(web-ui): clamp manual table totals without reported totals`
  - 2026-05-04: Closed a BUILDER-mode shared table display invariant
    follow-up. Manual-pagination footer totals now clamp against visible rows
    even when callers provide only `totalRows` metadata and no
    `reportedTotalRows`. Validation PASS: focused `DataTable` suite (`8/8`),
    web typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-137-manual-total-display-clamp-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-136 fix(web-ui): clamp manual reported table totals`
  - 2026-05-04: Closed a BUILDER-mode follow-up to the shared table display
    invariant. Manual pagination reported totals now clamp against visible rows
    as well as external metadata, so stale zero metadata cannot contradict
    rendered rows. Validation PASS: focused `DataTable` suite (`7/7`), web
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-136-manual-reported-table-total-clamp-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-135 fix(web-ui): clamp reported table totals`
  - 2026-05-04: Closed a TESTER-mode shared table display invariant gap.
    Display-only reported totals now remain at least the effective table row
    count, so a stale or inconsistent runtime counter cannot show `Rows: 0`
    while rows are visible. Validation PASS: focused `DataTable` suite
    (`6/6`), web typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-135-clamp-reported-table-totals-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-134 fix(web-dashboard): include open-order icon symbols`
  - 2026-05-04: Closed a BUILDER-mode dashboard open-orders display drift.
    Runtime icon lookup now includes symbols that appear only in open orders,
    reusing the existing shared icon hook and resolver. Validation PASS:
    focused dashboard open-orders source suite (`1/1`), web typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-134-open-orders-icon-symbols-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-133 fix(web-dashboard): preserve position row totals`
  - 2026-05-04: Closed a BUILDER-mode dashboard position/open-order counter
    drift. `DataTable` now supports display-only reported totals, and the
    runtime open-position/open-order tables pass API `openCount` and
    `openOrdersCount` without creating fake client-side pages. Validation
    PASS: focused `DataTable` suite (`5/5`), focused dashboard open-orders
    source suite (`1/1`), web typecheck, repository guardrails, lint, and diff
    review. Evidence:
    `docs/planning/runtime-audit-133-dashboard-position-row-totals-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-132 refactor(web-dashboard): centralize runtime trade-row selector`
  - 2026-05-04: Closed an ARCHITECT-mode dashboard runtime truth cleanup.
    Selected runtime trade-row resolution now lives in one helper with branch
    coverage for selected query precedence, matching snapshot fallback, and
    mismatched session blocking. Validation PASS: focused runtime selection
    view-model suite (`5/5`), focused dashboard component suite (`20/20`), web
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-132-runtime-trade-row-selector-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-131 fix(web-dashboard): preserve snapshot trade rows`
  - 2026-05-04: Closed a BUILDER-mode dashboard trade-history visibility
    drift. Runtime selected-data projection now falls back to matching
    `selected.trades.items` until the derived `selectedTrades` query projection
    is ready, while keeping query projection precedence and session-id guards.
    Validation PASS: focused runtime selection view-model suite (`2/2`),
    focused dashboard component suite (`20/20`), web typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-131-snapshot-trade-rows-fallback-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-130 fix(web-ui): preserve empty manual pagination meta`
  - 2026-05-04: Closed a TESTER-mode shared dashboard pagination contract
    drift. `DataTable` manual pagination now preserves explicit external
    `totalPages=0` for empty runtime metadata while keeping page callbacks
    one-based, so empty dashboard trade history no longer gets normalized to a
    fake page count. Validation PASS: focused `DataTable` suite (`4/4`),
    focused dashboard component suite (`20/20`), web typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-130-manual-pagination-empty-meta-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-129 refactor(web-dashboard): share runtime trade meta builder`
  - 2026-05-04: Closed an ARCHITECT-mode dashboard runtime source-of-truth
    cleanup. Runtime trade metadata construction now lives in one shared
    `home-live-widgets` helper used by both component fallback and aggregate
    controller paths, preserving empty `totalPages=0` and page clamping
    without duplicated formulas. Validation PASS: focused dashboard component
    suite (`20/20`), focused dashboard controller suite (`2/2`), web
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-129-shared-trade-meta-builder-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-128 fix(web-dashboard): align fallback trade metadata`
  - 2026-05-04: Closed a BUILDER-mode dashboard runtime fallback metadata
    drift. The home runtime widget now builds fallback trade metadata with
    runtime API empty-state semantics, so empty local trade-history fallback
    reports `totalPages=0` and non-empty fallback pages are clamped to the
    local page range. Validation PASS: focused dashboard component suite
    (`20/20`), web typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-128-dashboard-trade-meta-fallback-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-127 fix(web-dashboard): preserve aggregate trade totals`
  - 2026-05-04: Closed a BUILDER-mode dashboard aggregate trade-history
    counter drift. The main dashboard now preserves API aggregate
    `trades.total` before local trade filters or sort are applied, so the
    unfiltered trade-history count no longer collapses to the returned
    item-window length. Validation PASS: focused dashboard controller suite
    (`2/2`), web typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-127-dashboard-aggregate-trade-total-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-126 fix(web-bots): align empty aggregate trade meta fallback`
  - 2026-05-04: Closed an ARCHITECT-mode dashboard aggregate fallback contract
    drift. The web no-session aggregate fallback now reports
    `trades.meta.pageSize` from the requested `perSessionLimit`, matching the
    API empty aggregate contract while preserving zero totals and
    `hasNext=false`. Validation PASS: focused web aggregate service suite
    (`3/3`), web typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-126-web-empty-aggregate-trade-meta-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-125 fix(api-bots): align empty aggregate trade meta`
  - 2026-05-04: Closed a TESTER-mode runtime aggregate empty-state metadata
    drift. Empty aggregate trades now reuse the aggregate trade meta helper
    with the caller's `perSessionLimit`, so `meta.pageSize` matches the same
    contract as non-empty aggregate reads while `total=0`, `totalPages=0`, and
    `hasNext=false` remain unchanged. Validation PASS: focused runtime session
    position unit suite (`16/16`), API typecheck, repository guardrails, lint,
    and diff review. Evidence:
    `docs/planning/runtime-audit-125-empty-aggregate-trade-meta-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-124 fix(api-bots): align aggregate trade meta page size`
  - 2026-05-04: Closed a BUILDER-mode runtime aggregate trade metadata drift.
    Aggregate trades `meta.pageSize` now reports the requested
    `perSessionLimit` instead of the deduped returned item count, while
    `hasNext` remains based on `totalTrades > returnedItems`. Validation PASS:
    focused runtime session position unit suite (`16/16`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-124-aggregate-trade-meta-page-size-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-123 refactor(api-bots): remove stale aggregate position source`
  - 2026-05-04: Closed an ARCHITECT-mode runtime aggregate source-clarity
    cleanup. Removed the unused all-session `positionResponses` collection
    after current open rows, open orders, history rows, and display flags moved
    to their canonical current/projection sources. Validation PASS: focused
    runtime session position unit suite (`15/15`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-123-remove-stale-position-response-aggregate-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-122 fix(api-bots): preserve aggregate account balance`
  - 2026-05-04: Closed a BUILDER-mode runtime aggregate wallet/capital
    visibility drift. Aggregate capital summary selection now treats finite
    `accountBalance` as usable evidence, so account-balance-only latest
    snapshots are preserved instead of falling back to older/null capital
    summaries. Validation PASS: focused runtime session position unit suite
    (`15/15`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-122-aggregate-account-balance-summary-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-121 fix(api-bots): align aggregate dynamic stop flag`
  - 2026-05-04: Closed a BUILDER-mode runtime aggregate dashboard display-flag
    drift. Aggregate `positions.showDynamicStopColumns` now comes from the
    freshest position response, matching current open position/open-order row
    projection and preventing stale older RUNNING snapshots from enabling
    unused dynamic-stop columns. Validation PASS: focused runtime session
    position unit suite (`14/14`), API typecheck, repository guardrails, lint,
    and diff review. Evidence:
    `docs/planning/runtime-audit-121-aggregate-dynamic-stop-flag-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-120 fix(api-bots): align aggregate position items`
  - 2026-05-04: Closed a TESTER-mode runtime aggregate dashboard table/counter
    drift. Aggregate current open position rows and open order rows now come
    from the freshest position response, while historical position rows use the
    latest-running projection rows, so stale older RUNNING snapshots no longer
    stay visible after counters move to the newer snapshot. Validation PASS:
    focused runtime session position unit suite (`13/13`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-120-aggregate-position-items-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-119 fix(api-bots): align aggregate running trade items`
  - 2026-05-04: Closed a BUILDER-mode runtime aggregate dashboard
    table/counter drift. Aggregate trade table items now use the same
    latest-running projection rows as trade totals and fees, so stale older
    RUNNING session trade rows no longer remain visible after counters project
    to the newer RUNNING session. Validation PASS: focused runtime session
    position unit suite (`12/12`), API typecheck, repository guardrails, lint,
    and diff review. Evidence:
    `docs/planning/runtime-audit-119-aggregate-running-trade-items-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-118 fix(api-bots): align aggregate running symbols`
  - 2026-05-04: Closed a BUILDER-mode runtime aggregate dashboard metadata
    drift. Aggregate `symbolsTracked` now uses the same latest-running
    projection rows as duration and event metadata, so overlapping RUNNING
    sessions no longer inflate the aggregate header while
    completed/non-running rows still contribute normally. Validation PASS:
    focused runtime session position unit suite (`11/11`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-118-aggregate-running-symbols-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-117 fix(api-bots): restrict carry-over session trades`
  - 2026-05-04: Closed an ARCHITECT-mode runtime trades dashboard window
    drift. Carry-over position trade reads now include normal in-window trades
    plus only persisted imported `OPEN` anchors outside the window, so
    pre-window DCA/CLOSE/fee rows no longer leak into current session trade
    history or fees. Validation PASS: focused runtime session position unit
    suite (`10/10`), API typecheck, repository guardrails, lint, and diff
    review. Evidence:
    `docs/planning/runtime-audit-117-trades-carryover-window-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-116 fix(api-bots): include live imported open positions in symbol stats`
  - 2026-05-04: Closed a BUILDER-mode LIVE dashboard parity drift. Runtime
    symbol-stats live open-position rows now include direct bot positions and
    owned LIVE imported positions via the existing external ownership index,
    including market-aware and legacy external IDs with wallet/null-wallet
    recovery scope. Validation PASS: focused runtime session position unit
    suite (`8/8`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-116-symbol-stats-live-imported-open-position-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-115 fix(api-bots): include carried open positions in symbol stats`
  - 2026-05-04: Closed a TESTER-mode runtime dashboard parity drift. Runtime
    symbol-stats live open-position reads now include positions opened before
    session start when they remain active by the session window end, matching
    the session positions endpoint's carried-position semantics. Validation
    PASS: focused runtime session position unit suite (`6/6`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-115-symbol-stats-carried-open-position-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-114 fix(api-bots): bound session closed positions by window`
  - 2026-05-04: Closed an ARCHITECT-mode runtime session dashboard window
    drift. Closed-position history and fee aggregation now bound `closedAt` by
    both session start and resolved window end, so completed sessions cannot
    include later closes or fees. The slice also extracted two small pure
    helpers out of the runtime session position read monolith to keep
    repository guardrails green. Validation PASS: focused runtime session
    position unit suite (`5/5`), API typecheck, repository guardrails, lint,
    and diff review. Evidence:
    `docs/planning/runtime-audit-114-session-closed-position-window-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-113 fix(api-wallets): include paper closed position realized PnL`
  - 2026-05-04: Closed a BUILDER-mode PAPER wallet analytics drift. Wallet
    performance summary and equity timeline now include realized PnL from
    closed `IN_SYNC` PAPER positions owned directly by the wallet or by bots
    using the wallet, while LIVE wallet realized PnL remains cashflow-based.
    Validation PASS: focused wallet service unit suite (`5/5`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-113-paper-wallet-realized-pnl-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-112 fix(api-bots): scope runtime trade wallet fallback to live`
  - 2026-05-04: Closed a BUILDER-mode runtime read-model drift. Runtime
    position trade reads now include botless wallet-scoped trade fallback only
    for LIVE recovery/import visibility, so PAPER bot dashboards no longer risk
    mixing unrelated botless wallet-scoped trades into bot-scoped position
    rows. Validation PASS: focused runtime positions read unit suite (`4/4`),
    API typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-112-paper-runtime-trade-wallet-fallback-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-111 test(api-orders): align paper position bot-scope expectations`
  - 2026-05-04: Closed a BUILDER-mode test-contract drift. DB-backed order
    tests now expect bot-created PAPER positions to persist with
    `Position.walletId=null`, while LIVE remains wallet-scoped, aligning the
    regression suite with the RUNTIME-AUDIT-108 bot-scoped persistence
    contract. Validation PASS: API typecheck, repository guardrails, lint, and
    diff review. Targeted DB-backed order tests were attempted but timed out
    locally after 120s because the local PostgreSQL-backed suite did not
    complete in this environment. Evidence:
    `docs/planning/runtime-audit-111-paper-position-test-contract-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-110 fix(api-bots): preserve paper close bot scope`
  - 2026-05-04: Closed a TESTER-mode PAPER manual-close ownership drift.
    Manual dashboard close now backfills missing position `walletId` only in
    LIVE recovery paths, so PAPER bot-scoped positions remain in the
    `Position.walletId=null` persistence lane while close orchestration still
    receives wallet context from the bot. Validation PASS: focused runtime
    session position command suite (`11/11`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-110-paper-manual-close-wallet-backfill-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-109 fix(api-wallets): block paper reset on bot-owned positions`
  - 2026-05-04: Closed a BUILDER-mode PAPER wallet reset safety drift. PAPER
    wallet reset now counts active `OPEN` + `IN_SYNC` positions directly
    assigned to the wallet and positions owned by bots that use the wallet,
    preserving fail-closed reset behavior after PAPER bot positions moved to
    bot-scoped persistence. Validation PASS: focused wallet service unit suite
    (`3/3`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-109-paper-reset-bot-position-scope-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-108 fix(api-orders): persist paper positions in bot scope`
  - 2026-05-04: Closed an ARCHITECT-mode PAPER persistence/DB uniqueness drift.
    PAPER bot positions now persist with `Position.walletId=null`, so they use
    the existing bot-scoped DB uniqueness lane instead of colliding with
    wallet-scoped open-position uniqueness. Order/trade wallet attribution is
    preserved, runtime capital reads use bot scope for PAPER, and wallet
    open-PnL reads include PAPER bot positions through the existing bot-wallet
    relation. Validation PASS: focused unit pack (`23/23`), API typecheck,
    repository guardrails, lint, and diff review. DB-backed order-service
    regression remains locally blocked by unavailable PostgreSQL on
    `localhost:5432`. Evidence:
    `docs/planning/runtime-audit-108-paper-position-db-scope-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-107 fix(api-orders): scope PAPER fills by bot`
  - 2026-05-04: Closed a BUILDER-mode PAPER execution scope drift. Order
    open-position scope is now mode-aware: PAPER orders with a bot id use bot
    scope even when a shared wallet id is present, while LIVE remains
    wallet-scoped. This prevents a PAPER fill from reusing or conflicting with
    another bot's same-symbol position on the same paper wallet, so the active
    bot gets its own dashboard-visible position. Validation PASS: focused
    order-scope unit suite (`2/2`), API typecheck, repository guardrails, lint,
    and diff review. A DB-backed order-service regression was added but local
    execution was blocked by unavailable PostgreSQL on `localhost:5432`.
    Evidence:
    `docs/planning/runtime-audit-107-paper-order-fill-bot-scope-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-106 fix(api-bots): dedupe bot-open DCA display`
  - 2026-05-04: Closed a BUILDER-mode dashboard DCA display drift reported by
    the operator. Runtime position reads now include `orderId` and infer DCA
    progress from unique entry lifecycle units, so duplicate same-order `OPEN`
    rows from bot runtime and exchange fill handling display DCA `0` until a
    real `DCA` row or runtime progress exists. Validation PASS: focused DCA
    count unit suite (`2/2`), API typecheck, repository guardrails, lint, and
    diff review. Integration e2e scenario was added but local execution was
    blocked by unavailable PostgreSQL on `localhost:5432`. Evidence:
    `docs/planning/runtime-audit-106-bot-open-dca-display-dedupe-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-105 fix(api-engine): scope runtime external count to synced rows`
  - 2026-05-04: Closed a TESTER-mode runtime cap active-truth drift. LIVE
    owned imported fallback open-position counts now require
    `syncState=IN_SYNC`, so stale `ORPHAN_LOCAL` imported rows cannot inflate
    bot open-position caps or block expected runtime opens after dashboard
    truth has already ignored them. Validation PASS: runtime signal-loop
    defaults suite (`10/10`), API typecheck, repository guardrails, lint, and
    diff review. Evidence:
    `docs/planning/runtime-audit-105-runtime-external-count-sync-state-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-104 fix(api-runtime): guard close mutations by sync state`
  - 2026-05-04: Closed a BUILDER-mode close mutation active-truth drift.
    Manual order close and runtime execution default close mutations now
    require the linked position to be `OPEN` + `IN_SYNC`, so an `ORPHAN_LOCAL`
    stale row cannot be closed through a valid order or runtime EXIT path.
    Validation PASS: orders service suite (`35/35`), execution orchestrator
    suite (`17/17`), API typecheck, repository guardrails, lint, and diff
    review. Evidence:
    `docs/planning/runtime-audit-104-close-position-mutation-sync-state-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-103 fix(api-positions): scope reconciliation synced lookups`
  - 2026-05-04: Closed a BUILDER-mode LIVE reconciliation active-truth drift.
    Default open-synced position lookup and API-key stale-position scan now
    exclude `ORPHAN_LOCAL` rows while preserving recoverable `DRIFT`, so stale
    local imported rows no longer steal LIVE exchange updates or receive stale
    close handling after they leave active truth. Validation PASS: focused
    reconciliation suite (`31/31`), API typecheck, repository guardrails, lint,
    and diff review. Evidence:
    `docs/planning/runtime-audit-103-reconciliation-open-synced-scope-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-102 fix(api-engine): scope scan watchdog to synced rows`
  - 2026-05-04: Closed an ARCHITECT-mode runtime scan target drift. Default
    runtime scan watchdog target discovery now derives ticker targets only from
    `OPEN` + `IN_SYNC` supported position contexts, so stale local
    `ORPHAN_LOCAL` rows no longer create inferred watchdog ticker processing
    while explicit `RUNTIME_SCAN_SYMBOLS` remains operator-owned. Validation
    PASS: focused runtime scan suite (`6/6`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-102-runtime-scan-watchdog-sync-state-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-101 fix(api-engine): scope position automation to synced rows`
  - 2026-05-04: Closed a BUILDER-mode runtime automation active-truth drift.
    Ticker-driven runtime position automation now hydrates only `OPEN` +
    `IN_SYNC` bot-managed positions, so stale local `ORPHAN_LOCAL` rows cannot
    receive DCA, TP, TTP, SL, or TSL automation decisions while synced
    exchange-imported ownership hydration remains covered. Validation PASS:
    focused automation default-deps suite (`1/1`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-101-position-automation-sync-state-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-100 fix(api-engine): scope position lifetime to synced rows`
  - 2026-05-04: Closed a TESTER-mode runtime lifetime active-truth drift.
    Runtime position lifetime scanning now selects only stale `OPEN` +
    `IN_SYNC` positions, so stale local `ORPHAN_LOCAL` rows cannot trigger
    automated close orchestration while synced stale positions still close
    through the canonical runtime path. Validation PASS: focused lifetime
    suite (`4/4`), API typecheck, repository guardrails, lint, and diff
    review. Evidence:
    `docs/planning/runtime-audit-100-position-lifetime-sync-state-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-99 fix(api-bots): scope PAPER LIVE switch guard`
  - 2026-05-04: Closed an ARCHITECT-mode bot management active-truth drift.
    PAPER to LIVE mode switch guard now counts only `OPEN` + `IN_SYNC`
    `BOT_MANAGED` paper positions, so stale local `ORPHAN_LOCAL` rows no
    longer block a bot configuration switch while real active paper positions
    remain fail-closed. Validation PASS: focused bot e2e pack (`27/27`), API
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-99-paper-live-switch-active-position-scope-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-98 fix(api-orders): release stale fill blockers`
  - 2026-05-04: Closed a BUILDER-mode immediate-fill DB blocker drift. Order
    fill lifecycle now repair-closes exact-scope `ORPHAN_LOCAL` open position
    blockers with `SYSTEM_REPAIR` / `REPAIR_ONLY_CLEANUP` before creating a
    fresh `IN_SYNC` position, so stale local rows no longer block PAPER/LIVE
    filled orders at the partial unique index layer. Validation PASS: orders
    service suite (`34/34`), API typecheck, repository guardrails, lint, and
    diff review. Evidence:
    `docs/planning/runtime-audit-98-immediate-fill-stale-position-blocker-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-97 fix(api-orders): require synced open position scope`
  - 2026-05-04: Closed a BUILDER-mode shared order open-position scope drift.
    Shared order open-position scope and LIVE imported-position fallbacks now
    require `syncState=IN_SYNC`, so stale local or imported open rows no longer
    drive manual reverse-conflict checks or unlinked fill reusable-position
    lookup. Validation PASS: orders service suite (`33/33`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-97-open-position-scope-sync-state-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-96 fix(api-orders): guard linked position fill lifecycle`
  - 2026-05-04: Closed an ARCHITECT-mode linked-position lifecycle drift. LIVE
    exchange order-trade fills now apply linked-position close/DCA lifecycle
    only when the linked position is `status=OPEN` and `syncState=IN_SYNC`, so
    stale local linked positions can no longer receive DCA/close position
    updates, DCA trades, or runtime DCA dedupe completion. Validation PASS:
    exchange-events suite (`7/7`), API typecheck, repository guardrails, lint,
    and diff review. Evidence:
    `docs/planning/runtime-audit-96-linked-position-fill-sync-state-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-95 fix(api-orders): scope trade updates to synced live orders`
  - 2026-05-04: Closed a TESTER-mode LIVE order-trade update scope drift.
    Binance order-trade updates now resolve local orders only when
    `syncState=IN_SYNC` and the order belongs to the event's LIVE Binance
    market through wallet or bot scope, so stale same-exchange-id local rows
    cannot receive fills or steal lifecycle updates from the valid active
    order. Validation PASS: exchange-events suite (`6/6`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-95-order-trade-update-order-scope-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-94 fix(api-orders): scope account updates to synced positions`
  - 2026-05-04: Closed a BUILDER-mode LIVE account-update active-truth drift.
    Binance account-update scope resolution now requires `syncState=IN_SYNC`
    beside `status=OPEN`, so stale same-symbol local rows from another live
    bot/wallet scope cannot create false ambiguity or receive quantity, entry,
    PnL, or external-close updates. Validation PASS: exchange-events suite
    (`6/6`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-94-account-update-scope-sync-state-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-93 fix(api-engine): guard dedupe success by order state`
  - 2026-05-04: Closed an ARCHITECT-mode runtime DCA completion drift. Runtime
    execution dedupe success-by-order now requires the linked order to be
    `status=FILLED` and `syncState=IN_SYNC` before writing `SUCCEEDED`, so a
    stale local order cannot complete runtime DCA dedupe or update runtime DCA
    state after exchange-event handling. Validation PASS: runtime execution
    dedupe suite (`11/11`), exchange-events suite (`6/6`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-93-dedupe-success-order-state-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-92 fix(api-engine): align dedupe linked orders with sync state`
  - 2026-05-04: Closed a BUILDER-mode runtime execution dedupe active-truth
    drift. Linked orders are now reused as submitted or completed only when
    `syncState=IN_SYNC`; a linked `ORPHAN_LOCAL` order immediately resets the
    dedupe row for a fresh execution attempt instead of keeping the intent
    submitted or inflight. Validation PASS: runtime execution dedupe suite
    (`9/9`), execution orchestrator suite (`17/17`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-92-runtime-dedupe-linked-order-sync-state-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-91 fix(api-engine): align execution open lookup with sync state`
  - 2026-05-04: Closed a BUILDER-mode runtime execution active-truth drift.
    Runtime execution open-position lookup now requires `syncState=IN_SYNC`
    for direct and LIVE imported fallback reads, so stale `ORPHAN_LOCAL` open
    rows no longer drive `already_open_same_side`, no-flip, or EXIT close
    decisions after dashboard/pre-trade/runtime loop has stopped treating them
    as active. Validation PASS: focused execution orchestrator suite (`17/17`),
    API typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-91-execution-open-lookup-sync-state-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-90 fix(api-engine): align runtime loop repository with sync state`
  - 2026-05-04: Closed a TESTER-mode runtime loop active-truth drift. Runtime
    signal loop repository reads now require `syncState=IN_SYNC` when
    hydrating managed external open positions and counting bot-symbol open
    positions for caps, so stale `ORPHAN_LOCAL` open rows no longer inflate
    runtime cap or managed-import truth. Validation PASS: focused runtime
    repository/defaults pack (`12/12`), API typecheck, repository guardrails,
    lint, and diff review. Evidence:
    `docs/planning/runtime-audit-90-runtime-loop-repository-sync-state-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-89 fix(api-engine): align pre-trade open guards with sync state`
  - 2026-05-04: Closed a BUILDER-mode pre-trade/runtime active-truth drift.
    Pre-trade user open-position counts, bot open-position counts,
    same-symbol checks, and LIVE imported fallback reads now require
    `syncState=IN_SYNC`, so stale `ORPHAN_LOCAL` open cleanup rows no longer
    block PAPER/LIVE opens through caps or same-symbol guard while active rows
    remain blocking. Validation PASS: focused pre-trade e2e/unit pack
    (`25/25`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-89-pretrade-sync-state-open-guards-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-88 fix(api-positions): scope reconciliation owner cleanup by market`
  - 2026-05-04: Closed a BUILDER-mode LIVE reconciliation cleanup ownership
    drift. Owner cleanup candidates for open synced orders and local managed
    positions are now seeded only from the reconciled canonical market prefix
    plus legacy unscoped ownership keys, excluding other canonical market
    prefixes on the same API key. This prevents a FUTURES reconciliation pass
    from checking or closing SPOT-only owner cleanup targets. Validation PASS:
    live position reconciliation suite (`30/30`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-88-reconciliation-owner-market-scope-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-87 fix(api-positions): scope stale reconciliation scans by market`
  - 2026-05-04: Closed an ARCHITECT-mode LIVE reconciliation write-path drift.
    LIVE position reconciliation stale synced-position scans now receive the
    synced API-key market type and include only the current canonical market
    prefix plus legacy unscoped imported IDs, excluding other canonical market
    prefixes from missing/close cleanup. This prevents a FUTURES reconciliation
    pass from marking same-api-key SPOT rows stale. Validation PASS: live
    position reconciliation suite (`29/29`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-87-reconciliation-stale-scan-market-scope-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-86 fix(api-wallets): scope imported open PnL by market type`
  - 2026-05-04: Closed a BUILDER-mode wallet analytics market-scope drift.
    Wallet performance summary and equity timeline now match botless LIVE
    imported open positions by canonical `apiKeyId:marketType:` external ID
    prefix instead of broad `apiKeyId:`, so a FUTURES wallet no longer includes
    SPOT open PnL from the same API key while same-market `IN_SYNC` imported
    PnL remains included. Validation PASS: wallets e2e (`20/20`), API
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-86-wallet-open-pnl-market-scope-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-85 fix(api-bots): align runtime closed history with sync state`
  - 2026-05-04: Closed a TESTER-mode runtime/portfolio closed-history drift.
    Runtime closed-position reads, portfolio close-point reads, and runtime
    paper capital open/closed position queries now require `syncState=IN_SYNC`,
    so scoped `ORPHAN_LOCAL` cleanup rows no longer inflate closed counts,
    realized PnL, portfolio CLOSE points, reference balance, or free cash.
    Validation PASS: portfolio-history e2e (`3/3`), runtime-scope e2e
    (`16/16`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-85-runtime-closed-positions-sync-state-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-84 fix(api-bots): align runtime open positions with sync state`
  - 2026-05-04: Closed an ARCHITECT-mode runtime dashboard active-position
    drift. Bot runtime session positions now require `syncState=IN_SYNC` for
    active open-position truth, including open-count, open quantity,
    unrealized PnL, margin/free-cash, fee aggregation, and continuity candidate
    reads, so stale scoped `ORPHAN_LOCAL` open rows no longer appear as live
    bot positions. Validation PASS: runtime-scope e2e (`16/16`), API
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-84-runtime-open-positions-sync-state-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-83 fix(api-bots): align symbol live rows with sync state`
  - 2026-05-04: Closed a BUILDER-mode runtime symbol KPI drift. Runtime symbol
    live-row reads now require `syncState=IN_SYNC`, so scoped `ORPHAN_LOCAL`
    open-position rows no longer inflate symbol-stats open count, quantity,
    unrealized PnL, or derived market state while active synced rows remain
    included. Validation PASS: runtime-scope e2e (`15/15`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-83-symbol-live-rows-sync-state-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-82 fix(api-wallets): align open PnL with sync state`
  - 2026-05-04: Closed a BUILDER-mode wallet KPI/timeline parity drift. Wallet
    current open-PnL aggregation now requires `syncState=IN_SYNC` in the shared
    helper used by performance summary and equity timeline, so same-API-key
    `ORPHAN_LOCAL` imported open-position rows no longer inflate wallet
    dashboard PnL while active imported `IN_SYNC` rows remain included.
    Validation PASS: wallets e2e (`20/20`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-82-wallet-open-pnl-sync-state-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-81 fix(api-wallets): align reset open-position blocker with sync state`
  - 2026-05-04: Closed an ARCHITECT-mode paper wallet reset parity drift.
    Paper wallet reset now counts open-position blockers only when
    `syncState=IN_SYNC`, matching the existing open-order blocker and active
    position-list/runtime semantics, so stale `ORPHAN_LOCAL` open-position rows
    no longer deny reset. Validation PASS: wallets e2e (`20/20`), API
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-81-wallet-reset-active-position-sync-state-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-80 fix(api-positions): ignore local orphans in legacy repair`
  - 2026-05-04: Closed a TESTER-mode legacy open-position repair drift. Local
    legacy repair now excludes `syncState=ORPHAN_LOCAL` from candidate scans
    and from both guarded repair update predicates, so a scope-matching local
    orphan cannot be rebound to a canonical bot or closed again by this repair
    path. Valid `IN_SYNC` legacy rebind, detached-blocker close, and exchange
    re-import behavior remain covered. Validation PASS: orphan-repair e2e
    (`1/1`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-80-orphan-repair-ignore-local-orphans-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-79 fix(api-positions): ignore local orphans in takeover repair`
  - 2026-05-04: Closed a BUILDER-mode LIVE takeover repair drift. Takeover
    status and rebind candidate scans now exclude `syncState=ORPHAN_LOCAL`,
    and the rebind update predicate repeats the stale-local guard so a
    scope-matching local orphan cannot be shown as takeover-active or rebound
    back to `IN_SYNC`. `DRIFT` repair behavior remains intact. Validation PASS:
    takeover-status e2e (`6/6`), API typecheck, repository guardrails, lint,
    and diff review. Evidence:
    `docs/planning/runtime-audit-79-takeover-ignore-local-orphans-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-78 fix(api-positions): reject stale management-mode toggles`
  - 2026-05-04: Closed an ARCHITECT-mode position management-state drift.
    Dashboard/API management-mode updates now require `status=OPEN` and
    `syncState=IN_SYNC`, so stale `ORPHAN_LOCAL` open-position rows cannot be
    switched between `BOT_MANAGED` and `MANUAL_MANAGED` after active lists and
    runtime paths stop treating them as live. Validation PASS: positions
    service suite (`3/3`), API typecheck, repository guardrails, lint, and diff
    review. Evidence:
    `docs/planning/runtime-audit-78-position-management-mode-active-state-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-77 fix(api-positions): require synced state for manual updates`
  - 2026-05-04: Closed a BUILDER-mode manual position update parity drift.
    Manual TP/SL updates now require `syncState=IN_SYNC` in addition to
    `status=OPEN`, and the mutation uses a guarded `updateMany` predicate so
    stale `ORPHAN_LOCAL` open-position rows cannot be changed after active
    list/runtime close paths stop treating them as active. Validation PASS:
    positions service suite (`2/2`), API typecheck, repository guardrails,
    lint, and diff review. Evidence:
    `docs/planning/runtime-audit-77-position-manual-update-sync-state-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-76 fix(api-positions): align active position lists with sync state`
  - 2026-05-04: Closed a BUILDER-mode dashboard positions-list parity drift.
    Generic dashboard positions list now requires `syncState=IN_SYNC` when
    filtering `status=OPEN`, so stale `ORPHAN_LOCAL` open-position rows no
    longer appear as active list truth while unfiltered history remains
    available for audit. Validation PASS: positions list e2e (`2/2`), API
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-76-positions-list-active-sync-state-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-75 fix(api-runtime): require synced state for runtime close`
  - 2026-05-04: Closed a TESTER-mode runtime manual-close parity drift.
    Dashboard/runtime manual close-position command now requires
    `syncState=IN_SYNC` for the selected open position and for the
    ownership-claim update guard, so stale `ORPHAN_LOCAL` open-position rows
    are ignored as `no_open_position` before close orchestration. Validation
    PASS: runtime position command suite (`10/10`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-75-runtime-close-position-sync-state-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-74 fix(api-orders): require active sync state for order actions`
  - 2026-05-04: Closed a BUILDER-mode manual order lifecycle parity drift.
    Manual `cancelOrder` and `closeOrder` now require `syncState=IN_SYNC`, so
    stale `ORPHAN_LOCAL` open-status rows cannot be canceled, filled, or used
    to close linked positions through direct API actions after runtime/dashboard
    has stopped treating them as active. Validation PASS: orders service suite
    (`31/31`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-74-order-actions-active-sync-state-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-73 fix(api-orders): align active order lists with sync state`
  - 2026-05-04: Closed a BUILDER-mode dashboard/order-list parity drift.
    Orders list active-status queries now require `syncState=IN_SYNC` for
    `PENDING`, `OPEN`, and `PARTIALLY_FILLED`, so stale `ORPHAN_LOCAL`
    open-status rows no longer appear as active order-list truth while
    unfiltered history and terminal status filters remain available.
    Validation PASS: orders service suite (`29/29`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-73-orders-list-active-sync-state-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-72 fix(api-engine): align order lifetime with sync state`
  - 2026-05-04: Closed an ARCHITECT-mode runtime lifecycle parity drift.
    Runtime order lifetime cancellation candidates now require
    `syncState=IN_SYNC`, so stale `ORPHAN_LOCAL` open-status order rows no
    longer generate cancel attempts or dedupe noise while stale confirmed
    active rows remain cancelable. Validation PASS: runtime order lifetime
    suite (`5/5`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-72-order-lifetime-active-sync-state-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-71 fix(api-wallets): align reset open-order blocker with sync state`
  - 2026-05-04: Closed a BUILDER-mode wallet/runtime lifecycle parity drift.
    Paper wallet reset now counts active open-order blockers only when
    `syncState=IN_SYNC`, so stale `ORPHAN_LOCAL` open-order rows no longer
    block reset after runtime/dashboard has stopped treating them as active.
    Active `IN_SYNC` open orders still block reset. Validation PASS: wallet e2e
    (`19/19`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-71-wallet-reset-active-order-sync-state-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-70 fix(api-runtime): hide stale synced open orders`
  - 2026-05-04: Closed a TESTER-mode dashboard/reconciliation lifecycle drift.
    Runtime open-order reads now require `syncState=IN_SYNC`, so existing
    `ORPHAN_LOCAL` exchange-synced rows no longer inflate dashboard
    `openOrdersCount`; reconciliation stale-order marking now also moves stale
    synced orders to non-open `CANCELED`. Validation PASS: runtime-scope e2e
    (`15/15`), live reconciliation suite (`28/28`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-70-hide-stale-open-orders-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-69 fix(api-positions): scope open-order upsert by owner`
  - 2026-05-04: Closed an ARCHITECT-mode LIVE open-order write-path ownership
    drift. Exchange-synced open-order upsert now searches existing rows only
    within the same bot or same botless wallet context before updating or
    blocking, so an unrelated wallet-null/botless `exchangeOrderId` collision
    cannot steal the update or prevent the owning bot/wallet row from being
    created. Validation PASS: live reconciliation suite (`27/27`), API
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-69-open-order-upsert-owner-scope-task-2026-05-04.md`.
- [x] `RUNTIME-AUDIT-68 fix(api-runtime): require wallet proof for botless LIVE open orders`
  - 2026-05-03: Closed a BUILDER-mode dashboard management-state ownership
    drift. Runtime session positions now require exact wallet proof before
    including botless LIVE `EXCHANGE_SYNC` open orders through the
    external-owned order fallback, so stale/global wallet-null rows cannot be
    counted only because they share an owned symbol. Bot-scoped wallet-null
    orders remain visible through the existing bot-scoped filter. Validation
    PASS: runtime-scope e2e (`14/14`), API typecheck, repository guardrails,
    lint, and diff review. Evidence:
    `docs/planning/runtime-audit-68-live-open-order-wallet-proof-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-67 fix(api-runtime): scope imported external-id query filters`
  - 2026-05-03: Closed a TESTER-mode DB candidate-filter drift after
    market-scoped imported IDs. Market-known imported-position queries now
    filter canonical rows by `apiKey:marketType:` and legacy rows by
    `apiKey:symbol:` instead of broad `apiKey:` prefixes, covering runtime
    dashboard position/trade reads, pre-trade guards, runtime loop open-count
    guards, execution no-flip reuse, and order conflict/fill reuse. Validation
    PASS: runtime loop defaults (`10/10`), live reconciliation (`26/26`),
    pre-trade service (`17/17`), orders service (`28/28`), runtime position
    command (`9/9`), API typecheck, repository guardrails, lint, and diff
    review. Evidence:
    `docs/planning/runtime-audit-67-market-scoped-external-id-query-filters-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-66 fix(api-runtime): parse external-id market for ownership reads`
  - 2026-05-03: Closed an ARCHITECT-mode read-path drift after market-scoped
    imported IDs. Takeover rebind/status, imported runtime ownership hydration,
    and runtime loop managed-external guards now parse
    `apiKey:marketType:symbol:side` IDs and pass the parsed market type into
    ownership lookup, with legacy `apiKey:symbol:side` fallback preserved.
    Validation PASS: runtime loop defaults suite (`10/10`), live reconciliation
    suite (`26/26`), API typecheck, repository guardrails, lint, and diff
    review. Evidence:
    `docs/planning/runtime-audit-66-parse-external-id-market-ownership-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-65 fix(api-positions): market-scope imported external IDs`
  - 2026-05-03: Closed a BUILDER-mode persisted identity drift after
    market-scoped ownership. LIVE reconciliation now builds imported position
    external IDs as `apiKey:marketType:symbol:side` whenever the synced API-key
    work item carries market type, while helper parsing and stale-symbol
    extraction stay compatible with legacy `apiKey:symbol:side` rows.
    Reconciliation also looks up legacy IDs before creating a fresh row, so
    existing legacy imports can be upgraded instead of duplicated. Validation
    PASS: live reconciliation suite (`26/26`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-65-market-scoped-external-position-id-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-64 fix(api-bots): scope external ownership by market type`
  - 2026-05-03: Closed a BUILDER-mode LIVE import ownership drift. External
    takeover ownership now scopes by `apiKey + marketType + symbol`, resolves
    market type from wallet/bot/active market-group context, and passes known
    market type through reconciliation, runtime dashboard reads, pre-trade,
    order conflict/fill, and runtime loop call sites. Legacy callers without
    market type keep FUTURES semantics, and legacy injected ownership maps
    remain read-compatible. Validation PASS: ownership regression suite
    (`10/10`), live reconciliation suite (`25/25`), runtime loop defaults
    suite (`9/9`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-64-external-ownership-market-type-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-63 fix(api-positions): use market type in live reconciliation`
  - 2026-05-03: Closed an ARCHITECT-mode LIVE import scope drift. The exchange
    reconciliation worker now expands synced API keys into one work item per
    LIVE wallet/active bot market type and passes that market type through
    position, open-order, trade-history, and owned automation snapshot paths.
    This removes the previous FUTURES-only snapshot assumption while preserving
    FUTURES fallback for legacy API-key-only contexts. Validation PASS: live
    position reconciliation unit suite (`25/25`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-63-live-reconciliation-market-type-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-62 fix(api-bots): show planned dynamic-stop columns`
  - 2026-05-03: Closed a TESTER-mode API display-contract drift. Runtime
    session positions now return `showDynamicStopColumns=true` when an open row
    has planned trailing take-profit or trailing stop levels before a dynamic
    stop is armed, so dashboard visibility matches canonical row truth instead
    of waiting for `dynamicTtpStopLoss` / `dynamicTslStopLoss` to become
    non-null. Focused operator-truth tests were also aligned to symbols inside
    the bot's assigned market group. Validation PASS: dynamic-stop operator
    truth e2e (`3/3`), API typecheck, repository guardrails, lint, and diff
    review. Evidence:
    `docs/planning/runtime-audit-62-planned-dynamic-stop-columns-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-61 fix(web-runtime): align dashboard dynamic-stop plan visibility`
  - 2026-05-03: Closed a BUILDER-mode dashboard/Bots surface drift. Dashboard
    home and Bots monitoring now share `hasRuntimeDynamicStopRowTruth`, so
    TTP/TSL columns stay visible when an open row has dynamic stop prices,
    derived protected percentages, or planned trailing levels before arm.
    Validation PASS: focused web regression pack (`33/33`), web typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-61-dashboard-dynamic-stop-plan-visibility-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-60 fix(api-bots): prevent aggregate running session metadata overlap double counts`
  - 2026-05-03: Closed an ARCHITECT-mode aggregate status metadata drift.
    Runtime monitoring aggregate `sessionDetail.durationMs` and
    `sessionDetail.eventsCount` now sum all non-running historical session rows
    plus only the freshest RUNNING session projection, so overlapping running
    sessions no longer double-count active runtime duration or active event
    count. `sessionsCount` and `symbolsTracked` remain unchanged as
    diagnostic/configured-scope metadata. Validation PASS: aggregate e2e
    (`18/18`), runtime-scope e2e (`13/13`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-60-aggregate-running-session-metadata-overlap-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-59 fix(api-bots): prevent aggregate running symbol-summary overlap double counts`
  - 2026-05-03: Closed a BUILDER-mode aggregate market/signal summary drift.
    Runtime monitoring aggregate symbol items and `symbolStats.summary` now
    sum all non-running historical session rows plus only the freshest RUNNING
    session projection, so overlapping running sessions no longer double-count
    signal counters, closed-trade counters, gross PnL, or symbol fees in
    dashboard market/header summaries. Validation PASS: aggregate e2e
    (`17/17`), runtime-scope e2e (`13/13`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-59-aggregate-running-symbol-summary-overlap-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-58 fix(api-bots): prevent aggregate running closed-position overlap double counts`
  - 2026-05-03: Closed a BUILDER-mode aggregate closed-position history drift.
    Runtime monitoring aggregate closed-position counts, realized PnL, and
    position fees now sum all non-running historical session rows plus only
    the freshest RUNNING session projection, so overlapping running sessions
    no longer show one visible closed history row with doubled dashboard
    closed totals. Validation PASS: aggregate e2e (`16/16`), runtime-scope
    e2e (`13/13`), API typecheck, repository guardrails, lint, and diff
    review. Evidence:
    `docs/planning/runtime-audit-58-aggregate-running-closed-position-overlap-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-57 fix(api-bots): prevent aggregate symbol open-state overlap double counts`
  - 2026-05-03: Closed a TESTER-mode aggregate market/signal current-state
    drift. Runtime monitoring aggregate symbol items and summary now keep
    historical counters summed while taking current open-position count,
    quantity, and unrealized PnL from the newest per-symbol snapshot, so
    overlapping RUNNING sessions no longer make symbol summaries disagree with
    positions current state. Validation PASS: aggregate e2e (`15/15`),
    runtime-scope e2e (`13/13`), API typecheck, repository guardrails, lint,
    and diff review. Evidence:
    `docs/planning/runtime-audit-57-aggregate-symbol-open-overlap-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-56 fix(api-bots): prevent aggregate running trade overlap double counts`
  - 2026-05-03: Closed a BUILDER-mode aggregate trade/fee drift. Runtime
    monitoring aggregate trade totals and fees now sum non-running historical
    session totals plus only the freshest RUNNING session projection, so
    overlapping running sessions no longer show one visible trade row with
    doubled `trades.total` or fee summary. Validation PASS: aggregate e2e
    (`15/15`), runtime-scope e2e (`13/13`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-56-aggregate-running-trade-overlap-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-55 fix(api-bots): align aggregate total positions with final counts`
  - 2026-05-03: Closed a BUILDER-mode aggregate count consistency drift.
    Runtime monitoring aggregate `positions.total` now derives from final
    aggregate `openCount + closedCount`, so overlapping running sessions cannot
    leave `total` higher than the displayed open/closed counts after current
    open-position dedupe. Validation PASS: aggregate e2e (`14/14`),
    runtime-scope e2e (`13/13`), API typecheck, repository guardrails, lint,
    and diff review. Evidence:
    `docs/planning/runtime-audit-55-aggregate-total-position-overlap-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-54 fix(api-bots): prevent aggregate open-position overlap double counts`
  - 2026-05-03: Closed an ARCHITECT-mode current-state dashboard drift.
    Runtime monitoring aggregate now takes current open-position count,
    quantity, and unrealized PnL from the freshest session positions read model
    instead of summing overlapping session projections, so duplicate running
    sessions do not double-count the same open position. Historical
    closed/trade metrics remain session-window sums. Validation PASS:
    overlapping-session aggregate e2e (`14/14`), runtime-scope e2e (`13/13`),
    API typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-54-aggregate-open-position-overlap-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-53 fix(api-bots): preserve portfolio close points under monitoring row caps`
  - 2026-05-03: Closed a BUILDER-mode portfolio dashboard history drift. Bot
    portfolio history now composes close points from full scoped closed-position
    DB truth instead of capped monitoring aggregate visible rows, so a bot with
    more than 500 closed positions still shows close-point history aligned with
    closed-count and realized-PnL summaries. Validation PASS: 501-close
    portfolio history e2e (`3/3`), API typecheck, repository guardrails, lint,
    and diff review. Evidence:
    `docs/planning/runtime-audit-53-portfolio-history-close-points-limit-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-52 fix(api-bots): preserve aggregate symbols-tracked under item limits`
  - 2026-05-03: Closed a TESTER-mode dashboard aggregate metadata drift.
    Runtime monitoring aggregate `sessionDetail.symbolsTracked` now composes
    full session metadata instead of visible aggregate symbol rows, so
    `perSessionLimit` no longer makes aggregate metadata understate how many
    markets the bot tracked. Validation PASS: failing-then-passing
    `perSessionLimit=1` symbols-tracked regression, monitoring aggregate e2e
    (`13/13`), runtime-scope e2e (`13/13`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-52-aggregate-symbols-tracked-limit-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-51 fix(api-bots): preserve aggregate symbol-stats summaries under item limits`
  - 2026-05-03: Closed an ARCHITECT-mode dashboard aggregate summary drift.
    Runtime monitoring aggregate now keeps visible `symbolStats.items` limited
    while composing `symbolStats.summary` and aggregate header signal counters
    from per-session summary truth, so hidden assigned symbols no longer
    disappear from aggregate signal and PnL totals under `perSessionLimit`.
    Validation PASS: failing-then-passing `perSessionLimit=1` aggregate
    symbol-stats summary regression, monitoring aggregate e2e (`13/13`),
    runtime-scope e2e (`13/13`), API typecheck, repository guardrails, lint,
    and diff review. Evidence:
    `docs/planning/runtime-audit-51-aggregate-symbol-stats-summary-limit-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-50 fix(api-bots): preserve symbol-stats open summary under item limits`
  - 2026-05-03: Closed a BUILDER-mode dashboard market/signal summary drift.
    Runtime session symbol-stats now keep visible `items` limited while
    composing live open-position summary metrics from the full configured
    symbol scope, so hidden assigned symbols no longer disappear from
    `summary.openPositionCount`, `summary.openPositionQty`, or persisted
    `summary.unrealizedPnl`. Validation PASS: failing-then-passing `limit=1`
    symbol-stats open summary regression, runtime-scope e2e (`13/13`),
    monitoring aggregate e2e (`12/12`), API typecheck, repository guardrails,
    lint, and diff review. Evidence:
    `docs/planning/runtime-audit-50-symbol-stats-open-summary-limit-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-49 fix(api-bots): preserve aggregate open-order counts under row limits`
  - 2026-05-03: Closed a BUILDER-mode dashboard management-state drift.
    Runtime monitoring aggregate `positions.openOrdersCount` now uses full
    current-state session open-order count truth via the maximum session count
    instead of limited visible aggregate rows, so `perSessionLimit` no longer
    hides older open orders from the dashboard count and multiple sessions do
    not double-count the same current open order. Validation PASS:
    failing-then-passing `perSessionLimit=1` aggregate open-order count
    regression, monitoring aggregate e2e (`12/12`), runtime-scope e2e
    (`12/12`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-49-aggregate-open-orders-count-limit-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-48 fix(api-bots): preserve runtime open-order counts under row limits`
  - 2026-05-03: Closed an ARCHITECT-mode dashboard management-state drift.
    Runtime session positions now return a full deduped `openOrdersCount`
    separately from limited visible `openOrders`, so dashboard open-order
    counts remain truthful when `limit` hides older scoped orders. Duplicate
    local/exchange open orders still dedupe through the existing preference
    rules. Validation PASS: failing-then-passing `limit=1` open-order count
    regression, runtime-scope e2e (`12/12`), monitoring aggregate e2e
    (`11/11`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-48-open-orders-count-limit-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-47 fix(api-bots): preserve aggregate position fees under row limits`
  - 2026-05-03: Closed a TESTER-mode dashboard accounting summary drift.
    Runtime monitoring aggregate `positions.summary.feesPaid` now composes
    per-session positions summaries instead of limited visible aggregate rows,
    so aggregate positions/wallet fee totals remain truthful when
    `perSessionLimit` hides older positions. Visible rows remain limited.
    Validation PASS: failing-then-passing `perSessionLimit=1` aggregate
    position-fee regression, runtime-scope e2e (`12/12`), monitoring
    aggregate e2e (`11/11`), API typecheck, repository guardrails, lint, and
    diff review. Evidence:
    `docs/planning/runtime-audit-47-aggregate-position-fees-limit-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-46 fix(api-bots): preserve runtime unrealized PnL under row limits`
  - 2026-05-03: Closed a BUILDER-mode money-impacting dashboard summary
    drift. Runtime session positions now aggregate scoped persisted
    open-position `unrealizedPnl`, and monitoring aggregate composes
    unrealized PnL from per-session position summaries instead of limited
    visible open rows. Dashboard PnL summaries now remain truthful when
    `limit` / `perSessionLimit` hides older open positions while visible rows
    keep their existing dynamic display behavior. Validation PASS:
    failing-then-passing `perSessionLimit=1` unrealized-PnL regression,
    runtime-scope e2e (`12/12`), monitoring aggregate e2e (`11/11`), API
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-46-position-unrealized-pnl-limit-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-45 fix(api-bots): preserve runtime position fees under row limits`
  - 2026-05-03: Closed an ARCHITECT-mode dashboard accounting summary drift.
    Runtime session positions now aggregate direct trade fees through the full
    scoped position set instead of limited visible position rows, so dashboard
    `positions.summary.feesPaid` remains truthful when `limit` /
    `perSessionLimit` hides older positions. Visible `openItems` and
    `historyItems` remain limited. Validation PASS: failing-then-passing
    `limit=1` position-fee regression, runtime-scope e2e (`12/12`),
    monitoring aggregate e2e (`11/11`), API typecheck, repository guardrails,
    lint, and diff review. Evidence:
    `docs/planning/runtime-audit-45-position-fees-limit-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-44 fix(api-bots): preserve aggregate trade fees under row limits`
  - 2026-05-03: Closed a BUILDER-mode dashboard accounting summary drift.
    Runtime session trades now expose unpaginated scoped `feesPaid`, and
    monitoring aggregate `sessionDetail.summary.feesPaid` composes those
    session fee totals instead of limited visible trade rows. Dashboard fee
    summaries now remain truthful when `perSessionLimit` hides older trades
    while visible trade rows remain limited. Validation PASS:
    failing-then-passing `perSessionLimit=1` trade-fee regression,
    runtime-scope e2e (`12/12`), monitoring aggregate e2e (`11/11`), API
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-44-aggregate-trade-fees-limit-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-43 fix(api-bots): preserve free cash under hidden open-position margin`
  - 2026-05-03: Closed a BUILDER-mode money-impacting dashboard read-model
    drift. Runtime session positions now use scoped persisted open-position
    `marginUsed` as the primary used-margin input for capital summary, so
    dashboard `positions.summary.freeCash` no longer overstates available cash
    when `limit` / `perSessionLimit` hides older open rows. Visible open rows
    remain limited, with visible-row modeled margin retained as fallback when
    no persisted margin exists. Validation PASS: failing-then-passing
    hidden-margin free-cash regression, runtime-scope e2e (`12/12`),
    monitoring aggregate e2e (`11/11`), API typecheck, repository guardrails,
    lint, and diff review. Evidence:
    `docs/planning/runtime-audit-43-free-cash-open-margin-limit-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-42 fix(api-bots): preserve aggregate open-position quantity under row limits`
  - 2026-05-03: Closed an ARCHITECT-mode dashboard read-model quantity drift.
    Runtime session positions now expose scoped `summary.openPositionQty`, and
    monitoring aggregate `sessionDetail.summary.openPositionQty` composes that
    session truth instead of limited visible open rows. Dashboard open-position
    quantity now remains truthful when `perSessionLimit` hides older open
    positions while visible row lists remain limited. Validation PASS:
    failing-then-passing `perSessionLimit=1` open-quantity regression,
    runtime-scope e2e (`12/12`), monitoring aggregate e2e (`11/11`), API
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-42-open-position-qty-limit-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-41 fix(api-bots): preserve runtime position realized PnL under row limits`
  - 2026-05-03: Closed a BUILDER-mode dashboard read-model summary drift.
    Runtime session positions now aggregate realized PnL from all scoped
    closed positions instead of only visible history rows, and monitoring
    aggregate summaries compose those session position summaries. This keeps
    dashboard realized PnL truthful when `limit` / `perSessionLimit` hides
    older closed positions while visible row lists remain limited. Validation
    PASS: failing-then-passing `limit=1` realized-PnL regression,
    runtime-scope e2e (`12/12`), monitoring aggregate e2e (`10/10`), API
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-41-position-realized-pnl-limit-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-40 fix(api-bots): preserve runtime position counts under row limits`
  - 2026-05-03: Closed a BUILDER-mode dashboard read-model count drift.
    Runtime session positions and monitoring aggregate position metadata now
    use true scoped open/closed position counts instead of limited visible row
    counts, so dashboard `positions.total`, `openCount`, and `closedCount`
    stay truthful when `limit` / `perSessionLimit` hides older rows. Visible
    `openItems` / `historyItems` remain limited. Validation PASS:
    failing-then-passing `limit=1` regression, runtime-scope e2e (`12/12`),
    monitoring aggregate e2e (`10/10`), API typecheck, repository guardrails,
    lint, and diff review. Evidence:
    `docs/planning/runtime-audit-40-position-count-limit-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-39 fix(api-bots): preserve aggregate trade totals under row limits`
  - 2026-05-03: Closed an ARCHITECT-mode dashboard read-model count drift.
    Runtime monitoring aggregate `trades.total` and `trades.meta.total` now
    sum the true per-session trade totals instead of the limited visible
    aggregate row count, so dashboard trade activity counts stay truthful when
    `perSessionLimit` hides older rows. Visible `trades.items` remain limited,
    with pagination metadata exposing hidden rows via `hasNext`. Validation
    PASS: failing-then-passing `perSessionLimit=1` regression, full monitoring
    aggregate e2e (`10/10`), API typecheck, repository guardrails, lint, and
    diff review. Evidence:
    `docs/planning/runtime-audit-39-aggregate-trade-total-limit-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-38 fix(api-bots): align non-running aggregate end time`
  - 2026-05-03: Closed a BUILDER-mode runtime dashboard timestamp drift.
    Runtime monitoring aggregate `sessionDetail.finishedAt` now uses the same
    non-running session window-end fallback as nested runtime reads
    (`finishedAt ?? lastHeartbeatAt ?? startedAt`), so failed/canceled
    aggregate metadata no longer shows `finishedAt: null` while
    positions/trades windows have a concrete end. RUNNING aggregate still
    reports `finishedAt: null`. Validation PASS: failing-then-passing
    failed-session end-time regression, full monitoring aggregate e2e (`9/9`),
    API typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-38-aggregate-non-running-window-end-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-37 fix(api-bots): do not invent empty aggregate heartbeat`
  - 2026-05-03: Closed a TESTER-mode false-freshness empty-state bug. Empty
    runtime monitoring aggregate payloads now return
    `sessionDetail.lastHeartbeatAt: null` when no runtime sessions exist, so
    the dashboard no longer receives a fresh synthetic heartbeat timestamp
    alongside `sessionsCount: 0`. Non-empty aggregate heartbeat behavior
    remains session-derived. Validation PASS: failing-then-passing empty
    aggregate heartbeat regression, full monitoring aggregate e2e (`8/8`), API
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-37-empty-aggregate-heartbeat-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-36 fix(api-bots): align aggregate header PnL with positions`
  - 2026-05-03: Closed an ARCHITECT-mode duplicate-summary truth drift.
    Runtime monitoring aggregate header `sessionDetail.summary.realizedPnl`
    now reuses the scoped positions summary, so imported or externally closed
    positions with canonical position PnL but no local trade rows no longer
    disappear from the dashboard aggregate header. Trade-backed fee behavior
    is unchanged. Validation PASS: failing-then-passing imported closed
    position PnL regression, full monitoring aggregate e2e (`8/8`), runtime
    history parity e2e (`6/6`), API typecheck, repository guardrails, lint, and
    diff review. Evidence:
    `docs/planning/runtime-audit-36-aggregate-position-summary-pnl-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-35 fix(api-bots): keep empty running aggregate unfinished`
  - 2026-05-03: Closed a BUILDER-mode runtime dashboard empty-state timestamp
    drift. Empty runtime monitoring aggregate payloads now set
    `sessionDetail.finishedAt: null` when the effective empty aggregate status
    is `RUNNING`, preventing dashboard metadata from saying an empty running
    view is already finished. Default empty completed metadata remains
    deterministic. Validation PASS: failing-then-passing empty
    `status=RUNNING` regression, full monitoring aggregate e2e (`7/7`), API
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-35-empty-aggregate-running-finished-at-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-34 fix(api-bots): preserve empty aggregate bot mode`
  - 2026-05-03: Closed a BUILDER-mode runtime dashboard empty-state truth
    drift. Empty runtime monitoring aggregate payloads now preserve the
    selected bot's persisted mode instead of hardcoding `PAPER`, so LIVE bots
    without runtime sessions no longer render misleading paper-mode aggregate
    metadata. Non-empty aggregate mode resolution remains session-derived.
    Validation PASS: failing-then-passing LIVE empty aggregate mode regression,
    full monitoring aggregate e2e (`6/6`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-34-empty-aggregate-mode-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-33 fix(api-bots): attribute imported open trade anchors to effective strategy`
  - 2026-05-03: Closed an ARCHITECT-mode runtime dashboard provenance drift.
    Runtime trade synthetic `position-open:*` anchors now resolve the single
    canonical strategy from active bot market-group links when an imported
    open position has `strategyId: null`, keeping runtime trades and aggregate
    strategy attribution aligned with the selected bot configuration.
    Ambiguous multi-strategy provenance remains unassigned. Validation PASS:
    failing-then-passing imported strategy-null open anchor regression, full
    runtime history parity e2e (`6/6`), runtime-scope e2e (`12/12`),
    runtime-strategy-context e2e (`5/5`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-33-trade-anchor-effective-strategy-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-32 fix(api-engine): attribute automation skip telemetry to effective strategy`
  - 2026-05-03: Closed a TESTER-mode dashboard/runtime event provenance drift.
    Runtime automation `PRETRADE_BLOCKED` skip telemetry now accepts the same
    effective strategy provenance used by lifecycle decisions, so imported or
    strategy-null LIVE positions with one canonical strategy link keep
    fail-closed event attribution aligned with their configured strategy.
    Ambiguous multi-strategy provenance remains unassigned. Validation PASS:
    failing-then-passing imported strategy-null skip telemetry regression, full
    runtime position automation service tests (`36/36`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-32-skip-telemetry-effective-strategy-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-31 fix(api-engine): attribute DCA block telemetry to effective strategy`
  - 2026-05-03: Closed a dashboard/runtime event provenance drift. Runtime DCA
    funds-exhausted `PRETRADE_BLOCKED` telemetry now uses the same effective
    strategy provenance resolved for lifecycle decisions, so imported or
    strategy-null bot positions with one canonical strategy link keep event
    attribution aligned with their configured strategy. Validation PASS:
    failing-then-passing imported strategy-null DCA block telemetry regression,
    full runtime position automation service tests (`35/35`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-31-dca-block-effective-strategy-telemetry-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-30 fix(api-positions): protect live positions while same-symbol orders are open`
  - 2026-05-03: Closed a LIVE stale-close lifecycle drift. Owned exchange open
    orders now protect both possible local position sides for the same symbol
    during stale local LIVE position reconciliation, so a pending same-symbol
    close/order lifecycle cannot let the bot close local state before the
    exchange order resolves. Unrelated stale local positions still close after
    the grace window. Validation PASS: failing-then-passing same-symbol
    open-order protection regression, full live reconciliation service tests
    (`24/24`), sequential runtime takeover e2e (`4/4`), sequential
    runtime-scope e2e (`12/12`), API typecheck, repository guardrails, lint,
    and diff review. Evidence:
    `docs/planning/runtime-audit-30-live-reconcile-open-order-symbol-protection-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-29 fix(api-bots): keep runtime open orders visible after dedupe`
  - 2026-05-03: Closed a dashboard runtime open-order drift. Runtime session
    `openOrders` now read a bounded candidate set before exchange/local dedupe
    and apply the dashboard `limit` after dedupe, so duplicate rows sharing an
    `exchangeOrderId` cannot hide distinct open orders from the dashboard.
    Validation PASS: failing-then-passing `limit=2` duplicate-order
    regression, focused runtime-scope e2e (`12/12`), broader bots e2e
    (`26/26`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-29-runtime-open-orders-dedupe-limit-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-28 fix(api-bots): keep runtime open positions visible under history limits`
  - 2026-05-03: Closed a dashboard runtime positions drift. Runtime session
    positions now read open and closed bot-managed rows as separate scoped
    collections before serialization, so a newer history row cannot hide an
    older open position from the dashboard when the request uses a small
    `limit`. Validation PASS: failing-then-passing `limit=1` open/history
    regression, focused runtime-scope e2e (`11/11`), broader bots e2e
    (`26/26`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-28-runtime-positions-open-history-limit-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-27 fix(api-bots): hydrate limited symbol stats by configured order`
  - 2026-05-03: Closed a TESTER-mode dashboard signal truth drift. Unfiltered
    selected-bot symbol-stats now select display rows from configured symbol
    order and then hydrate persisted stats for that exact symbol set,
    preventing top-PnL DB ordering from rendering a configured dashboard
    signal row with zero totals when its stat row exists. Explicit symbol
    filters and off-scope empty behavior remain unchanged. Validation PASS:
    failing-then-passing configured-order `limit=1` regression, focused bots
    e2e (`26/26`), broader runtime/read pack (`42/42`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-27-symbol-stats-configured-limit-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-26 fix(api-bots): show canonical symbol TTP plans`
  - 2026-05-03: Closed a runtime dashboard TTP display drift. Runtime
    position reads now surface canonical symbol-level DCA/TTP/TSL display
    plans for strategy-null positions when active `BotMarketGroup` /
    `MarketGroupStrategyLink` scope resolves the selected symbol, while
    keeping `actionable` fail-closed without an executable strategy identity
    and preserving the stale legacy fallback guard. Validation PASS:
    failing-then-passing canonical strategy-null TTP regression and focused
    runtime strategy context e2e (`5/5`), broader bot runtime/read pack
    (`37/37`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-26-runtime-position-symbol-strategy-display-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-25 fix(api-markets): normalize universe symbols`
  - 2026-05-03: Closed a market-configuration source-of-truth drift. Market
    universe create/update DTOs now normalize `baseCurrency`, `whitelist`, and
    `blacklist` at the API boundary, so dashboard and bot market scopes persist
    canonical uppercase values while preserving operator-provided first
    occurrence order for symbol lists. Validation PASS:
    failing-then-passing lowercase market universe regression, focused markets
    e2e (`16/16`), API typecheck, repository guardrails, lint, and diff
    review. Evidence:
    `docs/planning/runtime-audit-25-market-universe-symbol-normalization-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-24 fix(api-orders): normalize list symbol filters`
  - 2026-05-03: Closed the sibling dashboard order read drift after
    `RUNTIME-AUDIT-23`. Order list `symbol` filters now normalize to uppercase
    at the DTO boundary, so operator/API requests such as `symbol=ethusdt`
    find owned persisted `ETHUSDT` orders instead of rendering an empty orders
    table. Validation PASS: failing-then-passing lowercase symbol filter
    regression, focused orders/positions read e2e (`21/21`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-24-order-list-symbol-normalization-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-23 fix(api-positions): normalize list symbol filters`
  - 2026-05-03: Closed a dashboard position read drift. Position list `symbol`
    filters now normalize to uppercase at the DTO boundary, so operator/API
    requests such as `symbol=ethusdt` find owned persisted `ETHUSDT` positions
    instead of rendering an empty positions table. Validation PASS:
    failing-then-passing lowercase symbol filter regression, focused positions
    list e2e, API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-23-position-list-symbol-normalization-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-22 fix(api-wallets): validate analytics date ranges`
  - 2026-05-03: Closed a TESTER-mode wallet analytics API-boundary drift.
    Wallet analytics `from` / `to` filters now fail closed when `from` is
    later than `to`, preventing invalid operator-supplied ranges from
    rendering misleading empty dashboard wallet analytics. The service now
    relies on the typed DTO filter instead of a manual cashflow source cast.
    Validation PASS: failing-then-passing inverted date-range regression,
    focused wallets e2e (`18/18`), API typecheck, repository guardrails, lint,
    and diff review. Evidence:
    `docs/planning/runtime-audit-22-wallet-analytics-date-range-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-21 fix(api-wallets): validate analytics source filters`
  - 2026-05-03: Closed a wallet analytics API-boundary drift. Wallet analytics
    `source` filters now validate against the canonical `WalletCashflowSource`
    enum at the DTO boundary, so invalid dashboard/URL filter values fail
    closed with `400` instead of reaching Prisma and returning `500`.
    Validation PASS: failing-then-passing invalid source regression, focused
    wallets e2e (`17/17`), API typecheck, repository guardrails, lint, and
    diff review. Evidence:
    `docs/planning/runtime-audit-21-wallet-analytics-source-validation-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-20 fix(api-wallets): keep filtered wallet timeline historical`
  - 2026-05-03: Closed a follow-up wallet timeline edge drift. Wallet equity
    timeline now attaches current owned-import open PnL only to the latest
    overall wallet snapshot point, not to the latest point of a filtered
    historical response. Validation PASS: failing-then-passing filtered
    timeline regression, focused wallets e2e (`16/16`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-20-wallet-timeline-filtered-open-pnl-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-19 fix(api-wallets): align latest wallet timeline open PnL`
  - 2026-05-03: Closed the next wallet preview parity drift. Wallet equity
    timeline now reuses the selected wallet open-PnL scope for the latest
    point, so owned imported `LIVE` positions with `walletId=null` are
    reflected in current `botOpenPnl` / `botPnl` consistently with wallet
    performance summary. Earlier timeline points remain historical
    snapshot/cashflow points. Validation PASS: failing-then-passing wallet
    timeline regression, focused wallets e2e (`16/16`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-19-wallet-timeline-open-pnl-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-18 fix(api-wallets): include owned imported LIVE open PnL`
  - 2026-05-03: Closed the next wallet/dashboard capital drift. Wallet
    performance summary now includes selected `LIVE` wallet imported open
    positions with `walletId=null` when their `externalId` is owned by the
    wallet API key, while excluding other API keys and leaving balance
    snapshot, cashflow, and equity timeline contracts unchanged. Validation
    PASS: failing-then-passing wallet performance regression, focused wallets
    e2e (`15/15`), API typecheck, repository guardrails, lint, and diff
    review. Evidence:
    `docs/planning/runtime-audit-18-wallet-owned-import-open-pnl-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-17 fix(api-orders): scope exchange-fill close fees by position lifecycle`
  - 2026-05-03: Closed the next TESTER close-PnL parity drift. LIVE exchange
    order-trade close confirmation now aggregates entry-leg fees by the owned
    position lifecycle (`userId + positionId + entry side`) instead of mutable
    `botId` / `walletId` projections, matching the synchronous runtime
    orchestrator close contract. Validation PASS: focused exchange-events pack
    (`6/6`), broader orders/runtime PnL pack (`75/75`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-17-exchange-fill-close-fee-scope-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-16 fix(api-bots): show selected LIVE bot legacy wallet-null open orders`
  - 2026-05-03: Closed the next dashboard open-order visibility drift. Runtime
    positions dashboard reads now include direct selected-bot `BOT_MANAGED`
    open orders with legacy `walletId=null` rows in LIVE mode, matching the
    existing selected-bot compatibility scope for positions/trades while
    keeping `botId` ownership mandatory. Validation PASS: focused runtime
    takeover e2e (`4/4`), broader runtime positions/read pack (`33/33`), API
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-16-live-open-order-wallet-null-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-15 fix(api-engine): scope close entry fees by position lifecycle`
  - 2026-05-03: Closed the next close-PnL attribution drift. Runtime close
    realized-PnL now aggregates entry-leg fees by the owned position lifecycle
    (`userId + positionId + entry side`) instead of mutable `botId` /
    `walletId` projections. Imported or recovered LIVE positions with
    `botId=null` / `walletId=null` can close through the selected bot wallet
    while still subtracting entry fees attached to the same position.
    Validation PASS: focused execution orchestrator pack (`17/17`), broader
    runtime/order/automation pack (`90/90`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-15-close-fee-position-scope-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-14 fix(api-engine): resolve owned LIVE imports for runtime EXIT lookup`
  - 2026-05-03: Closed the next LIVE close/automation lookup drift. Runtime
    execution default open-position lookup now keeps the direct scoped query
    first, then resolves selected-bot owned `EXCHANGE_SYNC` / `BOT_MANAGED`
    imported open positions through wallet-first API-key ownership proof when
    the direct LIVE lookup misses. Legacy `walletId=null` imports can now be
    found for the same bot/wallet/symbol instead of producing incorrect
    `no_open_position`, while unowned imports remain invisible. Validation
    PASS: focused orchestrator pack (`18/18`), broader runtime/orders pack
    (`111/111`), typecheck, guardrails, lint, and diff check. Evidence:
    `docs/planning/runtime-audit-14-exit-owned-import-lookup-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-13 fix(api-orders): reuse owned LIVE imports during fill lifecycle`
  - 2026-05-03: Closed the next LIVE fill lifecycle duplication drift. Filled
    selected-bot `LIVE` orders now reuse same-side deterministically owned
    `EXCHANGE_SYNC` / `BOT_MANAGED` imported open positions when no direct
    scoped position exists, including legacy `botId=null/walletId=null` rows
    after ownership proof succeeds. The filled order and order fills attach to
    the imported position, quantity and weighted entry price update through
    existing fill math, and no duplicate open position is created. Validation
    PASS: focused orders pack (`28/28`), broader orders/e2e/pre-trade/
    final-candle/defaults pack (`90/90`), typecheck, guardrails, lint, and
    diff check. Evidence:
    `docs/planning/runtime-audit-13-fill-lifecycle-owned-import-reuse-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-12 fix(api-orders): fail closed manual LIVE reverse opens against owned imports`
  - 2026-05-03: Closed the next LIVE manual command guard drift. Manual
    selected-bot `LIVE` opens now check deterministically owned
    exchange-synced `EXCHANGE_SYNC` / `BOT_MANAGED` imported open positions
    before exchange submission, including legacy imported rows persisted as
    `botId=null/walletId=null` after ownership proof succeeds. Opposite-side
    owned imports now fail closed with `OPEN_POSITION_SIDE_CONFLICT`; unowned,
    ambiguous, manual-only, or other-wallet imports remain non-blocking.
    Validation PASS: focused orders pack (`27/27`), broader
    orders/pre-trade/final-candle/defaults pack (`69/69`), typecheck,
    guardrails, lint, and diff check. Evidence:
    `docs/planning/runtime-audit-12-live-manual-reverse-owned-import-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-11 fix(api-runtime): scope final-candle external-position guard to owner bot`
  - 2026-05-03: Closed the next final-candle false-block drift.
    `EXTERNAL_POSITION_ALREADY_OPEN` runtime blocking now keys managed
    external positions by deterministic owner bot (`userId:botId:symbol`)
    instead of user-wide `userId:symbol`. Imported `botId=null` LIVE rows are
    owner-hydrated through the shared external-position ownership index, so one
    bot's exchange-synced position no longer blocks another bot's signal on the
    same symbol. Validation PASS: focused final-candle/defaults pack (`18/18`).
    Evidence:
    `docs/planning/runtime-audit-11-final-candle-owned-external-bot-scope-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-10 fix(api-engine): count owned LIVE imports in pre-trade bot caps`
  - 2026-05-03: Closed the next LIVE pre-trade exposure-count drift.
    `maxOpenPositionsPerBot` now counts direct selected-bot open positions plus
    deterministically owned LIVE `EXCHANGE_SYNC` / `BOT_MANAGED` imports for
    the same bot/wallet/API key. PAPER remains direct-bot scoped, and
    ambiguous/manual-only/unowned imports are not counted as bot exposure.
    Validation PASS: focused pre-trade pack (`24/24`). Evidence:
    `docs/planning/runtime-audit-10-pretrade-bot-open-count-owned-imports-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-09 fix(api-engine): scope pre-trade same-symbol guard to runtime bot`
  - 2026-05-03: Closed the next PAPER/LIVE false-block drift. Pre-trade
    one-position-per-symbol checks now remain user-global only when no
    `botId` is provided; runtime bot decisions with `botId` check direct
    positions for that bot and owned LIVE exchange-synced imports for that
    bot/wallet. Another bot's open same-symbol position can no longer block a
    selected PAPER/LIVE bot from opening. Validation PASS: focused pre-trade
    pack (`23/23`), broader runtime/backtest decision pack (`88/88`), and API
    typecheck. Evidence:
    `docs/planning/runtime-audit-09-pretrade-bot-scoped-symbol-uniqueness-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-08 fix(api-bots): resolve imported LIVE ownership with catalog scope`
  - 2026-05-03: Closed the next LIVE import ownership drift.
    External-position ownership proof now resolves active canonical bot market
    groups through the shared catalog-aware symbol resolver before building
    API-key+symbol ownership keys. Market-universe-backed groups with empty
    direct `symbols` but whitelist/filter catalog scope can now own and import
    all assigned exchange positions consistently with dashboard/runtime reads.
    Validation PASS: focused ownership regression (`9/9`), broader
    reconciliation/takeover pack (`41/41`), and API typecheck. Evidence:
    `docs/planning/runtime-audit-08-external-position-ownership-catalog-scope-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-07 fix(api-engine): fail closed off-scope runtime position automation`
  - 2026-05-03: Closed the next money-impacting automation/read parity drift.
    Runtime position automation now resolves an owned position's configured
    bot symbol scope from active canonical market assignment before strategy
    config loading, DCA funds checks, DCA execution, lifecycle price
    evaluation, or protection close orchestration. Stale directly owned
    positions outside the bot's active market scope are skipped with LIVE
    `PRETRADE_BLOCKED` telemetry reason
    `position_symbol_outside_configured_scope`. Validation PASS: focused
    automation/default-deps pack (`35/35`), broader close/ownership
    automation pack (`52/52`), and API typecheck. Evidence:
    `docs/planning/runtime-audit-07-position-automation-canonical-symbol-scope-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-06 fix(api-bots): fail closed off-scope dashboard position close`
  - 2026-05-03: Closed the next money-impacting command/read parity drift.
    Dashboard runtime position close now resolves selected-bot configured
    symbols from active canonical market scope before ownership claim,
    strategy/wallet backfill, or close orchestration. Stale directly owned
    positions outside the bot's active market scope return the existing
    ignored `no_open_position` result instead of being closed. Validation
    PASS: focused close command regression (`9/9`) and broader
    close/runtime/imported-position pack (`74/74`). Evidence:
    `docs/planning/runtime-audit-06-close-position-canonical-symbol-scope-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-05 fix(api-bots): keep selected-bot runtime rows canonical-symbol scoped`
  - 2026-05-03: Closed the next default dashboard row drift. Runtime trade
    history and runtime positions now apply selected-bot active canonical
    configured symbols to filtered and unfiltered reads, reusing the shared
    catalog-aware resolver. Stale persisted `Trade.botId` and `Position.botId`
    rows for off-scope symbols can no longer appear in selected-bot dashboard
    history/open positions after market reassignment. Validation PASS:
    focused runtime-scope regression (`1/1`) and broader monitoring/positions
    pack (`57/57`). Evidence:
    `docs/planning/runtime-audit-05-runtime-rows-canonical-symbol-scope-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-04 fix(api-bots): keep runtime trade history canonical-symbol scoped`
  - 2026-05-03: Closed the next selected-bot dashboard-history drift. Runtime
    trade history now resolves selected-bot configured symbols from active
    canonical `BotMarketGroup` scope through the shared catalog-aware resolver
    before honoring explicit `symbol` filters. Stale persisted `Trade.botId`
    rows for off-scope symbols can no longer appear in runtime trades or
    monitoring aggregate history after market reassignment. Validation PASS:
    focused runtime-scope regression (`1/1`) and broader monitoring pack
    (`45/45`). Evidence:
    `docs/planning/runtime-audit-04-runtime-trades-canonical-symbol-scope-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-03 fix(api-bots): fail closed canonical update scope and symbol-filter pagination`
  - 2026-05-03: Closed the next residual selected-bot topology drift. Bot
    update defaults now treat canonical market-group scope with no enabled
    strategy links as non-actionable instead of selecting disabled links or
    direct legacy `Bot.strategyId`. Runtime symbol-stats now validates
    explicit `symbol` filters against the full configured selected-bot symbol
    scope before applying `limit`, so later configured symbols such as ETH do
    not disappear when `limit=1`. Validation PASS: focused
    helper/reconciliation pack (`31/31`), focused monitoring filter e2e
    (`1/1`), and broader bot/runtime/position pack (`68/68`). Evidence:
    `docs/planning/runtime-audit-03-canonical-update-and-symbol-filter-scope-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-01 fix(api-runtime): align LIVE open-position counts with wallet-first ownership proof`
  - 2026-05-03: Closed the first confirmed code drift found during the
    operator-requested runtime audit. Runtime signal-loop open-position
    counting now uses `wallet.apiKeyId` before legacy `Bot.apiKeyId`, matching
    imported-position ownership proof. Validation PASS: focused
    runtime/defaults and ownership tests (`13/13`), runtime
    final-candle/live-reconciliation/dynamic-stop pack (`75/75`), paper-live
    equivalence (`2/2`), API typecheck, repository guardrails, and docs parity.
    Evidence:
    `docs/planning/live-paper-runtime-prod-audit-wallet-first-count-task-2026-05-03.md`.
- [x] `POSDRIFT-06 fix(api-runtime): keep runtime signal-loop venue on shared canonical resolver`
  - 2026-05-03: Closed the next architecture drift in the PAPER/LIVE open
    pipeline. Runtime signal-loop inherited execution context now uses the
    shared canonical runtime venue resolver, fails closed on multiple
    canonical venues in raw topology, and preserves direct `Bot.symbolGroup`
    only as shared legacy fallback. Validation PASS: focused runtime
    signal-loop defaults test (`6/6`). Evidence:
    `docs/planning/posdrift-06-runtime-signal-loop-canonical-venue-task-2026-05-03.md`.
- [x] `POSDRIFT-07 fix(api-bots): keep active LIVE overlap guard canonical-market scoped`
  - 2026-05-03: Closed the next confirmed LIVE market-assignment safety drift.
    Active LIVE bot create/update validation now checks other active LIVE bots
    through active canonical `BotMarketGroup.symbolGroup` symbols before
    falling back to direct legacy `Bot.symbolGroup`. Stale direct projections
    can no longer allow shared symbols in real assigned canonical market
    scope. Validation PASS: focused duplicate guard e2e (`5/5`). Evidence:
    `docs/planning/posdrift-07-live-overlap-canonical-market-scope-task-2026-05-03.md`.
- [x] `POSDRIFT-08 fix(api-bots): keep wallet update validation canonical-market scoped`
  - 2026-05-03: Closed the next confirmed wallet/market write safety drift.
    Existing-bot wallet update validation now checks target wallets against
    active canonical `BotMarketGroup.symbolGroup.marketUniverse` scope before
    falling back to direct legacy `Bot.symbolGroup`. Stale direct projections
    can no longer allow a wallet venue mismatch against the bot's real assigned
    market group. Validation PASS: focused bot context validation test (`2/2`).
    Evidence:
    `docs/planning/posdrift-08-wallet-update-canonical-market-scope-task-2026-05-03.md`.
- [x] `POSDRIFT-09 fix(api-orders): keep manual-order context venue canonical`
  - 2026-05-03: Closed the next confirmed dashboard/manual-order drift.
    Manual-order context now resolves venue from active canonical
    `BotMarketGroup.symbolGroup.marketUniverse` before duplicated bot
    `exchange/marketType`, and uses that venue for connector selection,
    exchange metadata fallback, leverage, and margin-mode semantics. Validation
    PASS: focused manual-order context tests (`5` tests). Evidence:
    `docs/planning/posdrift-09-manual-context-canonical-venue-task-2026-05-03.md`.
- [x] `POSDRIFT-10 fix(api-orders): fail closed for manual-order multi-strategy ambiguity`
  - 2026-05-03: Closed the TESTER edge-case for LIVE manual opens.
    Manual-order strategy context now resolves a canonical strategy only when
    exactly one enabled strategy link matches the requested symbol. Matching
    canonical groups with multiple enabled strategies remain unresolved, so
    LIVE manual open fails closed instead of silently selecting the first link.
    Validation PASS: focused LIVE ambiguous manual-order regression. Evidence:
    `docs/planning/posdrift-10-manual-order-multistrategy-ambiguity-task-2026-05-03.md`.
- [x] `POSDRIFT-11 fix(api-positions): keep legacy open-position repair canonical-market scoped`
  - 2026-05-03: Closed the next confirmed position-management drift. Local
    repair of open `BOT` / `USER` positions without `botId` now uses active
    canonical `BotMarketGroup.symbolGroup` and enabled
    `MarketGroupStrategyLink` rows before direct legacy bot projections. Stale
    direct market/strategy fields can no longer claim or mislabel repaired
    orphan rows when canonical groups exist. Validation PASS: focused position
    repair regression (`1/1`). Evidence:
    `docs/planning/posdrift-11-legacy-position-repair-canonical-scope-task-2026-05-03.md`.
- [x] `DASHDRIFT-02 fix(web-dashboard): keep position edit strategy display runtime-graph scoped`
  - 2026-05-03: Closed the next dashboard display drift. The position edit
    modal in `HomeLiveWidgets` now resolves strategy labels from selected bot
    `runtime-graph` market groups and strategy links before direct legacy
    `Bot.strategy`. Stale direct bot strategy projections can no longer
    override canonical runtime strategy display in that position-management
    modal. Validation PASS: focused HomeLiveWidgets regression (`18/18`).
    Evidence:
    `docs/planning/dashdrift-02-position-edit-strategy-display-task-2026-05-03.md`.
- [x] `BOTDRIFT-01 fix(api-bots): keep bot list/get projection canonical-context scoped`
  - 2026-05-03: Closed the next upstream dashboard/runtime drift. `GET
    /dashboard/bots` and `GET /dashboard/bots/:id` now overlay canonical
    primary `BotMarketGroup` / `MarketGroupStrategyLink` context onto response
    `strategyId`, `strategy`, `symbolGroupId`, and `symbolGroup` before direct
    legacy bot projections. Stale direct `Bot.strategyId` can no longer feed
    dashboard and bot-management read models when canonical topology exists.
    Validation PASS: bot runtime-scope e2e (`10/10`) and wider bot pack
    (`41/41`). Evidence:
    `docs/planning/botdrift-01-bot-read-projection-canonical-context-task-2026-05-03.md`.
- [x] `BOTDRIFT-02 fix(api-bots): keep bot update safety guards canonical-context scoped`
  - 2026-05-03: Closed the next bot-management safety drift. Bot
    activation/update duplicate guard and LIVE overlap guard now derive default
    target strategy/market scope from active canonical `BotMarketGroup` and
    enabled `MarketGroupStrategyLink` rows before direct legacy bot fields.
    Stale direct `Bot.strategyId` / `Bot.symbolGroupId` can no longer let
    update activation bypass canonical duplicate checks. Validation PASS:
    focused duplicate guard (`6/6`) and wider bot write/runtime pack (`43/43`).
    Evidence:
    `docs/planning/botdrift-02-bot-update-canonical-guard-task-2026-05-03.md`.
- [x] `POSDRIFT-12 fix(api-positions): keep LIVE reconciliation continuity strategy canonical`
  - 2026-05-03: Closed the TESTER continuity edge. LIVE exchange
    reconciliation now resolves recovered/imported bot continuity strategy
    through active canonical `BotMarketGroup` and enabled
    `MarketGroupStrategyLink` rows before direct legacy `Bot.strategyId`.
    Stale direct strategy projection can no longer label imported/recovered
    LIVE exchange-synced rows when canonical topology exists. Validation PASS:
    focused reconciliation test (`23/23`) and wider
    position/reconciliation/automation pack (`29/29`). Evidence:
    `docs/planning/posdrift-12-live-continuity-canonical-strategy-task-2026-05-03.md`.
- [x] `DASHDRIFT-03 fix(api-bots): keep dynamic-stop column visibility canonical-context scoped`
  - 2026-05-03: Closed the next dashboard runtime display drift. Runtime
    position payload `showDynamicStopColumns` now evaluates active canonical
    `BotMarketGroup` / `MarketGroupStrategyLink` strategy configs when
    present and uses legacy `BotStrategy` rows only as compatibility fallback.
    Stale legacy advanced-close rows can no longer turn on TTP/TSL columns for
    a canonical basic-close selected-bot view. Validation PASS: focused
    runtime strategy-context e2e (`3/3`) and broader bot runtime/dynamic-stop
    pack (`31/31`). Evidence:
    `docs/planning/dashdrift-03-dynamic-stop-columns-canonical-task-2026-05-03.md`.
- [x] `DASHDRIFT-04 fix(api-bots): keep symbol-level dynamic-stop plans canonical-context scoped`
  - 2026-05-03: Closed the next dashboard runtime row-data drift. Runtime
    TTP/TSL plan maps by symbol now keep active canonical `BotMarketGroup` /
    `MarketGroupStrategyLink` entries authoritative and let legacy
    `BotStrategy` rows fill only symbols without canonical entries. Stale
    legacy advanced-close rows can no longer overwrite canonical basic-close
    symbol plans. Validation PASS: focused runtime strategy-context e2e
    (`4/4`) and broader bot runtime/dynamic-stop pack (`40/40`). Evidence:
    `docs/planning/dashdrift-04-symbol-dynamic-stop-plans-canonical-task-2026-05-03.md`.
- [x] `DASHDRIFT-05 fix(api-bots): keep runtime symbol-stats symbol filters canonical-scope locked`
  - 2026-05-03: Closed the next selected-bot signal/market stats drift.
    Explicit `symbol` filters on runtime symbol-stats now intersect with the
    selected bot's active canonical configured symbols and return an empty
    zero-summary response when the requested symbol is outside scope. Stale
    persisted stats for old/off-scope markets can no longer appear through
    direct symbol queries. Validation PASS: focused runtime-scope e2e
    (`10/10`) and broader symbol-stats/market-universe/PnL pack (`25/25`).
    Evidence:
    `docs/planning/dashdrift-05-symbol-stats-filter-canonical-scope-task-2026-05-03.md`.
- [x] `RUNTIME-AUDIT-02 fix(api-runtime): fail closed empty canonical strategy-link topology`
  - 2026-05-03: Closed the next execution/display topology drift. Runtime
    signal-loop topology and symbol-stats configured context now use direct
    legacy `Bot.strategyId` only when no active canonical market group exists.
    If an active canonical `BotMarketGroup` exists with no enabled
    `MarketGroupStrategyLink` rows, runtime context is non-actionable and
    dashboard configured strategy context remains empty. Validation PASS:
    focused defaults/symbol-stats tests (`11/11`) and broader
    runtime/symbol-stats pack (`78/78`). Evidence:
    `docs/planning/runtime-audit-02-empty-canonical-strategy-links-task-2026-05-03.md`.
- [x] `ORDDRIFT-01 fix(api-orders): block direct fallback when canonical manual scope exists`
  - 2026-05-03: Closed the next manual-order strategy-context drift.
    Manual-order strategy context now evaluates active canonical groups first
    and blocks direct/legacy strategy fallback whenever such groups exist but
    do not resolve the requested symbol. Stale direct bot strategy projections
    can no longer alter manual-order preview leverage, margin mode, or order
    type after canonical market reassignment. Validation PASS: focused orders
    service test (`26/26`) and broader orders/manual pack (`49/49`). Evidence:
    `docs/planning/orddrift-01-manual-context-canonical-group-no-direct-fallback-task-2026-05-03.md`.
- [ ] `LIVEIMPORT-03 release(prod): read back imported ETH/DOGE provenance on current production`
  - Scope: use authenticated read-only dashboard/API evidence on current
    production build-info
    `30b027b78544f76b5b638851e8e27c98f6d22ab5` for the reported LIVE ETH/DOGE rows:
    ownership, `strategyId` or single-strategy provenance recovery, TTP
    visibility, actionable state, and import completeness across assigned bot
    markets. Do not promote stale candidate `39146d2e`; `LIVEIMPORT-03A`
    confirmed it is not a valid production promotion candidate. 2026-05-09
    refresh: current production build-info is `30b027b7`, public/no-secret
    checks pass, and the collector command in the protected operator handoff
    targets that SHA. Validation still required: authenticated runtime
    positions readback and redacted evidence.
- [x] `PAPERSIGNAL-01 fix(api-runtime): audit PAPER signal display-to-execution parity`
  - 2026-05-03: Closed the first confirmed drift. Runtime symbol-stats read
    models now prefer active canonical `BotMarketGroup` and enabled
    `MarketGroupStrategyLink` context over legacy bot projections, matching the
    topology used by PAPER/LIVE final-candle execution. Validation PASS:
    focused symbol-stats/final-candle/paper-live pack (`18/18`), bot runtime
    scope/market-universe/dynamic-stop/runtime-loop pack (`60/60`), and API
    typecheck. Evidence:
    `docs/planning/papersignal-01-canonical-symbol-stats-parity-task-2026-05-03.md`.
- [x] `WALLETBAL-01 fix(api-runtime): stabilize LIVE wallet account-balance cache display semantics`
  - 2026-05-03: Closed the confirmed dashboard wallet account-balance drift.
    Runtime LIVE balance cache now stores raw exchange `accountBalance`
    separately from allocated `referenceBalance`, so cache hits no longer show
    FIXED/PERCENT allocation values as account balance while preserving
    `freeCash` from allocated trading capital. Validation PASS: focused
    runtime capital test (`15/15`), monitoring aggregate plus wallet e2e tests
    (`19/19`), API typecheck, repository guardrails, and docs parity. Evidence:
    `docs/planning/walletbal-01-live-account-balance-cache-task-2026-05-03.md`.
- [ ] `BOTMULTI-09 release(prod): promote multi-strategy runtime topology to production`
  - 2026-05-03: Release task opened after operator request. Confirmed API
    redeploy runs migrations automatically through
    `scripts/start-with-migrate.mjs` when `API_AUTO_MIGRATE` is not `false`.
    Local pre-release build, guardrails, and docs parity PASS. Candidate
    `f3aaa3dca6cf4d4b199372563886165638391a77` is committed and pushed to
    `origin/main`. 2026-05-09 refresh: current production build-info now
    reports `30b027b78544f76b5b638851e8e27c98f6d22ab5`, which contains
    `f3aaa3dca6cf4d4b199372563886165638391a77`; the old public build-info
    blocker remains resolved. Remaining blocker: authenticated/protected
    runtime readback and broader V1 release gate evidence are still required.
    Evidence:
    `docs/planning/botmulti-09-production-deploy-task-2026-05-03.md` and
    `docs/planning/botmulti-09-current-production-containment-task-2026-05-09.md`.

- [x] `OPEN-PROTECTED-BACKLOG-55469CDC-SYNC-2026-05-09 release: sync open protected backlog target`
  - 2026-05-09: Synced open protected backlog entries for
    `V1-PROTECTED-ACCESS-READINESS`, `LIVEIMPORT-03`, and `BOTMULTI-09` to
    current production build-info `55469cdc2ad888b822c8cdbd86660c4ed5166e1c`.
    This does not close any protected evidence; it only prevents future runs
    from targeting stale `4ee1672e` after production advanced. Evidence:
    `docs/planning/open-protected-backlog-55469cdc-sync-task-2026-05-09.md`.
- [x] `BOTMULTI-08 qa(closure): run architecture-to-runtime closure pack and publish evidence`
  - 2026-05-03: Closed with
    `docs/planning/botmulti-08-architecture-runtime-closure-task-2026-05-03.md`.
    Closure validation PASS across focused API/runtime/lifecycle/web tests,
    API/web typecheck, route-reachable i18n audit, docs parity, and repository
    guardrails.
- [x] `BOTMULTI-07 web(ui+operator): expose multi-strategy bot management and runtime truth`
  - 2026-05-03: Closed with
    `docs/planning/botmulti-07-web-operator-multi-strategy-truth-task-2026-05-03.md`.
    Bot create/edit now exposes primary plus additional enabled strategies,
    submits ordered canonical `strategies[]`, and prefills edit mode from
    canonical runtime graph links.
- [x] `BOTMULTI-06 runtime(risk+lifecycle): align DCA/TTP/SL/TSL and ownership across multiple strategies`
  - 2026-05-03: Closed with
    `docs/planning/botmulti-06-runtime-risk-lifecycle-ownership-task-2026-05-03.md`.
    Runtime position automation now fails closed when a bot-managed position
    lacks `position.strategyId` while multiple enabled canonical strategy
    links exist, reusing existing skip telemetry and preventing fallback
    DCA/TTP/SL/TSL execution on ambiguous ownership.
- [x] `BOTMULTI-05 runtime(signal-merge): execute deterministic multi-strategy evaluation per bot`
  - 2026-05-03: Closed with
    `docs/planning/botmulti-05-runtime-signal-merge-task-2026-05-03.md`.
    Runtime topology now reads enabled canonical strategy links under the one
    active market group, final-candle decision evaluates all interval-eligible
    strategies, and the existing merge helper resolves votes with link
    priority/weight and winner provenance.
- [x] `BOTMULTI-04 api(write): support bot create/update with multiple strategies`
  - 2026-05-03: Closed with
    `docs/planning/botmulti-04-api-write-multi-strategy-task-2026-05-03.md`.
    Create/update now accepts optional ordered `strategies` payloads and
    persists multiple canonical `MarketGroupStrategyLink` rows under one active
    `BotMarketGroup`.
- [x] `BOTMULTI-03 db(schema): finalize canonical multi-strategy topology and migration path`
  - 2026-05-03: Closed with
    `docs/planning/botmulti-03-canonical-topology-migration-task-2026-05-03.md`.
    Added migration
    `20260503013000_enforce_single_active_bot_market_group` with fail-closed
    duplicate-active-scope preflight and partial unique index
    `BotMarketGroup_one_active_scope_per_bot_idx`.
- [x] `BOTMULTI-02 audit(data+runtime): inventory legacy compatibility remnants and migration debt`
  - 2026-05-03: Closed with
    `docs/planning/botmulti-02-legacy-compatibility-migration-audit-task-2026-05-03.md`.
    User selected lower numeric priority as canonical; architecture reference
    and focused runtime merge regression now lock that semantics.
- [x] `BOTMULTI-01 docs(decision): freeze post-V1 multi-strategy bot contract`
  - 2026-05-03: Closed with
    `docs/planning/botmulti-01-post-v1-multi-strategy-contract-task-2026-05-03.md`.
    Architecture now freezes the post-V1 target as one bot with one wallet, one
    active symbol-group market scope, and an ordered enabled strategy set.
    Manual-order ambiguity must fail closed, runtime merge must preserve
    primary strategy provenance, and DCA/TTP/SL/TSL ownership remains
    position-scoped. Validation PASS: repository guardrails.
- [x] `SYSFINAL-09 release(closure): execute fixes regression production smoke and closure`
  - 2026-05-03: Next executable slice from
    `docs/planning/system-functionality-final-remediation-master-plan-2026-05-03.md`.
    No `SYSFIX-*` implementation tasks were produced by `SYSFINAL-02..08`, so
    this closure slice should run final local regression/guardrail checks and
    publish final closure or explicitly classify unavailable production smoke
    evidence.
  - 2026-05-03: Closed with
    `docs/planning/sysfinal-09-final-regression-production-smoke-closure-task-2026-05-03.md`.
    Validation PASS: guardrails, docs parity, lint, typecheck, full API tests,
    full web tests (`141` files / `399` tests), build, and public production
    smoke for API health/readiness, web root, login page, web build-info, and
    protected API unauthenticated fail-closed behavior. Authenticated
    production dashboard/runtime smoke remains unavailable without credentials.
- [x] `SYSFINAL-08 planning(fixes): convert findings into tiny SYSFIX tasks`
  - 2026-05-03: Next executable slice from
    `docs/planning/system-functionality-final-remediation-master-plan-2026-05-03.md`.
    Convert confirmed findings from `SYSFINAL-02..07` into scoped `SYSFIX-*`
    tasks with reproduction, expected behavior, affected files, validation,
    deployment impact, rollback path, and acceptance criteria. If the audit
    found no defects, publish explicit empty fix-queue closure evidence.
  - 2026-05-03: Closed with
    `docs/planning/sysfinal-08-empty-sysfix-queue-task-2026-05-03.md`.
    Review of `SYSFINAL-02..07` found no confirmed discrepancies requiring
    implementation. Current `SYSFIX-*` queue is intentionally empty.
- [x] `SYSFINAL-07 qa(product): audit backtests reports logs i18n and UX states`
  - 2026-05-03: Next executable slice from
    `docs/planning/system-functionality-final-remediation-master-plan-2026-05-03.md`.
    Audit backtest create/list/detail for SPOT and FUTURES, reports and parity
    diagnostics states, logs/audit filtering, route-reachable i18n, and key
    dashboard responsive/accessibility state coverage.
  - 2026-05-03: Closed with
    `docs/planning/sysfinal-07-backtests-reports-logs-i18n-ux-audit-task-2026-05-03.md`.
    Validation PASS: API backtest/report pack (`13` files / `94` tests), DB
    backtest/logs e2e pack (`2` files / `17` tests), web product/UX/i18n/
    a11y/responsive pack (`12` files / `33` tests), route-reachable i18n audit
    (`0` findings), and repository guardrails. No `SYSFIX-*` task required.
- [x] `SYSFINAL-06 qa(config): audit wallets markets strategies and bot setup`
  - 2026-05-03: Next executable slice from
    `docs/planning/system-functionality-final-remediation-master-plan-2026-05-03.md`.
    Audit wallet create/edit/API-key attach/test constraints, market universe
    and symbol-group create/edit/delete guards, strategy create/edit indicator
    metadata and validation, and bot create/edit/start/stop canonical
    wallet-first market/strategy runtime scope.
  - 2026-05-03: Closed with
    `docs/planning/sysfinal-06-configuration-workflows-audit-task-2026-05-03.md`.
    Validation PASS: API config pack (`16` files / `130` tests), web config
    pack (`11` files / `52` tests), and repository guardrails. No `SYSFIX-*`
    task required.
- [x] `SYSFINAL-05 qa(trading): audit order and position workflows`
  - 2026-05-03: Next executable slice from
    `docs/planning/system-functionality-final-remediation-master-plan-2026-05-03.md`.
    Audit PAPER manual market order open/fill/position visibility, PAPER
    runtime signal path through pre-trade/order/position/history, manual close,
    bot close, cancel order, history attribution, LIVE read-only imported
    position ownership/protection state, and visible guardrail explanations.
  - 2026-05-03: Closed with
    `docs/planning/sysfinal-05-order-position-workflows-audit-task-2026-05-03.md`.
    Validation PASS: lifecycle/pre-trade pack (`14` files / `116` tests),
    sequential DB order/position e2e pack (`7` files / `42` tests), focused
    web trading workflow pack (`8` files / `24` tests), and repository
    guardrails. No `SYSFIX-*` task required.
- [x] `SYSFINAL-04 qa(runtime): audit dashboard and bot runtime truth end to end`
  - 2026-05-03: Next executable slice from
    `docs/planning/system-functionality-final-remediation-master-plan-2026-05-03.md`.
    Audit Dashboard Home and Bot Monitoring against selected bot runtime truth:
    sessions, symbol stats, positions, history, signal cards, indicator value
    display, guardrail-blocked outcomes, Redis market-stream readiness, and
    PAPER/read-only LIVE runtime rows. Any confirmed discrepancy becomes a
    scoped `SYSFIX-*` task.
  - 2026-05-03: Closed with
    `docs/planning/sysfinal-04-dashboard-bot-runtime-truth-audit-task-2026-05-03.md`.
    Validation PASS: focused API runtime/readiness pack (`14` files / `113`
    tests), sequential DB runtime e2e pack (`7` files / `33` tests), focused
    web runtime pack (`14` files / `59` tests), and repository guardrails. No
    `SYSFIX-*` task required.
- [x] `SYSFINAL-03 qa(security): audit auth session security and permissions`
  - 2026-05-03: Next executable slice from
    `docs/planning/system-functionality-final-remediation-master-plan-2026-05-03.md`.
    Audit login/logout, failed login, expired/invalid session, protected route
    redirect, cross-user ownership denial, API-key masking/encryption behavior,
    connection-test error states, and LIVE write entitlement/consent fail-closed
    behavior. Any confirmed discrepancy becomes a scoped `SYSFIX-*` task.
  - 2026-05-03: Closed with
    `docs/planning/sysfinal-03-auth-session-security-audit-task-2026-05-03.md`.
    Validation PASS: focused API security pack (`14` files / `75` tests),
    focused web auth/profile/admin pack (`8` files / `28` tests),
    `pnpm audit`, and repository guardrails. No `SYSFIX-*` task required.
- [x] `SYSFINAL-02 qa(repo): run repository baseline gates and classify failures`
  - 2026-05-03: Next executable slice from
    `docs/planning/system-functionality-final-remediation-master-plan-2026-05-03.md`.
    Run repository guardrails, docs parity if required, lint, typecheck, full
    API/web tests, and build. Classify every failure before any fix starts;
    confirmed product failures become scoped `SYSFIX-*` tasks.
  - 2026-05-03: Closed with
    `docs/planning/sysfinal-02-repository-baseline-gates-task-2026-05-03.md`.
    Validation PASS: repository guardrails, docs parity, lint, API+web
    typecheck, full API tests, full web tests (`141` files / `399` tests), and
    workspace build. No `SYSFIX-*` task required from the baseline.
- [x] `SYSFINAL-01 qa(planning): build current route API function inventory`
  - 2026-05-03: Next executable slice from
    `docs/planning/system-functionality-final-remediation-master-plan-2026-05-03.md`.
    Build the current user-facing function inventory and route/API matrix
    before running browser/API audits. Output must map every current route and
    major user function to its backend contract, data source, UI states, auth
    boundary, validation method, and explicit V2/deferred exclusions.
  - 2026-05-03: Closed with
    `docs/planning/sysfinal-01-current-function-inventory-task-2026-05-03.md`.
    The artifact maps current web routes and API families to backend owners,
    data sources, expected UI states, auth boundaries, validation methods,
    redirect-only compatibility routes, and explicit V2/deferred exclusions.
    Validation PASS: repository guardrails.
- [x] `SYSFINAL-00 docs(planning): synchronize active planning truth before final function audit`
  - 2026-05-03: Start the consolidated final system functionality remediation
    plan in
    `docs/planning/system-functionality-final-remediation-master-plan-2026-05-03.md`.
    First slice: reconcile stale active/open-looking queue entries against
    current production evidence, especially `RUNTIME-SIGNAL-VOTES-01`,
    duplicate/historical `V1BOT-SIGNALS-02`, `V1FINAL-01`, and
    `V1EXCEL-*` entries. Keep stage deferred to V2 and keep `BOTMULTI-*` in
    deferred pipeline until the current V1 production system is fully
    re-audited. Validation: repository guardrails.
  - 2026-05-03: Closed by synchronizing current queue truth. Runtime signal
    recovery is production-smoked and no longer waiting for deploy evidence;
    duplicate `V1BOT-SIGNALS-02` and older `V1FINAL/V1EXCEL` carryover entries
    are preserved only as historical/superseded context; `BOTMULTI-*` remains
    deferred pipeline.
- [x] `ETHDCA-01 fix(api-runtime): preserve LIVE DCA-first gating for trailing-stop close decisions`
  - 2026-05-02: Closed the operator-reported ETHUSDT DCA-first protection
    hardening slice. Runtime position automation now hydrates durable DCA
    progress from persisted `Trade` lifecycle rows before protection close
    evaluation, including current-position rows and same
    bot/wallet/strategy/symbol replacement lifecycles cut off by the latest
    opposite-side close. Volatile runtime state loss or exchange-sync rebase
    can no longer undercount executed adds when a pending affordable DCA level
    should still block `TSL` / `SL`. Runtime position serialization now
    renders finite negative trailing-loss `TSL` state instead of hiding an
    armed loss-side stop. Validation PASS: focused runtime automation and position
    serialization tests (`38/38`), API typecheck, API build, and repository
    guardrails.
    Evidence:
    `docs/planning/ethdca-01-live-dca-first-tsl-hardening-task-2026-05-02.md`.
- [x] `LIVEIMPORT-02 fix(api-runtime): recover single-strategy provenance for imported LIVE protection`
  - 2026-05-03: Closed the operator-reported follow-up where owned
    `EXCHANGE_SYNC` LIVE positions could still lack `strategyId`, leaving TTP
    invisible or inactive for imported ETH/DOGE rows. Runtime automation and
    runtime positions read models now use the bot's single enabled canonical
    strategy link only when unambiguous; multi-strategy missing provenance
    remains fail-closed. Validation PASS: focused runtime automation tests
    (`33/33`), focused dynamic-stop operator truth e2e (`2/2`), API
    typecheck, and repository guardrails. Evidence:
    `docs/planning/live-import-single-strategy-provenance-task-2026-05-03.md`.
- [x] `RUNTIME-SIGNAL-VOTES-01 fix(api-runtime): recover runtime strategy votes when matched indicators exist`
  - 2026-05-02: Implementation is verified and production-smoked
    for the production-reported runtime signal-vote drift where dashboard rows
    could show recovered `matched=true` RSI conditions while final-candle
    runtime evaluation still merged `No votes` from a short in-memory candle
    series. The engine now owns shared runtime/fallback candle merging,
    `RuntimeSignalLoop` recovers an indicator-ready series before final-candle
    strategy evaluation, and the dashboard/read-model path reuses the same
    merge helper. Runtime candles remain authoritative on overlap, and no
    pre-trade, wallet, max-position, exchange-min-order, or orchestrator
    guardrail was bypassed. Stale no-vote decisions no longer donate their
    `No votes` reason to recovered configured snapshots. A follow-up
    guardrail-visibility patch now includes latest `PRETRADE_BLOCKED` events
    in symbol-stats so matched conditions stopped by runtime guardrails show a
    concrete block reason instead of degrading to configured fallback.
    Validation PASS: focused runtime/read-model tests (`4` files / `56`
    tests), focused blocked-decision read-model tests (`2` files / `8`
    tests), API typecheck, API build, and repository guardrails. Post-deploy
    production smoke confirmed API freshness on
    `26962ea1dbb0981d3885779d01e58485d7e9fd6c`, `/health=ok`,
    `/ready=ready`, active session `RUNNING`, concrete runtime block reasons
    for matched rows, and no unexplained `matched=true` + `No votes`
    contradiction for guardrail-blocked symbols. Evidence:
    `docs/planning/runtime-signal-vote-recovery-audit-plan-2026-05-02.md`.
- [x] `DASHSIGNALS-02 fix(api-runtime): recover indicator candles before unavailable signal values`
  - 2026-05-02: Closed the deeper follow-up from `DASHSIGNALS-01`. Runtime
    symbol stats now tops up short in-memory candle histories from the approved
    fallback kline path before running shared indicator analysis, then
    deduplicates fallback/runtime candles by `openTime` with runtime candles
    authoritative on overlap. This keeps `n/a` as a final fail-closed display
    state only when recovery still cannot produce a valid indicator value. No
    trading execution behavior changed. Validation PASS: focused backend
    signal recovery/read-model tests (`7/7`), API typecheck, repository
    guardrails, and API build. Production readback after deploy confirmed no
    raw `n/a`, no pending indicator labels, and concrete visible `RSI(14)`
    values for active dashboard signal cards. Evidence:
    `docs/planning/dashsignals-02-indicator-recovery-before-unavailable-task-2026-05-02.md`.
- [x] `DASHSIGNALS-01 fix(runtime+web): clarify unavailable indicator signal values`
  - 2026-05-02: Closed the operator-reported production dashboard signal-card
    inconsistency where unavailable RSI values rendered as `n/a < 20` and
    `n/a > 80`. Runtime condition analysis now marks unavailable operands as
    unknown display truth, the read model prefers concrete snapshot condition
    values when latest-decision lines only contain unavailable values, and
    Dashboard Home / Bot Monitoring show localized pending-data text while
    keeping thresholds visible. No trading execution behavior changed.
    Validation PASS: focused API signal/read-model tests (`5/5`), focused web
    dashboard/bot signal tests (`32/32`), API typecheck, web typecheck,
    repository guardrails, lint, route-reachable i18n audit, API build, and
    web build. Evidence:
    `docs/planning/dashsignals-01-indicator-value-pending-display-task-2026-05-02.md`.
- [x] `DASHDISPLAY-01 fix(web-dashboard): repair production dashboard display polish`
  - 2026-05-02: Closed authenticated production dashboard display follow-up.
    Fixed the Manual Order `Min qty`/`Qty slider` visual collision, kept long
    runtime History/trade pills on one line, and removed the hidden
    `__dashboard-spacer__` placeholder from rendered DOM text. No API,
    runtime, persistence, or trading behavior changed. Validation PASS:
    focused web dashboard/title pack (`29/29`), web typecheck, repository
    guardrails, and web build. Evidence:
    `docs/planning/dashdisplay-01-prod-dashboard-display-polish-task-2026-05-02.md`.
- [x] `AWESOME-FIX-01 test(api-positions): isolate imported position history hydrator fixtures`
  - 2026-05-02: Closed the first follow-up from the completed post-V1 quality
    audit. Fixed the cleanup/fixture isolation gap in
    `apps/api/src/modules/positions/importedPositionHistoryHydrator.service.test.ts`
    so it passes when run alone on a non-empty local DB. Validation PASS:
    affected file (`6` tests), adjacent focused API slices (`58` tests across
    `7` files), full API suite, API typecheck, and guardrails.
- [x] `AWESOME-01 qa(product): execute full post-V1 quality audit program`
  - 2026-05-02: Completed with
    `docs/operations/awesome-audit-execution-report-2026-05-02.md`. Result:
    no user-facing product/runtime/security/production public-smoke blocker
    found. The one QA reliability follow-up is now closed in `AWESOME-FIX-01`.
- 2026-05-02 audit remediation status: full V1 closeout audit found confirmed
  P0 API/runtime failures, docs parity drift, release-gate evidence blockers,
  and RC signoff/checklist disagreement. Canonical remediation packet:
  `docs/planning/v1closeout-audit-remediation-plan-2026-05-02.md`.
- [x] `V1CLOSEOUT-01 fix(api-wallets/bots): resolve LIVE external management ownership persistence`
  - Scope: reconcile the failing LIVE wallet `manageExternalPositions`
    assertion with the current singular-bot architecture, especially the
    `V1TAKE-10` decision that moved imported-position management authority
    from wallet to bot. Fix the contract or stale test without duplicating
    ownership. Validation: focused wallets e2e, related takeover/runtime tests
    if semantics change, API typecheck.
- [x] `V1CLOSEOUT-02 fix(api-engine/backtests): restore advanced TSL close parity`
  - Scope: repair the `advanced-tsl` lifecycle parity failure where backtest
    returns no close reason while the golden contract expects
    `trailing_stop`. Reuse shared lifecycle logic; no backtest-only workaround.
    Validation: lifecycle close parity golden test, focused replay/runtime
    lifecycle tests, API typecheck.
- [x] `V1CLOSEOUT-03 fix(api-bots-runtime): repair monitoring trades and dynamic TSL serialization`
  - Scope: restore deterministic runtime monitoring totals, symbol filters,
    and pre-arm TSL truth in `bots.e2e.test.ts`. Dynamic TSL stop values must
    remain `null` until the runtime trailing state is actually armed.
    Validation: focused bots e2e and API typecheck.
- [x] `V1CLOSEOUT-04 fix(api-orders/positions): restore exchange-synced LIVE visibility and close flow`
  - Scope: fix selected-bot LIVE runtime truth for manual LIVE MARKET
    adoption, `EXCHANGE_SYNC BOT_MANAGED` visibility when PAPER shares the
    symbol, dashboard close returning `closed`, and deterministic fixture setup
    in `orders-positions.e2e.test.ts`. Validation: focused orders/positions
    e2e, related runtime/takeover tests, API typecheck.
- [x] `V1CLOSEOUT-05 fix(api-positions): restore orphan repair canonical rebinding`
  - Scope: make orphan repair re-import exchange truth with deterministic
    `botId` and `walletId` when evidence is sufficient, while preserving
    fail-closed behavior for ambiguous ownership. Validation: focused orphan
    repair e2e, related restart continuity tests if touched, API typecheck.
- [x] `V1CLOSEOUT-06 qa(api): restore full API suite green after closeout fixes`
  - 2026-05-02: Closed with `pnpm --filter api run typecheck` PASS, focused
    API closeout pack PASS (`8` files / `91` tests), and
    `pnpm --filter api run test -- --run` PASS.
- [x] `V1CLOSEOUT-07 fix(docs): repair docs parity route-map path drift`
  - 2026-05-02: Closed by pointing docs parity at
    `docs/architecture/reference/dashboard-route-map.md` and publishing the
    missing `web-shared` module inventory/deep-dive entry. Validation:
    `pnpm run docs:parity:check` PASS and `pnpm run quality:guardrails` PASS.
- [x] `V1CLOSEOUT-08 release(ops): resolve RC signoff and release-gate evidence drift`
  - 2026-05-02: Closed truth-sync scope. RC external-gate status and checklist
    now agree with blocked signoff truth: `G1=PASS`, `G2=PASS`, `G3=PASS`,
    `G4=OPEN`. Strict evidence check still fails intentionally because
    Engineering/Product/Operations/RC-owner names are missing and Gate 4 is not
    approved.
- [x] `V1CLOSEOUT-09 release(ops): refresh production restore drill and activation evidence`
  - 2026-05-02: Closed evidence-refresh scope with an explicit `NO-GO`.
    Local restore drill PASS. Stage/prod restore drill wrappers produced fresh
    FAIL artifacts because required DB container env vars are unavailable in
    this context. Stage/prod release gates were rerun in dry-run mode and
    remain `not_ready`. Evidence:
    `docs/operations/v1-closeout-evidence-refresh-2026-05-02.md`.
- [x] `V1CLOSEOUT-10 refactor(api-exchange): decide and remediate direct exchange boundary access`
  - 2026-05-02: Closed exchange-boundary conformance for the audited surfaces.
    Public Binance REST host/fetch ownership moved to
    `apps/api/src/modules/exchange/binancePublicRest.service.ts`; Binance API
    key probe client bootstrap moved to
    `apps/api/src/modules/exchange/binanceApiKeyProbeClient.service.ts`.
    Backtest, runtime fallback, runtime signal market-data, and profile
    API-key probe consumers now use exchange-owned seams. Validation PASS:
    focused exchange/backtest/runtime/profile pack (`15/15`), runtime loop/pnl
    pack (`45/45`), API typecheck.
- [x] `V1CLOSEOUT-11 release(qa): run final V1 go/no-go closure pack`
  - 2026-05-02: Closed with final `GO` in
    `docs/operations/v1-final-go-no-go-closure-2026-05-02.md`. Repository
    validation baseline is green (`guardrails`, `docs parity`, `lint`,
    `typecheck`, full API tests, full web tests, `build`). Gate 4 is approved
    with Patryk Wroblewski as Engineering, Product, Operations, and RC owner.
    Production restore evidence PASS, rollback proof PASS, and the non-dry-run
    production release gate is `ready`. Stage is deferred to V2 per operator
    decision.
- [x] `V1SEC-01 fix(deps+ops): clear dependency audit and record V1 prod-only release scope`
  - 2026-05-02: Closed dependency hardening after the confidence sweep found
    high/moderate dependency audit findings. Updated direct web toolchain
    packages and centralized patched transitive versions through
    `pnpm.overrides`; `pnpm audit` now reports no known vulnerabilities.
    Operator clarified that V1 is production-only and stage moves to V2 when a
    dedicated VPS exists. Validation PASS: `quality:guardrails`, `lint`,
    `typecheck`, full web tests (`139` files / `394` tests), full API tests,
    `build`, and `docs:parity:check`. Evidence:
    `docs/planning/v1sec-01-prod-only-dependency-hardening-task-2026-05-02.md`.
- 2026-05-01 execution status: `V1ROE-04` protected production verification is
  closed with authenticated API/browser evidence. Remaining non-deferred V1
  blockers are `V1EXCEL-03..06` authenticated manual operator and OPS evidence.
  `BOTMULTI-*` remains in `PIPELINE` until those post-V1 confidence gates are
  green.
- [x] `V1PRICE-04 fix(api-runtime): propagate fallback ticker price into position markPrice candidates`
  - 2026-05-02: Closed as part of `V1RUNTIME-TRUST-03`. Runtime Positions now
    feeds valid fallback ticker prices into the existing preferred price
    resolver for open-position `markPrice` when runtime/stat price truth is
    missing, while preserving exchange-sync freshness precedence. Focused API
    coverage proves a missing runtime ticker plus fallback price returns
    `markPrice`, `unrealizedPnl`, and margin percent from the fallback
    candidate. Evidence:
    `docs/planning/v1runtime-operator-trust-hardening-task-2026-05-02.md`.
- [x] `V1SURF-03 fix(web-runtime): reset live ticker state on runtime context changes`
  - 2026-05-02: Closed as part of `V1RUNTIME-TRUST-03`. Dashboard Home now
    clears stream prices when selected bot/session/status/symbol context
    changes, and Bot Monitoring clears stream prices when bot/session/view
    mode/status/filter/symbol context changes. Bot Monitoring also opens SSE
    only for `RUNNING` runtime contexts, matching Dashboard Home's live versus
    snapshot distinction. Focused web hook coverage proves same-symbol
    selected-bot switching clears stale stream prices. Evidence:
    `docs/planning/v1runtime-operator-trust-hardening-task-2026-05-02.md`.
- [x] `V1BOT-AUDIT-02 qa(runtime+web): audit runtime freshness, action context, and operator trust`
  - 2026-05-02: Completed the second audit after `V1SURF-02`. Highest-risk
    finding: `runtimeSessionPositionsRead.service.ts` fetches fallback ticker
    prices for missing symbols but does not pass those fallback candidates into
    the position `markPrice` resolver. Web follow-up: stream ticker maps are
    symbol-keyed and not reset on all selected runtime/status/filter changes,
    while Bot Monitoring stream eligibility is broader than Dashboard Home.
    Close/cancel paths remain backend guarded with `riskAck`; UI affordances
    can improve later. Evidence:
    `docs/planning/v1bot-runtime-operator-trust-audit-2026-05-02.md`.
- [x] `V1SURF-02 fix(web-runtime): share live open-position derivation across Bot Runtime and Dashboard`
  - 2026-05-02: Closed follow-up from `V1BOT-AUDIT-01`. The audit found the
    next V1 confidence risk is duplicated frontend runtime derivation, not
    another independent backend close path. `Dashboard -> Bots -> Monitoring`
    and `Dashboard Home -> Runtime` now compute live open-position mark price,
    PnL, margin percent, DCA, and `TTP`/`TSL` display through one shared web
    helper. Dashboard summary cards now reuse the same selected-bot stream PnL
    as the open-position table for `summary.unrealized`, `paperDelta`,
    `paperEquity`, and selected `net`. Validation PASS: focused web
    derivation/component tests (`9/9`), web typecheck, web build, and
    guardrails. Evidence:
    `docs/planning/v1surf-02-shared-runtime-position-derivation-task-2026-05-02.md`.
- [x] `V1DOGE-03 fix(api-runtime+web): align imported LIVE protection and dashboard price truth`
  - 2026-05-02: Closed an operator-reported `LIVE DOGEUSDT SHORT` protection
    concern where dashboard PnL had fallen below visible `TTP` while the
    position stayed open. Runtime automation now reuses the same
    runtime-versus-exchange-sync price preference contract as the dashboard
    read model, so imported `LIVE EXCHANGE_SYNC` protection decisions prefer
    exchange-derived price from fresh `unrealizedPnl` when reconciliation is
    newer than the runtime tick. Focused regressions lock `TTP`, `TP`, `SL`,
    and `TSL` on the same freshness contract. A follow-up dashboard-home
    derivation fix restores live market-stream precedence over API snapshots
    for visible open-position PnL, so percentages refresh when market data
    arrives. Validation PASS: focused runtime regression, related
    runtime/read-model pack (`40/40`), API typecheck, focused web derivation
    test (`3/3`), web typecheck, web build, and guardrails. Evidence:
    `docs/planning/v1doge-ttp-exchange-sync-price-task-2026-05-02.md`.
- [x] `V1BOT-SIGNALS-02 fix(api-runtime): expose condition match truth and recover market-stream publishing`
  - 2026-05-02: In progress after authenticated production read-only evidence
    showed the current PAPER session was `RUNNING` with `eventsCount=1` and
    `symbolsTracked=0`, while the market-stream SSE endpoint connected but did
    not emit sampled events for active/default symbols. Runtime condition
    analysis now exposes canonical per-rule `matched` truth from the shared
    evaluator, and the dashboard keeps its existing `Markets / Signals` table
    while showing `PASS`/`MISS` for condition lines. Market-stream Redis
    publisher startup/publish failures now reset memoized connection state and
    retry on later events. Follow-up websocket smoke identified the deeper
    remaining blocker: Binance USD-M Futures no longer pushes regular market
    streams from the legacy unrouted `wss://fstream.binance.com/ws` endpoint,
    so the worker now uses `wss://fstream.binance.com/market/ws`. The slice is
    closed after Redis AOF recovery, Redis readiness hardening, and
    post-recovery production SSE PASS with real candle/ticker events.
    Validation PASS: focused market-stream/runtime read-model tests (`50/50`),
    focused Binance stream/fanout/subscription tests (`15/15`), readiness
    tests (`9/9`), API typecheck, web typecheck, API build, and repository
    guardrails. Evidence:
    `docs/planning/v1bot-signals-runtime-truth-2026-05-02.md`.
- [x] `V1BACKTEST-01 fix(api-backtests): recover futures candles when primary kline endpoint is unavailable`
  - 2026-05-02: Closed an operator-reported production backtest investigation
    after safe production smoke showed `FUTURES` backtest
    `d92219d3-ae5a-480f-ae35-1293e87339bf` failed with
    `NO_CANDLES_AVAILABLE_FOR_SYMBOL` and `totalTrades=0`, while comparable
    `SPOT` backtest `553a5c1a-66a9-4c70-be20-6c044cb11010` completed with
    `totalTrades=2`. The API backtest gateway now retries Binance USD-M
    futures candle chunks through `/fapi/v1/continuousKlines` when primary
    `/fapi/v1/klines` returns no usable rows, without substituting SPOT data
    for FUTURES. Recent commit review also identified `a7c0a357` as directly
    touching backtest TSL parsing, so stale replay-core regression data was
    aligned to the current negative-start plus positive-step TSL contract.
    Validation PASS: gateway test (`3/3`), replay core (`25/25`), backtests
    e2e (`14/14`), API typecheck, API build, repository guardrails. Evidence:
    `docs/planning/v1backtest-01-futures-kline-fallback-task-2026-05-02.md`.
- [x] `DPL-PROD-BUILDINFO-01 fix(ops): fail promotion when web build-info stays on old SHA`
  - 2026-05-02: Closed production deploy-proof hardening after a Coolify push
    deploy lag required an empty retrigger commit. `Promote PROD` now waits for
    public web `/api/build-info` to expose the promoted `github.sha` before
    runtime freshness gates run. Added `ops:deploy:wait-web-build-info` and
    updated Coolify/post-deploy runbooks. Validation PASS: script help,
    production readback against active SHA, repository guardrails. Evidence:
    `docs/operations/prod-web-build-info-gate-2026-05-02.md`.
- [x] `V1BOT-CONDITIONS-01 fix(api-runtime-read): prevent stale signal conditions after bot context edits`
  - 2026-05-02: Closed the operator-reported dashboard/runtime drift where
    `Markets / Signals` could keep showing old strategy indicators after stop
    -> strategy edit -> start. Runtime symbol-stats now ignores superseded or
    pre-edit signal condition payloads for display context and falls back to
    the current configured strategy until fresh runtime evaluation arrives;
    aggregate merge keeps that configured fallback ahead of superseded
    historical signal context after restart, including the production-observed
    no-new-session-yet race.
    Market edits for inactive PAPER and LIVE linked bots were regression-locked
    and continue to sync linked symbol groups. Validation PASS: focused bots
    runtime-scope e2e (`10/10`), markets e2e (`13/13`), API typecheck, API
    build, and repository guardrails. Evidence:
    `docs/planning/v1bot-conditions-market-sync-2026-05-02.md`.
- [x] `V1I18N-01 feat(web-i18n): add Swiss German locale`
  - 2026-05-02: Closed the operator-requested Swiss German/German Switzerland
    locale rollout. Implemented the request as standards-compliant `de-CH`
    across supported locales, provider hydration, storage validation, Intl
    formatting, security bootstrap allow-list, route namespace registry, all
    namespace translation files, shared language switcher CH flag option, and
    focused tests. Validation PASS: focused i18n/UI tests (`22/22`), web
    typecheck, web build, repository guardrails, and route-reachable i18n audit
    with `findings=0`. Evidence:
    `docs/planning/v1i18n-01-swiss-german-locale-task-2026-05-02.md`.
- [x] `V1UI-FLAG-01 fix(web-footer): restore language switcher flags`
  - 2026-05-01: Closed an operator-reported footer language switcher flag
    regression. Commit review from `2026-05-01 09:00` found no post-09:00
    change directly touching the footer or switcher, so the existing shared
    contract was hardened instead of replaced: GB/PL/PT flags now render as
    visual CSS flag badges instead of regional-indicator text, and both public
    and dashboard footer tests assert the active footer flag remains visible
    without text content. Validation PASS: focused
    footer/language switcher tests (`5/5`), web typecheck, web build,
    repository guardrails. Evidence:
    `docs/planning/v1ui-flag-01-footer-language-flags-regression-task-2026-05-01.md`.
- [x] `V1DCA-05 fix(api-runtime-read): restore imported DCA across restarted sessions`
  - 2026-05-01: Closed the follow-up ETHUSDT production regression after
    deployed `15cddb5a`. Authenticated production evidence showed the current
    runtime session started after the imported ETH lifecycle had already
    executed two DCA adds, so `Positions` filtered the DCA rows out by
    `session.startedAt`. The read model now uses the earlier of bot creation
    and session start for lifecycle trade reconstruction, bridges through
    same-ownership historical position ids for legacy DCA rows that lost both
    bot and wallet refs, includes legacy bot-scoped `walletId=null` LIVE rows,
    and keeps close/reopen boundaries intact. Validation PASS: focused imported
    DCA API e2e (`6/6`), API typecheck, API build, repository guardrails, diff
    check. Evidence:
    `docs/planning/v1dca-05-restarted-session-imported-dca-read-model-task-2026-05-01.md`.
- [x] `V1DCA-04 fix(api-runtime-read): restore wallet-scoped imported DCA in Positions`
  - 2026-05-01: Closed the remaining operator-reported ETH DCA regression after
    `V1DCA-03` deployed. The bug was in the API runtime positions read model:
    legacy/imported exchange-sync DCA rows with missing `botId` or `strategyId`
    were not included in supplemental DCA continuity. The read model now counts
    wallet-scoped imported DCA for owned external symbols while preserving
    close/reopen boundaries. Validation PASS: focused imported DCA API e2e
    (`5/5`), API typecheck, API build, repository guardrails. Evidence:
    `docs/planning/v1dca-04-wallet-scoped-imported-dca-read-model-task-2026-05-01.md`.
- [x] `V1DCA-03 fix(web-monitoring): restore DCA visibility when portfolio-history refresh fails`
  - 2026-05-01: Closed an operator-reported regression after production
    deployed `fbeae8f0`. Commit scan from 09:00 showed `fbeae8f0` was the only
    post-09:00 commit touching bot runtime/web monitoring. The new optional
    portfolio-history refresh no longer sets global monitoring error state, so
    a portfolio-history failure cannot hide valid `Positions` DCA ladder
    output. Validation PASS: focused `BotsManagement` web test (`13/13`) with
    portfolio-history failure and DCA ladder assertion. Evidence:
    `docs/planning/v1dca-03-monitoring-dca-visibility-regression-task-2026-05-01.md`.
- [x] `V1COVER-01 qa(release): create V1 module function coverage ledger`
  - 2026-05-01: Closed the first coverage ledger requested to stop repeated
    ad-hoc feature retesting. The initial matrix covers 33 V1
    money-path/runtime/release-gate rows with local and production status
    separated. Production status split: `PASS=14`, `PARTIAL=5`,
    `NEEDS_PROD_SAMPLE=7`, `NEEDS_PROD_UI_CHECK=1`, `BLOCKED=2`, `FAIL=1`,
    `NOT_APPLICABLE=2`, `NOT_VERIFIED=1`; `P0=22`. Evidence:
    `docs/operations/v1-function-coverage-audit-2026-05-01.md`,
    `docs/operations/v1-function-coverage-matrix-2026-05-01.csv`.
- [x] `V1COVER-02 qa(release): expand function coverage ledger from code scan`
  - 2026-05-01: Closed the follow-up project scan. The coverage ledger now
    has 79 rows and includes the main top-level API/web module surfaces
    discovered from route/module/test scanning. Production status split:
    `PASS=17`, `PARTIAL=22`, `NEEDS_PROD_SAMPLE=9`,
    `NEEDS_PROD_UI_CHECK=12`, `NOT_VERIFIED=11`, `NOT_APPLICABLE=5`,
    `BLOCKED=2`, `FAIL=1`; priorities: `P0=45`, `P1=24`, `P2=10`.
    Evidence:
    `docs/planning/v1cover-02-code-scan-function-ledger-expansion-task-2026-05-01.md`,
    `docs/operations/v1-function-coverage-audit-2026-05-01.md`,
    `docs/operations/v1-function-coverage-matrix-2026-05-01.csv`.
- [x] `V1COVER-03 qa(release): classify function ledger by implementation readiness`
  - 2026-05-01: Closed readiness classification across all 79 ledger rows.
    Current split: `READY=22`, `IMPLEMENTED_NEEDS_EVIDENCE=43`,
    `IMPLEMENTED_NOT_VERIFIED=11`, `V1_BLOCKER=3`,
    `REQUIRES_IMPLEMENTATION_REVIEW=0`. The next V1 execution waves are:
    `V1GATE-A` for release blockers, `V1MONEY-A` for live-money automation
    proof, `V1MANUAL-A` for operator matrix, `V1UX-A` for P1 operational UI
    smokes, and `V1SCOPE-A` for defer/launch-scope decisions. Evidence:
    `docs/planning/v1cover-03-function-implementation-readiness-task-2026-05-01.md`,
    `docs/operations/v1-function-implementation-readiness-audit-2026-05-01.md`.
- [x] `V1COVER-04 qa(release): promote function ledger into reusable project standard`
  - 2026-05-01: Closed the model-quality pass. Added a reusable governance
    standard and starter CSV template so this ledger shape can be reused in
    other projects. Evidence:
    `docs/planning/v1cover-04-model-function-ledger-standard-task-2026-05-01.md`,
    `docs/governance/function-coverage-ledger-standard.md`,
    `docs/governance/function-coverage-ledger-template.csv`.
- [x] `V1SCOPE-01 planning(scope): classify lower-priority not-verified surfaces`
  - 2026-05-01: Closed the first `V1SCOPE-A` pass by classifying ambiguous
    lower-priority rows into explicit launch-scope buckets. `POST_V1`:
    admin users/subscriptions, profile subscription, strategy import/export,
    and assistant config/dry-run. `WAIVED_FOR_V1`: cross-mode reports,
    avatar upload, and orphan-repair command. `IN_V1`: subscription
    entitlement enforcement remains in scope because it still gates bot/runtime
    behavior. Evidence:
    `docs/planning/v1scope-01-launch-scope-decision-task-2026-05-01.md`,
    `docs/operations/v1-function-implementation-readiness-audit-2026-05-01.md`.
- [x] `V1SUBS-01 fix(api-entitlements): fail closed on LIVE bot writes without live-trading entitlement`
  - 2026-05-01: Closed the remaining local `SUBS-ENTITLEMENTS-001` V1 slice.
    Added one shared `assertSubscriptionAllowsLiveTrading(...)` guard, enforced
    it on LIVE bot create and `PAPER -> LIVE` mode switch, and added focused
    entitlement e2e coverage proving FREE-plan LIVE pool edits cannot bypass
    `features.liveTrading=false`. Validation: API typecheck PASS, focused
    entitlement e2e PASS (`5/5`), API build PASS, repository guardrails PASS.
    Evidence:
    `docs/planning/v1subs-01-live-entitlement-bot-write-guard-task-2026-05-01.md`.
- [x] `V1FINAL-01 qa(prod): verify deployed DOGE runtime hardening and run final V1 gates`
  - 2026-05-01 preflight: production public smoke is green, but build-info
    still reports `c081f224134fedb65de2ecad716274b92593c373`, while repository
    head is now `fba29a96` and includes runtime hardening commit `577c45a8`.
    Stage still returns `503 no available server`.
    Therefore the next executable final-V1 slice starts only after production
    deploys `fba29a96` or later. Execute the gate order in
    `docs/operations/v1-final-test-structure-2026-05-01.md`: deploy freshness,
    DOGE close/reopen regression, production V1EXCEL evidence, manual matrix,
    and final GO/NO-GO.
  - 2026-05-01 workflow recheck: latest GitHub `Promote PROD` run is old
    (`0f122ed4`, 2026-04-25) and failed; no current production promotion run
    exists for `577c45a8`/`fba29a96`.
  - 2026-05-01 execution: production now reports deployed
    `6a8ded9333eabced5e8461362e9e9237a9bf4e4d`. Public and authenticated
    production smoke PASS, runtime freshness PASS, rollback guard PASS,
    rollback proof PASS, and the active `LIVE` `DOGEUSDT` open row no longer
    carries stale DCA (`dcaCount=0`, `tradesCount=1`). The final release gate is
    still `not_ready`: activation audit/plan are stale, production restore
    drill failed because prod DB container config is unavailable in this
    context, manual operator matrix is not complete, and stage remains `503`.
    Evidence:
    `docs/planning/v1final-01-prod-gate-execution-task-2026-05-01.md`.
  - 2026-05-01 target refresh: production public smoke still PASS and
    build-info now reports `662ce9b48fac6a48963a62f8d3bc4ac2f645cac6`, which
    is an ancestor of local `HEAD` `ef37fca0c4a3c47605986a815b5323fd535a37fa`.
    Production is behind the newest local commits
    `ca430aa5`/`1e20b6df`/`ef37fca0`. Stage public smoke still fails with
    three `503` checks. Evidence:
    `docs/planning/v1gate-01-current-target-freshness-sync-task-2026-05-01.md`.
  - 2026-05-01 deploy refresh: production now reports
    `fbeae8f08926bc838141d53397fc142f52945356`, matching the current local V1
    candidate on `main`. Public production deploy smoke PASS for API
    `/health`, API `/ready`, and web `/`. A fresh release-gate classification
    remains `not_ready` because activation audit/plan evidence is stale and
    the production backup/restore drill artifact is failed. Stage still returns
    `503`. Evidence:
    `docs/operations/v1-release-gate-prod-2026-05-01T18-20-00-000Z.md`.
  - 2026-05-02 supersession: closed as superseded by `V1CLOSEOUT-11`, which
    refreshed production restore, rollback, Gate 4 approval, and non-dry-run
    production release evidence and published final V1 production-only status
    `GO` in `docs/operations/v1-final-go-no-go-closure-2026-05-02.md`. Stage
    is deferred to V2 by operator decision.
- [x] `V1EXCEL-04 ops(stage-refresh): restore stage target before authenticated gate rerun`
  - 2026-05-01 refresh: stage public smoke now fails before auth. `stage-api`
    and `stage` both return `503 no available server` for health/ready/root and
    web build-info preflight. Evidence:
    `docs/operations/v1excel-04-stage-refresh-503-2026-05-01.md`. Next action:
    restore or redeploy stage web/API services in Coolify, then rerun public
    smoke plus authenticated runtime/rollback gates.
  - 2026-05-01 follow-up: stage still returns `503 no available server`.
    Coolify web login succeeds for the provided operator account, but the
    visible project/environment does not expose Soar resources and Coolify API
    endpoints require a bearer token (`401`). Automated restore/deploy remains
    blocked until the account has access to the real Soar resources or an API
    token is provided. Evidence:
    `docs/operations/v1excel-04-stage-coolify-access-refresh-2026-05-01.md`.
  - 2026-05-01 Coolify team follow-up: the account sees
    `luckysparrow's Team` and `Root Team`, but the active UI remains on
    `luckysparrow's Team`; attempting to switch to `Root Team` through the
    rendered Livewire team switch returned `500`. No stage restore action was
    attempted. Evidence:
    `docs/operations/v1excel-04-stage-coolify-access-refresh-2026-05-01.md`.
  - 2026-05-01 target refresh: public stage smoke still fails before auth with
    `503` for API `/health`, API `/ready`, and web `/`. Evidence:
    `docs/operations/v1gate-01-current-target-freshness-2026-05-01.md`.
  - 2026-05-02 supersession: closed for V1 as deferred to V2 by operator
    decision in `V1CLOSEOUT-11`. Stage restoration remains a V2 infrastructure
    task, not a V1 production-only blocker.
- [x] `V1EXCEL-05 ops(prod-refresh): finish broader production evidence families`
  - 2026-05-01 refresh: executable production subset is green on the current
    deployed runtime candidate. Public smoke PASS, protected runtime freshness
    PASS, rollback guard PASS (`shouldRollback=false`, no reasons, no alerts,
    `runningCount=4`), and production rollback-proof artifact PASS with
    secret-safe command recording. Evidence:
    `docs/operations/v1excel-05-prod-refresh-2026-05-01.md`. Still open:
    restore drill, RC status/sign-off/checklist rebuild, and remaining manual
    matrix items.
  - 2026-05-01 follow-up: RC status/checklist/sign-off refresh completed, and
    strict RC evidence summary reports Gate 1..4 PASS from current source
    artifacts. The sign-off record itself remains `BLOCKED` because approver
    fields are blank. The fresh prod restore drill artifact is `FAIL` until
    prod DB container settings or VPS/Coolify execution context are available.
  - 2026-05-02 supersession: closed by `V1CLOSEOUT-11`, which refreshed
    production restore drill PASS, rollback proof PASS, Gate 4 approval, and
    non-dry-run production release gate `ready` for V1 production-only status
    `GO`.
- [x] `V1GATE-01 release(docs+ops): refresh current target freshness and stage availability`
  - 2026-05-01: Closed a public preflight sync after production and stage target
    truth changed again. Production public smoke PASS and build-info reports
    `662ce9b48fac6a48963a62f8d3bc4ac2f645cac6`; stage public smoke still FAILS
    with three `503` checks; production SHA is an ancestor of local `HEAD`, but
    lacks the newest local commits `ca430aa5`, `1e20b6df`, and `ef37fca0`.
    Evidence:
    `docs/planning/v1gate-01-current-target-freshness-sync-task-2026-05-01.md`,
    `docs/operations/v1gate-01-current-target-freshness-2026-05-01.md`.
- [x] `V1SMOKE-01 test(local): restore go-live smoke after entitlement and ownership fixture drift`
  - 2026-05-01: Closed the local deploy-prep smoke recovery. Non-destructively
    repaired local Prisma migration-history drift only after verifying expected
    schema objects existed, aligned `backtests.e2e` with bot-level
    external-position authority and live-trading subscription entitlement, and
    aligned `BotsManagement` test expectations with the canonical
    `manageExternalPositions` payload. `goLiveSmoke.mjs` now reports the actual
    failed migration instead of a hardcoded historical id. Validation PASS:
    focused backtests e2e (`14/14`), focused web smoke pack (`17/17`), bot
    portfolio-history web test (`1/1`), and full `pnpm run test:go-live:smoke`
    (API `38/38`, web `17/17`). Evidence:
    `docs/planning/v1smoke-01-go-live-smoke-recovery-task-2026-05-01.md`.
- [x] `DOCSYNC-2026-05-01-WALLET-PREVIEW fix(docs+web-route): sync canonical wallet preview route inventory`
  - 2026-05-01: Closed a local docs-parity slice after reviewing the active V1
    queue and confirming the current executable work is blocked on external
    stage/prod evidence. The shipped app already exposes
    `/dashboard/wallets/:id/preview`, and `web-wallets` documented that route,
    but the canonical dashboard route map omitted it. Synced the route
    inventory, added a focused page test for the wallet preview route, and
    recorded the task in
    `docs/planning/docsync-2026-05-01-wallet-preview-route-parity-task.md`.
- [x] `WPREVIEW-10 fix(web-wallet-preview): fail closed on unavailable ledger analytics`
  - 2026-05-01: Closed a local V1 wallet-preview truth slice after rechecking
    the active queue and confirming external `NOW` tasks are blocked on stage
    availability or protected production access. The accepted wallet ledger
    contract requires `UNAVAILABLE` completeness to show an empty/error state
    instead of rendering analytics as if they were real. `WalletPreviewPanel`
    now returns early for `UNAVAILABLE`, preserving only safe controls plus the
    empty state and hiding summary cards, equity timeline, and cashflow events.
    Added focused regression coverage and synced wallet module docs. Evidence:
    `docs/planning/wpreview-10-wallet-preview-unavailable-fail-closed-task-2026-05-01.md`.
- [x] `V1UX-01 qa(web-route): lock operational route smoke for profile, logs, exchanges, and wallet preview`
  - 2026-05-01: Closed a local `V1UX-A` parity slice after rechecking the
    active queue and confirming the remaining `NOW` blockers are still
    stage/prod evidence tasks. Added focused route tests for the canonical
    `/dashboard/profile` shell (including `#api` hash entry), `/dashboard/logs`,
    `/dashboard/exchanges -> /dashboard/profile#api` redirect, and the wallet
    preview page shell. Extended route-locale smoke to cover logs and wallet
    preview, and synced affected module docs. Validation: focused route-smoke
    pack PASS (`18/18` files, `19/19` tests), `web` typecheck PASS, `web`
    build PASS, repository guardrails PASS. Evidence:
    `docs/planning/v1ux-01-operational-route-smoke-task-2026-05-01.md`.
- [x] `V1UX-REPORTS-01 qa(web-route): lock canonical reports route shell smoke`
  - 2026-05-01: Closed a follow-up local route-parity slice while external
    V1 gates remained blocked on stage/prod evidence. Added a focused shell
    test for `/dashboard/reports` that proves heading, breadcrumb navigation,
    and reports-view mount, and synced the reports module doc with the new
    coverage. Validation: focused route-smoke pack PASS (`18/18` files,
    `19/19` tests), `web` typecheck PASS, `web` build PASS, repository
    guardrails PASS. Evidence:
    `docs/planning/v1ux-reports-01-route-shell-smoke-task-2026-05-01.md`.
- [x] `V1UX-ROUTES-02 qa(web-route): lock canonical CRUD/detail route shells for markets, strategies, and backtests`
  - 2026-05-01: Closed a second local route-parity slice while external V1
    blockers remained stage/prod evidence tasks. Added dedicated App Router
    shell tests for `markets` list/create/edit, `strategies` list/create/edit
    plus `/:id -> /edit` redirect, and `backtests` list/create/detail.
    Synced the module docs so these routes are now first-class evidence in the
    web deep-dives. Validation: focused route-smoke pack PASS (`18/18` files,
    `19/19` tests), `web` typecheck PASS, `web` build PASS, repository
    guardrails PASS. Evidence:
    `docs/planning/v1ux-routes-02-canonical-crud-route-shell-smoke-task-2026-05-01.md`.
- [x] `V1UX-BOTS-03 qa(web-route): lock canonical bot preview and assistant route shells`
  - 2026-05-01: Closed a narrow follow-up bot route-parity slice while the
    executable V1 blockers remained external stage/prod/manual evidence work.
    Added dedicated App Router shell tests for `/dashboard/bots/:id/preview`
    and `/dashboard/bots/:id/assistant`, asserting breadcrumb shell stability
    plus canonical `BotsManagement` tab locks and `preferredBotId` forwarding.
    Synced `web-bots` evidence. Validation: focused route-smoke pack PASS
    (`18/18` files, `19/19` tests), `web` typecheck PASS, `web` build PASS,
    repository guardrails PASS. Evidence:
    `docs/planning/v1ux-bots-03-canonical-bot-preview-assistant-route-shell-task-2026-05-01.md`.
- [x] `BHIST-01 feature(bot-history): add bot-scoped portfolio history with reset and wallet-capital markers`
  - 2026-05-01: Closed a local product slice while stage/prod release gates
    remained externally blocked. Added `GET /dashboard/bots/:id/portfolio-history`
    plus a new monitoring section showing bot-scoped value progression,
    `PAPER_RESET` markers for PAPER, and wallet-ledger capital-event markers
    for LIVE. The UI is explicit about partial truth when open PnL is only
    known from the latest runtime snapshot. Validation: `api` typecheck PASS,
    `web` typecheck PASS, focused API portfolio-history e2e PASS (`2/2`),
    focused web portfolio-history test PASS (`1/1`), API build PASS, web build
    PASS, repository guardrails PASS. Evidence:
    `docs/planning/bhist-01-bot-portfolio-history-and-capital-events-task-2026-05-01.md`.
- [x] `V1DCA-01 fix(api-runtime-read): preserve DCA visibility after exchange-sync position replacement`
  - 2026-05-01: Closed after protected production inspection showed the `LIVE`
    DOGEUSDT DCA fill existed in the trade ledger but the current dashboard
    `Positions` row still showed `dcaCount=0` because exchange sync had
    replaced the local position row and the DCA trade remained linked to the
    superseded `positionId`. Runtime positions read now fetches direct position
    trades plus scoped same-session DCA candidates, attaches only persisted DCA
    rows matching bot/wallet/strategy/symbol/side/lifecycle window, and
    deduplicates by trade id. Validation PASS: focused imported DCA visibility
    API e2e, API typecheck, API build, repository guardrails. Post-deploy
    protected production verification PASS on deployed commit
    `9460317c7d9409062ff2ddd284a179a60ac89f1a`: current DOGEUSDT `Positions`
    row reports `dcaCount=1`, `tradesCount=2`, and `lastTradeAt` from the real
    `BOT/DCA` trade. Evidence:
    `docs/operations/v1dca-01-prod-verification-2026-05-01.md`.
- [x] `V1DCA-02 fix(api-runtime-read): preserve multi-level DCA visibility across repeated exchange-sync replacements`
  - 2026-05-01: Closed the follow-up DOGEUSDT counting gap after protected
    production ledger inspection showed the active session summary and trade
    ledger contained two real `BOT/DCA` fills, both linked to superseded local
    position ids. Runtime positions read now resolves same-session lifecycle
    continuity from persisted `OPEN/DCA/CLOSE` rows and starts supplemental DCA
    matching from the first same-identity open after the last exit, not from
    only the latest replacement row's `openedAt`. Validation PASS: focused
    imported DCA visibility e2e (`3/3`), lint, API typecheck, API build,
    repository guardrails. Task packet:
    `docs/planning/v1dca-02-multi-replacement-dca-count-task-2026-05-01.md`.
- [x] `V1DOGE-02 fix(api-runtime): harden DOGE-style LIVE close/reopen lifecycle state`
  - 2026-05-01: Closed the P0 DOGE-style runtime hardening slice after the
    audit confirmed a bot-managed `TSL` close and stale DCA on the next fresh
    same-symbol open. Runtime automated closes now preserve `strategyId`,
    runtime `Positions` continuity cuts off stale DCA at same bot/wallet/symbol
    close boundaries even for legacy close rows without strategy id, and DCA
    attachment remains strict to the current lifecycle. Added DCA-first close
    authority coverage for `SL/TSL` affordable-vs-exhausted cases and
    operator-visible `PRETRADE_BLOCKED` / `SIGNAL_DECISION` telemetry for DCA
    exhaustion and automated close rationale. Validation PASS: focused runtime
    automation, position-management, imported DCA visibility, and futures
    market-data gateway packs. Task packet:
    `docs/planning/v1doge-02-runtime-close-reopen-hardening-task-2026-05-01.md`.
    Post-deploy protected production verification remains the next evidence
    step.
- [x] `V1FINAL-00 release(planning): freeze final V1 test structure after DOGE runtime hardening`
  - 2026-05-01: Closed the planning slice requested after checking active
    queues. Production public smoke PASS, production build-info reports stale
    `c081f224`, stage public smoke FAIL with `503`, and the final V1 test
    structure now prevents claiming DOGE/V1 closure until the latest runtime
    hardening commit `577c45a8` or later is deployed. Evidence:
    `docs/operations/v1-final-test-structure-2026-05-01.md`. Task packet:
    `docs/planning/v1final-00-final-test-structure-task-2026-05-01.md`.
- [x] `WLEDGER-07..09 web-wallet-preview: expose ledger-backed wallet preview from wallet list`
  - 2026-04-30: Closed the wallet preview UI slice. Wallet rows now expose a shared `preview` table action linking to `/dashboard/wallets/:id/preview`, and the new preview page loads the ledger-backed performance summary, equity timeline, and cashflow events APIs. The UI separates contributed capital from bot PnL, keeps unclassified adjustments visible, handles loading/error/empty/partial/success states, and avoids ISO-currency assumptions for crypto symbols such as `USDT`. Validation PASS: focused wallet web tests, web typecheck, web build, route-reachable i18n audit, repository guardrails.
- [x] `WLEDGER-06 api-read: expose wallet performance summary, timeline, and cashflow APIs`
  - 2026-04-30: Closed the first wallet analytics read model. Added `GET /dashboard/wallets/:id/performance-summary`, `GET /dashboard/wallets/:id/equity-timeline`, and `GET /dashboard/wallets/:id/cashflow-events`, backed by persisted balance snapshots and cashflow events. Responses include current balance, contributed capital, bot PnL fields, fees/funding, unclassified adjustment, wallet delta percent, timeline points, cashflow markers, and completeness state. Validation PASS: focused wallet API e2e and API typecheck.
- [x] `WLEDGER-05 api-classify: classify initial and exchange-backed wallet cashflows`
  - 2026-04-30: Closed the first cashflow classification slice. Added `walletCashflowClassifier.service.ts`, which turns initial allocated LIVE wallet balance into `INITIAL_BALANCE`, maps exchange deposits/withdrawals/transfers/fees/funding/realized-income/unknown movements to explicit `WalletCashflowSource` values, and upserts stable exchange event ids by `(walletId, exchangeEventId, source)` so later replay stays idempotent. LIVE wallet creation now records both the balance snapshot and initial contributed-capital cashflow. Validation PASS: focused classifier, wallet, runtime tests and API typecheck.
- [x] `WLEDGER-04 api-ingest: persist initial and runtime LIVE wallet balance snapshots`
  - 2026-04-30: Closed the first ingestion slice for ledger-backed wallet analytics. Added a narrow `walletLedger.service.ts` writer and now persist `WalletBalanceSnapshot` rows at LIVE wallet creation from authenticated exchange balance preview, plus periodic runtime snapshots when `resolveRuntimeCapitalSnapshot` fetches fresh exchange balance outside the live-balance cache. Runtime sizing behavior remains unchanged; classification of deposits/withdrawals/bot PnL remains queued for `WLEDGER-05`. Validation PASS: Prisma generate, local schema sync for DB-backed e2e, focused wallet/runtime tests, API typecheck.
- [x] `WLEDGER-03 exchange: expose Binance wallet cashflow history behind the exchange adapter boundary`
  - 2026-04-30: Closed the exchange-boundary slice for future LIVE wallet ledger ingestion. Added `WALLET_CASHFLOW_HISTORY` to the existing exchange execution/authenticated-read capability contract, keeping Binance as the only supported V1 exchange and unsupported exchanges fail-closed. Added `fetchSupportedExchangeWalletCashflowHistoryRaw(...)` to the canonical adapter boundary and normalized supported CCXT account-history reads (`fetchLedger`, `fetchDeposits`, `fetchWithdrawals`, `fetchTransactions`) into wallet cashflow-history entries with direction, amount, currency, fee, status, timestamp, source, and exchange event id. Validation PASS: focused exchange tests and API typecheck.
- [x] `WLEDGER-02 db: add LIVE wallet balance snapshot and cashflow event persistence`
  - 2026-04-30: Closed the persistence foundation for ledger-backed wallet analytics. Added Prisma models/enums for `WalletBalanceSnapshot` and `WalletCashflowEvent`, including user/wallet ownership, exchange and market context, base currency, balance/allocation snapshot fields, cashflow direction/source, deterministic exchange-event uniqueness, optional links to position/order/trade lifecycle records, and migration `20260430200000_add_live_wallet_cashflow_ledger`. `WalletEquityPoint` remains derived at read time per the approved contract until the API read model proves materialization is needed. Validation PASS: Prisma validate and API typecheck.
- [x] `WLEDGER-01 docs(contract): freeze LIVE wallet ledger data model and completeness semantics`
  - 2026-04-30: Closed the first implementation-readiness slice for LIVE wallet performance analytics. Published `docs/architecture/reference/live-wallet-cashflow-ledger-contract.md` with persistent model semantics, cashflow classification, completeness states (`COMPLETE/PARTIAL/UNAVAILABLE`), formulas, API response requirements, dashboard requirements, and forbidden accounting shortcuts. Linked the contract from wallet source-of-truth and exchange-access ownership docs so future DB/API/exchange work stays inside approved module boundaries. Validation PASS: repository guardrails.
- [x] `WLEDGER-00 docs(product+architecture): freeze LIVE wallet cashflow ledger and equity timeline target`
  - 2026-04-30: Closed as the documentation/planning source of truth for future wallet performance features. The target model separates user-contributed capital from bot-generated PnL: initial LIVE exchange balance and later deposits/transfers increase contributed capital, withdrawals decrease it, bot trade results update bot PnL, and unsupported or ambiguous exchange movements stay visible as unclassified adjustments. Published the accepted architecture target in `docs/architecture/reference/wallet-source-of-truth-contract.md`, aligned product/module/known-limit docs, and queued `docs/planning/live-wallet-cashflow-ledger-and-equity-timeline-plan-2026-04-30.md` for implementation slices. Validation PASS: repository guardrails.
- [x] `UXFIX-2026-04-30-B fix(web-dashboard): derive LIVE percent wallet delta from runtime equity and net PnL`
  - 2026-04-30: Closed the dashboard wallet KPI data fix after operator review showed `Delta from start` stayed `-` for a `LIVE` percent-allocation bot. The web now keeps existing PAPER and LIVE fixed-allocation baseline behavior, but for `LIVE` percent allocation derives the delta denominator from runtime `portfolio - selected net PnL`, so available runtime equity plus realized/unrealized PnL renders a truthful `net PnL % | amount` instead of a blank dash. Validation PASS: focused `RuntimeSidebarSection` test, web typecheck, repository guardrails.
- [x] `UXFIX-2026-04-30-A fix(web-dashboard): align dashboard Positions row actions with shared table action styles`
  - 2026-04-30: Closed the small dashboard UI consistency fix requested by the operator. The dashboard runtime `Positions` table now renders row-level edit and close controls through the shared `TableIconButtonAction` contract, matching the default table action sizing, tooltip wrapper, border/background tones, and hover behavior while preserving the existing position-specific edit and close icons/actions. Validation PASS: focused runtime table presenter test, web typecheck, repository guardrails.
- [x] `V1SAFE-19 fix(api-runtime-read): keep imported LIVE fallback TTP visible when stale runtime state drifts below the arm threshold`
  - 2026-04-30: Closed after the user reported that a live dashboard position with configured `TTP 5%/2%` and `PnL%` around `7.81%` still showed no `TTP` level. Protected production payload inspection proved the problem lived in the API, not the table: imported managed `LIVE` rows returned `strategyAutomationContextResolved=true`, non-empty `trailingTakeProfitLevels`, and `dynamicTtpStopLoss=null`. Runtime position serialization now treats runtime `TTP` fields as authoritative only when they resolve to a valid positive trigger, and runtime positions reads now refuse stale imported runtime state whose canonical basis no longer matches the current `EXCHANGE_SYNC` position. Validation PASS: focused runtime serialization pack, focused dynamic-stop operator-truth e2e, API typecheck, repository guardrails.
- [x] `V1SAFE-18 fix(web-history): show one truthful opened/closed-by actor column and remove redundant history subheading`
  - 2026-04-30: Closed after the live-history follow-up showed one remaining operator gap: imported/open anchor rows still left the actor column empty because only close-side `closeInitiator` truth was rendered, and the extra `History - operational trade log` subheading added noise without information. The dashboard trade-history table now exposes one `Opened / Closed by` column that reuses canonical `closeInitiator` for close rows and infers open-side actor from existing `origin` for open/imported rows, while the redundant subheading is removed. Validation PASS: focused `runtimeUiHelpers` web test, web typecheck, route-reachable i18n audit, repository guardrails.
- [x] `V1SAFE-17 fix(web-history): stop labeling imported OPEN lifecycle anchors as close-by-position-lifetime`
  - 2026-04-30: Closed after protected production and code inspection confirmed that `History` could show `Position lifetime` on imported `OPEN` lifecycle anchors, even though those rows were not true timeout closes. The backend contract intentionally reuses `POSITION_LIFETIME` for imported/open anchors, so the fix stays in the web presentation layer: trade-history badges now distinguish `POSITION_LIFETIME + OPEN` as lifecycle-open context and keep `Position lifetime` only for true close-side rows. Validation PASS: focused `runtimeUiHelpers` web test, web typecheck, route-reachable i18n audit, repository guardrails.
- [x] `V1SAFE-16 fix(api+web-strategy-edit): clarify active-bot strategy lock and surface direct bot-settings unblock path`
  - 2026-04-30: Closed after the user reported that stopping a `LIVE` bot still left strategy edit blocked while trying to set lifecycle lifetime to `0`. The backend guard remains intentionally tied to `bot.isActive`, but strategy-lock responses now carry the blocking `botId + botName`, and the strategy edit screen now states explicitly that runtime stop is not enough and offers a direct link to the blocking bot's settings. Validation PASS: focused `strategies.e2e`, web typecheck, route-reachable i18n audit, repository guardrails.
- [x] `V1SAFE-15 fix(api-runtime-serialization): keep fallback dynamic TTP display monotonic from canonical trailing anchor`
  - 2026-04-30: Closed after a fresh live operator observation showed a narrower remaining drift: the dashboard `TTP` value could still drop during a pullback even though `TTP/TSL` should only ratchet protection upward. The backend close path already looked healthy; the residual bug lived in runtime position serialization, where fallback `TTP` still used current favorable move. Fallback `TTP` now prefers anchor-based `PnL fraction` whenever canonical runtime anchor state exists, which keeps operator display monotonic without inventing a new display-only sticky store. Validation PASS: focused runtime serialization pack, focused dynamic-stop operator-truth e2e, API typecheck, repository guardrails.
- [x] `V1SAFE-14 fix(api+web+runtime+backtest-tsl): restore advanced TSL as negative-start plus positive-step semantics`
  - 2026-04-30: Closed after the user proved the real desired contract directly on the live strategy editor: advanced `TSL percent=-20 / arm=10` should arm at `-20%` and trail with a `10%` recovery step, not be rejected as an invalid retrace larger than the activation threshold. Web form validation and sanitization, API strategy validation, runtime parser, and backtest parser are now aligned to that loss-side `start + step` contract, while focused runtime/backtest parity tests confirm the same semantics reach execution. Validation PASS: focused web strategy-form pack, focused API strategies/parser/parity pack, focused runtime trailing pack, API/web typecheck, repository guardrails.
- [x] `V1SAFE-12 fix(web-strategy-edit): sanitize legacy invalid trailing thresholds on strategy form load`
  - 2026-04-30: Closed after real strategy editing still failed despite the bot being disabled. The current strategy config contained one legacy invalid `TSL` level, so the new fail-closed validator blocked submit before unrelated `TTP` edits could be saved. `dtoToForm` now sanitizes legacy invalid advanced `TTP/TSL` thresholds on form load, while create/update validation stays strict for any newly submitted invalid config. Validation PASS: focused `StrategyForm.map` tests, focused `StrategyForm` tests, web typecheck, repository guardrails.
  - 2026-04-30 follow-up: extended the same slice after the first sanitize-on-load fix still proved too weak in practice. The strategy form now also starts from a valid default `TSL` threshold and strips legacy-invalid advanced `TTP/TSL` thresholds from the submit payload itself, preventing stale client-side state from re-blocking legitimate edits.
- [x] `V1SAFE-11 fix(api+web-strategy-close): fail closed on invalid advanced trailing thresholds`
  - 2026-04-30: Closed after protected production verification on `XRPUSDT` proved that the absurd `TSL -292.81%` was not just display drift; the backend was accepting an invalid advanced trailing-stop configuration whose retrace exceeded the activation threshold. Strategy create/update/import now reject that config, the strategy form blocks it before submit, runtime config parsing and runtime automation both filter any legacy invalid thresholds fail-closed, and runtime serialization no longer exposes trailing-trigger percent from negative runtime state. Validation PASS: focused API parser + strategies e2e, focused web `StrategyForm` pack, API/web typecheck, route-reachable i18n audit, repository guardrails.
- [x] `V1HIST-10 fix(api-ledger): persist imported OPEN lifecycle anchors and replace them when canonical exchange trades arrive`
  - 2026-04-30: Closed after the post-deploy production audit proved that dashboard `History` was already operator-correct while canonical position metadata for fresh imported open rows still stayed empty (`tradesCount=0`, `firstTradeAt=null`, `lastTradeAt=null`). `importedPositionHistoryHydrator` now persists one local `EXCHANGE_SYNC OPEN` anchor trade from canonical `Position` truth whenever imported trade history is not yet derivable, removes that anchor automatically when later canonical exchange trades can be reconstructed, and runtime history now classifies that persisted anchor as `POSITION_LIFETIME` instead of `SIGNAL_ENTRY`. Validation PASS: focused imported-history hydrator tests, focused runtime history parity e2e, API typecheck, repository guardrails.
- [x] `V1HIST-09 fix(api-runtime): restore imported OPEN visibility in dashboard operational history`
  - 2026-04-30: Closed after a fresh protected production plus browser audit confirmed that `Positions` and `Orders` were already truthful while the dashboard `History` tab still stayed empty for fresh imported `BNB/XRP/DOGE` lifecycles because it rendered only persisted trade rows. `runtimeSessionTradesRead` now emits one operational `OPEN` anchor row from canonical `Position` truth whenever a scoped imported lifecycle has no local trade rows yet, reusing existing `POSITION_LIFETIME` semantics instead of inventing exchange fills. Validation PASS: focused runtime history parity e2e, API typecheck, repository guardrails.
- [x] `V1HIST-08 fix(api-exchange): resolve imported trade-history reads through canonical exchange market symbols`
  - 2026-04-30: Closed after protected production payload inspection showed that fresh imported `BNB/XRP/DOGE` open rows still had `tradesCount=0` and `firstTradeAt=null` even after the runtime/UI truth slice was already green. The next smallest root cause lived at the authenticated exchange connector boundary: Soar asked imported trade-history reads with app-normalized ids like `XRPUSDT`, while the CCXT connector/test family already used unified exchange market symbols like `XRP/USDT:USDT`. `CcxtFuturesConnector` now resolves normalized ids to canonical exchange market symbols before trade-history, order-read, ticker, open-order, and trading-rules reads. Validation PASS: focused connector/boundary/history/reconciliation API pack, API typecheck, repository guardrails.
- [x] `V1SURF-09 fix(api+web-runtime): restore imported position/trade parity and non-sleeping dashboard truth`
  - 2026-04-30: Closed after fresh operator notes from the `LIVE` dashboard on `BNB`, `DOGE`, and `XRP` exposed one combined runtime-surface truth slice. Runtime reads now fetch trades for already visible imported/adopted positions by canonical `positionId` instead of reapplying older bot-scoped trade ownership filters, reconciliation now hydrates imported exchange trade history on the adopt/update path as well as the create path, dashboard derivations prefer backend `markPrice/unrealizedPnl/unrealizedPnlPercent` truth over stale stream recomputation, and periodic dashboard polling no longer sleeps behind a nominally connected SSE stream. Validation PASS: focused imported-history/visibility/reconciliation API pack, focused dashboard derivation/widget web pack, API/web typecheck, repository guardrails.
- [x] `V1IMPORT-01 fix(api-reconcile): let owned LIVE import replace or adopt botless wallet-owned local blockers`
  - 2026-04-30: Closed after protected production verification showed `BNBUSDT` existed on exchange but was missing from bot runtime positions while an older wallet-owned `BOT_MANAGED` local row for the same symbol still existed without `botId`. `livePositionReconciliation` now treats wallet-owned botless local rows as canonical local candidates for lifecycle replacement or adoption under the owned bot context, and reusable local positions also receive canonical `externalId` on upgrade to `EXCHANGE_SYNC`. This keeps the existing lifecycle-replacement rules, prevents open-position uniqueness collisions on import, and avoids leaving adopted local rows half-synced. Validation PASS: focused `livePositionReconciliation.service.test.ts`, API typecheck, repository guardrails.
- [x] `V1OWN-01 fix(api-runtime): hydrate imported owned LIVE positions into canonical runtime ownership`
  - 2026-04-30: Closed with one narrow runtime ownership slice. Default `runtimePositionAutomation` lookup now reuses the canonical external-position ownership index to hydrate imported owned `EXCHANGE_SYNC` rows with effective bot execution context, and runtime signal-loop bot-scope open-position counting now includes those owned imported `LIVE` rows instead of only direct `position.botId` ownership. Validation PASS: focused imported-ownership automation test, focused signal-loop defaults test, focused runtime automation pack, API typecheck, repository guardrails.
- [x] `V1AUTO-01 fix(api-runtime): rebase stale imported runtime state to canonical exchange-synced basis`
  - 2026-04-30: Closed together with the focused regression and closure pass. Imported `EXCHANGE_SYNC` runtime automation now rebases stale persisted state to canonical `quantity + entryPrice` truth before evaluating `DCA/TTP/TSL`, preventing stale `currentAdds` from suppressing valid management on a new canonical basis. Closure evidence: `docs/operations/v1auto-runtime-state-rebase-closure-2026-04-30.md`.
- [x] `V1AUTO-02 fix(api-reconcile): hydrate imported LIVE automation prospectively from fresh exchange-sync truth`
  - 2026-04-30: Closed by teaching `livePositionReconciliation` to wake the existing runtime automation engine when it creates or updates a canonically owned imported `LIVE` row with confirmed continuity and finite positive `markPrice`. The hook stays inside the approved architecture: it reuses `runtimePositionAutomationService.handleTickerEvent(...)` as prospective hydration from the adoption point instead of introducing a second imported-position automation path. Validation PASS: focused live-reconciliation test pack, API typecheck, repository guardrails. Closure evidence: `docs/operations/v1auto-reconciliation-automation-hydration-closure-2026-04-30.md`.
- [x] `V1AUTO-03 fix(api-read): restore imported DCA visibility in runtime positions payload`
  - 2026-04-30: Closed after fresh operator feedback suggested `DCA` could already execute while the dashboard positions table still showed `0`. Runtime positions now derive imported `DCA` truth from explicit `DCA` trades and runtime `currentAdds` before falling back to `entryLegs - 1`, which keeps imported managed positions truthful even when historical local `OPEN` trade hydration still lags. Validation PASS: focused imported-DCA visibility e2e, API typecheck, repository guardrails. Closure evidence: `docs/operations/v1auto-imported-dca-visibility-closure-2026-04-30.md`.
- [x] `V1ROE-00 analysis(queue): publish LIVE PnL/ROE semantics and imported automation parity packet`
  - 2026-04-30: Published `docs/planning/v1roe-live-pnl-roe-and-runtime-automation-parity-plan-2026-04-30.md` plus `docs/planning/v1roe-00-analysis-task-2026-04-30.md` after protected production verification of the active `LIVE DOGEUSDT` flow. The packet freezes two distinct truths that were previously conflated: Soar's current `PnL %` is a leveraged-move-over-modeled-margin metric rather than exchange ROE, and imported/reopened `LIVE` automation still appears stale enough to miss `DCA/TTP` evaluation after reopen/import. Implementation is intentionally blocked until the user chooses whether lifecycle thresholds stay on leveraged move or migrate to exchange ROE semantics.
- [x] `V1ROE-01 fix(api+web+runtime): align shared lifecycle PnL fraction to canonical margin basis`
  - 2026-04-30: Closed the first code slice of `V1ROE-A` after the user chose one shared lifecycle path with truthful `LIVE` percent semantics. Added persisted `Position.marginUsed`, propagated exchange-synced margin truth through reconciliation and runtime read models, introduced shared `positionPnlSemantics`, and aligned runtime automation plus dashboard/monitoring surfaces so `LIVE` percent truth and `DCA/TTP/TSL` evaluation use the same canonical margin basis instead of the old modeled-margin shortcut. Validation PASS: focused API runtime/read/reconcile pack, focused web runtime derivation pack, API/web typecheck, repository guardrails.
- [x] `V1REOPEN-00 analysis(queue): publish same-symbol LIVE close/reopen hardening packet`
  - 2026-04-29: Published `docs/planning/v1reopen-live-close-reopen-pnl-ttp-hardening-plan-2026-04-29.md` plus `docs/planning/v1reopen-00-analysis-task-2026-04-29.md` after a focused audit of the newly reported `DOGEUSDT` real-account flow. The strongest current hypothesis is stale lifecycle continuity across `LIVE close -> same-symbol reopen`: stale open-row identity or stale runtime protection state likely survives long enough to invert operator-visible `PnL%` and contaminate `TTP` behavior on the new position. The packet freezes the next narrow wave inside existing approved systems: regression lock, reconciliation hardening, runtime-state cleanup, and minimal read-model verification.
- [x] `V1REOPEN-01 audit(regression-matrix): freeze the exact same-symbol close/reopen failure matrix`
  - 2026-04-29: Closed by freezing the regression class directly into the canonical packet and focused tests. The repository now has explicit proof coverage for the three highest-risk variants of the user report: opposite-side stale lifecycle on the same symbol, same-side reopen treated as a new lifecycle when exchange timestamp proves discontinuity, and stale runtime protection-state cleanup on forced lifecycle retirement.
- [x] `V1REOPEN-02 test(api-red): lock stale lifecycle visibility, side truth, and PnL basis on LIVE reopen`
  - 2026-04-29: Closed by adding focused reconciliation regressions proving that a reopened `LIVE` position on the same symbol cannot keep a stale opposite-side row actionable or visible, and that a same-side reopen with a newer exchange timestamp is treated as a new lifecycle instead of silently reusing stale identity.
- [x] `V1REOPEN-03 fix(api-reconcile): retire superseded same-symbol lifecycle rows deterministically`
  - 2026-04-29: Closed by hardening `livePositionReconciliation` in two ways: stale opposite-side rows for the same symbol now close immediately when new exchange truth confirms a replacement lifecycle, and same-side rows are no longer reused when exchange open timestamp proves a new lifecycle after close/reopen continuity.
- [x] `V1REOPEN-04 fix(api-runtime-state): clear stale runtime protection state on close or lifecycle replacement`
  - 2026-04-29: Closed by deleting persisted runtime position state whenever reconciliation force-closes or supersedes a lifecycle, which prevents stale `currentAdds` / trailing `TTP` / trailing `TSL` state from bleeding into the reopened position.
- [x] `V1EXCEL-00 planning(queue): publish full V1 excellence and production-confidence packet`
  - 2026-04-29: Published `docs/planning/v1excel-full-v1-excellence-and-confidence-plan-2026-04-29.md` plus `docs/planning/v1excel-00-planning-task-2026-04-29.md` after reviewing the repository's own `Definition Of Done`, integration gate, deployment gate, and production-activation contract against the newly closed `V1TRUTH-A` wave. The packet freezes the remaining non-deferred gap as a confidence/evidence problem rather than an architecture problem: fresh manual verification, fresh stage/prod activation evidence, honest local go-live reproducibility, and one final GO/NO-GO decision on the current candidate.
- [x] `V1TRUTH-00 planning(queue): publish final LIVE exchange-truth packet`
  - 2026-04-29: Published `docs/planning/v1truth-live-exchange-truth-hardening-plan-2026-04-29.md` plus `docs/planning/v1truth-00-planning-task-2026-04-29.md` after a fresh real-account analysis of the remaining money-path drift. The approved staged direction is now canonical: keep the singular bot architecture through the final `V1` hardening wave, close truthful `LIVE` order/position/manual-close/protection behavior first, and defer multi-strategy-per-bot to a post-`V1` architecture wave.
- [x] `V1TRUTH-01 audit(api+web+exchange): freeze the exact remaining money-path failure matrix`
  - 2026-04-29: Closed by the final `V1TRUTH-A` closure evidence packet. The failure matrix is now frozen in `docs/operations/v1truth-live-exchange-truth-closure-2026-04-29.md` across the four confirmed money-path classes: futures manual-order margin parity, exchange-backed `LIVE` manual close, pending external order versus position truth, and the final `DCA/TTP/TSL` nuance.
- [x] `V1TRUTH-02 fix(web+api-contract): align futures manual-order sizing and free-funds validation`
  - 2026-04-29: Closed by making dashboard futures manual-order semantics leverage-aware end to end on the web side. `FUTURES` budget/max-size/budget-to-quantity/free-funds validation now operate on required margin instead of full notional, while `SPOT` remains unchanged. Validation PASS: focused `useManualOrderController`, focused `HomeLiveWidgets.manual-order`, `pnpm --filter web run typecheck`.
- [x] `V1TRUTH-03 test(api-red): lock exchange-backed manual close parity`
  - 2026-04-29: Closed by pinning the manual-close contract at the orchestration and exchange-boundary seams. Focused regressions now prove that `LIVE` close submissions carry canonical `reduceOnly` intent through the existing order/exchange path and that runtime close may degrade only to explicit submitted exchange authority instead of inventing a local close.
- [x] `V1TRUTH-04 fix(api-exchange+runtime): make manual close fail-closed and exchange-truthful`
  - 2026-04-29: Closed by wiring `reduceOnly` through `executionOrchestrator -> orders -> exchangeAdapterBoundary`, relaxing live pretrade exposure blocking for reduce-only closes only, and letting runtime manual close use persisted entry price as `LIVE` fallback reference when lifecycle mark price is temporarily unavailable. `PAPER` keeps the stricter `POSITION_CLOSE_PRICE_UNAVAILABLE` failure mode when no canonical close price exists. Validation PASS: focused API manual-close pack, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- [x] `V1MARK-00 planning(queue): publish LIVE futures mark-price parity packet`
  - 2026-04-29: Published `docs/planning/v1mark-live-futures-mark-price-parity-plan-2026-04-29.md` and `docs/planning/v1mark-00-planning-task-2026-04-29.md` to freeze the next narrow `LIVE exchange` hardening slice. The strongest remaining real-money drift is that `LIVE FUTURES` runtime protection and position-lifetime enforcement still resolve lifecycle price from ticker `lastPrice` and candle close fallback, while exchange futures risk semantics are mark-price driven.
- [x] `V1MARK-01 docs(contract): freeze LIVE futures lifecycle-price hierarchy`
- [x] `V1MARK-02 test(api-red): lock futures mark-price stream and lifecycle-price preference`
- [x] `V1COVER-01 test(runtime-state): reset shared runtime candle/ticker stores at canonical test boundaries`
  - 2026-04-29: Closed the first `V1COVER-A` slice by resetting module-global runtime candle/ticker stores in the two engine files that emit runtime events directly (`runtime-flow.e2e` and `runtimeSignalLoop.service.test`). This removes one broad false-red source where `runtime-flow` could leave shared candle history behind and later make `runtimeSignalLoop` look broken only because it inherited prior series state.
- [x] `V1COVER-02 test(shared-cleanup): repair singular-bot wallet cleanup drift in runtime takeover helpers`
  - 2026-04-29: Closed the second `V1COVER-A` slice by restoring wallet cleanup to the shared runtime takeover helper and aligning the outdated overlap proof to the current architecture. The shared takeover suite now deletes wallet-linked topology deterministically, and the first visibility regression no longer assumes two active LIVE bots may share one symbol; it now proves the approved contract instead: imported `LIVE` positions stay visible for the owning LIVE bot while a PAPER bot may share the symbol without taking ownership.
## NEXT
- [x] `V1ROE-02 test(api-contract): lock runtime positions margin-basis and unrealizedPnlPercent contract`
  - 2026-04-30: Closed with a focused API e2e regression in `apps/api/src/modules/bots/bots.runtime-pnl-parity.e2e.test.ts`. The contract now proves that runtime session positions expose canonical `marginUsed`, preserve `unrealizedPnl`, and compute `unrealizedPnlPercent` from the persisted margin basis rather than silently falling back to the old modeled-margin shortcut when those values differ. Validation PASS: focused API e2e, `pnpm run quality:guardrails`.
- [x] `V1ROE-03 fix(api-normalization): prefer isolated-wallet margin truth for isolated LIVE futures positions`
  - 2026-04-30: Closed with a targeted normalization fix in `positions.exchangeSnapshotNormalization.ts` plus focused unit coverage in `positions.exchangeSnapshotNormalization.test.ts`. `ISOLATED` futures positions now prefer `isolatedWallet` as canonical `marginUsed` truth before falling back to `isolatedMargin` and initial-margin fields, while non-isolated positions keep initial-margin precedence. Validation PASS: focused normalization unit pack, `bots.runtime-pnl-parity.e2e`, and `pnpm run quality:guardrails`.
- [x] `V1TAKE-10 feat(bot-settings): move LIVE external-position management authority from wallet to bot`
  - 2026-04-30: Closed after the user approved one canonical checkbox in bot settings only. Added `Bot.manageExternalPositions` with migration backfill from linked wallets, rewired imported `LIVE` ownership resolution to derive management truth from the bot-level flag, removed the editable takeover toggle from wallet create/edit flows, and exposed the single control in bot create/edit for `LIVE` wallets. Validation PASS: focused runtime ownership/takeover API pack, focused bot+wallet web form pack, API/web typecheck, repository guardrails.
- [x] `V1ROE-04 qa(prod-manual): verify exchange-aligned LIVE PnL truth and DCA non-trigger on the protected DOGEUSDT flow`
  - 2026-04-30 status: BLOCKED by protected production verification, not local code. The protected production audit after `V1ROE-03` first exposed stale runtime price truth, and the following ownership/parity slices closed the local gaps for imported owned rows, stale runtime-state rebase, and prospective imported automation hydration. Canonical task packet: `docs/planning/v1roe-04-production-verification-task-2026-04-30.md`. Next proof after deploying the current candidate: capture authenticated `DOGEUSDT` API/browser evidence showing exchange-aligned `LIVE` PnL truth and non-dormant imported management.
  - 2026-04-30 partial verification: production web build-info confirms `gitSha=522e1d95e2612e280ca36eacb825358a3d26f19c` on `main`, and public deploy smoke passed for API `/health`, API `/ready`, and web `/`. Protected runtime freshness and dashboard runtime probes remain blocked with `401 Missing token` from this environment. Evidence: `docs/operations/v1roe-04-prod-verification-partial-2026-04-30.md`.
  - 2026-05-01 queue sync: `.codex/context/TASK_BOARD.md` was normalized so the only active `V1ROE-04` truth is `BLOCKED` on protected production auth. The stale duplicate `READY` wording was removed to prevent accidental local-only closure. Sync task: `docs/planning/docsync-2026-05-01-queue-auth-blocker-task.md`.
  - 2026-05-01 follow-up sync: `V1ROE-04` was moved out of the `READY` section entirely and now appears only under `BLOCKED` in `.codex/context/TASK_BOARD.md`. Follow-up task: `docs/planning/docsync-2026-05-01-ready-blocked-separation-task.md`.
  - 2026-05-01 closure: authenticated protected production evidence closed the gate. Production build-info reports `gitSha=e6bdcfda35698dbb29513490a953e15b9a2c0469`, public deploy smoke and protected runtime freshness pass, protected `DOGEUSDT` runtime truth is `IN_SYNC`, `CONFIRMED`, `actionable=true`, and strategy-context resolved, with `marginUsed=1.06308365`, `unrealizedPnl=-0.096012`, `unrealizedPnlPercent=-9.031462%`, and `DCA=0` while the first configured DCA trigger is `-20%`. Headless dashboard proof confirms the `live` bot `Positions` row renders the same identity, side, PnL sign/order, DCA state, and no armed dynamic stop. Evidence: `docs/operations/v1roe-04-prod-verification-closure-2026-05-01.md`.
- [x] `V1REOPEN-05 test(api-runtime-red): lock TTP continuity and loss-side-only DCA behavior on reopened LIVE positions`
  - 2026-04-29: Closed by adding focused runtime automation proof for a reopened imported `LIVE` position on the same symbol. The regression locks fresh lifecycle state (`currentAdds=0`), proves stale prior lifecycle state does not bleed into the reopened row, and confirms `TTP` still closes correctly when all remaining `DCA` thresholds are loss-side only.
- [x] `V1REOPEN-07 qa(closure): run focused close/reopen truth pack and publish evidence`
  - 2026-04-29: Closed with `docs/operations/v1reopen-live-close-reopen-truth-closure-2026-04-29.md`. Focused validation PASS: runtime automation reopen pack, live reconciliation pack, orders/positions runtime parity e2e, focused web operator pack, API/web typecheck, and repository guardrails.
- [x] `V1HIST-00 analysis(queue): publish imported exchange lifecycle history packet and mixed-origin live matrix`
  - 2026-04-29: Published `docs/planning/v1hist-imported-exchange-lifecycle-history-plan-2026-04-29.md`, `docs/planning/v1hist-00-analysis-task-2026-04-29.md`, and `docs/operations/v1live-mixed-origin-verification-matrix-2026-04-29.md` after a focused audit of imported `EXCHANGE_SYNC` lifecycle truth. Current repository evidence says active imported positions can already be adopted and later stale-closed, but imported opening history, reconciliation-driven external close history, and operator-visible history timestamps are still not a fully closed vertical slice.
- [x] `V1HIST-01 audit(api+history): freeze the imported open/close history failure matrix`
  - 2026-04-29: Closed by freezing the imported open/close failure matrix in `docs/planning/v1hist-imported-exchange-lifecycle-history-plan-2026-04-29.md` and the operator scenario companion `docs/operations/v1live-mixed-origin-verification-matrix-2026-04-29.md`. The packet now explicitly covers imported open history, imported external close history, mixed-origin continuity, and wait-based `DCA/TTP/TSL` verification expectations.
- [x] `V1HIST-02 docs(contract): freeze imported lifecycle history and history-table timestamp truth`
  - 2026-04-29: Closed by the same canonical packet plus implementation notes and closure record. The repository now freezes one contract: imported lifecycle history must live inside canonical `Position/Trade` truth, imported external close may backfill only from deterministic exchange trades, and operator history must expose distinct `openedAt` plus `closedAt` anchors.
- [x] `V1HIST-03 test(api-red): lock imported opening-history and external-close history parity`
  - 2026-04-29: Closed the imported opening-history red lock. Added focused boundary, hydrator, and reconciler coverage proving that imported lifecycle hydration is driven by canonical exchange trades, not by synthetic local history, and that closed imported positions remain visible in `historyItems` with both timestamps preserved.
- [x] `V1HIST-06 fix(api+web-read): expose truthful open/close timestamps in operator history surfaces`
  - 2026-04-29: Closed the first operator-truth slice of `V1HIST-A`. Runtime history positions now render separate `openedAt` and `closedAt` columns on the web, and a focused `bots.runtime-history-parity` regression proves that an externally closed imported `EXCHANGE_SYNC BOT_MANAGED` position remains present in `historyItems` with both timestamps preserved.
- [x] `V1HIST-04 fix(api-exchange+reconcile): hydrate imported position opening history through approved lifecycle entities`
  - 2026-04-29: Closed the first backend hydration slice. The exchange boundary now reads canonical trade history through the authenticated connector, imported-position hydration reconstructs the current open lifecycle when exchange fill truth is sufficient, persists imported `OPEN`/`DCA`/partial `CLOSE` trades without inventing local fills, and updates `position.openedAt` from the first canonical fill.
- [x] `V1HIST-05 fix(api-ledger+history): persist external close history for imported managed positions`
  - 2026-04-29: Closed by extending imported lifecycle hydration to the close path. When reconciliation confirms an imported managed position disappeared from exchange truth, it now backfills canonical exchange trade history for the final lifecycle window, persists missing imported `CLOSE` trades with `USER_EXCHANGE` attribution, and prefers the last canonical close fill timestamp over a local `now()` close when deterministic exchange truth is available.
- [x] `V1HIST-07 qa(closure): run focused history-truth pack and publish evidence`
  - 2026-04-29: Closed with `docs/operations/v1hist-imported-exchange-lifecycle-history-closure-2026-04-29.md`. Focused validation PASS: imported hydrator unit pack, live reconciliation pack, exchange boundary contract pack, runtime history parity e2e, API typecheck, web typecheck, and repository guardrails.
- [x] `V1REOPEN-06 fix(api+web-truth): align final operator truth for reopened LIVE positions`
  - 2026-04-29: Closed by repairing backend `showDynamicStopColumns` truth, reusing one shared web visibility helper across dashboard and monitoring runtime tables, and restoring bot-managed `TTP` fallback/sticky continuity in runtime serialization.
- [x] `V1EXCEL-01 audit(v1-gap-map): freeze the exact remaining gap map against DoD, integration, deployment, and activation contracts`
  - 2026-04-29: Closed by publishing `docs/operations/v1excel-gap-map-audit-2026-04-29.md` plus `docs/planning/v1excel-01-gap-map-audit-task-2026-04-29.md`. The audit freezes one explicit answer: no open core implementation or architecture gap remains for `V1`; the remaining blockers are fresh manual evidence, honest local full-confidence reproducibility, fresh stage/prod activation evidence, and one final operator-facing `GO / NO-GO` decision.
- [x] `V1EXCEL-02 qa(local-infra): restore fully reproducible local confidence path or classify the exact external blocker`
  - 2026-04-29: Closed by repairing local Prisma migration-history drift non-destructively with `migrate resolve`, documenting the recovery in engineering docs, and rerunning `pnpm run test:go-live:smoke` successfully. Canonical closure: `docs/operations/v1excel-local-confidence-path-closure-2026-04-29.md`.
Historical carryover snapshot, superseded by the active `NOW` entries above:

- Historical `V1EXCEL-03 qa(manual-matrix): execute the full critical manual UI/API/operator matrix`
  - 2026-04-29 status: IN_PROGRESS. Authenticated Soar production operator access is now available and the first production `PAPER` API/operator pass is recorded in `docs/operations/v1excel-paper-operator-verification-2026-04-29.md`. That evidence is now stronger than before: same-side add is truthful, post-deploy `PAPER` manual close now passes truthfully through the protected production API (`200`, open row removed, closed row preserved in runtime history, realized PnL reflected in free cash), and the authenticated dashboard UI now also shows the aligned `PAPER` state (`No open positions`, updated capital, `History` row `Close / Manual / User in app`). The remaining incomplete scope is browser-side action proof if desired plus the `LIVE` exchange-authority, mixed-origin, and restart/recovery scenarios. Canonical matrix: `docs/operations/v1excel-manual-verification-matrix-2026-04-29.md`.
- Historical `V1EXCEL-04 ops(stage-refresh): rerun the latest authenticated stage release gate and smoke on the current candidate`
  - 2026-04-29 status: BLOCKED by missing stage OPS/private-route auth. Public stage smoke PASS and dry-run rehearsal artifacts were refreshed: `docs/operations/v1excel-stage-refresh-2026-04-29.md`.
- Historical `V1EXCEL-05 ops(prod-refresh): rerun fresh production release-gate evidence families on the current candidate`
  - 2026-04-29 status: BLOCKED by stale prod evidence plus missing OPS/private-route auth. Public prod smoke PASS and prod gate dry-run was refreshed: `docs/operations/v1excel-prod-refresh-2026-04-29.md`.
- Historical `V1EXCEL-06 ops(runtime-observability): verify active LIVE worker/runtime diagnostics under current production truth`
  - 2026-04-29 status: BLOCKED by protected-route `401` on stage and prod runtime observability probes without OPS auth. Canonical status: `docs/operations/v1excel-runtime-observability-2026-04-29.md`.
  - 2026-05-01 production refresh: production runtime observability is now green with authenticated access. `ops:deploy:runtime-freshness` PASS, `ops:deploy:rollback-guard` PASS with `shouldRollback=false`, no reasons, no alerts, and `runningCount=4`. Stage runtime observability still needs separate authenticated evidence, so the broader V1 confidence gate remains open. Task packet: `docs/planning/v1excel-06-prod-runtime-observability-task-2026-05-01.md`.
- [x] `V1EXCEL-07 release(go-no-go): rebuild RC status/sign-off/checklist and publish final V1 excellence decision`
  - 2026-04-29: Closed with `NO-GO` for candidate `51acd9c445227a3ca8cc8b781564d14b55fda43f`. Canonical decision: `docs/operations/v1excel-final-go-no-go-2026-04-29.md`.
- [x] `V1EXCEL-08 docs(closure): sync canonical queue/context and freeze the final post-V1 handoff`
  - 2026-04-29: Closed by syncing queue/context and freezing the current truth: local confidence is green, but the final operational blockers are still `V1EXCEL-03..06`.
- [x] `DOCSYNC-2026-05-01-V1EXCEL-HISTORICAL-CARRYOVER docs(queue): mark older V1EXCEL carryover checkboxes non-active`
  - 2026-05-01: Closed a queue hygiene slice after `V1GATE-01` proved the
    active stage/prod truth had moved on from the 2026-04-29 carryover block.
    Older duplicate `V1EXCEL-03..06` entries in this historical section are now
    rendered as non-checkbox historical notes, so the only executable queue
    remains the current `NOW`/`BLOCKED` entries. Evidence:
    `docs/planning/docsync-2026-05-01-v1excel-historical-carryover-task.md`.
- [x] `V1TRUTH-05 test(api+web-red): lock pending external order versus position truth`
  - 2026-04-29: Closed by adding a focused `orders-positions.e2e` proof for the reported real-money baseline: one open `LIVE` position plus one pending external/manual exchange `DCA` order on the same symbol. Runtime session positions and dashboard aggregate both stay truthful: the position keeps its original quantity/notional, while the pending exchange order remains visible only in `openOrders` until fill confirmation arrives.
- [x] `V1TRUTH-06 fix(api+reads+web): harden order/position merge and operator presentation`
  - 2026-04-29: Closed by fixing the strongest confirmed drift above the green pending-order baseline. `livePositionReconciliation` now reuses the existing local `BOT`/`USER` managed `LIVE` position for the same owner and `symbol/side` identity instead of creating a second imported `EXCHANGE_SYNC` row when the exchange snapshot arrives. Focused validation PASS: `livePositionReconciliation.service.test.ts`, `orders-positions.e2e.test.ts`, manual-close/runtime/exchange packs, API typecheck, guardrails.
- [x] `V1TRUTH-07 docs+test(runtime-red): freeze and prove the final DCA/TTP/TSL rule`
  - 2026-04-29: Closed by freezing the exact `TTP` versus DCA nuance in the protection architecture refs and by adding focused shared-kernel plus runtime regressions for loss-side-only versus profit-side remaining DCA. Canonical task record: `docs/planning/v1truth-07-08-protection-rule-task-2026-04-29.md`.
- [x] `V1TRUTH-08 fix(api-runtime+web): align protection execution and operator truth`
  - 2026-04-29: Closed by refining the shared lifecycle kernel so `TTP` waits only for remaining profit-side DCA thresholds, while `SL` and `TSL` keep the stricter DCA-first fail-closed behavior. No separate web drift survived once the runtime kernel and regression pack were updated.
- [x] `V1TRUTH-09 qa(closure): run focused real-money truth pack and publish closure evidence`
  - 2026-04-29: Closed by running the focused API closure pack (`99/99 PASS`), focused web closure pack (`15/15 PASS`), API/web typecheck, and repository guardrails. Closure evidence: `docs/operations/v1truth-live-exchange-truth-closure-2026-04-29.md`.
- [x] `BOTMULTI-00 planning(post-v1): publish deferred multi-strategy reintroduction packet`
  - 2026-04-29: Published `docs/planning/botmulti-post-v1-multi-strategy-reintroduction-plan-2026-04-29.md` plus `docs/planning/botmulti-00-planning-task-2026-04-29.md`. The packet is intentionally deferred: multi-strategy-per-bot becomes a post-`V1` architecture wave only after `V1TRUTH-A` closes and production verification remains stable.
- [x] `V1MARK-03 fix(api-stream): add futures mark-price ingestion to the market-stream boundary`
- [x] `V1MARK-04 fix(api-runtime): prefer futures mark price in shared lifecycle-price resolution`
- [x] `V1MARK-05 qa(closure): run focused futures parity pack and publish closure evidence`
  - 2026-04-29: Closed the full `V1MARK-A` wave. Binance futures stream ingestion now includes `@markPrice@1s`, runtime ticker state preserves `markPrice` alongside `lastPrice`, and the shared lifecycle-price resolver now prefers futures mark price while keeping explicit last-price and candle-close fallback. Closure evidence: `docs/operations/v1mark-live-futures-mark-price-parity-closure-2026-04-29.md`. Validation PASS: focused market-stream, ticker-store, lifecycle-price, runtime-automation, and runtime-position-lifetime tests; `pnpm --filter api run typecheck`; `pnpm run quality:guardrails`.
- [x] `V1COVER-03 qa(runtime-pack): rerun broad runtime/order regression pack and classify real post-stabilization failures`
  - 2026-04-29: Closed by rerunning the broader runtime/order packs on the stabilized harness. The remaining false-reds were classified as invalid parallel DB-backed evidence when separate Vitest processes hit the same local Postgres concurrently; the sequential broad pack passed, so no new product drift was confirmed from this step.
- [x] `V1COVER-04 fix(runtime-or-orders): close the first real product drift that survives the stabilized pack`
  - 2026-04-29: Closed as a fixture-hardening slice inside `orders.service.test.ts`. One `LIVE` exchange-order persistence regression still failed in full-file execution due unstable test setup around separate API-key creation; the proof now uses one nested user+API-key fixture and the full `orders.service` file passes again.
- [x] `V1COVER-05 qa(closure): rerun stabilized LIVE runtime coverage pack and publish closure evidence`
  - 2026-04-29: Closed the full `V1COVER-A` wave. Sequential broad runtime/order coverage now passes with the stabilized harness, focused `orders.service` is green, API typecheck and repository guardrails are green, and closure evidence is published in `docs/operations/v1cover-live-runtime-regression-coverage-closure-2026-04-29.md`.
- [x] `GOLIVE-2026-04-29-A fix(tooling): harden local go-live smoke wrapper against existing infra and failed-migration diagnostics`
  - 2026-04-29: Closed the local smoke-wrapper hardening slice. `scripts/goLiveSmoke.mjs` now reuses already-running reachable Postgres/Redis when Docker Compose cannot bind `5432/6379`, avoids tearing down infra it did not start itself, and surfaces the local Prisma `P3009` blocker explicitly instead of failing with opaque mixed CLI noise. Canonical go-live packs remain green when run directly: `pnpm run test:go-live:api`, `pnpm run test:go-live:web`, `pnpm run typecheck`, and `pnpm run build`. The remaining blocker to a fully green umbrella smoke is external to repo code: local DB migration debt `20260424094500_add_single_context_bot_refs`.
- [x] `V1GUARD-01..05 docs+api+qa(closure): close final LIVE protection drifts for DCA/TTP/TSL parity`
  - 2026-04-29: Closed the full `V1GUARD-A` wave. Shared engine parity now keeps `TTP` behind the canonical `DCA-first` guard, exchange-confirmed `LIVE DCA` fills now converge runtime dedupe plus persisted runtime position state instead of leaving `currentAdds` stale after a submitted market add, and runtime protection evaluation now uses one explicit lifecycle-price seam instead of hardcoding raw ticker `lastPrice`. Closure evidence: `docs/operations/v1guard-live-protection-final-closure-2026-04-29.md`. Validation PASS: focused `positionManagement`, focused `runtimePositionAutomation`, focused `orders.exchangeEvents`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- [x] `V1GUARD-00 planning(queue): publish final LIVE protection hardening packet for DCA/TTP/TSL parity`
  - 2026-04-29: Published `docs/planning/v1guard-live-protection-final-hardening-plan-2026-04-29.md` to freeze the last confirmed money-impacting drifts after `V1SAFE-A`: `TTP` still bypasses the canonical `DCA-first` guard, async `LIVE DCA` fills can leave runtime state stale after exchange confirmation, and runtime protection still consumes ticker `lastPrice` directly instead of one explicit lifecycle-price seam. Validation PASS: `pnpm run quality:guardrails`.
- [x] `V1SAFE-00 planning(audit): publish LIVE protection and liquidation-safety analysis plus execution packet`
  - 2026-04-29: Published `docs/planning/v1safe-live-protection-and-liquidation-safety-plan-2026-04-29.md` after refining the scope to the exact remaining `LIVE` parity problem. The repository-level conclusion is that Soar still lacks one canonical `DCA/TTP/TSL` parity model for imported and recovered `LIVE` positions: runtime trailing execution depends on persisted management state, runtime read-models can still imply dynamic protection through fallback logic the engine cannot enforce, and `DCA-first` gating remains insufficiently proven across `backtest`, `paper`, and `live` for the reported real-account symptom class.
- [x] `V1SAFE-01..10 docs+api+web+qa(closure): close LIVE DCA/TTP/TSL parity for imported and recovered positions`
  - 2026-04-29: Closed the full `V1SAFE-A` wave. Architecture now freezes one explicit `LIVE` protection-state parity contract for imported and recovered positions, runtime regression coverage proves prospective `TTP` hydration from the adoption point, API dynamic-stop serialization now uses only canonical runtime trailing state and anchor truth, and dashboard/monitoring surfaces no longer overlay sticky display fallback that could imply stronger protection than runtime can execute. Closure evidence: `docs/operations/v1safe-live-dca-ttp-tsl-parity-closure-2026-04-29.md`. Validation PASS: focused `runtimePositionAutomation`, focused `runtimePositionSerialization`, API typecheck, web typecheck, focused `HomeLiveWidgets`, focused `BotsManagement`, and repository guardrails.
- [x] `V1PARITY-02 test(api-red): lock confirmed LIVE add-fill -> canonical position update and DCA attribution`
- [x] `V1PARITY-03 fix(api-events): reuse canonical add-update lifecycle for existing-position LIVE fills`
- [x] `V1PARITY-04 test(api-red): lock account-update scope to canonical position ownership`
- [x] `V1PARITY-05 fix(api-events): narrow account-update application to canonical owned position scope`
- [x] `V1PARITY-06 test(api-runtime-red): lock runtime/read-model strategy-context parity for LIVE managed positions`
- [x] `V1PARITY-07 fix(api-runtime+reads): remove or explicitly degrade symbol-level fallback when strategy context is unresolved`
- [x] `V1PARITY-08 test(api-ops-red): lock operator-visible telemetry for fail-closed LIVE automation skips`
- [x] `V1PARITY-09 fix(api-telemetry): emit canonical runtime diagnostics for skipped LIVE management actions`
- [x] `V1PARITY-10 qa(closure): run focused LIVE parity pack and publish closure evidence`
  - 2026-04-29: Closed the full `V1PARITY-A` wave. Canonical `LIVE` add fills now reuse fill-derived add-update lifecycle authority with explicit `DCA` attribution, `ACCOUNT_UPDATE` reconciliation is narrowed to canonical owned LIVE scope, runtime read models stop implying DCA/TSL strategy truth through symbol fallback when `position.strategyId` is missing, and fail-closed LIVE automation skips now emit operator-visible `PRETRADE_BLOCKED` runtime diagnostics. Closure evidence: `docs/operations/v1parity-live-runtime-lifecycle-parity-closure-2026-04-29.md`. Validation PASS: focused `orders.exchangeEvents`, `runtimePositionAutomation`, `bots.runtime-strategy-context`, focused DCA ladder e2e, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- [x] `DOCSYNC-2026-04-28-E docs(planning-history): normalize remaining historical status wording`
- [x] `DOCSYNC-2026-04-28-D docs(planning-catalog): refresh catalog index and correct stale UOLF queued header`
- [x] `DOCSYNC-2026-04-28-C docs(planning-status): close stale Active headers in already closed planning packets`
- [x] `QH-E2E-2026-04-28-A qa(api-e2e): stabilize full markets and wallets CRUD suites after focused regression closure`
- [x] `V1FIX-2026-04-26-B release(prod): deploy latest scoped-position/backtests closure pack to Coolify and rerun affected-account smoke`
- [x] `UXSAFE-2026-04-28-A fix(api-markets+wallets): harden active market-universe edit guard and wallet delete history cleanup`
- [x] `BOTLIVE-2026-04-28-A api(bot-guard): block active LIVE bot market-group overlap against other active LIVE bot scopes`
- [x] `V1RESTART-00 planning(queue): publish canonical LIVE restart continuity and recovery hardening packet`
- [x] `V1RESTART-01 docs(contract): freeze canonical LIVE restart and downtime continuity model`
- [x] `V1CLOSE-00 planning(queue): publish canonical close-attribution and external-close hardening packet`
- [x] `V1CLOSE-01 docs(contract): freeze canonical close-attribution model`
- [x] `V1CLOSE-02 test(api-red): lock missing close-attribution gaps on current write paths`
- [x] `V1CLOSE-03 db(schema): add canonical close-attribution fields`
- [x] `V1CLOSE-04 fix(api-runtime): persist USER_APP and BOT_APP on canonical app-driven closes`
- [x] `V1CLOSE-05 fix(api-events): preserve close attribution through exchange confirmation`
- [x] `V1CLOSE-06 fix(api-reconciliation): classify external manual close separately from repair cleanup`
- [x] `V1CLOSE-07 test(api+read-red): lock read-model and history attribution parity`
- [x] `V1CLOSE-08 fix(api+web): expose close attribution on operator surfaces`
- [x] `V1CLOSE-09 qa(closure): run focused close-attribution pack and sync docs/context`
## PIPELINE
- [x] `BOTMULTI-01 docs(decision): freeze post-V1 multi-strategy bot contract`
  - 2026-05-03: Closed after `SYSFINAL-09` satisfied the stable post-V1
    confidence prerequisite. Evidence:
    `docs/planning/botmulti-01-post-v1-multi-strategy-contract-task-2026-05-03.md`.
- [x] `BOTMULTI-02 audit(data+runtime): inventory legacy compatibility remnants and migration debt`
  - 2026-05-03: Closed after the user selected lower numeric strategy-link
    priority as canonical. Evidence:
    `docs/planning/botmulti-02-legacy-compatibility-migration-audit-task-2026-05-03.md`.
- [x] `BOTMULTI-03 db(schema): finalize canonical multi-strategy topology and migration path`
  - 2026-05-03: Closed with a fail-closed migration preflight and partial
    unique index enforcing at most one enabled `ACTIVE` `BotMarketGroup` per
    bot. Evidence:
    `docs/planning/botmulti-03-canonical-topology-migration-task-2026-05-03.md`.
- [x] `BOTMULTI-04 api(write): support bot create/update with multiple strategies`
  - 2026-05-03: Closed with focused API e2e coverage and typecheck. Evidence:
    `docs/planning/botmulti-04-api-write-multi-strategy-task-2026-05-03.md`.
- [x] `BOTMULTI-05 runtime(signal-merge): execute deterministic multi-strategy evaluation per bot`
  - 2026-05-03: Closed with
    `docs/planning/botmulti-05-runtime-signal-merge-task-2026-05-03.md`.
- [x] `BOTMULTI-06 runtime(risk+lifecycle): align DCA/TTP/TSL and ownership across multiple strategies`
  - 2026-05-03: Closed with
    `docs/planning/botmulti-06-runtime-risk-lifecycle-ownership-task-2026-05-03.md`.
- [x] `BOTMULTI-07 web(ui+operator): expose multi-strategy bot management and runtime truth`
  - 2026-05-03: Closed with
    `docs/planning/botmulti-07-web-operator-multi-strategy-truth-task-2026-05-03.md`.
- [x] `BOTMULTI-08 qa(closure): run architecture-to-runtime closure pack and publish evidence`
  - 2026-05-03: Closed with
    `docs/planning/botmulti-08-architecture-runtime-closure-task-2026-05-03.md`.
- [x] `V1LIVE-01 audit(api+docs): publish canonical live-execution and takeover regression packet`
- [x] `V1LIVE-02 test(api-exchange-red): lock adapter selection to exact user/bot exchange context`
- [x] `V1LIVE-03 fix(api-exchange): make adapter selection strictly follow user-selected exchange settings`
- [x] `V1LIVE-04 test(api-red): lock one canonical ownership classifier for imported LIVE positions`
- [x] `V1LIVE-05 fix(api-ownership): reuse one ownership classifier across reconciliation, runtime, and takeover`
- [x] `V1LIVE-06 test(api-red): lock fail-closed imported entry/fill truth`
- [x] `V1LIVE-07 fix(api-reconciliation): remove synthetic mark-price entry fallback and keep unresolved states explicit`
- [x] `V1LIVE-08 test(api-runtime-red): lock runtime visibility and close parity for owned imported LIVE positions`
- [x] `V1LIVE-09 fix(api-runtime): recover imported-position runtime visibility and close authority`
- [x] `V1TAKE-09 web(wallet-ui): remove API-key takeover toggles and keep wallet as the single editable management switch`
- [x] `V1READY-2026-04-25-C ops/deploy(sync): expose deployed commit truth and reconcile residual V1 activation artifacts`
- [x] `V1TAKE-08 qa(closure): rerun focused DB-backed API + web closure pack and sync canonical docs/context`
- [x] `V1TAKE-07 fix(api+web-orders): harden manual-order fill/context truth and fail-closed UI semantics`
- [x] `V1TAKE-06 test(api+web-red): lock manual PAPER/LIVE open truth from dashboard submission to order/position state`
- [x] `V1TAKE-05 fix(api-runtime): align runtime position adoption with canonical owned external-position truth`
- [x] `V1TAKE-04 test(api-runtime-red): lock deterministic runtime visibility for owned exchange-synced LIVE positions`
- [x] `V1TAKE-03 fix(api-positions): unify external-position management contract and takeover status ownership`
- [x] `V1TAKE-02 test(api-red): lock takeover authority drift between API key, wallet, and bot visibility`
- [x] `V1TAKE-01 audit(api+runtime): publish confirmed ownership/manual-order investigation packet with DB-backed validation`
- [x] `V1TAKE-A planning queued (exchange takeover ownership and manual-order truth closure after fresh live investigation)`
- [x] `XVENUE-04 refactor(api-exchange): registry-driven adapter-family entrypoints`
- [x] `XVENUE-05 refactor(api-markets-engine): remove direct exchange SDK access from feature modules`
- [x] `XVENUE-06 test(api): add no-mixing parity coverage`
- [x] `XVENUE-07 refactor(api-ops): align worker topology truth`
- [x] `XVENUE-08 qa(closure): rerun focused closure pack and sync docs/context`
- [x] `XADAPT-02 audit(api-exchange): classify Binance-specific assumptions across orders, exchange, and reconciliation paths`
- [x] `XADAPT-01 docs(contract): freeze exchange execution capability matrix for authenticated reads and write-side execution`
- [x] `XADAPT-03 refactor(api-exchange): expose one canonical exchange adapter boundary for write and authenticated-read consumers`
- [x] `XADAPT-04 test(api-binance): add focused Binance adapter contract coverage for live submit and reconciliation-facing reads`
- [x] `XADAPT-05 qa(closure): run focused exchange-adapter closure pack and sync canonical docs/context`
- [x] `XADAPT-06 planning(readiness): publish staged next-exchange rollout packet after Binance boundary closure`
- [x] `V1REG-02 qa(auto): execute architecture-v1 automated verification pack and record function-by-function status`
- [x] `V1READY-2026-04-25-B ops/signoff(sync): rebuild RC sign-off artifact and publish final V1 READY/BLOCKED launch decision`
- [x] `V1READY-2026-04-25-A docs/ops(sync): reconcile final V1 activation truth, remaining blockers, and operator handoff`
- [x] `V1COH-04 fix(api-reconciliation): tighten exchange-synced order/position adoption around manual LIVE opens`
- [x] `V1COH-03 test(api-runtime-red): lock manual LIVE market submitted->reconciled truth across order, open order, and position visibility`
- [x] `V1REG-01 docs(audit): publish architecture-v1 functionality inventory and reusable regression checklist`
- [x] `V1COH-01 test(api-red): lock manual LIVE order against out-of-scope symbol and unresolved strategy context`
- [x] `V1COH-02 fix(api-orders): enforce inherited wallet+venue context and fail closed for unresolved LIVE manual scope`
- [x] `DOCSYNC-2026-04-25-B docs(sync): remove closed PAPERPNL entry from TASK_BOARD READY lane`
- [x] `DOCSYNC-2026-04-25-A docs(sync): remove stale V1POSTBOT full-api red-suite drift from project state`
- [x] `DEPLOY-2026-04-25-B qa(web-build): validate Coolify deploy hotfix locally and sync closure evidence`
- [x] `PAPERPNL-02 test(api-runtime): lock profitable PAPER EXIT realized-PnL sign for canonical LONG and SHORT closes`
- [x] `PAPERPNL-01 fix(api-runtime): recover truthful PAPER close PnL and wallet-capital updates for manual/runtime exits`
- [x] `V1SURF-B planning queued (residual operator-surface truth closure after V1LIFE)`
- [x] `V1SURF-05 web(aggregate-truth): remove selected-bot dashboard aggregate fallback and fail closed on aggregate errors`
- [x] `V1SURF-06 web(inherited-venue): align runtime sidebar and manual-order estimate semantics to inherited bot context`
- [x] `V1SURF-07 web(bot-monitoring-context): align quick-context/control venue labels and capability checks to inherited context`
- [x] `V1SURF-08 qa(closure): rerun focused residual surface-truth pack and sync canonical docs/context`
- [x] `V1LIFE-01 docs+web(contract): freeze and expose 0=no-limit semantics for strategy order/position lifetime`
- [x] `V1LIFE-02 api(shared-lifetime): add one canonical strategy-lifetime resolver for order and position policies`
- [x] `V1FINAL-03 qa(prod-closure): rerun focused runtime closure pack and capture remaining infra-only blockers`
- [x] `V1FINAL-02 api/ops(paper-order-recovery): classify and recover orphaned PAPER MARKET manual orders persisted pre-fix as OPEN without fill/position`
- [x] `V1LIFE-A planning queued (order/position lifetime enforcement plus dashboard open-order cancel control)`
- [x] `V1LIFE-03 api(order-lifetime): enforce strategy-configured order lifetime via canonical cancel path`
- [x] `V1LIFE-04 api(position-lifetime): enforce strategy-configured position lifetime via canonical close lifecycle`
- [x] `V1LIFE-05 web(open-orders-action): add final Action column with cancel affordance in dashboard Orders tab`
- [x] `V1LIFE-06 qa(closure): run focused lifetime/order-control pack and sync canonical docs/context`
- [x] `V1FINAL-A planning queued (final runtime closure after full repo green plus fresh production aggregate audit)`
- [x] `V1FINAL-01 api(aggregate-session-truth): keep aggregate sessionDetail finishedAt null while any session is still RUNNING`
- [x] `V1MON-A planning queued (bot monitoring runtime-truth hardening after post-V1IND surface audit and explicit fail-closed decision)`
- [x] `V1MON-01 web(aggregate-truth): remove client-side monitoring aggregate fallback and fail closed on backend aggregate errors`
- [x] `V1MON-02 web(inherited-context): make bot list and bot management prefer inherited venue/strategy context over duplicated bot snapshot fields`
- [x] `V1MON-03 web(signal-semantics): align bot monitoring future-signals semantics with dashboard-home runtime truth`
- [x] `V1MON-04 qa(closure): rerun focused monitoring truth pack and sync canonical queue/context`
- [x] `V1SIGSEM-A planning queued (signal-surface semantic hardening so configured-only rows read as closed-candle market snapshots, not pseudo-signals)`
- [x] `V1SIGSEM-01 web(copy+semantics): label configured-only runtime rows as market snapshots across dashboard-home and bot monitoring`
- [x] `V1POSTBOT-A planning queued (post-V1BOT full API contract recovery for pre-trade, orders, and runtime-session positions)`
- [x] `V1POSTBOT-01 audit(pretrade): classify failing pre-trade/backtest expectations against the approved singular bot contract`
- [x] `V1POSTBOT-02 fix(api-backtests-pretrade): align backtests/pre-trade behavior and fixtures to the singular bot contract`
- [x] `V1POSTBOT-03 fix(api-orders): keep singular manual-order persistence deterministic for bot, wallet, and strategy ownership`
- [x] `V1POSTBOT-04 fix(api-runtime-positions): recover runtime positions read/close parity for carryover open orders and exchange-synced LIVE ownership`
- [x] `V1POSTBOT-05 qa(closure): rerun focused failing suites plus full API pack and sync canonical docs/context`
- [x] `V1IND-A planning queued (canonical indicator parity and truthful signal-surface recovery after V1BOT closure and production signal audit)`
- [x] `V1IND-01 docs(decision): reconcile indicator parity architecture and freeze one canonical V1 registry scope`
- [x] `V1IND-02 api(registry): replace standalone strategy-builder indicator metadata with canonical registry-backed metadata`
- [x] `V1IND-03 api(signal-analysis): remove subset fallback indicator formatter from signal read models and reuse canonical runtime analysis truth`
- [x] `V1IND-04 api(read-model): derive signal-surface venue context only from inherited symbol-group market universe`
- [x] `V1IND-05 web(signal-surface): distinguish configured market snapshot from evaluated runtime decision and remove opaque X placeholders`
- [x] `V1IND-06 test(parity-matrix): add explicit parity coverage for every builder-exposed indicator across builder metadata, runtime, and backtest`
- [x] `V1IND-07 qa(closure): run focused closure pack and sync canonical docs/context`
- [x] `V1DASH-A planning queued (dashboard operator truth hardening after singular bot migration and manual-order recovery)`
- [x] `V1BOTSURF-A planning queued (bot operator surface truth hardening after singular bot migration and dashboard truth audit)`
- [x] `V1SURF-A planning queued (cross-surface runtime-truth alignment after dashboard and bot audits)`
- [x] `V1BOT-A planning queued (single-context bot architecture migration with inherited wallet, market-group, and strategy context)`
- [x] `V1BOT-09 api+web(manual-order): recover dashboard manual-order truth and singular-context execution for PAPER and LIVE`
- [x] `V1DASH-01 web(capital-kpis): align selected-bot dashboard capital KPIs to authoritative runtime capital summary`
- [x] `V1DASH-02 web(pending-state): expose pending open-order and waiting-for-fill truth in selected-bot dashboard surfaces`
- [x] `V1DASH-03 web(degraded-state): make running-but-non-actionable runtime states explicit on the dashboard`
- [x] `V1DASH-04 qa(closure): run focused dashboard truth pack and sync canonical docs/context`
- [x] `V1BOT-12 web(bot-monitoring-capital): align bot monitoring capital widgets to authoritative runtime capital summary`
- [x] `V1BOT-13 web(bot-list-truth): distinguish bot configuration baseline from active runtime capital truth`
- [x] `V1BOT-14 web(bot-monitoring-states): expose pending open-order and degraded runtime states in bot monitoring`
- [x] `V1BOT-15 qa(closure): run focused bot-surface truth pack and sync canonical docs/context`
- [x] `V1SURF-01 web(shared-capital-truth): align repeated capital/equity presentation math to canonical runtime capital summary semantics`
- [x] `V1SURF-02 web(shared-operator-state): define explicit pending/degraded runtime state badges and copy across dashboard-home and bot monitoring`
- [x] `V1SURF-03 web(bot-monitoring-state-truth): surface runtime market-state/context truth beyond raw signal direction`
- [x] `V1SURF-04 qa(closure): run focused cross-surface truth pack and sync canonical docs/context`
- [x] `V1BOT-01 docs(architecture): freeze single-context bot contract`
- [x] `V1BOT-02 db(schema): add direct bot references for symbolGroup and strategy; classify legacy topology`
- [x] `V1BOT-03 db(migration): backfill single-context refs from legacy topology and fail-closed on incompatible bots`
- [x] `V1BOT-04 api(commands): collapse create/update validation onto inherited single-context contract`
- [x] `V1BOT-05 api(reads): expose bot runtime context as inherited and singular`
- [x] `V1BOT-06 engine(runtime-topology): replace multi-group runtime topology with singular bot context`
- [x] `V1BOT-07 engine(capital-strategy-inheritance): source runtime parameters from wallet and strategy modules`
- [x] `V1BOT-07B fix(api-paper-capital): keep PAPER runtime capital bot-scoped under the linked wallet and align selected-bot monitoring reads to inherited execution context`
- [x] `V1BOT-08 web(bot-crud): align create/edit/detail flows to the singular contract`
- [x] `V1BOT-10 cleanup(legacy-runtime): remove legacy topology from canonical runtime path`
- [x] `V1BOT-11 qa(closure): full parity and migration closure pack`
- [x] `V1RT-02 fix(api-market-stream-endpoint): select Binance websocket default by runtime market type`
- [x] `V1ALIGN-A planning queued (runtime worker-ownership alignment plus symbol-scope, interval-truth, freshness-authority, and diagnostics closure)`
- [x] `V1ALIGN-01 docs(architecture-worker-ownership): freeze split workers as deployed target and inline as local/degraded-only contract`
- [x] `V1ALIGN-02 fix(api-runtime-symbol-scope): keep empty resolved symbol scope fail-closed instead of widening to wildcard routing`
- [x] `V1ALIGN-03 fix(api-signal-interval-truth): persist truthful runtime signal interval/window metadata`
- [x] `V1ALIGN-04 fix(api-runtime-freshness-authority): scope freshness truth to active runtime sessions instead of global latest-signal presence`
- [x] `V1ALIGN-05 fix(api-runtime-diagnostics): make no-route and missing-runtime-input conditions explicit operator telemetry where architecture allows`
- [x] `V1ALIGN-06 qa(closure): run focused runtime-alignment closure pack and sync canonical docs/context`
- [x] `V1SIG-A planning queued (runtime signal delivery recovery, truthful operator diagnostics, and paper reset capital parity after production investigation)`
- [x] `V1CAP-A planning queued (wallet capital authority recovery for PAPER reset checkpoints and LIVE post-deposit exchange balance changes)`
- [x] `V1CAP-01 docs(capital-authority): freeze wallet capital rules for PAPER reset and LIVE post-deposit recovery`
- [x] `V1CAP-02 test(wallet-runtime): add focused regression coverage for reset checkpoint and refreshed exchange balance semantics`
- [x] `V1CAP-03 fix(wallet-runtime): align runtime capital snapshot and wallet/operator read-model behavior`
- [x] `V1CAP-04 fix(wallet-ui): expose capital source/allocation/reset truth in wallet and runtime monitoring surfaces`
- [x] `V1CAP-05 qa(wallet-closure): run focused wallet/runtime closure pack and sync docs/context`
- [x] `V1CONF-A planning queued (post-approval V1 confidence hardening and signal-quality closure)`
- [x] `V1CONF-07 test(signal-cleanup): reduce remaining non-failing web warning noise outside the high-signal confidence pack`
- [x] `V1CONF-06 test(i18n-signal): reduce remaining I18nProvider act warnings and route-namespace noise in high-signal web suites`
- [x] `V1CONF-01 docs(sync): align canonical phase + queue with approved V1 and confidence-hardening mode`
- [x] `V1CONF-02 test(web-route-context): continue removing false i18n/noise drift from high-signal dashboard table tests`
- [x] `V1CONF-03 investigate(web-test-noise): isolate remaining AggregateError source after route-context cleanup`
- [x] `V1CONF-04 qa(confidence): rerun focused web confidence pack, guardrails, and selected go-live evidence where applicable`
- [x] `V1CONF-05 docs(sync): refresh confidence findings in context and activation notes if any runtime-relevant truth changes`
- [x] `SAFEV1-10 qa(closure): run focused V1 runtime safety pack and publish closure evidence`
- [x] `REVIEW-B-07 refactor(api-ops): make exchange snapshots and watchdog scope explicit and deterministic`
- [x] `REVIEW-B-08 qa(closure): run focused production-readiness pack and publish closure evidence`
- [x] `XLIFE-07 docs(contract): freeze one shared PAPER/LIVE fill adapter boundary`
- [x] `XLIFE-08 refactor(api-shared): converge PAPER and LIVE execution onto one canonical fill-result application path`
- [x] `XLIFE-09 audit(api-exchange-scope): inventory runtime watchdog, automation, and reconciliation exchange-truth drift`
- [x] `XLIFE-10 refactor(api-exchange-scope): make watchdog and runtime infrastructure explicit about exchange truth`
- [x] `XLIFE-11 test(api+e2e): run critical-path regression pack for signal -> order -> fill -> position parity`
- [x] `XLIFE-12 docs(sync): publish closure evidence and freeze future-agent execution-extension rules`
- [x] `CQLT-33 qa(closure): run full quality closure pack and publish maintainability delta evidence`
- [x] `CQLT-25 refactor(api-orders): split manual-order context, quantity-rule normalization, lifecycle authority, and persistence mapping out of orders.service`
- [x] `CQLT-26 refactor(api-bots): split command validation, canonical bot context checks, and projection-drift helpers out of botsCommand.service`
- [x] `CQLT-27 refactor(api-backtests): split range resolution, symbol preparation, report lifecycle, and timeline helpers out of backtests.service`
- [x] `CQLT-28 refactor(api-exchange): centralize exchange/ccxt bootstrap and capability access behind narrower adapter entrypoints`
- [x] `CQLT-29 test(api): add focused regression packs for orders, bots, backtests, and exchange-rule access after service decomposition`
- [x] `CQLT-30 docs(inventory): catalog fallback/default patterns as allowed, temporary, or forbidden`
- [x] `CQLT-31 refactor(shared): replace forbidden hidden fallbacks in non-critical quality paths with explicit unresolved states where safe`
- [x] `CQLT-32 docs(decision): freeze legacy bridge sunset list and mark compatibility-only code paths that remain intentional`
- [x] `CQLT-34 docs(sync): update queue/context/module docs and capture post-wave coding rules for future agents`
## GROUP QUEUE
- [x] `V1PARITY-A planning queued (LIVE runtime lifecycle parity hardening for DCA fills, account-update scope, strategy-context truth, and operator diagnostics)`
- [x] `V1RESTART-A planning queued (restart-safe LIVE position continuity, event-first recovery, staged reconcile, and post-restart automation restoration)`
- [x] `V1CLOSE-A planning queued (canonical close-attribution model for bot-close, app-close, exchange-manual close, liquidation, and repair semantics)`
- [x] `V1LIVE-A planning queued (exchange-selected live execution, Binance Spot/Futures first adapter family, takeover ownership, imported-position runtime parity, and paper/live boundary hardening)`
- [x] `V1FACT-A planning queued (V1 production activation through release-gate truth, stage/prod evidence freshness, backup/rollback proof, and final sign-off packaging)`
- [x] `V1FACT-A1 (commits V1FACT-01..V1FACT-03): contract + audit + queue truth`
- [x] `V1FACT-A2 (commits V1FACT-04..V1FACT-07): release-gate freshness + stage rehearsal evidence`
- [x] `V1FACT-A3 (commits V1FACT-08..V1FACT-09): rollback/backup proof as first-class gate inputs`
- [x] `V1FACT-A4 (commits V1FACT-10..V1FACT-11): final activation pack + closure sync`
- [x] `REVIEW-D planning queued (live opt-in admission truth, orphan bot-position fail-closed safety, canonical takeover rebind, and readiness-truth hardening)`
- [x] `REVIEW-D1 (commits REVIEW-D-01..REVIEW-D-03): runtime live opt-in admission truth`
- [x] `REVIEW-D2 (commits REVIEW-D-04..REVIEW-D-05): orphan bot-origin automation fail-closed contract`
- [x] `REVIEW-D3 (commits REVIEW-D-06..REVIEW-D-07): canonical takeover-rebind ownership truth`
- [x] `REVIEW-D4 (commits REVIEW-D-08..REVIEW-D-10): readiness-truth hardening + closure evidence`
- [x] `SAFEV1-A planning queued (V1 runtime safety closure for zero-entry reconciliation, fail-closed live capital truth, canonical external ownership, and explicit limiter degradation policy)`
- [x] `SAFEV1-A1 (commits SAFEV1-01..SAFEV1-03): zero-entry reconciliation truth closure`
- [x] `SAFEV1-A2 (commits SAFEV1-04..SAFEV1-05): fail-closed live capital truth`
- [x] `SAFEV1-A3 (commits SAFEV1-06..SAFEV1-07): canonical external ownership resolution`
- [x] `SAFEV1-A4 (commits SAFEV1-08..SAFEV1-09): production rate-limit degradation hardening`
- [x] `SAFEV1-A5 (commit SAFEV1-10): focused closure validation and evidence sync`
- [x] `RELEASE-HARDEN-A planning queued (one canonical V1 release gate entrypoint over existing release/smoke/runtime checks)`
- [x] `RELEASE-HARDEN-A group closure (canonical V1 release gate command + runbook + checklist sync)`
- [x] `REVIEW-C planning queued (runtime-state replay truth + snapshot error normalization + reconciliation truth closure)`
- [x] `REVIEW-C1 (commits REVIEW-C-01..REVIEW-C-03): canonical replay truth after completed DCA dedupe reuse`
- [x] `REVIEW-C2 (commits REVIEW-C-04..REVIEW-C-06): operator snapshot error truth and disappearing-order reconciliation truth`
- [x] `REVIEW-C3 (commit REVIEW-C-07): focused closure validation and evidence sync`
- [x] `REVIEW-B planning queued (post-XLIFE runtime/exchange production-readiness closure)`
- [x] `REVIEW-B1 (commits REVIEW-B-01..REVIEW-B-03): DCA lifecycle parity and add-leg fill truth`
- [x] `REVIEW-B2 (commits REVIEW-B-04..REVIEW-B-05): submitted-order retry truth and dedupe non-terminality`
- [x] `REVIEW-B3 (commits REVIEW-B-06..REVIEW-B-07): deterministic operator snapshot ownership and watchdog scope truth`
- [x] `REVIEW-B4 (commit REVIEW-B-08): focused closure validation and evidence sync`
- [x] `XLIFE-A planning queued (one canonical PAPER/LIVE execution lifecycle, fill-truth accounting, and explicit exchange-scope runtime contracts)`
- [x] `XLIFE-A1 (commits XLIFE-01..XLIFE-03): lifecycle contract freeze + before-state audit + red tests`
- [x] `XLIFE-A2 (commits XLIFE-04..XLIFE-06): close-state truth + fill-price truth + realized-PnL truth`
- [x] `XLIFE-A3 (commits XLIFE-07..XLIFE-08): one shared PAPER/LIVE fill-application path`
- [x] `XLIFE-A4 (commits XLIFE-09..XLIFE-10): runtime watchdog and automation exchange-scope truth`
- [x] `XLIFE-A5 (commits XLIFE-11..XLIFE-12): critical-path closure validation + future-agent rules`
- [x] `TRUTH-A planning queued (fail-closed LIVE key ownership + exchange contract truth + web guardrail truthfulness)`
- [x] `TRUTH-A1 (commits TRUTH-01..TRUTH-04): fail-closed LIVE order credential ownership`
- [x] `TRUTH-A2 (commits TRUTH-05..TRUTH-09): explicit authenticated exchange-read support and truthful route contracts`
- [x] `TRUTH-A3 (commits TRUTH-10..TRUTH-12): JSX/presenter hardcoded UI guardrail hardening and residual runtime copy closure`
- [x] `TRUTH-A4 (commits TRUTH-13..TRUTH-14): focused closure validation, evidence, and future-agent rule freeze`
- [x] `SCALE-A planning queued (post-L10NQ anti-drift foundation: truthful guardrails, canonical exchange access, and web container ownership closure)`
- [x] `SCALE-A (commits SCALE-01..SCALE-05): anti-drift contract + guardrail truthfulness + current-state inventory sync`
- [x] `SCALE-B (commits SCALE-06..SCALE-10): canonical exchange access boundary and focused API regression lock`
- [x] `SCALE-C (commits SCALE-11..SCALE-16): HomeLiveWidgets and BacktestRunDetails container-ownership closure`
- [x] `SCALE-D (commit SCALE-17): closure evidence + future-agent coding rules + canonical sync`
- [x] `L10NQ-E planning queued (residual route-reachable i18n debt closure + audit signal-quality hardening after CQLT closure)`
- [x] `L10NQ-E group closure (residual route-reachable i18n debt closure + audit signal-quality hardening after CQLT closure)`
- [x] `CQLT planning queued (code-quality and maintainability remediation across i18n hardcoding, monolith seams, shared-helper duplication, adapter ownership, and fallback discipline)`
- [x] `CQLT-A (commits CQLT-01..CQLT-05): inventory + contract freeze + extraction-order rules`
- [x] `CQLT-B (commits CQLT-06..CQLT-10): new-debt guardrails for copy, file budgets, and helper duplication`
- [x] `CQLT-C (commits CQLT-11..CQLT-15): i18n/hardcoded-copy cleanup foundations`
- [x] `CQLT-D (commits CQLT-16..CQLT-19): shared helper extraction before large web splits`
- [x] `CQLT-E (commits CQLT-20..CQLT-24): web monolith decomposition under parity tests`
- [x] `CQLT-F (commits CQLT-25..CQLT-29): API monolith and exchange-adapter ownership decomposition`
- [x] `CQLT-G (commits CQLT-30..CQLT-34): fallback/legacy catalog, closure validation, and coding-rule sync`
- [x] `ARCCON planning queued (architecture conformance remediation across domain ownership, runtime services, async contracts, and route-level operator surfaces)`
- [x] `ARCCON group closure (commits ARCCON-01..ARCCON-12): fail-closed context ownership + worker-ownership contract + backtest lifecycle hardening + bot-route i18n ownership sync`
- [x] `UOLF planning queued (unified order lifecycle + exchange-sync parity for manual and bot opens)`
- [x] `UOLF-A (commits UOLF-01..UOLF-04): contract freeze + failing lifecycle/scope regressions`
- [x] `UOLF-B (commits UOLF-05..UOLF-09): backend unified lifecycle authority + paper/live parity`
- [x] `UOLF-C (commits UOLF-10..UOLF-13): exchange import/reconciliation + dashboard operator parity`
- [x] `UOLF-D (commits UOLF-14..UOLF-15): docs sync + live-safety closure validation`
- [x] `WAPR planning queued (wallets list api-key status + paper reset safety)`
- [x] `WAPR-A (commits WAPR-01..WAPR-04): contract freeze + wallet-list regression + reset red tests`
- [x] `WAPR-B (commits WAPR-05..WAPR-08): API reset command + reset-aware capital baseline + web action`
- [x] `WAPR-C (commits WAPR-09..WAPR-10): docs sync + closure validation`
- [x] `BTCF-A (commits BTCF-01..BTCF-04): contract freeze + list API enrich + list UI parity`
- [x] `BTCF-B (commits BTCF-05..BTCF-09): create range/validation/layout + backend explicit-range execution`
- [x] `BTCF-C (commits BTCF-10..BTCF-12): i18n/docs sync + closure validation + compatibility lock`
- [x] `OOSC-A (commits OOSC-01..OOSC-03): contract freeze + API origin/source plumbing`
- [x] `OOSC-B (commits OOSC-04..OOSC-06): web source column + mapping + regressions`
- [x] `OOSC-C (commits OOSC-07..OOSC-08): docs sync + closure validation`
- [x] `DAWR-A (commits DAWR-01..DAWR-03): contract freeze + aggregate API regression/fix`
- [x] `DAWR-B (commits DAWR-04..DAWR-07): web wallet + strategy edge-case regressions/fixes`
- [x] `DAWR-C (commits DAWR-08..DAWR-10): ops docs + planning sync + closure`
- [x] `DAGG-A (commits DAGG-01..DAGG-04): contract freeze + dashboard aggregate data-source migration`
- [x] `DAGG-B (commits DAGG-05..DAGG-08): history positions parity + aggregate API contract hardening`
- [x] `DAGG-C (commits DAGG-09..DAGG-10): parity regression closure + canonical sync`
- [x] `SBSC-A (commits SBSC-01..SBSC-03): decision freeze + API projection mismatch regression + canonical-first mapper fix`
- [x] `SBSC-B (commits SBSC-04..SBSC-06): drift detection/repair path + sidebar switch regression locks`
- [x] `SBSC-C (commits SBSC-07..SBSC-08): closure validation + canonical sync`
- [x] `SOPR-A (commits SOPR-01..SOPR-04): source-of-truth closure + signal-context hardening`
- [x] `SOPR-B (commits SOPR-05..SOPR-08): dashboard/preview parity closure for signals/positions/history`
- [x] `SOPR-C (commits SOPR-09..SOPR-12): manual-order lifecycle decision + implementation + closure`
- [x] `MURC-A (commits MURC-01..MURC-04): contract freeze + shared resolver + market sync/auto-group adoption`
- [x] `MURC-B (commits MURC-05..MURC-07): backtest/runtime/manual-order adoption + integration parity`
- [x] `MURC-C (commits MURC-08..MURC-12): web alignment + e2e smoke + docs sync + closure`
- [x] `DASHR-A (commits DASHR-01..DASHR-04): dashboard tab/view parity + selected-bot section consistency`
- [x] `DASHR-B (commits DASHR-05..DASHR-08): selected-bot runtime data parity for positions/history/signals scope`
- [x] `DASHR-C (commits DASHR-09..DASHR-11): signal->order execution diagnostics + closure`
- [x] `BRS-A (commits BRS-01..BRS-04): decision closure + strict selected-bot scope foundation`
- [x] `BRS-B (commits BRS-05..BRS-08): canonical update-path fix + strategy precedence unification`
- [x] `BRS-C (commits BRS-09..BRS-12): dashboard switch regression + QA closure`
- [x] `UXR-G-A (commits UXR-G-01..UXR-G-03): dashboard wallet/manual-order hierarchy + summary-row contract`
- [x] `UXR-G-B (commits UXR-G-04..UXR-G-06): 50/50 wallet KPI split + regression closure`
- [x] `UXR-H-A (commits UXR-H-01..UXR-H-03): manual-order advanced contract + backend context/rules foundation`
- [x] `UXR-H-B (commits UXR-H-04..UXR-H-07): dashboard manual-order state+UI expansion + container cleanup`
- [x] `UXR-H-C (commits UXR-H-08..UXR-H-10): i18n parity + focused regression + closure sync`
- [x] `UXR-I-A (commits UXR-I-01..UXR-I-04): refresh contract + gap inventory + shared guardrails`
- [x] `UXR-I-B (commits UXR-I-05..UXR-I-08): wrapper parity + wallets/markets/backtests residual migration`
- [x] `UXR-I-C (commits UXR-I-09..UXR-I-12): strategies/bots consistency closure + standardized form UX`
- [x] `UXR-I-D (commits UXR-I-13..UXR-I-14): focused regression + closure sync`
- [x] `UXR-J-A (commits UXR-J-01..UXR-J-04): table action/dropdown/trigger shared contract refresh`
- [x] `UXR-J-B (commits UXR-J-05..UXR-J-07): focused regression alignment across shared and consuming tables`
- [x] `UXR-J-C (commit UXR-J-08): closure checks + canonical sync`
- [x] `PLNC-A (commits PLNC-01..PLNC-04): planning catalog reconciliation + status sync + canonical linkage`
- [x] `PLNC-C (commits PLNC-06..PLNC-08): stale planning-status/header parity sweep + canonical queue/context sync`
- [x] `PLNC-D (commit PLNC-09): mvp-execution phase-status parity sync for closed waves`
- [x] `ARC-A (commits ARC-01..ARC-05): runtime critical-path decomposition foundations`
- [x] `ARC-B (commits ARC-06..ARC-10): bots runtime CQRS/read-model decomposition + aggregate monitoring contract`
- [x] `ARC-C (commits ARC-11..ARC-13): shared runtime/backtest indicator kernel + backtest facade alignment`
- [x] `ARC-D (commits ARC-14..ARC-18): web container slimming + DataTable split + remaining i18n literal cleanup`
- [x] `ARC-E (commits ARC-19..ARC-20): guardrail tightening + architecture closure evidence`
- [x] `POS-A (commits POS-36..POS-38): lifecycle contract parity foundations across backtest/paper/live`
- [x] `POS-B (commits POS-39..POS-42): runtime DCA execution parity + golden fixtures + operator QA`
- [x] `OPV-A (commits OPV-01..OPV-04): production rehearsal + live-takeover verification + exit-gate closure`
- [x] `L10NQ-D-A (commits 01-05): inventory + guardrail hardening + auth/admin migration`
- [x] `L10NQ-D-B (commits 06-10): reports/markets/backtests/bots/home copy migration`
- [x] `L10NQ-D-C (commits 11-18): shared foundation localization + parity/smoke/closure`
- [x] `DBSEL-A (commits DBSEL-01..DBSEL-05): dashboard mixed-mode selector parity hotfix (LIVE + PAPER)`
- [x] `UXR-E-A (commits UXR-E-01..UXR-E-04): table action system + clone foundation`
- [x] `UXR-E-B (commits UXR-E-05..UXR-E-08): action rollout + dashboard manual-order/wallet polish`
- [x] `UXR-E-C (commits UXR-E-09..UXR-E-12): shell polish + regression closure`
- [x] `UXR-F-A (commits UXR-F-01..UXR-F-04): shared dashboard form-system foundation + guardrails`
- [x] `UXR-F-B (commits UXR-F-05..UXR-F-08): wrapper/i18n shell unification + wallets/markets/backtests migration`
- [x] `UXR-F-C (commits UXR-F-09..UXR-F-12): strategies/bots migration + standardized form UX/mobile action bar`
- [x] `UXR-F-D (commits UXR-F-13..UXR-F-14): focused regression pack + closure sync`
- [x] `QH-LINT-A (commits QH-LINT-01..QH-LINT-02): post-closure web build warning reduction and hook-deps stabilization`
- [x] `QH-TSC-A (commit QH-TSC-01): canonical web build+typecheck verification script`
- [x] `UXR-A (commits 01-05): ownership + open-orders parity foundations`
- [x] `UXR-B (commits 06-15): dashboard/table/action UX + markets/profile/wallet baseline`
- [x] `UXR-C (commits 16-22): advanced table rollout + logs module completion`
- [x] `UXR-D (commits 23-30): bots IA/runtime polish + breadcrumb/footer + regression closure`
- [x] `BTMM-A (commits 01-05): multi-market parity contract + core backtest fixes`
- [x] `BTMM-B (commits 06-10): cache continuity + UI/source-of-truth alignment + regressions`
- [x] `BTMM-C (commits 11-12): confidence pack + closure`
- [x] `L10NQ-A (commits 01-05): i18n P0 blockers (backtest clamp + wrapper hardcoded copy)`
- [x] `L10NQ-B (commits 06-11): per-module namespace split + parity/guardrail tests`
- [x] `L10NQ-C (commits 12-15): route-level namespace loading + English docs normalization`
## BLOCKED
- Historical `V1EXCEL-03..06 confidence gates: finish authenticated manual operator, stage/prod, and runtime observability evidence`
  - 2026-05-01: `V1ROE-04` is no longer blocked; it is closed by authenticated production evidence. Production runtime observability under `V1EXCEL-06` is also green with auth. The remaining blocked or incomplete V1 confidence scope was the separate `V1EXCEL` evidence wave: full manual matrix, authenticated stage refresh, broader prod refresh evidence families, and stage runtime observability closure on the current candidate.
  - 2026-05-02 supersession: no longer an active V1 blocker after `V1CLOSEOUT-11` published final production-only `GO`; stage moves to V2 by operator decision.

## DONE
- [x] `V1ROE-04 qa(prod-manual): verify exchange-aligned LIVE PnL truth and imported automation on protected DOGEUSDT`
  - 2026-05-01: Closed with authenticated production API/browser evidence. Evidence: `docs/operations/v1roe-04-prod-verification-closure-2026-05-01.md`.
- [x] `V1RT-01 fix(api-market-stream): align market-stream worker subscriptions with canonical runtime symbol scope`
  - 2026-04-23: Fixed a production-relevant drift where `marketStream.worker` derived subscriptions from whitelist-only market-universe logic instead of the canonical symbol-group resolver. Worker subscriptions now follow the same symbol scope as runtime topology and operator surfaces, including catalog-backed/filter-backed universes. Validation PASS: `pnpm --filter api exec vitest run src/workers/marketStreamSubscriptions.service.test.ts src/modules/bots/runtimeSymbolStatsReadModel.service.test.ts`, `pnpm --filter api run typecheck`.
- [x] `V1SURF-01 fix(api+web-runtime-surface): make selected-bot dashboard markets section truth-based instead of mixing fallback context with accepted signal feed`
  - 2026-04-23: Added explicit runtime market truth states to runtime symbol stats and rewired the selected-bot dashboard section to show all attached markets with factual runtime state instead of letting `configured_fallback` masquerade as signal truth. Validation PASS: `pnpm --filter api exec vitest run src/modules/bots/runtimeSymbolStatsReadModel.service.test.ts`, `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.preview-parity.test.tsx src/features/bots/services/botsMonitoringAggregate.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm --filter web run typecheck`.
- [x] `V1FACT-11 docs(sync): close wave, sync canonical queue/context, and freeze future-agent activation rules`
  - 2026-04-22: Published [docs/operations/v1-production-activation-closure-2026-04-22.md](/C:/Personal/Projekty/Aplikacje/Soar/docs/operations/v1-production-activation-closure-2026-04-22.md), synchronized queue/context to the final `CLOSED_WITH_OPERATOR_BLOCKERS` state, and froze future-agent rules so nobody can treat stage success, public prod smoke, or fresh docs alone as final production activation.
- [x] `V1FACT-10 qa(prod-pack): build final prod activation evidence pack and sign-off summary`
  - 2026-04-22: Published [docs/operations/v1-production-activation-pack-2026-04-22.md](/C:/Personal/Projekty/Aplikacje/Soar/docs/operations/v1-production-activation-pack-2026-04-22.md), refreshed RC status/sign-off/checklist to current-day truth, and narrowed the remaining prod blockers to missing prod restore-drill proof, missing prod rollback-proof pack, open RC Gate 2, and missing named human approvers. Validation PASS: `pnpm run ops:release:v1:gate -- --environment prod --dry-run --skip-local-quality --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`, `pnpm run ops:rc:gates:status`, `pnpm run ops:rc:signoff:build`, `pnpm run ops:rc:checklist:sync`.
- [x] `V1FACT-A4 (commits V1FACT-10..V1FACT-11): final activation pack + closure sync`
  - 2026-04-22: Closed the final `V1FACT-A` slice by publishing both the consolidated activation packet and the final closure record, syncing queue/context/project state, and freezing future-agent rules around prod-only proof artifacts and named human sign-offs.
- [x] `V1FACT-A group closure (evidence-backed activation path published; candidate still blocked on operator-only inputs)`
  - 2026-04-22: Closed the planned `V1FACT-A` engineering wave end-to-end. The implementation and documentation path is complete, and the only remaining blockers are operator-owned prod proof artifacts and named human sign-offs captured in `docs/operations/v1-production-activation-closure-2026-04-22.md`.
- [x] `V1FACT-A3 (commits V1FACT-08..V1FACT-09): rollback/backup proof as first-class gate inputs`
  - 2026-04-22: Closed the third `V1FACT-A` slice by making `scripts/runV1ReleaseGate.mjs` classify prod backup/restore drill and rollback proof as required evidence families, adding canonical rollback-proof entrypoints (`ops:deploy:rollback-proof*`), and updating activation/runbook docs so stale or missing prod proof remains explicit and fail-closed. Validation PASS: `node --test scripts/runV1ReleaseGate.test.mjs`, `pnpm run ops:deploy:rollback-proof:stage -- --base-url https://stage-api.soar.luckysparrow.ch --auth-email stage-ops-admin@luckysparrow.ch --auth-password \"StageOps26!B3rlin#Gate\" --ops-auth-header-name X-Forwarded-For --ops-auth-header-value 31.10.146.162`, `pnpm run quality:guardrails`.
- [x] `V1FACT-A2 (commits V1FACT-04..V1FACT-07): release-gate freshness + stage rehearsal evidence`
  - 2026-04-22: Closed the second `V1FACT-A` slice by hardening `scripts/runV1ReleaseGate.mjs` with explicit evidence freshness classification and stage/prod scope truth, fixing target URL passthrough for deploy smoke, adding canonical `ops:release:v1:stage-rehearsal`, and publishing fresh stage artifacts (`v1-release-gate-stage-2026-04-22T17-53-09-987Z.md`, `v1-stage-rehearsal-2026-04-22T17-53-09-987Z.md`) with dry-run blockers kept explicit instead of implied.
- [x] `V1FACT-07B fix(api-runtime-freshness): align inline runtime freshness with worker-ready truth and rerun authenticated stage rehearsal`
  - 2026-04-22: Closed the inline-runtime truth fix by deploying SHA `49ea8e0c`, rerunning authenticated stage rehearsal successfully, and publishing fresh stage artifacts `v1-release-gate-stage-2026-04-22T19-15-59-493Z.md` and `v1-stage-rehearsal-2026-04-22T19-15-59-493Z.md`.
- [x] `V1FACT-A1 (commits V1FACT-01..V1FACT-03): contract + audit + queue truth`
  - 2026-04-22: Closed the first `V1FACT-A` slice by freezing the V1 production-activation contract, publishing `docs/operations/v1-production-activation-evidence-audit-2026-04-22.md` with a fresh/stale/missing evidence map, and advancing the canonical queue to release-gate freshness + stage rehearsal work.
- [x] `REVIEW-D4 (commits REVIEW-D-08..REVIEW-D-10): readiness-truth hardening + closure evidence`
  - 2026-04-22: Closed the final `REVIEW-D` slice by requiring versioned `API_KEY_ENCRYPTION_KEYS` for readiness and new encryption writes, keeping legacy `API_KEY_ENCRYPTION` as compatibility-only decrypt material, and publishing closure evidence in `docs/operations/review-d-live-opt-in-and-ownership-safety-closure-2026-04-22.md`. Validation PASS: `pnpm --filter api exec vitest run src/modules/engine/runtimeSignalLoopDefaults.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/positions/positions.takeover-status.e2e.test.ts src/config/criticalSecretsReadiness.test.ts src/router/health-readiness.test.ts src/utils/crypto.test.ts`, `pnpm --filter api run typecheck`, `pnpm --filter api run build`, `pnpm run quality:guardrails`.
- [x] `REVIEW-D3 (commits REVIEW-D-06..REVIEW-D-07): canonical takeover-rebind ownership truth`
  - 2026-04-22: Closed the third `REVIEW-D` slice by making takeover rebind for orphan `origin='BOT'` positions require explicit ownership proof; without that proof, orphan bot-origin positions now stay unresolved instead of being rebound from the currently eligible LIVE bot set. Validation PASS: `pnpm --filter api exec vitest run src/modules/positions/positions.takeover-status.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm --filter api run build`.
- [x] `REVIEW-D2 (commits REVIEW-D-04..REVIEW-D-05): orphan bot-origin automation fail-closed contract`
  - 2026-04-22: Closed the second `REVIEW-D` slice by making runtime automation skip orphan `origin='BOT'` positions before any manual env-default mode, exchange, market, DCA, or close-path fallback can apply. Validation PASS: `pnpm --filter api exec vitest run src/modules/engine/runtimeSignalLoopDefaults.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm --filter api run build`.
- [x] `REVIEW-D1 (commits REVIEW-D-01..REVIEW-D-03): runtime live opt-in admission truth`
  - 2026-04-22: Closed the first `REVIEW-D` slice by making runtime topology exclude `LIVE` bots without `liveOptIn=true` in both repository and defaults-level admission, and by making runtime automation skip non-opted-in live positions before any strategy or execution path is considered. Validation PASS: `pnpm --filter api exec vitest run src/modules/engine/runtimeSignalLoopDefaults.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm --filter api run build`, `pnpm run quality:guardrails`.
- [x] `TRUTH-A planning queued (fail-closed LIVE key ownership + exchange contract truth + web guardrail truthfulness)`
  - 2026-04-22: Published `docs/planning/truth-a-live-safety-and-contract-truth-plan-2026-04-22.md`, froze permanent rules in `docs/architecture/reference/live-safety-and-contract-truth-remediation-contract.md`, and activated the new follow-up wave in canonical queue/context so future agents can execute the remaining review findings as self-sufficient task packets instead of reconstructing intent from audit notes.
- [x] `SCALE-17 docs(sync): publish closure evidence, future-agent coding rules, and residual backlog handoff`
  - 2026-04-22: Published closure evidence in `docs/operations/scale-cd-closure-evidence-2026-04-22.md`, synchronized queue/context/execution-plan status, and froze future-agent extension rules in `docs/architecture/reference/web-container-split-contract.md` plus module docs handoff.
- [x] `SCALE-16 test(web-seams): run focused parity/regression pack for dashboard and backtests seam extraction`
  - 2026-04-22: Ran focused seam/parity pack for `HomeLiveWidgets` + preview parity and `BacktestRunDetails` + extracted backtest seams (`31/31 PASS`), then passed `quality:guardrails`, `web build`, and `web typecheck`.
- [x] `SCALE-15 refactor(web-backtests): extract trades analytics and tab presenters from BacktestRunDetails`
  - 2026-04-22: Extracted run trades analytics into `useBacktestTradesAnalytics` and moved summary/markets/trades/raw tab rendering ownership into `BacktestRunDetailsTabPanels`, leaving `BacktestRunDetails` as route-level composition over seams; validation: focused backtest tests, `web typecheck`, `web build` PASS.
- [x] `SCALE-14 refactor(web-backtests): extract timeline orchestration hook from BacktestRunDetails`
  - 2026-04-22: Moved timeline chunk-loading/cache/inflight orchestration into `useBacktestTimelineOrchestration`, rewired `BacktestRunDetails` to consume that seam, and passed focused backtest tests + `web typecheck` + `web build`.
- [x] `SCALE-13 refactor(web-dashboard): extract runtime tables and selected-bot summary presenters from HomeLiveWidgets`
  - 2026-04-22: Extracted runtime table presenter ownership into `runtimeDataTablePresenters.tsx` and sidebar manual-order/text presenter ownership into `runtimeSidebarPresenters.ts`, rewired `HomeLiveWidgets` to composition-only seams, and passed focused dashboard tests + `web typecheck` + `web build`.
- [x] `SCALE-11 docs(contract): freeze container/controller/view-model split contract for HomeLiveWidgets and BacktestRunDetails`
  - 2026-04-22: Added `docs/architecture/reference/web-container-split-contract.md`, linked it from architecture/module docs, and froze container vs controller vs view-model/presenter ownership rules plus pending `SCALE-13..15` seams.
- [x] `SCALE-12 refactor(web-dashboard): extract manual-order controller seam from HomeLiveWidgets`
  - 2026-04-22: Added `useManualOrderController` as canonical manual-order state/context/submit seam, rewired `HomeLiveWidgets` to compose it, and passed focused dashboard tests + `web typecheck` + `web build`.
- [x] `CQLT-33 qa(closure): run full quality closure pack and publish maintainability delta evidence`
  - 2026-04-21: Ran sequential DB-backed API closure suites for `orders`, `backtests`, and `bots`, then passed repository-wide `build`, `typecheck`, `quality:guardrails`, and refreshed `i18n:audit:route-reachable:web`; published maintainability delta evidence in `docs/operations/code-quality-maintainability-closure-2026-04-21.md`.
- [x] `CQLT-34 docs(sync): update queue/context/module docs and capture post-wave coding rules for future agents`
  - 2026-04-21: Synchronized canonical queue/context/planning docs after the API decomposition wave and recorded the remaining `CQLT-33` infra blocker explicitly instead of silently treating closure as complete.
- [x] `CQLT-32 docs(decision): freeze legacy bridge sunset list and mark compatibility-only code paths that remain intentional`
  - 2026-04-21: Published the remaining intentional compatibility bridges and sunset rule in `docs/modules/code-quality-maintainability-inventory-2026-04-21.md`.
- [x] `CQLT-31 refactor(shared): replace forbidden hidden fallbacks in non-critical quality paths with explicit unresolved states where safe`
  - 2026-04-21: Removed hidden `USDT` base-currency inference from `botsCommand.service.ts` update-path validation so unresolved wallet context now fails closed with `walletNotFound`.
- [x] `CQLT-30 docs(inventory): catalog fallback/default patterns as allowed, temporary, or forbidden`
  - 2026-04-21: Added fallback classification matrix and maintainability ownership notes to `docs/modules/code-quality-maintainability-inventory-2026-04-21.md`.
- [x] `CQLT-29 test(api): add focused regression packs for orders, bots, backtests, and exchange-rule access after service decomposition`
  - 2026-04-21: Added non-DB focused seam regressions for `orders.quantityRules`, `botStrategyProjectionDrift.service`, `backtestRange.service`, and `exchangeConnectorFactory.service`; `pnpm --filter api run test -- --run ...`, `api build`, and `quality:guardrails` passed.
- [x] `CQLT-28 refactor(api-exchange): centralize exchange/ccxt bootstrap and capability access behind narrower adapter entrypoints`
  - 2026-04-21: Added `exchangeConnectorFactory.service.ts` and rewired orders public/authenticated connector creation to one canonical exchange bootstrap path.
- [x] `CQLT-27 refactor(api-backtests): split range resolution, symbol preparation, report lifecycle, and timeline helpers out of backtests.service`
  - 2026-04-21: Extracted backtest range/symbol preparation into `backtestRange.service.ts`, run-lifecycle helpers into `backtestReportLifecycle.service.ts`, and kept compatibility exports in `backtests.service.ts` while `api build` stayed green.
- [x] `CQLT-26 refactor(api-bots): split command validation, canonical bot context checks, and projection-drift helpers out of botsCommand.service`
  - 2026-04-21: Extracted bot wallet-context validation into `botContextValidation.service.ts` and strategy-projection drift ownership into `botStrategyProjectionDrift.service.ts`, reducing `botsCommand.service.ts` toward command orchestration.
- [x] `CQLT-25 refactor(api-orders): split manual-order context, quantity-rule normalization, lifecycle authority, and persistence mapping out of orders.service`
  - 2026-04-21: Extracted orders manual-context, quantity-rule, and lifecycle services, preserved compatibility facade exports in `orders.service.ts`, and centralized orders connector bootstrap through exchange factory wiring; `api build` and `quality:guardrails` passed, while DB-backed suites remain gated by local Postgres availability.
- [x] `CQLT-24 test(web): run focused parity/regression pack for decomposed modules after each extraction`
  - 2026-04-21: Ran the focused decomposition regression pack across `HomeLiveWidgets`, preview parity, `BacktestRunDetails`, `BotsManagement`, and `WalletCreateEditForm` (`46/46 PASS`) while `quality:guardrails` and `web build` stayed green.
- [x] `CQLT-23 refactor(web-wallets): split WalletCreateEditForm into form state, metadata preview/reset actions, and presentation sections`
  - 2026-04-21: Extracted wallet form state helpers, metadata/preview/reset action helpers, and dedicated presentation sections under `apps/web/src/features/wallets/components/wallet-create-edit-form/`, reducing `WalletCreateEditForm.tsx` from 791 to 483 lines while preserving focused wallet create/edit/reset regressions.
- [x] `CQLT-22 refactor(web-bots): split BotsManagement and BotsMonitoringTab into tab controllers, tables, and summary sections`
  - 2026-04-21: Extracted dedicated `BotsAssistantTab` plus monitoring presentational sections (`MonitoringQuickContextSection`, `MonitoringControlsSection`, `MonitoringQuickNavSection`, `MonitoringAsyncState`), reducing `BotsManagement.tsx` from 1093 to 826 lines and `BotsMonitoringTab.tsx` from 1078 to 890 lines while focused bots-management tests, `web build`, and `quality:guardrails` remained green.
- [x] `CQLT-21 refactor(web-backtests): split BacktestRunDetails into read-model hooks, chart helpers, and presentational sections`
  - 2026-04-21: Extracted deterministic backtest detail view-model helpers into `apps/web/src/features/backtest/utils/backtestRunDetailsViewModel.ts`, moved summary/timeline chart rendering into `apps/web/src/features/backtest/components/backtestRunDetailsCharts.tsx`, reduced `BacktestRunDetails.tsx` from 2037 to 1137 lines, and kept focused backtests tests, `web build`, and `quality:guardrails` green.
- [x] `CQLT-20 refactor(web-dashboard): split HomeLiveWidgets into controller-owned orchestration plus smaller sections/helpers without behavior changes`
  - 2026-04-21: Extracted runtime input parsing, direction/action/reason pill helpers, and position-edit draft typing into `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeUiHelpers.tsx`, reducing `HomeLiveWidgets.tsx` to more route-level orchestration while focused dashboard-home tests, `web build`, and `quality:guardrails` remained green.
- [x] `CQLT-19 test(web): add focused regressions proving helper extraction preserves dashboard/bots rendering parity`
  - 2026-04-21: Extended `HomeLiveWidgets.preview-parity.test.tsx` with DCA ladder plus runtime trade-label parity assertions for `/dashboard` vs `/dashboard/bots/:id/preview`, and aligned bots preview DCA formatting with dashboard locale-aware formatting after the shared-helper extractions from `CQLT-16..18`.
- [x] `CQLT-18 refactor(web-shared): centralize recurring async list/page boilerplate helpers for load-error-retry state`
  - 2026-04-21: Added shared `runAsyncWithViewState` helper in `apps/web/src/lib/async.ts`, rewired profile hooks, strategies list, and wallet form initial load path to the same `loading + error + retry` state contract, extended async helper tests, and switched API keys error retry from hard page reload to local refresh.
- [x] `CQLT-17 refactor(web-shared): extract shared runtime badge/formatting helpers where dashboard and bots contracts match`
  - 2026-04-21: Extracted shared runtime badge/formatting helpers into `apps/web/src/features/shared/runtimeMonitoringFormatters.ts`, rewired dashboard home and bots monitoring to the same status/side/lifecycle tone map plus compact-age formatter, and added focused unit coverage for the shared contract.
- [x] `CQLT-16 refactor(web-shared): extract canonical DCA ladder helper used by dashboard and bots monitoring`
  - 2026-04-21: Extracted shared DCA ladder rendering into `apps/web/src/features/shared/dcaLadderCell.tsx`, rewired dashboard home and bots monitoring to the same helper, added focused regression coverage for zero/planned/executed/custom-format cases, and hardened `repoGuardrails` so staged file moves no longer fail on tracked-but-deleted sources.
- [x] `CQLT-11 refactor(web-shared): move AuthContext and shared fallback error strings to canonical i18n-aware helpers`
  - 2026-04-21: Added canonical `dashboard.shared.*` i18n keys, moved `AuthContext` session-expired/logout toasts to i18n-aware resolution via `useOptionalI18n`, and replaced the hardcoded `handleError` fallback with a shared translation-backed default plus caller override support.
- [x] `CQLT-12..CQLT-14 shared i18n migration across profile/strategies/wallets`
  - 2026-04-21: Migrated profile copy dictionaries, strategy list labels, and wallet-form locale maps into canonical namespaces (`dashboard-shell`, `dashboard-strategies`, `dashboard-wallets`), removed the corresponding guardrail allowlist entries, and kept `pnpm run quality:guardrails` green after exception removal.
- [x] `CQLT-15 planning split for executable route-parity closure`
  - 2026-04-21: Split the original `CQLT-15` umbrella into `CQLT-15A..C` so the queue now reflects the actual delivery order required by target architecture: restore local audit runtime first, lock focused migrated-route i18n coverage second, then run route-reachable audit and closure sync third.
- [x] `CQLT-15A..C route-parity closure for migrated CQLT-C slice`
  - 2026-04-21: Restored local workspace runtime with `pnpm install --force`, added focused i18n regression coverage for migrated profile/strategies/wallets routes, generated the route-reachable audit artifact `docs/operations/_artifacts-l10nq-d-coverage-audit-latest.json`, and passed `web i18n tests`, `web build`, `web typecheck`, and `quality:guardrails`.
- [x] `CQLT-B (commits CQLT-06..CQLT-10): new-debt guardrails for copy, file budgets, and helper duplication`
  - 2026-04-21: Extended `scripts/repoGuardrails.mjs` to block new production-local copy dictionaries, raw user-facing hardcoded UI literals, and non-allowlisted `1000`+ line monoliths; published exception policy in `docs/governance/code-quality-guardrails.md`; and added duplicate-helper snapshot under `docs/modules/`.
- [x] `CQLT-A (commits CQLT-01..CQLT-05): inventory + contract freeze + extraction-order rules`
  - 2026-04-21: Published active maintainability contract in `docs/architecture/reference/maintainability-remediation-contract.md`, recorded concrete web/API/monolith inventories in `docs/modules/code-quality-maintainability-inventory-2026-04-21.md`, and froze extraction order/ownership rules in the active CQLT plan before refactor work.
- [x] `PLNC-D (commit PLNC-09): mvp-execution phase-status parity sync for closed waves`
  - 2026-04-20: Synchronized stale closure drift in `mvp-execution-plan` by marking `DAWR`, `OOSC`, `BTCF`, and `UOLF` phases as `Closed` and mirroring `UOLF-02..UOLF-15` checkbox status to canonical closure already captured in `TASK_BOARD` and `PROJECT_STATE`.
- [x] `WAPR-01 docs(contract): freeze wallets list api-key column and paper-reset safety contract`
  - 2026-04-20: Frozen canonical `WAPR` contract in `open-decisions` and wallet module docs (`api-wallets`, `web-wallets`) with explicit list-table scope (`no Details`, inline `API key` column between `Allocation` and `Actions`, deterministic `Connected/Not connected` mapping) and dedicated fail-closed non-destructive paper-reset command baseline (`POST /dashboard/wallets/:id/reset-paper`, reset-checkpoint semantics).
- [x] `WAPR planning queued (wallets list api-key status + paper reset safety)`
  - 2026-04-20: Added `docs/planning/wallets-list-paper-reset-safety-plan-2026-04-20.md` and queued `WAPR-01..WAPR-10` for wallet-list simplification (`remove Details`, add inline `API key` status column) plus non-destructive `PAPER` wallet reset with reset-aware capital baseline, fail-closed guards, focused API/web regressions, and closure validation.
- [x] `WAPR-A (commits WAPR-01..WAPR-04): contract freeze + wallet-list regression + reset red tests`
  - 2026-04-20: Closed Stage A by freezing the canonical wallet list + paper-reset contract, adding wallet-list regressions (`API key` column mapping + no `Details` rows), and adding API red regressions for reset safety and reset-aware capital baseline.
- [x] `WAPR-B (commits WAPR-05..WAPR-08): API reset command + reset-aware capital baseline + web action`
  - 2026-04-20: Closed Stage B by shipping dedicated fail-closed `POST /dashboard/wallets/:id/reset-paper`, wallet-level reset checkpoint (`paperResetAt`) with reset-aware runtime capital semantics, and paper-only reset action in wallet edit flow with deterministic loading/error/success UX and focused web regressions.
- [x] `WAPR-C (commits WAPR-09..WAPR-10): docs sync + closure validation`
  - 2026-04-20: Closed Stage C by synchronizing wallet module + canonical queue/context docs and passing focused closure pack:
    - `pnpm --filter api run test -- --run src/modules/wallets/wallets.e2e.test.ts`
    - `pnpm --filter web run test -- --run src/features/wallets/components/WalletsListTable.test.tsx src/features/wallets/components/WalletCreateEditForm.test.tsx`
    - `pnpm --filter api run typecheck`
    - `pnpm --filter web run typecheck`
    - `pnpm run quality:guardrails`
- [x] `UOLF-01 docs(contract): supersede manual-order order-only contract with unified order-fill-position lifecycle`
  - 2026-04-20: Frozen canonical `UOLF` contract in `open-decisions` and module docs (`api-orders`, `api-bots`, `web-dashboard-home`) by superseding historical `SOPR-C order-only` wording with one lifecycle (`order -> fill -> position`) for manual and runtime entries, strict selected-bot scope, and wallet-scoped exchange takeover ownership expectations.
- [x] `UOLF group closure (UOLF-02..UOLF-15)`
  - 2026-04-20: Closed UOLF implementation and validation wave end-to-end: selected-bot manual-order write/read regressions, canonical bot-context derivation on order open, shared order-fill-position lifecycle authority for runtime/manual flows, waiting-for-fill runtime semantics (`submitted`), selected-bot scope locks for `PAPER/LIVE`, dashboard lifecycle copy/status alignment, and closure pack PASS (`api UOLF matrix`, `HomeLiveWidgets + preview parity`, `api/web typecheck`, `build`, `quality:guardrails`, `test:go-live:smoke`).
- [x] `BTCF-01 docs(contract): freeze backtests list columns and explicit time-window create contract`
  - 2026-04-20: Frozen canonical backtests list/create contract in `open-decisions` and backtests module docs (`web-backtest`, `api-backtests`): list columns locked to `Strategy/Markets/Init balance/Status/Start/Actions`, create explicit range contract locked (`startAt/endAt`), slider bounds frozen (`250..10000`), and backward compatibility for legacy runs explicitly required.
- [x] `BTCF planning queued (backtests list/create explicit time-window remediation wave)`
  - 2026-04-20: Added `docs/planning/backtests-list-create-time-window-remediation-plan-2026-04-20.md` and queued `BTCF-A..BTCF-C` for backtests list column contract (`Strategy/Markets/Init balance`) plus create-form explicit `startAt/endAt` flow, slider bounds `250..10000`, backend range execution parity, i18n sync, and closure validations.
- [x] `BTCF-02..BTCF-04 list-contract remediation closure`
  - 2026-04-20: Added API list-contract regression for `strategyName/markets/initialBalance`, implemented list payload enrich in repository/service projection, and switched web runs table to canonical columns (`Strategy`, `Markets`, `Init balance`, `Status`, `Start`, `Actions`) with focused API+web regression coverage.
- [x] `BTCF-05..BTCF-09 create/runtime explicit-range closure`
  - 2026-04-20: Added create-form regressions for explicit `startAt/endAt`, slider bounds (`250..10000`), and md 3-column layout; implemented deterministic sync rules (`range` edits derive `maxCandles`, `maxCandles` edits derive range), extended API DTO validation and run creation seed contract with explicit range persistence, and wired job/gateway/timeline read paths to use configured range boundaries (`startAt/endAt`) with legacy-run compatibility fallback.
- [x] `BTCF-10..BTCF-12 i18n/docs/closure sync`
  - 2026-04-20: Completed locale key coverage for new backtests list/create copy (`en/pl/pt`), synchronized module/architecture docs to explicit range execution semantics, executed focused closure pack (`api/web backtests tests`, `api/web typecheck`, `api/web build`, `quality:guardrails`, `i18n:audit:route-reachable:web`), and synced canonical queue/context state for BTCF wave closure.
- [x] `PLNC-C (commits PLNC-06..PLNC-08): stale planning-status/header parity sweep + canonical queue/context sync`
  - 2026-04-20: Closed post-queue-idle planning parity sweep by synchronizing stale closed-wave statuses in planning plans (`UXR-I`, `DAGG`, `SBSC`, `UXR`, `POS`, `PLNC`, `V1/LBT`) plus canonical phase headers in `mvp-execution-plan` (`PLNC`, `ARC`, `POS`, `OPV`, `UXR-I`, `UXR-J`) and catalog classification map (`planning-catalog-index`) to current closure reality.
- [x] `OOSC-C (commits OOSC-07..OOSC-08): docs sync + closure validation`
  - 2026-04-20: Synchronized OOSC rollout state in planning/context docs and completed focused closure validation pack (`api e2e pair`, `web HomeLiveWidgets + HomeLiveWidgets.open-orders-source tests`, `api/web typecheck`, `quality:guardrails`).
- [x] `OOSC-B (commits OOSC-04..OOSC-06): web source column + mapping + regressions`
  - 2026-04-20: Added Open Orders `Source` column in dashboard table, mapped source labels (`USER/BOT/EXCHANGE_SYNC|BACKTEST -> Manual/Bot/Imported`), localized i18n keys (`en/pl/pt`), and locked UI behavior in `HomeLiveWidgets` regression suite.
- [x] `OOSC-A (commits OOSC-01..OOSC-03): contract freeze + API origin/source plumbing`
  - 2026-04-20: Added API regressions and implementation for explicit manual-order persistence (`origin=USER`) and runtime open-orders origin projection in positions/aggregate payloads while preserving active-only status scope.
- [x] `OOSC-01 docs(contract): freeze dashboard open-orders source-column and active-only status contract`
  - 2026-04-20: Frozen canonical `Source` mapping (`USER/BOT/EXCHANGE_SYNC/BACKTEST` -> `Manual/Bot/Imported`), explicit manual-order write-origin requirement (`origin=USER`), and unchanged active-only Open Orders statuses (`PENDING`, `OPEN`, `PARTIALLY_FILLED`) in `open-decisions`, `api-orders`, and `web-dashboard-home` docs.
- [x] `OOSC planning queued (open-orders source column + active-only contract lock)`
  - 2026-04-20: Added executor-ready plan `docs/planning/dashboard-open-orders-source-column-plan-2026-04-20.md` and queued `OOSC-A..OOSC-C` to deliver dashboard Open Orders `Source` column (`Manual/Bot/Imported`), enforce manual-order persistence as `origin=USER`, and keep active-only order statuses (`PENDING`, `OPEN`, `PARTIALLY_FILLED`) unchanged.
- [x] `PLNC-B (commit PLNC-05): reconcile stale DASHR checklist status drift in mvp-execution-plan`
  - 2026-04-20: Synced stale `DASHR-01..DASHR-11` unchecked block in `docs/planning/mvp-execution-plan.md` with canonical closure state already captured in `TASK_BOARD` and this queue; DASHR phase now marked closed with closure log entries.
- [x] `DAWR-A (commits DAWR-01..DAWR-03): contract freeze + aggregate API regression/fix`
  - 2026-04-20: Closed Stage A by freezing aggregate wallet-summary + sidebar null/mismatch edge contract in canonical docs (`open-decisions`, `api-bots`, `web-dashboard-home`), adding aggregate API regression locks for `positions.summary.referenceBalance/freeCash` (non-empty + empty aggregate), and extending aggregate projection to expose parity fields from latest session capital context (`null` on unresolved). Validation:
    - `pnpm --filter api run test -- --run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
    - `pnpm --filter api run typecheck`
    - `pnpm --filter api run build`
- [x] `DAWR-B (commits DAWR-04..DAWR-07): web wallet + strategy edge-case regressions/fixes`
  - 2026-04-20: Closed Stage B by adding aggregate-success wallet regression coverage (`HomeLiveWidgets.aggregate-wallet.test.tsx`), adding dedicated sidebar edge tests for `strategyId` null/mismatch (`RuntimeSidebarSection.test.tsx`), and tightening sidebar fallback precedence so canonical runtime topology remains first source for market+strategy context.
- [x] `DAWR-C (commits DAWR-08..DAWR-10): ops docs + planning sync + closure`
  - 2026-04-20: Documented strategy-drift audit/repair triage in ops/module docs, synchronized canonical queue/context/execution files, and completed closure validation pack:
    - `pnpm --filter api run test -- --run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
    - `pnpm --filter web run test -- --run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-wallet.test.tsx src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx`
    - `pnpm --filter api run typecheck`
    - `pnpm --filter web run typecheck`
    - `pnpm run quality:guardrails`
- [x] `DAWR planning queued (dashboard aggregate wallet KPI + strategy sidebar regression fix wave)`
  - 2026-04-20: Added `docs/planning/dashboard-aggregate-wallet-strategy-regression-plan-2026-04-20.md` and queued `DAWR-A..DAWR-C` to fix aggregate LIVE wallet summary parity (`referenceBalance/freeCash`), lock strategy null/mismatch edge behavior, and synchronize planning status drift.
- [x] `MURC-12 qa(closure): run focused contract validation pack and sync canonical queue/context`
  - 2026-04-20: Closure pack PASS:
    - `pnpm --filter api run test -- --run`
    - `pnpm --filter web run test -- --run`
    - `pnpm --filter api run typecheck`
    - `pnpm --filter web run typecheck`
    - `pnpm run quality:guardrails`
  - 2026-04-20: Resolved guardrail size overflow by moving market-universe parity scenarios from `bots.e2e.test.ts` into dedicated `bots.market-universe-contract.e2e.test.ts`.
- [x] `MURC-C (commits MURC-08..MURC-12): web alignment + e2e smoke + docs sync + closure`
  - 2026-04-20: Added empty-preview submit regression in `MarketUniverseForm`, aligned validation to allow valid empty symbol result, synced trading/module/open-decisions docs, and closed parity smoke with full closure validation.
- [x] `MURC-B (commits MURC-05..MURC-07): backtest/runtime/manual-order adoption + integration parity`
  - 2026-04-20: Locked cross-module parity for identical market-universe input across runtime symbol stats, backtest `seedConfig.symbols`, and manual-order context.
- [x] `MURC-A (commits MURC-01..MURC-04): contract freeze + shared resolver + market sync/auto-group adoption`
  - 2026-04-20: Introduced shared market-universe resolver contract in API (`final = unique(filter_result U whitelist) - blacklist`) and wired markets sync plus bot auto-created symbol-group paths to canonical semantics.
- [x] `SOPR-12 qa(closure): run full focused validation pack and sync canonical queue/context`
  - 2026-04-19: Closure pack PASS:
    - `pnpm --filter api run test -- --run`
    - `pnpm --filter web run test -- --run`
    - `pnpm --filter api run typecheck`
    - `pnpm --filter web run typecheck`
    - `pnpm run build`
    - `pnpm run lint`
    - `pnpm run quality:guardrails`
    - `pnpm i18n:audit:route-reachable:web`
  - 2026-04-19: Added FK-safe cleanup guardrails in API e2e suites (`auth`, `profile/basic`, `preTrade`, `market-stream`, `positions-live-status`) to keep full-suite teardown deterministic after `runtimeExecutionDedupe` and `botRuntime*` expansions.
- [x] `SOPR-C (commits SOPR-09..SOPR-12): manual-order decision/contract/implementation closure`
  - 2026-04-19: Closed manual-order semantic decision as explicit `order-only` path with audit metadata (`semanticPath`, `positionLifecycleAuthority`, `opensPositionDirectly=false`) and API contract regressions (`orders.service.test.ts`, `orders-positions.e2e.test.ts`).
- [x] `SOPR-B (commits SOPR-05..SOPR-08): selected-bot home/preview parity closure`
  - 2026-04-19: Closed selected-bot parity path with cross-route web regression (`HomeLiveWidgets.preview-parity.test.tsx`), runtime blocked-diagnostics visibility lock (`bots.runtime-history-parity.e2e.test.ts`), and published evidence pack (`docs/operations/sopr-parity-matrix-2026-04-19.md` + artifact JSON).
- [x] `SOPR-A (commits SOPR-01..SOPR-04): signal-context source-of-truth hardening`
  - 2026-04-19: Closed fallback contamination hardening by removing global strategy fallback, exposing deterministic source tags (`latest_signal | configured_fallback | unresolved`), and locking selected-bot signal-card scope regressions in API+web suites.
- [x] `SOPR-01 docs(contract): lock consolidated source-of-truth and parity contract for signals/open flows after DAGG+SBSC`
  - 2026-04-19: Published consolidated selected-bot signals/open-runtime parity contract in canonical docs (`open-decisions`, `web-dashboard-home`, `api-bots`, `api-orders`) with explicit prerequisites (`DAGG`, `SBSC`), signal-context precedence, no-open diagnostics expectations, and manual-order semantic baseline before decision-gate closure.
- [x] `MURC planning queued (market-universe symbol contract parity across API/web/runtime/backtests/orders)`
  - 2026-04-19: Added `docs/planning/market-universe-symbol-contract-parity-plan-2026-04-19.md` and queued `MURC-A..MURC-C` after `SOPR` to unify symbol composition contract (`final = unique(filter_result U whitelist) - blacklist`) across markets sync, bots runtime, backtests, manual-order context, and markets-form preview/validation.
- [x] `SBSC-08 docs(closure): publish sidebar strategy contract closure and sync queue/context`
  - 2026-04-19: Closed SBSC wave with canonical queue/context sync (`mvp-next-commits`, `mvp-execution-plan`, `TASK_BOARD`, `PROJECT_STATE`) and promoted `SOPR-01` to `NOW`.
- [x] `SBSC-C (commits SBSC-07..SBSC-08): closure validation + canonical sync`
  - 2026-04-19: Focused SBSC closure pack PASS (`api bots.e2e + bots.runtime-scope.e2e`, `web HomeLiveWidgets`, `api/web typecheck`) and canonical queue synchronized.
- [x] `SBSC-B (commits SBSC-04..SBSC-06): drift detection/repair path + sidebar switch regression locks`
  - 2026-04-19: Added deterministic strategy-drift diagnostics (`GET /dashboard/bots/strategy-drift`) + idempotent repair path (`POST /dashboard/bots/strategy-drift/repair`) with API e2e coverage and web sidebar market+strategy switch regression lock.
- [x] `SBSC-A (commits SBSC-01..SBSC-03): decision freeze + API projection mismatch regression + canonical-first mapper fix`
  - 2026-04-19: Locked sidebar strategy source-of-truth contract and fixed list/get projection precedence to canonical runtime links first, with explicit API regression proving list/get vs runtime-graph parity.
- [x] `DAGG-10 qa(closure): run focused aggregate parity pack and sync canonical queue/context`
  - 2026-04-19: Focused closure pack PASS:
    - `pnpm --filter api run test -- --run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
    - `pnpm --filter web run test -- --run src/features/dashboard-home/components/HomeLiveWidgets.aggregate-history.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.preview-parity.test.tsx`
    - `pnpm --filter api run typecheck`
    - `pnpm --filter web run typecheck`
    - `pnpm --filter web run build`
    - `pnpm run quality:guardrails`
- [x] `DAGG-C (commits DAGG-09..DAGG-10): parity regression closure + canonical sync`
  - 2026-04-19: Group closed with explicit `/dashboard` vs `/dashboard/bots/:id/preview` selected-bot aggregate-history parity regression and green focused validation pack.
- [x] `DAGG-09 test(e2e/web-parity): add scenario asserting /dashboard and /preview parity for selected bot aggregate history`
  - 2026-04-19: Added `HomeLiveWidgets.preview-parity.test.tsx` to lock selected-bot aggregate history/trade parity between `/dashboard` and `/dashboard/bots/:id/preview` and verify no cross-bot leakage in either route context.
- [x] `DAGG-B (commits DAGG-05..DAGG-08): history positions parity + aggregate API contract hardening`
  - 2026-04-19: Closed by adding dashboard history closed-positions table + selected-bot re-scope web regressions and by hardening aggregate API deterministic ordering with mixed-session contract regression coverage.
- [x] `DAGG-A (commits DAGG-01..DAGG-04): contract freeze + dashboard aggregate data-source migration`
  - 2026-04-19: Closed by enforcing aggregate-first selected-bot runtime loading, aligning dashboard runtime view-model to aggregate payload, and locking RUNNING-empty-session aggregate history parity regression under the frozen contract docs.
- [x] `SOPR planning queued (signals + open-runtime parity remediation after DAGG/SBSC)`
  - 2026-04-19: Added `docs/planning/signals-open-runtime-parity-plan-2026-04-19.md` and queued `SOPR-A..SOPR-C` in pipeline/group queue to close selected-bot signal context drift, dashboard-vs-preview parity gaps, runtime no-open diagnostics visibility, and manual-order lifecycle semantics.
- [x] `SBSC planning queued (sidebar selected-bot strategy source-of-truth and projection parity)`
  - 2026-04-19: Added `docs/planning/dashboard-sidebar-strategy-contract-plan-2026-04-19.md` and queued `SBSC-A..SBSC-C` in pipeline/group queue as post-`DAGG` follow-up to eliminate listBots vs runtime-graph strategy drift in dashboard sidebar.
- [x] `DAGG planning queued (dashboard aggregate selected-bot view parity for positions/orders/history)`
  - 2026-04-19: Added `docs/planning/dashboard-aggregate-selected-bot-view-plan-2026-04-19.md` and promoted execution groups `DAGG-A..DAGG-C` into `NOW/NEXT/PIPELINE`, locking product decision that dashboard tables use selected-bot aggregate scope.
- [x] `DASHR-C (commits DASHR-09..DASHR-11): signal->order execution diagnostics + closure`
  - 2026-04-19: Closed end-to-end with explicit runtime blocked-path diagnostics (`PRETRADE_BLOCKED`) and focused closure pack PASS (`api bots/orders/runtime tests`, `web HomeLiveWidgets`, `api/web typecheck`, `web build`, `quality:guardrails`).
- [x] `DASHR-B (commits DASHR-05..DASHR-08): selected-bot runtime data parity for positions/history/signals scope`
  - 2026-04-19: Closed by locking carry-over history parity, selected-session mismatch guard on web history payloads, and selected-bot-only signals strategy scope (legacy `botStrategy` constrained to ACTIVE+enabled canonical links).
- [x] `DASHR-11 qa(closure): run focused dashboard runtime parity pack and sync canonical queue/context`
  - 2026-04-19: Focused DASHR closure checks passed and queue/context artifacts synchronized.
- [x] `DASHR-10 fix(api-runtime-execution): restore signal->order->position flow or emit explicit blocked diagnostics`
  - 2026-04-19: Runtime final-candle flow now records explicit blocked diagnostics for ignored orchestration outcomes.
- [x] `DASHR-09 test(api-red-signal-execution): add regression for condition-met but no-order/no-position outcome`
  - 2026-04-19: Added regression lock for condition-met ignored execution outcomes and blocked diagnostic persistence.
- [x] `DASHR-08 fix(api-signals-scope): enforce selected-bot symbol and strategy context parity for dashboard signals`
  - 2026-04-19: Restricted legacy strategy enrichment to selected-bot ACTIVE+enabled canonical group scope.
- [x] `DASHR-07 test(api-red-signals-scope): lock selected-bot-only markets/strategy context in signals payload`
  - 2026-04-19: Added regression excluding paused legacy symbol-group leakage from selected-bot symbol-stats payload.
- [x] `DASHR-06 fix(api+web-runtime-parity): align selected session/snapshot mapping for positions and history tabs`
  - 2026-04-19: Aligned default history mapping across API/web and prevented mismatched session payload rows from rendering in selected snapshot.
- [x] `DASHR-05 test(api+web-red): reproduce positions/history mismatch between runtime module and dashboard selected snapshot`
  - 2026-04-19: Added focused API+web parity regressions for carry-over history visibility and selected-session payload mismatch.
- [x] `DASHR-A (commits DASHR-01..DASHR-04): dashboard tab/view parity + selected-bot section consistency`
  - 2026-04-19: Stage A DoD closed end-to-end: `orders` tab now renders canonical `DataTable` (including deterministic empty-state copy), selected-bot strategy context refresh follows selected bot deterministically, and selected-bot panel layout/spacing order is enforced (`KPI -> selector -> market/strategy`, `mt-6`).
- [x] `DASHR-04 fix(web-selected-bot-panel): ensure strategy context refresh and apply requested spacing/layout order`
  - 2026-04-19: Updated selected-bot sidebar strategy resolution to prefer selected bot `strategyId` from runtime graph links (with legacy fallback), moved selector row between KPI and market/strategy cards, and applied requested `mt-6` spacing.
- [x] `DASHR-03 fix(web-orders-tab): replace open-orders placeholder with DataTable + deterministic empty state`
  - 2026-04-19: Replaced `OPEN_ORDERS` placeholder block with shared `DataTable` rendering (sorting, pagination, column visibility) and wired deterministic empty-state text (`No open orders.` / localized equivalents).
- [x] `DASHR-02 test(web-red): add failing coverage for orders-tab table rendering and selected-bot strategy refresh`
  - 2026-04-19: Added focused regressions in `HomeLiveWidgets.test.tsx` for `orders` tab table contract and selected-bot strategy refresh (`Alpha/Beta` switch context) and fixed test helper default-runtime-graph mocking so per-test graph overrides remain effective.
- [x] `DASHR-01 docs(contract): freeze dashboard runtime parity contract for positions/orders/history/signals/selected-bot section`
  - 2026-04-19: Locked `DASHR` parity contract in canonical docs (`open-decisions`, `web-dashboard-home`) with explicit tab behavior (`positions/orders/history`), selected-bot scoped signals/strategy rules, signal execution diagnostics requirement, and selected-bot panel layout/spacing order (`KPI -> selector -> market/strategy`, `mt-6` spacing).
- [x] `DASHR planning queued (dashboard runtime parity recovery for positions/orders/history/signals/selected-bot section)`
  - 2026-04-19: Added dedicated execution plan `docs/planning/dashboard-runtime-data-parity-recovery-plan-2026-04-19.md` and promoted grouped tiny-commit wave (`DASHR-A..DASHR-C`) into `NOW/NEXT/PIPELINE` for implementation continuity with strict scope lock.
- [x] `UXR-J-08 qa(web-table-closure): run focused suite + typecheck/build and sync queue/context`
  - 2026-04-19: Closure checks PASS with focused table suite (`25/25`) plus `pnpm --filter web run typecheck` and `pnpm --filter web run build`; canonical queue/context synchronized and `UXR-J` group closed end-to-end.
- [x] `UXR-J-07 test(web-tables-focused): align bots/backtests/profile/runtime table suites to shared table behavior`
  - 2026-04-19: Updated focused consuming table assertions to match shared module-tone contract (`runtime/preview` action presets use `text-accent`) in `BotsListTable.test.tsx` and `BacktestsRunsTable.test.tsx`.
- [x] `UXR-J-06 test(ui-table-actions): add preset tone regression tests for clone/runtime/preview mapping`
  - 2026-04-19: Added `TableUi.test.tsx` regression locks for canonical preset mapping (`clone=neutral`, `runtime/preview=module`).
- [x] `UXR-J-05 test(ui-datatable): add regression tests for dropdown persistence and icon-only trigger contract`
  - 2026-04-19: Extended `DataTable.test.tsx` with interaction regressions for columns dropdown persistence on checkbox toggles, close behavior (`trigger`, outside click, `Escape`), and icon-only trigger class contract.
- [x] `UXR-J-04 refactor(ui-datatable-trigger): enforce icon-only columns trigger globally with a11y label`
  - 2026-04-19: Enforced icon-only columns trigger as default by setting `settingsControlsIconOnly=true` in shared `DataTable`; accessible naming remains preserved via `aria-label` and `sr-only`.
- [x] `UXR-J-03 refactor(ui-datatable-dropdown): keep columns dropdown open on checkbox toggles`
  - 2026-04-19: Removed checkbox-toggle auto-close branch from shared `DataTable` columns visibility menu.
- [x] `UXR-J-02 refactor(ui-table-actions): add dedicated module action tone and remap clone/runtime/preview presets`
  - 2026-04-19: Added dedicated `module` action tone preset in shared `TableUi` and remapped `runtime` + `preview` actions to the same module tone while preserving `clone` as neutral (distinct from system `edit`/`delete` semantics).
- [x] `UXR-J-01 docs(contract): freeze dashboard table action-color and columns-dropdown behavior contract`
  - 2026-04-19: Frozen `UXR-J` shared table consistency contract in canonical docs (`open-decisions`, `web-dashboard-home`, `web-bots`) with explicit action-tone semantics (`clone` distinct; `runtime` + `preview` shared module tone), columns-dropdown persistence rules, and icon-only columns trigger accessibility contract.
- [x] `UXR-I-14 qa(web-forms-closure): run build/typecheck/guardrails and sync canonical queue/context`
  - 2026-04-19: Closure checks PASS (`pnpm --filter web run typecheck`, `pnpm --filter web run build`, `pnpm run quality:guardrails`) and canonical queue/context synchronized; `UXR-I` wave is now fully closed and handoff moved to `UXR-J`.
- [x] `UXR-I-13 test(web-forms-regression): run/update focused suites for wrapper+i18n+form-consistency contracts`
  - 2026-04-19: Focused UXR-I regression pack PASS (`33/33`) for wallets/markets/backtests/bots forms, wallet/bot create-edit wrappers, and i18n namespace/translation registry tests via canonical command set from UXR-I plan.
- [x] `UXR-I-12 feat(web-form-mobile): apply sticky mobile action bar contract to long dashboard forms`
  - 2026-04-19: Applied shared `FormMobileActionBar` contract to remaining long dashboard form wrappers (`strategies` create/edit, `backtests` create) and aligned page-title save action visibility to desktop-only (`hidden md:inline-flex`) for consistent mobile reachability.
- [x] `UXR-I-11 feat(web-form-ux): standardize first-error focus/scroll + summary/inline sync across scoped forms`
  - 2026-04-19: Added shared `ui/forms` validation-feedback helper (`toValidationSummaryErrors`, `focusFirstInvalidField`) and migrated scoped forms (`wallets`, `markets`, `backtests`, `strategies`, `bots`) to the common focus/scroll + summary pipeline; aligned wallet summary block with explicit title for parity.
- [x] `UXR-I-10 refactor(web-bots-form): reduce layout density and align controls to shared form system`
  - 2026-04-19: Refactored `BotCreateEditForm` dense single-card layout into clearer two-column `setup`/`market`/`strategy` sections using shared `ui/forms` primitives only, while preserving existing runtime safety toggles and domain validation/submit logic; updated focused bots-form regression expectations.
- [x] `UXR-I-09 refactor(web-strategies-form): preserve tabs while normalizing section internals to shared primitives`
  - 2026-04-19: Preserved strategy tabs flow and normalized `close`/`additional` tab internals to shared `ui/forms` primitives (`FormSectionCard`, `FormGrid`, `RadioGroupField`, `NumberField`, `ToggleField`, `CompoundField`) while keeping strategy-domain logic unchanged; added focused tab-flow regression in `StrategyForm.test.tsx`.
- [x] `UXR-I-08 refactor(web-backtests-form): finalize decoupling from feature-local controls and align summary ergonomics`
  - 2026-04-19: Replaced feature-local outer container wrapper in `BacktestCreateForm` with shared `FormPageShell` while preserving section contracts and focused backtests-form test coverage.
- [x] `UXR-I-07 refactor(web-markets-form): enforce sectioned IA and remove any residual local generic controls`
  - 2026-04-19: Refactored `MarketUniverseForm` to sectioned shared IA (`FormSectionCard` + `FormGrid`) and removed local ad-hoc section wrappers while keeping market-catalog/filter behavior and tests green.
- [x] `UXR-I-06 refactor(web-wallets-form): close residual layout/control parity gaps using ui/forms primitives`
  - 2026-04-19: Standardized wallet mode/base-currency/live-allocation controls to `ui/forms` primitives and aligned focused wallet regression coverage with the new control semantics.
- [x] `UXR-I-05 refactor(web-wrappers): unify create/edit wrappers i18n+breadcrumb+save-action contract`
  - 2026-04-19: Unified wallet/bot wrapper save-action contract by wiring form-level submitting state into desktop/mobile actions (`disabled` + saving label) and adding missing localized saving labels in `dashboard-wallets` and `dashboard-bots.page`.
- [x] `UXR-I-04 test(guardrails): lock no-cross-feature generic controls and no-hardcoded-wrapper-copy regressions`
  - 2026-04-19: Expanded `i18n/guardrails.test.ts` coverage to full `UXR-I` wrapper route set and hardened `scripts/repoGuardrails.mjs` to block `FieldControls` imports outside same-feature ownership (or from non-feature files), keeping shared controls anchored to `apps/web/src/ui/forms/*`.
- [x] `UXR-I-03 chore(web-ui-forms): normalize shared form primitive API surface for refresh migration`
  - 2026-04-19: Exported shared primitive prop/type contracts across `apps/web/src/ui/forms/*` to stabilize migration API usage without rendering or behavior drift.
- [x] `UXR-I-02 audit(web-forms): publish residual consistency gap map per route/module`
  - 2026-04-19: Published residual route/module gap map in `docs/operations/uxr-i-forms-gap-map-2026-04-19.md` with JSON artifact `_artifacts-uxr-i-forms-gap-map-2026-04-19.json` to lock deterministic migration targets for `UXR-I-03..UXR-I-13`.
- [x] `UXR-I-01 docs(contract): freeze dashboard forms consistency refresh boundaries after UXR-F`
  - 2026-04-19: Locked `UXR-I` refresh boundaries in canonical contracts (`open-decisions`, `web-dashboard-home`) with explicit scoped routes, `ui/forms` generic-control rule, wrapper i18n-only copy contract, and unified validation/submit behavior invariants.
- [x] `UXR-J planning queued (dashboard tables consistency refresh after UXR-I)`
  - 2026-04-19: Activated tables planner brief into canonical queue via `docs/planning/uxr-j-dashboard-tables-consistency-refresh-plan-2026-04-19.md` with grouped batches (`UXR-J-A..UXR-J-C`) covering global action-tone semantics (`clone/runtime/preview`), columns dropdown persistence behavior, icon-only columns trigger contract, focused table-regression alignment, and closure checks.
- [x] `UXR-I planning queued (dashboard forms consistency refresh after UXR-F closure)`
  - 2026-04-19: Activated planner brief into canonical execution queue via `docs/planning/uxr-i-dashboard-forms-consistency-refresh-plan-2026-04-19.md` with grouped tiny-commit batches (`UXR-I-A..UXR-I-D`) covering residual wrapper/i18n consistency, `ui/forms` contract refresh, per-module parity closure (wallets/markets/backtests/strategies/bots), standardized validation/submission ergonomics, and closure checks.
- [x] `OPV-05 fix(ops-gates): make RC status manual follow-ups gate-aware instead of static`
  - 2026-04-19: Updated `scripts/buildRcExternalGateStatus.mjs` to render manual follow-ups dynamically from current gate state (`Gate1..Gate4`) so closed gates are not re-listed as required action; validated by generating status output from latest SLO window artifact.
- [x] `POS-B group closure (POS-39..POS-42)`
  - 2026-04-19: Confirmed implementation-complete state and closed queue drift using focused parity/runtime verification (`50/50 PASS`) plus canonical sync; evidence in `docs/operations/pos-ab-closure-2026-04-19.md`.
- [x] `POS-A group closure (POS-36..POS-38)`
  - 2026-04-19: Confirmed implementation-complete state and closed queue drift with focused regression verification (`runtimePositionAutomation`, `runtimeCapitalContext`, `backtestReplayCore`, `lifecycleCloseParity`); evidence in `docs/operations/pos-ab-closure-2026-04-19.md`.
- [x] `OPV-04 docs(closure): sync LBT/V1 stability plan statuses and residual external blockers`
  - 2026-04-19: Synced OPV closure state across canonical queue/context and linked LBT/V1 planning docs to latest evidence (`opv-02`, `opv-03`, RC gate/sign-off artifacts). Interim blockers from this sync were later closed by private-route production verification.
- [x] `OPV-03 ops(gates-refresh): refresh RC external-gate status/sign-off artifacts with new production evidence`
  - 2026-04-19: Collected fresh production SLO observation (`_artifacts-slo-window-2026-04-19T01-35-51-340Z.json`), rebuilt rolling windows (`7d/30d`), refreshed `v1-rc-external-gates-status.md`, synced RC checklist, rebuilt sign-off record, and reran status/evidence sync (`_artifacts-opv-03-rc-evidence-final-sync-2026-04-19T01-43-32-327Z.json`). The interim `G2/G4 OPEN` snapshot is superseded by final closure run `2026-04-19T15:13:58.943Z` (`G1=PASS`, `G2=PASS`, `G3=PASS`, `G4=PASS`).
- [x] `OPV-02 qa(prod-live-takeover): verify takeover endpoint and private ops probes on production target`
  - 2026-04-19: Verified production takeover endpoint rollout with public auth-required responses (`401 Missing token`, route present, no `404`) and captured OPS probe evidence. Public worker/rollback probes remain blocked without private-route admin auth (`/workers/*`, `/workers/runtime-freshness`, `/alerts`), recorded in `docs/operations/opv-02-prod-live-takeover-2026-04-19.md`.
- [x] `OPV-01 qa(vps-rehearsal): execute Dockerfile-first stage/prod rehearsal and capture evidence`
  - 2026-04-19: Executed Dockerfile-first rehearsal for `api`, `web`, and all four worker images (`PASS` for each build target) and captured evidence pack in `docs/operations/opv-01-vps-rehearsal-2026-04-19.md` plus JSON/log artifacts. Production smoke (`api.soar.luckysparrow.ch`, `soar.luckysparrow.ch`) passed for `/health`, `/ready`, and web root; stage smoke is now confirmed on `stage-api.soar.luckysparrow.ch` and `stage.soar.luckysparrow.ch`.
- [x] `UXR-H-01 docs(contract): freeze dashboard manual-order advanced input/context contract`
  - 2026-04-19: Frozen manual-order advanced behavior/data-source contract in canonical decisions and module docs, including `price` placement/fill rule, `qty` min+slider guidance contract, side-aware summary contract, and explicit unresolved `orderType -> MARKET` fallback. Synced wave plan status to in-progress with `UXR-H-02` next. Validation: `pnpm run quality:guardrails` => `PASS`.
- [x] `UXR-H-02 feat(api-orders): add manual-order context read endpoint for price/rules/min-qty preview`
  - 2026-04-19: Added `GET /dashboard/orders/manual-context` with ownership guard, canonical manual-order context payload, resolved `orderType/marginMode/leverage`, reference price fallback behavior, and executable quantity constraints (`minAmount`, `amountPrecision`, `minNotional`, `minExecutableQty`).
- [x] `UXR-H-03 test(api-orders): lock manual-order context constraints and fallback behavior`
  - 2026-04-19: Added focused service/e2e coverage for unresolved `orderType -> MARKET` fallback, min executable quantity derivation, degraded exchange fetch stability, and ownership isolation on manual-context route.
- [x] `UXR-H-04..UXR-H-09 web+i18n+test rollout for dashboard manual-order advanced UX`
  - 2026-04-19: Added typed web manual-order context client/contracts, wired dashboard manual-order context+price+slider state model, shipped runtime sidebar advanced manual-order UI (`price`, market fill, qty slider row, context rows, side-aware summary, single-layer panel), localized added copy in EN/PL/PT, and updated `HomeLiveWidgets` regression coverage for the new interaction contract.
- [x] `UXR-H-10 qa(web+api-closure): focused manual-order regression pack + queue/context sync`
  - 2026-04-19: Validation pack PASS: `pnpm --filter api run test -- src/modules/orders/orders.service.test.ts src/modules/orders/orders-positions.e2e.test.ts --run`, `pnpm --filter web run test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx --run`, `pnpm --filter api run typecheck`, `pnpm --filter web run typecheck`, `pnpm --filter api run build`, `pnpm --filter web run build`, `pnpm run quality:guardrails`.
- [x] `UXR-H group closure (UXR-H-A..UXR-H-C)`
  - 2026-04-19: Closed complete dashboard manual-order advanced UX wave (`UXR-H-01..UXR-H-10`) with API contract, web/UI rollout, i18n parity, focused regressions, and canonical context synchronization.
- [x] `POS-36 fix(contract): remove strategy-exit close bypass from backtest/replay and runtime close flow`
  - 2026-04-19: Enforced EXIT trace-only parity semantics in backtest replay/interleaved simulation flows by mapping direct `EXIT -> close` core decisions to diagnostics-only mismatch (`strategy_exit_trace_only`) while preserving lifecycle/final-candle as sole close authority; added runtime final-candle regression lock for EXIT trace-only path (`orchestrateFn` skip + signal payload marker). Validation: `pnpm --filter api run test -- src/modules/backtests/backtestReplayCore.test.ts src/modules/backtests/backtests.contract-remediation.test.ts src/modules/engine/runtimeFinalCandleDecision.service.test.ts --run` => `35/35 PASS`; `pnpm --filter api run test -- src/modules/backtests/backtests.e2e.test.ts --run` => `10/10 PASS`; `pnpm --filter api run typecheck` => `PASS`; `pnpm --filter api run build` => `PASS`; `docker build -f apps/api/Dockerfile.worker.backtest .` => `PASS`; `pnpm run quality:guardrails` => `PASS`.
- [x] `ARC-E group closure (ARC-19..ARC-20)`
  - 2026-04-19: Closed ARC-E by tightening repository guardrails with stricter source-file byte budgets (`api 88_000`, `web 95_000`) plus production-only line budgets (`api 1_700`, `web 2_200`), and publishing architecture maintainability closure/residual-risk snapshot in `docs/architecture/architecture-maintainability-closure-2026-04-19.md`. Validation: `pnpm run quality:guardrails` => `PASS`.
- [x] `ARC-20 docs(architecture-closure): publish maintainability delta and residual-risk snapshot`
  - 2026-04-19: Published ARC closure report with refreshed hotspot metrics, delta versus 2026-04-18 baseline, and explicit residual-risk register in `docs/architecture/architecture-maintainability-closure-2026-04-19.md`.
- [x] `ARC-19 chore(guardrails): tighten production hotspot budgets after refactor waves`
  - 2026-04-19: Updated `scripts/repoGuardrails.mjs` with stricter source-file byte budgets and new production-only line-budget guardrail check, keeping current repository state green.
- [x] `ARC-C group closure (ARC-11..ARC-13)`
  - 2026-04-19: Closed ARC-C by introducing shared indicator kernel ownership (`strategyIndicatorKernel.ts`), rewiring runtime decision evaluation and backtest indicator projection to the shared kernel, extracting interleaved portfolio simulation into `backtestPortfolioSimulation.service.ts`, and adding runtime-vs-backtest parity regression locks (`backtestRuntimeKernelParity.test.ts`). Validation: `pnpm --filter api run typecheck` => `PASS`; focused ARC-C pack => `57/57 PASS`; `pnpm --filter api run build` => `PASS`.
- [x] `ARC-13 test(api-parity): regression lock for shared kernel parity (runtime vs backtest)`
  - 2026-04-19: Added focused parity regression suite `backtestRuntimeKernelParity.test.ts` covering EMA/MACD/RSI and derivative channels (funding z-score, open-interest delta, order-book depth ratio).
- [x] `ARC-12 refactor(api-backtests): reduce backtests.service to facade over dedicated services`
  - 2026-04-19: Reduced `backtests.service.ts` responsibility by extracting interleaved portfolio simulation ownership into `backtestPortfolioSimulation.service.ts` and keeping service-level orchestration/facade exports stable.
- [x] `ARC-11 feat(api-domain-kernel): extract shared indicator projection/evaluation kernel for runtime+backtests`
  - 2026-04-19: Added shared indicator resolver kernel (`strategyIndicatorKernel.ts`), rewired `strategySignalEvaluator` and `runtimeSignalDecisionEngine` to use the shared resolver, and migrated backtest indicator series projection to the same kernel path.
- [x] `UXR-H planning queued (dashboard manual-order advanced inputs and context expansion)`
  - 2026-04-19: Published execution-ready tiny-commit wave in `docs/planning/uxr-h-dashboard-manual-order-advanced-plan-2026-04-19.md` (`UXR-H-01..UXR-H-10`) covering price input + market-price fill, qty minimum-executable constraints, qty slider row, bot-context order meta (`order type/margin mode/leverage`), side-aware cost/max summary, and manual-order container simplification while preserving existing submit behavior.
- [x] `ARC-B group closure (ARC-06..ARC-10)`
  - 2026-04-19: Closed ARC-B end-to-end by extracting runtime trades/positions read seams, moving runtime close-position into command service ownership, introducing backend aggregate monitoring endpoint (`GET /dashboard/bots/:id/runtime-monitoring/aggregate`), and switching web monitoring aggregate loading to API-first with client fallback.
- [x] `ARC-10 test(api+web-monitoring): lock aggregate read-model contract and fallback behavior`
  - 2026-04-19: Added focused API e2e coverage for aggregate monitoring endpoint (`bots.monitoring-aggregate.e2e.test.ts`) and web fallback/API-first contract tests in `botsMonitoringAggregate.service.test.ts`.
- [x] `ARC-09 feat(api-monitoring): add aggregate monitoring read endpoint for web consumers`
  - 2026-04-19: Added API aggregate read service (`runtimeMonitoringAggregateRead.service.ts`) and route/controller wiring for `GET /dashboard/bots/:id/runtime-monitoring/aggregate` with status/symbol/session-limit query support.
- [x] `ARC-08 refactor(api-bots-command): move close-position command path out of read service`
  - 2026-04-19: Moved runtime close-position orchestration from `botsRuntimeRead.service.ts` into dedicated command ownership (`runtimeSessionPositionCommand.service.ts`) and re-exported through `botsCommand.service.ts`.
- [x] `ARC-07 refactor(api-bots-read): split trades/positions read models and repositories`
  - 2026-04-19: Extracted runtime trades and positions read ownership into dedicated read repositories/services (`runtimeSessionTradesRead*`, `runtimeSessionPositionsRead*`) and reduced `botsRuntimeRead.service.ts` to API seam exports.
- [x] `ARC-06 refactor(api-bots-read): split session/symbol-stats read models from botsRuntimeRead.service`
  - 2026-04-19: Extracted session list/detail ownership into `runtimeSessionRead.service.ts` and symbol-stats read-model assembly into `runtimeSessionSymbolStatsRead.service.ts`; `botsRuntimeRead.service.ts` now keeps only trades/positions/close flows plus re-exports for session/symbol-stats APIs. Validation: `pnpm --filter api run typecheck` => `PASS`; `pnpm --filter api run test -- src/modules/bots/bots.runtime-scope.e2e.test.ts --run` => `3/3 PASS`; `pnpm run quality:guardrails` => `PASS`.
- [x] `ARC-D group closure (ARC-14..ARC-18)`
  - 2026-04-19: Closed ARC-D end-to-end by extracting dashboard-home view-model/route contract seams, moving bots monitoring aggregation into a dedicated service, splitting DataTable column-visibility state helpers, removing BacktestRunDetails locale-branch literals, and adding focused seam-regression tests. Validation: `pnpm --filter web run typecheck` => `PASS`; focused ARC-D regression pack => `37/37 PASS`.
- [x] `ARC-18 test(web-ux-regression): lock decomposed container behavior and loading/stream states`
  - 2026-04-19: Added focused seam tests for extracted ARC-D contracts: `runtimeOnboardingConfig.test.tsx`, `botsMonitoringAggregate.service.test.ts`, `useDataTableColumnVisibilityState.test.ts`.
- [x] `ARC-17 fix(web-i18n): remove remaining BacktestRunDetails inline locale-branch labels`
  - 2026-04-19: Replaced inline locale ternaries in `BacktestRunDetails` with namespace-driven copy contract labels and aligned tests to locale-agnostic assertions.
- [x] `ARC-16 refactor(web-datatable): split DataTable internals into state hooks/primitives`
  - 2026-04-19: Extracted DataTable column visibility ownership into `useDataTableColumnVisibilityState.ts` and rewired `DataTable.tsx` to use the dedicated helper.
- [x] `ARC-15 refactor(web-bots-monitoring): move client-side aggregation to API aggregate consumer`
  - 2026-04-19: Moved bots monitoring aggregate payload assembly into `botsMonitoringAggregate.service.ts` and reduced `useBotsMonitoringController` responsibility to orchestration.
- [x] `ARC-14 refactor(web-dashboard-home): split HomeLiveWidgets into view-model hooks + route contract config`
  - 2026-04-19: Extracted onboarding route/step contract and runtime selection view-model from `HomeLiveWidgets.tsx` into dedicated modules.
- [x] `ARC-05 test(api-runtime): split and lock runtime regression by extracted seams`
  - 2026-04-19: Added seam-owned regression tests (`runtimeSignalLoopSupervisor.test.ts`, `runtimeFinalCandleDecision.service.test.ts`) and fixed null-direction test fixture drift so final-candle no-trade path remains locked under extracted runtime services.
- [x] `ARC-04 refactor(api-runtime): extract final-candle decision execution application service`
  - 2026-04-19: Extracted final-candle decision/execution flow into `runtimeFinalCandleDecision.service.ts` and converted `runtimeSignalLoop` to delegate the runtime decision path through the extracted application service.
- [x] `ARC-03 refactor(api-runtime): extract supervisor/watchdog from runtimeSignalLoop`
  - 2026-04-19: Extracted watchdog/stall/auto-restart ownership into `runtimeSignalLoopSupervisor.ts` and rewired `runtimeSignalLoop` to supervisor callbacks while preserving existing runtime behavior and tests.
- [x] `ARC-02 refactor(api-runtime): extract typed runtime/live-ordering config from runtime services`
  - 2026-04-19: Added typed runtime execution config module (`apps/api/src/config/runtimeExecution.ts`) and moved env parsing out of `runtimeSignalLoop.service.ts` and `orders.service.ts`; added config regression tests in `runtimeExecution.test.ts`.
- [x] `ARC-01 docs(contract): freeze ARC decomposition boundaries and no-drift guardrails`
  - 2026-04-19: Published canonical ARC decomposition/no-drift contract in `docs/architecture/runtime-critical-path-decomposition-contract.md` and linked resolved decision in `open-decisions`.
- [x] `PLNC-A group closure (PLNC-01..PLNC-04)`
  - 2026-04-19: Closed planning-catalog reconciliation wave by publishing deterministic plan-classification index (`planning-catalog-index-2026-04-19.md`), syncing stale status headers in completed waves, adding canonical queue ownership linkage in non-closed planning docs, and syncing canonical queue/context files (`mvp-next-commits`, `mvp-execution-plan`, `TASK_BOARD`, `PROJECT_STATE`).
- [x] `UXR-G-B group closure (UXR-G-04..UXR-G-06)`
  - 2026-04-18: Closed dashboard wallet/manual-order ergonomics wave Stage B by enforcing 50/50 free-funds vs in-positions layout, adding focused sidebar regression assertions in `HomeLiveWidgets.test.tsx`, and running closure checks: `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` => `16/16 PASS`, `pnpm --filter web run typecheck` => `PASS`, `pnpm --filter web run build` => `PASS`.
- [x] `UXR-G-A group closure (UXR-G-01..UXR-G-03)`
  - 2026-04-18: Closed Stage A by freezing wallet/manual-order layout contract in docs, moving manual-order panel below wallet as a peer sidebar section, and aligning wallet summary-row order/style (`Allocation -> Delta -> Portfolio`).
- [x] `Planning catalog coverage audit queued (post-BRS/UXR-G follow-up waves)`
  - 2026-04-18: Reviewed `docs/planning` coverage against canonical queue/execution context and queued post-active waves in `docs/planning/planning-catalog-coverage-follow-up-plan-2026-04-18.md` for (a) planning status drift reconciliation (`PLNC`), (b) architecture maintainability remediation (`ARC`), (c) position lifecycle parity (`POS-36..42`), and (d) production verification closure (`OPV`) with explicit ordering after `BRS` and `UXR-G`.
- [x] `UXR-G planning queued (dashboard wallet/manual-order layout polish)`
  - 2026-04-18: Published queued wave in `docs/planning/uxr-g-dashboard-wallet-manual-order-layout-plan-2026-04-18.md` with `UXR-G-01..UXR-G-06` (manual-order section placement under wallet context, wallet KPI row style/order polish, 50/50 free-funds/in-positions layout, and focused dashboard-home regression/closure checks) and linked grouped batches `UXR-G-A..UXR-G-B` in canonical queue.
- [x] `BRS-01 docs(decision): close dashboard runtime selected-bot scope policy (ACTIVE-only canonical + PAUSED exclusion default)`
  - 2026-04-18: Closed pending selected-bot runtime scope decision in `open-decisions` with strict canonical policy: default dashboard `signals/markets` scope is `ACTIVE + isEnabled` canonical groups/links only; `PAUSED` groups are excluded by default; session/event fallback can enrich canonical symbols only (no symbol expansion); legacy mapping is compatibility fallback only and cannot override canonical strategy context. Synced module contracts in `docs/modules/api-bots.md` and `docs/modules/web-dashboard-home.md`.
- [x] `BRS-02 test(api-red): add failing regression for symbol leakage across canonical/legacy/session/event scope`
  - 2026-04-18: Added focused API regression in `apps/api/src/modules/bots/bots.e2e.test.ts` (`keeps runtime symbol-stats strictly within selected bot canonical ACTIVE scope`) covering `A=1 active symbol`, `B=4 symbols`, paused-group contamination, and foreign session-stat/event symbols; expected contract is strict `['BTCUSDT']` only for selected bot.
- [x] `BRS-03 fix(api-runtime-repository): narrow runtime read filters to ACTIVE canonical groups/links only`
  - 2026-04-18: Updated runtime repository and strategy-display canonical queries to exclude `PAUSED` groups from default runtime read scope (`botsRuntimeRead.repository.ts`, `runtimeStrategyDisplayBySymbol.service.ts`) while keeping ownership and `isEnabled` filters intact.
- [x] `BRS-04 fix(api-runtime-symbol-scope): stop symbol expansion beyond canonical selected-bot scope`
  - 2026-04-18: Hardened `listBotRuntimeSessionSymbolStats` symbol resolution to canonical active scope only (plus explicit `query.symbol` behavior), removing session/event fallback expansion path (`botsRuntimeRead.service.ts`).
- [x] `BRS-A group closure (BRS-01..BRS-04)`
  - 2026-04-18: Stage A implementation completed end-to-end (`decision + regression + repository scope narrowing + service scope hardening`). Validation: `pnpm --filter api run typecheck` => `PASS`, `pnpm run quality:guardrails` => `PASS`; targeted e2e execution is currently blocked in this environment because Docker Engine/`localhost:5432` is unavailable.
- [x] `BRS-05 test(api-red-update-contract): add failing regression for PUT /dashboard/bots/:id canonical update drift`
  - 2026-04-18: Added canonical update-path regression in `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts` (`updates canonical runtime graph mapping when strategyId and marketGroupId are changed via PUT`) asserting runtime-graph canonical group+strategy mapping after update.
- [x] `BRS-06 fix(api-update-contract): make PUT /dashboard/bots/:id update canonical group+strategy mapping transactionally`
  - 2026-04-18: Updated `updateBot` in `apps/api/src/modules/bots/botsCommand.service.ts` to synchronize canonical `botMarketGroup + marketGroupStrategyLink` mapping in the same transaction as bot metadata updates (strategy/market-group update path), while keeping legacy helper as compatibility mirror.
- [x] `BRS-07 fix(api-strategy-precedence): enforce canonical-first symbol->strategy assignment`
  - 2026-04-18: Enforced canonical-first symbol strategy projection in `apps/api/src/modules/bots/runtimeSymbolStatsEnrichment.service.ts` by applying canonical market-group strategy links before legacy `botStrategy` fallback.
- [x] `BRS-08 test(api-regression): lock strict selected-bot scope + canonical strategy precedence`
  - 2026-04-18: Added strict scope + precedence regression in `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts` (`keeps strict selected-bot scope and resolves strategy context from canonical links before legacy fallback`) validating: no foreign symbols from session/event fallback, no paused-group leakage, canonical strategy context shown for selected bot symbols.
- [x] `BRS-B group closure (BRS-05..BRS-08)`
  - 2026-04-18: Stage B implementation completed end-to-end (`update-contract regression + transactional canonical update path + canonical-first runtime precedence + closure regression pack`). Validation: `pnpm --filter api run typecheck` => `PASS`; `pnpm run quality:guardrails` => `PASS`; `pnpm --filter api test -- src/modules/bots/bots.runtime-scope.e2e.test.ts` => `3/3 PASS`.
- [x] `BRS-09 test(web-regression): lock dashboard switch scenario A(1 symbol) vs B(4 symbols)`
  - 2026-04-18: Added dashboard regression `keeps signal and context cards scoped when switching selected bot from A(1) to B(4)` in `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`, asserting A-symbol/context eviction and B-scope rendering (`4` symbols + signal rail pager visibility) after selector switch.
- [x] `BRS-10 refactor(web-runtime-contract): adapt dashboard runtime consumer only if API payload contract changes`
  - 2026-04-18: Verified current API payload shape remains compatible with web runtime consumer; no adapter/refactor changes required in `useHomeLiveWidgetsController.ts`.
- [x] `BRS-11 qa(regression-pack): run focused API+WEB runtime scope regression pack`
  - 2026-04-18: Validation PASS pack completed: `pnpm --filter api test -- src/modules/bots/bots.runtime-scope.e2e.test.ts` => `3/3 PASS`; `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` => `16/16 PASS`; `pnpm --filter api run typecheck` => `PASS`; `pnpm --filter web run typecheck` => `PASS`.
- [x] `BRS-12 docs(closure): publish remediation evidence and sync canonical queue/execution statuses`
  - 2026-04-18: Synced `BRS-09..BRS-12` completion in canonical queue + execution plan and advanced `NOW` focus beyond `BRS-C`.
- [x] `BRS-C group closure (BRS-09..BRS-12)`
  - 2026-04-18: Stage C completed end-to-end (`web switch regression + contract compatibility verification + focused QA + docs sync`) and group marked done.
- [x] `BRS planning queued (dashboard selected-bot runtime scope remediation)`
  - 2026-04-18: Published runtime scope remediation wave in `docs/planning/dashboard-selected-bot-runtime-scope-remediation-plan-2026-04-18.md` (`BRS-01..BRS-12`) covering strict selected-bot API scope, canonical-first strategy precedence, `PUT /dashboard/bots/:id` canonical update drift fix, and dashboard bot-switch regressions (`A=1 symbol`, `B=4 symbols`); promoted `BRS-01..BRS-05` to `NOW`.
- [x] `QH-TSC-01 chore(web-verify-script): add canonical sequential build+typecheck script for web`
  - 2026-04-18: Added deterministic web verification script chain (`apps/web: verify:build-typecheck`, root shortcut `web:verify:build-typecheck`) to avoid `.next/types` race-prone manual command ordering. Validation: `pnpm run web:verify:build-typecheck` => `PASS`.
- [x] `QH-LINT-02 chore(web-hook-deps-cleanup): resolve remaining exhaustive-deps warnings in backtests/wallets tables`
  - 2026-04-18: Stabilized `BacktestsRunsTable` status-label resolver with `useCallback` and aligned `columns` dependency contract; stabilized `WalletsListTable` clone handler with `useCallback` to prevent per-render function identity churn in table columns memo. Validation: `pnpm --filter web run build` => `PASS` (no lint warnings in touched scope, clean build warning surface); `pnpm --filter web run typecheck` => `PASS` (rerun after build/type generation).
- [x] `QH-LINT-01 chore(web-build-warning-cleanup): remove no-unused-vars warnings in bots/dashboard-home surfaces`
  - 2026-04-18: Derived next tiny task after closing `UXR-F-D` and clearing canonical queue checkboxes; removed unused import/vars in `BotsManagement.tsx`, `BotsManagement.test.tsx`, `HomeLiveWidgets.tsx`, and `useCloseRuntimePositionAction.ts`. Validation: `pnpm --filter web run build` => `PASS` (warning count reduced to two remaining `react-hooks/exhaustive-deps` warnings in unrelated scope); `pnpm --filter web run typecheck` => `PASS` (rerun after build to refresh `.next/types`).
- [x] `UXR-F-D closed: completed UXR-F-13..UXR-F-14`
  - 2026-04-18: Completed `UXR-F-13` focused regression pack (`pnpm --filter web test -- src/features/wallets/components/WalletCreateEditForm.test.tsx src/features/markets/components/MarketUniverseForm.test.tsx src/features/backtest/components/BacktestCreateForm.test.tsx src/features/bots/components/BotCreateEditForm.test.tsx src/app/dashboard/wallets/create/page.test.tsx src/app/dashboard/wallets/[id]/edit/page.test.tsx src/app/dashboard/bots/create/page.test.tsx src/app/dashboard/bots/[id]/edit/page.test.tsx src/i18n/translations.test.ts src/i18n/namespaceRegistry.test.ts`) => `10/10 files PASS`, `33/33 tests PASS`; completed `UXR-F-14` closure checks (`pnpm --filter web run typecheck` + `pnpm --filter web run build`) => `PASS`, and published closure evidence in `docs/operations/_artifacts-uxr-f-d-closure-2026-04-18.json` + `docs/operations/uxr-f-d-closure-2026-04-18.md`.
- [x] `UXR-F-C progress: completed UXR-F-12 (group closed)`
  - 2026-04-18: Completed `UXR-F-12` by adding reusable sticky mobile action bar primitive (`FormMobileActionBar`) and applying it to long dashboard forms (`bots`, `wallets`, `markets`) so save action remains reachable on mobile while desktop action layout remains unchanged (`hidden md:inline-flex` top actions + mobile sticky save). Validation: `pnpm --filter web test -- src/ui/forms/FormPrimitives.test.tsx src/app/dashboard/bots/create/page.test.tsx src/app/dashboard/bots/[id]/edit/page.test.tsx src/app/dashboard/wallets/create/page.test.tsx src/app/dashboard/wallets/[id]/edit/page.test.tsx` => `13/13 PASS`; `pnpm --filter web run typecheck` => `PASS`.
- [x] `UXR-F-C progress: completed UXR-F-11 (group in progress)`
  - 2026-04-18: Completed `UXR-F-11` by standardizing submit-state ergonomics and validation synchronization across scoped forms: `MarketUniverseForm` + `BacktestCreateForm` + `StrategyForm` now share summary/inline/first-invalid behavior, and markets/backtests/strategies create-edit wrappers now expose disabled/loading save actions during submit. Validation: `pnpm --filter web test -- src/features/markets/components/MarketUniverseForm.test.tsx src/features/backtest/components/BacktestCreateForm.test.tsx src/features/strategies/components/StrategyForm.test.tsx src/i18n/translations.test.ts` => `17/17 PASS`; `pnpm --filter web run typecheck` => `PASS`; `pnpm i18n:audit:route-reachable:web` => `PASS`.
- [x] `UXR-F-C progress: completed UXR-F-10 (group in progress)`
  - 2026-04-18: Completed `UXR-F-10` by migrating `BotCreateEditForm` internals to shared `ui/forms` primitives and adding unified submit-time validation summary plus first-invalid focus behavior for required setup fields (`name`, `wallet`, `strategy`, `market group`) while preserving wallet-context safety checks and wallet-first create payload contract. Validation: `pnpm --filter web test -- src/features/bots/components/BotCreateEditForm.test.tsx src/i18n/translations.test.ts` => `9/9 PASS`; `pnpm --filter web run typecheck` => `PASS`.
- [x] `UXR-F-C progress: completed UXR-F-09 (group in progress)`
  - 2026-04-18: Completed `UXR-F-09` by aligning strategy form shell and `Basic` section to shared `ui/forms` primitives while preserving tab navigation, and migrating strategy-form copy from locale-branching to namespace-driven `dashboard.strategies.form.*` keys (`en/pl/pt` parity). Validation: `pnpm --filter web test -- src/i18n/translations.test.ts src/features/strategies/components/StrategyFormSections/Indicators.test.tsx` => `11/11 PASS`; `pnpm --filter web run typecheck` => `PASS`.
- [x] `UXR-F-B closed: completed UXR-F-05..UXR-F-08`
  - 2026-04-18: Completed `UXR-F-08` by aligning `BacktestCreateForm` internals to shared `ui/forms` primitives (`FormSectionCard`, `FormGrid`, `SelectField`, `NumberField`, `TextareaField`) while preserving venue-context and seed-config contracts. Validation: `pnpm --filter web test -- src/features/backtest/components/BacktestCreateForm.test.tsx` => `4/4 PASS`; `pnpm --filter web run typecheck` => `PASS`.
  - 2026-04-18: Completed `UXR-F-07` by migrating `MarketUniverseForm` from feature-local `FieldControls` to shared `ui/forms` primitives (`TextField`, `SelectField`, `FormField`) and deleting obsolete `FieldControls.tsx`. Validation: `pnpm --filter web test -- src/features/markets/components/MarketUniverseForm.test.tsx` => `6/6 PASS`; `pnpm --filter web run typecheck` => `PASS`.
  - 2026-04-18: Completed `UXR-F-06` by migrating `WalletCreateEditForm` to shared `ui/forms` primitives with unified section/field contract, validation summary surfacing, and guarded first-invalid focus behavior compatible with test/runtime environments. Validation: `pnpm --filter web test -- src/features/wallets/components/WalletCreateEditForm.test.tsx` => `4/4 PASS`; `pnpm --filter web run typecheck` => `PASS`.
  - 2026-04-18: Completed `UXR-F-05` by migrating dashboard create/edit wrappers to namespace-driven copy and shared form-shell contract across wallets/markets/strategies/bots wrappers.
- [x] `UXR-F-A progress: completed UXR-F-01..UXR-F-04 (group closed)`
  - 2026-04-18: Completed `UXR-F-04` by enforcing no cross-feature generic `FieldControls` imports in `scripts/repoGuardrails.mjs` and removing existing backtest coupling (`BacktestCreateForm` now imports shared `ui/forms`). Validation: `pnpm --filter web test -- src/ui/forms/FormPrimitives.test.tsx src/ui/forms/FormFields.test.tsx src/features/backtest/components/BacktestCreateForm.test.tsx` => `13/13 PASS`; `pnpm --filter web run typecheck` + `pnpm run quality:guardrails` => `PASS`.
  - 2026-04-18: Completed `UXR-F-03` by adding canonical shared field primitives (`Text/Number/Select/Textarea/Toggle/RadioGroup/Range/Compound`) under `apps/web/src/ui/forms` with interaction coverage in `FormFields.test.tsx`.
  - 2026-04-18: Completed `UXR-F-02` by introducing shared form core primitives (`FormPageShell`, `FormSectionCard`, `FormGrid`, `FormField`, `FormAlert`, `FormValidationSummary`) and baseline tests in `FormPrimitives.test.tsx`.
  - 2026-04-18: Completed `UXR-F-01` by locking Stage A migration boundaries in canonical decision docs (`open-decisions`, `mvp-execution-plan`).
- [x] `UXR-E-C progress: completed UXR-E-09..UXR-E-12 (group closed)`
  - 2026-04-18: Completed `UXR-E-12` closure pack after fixing public-footer layout test environment contract (`matchMedia` mock): `next build` => `PASS`, `tsc --noEmit -p apps/web/tsconfig.json` => `PASS`, focused Vitest pack => `11/11 files PASS`, `30/30 tests PASS`.
  - 2026-04-18: Completed `UXR-E-11` by removing `(PT)` suffix from Portuguese labels (`public.localeNames.pt`, `dashboard-shell.common.languages.portuguese`), updating `LanguageSwitcher`/`I18nProvider` expectations, and centering public footer rows on mobile with new `Footer.layout` regression in public shell. Validation: `tsc --noEmit -p apps/web/tsconfig.json` => `PASS`; full focused regression pack confirmed in `UXR-E-12`.
  - 2026-04-18: Completed `UXR-E-10` by updating `PageTitle` action contract to remove forced compact sizing (`btn-xs`, `h-7`, `min-h-7`) and widening actions container spacing to `gap-3`, with explicit regression assertions in `PageTitle.a11y.test.tsx`. Validation: `tsc --noEmit -p apps/web/tsconfig.json` => `PASS`; targeted Vitest run blocked in this sandbox (`spawn EPERM`).
  - 2026-04-18: Completed `UXR-E-09` by refactoring runtime sidebar wallet KPI block into inline summary rows (removed icon-card styling, preserved portfolio/free/in-positions readability, and added subtle row border tones for free/in-positions) with regression lock in `HomeLiveWidgets.test.tsx` (`wallet-kpi-row` no grid contract). Validation: `tsc --noEmit -p apps/web/tsconfig.json` => `PASS`; targeted Vitest run is blocked in current sandbox due `spawn EPERM` (esbuild child process restriction).
- [x] `UXR-E-B progress: completed UXR-E-05..UXR-E-08 (group closed)`
  - 2026-04-18: Completed `UXR-E-08` by adding runtime-sidebar manual-order estimates (`notional` + `margin`) computed from qty, live symbol price, and effective leverage (with `SPOT` fallback `1x`), plus regression assertions in `HomeLiveWidgets.test.tsx` and `en/pl/pt` namespace key additions for estimate labels. Validation: `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` => `15/15 PASS`; `pnpm --filter web run typecheck` => `PASS`.
  - 2026-04-18: Completed `UXR-E-07` by moving runtime manual-order controls under wallet context in `RuntimeSidebarSection` (guided symbol select + BUY/SELL pill controls) and wiring deterministic symbol selection synchronization in `HomeLiveWidgets`; updated `HomeLiveWidgets.test.tsx` for `manual-order-panel` contract and guided interactions. Validation: `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` => `15/15 PASS`; `pnpm --filter web run typecheck` => `PASS`.
  - 2026-04-18: Completed `UXR-E-06` by migrating `BacktestsRunsTable` and `BotsListTable` to canonical `TableUi` preset actions (`preview/runtime/edit/delete`) and adding focused regression coverage (`BacktestsRunsTable.test.tsx`, updated `BotsListTable.test.tsx`). Validation: `pnpm --filter web test -- src/features/markets/components/MarketUniversesTable.test.tsx src/features/strategies/components/StrategiesList.test.tsx src/features/backtest/components/BacktestsRunsTable.test.tsx src/features/bots/components/BotsListTable.test.tsx` => `5/5 PASS`; `pnpm --filter web run typecheck` => `PASS`.
- [x] `UXR-E-A (commits UXR-E-01..UXR-E-04): table action system + clone foundation`
  - 2026-04-18: Closed `UXR-E-A` by completing `UXR-E-01..UXR-E-04` (frozen action/clone contract in canonical docs, added shared table-action preset layer in `TableUi`, implemented wallets clone action with deterministic `(clone)` naming + create-from-existing payload + list append callback + test coverage, and implemented markets clone action with same deterministic naming/payload/list-append contract + component coverage). Validation: `pnpm --filter web test -- src/features/wallets/components/WalletsListTable.test.tsx src/features/markets/components/MarketUniversesTable.test.tsx` => `3/3 PASS`; `pnpm --filter web run typecheck` => `PASS`.
- [x] `DBSEL-A (commits DBSEL-01..DBSEL-05): dashboard mixed-mode selector parity hotfix (LIVE + PAPER)`
  - 2026-04-18: Closed `DBSEL-A` by completing `DBSEL-01..DBSEL-05` (contract freeze for mixed `LIVE + PAPER` selector behavior, red regression for hidden active `PAPER` option when `LIVE` exists, removal of live-only snapshot clamp in `useHomeLiveWidgetsController`, mixed-mode selector persistence + degraded no-session regression coverage, and focused QA closure artifacts in `docs/operations/_artifacts-dbsel-a-selector-parity-2026-04-18.json` + `docs/operations/dbsel-a-selector-parity-closure-2026-04-18.md`). Validation: `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` => `15/15 PASS`; `pnpm --filter web run typecheck` + `pnpm --filter web run build` => `PASS`.
- [x] `L10NQ-D-C (commits 11-18): shared foundation localization + parity/smoke/closure`
  - 2026-04-18: Closed `L10NQ-D-C` by completing `L10NQ-D-11..L10NQ-D-18` (offline+risk notice localization, shared a11y key migration, shell/footer key alignment, profile/wallet residual literal cleanup, legacy backtests/presets localization contract hardening, expanded `en/pl/pt` parity assertions, route-level locale smoke on high-impact routes, and final closure evidence artifacts in `docs/operations/_artifacts-l10nq-d-closure-2026-04-18.json` + `docs/operations/l10nq-d-closure-2026-04-18.md`). Validation: `pnpm --filter web test -- src/i18n/translations.test.ts src/i18n/namespaceRegistry.test.ts src/i18n/guardrails.test.ts src/i18n/I18nProvider.test.tsx src/i18n/I18nProvider.route-loading.test.tsx src/i18n/routeLocaleSmoke.test.ts` => `16/16 PASS`; `pnpm --filter web run typecheck` + `pnpm --filter web run build` + `docker build -f apps/api/Dockerfile.worker.backtest .` => `PASS`.
- [x] `L10NQ-D-B (commits 06-10): reports/markets/backtests/bots/home copy migration`
  - 2026-04-18: Closed `L10NQ-D-B` by completing `L10NQ-D-06..L10NQ-D-10` (reports/markets/backtests/bots/dashboard-home copy migration), including removal of HomeLiveWidgets local branch-based literals for manual-order and position-edit flows in favor of `dashboard-home.runtime` namespace keys with `en/pl/pt` parity and route-scoped test alignment.
- [x] `UXR-F planning queued (dashboard create/edit forms UX/UI unification)`
  - 2026-04-18: Published queued implementation wave plan in `docs/planning/uxr-f-dashboard-forms-unification-plan-2026-04-18.md` with tiny-commit execution order (`UXR-F-01..UXR-F-14`), stage DoD, per-stage risk/rollback, and test packs; appended grouped queue batches `UXR-F-A..UXR-F-D` without changing active `NOW`.
- [x] `DBSEL-A planning queued (dashboard mixed-mode selector parity)`
  - 2026-04-18: Published dashboard runtime selector parity hotfix plan in `docs/planning/dashboard-runtime-bot-selector-parity-plan-2026-04-18.md` after confirming live-only clamp in `useHomeLiveWidgetsController`, and queued grouped execution batch `DBSEL-A` for mixed active `LIVE + PAPER` selector visibility fix.
- [x] `L10NQ-D-A (commits 01-05): inventory + guardrail hardening + auth/admin migration`
  - 2026-04-18: Closed `L10NQ-D-A` by completing `L10NQ-D-01..L10NQ-D-05` (frozen full-scope route-reachable audit artifacts and module/shared split docs, added deterministic pnpm-runnable route-reachable i18n audit command + JSON contract in `scripts/auditRouteReachableI18n.mjs` and `docs/operations/i18n-route-reachable-audit-contract.md`, hardened guardrails with seeded regression fixture coverage for local-copy/fallback-pl/hardcoded-UI checks, migrated auth forms/hooks/pages/password-toggle to `auth` namespace keys with `pl` fallback removal, and migrated admin users/subscriptions/layout copy to `admin` namespace keys including modal backdrop close label). Validation: `pnpm --filter web test -- src/i18n/guardrails.test.ts src/i18n/namespaceRegistry.test.ts src/i18n/translations.test.ts src/features/auth/components/LoginForm.test.tsx src/features/auth/components/RegisterForm.test.tsx src/features/auth/hooks/useLoginForm.test.tsx src/features/admin/users/pages/AdminUsersPage.test.tsx src/features/admin/subscriptions/pages/AdminSubscriptionsPage.test.tsx` => `24/24 PASS`; `pnpm i18n:audit:route-reachable:web` => `PASS`; `pnpm --filter web run typecheck` + `pnpm --filter web run build` + `pnpm --filter api run typecheck` + `pnpm --filter api build` + `docker build -f apps/api/Dockerfile.worker.backtest .` => `PASS`.
- [x] `UXR-E planning queued (post-L10NQ-D)`
  - 2026-04-18: Published post-`L10NQ-D` implementation wave plan in `docs/planning/uxr-e-table-actions-clone-dashboard-polish-plan-2026-04-18.md` and queued grouped execution batches `UXR-E-A..UXR-E-C` in canonical queue files for executor continuity.
- [x] `L10NQ-D planning activation (full web i18n coverage)`
  - 2026-04-18: Activated new execution wave from full route-reachable audit by publishing `docs/planning/l10nq-d-total-web-i18n-coverage-plan-2026-04-18.md`, `docs/operations/_artifacts-l10nq-d-coverage-audit-2026-04-18.json`, `docs/operations/l10nq-d-coverage-audit-2026-04-18.md`, and `docs/operations/l10nq-d-route-coverage-matrix-2026-04-18.md`, then promoting `L10NQ-D-01..L10NQ-D-05` to `NOW`.
- [x] `BTMM-C (commits 11-12): confidence pack + closure`
  - 2026-04-17: Closed `BTMM-C` by completing `BTMM-11..BTMM-12` (executed focused parity confidence pack for 1-symbol/3-symbol/50-symbol diagnostics, validated web backtest details source-label contract, and published closure evidence in `docs/operations/_artifacts-btmm-confidence-pack-2026-04-17.json` + `docs/operations/btmm-remediation-closure-2026-04-17.md`). Validation: `pnpm --filter api test -- src/modules/backtests/backtests.contract-remediation.test.ts` => `6/6 PASS`; `pnpm --filter api test -- src/modules/backtests/backtestParity3Symbols.test.ts` => `21/21 PASS`; `pnpm --filter api test -- src/modules/backtests/backtests.e2e.test.ts` => `10/10 PASS`; `pnpm --filter api test -- src/modules/backtests/backtestReplayCore.test.ts` => `24/24 PASS`; `pnpm --filter web test -- src/features/backtest/components/BacktestRunDetails.test.tsx` => `3/3 PASS`; `pnpm --filter web test -- src/features/backtest/hooks/useBacktestRunCoreData.test.tsx` => `4/4 PASS`; `pnpm --filter api run typecheck` + `pnpm --filter web run typecheck` + `pnpm --filter api build` + `pnpm --filter web run build` + `docker build -f apps/api/Dockerfile.worker.backtest .` => `PASS`.
- [x] `BTMM-B (commits 06-10): cache continuity + UI/source-of-truth alignment + regressions`
  - 2026-04-17: Closed `BTMM-B` by completing `BTMM-06..BTMM-10` (added DB cache candle-interval continuity validation with automatic network fallback/backfill on gaps in `backtestDataGateway`, separated run-level symbol totals and grouped trades into `useBacktestRunCoreData` for explicit source-of-truth split, updated `BacktestRunDetails` pair stats to label run totals vs chart-window values, and added regression coverage for terminal timeline anchoring across all terminal statuses plus no-re-adaptation of legacy `maxCandles`). Validation: `pnpm --filter api test -- src/modules/backtests/backtests.contract-remediation.test.ts src/modules/backtests/backtestRunJob.test.ts src/modules/backtests/backtestDataGateway.test.ts` => `10/10 PASS`; `pnpm --filter api test -- src/modules/backtests/backtests.e2e.test.ts` => `10/10 PASS`; `pnpm --filter web test -- src/features/backtest/hooks/useBacktestRunCoreData.test.tsx src/features/backtest/components/BacktestRunDetails.test.tsx` => `7/7 PASS`; `pnpm --filter api run typecheck` + `pnpm --filter web run typecheck` + `pnpm --filter api build` + `pnpm --filter web run build` + `docker build -f apps/api/Dockerfile.worker.backtest .` => `PASS`.
- [x] `BTMM-A (commits 01-05): multi-market parity contract + core backtest fixes`
  - 2026-04-17: Closed `BTMM-A` by completing `BTMM-01..BTMM-05` (froze multi-market parity contract in canonical docs, added parity remediation contract tests for 1-symbol vs 50-symbol divergence + replay-context defaults, removed double adaptive `maxCandles` by introducing single persisted `requestedMaxCandles/effectiveMaxCandles` contract reused across create/job/timeline, switched terminal timeline anchor to run-level `finishedAt` for terminal statuses, and added timeline replay context `isolated|portfolio` with default `isolated` for deterministic pair diagnostics). Validation: `pnpm --filter api test -- src/modules/backtests/backtests.contract-remediation.test.ts src/modules/backtests/backtestRunJob.test.ts src/modules/backtests/backtests.e2e.test.ts src/modules/backtests/backtestParity3Symbols.test.ts` => `37/37 PASS`; `pnpm --filter api run typecheck` + `pnpm --filter api build` + `docker build -f apps/api/Dockerfile.worker.backtest .` => `PASS`.
- [x] `L10NQ-C (commits 12-15): route-level namespace loading + English docs normalization`
  - 2026-04-17: Closed `L10NQ-C` by completing `L10NQ-12..L10NQ-15` (added route-level namespace loading in `I18nProvider`/`namespaceRegistry` with route-scoped translation cache and navigation listeners for `popstate/pushState/replaceState`, added route-loading regression tests for no missing-key flicker and locale persistence, normalized localization docs to English-only `en/pl/pt` policy, and introduced governance docs-language guardrail with non-English backlog list). Validation: `pnpm --filter web test -- src/i18n/I18nProvider.test.tsx src/i18n/I18nProvider.route-loading.test.tsx src/i18n/namespaceRegistry.test.ts src/app/dashboard/bots/page.test.tsx` => `7/7 PASS`; `pnpm --filter api build` + `docker build -f apps/api/Dockerfile.worker.backtest .` => `PASS`.
- [x] `L10NQ-B (commits 06-11): per-module namespace split + parity/guardrail tests`
  - 2026-04-17: Closed `L10NQ-B` by completing `L10NQ-06..L10NQ-11` (introduced explicit i18n namespace architecture by route/domain with `namespaceRegistry` + deterministic route mapping, added module namespaces for `public/auth/dashboard-backtests/dashboard-markets/dashboard-strategies/dashboard-wallets/dashboard-reports/admin`, migrated backtests+bots wrapper labels/toasts to translation keys, removed static `languageOptions.json` coupling and localized language labels in `LanguageSwitcher`, added dev-only missing-key diagnostics with route namespace hints in `I18nProvider`, added namespace parity and i18n guardrail tests, and replaced EN-placeholder PT copy on critical `dashboard-shell/home/bots` paths). Validation: `pnpm --filter web test -- src/i18n/translations.test.ts src/i18n/I18nProvider.test.tsx src/i18n/useLocaleFormatting.test.tsx src/ui/layout/dashboard/LanguageSwitcher.test.tsx src/i18n/namespaceRegistry.test.ts src/i18n/guardrails.test.ts src/app/dashboard/backtests/create/page.test.tsx src/app/dashboard/backtests/list/page.test.tsx src/app/dashboard/bots/page.test.tsx` => `14/14 PASS`; `pnpm --filter web run typecheck` + `pnpm --filter web run build` + `pnpm --filter api run typecheck` + `pnpm --filter api build` + `docker build -f apps/api/Dockerfile.worker.backtest .` => `PASS`.
- [x] `L10NQ-A (commits 01-05): i18n P0 blockers (backtest clamp + wrapper hardcoded copy)`
  - 2026-04-17: Closed `L10NQ-A` by completing `L10NQ-01..L10NQ-05` (scope + docs-language baseline locked in `open-decisions`, baseline inventory artifacts published in `docs/operations/_artifacts-l10nq-a-baseline-2026-04-17.json` + `docs/operations/l10nq-a-baseline-2026-04-17.md`, EN/PL locale clamps removed from backtest create/list/table/details paths with PT support, PT regression tests added for backtest create/list flows, and wrapper/module hardcoded-copy hotspots migrated to locale-aware copy in reports/markets/auth/admin/market-universe surfaces). Validation: `pnpm --filter web test -- src/features/backtest/components/BacktestCreateForm.test.tsx src/features/backtest/components/BacktestsListView.test.tsx src/features/backtest/components/BacktestRunDetails.test.tsx src/features/backtest/components/BacktestsList.test.tsx src/features/auth/components/LoginForm.test.tsx src/features/auth/components/RegisterForm.test.tsx src/features/auth/hooks/useLoginForm.test.tsx` => `18/18 PASS`; `pnpm --filter web test -- src/features/markets/components/MarketUniverseForm.test.tsx src/features/admin/users/pages/AdminUsersPage.test.tsx src/features/admin/subscriptions/pages/AdminSubscriptionsPage.test.tsx` => `11/11 PASS`; `pnpm --filter web run typecheck` + `pnpm --filter web run build` + `pnpm --filter api run typecheck` + `pnpm --filter api build` + `docker build -f apps/api/Dockerfile.worker.backtest .` => `PASS`.
- [x] `UXR-D (commits 23-30): bots IA/runtime polish + breadcrumb/footer + regression closure`
  - 2026-04-17: Closed `UXR-D` by completing `UXR-23..UXR-30` (removed list-level assistant action, improved bots-runtime readability tabs, removed local runtime refresh controls in favor of automatic refresh, enforced duplicate-active guard by `wallet+strategy+market-group` tuple, simplified bot-form IA into one two-row setup section with full i18n copy, normalized backtests breadcrumb labels to `List/Create` with linkable module title, centered dashboard footer rows on mobile, and executed focused regression/build/deploy-parity pack). Validation: API sequential e2e (`orders-positions`, `apiKey`, `markets`, `wallets`, `bots.duplicate-guard`, `logs`) => `49/49 PASS`; WEB focused pack (`HomeLiveWidgets`, `BotCreateEditForm`, `BotsManagement`, `BotsListTable`, `ApiKeyForm`, `AuditTrailView`, `PageTitle.a11y`, `Footer.layout`) => `49/49 PASS`; `pnpm --filter api run typecheck` + `pnpm --filter api build` + `pnpm --filter web run typecheck` + `pnpm --filter web run build` + `docker build -f apps/api/Dockerfile.worker.backtest .` => `PASS`.
- [x] `UXR-30 qa(regression-pack): run focused API+WEB tests and manual smoke for live/paper parity`
  - 2026-04-17: Executed focused parity regression pack covering dashboard runtime tabs/actions/manual order path, markets composition, profile sync, wallet edit guard, bots duplicate guard, runtime auto-refresh behavior, and logs completeness; all targeted suites + build parity checks passed.
- [x] `UXR-29 fix(web-footer-mobile): center both dashboard footer rows on mobile`
  - 2026-04-17: Updated dashboard footer container alignment to center both rows on mobile and keep split layout on desktop; added `Footer.layout.test.tsx` regression for class-level contract.
- [x] `UXR-28 fix(web-backtests-breadcrumb): normalize labels to List/Create and make module header linkable`
  - 2026-04-17: Normalized backtests breadcrumb/action labels to `List/Create` and added module-title linkability when breadcrumb module item has `href`, with coverage in `PageTitle.a11y.test.tsx`.
- [x] `UXR-27 ux(web-bot-form): simplify IA (one section, two rows), clarify live opt-in, complete i18n`
  - 2026-04-17: Refactored bot create/edit form to one setup section with two-row IA (identity/context + runtime toggles/summary), added live opt-in helper copy and paper-mode info block, and moved remaining hardcoded form copy to dashboard-bots i18n namespaces (`en/pl/pt`).
- [x] `UXR-26 fix(api-bots-duplicate-guard): enforce uniqueness by wallet+market+strategy tuple`
  - 2026-04-17: Extended duplicate-active guard to include `walletId` on create/update paths, updated API conflict copy, and added e2e coverage allowing active duplicate only when wallet differs.
- [x] `UXR-25 fix(web-runtime-refresh): remove local refresh controls and use automatic interval only`
  - 2026-04-17: Removed monitoring-level auto-refresh toggle/manual refresh button and hardened monitoring controller to always use automatic refresh cadence while monitoring tab is active.
- [x] `UXR-24 refactor(web-bots-runtime): tabbed runtime layout with dashboard-like readability`
  - 2026-04-17: Refined bots module tabs and monitoring quick-navigation into clearer tabbed layouts with compact icon+label affordances for better runtime readability.
- [x] `UXR-23 feat(web-bots-list): hide assistant action in V1 list view`
  - 2026-04-17: Removed Assistant action from bots list row actions while keeping assistant route/feature intact and updated list regression assertions.
- [x] `UXR-C (commits 16-22): advanced table rollout + logs module completion`
  - 2026-04-17: Closed `UXR-C` by completing `UXR-16..UXR-22` (API-key form IA reorder, profile sync determinism+audit observability, wallets migration to shared `DataTable`, active-bot wallet edit guard, `DataTable` advanced-mode core, rollout to wallets/markets/strategies/backtests/bots, and logs module migration + bot runtime/execution/sync completeness API assertions). Validation pack: `pnpm --filter web test -- src/features/profile/components/ApiKeyForm.test.tsx src/ui/components/DataTable.test.tsx src/features/wallets/components/WalletsListTable.test.tsx src/features/logs/components/AuditTrailView.test.tsx` => `18/18 PASS`, `pnpm --filter api test -- src/modules/profile/apiKey/apiKey.e2e.test.ts src/modules/wallets/wallets.crud.e2e.test.ts src/modules/logs/logs.e2e.test.ts` => `27/27 PASS`, `pnpm --filter api run typecheck` + `pnpm --filter api build` + `pnpm --filter web run typecheck` + `pnpm --filter web run build` + `docker build -f apps/api/Dockerfile.worker.backtest .` => `PASS`.
- [x] `UXR-22 feat(web+api-logs): migrate logs view to unified table UX and verify bot-message completeness`
  - 2026-04-17: Migrated `AuditTrailView` from bespoke table layout to shared `DataTable` (`advancedMode`, column visibility, row-level trace expansion, preserved source/severity filters + refresh), and added API completeness regression for bot runtime/execution/sync log visibility in owner timeline (`logs.e2e`).
- [x] `UXR-21 feat(web-tables): apply advanced table mode to wallets/markets/strategies/backtests/bots`
  - 2026-04-17: Applied shared advanced table mode with persisted column-visibility preferences across wallets/markets/strategies/backtests/bots list views using dedicated preference keys (`wallets.list`, `markets.list`, `strategies.list`, `backtests.runs.list`, `bots.list`).
- [x] `UXR-20 feat(web-table-core): shared advanced table options (column visibility + expandable details)`
  - 2026-04-17: Added `advancedMode` opt-in contract to `DataTable` that standardizes advanced controls (columns personalization + table settings/pagination surface) as a reusable core toggle for list modules.
- [x] `UXR-19 fix(api-wallet-guard): block wallet edits when wallet is used by active bot`
  - 2026-04-17: Added backend edit guard rejecting wallet updates when referenced by an active bot (`409 wallet is used by active bot and cannot be edited`) with structured bot context in error details and e2e coverage in `wallets.crud.e2e`.
- [x] `UXR-18 refactor(web-wallets-list): migrate wallets list to shared DataTable pattern`
  - 2026-04-17: Replaced legacy wallets HTML table with shared `DataTable` rendering (search/sort, advanced mode, column visibility, row details expansion, icon-action row controls), preserving delete-confirm modal flow.
- [x] `UXR-17 fix(api-profile-sync): make API sync action deterministic and observable`
  - 2026-04-17: Normalized profile API-key sync/manage flags to deterministic contract (`manageExternalPositions=true` forces `syncExternalPositions=true`), added stable fallback handling for unexpected probe failures, and enriched API-key test audit metadata (`probeMode`, `probeLatencyMs`, `apiKeyId`) with e2e assertions.
- [x] `UXR-16 ux(web-profile-api): redesign API key form row layout and helper blocks`
  - 2026-04-17: Reordered API-key form into requested operational steps (identity row -> API key -> API secret -> Sync -> Allow -> requirements/permissions) while preserving existing validation/test flows and mobile/desktop behavior; added UI-order regression in `ApiKeyForm.test.tsx`.
- [x] `UXR-15 fix(api-markets): enforce same universe composition contract on backend`
  - 2026-04-17: Enforced backend market-universe sync contract for linked symbol groups as `(min-volume filtered catalog U whitelist) - blacklist` in `markets.service` (including sync triggers on `filterRules/exchange/marketType/baseCurrency` updates), and added API regression for composed sync behavior in `markets.e2e`. Validation pack: `pnpm --filter api test -- src/modules/markets/markets.e2e.test.ts` => `9/9 PASS`.
- [x] `UXR-B (commits 06-15): dashboard/table/action UX + markets/profile/wallet baseline`
  - 2026-04-17: Closed `UXR-B` by completing `UXR-13..UXR-15`; refilled canonical queue for continuation (`NOW`: `UXR-16..UXR-20`, `NEXT`: `UXR-21..UXR-25`, `PIPELINE`: `UXR-26..UXR-30`), preserving grouped execution continuity for `UXR-C` and `UXR-D`.
- [x] `UXR-14 feat(web-markets-form): compose symbol universe from (min-volume U whitelist) - blacklist`
  - 2026-04-17: Updated markets form composition contract to compute preview universe as `(volume-filtered catalog U whitelist) - blacklist` via shared helper (`composeMarketUniverseSymbols`) and locked regression coverage for composed preview behavior in edit mode. Validation pack: `pnpm --filter web test -- src/features/markets/components/MarketUniverseForm.test.tsx` => `6/6 PASS`.
- [x] `UXR-13 feat(web-dashboard-manual-order): add manual order panel using existing bot order pipeline`
  - 2026-04-17: Added dashboard `Manual order` operator panel in `HomeLiveWidgets` (symbol/side/quantity) and wired submit flow to existing backend command path (`POST /dashboard/orders/open`) via shared `openDashboardManualOrder` service helper, including mode-aware payload (`botId/walletId/strategyId`, `PAPER/LIVE`, `riskAck` for live), success/error toasts, and runtime refresh after submit. Validation pack: `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` => `13/13 PASS`, `pnpm --filter web run typecheck` => `PASS`.
- [x] `UXR-12 feat(api-position-edit): expose safe manual update endpoint for TP/SL and metadata`
  - 2026-04-17: Added safe manual position-update API (`PATCH /dashboard/positions/:id/manual-update`) with ownership guard, OPEN-only gate, directional TP/SL validation (`LONG`/`SHORT` side-aware), and audit metadata log (`position.manual_update`); wired dashboard position-edit modal save action to the endpoint with success/error handling and runtime refresh. Validation pack: `pnpm --filter api test -- src/modules/orders/orders-positions.e2e.test.ts` => `11/11 PASS`, `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` => `12/12 PASS`, `pnpm --filter web run typecheck` => `PASS`.
- [x] `UXR-11 feat(web-position-edit-modal): add reusable modal shell + initial position-edit form`
  - 2026-04-17: Added reusable dashboard `FormModal` shell and integrated an initial open-position edit flow in `HomeLiveWidgets` with per-row edit action (TP/SL/notes/lock-rules draft + runtime context block), preserving close-action behavior and extending widget regression coverage for edit modal fields. Validation pack: `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` => `12/12 PASS`, `pnpm --filter web run typecheck` => `PASS`.
- [x] `UXR-10 fix(api-close-position): align close-position button flow with backend close handler`
  - 2026-04-17: Hardened runtime close-position endpoint to be idempotent for repeated dashboard closes by resolving already-closed owned positions to `status=closed` (using latest CLOSE trade/order reference) instead of returning false-negative `ignored`, and added API regression assertion for repeated close call contract. Validation pack: `pnpm --filter api test -- src/modules/orders/orders-positions.e2e.test.ts` => `9/9 PASS`, `pnpm --filter api test -- src/modules/bots/bots.e2e.test.ts -t "closes open runtime position from dashboard endpoint and enforces risk acknowledgement"` => `1/1 PASS`.
- [x] `UXR-09 fix(web-actions): implement per-row pending state for concurrent close actions`
  - 2026-04-17: Replaced dashboard close-position single pending flag with per-row pending map (`isClosingPosition`) so concurrent close actions render independent loading state per row; added hook regression coverage for two simultaneous closes with stepwise completion state checks. Validation pack: `pnpm --filter web test -- src/features/dashboard-home/hooks/useCloseRuntimePositionAction.test.tsx` => `2/2 PASS`, `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` => `12/12 PASS`.
- [x] `UXR-08 fix(web-positions-table): move close column to last, rename to Action, use icon button`
  - 2026-04-17: Refactored open-positions table action column to always render as the last column (after dynamic `TTP/TSL`), switched close action to icon-only button with accessible labels/tooltips, and aligned widget regression assertions for compact `Action` column ordering; validation pack: `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` => `12/12 PASS`.
- [x] `UXR-07 feat(web-dashboard-tabs): rename tab labels to positions/orders/history`
  - 2026-04-17: Renamed runtime dashboard tab labels to short forms (`positions/orders/history`) across EN/PL/PT namespaces (`dashboard-home.*`) and aligned widget regression assertions to the new tab copy; validation pack: `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` => `12/12 PASS`.
- [x] `UXR-06 feat(web-dashboard-wallet): redesign wallet KPI row + wallet icon consistency`
  - 2026-04-17: Redesigned wallet summary into a compact first-row KPI layout (`portfolio/free funds/in positions`) with consistent wallet-icon treatment and responsive 1->3 column behavior in runtime sidebar, plus regression lock for new KPI row/card contract in `HomeLiveWidgets.test.tsx`; validation pack: `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` => `12/12 PASS`.
- [x] `UXR-05 feat(api-paper-orders): align PAPER order lifecycle with unified orders read model`
  - 2026-04-17: Removed runtime-session `createdAt` clamp from open-orders read path for `PAPER`, aligning both modes to a unified open-order visibility contract (`LIVE_EXCHANGE` + `PAPER_SIMULATED` carryover shown in runtime dashboard payload), and added PAPER carryover regression coverage in `orders-positions.e2e`; validation pack: `pnpm --filter api test -- src/modules/orders/orders-positions.e2e.test.ts` => `9/9 PASS`.
- [x] `UXR-A (commits 01-05): ownership + open-orders parity foundations`
  - 2026-04-17: Closed grouped foundation wave after completing `UXR-01..UXR-05`; promoted `UXR-06..UXR-10` to active `NOW` and staged `UXR-11..UXR-15` in `NEXT`.
- [x] `UXR-04 feat(api-orders-sync): persist and reconcile LIVE open orders into unified read model/cache`
  - 2026-04-17: Relaxed runtime open-orders read-window filter for `LIVE` mode so carryover exchange-backed open orders created before current runtime session start remain visible in dashboard runtime payload, and added API regression coverage (`orders-positions.e2e`) for LIVE carryover visibility; validation pack: `pnpm --filter api test -- src/modules/orders/orders-positions.e2e.test.ts` => `8/8 PASS`.
- [x] `UXR-03 fix(api-runtime): deterministic exchange-position takeover mapping for dashboard open positions`
  - 2026-04-17: Fixed runtime takeover ownership resolver to LIVE-only active candidates (`PAPER` bots excluded from `EXCHANGE_SYNC` symbol-owner arbitration), and hardened close flow for externally owned rows by claiming missing `botId/walletId` before orchestration (fail-closed preserved); validation pack: `pnpm --filter api test -- src/modules/orders/orders-positions.e2e.test.ts` => `7/7 PASS`, `pnpm --filter web test -- src/features/dashboard-home/hooks/useCloseRuntimePositionAction.test.tsx` => `1/1 PASS`.
- [x] `UXR-02 test(api+web): add failing coverage for missing exchange positions and close-position action error`
  - 2026-04-17: Added API failing coverage in `orders-positions.e2e` for two runtime regressions (`EXCHANGE_SYNC` `BOT_MANAGED` position not visible for LIVE bot when PAPER bot shares symbol ownership scope, and close-position returning `ignored` instead of `closed` in LIVE dashboard flow) plus WEB hook coverage for `ignored` close-response handling (`useCloseRuntimePositionAction.test.tsx`); validation pack: `pnpm --filter api test -- src/modules/orders/orders-positions.e2e.test.ts` => `2 failing / 5 passing` (expected red baseline), `pnpm --filter web test -- src/features/dashboard-home/hooks/useCloseRuntimePositionAction.test.tsx` => `1/1 PASS`.
- [x] `UXR-01 docs(contract): freeze dashboard positions/orders ownership and visibility matrix`
  - 2026-04-17: Locked canonical ownership/actionability matrix for dashboard `positions/orders/history` in `open-decisions.md`, synchronized runtime API contract notes in `docs/modules/api-bots.md`, and synchronized web tab visibility/actionability contract in `docs/modules/web-dashboard-home.md` (including deterministic external takeover ownership order and fail-closed close-action behavior).
- [x] `BOPS-66 ops(ux-checklist): execute dashboard+bots operational UX checklist and close creator-form section contract gap`
  - 2026-04-17: Executed `docs/operations/dashboard-bots-operational-ux-checklist.md` with fresh regression/build evidence (`pnpm --filter web test -- src/features/bots/components/BotCreateEditForm.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/bots/components/BotsManagement.test.tsx src/app/dashboard/dashboard.a11y.smoke.test.tsx src/ui/layout/dashboard/PageTitle.a11y.test.tsx src/ui/layout/dashboard/Header.responsive.test.tsx` => `34/34 PASS`, `pnpm --filter web run build` PASS), fixed `/dashboard/bots/create` creator IA to explicit 3 sections (`Basics/Market/Strategy`), added regression assertion for section headings, and marked checklist A-F as PASS with execution notes.
- [x] `WSPLIT-A worker-split-decision-closure: resolve open Worker Split Timing policy and sync canonical plans`
  - 2026-04-17: Closed `WSPLIT-A` by completing `WSPLIT-01` (resolved `Worker Split Timing` in `open-decisions.md` with explicit `PROD` mandatory split policy plus `STAGE/DEV` trigger thresholds based on queue lag/API latency/restart-burst conditions, synchronized canonical queue/plan files, and validated with `pnpm run docs:parity:check` PASS).
- [x] `WSPLIT-01 docs(decision): close Worker Split Timing with explicit split policy and thresholds using docs/planning/worker-split-timing-decision-closure-plan-2026-04-17.md`
  - 2026-04-17: Published decision closure plan and locked stage/dev split triggers (`queue lag`, `API p95 + lag coupling`, `restart burst`) with escalation contract references to deployment/SLO/incident docs.
- [x] `NAVHF-A dashboard-nav-regression: remove unnecessary top-level Exchanges link from main dashboard menu`
  - 2026-04-17: Closed `NAVHF-A` by completing `NAVHF-01` (removed top-level `Exchanges` from dashboard header nav model for desktop/mobile, updated responsive regression assertions to enforce no `Exchanges` link, and validated with `pnpm --filter web test -- src/ui/layout/dashboard/Header.responsive.test.tsx` + `pnpm --filter web run typecheck`, both PASS).
- [x] `NAVHF-01 fix(web-nav): remove top-level Exchanges link regression from dashboard menu (introduced in 1b91763) using docs/planning/dashboard-nav-exchanges-removal-hotfix-plan-2026-04-17.md`
  - 2026-04-17: Removed top-level `Exchanges` menu entry in `Header` and refreshed nav-order assertions (`Wallets` before `Markets`) plus desktop/mobile absence checks in `Header.responsive` contract tests.
- [x] `L10NPT-A localization(pt-pt): execute European Portuguese rollout queue from docs/planning/pt-pt-localization-rollout-plan-2026-04-17.md (pt-PT only, no pt-BR)`
  - 2026-04-17: Closed `L10NPT-A` by completing `L10NPT-01..L10NPT-12` (locale contract expanded to `en/pl/pt`, switcher + namespace support for Portuguese, shared/page/feature locale branches widened, i18n parity tests refreshed, hardcoded-locale scan cleared, smoke/build validation pack PASS, and closure evidence published in `docs/operations/_artifacts-l10npt-rollout-2026-04-16T22-59-22-697Z.json` + `docs/operations/l10npt-rollout-closure-2026-04-17.md`), promoting `NAVHF-01` as active `NOW`.
- [x] `L10NPT-12 docs(closure): publish rollout evidence and sync canonical queue statuses`
  - 2026-04-17: Published closure evidence report `docs/operations/l10npt-rollout-closure-2026-04-17.md` with linked JSON artifact and synchronized queue/plan statuses for `L10NPT-A`.
- [x] `L10NPT-11 qa(web-smoke): manual PT smoke across dashboard/public/profile/auth`
  - 2026-04-17: Completed smoke validation pack across i18n/header-footer/dashboard/auth/profile surfaces via targeted web tests and build (`42/42` tests PASS across smoke suites + `pnpm --filter web run build` PASS).
- [x] `L10NPT-10 qa(i18n-hardcoded-scan): rerun hardcoded-locale scan and close remaining hotspots`
  - 2026-04-17: Reran non-test web scan for `locale === 'pl'` and `"en" | "pl"` patterns; result `0` matches captured in rollout artifact `docs/operations/_artifacts-l10npt-rollout-2026-04-16T22-59-22-697Z.json`.
- [x] `L10NPT-09 test(i18n-contract): update tests for en/pl/pt key parity and persistence`
  - 2026-04-17: Updated i18n contract suites (`translations`, `I18nProvider`, `useLocaleFormatting`, `LanguageSwitcher`) for EN/PL/PT parity and persistence; targeted run PASS (`8/8`).
- [x] `L10NPT-08 refactor(profile-wallet-markets): remove remaining en/pl-only branches in forms and tables`
  - 2026-04-17: Widened locale maps for profile/wallets/markets forms and tables (`ProfilePage`, `WalletCreateEditForm`, `WalletsListTable`, `MarketUniversesTable`) to include Portuguese branch support.
- [x] `L10NPT-07 refactor(strategies-localizers): widen strategy helper locale maps to include Portuguese`
  - 2026-04-17: Extended strategy localization contracts (`Indicators`, indicator presentation/taxonomy, preset picker/presentation) to support `pt` locale paths with deterministic fallback behavior.
- [x] `L10NPT-06 refactor(web-page-copy): migrate page-level inline copy to include Portuguese`
  - 2026-04-17: Expanded dashboard/auth/public page-level copy maps to EN/PL/PT in markets/strategies/wallets and auth page entrypoints.
- [x] `L10NPT-05 refactor(web-shared-copy): remove en/pl-only branches in shared layout/components`
  - 2026-04-17: Replaced shared UI `en/pl` copy forks with EN/PL/PT maps in public header, profile menu, theme switch, and dashboard page-title accessibility strings.
- [x] `L10NPT-04 feat(i18n-namespaces): add dashboard namespace translation files for Portuguese`
  - 2026-04-17: Added Portuguese namespace files `dashboard-shell.pt.ts`, `dashboard-home.pt.ts`, and `dashboard-bots.pt.ts` and wired them into translation composition.
- [x] `L10NPT-03 feat(web-language-switcher): add Portuguese option in language switcher (header/footer)`
  - 2026-04-17: Added `pt` option to language dataset and switcher contract, including persistence + visual regression coverage in `LanguageSwitcher`/`I18nProvider` tests.
- [x] `L10NPT-02 feat(i18n-core): extend locale contract to en/pl/pt + pt-PT formatting`
  - 2026-04-17: Extended i18n core locale contract (`translations`, `I18nProvider`, `useLocaleFormatting`, `themeBootstrap`) with `pt` and `pt-PT` formatting mapping.
- [x] `L10NPT-01 docs(contract): lock Portuguese locale policy to pt-PT only and forbid pt-BR in this rollout`
  - 2026-04-17: Confirmed and synchronized canonical locale policy docs (`open-decisions` + rollout plan) to keep `pt-PT` only and forbid `pt-BR` in this wave.
- [x] `DOCSYNC-A docs-parity-sustainment: periodic parity audit refresh + queue continuity safeguards`
  - 2026-04-17: Closed `DOCSYNC-A` by completing `DOCSYNC-01..DOCSYNC-04` (fresh docs parity artifact `docs/operations/_artifacts-docs-parity-2026-04-16T22-37-19-622Z.json` with `PASS` result, published sustainment evidence `docs/operations/documentation-parity-sustainment-evidence-2026-04-17.md`, refreshed module/route inventory snapshots, and added cadence/ownership guardrails in working agreements), promoting `L10NPT-01..L10NPT-05` into active `NOW`.
- [x] `DOCSYNC-04 docs(governance): capture sustainment cadence and ownership in working agreements`
  - 2026-04-17: Added `Documentation Parity Sustainment (Cadence and Ownership)` contract in `docs/governance/working-agreements.md` with weekly parity run cadence, explicit ownership, and evidence requirements.
- [x] `DOCSYNC-03 chore(planning-queue): validate NOW/NEXT refill continuity and align canonical queue`
  - 2026-04-17: Refilled canonical one-task queue to next group by promoting `L10NPT-01..L10NPT-05` into `NOW`, `L10NPT-06..L10NPT-10` into `NEXT`, and `L10NPT-11..L10NPT-12` into `PIPELINE`.
- [x] `DOCSYNC-02 docs(module-index): refresh module+route inventory snapshots after parity run`
- 2026-04-17: Refreshed snapshot metadata in `docs/modules/module-doc-status-index.md`, `docs/modules/system-modules.md`, and `docs/architecture/reference/dashboard-route-map.md` with current date plus latest parity artifact reference.
- [x] `DOCSYNC-01 ops(docs-parity): run docs parity check and publish fresh evidence artifact`
  - 2026-04-17: Ran `pnpm run docs:parity:check -- --json --output docs/operations/_artifacts-docs-parity-2026-04-16T22-37-19-622Z.json` (`PASS`: `22/22 API`, `15/15 Web`, `37/37 routes`) and published operational summary in `docs/operations/documentation-parity-sustainment-evidence-2026-04-17.md`.
- [x] `A11Y-A accessibility-full-pass: full dashboard accessibility closure (automated + manual + evidence)`
  - 2026-04-17: Closed `A11Y-A` by completing `A11Y-02..A11Y-05` (automated route-level accessibility smoke, `PageTitle` semantic remediation for breadcrumb landmark + contextual create-action SR description, and closure evidence artifacts `docs/operations/_artifacts-a11y-full-pass-2026-04-17T00-17-35-000Z.json` + `docs/operations/a11y-full-pass-closure-2026-04-17.md`), promoting `DOCSYNC-A` into active `NOW`.
- [x] `A11Y-05 docs(closure): publish closure evidence and sync canonical docs/plan status`
  - 2026-04-17: Published closure report and canonical audit updates in `docs/operations/a11y-full-pass-closure-2026-04-17.md` and `docs/ux/accessibility-dashboard-audit.md`.
- [x] `A11Y-04 qa(a11y-manual): run keyboard/screen-reader smoke checklist and capture evidence`
  - 2026-04-17: Captured manual-checklist evidence in `docs/operations/_artifacts-a11y-full-pass-2026-04-17T00-17-35-000Z.json` with keyboard-navigation, screen-reader-context, and heading/landmark checks.
- [x] `A11Y-03 fix(web-a11y): remediate highest-priority issues from accessibility smoke findings`
  - 2026-04-17: Remediated `PageTitle` accessibility semantics by adding breadcrumb navigation landmark labeling and contextual SR descriptions for generic page create actions.
- [x] `A11Y-02 test(web-a11y): add automated accessibility smoke for core dashboard routes`
  - 2026-04-17: Added automated smoke suites `apps/web/src/app/dashboard/dashboard.a11y.smoke.test.tsx` and `apps/web/src/ui/layout/dashboard/PageTitle.a11y.test.tsx`; validated with targeted `web` Vitest run (`7/7` PASS).
- [x] `A11Y-01 docs(plan): publish full accessibility pass timeline and resolve open decision`
  - 2026-04-17: Initialized post-PEX continuation by publishing canonical accessibility full-pass plan (`docs/planning/accessibility-full-pass-plan-2026-04-17.md`), resolving `Accessibility Scope` decision in `docs/planning/open-decisions.md`, and promoting `A11Y-02..A11Y-05` into `NOW` with `DOCSYNC-A` staged in `NEXT/PIPELINE`.
- [x] `PEX-B runtime-liveness: bounded auto-restart policy + long-run continuity regression`
  - 2026-04-16: Closed `PEX-B` by completing `PEX-06` validation and extending restart-window guardrail regression (`max attempts` blocked inside window, fresh retry allowed after window expiry) in `runtimeSignalLoop.service.test.ts`.
- [x] `PEX-C observability-ops: runtime alert thresholds + incident triage runbook`
  - 2026-04-16: Closed `PEX-C` by validating alert and freshness contracts (`alerts.test.ts`, `workers-runtime-freshness.test.ts`) and confirming canonical incident runbook `docs/operations/runtime-incident-triage-matrix.md`.
- [x] `PEX-D recoverability: backup verification + restore drill automation + RTO/RPO doc`
  - 2026-04-16: Closed `PEX-D` through canonical evidence reconciliation (backup/restore command artifacts and restore-drill reports under `docs/operations/_artifacts-db-restore-check-*`, `docs/operations/_artifacts-restore-drill-local-*`, plus `docs/operations/v1-rto-rpo-targets.md`).
- [x] `PEX-E secrets-hardening: secret inventory + rotation readiness validation + regression checks`
  - 2026-04-16: Closed `PEX-E` by validating startup-secret readiness checks and tests (`criticalSecretsReadiness.ts`, `criticalSecretsReadiness.test.ts`) and confirming canonical inventory `docs/security/v1-secrets-inventory.md`.
- [x] `PEX-F deploy-safety: post-deploy runtime freshness gate + rollback trigger policy`
  - 2026-04-16: Closed `PEX-F` by validating runtime freshness gate tests (`workers-runtime-freshness.test.ts`) and confirming rollback/release runbook contracts (`docs/operations/deployment-rollback-playbook.md`, `docs/operations/mvp-release-checklist.md`).
- [x] `PEX-A runtime-idempotency: replay-safe runtime execution guards + crash/retry regression`
  - 2026-04-16: Closed `PEX-A` by completing `PEX-03` with a crash-window replay regression (`OPEN` side effect completed, restart replay while dedupe stays `PENDING` => `dedupe_inflight` and zero duplicate `openOrder`/`createPosition`), validating together with existing OPEN/CLOSE restart-reuse coverage; promoted `PEX-B` as active group.
- [x] `WLT-G wallet-qa-release: end-to-end wallet flow QA + runbook + release evidence gate`
  - 2026-04-16: Closed wallet Group G by completing `WLT-23..WLT-25` (end-to-end wallet QA confidence pack, wallet lifecycle + insufficient-funds operator runbook, and release-gate lint/typecheck/tests with evidence artifacts `docs/operations/_artifacts-wlt25-release-gate-2026-04-16T20-49-53-335Z.json` + `docs/operations/wlt25-release-gate-2026-04-16T20-49-53-335Z.md`), promoting `PEX-A` as next active group.
- [x] `WLT-25 release(gate): run lint/typecheck/tests and capture rollout evidence`
  - 2026-04-16: Executed release-gate validation (`pnpm run lint`, `pnpm --filter api run typecheck`, `pnpm --filter web run typecheck`, sequential API e2e wallet-first confidence pack, and wallet-focused web regression pack), all PASS; published rollout evidence artifacts `docs/operations/_artifacts-wlt25-release-gate-2026-04-16T20-49-53-335Z.json` + `docs/operations/wlt25-release-gate-2026-04-16T20-49-53-335Z.md`.
- [x] `WLT-24 docs(runbook): publish operator guide for wallet lifecycle and insufficient-funds troubleshooting`
  - 2026-04-16: Advanced active wallet group `WLT-G` by publishing `docs/operations/wallet-lifecycle-operator-runbook.md` (wallet-first lifecycle procedure + insufficient-funds incident matrix with fast triage, deep diagnostics, and safe mitigations), and linking it from bot and MVP ops runbooks for operator discovery; remaining `WLT-G` scope is `WLT-25`.
- [x] `WLT-23 qa(api+web+runtime): execute end-to-end flow strategy -> bot(wallet) -> paper/live runtime`
  - 2026-04-16: Advanced active wallet group `WLT-G` by running strategy/wallet/bot/runtime/web confidence pack (`strategies.e2e`, `wallets.crud.e2e`, `bots.wallet-contract.e2e`, `preTrade.e2e`, `runtime-flow.e2e`, `runtime-orchestration-smoke.e2e`, wallet pages + bot-form web regressions) plus API/web typecheck (PASS), and stabilized `runtime-flow.e2e` to deterministic PAPER runtime assertions with async polling; remaining `WLT-G` scope is `WLT-24..WLT-25`.
- [x] `WLT-F web-wallet-module: dashboard wallet pages + nav + bot form wallet selector migration`
  - 2026-04-16: Closed wallet Group F by completing `WLT-19..WLT-22` (dashboard nav placement `Exchanges -> Wallets -> Markets`, wallet pages route/form coverage, wallet-first bot form context summary, and regression suite for wallet pages + nav + bot-form payload contract), validated with targeted web tests and `pnpm --filter web run typecheck` (PASS); next wallet group promoted to `WLT-G`.
- [x] `WLT-22 test(web): add regression coverage for wallet pages, nav placement, and bot-form payload changes`
  - 2026-04-16: Added regression coverage for `/dashboard/wallets` redirect + `/dashboard/wallets/list` behavior, nav link placement and routes in `Header.responsive`, and wallet-first bot create payload contract (asserting absence of legacy `mode/paperStartBalance/apiKeyId`); validated with `pnpm --filter web test -- src/app/dashboard/wallets/page.test.tsx src/app/dashboard/wallets/list/page.test.tsx src/ui/layout/dashboard/Header.responsive.test.tsx src/features/bots/components/BotCreateEditForm.test.tsx` + `pnpm --filter web run typecheck` (PASS).
- [x] `WLT-21 refactor(web-bot-form): replace mode/paper-balance controls with wallet selector + context summary`
  - 2026-04-16: Advanced active wallet group `WLT-F` by refining wallet-first bot form contract (`BotCreateEditForm`) with explicit wallet context summary (wallet/mode/venue/LIVE API key status), removing legacy mode/paper-balance expectations from regression tests, and aligning LIVE missing-key validation to i18n copy; validated with `pnpm --filter web test -- src/features/bots/components/BotCreateEditForm.test.tsx` + `pnpm --filter web run typecheck` (PASS); remaining `WLT-F` scope is `WLT-22`.
- [x] `WLT-20 feat(web-wallets): add /dashboard/wallets list/create/edit screens with mode-aware form`
  - 2026-04-16: Advanced active wallet group `WLT-F` by validating wallet web module route contract (`/dashboard/wallets/list`, `/dashboard/wallets/create`, `/dashboard/wallets/[id]/edit`) and mode-aware form behavior/payload for PAPER vs LIVE; verified via wallet create/edit page tests + wallet form component tests and `web typecheck` (PASS); remaining `WLT-F` scope is `WLT-21..WLT-22`.
- [x] `WLT-19 feat(web-nav): add Wallet menu entry between Exchanges and Markets`
  - 2026-04-16: Advanced active wallet group `WLT-F` by restoring `Exchanges` link in dashboard navigation and enforcing desktop order `Exchanges -> Wallets -> Markets` with regression coverage in `Header.responsive.test.tsx`; validated with `pnpm --filter web test -- src/ui/layout/dashboard/Header.responsive.test.tsx` + `pnpm --filter web run typecheck` (PASS); remaining `WLT-F` scope is `WLT-20..WLT-22`.
- [x] `WLT-E runtime-wallet-budget: wallet-based capital checks + walletId runtime attribution`
  - 2026-04-16: Closed wallet Group E by completing `WLT-15..WLT-18` (wallet-first runtime capital context, hard-fail OPEN/DCA wallet free-cash guard, EXIT close-order wallet snapshot attribution, and shared-wallet multi-bot insufficient-funds regressions in runtime tests); validated with targeted runtime suites and `pnpm --filter api run typecheck` (PASS); next wallet group promoted to `WLT-F`.
- [x] `WLT-18 test(runtime): shared-wallet multi-bot concurrency and insufficient-funds regressions`
  - 2026-04-16: Added runtime regressions for shared-wallet multi-bot funds behavior in `runtimeSignalLoop.service.test.ts` (per-route wallet funds guard: insufficient bot blocked, affordable bot executed) and `runtimeCapitalContext.service.test.ts` (shared-wallet reserved-margin accounting across bots); validated with `pnpm --filter api test -- src/modules/engine/runtimeCapitalContext.service.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts` + `pnpm --filter api run typecheck` (PASS).
- [x] `WLT-17 feat(runtime-attribution): persist walletId snapshot on runtime-created positions/orders/trades`
  - 2026-04-16: Advanced active wallet group `WLT-E` by fixing runtime EXIT close-order wallet attribution (`walletId: openPosition.walletId ?? input.walletId`) and locking regression in `executionOrchestrator.service.test.ts` for close order/trade wallet snapshot propagation; validated with `pnpm --filter api test -- src/modules/engine/executionOrchestrator.service.test.ts` + `pnpm --filter api run typecheck` (PASS); remaining `WLT-E` scope is `WLT-18`.
- [x] `WLT-16 feat(runtime-budget): enforce hard-fail wallet free-cash checks for OPEN and DCA`
  - 2026-04-16: Advanced active wallet group `WLT-E` by introducing explicit runtime wallet free-cash guard (`resolveRuntimeWalletFundsExhausted`) used in OPEN pre-trade blocking (`WALLET_INSUFFICIENT_FUNDS`) and aligned DCA guard compatibility, validated via `pnpm --filter api test -- src/modules/engine/runtimeCapitalContext.service.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts` + `pnpm --filter api run typecheck` (PASS); remaining `WLT-E` scope is `WLT-17..WLT-18`.
- [x] `WLT-15 refactor(runtime-capital): resolve reference balance from wallet context (paper/live rules)`
  - 2026-04-16: Advanced active wallet group `WLT-E` by hardening runtime capital resolution to wallet-first semantics (wallet-scoped PAPER/LIVE context with fail-closed behavior when wallet context/API key is missing) and validating via `pnpm --filter api test -- src/modules/engine/runtimeCapitalContext.service.test.ts` + `pnpm --filter api run typecheck` (PASS); remaining `WLT-E` scope is `WLT-16..WLT-18`.
- [x] `QFIX-A runtime-quality(api): telemetry flush fail-safe + runtime typecheck restoration`
  - 2026-04-16: Closed runtime quality cleanup gate by hardening telemetry symbol-stat flush to be fail-safe during teardown races (recoverable Prisma FK `P2003` handling + background flush catch), fixing runtime typecheck regressions in `runtimeSignalLoop*` and `marketStreamFanout*`, and validating with `pnpm --filter api run typecheck`, `pnpm --filter api test -- src/modules/bots/bots.e2e.test.ts src/modules/bots/bots.duplicate-guard.e2e.test.ts`, and `pnpm --filter api test -- src/modules/engine/runtimeSignalLoop.service.test.ts src/modules/market-stream/marketStreamFanout.test.ts` (PASS); next active group promoted to `WLT-E`.
- [x] `WLT-D bot-wallet-migration: require walletId in bot write contract + context compatibility guards`
  - 2026-04-16: Closed wallet Group D by completing `WLT-11..WLT-14` (wallet-first bot write derivation, wallet-marketGroup compatibility guard on wallet switch, deprecated direct execution-field compatibility handling, and targeted regression suite `apps/api/src/modules/bots/bots.wallet-contract.e2e.test.ts`); next wallet group promoted as `WLT-E`.
- [x] `WLT-C wallet-api: wallet CRUD module with mode-aware validation + ownership isolation`
  - 2026-04-16: Closed wallet Group C by completing `WLT-08..WLT-10` (wallet CRUD/ownership API hardening, LIVE-mode allocation validation safety in partial updates, and dedicated e2e coverage for CRUD/validation/delete guards in `apps/api/src/modules/wallets/wallets.crud.e2e.test.ts`); next wallet group promoted as `WLT-D`.
- [x] `WLT-B wallet-db-foundation: Wallet model + walletId snapshots + backfill migration`
  - 2026-04-16: Closed wallet Group B by completing `WLT-04..WLT-07` (Wallet/WalletAllocationMode + `Bot.walletId` DB foundation, walletId snapshots for `Position/Order/Trade`, migration backfill validation for existing bots, and DB-safety evidence via `docs/operations/_artifacts-wallet-db-foundation-2026-04-16T12-10-31-835Z.json` + `docs/operations/wallet-db-foundation-verification-2026-04-16T12-10-31-835Z.md`); next wallet group promoted as `WLT-C`.
- [x] `WLT-A wallet-contracts: wallet source-of-truth docs + decisions + IA placement`
  - 2026-04-16: Closed wallet Group A by completing `WLT-01..WLT-03` (canonical wallet source-of-truth contract, locked wallet-first/open-decisions policy, and dashboard IA placement `Exchanges -> Wallets -> Markets`); next wallet group promoted as `WLT-B`.
- [x] `CPDB-G8 rollout(cpu-db): canary/rollback docs + alert thresholds + 30m soak evidence`
  - 2026-04-16: Closed CPU/DB Group 8 by completing `CPDB-22..CPDB-24` (staged flag rollout + rollback matrix docs, alert-threshold/dashboard contract, and 30-minute soak evidence artifacts `docs/operations/_artifacts-cpdb24-soak-2026-04-16T02-03-29-605Z.json` + `docs/operations/cpdb24-soak-report-2026-04-16T02-03-29-605Z.md` with explicit `FAIL` result), then promoted `WLT-A` as the next active group.
- [x] `CPDB-G7 worker-backpressure(cpu-db): per-series concurrency guard + distributed warmup lock`
  - 2026-04-16: Closed CPU/DB Group 7 by completing `CPDB-19..CPDB-21` (per-series final-candle backpressure queue, distributed warmup lock across replicas, and stress/fanout regression coverage for shared `BTCUSDT/5m` workloads); next CPU/DB group promoted as `CPDB-G8`.
- [x] `CPDB-G6 db-shaping(cpu-db): hot-path indexes + slim topology reads + EXPLAIN evidence`
  - 2026-04-16: Closed CPU/DB Group 6 by completing `CPDB-16..CPDB-18` (runtime hot-path DB indexes, topology read shaping, and EXPLAIN evidence capture); next CPU/DB group promoted as `CPDB-G7`.
- [x] `CPDB-G5 web-polling(cpu-db): adaptive refresh + SSE-first runtime stats with polling fallback`
  - 2026-04-16: Closed CPU/DB Group 5 by completing `CPDB-13..CPDB-15` (visibility-aware polling cadence, SSE-first runtime refresh, and fallback regression coverage); next CPU/DB group promoted as `CPDB-G6`.
- [x] `CPDB-G4 telemetry-write(cpu-db): touchSession throttle + symbol stats batching + query-count checks`
  - 2026-04-16: Closed CPU/DB Group 4 by completing `CPDB-10..CPDB-12` (telemetry heartbeat throttling + symbol-stat debounce batching with flush on session close, execution OPEN leverage-query removal via decision-context pass-through, and query-count regressions for telemetry/execution paths); next CPU/DB group promoted as `CPDB-G5`.
- [x] `CPDB-G3 signal-routing(cpu-db): seriesKey routing index + pretrade position-count cache`
  - 2026-04-16: Closed CPU/DB Group 3 by completing `CPDB-07..CPDB-09` (seriesKey routing index for eligible final-candle groups, short-TTL pre-trade open-position count cache with runtime OPEN/CLOSE invalidation, and parity tests for cache reuse/invalidation risk-cap enforcement); next CPU/DB group promoted as `CPDB-G4`.
- [x] `CPDB-G2 runtime-cache(cpu-db): active topology cache + invalidation + parity tests`
  - 2026-04-16: Closed CPU/DB Group 2 by completing `CPDB-04..CPDB-06` (topology cache service with TTL/version invalidation, final-candle cache read integration with fail-safe direct fallback, and parity regressions for cache hit/miss/invalidation); next CPU/DB group promoted as `CPDB-G3`.
- [x] `CPDB-G1 baseline(cpu-db): contract freeze + runtime hot-path metrics + parity-safe assertions`
  - 2026-04-16: Closed CPU/DB Group 1 by completing `CPDB-01..CPDB-03` (flag contract freeze, runtime hot-path metrics instrumentation, and parity-safe regression tests); next CPU/DB group promoted as `CPDB-G2`.
- [x] `planning(queue-refill): repopulate canonical NOW/NEXT pipeline from active execution plans`
  - 2026-04-16: Refilled canonical execution queue from active plan backlogs (`cpu-db-optimization-commit-plan-2026-04-06.md`, `wallet-module-implementation-plan-2026-04-07.md`, `production-excellence-plan-2026-04-03.md`) to guarantee continuous next-group visibility after each group completion.
- [x] `OPT-08 prefs-sync(web): cache/throttle profile preference sync (DataTable + account preferences)`
  - 2026-04-16: Closed parent `OPT-08` objective via completed slice `OPTC-20` (shared profile preference cache/sync for DataTable + account preferences), with final QA evidence covered in `OPTC-21`.
- [x] `OPT-07 ux-guardrails(web): replace window.confirm/location.assign with app-level modal + navigation helpers`
  - 2026-04-16: Closed parent `OPT-07` objective via completed slice `OPTC-19` (app-level confirmation + navigation helper migration across bots/security/wallet/auth hotspots).
- [x] `OPT-06 i18n(web): split monolithic translations into domain namespaces + remove remaining hardcoded copy`
  - 2026-04-16: Closed parent `OPT-06` objective via completed slice `OPTC-18` (domain namespace split for EN/PL translation payloads).
- [x] `OPT-05 contracts(shared): create shared exchange enum/capability contracts for API + Web`
  - 2026-04-16: Closed parent `OPT-05` objective via completed slices `OPTC-13..15` (shared exchange contracts package + API/Web migration).
- [x] `OPT-04 runtime-ui-split(web): decompose HomeLiveWidgets + BotsManagement into smaller domain modules`
  - 2026-04-16: Closed parent `OPT-04` objective via completed slices `OPTC-16..17` (runtime dashboard component decomposition).
- [x] `OPT-03 async-errors(web): standardize async action + error mapping across page-level create/edit/list flows`
  - 2026-04-16: Closed parent `OPT-03` objective via completed slices `OPTC-10..12` (shared async/error resolver adoption in create/edit/list flows).
- [x] `OPT-02 normalization(api): unify symbol/baseCurrency normalization primitives and remove local uppercase variants`
  - 2026-04-16: Closed parent `OPT-02` objective via completed slices `OPTC-06..09` (shared normalization helpers + API migration + regression contracts).
- [x] `OPT-01 error-taxonomy(api): replace string-code Error.message flow with typed domain errors + central mapper`
  - 2026-04-16: Closed parent `OPT-01` objective by consolidating completed implementation slices `OPTC-01..OPTC-05` (typed `AppError/DomainError` primitives, central HTTP mapper wiring, and controller/service migrations across wallets/markets/strategies/bots/orders/profile/security/subscriptions); validation evidence captured in linked OPTC entries (`api typecheck` + targeted e2e/unit packs).
- [x] `OPTC-21 qa(repo): run full lint/typecheck/guardrails + targeted e2e confidence pack and publish evidence`
  - 2026-04-16: Executed full repo quality gates (`pnpm run lint`, API+web typecheck, `pnpm run quality:guardrails`) plus targeted API/Web confidence pack (`8` API e2e files, `70` tests; `5` web regression files, `15` tests), and published evidence artifacts `docs/operations/_artifacts-engineering-optimization-confidence-2026-04-15T23-26-17-682Z.json` + `docs/operations/engineering-optimization-confidence-pack-2026-04-15T23-26-17-682Z.md` (PASS).
- [x] `OPTC-20 perf(web-prefs): centralize profile preference cache/sync (DataTable + account prefs)`
  - 2026-04-16: Added shared profile basic cache service (`profileBasicCache`) with in-flight dedupe + TTL + optimistic patch merge, migrated account preference hook (`useUser`) and DataTable column-visibility hydration/save paths to this shared contract, and removed direct `/dashboard/profile/basic` calls outside the cache service; validated with `pnpm --filter web test -- src/ui/components/DataTable.test.tsx` + `pnpm --filter web run typecheck` (PASS).
- [x] `OPTC-19 ux(web-guardrails): replace window.confirm/location.assign with app modal + navigation helper`
  - 2026-04-16: Replaced `window.confirm` flows with app-level async `ConfirmModal` patterns (`useAsyncConfirm`) across bots/security/wallet deletion paths, removed browser `window.location.assign` redirects by adding shared `navigateWithFallback` helper for auth transitions, and migrated bots list controller live-risk confirms to async modal orchestration; validated with `pnpm --filter web test -- src/features/auth/hooks/useLoginForm.test.ts src/features/bots/components/BotCreateEditForm.test.tsx src/features/bots/components/BotsManagement.test.tsx src/features/profile/components/Security.test.tsx` + `pnpm --filter web run typecheck` (PASS).
- [x] `OPTC-18 i18n(web): split monolithic translations by domain namespaces`
  - 2026-04-16: Split monolithic `translations.ts` into domain namespace modules (`dashboard-shell`, `dashboard-home`, `dashboard-bots`) for both EN/PL locales and rebuilt top-level translation map composition from these namespaces; validated with `pnpm --filter web test -- src/i18n/translations.test.ts src/i18n/I18nProvider.test.tsx` + `pnpm --filter web run typecheck` (PASS).
- [x] `OPTC-17 refactor(web-runtime-bots): split BotsManagement orchestration into focused modules`
  - 2026-04-16: Refactored `BotsManagement` by extracting runtime-monitoring formatting and status/badge mapping helpers to dedicated module (`bots-management/formatters.ts`), reducing inline orchestration complexity while preserving existing hook-driven behavior; validated with web typecheck + BotsManagement regression suite (PASS).
- [x] `OPTC-16 refactor(web-runtime-home): split HomeLiveWidgets into formatter/actions/sections hooks`
  - 2026-04-16: Refactored `HomeLiveWidgets` by extracting formatter utilities, runtime data derivations, and close-position action flow into dedicated modules/hooks (`home-live-widgets/formatters.ts`, `home-live-widgets/runtimeDerivations.ts`, `useCloseRuntimePositionAction.ts`) while keeping section composition unchanged; validated with web typecheck + HomeLiveWidgets regression suite (PASS).
- [x] `OPTC-15 migrate(web-contracts): switch Web exchange capability/types to shared contract`
  - 2026-04-16: Migrated web exchange capability/type contracts to shared `@cryptosparrow/shared` source (exchange/capability matrix + market-type constants/defaults), removing duplicated client-side contract literals in exchange/wallet/markets capability surfaces; validated with web typecheck + targeted ApiKey/MarketUniverse/Wallet tests (PASS).
- [x] `OPTC-14 migrate(api-contracts): switch API zod schemas to shared exchange contract`
  - 2026-04-16: Switched API zod exchange/market-type contracts and defaults to shared constants from `@cryptosparrow/shared` in wallets/markets/market-data plus dependent bots/preTrade market-type schemas, removing duplicated literal enums from backend schema layers; validated with API typecheck + targeted e2e pack (PASS).
- [x] `OPTC-13 core(shared-contracts): extract shared exchange constants/capabilities/marketType contract`
  - 2026-04-16: Extracted canonical exchange contract to workspace package `@cryptosparrow/shared` (`libs/shared`) with unified exchange options/capabilities/market-type/base-currency-fallback matrices and switched API exchange capabilities core module to consume this shared source of truth; validated with API typecheck + focused exchange-symbol-rules suite (PASS).
- [x] `OPTC-12 migrate(web-edit-list-pages): standardize async+error handling for edit/list dashboards`
  - 2026-04-16: Standardized async/error handling in dashboard edit/list pages (`markets`, `strategies`, `wallets`) by migrating load/update flows to shared helpers (`runAsyncWithState`, `resolveUiErrorMessage`) and aligning fallback messaging plus save pending states in edit actions; validated with `pnpm --filter web run typecheck` + targeted market/strategy/wallet suites (PASS).
- [x] `OPTC-11 migrate(web-create-pages): standardize async+error handling on create pages (markets/strategies/backtests)`
  - 2026-04-16: Standardized async/error handling in create pages for markets/strategies/backtests by adopting shared helpers (`runAsyncWithState`, `resolveUiErrorMessage`), aligning fallback error descriptions, and adding pending submit guard on strategy create action; validated with `pnpm --filter web run typecheck` + targeted form suites (PASS).
- [x] `OPTC-10 core(web-errors): create single UI error resolver and deprecate handleError/getAxiosMessage split`
  - 2026-04-16: Added unified web UI error resolver (`apps/web/src/lib/errorResolver.ts`), converted `handleError` and `getAxiosMessage` into deprecated compatibility wrappers on top of that shared resolver, and switched form-level error mapping to the new resolver path; validated with `pnpm --filter web run typecheck` + `pnpm --filter web test -- src/lib/errorResolver.test.ts` (PASS).
- [x] `OPTC-09 test(api-normalization): add regression contract tests for shared normalization invariants`
  - 2026-04-16: Added API normalization regression invariants in `apps/api/src/lib/symbols.test.ts` (idempotency, fallback hardening for blank input/fallback, deterministic list normalization independent of input order, and non-mutating `resolveUniverseSymbols` contract); validated with `pnpm --filter api run typecheck` + `pnpm --filter api test -- src/lib/symbols.test.ts` (PASS).
- [x] `OPTC-08 migrate(api-wallets-markets-icons-stream): remove remaining production trim().toUpperCase variants`
  - 2026-04-16: Removed remaining production uppercase normalization variants in targeted API modules (`wallets`, `markets`, `icons`, `market-stream`, `workers/marketStream`) by switching to shared `lib/symbols` helpers (`normalizeSymbol`, `normalizeBaseCurrency`, `normalizeSymbols`); validated with `pnpm --filter api run typecheck` + targeted wallets/markets/icons/market-stream suites (PASS).
- [x] `OPTC-07 migrate(api-engine): remove local uppercase normalization variants in runtime/engine modules`
  - 2026-04-16: Migrated runtime/engine symbol/base-currency normalization to shared helpers from `apps/api/src/lib/symbols.ts` across orchestrator/scan-loop/signal-loop/telemetry/capital-context/dedupe/market-data-gateway/ticker-store/defaults modules, removing local symbol uppercase variants in production engine paths; validated with `pnpm --filter api run typecheck` + targeted engine suites (`executionOrchestrator`, `paperRuntime`, `runtimeCapitalContext`, `runtimeExecutionDedupe`, `runtimeScanLoop`, `runtimeSignalLoop`, `runtimeSignalMarketDataGateway`, `runtimeTelemetry`, `runtimeTickerStore`) (PASS).
- [x] `OPTC-06 core(api-normalization): extend shared symbol/base-currency normalization helpers`
  - 2026-04-15: Extended shared API normalization primitives in `apps/api/src/lib/symbols.ts` with `normalizeBaseCurrency`, `normalizeSymbolStrict`, and list-level helpers (`normalizeBaseCurrencies` + widened input support), plus added focused helper contract tests in `apps/api/src/lib/symbols.test.ts`; validated with `pnpm --filter api run typecheck` + targeted symbols/wallets/market-stream suites (PASS).
- [x] `OPTC-05 migrate(api-profile-subscriptions): typed domain errors for profile/security/subscription flows`
  - 2026-04-15: Added typed domain error contracts for profile/security and subscriptions (`security.errors.ts`, `subscriptions.errors.ts`), migrated security + checkout/payment/service throw-sites to `DomainError`, and replaced profile security/subscription controller `error.message` equality handling with code-based mapping via `mapErrorToHttpResponse`; validated with `pnpm --filter api run typecheck` + `security.e2e`, `subscription.e2e`, and `bots.subscription-entitlements.e2e` suites (PASS).
- [x] `OPTC-04 migrate(api-bots-orders): typed domain errors for high-change command/execution paths`
  - 2026-04-15: Added typed domain error contracts for bots/orders (`bots.errors.ts`, `orders.errors.ts`), migrated service throws across bot command/runtime paths and order execution/pretrade guards, and replaced bots/orders controller `error.message` equality checks with code-based mapping via `mapErrorToHttpResponse`; validated with `pnpm --filter api run typecheck` + targeted bots/orders suites (`bots.e2e`, `bots.orchestration.e2e`, `bots.duplicate-guard.e2e`, `bots.subscription-entitlements.e2e`, `orders-positions.e2e`, `orders.service`) (PASS).
- [x] `OPTC-03 migrate(api-markets-strategies): typed domain errors + controller mapping without message equality`
  - 2026-04-15: Migrated markets/strategies flows from string error comparisons to typed domain errors and code-based controller mapping (`mapErrorToHttpResponse`), covering active-bot lock and linked-record guards for update/delete/import paths; validated with API typecheck and targeted e2e suites.
- [x] `OPTC-02 migrate(api-wallets): replace wallet error-string flow with typed domain errors`
  - 2026-04-15: Added typed wallet domain errors and replaced wallet controller message-equality branches with code-based mapped handling (`mapErrorToHttpResponse` + `error.code`), preserving API messages for LIVE api-key compatibility, preview, and in-use delete guards; validated with API typecheck + wallets e2e contract suite.
- [x] `OPTC-01 core(api-errors): introduce typed AppError/DomainError primitives + central http mapper`
  - 2026-04-15: Added core API error primitives (`apps/api/src/lib/errors.ts`) and centralized HTTP mapper (`apps/api/src/lib/httpErrorMapper.ts`), wired global middleware mapping in `apps/api/src/middleware/errorHandler.ts`, migrated exchange capability error to `DomainError`, and validated with `pnpm --filter api run typecheck` + `pnpm --filter api test -- src/lib/errors.test.ts src/lib/httpErrorMapper.test.ts` (PASS).
- [x] `OPTC-00 planning(optimization): execute engineering optimization queue from docs/planning/engineering-optimization-next-commits-2026-04-12.md after DCP wave`
  - 2026-04-15: Activated optimization execution in canonical `mvp-next-commits` queue by importing `OPTC-01..05` into `NOW` and scheduling `OPTC-06..21` in `NEXT` from `docs/planning/engineering-optimization-next-commits-2026-04-12.md`.
- [x] `DCP-12 qa(docs-evidence): run parity check, publish evidence artifact, and close documentation hardening wave`
  - 2026-04-15: Executed `pnpm run docs:parity:check -- --json --output docs/operations/_artifacts-docs-parity-2026-04-15T21-31-56-867Z.json` (PASS: `22/22 API`, `15/15 web`, `37/37 routes`) and published wave-close evidence report `docs/operations/documentation-hardening-parity-evidence-2026-04-15.md`.
- [x] `DCP-11 tooling(docs-parity): add script to verify module+route inventories against canonical docs`
  - 2026-04-15: Added `scripts/checkDocsParity.mjs` + root command `pnpm run docs:parity:check` to validate API modules, web features, route inventory, source-path parity, and presence of published deep-dive files (`PASS: 22/22 API, 15/15 web, 37/37 routes`).
- [x] `DCP-10 docs(route-contract): publish canonical route-to-feature-to-api mapping with ownership and guardrails`
- 2026-04-15: Reworked `docs/architecture/reference/dashboard-route-map.md` into canonical route-to-feature-to-API contract (dashboard/admin/public inventories, ownership matrix, legacy redirect contract, and documentation/update guardrails).
- [x] `DCP-09 docs(web-trading): author deep-dives for bots/backtest/strategies/markets/exchanges/orders/positions/wallets/reports/logs`
  - 2026-04-12: Published `docs/modules/web-bots.md`, `docs/modules/web-backtest.md`, `docs/modules/web-strategies.md`, `docs/modules/web-markets.md`, `docs/modules/web-exchanges.md`, `docs/modules/web-orders.md`, `docs/modules/web-positions.md`, `docs/modules/web-wallets.md`, `docs/modules/web-reports.md`, `docs/modules/web-logs.md`, and `docs/modules/web-icons.md`; updated module coverage index statuses to `Published`.
- [x] `DCP-08 docs(web-core): author deep-dives for dashboard-home/auth/profile/admin flows`
  - 2026-04-12: Published `docs/modules/web-dashboard-home.md`, `docs/modules/web-auth.md`, `docs/modules/web-profile.md`, and `docs/modules/web-admin.md`; updated module coverage index statuses to `Published`.
- [x] `DCP-07 docs(api-support): author deep-dives for reports/subscriptions/wallets/icons/upload/pagination/isolation`
  - 2026-04-12: Published `docs/modules/api-reports.md`, `docs/modules/api-subscriptions.md`, `docs/modules/api-wallets.md`, `docs/modules/api-icons.md`, `docs/modules/api-upload.md`, `docs/modules/api-pagination.md`, `docs/modules/api-isolation.md`, and `docs/modules/api-logs.md`; updated module coverage index statuses to `Published`.
- [x] `DCP-06 docs(api-trading-domain): author deep-dives for strategies/markets/bots/orders/positions/backtests`
  - 2026-04-12: Published `docs/modules/api-strategies.md`, `docs/modules/api-markets.md`, `docs/modules/api-bots.md`, `docs/modules/api-orders.md`, `docs/modules/api-positions.md`, and `docs/modules/api-backtests.md`; updated module coverage index statuses to `Published`.
- [x] `DCP-05 docs(api-trading-core): author deep-dives for engine/exchange/market-data/market-stream`
  - 2026-04-12: Published `docs/modules/api-engine.md`, `docs/modules/api-exchange.md`, `docs/modules/api-market-data.md`, and `docs/modules/api-market-stream.md`; updated module coverage index statuses to `Published`.
- [x] `DCP-04 docs(api-identity): author deep-dives for admin/auth/profile/users modules`
  - 2026-04-12: Published `docs/modules/api-admin.md`, `docs/modules/api-auth.md`, `docs/modules/api-profile.md`, and `docs/modules/api-users.md`; updated module coverage index statuses to `Published`.
- [x] `DCP-03 docs(index): create docs/modules index table mapping every active module to doc status`
  - 2026-04-12: Added canonical module coverage index `docs/modules/module-doc-status-index.md` with API/Web inventory mapping, target deep-dive files, current status, and planned DCP task ownership; linked from modules/docs indexes.
- [x] `DCP-02 docs(template): publish canonical module deep-dive template + authoring checklist`
  - 2026-04-12: Published canonical module deep-dive template with mandatory authoring checklist in `docs/modules/module-deep-dive-template.md`, then linked it from `docs/modules/README.md` and `docs/README.md`.
- [x] `DCP-01 docs(governance): lock documentation parity policy and mandatory update triggers`
  - 2026-04-12: Added mandatory documentation parity trigger rules to `docs/governance/working-agreements.md` (module inventory, route inventory, canonical docs index, and planning queue sync requirements) to enforce same-change doc updates.
- [x] `NX-05 hardening(web-runtime): add reusable async-state/retry helpers for profile+wallet critical flows`
  - 2026-04-12: Added shared async helpers (`apps/web/src/lib/async.ts`) for retry policy + pending-state wrapper and migrated profile/wallet critical flows to retry-aware execution paths (`useUser`, wallet form load/metadata/preview/submit); validated with `pnpm --filter web test -- src/lib/async.test.ts src/features/wallets/components/WalletCreateEditForm.test.tsx` and `pnpm --filter web run typecheck` (PASS).
- [x] `NX-04 refactor(forms-core): unify shared form normalization/error wiring across wallets/markets/backtests`
  - 2026-04-12: Added shared web forms-core helper module (`apps/web/src/lib/forms.ts`) and migrated wallets/markets/backtests create-edit flows to common normalization (`normalizeFormText/normalizeFormBaseCurrency/normalizeFormSymbol`) and unified error mapping (`resolveFormErrorMessage`), reducing ad-hoc per-form variants; validated with `pnpm --filter web test -- src/features/wallets/components/WalletCreateEditForm.test.tsx src/features/markets/components/MarketUniverseForm.test.tsx src/features/backtest/components/BacktestCreateForm.test.tsx` and `pnpm --filter web run typecheck` (PASS).
- [x] `NX-03 feat(wallet-metadata): source baseCurrency/marketType options from exchange capabilities instead of free-text assumptions`
  - 2026-04-12: Added `GET /dashboard/wallets/metadata` API contract that resolves market-type/base-currency options from exchange capability source with market-catalog integration and fail-safe capability fallbacks; wired wallet create/edit form to consume this metadata endpoint (dynamic marketType options + per-marketType baseCurrency list) and validated with `pnpm --filter api run typecheck`, `pnpm --filter api test -- src/modules/wallets/wallets.e2e.test.ts`, `pnpm --filter web test -- src/features/wallets/components/WalletCreateEditForm.test.tsx`, and `pnpm --filter web run typecheck` (PASS).
- [x] `NX-02 ux(wallet-form): redesign create/edit wallet form mode flow (LIVE/PAPER switch + deterministic conditional fields)`
  - 2026-04-12: Refactored wallet create/edit mode flow to deterministic sections (`PAPER` and `LIVE` separated), added explicit mode hints, and enforced mode-switch reset of irrelevant fields (`apiKeyId/liveAllocation*`) to prevent stale cross-mode leakage; validated with `pnpm --filter web test -- src/features/wallets/components/WalletCreateEditForm.test.tsx` and `pnpm --filter web run typecheck` (PASS).
- [x] `QH-01 refactor(api-profile): remove production as-any casts in profile basic service with Prisma-safe typing`
  - 2026-04-12: Replaced `as any` with Prisma-safe typing in `apps/api/src/modules/profile/basic/basic.service.ts` (`Prisma.UserSelect`, `Prisma.JsonObject`, `Prisma.InputJsonValue`, `Prisma.UserUpdateInput`) and validated with `pnpm --filter api run typecheck` + `pnpm --filter api test -- src/modules/profile/basic/basic.e2e.test.ts` (PASS).
- [x] `QH-02 refactor(api-logging): introduce shared structured logger and migrate API entrypoints/workers`
  - 2026-04-12: Added shared API logger helper (`apps/api/src/lib/logger.ts`) and migrated structured logging in `src/index.ts`, `src/middleware/requestLogger.ts`, `src/workers/workerBootstrap.ts`, and `src/workers/marketStream.worker.ts`; validated with `pnpm --filter api run typecheck` + `pnpm --filter api test -- src/modules/market-stream/binanceStream.service.test.ts src/modules/market-stream/marketStream.routes.contract.test.ts` (PASS).
- [x] `QH-03 refactor(web-theme): harden theme bootstrap script contract and maintainability`
  - 2026-04-12: Replaced one-line theme bootstrap string with explicit resilient script (`apps/web/src/security/themeBootstrap.ts`) using safe localStorage access and guarded system-theme resolution; validated with `pnpm --filter web run typecheck` + `pnpm --filter web test -- src/ui/components/ThemeSwitch.test.tsx src/ui/layout/dashboard/IsometricModeToggle.test.tsx` (PASS).
- [x] `QH-04 refactor(api-normalization): centralize symbol/baseCurrency normalization in bots/backtests hot paths`
  - 2026-04-12: Added shared `normalizeSymbol` in `apps/api/src/lib/symbols.ts` and migrated critical bots/backtests paths (`modules/backtests/backtests.service.ts`, `modules/bots/botsRuntimeRead.service.ts`) to remove local uppercase variants and improve filter consistency; validated with `pnpm --filter api run typecheck` + `pnpm --filter api test -- src/modules/backtests/backtests.e2e.test.ts src/modules/bots/bots.e2e.test.ts` (PASS).
- [x] `QH-05 refactor(web-backtest): split oversized BacktestRunDetails into modular units under guardrails budget`
  - 2026-04-12: Extracted localized `copy` dictionary from `BacktestRunDetails.tsx` into dedicated module `backtestRunDetails.copy.ts`, reducing component size below guardrails budget (97,801 bytes); validated with `pnpm --filter web run typecheck` + `pnpm --filter web test -- src/features/backtest/components/BacktestRunDetails.test.tsx src/features/backtest/hooks/useBacktestRunCoreData.test.tsx src/features/backtest/components/BacktestCreateForm.test.tsx` (PASS). Root `quality:guardrails` remains blocked by pending `QH-06` (`apps/api/src/modules/bots/bots.e2e.test.ts` over budget).
- [x] `QH-06 test(api-bots): split oversized bots.e2e suite into focused scenario files`
  - 2026-04-12: Split large bots contract suite by introducing shared helpers (`bots.e2e.shared.ts`), extracted heavy fixture payloads (`bots.e2e.fixtures.ts`), and moved orchestration scenarios to dedicated file (`bots.orchestration.e2e.test.ts`), reducing `bots.e2e.test.ts` to 85,749 bytes (below 90,000-byte API budget). Validated with `pnpm --filter api run typecheck`, `pnpm --filter api test -- src/modules/bots/bots.e2e.test.ts src/modules/bots/bots.orchestration.e2e.test.ts src/modules/bots/bots.duplicate-guard.e2e.test.ts src/modules/bots/bots.subscription-entitlements.e2e.test.ts`, and `pnpm run quality:guardrails` (PASS).
- [x] `QH-07 refactor(web-normalization): replace remaining local uppercase normalization variants in backtest/markets/strategies`
  - 2026-04-12: Added shared `normalizeUppercaseToken` (`apps/web/src/lib/text.ts`) + `normalizeBaseCurrency` (`apps/web/src/lib/symbols.ts`) and replaced ad-hoc uppercase normalization in backtest/markets/strategies hotspots (`BacktestRunDetails.tsx`, `BacktestsRunsTable.tsx`, `timelineIndicatorOverlays.ts`, `MarketUniversesTable.tsx`, `StrategyFormSections/Indicators.tsx`, `indicatorPresentation.ts`). Validated with `pnpm --filter web run typecheck`, `pnpm --filter web test -- src/features/backtest/components/BacktestRunDetails.test.tsx src/features/backtest/components/BacktestCreateForm.test.tsx src/features/strategies/components/StrategyFormSections/Indicators.test.tsx`, and `pnpm run quality:guardrails` (PASS).
- [x] `QH-08 quality(repo): execute final lint/typecheck/guardrails sweep and publish evidence snapshot`
  - 2026-04-12: Executed final quality sweep (`pnpm run lint`, `pnpm --filter api run typecheck`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`) with full PASS and published evidence snapshot `docs/operations/repo-quality-hardening-sweep-2026-04-12T02-24-34.md`.
- [x] `NX-01 feat(profile-timezone): persist user timezone preference in profile basic settings and validate on API boundary`
  - 2026-04-12: Extended profile basic contract with validated `uiPreferences.timeZonePreference` (IANA or `auto`) and wired profile form save flow to persist this preference on user profile update (`apps/api/modules/profile/basic/*`, `apps/web/features/profile/components/BasicForm.tsx`); validated with `pnpm --filter api run typecheck`, `pnpm --filter api test -- src/modules/profile/basic/basic.e2e.test.ts`, `pnpm --filter web run typecheck`, and `pnpm --filter web test -- src/i18n/I18nProvider.test.tsx` (PASS).
- [x] `LBT-15 qa(evidence): execute local + VPS confidence pack and attach artifacts`
  - 2026-04-11: Executed fresh local confidence pack (`api` takeover/runtime tests + `api` typecheck + `web` dashboard regression + `web` production build) and attached artifact/report (`docs/operations/_artifacts-live-takeover-confidence-2026-04-11T14-48-55-096Z.json`, `docs/operations/live-takeover-confidence-pack-2026-04-11.md`). Local status PASS; strict VPS gate explicitly marked FAIL due protected ops `403` on public path and `takeover-status` route `404` on production target.
- [x] `LBT-14 ops(runbook): publish local+VPS takeover verification checklist with strict smoke gates`
  - 2026-04-11: Added strict fail-closed verification runbook for local + VPS takeover rollout (`docs/operations/live-takeover-local-vps-strict-smoke-checklist-2026-04-11.md`) with five mandatory gates and explicit private-route requirement for `/workers/*` and `/alerts`.
- [x] `LBT-12 test(web): add dashboard/runtime regression coverage for imported position visibility and takeover state`
  - 2026-04-11: Added/validated dashboard runtime regressions in `HomeLiveWidgets.test.tsx` for imported `EXCHANGE_SYNC` visibility, takeover badge rendering, and compatibility wallet fields; validated with `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` and `pnpm --filter web run build` (PASS).
- [x] `LBT-11 fix(web-dashboard): ensure imported LIVE positions + wallet metrics render from owned runtime source (no '-' placeholders when data exists)`
  - 2026-04-11: Hardened runtime wallet value fallbacks in `HomeLiveWidgets.tsx` + `RuntimeSidebarSection.tsx` (`referenceBalance/allocated/account/wallet`, `freeCash/available/freeBalance`, equity fallback from free+margin), eliminating placeholder drift when data is present.
- [x] `LBT-09 feat(api-sync): add open-order reconciliation for BOT_MANAGED external lifecycle`
  - 2026-04-11: Extended live reconciliation loop with exchange open-order sync for owned takeover contexts (`EXCHANGE_SYNC` + `BOT_MANAGED`): upsert open exchange orders into local synced order rows and close stale local synced opens (`syncState=ORPHAN_LOCAL`), validated with `pnpm --filter api test -- src/modules/positions/livePositionReconciliation.service.test.ts src/modules/positions/positions.takeover-status.e2e.test.ts` + `pnpm --filter api run typecheck` (PASS).
- [x] `LBT-08 feat(api-live-exec): add optional per-symbol leverage/margin convergence before first live order`
  - 2026-04-11: Added optional futures convergence in live order path (`setMarginMode`/`setLeverage`) with env kill-switch + strict mode + TTL convergence cache, plus connector-level open-order helper and regression tests (`ccxtFuturesConnector.service.test.ts`), validated with `pnpm --filter api test -- src/modules/exchange/ccxtFuturesConnector.service.test.ts src/modules/orders/orders.service.test.ts` + `pnpm --filter api run typecheck` (PASS).
- [x] `LBT-10 feat(api-positions): add /dashboard/positions/takeover-status with deterministic OWNED/UNOWNED/AMBIGUOUS/MANUAL classification`
  - 2026-04-11: Added authenticated takeover-status endpoint for open `EXCHANGE_SYNC` positions with per-status summary and item-level classification, including new e2e contract `positions.takeover-status.e2e.test.ts`; validated with `pnpm --filter api test -- src/modules/positions/positions.takeover-status.e2e.test.ts` and `pnpm --filter api run typecheck` (PASS).
- [x] `LBT-10 feat(web-runtime): show takeover badge for exchange-synced positions in dashboard open-positions table`
  - 2026-04-11: Extended runtime positions payload (`origin`, `managementMode`, `syncState`, `takeoverStatus`) and rendered takeover pill in `HomeLiveWidgets` open positions table for `EXCHANGE_SYNC` rows; validated with `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`, `pnpm --filter web run typecheck`, and `pnpm --filter web run build` (PASS).
- [x] `LIV-24 test(api-bots): complete walletId-first migration for full bots.e2e contract suite (mode/live-consent/api-key paths)`
  - 2026-04-11: Updated `bots.e2e` wallet provisioning and create/update payloads to wallet-first semantics (including LIVE wallet transitions, consent audit flow, and exchange/api-key compatibility assertions), then validated with `pnpm --filter api test -- src/modules/bots/bots.e2e.test.ts src/modules/bots/bots.duplicate-guard.e2e.test.ts src/modules/bots/bots.subscription-entitlements.e2e.test.ts src/modules/wallets/wallets.e2e.test.ts src/modules/positions/livePositionReconciliation.service.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts` (PASS, 74 tests).
- [x] `LIV-23 test(api-bots): migrate duplicate-guard and subscription-entitlements e2e suites to walletId-first bot contract`
  - 2026-04-11: Added deterministic test wallet provisioning/mapping in `bots.duplicate-guard.e2e.test.ts` and `bots.subscription-entitlements.e2e.test.ts`, removed legacy mode/paperStartBalance payload fields from create requests, and validated with `pnpm --filter api test -- src/modules/bots/bots.duplicate-guard.e2e.test.ts src/modules/bots/bots.subscription-entitlements.e2e.test.ts` + `pnpm --filter api run typecheck` (PASS).
- [x] `LIV-22 chore(web-build-hygiene): remove final MarketUniverseForm lint warning and keep full web build clean`
  - 2026-04-11: Replaced unused `mode` prop alias with explicit mode badge (`Tworzenie`/`Edycja`) in MarketUniverse form header and validated with `pnpm --filter web test -- src/features/markets/components/MarketUniverseForm.test.tsx` + `pnpm --filter web run build` (PASS, no warnings).
- [x] `LIV-21 fix(web-dashboard-runtime): resolve HomeLiveWidgets hook-dependency warnings for selected-data and signal-symbol memo paths`
  - 2026-04-11: Updated `HomeLiveWidgets` memo dependencies (`ttpStickyFavorableMoveByPositionRef`) and stabilized `signalSymbols` with dedicated `useMemo` to remove remaining hook warnings in this component; validated with `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` and `pnpm --filter web run build` (PASS).
- [x] `LIV-20 chore(web-dashboard-runtime): remove dead signal-pill helpers and unused imports in HomeLiveWidgets`
  - 2026-04-11: Cleaned `HomeLiveWidgets` dead signal-pill rendering helpers and unused `Bot` import, reducing runtime widget lint noise without behavior drift; validated with `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` and `pnpm --filter web run build` (PASS).
- [x] `LIV-19 fix(web-backtest-details): align hook dependencies in timeline loaders to remove stale-copy warnings`
  - 2026-04-11: Updated `BacktestRunDetails` callback/effect dependency arrays to include timeline i18n fallback copy keys used inside closures, validated with `pnpm --filter web test -- src/features/backtest/components/BacktestRunDetails.test.tsx src/features/backtest/hooks/useBacktestRunCoreData.test.tsx src/features/backtest/components/BacktestCreateForm.test.tsx` and `pnpm --filter web run build` (PASS).
- [x] `LIV-18 fix(web-backtest-form): stabilize create-form data-loading effects for i18n-safe hook dependencies`
  - 2026-04-11: Updated `BacktestCreateForm` effects to use explicit i18n-safe dependency values for strategy/universe load error toasts (no stale closure warnings), validated with `pnpm --filter web test -- src/features/backtest/components/BacktestCreateForm.test.tsx src/features/backtest/components/BacktestRunDetails.test.tsx src/features/backtest/hooks/useBacktestRunCoreData.test.tsx` and `pnpm --filter web run build` (PASS).
- [x] `LIV-17 test(web-backtest): add component-level regression to prevent transient hard-error flash in create->details flow`
  - 2026-04-11: Hardened backtest details regression coverage with transient-bootstrap retry assertion in `BacktestRunDetails.test.tsx` (no hard error flash while retrying), validated with `pnpm --filter web test -- src/features/backtest/hooks/useBacktestRunCoreData.test.tsx src/features/backtest/components/BacktestRunDetails.test.tsx` and `pnpm --filter web run typecheck` (PASS).
- [x] `exit-gates(v1-production): production SLO observation window + target-env backup/restore + queue-lag telemetry review + formal release sign-offs`
  - 2026-04-10: Completed via VPS/private ops-network SLO collector path (`docs/operations/_artifacts-slo-window-2026-04-10T17-09-26-532Z.json`, `docs/operations/v1-slo-observation-2026-04-10T17-09-26-532Z.md`) and finalized gate artifacts (`docs/operations/v1-rc-external-gates-status.md`, `docs/operations/v1-rc-signoff-record.md`) with strict production evidence check PASS (`G1/G2/G3/G4 = PASS`).
- [x] `SAR-14 ops(rollout): run DEV->STAGE->PROD remediation rollout checklist with smoke gates and rollback drill evidence`
- [x] `SAR-09 qa(stage-abuse): execute stage abuse-throttling verification for profile-sensitive routes and publish evidence`
- [x] `SAR-13 refactor(api-data-boundary): introduce repository boundaries for bots/backtests/engine high-change modules`
- [x] `SAR-12 refactor(web-bots): finish BotsManagement decomposition to pass file-size guardrails`
- [x] `SAR-11 refactor(api-runtime): split oversized runtime signal loop service into stream/watchdog/execution units to pass guardrails`
- [x] `SAR-10 refactor(api-backtests): split oversized backtests service into smaller domain services to pass guardrails`
- [x] `SAR-08 test(security-contracts): add regression coverage for proxy trust, public origin derivation, and checkout callback rejection`
- [x] `SAR-07 security(csp): remove production script unsafe-inline via nonce/hash bootstrap approach`
- [x] `SAR-06 security(ready): expose only minimal public readiness signal and move detailed diagnostics to protected surface`
- [x] `SAR-05 security(profile-throttle): add per-user throttling to checkout-intents and profile security-sensitive endpoints`
- [x] `SAR-04 security(checkout): enforce allowlisted callback URLs for checkout intents with canonical fallback`
- [x] `SAR-03 security(upload-origin): derive avatar/public upload URLs from trusted config allowlist instead of request host headers`
- [x] `SAR-02 security(proxy): replace global trust-proxy=true with explicit trusted proxy chain and forwarded-header hardening`
- [x] `SAR-01 test(api-upload): restore upload security e2e cleanup order so security suite is green again`
- [x] `IND-36 docs(runbook): publish implementation runbook for adding next indicator safely (registry + tests + parity steps)`
- [x] `IND-35 qa(parity): execute 3-symbol side-by-side parity checklist for new indicator families and attach evidence`
- [x] `IND-34 feat(presets): add trader archetype presets (scalp/day trend/swing/mean reversion/breakout/perp bias)`
- [x] `IND-33 feat(backtest-ui): support multi-line overlays and boolean pattern markers in timeline rendering`
- [x] `IND-32 feat(web-groups): apply new indicator taxonomy groups in strategy creator with EN/PL labels`
- [x] `IND-31 test(futures-filters): add fail-closed fallback tests when derivatives snapshots are missing`
- [x] `IND-30 feat(futures-filter): add order-book filters (imbalance/spread/depth ratio) for futures strategies`
- [x] `IND-29 feat(futures-filter): add open-interest filters (delta/MA/z-score) for futures strategies`
- [x] `IND-28 feat(futures-filter): add funding-rate filters (absolute + z-score) for futures strategies`
- [x] `IND-27 test(pattern-parity): deterministic fixtures for all patterns in runtime + backtest parity suite`
- [x] `IND-26 feat(patterns): add Inside Bar / Outside Bar end-to-end`
- [x] `IND-25 feat(patterns): add Morning Star / Evening Star end-to-end`
- [x] `IND-24 feat(patterns): add Doji with threshold params end-to-end`
- [x] `IND-23 feat(patterns): add Hammer/Shooting Star end-to-end`
- [x] `IND-22 feat(patterns): add Bullish/Bearish Engulfing end-to-end`
- [x] `IND-21 feat(pattern-engine): add shared OHLC candle-pattern evaluation engine (boolean series contract)`
- [x] `IND-20 feat(indicator): add Donchian Channels end-to-end`
- [x] `IND-19 feat(indicator): add CCI end-to-end`
- [x] `IND-18 feat(indicator): add Stochastic (%K/%D) end-to-end`
- [x] `IND-17 feat(indicator): add ADX + DI+/DI- end-to-end`
- [x] `IND-16 feat(indicator): add ATR end-to-end`
- [x] `IND-15 feat(indicator): implement true Bollinger Bands end-to-end (upper/mid/lower, bandwidth, percentB)`
- [x] `IND-14 feat(indicator): add StochRSI end-to-end (+ tests)`
- [x] `IND-13 feat(indicator): add ROC end-to-end (+ tests)`
- [x] `IND-12 feat(indicator): add MACD end-to-end (line/signal/histogram + tests)`
- [x] `IND-11 feat(indicator): add SMA end-to-end (catalog + evaluator + backtest timeline + tests)`
- [x] `IND-10 test(config-contract): parser/evaluator regressions for new operators and invalid configs`
- [x] `IND-09 feat(config-parser): normalize operand contract (series/constant/band) for runtime + backtest`
- [x] `IND-08 feat(builder-operators): expose full operator set (including cross and range operators) in strategy form`
- [x] `IND-07 test(runtime-series): add regression coverage for OHLCV buffer updates, dedupe, and interval matching`
- [x] `IND-06 refactor(runtime-warmup): fetch/store OHLCV warmup candles and keep final-candle decision indexing deterministic`
- [x] `IND-05 refactor(runtime-series): upgrade runtime candle buffer from close-only to OHLCV candle objects`
- [x] `IND-04 test(parity-baseline): lock parity for existing EMA/RSI/MOMENTUM behavior across runtime/backtest`
- [x] `IND-03 refactor(engine-indicators): extract shared indicator compute/evaluate module used by runtime + backtest`
- [x] `IND-02 fix(api-indicators): remove/flag unsupported placeholders from default indicator catalog until implemented`
- [x] `IND-01 docs(contract): publish canonical indicator registry + parity contract for builder/runtime/backtest`
- [x] `EXIT-08 docs(ops): add production prerequisites + one-command closure pipeline instructions`
- [x] `EXIT-07 ops(gates): add db-profile aware pipeline and true production strict alias (env+db-profile forced)`
- [x] `EXIT-06 ops(gates): add direct strict-production evidence-check shortcut command`
- [x] `EXIT-05 ops(gates-summary): expose Gate2 policy and nullable strict status when evidence artifact is missing`
- [x] `EXIT-04 docs(ops): sync RC external-gates status template command to require production-tagged SLO collection`
- [x] `EXIT-03 ops(gates): add production-only strict pipeline/refresh shortcuts with Gate2 PASS-only enforcement`
- [x] `EXIT-02 ops(slo-evidence): block production environment tagging for localhost/private hosts unless explicit dry-run override`
- [x] `EXIT-01 ops(slo-evidence): tag SLO artifacts with environment and distinguish Gate2 PASS vs LOCAL_PASS`
- [x] `SUBS-12 docs(runbook): publish operator/admin guide for subscription edits and payment-provider switch`
- [x] `SUBS-11 test(api+web): add regression coverage for assignment/highlight/enforcement flows`
- [x] `SUBS-10 feat(payment-provider-stripe): add first Stripe adapter behind payment abstraction`
- [x] `SUBS-09 feat(payment-abstraction): add provider-agnostic checkout/payment-intent contract`
- [x] `SUBS-08 feat(web-admin): add subscription-plan admin modal for price/limit editing`
- [x] `SUBS-07 feat(api-admin): add admin CRUD for plan pricing + entitlement limits`
- [x] `SUBS-06 feat(entitlements-core): add central entitlement resolver and enforce bot-count limits by active plan`
- [x] `SUBS-05 feat(web-profile): render subscription list and highlight active plan on profile`
- [x] `SUBS-04 feat(api-profile): return subscription catalog + active plan for My Account`
- [x] `SUBS-03 feat(seed): seed FREE/ADVANCED/PROFESSIONAL; default new users to FREE; owner to PROFESSIONAL`
- [x] `SUBS-02 feat(db): add subscription-plan/user-subscription/payment-intent tables with safe migration`
- [x] `SUBS-01 docs(contract): freeze FREE/ADVANCED/PROFESSIONAL catalog + default assignment/entitlement schema`
- [x] `CACHE-09 test(web-runtime): cover stale-age warning and recovery after fresh payload arrival`
- [x] `CACHE-08 feat(web-runtime): add explicit stale-data guard in dashboard/bots runtime (age watchdog + transparent warning state)`
- [x] `CACHE-07 docs(runbook): add stale-cache incident playbook with clear verify/mitigate/rollback steps`
- [x] `CACHE-05 test(web-pwa): add regression checks for market/dashboard runtime requests not served from SW cache`
- [x] `CACHE-04 feat(web-sw-lifecycle): add service-worker update strategy (registration update + activation handoff) to reduce stale clients after deploy`
- [x] `CACHE-02 test(api-headers): add route tests asserting no-store/vary headers on protected endpoints`
- [x] `LDUX-09 qa(web-dashboard): run manual desktop/mobile smoke and capture evidence`
- [x] `LDUX-08 test(web-loading-ux): add regression coverage for progress bar lifecycle and key skeleton rendering states`
- [x] `LDUX-07 feat(web-backtests): migrate list/details loading states to skeletons and preserve timeline phase messaging`
- [x] `LDUX-06 feat(web-markets+strategies+logs): migrate loading views to skeleton compositions`
- [x] `LDUX-05 feat(web-dashboard-home+bots): replace loading alerts with section/page skeleton compositions`
- [x] `LDUX-04 refactor(web-viewstate): make dashboard loading path skeleton-first while keeping alert states for error/degraded/success`
- [x] `LDUX-03 feat(web-shell): add dashboard header-underbar navigation progress component with staged percent animation`
- [x] `LDUX-02 feat(web-ui): add shared DaisyUI skeleton primitives for table/card/form/kpi dashboard patterns`
- [x] `LDUX-01 docs(contract): lock dashboard loading UX contract (skeleton-first + global progress bar under header)`
- [x] `BOPS-65 feat(web-dashboard): polish runtime signal cards UX (header counters + base currency + dual-column condition emphasis) and streamline dashboard trade/open-position table columns/time format`
- [x] `ICN-06 test(api+web): add regression coverage for resolver collisions, cache fallback, and icon rendering states`
- [x] `ICN-07 qa(web): run manual smoke for icons across Dashboard/Bots/Markets/Positions and attach evidence note`
- [x] `ICN-04 feat(web-icons): render asset icons in key dashboard tables/cards with loading/error fallback states`
- [x] `ICN-05 ops(deploy): add CoinGecko-related env template + Coolify rollout checklist updates`
- [x] `ICN-03 feat(api-icons): expose icon lookup endpoint for dashboard modules with deterministic placeholder response`
- [x] `ICN-02 feat(api-icons): add CoinGecko symbol/id resolver and icon metadata cache with TTL + fail-soft fallback chain`
- [x] `ICN-01 docs(contract): publish coin icon source contract (CoinGecko primary, exchange-independent, fallback-first)`
- [x] `ARCH-32 refactor(api-bots): extract runtime trade lifecycle mapping (OPEN/DCA/CLOSE inference per position trades) from bots.service into dedicated module`
- [x] `ARCH-31 refactor(api-bots): extract runtime trade close-reason normalization/lookup from bots.service into dedicated runtimeTradeActionReason service`
- [x] `NAVM-07 test(web-header): add regression assertions for mobile overlay `100dvh` sizing contract (top/height/max/min with header offset)`
- [x] `OPS-33 chore(api-prisma): migrate deprecated package.json#prisma seed config to prisma.config.ts (migrations.seed) and keep VPS node-prisma seed path working`
- [x] `NAVM-06 fix(web-header): enforce full mobile dashboard menu viewport height via dynamic `dvh` overlay sizing (header-offset aware)`
- [x] `NAVM-01 docs(contract): lock mobile nav overlay contract (layering, offset, scroll, close behavior)`
- [x] `ARCH-01 docs(contract): publish critical-refactor split contract (no behavior drift) for api/web monolith files`
- [x] `EXPH-12 chore(qa): manual smoke checklist for colleague exchange testing (create/save/read + blocked execute)`
- [x] `EXPH-11 test(api): add contract tests for placeholder exchange fail-closed responses`
- [x] `EXPH-10 test(web): add regression coverage for exchange select options and not-implemented UX states`
- [x] `EXPH-09 feat(web-ux): add placeholder badges/hints for unsupported exchange operations in creators/runtime paths`
- [x] `EXPH-08 feat(web-types): extend Exchange unions/options across Markets/Bots/Profile modules`
- [x] `DBACT-10 qa(smoke): manual verification on real paper-session timeline (open -> dca -> close) including fee/pnl/margin coherence`
- [x] `EXPH-06 test(api+web): add regression coverage for placeholder persistence and fail-closed responses`
- [x] `EXPH-05 feat(web): expose exchange placeholders in Markets/Bots/Profile flows with explicit not-implemented hints`
- [x] `EXPH-04 feat(api-markets+bots): enforce placeholder exchange fail-closed behavior on unsupported catalog/runtime/live paths`
- [x] `EXPH-03 feat(api-core): add centralized exchange capability registry and EXCHANGE_NOT_IMPLEMENTED guard mapping`
- [x] `EXPH-02 feat(db): extend Exchange enum with BYBIT/OKX/KRAKEN/COINBASE while keeping BINANCE default`
- [x] `EXPH-01 docs(contract): publish exchange placeholder contract and fail-closed behavior for BYBIT/OKX/KRAKEN/COINBASE`
- [x] `ADM-01 docs(contract): define third admin app-shell template contract and rollout tasks (public/dashboard/admin split)`
- [x] `BOPS-60 docs(contract): lock dashboard trade-history action/fee semantics (OPEN -> realized blank, CLOSE -> realized value) and margin consistency`
- [x] `PEX-07 feat(obs-metrics): add production metrics for runtime lag, restart count, reconciliation delay, and execution error classes`
- [x] `PEX-04 feat(runtime-watchdog): add explicit stall detector for NO_EVENT/NO_HEARTBEAT windows with classified failure reasons`
- [x] `PEX-01 docs(contract): freeze idempotency contract for runtime execution commands (open/dca/close/cancel) with dedupe-key schema`
- [x] `CACHE-06 docs(ops-coolify): document reverse-proxy cache rules (never cache /auth|/dashboard|/admin, cache static only)`
- [x] `CACHE-03 fix(web-sw): restrict service worker runtime caching to static assets only, bypass API/runtime payloads`
- [x] `CACHE-01 feat(api-headers): add authenticated no-store middleware for /auth, /dashboard, /admin responses`
- [x] `LFIN-08 test(api-live-adapter): add regression coverage for LIVE fill fee persistence/fallback behavior and runtime serialization parity`
- [x] `LFIN-07 feat(api-live-adapter): ingest exchange fill commissions in LIVE adapter and persist exact fee data into runtime order/trade records`
- [x] `BOPS-59 test(web-bots): add regression coverage for new bots routes, list-table actions, and shared create/edit form flow`
- [x] `BOPS-54 test(web-dashboard): add regression coverage for signal-panel placement, heading copy, responsive card density, and overflow navigation controls`
- [x] `BOPS-53 feat(web-dashboard): implement scalable signal cards layout (desktop 4 / tablet 3 / mobile 2) with horizontal rail/slider support for very large symbol sets`
- [x] `BOPS-52 feat(web-dashboard): rename 'Live checks' section to strategy-signal wording and move signal panel above open-positions block`
- [x] `BOPS-51 docs(contract): lock Dashboard signal-panel IA contract (name, placement above open positions, responsive density, and high-symbol navigation behavior)`
- [x] `BOPS-50 test(api+web): add regression coverage for TSL/TTP rendering lifecycle (pre-arm '-', post-arm value) and runtime payload mapping`
- [x] `BOPS-49 feat(web-i18n+tables): rename stop headers from 'SL (TTP)/(TSL)' to 'TTP/TSL' and keep parity in Dashboard + Bots runtime views`
- [x] `BOPS-48 feat(api-runtime): compute dynamicTslStopLoss from active trailing-stop config + runtime trailingAnchorPrice (with trailingLossLimit fallback) and expose stable payload fields`
- [x] `BOPS-47 docs(contract): lock dynamic stop display contract (TTP/TSL) for dashboard+bots runtime tables, including TSL derivation from trailing-stop anchor`
- [x] `BOPS-46 test(api+web): add regression coverage for DCA ladder mapping/rendering (basic repeated levels, advanced ladder, legacy fallback)`
- [x] `BOPS-45 feat(web-dashboard+bots): replace plain DCA count cell with compact executed ladder view (e.g. 1: -15%, 2: -30%) while preserving count`
- [x] `BOPS-44 feat(api-runtime): extend runtime positions payload with DCA planned/executed levels derived from strategy additional.dcaLevels/dcaTimes`
- [x] `BOPS-43 docs(contract): lock DCA ladder display contract in Dashboard/Bots (count + executed levels mapping for basic/advanced strategy modes)`
- [x] `DPL-20 docs(runbook): publish incident playbook for blocked promotion and failed stage/prod rollout`
- [x] `DPL-19 security(ci): apply branch protection + secret hardening for safe auto-promotion`
- [x] `DPL-18 ops(coolify): wire Coolify deployment triggers for stage and prod services`
- [x] `DPL-17 ci(prod-rollback): implement automatic rollback to previous stable release on failed post-deploy prod health`
- [x] `DPL-16 ci(promote): implement automatic promotion to prod when stage gate is fully green`
- [x] `DPL-15 ci(stage-gates): enforce stage gate pack (build/test/migrate/health/smoke) with machine-readable report`
- [x] `DPL-14 ci(stage): implement automatic deploy-to-stage on integration-branch push`
- [x] `DPL-12 docs(rename-plan): define controlled global rename rollout `CryptoSparrow -> Soar` with risk gates`
- [x] `DPL-11 docs(rename-audit): inventory all `CryptoSparrow` tokens and classify rename waves`
- [x] `DPL-10 ops(rollback): define rollback playbook for app version/env rollback and worker incidents`
- [x] `DPL-09 ops(smoke): add post-deploy smoke checklist for target domains`
- [x] `DPL-08 ops(health): standardize deployment readiness gates for web/api/workers`
- [x] `DPL-07 ops(migrations): define migration strategy for deployment pipeline and operator ownership`
- [x] `DPL-06 chore(scripts): add one-command local prod-like orchestration with preflight checks`
- [x] `DPL-13 docs(cicd-contract): define immutable commit promotion contract DEV -> STAGE -> PROD`
- [x] `DPL-05 chore(scripts): add production-safe worker start script and explicit process ownership contract`
- [x] `DPL-04 chore(env): add non-secret `.env.example` templates for api/web with required keys and comments`
- [x] `DPL-03 docs(coolify): publish Linux VPS Coolify setup guide with service mapping and domain routing`
- [x] `DPL-02 docs(runbook): publish step-by-step local DEV and local PROD-like startup procedures`
- [x] `DPL-01 docs(contract): publish canonical DEV/STAGE/PROD environment matrix and secrets policy`
- [x] `BOPS-58 feat(web-bot-form): implement single create/edit form view at /bots/create (create mode + edit mode via selected bot id)`
- [x] `BOPS-57 feat(web-bots-list): redesign /bots into table-first list view (no inline create/edit form) with actions: Podglad(Runtime), Asystent, Edytuj`
- [x] `BOPS-56 feat(web-routing+nav): switch bots create route to /dashboard/bots/create and align header/menu links + legacy /new redirect`
- [x] `BOPS-55 docs(contract): lock Bots IA split (/bots list, /bots/create form) and table-action navigation contract (Runtime + Assistant + Edit)`
- [x] `LFIN-12 test(api+web): add reconciliation, i18n, and numeric-input regression suites for new contracts`
- [x] `LFIN-11 refactor(web-strategies): replace direct Number(...) parsing in strategy form sections with parser-driven handling + precision guards`
- [x] `LFIN-10 feat(web-utils): add shared number parser/normalizer and form-level validation contract`
- [x] `LFIN-08 refactor(web-nav-i18n): remove inline locale dictionaries from header and use canonical i18n keys only`
- [x] `BMOD-42 test(runtime): add regression coverage for resilient stream handling and runtime auto-restart after handler failure`
- [x] `LFIN-07B refactor(web-i18n-bots): migrate bots management/runtime strings to translation keys with EN/PL parity`
- [x] `LFIN-07A refactor(web-i18n-dashboard-home): migrate dashboard home/control-center strings to translation keys with EN/PL parity`
- [x] `BMOD-41 fix(runtime-resilience): harden runtime signal loop against stream-handler crashes and add auto-restart watchdog for canceled/stalled sessions`
- [x] `BOPS-42 feat(api+web-guard): block market-universe update/delete while linked symbol-group is used by any active bot (409 + explicit UX message)`
- [x] `LFIN-05 feat(api+web): expose and render feeSource/feePending/feeCurrency in dashboard+bots history views`
- [x] `LFIN-04 feat(runtime): add live fill reconciliation flow and persist exchange-true fee totals in order/trade`
- [x] `LFIN-03 feat(exchange): extend ccxt connector contract with normalized fill/trade retrieval methods for executed orders`
- [x] `LFIN-02 feat(db): add fill-level persistence + fee source fields for order/trade runtime history`
- [x] `BOPS-36 feat(web-dashboard): apply final fixes from manual smoke notes and freeze Dashboard->Bots UX for wider QA`
- [x] `LFIN-14 docs(contract): lock numeric input policy (comma/dot parsing, precision, integer vs decimal field matrix)`
- [x] `LFIN-08 audit(i18n): inventory hardcoded strings in dashboard-home, bots runtime, and dashboard header menu`
- [x] `LFIN-01 docs(contract): lock LIVE fee source-of-truth and reconciliation fallback hierarchy (fills/trades first, estimator fallback only for pending)`
- [x] `TCHK-04 chore(ci-quality): add/enable typecheck step in quality pipeline and document gate usage`
- [x] `TCHK-03 feat(tooling-root): add root aggregate typecheck script for api+web`
- [x] `TCHK-02 feat(tooling-web): add web typecheck script (tsc --noEmit) and verify local pass`
- [x] `TCHK-01 feat(tooling-api): add api typecheck script (tsc --noEmit) and verify local pass`
- [x] `DBRT-10 feat(web-dashboard): implement tri-state column sorting cycle (asc -> desc -> none) for trades table`
- [x] `DBRT-09 test(web-dashboard): add regression tests for apply-flow, date-range behavior, and UNKNOWN filter UX contract`
- [x] `DBRT-08 feat(web-dashboard): hide UNKNOWN from action filter while keeping UNKNOWN row rendering`
- [x] `DBRT-07 feat(web-dashboard): introduce apply/reset filter workflow (draft vs applied state)`
- [x] `DBRT-06 feat(web-dashboard): simplify trades header and pagination summary presentation`
- [x] `DBRT-05 test(api+web): add regression coverage for runtime trade-history pagination/sort/filter and dashboard state persistence on auto-refresh`
- [x] `DBRT-04 feat(web-dashboard): implement server-driven trade-history table controls (filters, sortable headers, pagination) in Dashboard`
- [x] `DBRT-03 feat(web-types): extend bots runtime trades DTO/service with pagination+sorting contract and meta mapping`
- [x] `DBRT-02 feat(api-runtime): extend runtime-session trades query with page/pageSize/sortBy/sortDir/filters and deterministic ordering`
- [x] `DBRT-01 docs(contract): lock Dashboard runtime trade-history table contract (server-side pagination, sort, filters, response meta)`
- [x] `BOPS-35 chore(web-dashboard): execute final manual smoke of Dashboard->Bots UX flow and attach validation notes to planning log`
- [x] `DBACT-03 feat(runtime): classify fill events into OPEN/DCA/CLOSE and persist lifecycleAction on trade rows`
- [x] `DBACT-02 feat(db): add trade lifecycleAction enum/column with backward-safe default for dashboard history semantics`
- [x] `DBACT-09 test(web): add component tests for action badges, margin column, and non-placeholder financial values`
- [x] `DBACT-07 feat(web-bots): align bots runtime history action + margin/fee/pnl rendering with dashboard contract`
- [x] `DBACT-06 feat(web-dashboard): render Fee/Realized as always-filled currency values (no placeholder '-')`
- [x] `DBACT-05 feat(web-dashboard): render Action badge and switch history capital column from Notional to Margin`
- [x] `DBACT-04 feat(api-runtime): expose lifecycleAction + non-null fee/realizedPnl + margin in history payloads`
- [x] `BOPS-41 test(web-nav): add regression coverage for Bots dropdown structure and route targets`
- [x] `BOPS-40 feat(web-bots-routing): wire canonical create/list routes for Bots menu entries with proper active-state and breadcrumbs`
- [x] `BOPS-39 feat(web-nav): add Bots dropdown entries (Lista botow, Dodaj bota) aligned with Markets/Strategies/Backtests IA`
- [x] `BOPS-38 test(web-dashboard): update dashboard component tests for no-local-CTA runtime sidebar contract`
- [x] `BOPS-37 feat(web-dashboard): remove redundant sidebar actions (Odswiez/Boty runtime) from dashboard Bot runtime card`
- [x] `BOPS-34 chore(web-dashboard): run final responsive pass on dashboard+bots headers/cards after checklist nits and lock release screenshots`
- [x] `BOPS-33 feat(web-dashboard): apply checklist-driven final nits from manual dashboard+bots UX walk-through`
- [x] `BOPS-32 chore(web-dashboard): prepare focused manual UX review checklist for dashboard+bots operational flow`
- [x] `BOPS-31 feat(web-dashboard): polish control-center and onboarding visual rhythm with final spacing/contrast pass before manual UX review`
- [x] `BOPS-30 feat(web-dashboard): rebalance status-card wording and emphasis to avoid duplicated semantic signals`
- [x] `BOPS-29 feat(web-dashboard): tighten CTA copy and density in dashboard strips to reduce decision latency`
- [x] `BOPS-28 feat(web-dashboard): harden visual affordance of primary-vs-secondary CTA paths in control-center and onboarding strips`
- [x] `BOPS-27 feat(web-dashboard): normalize button sizing hierarchy and interaction affordances across dashboard control-center actions`
- [x] `BOPS-26 feat(web-dashboard): tighten micro-layout consistency of onboarding + control-center strips between 2xl, xl and md breakpoints`
- [x] `BOPS-25 feat(web-dashboard): harmonize dashboard control-center card heights and action alignment across breakpoints`
- [x] `BOPS-24 feat(web-dashboard): tune compact typography and spacing rhythm in control-center cards for at-a-glance scan fidelity`
- [x] `BOPS-23 feat(web-dashboard): improve cross-module handoff cues (Dashboard -> Bots, Backtests, Reports) for operator navigation confidence`
- [x] `BOPS-22 feat(web-dashboard): refine dashboard onboarding microcopy and operator context strip for cleaner first-load orientation`
- [x] `BOPS-21 feat(web-dashboard): tighten control-center visual density and KPI scan rhythm for high-frequency operator checks`
- [x] `BOPS-20 feat(web-dashboard): improve control-center quick-actions and status grouping for first-visit operator clarity`
- [x] `BOPS-19 feat(web-dashboard): polish global control-center cards and CTA hierarchy to complement Bots operations center`
- [x] `BOPS-18 feat(web-monitor): add compact operator checklist panel for manual health-verification routine`
- [x] `BOPS-17 feat(web-monitor): finalize operator-friendly wording consistency in monitoring tabs and section subtitles`
- [x] `BOPS-16 feat(web-monitor): tighten monitoring table defaults (sorting/filter hints) for manual operator triage`
- [x] `BOPS-15 feat(web-monitor): tune table ordering and section spacing for faster visual scan under live-refresh`
- [x] `BOPS-14 feat(web-monitor): polish dashboard-vs-bots IA copy and helper labels for clearer module boundaries`
- [x] `BOPS-13 feat(web-monitor): strengthen section naming + helper copy so Bots module reads as human-first operational center`
- [x] `BOPS-12 feat(web-monitor): refine operational cards and hierarchy for faster manual smoke-testing workflow`
- [x] `BOPS-11 feat(web-monitor): streamline dashboard controls and reduce monitoring cognitive load for human operator first`
- [x] `BOPS-10 feat(web-monitor): make Bots dashboard a clearer operational center (what was / what is / what next signals) without backend behavior changes`
- [x] `BOPS-09 feat(web-monitor): simplify monitoring to aggregate across sessions by default with optional advanced-session drilldown`
- [x] `BOPS-08 feat(api+web-guard): block strategy edits while used by any active bot; allow edits when all linked bots are inactive`
- [x] `BOPS-07 feat(api+web-guard): block creating duplicate active bot using the same strategy + market-group pair`
- [x] `BOPS-06 feat(web-creator): reorganize bot creator into 3 logical sections (core mode, market-group context, strategy context)`
- [x] `BOPS-05 feat(web-monitor): replace "Recent Activity" style feed with dense operational table aligned to backtest trades readability`
- [x] `BOPS-04 feat(web-bots-dashboard): redesign bots dashboard list into clickable operational cards for quick active-bot context switching`
- [x] `BOPS-03 feat(web-monitor): stabilize auto-refresh rendering to update values in-place without section remount/flicker`
- [x] `BOPS-02 feat(web-monitor): refactor Bots monitoring into three clear blocks (Now: open positions+orders, History: closed positions+trades, Future: live signal check per symbol)`
- [x] `BOPS-01 docs(plan): lock IA split (Dashboard as global control center, Bots as runtime operations center) and define target UX sections now/history/future-signals`
- [x] `BMOD-40 release(gate): run full regression gate for bot/backtest/runtime and record evidence`
- [x] `BMOD-39 docs(runbook): publish bot module operator runbook and manual smoke checklist`
- [x] `BMOD-38 refactor(db): remove LOCAL enum from Prisma after successful migration verification`
- [x] `BMOD-37 chore(data-migration): migrate legacy LOCAL modes and legacy botStrategy bindings to canonical model`
- [x] `BMOD-36 test(e2e): add end-to-end monitoring contract coverage for session/stat/trade data`
- [x] `BMOD-35 feat(web-live-refresh): add lightweight auto-refresh for active bot sessions`
- [x] `BMOD-34 feat(web-monitor): add bot monitoring view with summary + pair stats + trades table`
- [x] `BMOD-33 feat(api-monitor): add endpoints for per-symbol stats and trades list (no chart payload)`
- [x] `BMOD-32 feat(api-monitor): add endpoints for bot sessions list/detail`
- [x] `BMOD-31 feat(runtime-telemetry): persist session/event/stat snapshots from runtime orchestrator`
- [x] `BMOD-30 feat(db): add bot runtime per-symbol stats snapshot model`
- [x] `BMOD-29 feat(db): add bot runtime event model for lifecycle trace storage`
- [x] `BMOD-28 feat(db): add bot runtime session model for run-like monitoring windows`
- [x] `BMOD-27 test(parity): add bot-paper vs backtest decision parity regression suite`
- [x] `BMOD-26 test(runtime): extend signal-loop and watchdog tests for websocket-first semantics`
- [x] `BMOD-25 feat(runtime-watchdog): keep scan loop as disabled-by-default fallback watchdog`
- [x] `BMOD-24 refactor(runtime-model): remove runtime dependency on legacy bot-strategy fallback graph`
- [x] `BMOD-23 feat(runtime-risk): compute group max-open cap from active strategy risk settings`
- [x] `BMOD-22 feat(runtime-idempotency): add deterministic dedupe key per bot/group/symbol/candle window`
- [x] `BMOD-21 refactor(runtime-lifecycle): keep ticker path for open-position automation only`
- [x] `BMOD-20 refactor(runtime-signal): evaluate entry/exit strategy decisions only on final candle events`
- [x] `BMOD-19 test(web): update BotsManagement tests for new payload and mode-conditional behavior`
- [x] `BMOD-18 feat(web-creator): add derived strategy summary (interval/leverage/max-open)`
- [x] `BMOD-17 feat(web-creator): remove positionMode and maxOpenPositions inputs from UI`
- [x] `BMOD-16 feat(web-creator): make paperStartBalance visible only for PAPER mode`
- [x] `BMOD-15 feat(web-creator): create V2 form with Strategy + MarketGroup selectors`
- [x] `BMOD-14 feat(web-data): load market groups into bot creator`
- [x] `BMOD-13 refactor(web-types): remove LOCAL and legacy creator-only fields from bot types`
- [x] `BMOD-12 test(api): extend bots e2e coverage for new create/edit payload and ownership checks`
- [x] `BMOD-11 refactor(api-write): remove bot-level maxOpenPositions input contract`
- [x] `BMOD-10 refactor(api-write): remove positionMode from bot write payload contract`
- [x] `BMOD-09 refactor(api-derive): derive bot marketType from selected market-group universe`
- [x] `BMOD-08 feat(api-create): create bot + botMarketGroup + strategyLink in one transaction`
- [x] `BMOD-07 refactor(api-create): switch bot create contract to Strategy + MarketGroup payload`
- [x] `BMOD-06 feat(api-compat): add temporary LOCAL->PAPER read-compat adapter for transition window`
- [x] `BMOD-05 refactor(api-types): remove LOCAL from bot mode zod/types contract`
- [x] `BMOD-04 test(baseline): pin current bot api/ui/runtime baseline tests before refactor`
- [x] `BMOD-03 chore(audit): add preflight report script for LOCAL bots and legacy bot-strategy bindings`
- [x] `BMOD-02 docs(decisions): lock websocket-first bot signal policy and no-chart monitoring scope`
- [x] `BMOD-01 docs(contract): freeze Bot V2 create/update payload and migration invariants`
- [x] `docs(backtest): synchronize backtester documentation with current run-header, markets/trades UX, and staged timeline loading behavior`
- [x] `docs(i18n-backtests): record EN/PL localization coverage for backtest create/list/details flows and QA checks`
- [x] `MBA-01 audit(domain): mapped current Bot/SymbolGroup/BotStrategy contracts and documented non-breaking migration path (`docs/planning/mba-01-domain-audit-2026-03-22.md`)
- [x] `MBA-02 docs(decisions): locked canonical runtime hierarchy and assistant topology in `docs/planning/open-decisions.md``
- [x] `MBA-03 docs(contract): published deterministic merge contract in `docs/architecture/reference/runtime-signal-merge-contract.md` and linked canonical decision entry in `docs/planning/open-decisions.md``
- [x] `MBA-04 feat(db): added `BotMarketGroup` model (ownership, lifecycleStatus, executionOrder, indexes) in Prisma schema + SQL migration`
- [x] `MBA-05 feat(db): added `MarketGroupStrategyLink` model (priority, weight, deterministic ordering indexes) in Prisma schema + SQL migration`
- [x] `MBA-06 feat(db-migration): added idempotent data backfill from `BotStrategy` into `BotMarketGroup` and `MarketGroupStrategyLink` for zero-downtime rollout`
- [x] `MBA-07 feat(api): added bot market-group CRUD endpoints with zod validation, marketType compatibility checks, and ownership isolation (+ e2e contract case)`
- [x] `MBA-08 feat(api): added strategy-link endpoints under bot market-group (list/attach/update/reorder/detach) with ownership validation and deterministic priority ordering`
- [x] `MBA-09 feat(api): added `/dashboard/bots/:id/runtime-graph` endpoint returning bot->marketGroups->strategyLinks read model with ownership isolation and legacy BotStrategy fallback view`
- [x] `MBA-10 refactor(runtime): refactored runtime signal loop to evaluate bot market-group partitions (symbol-scoped groups, legacy fallback, partition-level signal payload metadata)`
- [x] `MBA-11 feat(runtime): implemented deterministic multi-strategy merge per market-group (EXIT priority, weighted LONG/SHORT votes, tie/weak-consensus => no-trade) with no-flip preserved by pre-trade guardrails`
- [x] `MBA-12 feat(risk): added per-market-group `maxOpenPositions` budget in schema/API/runtime and enforced group cap before pre-trade global/bot checks`
- [x] `MBA-13 test(e2e): added multi-entity e2e contract for one user operating two bots with multiple market-groups and strategy links verified via runtime-graph`
- [x] `MBA-14 docs(ai-contract): published canonical assistant runtime contract (`docs/architecture/reference/assistant-runtime-contract.md`) with responsibilities, I/O, timeout, determinism, and fail-closed behavior`
- [x] `MBA-15 feat(db): added `BotAssistantConfig` model for bot-scoped main agent mandate/profile/safety configuration`
- [x] `MBA-16 feat(db): added `BotSubagentConfig` model with unique `(botId, slotIndex)` and assistant safety profile defaults`
- [x] `MBA-17 feat(api): added assistant config endpoints (`GET/PUT assistant-config`, `PUT/DELETE subagents/:slotIndex`) with slot range 1..4 validation and ownership isolation`
- [x] `MBA-18 feat(runtime-ai): added assistant orchestration scaffold service with planner stage -> slot fan-out -> merge output`
- [x] `MBA-19 feat(runtime-ai): implemented per-slot timeout dispatcher, partial-failure handling, deterministic output ordering and merge`
- [x] `MBA-20 security(ai): added rationale/error sanitization and safe trace writing contract in assistant orchestration flow`
- [x] `MBA-21 feat(ui): added `Assistant` tab in Bots module with main-agent config panel and 4 editable subagent slots (save/delete per slot)`
- [x] `MBA-22 test(e2e): added assistant dry-run endpoint and e2e contract validating configured assistant stack returns explainable trace payload`
- [x] `MBA-23 feat(obs): extended metrics store with runtime group latency, merge outcome counters, and assistant timeout metrics, plus metrics contract assertions`
- [x] `MBA-24 feat(ops): added assistant circuit-breaker with failure threshold and reset window, returning deterministic `strategy_only` degradation when open`
- [x] `MBA-25 feat(ai-policy): added mandate and forbidden-action policy gate in assistant orchestrator so disallowed outputs degrade to `NO_TRADE` before approval`
- [x] `MBA-26 feat(ui-explainability): added Assistant dry-run decision timeline in Bots UI (final decision/reason + per-slot status/latency table)`
- [x] `MBA-27 test(parity): added deterministic parity test ensuring identical assistant orchestration decision contract for BACKTEST/PAPER/LIVE modes`
- [x] `MBA-28 perf(load): added assistant orchestration load benchmark for target 3x4x4x5 profile with thresholds and evidence artifacts (`docs/operations/v1-assistant-load-profile-2026-03-23.md`)`
- [x] `MBA-29 docs(runbook): published assistant incident runbook with fallback/recovery flow and linked it into ops evidence pack`
- [x] `MBA-30 release(v1-gate): published assistant runtime evidence pack and marked assistant-specific V1 gate as pass (with remaining global external gates explicitly tracked)`
- [x] `chore(planning): initialize MVP/V1 execution plans and agent blueprint`
- [x] `chore(planning): align trigger intent to generic one-task nudge`
- [x] `chore(planning): historical done backlog archived in git history; queue reset for current delivery focus`
- [x] `docs(sync): reconcile roadmap immediate gaps with implemented runtime-stream status and evidence links`
- [x] `ops(slo): define MVP/V1 SLO set and add measurable targets + source metrics`
- [x] `ops(evidence): run production-like load baseline and attach results to v1 exit criteria`
- [x] `security(audit): run ownership/auth/key-flow verification pass and publish evidence summary`
- [x] `release(evidence): compile public docs pack and launch-readiness evidence checklist`
- [x] `ops(cutover): define local cutover checklist from legacy bot to new runtime`
- [x] `ops(cutover): define rollback checklist to legacy runtime`
- [x] `test(cutover): execute local replacement dry-run with realistic bot scenario`
- [x] `release(review): run 7-day launch retrospective and cut V1.1 backlog`
- [x] `docs(sync): normalize planning files so roadmap/mvp/v1 statuses are fully consistent`
- [x] `fix(auth-build): resolve client build blockers in login/auth files (eslint apostrophe + hooks deps) so pnpm --filter web build is green`
- [x] `fix(auth-ux): validate and harden failed-login error UX (inline + toast) without false positive success styling`
- [x] `fix(auth-session-warning): remove false session-expired warnings on public routes and keep warning only for protected/session-expired contexts`
- [x] `test(auth-client): add/adjust regression tests for failed login, successful login, and post-login redirect behavior`
- [x] `qa(auth-smoke): run manual auth smoke (fail login, success login, logout redirect, protected route redirect) and capture evidence`
- [x] `fix(ui-api-key-test): replace random result in ApiKeyForm with real request state machine (idle/loading/success/error)`
- [x] `feat(api-key-test-api): add POST /dashboard/profile/apiKeys/test route (auth + validation + no persistence)`
- [x] `security(api-key-test): add rate-limit + audit-safe logging for test endpoint`
- [x] `feat(api-key-test-binance): implement Binance permission probe and normalized error mapping contract`
- [x] `test(api-key-test): add server e2e for invalid credentials, permission mismatch, and success path`
- [x] `feat(profile-save-flow): block LIVE-ready key save until connection test success in current form session`
- [x] `feat(positions-sync-api): add endpoint to fetch current open positions from Binance using verified stored credentials`
- [x] `feat(ui-positions-live-source): add live-exchange snapshot mode with last-sync + error state`
- [x] `test(positions-live-source): add e2e/ui coverage for snapshot fetch and failure handling`
- [x] `docs(runbook): add API-key onboarding + Binance permission troubleshooting guide`
- [x] `feat(ui-nav): rename Execution to Bots and move Orders/Positions into Exchanges dropdown between Dashboard and Markets`
- [x] `feat(db): add position/order/trade origin + management mode fields with migration baseline`
- [x] `feat(api-key-onboarding): add sync_external_positions and manage_external_positions options`
- [x] `feat(runtime-guard): enforce no-flip and manual-managed symbol ignore rules in runtime execution flow`
- [x] `feat(positions-ui): show position source and management mode badges plus explicit toggle action`
- [x] `fix(ui-header-nav): center desktop nav list, simplify menu utility classes, and unify hover/active/focus color states across header controls`
- [x] `fix(ui-language-switcher): replace incorrect EN flag styling and add visual regression coverage for locale switcher`
- [x] `audit(routing-dashboard): produce canonical route map and remove dashboard path inconsistencies (backtest/backtests, list/create aliases, menu contracts)`
- [x] `refactor(profile-ia): merge API keys + exchange connections into one user-settings information architecture`
- [x] `fix(profile-menu): remove isometric toggle from account menu (deferred to V2 gamification track)`
- [x] `docs(sync-audit): correct plan truthfulness (core-tests status, done/pending mismatches, duplicate checkbox states) against current repo state`
- [x] `test(quality-gate): restore green core suites (including i18n provider and auth/requireAuth rotation regressions) and attach evidence`
- [x] `docs(scope): realign admin+billing from V1 implementation scope to post-MVP/V1.1 delivery track`
- [x] `feat(stream-contract): implement transport contract gaps (event id, heartbeat/ping, symbol-limit guard) for dashboard market stream`
- [x] `fix(routing-hard-cut): enforce canonical dashboard routes with hard-cut policy (remove backtest/backtests ambiguity and update menu links/tests)`
- [x] `fix(i18n-contract): remove remaining hardcoded copy and align default locale contract (docs vs SSR html lang)`
- [x] `fix(live-execution-contract): align LIVE path to real exchange side effects; keep simulation strictly in PAPER/BACKTEST`
- [x] `security(ops-endpoints): restrict /metrics, /alerts, /workers/* access with auth/role/network guardrails`
- [x] `refactor(rate-limit): move from IP-centric throttling toward user/exchange-key aware limits`
- [x] `fix(auth-session-recovery): enforce automatic logout on invalid session/user-deleted scenarios and add graceful no-db fallback behavior`
- [x] `feat(auth-password-visibility): add password visibility toggle in login/register forms with a11y labels and tests`
- [x] `docs(ia): update module map and user guide navigation references for Bots/Exchanges grouping`
- [x] `docs(repo-structure): define target monorepo apps naming (`apps/web`, `apps/api`, `apps/mobile`) and migration rollout sequence`
- [x] `chore(repo-migration-plan): prepare non-breaking rename plan from client/server to web/api (scripts, CI, env, docs)`
- [x] `docs(parity): define mobile parity contract versus web dashboard scope for MVP/V1`
- [x] `ops(slo-tooling): add scripted SLO observation collector (`ops:slo:collect`) producing JSON+Markdown evidence artifacts for external production exit gates`
- [x] `ops(slo-reporting): add rolling SLO window report builder (`ops:slo:window-report`) with queue-lag breach timeline for 7d/30d gate reviews`
- [x] `docs(sync-roadmap): archive stale `full-commit-roadmap.md` checklist and point to canonical planning files to remove false pending states`
- [x] `ops(signoff-automation): add scripted RC sign-off builder (`ops:rc:signoff:build`) generating approval artifact from current gate snapshot`
- [x] `ops(cutover-automation): add one-command cutover dry-run orchestrator (`ops:cutover:dry-run`) with structured JSON+Markdown evidence output`
- [x] `fix(test-cleanup): include assistant config tables in API test cleanup order before bot deletion to prevent FK failures in e2e suites`
- [x] `fix(runtime-e2e): resolve cutover blockers by fixing strategy-reorder route precedence and runtime-flow e2e setup/cleanup for bot market-group model`
- [x] `ops(backup-evidence-local): execute backup/restore automation (`ops:db:backup-restore:check-local`) and attach fresh artifact references in RC docs`
- [x] `fix(cutover-dry-run): stabilize ops cutover suite by fixing pnpm test argument forwarding and replacing brittle backtest totalTrades assertion; verified with green `ops:cutover:dry-run``
- [x] `ops(rc-gates): enrich RC external gate status builder with latest DB restore artifact parsing (local PASS visibility) and regenerate canonical status template`
- [x] `docs(decision-close): resolve open monorepo naming decision to canonical `apps/web` + `apps/api` + `apps/mobile` with legacy naming retired from canonical docs`
- [x] `fix(ops-signoff-parser): support non-binary gate labels (e.g. LOCAL_PASS) in RC sign-off builder and enforce exact four-gate parsing before APPROVED`
- [x] `ops(gate3-automation): infer Gate 3 status from runbook incident-readiness evidence fields and expose completion flag in RC external gate status output`
- [x] `ops(gate4-automation): infer Gate 4 status from RC sign-off record (`RC status: APPROVED`) and expose approval flag in RC external gate status output`
- [x] `ops(gate2-pipeline): extend local external-gates pipeline to auto-generate SLO rolling reports (7d/30d default) with configurable window list`
- [x] `ops(gate1-automation): infer Gate 1 PASS from runbook backup/restore evidence completeness while preserving local dry-run signal as LOCAL_PASS fallback`
- [x] `ops(gate2-source): make RC gate-status builder prefer rolling SLO window-report artifacts and fallback to raw observation artifacts`
- [x] `ops(checklist-sync): add `ops:rc:checklist:sync` automation to align RC checklist gate/sign-off checkboxes with current status + signoff artifacts`
- [x] `ops(pipeline-sync): include checklist synchronization in local external-gates pipeline with optional `--skip-checklist-sync` switch`
- [x] `ops(evidence-check): add `ops:rc:gates:evidence:check` command to list missing Gate1/Gate3/Gate4 evidence and optional strict failure mode`
- [x] `ops(pipeline-evidence): include evidence diagnostics in local external-gates pipeline with optional skip/strict switches`
- [x] `ops(evidence-check-gate2): include Gate2 PASS validation in evidence diagnostics so strict mode enforces all external gates`
- [x] `ops(pipeline-strict-shortcut): add `ops:rc:gates:local-pipeline:strict` command alias for hard evidence enforcement run`
- [x] `ops(evidence-check-json): add machine-readable JSON mode/output for external evidence diagnostics to support agent/automation consumption`
- [x] `ops(pipeline-evidence-artifact): persist default JSON evidence artifact in local pipeline and ignore rotating `latest` output in git tracking`
- [x] `ops(pipeline-refresh-shortcut): add quick `ops:rc:gates:refresh` alias and fallback to template status when SLO artifacts are absent but offline mode is allowed`
- [x] `ops(pipeline-noise): pre-check SLO artifacts before status build in offline refresh flow to avoid expected error noise and keep logs clean`
- [x] `ops(refresh-strict-shortcut): add `ops:rc:gates:refresh:strict` alias for no-DB/no-SLO quick refresh with strict evidence enforcement`
- [x] `ops(gates-summary): add `ops:rc:gates:summary` command for compact gate/evidence snapshot (text + JSON)`
- [x] `ops(gates-summary-hardening): make gate summary resilient when evidence JSON artifact is missing (graceful nulls instead of failure)`
- [x] `ops(refresh-summary-shortcut): add one-command `ops:rc:gates:refresh:summary` flow for quick refresh plus immediate human summary`
- [x] `ops(refresh-summary-strict): add `ops:rc:gates:refresh:summary:strict` flow that always prints summary while preserving strict failure exit code`
- [x] `ops(pipeline-log-order): normalize refresh pipeline fallback messages to standard output for consistent chronological log ordering`
- [x] `PAR-01 docs(contract): froze canonical strategy-evaluation parity contract and linked it from open decisions`
- [x] `PAR-02 refactor(backtest): disabled strategy-mode threshold fallback so replay uses shared evaluator semantics only`
- [x] `PAR-03 feat(backtest): wired replay settlement to shared simulator accounting via historical fill-model adapter`
- [x] `PAR-04 feat(data): added futures funding/open-interest historical inputs with deterministic cache window for replay timeline/report`
- [x] `PAR-05 test(parity): added deterministic 3-symbol parity harness test for replay decision trace alignment`
- [x] `PAR-11 feat(report): added explicit PROCESSED/FAILED status and error field in per-symbol parity diagnostics`
- [x] `PAR-12 feat(ui): display parity diagnostics status badges in markets-tab symbol cards`
- [x] `PAR-13 fix(web-typecheck): fixed reports service import to default api export and restored web tsc pass`
- [x] `PAR-14 fix(api-contract): added run-symbol scope guard in timeline endpoint with e2e assertion`
- [x] `PAR-15 chore(repo-hygiene): added .gitignore rules for local `.agents/skills/*` generated work folders`
- [x] `PAR-16 feat(ui-backtest): updated markets chart legend to real DCA/TP/SL/TSL/LIQ counts and plotted lifecycle event markers`
- [x] `PAR-17 perf(ui-backtest): stopped eager timeline requests for FAILED symbols and surfaced parity error directly in card`
- [x] `PAR-18 cleanup(ui-backtest): removed dead BacktestForm mock component and kept web typecheck/tests green`
- [x] `PAR-19 test(backtests): added e2e coverage for invalid-symbol run emitting parity status FAILED with error details`
- [x] `PAR-20 fix(web-build): removed unused imports/vars in backtest+markets and validated clean `pnpm --filter web build``
- [x] `PAR-21 feat(ui-backtest-create): added client-side maxCandles bounds check (100-2500) and whitelist/blacklist summary context`
- [x] `PAR-22 test(ui-backtest-create): added component tests for invalid maxCandles blocking submit and valid payload shape`
- [x] `PAR-23 fix(ui-backtest): normalized timeline payload (`events`/`indicatorSeries`) before filtering/merging to avoid runtime crashes`
- [x] `PAR-24 fix(web-build): added `public/favicon.ico` asset to prevent Next.js page-data build failure`

## 2026-05-07 V1 UI Runtime Parity Slice
- [x] `V1UI-12 refactor(web-runtime): centralize continuity label semantics`
  - Closed an ARCHITECT-mode runtime diagnostics drift cleanup. Dashboard home
    and bot monitoring now derive backend `continuityState` label semantics
    from shared `runtimeContinuityLabelSuffix`, preserving route-owned i18n
    namespaces while preventing future runtime status drift. Validation PASS:
    focused Web runtime formatter/dashboard/bot monitoring tests (`27/27`),
    Web typecheck, Web lint, route-reachable i18n audit (`findings=0`),
    repository guardrails, Web build, and authenticated rendered
    `/dashboard/bots` smoke with no console errors.

- [x] `V1UI-11 fix(web-runtime): show provenance in dashboard position modal`
  - Closed the dashboard action-context provenance gap. `/dashboard` position
    edit modal now repeats backend `origin`, `syncState`, and
    `takeoverStatus` provenance truth, so imported/adopted exchange context is
    visible at the edit/action decision point as well as in the table. Web also
    reuses one shared provenance label suffix helper across dashboard and bot
    monitoring presenters. Validation PASS: focused Web runtime/dashboard/bot
    monitoring tests (`46/46`), Web typecheck, Web lint, route-reachable i18n
    audit (`findings=0`), repository guardrails, Web build, and authenticated
    rendered `/dashboard` smoke with no console errors.

- [x] `V1UI-10 fix(web-runtime): show position provenance labels`
  - Closed the runtime position provenance parity gap. Web now maps backend
    `origin`, `syncState`, and `takeoverStatus` fields into explicit
    open-position provenance labels in both `/dashboard` and
    `/dashboard/bots`, so imported/adopted exchange-sync rows, drift, and
    orphan states do not look like ordinary bot-managed runtime rows.
    Validation PASS: focused Web runtime/dashboard/bot monitoring tests
    (`25/25`), Web typecheck, route-reachable i18n audit (`findings=0`), Web
    lint, repository guardrails, Web build, and authenticated rendered
    `/dashboard` plus `/dashboard/bots` smoke with no console errors.

- [x] `V1UI-09 fix(web-runtime): label API fallback TTP protection source`
  - Closed the runtime protection-source parity gap. API runtime position
    reads now expose additive `dynamicTtpStopLossSource` metadata and Web
    labels `strategy_fallback` protection as prospective in both `/dashboard`
    and `/dashboard/bots` monitoring. Validation PASS: focused API
    serialization tests (`8/8`), focused Web runtime/dashboard/bot monitoring
    tests (`32/32`), API typecheck, Web typecheck, route-reachable i18n audit
    (`findings=0`), Web lint, repository guardrails, Web build, and
    authenticated rendered `/dashboard/bots` smoke with no console errors.

- [x] `V1UI-08 fix(web-runtime): label prospective dashboard TTP protection`
  - Closed the dashboard-home protection-truth labeling gap. `/dashboard`
    open-position TTP cells now label config-derived fallback protection as
    prospective while keeping backend dynamic TTP as the primary unlabeled
    runtime stop truth. Validation PASS: focused dashboard runtime derivation
    and table presenter tests (`13/13`), Web typecheck, route-reachable i18n
    audit (`findings=0`), Web lint, guardrails, Web build, diff check, and
    authenticated rendered `/dashboard` smoke with no console errors.

- [x] `V1UI-07 fix(web-runtime): show actionability details in dashboard open positions`
  - Closed the dashboard-home actionability detail gap. `/dashboard`
    open-position status cells now render backend `actionable=false` and
    `strategyAutomationContextResolved=false` detail labels below the existing
    continuity badge, matching the bot monitoring fail-closed diagnostic
    visibility. Validation PASS: focused dashboard presenter test (`6/6`),
    dashboard integration test (`20/20`), Web typecheck, Web lint, Web build,
    route-reachable i18n audit (`findings=0`), guardrails, diff check, and
    authenticated rendered `/dashboard` smoke with no console errors.

- [x] `V1UI-06 fix(web-runtime): surface continuity state in bot monitoring positions`
  - Closed the `/dashboard/bots` open-position continuity/actionability gap.
    Bot monitoring now renders backend `continuityState`, `actionable`, and
    `strategyAutomationContextResolved` truth, including recovered
    non-actionable and unresolved strategy-context labels. Validation PASS:
    focused `BotsManagement` test (`13/13`), Web typecheck, Web lint, Web
    build, route-reachable i18n audit (`findings=0`), guardrails, diff check,
    and authenticated rendered `/dashboard/bots` smoke with no console errors.

- [x] `V1UI-05 fix(web-runtime): surface close attribution in bot monitoring history`
  - Closed the `/dashboard/bots` runtime history attribution gap. Bot
    monitoring now renders backend `closeReason` and `closeInitiator` for
    closed positions and close trades, with bot-owned i18n labels and shared
    attribution tone helpers. Validation PASS: focused `BotsManagement` test
    (`13/13`), Web typecheck, Web lint, Web build, route-reachable i18n audit
    (`findings=0`), guardrails, diff check.

- [x] `V1UI-04 feat(web-runtime): surface runtime mark-price source in monitoring`
  - Closed the backend-to-Web mark-price source reflection gap after
    `MARKETDATA-FUT-01`. Shared Web derivation now carries
    `liveMarkPriceSource`, Bots monitoring and Dashboard home render compact
    source labels beside mark prices, and i18n coverage is complete. Validation
    PASS: focused Web runtime tests (`26/26`), Web/API typecheck, Web lint,
    Web build, route-reachable i18n audit (`findings=0`), guardrails, diff
    check. Local API rendered smoke is blocked by missing
    `API_KEY_ENCRYPTION_KEYS` in workstation `.env`; Postgres itself is healthy
    and local migrations are applied.

## Queue Rules
- Keep `NOW` at max 5 tasks.
- Keep one logical change per task.
- If task grows, split before coding.
- After completion, update this file and `docs/planning/mvp-execution-plan.md`.




