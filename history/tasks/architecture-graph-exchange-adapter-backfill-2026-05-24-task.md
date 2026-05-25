# Task

## Header
- ID: ARCH-GRAPH-EXCHANGE-ADAPTER-BACKFILL-2026-05-24
- Title: Backfill Exchange Adapter capability and connector graph
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Coordinator
- Depends on: ARCH-GRAPH-BOT-RUNTIME-BACKFILL-2026-05-24
- Priority: P0
- Module Confidence Rows: Exchange Adapter; Manual Orders; Positions; Bot Runtime; Architecture evidence graph
- Requirement Rows: REQ-DOC-009
- Quality Scenario Rows: QAS-DOC-009
- Risk Rows: RISK-DOC-005
- Iteration: 2026-05-24 graph backfill
- Operation Mode: BUILDER
- Mission ID: ARCH-EVIDENCE-GRAPH-SYSTEM-2026-05-24
- Mission Status: PARTIALLY_VERIFIED

## Mission Block
- Mission objective: expand the Obsidian-first graph into Exchange Adapter capability and connector boundaries after Manual Order, Positions, and Bot Runtime.
- Release objective advanced: future agents can trace exchange operation support, authenticated/public reads, connector construction, live order adapter, symbol rules, fee reconciliation, consumers, tests, and docs.
- Included slices: graph CSV records, dependency relations, function chain, typed registries, generated Markdown/JSON graph outputs, state updates.
- Explicit exclusions: no runtime behavior changes, no production proof, no LIVE exchange mutation.

## Context
Manual Order, Positions, and Bot Runtime all depend on exchange capability truth. The previous graph had a coarse Exchange Adapter node but not the exact service boundaries that prevent support inference mistakes.

## Goal
Backfill the Exchange Adapter deep graph so future impact analysis can trace exchange support through contracts, services, consumers, tests, and docs.

## Definition of Done
- [x] Exchange Adapter service/test/doc nodes are added to the graph source CSV.
- [x] Exchange Adapter dependency relations link capability contracts, read boundaries, connector factory, live adapter, symbol rules, fee reconciliation, consumers, tests, and docs.
- [x] Exchange Adapter deep chain is generated for Obsidian.
- [x] Relevant validation passes.

## Validation Evidence
- Tests: `pnpm run architecture:graph:generate` PASS with `142` nodes, `129` relations, `8` chains.
- Manual checks: inspected API Exchange docs, exchange ownership matrix, venue context contract, exchange service inventory, and exchange test inventory.
- High-risk checks: LIVE mutation excluded; authenticated read support is not treated as live mutation proof.
- Reality status: verified

## Architecture Evidence
- Architecture source reviewed: docs/modules/api-exchange.md; docs/architecture/reference/exchange-access-ownership-matrix.md; docs/architecture/reference/venue-context-source-of-truth-contract.md
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no

## Autonomous Loop Evidence
- Analyze: Exchange Adapter had coarse graph coverage only.
- Select: Exchange Adapter follows Manual Order, Positions, and Bot Runtime because they depend on exact exchange capability truth.
- Plan: append capability/read/connector/live-adapter/symbol-rule/fee/test/doc nodes and chain using existing schema.
- Execute: added `CHAIN-EXCHANGE-ADAPTER-DEEP` and related records.
- Verify: generator passed with `142` nodes, `129` relations, `8` chains.
- Self-review: kept this graph-only; no exchange behavior or production state changed.
- Update: state and task files updated.
