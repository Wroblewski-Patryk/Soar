# Task

## Header
- ID: ARCH-GRAPH-PROFILE-API-KEYS-BACKFILL-2026-05-24
- Title: Backfill Profile API Keys Architecture Evidence Chain
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Active chat coordinator
- Priority: P0
- Module Confidence Rows: Architecture Evidence Graph, Profile API Keys, Wallets, Exchange Adapter
- Requirement Rows: REQ-DOC-011
- Quality Scenario Rows: QAS-DOC-011
- Risk Rows: RISK-DOC-005
- Iteration: 11
- Operation Mode: BUILDER
- Mission ID: ARCH-EVIDENCE-GRAPH-2026-05-24
- Mission Status: CHECKPOINTED

## Context
Profile API Keys is the secret-handling bridge between profile UX, exchange credential probes, Wallets LIVE binding, and runtime exchange synchronization. It needed its own graph chain instead of being hidden inside Exchange Adapter or Wallets.

## Goal
Represent Profile API Keys as a first-class architecture evidence chain from profile UI through Web service, API routes, controller, DTOs, encrypted storage, probe services, exchange boundary, DB models, tests, docs, and downstream Wallets/Bot Runtime consumers.

## Scope
- `docs/architecture/registry/*.csv`
- `docs/architecture/relations/dependencies.csv`
- `docs/architecture/chains/chains.csv`
- generated Obsidian nodes and graph exports
- source-of-truth state files

## Implementation Plan
1. Inspect API/Web profile docs and API-key source files.
2. Add Profile API Keys nodes, typed registry rows, relations, and chain.
3. Regenerate graph outputs.
4. Update project state, task board, risk, requirements, quality scenarios, delivery map, module confidence, and active mission.

## Acceptance Criteria
- Profile API Keys has a dedicated feature node and function chain.
- API-key UI, Web service, API routes, controller, DTOs, service, probe service, exchange probe client, DB, tests, docs, and Wallets/Bot Runtime consumers are connected.
- Graph generation passes with zero missing targets/files.
- Records explicitly avoid raw secret values and do not claim production secret-bearing probe proof.

## Definition of Done
- [x] CSV source-of-truth updated.
- [x] `CHAIN-PROFILE-API-KEYS` generated.
- [x] Graph validation passes.
- [x] State files updated.

## Validation Evidence
- Tests: `pnpm run architecture:graph:generate` PASS.
- Manual checks: generated chain lists Profile API Keys UI/API/service/exchange/DB/test/doc path.
- High-risk checks: no raw credentials added; no production secret-bearing probe run.
- Reality status: verified_local.

## Result Report
- Task summary: Profile API Keys is now mapped as a secret-handling architecture graph chain.
- Files changed: architecture CSVs, generated graph outputs, state docs.
- How tested: graph generator.
- What is incomplete: Full repo backfill remains incomplete; fresh authenticated browser proof and secret-bearing production probe proof remain separate.
- Next steps: Continue backfilling remaining P0 modules, with Bot setup/Strategies/Markets/Backtests or auth/security surfaces as candidates.
