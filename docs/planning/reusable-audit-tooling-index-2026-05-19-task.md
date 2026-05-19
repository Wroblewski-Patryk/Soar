# Task

## Header
- ID: REUSABLE-AUDIT-TOOLING-INDEX-2026-05-19
- Title: Publish reusable audit tooling index
- Task Type: planning
- Current Stage: verification
- Status: DONE
- Owner: Planning Agent
- Depends on: `REUSABLE-AUDIT-RERUN-PLAYBOOK-2026-05-19`
- Priority: P2
- Module Confidence Rows: not applicable
- Requirement Rows: audit/source-of-truth continuity
- Quality Scenario Rows: documentation traceability
- Risk Rows: `RISK-036`
- Iteration: 2026-05-19 audit continuation
- Operation Mode: ARCHITECT
- Mission ID: FULL-REUSABLE-AUDIT-2026-05-19
- Mission Status: BLOCKED

## Context

The reusable audit system now has several helper scripts and package commands.
A concise tooling index makes the command set discoverable for future reruns.

## Goal

Publish a human-readable and machine-readable index of reusable audit tooling.

## Scope

- `docs/operations/reusable-audit-tooling-index-2026-05-19.md`
- `docs/operations/reusable-audit-tooling-index-2026-05-19.json`
- `docs/operations/reusable-audit-artifact-manifest-2026-05-19.md`
- `docs/operations/reusable-audit-artifact-manifest-2026-05-19.json`
- `.agents/core/project-memory-index.md`
- `.codex/context/TASK_BOARD.md`
- this task record

## Definition of Done

- [x] Tooling index Markdown and JSON pair exists.
- [x] Primary audit verification command is named.
- [x] Tool scripts and package commands are mapped.
- [x] Source-of-truth links are updated.
- [x] Validation commands pass.

## Forbidden

- accepting `DEC-AUD-001` or `DEC-AUD-002`
- changing runtime behavior
- production or LIVE/exchange mutation
- existing production data mutation

## Validation Evidence

- `corepack pnpm run audit:manifest:verify`: PASS.
- `corepack pnpm run audit:tooling-index:check`: PASS.
- `corepack pnpm run audit:tooling-index:check:test`: PASS.
- JSON parse for tooling index, manifest, rerun playbook, and handoff JSON:
  PASS.
- `corepack pnpm run docs:parity:check`: PASS.
- `corepack pnpm run quality:guardrails`: PASS.
- `git diff --check`: PASS with line-ending warnings only.
- Cleanup checks: no `chrome-headless-shell`, no `5432`/`6379` listeners, and
  no running Docker Compose services.
- Reality status: verified.

## Architecture Evidence

- Architecture source reviewed: reusable audit registry, manifest, rerun
  playbook, and project memory index.
- Fits approved architecture: yes.
- Mismatch discovered: no new mismatch.
- Decision required from user: no new decision; existing `DEC-AUD-001` and
  `DEC-AUD-002` remain open.
- Follow-up architecture doc updates: none.

## Result Report

- Task summary: published a reusable audit tooling index with Markdown and
  JSON artifacts.
- Files changed: tooling index pair, manifest, project memory index, task
  board, and this task record.
- How tested: manifest verify, JSON parse, docs parity, guardrails, diff
  check, cleanup checks.
- What is incomplete: no architecture/runtime decision was accepted.
- Next steps: choose `DEC-AUD-001` and `DEC-AUD-002`, or use the tooling index
  during the next full audit rerun.
- Decisions made: no product or architecture decision made.
