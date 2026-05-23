# Code Quality and Maintainability Remediation Plan

Date: 2026-04-21  
Status: Closed  
Scope: active execution wave completed; `CQLT-A..G` implemented and canonically synchronized

## Objective

Reduce non-functional code debt that makes Soar harder to scale, localize, test,
and evolve safely, while preserving current runtime and trading behavior.

This wave exists to close confirmed anti-patterns discovered during the
repository-wide quality audit:

- component-local copy dictionaries and hardcoded user-facing strings
- oversized production modules with mixed responsibilities
- duplicated UI/domain helpers
- spread exchange-integration ownership instead of tighter adapter boundaries
- uncontrolled fallback/default patterns
- repeated async controller boilerplate across web modules
- compatibility/legacy paths that remain active without explicit sunset rules

## Scope Lock

Implement only changes that improve maintainability without altering user-facing
behavior or trading semantics unless a regression test proves existing behavior
is already inconsistent or unsafe.

Out of scope for this wave:

- visual redesigns
- feature additions
- schema redesign unless needed for a quality-safe extraction seam
- opportunistic cleanup not tied to the anti-pattern inventory below

## Confirmed Anti-Pattern Inventory

### 1. Local Copy Dictionaries and Hardcoded User Strings

Confirmed examples:

- `apps/web/src/features/wallets/components/WalletCreateEditForm.tsx`
- `apps/web/src/features/profile/components/ApiKeyForm.tsx`
- `apps/web/src/features/strategies/components/StrategiesList.tsx`
- `apps/web/src/context/AuthContext.tsx`
- `apps/web/src/lib/handleError.ts`

Observed pattern:

- route/module namespaces exist, but many components still carry embedded
  `copy`/`copyByLocale` maps or raw toast/error text
- route-level i18n audit becomes less trustworthy because not all strings live
  inside the same localization system

Desired end state:

- user-facing strings come from canonical namespaces
- shared fallback strings live in one i18n-aware utility layer
- new local copy dictionaries are blocked by guardrails

### 2. Oversized Production Modules

Confirmed oversized files:

- `apps/web/src/features/backtest/components/BacktestRunDetails.tsx`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
- `apps/api/src/modules/orders/orders.service.ts`
- `apps/web/src/features/bots/components/BotsManagement.tsx`
- `apps/web/src/features/bots/components/bots-management/BotsMonitoringTab.tsx`
- `apps/api/src/modules/bots/botsCommand.service.ts`
- `apps/web/src/features/wallets/components/WalletCreateEditForm.tsx`
- `apps/api/src/modules/backtests/backtests.service.ts`
- `apps/api/src/modules/engine/executionOrchestrator.service.ts`

Observed pattern:

- one file owns too much orchestration, view-model shaping, formatting, state,
  validation, and persistence coordination
- local fixes become risky because unrelated behavior lives in the same file

Desired end state:

- containers/hooks/services own orchestration only
- pure sections/helpers own presentation and deterministic formatting
- extraction order is driven by tests and explicit seams, not broad rewrites

### 3. Duplicated Helpers and Presentation Logic

Confirmed examples:

- DCA ladder logic duplicated between dashboard home and bots monitoring
- repeated badge/formatting logic across dashboard and bots runtime surfaces

Desired end state:

- one helper/view-model per shared concept
- dashboard and bots views consume the same formatting utilities where contract
  is shared

### 4. Spread Exchange-Integration Ownership

Confirmed examples:

- dynamic `ccxt` loading and exchange bootstrap logic appear in multiple API
  modules (`markets`, `wallets`, `positions`, runtime capital, exchange rules,
  API-key probe)

Desired end state:

- exchange adapter ownership is explicit and narrow
- product modules ask a single exchange-facing layer for capabilities/rules
- additional exchange rollout does not require copy-pasting bootstrap logic

### 5. Uncatalogued Fallback and Default Patterns

Confirmed examples:

- global i18n fallback
- `USDT` defaulting in web and API symbol/base-currency utilities
- rate-limit Redis fallback to in-memory mode
- compatibility fallbacks for legacy flows

Desired end state:

- every fallback is categorized as one of:
  - allowed and permanent
  - temporary compatibility bridge
  - forbidden in critical paths
- critical-path code prefers explicit unresolved/error state over hidden
  inference

### 6. Repeated Async Controller Boilerplate

Confirmed examples:

- many web pages/hooks repeat `loading/error/toast/retry` patterns with local
  state choreography

Desired end state:

- common async page/list/form behavior is centralized in reusable helpers/hooks
- focused modules keep business rules, not generic loading boilerplate

### 7. Legacy/Compatibility Creep

Confirmed examples:

- compatibility-only behavior remains active in runtime or web code without a
  formally frozen sunset path

Desired end state:

- legacy bridges stay documented, audited, and visibly temporary
- compatibility code is either frozen as intentional or queued for removal

## Safe Delivery Order

Use this sequence only:

1. inventory and contract freeze
2. guardrails/tests that block regressions
3. shared helper extraction
4. targeted module decompositions
5. exchange/fallback ownership cleanup
6. docs sync and closure evidence

Preflight rule for remaining `CQLT-E..G` slices:

- keep `pnpm --filter web run build` warning-free before and after each split
- fix new `react-hooks/exhaustive-deps` warnings in the same slice that
  introduced or exposed them
- align focused regression coverage with every extracted controller/helper seam

Never start with broad “cleanup” refactors before inventory and regression
locks exist.

## Progress Log

- 2026-04-21: Closed `CQLT-11` by adding canonical `dashboard.shared.*`
  translation keys, moving `AuthContext` logout/session-expired toasts to
  i18n-aware resolution, and replacing the hardcoded `handleError` default with
  a shared translation-backed fallback plus caller override support.
- 2026-04-21: Closed `CQLT-12..CQLT-14` by moving profile, strategies, and
  wallet-form locale maps into canonical `dashboard-shell`,
  `dashboard-strategies`, and `dashboard-wallets` namespaces, then removing the
  corresponding temporary production allowlist entries from
  `scripts/repoGuardrails.mjs` while keeping `quality:guardrails` green.
- 2026-04-21: Closed `CQLT-15A..C` by restoring local workspace runtime with a
  full dependency reinstall, extending focused route/i18n regression locks for
  migrated profile/strategies/wallets routes, and generating the
  route-reachable audit artifact while keeping `build`, `typecheck`, and
  `quality:guardrails` green for the CQLT-C slice.
- 2026-04-21: Closed `CQLT-01..CQLT-05` by publishing the active
  maintainability contract in
  `docs/architecture/reference/maintainability-remediation-contract.md`,
  recording concrete web/API/monolith inventories in
  `history/audits/code-quality-maintainability-inventory-2026-04-21.md`, and
  freezing extraction-order ownership rules before refactor work.
- 2026-04-21: Closed `CQLT-06..CQLT-10` by extending
  `scripts/repoGuardrails.mjs` to block new production-local copy dictionaries,
  raw user-facing hardcoded UI literals, and non-allowlisted `1000`+ line
  monoliths, and by publishing the exception/allowlist policy in
  `docs/governance/code-quality-guardrails.md` plus the duplicate-helper
  snapshot artifact under `docs/modules/`.
- 2026-04-21: Cleared the active web warning baseline ahead of the remaining
  `CQLT` slices by fixing all current `react-hooks/exhaustive-deps` warnings in
  `AuthContext`, profile API-key/subscription surfaces, and
  `WalletCreateEditForm`; `pnpm --filter web run build` is warning-free again.
- 2026-04-21: Closed `CQLT-25` by splitting `orders.service` into dedicated
  manual-context, quantity-rule, lifecycle, and exchange-connector ownership
  seams (`orders.manualContext.service.ts`, `orders.quantityRules.ts`,
  `orders.lifecycle.service.ts`, `exchangeConnectorFactory.service.ts`) while
  preserving `orders.service` as orchestration facade. API build and
  guardrails stayed green; DB-backed orders suites remain environment-blocked
  when local Postgres is unavailable.
- 2026-04-21: Closed `CQLT-26` by extracting wallet-context validation and
  strategy-projection drift ownership into
  `botContextValidation.service.ts` and
  `botStrategyProjectionDrift.service.ts`, reducing `botsCommand.service.ts`
  toward write-orchestration only.
- 2026-04-21: Closed `CQLT-27` by extracting backtest range, symbol
  preparation, replay timeline, and run-report lifecycle helpers into
  `backtestRange.service.ts` and `backtestReportLifecycle.service.ts` while
  keeping `backtests.service.ts` as route-facing orchestrator plus
  compatibility re-exports.
- 2026-04-21: Closed `CQLT-28` by introducing
  `exchangeConnectorFactory.service.ts` and rewiring `orders.service.ts` to one
  canonical authenticated/public `CcxtFuturesConnector` bootstrap path instead
  of local constructor duplication.
- 2026-04-21: Closed `CQLT-29` by adding focused API seam regressions for
  orders quantity rules, bot strategy-projection drift, backtest range
  helpers, and exchange connector factory bootstrap.
- 2026-04-21: Closed `CQLT-30` and `CQLT-32` by publishing fallback
  classification and legacy-bridge sunset inventory in
  `history/audits/code-quality-maintainability-inventory-2026-04-21.md`.
- 2026-04-21: Closed `CQLT-31` by replacing a hidden bot-write
  `baseCurrency -> USDT` fallback with explicit unresolved-state failure
  (`walletNotFound`) in `botsCommand.service.ts`.
- 2026-04-21: Closed `CQLT-33` by running the DB-backed API closure pack
  sequentially per file on local Postgres plus repository-wide
  `build/typecheck/guardrails/i18n-audit`, then publishing closure evidence in
  `history/plans/code-quality-maintainability-closure-2026-04-21.md`.

## Execution Waves

### CQLT-A - Inventory and Contract Freeze

- `CQLT-01 docs(contract): freeze maintainability remediation scope, anti-pattern taxonomy, and non-regression rules`
- `CQLT-02 audit(web): inventory component-local copy dictionaries and hardcoded user-facing strings by route/module`
- `CQLT-03 audit(structure): inventory oversized production modules and define extraction seams per file`
- `CQLT-04 audit(api): inventory exchange-bootstrap, fallback/default hotspots, and duplicated helpers across API modules`
- `CQLT-05 docs(decision): freeze extraction order and ownership rules for i18n, shared helpers, adapters, and monolith splits`

### CQLT-B - Guardrails for New Debt

- `CQLT-06 test(guardrails-red): block new component-local copy dictionaries in production web modules`
- `CQLT-07 test(guardrails-red): block new raw user-facing hardcoded strings outside canonical i18n/shared exception list`
- `CQLT-08 test(guardrails-red): add oversized-production-file budget audit with allowlist for staged decomposition`
- `CQLT-09 test(guardrails-red): add duplicate shared-helper inventory snapshot for dashboard/bots runtime formatting seams`
- `CQLT-10 docs(guardrails): publish exception policy for approved hardcoded values, legacy bridges, and file-budget allowlist`

### CQLT-C - Shared i18n and Error Fallback Foundations

- `CQLT-11 refactor(web-shared): move AuthContext and shared fallback error strings to canonical i18n-aware helpers`
- `CQLT-12 refactor(web-profile): migrate ApiKey/profile local copy dictionaries to namespaces or shared copy builders`
- `CQLT-13 refactor(web-strategies): migrate remaining local strategy list/edit copy maps to namespaces`
- `CQLT-14 refactor(web-wallets): split wallet form copy from form logic and remove embedded locale maps`
- `CQLT-15A chore(web-tooling): restore local route-reachable audit runtime so web i18n parity checks can execute in the current workspace`
- `CQLT-15B test(web-i18n): add focused regression coverage for newly migrated CQLT-C namespaces and route-bound key reachability assumptions`
- `CQLT-15C qa(web): run route-reachable translation parity audit for modules migrated in CQLT-C and sync closure evidence in canonical docs/context`

### CQLT-D - Shared Helper Extraction Before Big Splits

- `CQLT-16 refactor(web-shared): extract canonical DCA ladder helper used by dashboard and bots monitoring`
- `CQLT-17 refactor(web-shared): extract shared runtime badge/formatting helpers where dashboard and bots contracts match`
- `CQLT-18 refactor(web-shared): centralize recurring async list/page boilerplate helpers for load-error-retry state`
- `CQLT-19 test(web): add focused regressions proving helper extraction preserves dashboard/bots rendering parity`

Progress update:

- 2026-04-21: Closed `CQLT-16` by extracting one canonical `apps/web/src/features/shared/dcaLadderCell.tsx` helper, rewiring both dashboard home and bots monitoring to the same render path, adding focused regression coverage for zero/planned/executed/custom-format cases, and hardening `repoGuardrails` to tolerate tracked files that are deleted during staged refactors before commit.
- 2026-04-21: Closed `CQLT-17` by extracting shared runtime badge/formatting helpers into `apps/web/src/features/shared/runtimeMonitoringFormatters.ts`, rewiring dashboard home and bots monitoring helpers to the same status/side/lifecycle tone map plus compact-age formatter, and adding focused unit coverage for the shared contract.
- 2026-04-21: Closed `CQLT-18` by adding shared `runAsyncWithViewState` load/error helper in `apps/web/src/lib/async.ts`, rewiring profile hooks, strategies list, and wallet form initial page load to one `loading + error + retry` state contract, and replacing API keys hard reload retry with local refresh.
- 2026-04-21: Closed `CQLT-19` by extending the selected-bot dashboard vs preview parity suite with assertions for extracted DCA ladder and runtime trade labels, and by aligning bots preview DCA formatting with dashboard locale-aware formatting so both surfaces preserve the same rendered contract after `CQLT-16..18`.

### CQLT-E - Web Monolith Decomposition

- `CQLT-20 refactor(web-dashboard): split HomeLiveWidgets into controller-owned orchestration plus smaller sections/helpers without behavior changes`
- `CQLT-21 refactor(web-backtests): split BacktestRunDetails into read-model hooks, chart helpers, and presentational sections`
- `CQLT-22 refactor(web-bots): split BotsManagement and BotsMonitoringTab into tab controllers, tables, and summary sections`
- `CQLT-23 refactor(web-wallets): split WalletCreateEditForm into form state, metadata preview/reset actions, and presentation sections`
- `CQLT-24 test(web): run focused parity/regression pack for decomposed modules after each extraction`

Progress update:

- 2026-04-21: Closed `CQLT-20` by extracting runtime input parsing,
  direction/action/reason pill helpers, and position-edit draft typing from
  `HomeLiveWidgets.tsx` into
  `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeUiHelpers.tsx`,
  reducing the dashboard module toward controller-owned orchestration while
  keeping focused dashboard-home regressions, `web build`, and
  `quality:guardrails` green.
- 2026-04-21: Closed `CQLT-21` by extracting deterministic backtest detail
  view-model helpers into
  `apps/web/src/features/backtest/utils/backtestRunDetailsViewModel.ts`,
  moving summary/timeline chart rendering into
  `apps/web/src/features/backtest/components/backtestRunDetailsCharts.tsx`,
  reducing `BacktestRunDetails.tsx` from 2037 to 1137 lines while keeping
  focused backtests tests, `web build`, and `quality:guardrails` green.
- 2026-04-21: Closed `CQLT-22` by extracting dedicated assistant-tab and
  monitoring-section components under
  `apps/web/src/features/bots/components/` and `bots-management/`, reducing
  `BotsManagement.tsx` from 1093 to 826 lines and `BotsMonitoringTab.tsx` from
  1078 to 890 lines while keeping focused bots-management tests, `web build`,
  and `quality:guardrails` green.
- 2026-04-21: Closed `CQLT-23` by extracting wallet form state helpers,
  metadata/preview/reset action helpers, and presentational sections under
  `apps/web/src/features/wallets/components/wallet-create-edit-form/`,
  reducing `WalletCreateEditForm.tsx` from 791 to 483 lines while preserving
  focused wallet create/edit/reset behavior.
- 2026-04-21: Closed `CQLT-24` by running the focused decomposition regression
  pack across dashboard, preview parity, backtests, bots, and wallets
  (`46/46 PASS`) while `quality:guardrails` and `web build` stayed green.

### CQLT-F - API Monolith and Adapter Ownership Decomposition

- `CQLT-25 refactor(api-orders): split manual-order context, quantity-rule normalization, lifecycle authority, and persistence mapping out of orders.service`
- `CQLT-26 refactor(api-bots): split command validation, canonical bot context checks, and projection-drift helpers out of botsCommand.service`
- `CQLT-27 refactor(api-backtests): split range resolution, symbol preparation, report lifecycle, and timeline helpers out of backtests.service`
- `CQLT-28 refactor(api-exchange): centralize exchange/ccxt bootstrap and capability access behind narrower adapter entrypoints`
- `CQLT-29 test(api): add focused regression packs for orders, bots, backtests, and exchange-rule access after service decomposition`

Progress update:

- 2026-04-21: Closed `CQLT-25..CQLT-29` by extracting orders manual-context,
  quantity-rule, lifecycle, and connector seams; moving bot wallet-context and
  projection-drift ownership into dedicated services; moving backtest range,
  symbol-preparation, and run-lifecycle helpers into dedicated services;
  centralizing orders-side connector bootstrap through one exchange factory;
  and adding focused non-DB API regressions for the extracted seams. Validation
  PASS: `api focused seam tests`, `api build`, `quality:guardrails`.

### CQLT-G - Fallback, Legacy, and Closure Hardening

- `CQLT-30 docs(inventory): catalog fallback/default patterns as allowed, temporary, or forbidden`
- `CQLT-31 refactor(shared): replace forbidden hidden fallbacks in non-critical quality paths with explicit unresolved states where safe`
- `CQLT-32 docs(decision): freeze legacy bridge sunset list and mark compatibility-only code paths that remain intentional`
- `CQLT-33 qa(closure): run full quality closure pack and publish maintainability delta evidence`
- `CQLT-34 docs(sync): update queue/context/module docs and capture post-wave coding rules for future agents`

Progress update:

- 2026-04-21: Closed `CQLT-30` by classifying active fallback patterns as
  allowed, temporary, or forbidden in the maintainability inventory.
- 2026-04-21: Closed `CQLT-31` by removing hidden bot-write base-currency
  inference in favor of explicit unresolved wallet-context failure.
- 2026-04-21: Closed `CQLT-32` by freezing the remaining compatibility-only
  legacy bridges and sunset rule in the maintainability inventory.
- 2026-04-21: Closed `CQLT-33` with sequential DB-backed API suites for
  orders/backtests/bots plus repository-wide build/typecheck/guardrails and a
  refreshed route-reachable i18n audit artifact.
- 2026-04-21: Closed `CQLT-34` by synchronizing queue/context/planning docs to
  the real post-`CQLT-F` and partial `CQLT-G` state.

## Regression Strategy

Every refactor task in this wave must preserve behavior first, then improve
structure.

Required principles:

- extract, then move, then rename; do not rewrite logic and structure together
- add or update tests before shrinking a monolith seam
- keep one behavior domain per commit
- do not mix i18n migration with visual redesign
- do not mix exchange adapter tightening with trading rule changes

## Validation Matrix

Run only the checks relevant to the touched slice, but closure must prove:

- `pnpm run quality:guardrails`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm --filter api run test -- --run` for touched API suites
- `pnpm --filter web run test -- --run` for touched web suites
- `pnpm run build` when shared web/module structure changes
- `pnpm i18n:audit:route-reachable:web` whenever copy or namespaces move

## Expected Outcome

After `CQLT` closure, Soar should be easier to evolve because:

- UI strings have one canonical home
- shared concepts are not reimplemented in multiple places
- very large files are decomposed behind tested seams
- exchange ownership is tighter and easier to extend
- fallback behavior is catalogued instead of accidental
- future agents have explicit code-quality guardrails to follow
