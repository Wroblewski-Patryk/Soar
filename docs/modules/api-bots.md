# API Deep-Dive: Bots Module

## Metadata
- Module name: `bots`
- Layer: `api`
- Source path: `apps/api/src/modules/bots`
- Owner: backend/trading-domain
- Last updated: 2026-04-20
- Related planning task: `MURC-07`

## 1. Purpose and Scope
- Owns bot command + runtime read APIs:
  - bot lifecycle CRUD
  - runtime graph and session observability
  - market-group and strategy-link orchestration
  - assistant config + dry-run contract
- Bridges bot writes to wallet/strategy/market-group constraints and subscription/consent checks.

Out of scope:
- Core signal loop internals (engine module).
- Raw exchange execution transport (exchange module).

## 2. Boundaries and Dependencies
- Mounted under `/dashboard/bots`.
- Depends on:
  - `prisma` bot/runtime persistence.
  - `engine` services (`runtimeSignalLoop`, execution orchestration, telemetry stores).
  - `wallets`, `subscriptions`, and consent/activation policy helpers.
  - symbol/risk/read-model enrichment helpers in module-local services/repositories.

## 3. Data and Contract Surface
- Command contracts:
  - `CreateBotDto`, `UpdateBotDto`, market-group/strategy link DTOs.
- Runtime read contracts:
  - sessions, symbol stats, positions, trades, runtime graph.
  - aggregate monitoring payload (`sessionDetail + symbolStats + positions + trades`).
- Assistant contracts:
  - get/upsert config, subagent slot operations, dry-run decision trace.
- Key invariants:
  - wallet-market context compatibility.
  - LIVE consent + opt-in requirements.
  - activation capability checks and duplicate active-bot protections.

## 4. Runtime Flows
- Create/update bot:
  1. Validate ownership of strategy/market-group/wallet.
  2. Derive mode/exchange/marketType/apiKey from wallet context.
  3. Validate consent + activation policy.
  4. Persist bot + canonical market-group/strategy-link state.
  5. For market-universe-backed auto-groups, resolve symbols using shared contract.
- Runtime read:
  - aggregate session telemetry, symbol stats, position/trade enrichment, fallback market data.
- Assistant dry-run:
  - load bot assistant config/subagents and execute deterministic orchestration trace.

## 5. API and UI Integration
- Representative routes:
  - `GET/POST/PUT/DELETE /dashboard/bots`
  - `GET /dashboard/bots/:id/runtime-graph`
  - `GET /dashboard/bots/:id/runtime-monitoring/aggregate`
  - `GET /dashboard/bots/:id/runtime-sessions*`
  - `GET /dashboard/bots/strategy-drift`
  - `POST /dashboard/bots/strategy-drift/repair`
  - `GET/POST/PUT/DELETE /dashboard/bots/:id/market-groups*`
  - `GET/PUT /dashboard/bots/:id/assistant-config`
  - `POST /dashboard/bots/:id/assistant-config/dry-run`

## 6. Security and Risk Guardrails
- Dashboard auth + ownership checks on all bot/runtime/assistant paths.
- LIVE activation requires explicit consent and capability validation.
- Mode-switch guard prevents unsafe PAPER->LIVE transitions with open managed positions.

## 7. Observability and Operations
- Runtime session/event/symbol stat telemetry integrated with engine services.
- Read models include stale/fallback handling for runtime market context.
- Extensive e2e coverage across create/update/runtime/entitlement scenarios.

## 8. Test Coverage and Evidence
- Primary tests:
  - `bots.e2e.test.ts`
  - `bots.orchestration.e2e.test.ts`
  - `bots.duplicate-guard.e2e.test.ts`
  - `bots.subscription-entitlements.e2e.test.ts`
- Suggested validation command:
```powershell
pnpm --filter api test -- src/modules/bots/bots.e2e.test.ts src/modules/bots/bots.orchestration.e2e.test.ts src/modules/bots/bots.duplicate-guard.e2e.test.ts src/modules/bots/bots.subscription-entitlements.e2e.test.ts
```

## 9. Open Issues and Follow-Ups
- Continue splitting oversized read/command surfaces where maintainability pressure is high.
- Complete error taxonomy migration for deterministic controller mapping.

## 10. Dashboard Ownership and Actionability Contract (`UXR-01`)
- Runtime positions read model (`listBotRuntimeSessionPositions`) is scoped to `managementMode=BOT_MANAGED` only.
- Dashboard `positions` rows for selected bot are allowed from:
  - direct ownership (`position.botId === selectedBotId`),
  - external takeover (`origin=EXCHANGE_SYNC`, `botId=null`) only if deterministic symbol ownership resolves to selected bot.
- Deterministic owner resolution for external symbol takeover is frozen as:
  - active bot first,
  - lower market-group `executionOrder`,
  - earlier bot `createdAt`,
  - lexical bot id tie-break.
- Close action (`closeBotRuntimeSessionPosition`) is fail-closed:
  - allowed only for `OPEN + BOT_MANAGED + wallet-compatible` rows owned directly or through external deterministic mapping,
  - all other paths return `status=ignored`, `reason=no_open_position`.
- External takeover audit statuses from positions module are non-actionable in dashboard close flow:
  - `UNOWNED`, `AMBIGUOUS`, `MANUAL_ONLY`.
- Dashboard `orders` contract for this module:
  - tab is always visible in LIVE and PAPER contexts,
  - rows are bot/wallet-scoped `BOT_MANAGED` open-order states (`PENDING`, `OPEN`, `PARTIALLY_FILLED`),
  - empty list is valid runtime state (tab must stay visible).

## 11. Selected-Bot Runtime Symbol Scope Contract (`BRS-01`)
- Runtime symbol scope for dashboard selected bot is strict and canonical by default:
  - only `ACTIVE + isEnabled` canonical `botMarketGroup + marketGroupStrategyLink` scope contributes symbols and strategy context.
  - `PAUSED` market-groups are excluded from default runtime read symbol scope used by dashboard `signals/markets`.
- Scope enrichment boundaries:
  - session stats and runtime-event fallback can enrich canonical selected-bot symbols only.
  - fallback paths cannot add symbols outside canonical selected-bot active scope.
- Strategy context precedence:
  - canonical mapping is authoritative.
  - legacy mapping is compatibility fallback only when canonical mapping is missing for selected bot/symbol, and cannot override canonical mapping.

## 12. Sidebar Strategy Projection Parity Contract (`SBSC`)
- `listBots` and `getBot` strategy projection (`strategyId`) must stay compatible with runtime graph primary strategy for the same bot.
- Strategy projection precedence for dashboard-facing read model:
  - canonical active+enabled `marketGroupStrategyLinks` first,
  - legacy `botStrategies` as compatibility fallback only.
- Drift policy:
  - legacy link state may exist for backward compatibility, but it cannot override canonical runtime topology in dashboard strategy contexts.
  - module should expose deterministic diagnostics/repair path for legacy-canonical divergence to support operations closure.

## 13. Aggregate Wallet Summary and Sidebar Edge Contract (`DAWR`)
- Aggregate read contract (`GET /dashboard/bots/:id/runtime-monitoring/aggregate`) must expose wallet-capital parity fields in `positions.summary`:
  - `referenceBalance`,
  - `freeCash`.
- Capital parity rules:
  - when aggregate source can resolve capital context, `referenceBalance/freeCash` are finite non-negative values.
  - when capital context cannot be resolved, aggregate keeps explicit `null` fields instead of omitting keys.
- Sidebar edge linkage:
  - selected-bot strategy context remains runtime-topology-first even when projected `strategyId` is null/mismatched.
  - compatibility fallback cannot override canonical runtime topology when canonical mapping exists.

## 14. Signals + Open Runtime Parity Contract (`SOPR`)
- Consolidated prerequisites:
  - `DAGG` selected-bot aggregate runtime-table contract.
  - `SBSC` selected-bot strategy projection + sidebar parity contract.
  - `DAWR` aggregate wallet-summary parity and sidebar null/mismatch edge contract.
- Selected-bot signal context contract:
  - symbol stats and signal context are selected-bot scoped only.
  - strategy context precedence:
    - latest runtime signal strategy context first when present,
    - canonical configured strategy fallback only when latest signal context is missing.
  - read model must expose explicit strategy-context source tag to avoid hidden fallback ambiguity:
    - `latest_signal`,
    - `configured_fallback`,
    - `unresolved`.
- Cross-surface parity contract:
  - API payloads consumed by `/dashboard` and `/dashboard/bots/:id/preview` for the same selected bot must remain parity-compatible for `signals`, `positions`, and `history`.
- Runtime diagnostics contract:
  - no-open blocked/ignored outcomes remain explicit and queryable in operational payload/log flows.

## 15. Market-Universe Symbol Contract Parity (`MURC`)
- Selected-bot runtime symbol scope that comes from market-universe-backed groups must use one shared formula:
  - `final = unique(filter_result U whitelist) - blacklist`.
- Edge rules:
  - `filter_result` exists only when `minQuoteVolumeEnabled=true`,
  - `filter off + empty whitelist` resolves to empty set,
  - blacklist-only input does not introduce symbols.
- Contract parity requirement:
  - runtime symbol scope, bot auto-created symbol-group snapshots, and cross-module consumers must stay parity-compatible for identical universe input.
