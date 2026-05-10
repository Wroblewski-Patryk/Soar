# System Health

Last updated: 2026-05-10

## Latest Health Snapshot

- `V1-FINAL-PREFLIGHT-CURRENT-9D28F682` PASS/BLOCKED: final no-secret
  preflight now targets currently deployed
  `9d28f682f23dc176dbbad790bea8ddf213c8ac01`. Build-info PASS, public smoke
  PASS, activation artifacts fresh, RC artifacts fresh but failed, and V1
  remains `BLOCKED` on protected/formal evidence. Evidence:
  `docs/planning/v1-final-preflight-current-9d28f682-task-2026-05-10.md` and
  `docs/operations/v1-final-preflight-9d28f682-2026-05-10.md`.
- `V1-OPERATOR-UNBLOCK-CHECKLIST-2026-05-10` PASS/BLOCKED: the operator
  unblock checklist and final blocker execution pack now target deployed
  `822d92fc02067fa122e735ab6cc2783e438dc458`. Final preflight for that SHA
  reports build-info PASS, public smoke PASS, activation artifacts fresh, RC
  artifacts fresh but failed, and V1 `BLOCKED` on protected/formal evidence.
  Evidence: `docs/operations/v1-operator-unblock-checklist-2026-05-10.md` and
  `docs/operations/v1-final-preflight-822d92fc-2026-05-10.md`.
- `V1-PROD-ACTIVATION-REFRESH-2026-05-10` PASS/BLOCKED: production activation
  plan and evidence audit are fresh for 2026-05-10 and explicitly `NO-GO` for
  deployed `74752f025ef49bf5026ec92e056f59947e00a18f`. Final preflight reports
  build-info PASS, public smoke PASS, activation artifacts fresh, and V1 still
  `BLOCKED` on protected/formal evidence: liveimport auth/readback, rollback
  guard auth, production DB restore context, failed RC evidence, stale
  backup/restore drill, and stale rollback proof. Evidence:
  `docs/planning/v1-production-activation-refresh-2026-05-10-task.md` and
  `docs/operations/v1-final-preflight-74752f02-2026-05-10.md`.
- `V1-RC-BLOCKED-REFRESH-2026-05-10` PASS/BLOCKED: RC external gates status,
  RC sign-off record, and RC checklist are fresh for 2026-05-10 and correctly
  remain blocked/failed instead of approved. Final preflight for deployed
  `1609929ed3b98c2b794d8a0b48ff0f39c16cd75f` reports build-info PASS and
  public smoke PASS; V1 remains `BLOCKED` on protected/formal evidence:
  liveimport auth/readback, rollback guard auth, production DB restore
  context, stale activation audit/plan, stale backup/restore drill, stale
  rollback proof, Gate 2 SLO evidence, and real RC approvers. Evidence:
  `docs/planning/v1-rc-blocked-evidence-refresh-task-2026-05-10.md` and
  `docs/operations/v1-final-preflight-1609929e-2026-05-10.md`.
- `DEPLOY-FRESHNESS-9C125683` validation PASS/BLOCKED: production Web
  build-info now exposes
  `9c12568379ee77cda9c9e9df39879e141b5615fb`, which includes `b414e523`
  canonical exchange-side `LIVE_ORDER_CANCEL` for Binance and Gate.io. Public
  API/Web smoke passes. The no-secret final V1 preflight public checks pass and
  remain correctly `BLOCKED` on protected/formal evidence: liveimport auth,
  rollback guard auth, production DB restore context, current activation/RC
  evidence, `LIVEIMPORT-03` readback, backup/restore drill, rollback proof,
  and authenticated/admin UI clickthrough. Evidence:
  `docs/planning/deploy-freshness-9c125683-task-2026-05-10.md`,
  `docs/operations/deploy-freshness-9c125683-2026-05-10.md`, and
  `docs/operations/v1-final-preflight-9c125683-2026-05-10.md`.
- `EXCHANGE2-31` local validation PASS: canonical exchange-side
  `LIVE_ORDER_CANCEL` is added for Binance and Gate.io through the existing
  orders/exchange/authenticated connector boundary. Exchange-backed local
  order state is mutated only after the boundary call succeeds; contextless
  exchange-backed rows remain fail-closed. Focused exchange tests, focused
  orders cancel tests, API typecheck, guardrails, docs parity, and diff check
  pass. Production freshness is now proven by `DEPLOY-FRESHNESS-9C125683`;
  the earlier deploy lag is superseded. Evidence:
  `docs/planning/exchange2-31-live-order-cancel-boundary-task-2026-05-10.md`
  and `docs/operations/deploy-freshness-9c125683-2026-05-10.md`.
- `EXCHANGE2-30` validation and deployment PASS: Gate.io `LIVE_ORDER_SUBMIT` and
  shared `LIVE_EXECUTION` compatibility support are enabled through the
  canonical orders/exchange boundary. Gate.io exchange-side cancel remains
  unsupported. No real live-money action is performed. Focused exchange tests,
  wallet e2e, Web capability test, API typecheck, Web typecheck, production
  build-info for `04a4204ca9090586d49ae77b0dd8c1be048d7bdf`, and public
  deploy smoke pass. The no-secret final V1 preflight public checks pass and
  remain correctly blocked on protected/formal evidence.
  Evidence:
  `docs/planning/exchange2-30-gateio-live-order-submit-task-2026-05-10.md`
  and `docs/operations/deploy-freshness-04a4204c-2026-05-10.md`.
- `EXCHANGE2-29` local validation PASS: Gate.io `WALLET_CASHFLOW_HISTORY` is
  enabled through the existing exchange adapter boundary. Gate.io live submit
  and exchange-side cancel remain unsupported. Focused exchange/wallet
  cashflow tests, API typecheck, guardrails, docs parity, and diff check pass.
  Production build-info now exposes
  `8ea7f33b581ec0f3cf7d653168b160c31cbb23a8`, public deploy smoke passes, and
  no-secret final V1 preflight remains correctly blocked.
  Evidence:
  `docs/planning/exchange2-29-gateio-wallet-cashflow-history-task-2026-05-09.md`
  and `docs/operations/deploy-freshness-8ea7f33b-2026-05-09.md`.
- `EXCHANGE2-28` local validation PASS: Gate.io `TRADE_HISTORY_SNAPSHOT` is
  enabled through the existing authenticated-read boundary. Gate.io wallet
  cashflow history, live submit, and exchange-side cancel remain unsupported.
  Focused exchange tests, authenticated snapshot service test, API typecheck,
  guardrails, docs parity, and diff check pass. Production build-info now
  exposes `432f768701300c7ba600fa7633532c0cc9ef4b96`, public deploy smoke
  passes, and no-secret final V1 preflight remains correctly blocked.
  Evidence:
  `docs/planning/exchange2-28-gateio-trade-history-snapshot-task-2026-05-09.md`
  and `docs/operations/deploy-freshness-432f7687-2026-05-09.md`.
- `EXCHANGE2-27` validation and deployment PASS: Gate.io
  `OPEN_ORDERS_SNAPSHOT` is enabled through the existing authenticated-read
  boundary. Production build-info now exposes
  `214a9c034d38ab8670fd4b43d0f8ed692d78d90c`, and public deploy smoke passes.
  The no-secret final V1 preflight remains correctly blocked on
  protected/formal evidence. Gate.io trade-history, live submit, and
  exchange-side cancel remain unsupported.
  Evidence:
  `docs/planning/exchange2-27-gateio-open-orders-snapshot-task-2026-05-09.md`
  and `docs/operations/deploy-freshness-214a9c03-2026-05-09.md`.
- `EXCHANGE2-26` local validation PASS: Gate.io `POSITIONS_SNAPSHOT` is
  enabled through the existing authenticated-read boundary and positions
  exchange-snapshot route. Gate.io open-orders/trade-history, live submit, and
  exchange-side cancel remain unsupported. Production build-info now exposes
  `4c7548acc74295f27676c1f00d79dbf58b873942`, and public deploy smoke passes.
  Evidence:
  `docs/planning/exchange2-26-gateio-positions-snapshot-task-2026-05-09.md`
  and `docs/operations/deploy-freshness-4c7548ac-2026-05-09.md`.
- `EXCHANGE2-25` local validation PASS: Gate.io `BALANCE_PREVIEW` is enabled
  through the existing authenticated-read boundary and wallet preview route.
  Gate.io positions/open-orders/trade-history, live submit, and exchange-side
  cancel remain unsupported. Production build-info now exposes
  `15dfacb9882fc4904a2bfcd91d8b58c05d3ac5dd`, and public deploy smoke passes.
  Evidence:
  `docs/planning/exchange2-25-gateio-balance-preview-task-2026-05-09.md` and
  `docs/operations/deploy-freshness-15dfacb9-2026-05-09.md`.
- `EXCHANGE2-24` local validation PASS: Gate.io `API_KEY_PROBE` is enabled for
  provided and stored profile API-key connection tests through the shared
  exchange-aware probe service. Gate.io balance preview, positions/open-orders,
  trade-history, live submit, and exchange-side cancel remain unsupported.
  Production build-info now exposes
  `e76e08a1a20b12abaeabf4edc44a38ba37619005`, and public deploy smoke passes.
  Evidence: `docs/planning/exchange2-24-gateio-api-key-probe-task-2026-05-09.md`
  and `docs/operations/deploy-freshness-e76e08a1-2026-05-09.md`.
- Latest observed production build-info is
  `e8cd748e80b8693087e01beb21b0085ace747c49`: build-info PASS, public
  API/Web smoke PASS, and no-secret final V1 preflight public checks PASS.
  The preflight remains correctly `BLOCKED` on protected/formal V1 evidence.
  This is docs/evidence only over the protected runtime baseline. Evidence:
  `docs/operations/deploy-freshness-e8cd748e-2026-05-09.md` and
  `docs/operations/v1-final-preflight-e8cd748e-2026-05-09.md`.
- Previous public UI build-info was
  `745b5f5a45eab3f86b02e023479c8358f760bbf6`: public routes PASS and
  dashboard/admin no-auth gates redirect to `/auth/login`. This is
  docs/evidence only over the protected runtime baseline and does not close
  protected V1 evidence. Evidence:
  `docs/operations/prod-ui-public-access-clickthrough-745b5f5a-2026-05-09.md`.
- Latest protected runtime/preflight baseline is verified at
  `30b027b78544f76b5b638851e8e27c98f6d22ab5`: build-info PASS, public
  API/Web smoke PASS, and no-secret final V1 preflight public checks PASS.
  The preflight remains correctly `BLOCKED` on protected/formal V1 evidence.
  Evidence:
  `docs/operations/deploy-freshness-30b027b7-2026-05-09.md`,
  `docs/operations/v1-final-preflight-30b027b7-2026-05-09.md`, and
  `docs/planning/deploy-freshness-30b027b7-task-2026-05-09.md`.
- Current production build-info is verified at
  `ba3d852d5126b625a8cf702ab647d5c644d86f9c`: build-info PASS, public
  API/Web smoke PASS, and no-secret final V1 preflight public checks PASS.
  The preflight remains correctly `BLOCKED` on protected/formal V1 evidence.
  Evidence:
  `docs/operations/deploy-freshness-ba3d852d-2026-05-09.md`,
  `docs/operations/v1-final-preflight-ba3d852d-2026-05-09.md`, and
  `docs/planning/deploy-freshness-ba3d852d-task-2026-05-09.md`.
- Active protected V1 backlog/runbook targets are synced to deployed
  `30b027b78544f76b5b638851e8e27c98f6d22ab5`. This is a target sync only:
  `LIVEIMPORT-03`, rollback proof, restore proof, RC approval, and
  authenticated/admin UI audit remain blocked on operator inputs. Evidence:
  `docs/planning/open-protected-backlog-ba3d852d-sync-task-2026-05-09.md` and
  `docs/planning/deploy-freshness-30b027b7-task-2026-05-09.md`.
- Current production build-info is verified at
  `010b4f8b6abfaf4c24d26550eb4761215d119f21`: build-info PASS, public
  API/Web smoke PASS, and no-secret final V1 preflight public checks PASS.
  The preflight remains correctly `BLOCKED` on protected/formal V1 evidence.
  `LIVEIMPORT-03` target sync
  remains PASS, and protected readiness check remains PASS as a fail-closed
  blocker classification. V1 remains `BLOCKED` on missing live-import auth,
  rollback auth, production DB/Coolify restore context for current-date
  evidence, failed/open RC evidence, missing `LIVEIMPORT-03`, stale
  2026-05-08 restore evidence, and stale 2026-05-08 rollback proof. Evidence:
  `docs/operations/deploy-freshness-c50e1e7c-2026-05-09.md`,
  `docs/operations/v1-final-preflight-c50e1e7c-2026-05-09.md`,
  `docs/operations/prod-ui-public-access-clickthrough-c50e1e7c-2026-05-09.md`,
  `docs/operations/deploy-lag-1f1d9c12-2026-05-09.md`,
  `docs/operations/deploy-freshness-6c54bb5d-2026-05-09.md`,
  `docs/operations/v1-final-preflight-6c54bb5d-2026-05-09.md`,
  `docs/operations/prod-ui-public-access-clickthrough-6c54bb5d-2026-05-09.md`,
  `docs/operations/deploy-freshness-55469cdc-2026-05-09.md`,
  `docs/operations/v1-final-preflight-55469cdc-2026-05-09.md`,
  `docs/operations/prod-ui-public-access-clickthrough-55469cdc-2026-05-09.md`,
  `docs/operations/deploy-freshness-4ee1672e-2026-05-09.md`,
  `docs/operations/v1-final-preflight-4ee1672e-2026-05-09.md`,
  `docs/operations/prod-ui-public-access-clickthrough-4ee1672e-2026-05-09.md`,
  `docs/planning/liveimport-03-current-production-target-sync-task-2026-05-09.md`,
  and `docs/operations/v1-protected-access-readiness-2026-05-09.md`.
- Pushed `origin/main` currently ends at `010b4f8b`. Production build-info
  also exposes the correct full SHA
  `010b4f8b6abfaf4c24d26550eb4761215d119f21`. The earlier deploy-lag
  interpretation came from using an incorrect full SHA for the same short
  commit; the corrected wait passed on attempt 1. Evidence:
  `docs/planning/deploy-freshness-010b4f8b-task-2026-05-09.md`.
- Current production public smoke passes on the deployed `010b4f8b` surface:
  API `/health` 200, API `/ready` 200, and Web `/` 200.
- Historical deploy-lag entry `1f1d9c12` had no `apps`, `packages`, `prisma`,
  or `scripts` changes over then-deployed `c50e1e7c`; it was a docs/evidence
  batch. Later production build-info advanced beyond that lag to
  `010b4f8b6abfaf4c24d26550eb4761215d119f21`, so deploy freshness is no longer
  the active blocker. Runtime protected readback remains blocked on
  authenticated/operator evidence.
- Gate.io second-exchange foundation has advanced through `EXCHANGE2-06`.
  Latest pushed `main` is `5517f027`, including Gate.io public catalog,
  runtime event exchange generalization, public ticker/candle reader,
  opt-in `MARKET_STREAM_EXCHANGE=GATEIO` market-stream polling, and runtime
  consumption regressions for exact `GATEIO` ticker/final-candle context.
  Local validation for `EXCHANGE2-06` passed: API typecheck, repository
  guardrails, docs parity, diff check, and focused runtime loop Vitest
  (`47/47`). Production public smoke still passes, but production build-info
  remains at `d0dc6459e5fa33a8e5f68c5fc36dd29cc1df440d`; latest Gate.io
  market-stream/runtime commits are pushed but not yet verified as deployed.
- `EXCHANGE2-07` local source-path evidence is now added: a mocked Redis
  regression proves the Gate.io polling worker publishes ticker and
  final-candle events through canonical market-stream fanout and subscribers
  receive exact `GATEIO/FUTURES` context. This is not production/deployed
  source evidence and does not enable Gate.io `PAPER_PRICING_FEED`. Validation
  PASS: focused market-stream Vitest pack (`3` files, `7/7`), API typecheck,
  repository guardrails, docs parity, and diff check. Post-push public deploy
  smoke passed, but build-info waited 120 seconds for `4ef3ec58` and remained
  on `d0dc6459e5fa33a8e5f68c5fc36dd29cc1df440d`. Follow-up build-info now
  exposes `36ac02696ac0ce22a6b8bab545fcfb741125ea4b`, and public API/Web smoke
  passed after the freshness check.
- `EXCHANGE2-08` public Gate.io adapter smoke PASS: the existing
  `exchangePublicMarketData.service.ts` path read `GATEIO/FUTURES/BTCUSDT`
  ticker and `1m` candles successfully from public data without secrets,
  authenticated reads, exchange writes, or live orders. Gate.io
  `PAPER_PRICING_FEED` remains disabled pending target worker/source evidence.
  Post-push public API/Web smoke passed for `d4bdc7f0`, but build-info stayed
  on `36ac02696ac0ce22a6b8bab545fcfb741125ea4b` during the 120-second wait.
- `EXCHANGE2-09` worker source-selection regression PASS: market-stream worker
  env parsing is now tested through `marketStreamWorkerConfig.ts`. Binance
  remains the default source, Gate.io polling is explicit opt-in via
  `MARKET_STREAM_EXCHANGE=GATEIO`, and unsupported/invalid env values fall
  back to safe defaults. Validation PASS: focused worker/market-stream Vitest
  pack (`4` files, `8/8`) and API typecheck. Follow-up production build-info
  reached `9382d9317a5ae82d404559398922a253bef9e697`, and public API/Web
  smoke passed. Gate.io `PAPER_PRICING_FEED` remains disabled pending target
  environment source evidence with `MARKET_STREAM_EXCHANGE=GATEIO`.
- `EXCHANGE2-10` Web capability gating regression PASS: focused Web coverage
  proves `GATEIO` is listed in shared exchange options, supports only
  `MARKET_CATALOG`, and remains blocked for `PAPER_PRICING_FEED`,
  `LIVE_EXECUTION`, and `API_KEY_PROBE`; unknown/nullish exchanges fail
  closed. Validation PASS: focused Web Vitest pack (`3` files, `22/22`) and
  Web typecheck. Post-push public API/Web smoke passed for
  `21ec8efa01ec14ae7fd2c039ac4f9884a2564f65`, but build-info stayed on
  `9382d9317a5ae82d404559398922a253bef9e697` during the 120-second wait.
- `EXCHANGE2-11` wallet/bot form gating regression PASS: focused Web coverage
  proves Gate.io PAPER wallet submit stays blocked while
  `PAPER_PRICING_FEED` is unsupported, and Gate.io bot activation keeps the
  Active toggle disabled. Validation PASS: focused Web Vitest pack (`3` files,
  `19/19`) and Web typecheck.
- `EXCHANGE2-12` API wallet create fail-closed regression PASS: focused
  DB-backed wallet coverage proves a direct Gate.io PAPER wallet create request
  returns `EXCHANGE_NOT_IMPLEMENTED` for `PAPER_PRICING_FEED` and leaves no
  wallet persisted for the user. Validation PASS: focused wallet e2e (`21/21`),
  API typecheck from repo root, repository guardrails, docs parity, and diff
  check. Gate.io `PAPER_PRICING_FEED` remains disabled pending target source
  evidence.
- `EXCHANGE2-13` API wallet update fail-closed regression PASS: focused wallet
  CRUD coverage proves an existing Binance PAPER wallet cannot be updated to
  `GATEIO` while `PAPER_PRICING_FEED` is unsupported, and the wallet remains
  unchanged after rejection. Validation PASS: focused wallet CRUD e2e
  (`12/12`), API typecheck, repository guardrails, docs parity, and diff check.
- `EXCHANGE2-14` stored API-key probe fail-closed regression PASS: focused
  profile API-key coverage proves stored Gate.io placeholder credentials can
  exist, but the stored probe endpoint fails closed with `API_KEY_PROBE`
  unsupported and writes no connection-test audit log. Validation PASS: local
  Gate.io enum migration deploy, focused API-key e2e (`16/16`), API typecheck,
  repository guardrails, docs parity, and diff check.
- `EXCHANGE2-15` wallet balance preview fail-closed regression PASS: focused
  wallet coverage proves a stored Gate.io placeholder API key cannot be used
  for wallet balance preview while `BALANCE_PREVIEW` authenticated reads are
  unsupported, and the key is not marked used after rejection. Validation PASS:
  focused wallet e2e (`22/22`), API typecheck, repository guardrails, docs
  parity, and diff check.
- `EXCHANGE2-21` Gate.io public market-stream source smoke PASS: the new
  public-read-only runner captured real `GATEIO/FUTURES/BTCUSDT` ticker and
  final `1m` candle events through `ExchangePublicPollingMarketStreamWorker`
  with no credentials, exchange writes, or live orders. Evidence:
  `docs/operations/gateio-market-stream-source-smoke-2026-05-09.md`. Gate.io
  `PAPER_PRICING_FEED`, authenticated reads, live submit, and cancel remain
  disabled pending exact operation support and deployment/protected evidence.
- `EXCHANGE2-22` public symbol-rules regression PASS: Gate.io public symbol
  rules now resolve through the existing `MARKET_CATALOG`/market-map boundary
  instead of being coupled to `LIVE_EXECUTION`; unsupported exchanges without
  market catalog still return `null` without market loads. Gate.io paper/live
  and authenticated capabilities remain disabled.
- `EXCHANGE2-16` positions snapshot explicit-key fail-closed regression PASS:
  focused positions coverage proves a stored Gate.io placeholder API key cannot
  be selected via `apiKeyId` while `POSITIONS_SNAPSHOT` is unsupported. The
  service now enforces the adapter capability guard before test fallback data
  or connector reads, the route returns HTTP 501 with unsupported capability
  details, and `lastUsed` stays unchanged after rejection. Validation PASS:
  focused positions exchange snapshot e2e, API typecheck, repository
  guardrails, docs parity, and diff check.
- `EXCHANGE2-17` reconciliation snapshot fail-closed regression PASS: focused
  DB-backed service coverage proves stored Gate.io placeholder keys cannot
  reach open-orders or trade-history test fallback data while
  `OPEN_ORDERS_SNAPSHOT` and `TRADE_HISTORY_SNAPSHOT` are unsupported. Both
  paths preserve unsupported capability errors and leave `lastUsed` unchanged.
  Validation PASS: focused authenticated snapshots service test, API
  typecheck, repository guardrails, docs parity, and diff check.
- `EXCHANGE2-18` live submit boundary regression PASS: focused exchange
  boundary coverage proves Gate.io `LIVE_ORDER_SUBMIT` fails closed before
  credential resolution, connector construction, pretrade guards, leverage
  convergence, or live order adapter creation. Validation PASS: focused
  exchange adapter boundary test, API typecheck, repository guardrails, docs
  parity, and diff check.
- `EXCHANGE2-19` exchange-backed cancel route regression PASS: route-level API
  coverage proves persisted exchange-backed open orders fail closed through
  `/dashboard/orders/:id/cancel` with HTTP 501 and
  `LIVE_ORDER_CANCEL_UNSUPPORTED`, while order state and cancellation audit
  truth remain unchanged. Validation PASS: focused route e2e (`1/1`), full
  orders/positions e2e (`22/22`), API typecheck, repository guardrails, docs
  parity, and diff check.
- Production deploy freshness for the Gate.io fail-closed batch PASS:
  `/api/build-info` exposed
  `90cd07d602f0a31f315719b8a5cd5be3fd112313` after a longer wait, and public
  smoke passed for API `/health`, API `/ready`, and Web `/`. Evidence:
  `docs/operations/deploy-freshness-90cd07d6-2026-05-08.md`.
- Final V1 preflight public deploy checks now avoid global `pnpm` PATH drift by
  spawning bundled Node scripts directly. Focused tests passed (`13/13` before
  the remediation-hint assertion was added, then rerun in final validation),
  and the production preflight for deployed `90cd07d6` reports build-info PASS
  plus public smoke PASS while remaining correctly BLOCKED on protected
  auth/readback, rollback proof, and RC Gate 4 approval evidence. Evidence:
  `docs/operations/v1-final-preflight-90cd07d6-2026-05-08.md`.
- `EXCHANGE2-20` planning reconciliation PASS: second-exchange planning now
  reflects the deployed Gate.io foundation instead of treating all work as
  blocked. Current supported Gate.io truth remains public catalog plus public
  `FUTURES`/swap market-data foundation only; paper pricing, authenticated
  reads, live submit, and cancel remain unsupported. Evidence:
  `docs/planning/exchange2-20-plan-reconciliation-task-2026-05-09.md`.
- Production public UI access refresh PASS for deployed `90cd07d6`: Web
  build-info matches
  `90cd07d602f0a31f315719b8a5cd5be3fd112313`, API `/health` and `/ready`
  return HTTP 200, public Web routes return HTTP 200, and unauthenticated
  dashboard/admin routes redirect to `/auth/login` with HTTP 307. Evidence:
  `docs/operations/prod-ui-public-access-clickthrough-90cd07d6-2026-05-09.md`.
  The full production UI module clickthrough remains blocked on valid
  authenticated/admin app access.
- V1 final preflight refresh for deployed `90cd07d6` is PASS for public deploy
  health and correctly BLOCKED for release readiness. Build-info and public
  API/Web smoke pass, while missing live-import auth, rollback auth,
  production DB restore context, missing `LIVEIMPORT-03`, and stale 2026-05-08
  release evidence block the 2026-05-09 release date. Evidence:
  `docs/operations/v1-final-preflight-90cd07d6-2026-05-09.md`.
- Production activation refresh for 2026-05-09 is current and `NO-GO`:
  activation plan and activation evidence audit are fresh, and the follow-up
  no-secret preflight confirms those two evidence families are no longer stale.
  V1 remains blocked on protected auth, production DB restore context, stale
  RC/recovery evidence, missing `LIVEIMPORT-03`, and rollback proof. Evidence:
  `docs/planning/v1-production-activation-and-evidence-plan-2026-05-09.md` and
  `docs/operations/v1-production-activation-evidence-audit-2026-05-09.md`.
- RC evidence refresh for 2026-05-09 is current and blocked: RC external
  gates status is fresh with Gate 2 and Gate 4 open, RC sign-off is fresh and
  `BLOCKED`, and RC checklist is synced to the same date. Final preflight now
  reports RC evidence as fresh `failed`, not stale. Evidence:
  `docs/planning/v1-rc-blocked-evidence-refresh-task-2026-05-09.md`.
- Rollback proof tooling now supports explicit `--today` evidence-date stamps,
  but no 2026-05-09 rollback proof artifact is accepted yet. A no-auth
  sandboxed attempt could not reach production or write an artifact; protected
  rollback auth/network access is still required.
- Restore drill tooling now supports explicit `--today` evidence-date stamps,
  but no 2026-05-09 production restore drill artifact is accepted yet.
  Approved production DB/Coolify context is still required.
- Final blocker pack date synchronization PASS: the active V1 operator pack now
  declares one `$releaseDate` and passes it to supported date-aware preflight,
  restore drill, rollback proof, RC evidence, and final release gate commands.
  This is runbook/state evidence only; no protected production evidence was
  generated or accepted. Evidence:
  `docs/planning/v1-final-blocker-pack-date-overrides-task-2026-05-09.md`.
- Dashboard runtime aggregate deploy freshness PASS: production Web build-info
  now exposes `3c5da34371e22aecb1a7aff0a185018870d35cec`, and safe public smoke
  passed for API `/health`, API `/ready`, and Web `/`. Evidence:
  `docs/operations/deploy-freshness-3c5da343-2026-05-09.md`. Protected release
  evidence and authenticated UI clickthrough remain blocked on approved
  credentials/context.
- Final V1 preflight for deployed `3c5da343` is current and safely BLOCKED:
  build-info PASS, public smoke PASS, missing protected live-import and
  rollback auth, missing production DB restore context, failed RC evidence,
  missing `LIVEIMPORT-03`, and stale 2026-05-08 restore/rollback evidence for
  the 2026-05-09 evidence date. Evidence:
  `docs/operations/v1-final-preflight-3c5da343-2026-05-09.md`.
- Production public UI access refresh PASS for deployed `3c5da343`: Web
  build-info matches `3c5da34371e22aecb1a7aff0a185018870d35cec`, API
  `/health` and `/ready` return HTTP 200, public Web routes return HTTP 200,
  and unauthenticated dashboard/admin routes redirect to `/auth/login` with
  HTTP 307. Evidence:
  `docs/operations/prod-ui-public-access-clickthrough-3c5da343-2026-05-09.md`.
  The full production UI module clickthrough remains blocked on valid
  authenticated/admin app access.
- Final blocker pack candidate SHA sync PASS: protected evidence commands now
  use the verified deployed docs/evidence handoff candidate
  `4ee1672e7a3ac6d9b549b4d461120afd7f89d68f` as `$expectedSha`. The runtime
  code behavior remains the previously verified dashboard aggregate batch, but
  protected commands must match current production build-info. Evidence:
  `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`.
- Docs/evidence handoff deploy freshness PASS: production Web build-info now
  exposes `4ee1672e7a3ac6d9b549b4d461120afd7f89d68f`, public API/Web smoke
  passed with `--no-workers`, and no-secret final V1 preflight reports
  build-info/public smoke PASS while protected V1 remains BLOCKED. Evidence:
  `docs/operations/deploy-freshness-4ee1672e-2026-05-09.md` and
  `docs/operations/v1-final-preflight-4ee1672e-2026-05-09.md`.
- Production public UI access refresh PASS for deployed `4ee1672e`: Web
  build-info matches `4ee1672e7a3ac6d9b549b4d461120afd7f89d68f`, API
  `/health` and `/ready` return HTTP 200, public Web routes return HTTP 200,
  and unauthenticated dashboard/admin routes redirect to `/auth/login` with
  HTTP 307. Evidence:
  `docs/operations/prod-ui-public-access-clickthrough-4ee1672e-2026-05-09.md`.
  The full production UI module clickthrough remains blocked on valid
  authenticated/admin app access.
- `LIVEIMPORT-03` current production target is now synced to deployed
  `4ee1672e7a3ac6d9b549b4d461120afd7f89d68f`. Public/no-secret checks pass,
  but this does not close the blocker; it still requires authenticated
  read-only runtime positions readback and redacted evidence for the reported
  LIVE ETH/DOGE rows.
- Protected access readiness BLOCKED: current shell lacks required
  live-import auth, rollback auth, and production DB/Coolify restore context
  env names. No protected production evidence, rollback proof, restore drill,
  RC approval, or authenticated/admin UI clickthrough can be completed until
  operator inputs are supplied. Evidence:
  `docs/operations/v1-protected-access-readiness-2026-05-09.md`.
- Production public UI access probe on 2026-05-08 passed for API `/health`,
  API `/ready`, Web `/`, `/auth/login`, `/auth/register`, `/offline`, and
  `/api/build-info`; unauthenticated dashboard/admin routes returned HTTP 307
  to `/auth/login`, confirming fail-closed auth gates. The same evidence keeps
  deploy freshness blocked because build-info reports
  `d0dc6459e5fa33a8e5f68c5fc36dd29cc1df440d` while latest expected prefix was
  `373a0ceb`. Evidence:
  `docs/operations/prod-ui-public-access-clickthrough-2026-05-08.md`.
  Follow-up after pushing docs commit
  `d55a86007b80733d67e793c261a5208c6734ab79`: public deploy smoke still
  passed, but build-info waited 120 seconds and remained on
  `d0dc6459e5fa33a8e5f68c5fc36dd29cc1df440d`.
- Production web build-info reached
  `052df82244ea0f81e8611ff8bb2b677db115bd19`, which contains the backend
  runtime parity fix, final release-gate build-info freshness, strict RC
  approval evidence hardening, production restore evidence alignment, and
  final preflight restore-context classification plus the current no-secret
  preflight status snapshot.
  Production API `/health`, API `/ready`, and WEB `/`
  passed the latest public smoke check. GitHub Actions is not an accepted
  production deployment path for this project, so future production deployment
  must still be performed through Coolify/manual operator controls followed by
  local build-info verification.
- Canonical queue check found two open production-evidence items:
  `LIVEIMPORT-03` and `BOTMULTI-09`.
- The local full-architecture repair and validation chain is closed through
  `FULLARCH-FIX-11`; remaining release evidence requires authenticated or
  protected production access.
- The current shell exposes no production admin token, operator login, ops
  basic auth, or ops header environment variables. Authenticated production
  readback is therefore blocked in this session.
- Latest V1 final preflight on deployed `052df82244ea0f81e8611ff8bb2b677db115bd19`
  reports build-info PASS, public smoke PASS, production DB restore context
  SATISFIED, activation evidence fresh, restore evidence fresh/PASS, and
  `BLOCKED` only on live-import auth, rollback auth, failed RC Gate 4 approval
  evidence, missing `LIVEIMPORT-03`, and failed rollback proof.
- Current no-secret final V1 preflight snapshot for deployed
  `052df82244ea0f81e8611ff8bb2b677db115bd19` is available at
  `docs/operations/_artifacts-v1-final-preflight-current.json` and
  `docs/operations/v1-final-preflight-current.md`. It is status-only handoff
  material, not final release evidence.
- Final blocker execution pack:
  `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`.
- Production restore drill evidence is fresh/PASS and final preflight now
  treats it as satisfying the production DB restore context prerequisite.
  Current preflight still exits `BLOCKED` on live-import auth, rollback auth,
  failed RC Gate 4 approval evidence, missing `LIVEIMPORT-03`, and failed
  rollback proof.

## Latest Validation

- `V1-PAPER-LIVE-BACKEND-RUNTIME-PARITY-2026-05-08` PASS: fixed
  `executionOrchestrator` so close-settlement entry-fee truth is read through
  `RuntimeTradeGateway.sumEntryFees`, not a direct Prisma call inside the
  shared PAPER/LIVE orchestration path. Validation passed: focused engine
  parity/crash pack (`4/4` files, `26/26` tests), API typecheck, and
  repository guardrails. After verifying the reachable local DB stack through
  `localhost:5432`/`6379` and avoiding the unhealthy `desktop-linux` Docker
  context, the broader runtime sweep also passed sequentially (`10/10` files,
  `157/157` tests), including bot runtime scope and PnL parity e2e. The
  follow-up backend V1 evidence line also passed sequential exchange
  fill/live-import/takeover coverage (`8/8` files, `76/76` tests),
  manual/order/runtime orchestration coverage (`9/9` files, `75/75` tests),
  runtime service coverage (`19/19` files, `115/115` tests), exchange adapter
  coverage (`17/17` files, `86/86` tests), bot/position readback coverage
  (`16/16` files, `72/72` tests), bot contract/backtest parity coverage
  (`12/12` files, `84/84` tests), and the full local API suite with test-only
  API-key encryption env (Vitest exit `0`).
  Build validation also passed: `pnpm --filter api run build` and
  `pnpm run build`.
- Post-push deployment freshness check for the V1 backend parity candidate:
  `ops:deploy:wait-web-build-info` timed out after eight HTTP 200 polls over
  120 seconds; production web build-info remained on
  `4f6832d6d94d0d9e86a2504b4a00fe177a1c6c44`. Public production API `/health`
  returned `ok` and `/ready` returned `ready`. This is a Coolify/manual
  deployment boundary, not a local backend regression.
- Extended post-push deployment freshness check for the pushed V1 backend
  parity line: `ops:deploy:wait-web-build-info` timed out after thirty HTTP
  200 polls over 900 seconds; production web build-info still remained on
  `4f6832d6d94d0d9e86a2504b4a00fe177a1c6c44`. Public deploy smoke without
  workers passed (`API /health`, `API /ready`, and `WEB /` all returned 200).
  This confirms the production site is healthy but not yet deployed to the
  pushed candidate.
- Follow-up production freshness check then showed production web build-info
  advanced to `da1e52cfec0b70e5a94e59d75fe702a55c348d74`, which contains the
  V1 backend PAPER/LIVE adapter-pure runtime fix. A later wait for the
  docs-only state commit `156e19ea42b50b20201ebec9f040a1b3749a4978` timed out
  after ten HTTP 200 polls over 300 seconds, with production still on
  `da1e52cf...`. Public deploy smoke without workers passed again. A
  read-only `LIVEIMPORT-03` collector attempt against deployed
  `da1e52cf...` failed closed with missing production auth, and a names-only
  env scan found only `FIGMA_OAUTH_TOKEN` and `IGCCSVC_DB`.
- Latest V1 release-gate dry-run:
  `docs/operations/v1-release-gate-prod-2026-05-08T05-27-38-139Z.md` reports
  `readiness=not_ready`. It marks the 2026-05-07 activation, RC,
  backup/restore, and rollback artifacts as stale for 2026-05-08, and dry-run
  mode still cannot approve production. Fresh no-auth protected probes remain
  fail-closed: runtime freshness returned HTTP `401`, and rollback guard
  returned `shouldRollback=true` due to `runtime_freshness_endpoint_http_401`
  and `alerts_endpoint_http_401`.
- Final refreshed 2026-05-08 V1 release-gate dry-run:
  `docs/operations/v1-release-gate-prod-2026-05-08T05-36-43-320Z.md` reports
  `readiness=not_ready`. Activation audit, activation plan, RC external gates
  status, RC sign-off record, and RC checklist are fresh. Backup/restore drill
  evidence is fresh but `FAILED` because production DB/Coolify access is not
  available in this shell. Rollback proof is fresh but `FAILED` because
  protected runtime freshness and alerts endpoints return HTTP `401` without
  auth.
- Follow-up production freshness check for latest `main`
  `d1755b45fc5a6fa901b86519366188efe743a05a` timed out after ten HTTP 200
  polls over 300 seconds; production advanced from `76a7d0fc...` to
  `e6ccbedaa1d0074d5dc335935bb6b51a9bb1e387`, but not to `d1755b45...`.
  Public deploy smoke without workers passed. `LIVEIMPORT-03` readback against
  deployed `e6ccbeda...` still failed closed with missing production auth.
  Latest dry-run
  `docs/operations/v1-release-gate-prod-2026-05-08T05-43-51-157Z.md` remains
  `not_ready` with the same fresh activation/RC and failed recovery blockers.
- RC evidence preflight on 2026-05-08: strict production evidence check
  reports `G1=PASS`, `G2=PASS`, `G3=PASS`, `G4=OPEN`; blockers are limited to
  Gate 4 sign-off identity/final approval fields (Engineering, Product,
  Operations, RC owner, and final status not `APPROVED`). RC gates summary
  also reports Gate2 policy `PASS_ONLY` and notes the underlying evidence
  artifact is stale relative to the refreshed status.
- Deployment coordination note: when a future step depends on a pushed commit
  being live, wait for production build-info before continuing. This shell does
  not expose Coolify deploy webhook/API token variables, so force deploy must
  be done by an operator in Coolify or by providing out-of-repository deploy
  webhook credentials.
- Deploy freshness coordination PASS: `ops:deploy:wait-web-build-info` for
  `0a2e2353` passed after production advanced from `2c232699...` to
  `0a2e2353177c15d4a4934c03837835785e01d710`. Public deploy smoke without
  workers passed immediately afterward.
- `LIVEIMPORT-03` auth preflight hardening PASS: the existing
  `ops:liveimport:readback` missing-auth fail-closed path now names the
  accepted auth variable choices without printing secret values. Validation
  covered script syntax, help, dry-run, no-auth fail-closed output, and no
  artifact creation.
- Recovery proof preflight hardening PASS: restore drill help and missing prod
  container failure now name `PROD_DB_CHECK_*` / `PRODUCTION_DB_CHECK_*`
  choices, and rollback proof help names `ROLLBACK_GUARD_*` base URL/auth/OPS
  choices. Validation covered script syntax, help paths, missing prod DB
  container fail-closed path, guardrails, docs parity, and diff check.
- RC sign-off preflight hardening PASS: blocked `ops:rc:signoff:build` runs
  now print missing required Gate 4 fields, while approved temp-output behavior
  remains available when Gates 1-3 pass and required names are provided.
  Owner contact is reported as recommended handoff metadata.
- Current deployed-HEAD V1 release-gate dry-run:
  `docs/operations/v1-release-gate-prod-2026-05-08Tcurrent-deployed-head-dry-run.md`
  reports `readiness=not_ready`. Activation and RC families are fresh;
  backup/restore drill and rollback proof are fresh but failed; dry-run mode
  still blocks final approval.
- Release gate live-import evidence enforcement PASS: `ops:release:v1:gate`
  now requires `LIVEIMPORT-03 runtime readback` for production. Latest dry-run
  `docs/operations/v1-release-gate-prod-2026-05-08Tliveimport-required-dry-run.md`
  reports `readiness=not_ready` with `evidence:liveImportReadback:missing`,
  backup/restore failed, rollback proof failed, and dry-run mode blockers.
- Release gate build-info freshness hardening PASS: `ops:release:v1:gate`
  now supports `--expected-sha` / `RELEASE_GATE_EXPECTED_SHA` and adds a web
  build-info freshness gate before deploy smoke. Latest dry-run
  `docs/operations/v1-release-gate-prod-2026-05-08Tbuild-info-required-dry-run.md`
  shows the planned `ops:deploy:wait-web-build-info` step and remains
  `not_ready` for the expected protected evidence blockers.
- Release gate RC approval evidence hardening PASS: `ops:release:v1:gate`
  now requires RC external gates to show all four gates `PASS`, the RC
  sign-off record to report `RC status: APPROVED`, and the RC checklist to
  show `G4=PASS`. Latest dry-run
  `docs/operations/v1-release-gate-prod-2026-05-08Trc-approval-required-dry-run.md`
  reports RC external gates, RC sign-off, and RC checklist as `failed` while
  current Gate 4 remains open/blocked, so final `ready` cannot pass on fresh
  but unapproved RC artifacts.
- Final V1 preflight command PASS as fail-closed tooling: `ops:release:v1:preflight`
  confirms deployed build-info for current `HEAD`, reports missing
  `LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`, and production DB restore env
  names, classifies current release evidence blockers, exits non-zero, and
  writes no protected production evidence artifacts when operator access is
  absent.
- Final V1 preflight regression lock PASS: focused tests now cover missing
  required envs, token or email/password alternatives, both production DB env
  families, optional OPS auth layers, and skipped build-info behavior for local
  unit tests.
- Final V1 preflight JSON report PASS: `ops:release:v1:preflight` now supports
  `--json-output <path>` for a no-secret machine-readable blocker report. A
  local no-auth run against a temporary JSON path produced `status=blocked`
  and no secret/token value exposure; the generated file was not committed as
  source-of-truth because it contains a point-in-time expected SHA.
- Final V1 preflight public smoke PASS: `ops:release:v1:preflight` now runs
  the existing public deploy smoke with worker checks disabled. Current
  preflight reports build-info PASS and public API/Web smoke PASS, then blocks
  only on protected auth/DB/approval and evidence inputs.
- Final V1 preflight remediation hints PASS: known blocker IDs now include
  no-secret next actions in CLI/JSON output, pointing to the approved final
  blocker commands for live-import readback, restore drill, rollback proof,
  RC sign-off, and checklist sync.
- Final V1 preflight blocker details PASS: the optional no-secret JSON report
  now includes additive `blockerDetails` metadata for known and unknown
  blockers, including category, severity, protected-input requirement,
  final-evidence requirement, and remediation availability for later
  Web/operator status rendering.
- Final V1 preflight Markdown report PASS: `ops:release:v1:preflight` now
  accepts `--markdown-output <path>` and writes a human-readable no-secret
  status report from the same preflight report object as JSON. It remains
  status-only handoff material, not final V1 release evidence.
- Protected-context Coolify sweep PASS as blocker classification:
  production build-info for `e6e7d4a044ce80279c542412a91bae4a6a012392`
  passes, public API/Web smoke passes, and Coolify exposes the production
  Postgres container name `x11cfnz1dd9x0yzccftqzcoe`. The sweep remains
  release-blocked because local Docker cannot reach that VPS container, Soar
  application auth is not present for `LIVEIMPORT-03`, rollback proof auth is
  not present, and RC Gate 4 approver identities are still missing. Generated
  reports:
  `docs/operations/_artifacts-v1-final-preflight-2026-05-08-protected-context.json`
  and
  `docs/operations/v1-final-preflight-2026-05-08-protected-context.md`.
- Production restore drill PASS: approved Coolify terminal access executed the
  isolated backup/restore drill against production Postgres container
  `x11cfnz1dd9x0yzccftqzcoe`. Evidence:
  `docs/operations/v1-restore-drill-prod-2026-05-08T15-16-24Z.md`. Follow-up
  V1 preflight reports `backup/restore drill evidence: fresh for 2026-05-08`.
- Protected auth context sweep PASS as blocker classification: approved
  API runtime env-name sweep recorded no `LIVEIMPORT_READBACK_*` or
  `ROLLBACK_GUARD_*` auth env names, rollback proof rerun failed closed on
  protected `401` responses, and `ops:release:v1:preflight` now reports
  production DB restore context as satisfied by fresh backup/restore drill
  evidence. Focused tests passed (`node --test scripts/runV1FinalPreflight.test.mjs`,
  `11/11`). Remaining preflight blockers are live-import auth, rollback auth,
  failed RC Gate 4 approval evidence, missing `LIVEIMPORT-03`, and failed
  rollback proof.
- `V1-LIVE-IMPORT-STATUS-ISOLATION-2026-05-07` PASS: pre-fix e2e proved
  `/dashboard/positions/live-status` returned global reconciliation diagnostic
  counts for an authenticated user. The route now filters
  `lastPositionDiagnostics` by `req.user.id` and recomputes summary/count
  fields from the user-scoped diagnostics. Post-fix validation passed: focused
  e2e (`3/3`), import diagnostics/service pack (`35/35`), API typecheck,
  repository guardrails, docs parity, and diff check.
- `V1-DASHBOARD-CRYPTO-ICONS-REGRESSION-2026-05-07` PASS: pre-fix Web
  regression proved `AssetSymbol` stayed stuck on a fallback badge after a
  prior image error and a later symbol/icon URL change. The shared component
  now resets image failure state when the normalized symbol or icon URL changes.
  Post-fix validation passed: component test (`4/4`), focused dashboard widget
  pack (`25/25`), Web typecheck, Web lint, repository guardrails, docs parity,
  and diff check.
- `V1-PROD-GITHUB-ACTIONS-REGRESSION-CLEANUP-2026-05-07` in progress:
  removing GitHub Actions production promote/rollback entrypoints and the
  local helper because the operator confirmed GitHub Actions is not an accepted
  deployment mechanism for this project.
- Superseded GitHub Actions deploy-path notes are closed as invalid for the
  active project setup. Production deployment is Coolify/manual operator owned.
- `V1-FINAL-BLOCKER-PREREQ-RECHECK-2026-05-07` PASS as blocker
  classification: public production build-info matches
  `21bb52f1e4b8865aab0dbb83ecffe698061fd7a3`; names-only env scan found
  `FIGMA_OAUTH_TOKEN` and `IGCCSVC_DB`, not the Soar production auth variables
  required by the final blocker pack; `ops:liveimport:readback` failed closed
  before protected runtime readback with missing auth; refreshed release-gate
  dry-run remains `not_ready`.
- `V1-PROD-RECOVERY-PROOF-BLOCKED-REFRESH-2026-05-07` PASS as blocker
  classification: rollback proof failed closed on protected `401` responses;
  restore drill is recorded as not executed due to missing production
  DB/Coolify access; release-gate dry-run classifies both recovery proof
  families as `FAILED`.
- `V1-RC-BLOCKED-REFRESH-2026-05-07` PASS: RC status/sign-off/checklist were
  refreshed as blocked/open evidence. Follow-up production release-gate dry-run
  reports RC families fresh and readiness still `not_ready`.
- `V1-PROD-ACTIVATION-REFRESH-2026-05-07` PASS: fresh production activation
  plan and activation audit were created as `NO-GO` artifacts. Follow-up
  production release-gate dry-run reports activation plan/audit `fresh` and
  readiness still `not_ready` due to stale RC, backup/restore, rollback, and
  dry-run blockers.
- `V1-PROD-GATE-DRY-RUN-2026-05-07` release-gate classifier PASS in dry-run
  mode: generated production report with `readiness=not_ready`. Blockers:
  stale activation audit, activation plan, RC external gates status, RC
  sign-off, RC checklist, backup/restore drill evidence, rollback proof pack,
  plus dry-run mode requiring remote/non-dry-run execution for approval.
- `PROD-BUILDINFO-LAG-2026-05-07` production freshness recheck: canonical
  build-info wait for `21bb52f1e4b8865aab0dbb83ecffe698061fd7a3` timed out
  after six HTTP 200 polls with last seen SHA
  `6bf5de83b8ed285410ecc10ecc50a2567ac68ee1`. Public API `/health` and
  `/ready` passed. A later wait passed on attempt 1 for `21bb52f1...`, closing
  this deploy-lag note for the code/tooling commit.
- `LIVEIMPORT-03-COLLECTOR-HARDENING-2026-05-07` collector hardening PASS:
  syntax check, help path, dry-run path, missing-auth fail-closed path, and a
  local no-running-session harness. The collector now exits non-zero when no
  runtime positions payload was collected from a RUNNING session.
- `LIVEIMPORT-03-COLLECTOR-2026-05-07` ops collector validation PASS:
  `ops:liveimport:readback -- --help`, dry-run with expected production SHA,
  and missing-auth fail-closed path all behaved as expected. The fail-closed
  run did not access protected API without credentials and did not print
  secret values.
- Post-push deploy freshness check for docs/collector SHA `6bf5de83` timed out
  twice; production remained on runtime candidate `1f816362`. This does not
  block `LIVEIMPORT-03` because the collector runs locally and the deployed
  runtime fix is already present in `1f816362`.
- `PROD-PROMOTE-PREQ-2026-05-07` production promotion prerequisite sweep:
  remote `main` check PASS for `1f816362c93e117e47cfe52a35e0fec93bd0b37d`.
  First public web build-info wait timed out on stale
  `834f83711ba11288829746338d1097abb6bf1c44`; later rerun PASS on attempt 1
  with `gitSha=1f816362c93e117e47cfe52a35e0fec93bd0b37d`. Public production
  API `/health`, API `/ready`, and web `/auth/login` PASS.
- `PLAN-SWEEP-2026-05-07` planning-status sweep PASS: active planning now
  records local audit closure through `FULLARCH-FIX-11` and the
  `LIVEIMPORT-03` prerequisite sweep; no executable local NOW task remains
  before authenticated production readback.
- `FULLARCH-FIX-11` focused wallet/market/bot topology gate PASS: API pack
  (`11/11` files, `80/80` tests) and Web pack (`21/21` files, `49/49` tests).
- `FULLARCH-FIX-10` focused market-stream/dashboard-monitoring gate PASS: API
  pack (`9/9` files, `63/63` tests) and Web pack (`19/19` files, `79/79`
  tests).
- `FULLARCH-FIX-09` focused strategy/backtest/reports/logs gate PASS: API pack
  (`12/12` files, `92/92` tests) and Web pack (`21/21` files, `49/49` tests).
- `FULLARCH-FIX-08` focused security/isolation release-gate validation PASS:
  `18/18` API test files and `87/87` tests using sequential execution with
  test-only API-key encryption env.
- `FULLARCH-FIX-07` focused runtime repair closure validation PASS:
  `16/16` API test files and `240/240` tests using sequential execution.
- `FULLARCH-FIX-06` focused import-normalization validation PASS:
  normalizer suite (`5/5`), import/reconciliation/takeover pack (`42/42`), and
  API typecheck.
- `pnpm run quality:guardrails` PASS.
- `git diff --check` PASS with line-ending warnings only.
- 2026-05-07 safe env-scan guardrail: names-only PowerShell scan confirmed
  only `FIGMA_OAUTH_TOKEN` and `STITCH_API_KEY` match the broad auth/prod
  name pattern in this shell; no values are recorded in repository artifacts.
- 2026-05-07 post-`FULLARCH-FIX-11` prerequisite sweep: names-only PowerShell
  scan again found only `FIGMA_OAUTH_TOKEN` and `STITCH_API_KEY`; no production
  read-only auth variable name is present in this shell.
- 2026-05-07 state-sync analysis: PowerShell queue scan found first open tasks
  at `LIVEIMPORT-03` and `BOTMULTI-09`; environment-variable name scan found
  only `FIGMA_OAUTH_TOKEN`, not production auth material.

## Validation Expectations

Docs-only agent workflow changes require at minimum:

- path/link review
- `pnpm run quality:guardrails`

Broader lint, typecheck, tests, and build are not required unless code or
runtime contracts are changed.

## Deployment Impact

Production build-info reached `721fe8482922835a9419f0e529baeef4ff6a74c9`,
which contains the V1 backend PAPER/LIVE adapter-pure runtime fix, refreshed
release-state docs, blocker evidence alignment, deploy-wait coordination,
operator preflight hardening notes, live-import evidence enforcement,
build-info freshness enforcement, strict RC approval evidence enforcement, and
restore-context preflight alignment. The next executable release task must
still verify the currently checked-out `HEAD` with build-info before protected
evidence collection. It requires authenticated read-only production evidence,
protected production rollback proof, and real RC approval inputs; the current
shell still lacks those credentials and approvals.
