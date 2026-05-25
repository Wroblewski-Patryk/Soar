# Task

## Header
- ID: LUC-17
- Title: Architecture and function-chain known-state
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Architect
- Priority: P0
- Mission ID: LUC-17-ARCH-KNOWN-STATE-2026-05-25
- Mission Status: VERIFIED

## Context
Issue `LUC-17` requested a CTO-level known-state audit of Soar architecture and function chains after a failed previous heartbeat.

## Goal
Produce an evidence-backed architecture map with code-path references, identify doc trust status, and define the minimum architecture index needed before safe coding.

## Scope
- `docs/graphs/architecture-graph.md`
- `docs/graphs/function-journey-index.json`
- `docs/graphs/user-action-index.json`
- `apps/*`, `libs/*`, `scripts/*`, root `package.json` scripts
- source-of-truth state files

## Implementation Plan
1. Read graph exports and state ledgers.
2. Cross-check graph claims against real module surfaces (`apps`, `libs`, scripts).
3. Produce a CTO known-state report with statuses: implemented and verified / implemented but not verified / present in code, behavior unknown / missing.
4. Sync canonical state files.

## Acceptance Criteria
- Evidence-backed architecture summary exists with module responsibilities.
- Key workflows include function-chain/code-path references.
- Accurate vs stale/missing doc status is explicitly listed.
- Minimum architecture index for safe coding is defined.

## Definition of Done
- [x] Audit document created with evidence and risks.
- [x] Source-of-truth state files updated.
- [x] Residual blockers and next action are explicit.

## Validation Evidence
- `Get-Content -Raw docs/graphs/architecture-graph.md`
- `Get-Content -Raw docs/graphs/function-journey-index.json`
- `Get-Content -Raw docs/graphs/user-action-index.json`
- `Get-Content -Raw package.json`
- `Get-ChildItem apps/api/src/modules -Directory`
- `Get-ChildItem apps/web/src/features -Directory`
- `Get-ChildItem apps/mobile -Recurse -File`
- `Get-ChildItem libs -Directory`
- `Get-ChildItem scripts -Recurse -File`
- Reality status: `verified`

## Result Report
- Task summary: Completed CTO architecture/function-chain known-state audit and converted risks into explicit blockers.
- Files changed: this task file, `history/audits/cto-architecture-known-state-2026-05-25.md`, `.codex/context/TASK_BOARD.md`, `.codex/context/PROJECT_STATE.md`.
- How tested: direct repository and graph evidence inspection commands listed above.
- What is incomplete: protected production proofs remain blocked by infrastructure/auth gates; high-gap function/user-action proofs are still pending.
- Next steps:
  1. Run `pnpm run architecture:journey:triage -- --query <route|api|action|chain>` before each non-trivial change.
  2. Burn down high proof gaps starting with protected money/exchange actions.
  3. Keep `architecture:graph:drift:strict` and journey index regeneration mandatory in delivery gates.
