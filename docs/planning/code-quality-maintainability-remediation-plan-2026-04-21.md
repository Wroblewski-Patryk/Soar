# Code Quality and Maintainability Remediation Plan

Date: 2026-04-21  
Status: Queued  
Scope: planning only, no app-code changes in this task

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

Never start with broad “cleanup” refactors before inventory and regression
locks exist.

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
- `CQLT-15 test(web): lock route-reachable translation parity for modules migrated in CQLT-C`

### CQLT-D - Shared Helper Extraction Before Big Splits

- `CQLT-16 refactor(web-shared): extract canonical DCA ladder helper used by dashboard and bots monitoring`
- `CQLT-17 refactor(web-shared): extract shared runtime badge/formatting helpers where dashboard and bots contracts match`
- `CQLT-18 refactor(web-shared): centralize recurring async list/page boilerplate helpers for load-error-retry state`
- `CQLT-19 test(web): add focused regressions proving helper extraction preserves dashboard/bots rendering parity`

### CQLT-E - Web Monolith Decomposition

- `CQLT-20 refactor(web-dashboard): split HomeLiveWidgets into controller-owned orchestration plus smaller sections/helpers without behavior changes`
- `CQLT-21 refactor(web-backtests): split BacktestRunDetails into read-model hooks, chart helpers, and presentational sections`
- `CQLT-22 refactor(web-bots): split BotsManagement and BotsMonitoringTab into tab controllers, tables, and summary sections`
- `CQLT-23 refactor(web-wallets): split WalletCreateEditForm into form state, metadata preview/reset actions, and presentation sections`
- `CQLT-24 test(web): run focused parity/regression pack for decomposed modules after each extraction`

### CQLT-F - API Monolith and Adapter Ownership Decomposition

- `CQLT-25 refactor(api-orders): split manual-order context, quantity-rule normalization, lifecycle authority, and persistence mapping out of orders.service`
- `CQLT-26 refactor(api-bots): split command validation, canonical bot context checks, and projection-drift helpers out of botsCommand.service`
- `CQLT-27 refactor(api-backtests): split range resolution, symbol preparation, report lifecycle, and timeline helpers out of backtests.service`
- `CQLT-28 refactor(api-exchange): centralize exchange/ccxt bootstrap and capability access behind narrower adapter entrypoints`
- `CQLT-29 test(api): add focused regression packs for orders, bots, backtests, and exchange-rule access after service decomposition`

### CQLT-G - Fallback, Legacy, and Closure Hardening

- `CQLT-30 docs(inventory): catalog fallback/default patterns as allowed, temporary, or forbidden`
- `CQLT-31 refactor(shared): replace forbidden hidden fallbacks in non-critical quality paths with explicit unresolved states where safe`
- `CQLT-32 docs(decision): freeze legacy bridge sunset list and mark compatibility-only code paths that remain intentional`
- `CQLT-33 qa(closure): run full quality closure pack and publish maintainability delta evidence`
- `CQLT-34 docs(sync): update queue/context/module docs and capture post-wave coding rules for future agents`

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
