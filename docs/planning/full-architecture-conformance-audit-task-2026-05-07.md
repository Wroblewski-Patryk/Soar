# Task

## Header
- ID: FULLARCH-AUDIT-2026-05-07
- Title: Full architecture conformance audit for V1 application functions
- Task Type: research
- Current Stage: analysis
- Status: REVIEW
- Owner: Backend Builder
- Depends on: LIVEIMPORT-AUDIT-2026-05-07
- Priority: P0
- Iteration: 2026-05-07
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the active iteration context.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator asked for a full audit of every application function that should
work according to architecture, so future repairs can be sequenced from system
truth instead of isolated symptoms. The immediate known symptom is live exchange
position import where one position out of six becomes bot-visible.

## Goal
Create a complete, repo-grounded architecture conformance audit across V1
functional areas: product configuration, trading runtime, exchange integration,
operator surfaces, analysis/reporting, safety, deployment, and tests.

## Scope
- Product and architecture sources:
  - `docs/product/product.md`
  - `docs/architecture/README.md`
  - `docs/architecture/codebase-map.md`
  - `docs/architecture/traceability-matrix.md`
  - `docs/architecture/01_overview-and-principles.md`
  - `docs/architecture/02_system-topology.md`
  - `docs/architecture/03_domain-model.md`
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/05_strategy-signal-and-decision-flow.md`
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/07_modes-parity-and-data.md`
  - `docs/architecture/08_operator-surfaces-and-routing.md`
  - `docs/architecture/09_integrations-deployment-and-runtime-services.md`
  - `docs/architecture/10_safety-entitlements-and-risk.md`
  - `docs/architecture/11_assistant-runtime.md`
  - `docs/architecture/12_documentation-governance.md`
- Implementation surfaces:
  - API modules under `apps/api/src/modules`
  - API router and health/readiness surfaces under `apps/api/src/router`
  - API workers under `apps/api/src/workers`
  - Web features under `apps/web/src/features`
  - Web routes under `apps/web/src/app`
  - Prisma schema under `apps/api/prisma/schema.prisma`
- Validation surfaces:
  - root typecheck, lint, full test command
  - focused live import/runtime takeover tests from
    `LIVEIMPORT-AUDIT-2026-05-07`

## Success Signal
- User or operator problem: the team has one architecture-aligned repair queue
  instead of repeated drift fixes.
- Expected product or reliability outcome: repairs can be delivered as small
  vertical slices with explicit acceptance evidence.
- How success will be observed: every V1 functional family has a status,
  evidence summary, risk classification, and next repair action.
- Post-launch learning needed: yes

## Deliverable For This Stage
A full conformance matrix and prioritized remediation queue. No code changes
are performed in this analysis stage.

## Constraints
- use existing architecture and module boundaries
- do not introduce new systems
- do not create workaround import or runtime ownership paths
- distinguish product regressions from test-harness failures
- keep post-MVP or V1.1 scope out of launch-critical repair work unless it
  blocks current V1 behavior

## Definition of Done
- [x] Architecture/product-declared functions mapped.
- [x] Implementation surfaces traced by module and route family.
- [x] Validation baseline captured.
- [x] Gaps classified by severity.
- [x] Repair sequence defined.
- [x] Source-of-truth next steps updated.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - `pnpm run typecheck` -> PASS.
  - `pnpm run lint` -> PASS.
  - `pnpm run test -- --run` -> FAIL.
    - API: confirmed failure in `bots.runtime-takeover.e2e.test.ts` for
      recovered imported LIVE position visibility.
    - Web: 29 failures / 453 passes across 145 files. Dominant harness issue:
      many tests mock `next/navigation` without `usePathname`, while
      `I18nProvider` now imports `usePathname`; several dashboard tests also
      timed out at 5000ms.
  - Focused import pack from the previous audit:
    - `livePositionReconciliation.service.test.ts` -> PASS.
    - `runtimeExternalPositionOwner.service.test.ts` -> PASS.
    - `bots.runtime-takeover.e2e.test.ts` -> 1 FAIL matching recovered
      position visibility.
- Manual checks:
  - API route inventory collected from route files.
  - API/Web module inventories collected from implementation tree.
  - Architecture and module maps reviewed.
- Screenshots/logs:
  - Not applicable.
- High-risk checks:
  - No production credentials were used.
  - No live-money or exchange-mutating actions were performed.

## Architecture Evidence
- Architecture source reviewed: yes
- Fits approved architecture: partially
- Mismatch discovered: yes
- Decision required from user: no for first repair slices; yes before changing
  ownership, scope, or runtime topology semantics.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: not required if fixes restore documented
  behavior; required if product chooses different ownership or import
  semantics.

## Functional Conformance Matrix

| Function family | Architecture contract | Implementation surfaces | Current evidence | Status | Gaps / risks | Next action |
|---|---|---|---|---|---|---|
| Auth and session | Auth is public entry, dashboard/admin are authenticated, sessions are revocable and no-store. | `auth`, `requireAuth`, router no-store, Web auth forms. | Typecheck/lint pass; broad auth tests exist. | Mostly conforming | Module docs still list typed auth error migration and stronger invalidation follow-up. | Keep as P2 unless security testing finds current-session bypass. |
| Profile, security, API keys, upload | Profile owns user settings and API key lifecycle; API keys do not become trading truth without wallet/bot context. | `profile`, `upload`, API-key probe, Web profile. | Tests exist for profile, API key probe, upload. | Mostly conforming | Production credential/readback evidence unavailable in this session. | Keep read-only credential evidence under `LIVEIMPORT-03`; do not use public checks as proof. |
| Wallets and capital context | Wallet owns execution mode, venue compatibility, capital reference, paper reset baseline, LIVE balance source. | `wallets`, `walletLedger`, `walletCashflowClassifier`, runtime capital context, Web wallets. | Tests exist for CRUD, ledger classifier, runtime capital context; typecheck/lint pass. | Partially conforming | LIVE wallet ledger is a target extension; production balance/cashflow evidence not captured here. | P1 after live import: verify wallet capital readback and paper reset parity with current UI. |
| Market universe and symbol groups | Market universe owns venue context; final symbols = `filter_result U whitelist - blacklist`; no hidden venue fallback. | `markets`, `marketCatalogSymbolResolver`, runtime symbol resolvers, Web markets. | Market tests and catalog-aware bot ownership tests exist. | Mostly conforming | One-of-six import can still originate here if effective symbol scope resolves only one symbol; diagnostics are weak. | P0: add six-symbol DB-backed import/readback test using real symbol-scope resolver. |
| Strategy builder and indicator registry | MVP schema uses entry/exit/risk/filters/timeframes; one registry must drive builder, runtime, backtest, overlays. | `strategies`, `engine` indicator/rule evaluators, `backtests`, Web strategy form. | Strategy, indicator parity, backtest/runtime parser tests exist. | Mostly conforming | Strategy JSON import/export is product-current limitation/post-MVP despite route support; full UI mock failures block broad Web confidence. | P1: after harness fix, run focused strategy/backtest parity pack and route smoke. |
| Bot configuration and topology | Bot = wallet + one active symbol-group market scope + N enabled strategy links; legacy fields are projections only. | `botsCommand`, `botMarketGroups`, `MarketGroupStrategyLink`, Prisma partial unique index, Web bot form. | Multi-strategy write and wallet contract tests exist; typecheck/lint pass. | Mostly conforming | Broad Web bot form tests fail due `usePathname` mock harness, not proven product failure; active topology still needs local green pack after harness repair. | P0/P1: fix test harness then rerun bot create/edit Web and API topology packs. |
| Entitlements and LIVE consent | LIVE requires explicit consent, compatible wallet/API key, capability, and entitlement. | `botActivationPolicy`, `botLiveConsent`, subscriptions, admin plans, Web bot form. | API entitlement tests exist; admin/subscription modules present. | Partially conforming | Admin/billing are post-MVP/V1.1 for launch classification; broad product payment flows are not current V1 closure. | Keep V1 launch scope explicit; verify LIVE entitlement guard with focused API pack before release. |
| Runtime signal loop and merge | Evaluation unit is `(botId, symbol, intervalWindow)`; multi-strategy merge is deterministic; ties/weak consensus -> `NO_TRADE`. | `runtimeSignalLoop`, `runtimeFinalCandleDecision`, `runtimeSignalMerge`, `runtimeTelemetry`. | Extensive engine tests exist; typecheck/lint pass. | Mostly conforming | No full fresh run in this audit because full test stopped after failures; needs focused green evidence before fixing production. | P1: run focused runtime signal/merge pack after P0 read-model fix. |
| Pre-trade and risk gates | Kill switch, no-flip, position limits, affordability, venue and ownership mismatch fail closed. | `preTrade`, `preTradeRisk`, `executionOrchestrator`, `runtimeCapitalContext`. | Focused tests exist; no type/lint failures. | Mostly conforming | Must be revalidated for imported bot-owned rows after visibility/ownership repairs. | P1: include imported-position pre-trade regression in repair slice. |
| Order lifecycle | Order is intent; Position opens/updates only by fill authority; manual commands do not directly open positions; idempotency for side effects. | `orders`, `orders.lifecycle`, exchange events, engine order lifetime, Web manual order controls. | Order, exchange events, paper manual, lifecycle tests exist. | Mostly conforming | Web manual-order test timed out in full pack; live exchange cancel support intentionally fails closed for unsupported paths. | P1: fix Web harness/timeouts, then rerun manual order API/Web pack. |
| Position lifecycle automation | DCA first, then TP/SL or TTP/TSL; imported/recovered LIVE positions need canonical owner and strategy context before actionability. | `runtimePositionAutomation`, `positionManagement`, runtime serialization, dynamic stop read models. | Many PMPLC/V1MONEY tasks and tests exist; typecheck/lint pass. | Mostly conforming | Imported/recovered visibility regression can hide rows before automation actionability is judged. | P0: restore recovered imported visibility while keeping `actionable=false`. |
| LIVE exchange import and takeover | Exchange snapshot imports positions; bot ownership only with exact API key + market type + symbol; unowned/ambiguous stays fail-closed and visible diagnostically. | `livePositionReconciliation`, `runtimeExternalPositionOwner`, `positions`, runtime read model. | Reconciliation and ownership tests pass; runtime takeover e2e fails one case. | Non-conforming | Confirmed mismatch: recovered imported LIVE positions with `DRIFT` hidden from bot readback. Missing six-position vertical regression and per-symbol diagnostics. | P0 first repair area. |
| Exchange adapters and market data | Exchange behavior behind adapters keyed by exact `(exchange, marketType)`; browser never talks to exchange directly. | `exchange`, `market-data`, `market-stream`, Web SSE client. | Adapter and stream tests exist; route inventory confirms server-owned SSE. | Mostly conforming | Binance-first implementation; non-Binance exchanges are placeholders and must remain fail-closed. Snapshot normalization lacks one-way/hedge side coverage. | P1: add Binance futures snapshot normalization coverage; keep non-Binance inactive. |
| Market stream and live dashboard bar | Worker ingests exchange stream; API owns SSE fan-out; UI exposes freshness/degraded states. | `market-stream`, `marketStream.routes`, `LiveMarketBar`, runtime stats. | Stream route/fanout tests exist; Web LiveMarketBar tests exist. | Mostly conforming | Full rendered smoke not run in this audit; dashboard test timeouts reduce confidence. | P2 after P0/P1: rendered dashboard/bots smoke. |
| Backtests and replay parity | Backtests use explicit range, OHLCV payload, shared strategy/indicator/lifecycle semantics, immutable output. | `backtests`, backtest worker, Web backtest pages. | Many backtest and parity tests exist; Web backtest route tests fail due `usePathname` mock harness. | Mostly conforming with harness caveat | Full test pack Web route failures are not product-proven; API full pack did not complete cleanly due parallel failure. | P1: repair Web navigation mock baseline, then rerun backtest route/API pack. |
| Reports | Cross-mode performance reporting should use durable backtest/runtime truth and present PnL, drawdown, fees, funding where available. | `reports`, Web reports. | Reports service and Web reports tests exist. | Mostly conforming | Product still has future richer wallet performance analytics. | P2: focused reports pack after harness repair. |
| Logs and audit trail | Audit trail must expose high-signal operator events with filtering and ownership isolation. | `logs`, Web logs. | Logs e2e and Web audit trail tests exist. | Mostly conforming | Audit coverage should be included in release gate; not full-run green here. | P2 release validation. |
| Dashboard and bot monitoring surfaces | Selected-bot scope strict and fail-closed; empty states visible; configured-only vs no-trade vs accepted signal vs open-position differentiated. | `dashboard-home`, `bots` Web monitoring, API runtime read models. | Many focused historical tests exist; full Web pack has timeouts and mock failures. | Partially conforming | Confirmed API visibility bug affects surfaces; Web harness currently blocks broad confidence. | P0/P1: API read-model fix, Web test harness fix, then rendered dashboard/bots smoke. |
| UI states, i18n, and route ownership | All operator surfaces expose loading/empty/degraded/error/success; text uses route-owned i18n keys and locale-aware formatting. | Web app/features/ui/i18n. | i18n/type/lint pass; broad Web tests fail because I18nProvider now needs `usePathname` in mocks. | Test harness non-conforming | The test harness drift is real process debt and currently masks product regressions. | P0/P1: centralize or update `next/navigation` mocks to include `usePathname`; rerun Web suite. |
| Admin and billing/subscriptions | Admin/users/subscriptions exist, but broad billing/payment workflows are V1.1/post-MVP unless launch-gating entitlements. | `admin`, `subscriptions`, Stripe checkout foundation, Web admin. | Admin tests exist; product docs classify rich admin/billing post-MVP. | Scope-conforming | Do not treat incomplete rich billing as V1 blocker unless entitlement guards fail. | P2: keep docs and UI copy explicit about scope. |
| Assistant runtime | Assistant is bot-scoped, constrained, deterministic, and cannot bypass safety. | `botAssistant`, `assistantOrchestrator`, assistant config routes/Web pages. | Assistant orchestrator tests exist; product docs say not current V1 launch-closure gate. | Scope-conforming | Needs security/adversarial review before any production trading dependency. | P2/P3 unless assistant becomes launch-critical. |
| Security, isolation, rate limiting | Auth ownership, role checks, trusted origin, rate limiting, no-store, data isolation, ops network guards. | Middleware, router, isolation module, auth/profile/admin tests. | Typecheck/lint pass; isolation and security tests exist. | Mostly conforming | Full test pack not green; no dedicated red-team run for AI because not launch-critical. | P1 release gate: run security/isolation focused pack after harness fix. |
| Deployment, workers, readiness, observability | PROD/STAGE require split workers; `/health`, `/ready`, `/metrics`, `/workers/health`, `/workers/ready`, runtime freshness must expose degraded topology. | router health/readiness, worker ownership, metrics, operations scripts. | Health/readiness route files and tests exist; type/lint pass. | Mostly conforming | Production protected readback and release evidence remain open; stage has historical blocker. | Keep `LIVEIMPORT-03` and `BOTMULTI-09` protected evidence open. |
| Mobile | Mobile is scaffold-only and not active V1 traceability. | `apps/mobile`. | Test script says scaffold only. | Out of V1 active scope | Future mobile traceability missing by design. | Do not include in current repair queue. |

## Confirmed Non-Conformances

### P0-1: Recovered imported LIVE positions are hidden from runtime readback
Architecture requires visibility and actionability to be separate truths during
restart/live import recovery. The current bot runtime positions read model
filters open positions by `syncState: IN_SYNC`, which hides
`RECOVERED_UNACTIONABLE` + `DRIFT` rows. Existing e2e coverage fails exactly
there.

Repair principle: make recovered imported rows visible while keeping
`actionable=false`; do not loosen ownership proof or automation gates.

### P0-2: Six-position exchange import lacks vertical regression evidence
The importer and ownership resolver each have focused tests, but there is no
DB-backed test that creates a real wallet-backed active LIVE bot with a
canonical six-symbol scope, mocks six exchange positions, runs reconciliation,
and proves six bot-visible rows with correct actionability/provenance.

Repair principle: test the whole route from exchange snapshot to runtime
readback using existing systems only.

### P0-3: Reconciliation diagnostics are too weak for operators
Current reconciliation can skip positions for missing entry truth and can
classify positions as manual-only, ambiguous, or unowned, but the operator does
not receive a complete per-symbol outcome explaining why a position did or did
not become bot-managed/visible.

Repair principle: add structured per-symbol diagnostics without changing
ownership semantics.

### P0/P1-4: Web test harness drift masks UI regressions
`I18nProvider` uses `usePathname`, but many route/component tests mock
`next/navigation` without exporting `usePathname`. Full Web test output shows
29 failures, many from that mock mismatch, plus dashboard timeouts.

Repair principle: fix shared test mocking/setup first, then rerun Web route,
bot form, dashboard, and parity suites before classifying UI failures as
product defects.

## High-Confidence Conforming Areas
- Architecture and implementation share the same major bounded contexts:
  API, Web, workers, exchange boundary, Prisma system of record, Redis runtime
  support.
- Route inventory matches the documented core feature families.
- TypeScript typecheck and lint pass across API and Web.
- Exchange access is largely behind module-owned adapters and capability
  contracts.
- Runtime merge, pre-trade, position automation, fee reconciliation, and
  wallet/bot topology have extensive focused coverage.
- Worker topology/readiness surfaces exist and expose split/degraded worker
  truth.

## Main Residual Risks
- Runtime import/readback is the highest product risk because it touches live
  money, ownership, visibility, strategy provenance, and operator actionability.
- Broad UI confidence is currently reduced by Web test harness drift.
- Production truth remains unverified for current protected readback tasks
  because this session had no authenticated production/operator credentials.
- Some implementation still has legacy compatibility paths. These are
  acceptable only while canonical topology wins when present.
- Non-Binance providers remain placeholder/fail-closed scope and must not be
  presented as fully operational.

## Prioritized Repair Queue

Status as of 2026-05-07:

1. `FULLARCH-FIX-01 api-runtime` - DONE:
   `docs/planning/fullarch-fix-01-recovered-imported-position-visibility-task-2026-05-07.md`.
2. `FULLARCH-FIX-02 api-runtime` - DONE:
   `docs/planning/fullarch-fix-02-six-position-import-readback-regression-task-2026-05-07.md`.
3. `FULLARCH-FIX-03 api-positions` - DONE:
   `docs/planning/fullarch-fix-03-reconciliation-diagnostics-task-2026-05-07.md`.
4. `FULLARCH-FIX-04 web-test` - DONE:
   `docs/planning/fullarch-fix-04-web-navigation-mock-harness-task-2026-05-07.md`.
5. `FULLARCH-FIX-05 api-bots` - DONE:
   `docs/planning/fullarch-fix-05-api-single-active-bot-scope-task-2026-05-07.md`.
6. `FULLARCH-FIX-06 api-positions` - DONE:
   `docs/planning/fullarch-fix-06-binance-futures-position-normalization-task-2026-05-07.md`.
7. `FULLARCH-FIX-07 api-runtime` - DONE:
   `docs/planning/fullarch-fix-07-runtime-repair-closure-validation-task-2026-05-07.md`.
8. `LIVEIMPORT-03 release` - BLOCKED until authenticated read-only production
   access is available. Capture redacted ETH/DOGE runtime positions evidence on
   current production `main`; public health/build-info checks and local tests
   do not satisfy this item.
9. `BOTMULTI-09 release` - queued after `LIVEIMPORT-03` for protected runtime
   readback and broader V1 release gate evidence.

## Acceptance Criteria For The Repair Program
- Root typecheck, lint, guardrails, and focused import/runtime packs pass.
- Full Web test suite no longer fails because of shared `next/navigation` mock
  drift.
- Six exchange positions in canonical bot scope become six bot-visible rows.
- Out-of-scope or ambiguous imported exchange positions are visible through
  diagnostics and never falsely upgraded to bot-managed/actionable.
- LIVE restart/recovery rows remain visible when appropriate and fail closed
  for automation until owner and strategy context are proven.
- Production readback evidence is captured only through authenticated
  read-only access, never through public health/build-info checks.

## Result Report
- Task summary: full application conformance audit completed by architecture
  function family.
- Files changed: this audit report, plus state/context files.
- How tested: initial audit used typecheck/lint and classified full-test
  failures; follow-up repair tasks now provide green local evidence through
  root workspace tests, full Web tests, focused import/reconciliation packs,
  Binance futures normalization tests, and focused runtime repair closure
  validation.
- What is incomplete: authenticated production readback for `LIVEIMPORT-03`.
- Next steps: run `LIVEIMPORT-03` with authenticated read-only production
  access, then continue `BOTMULTI-09` protected runtime and V1 release gate
  evidence.
- Decisions made: current architecture is sufficient for the first repair
  slices; no ownership or topology architecture change is required.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: not applicable for analysis stage.
- Real API/service path used: local API/Web test commands and route inventory.
- Endpoint and client contract match: partially; runtime imported-position
  readback is confirmed mismatched.
- DB schema and migrations verified: schema surface inspected through module
  map and prior import audit; no migration changes made.
- Loading state verified: not manually.
- Error state verified: not manually.
- Refresh/restart behavior verified: existing e2e restart-continuity contract
  currently fails.
- Regression check performed: yes.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable for
  analysis-only stage.
- Data classification: no production/user secret data accessed.
- Trust boundaries: API, exchange, worker, ops, and Web boundaries inspected.
- Permission or ownership checks: auth, role, bot/wallet/symbol ownership
  contracts mapped.
- Abuse cases: do not loosen ownership or import actionability to satisfy
  import count.
- Secret handling: no secrets used.
- Security tests or scans: not run separately beyond existing test inventory.
- Fail-closed behavior: confirmed as architectural default; one visibility
  regression must be fixed without weakening automation gates.
- Residual risk: production behavior still requires protected readback.
