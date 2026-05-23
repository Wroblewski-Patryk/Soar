# Task

## Header
- ID: DOC-CONTENT-GRAPH-HYGIENE-2026-05-23
- Title: Reduce Obsidian graph noise in canonical docs content
- Task Type: refactor
- Current Stage: verification
- Status: DONE
- Owner: Documentation/Memory
- Depends on: DOC-KNOWLEDGE-TAXONOMY-REFINEMENT-2026-05-23
- Priority: P2
- Module Confidence Rows: documentation/process only
- Requirement Rows: REQ-DOC-003
- Quality Scenario Rows: QAS-DOC-003
- Risk Rows: RISK-DOC-003
- Iteration: 2026-05-23-docs-graph
- Operation Mode: ARCHITECT
- Mission ID: DOC-CONTENT-GRAPH-HYGIENE-2026-05-23
- Mission Status: COMPLETED

## Context
The `docs/` graph is much cleaner after moving history, but canonical indexes
and maps still create dense Obsidian hubs because they link to too many targets.

## Goal
Keep the docs useful for humans and agents while reducing unnecessary graph
edges from broad index and map pages.

## Constraints
- Do not move runtime code or `apps/` source.
- Preserve high-signal navigation links.
- Prefer plain code paths for secondary references that do not need graph
  edges.
- Keep current source-of-truth docs discoverable.

## Definition of Done
- [x] Top docs hubs have fewer unnecessary markdown links.
- [x] Map files keep a small number of high-signal links.
- [x] Graph guidance explains how to use maps and history.
- [x] Markdown link validation and docs guardrails pass.

## Forbidden
- deleting documentation content needed by agents
- hiding canonical docs from indexes
- changing app/runtime behavior
- staging or committing without explicit request

## Validation Evidence
- Link-density scan: previous broad docs hubs were `docs/soar-documentation-map.md` `48` links,
  `docs/maps/agent-work-map.md` `22`,
  `docs/maps/architecture-map.md` `21`,
  `docs/maps/runtime-map.md` `21`,
  `docs/maps/release-ops-map.md` `17`, and
  `docs/maps/product-map.md` `13`. After content tuning, the top docs hub is
  `docs/operations/operations-documentation.md` at `10` links; `docs/soar-documentation-map.md` is `6`, and
  `docs/maps/*` files are `4-6`.
- Markdown link check: `1805` markdown files across `docs/`, `history/`,
  `.agents/`, and `.codex/`; `0` missing relative markdown targets.
- `pnpm run quality:guardrails`: PASS.
- `pnpm run docs:parity:check`: PASS.
- Reality status: verified documentation/content change only. No app/runtime
  behavior, deployment, production data access, secrets, or LIVE exchange
  mutation involved.
