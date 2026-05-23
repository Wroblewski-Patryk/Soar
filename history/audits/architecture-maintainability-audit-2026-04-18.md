# Architecture Maintainability Audit (2026-04-18)

Related historical plan: `history/plans/architecture-monolith-remediation-plan-2026-04-09.md`
Current active queue: `docs/planning/mvp-next-commits.md` (`BRS` remains the active implementation wave)

## Objective
- Give the planner an evidence-backed map of where the codebase still behaves like a monolith or violates maintainability-focused good practices.
- Focus on practical refactor targets: oversized modules, mixed responsibilities, hardcoded fallbacks, duplicated domain kernels, and weak architectural guardrails.
- Keep this report planning-oriented. It does not activate a new execution queue by itself.

## Canonical Queue Linkage
- Canonical queue owner: `docs/planning/mvp-next-commits.md` (`ARC-A..ARC-E`).
- Canonical phase owner: `docs/planning/mvp-execution-plan.md` (`ARC-01..ARC-20`).
- Activation rule: execute only through queued `ARC-*` items after `PLNC-A` closure.

## Method
- Reviewed current canonical project context and queue files before code inspection.
- Scanned `apps/api/src`, `apps/web/src`, `libs`, and `scripts/repoGuardrails.mjs`.
- Measured file-size hotspots, module-level line concentration, and repeated patterns.
- Sampled the largest production and test files directly to verify whether size reflects real architectural drift or only domain complexity.

## Current Snapshot

### Production file pressure
- Production source files above `500` lines: `30`
- Production source files above `700` lines: `16`
- Production source files above `1000` lines: `7`
- Total production source files scanned: `490`

### Largest production hotspots
- `apps/web/src/features/backtest/components/BacktestRunDetails.tsx` (`2038` lines)
- `apps/api/src/modules/backtests/backtests.service.ts` (`1482` lines)
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx` (`1412` lines)
- `apps/api/src/modules/bots/botsRuntimeRead.service.ts` (`1409` lines)
- `apps/api/src/modules/engine/runtimeSignalLoop.service.ts` (`1184` lines)
- `apps/web/src/features/bots/components/BotsManagement.tsx` (`1080` lines)
- `apps/web/src/features/bots/components/bots-management/BotsMonitoringTab.tsx` (`1078` lines)

### Largest test hotspots
- Test files above `500` lines: `12`
- Test files above `1000` lines: `4`
- Largest test files:
  - `apps/api/src/modules/bots/bots.e2e.test.ts` (`2219` lines)
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` (`2216` lines)
  - `apps/api/src/modules/engine/runtimeSignalLoop.service.test.ts` (`1465` lines)
  - `apps/web/src/features/bots/components/BotsManagement.test.tsx` (`1205` lines)

### Module concentration
- API module totals:
  - `engine`: `18479` lines
  - `bots`: `9226` lines
  - `backtests`: `7478` lines
- Web feature totals:
  - `bots`: `6548` lines
  - `dashboard-home`: `5825` lines
  - `backtest`: `5258` lines
- Shared workspace footprint remains effectively empty:
  - `libs/shared/index.d.ts` (`40` lines)

## Primary Findings

### F1. Runtime engine is still a critical-path god service
- Severity: `P1`
- Evidence:
  - `apps/api/src/modules/engine/runtimeSignalLoop.service.ts:169-230` reads many environment values directly and binds dependencies in the same file.
  - `apps/api/src/modules/engine/runtimeSignalLoop.service.ts:243-267` keeps long-lived in-memory routing, dedupe, queue, and watchdog state in one class.
  - `apps/api/src/modules/engine/runtimeSignalLoop.service.ts:301-1249` combines stream lifecycle, routing, watchdog, restart logic, pre-trade gating, telemetry, signal persistence, and execution.
  - `apps/api/src/modules/engine/runtimeSignalLoop.service.ts:862-1232` is a single end-to-end decision-and-execution path with several responsibilities chained together.
- Why this is a problem:
  - This is trading-critical code on the hottest runtime path.
  - A change in routing, telemetry, restart logic, or pre-trade checks can regress execution behavior because the same class owns all of them.
  - The large companion test file (`runtimeSignalLoop.service.test.ts`, `1465` lines) suggests verification complexity is also concentrated.
- Planner-ready task seeds:
  - Extract typed runtime config from direct `process.env` reads into a dedicated config module.
  - Split routing/index management from candle/ticker orchestration.
  - Split watchdog and auto-restart into a dedicated runtime supervisor.
  - Extract final-candle decision execution into a focused application service with narrow dependencies.

### F2. Bots runtime read layer violates read/write separation and depends on too many internal subsystems
- Severity: `P1`
- Evidence:
  - `apps/api/src/modules/bots/botsRuntimeRead.service.ts:1-65` imports Prisma, runtime stores, engine services, symbol resolution, strategy display, fallback market data, and command orchestration in one module.
  - `apps/api/src/modules/bots/botsRuntimeRead.service.ts:127-437` builds symbol-stat read models with parsing and enrichment logic inline.
  - `apps/api/src/modules/bots/botsRuntimeRead.service.ts:439-849` performs trade queries, lifecycle reconstruction, close-reason inference, and output shaping inline.
  - `apps/api/src/modules/bots/botsRuntimeRead.service.ts:851-1293` performs position reads, capital summary calculation, order enrichment, and runtime-state composition inline.
  - `apps/api/src/modules/bots/botsRuntimeRead.service.ts:1295-1474` also owns the close-position command path by calling `orchestrateRuntimeSignal(...)`.
  - Direct Prisma calls are spread through the file:
    `447`, `512`, `541`, `564`, `594`, `606`, `863`, `932`, `970`, `1038`, `1055`, `1065`, `1093`, `1303`, `1318`, `1338`, `1367`, `1378`, `1424`.
- Why this is a problem:
  - Query logic, enrichment logic, and command logic are coupled in one file.
  - Runtime read contracts are fragile because they depend on internal engine services and hidden fallback behavior.
  - Planner and reviewer cost is high because every change to sessions, positions, trades, or close flows lands in the same module.
- Planner-ready task seeds:
  - Split session, symbol-stats, trades, and positions into separate query services.
  - Move Prisma access behind dedicated read repositories per read model.
  - Move `closeBotRuntimeSessionPosition` into a command-oriented service.
  - Keep a thin facade only if the controller contract still needs a single entry point.

### F3. Backtest service is still a god service, and indicator logic is partially duplicated with runtime logic
- Severity: `P1`
- Evidence:
  - `apps/api/src/modules/backtests/backtests.service.ts:1-98` imports market lookup, execution logic, signal evaluation, many indicator calculators, fill model, queue/job code, repositories, and DTOs in one service.
  - `apps/api/src/modules/backtests/backtests.service.ts:288-1038` contains simulation, parity/event shaping, timeline behavior, and indicator-series building.
  - `apps/api/src/modules/backtests/backtests.service.ts:801-950` builds indicator projections and caches inline.
  - `apps/api/src/modules/backtests/backtests.service.ts:1193-1289` also owns list/get/delete/create application actions.
  - `apps/api/src/modules/engine/runtimeSignalDecisionEngine.ts:81-445` contains another large indicator-evaluation kernel with similar cached indicator builders.
  - Both modules directly use overlapping indicator primitives such as EMA, RSI, MACD, candle patterns, and derivative series:
    - Backtests: `backtests.service.ts:862`, `872`, `918`, `991`
    - Runtime: `runtimeSignalDecisionEngine.ts:165`, `172`, `355`, `445`
- Why this is a problem:
  - Runtime and backtest parity can drift because the same domain idea is projected through two separate orchestration kernels.
  - The service boundary is too wide: queueing, simulation, lifecycle persistence, and read APIs are all owned together.
  - The nearly empty `libs/shared` package means there is no real shared domain kernel absorbing this duplicated logic.
- Planner-ready task seeds:
  - Extract a shared indicator projection/evaluation kernel used by both backtest and runtime code.
  - Reduce `backtests.service.ts` to an application facade.
  - Keep job scheduling, simulation, report persistence, and timeline assembly in separate modules.
  - Add parity-focused regression tests around the extracted shared kernel before deleting duplicate logic.

### F4. Dashboard runtime UI is still a large feature monolith split only superficially
- Severity: `P1`
- Evidence:
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx:294-339` wires a large controller hook and many service dependencies directly into the page-level component.
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx:340-345` keeps edit and manual-order form state locally inside the same mega component.
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx:346-409` hardcodes onboarding IA links such as `/dashboard/wallets/list`, `/dashboard/markets/list`, `/dashboard/strategies/list`, `/dashboard/backtests/list`, `/dashboard/bots/create`, and `/dashboard/bots`.
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx:412-514` performs heavy runtime summary derivation and selected-bot view-model work inline.
  - `apps/web/src/features/dashboard-home/hooks/useHomeLiveWidgetsController.ts:131-255` owns bot loading, snapshot loading, polling, selection, and trade state.
  - `apps/web/src/features/dashboard-home/hooks/useHomeLiveWidgetsController.ts:288-507` adds local-storage persistence, timers, viewport tracking, and SSE refresh logic to the same hook.
- Why this is a problem:
  - View rendering, client-side orchestration, storage persistence, and live runtime transport are mixed together.
  - The visual split into subcomponents helps JSX readability, but the state and domain behavior are still centralized.
  - IA and route changes still require searching through feature components instead of a central navigation contract.
- Planner-ready task seeds:
  - Extract runtime summary and selected-bot derivations into dedicated view-model hooks.
  - Extract onboarding/nav targets into a route contract.
  - Split controller concerns into loading, persistence, and live-stream adapters.
  - Prefer an API/BFF aggregate for dashboard runtime snapshots so the web hook stops composing so much backend behavior itself.

### F5. Monitoring aggregation is performed in the client instead of behind an API read model
- Severity: `P1`
- Evidence:
  - `apps/web/src/features/bots/hooks/useBotsMonitoringController.ts:60-260` builds aggregated monitoring session data in the browser.
  - `apps/web/src/features/bots/hooks/useBotsMonitoringController.ts:441-516` loads up to `20` sessions and fans out per-session requests for stats, positions, and trades, then merges them client-side.
  - `apps/web/src/features/bots/hooks/useBotsMonitoringController.ts:581-669` adds timers and SSE refresh effects on top of that same aggregation layer.
- Why this is a problem:
  - The browser now owns business aggregation logic that should be stable, reusable, and testable on the API side.
  - The request pattern scales poorly and duplicates read-model composition that the backend already partly owns.
  - This increases the chance of web/API contract drift.
- Planner-ready task seeds:
  - Introduce an API aggregate monitoring endpoint or read-model service.
  - Keep the web hook focused on view state, filters, and transport lifecycle.
  - Reuse the aggregate contract in both monitoring UI and dashboard-home if possible.

### F6. `DataTable` is becoming a kitchen-sink shared primitive
- Severity: `P2`
- Evidence:
  - `apps/web/src/ui/components/DataTable.tsx:26-82` exposes a very broad prop surface for search, filtering, sorting, pagination, advanced filters, column visibility, settings layout, and advanced mode.
  - `apps/web/src/ui/components/DataTable.tsx:133-260` owns internal query state, sorting state, pagination state, column-visibility state, dropdown state, persistence, and rendering behavior in one component.
  - File size is already `714` lines.
- Why this is a problem:
  - Shared components with too many modes become risky to extend and difficult to reason about.
  - A regression in one table feature can impact unrelated screens because the component owns too many behaviors.
  - The API is already signaling primitive bloat.
- Planner-ready task seeds:
  - Split into smaller hooks/modules: sorting, pagination, column visibility, toolbar controls.
  - Keep a small wrapper component for current callers.
  - Add usage guidance so future features do not continue inflating the wrapper.

### F7. Hardcoded copy and route literals still bypass central contracts
- Severity: `P2`
- Evidence:
  - `apps/web/src/features/backtest/components/BacktestRunDetails.tsx:39-45` hardcodes status labels with locale branching (`en`, `pt`, `pl`) instead of namespace-driven i18n.
  - `apps/web/src/features/backtest/components/BacktestRunDetails.tsx:121-124` hardcodes exit-reason labels the same way.
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx:355-406` embeds dashboard route strings inline inside feature code.
- Why this is a problem:
  - It bypasses the i18n and docs-parity discipline already enforced elsewhere in the repo.
  - It makes route or copy changes more error-prone because behavior is hidden in large components.
  - This is smaller than the runtime monoliths, but it is repeatable debt and should be prevented early.
- Planner-ready task seeds:
  - Move remaining `BacktestRunDetails` labels into route-reachable namespaces.
  - Centralize dashboard IA links used by onboarding/runtime widgets.
  - Add a guardrail check for inline locale branching in feature components if false positives stay manageable.

### F8. Configuration and domain defaults are still scattered
- Severity: `P2`
- Evidence:
  - `apps/api/src/config/runtime.ts:48-67` already provides centralized runtime URL/origin configuration.
  - Despite that, `apps/api/src/modules/engine/runtimeSignalLoop.service.ts:169-207` reads many runtime environment values directly.
  - `apps/api/src/modules/orders/orders.service.ts:112-129` reads live pre-trade env values directly again.
  - `apps/api/src/modules/bots/botsRuntimeRead.service.ts:153-154`, `908-909`, and `1438-1439` default to `'BINANCE'` and `'FUTURES'` in several places.
  - `apps/api/src/modules/positions/positions.service.ts:19-23`, `38-41`, and `187-203` embed Binance-specific snapshot typing and connector defaults inside a generic positions service.
- Why this is a problem:
  - Config fallbacks are repeated instead of governed centrally.
  - Exchange assumptions leak into generic services, which blocks clean multi-exchange growth and makes capability ownership fuzzy.
  - Reviewers need to search many modules to understand the real runtime defaults.
- Planner-ready task seeds:
  - Introduce typed config readers per domain (`runtime`, `live-ordering`, `monitoring`) under `apps/api/src/config/`.
  - Move exchange defaults behind a capability/default registry.
  - Keep generic services exchange-agnostic and delegate exchange-specific behavior to adapters or exchange modules.

### F9. Guardrails are too weak to stop future monolith growth
- Severity: `P2`
- Evidence:
  - `scripts/repoGuardrails.mjs:18-22` allows `90_000` bytes for API source files and `105_000` bytes for web source files.
  - Current hotspots like `BacktestRunDetails.tsx`, `HomeLiveWidgets.tsx`, and `botsRuntimeRead.service.ts` can remain large without tripping a meaningful constraint.
- Why this is a problem:
  - The repository currently detects only extreme file bloat.
  - That means maintainability debt can keep growing while `quality:guardrails` stays green.
  - Architectural discipline depends too much on reviewer memory instead of automated enforcement.
- Planner-ready task seeds:
  - Replace byte budgets with more realistic thresholds after hotspot refactors.
  - Consider per-layer budgets or warnings for production files above `700-900` lines.
  - Keep an explicit allowlist only when justified by domain or generated constraints.

### F10. Test architecture mirrors production monoliths
- Severity: `P3`
- Evidence:
  - `apps/api/src/modules/bots/bots.e2e.test.ts` is `2219` lines.
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` is `2216` lines.
  - `apps/api/src/modules/engine/runtimeSignalLoop.service.test.ts` is `1465` lines.
- Why this is a problem:
  - Large tests slow down targeted maintenance and make it harder to isolate failures.
  - Test monoliths often signal that production seams are still too broad.
  - Planner should treat test-splitting as part of refactor closure, not as an optional cleanup.
- Planner-ready task seeds:
  - Split monolithic tests by behavior slice after the corresponding production seams are extracted.
  - Create reusable runtime/backtest fixtures to avoid giant scenario files.

## Suggested Sequencing After Current `BRS` Wave

### Wave `ARC-A`: runtime critical-path decomposition
1. Extract typed runtime config from `runtimeSignalLoop.service.ts` and `orders.service.ts`.
2. Extract runtime supervisor/watchdog from `runtimeSignalLoop.service.ts`.
3. Extract final-candle decision execution path from `runtimeSignalLoop.service.ts`.
4. Split companion runtime tests by responsibility.

### Wave `ARC-B`: bots runtime CQRS cleanup
1. Split `botsRuntimeRead.service.ts` into query services plus repositories.
2. Move close-position command out of the runtime read module.
3. Add a backend aggregate read model for monitoring.
4. Shrink web monitoring hook to transport and UI state only.

### Wave `ARC-C`: shared trading-domain kernel
1. Extract shared indicator projection/evaluation kernel used by runtime and backtests.
2. Reduce `backtests.service.ts` to an application facade.
3. Re-run parity tests for runtime versus backtest signal evaluation.

### Wave `ARC-D`: web container slimming
1. Split `HomeLiveWidgets` into stable view-model hooks and route/copy config.
2. Finish decomposing `BotsManagement` family around monitoring/assistant/list boundaries.
3. Move remaining hardcoded backtest labels to i18n namespaces.
4. Split `DataTable` into smaller primitives/hooks.

### Wave `ARC-E`: governance closure
1. Tighten guardrails after the hottest files are reduced.
2. Add architectural budget checks for production hotspots.
3. Publish an updated residual-risk snapshot when the first refactor wave closes.

## Notes For The Planner
- Do not activate this wave before the active `BRS` queue reaches a safe boundary.
- The highest-value targets are not simply the biggest files; the most urgent ones are the files that combine orchestration, persistence, and domain decisions on trading-critical paths.
- The most leverage comes from creating better seams, not from line-count gaming.
- There is no sign that `any` usage or committed build artifacts are the primary problem right now; the dominant debt is responsibility mixing and duplicated domain logic.
