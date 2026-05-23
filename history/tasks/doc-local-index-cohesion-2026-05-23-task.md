# Task

## Header
- ID: DOC-LOCAL-INDEX-COHESION-2026-05-23
- Title: Connect canonical docs through local folder indexes
- Task Type: refactor
- Current Stage: verification
- Status: DONE
- Owner: Documentation/Memory
- Depends on: DOC-CONTENT-GRAPH-HYGIENE-2026-05-23
- Priority: P2
- Module Confidence Rows: documentation/process only
- Requirement Rows: REQ-DOC-004
- Quality Scenario Rows: QAS-DOC-004
- Risk Rows: RISK-DOC-004
- Iteration: 2026-05-23-docs-cohesion
- Operation Mode: ARCHITECT
- Mission ID: DOC-LOCAL-INDEX-COHESION-2026-05-23
- Mission Status: COMPLETED

## Context
The docs graph improved after moving history out of `docs/` and reducing broad
map link density, but many current canonical files still appear as isolated
nodes because folder indexes use plain paths or are missing.

## Goal
Keep global docs maps light while connecting current documentation files through
their nearest folder-level index, so Obsidian shows meaningful clusters instead
of isolated dots.

## Constraints
- Do not move runtime code or `apps/` source.
- Do not move large groups of docs without evidence that they are historical.
- Keep current source-of-truth docs in `docs/`.
- Prefer local folder indexes over a single large global index.
- Preserve validation: markdown links, docs parity, and guardrails must pass.

## Definition of Done
- [x] Folder-level indexes exist for major docs domains that lacked them.
- [x] Existing folder indexes link to their current canonical files.
- [x] `docs/documentation-overview.md` and `docs/soar-documentation-map.md` describe the graph model clearly.
- [x] Orphan count is reduced without reintroducing a single oversized global hub.
- [x] Markdown link validation and docs guardrails pass.

## Forbidden
- deleting current documentation content
- hiding canonical docs from navigation
- treating historical proof files as current docs
- changing app/runtime behavior
- staging or committing without explicit request

## Validation Evidence
- Graph metrics: `260` docs markdown files, `0` no-incoming files excluding
  `docs/soar-documentation-map.md` and `docs/documentation-overview.md`, and `0` fully isolated docs files.
  Pre-fix scan had `200` no-incoming docs files and `193` fully isolated docs
  files.
- Markdown link check: `1811` markdown files across `docs/`, `history/`,
  `.agents/`, and `.codex/`; `0` missing relative markdown targets.
- `pnpm run quality:guardrails`: PASS.
- `pnpm run docs:parity:check`: PASS.
- `git diff --check`: no whitespace errors; Windows CRLF warnings only.
- Reality status: verified documentation/content change only. No app/runtime
  behavior, deployment, production data access, secrets, or LIVE exchange
  mutation involved.
