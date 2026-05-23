# Scalability and Anti-Drift Foundation Plan (2026-04-22)

Status: Closed 2026-04-22
Wave: `SCALE-A`

## Objective

Remove the remaining structural causes of delivery drift after `CQLT` and
`L10NQ-E` so future V1 and V2 work extends one canonical system instead of
recreating ownership overlap, stale guardrails, or monolith growth.

This wave is not feature work. Its purpose is to make future feature work
predictable, reversible, and agent-friendly.

## Why We Keep Losing Time

The most expensive remaining sources of churn are:

- guardrails and inventories no longer matching the real codebase after recent
  cleanup waves
- exchange/bootstrap/metadata logic still spread across multiple API modules
- two large web containers still acting as mixed controller/view-model/view
  ownership zones
- tasks sometimes being too implicit, forcing each executor to rediscover
  intent from many files

If we do not close those roots now, V2 assistant/agent work will keep landing
on top of partial truth and the repository will drift again.

## Governing Contract

This wave is governed by:

- `docs/architecture/reference/scalability-anti-drift-delivery-contract.md`
- `docs/architecture/reference/maintainability-remediation-contract.md`

## Delivery Standards

- one task = one logical change and one commit
- each task below is intentionally self-sufficient and must be executable from
  this document without reconstructing hidden context elsewhere
- no feature work should be mixed into this wave
- every structural task must carry focused validation and docs/context sync in
  the same closure slice

## Frozen Workstreams

### SCALE-A Guardrail Truthfulness

Purpose:

- ensure repository enforcement reflects current reality, not historical
  exceptions that should already be gone

### SCALE-B Canonical Exchange Access Layer

Purpose:

- converge exchange client bootstrap, metadata resolution, symbol-rules access,
  and authenticated snapshot access into one canonical boundary

### SCALE-C Web Container Ownership Closure

Purpose:

- reduce `HomeLiveWidgets` and `BacktestRunDetails` from mixed ownership zones
  into predictable controller/view-model/section seams before more UI scope is
  added

### SCALE-D Closure and Future-Agent Discipline

Purpose:

- publish one closure pack and one coding-rule set so future agents have one
  clear source of truth instead of rediscovering it from history

## Task Packets

### SCALE-01 docs(contract): freeze anti-drift execution model and self-sufficient task-packet rule

Reason:

- future executors must have one canonical rule set for how remediation tasks
  are written and closed

In scope:

- `docs/architecture/reference/scalability-anti-drift-delivery-contract.md`
- queue/context activation for `SCALE-A`

Out of scope:

- code changes in production modules

Acceptance:

- anti-drift delivery contract exists and is linked from active planning state
- `SCALE-A` is promoted into canonical queue/context as the active next wave

Validation:

- docs-only sanity review

### SCALE-02 audit(guardrails-truth): diff current allowlists against actually closed hotspots

Reason:

- stale allowlists silently weaken the repository and allow regressions back
  into surfaces already cleaned

Primary scope:

- `scripts/repoGuardrails.mjs`
- `history/audits/code-quality-maintainability-inventory-2026-04-21.md`
- current `L10NQ-E` / `CQLT` closure evidence

Deliverable:

- exact map of allowlist entries that are now stale versus still intentional

Acceptance:

- every current allowlist entry is classified as one of:
  - still needed
  - removable now
  - replace with narrower rule

Validation:

- `pnpm run quality:guardrails`

### SCALE-03 refactor(guardrails): remove stale allowlists and add regression lock for reintroducing closed exceptions

Reason:

- once a hotspot is fixed, the guardrail must start protecting it again

Primary files:

- `scripts/repoGuardrails.mjs`
- relevant i18n/guardrail test files

Acceptance:

- stale local-copy and hardcoded-literal allowlist entries are removed
- closed surfaces from `L10NQ-E` and `CQLT` are again protected by default
- no remaining allowlist entry lacks a current documented reason

Validation:

- `pnpm run quality:guardrails`
- relevant focused web i18n/guardrail tests

### SCALE-04 docs(inventory-sync): refresh maintainability inventory and hotspot sizes to current code reality

Reason:

- planning on stale hotspot sizes causes bad prioritization and unnecessary
  future rediscovery

Primary files:

- `history/audits/code-quality-maintainability-inventory-2026-04-21.md`
- optional supporting artifact if new measurements are captured

Acceptance:

- current monolith line counts match actual files
- resolved hotspots are marked as historical/opening state, not present debt
- remaining seams are described in current, not historical, terms

Validation:

- docs-only sanity review

### SCALE-05 docs(contract): freeze canonical exchange access boundary and ownership matrix

Reason:

- multiple API modules still resolve exchange clients and metadata in parallel

Primary files:

- new or updated architecture/reference contract for exchange access ownership
- module docs if needed

Must answer explicitly:

- who owns public market-map loading
- who owns authenticated client bootstrap
- who owns wallet metadata resolution
- who owns symbol rules resolution
- who owns exchange snapshot reads

Acceptance:

- one canonical ownership matrix exists for exchange access families
- future tasks can implement against that matrix without reinterpretation

Validation:

- docs-only sanity review

### SCALE-06 audit(api-exchange): map remaining duplicate bootstrap and metadata flows in API

Reason:

- we need an exact before-state so future refactors do not miss hidden parallel
  paths

Primary scope:

- `apps/api/src/modules/orders/orders.service.ts`
- `apps/api/src/modules/positions/positions.service.ts`
- `apps/api/src/modules/exchange/exchangeSymbolRules.service.ts`
- `apps/api/src/modules/wallets/wallets.service.ts`
- any shared exchange adapter/factory modules

Acceptance:

- audit lists exact entrypoints still doing bootstrap, metadata fallback, or
  rules loading
- each entrypoint is classified as:
  - canonical owner
  - should delegate
  - temporary bridge

Validation:

- docs-only sanity review

### SCALE-07 refactor(api-exchange-read): centralize public market-map and symbol-rules access behind one read boundary

Reason:

- public exchange market loading and symbol rules should not keep spawning new
  one-off loaders

Primary goal:

- make `exchangeSymbolRules` and related public metadata flows delegate to one
  shared read boundary

Primary files:

- `apps/api/src/modules/exchange/exchangeSymbolRules.service.ts`
- new shared exchange-read service/module as needed
- any immediate callers that should consume it

Out of scope:

- authenticated position/order snapshot access

Acceptance:

- there is one canonical public market-map loading path
- symbol-rules logic no longer hides its own private bootstrap path

Validation:

- focused API tests for symbol rules / exchange read behavior
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`

### SCALE-08 refactor(api-exchange-auth): centralize authenticated exchange client access for positions and future snapshot/read consumers

Reason:

- authenticated exchange access is still duplicated and will grow worse with V2
  agent operations if not unified now

Primary files:

- `apps/api/src/modules/positions/positions.service.ts`
- shared authenticated exchange access layer/factory
- any immediately adjacent snapshot consumers

Acceptance:

- `positions.service.ts` no longer builds its own ad hoc Binance client
- authenticated snapshot access flows through one canonical boundary
- lifecycle for client creation/close/error handling is shared

Validation:

- focused API tests for exchange snapshot behavior
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`

### SCALE-09 refactor(api-wallet-metadata): converge wallet metadata, manual-order context, and symbol-rules dependencies onto one metadata contract

Reason:

- wallet metadata, manual-order context, and exchange rules should not each own
  parallel fallback policy

Primary files:

- `apps/api/src/modules/wallets/wallets.service.ts`
- exchange access layer files from `SCALE-07..08`
- any nearby consumers that now should delegate

Acceptance:

- one canonical metadata contract resolves exchange + market type + base
  currency fallback semantics
- wallets and adjacent consumers no longer duplicate metadata fallback policy

Validation:

- focused API regression pack for wallet metadata + affected consumers
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`

### SCALE-10 test(api-exchange): run focused regression pack for canonical exchange access layer

Reason:

- exchange unification is too risky to close without one reusable regression
  pack

Must validate:

- public metadata/rules path
- authenticated snapshot path
- wallet metadata contract
- no unexpected fallback drift

Validation:

- focused API test pack
- `pnpm run quality:guardrails`
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`

### SCALE-11 docs(contract): freeze container/controller/view-model split contract for `HomeLiveWidgets` and `BacktestRunDetails`

Reason:

- future widget growth must stop landing directly inside already large route
  containers

Primary files:

- planning/architecture docs for web container split contract

Must define explicitly:

- what remains in route container ownership
- what must be extracted to controller hooks
- what must be extracted to section presenters
- what belongs in shared view-model utilities

Acceptance:

- there is one written split contract for both large web containers
- future tasks can extend those screens without reopening ownership ambiguity

Validation:

- docs-only sanity review

### SCALE-12 refactor(web-dashboard): extract manual-order controller seam from `HomeLiveWidgets`

Reason:

- manual-order state and handlers are a dense, high-change zone and should not
  stay embedded in the main dashboard container

Primary files:

- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
- new dashboard-home controller/helper modules as needed

Acceptance:

- manual-order derivations, handlers, and submit path orchestration move behind
  a dedicated seam
- route container owns composition rather than detailed manual-order internals

Validation:

- focused dashboard-home tests
- `pnpm --filter web run typecheck`
- `pnpm --filter web run build`

### SCALE-13 refactor(web-dashboard): extract runtime tables and selected-bot summary presenters from `HomeLiveWidgets`

Reason:

- table-column ownership and selected-bot summary presentation should not keep
  living in the same giant component as the runtime page orchestrator

Primary files:

- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
- dedicated table/summary/presenter modules

Acceptance:

- open orders / positions / history table config ownership is extracted
- selected-bot summary presentation is extracted
- `HomeLiveWidgets.tsx` moves closer to container-only orchestration

Validation:

- focused dashboard-home tests
- `pnpm --filter web run typecheck`
- `pnpm --filter web run build`

### SCALE-14 refactor(web-backtests): extract timeline orchestration hook from `BacktestRunDetails`

Reason:

- timeline loading, chunking, and state merging is a controller concern and
  should not remain inline with route rendering

Primary files:

- `apps/web/src/features/backtest/components/BacktestRunDetails.tsx`
- new backtest timeline controller/hook module

Acceptance:

- timeline orchestration and cache/inflight ownership moves into a dedicated
  hook/service seam
- route component consumes the seam instead of hosting the state machine inline

Validation:

- focused backtests tests
- `pnpm --filter web run typecheck`
- `pnpm --filter web run build`

### SCALE-15 refactor(web-backtests): extract trades analytics and tab presenters from `BacktestRunDetails`

Reason:

- summary/trades analytics and tab rendering are still mixed into the route
  container and are likely growth hotspots

Primary files:

- `apps/web/src/features/backtest/components/BacktestRunDetails.tsx`
- supporting view-model/presenter modules

Acceptance:

- trades analytics, summary cards, and tab presenter ownership move out of the
  route container
- `BacktestRunDetails.tsx` drops below the current hotspot threshold or is left
  with one explicitly documented remaining seam only

Validation:

- focused backtests tests
- `pnpm --filter web run typecheck`
- `pnpm --filter web run build`

### SCALE-16 test(web-seams): run focused parity/regression pack for dashboard and backtests seam extraction

Reason:

- large-container decomposition must prove UI parity, not just compile

Must validate:

- dashboard selected-bot parity
- manual-order behavior parity
- backtests summary/markets/trades/raw parity
- extracted seam stability

Validation:

- focused web test pack
- `pnpm run quality:guardrails`
- `pnpm --filter web run typecheck`
- `pnpm --filter web run build`

### SCALE-17 docs(sync): publish closure evidence, future-agent coding rules, and residual backlog handoff

Reason:

- this wave only has value if future agents inherit one clear standard instead
  of another round of implicit tribal knowledge

Primary outputs:

- closure evidence doc under `docs/operations/`
- synced queue/context
- updated maintainability inventory / contracts if ownership changed
- explicit residual list, if anything remains intentionally deferred

Acceptance:

- queue, context, evidence, and inventories all agree on what was closed
- no executor needs to infer hidden follow-up from git history

Validation:

- closure doc sanity review
- confirm all required queue/context files are synchronized

## Recommended Execution Order

1. `SCALE-01..SCALE-04`
2. `SCALE-05..SCALE-10`
3. `SCALE-11..SCALE-16`
4. `SCALE-17`

## Definition of Done

- guardrails and inventories are truthful to the current repository state
- exchange bootstrap and metadata ownership no longer have parallel ad hoc
  entrypoints in the audited API scope
- `HomeLiveWidgets` and `BacktestRunDetails` are reduced to predictable
  orchestration roles with extracted seams
- one closure pack and one coding-rule set exist for future agents
- canonical queue/context/docs all agree on the post-wave state
