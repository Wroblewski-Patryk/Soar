# Task

## Header
- ID: ARCH-GRAPH-BOT-SETUP-BACKFILL-2026-05-24
- Title: Backfill Bot Setup Architecture Evidence Chain
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Active chat coordinator
- Priority: P0
- Module Confidence Rows: Architecture Evidence Graph, Bot Setup, Bot Runtime, Wallets, Profile API Keys
- Requirement Rows: REQ-DOC-012
- Quality Scenario Rows: QAS-DOC-012
- Risk Rows: RISK-DOC-005
- Iteration: 12
- Operation Mode: ARCHITECT
- Mission ID: ARCH-EVIDENCE-GRAPH-2026-05-24
- Mission Status: CHECKPOINTED

## Architecture Links

- Primary feature/module: Bot setup and canonical topology graph coverage.
- Architecture nodes: SOAR-FEATURE-BOT-SETUP; SOAR-PAGE-BOTS-LIST; SOAR-API-BOT-CREATE; SOAR-API-BOT-UPDATE; SOAR-DB-BOT; SOAR-TEST-BOT-SETUP-API.
- Function chains: docs/architecture/chains/CHAIN-BOT-SETUP.md.
- Affected files: docs/architecture/registry/nodes.csv; docs/architecture/relations/dependencies.csv; docs/architecture/chains/chains.csv; generated graph/status exports.
- Tests/proof: `pnpm run architecture:graph:generate` recorded in this task's Validation Evidence.
- Docs updated: architecture graph registries, Bot Setup chain output, generated graph exports, and source-of-truth state files.

## Context
Bot Runtime was already mapped, but bot creation/editing was still mixed into runtime. Bot setup is the upstream topology chain that binds Wallets, Profile API Keys, Strategies, and Market Universes before runtime execution can be trusted.

## Goal
Represent Bot Setup as a first-class architecture evidence chain across UI routes/components, Web service, API lifecycle routes, controller, DTOs, context validation, activation policy, canonical topology services, DB models, tests, and docs.

## Scope
- `docs/architecture/registry/*.csv`
- `docs/architecture/relations/dependencies.csv`
- `docs/architecture/chains/chains.csv`
- generated Obsidian nodes and graph outputs
- source-of-truth state files

## Acceptance Criteria
- Bot Setup has a dedicated feature node and function chain.
- Wallet, Profile API Keys, Strategy, Market Universe, BotMarketGroup, and MarketGroupStrategyLink dependencies are visible.
- Graph generation passes with zero missing targets/files.
- Runtime and assistant remain separate chains.

## Validation Evidence
- Tests: `pnpm run architecture:graph:generate` PASS.
- Manual checks: generated `CHAIN-BOT-SETUP.md` lists setup/topology execution path.
- Reality status: verified_local.

## Result Report
- Task summary: Bot Setup and canonical topology are now mapped as a separate P0 architecture graph chain.
- How tested: graph generator.
- What is incomplete: Dedicated Strategies, Markets, Backtests, Auth/Security, assistant and worker chains still need backfill.
- Next steps: Continue with Strategies or Markets because Bot Setup now exposes them as graph dependency leaves.
