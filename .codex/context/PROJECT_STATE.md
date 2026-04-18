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
- 2026-04-19: active execution focus moved to `ARC-A` after closing `PLNC-A`
  planning-catalog reconciliation.

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
  - production web `https://cryptosparrow.luckysparrow.ch`
  - production api `https://api.cryptosparrow.luckysparrow.ch`
- Backup / restore expectation: follow the backup verification and restore-drill
  runbooks and evidence pack process under `docs/operations/`
- Rollback trigger and method: stage-gate or post-deploy failure triggers
  rollback according to `docs/operations/deployment-rollback-playbook.md`

## Current Focus
- Main active objective: execute `ARC-A` architecture maintainability
  remediation foundations (`ARC-01..ARC-05`).
- Top blockers:
  - architecture hotspot decomposition still needs guardrail-frozen scope and
    extraction sequencing before implementation work starts.
- Success criteria for this phase:
  - `ARC-A` closes with explicit extraction boundaries and regression ownership.
  - canonical queue and context docs stay synchronized after each ARC batch.
  - no regressions in runtime safety, deploy confidence, or dashboard contracts.
- Next queued follow-up after `ARC-A`:
  - `ARC-B..ARC-E`,
  - lifecycle parity closure (`POS-36..42`),
  - production verification closure (`OPV`).

## Recent Progress
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
