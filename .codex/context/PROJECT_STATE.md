# PROJECT_STATE

Last updated: 2026-04-19

## Product Snapshot
- Name: CryptoSparrow / Soar
- Goal: deliver a crypto-trading operations platform with backtest, paper, and
  live execution support, operator dashboards, and a path toward assistant or
  agent-driven workflows
- Commercial model: SaaS-style subscription product with staged entitlements
- Current phase: production hardening, localization closure, and dashboard UX
  polish on top of live-runtime safety

## Product Decisions (Confirmed)
- 2026-04-02: Coolify on VPS with explicit stage and prod split remains the
  default deployment topology.
- 2026-04-03: phased brand migration from `CryptoSparrow` to `Soar` is real,
  but deployment and domain safety are allowed to progress independently.
- 2026-04-12: docs parity is a formal delivery requirement for module, route,
  and IA changes.
- 2026-04-17: Portuguese rollout is locked to `pt-PT`; `pt-BR` is not part of
  the current localization wave.
- 2026-04-19: dashboard manual-order advanced UX wave (`UXR-H`) is closed
  end-to-end and execution focus moved to deployment-readiness follow-up.

## Technical Baseline
- Backend: Node.js 20+, Express API, Prisma, TypeScript
- Frontend: Next.js 15, React 19, TypeScript
- Mobile: none in current repository scope; responsive web and PWA-first
- Database: PostgreSQL
- Infra: Docker Compose locally, Coolify-targeted VPS deployment
- Hosting target: Coolify on VPS with stage and production environments
- Deployment shape: split `web`, `api`, worker services, `postgres`, and
  `redis`
- Runtime services: API service, web app, worker services for market-data,
  market-stream, backtest, and execution
- Background jobs / workers:
  - `market-data`
  - `market-stream`
  - `backtest`
  - `execution`
- Persistent storage: PostgreSQL and Redis
- Health / readiness checks:
  - `/health`
  - `/ready`
  - `/metrics`
  - `/workers/health`
- Environment files:
  - `apps/api/.env`
  - `apps/web/.env.local`
  - `.env.vps.example`
- Observability: runtime logs, metrics, SLO evidence artifacts, release and
  smoke packs under `docs/operations/`
- MCP / external tools: Playwright and Stitch-related UX docs available locally

## Validation Commands
- Lint: `pnpm run lint`
- Typecheck: `pnpm run typecheck`
- Unit tests: `pnpm --filter api run test -- --run` and
  `pnpm --filter web run test -- --run`
- Integration tests: targeted API or web Vitest packs by module
- E2E / smoke: `pnpm run test:go-live:smoke`
- Other high-risk checks:
  - `pnpm run quality:guardrails`
  - `pnpm i18n:audit:route-reachable:web`
  - `pnpm run build`

## Deployment Contract
- Primary deploy path: Coolify-managed VPS deployment with explicit stage and
  prod promotion flow
- Coolify app/service layout:
  - stage: `stage-web`, `stage-api`, worker services, `stage-postgres`,
    `stage-redis`
  - prod: `web`, `api`, worker services, `postgres`, `redis`
- Dockerfiles / compose paths:
  - `apps/api/Dockerfile`
  - `apps/web/Dockerfile`
  - `apps/api/Dockerfile.worker.market-data`
  - `apps/api/Dockerfile.worker.market-stream`
  - `apps/api/Dockerfile.worker.backtest`
  - `apps/api/Dockerfile.worker.execution`
  - `docker-compose.yml`
  - `docker-compose.vps.yml`
- Required secrets:
  - `DATABASE_URL`
  - `REDIS_URL`
  - `JWT_SECRET`
  - `API_KEY_ENCRYPTION_KEYS`
  - `API_KEY_ENCRYPTION_ACTIVE_VERSION`
  - exchange and optional CoinGecko credentials where in scope
- Public URLs / ports:
  - local web `http://localhost:3002`
  - local api `http://localhost:3001`
  - production web `https://soar.luckysparrow.ch`
  - production api `https://api.soar.luckysparrow.ch`
- Backup / restore expectation: follow the backup verification and restore-drill
  runbooks and evidence pack process under `docs/operations/`
- Rollback trigger and method: stage-gate or post-deploy failure triggers
  rollback according to `docs/operations/deployment-rollback-playbook.md`

## Current Focus
- Main active objective: execute `OPV-02` production takeover endpoint/private
  OPS probe verification after `OPV-01` rehearsal evidence capture.
- Top blockers:
  - stage rehearsal endpoint verification is blocked by missing stage Soar DNS
    records (`stage-api.soar.luckysparrow.ch`, `stage-soar.luckysparrow.ch`).
- Success criteria for this phase:
  - production verification phase closes `OPV-02..OPV-04` with refreshed gate
    status/sign-off and explicit external blocker accounting.
  - canonical queue and context docs stay synchronized after each ARC batch.
  - no regressions in runtime safety, deploy confidence, or dashboard contracts.
- Next queued follow-up:
  - lifecycle parity continuation (`POS-A` remaining `POS-37..POS-38`),
  - production verification closure wave (`OPV-A`, `OPV-01..OPV-04`).

## Recent Progress
- 2026-04-19: completed `OPV-01` by running Dockerfile-first rehearsal builds
  for `api`, `web`, and all worker images (`PASS`) and capturing deployment
  evidence in `docs/operations/opv-01-vps-rehearsal-2026-04-19.md` plus
  `_artifacts-opv-01-*` JSON/logs; production smoke on
  `api.soar.luckysparrow.ch` + `soar.luckysparrow.ch` passed, while stage
  rehearsal is blocked by missing stage Soar DNS records.
- 2026-04-19: closed `UXR-H` (`UXR-H-02..UXR-H-10`) end-to-end by delivering
  API manual-order context read contract + regression locks, web context/state
  integration, advanced runtime sidebar manual-order UX (`price`, market-fill,
  qty slider, side-aware summary, single-layer panel), EN/PL/PT i18n parity,
  and focused closure validation pack (`api/web tests`, `api/web typecheck`,
  `api/web build`, `quality:guardrails`).
- 2026-04-19: completed `UXR-H-01` by freezing dashboard manual-order advanced
  input/context contract across canonical decisions and module docs, including
  explicit unresolved `orderType -> MARKET` fallback and scope lock against
  TP/SL/reduce-only/TIF additions in this wave.
- 2026-04-19: completed `POS-36` by enforcing EXIT trace-only behavior in
  replay/interleaved backtest decision flow (`strategy_exit_trace_only`
  mismatch diagnostic), preserving lifecycle/final-candle close authority, and
  adding focused runtime final-candle EXIT trace-only regression lock.
- 2026-04-19: closed `ARC-E` (`ARC-19..ARC-20`) by tightening repository
  guardrails (source byte budgets + production line budgets) and publishing
  architecture maintainability closure snapshot in
  `docs/architecture/architecture-maintainability-closure-2026-04-19.md`.
- 2026-04-19: closed `ARC-C` (`ARC-11..ARC-13`) by introducing shared
  indicator kernel ownership (`strategyIndicatorKernel.ts`), rewiring runtime
  and backtest indicator projection/evaluation to the shared kernel path,
  extracting interleaved portfolio simulation ownership into
  `backtestPortfolioSimulation.service.ts`, and adding runtime-vs-backtest
  parity regression lock (`backtestRuntimeKernelParity.test.ts`).
- 2026-04-19: queued `UXR-H` manual-order advanced UX execution wave in
  `docs/planning/uxr-h-dashboard-manual-order-advanced-plan-2026-04-19.md`
  with grouped tiny-commit batches (`UXR-H-A..UXR-H-C`) covering price input
  and market-price quick fill, minimum executable quantity constraints, slider
  row ergonomics, bot-context order metadata, side-aware cost/max summary, and
  focused closure validation requirements.
- 2026-04-19: closed `ARC-B` (`ARC-06..ARC-10`) end-to-end by extracting
  runtime trades/positions read seams, moving runtime close-position command
  ownership into command service boundaries, introducing API aggregate
  monitoring endpoint (`GET /dashboard/bots/:id/runtime-monitoring/aggregate`),
  and switching web aggregate monitoring to API-first with deterministic client
  fallback.
- 2026-04-19: completed `ARC-10` API+WEB monitoring contract lock with focused
  tests (`bots.monitoring-aggregate.e2e.test.ts`, `botsMonitoringAggregate.service.test.ts`)
  and deployment-facing validation pack (`api build`, `web build+typecheck`,
  `quality:guardrails`).
- 2026-04-19: completed `ARC-09` by implementing backend aggregate monitoring
  read-model service (`runtimeMonitoringAggregateRead.service.ts`) and
  controller/route exposure for web consumers.
- 2026-04-19: completed `ARC-08` by extracting runtime close-position command
  orchestration from read service into `runtimeSessionPositionCommand.service.ts`.
- 2026-04-19: completed `ARC-07` by extracting runtime trades/positions read
  ownership into dedicated repositories/services
  (`runtimeSessionTradesRead*`, `runtimeSessionPositionsRead*`).
- 2026-04-19: Completed `ARC-06` by extracting bots runtime session list/detail
  ownership into `runtimeSessionRead.service.ts` and symbol-stats read-model
  ownership into `runtimeSessionSymbolStatsRead.service.ts`, reducing
  `botsRuntimeRead.service.ts` to trades/positions/close responsibilities for
  the next ARC-B decomposition step.
- 2026-04-19: closed `ARC-D` (`ARC-14..ARC-18`) end-to-end: extracted
  `HomeLiveWidgets` onboarding/view-model seams, moved bots monitoring
  aggregation into dedicated service ownership, split DataTable
  column-visibility helper ownership, removed `BacktestRunDetails` locale
  branch literals, and added seam-focused regression locks.
- 2026-04-19: completed `ARC-18` regression closure pack with new focused tests
  (`runtimeOnboardingConfig.test.tsx`,
  `botsMonitoringAggregate.service.test.ts`,
  `useDataTableColumnVisibilityState.test.ts`) and validation
  (`pnpm --filter web run typecheck` + focused ARC-D pack => `37/37 PASS`).
- 2026-04-19: Completed `ARC-05` by splitting runtime regression ownership into
  seam-scoped suites (`runtimeSignalLoopSupervisor.test.ts`,
  `runtimeFinalCandleDecision.service.test.ts`) and locking the final-candle
  no-trade path with corrected null-direction fixture behavior.
- 2026-04-19: closed `ARC-A` (`ARC-01..ARC-05`) end-to-end and advanced
  canonical queue/context focus to `ARC-B`.
- 2026-04-19: Completed `ARC-04` by extracting the final-candle runtime
  decision/execution flow into `runtimeFinalCandleDecision.service.ts` and
  reducing `runtimeSignalLoop` to routing/delegation ownership.
- 2026-04-19: Completed `ARC-03` by extracting runtime supervisor/watchdog
  orchestration into `runtimeSignalLoopSupervisor.ts` and rewiring
  `runtimeSignalLoop` to callback-based supervisor ownership while preserving
  runtime-loop regression behavior.
- 2026-04-19: Completed `ARC-02` by extracting typed runtime execution config
  into `apps/api/src/config/runtimeExecution.ts` and wiring
  `runtimeSignalLoop`/`orders.service` to centralized config parsing with
  dedicated config tests (`runtimeExecution.test.ts`).
- 2026-04-19: Completed `ARC-01` by freezing runtime maintainability
  decomposition boundaries and anti-drift guardrails in
  `docs/architecture/runtime-critical-path-decomposition-contract.md` and
  linking the decision in `open-decisions` before code extraction starts.
- 2026-04-19: closed `PLNC-A` (`PLNC-01..PLNC-04`) by publishing deterministic
  planning classification index (`implemented/queued/external-blocked/superseded`),
  syncing stale planning status headers, adding canonical queue linkage in
  non-closed plans, and synchronizing closure state across canonical queue and
  context docs.
- 2026-04-18: closed `UXR-G` (`UXR-G-01..UXR-G-06`) end-to-end: manual-order
  section is now a peer block below wallet, wallet summary row order is
  `Allocation -> Delta -> Portfolio`, free-funds/in-positions split is `50/50`,
  and focused closure checks passed (`web dashboard-home tests`, `web typecheck`,
  `web build`).
- 2026-04-18: completed planning-catalog coverage audit and queued post-active
  execution waves (`PLNC`, `ARC`, `POS`, `OPV`) via
  `docs/planning/planning-catalog-coverage-follow-up-plan-2026-04-18.md`,
  keeping active `BRS` queue unchanged.
- 2026-04-18: published maintainability audit report for planner handoff in `docs/planning/architecture-maintainability-audit-2026-04-18.md`, refreshing monolith/hardcode hotspots, weak guardrails, and planner-ready refactor slices without changing the active `BRS` execution queue.
- 2026-04-17: closed `BTMM-C`, `L10NQ-A`, `L10NQ-B`, `L10NQ-C`, `UXR-D`,
  `DOCSYNC-A`, and `A11Y-A` waves with evidence-backed validation.
- 2026-04-18: closed `L10NQ-D-B` (`L10NQ-D-06..10`) and published follow-up
  planning for selector parity and dashboard form-system unification.
- 2026-04-18: closed `UXR-F-A` (`UXR-F-01..UXR-F-04`) by freezing Stage A
  migration boundaries, adding shared `ui/forms` core+field primitives with
  tests, and enforcing cross-feature generic form import guardrails.
- 2026-04-18: closed `UXR-F-B` (`UXR-F-05..UXR-F-08`) by unifying create/edit
  wrapper i18n shell copy and migrating wallets/markets/backtests create-edit
  forms to shared `ui/forms` primitives with focused regression evidence.
- 2026-04-18: closed `UXR-F-D` (`UXR-F-13..UXR-F-14`) with focused form/i18n
  regression pack (`33/33` tests PASS), final web `typecheck` + `build` PASS,
  and canonical queue/context synchronization with closure artifacts.
- 2026-04-18: executed derived tiny continuation task `QH-LINT-01` by removing
  four `no-unused-vars` warnings in dashboard/bots surfaces and revalidating
  web build/typecheck; this opened final warning debt cleanup slice.
- 2026-04-18: completed `QH-LINT-02` by resolving remaining
  `react-hooks/exhaustive-deps` warnings in
  `BacktestsRunsTable`/`WalletsListTable`; `web build` and `web typecheck` are
  now green without warning debt in this tracked closure scope.
- 2026-04-18: completed `QH-TSC-01` by adding canonical sequential web
  verification command (`pnpm run web:verify:build-typecheck`) and documenting
  it for closure packs to avoid manual command-order drift.
- 2026-04-18: activated `BRS` wave from canonical planning queue (`BRS-01..12`)
  and closed `BRS-01` decision gate: selected-bot runtime symbol scope is
  strict canonical by default (`ACTIVE + isEnabled` only, `PAUSED` excluded),
  with no symbol expansion from fallback paths.
- 2026-04-18: completed `BRS-A` implementation (`BRS-02..BRS-04`) by adding a
  dedicated selected-bot scope regression in bots API e2e suite and hardening
  runtime symbol scope to canonical `ACTIVE` groups only in repository/service
  layers (`botsRuntimeRead.repository.ts`, `runtimeStrategyDisplayBySymbol.service.ts`,
  `botsRuntimeRead.service.ts`); local available validations PASS
  (`api typecheck`, `quality:guardrails`).
- 2026-04-18: completed `BRS-B` implementation (`BRS-05..BRS-08`) by adding a
  canonical update-path regression, implementing transactional canonical
  `PUT /dashboard/bots/:id` mapping sync in `botsCommand.service.ts`,
  enforcing canonical-first strategy precedence in
  `runtimeSymbolStatsEnrichment.service.ts`, and publishing dedicated
  scope-regression tests in `bots.runtime-scope.e2e.test.ts`.
  Validation: `pnpm --filter api run typecheck` PASS,
  `pnpm run quality:guardrails` PASS,
  `pnpm --filter api test -- src/modules/bots/bots.runtime-scope.e2e.test.ts`
  => `3/3 PASS`.
- 2026-04-18: queued post-`BRS` `UXR-G` dashboard runtime sidebar layout wave
  (manual-order section below wallet as peer block, wallet summary row order
  polish, and 50/50 free-funds/in-positions split) in
  `docs/planning/uxr-g-dashboard-wallet-manual-order-layout-plan-2026-04-18.md`.
- 2026-04-18: refreshed the repo-specific agent workflow so the canonical queue,
  validation contract, deployment contract, and learning journal are aligned.

## Working Agreements
- Keep task board and project state synchronized.
- Keep planning docs synchronized with task board.
- Keep changes small and reversible.
- Validate touched areas before marking done.
- Keep repository artifacts in English.
- Communicate with users in their language.
- Delegate with explicit ownership and avoid overlapping subagent write scope.
- Use the default loop:
  `plan -> implement -> test -> architecture review -> sync context`.
- Treat deployment docs and smoke checks as part of done-state for runtime
  changes.

## Canonical Context
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/LEARNING_JOURNAL.md`
- `.agents/workflows/general.md`
- `.agents/workflows/subagent-orchestration.md`

## Canonical Docs
- `docs/README.md`
- `docs/product/overview.md`
- `docs/product/product.md`
- `docs/architecture/system-architecture.md`
- `docs/architecture/runtime-signal-merge-contract.md`
- `docs/architecture/assistant-runtime-contract.md`
- `docs/modules/system-modules.md`
- `docs/engineering/local-development.md`
- `docs/engineering/testing.md`
- `docs/planning/mvp-execution-plan.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/open-decisions.md`
- `docs/governance/working-agreements.md`
- `docs/governance/language-policy.md`
- `docs/governance/repository-structure-policy.md`
- `docs/governance/subagent-delegation-policy.md`
- `docs/operations/coolify-linux-vps-setup-guide.md`
- `docs/operations/post-deploy-smoke-checklist.md`
- `docs/operations/deployment-rollback-playbook.md`
- `docs/ux/ux-ui-mcp-collaboration.md`
- `docs/ux/dashboard-design-system.md`

## Optional Project Docs
- Add only if the repository truly needs them.
- Record their canonical paths here once they exist.
