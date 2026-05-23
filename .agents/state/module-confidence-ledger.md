# Module Confidence Ledger

Last updated: 2026-05-23

## Purpose

This ledger is the quick reality map for Soar. It tracks whether each important
trading, bot, backtest, exchange, dashboard, subscription, and operations
journey is implemented, verified, broken, blocked, or unknown. Keep it honest.
Do not turn uncertainty into optimism.

## Status Vocabulary

- `NOT_STARTED`: no meaningful implementation exists.
- `IN_PROGRESS`: implementation is actively changing.
- `IMPLEMENTED_NOT_VERIFIED`: code exists, but current proof is missing.
- `PARTIAL`: some scenarios pass, but important scenarios are missing or stale.
- `VERIFIED`: current evidence proves the journey for the target scope.
- `BROKEN`: a reproducible defect exists.
- `BLOCKED`: verification or implementation is blocked by access, decision,
  environment, dependency, or missing input.
- `DEFERRED`: explicitly out of the current release scope.

## Confidence Rules

- `High`: fresh reproducible evidence exists for the real journey.
- `Medium`: good local proof exists, but target, edge-case, or freshness is
  incomplete.
- `Low`: evidence is missing, stale, inferred, or chat-only.

## Current Operational Override

- 2026-05-23 post-release docs/state deploy freshness: follow-up docs/state
  sync commits must prove the pushed `HEAD` through public Web build-info and
  public deploy smoke after deployment convergence. The latest verified public
  checkpoint before this record is
  `dd3191d73944f534800659b2dfd0bf5e0bd8b52f`; production Web build-info
  reports that SHA on `main` with `metadataSource=github-branch` and build id
  `PrpSx-bTjsSwKw5bQemwh`, and public smoke passes API `/health`, API
  `/ready`, and Web `/`. Earlier deploys required cancelling stale
  queued/in-progress Coolify deployments and triggering a fresh `soar-web`
  deploy, so queue recovery remains an operations pitfall. Authenticated
  deploy smoke is not claimed for the latest docs/state sync because the
  available Coolify credential is not a valid Soar application password for
  `ai@luckysparrow.ch` (`401 Invalid email or password`).
- 2026-05-23 `SOAR-OPERATIONS-001` and `SOAR-WORKERS-001`: deployed
  `b1ba69edccc639e97943f37fb2b1e6249a62e87c` has current production proof for
  build-info, deploy smoke, split-worker `/workers/ready`, restore drill,
  rollback proof, production UI clickthrough, RC Gates 1-4, SLO
  health/readiness/5xx/queue-lag objectives, read-only `LIVEIMPORT-03`
  runtime readback for the real open symbols `SOLUSDT` and `BNBUSDT`, final
  preflight with no blockers, and a full non-dry-run production release gate
  returning `ready`. `SOAR-WORKERS-001` is current for split-worker readiness.
  `SOAR-OPERATIONS-001` is verified for the current production release gate.
  No production LIVE order, position, exchange mutation, or bot activation
  change was performed by this proof.

## Ledger

| ID | Module | Journey / function | Priority | Status | Confidence | Evidence | Missing proof or defect | Next smallest action | Owner | Last verified |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SOAR-DATA-001 | Data Model / Migrations | Prisma schema, migration chain, indexes, uniqueness, ownership, and DB-backed data contracts | P0 | PARTIALLY VERIFIED | High | 2026-05-19 `docs/operations/data-model-migrations-audit-2026-05-19.md`: Prisma schema validation passed; local migration status reported `54` migrations and schema up to date; full local migration replay applied all `54` migrations; schema diff generation passed; isolated wallet data-contract e2e passed (`1` file / `24` tests), isolated backtests data-contract e2e passed (`1` file / `15` tests), and runtime repository contract passed (`1` file / `2` tests). 2026-05-23 `DATA-MODEL-ISOLATED-DB-PROOF-2026-05-23`: Docker Desktop was started after local Postgres/Redis were unavailable, `pnpm run go-live:infra:up` brought up `soar-postgres-1` and `soar-redis-1`, `pnpm run audit:data:db-isolated` passed with Prisma schema validation, migration status, full reset/replay of `55` migrations, wallets `24/24`, backtests `15/15`, and runtime repository `2/2`; `pnpm run ops:db:backup-restore:check-local` passed with `docs/operations/v1-db-restore-check-2026-05-23T13-05-22-623Z.md`. Critical manual partial-index invariants remain identified for open position scoping and one active market group. | Production migration status and production backup/restore freshness were not rerun in this local audit. Shared-DB parallel e2e remains a documented run-policy pitfall; the isolated audit path is current and passing. | Keep DB-backed audit packs sequential or isolated; refresh production migration/backup/restore proof under protected ops context before future production release claims. | DB/Migrations + QA/Test | 2026-05-23 |
| SOAR-MOBILE-001 | Mobile / Cross-platform | Native/mobile app scope, scaffold status, and future parity gates | P2 | DEFERRED | High | 2026-05-19 `docs/operations/mobile-cross-platform-scope-audit-2026-05-19.md`: `apps/mobile` contains only `package.json`, `README.md`, and `src/.gitkeep`; mobile build/test scripts print scaffold-only deferred messages; mobile README and `docs/planning/mobile-parity-contract.md` state no production mobile runtime and no independent mobile backend contracts. | No native mobile app, Expo Router, mobile screens, app config, or real mobile tests exist by design. Responsive Web mobile evidence is tracked under `SOAR-UX-A11Y-MOBILE-001`, not this native scope row. | Before mobile activation, create module docs and replace scaffold echoes with real Expo/native build/test validation. | Product + Frontend/Mobile | 2026-05-19 |
| SOAR-I18N-001 | Web i18n / Copy | Route-reachable locale copy, namespace registry, hardcoded literal guardrails, and language policy | P1 | VERIFIED | High | 2026-05-19 `docs/operations/i18n-copy-reachability-audit-2026-05-19.md`: route-reachable i18n audit passed with findings `0`, localCopy `0`, fallbackPl `0`, and hardcoded `0`; focused Web i18n pack passed (`8` files / `26` tests), covering translations, guardrails, namespace registry, route locale smoke, provider loading, locale formatting, and optional i18n behavior. | None for current route-reachable local scope. Future route/copy changes must rerun the route-reachable i18n audit. | Keep `corepack pnpm i18n:audit:route-reachable:web` in route/copy change gates. | Frontend Builder + QA/Test | 2026-05-19 |
| SOAR-AUTH-001 | Auth | Login, logout, session validation, expired-session redirect, and protected-route cookie gate | P0 | VERIFIED | High | 2026-05-11 `V1-AUTH-SESSION-LIFECYCLE-PROOF-2026-05-11`: API Auth e2e passed (`11/11`) and proves registration/login cookie TTLs, logout cookie clearing, deleted-user session expiry, expired JWT clearing, and duplicate-token precedence. Focused Web Auth tests passed (`5` files, `17` tests) and cover AuthProvider bootstrap, logout redirect, session-expired warning cleanup, API interceptor redirect to `/auth/login?session=expired`, middleware cookie gate, login form rendering/error alert, and login hook fail-closed missing-session-refresh behavior. 2026-05-14 `docs/operations/prod-auth-session-browser-proof-2fc90a08-2026-05-14.md` found a production replay gap on deployed `2fc90a08`: browser route fail-closed checks passed, but direct reuse of the pre-logout JWT still returned `/auth/me` `200`. `V1-POST-V1-AUTH-LOGOUT-TOKEN-REUSE-HARDENING-2026-05-14` fixed logout by incrementing the matching user's `sessionVersion`; focused Auth/middleware tests passed (`21/21`), root typecheck/lint/build passed, and `docs/operations/prod-auth-session-browser-proof-84711599-2026-05-14.md` passed on deployed `84711599`, including stale-token `/auth/me` `401` after logout. | Current Auth proof is covered for the V1/post-V1 target scope. | Keep auth proof fresh after future deploys; reopen only on a new failing auth/session signal. | Backend Builder + QA/Test | 2026-05-14 |
| SOAR-PROFILE-001 | Profile | Basic profile update, timezone preference, password change, and account deletion guards | P0 | VERIFIED | High | 2026-05-11 `V1-PROFILE-LOCAL-PROOF-2026-05-11`: API Profile basic/security e2e passed (`2` files, `7` tests), proving self-delete route behavior, legacy delete rejection, valid timezone persistence, invalid timezone rejection, unauthenticated security access rejection, valid-current-password change, weak/invalid password rejection, old-login failure/new-login success, and password-confirmed account deletion. Focused Web Profile tests passed (`2` files, `5` tests), proving basic profile save success/error toasts, timezone preference payload, password mismatch short-circuit without API call, and successful password change payload/feedback. 2026-05-14 `docs/operations/prod-fixture-action-proof-457bce05-2026-05-14.md` verifies production-safe profile read, reversible update, and restore with disposable fixture boundaries and no raw secret artifacts. | Current V1 Profile proof is covered for local security/form behavior plus production-safe reversible update. Avatar upload transport is outside this V1 row. | Keep proof fresh after future deploys; reopen only on a new failing Profile signal or changed profile scope. | QA/Test + Frontend Builder | 2026-05-14 |
| SOAR-PROFILE-API-KEYS-001 | Profile API Keys | Create, test, store, rotate, revoke, delete, and audit exchange API keys | P0 | VERIFIED | High | 2026-05-11 `V1-PROFILE-API-KEYS-LOCAL-PROOF-2026-05-11`: API key e2e and probe service tests passed (`2` files, `25` tests). Evidence covers authenticated access, encrypted-only storage, masked responses, create/list/update/delete, rotate/revoke, owner-only mutation/test behavior, Binance and Gate.io provided/stored probes, no persistence of provided test secrets, audit log metadata without raw secrets, placeholder exchange probe fail-closed behavior, bad-key rejection, futures-missing rejection, and unauthorized ownership protections. Focused Web API key form/list tests passed (`2` files, `13` tests), covering connection-test-before-save, placeholder exchange save behavior, probe support status, stored-key test action, and delete risk confirmation. 2026-05-14 production fixture proof verifies masked API-key create, stored probe fail-closed behavior, audit log visibility for the probe event, and API-key cleanup without writing raw credentials to artifacts. | Current V1 Profile API Keys proof is covered for local secret/ownership contracts and production-safe masked create/probe/audit/delete. | Keep proof fresh after future deploys; do not store or print raw operator secrets in proof artifacts. | QA/Test + Frontend Builder | 2026-05-14 |
| SOAR-WALLETS-001 | Wallets | Create, edit, delete, PAPER/LIVE modes, balance preview, reset guards, and ledger readback | P0 | VERIFIED | High | 2026-05-11 `V1-WALLETS-LOCAL-PROOF-2026-05-11`: API Wallets tests passed (`4` files, `43` tests), covering CRUD normalization, ownership isolation, active-bot edit/delete guards, LIVE api-key/allocation validation, exchange mismatch rejection, Gate.io PAPER/LIVE support, preview allocation modes, unsupported placeholder preview fail-closed behavior, Gate.io stored-key preview, paper reset mode/open-position/open-order guards, reset checkpoint preservation, cashflow classification, and wallet open-PnL scoping. Web Wallets tests passed (`9` files, `22` tests), covering list/empty/create routes, inline API-key state, clone payload, create/edit form validation, mode-specific fields, LIVE preview, metadata options, Gate.io PAPER submit, paper reset success/error states, preview summary/timeline/cashflow, partial ledger, and unavailable ledger fail-closed state. 2026-05-14 `V1-POST-V1-WALLET-BOT-CLEANUP-HARDENING-2026-05-14` adds focused API proof that PAPER wallet reset fails closed while an active bot uses the wallet and succeeds after deactivation when no open wallet-scoped positions/orders remain. 2026-05-14 production fixture proof verifies disposable wallet create, update, readback, and cleanup. 2026-05-19 `docs/operations/wallets-capital-ledger-audit-2026-05-19.md` refreshed local proof: Web wallet/capital pack passed (`10` files / `23` tests) and API wallets/capital pack passed (`7` files / `84` tests). | Current V1 Wallets proof is covered for local safety/ledger/reset contracts and production-safe disposable wallet CRUD. LIVE exchange mutation remains outside this proof. | Keep proof fresh after future deploys; reopen only on a new failing Wallets signal. Track explicit wallet command audit-log events under `AUD-17`. | QA/Test + Frontend Builder | 2026-05-19 |
| SOAR-MARKETS-001 | Markets | Universe create, edit, delete, catalog import, symbol composition, capability guards, and active-bot mutation guard | P0 | VERIFIED | High | 2026-05-11 `V1-MARKETS-LOCAL-PROOF-2026-05-11`: API Markets e2e passed (`1` file, `17` tests), covering authenticated CRUD, normalization, canonical symbol composition, linked symbol-group sync, empty symbol set handling, Binance/Gate.io catalog reads, placeholder exchange persistence, explicit not-implemented catalog response, active bot update/delete blocking, inactive PAPER/LIVE bot edits, deactivation-through-bot-API edits, stale legacy link ignore, active primary bot drift blocking, and cross-user isolation. Web Markets tests passed (`5` files, `12` tests), covering form preview parity, saved volume filter, whitelist/blacklist composition, catalog-hidden whitelist selection, empty preview submit, edit-mode saved selections, placeholder exchange submit, validation helper, table clone payload, and route shells. 2026-05-14 production fixture proof verifies disposable market universe create, update, catalog read, and cleanup. 2026-05-19 `docs/operations/markets-strategies-configuration-audit-2026-05-19.md` refreshed local proof as part of `AUD-15`: Web market/strategy pack passed (`19` files / `60` tests) and API markets/strategies pack passed (`4` files / `35` tests). | Current V1 Markets proof is covered for local active-bot/ownership/capability contracts and production-safe disposable universe CRUD/catalog read. | Keep proof fresh after future deploys; reopen only on a new failing Markets signal. Track catalog source freshness telemetry as an observability follow-up. | QA/Test + Frontend Builder | 2026-05-19 |
| SOAR-STRATEGIES-001 | Strategies | Strategy create, edit, delete, clone, import/export, indicator catalog, config validation, and active-bot mutation guard | P0 | VERIFIED | High | 2026-05-11 `V1-STRATEGIES-LOCAL-PROOF-2026-05-11`: API Strategies tests passed (`3` files, `17` tests), covering authenticated CRUD, export/import package contracts, advanced TSL valid/invalid validation, invalid import rejection, cross-user get/update/delete isolation, active-bot update/delete blocking, inactive bot update allowance, DCA reachability validation, and indicator catalog service behavior. Web Strategies tests passed (`14` files, `46` tests), covering list clone naming/create payload, create/edit/detail route shells, form validation and tab flow, zero lifetime, advanced TSL and reordered DCA validation, unreachable DCA blocking, preset utilities, indicator section behavior, form mapping, numeric normalization, close validation, indicator presentation, and taxonomy. 2026-05-14 production fixture proof verifies disposable strategy create, export, update, bot link/readback, backtest run compatibility, and strategy cleanup. 2026-05-14 `POSTV1-INACTIVE-PAPER-STRATEGY-EDIT-PROOF-2026-05-14`: Web edit-page submit proof passes (`3/3`), Web strategies suite passes (`14` files, `48` tests), and API strategies e2e passes (`11/11`), covering inactive linked bot update allowance plus active-bot lock rendering/action. 2026-05-19 `docs/operations/markets-strategies-configuration-audit-2026-05-19.md` refreshed local proof as part of `AUD-15`: Web market/strategy pack passed (`19` files / `60` tests) and API markets/strategies pack passed (`4` files / `35` tests). | Current V1 Strategies proof is covered for local validation/guard contracts, user-facing Web edit submit parity, active-bot lock handling, and production-safe disposable strategy CRUD/export plus representative bot/backtest compatibility. | Keep proof fresh after future deploys; reopen only on a new failing Strategies signal. Track typed domain errors and Web i18n/dirty-state follow-ups separately. | QA/Test + Frontend Builder | 2026-05-19 |
| SOAR-MANUAL-ORDERS-001 | Manual Orders | Manual context, PAPER order placement, validation, lifecycle readback, cancel/close, selected-bot scope, and Dashboard Home action states | P0 | VERIFIED | High | 2026-05-11 `V1-MANUAL-ORDERS-LOCAL-PROOF-2026-05-11`: API Manual Orders tests passed (`7` files, `75` tests), covering manual context, PAPER market truth, open/cancel/close endpoints, order/position ownership, selected-bot write/read scope, quantity rules, position scope, LIVE risk guards, exchange-backed fail-closed cancel behavior, live fill resolution, and live cancel boundary. Web Manual Orders tests passed (`6` files, `20` tests), covering Dashboard Home submit, validation, context/venue/scope semantics, open-order source labels, open-order cancel actions, and submitted/waiting/ready/imported/position-opened/blocked action states. 2026-05-14 `docs/operations/prod-fixture-action-proof-457bce05-2026-05-14.md`: production fixture proof verified manual-order context, disposable PAPER limit order open/read/cancel, cancel fail-closed without `riskAck`, and canceled-order readback. 2026-05-19 `docs/operations/orders-manual-trading-audit-2026-05-19.md` refreshed local proof: Web manual/open-order pack passed (`8` files / `46` tests) and API orders/manual trading pack passed (`10` files / `121` tests). | Current V1 Manual Orders proof is covered for PAPER production-safe lifecycle. LIVE exchange mutation remains blocked-risk without separate explicit approval. | Keep proof fresh after future deploys; do not run LIVE manual orders without separate explicit approval. | QA/Test + Frontend Builder | 2026-05-19 |
| SOAR-POSITIONS-001 | Positions | Position list/read, close/update, takeover, exchange snapshot, import status, reconciliation, and runtime close UI states | P0 | VERIFIED | High | 2026-05-11 `V1-POSITIONS-LOCAL-PROOF-2026-05-11`: API Positions tests passed (`12` files, `90` tests), covering list/read ownership, symbol filter normalization, stale local exclusion, live status scoping, exchange snapshot selection/fail-closed behavior, Gate.io/Binance authenticated snapshots, takeover classification/rebind, bot-only management truth, orphan repair, imported lifecycle history hydration, live reconciliation ownership/ambiguity/stale-close/open-order handling, manual TP/SL safety, management-mode guards, EXCHANGE_SYNC runtime visibility, selected LIVE close, profitable PAPER manual close, carryover open orders, and pending external DCA separation. Web Positions tests passed (`3` files, `10` tests), covering runtime position PnL derivation/fallbacks, ignored/closed close-action states, pending close state, and runtime table action semantics. 2026-05-12 `V1-WEB-ORDERS-POSITIONS-DOC-TRUTH-2026-05-12` aligns Web Positions docs to canonical Dashboard Home/Bot Runtime ownership and legacy redirect behavior. 2026-05-14 `docs/operations/prod-positions-proof-2fc90a08-2026-05-14.md` passed on production: deployed build-info matched `2fc90a08`, unauthenticated Positions access failed closed, an active PAPER runtime candidate was selected, a proof PAPER position was opened, read, switched to manual management and restored, manually updated, checked through live-status/takeover-status/exchange-snapshot reads, rejected close without `riskAck`, closed with `riskAck`, read back as terminal `CLOSED`, and confirmed absent from the OPEN list. 2026-05-19 `docs/operations/positions-reconciliation-audit-2026-05-19.md` refreshed local proof: Web runtime positions pack passed (`6` files / `46` tests) and API positions/reconciliation pack passed (`11` files / `68` tests). | Current V1 Positions proof is covered for production-safe PAPER lifecycle and read/fail-closed boundaries. LIVE exchange mutation remains blocked-risk without explicit safe plan. | Keep proof fresh after future deploys; do not run LIVE position mutation without separate explicit approval. | QA/Test + Frontend Builder | 2026-05-19 |
| SOAR-ORDERS-001 | Orders | Order list/read/open/cancel/close, active-only filtering, exchange events, fills, fees, and open-order UI actions | P0 | VERIFIED | High | 2026-05-11 `V1-ORDERS-LOCAL-PROOF-2026-05-11`: API Orders tests passed (`10` files, `121` tests), covering active order filtering, PAPER/LIVE open contracts, missing price truth rejection, same-symbol add/reverse conflict handling, canonical bot context, LIVE pretrade/risk guards, exchange ids/status/fills/fees, propagated execution errors, manual context rules, close attribution, stale/open exchange-backed cancel and close fail-closed behavior, API list/get ownership, exchange event open/close/DCA/account-update lifecycle, partial/underfilled/capped fill progress, fee pending/backfill, live fill resolution, quantity rules, position scope, and live cancel boundary. Web Orders tests passed (`2` files, `3` tests), covering source labels, active open-order cancel action, and terminal order read-only behavior. 2026-05-12 `V1-WEB-ORDERS-POSITIONS-DOC-TRUTH-2026-05-12` aligns Web Orders docs to canonical Dashboard Home/Bot Runtime ownership and legacy redirect behavior. 2026-05-14 production fixture proof verified disposable PAPER limit order open/read/cancel, fail-closed cancel-without-ack behavior, and terminal canceled-order readback. 2026-05-19 `docs/operations/orders-manual-trading-audit-2026-05-19.md` refreshed local proof: Web manual/open-order pack passed (`8` files / `46` tests) and API orders/manual trading pack passed (`10` files / `121` tests), covering lifecycle, ownership, active filtering, fills, fees, exchange events, exchange-backed fail-closed cancel boundary, quantity rules, and position scope. | Current V1 Orders proof is covered for production-safe PAPER open/cancel and local fill/fee/exchange-event contracts. LIVE exchange mutation remains blocked-risk without separate explicit approval. | Keep proof fresh after future deploys; do not run LIVE order mutation without separate explicit approval. | QA/Test + Frontend Builder | 2026-05-19 |
| SOAR-BACKTESTS-001 | Backtests | Backtest run create/list/get/delete, replay worker, report, timeline, parity, and UI details flow | P0 | VERIFIED | High | 2026-05-11 `V1-BACKTESTS-LOCAL-PROOF-2026-05-11`: API Backtests tests passed (`12` files, `110` tests), covering auth/ownership, create/list/get/delete, explicit `startAt/endAt` range validation, enriched list fields, pending report contract, strategy-to-backtest-to-paper/live critical flow, paper/live parity with reconciliation, venue consistency, market-universe symbol formula, empty-symbol fail-closed behavior, 3-symbol paper alignment, failed parity diagnostics, run queue/job persistence, replay core, runtime kernel parity, contract remediation, data gateway, fill model, range service, and indicator timeline series. Web Backtests tests passed (`13` files, `32` tests), covering list/create/detail route shells, create form behavior, run details presentation, legacy list view, runs table actions, core-data hook, view-models, non-overlapping trade segments, pair metrics, and timeline indicator overlays. 2026-05-13 `V1-BOT-BACKTEST-EXCHANGE-ADAPTER-AUDIT-2026-05-13` routes backtest candle loading through the Exchange public market-data boundary with resolved exchange context, scopes candle cache uniqueness by `source`, carries exchange through run/timeline replay, updates Web timeline types, and passes focused bot/backtest tests (`56/56`) plus API/Web typechecks. 2026-05-13 `V1-RUNTIME-TICKER-AND-BACKTEST-VENUE-UI-2026-05-13` renders resolved `exchange / marketType / baseCurrency` in Backtest details and passes focused Web proof (`4/4`). 2026-05-14 `docs/operations/prod-fixture-action-proof-457bce05-2026-05-14.md`: production fixture proof verified disposable backtest run create/readback, report readback, trades readback, timeline readback with candles, and delete cleanup. 2026-05-19 `docs/operations/backtests-reports-audit-2026-05-19.md` refreshed local proof: Web backtests/reports pack passed (`15` files / `37` tests) and API backtests/reports pack passed (`13` files / `114` tests). 2026-05-23 `BACKTEST-NON-BINANCE-ORDER-BOOK-FAIL-CLOSED-2026-05-23`: non-Binance FUTURES backtests that require `ORDER_BOOK_*` history now fail closed with explicit parity diagnostics instead of simulating against a silent empty order-book series; focused backtest pack passed (`47/47`) and API typecheck passed. | Current V1 Backtests proof is covered for production-safe disposable run lifecycle and local adapter/replay contracts. Non-Binance historical order-book support remains a future adapter scope; current behavior is fail-closed when an order-book strategy would otherwise require missing history. | Keep proof fresh after future deploys; implement real historical non-Binance order-book support before claiming full order-book parity. | QA/Test + Frontend Builder + Backend Builder | 2026-05-23 |
| SOAR-REPORTS-001 | Reports | Cross-mode performance summaries, per-run report table, and dashboard reports route states | P1 | VERIFIED | High | 2026-05-11 `V1-REPORTS-LOCAL-PROOF-2026-05-11`: API Reports service tests passed (`1` file, `2` tests), covering weighted BACKTEST report aggregation and PAPER trade aggregation. Web Reports tests passed (`3` files, `5` tests), covering `/dashboard/reports` route shell, empty state, aggregated report cards/tables, and route-reachable locale copy. 2026-05-14 `docs/operations/prod-fixture-action-proof-457bce05-2026-05-14.md`: production fixture proof verified per-run report readback for a disposable production backtest run. 2026-05-19 `docs/operations/backtests-reports-audit-2026-05-19.md` refreshed local proof: Web backtests/reports pack passed (`15` files / `37` tests) and API backtests/reports pack passed (`13` files / `114` tests). 2026-05-21 gap-hunt follow-up added DB-backed `reports.e2e.test.ts`; focused Reports API proof passed (`2` files / `4` tests), covering unauthenticated rejection and authenticated user-scoped BACKTEST/PAPER/LIVE cross-mode aggregation. | Current V1 Reports proof is covered for implemented report surfaces. Export/download is not part of the current implemented Reports surface. | Keep proof fresh after future deploys; track export/download, richer filters, snapshot persistence, and i18n hardening separately if they become product scope. | QA/Test + Frontend Builder | 2026-05-21 |
| SOAR-LOGS-001 | Logs/Audit Trail | Authenticated audit log filters, pagination, action-produced events, and metadata trace UI | P1 | VERIFIED | High | 2026-05-11 `V1-LOGS-AUDIT-LOCAL-PROOF-2026-05-11`: API Logs tests passed (`2` files, `5` tests), covering unauthenticated rejection, owner-only reads, source/actor/severity filters, bot action-produced audit event visibility, and pagination defaults/bounds. Web Logs tests passed (`3` files, `4` tests), covering `/dashboard/logs` route shell, empty and loaded states, severity filter request payload, metadata trace rendering, and route-reachable locale copy. 2026-05-14 production fixture proof verifies audit logs readback with the API-key probe event visible, and production UI module audit verifies `/dashboard/logs` route render. 2026-05-19 `docs/operations/logs-audit-trail-audit-2026-05-19.md` refreshed local proof: Web logs/audit pack passed (`2` files / `3` tests) and API logs/pagination pack passed (`2` files / `5` tests). | Current V1 Logs/Audit proof is covered for local filter/pagination/rendering contracts and production-safe action-produced audit readback. | Keep proof fresh after future deploys; reopen only on a new failing Logs/Audit signal. Track total-count envelope, pagination controls, saved filters, index tuning, and command-event write coverage separately. | QA/Test + Frontend Builder | 2026-05-19 |
| SOAR-EXCHANGE-ADAPTER-001 | Exchange Adapter | Binance/Gate.io capability boundaries, public/authenticated reads, API-key probes, live adapter fail-closed behavior, and UI capability wiring | P0 | VERIFIED | High | 2026-05-11 `V1-EXCHANGE-ADAPTER-LOCAL-PROOF-2026-05-11`: fixed Gate.io public catalog symbol normalization at the exchange boundary, then API Exchange tests passed (`19` files, `93` tests), covering API-key probes, runtime exchange order guard, Binance public REST/user data stream, CCXT futures connector behavior, adapter boundary fail-closed support, adapter registry, authenticated read service/contracts, connector factory, execution capability contract, market catalog, metadata contract, public read/market data, symbol rules, live order adapter, live fee reconciliation, and position exchange snapshot normalization. Web Exchanges/Profile API-key tests passed (`5` files, `17` tests), covering capability gating, `/dashboard/exchanges` redirect, profile API-key integration, connection tests, stored-key tests, and delete risk confirmation. 2026-05-12 `V1-CAPABILITY-GATE-SCAN-CLASSIFICATION-2026-05-12` aligns V1 static scan classification with the approved exchange capability matrix so unsupported exchange fail-closed gates are not counted as unresolved findings. 2026-05-13 `V1-RUNTIME-EXCHANGE-ADAPTER-BOUNDARY-2026-05-13` removed an Engine-side Binance REST warmup shortcut; runtime candle recovery now uses the Exchange public market-data boundary and Gate.io warmup regression proves Binance REST is not called. 2026-05-13 `V1-BOT-BACKTEST-EXCHANGE-ADAPTER-AUDIT-2026-05-13` extends that boundary to backtest candle loading and bot runtime fallback candles, and scopes candle cache uniqueness by source. 2026-05-14 `docs/operations/prod-security-exchange-proof-2fc90a08-2026-05-14.md` passed on production: unsupported exchange probe fails closed, Binance futures catalog returns read-only data, Gate.io futures catalog returns canonical symbols, and protected readiness details are authenticated. 2026-05-19 `EXCHANGE-CAPABILITY-TRUTH-AUDIT-2026-05-19`: API exchange capability/registry/boundary tests passed (`4` files / `21` tests), focused exact contract tests passed (`2` files / `4` tests), orders/wallet neutral type consumer tests passed (`2` files / `41` tests), API typecheck passed, and Web exchange capability tests passed (`2` files / `3` tests), confirming exact `(exchange, marketType, operation)` capability truth and neutral exchange-owned type naming are locally green. | Current V1 local and production-safe exchange-boundary proof is covered for read-only/fail-closed scope. Real live mutation remains outside this proof and requires a separate explicit safe plan. The former architecture-level exact matrix debt is repaired; operation support now includes `marketType`. | Keep proof fresh after future deploys; do not claim live-money mutation coverage from this read-only/fail-closed proof. Keep future exchange additions on exact capability contracts and neutral exchange-owned type aliases. | QA/Test + Backend Builder + Frontend Builder | 2026-05-19 |
| SOAR-ENGINE-001 | Engine | Runtime signal merge, final-candle decision, pre-trade, execution orchestration, dedupe, PAPER/LIVE parity, and position automation | P0 | VERIFIED | High | 2026-05-19 `docs/operations/engine-trading-decision-flow-audit-2026-05-19.md`: focused engine service/unit pack passed (`15` files / `173` tests), covering deterministic signal merge, decision engine, final-candle decisions, execution orchestration, runtime dedupe, exchange order guard, pre-trade/risk, PAPER/LIVE decision equivalence, market-data gateway, runtime loop/supervisor/scan loop, and position automation. DB-backed engine e2e/smoke pack passed (`4` files / `13` tests), covering PAPER runtime order/position lifecycle, runtime orchestration smoke, pre-trade e2e, and owned imported-position execution. | Current local engine decision-flow proof is covered. Production LIVE/exchange-side mutation and assistant hot-path runtime integration remain outside this row. | Keep engine proof fresh after runtime/engine/exchange lifecycle changes; do not claim LIVE mutation coverage without an explicit safe plan. | QA/Test + Backend Builder | 2026-05-19 |
| SOAR-WORKERS-001 | Workers | Runtime loops, market stream, backtest worker, queue/process topology, readiness, and runtime freshness | P0 | VERIFIED | High | 2026-05-11 `V1-WORKERS-LOCAL-PROOF-2026-05-11`: API Workers/stream/runtime proof passed (`18` files, `88` tests), covering worker ownership/topology, market-stream source config, subscriptions, fanout retry, market-stream route contracts/e2e, Exchange polling source/fanout, Binance stream parsing, protected worker health/readiness, runtime freshness pass/fail/skip behavior, protected `/ready` diagnostics, PAPER runtime-flow worker telemetry, execution orchestrator behavior/import cleanup, execution adapter parity, backtest run job persistence, and queue tuning. 2026-05-14 `V1-PROTECTED-OPS-GATE-457BCE05-2026-05-14`: protected production runtime freshness passed for deployed `457bce05` with `runningCount=4`, worker heartbeat PASS, market data PASS, runtime signal lag PASS, and runtime sessions PASS. 2026-05-14 controlled no-order-guard LIVE proof produced `LIVEIMPORT-03` PASS for `TRXUSDT`, simultaneous PAPER+LIVE readback passed with the Binance LIVE bot and both Binance PAPER bots RUNNING, and post-cleanup readback confirmed the LIVE bot was inactive again. Full release gate for `457bce05` is `ready`. 2026-05-19 `docs/operations/workers-runtime-operations-audit-2026-05-19.md` refreshed local proof: API worker/runtime operations pack passed (`17` files / `85` tests). | Current V1 worker/runtime freshness and production non-Gate.io simultaneous runtime evidence are covered. Gate.io/second-LIVE production shape remains deferred/outside this release slice. | Keep scheduled runtime freshness and release regression evidence fresh before future deploys. | QA/Test + Backend Builder + Ops/Release | 2026-05-19 |
| SOAR-SECURITY-PRIVACY-001 | Security/Privacy | Auth, session, trusted origin, ops network, rate limits, headers, secret readiness, crypto, ownership isolation, API-key privacy, and abuse throttling | P0 | VERIFIED | High | 2026-05-11 `V1-SECURITY-PRIVACY-LOCAL-PROOF-2026-05-11`: API Security/Privacy proof passed (`23` files, `111` tests), covering security/no-store headers, alerts/metrics admin access, `/ready` secret/runtime diagnostics, API error redaction, crypto keyring and legacy decrypt behavior, rate-limit degradation, ops-network/trusted-origin/auth middleware, critical secret readiness, Auth lifecycle/JWT/cookie/error contracts, cross-module data isolation, Profile API-key ownership/secret handling/probes, Profile password/account deletion, stage abuse throttling, and authenticated position snapshots. Web Auth/Profile proof passed (`13` files, `48` tests), covering middleware, AuthContext, login/register forms/hooks/types, public auth cache contract, profile page, API-key form/list, security form, and basic profile form. This slice also tightened test env restoration for JWT rotation and API-key encryption keyring variables. 2026-05-14 `docs/operations/prod-security-exchange-proof-2fc90a08-2026-05-14.md` passed on production: security headers are present, authenticated profile reads are `no-store`, unauthenticated protected/ops/metrics routes fail closed, API-key list responses are redacted, untrusted Origin receives controlled `403`, unsupported exchange probe fails closed without stored secrets in artifacts, and authenticated readiness details require auth. 2026-05-19 `docs/operations/security-privacy-audit-2026-05-19.md` refreshed local proof: auth/middleware/header API pack passed (`9` files / `32` tests), DB-backed auth/profile/API-key/isolation/abuse pack passed (`7` files / `47` tests), focused Web auth/profile/API-key pack passed (`7` files / `28` tests), and public auth cache contract passed (`1` file / `2` tests). | Current V1 local and production-safe protected security proof is covered. External independent security review remains a separate governance follow-up and should not be represented as automated proof. | Keep proof fresh after future deploys; schedule external independent review as a governance follow-up before broader public launch. | QA/Test + Security + Backend Builder + Frontend Builder | 2026-05-19 |
| SOAR-UX-A11Y-MOBILE-001 | UX/A11y/Mobile | Public/dashboard routes, loading/empty/error/success states, keyboard/focus, responsive shell, mobile navigation, screenshot evidence, and console health | P1 | VERIFIED | High | 2026-05-12 `V1-UX-A11Y-MOBILE-LOCAL-PROOF-2026-05-11`: local authenticated route audit passed for implemented public/dashboard/legacy routes; focused Web UX/a11y/state tests passed (`25` files, `126` tests), covering shared state components, tables/tabs, form primitives, invalid-field focus, dashboard/page title a11y, responsive header/footer, Dashboard Home states, Bots, Wallets, Markets, Strategies, Backtests, Reports, Logs, Auth, Profile, and route locale smoke. Edge/CDP browser proof captured desktop Dashboard empty/onboarding, desktop Wallets empty state, mobile Dashboard, and mobile menu screenshots; mobile menu focus/click interaction was exercised; CDP console/exception check returned `0` events and no framework overlay was detected. 2026-05-14 `docs/operations/prod-ui-module-clickthrough-2fc90a08-2026-05-14.md` passed for production route/module reachability. 2026-05-14 `docs/operations/prod-ux-a11y-mobile-proof-2fc90a08-2026-05-14.md` passed on production with authenticated desktop Dashboard/Wallets/Bots/Profile screenshots, mobile Dashboard screenshot, mobile menu click, keyboard focus, no framework overlay, and no horizontal overflow. 2026-05-21 gap-hunt follow-up hardened `scripts/runProdUxA11yMobileProof.mjs` so runtime exceptions and console error/warning events become page failures rather than warnings; syntax check passed. | Current V1 UX/A11y/Mobile proof is covered for route reachability and production desktop/mobile browser rendering, but current-target authenticated production proof still requires protected inputs under `AUD-19`. Non-blocking accessibility heuristic warnings remain as polish follow-up. | Keep proof fresh after future deploys; rerun production UX proof with protected inputs and address unnamed internal-control warnings as post-V1 polish. | QA/Test + Frontend Builder | 2026-05-21 |
| SOAR-SUBSCRIPTIONS-ADMIN-001 | Subscriptions/Admin | Admin-only subscription plans, entitlement validation, user role/plan assignment, and rendered admin routes | P0 | VERIFIED | High | 2026-05-12 `V1-SUBSCRIPTIONS-ADMIN-LOCAL-PROOF-2026-05-12`: API admin/subscription tests passed (`3` files, `18` tests), covering unauthenticated rejection, non-admin rejection, plan catalog read, plan price/entitlement update validation, invalid entitlement rejection, user listing with active subscription metadata, role/plan updates, self-demotion blocking, and profile subscription readback. Web admin/profile subscription tests passed (`3` files, `7` tests), covering loaded, error, role-toggle, and plan-assignment UI states. Local admin route audit passed with a throwaway admin, and Edge/CDP screenshots rendered `/admin/subscriptions` and `/admin/users` with no framework overlay. `V1-SUBSCRIPTIONS-FOCUSED-TESTS-2026-05-12` adds focused module coverage for invalid entitlement fallback and FREE-plan LIVE trading fail-closed behavior (`2/2`). `V1-API-SUBSCRIPTIONS-DOC-TRUTH-2026-05-12` aligns the API Subscriptions doc to the current checkout/admin/profile V1 boundary. `V1-MANUAL-PAYMENT-METADATA-CLEANUP-2026-05-12` removes placeholder wording from manual checkout metadata and passes focused profile subscription checkout proof (`8/8`). 2026-05-14 production UI module audits verify authenticated admin route render for `/admin/users` and `/admin/subscriptions` with valid admin auth and no raw secret artifacts. 2026-05-19 `docs/operations/admin-subscriptions-entitlements-audit-2026-05-19.md` refreshed local proof: Web admin/subscription pack passed (`4` files / `9` tests) and API admin/subscriptions pack passed (`5` files / `25` tests). | Current V1 Subscriptions/Admin proof is covered for local entitlement/role safety and production protected admin route rendering. Non-destructive production entitlement mutation remains a future admin-ops exercise, not a V1 blocker. | Keep proof fresh after future deploys; reopen only on a new failing admin/subscription signal or changed entitlement scope. | QA/Test + Backend Builder + Frontend Builder | 2026-05-19 |
| SOAR-OPERATIONS-001 | Operations | Deployment smoke, rollback guard/proof, SLO evidence, release gates, alerts, backup/restore, and liveimport readback | P0 | PARTIAL | Medium | 2026-05-13 `V1-TARGET-RELEASE-GATE-PASS-00169D7F-2026-05-13`: final `LIVEIMPORT-03` passed for `TRXUSDT`; final preflight has no blockers; production target-only V1 release gate is `ready`; build-info freshness, post-deploy smoke, runtime freshness, and rollback guard passed against deployed `00169d7f`. 2026-05-14 `V1-PROTECTED-OPS-GATE-457BCE05-2026-05-14`: deployed `457bce05` passed protected runtime freshness, rollback proof, authenticated production UI clickthrough, controlled no-order-guard `LIVEIMPORT-03`, RC gates/sign-off/checklist, production backup/restore drill, final preflight, and full non-dry-run release gate. 2026-05-19 `docs/operations/operations-release-deployment-audit-2026-05-19.md` refreshed local proof: typecheck PASS, lint PASS, build PASS, go-live smoke PASS (`45` API tests and `18` Web tests), and local backup/restore PASS after required local Postgres startup. 2026-05-20 `docs/planning/v1-function-architecture-verification-2026-05-20-task.md` refreshed local validation: guardrails PASS, guardrails regression tests PASS, docs parity PASS, endpoint parity PASS, reusable audit manifest verify PASS, lint PASS, typecheck PASS, build PASS, Web tests PASS (`149` files / `514` tests), full API Vitest PASS in a controlled one-worker local-infra window, i18n route audit PASS, `audit:data:db-isolated` PASS after sequential rerun, and go-live smoke PASS (`45` API / `18` Web). Production public deploy freshness is verified for `dd1a1faf`, but final protected `AUD-19` evidence remains blocked on missing protected inputs. | Current local release-safety proof is fresh, and production public deploy freshness is verified for `dd1a1faf`. Full protected production release gate remains historical for deployed `457bce05`; the current target still needs protected auth/context, Gate2 SLO evidence, named Gate4 sign-off/owner fields, runtime, rollback, backup/restore, liveimport, and production UI evidence before a full production readiness claim. | Provide approved protected inputs and execute the current operator unblock packet for the current target; do not claim full production readiness from public smoke alone. | Ops/Release + QA/Test | 2026-05-20 |
| SOAR-DASHBOARD-001 | Dashboard Home | Selected-bot runtime truth, wallet KPIs, runtime positions/orders/trades tables | P0 | VERIFIED | High | Local proof covers loading, retryable error, selected-bot switching, wallet KPI recalculation, open-orders rows, trade-history rows, stale-row suppression, desktop/mobile empty/onboarding state, active PAPER runtime rows, wallet baseline/free funds, and Orders tab interaction. 2026-05-14 production evidence for deployed `457bce05` adds authenticated `/dashboard` route reachability plus simultaneous runtime readback where both Binance PAPER bots expose fresh `RUNNING` sessions, symbol stats, positions, trades, and aggregate data, while the controlled Binance LIVE observation window also proved runtime readback without order placement. Evidence: `docs/planning/v1-production-dashboard-runtime-action-proof-457bce05-2026-05-14-task.md`, `docs/operations/prod-ui-module-clickthrough-457bce05-2026-05-14.md`, `docs/operations/prod-live-paper-simultaneous-runtime-readback-457bce05-2026-05-14.md`, and `docs/operations/prod-live-paper-post-cleanup-readback-457bce05-2026-05-14.md`. | Current Dashboard Home proof is covered for the approved non-Gate.io V1/post-V1 target scope. Gate.io/second-LIVE production shape remains separate. | Keep proof fresh after future deploys; reopen only on a new Dashboard runtime failing signal or broader Gate.io/2x LIVE scope decision. | QA/Test + Frontend Builder | 2026-05-14 |
| SOAR-BOT-RUNTIME-001 | Bot Runtime | Canonical bot monitoring route, runtime sessions, symbol stats, open positions, open orders, trades, and legacy runtime redirects | P0 | VERIFIED | High | Local proof covers running/completed PAPER session list/detail, aggregate, positions, symbol stats, trades, completed-session filter, desktop/tablet/mobile rendering, safe session view switch, legacy redirects, and real `RuntimeSignalLoop` telemetry readback through authenticated APIs. 2026-05-14 production evidence for deployed `457bce05` adds authenticated Bot Runtime route/redirect reachability plus simultaneous runtime readback: both active Binance PAPER bots expose fresh `RUNNING` sessions, symbol stats, positions, trades, and aggregate data; controlled no-order-guard Binance LIVE proof exposes a `RUNNING` LIVE session and `LIVEIMPORT-03` readback for `TRXUSDT`; post-cleanup readback confirms the LIVE bot is inactive again. Evidence: `docs/planning/v1-production-dashboard-runtime-action-proof-457bce05-2026-05-14-task.md`, `docs/operations/prod-live-paper-simultaneous-runtime-readback-457bce05-2026-05-14.md`, `docs/operations/liveimport-03-prod-readback-live-paper-457bce05-2026-05-14.json`, and `docs/operations/prod-live-paper-post-cleanup-readback-457bce05-2026-05-14.md`. 2026-05-19 `docs/operations/bots-runtime-truth-audit-2026-05-19.md` refreshed local runtime proof: Web bot/dashboard runtime pack passed (`8` files / `61` tests) and API bot/runtime pack passed (`10` files / `88` tests), covering runtime scope, monitoring aggregate, history parity, takeover visibility, LIVE/PAPER isolation, and delete cleanup. | Current Bot Runtime proof is covered for the approved non-Gate.io V1/post-V1 target scope. Gate.io/second-LIVE production shape remains separate. | Keep proof fresh after future deploys; reopen only on a new runtime failing signal or broader Gate.io/2x LIVE scope decision. | QA/Test + Frontend Builder | 2026-05-19 |
| SOAR-BOTS-001 | Bots | Create, edit, delete, start/stop, and monitor bot through real UI/API path | P0 | VERIFIED | High | 2026-05-11 `BOT-DELETE-ACTIVE-PAPER-2026-05-11`: active PAPER bot delete no longer routes through LIVE confirmation; Web Vitest passed (`147` files, `501` tests), API Bots e2e passed (`27/27`), Web typecheck passed, guardrails passed, diff check passed with line-ending warnings only. 2026-05-14 `docs/operations/prod-fixture-action-proof-457bce05-2026-05-14.md`: deployed `457bce05` production fixture proof verified disposable inactive PAPER bot create/read/update, runtime graph read, market-group and strategy-link readbacks, assistant config update, and bot delete cleanup `PASS`; no LIVE bot activation, order, position, or exchange-side mutation was performed. 2026-05-14 `V1-POST-V1-WALLET-BOT-CLEANUP-HARDENING-2026-05-14` adds local API proof that inactive bot deletion removes bot-owned positions, orders, trades, fills, signals, logs, runtime dedupe rows, runtime sessions, runtime events, runtime stats, market-group links, strategy links, assistant config, and subagent config while preserving the linked strategy. 2026-05-19 `docs/operations/bots-runtime-truth-audit-2026-05-19.md` refreshed local bot proof: Web bot/dashboard runtime pack passed (`8` files / `61` tests) and API bot/runtime pack passed (`10` files / `88` tests), covering CRUD, ownership, wallet-first writes, duplicate guards, entitlements, runtime graph/scope, LIVE/PAPER isolation, and delete cleanup. | Current V1 Bots CRUD/config proof is covered for the disposable production fixture boundary. LIVE activation and live exchange mutation remain outside this row and require separate approval. | Keep Bots proof fresh after future deploys; do not run LIVE bot actions without separate explicit approval. | QA/Test + Builder | 2026-05-19 |
| SOAR-ASSISTANT-AI-001 | Assistant/AI | Assistant config, dry-run orchestration, runtime integration truth, and AI red-team readiness | P1 | PARTIAL | Medium | 2026-05-19 `AI-ASSISTANT-RUNTIME-TRUTH-AUDIT-2026-05-19`: deterministic assistant foundation is locally proven. Backend orchestrator tests passed (`2` files / `6` tests), focused Web assistant route tests passed (`2` files / `3` tests), and bot assistant config/dry-run e2e passed after local Postgres/Redis startup (`1` file / `3` tests). Evidence covers config/dry-run, subagent slots, deterministic merge, fail-closed planner failure, timeout/error trace status, sanitization, policy gate, and circuit breaker. 2026-05-23 foundation protocol harness maps all `AI_TESTING_PROTOCOL.md` risk areas for the accepted foundation/dry-run scope and executes deterministic foundation-applicable scenarios. | No audited BACKTEST/PAPER/LIVE hot-path runtime call site to `orchestrateAssistantDecision`; no full model-backed multi-turn runtime AI red-team proof. This is accepted future/gated scope under `DEC-AUD-002`, not a current architecture-code mismatch. | Keep foundation/dry-run scope verified. Plan hot-path assistant orchestration only as a separate future AI/security slice with persisted traces, fail-closed integration, model/runtime assumptions, and full AI red-team evidence. | QA/Test + Security + Backend Builder | 2026-05-23 |
| SOAR-REL-001 | Release confidence | Release-critical module inventory and proof map | P0 | VERIFIED | High | 2026-05-14 final evidence pack: `docs/operations/v1-master-state-ledger-2026-05-14-final.md`, `docs/operations/v1-project-index-2026-05-14-final.md`, `docs/operations/v1-completion-scorecard-2026-05-14-final.md`, `docs/operations/v1-final-evidence-inventory-2026-05-14.md`, and `docs/operations/v1-100-percent-truth-audit-2026-05-14.md` define the current module-by-module proof map, score, evidence inventory, and scoped 100 percent verdict. 2026-05-14 ledger reconciliation promotes the stale Profile, Profile API Keys, Wallets, Markets, Strategies, Logs/Audit Trail, and Subscriptions/Admin rows to `VERIFIED` using already-accepted production-safe proof artifacts instead of collapsing unproven LIVE mutation scope. | None for the release-confidence inventory row. LIVE order/cancel/close, unsafe LIVE position mutation, existing-data mutation, and broader Gate.io/second-LIVE production shape remain outside the verified V1 scope unless separately approved. | Keep proof-map artifacts fresh after future scope changes or deploys; use new failing signals rather than stale proof gaps to reopen rows. | Planning | 2026-05-14 |

## Current Release Evidence Notes

- 2026-05-23
  `GATEIO-LIVE-BOT-CONTEXT-REPAIR-2026-05-23` applies to
  `SOAR-PROFILE-API-KEYS-001`, `SOAR-WALLETS-001`, `SOAR-MARKETS-001`,
  `SOAR-STRATEGIES-001`, and `SOAR-BOTS-001`: production readback confirmed
  wallet `Gate.io` was correctly `LIVE / GATEIO / FUTURES / USDT`, while
  market universe `Main gateio` had been saved as `BINANCE / FUTURES / USDT`,
  causing the wallet-market context mismatch. Gate.io stored API-key read-only
  probe passed for futures, Gate.io futures catalog returned data, `Main
  gateio` was updated to `GATEIO / FUTURES / USDT`, and inactive bot
  `Gate.io RSI 20/80` was created with the Gate.io wallet and `RSI 20 / 80`
  strategy. This verifies inactive configuration only; LIVE activation and any
  exchange-side mutation remain separately approval-gated. Evidence:
  `docs/planning/gateio-live-bot-context-repair-2026-05-23-task.md`.

- 2026-05-23
  `RUNTIME-EXECUTION-DEDUPE-OBSERVABILITY-2026-05-23` applies to
  `SOAR-BOT-RUNTIME-001`, `SOAR-ENGINE-001`, and `SOAR-OPERATIONS-001`:
  runtime execution dedupe acquire paths now emit architecture-required
  miss/hit/inflight/retry observability through the existing metrics store and
  `/metrics` payload, including per-command buckets and retry error-class
  buckets. Evidence:
  `docs/planning/runtime-execution-dedupe-observability-2026-05-23-task.md`;
  runtime dedupe service tests passed (`13/13`), metrics route tests passed
  (`5/5`) after repo Postgres/Redis startup, and API typecheck passed.

- 2026-05-22
  `ARCH-RUNTIME-P1-002-004-MONEY-PATH-2026-05-22` applies to
  `SOAR-BOT-RUNTIME-001`, `SOAR-ORDERS-001`, and `SOAR-POSITIONS-001`:
  repaired remaining local money-path architecture drift from the runtime
  audit. `ACCOUNT_UPDATE` position scope now requires source API-key identity
  and matches only wallet/bot positions owned by that key; missing source
  identity fails closed. Runtime open, runtime close, and runtime DCA live
  order submission now propagate deterministic `soar_...` client order ids
  derived from runtime dedupe keys through the order service and exchange
  boundary. Zero-quantity account updates no longer synthesize a close without
  fill/trade/PnL truth; they mark the position `DRIFT`/`RECOVERING` until
  authoritative close fill evidence arrives. Evidence: exchange-event tests
  passed (`21/21`), exchange boundary/orders tests passed (`51/51`), runtime
  orchestrator/automation tests passed (`55/55`), and API typecheck passed.

- 2026-05-22
  `ARCH-RUNTIME-P1-010-011-WORKERS-QUEUE-HEARTBEAT-2026-05-22` applies to
  `SOAR-BACKTESTS-001`, `SOAR-WORKERS-001`, and `SOAR-OPERATIONS-001`:
  repaired the local OPS/WORKERS follow-up for durable backtest queue
  ownership and cross-container worker heartbeat truth. Split backtest
  ownership now enqueues run ids to Redis and the `workers-backtest` entrypoint
  consumes the existing backtest job from that queue; local inline mode remains
  the explicit fallback. The backtest job now skips terminal runs and clears
  stale run-owned trades before retrying active runs. Worker bootstrap writes per-family Redis
  heartbeats, and `/workers/ready` requires fresh heartbeats for required
  split-worker families. Evidence:
  `docs/planning/arch-runtime-p1-010-011-workers-queue-heartbeat-2026-05-22-task.md`;
  focused queue/job/heartbeat/ownership tests passed (`17/17`), workers
  health/readiness route tests passed (`7/7`), API typecheck
  passed, and `git diff --check` passed with line-ending warnings only.
  Production protected `/workers/ready` readback is still required after
  deploy.

- 2026-05-22
  `ARCH-CODE-RUNTIME-AUDIT-2026-05-22` applies to
  `SOAR-BOT-RUNTIME-001`, `SOAR-ORDERS-001`, `SOAR-BACKTESTS-001`,
  `SOAR-REPORTS-001`, and `SOAR-OPERATIONS-001`: architecture/code audit
  found and repaired local drift in runtime execution dedupe, LIVE fill
  authority, imported LIVE dynamic-stop display, backtest closed-candle
  windowing, settled-only report aggregation, deploy smoke worker readiness,
  VPS split-worker compose defaults, API DB readiness, rollback
  worker-readiness proof, account-update source scoping, deterministic runtime
  live-order client ids, zero-quantity account-update recovery behavior,
  backtest `TSL` event naming, durable Redis backtest queue ownership, and
  Redis-backed worker readiness heartbeats. Validation passed: focused API pack
  `88/88`, readiness/backtest/report pack `20/20`, backtest/worker follow-up
  packs, money-path follow-up packs, API/Web typecheck, script syntax checks,
  and VPS compose config with required env. Remaining open finding is tracked
  in `docs/planning/architecture-code-runtime-audit-2026-05-22-task.md`: full
  backtest multi-strategy merge parity, currently fail-fast mitigated.

- 2026-05-22
  `LIVE-DCA-SUBMITTED-FILL-GATE-2026-05-22` applies to
  `SOAR-BOT-RUNTIME-001`, `SOAR-ORDERS-001`, and `SOAR-POSITIONS-001`:
  emergency runtime safety fix after operator feedback that LIVE DCA could be
  treated as progressed before exchange fill confirmation, allowing stop/TSL
  logic to continue from false DCA state. Runtime automation now returns
  fail-closed when DCA order placement is only submitted (`executed: false`);
  DCA progress, `DCA_EXECUTED` telemetry, symbol-stat DCA count, and same-tick
  close protection wait for confirmed fill handling. Evidence:
  `docs/planning/live-dca-submitted-fill-gate-2026-05-22-task.md`; focused
  runtime automation tests passed (`37/37`) and API typecheck passed.

- 2026-05-21
  `V1-PROTECTED-APP-PROOF-ATTEMPT-DD1A1FAF-2026-05-21` applies to
  `SOAR-OPERATIONS-001`: operator packet validation and build-info readback
  passed for deployed `dd1a1faf79f8ac3581ca0a8c983481a3e30327ac`; protected
  production UI clickthrough passed; rollback proof passed with
  `shouldRollback=false`, runtime freshness `PASS`, and no alerts; Gate 4
  sign-off is approved. Current operations confidence remains `PARTIAL`
  because `LIVEIMPORT-03` authenticates but fails closed with no open runtime
  payload: the RUNNING Binance FUTURES LIVE session has closed historical
  `BNBUSDT` / `XRPUSDT` rows, `openCount=0`, and `openOrdersCount=0`. The
  controlled proof runner refuses to take over the already-active LIVE bot.
  Fresh production SLO is `FAIL`: `/workers/ready` availability is `0%`, API
  5xx ratio is `16.6667%`, and the artifact reports deployed `inline` worker
  topology (`DEPLOYED_INLINE_MODE`). Production restore still needs
  VPS/Coolify Docker access. Evidence:
  `docs/planning/v1-protected-app-proof-attempt-dd1a1faf-2026-05-21-task.md`,
  `docs/operations/prod-ui-module-clickthrough-dd1a1faf-2026-05-21.md`,
  `docs/operations/v1-rollback-proof-prod-2026-05-21T00-00-00-000Z.md`,
  `docs/operations/liveimport-03-prod-readback-dd1a1faf-2026-05-21.json`,
  `docs/operations/v1-slo-observation-2026-05-21T15-28-20-108Z.md`, and
  `docs/operations/v1-rc-signoff-record.md`.

- 2026-05-21
  `SUPPLY-CHAIN-SAST-OPS-AUDIT-2026-05-21` applies to
  `SOAR-OPERATIONS-001` and `SOAR-SECURITY-PRIVACY-001`: completed the
  requested local defensive audit for dependency/supply-chain hygiene,
  Docker/compose, env templates, secrets handling, logging artifacts,
  CI/scripts, SSRF/egress surfaces, file upload/static assets, and production
  readiness gates. Confirmed and fixed secret-bearing CLI argv handling in
  protected ops scripts, added root env-file ignore policy, and added
  repository guardrails for tracked runtime env files plus secret-bearing
  ops-script parsers. Evidence:
  `docs/planning/supply-chain-sast-ops-audit-2026-05-21-task.md`; guardrail
  tests `9/9`, repository guardrails, production dependency audit, compose
  config checks, API/Web typecheck, script syntax, manual fail-closed checks,
  and diff check passed. Residual external/protected gates remain separate:
  VPS/cloud egress review, protected `AUD-19`, and operator handling of local
  untracked env files.
- 2026-05-21
  `FRONTEND-SECURITY-UX-OWASP-SWEEP-2026-05-21` applies to
  `SOAR-SECURITY-PRIVACY-001`, `SOAR-PROFILE-API-KEYS-001`,
  `SOAR-AUTH-001`, and `SOAR-MANUAL-ORDERS-001`: completed a focused Web
  OWASP Top 10 / cheat-sheet sweep for auth bootstrap, protected data flashes,
  admin gating, CSP/security headers, secret/error exposure, browser storage,
  CSRF-sensitive UI call shape, clickjacking/HSTS assumptions, and money-action
  confirmations. Confirmed and fixed frontend defects in profile API-key
  response handling and profile/security production error display. Evidence:
  `docs/planning/frontend-security-ux-owasp-sweep-2026-05-21-task.md`;
  focused Web profile/error tests passed (`4` files / `28` tests), broader Web
  auth/admin/header/money pack passed (`7` files / `23` tests), Web typecheck
  passed, and `git diff --check` passed with line-ending warnings only.
  Residual external/protected gates remain separate: production header
  readback, protected `AUD-19`, external pentest/VPS review, and backend-owned
  CSRF/trusted-origin verification.
- 2026-05-21
  `SECURITY-RED-TEAM-HARDENING-2026-05-21` applies to
  `SOAR-AUTH-001`, `SOAR-PROFILE-API-KEYS-001`, `SOAR-MANUAL-ORDERS-001`,
  `SOAR-ORDERS-001`, `SOAR-POSITIONS-001`, `SOAR-EXCHANGE-ADAPTER-001`,
  `SOAR-SECURITY-PRIVACY-001`, and `SOAR-OPERATIONS-001`: completed
  second-round security agents found and the coordinator repaired local P1/P2
  issues in stale admin-token authorization, auth IP limiting, production
  ops-network defaults, weak secret readiness/deploy defaults, API-key audit
  events, sensitive logging redaction, runtime close `riskAck`, execution-time
  LIVE entitlements, Gate.io swap derivative handling, unknown LIVE status
  mapping, min-notional price truth, production CSP, production error
  redaction, and dependency audit hygiene. Evidence:
  `docs/planning/security-red-team-hardening-2026-05-21-task.md`. This note is
  local hardening evidence only; protected `AUD-19`, external penetration/VPS
  configuration review, and explicit LIVE exchange-side mutation proof remain
  separate gates.
  Continuation adds verified residual hardening: frontend auth-confirm/admin
  role/API-key response fixes, DB-backed LIVE entitlement downgrade proof,
  stage rehearsal secret argv/artifact protection, hardened VPS env template,
  non-root runtime Dockerfiles with guardrail coverage, production HSTS, and
  localhost-only local datastore port binding.
- 2026-05-21
  `BACKEND-PERMISSION-ISOLATION-REVIEW-2026-05-21` applies to
  `SOAR-AUTH-001`, `SOAR-PROFILE-API-KEYS-001`,
  `SOAR-SECURITY-PRIVACY-001`, `SOAR-SUBSCRIPTIONS-ADMIN-001`, and
  `SOAR-WALLETS-001`: defensive backend review confirmed server-side auth,
  admin guard, API-key ownership, representative user-scope, and denied-access
  proof remained locally green, and repaired a confirmed API-key create DTO
  allowlist defect by passing parsed request payloads and explicit Prisma
  create fields. Evidence:
  `docs/planning/backend-permission-isolation-review-2026-05-21-task.md`.
  Validation passed: API-key e2e `18/18`, auth/admin/API-key pack `34/34`,
  isolation/reports/wallets pack `28/28`, and API typecheck. Protected
  production `AUD-19`, external penetration/VPS configuration review, and
  explicit LIVE exchange-side mutation proof remain separate gates.
- 2026-05-19
  `AUDIT-HANDOFF-SELF-SOURCE-CHECK-2026-05-19` applies to
  `SOAR-OPERATIONS-001`: `audit:handoff:check` now requires the handoff
  Markdown and JSON self-source paths in the handoff source chain. Evidence:
  `docs/planning/audit-handoff-self-source-check-2026-05-19-task.md`.
- 2026-05-19
  `AUDIT-MANIFEST-SOURCE-CHAIN-KEY-CHECK-2026-05-19` applies to
  `SOAR-OPERATIONS-001`: `audit:manifest:check` now requires the full reusable
  audit manifest source-chain key set before manifest validation can pass.
  Evidence:
  `docs/planning/audit-manifest-source-chain-key-check-2026-05-19-task.md`.
- 2026-05-19
  `AUDIT-MANIFEST-SOURCE-CHAIN-PATH-CHECK-2026-05-19` applies to
  `SOAR-OPERATIONS-001`: `audit:manifest:check` now requires required
  source-chain values to be repository paths. Evidence:
  `docs/planning/audit-manifest-source-chain-path-check-2026-05-19-task.md`.
- 2026-05-19
  `AUDIT-MANIFEST-SOURCE-CHAIN-EXACT-KEY-CHECK-2026-05-19` applies to
  `SOAR-OPERATIONS-001`: `audit:manifest:check` now fails when unexpected
  source-chain keys are present. Evidence:
  `docs/planning/audit-manifest-source-chain-exact-key-check-2026-05-19-task.md`.
- 2026-05-19
  `AUDIT-MANIFEST-SAFETY-BOUNDARY-CHECK-2026-05-19` applies to
  `SOAR-OPERATIONS-001`: `audit:manifest:check` now fails when manifest
  safety-boundary booleans are missing or unsafe. Evidence:
  `docs/planning/audit-manifest-safety-boundary-check-2026-05-19-task.md`.
- 2026-05-19
  `AUDIT-RERUN-PLAYBOOK-BASELINE-PATH-VALUE-CHECK-2026-05-19` applies to
  `SOAR-OPERATIONS-001`: `audit:rerun-playbook:check` now fails when required
  baseline values are empty or not repository paths. Evidence:
  `docs/planning/audit-rerun-playbook-baseline-path-value-check-2026-05-19-task.md`.
- 2026-05-19
  `AUDIT-HANDOFF-TOOLING-INDEX-SOURCE-CHECK-2026-05-19` applies to
  `SOAR-OPERATIONS-001`: `audit:handoff:check` now requires reusable
  tooling-index Markdown and JSON paths in the handoff source chain. Evidence:
  `docs/planning/audit-handoff-tooling-index-source-check-2026-05-19-task.md`.
- 2026-05-19
  `AUDIT-HANDOFF-CLEANUP-VALIDATION-COMMAND-2026-05-19` applies to
  `SOAR-OPERATIONS-001`: `audit:handoff:check` now fails if handoff
  `latestValidation` omits cleanup evidence for headless browser processes,
  local DB/Redis listeners, or Docker compose services. Evidence:
  `docs/planning/audit-handoff-cleanup-validation-command-2026-05-19-task.md`.
- 2026-05-14
  `V1-PRODUCTION-FIXTURE-ACTION-PROOF-PLAN-2026-05-14` records the current
  literal-100% blocker for remaining `PASS_LOCAL` rows: production-safe
  action proofs need explicit owner approval before creating, editing, or
  deleting disposable production fixtures. The safe boundary is published at
  `docs/operations/v1-production-fixture-action-proof-plan-2026-05-14.md`.
  No module should be promoted from `PARTIAL`/`PASS_LOCAL` to `VERIFIED`/`PASS`
  from this plan alone; it only defines the approved path needed before the
  next proof run.
- 2026-05-14
  `V1-BACK-WEB-FULL-LOCAL-BASELINE-457BCE05-2026-05-14` applies broadly to the
  API/Web release surface: repository guardrails passed, API/Web typecheck
  passed, full Web Vitest passed (`149` files / `512` tests), full API Vitest
  passed, lint passed, production build passed, and `git diff --check` passed
  with line-ending warnings only. This strengthens local confidence for the
  implemented backend and web layers, but rows remain `PARTIAL` where their
  missing proof is explicitly production-safe clickthrough, external review, or
  protected operator evidence rather than local code coverage.
- 2026-05-14
  `V1-PROTECTED-OPS-GATE-457BCE05-2026-05-14` applies to
  `SOAR-OPERATIONS-001` and `SOAR-WORKERS-001`: production build-info is fresh
  for `457bce05338310c198c03a973395a9176f298dc1`, public API/Web smoke passes,
  protected runtime freshness passes, rollback proof passes with
  `shouldRollback=false`, authenticated production UI clickthrough passes, and
  controlled no-order-guard `LIVEIMPORT-03` readback passes for `TRXUSDT` with
  post-check deactivation. Activation audit/plan, RC external gates, RC
  sign-off, RC checklist, rollback proof, UI clickthrough, public smoke,
  protected smoke, runtime freshness, and rollback guard are fresh/pass for
  2026-05-14. Rows remain `PARTIAL`/production-blocked until the current-day
  production restore drill passes through an approved operator-safe path and
  the final target gate returns `ready`.
- 2026-05-14
  `V1-CURRENT-MAIN-PROMOTION-DEPLOY-LAG-457BCE05-2026-05-14` applies to
  `SOAR-OPERATIONS-001`: current candidate
  `457bce05338310c198c03a973395a9176f298dc1` is pushed to
  `origin/codex/v1-proof-and-ops-evidence` and `origin/main`. Production
  build-info now reports `457bce05`, and public production smoke passed for
  that deployed surface. The row remains `PARTIAL` for current `main` until
  protected runtime freshness, alerts/rollback guard, and the target release
  gate are rerun with approved admin/ops access.
- 2026-05-13
  `V1-RUNTIME-NON-BINANCE-DERIVATIVES-ADAPTER-2026-05-13` applies to
  `SOAR-BOT-RUNTIME-001` and `SOAR-EXCHANGE-ADAPTER-001`: runtime symbol-stats
  fallback derivatives and the live signal market-data gateway now use Exchange
  public adapter methods for non-Binance funding-rate history, open-interest
  history, and current order-book snapshots where supported. Binance REST
  remains scoped to Binance, unsupported adapter capabilities fail closed, and
  derivative fallback caches are exchange-scoped. Evidence: focused runtime
  tests passed (`26/26`), API typecheck passed, and repository guardrails
  passed. Rows remain `PARTIAL` because production-safe multi-bot/runtime
  clickthrough and real target-environment operation proof remain separate
  lanes.
- 2026-05-13
  `V1-NON-BINANCE-BACKTEST-DERIVATIVES-ADAPTER-2026-05-13` applies to
  `SOAR-BACKTESTS-001` and `SOAR-EXCHANGE-ADAPTER-001`: non-Binance futures
  backtest supplemental funding-rate and open-interest history now flows
  through the Exchange public market-data adapter where CCXT exposes those
  public methods. The slice also adds an order-book snapshot boundary but keeps
  non-Binance backtest order-book history empty because a current snapshot is
  not valid historical input. CCXT public market-data normalization and client
  shape types were extracted out of the production connector to satisfy
  monolith guardrails. Evidence: focused backtest/exchange tests passed
  (`26/26`), API typecheck passed, and repository guardrails passed. Rows
  remain `PARTIAL` because runtime non-Binance derivative fallbacks and
  production-safe multi-bot/backtest clickthrough remain separate lanes.
- 2026-05-13
  `V1-RUNTIME-TICKER-AND-BACKTEST-VENUE-UI-2026-05-13` applies to
  `SOAR-BOT-RUNTIME-001`, `SOAR-BACKTESTS-001`, and
  `SOAR-EXCHANGE-ADAPTER-001`: generic runtime fallback ticker prices now use
  the Exchange public market-data boundary for Binance and non-Binance
  exchanges, runtime position readback requests fallback prices in the actual
  bot exchange context, and Backtest details renders resolved
  `exchange / marketType / baseCurrency`. Evidence: focused runtime tests
  passed (`36/36`), focused Backtest details Web test passed (`4/4`), and
  API/Web typechecks passed. Rows remain `PARTIAL` pending production-safe
  multi-bot/runtime/backtest clickthrough and generic non-Binance derivatives
  supplemental support.
- 2026-05-13
  `V1-BOT-BACKTEST-EXCHANGE-ADAPTER-AUDIT-2026-05-13` applies to
  `SOAR-BACKTESTS-001`, `SOAR-BOT-RUNTIME-001`, and
  `SOAR-EXCHANGE-ADAPTER-001`: backtest candle loading and bot runtime
  fallback candles now route through the Exchange public market-data boundary
  with exact exchange context instead of direct Binance candle REST. Backtest
  run/timeline replay carries resolved exchange context, `MarketCandleCache`
  uniqueness includes `source`, and Web backtest timeline typing includes
  backend exchange/order-book/parity fields. Evidence: focused bot/backtest
  tests passed (`56/56`), API typecheck passed, and Web typecheck passed.
  Rows remain `PARTIAL` because production-safe multi-bot/runtime/backtest
  clickthrough and generic non-Binance derivatives supplemental support remain
  separate lanes.
- 2026-05-13
  `V1-RUNTIME-EXCHANGE-ADAPTER-BOUNDARY-2026-05-13` applies to
  `SOAR-EXCHANGE-ADAPTER-001` and `SOAR-BOT-RUNTIME-001`: runtime candle
  warmup and indicator recovery now use the exchange-owned public market-data
  boundary instead of direct Binance REST from Engine. Runtime candle and
  derivative stores are exchange-scoped, strategy evaluation receives exchange
  context, and Binance-only derivative fallbacks fail closed for Gate.io.
  Evidence: focused runtime/decision-loop tests (`55/55`), exchange/stream/
  fallback/read-model tests (`12/12`), API typecheck, and guardrails passed.
  Rows remain `PARTIAL` because production-safe multi-bot/live runtime proof
  remains a separate lane.
- 2026-05-13
  `V1-NON-GATEIO-RUNTIME-AND-APP-PROOF-00169D7F-2026-05-13` applies to
  `SOAR-BOTS-001`, `SOAR-BOT-RUNTIME-001`, `SOAR-DASHBOARD-001`,
  `SOAR-EXCHANGE-ADAPTER-001`, and `SOAR-OPERATIONS-001`: Gate.io is
  deferred by user decision for this slice. Authenticated read-only production
  readback verifies both active Binance PAPER bots have fresh RUNNING runtime
  monitoring data through session detail, symbol stats, positions, trades, and
  aggregate monitoring endpoints. The Binance LIVE bot exists and has
  live opt-in enabled, but is currently inactive and has no RUNNING session.
  Local gates passed: focused Web runtime tests (`41/41`), focused API
  runtime/monitoring tests (`47/47` and `29/29`), typecheck, build,
  guardrails, and `test:go-live:smoke`. Rows remain `PARTIAL` where they
  require production action-level UI proof or current LIVE runtime activation
  evidence.
- 2026-05-13
  `V1-PRODUCTION-RUNTIME-INVENTORY-00169D7F-2026-05-13` applies to
  `SOAR-BOTS-001` and `SOAR-BOT-RUNTIME-001`: authenticated read-only
  production inventory found 2 active PAPER bots and 1 inactive LIVE Binance
  futures bot. Latest PAPER sessions are RUNNING with fresh heartbeats; latest
  LIVE sessions are CANCELED. Production lacks the requested second active LIVE
  bot and has no visible LIVE Gate.io bot, so the local 2x PAPER + Binance LIVE
  + Gate.io LIVE proof shape cannot yet be claimed in production. Rows remain
  `PARTIAL`.
- 2026-05-13
  `V1-PRODUCTION-UI-CLICKTHROUGH-REFRESH-00169D7F-2026-05-13` applies to
  `SOAR-BOTS-001`, `SOAR-UX-A11Y-MOBILE-001`, and
  `SOAR-SUBSCRIPTIONS-ADMIN-001`: authenticated production route/module
  reachability passed for deployed `00169d7f...` with public `PASS:4`,
  dashboard `PASS:18`, admin `PASS:3`, legacy `PASS:3`, and no blockers.
  Artifact scan found no raw credential/token/cookie/private-header values.
  Rows remain `PARTIAL` because this is GET-only protected route evidence; it
  does not prove every create/edit/delete/action journey or responsive browser
  rendering.
- 2026-05-13
  `V1-WEB-BACKEND-PARITY-MONITORING-PROPS-2026-05-13` applies to
  `SOAR-BOT-RUNTIME-001`: Bots Monitoring props now reuse shared runtime enum
  aliases for fee source and capital source, plus `BotRuntimeTrade["origin"]`
  for operational trade origin, removing a local prop-contract drift point.
  Evidence: focused `BotsManagement` test passed (`14/14`), Web typecheck
  passed, local duplicate-union scan returned no matches, and repository
  guardrails passed. The row remains `PARTIAL` pending production-safe
  clickthrough and broader V1 runtime proof.
- 2026-05-13
  `V1-WEB-BACKEND-PARITY-RUNTIME-ENUMS-2026-05-13` applies to
  `SOAR-DASHBOARD-001` and `SOAR-BOT-RUNTIME-001`: Web runtime enum typing now
  reflects backend `FeeSource`, `TradingRecordOrigin`,
  `PositionManagementMode`, and runtime capital-source domains for runtime
  trade/order/position payloads. Stale Web fixtures using values the backend
  cannot emit were normalized. Evidence: focused Web runtime tests passed (`5`
  files, `47` tests), Web typecheck passed, stale-value scan returned no
  matches, and repository guardrails passed. Rows remain `PARTIAL` because
  production-safe clickthrough and the broader V1 route matrix are still
  separate lanes.
- 2026-05-13
  `V1-WEB-BACKEND-PARITY-RUNTIME-ORIGIN-2026-05-13` applies to
  `SOAR-DASHBOARD-001` and `SOAR-BOT-RUNTIME-001`: Web runtime position origin
  typing now includes backend `USER`, and Dashboard Home maps backend
  `origin=USER` to the Manual source label in the edit-position context while
  keeping legacy `MANUAL` payload compatibility. Evidence: focused Web test
  passed (`3/3`) and Web typecheck passed. Rows remain `PARTIAL` because the
  broader V1 route matrix and production-safe clickthrough are not complete.
- 2026-05-13
  `V1-WEB-BACKEND-PARITY-DASHBOARD-2026-05-13` applies to
  `SOAR-DASHBOARD-001` and `SOAR-BOT-RUNTIME-001`: Web runtime trade contract
  now matches backend nullable `orderId`, `positionId`, and `strategyId`;
  Bots Monitoring renders missing runtime relationship IDs as `-`; Web
  positions summary typing and empty API/Web aggregate payloads now carry
  `openPositionQty`. Evidence: Web focused tests passed (`2` files,
  `17` tests), API runtime monitoring aggregate e2e passed (`18/18`), API
  typecheck passed, and Web typecheck passed. Rows remain `PARTIAL` because the
  broader V1 route matrix and production-safe clickthrough are not complete.
- 2026-05-13
  `V1-LIVE-PAPER-SIMULTANEOUS-RUNTIME-PROOF-00169D7F-2026-05-13` applies to
  `SOAR-BOTS-001`, `SOAR-BOT-RUNTIME-001`, and
  `SOAR-EXCHANGE-ADAPTER-001`: local DB-backed API/runtime evidence now proves
  two active PAPER bots plus active Binance LIVE and Gate.io LIVE bots can
  coexist while selected runtime position reads stay isolated by mode, wallet,
  API key, exchange, and market type. The slice also verifies venue-scoped LIVE
  overlap, Gate.io-safe runtime fallback market data through the exchange
  boundary, Binance-only derivative fallback degradation for Gate.io, duplicate
  guard regression, runtime PnL parity, API typecheck, and focused Dashboard
  Web rendering. A rendered Dashboard Home regression also proves all four
  bots appear in the selector and selected wallet/runtime rows re-scope when
  switching between PAPER, Binance LIVE, and Gate.io LIVE. At that checkpoint,
  production-safe authenticated UI/runtime clickthrough and real live
  multi-bot operation evidence were still separate V1 lanes.
- 2026-05-14
  `V1-LIVE-PAPER-SIMULTANEOUS-RUNTIME-PROOF-REFRESH-457BCE05-2026-05-14`
  refreshes the same `SOAR-BOTS-001`, `SOAR-BOT-RUNTIME-001`, and
  `SOAR-EXCHANGE-ADAPTER-001` evidence after the production deploy of
  `457bce05`: production build-info passed for `457bce05`, focused API
  LIVE/PAPER isolation tests passed (`25/25`), focused Web Dashboard
  selected-bot/runtime tests passed (`24/24`), controlled no-order-guard
  production proof activated the existing Binance LIVE bot only for the
  observation window, `LIVEIMPORT-03` passed for `TRXUSDT`, simultaneous
  read-only runtime readback showed the Binance LIVE bot and both Binance
  PAPER bots RUNNING, and post-cleanup readback confirmed the LIVE bot was
  inactive again. This closes the current production non-Gate.io simultaneous
  LIVE/PAPER runtime scope. Rows that still require deeper per-module
  production UI/action clickthrough remain `PARTIAL`; Gate.io/second-LIVE
  production shape remains unavailable/deferred rather than hidden.
- 2026-05-13
  `V1-TARGET-RELEASE-GATE-PASS-00169D7F-2026-05-13` applies to
  `SOAR-OPERATIONS-001`: final `LIVEIMPORT-03` passed for `TRXUSDT`, final
  preflight has no blockers, and the production target-only release gate is
  `ready` for deployed `00169d7f`. Production build-info freshness,
  post-deploy smoke, runtime freshness, and rollback guard passed. The
  remaining limitation is local-environment-only: full gate artifact
  `2026-05-13Tfinal-v1-gate` is `not_ready` because Docker Desktop was
  unavailable for local `test:go-live:smoke` after guardrails, typecheck, and
  build passed.
- 2026-05-13
  `V1-CONTROLLED-LIVE-PROOF-ATTEMPT-00169D7F-2026-05-13` applies to
  `SOAR-OPERATIONS-001`: an approved controlled LIVE proof started a RUNNING
  session and cleaned up by deactivating the bot. Initial ETH/DOGE proof
  targeting was corrected after confirming the target bot's real managed
  symbol set; the accepted proof passed for `TRXUSDT`. A runner partial-update
  defect was fixed and production bot configuration was restored to inactive
  LIVE/import-capable state after proof.
- 2026-05-13
  `V1-CONTROLLED-LIVE-PROOF-PREACTIVATION-00169D7F-2026-05-13` applies to
  `SOAR-OPERATIONS-001`: controlled LIVE proof preactivation confirms the
  no-order guard is fully active and the target LIVE bot is inactive and
  import-capable. The runner refused activation without explicit live-risk
  approval. Operations remains `BLOCKED`.
- 2026-05-13
  `V1-PROD-RESTORE-AND-LIVEIMPORT-TRUTH-00169D7F-2026-05-13` applies to
  `SOAR-OPERATIONS-001`: production restore drill is fresh `PASS`, while
  LIVEIMPORT is fresh `failed` because the existing LIVE Binance futures bot
  has no running session. Operations remains `BLOCKED`; final preflight now
  has only `evidence:liveImportReadback:failed` as the V1 blocker.
- 2026-05-13 `V1-PROTECTED-PROOF-REDUCTION-00169D7F-2026-05-13` applies to
  `SOAR-OPERATIONS-001`, `SOAR-BOTS-001`,
  `SOAR-UX-A11Y-MOBILE-001`, and `SOAR-SUBSCRIPTIONS-ADMIN-001`:
  authenticated production UI clickthrough is now fresh `PASS`, and production
  rollback proof is fresh `PASS`. LIVEIMPORT production readback auth succeeds
  and finds one LIVE Binance futures bot, but no running session exists, so
  Operations remains `BLOCKED` and V1 remains `NO-GO`. Final preflight blockers
  are reduced to production DB restore context, LIVEIMPORT runtime readback,
  and stale backup/restore drill evidence.
- 2026-05-13 `V1-GATE4-PATRYK-SIGNOFF-2026-05-13` applies to
  `SOAR-OPERATIONS-001`: Gate 4 is now approved with the user-authorized
  `Patryk` approver/owner fields, and final preflight reports RC evidence as
  fresh. Operations remains `BLOCKED` on protected technical proof and stale
  DB/rollback evidence.
- 2026-05-13 `V1-RC-CURRENT-BLOCKED-REFRESH-2026-05-13` applies to
  `SOAR-OPERATIONS-001`: RC external gates, sign-off, and checklist are fresh
  for 2026-05-13 but remain failed/blocked because Gate 4 approver fields are
  missing. Operations remains `BLOCKED`.
- 2026-05-13 `V1-PRODUCTION-ACTIVATION-REFRESH-2026-05-13` applies to
  `SOAR-OPERATIONS-001`: production activation audit and activation evidence
  plan are fresh `NO-GO` artifacts for 2026-05-13. This removes the activation
  stale classification from final preflight, but Operations remains `BLOCKED`
  until protected auth, DB restore context, RC approval, rollback proof,
  `LIVEIMPORT-03`, authenticated production UI clickthrough, and the final
  release gate are complete.
- 2026-05-13 `V1-OPERATOR-PACKET-CURRENT-DAY-REFRESH-00169D7F-2026-05-13`
  applies to `SOAR-OPERATIONS-001`, `SOAR-BOTS-001`, and
  `SOAR-UX-A11Y-MOBILE-001`: the current operator unblock packet now points to
  2026-05-13 final preflight, protected input readiness, and production UI
  audit artifacts. It is a handoff only, not production proof; statuses remain
  unchanged until protected inputs produce PASS artifacts and the final release
  gate returns `ready`.
- 2026-05-13 `V1-CURRENT-DAY-BLOCKER-REFRESH-00169D7F-2026-05-13` applies to
  `SOAR-OPERATIONS-001`, `SOAR-BOTS-001`, and
  `SOAR-UX-A11Y-MOBILE-001`: deployed build-info still matches
  `00169d7fdc3aff8317759137b05594b20e773c8e`, final preflight public smoke
  passes, and no protected input names were present in the current Codex
  shell. The fresh production UI audit is `BLOCKED_AUTH` with protected
  dashboard/admin/legacy routes failing closed to `/auth/login`; this is
  current blocker evidence, not accepted production UI proof. Operations stays
  `BLOCKED`, Bots stays `PARTIAL`, and production UX clickthrough remains
  missing until approved production app/admin auth and protected release inputs
  are available.
- 2026-05-12 `V1-PROTECTED-INPUT-READINESS-CURRENT-SWEEP-00169D7F-2026-05-12`
  applies to `SOAR-OPERATIONS-001` and `SOAR-BOTS-001`: the current no-secret
  env-name sweep found no matching `LIVEIMPORT_READBACK_*`,
  `ROLLBACK_GUARD_*`, `PROD_UI_AUDIT_*`, `PROD_UI_*`, `SOAR_PROD_*`,
  production DB check, RC, or Gate input families. No secret values were
  printed or stored. This keeps Operations `BLOCKED` and Bots `PARTIAL` until
  the operator packet is executed with approved protected inputs.
- 2026-05-12 `BOTMULTI-09-CONTAINMENT-SUPERSEDE-00169D7F-2026-05-12` applies
  to `SOAR-BOT-RUNTIME-001` and `SOAR-OPERATIONS-001`: the historical
  production promotion marker is closed as contained in the deployed V1 line,
  but production runtime verification is still not closed. Protected runtime
  readback remains in `LIVEIMPORT-03` and the final release gate.
- 2026-05-12 `PROD-UI-AUDIT-PLAN-SUPERSEDE-00169D7F-2026-05-12` applies to
  `SOAR-BOTS-001` and `SOAR-UX-A11Y-MOBILE-001`: the historical broad
  production UI audit plan is closed as superseded by the current
  `ops:ui:prod-clickthrough` release-gate lane. Production UI verification is
  still not closed; the final gate requires a fresh PASS
  `prod-ui-module-clickthrough-*` artifact with approved `PROD_UI_AUDIT_*`
  auth.

## Recent Updates

- 2026-05-23 `ARCH-RUNTIME-P1-006-BACKTEST-MULTI-STRATEGY-MERGE` applies to
  `SOAR-BACKTESTS-001`, `SOAR-BOT-RUNTIME-001`, and `SOAR-ENGINE-001`:
  complete immutable multi-strategy backtest seed snapshots now replay through
  the shared runtime weighted/exit-priority merge policy instead of silently
  degrading to a single-strategy path. The winning primary strategy is
  persisted on backtest trades, report/timeline parity diagnostics include
  merge samples, final-candle runtime votes carry strategy-link provenance,
  and ambiguous link-only snapshots still fail closed. Evidence: runtime merge
  plus backtest contract/job pack passed (`24/24`), replay/kernel parity pack
  passed (`34/34`), and API typecheck passed.

- 2026-05-22 `ARCH-CODE-RUNTIME-AUDIT-2026-05-22` applies to
  `SOAR-ENGINE-001`, `SOAR-ORDERS-001`, `SOAR-BOT-RUNTIME-001`,
  `SOAR-BACKTESTS-001`, `SOAR-REPORTS-001`, and `SOAR-OPERATIONS-001`: four
  read-only architecture/code audit lanes found remaining runtime drift. Two
  P0 orders/exchange defects and safe local P1 defects were fixed: stale
  unproven runtime execution dedupe no longer resets to `execute`, LIVE
  `FILLED` without exchange fill quantity no longer synthesizes local full
  fill/lifecycle truth or uses request price as fill price, imported LIVE
  rows no longer show dynamic strategy fallback without runtime state,
  backtests use closed-candle upper bounds, reports aggregate settled
  realized-PnL trades only, deploy smoke checks worker readiness, VPS compose
  encodes split-worker defaults, API readiness checks DB reachability, and
  rollback proof checks worker readiness. Evidence: focused API pack `88/88`,
  readiness/backtest/report pack `20/20`, script syntax checks, and VPS
  compose config with required env.

- 2026-05-22 `RUNTIME-ARCHITECTURE-DCA-TP-PARITY-2026-05-22` applies to
  `SOAR-BOT-RUNTIME-001`, `SOAR-BACKTESTS-001`, and `SOAR-ORDERS-001`:
  architecture-vs-code review found and fixed a confirmed DCA-first lifecycle
  drift where basic `TP` could close while profit-side DCA levels remained
  pending, and `SL`/`TSL` used an all-DCA gate instead of matching pending
  loss-side DCA. Runtime position management now gates `TP`/`TTP` on
  remaining profit-side DCA and `SL`/`TSL` on remaining loss-side DCA;
  replay/portfolio backtest helpers use the same side-specific close blocking.
  Evidence: focused combined runtime/backtest pack passed `104/104`, SL/TSL
  correction pack passed `71/71`, API typecheck passed, repository guardrails
  passed, and diff check passed with line-ending warnings only. Missing proof:
  production deploy/readback; production
  endpoints timed out during this local checkpoint.

- 2026-05-21 `MONEY-FLOW-SECURITY-CANCEL-ENTITLEMENT-2026-05-21` applies to
  `SOAR-ORDERS-001`, `SOAR-MANUAL-ORDERS-001`, and
  `SOAR-EXCHANGE-ADAPTER-001`: fixed a confirmed local LIVE cancel
  entitlement gap. Exchange-backed LIVE cancel now checks current
  `liveTrading` entitlement before exchange adapter boundary invocation and
  before local cancel mutation, covering both manual cancel and runtime
  stale-order lifetime cancel paths. Focused DB-backed tests were added for
  allowed entitlement and downgraded FREE fail-closed behavior. Evidence:
  API typecheck PASS and repository guardrails PASS. Missing proof:
  focused DB-backed test execution was attempted but blocked by unavailable
  local Postgres/Docker in this session.

- 2026-05-21 `LOCAL-CERTAINTY-CLOSURE-2026-05-21` applies to
  `SOAR-DATA-001`, `SOAR-I18N-001`, `SOAR-PROFILE-001`,
  `SOAR-WALLETS-001`, `SOAR-DASHBOARD-001`, `SOAR-SUBSCRIPTIONS-ADMIN-001`,
  `SOAR-UX-A11Y-MOBILE-001`, `SOAR-OPERATIONS-001`, and Reports module truth:
  closed the remaining locally executable follow-up queue. `Trade.executionMode`
  now snapshots PAPER/LIVE execution mode for new runtime/exchange/imported
  trades, with migration backfill for legacy rows and Reports snapshot-first
  aggregation. Bot preview/assistant route copy now uses i18n provider keys,
  Profile Basic has safer mobile layout, Admin Subscriptions uses shared view
  states, Wallet PAPER reset uses the shared confirmation modal, and Dashboard
  Home tests cover the explicit runtime confirmation gate. Evidence: Prisma
  generate/reset/validate/status PASS, full Web Vitest PASS (`149` files /
  `522` tests), full API Vitest PASS in one-worker fork mode, build PASS, lint
  PASS, go-live smoke PASS (`45` API tests / `18` Web tests), guardrails PASS,
  docs parity PASS, i18n audit PASS (`0` findings), and diff check PASS.
  Protected production `AUD-19` remains blocked outside local module
  confidence.

- 2026-05-21 `REST-IMPLEMENTATION-SWEEP-2026-05-21` applies to
  `SOAR-DASHBOARD-001`, `SOAR-BOT-RUNTIME-001`,
  `SOAR-SUBSCRIPTIONS-ADMIN-001`, and `SOAR-OPERATIONS-001`: fixed confirmed
  local safety defects found by agent lanes. Dashboard Home LIVE manual
  order/cancel/close now require explicit confirmation before `riskAck: true`;
  Web runtime close/cancel service wrappers no longer default to risk ack; API
  LIVE manual runtime close fails closed without a trusted close reference
  price instead of using entry price; Admin Users role/plan mutations now
  require confirmation. Evidence: focused Web pack passed (`4` files / `14`
  tests), focused API pack passed (`4` files / `99` tests), API typecheck, and
  Web typecheck. Reports historical execution-mode snapshots remain a P2 data
  model follow-up rather than current verified report truth.

- 2026-05-21 `FRONTEND-ENGINE-UX-DCA-SWEEP-2026-05-21` applies to
  `SOAR-BACKTESTS-001`, `SOAR-DASHBOARD-001`, and `SOAR-BOT-RUNTIME-001`:
  fixed confirmed backtest replay parity drift where isolated replay and
  interleaved portfolio simulation could close by `TTP` while affordable
  profit-side DCA levels were still pending. Runtime/PAPER core already had the
  guard. Also reduced frontend runtime friction by preventing bot-monitoring
  aggregate first-open double-fetch, adding Dashboard Home auth-bootstrap
  render regression coverage, and making Reports tolerate one failed per-run
  report request. Evidence: focused API pack passed (`4` files / `99` tests),
  focused Web pack passed (`3` files / `22` tests), API typecheck, Web
  typecheck, and repository guardrails.

- 2026-05-20 `V1-PROTECTED-PREFLIGHT-DD1A1FAF-2026-05-20` applies to
  `SOAR-OPERATIONS-001`: production build-info matches deployed
  `dd1a1faf79f8ac3581ca0a8c983481a3e30327ac` and public API/Web smoke passes,
  but the current protected V1 release gate remains `BLOCKED`. The no-secret
  preflight reports missing `LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`,
  `PROD_UI_AUDIT_*`, production DB restore context, and stale required
  protected release evidence for 2026-05-20. The paired protected-input sweep
  found `0` matching protected input names and printed no secret values. This
  is blocker classification only, not final release evidence. Current
  no-secret operator handoff:
  `docs/operations/v1-operator-unblock-packet-dd1a1faf-2026-05-20.md`.
  Follow-up `V1-OPERATOR-UNBLOCK-PACKET-CHECK-COMMAND-2026-05-20` adds
  `ops:operator-unblock:check` and focused tests so this handoff remains
  machine-checkable while protected inputs are absent.
  Follow-up `V1-OPERATOR-UNBLOCK-TOOLING-INDEX-SYNC-2026-05-20` adds that
  validator to the reusable audit tooling index and `audit:manifest:verify`;
  this strengthens release handoff tooling but does not change the protected
  evidence blocker.
  Follow-up `V1-AGENT-BLOCKER-SWEEP-DD1A1FAF-2026-05-20` used two read-only
  subagent lanes plus a protected-input rerun to confirm there is no remaining
  meaningful non-secret deployment task; Operations remains blocked until
  approved protected inputs are provided.

- 2026-05-14 `POSTV1-STRATEGY-SNAPSHOT-HISTORY-2026-05-14` applies to
  `SOAR-BACKTESTS-001`, `SOAR-STRATEGIES-001`, and `SOAR-MARKETS-001`: new
  backtest runs now persist immutable creation-time strategy and
  market-universe snapshots in `seedConfig.contextSnapshot`; backtest list,
  timeline, and replay evaluation prefer snapshot strategy truth before
  mutable strategy records; strategy deletion and market-universe deletion now
  fail closed with `409` while owned backtest history references those records.
  Focused API e2e passed for backtests, strategies, and markets (`44/44`).
  Bot history/versioned bot context and per-symbol best-parameter comparison
  remain separate follow-up slices.

## Maintenance Rules

- Update this file when a feature ships, a bug is fixed, a regression appears,
  architecture changes, validation proves a journey, or a module is deferred.
- Prefer verification tasks before fix tasks when the only problem is missing
  evidence.
- Mark a journey `VERIFIED` only when evidence is current and reproducible.
- Mark a journey `BROKEN` when a real user journey fails, even if related tests
  pass.
- Link evidence to test names, commands, screenshots, smoke notes, commits, or
  task IDs. Chat-only evidence is not enough.
