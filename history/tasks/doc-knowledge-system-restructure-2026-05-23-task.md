# Task

## Header
- ID: DOC-KNOWLEDGE-SYSTEM-RESTRUCTURE-2026-05-23
- Title: Separate canonical documentation from historical work records
- Task Type: refactor
- Current Stage: verification
- Status: DONE
- Owner: Documentation/Memory
- Depends on: none
- Priority: P1
- Module Confidence Rows: SOAR-OPERATIONS-001
- Requirement Rows: REQ-DOC-001
- Quality Scenario Rows: QAS-DOC-001
- Risk Rows: RISK-DOC-001
- Iteration: 2026-05-23-docs
- Operation Mode: ARCHITECT
- Mission ID: DOC-KNOWLEDGE-SYSTEM-RESTRUCTURE-2026-05-23
- Mission Status: COMPLETED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode is set to ARCHITECT because this is a documentation architecture restructuring task.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed for long-running work.
- [x] Missing or template-like state tables were not required for this docs-only restructure.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence by reducing documentation/source-of-truth drift.

## Mission Block
- Mission objective: make `docs/` a canonical, navigable documentation vault and move historical task/evidence records into `history/`.
- Release objective advanced: future agents and operators can distinguish current product/architecture truth from historical proof and work logs.
- Included slices: classify docs, move historical records, update links, add docs/history indexes and Obsidian maps, update state/context.
- Explicit exclusions: no runtime behavior changes, no production deploy, no live trading mutation, no deletion of historical evidence.
- Checkpoint cadence: after classification, after moves/link rewrites, after validation.
- Stop conditions: ambiguous canonical ownership that would delete or hide required source-of-truth, broken validation that cannot be resolved safely, user-owned uncommitted changes blocking a required edit.
- Handoff expectation: concise summary of moved surfaces, validation, remaining risks, and next documentation improvement.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | AGENTS, mission-control, docs governance | Integration, task closure, source-of-truth updates | Mission packet and final acceptance | Parent validation gate | DONE |
| Documentation Architecture | Coordinator | `docs/architecture/12_documentation-governance.md`, `docs/index.md` | `docs/`, `history/`, maps | Canonical/history split | Path inventory and link checks | DONE |
| Tooling/References | Coordinator | scripts and package refs | scripts, package docs references | Updated generated-output paths and links | Guardrails and path scan | DONE |
| Documentation/Memory | Coordinator | `.agents/state/*`, `.codex/context/*` | Active mission, task board, project state | Durable project memory | File review | DONE |

### Lane Checks
- [x] `.agents/state/active-mission.md` will be refreshed for broad work.
- [x] `.agents/workflows/responsibility-lanes.md` was considered through AGENTS/project context.
- [x] Every important responsibility from source docs has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [x] Missing or unclear ownership will be recorded if discovered.
- [x] Process eval will be recorded because this is broad documentation restructuring.

## Context
The Obsidian graph showed a dense cloud of isolated documentation nodes. Repository inventory confirmed that `docs/planning/` and `docs/operations/` contain most historical task/evidence records, which makes canonical documentation hard for humans and agents to navigate.

## Goal
Move historical work records out of `docs/`, preserve them under `history/`, and add navigable documentation maps so canonical docs remain clear and agent-readable.

## Success Signal
- User or operator problem: Obsidian graph is noisy and agents may treat history as current truth.
- Expected product or reliability outcome: canonical docs are easier to browse and historical proof remains available without polluting current docs.
- How success will be observed: `docs/` has focused maps and reduced historical clutter; moved files have updated references; guardrails/link scans pass or residual risks are documented.
- Post-launch learning needed: yes

## Deliverable For This Stage
Repository documentation restructure with `history/` archive, updated indexes, and validation evidence.

## Constraints
- use existing systems and approved mechanisms
- do not delete historical evidence
- do not introduce runtime behavior changes
- preserve user-owned uncommitted work
- update scripts or references that point to moved historical files

## Definition of Done
- [x] Historical planning and operations records are moved to `history/` with index docs.
- [x] Canonical `docs/` entrypoints and maps explain how to navigate current truth.
- [x] References to moved files are rewritten or residual gaps are documented.
- [x] Relevant state/context files record the restructure.
- [x] Docs-only validation runs and results are recorded.

## Forbidden
- deleting evidence rather than moving it
- leaving canonical truth only in historical records
- rewriting unrelated product/runtime behavior
- hiding active tasks from the task board
- overwriting unrelated user edits

## Validation Evidence
- Tests: `pnpm run quality:guardrails` PASS; `pnpm run docs:parity:check` PASS
- Manual checks: moved-path stale reference scan PASS with `0` hits; markdown relative-link check covered `1732` files in `docs/` and `history/` with `0` missing targets; move manifest normalized with `1788` entries
- Screenshots/logs: Obsidian graph user screenshot informed task scope
- High-risk checks: no runtime/prod/live action
- Module confidence ledger updated: yes
- Requirements matrix updated: yes, `REQ-DOC-001`
- Quality scenarios updated: yes, `QAS-DOC-001`
- Risk register updated: yes, `RISK-DOC-001`
- Reality status: verified

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/12_documentation-governance.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no; user approved splitting history from docs
- Follow-up architecture doc updates: update documentation governance to name `history/`

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: not applicable
- Rollback note: revert file moves and link rewrites if the docs split blocks critical scripts
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable
