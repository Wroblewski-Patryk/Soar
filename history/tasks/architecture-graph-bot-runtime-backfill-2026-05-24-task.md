# Task

## Header
- ID: ARCH-GRAPH-BOT-RUNTIME-BACKFILL-2026-05-24
- Title: Backfill Bot Runtime monitoring graph
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Coordinator
- Depends on: ARCH-GRAPH-POSITIONS-BACKFILL-2026-05-24
- Priority: P0
- Module Confidence Rows: Bot Runtime; Dashboard runtime; Positions; Architecture evidence graph
- Requirement Rows: REQ-DOC-008
- Quality Scenario Rows: QAS-DOC-008
- Risk Rows: RISK-DOC-005
- Iteration: 2026-05-24 graph backfill
- Operation Mode: BUILDER
- Mission ID: ARCH-EVIDENCE-GRAPH-SYSTEM-2026-05-24
- Mission Status: PARTIALLY_VERIFIED

## Mission Block
- Mission objective: expand the Obsidian-first graph into Bot Runtime monitoring after Manual Order and Positions.
- Release objective advanced: future agents can trace runtime monitoring, aggregate reads, session positions, close-position commands, tests, and docs as one chain.
- Included slices: graph CSV records, dependency relations, function chain, typed registries, generated Markdown/JSON graph outputs, state updates.
- Explicit exclusions: no runtime behavior changes, no production proof, no LIVE exchange mutation, no bot create/edit/assistant deep backfill.

## Context
Manual Order and Positions were backfilled, but Bot Runtime still had coarse dashboard/runtime nodes. Bot Runtime is the operator-facing read model for sessions, aggregate payloads, positions, trades, symbol stats, and close-position actions.

## Goal
Backfill the Bot Runtime monitoring graph so future impact analysis can trace UI to API to services to DB/tests/docs.

## Definition of Done
- [x] Bot Runtime nodes are added to the graph source CSV.
- [x] Bot Runtime relations link UI, Web service, API routes, controller, services, DB, tests, and docs.
- [x] Bot Runtime core chain is generated for Obsidian.
- [x] Source-of-truth state files are updated.
- [x] Relevant validation passes.

## Validation Evidence
- Tests: `pnpm run architecture:graph:generate` PASS with `115` nodes, `103` relations, `7` chains.
- Manual checks: inspected API/Web Bots docs, runtime routes, controller runtime handlers, Web service runtime calls, aggregate service, positions read service, and test inventory.
- High-risk checks: LIVE mutation excluded; protected production runtime readback remains separate.
- Reality status: verified

## Architecture Evidence
- Architecture source reviewed: docs/modules/api-bots.md; docs/modules/web-bots.md; docs/architecture/04_runtime-contexts.md
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no

## Autonomous Loop Evidence
- Analyze: Bot Runtime had coarse graph coverage only.
- Select: Bot Runtime follows Positions because it is the main runtime read surface.
- Plan: append route/service/test/doc nodes and chain using existing schema.
- Execute: added `CHAIN-BOT-RUNTIME-CORE` and related records.
- Verify: generator passed with `115` nodes, `103` relations, `7` chains.
- Self-review: kept assistant/create/edit out of this slice to avoid mixing domains.
- Update: state and task files updated.
