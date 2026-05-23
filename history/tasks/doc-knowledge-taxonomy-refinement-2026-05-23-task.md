# Task

## Header
- ID: DOC-KNOWLEDGE-TAXONOMY-REFINEMENT-2026-05-23
- Title: Refine project knowledge taxonomy into semantic history folders
- Task Type: refactor
- Current Stage: verification
- Status: DONE
- Owner: Documentation/Memory
- Depends on: DOC-KNOWLEDGE-SYSTEM-RESTRUCTURE-2026-05-23
- Priority: P1
- Module Confidence Rows: documentation/process only
- Requirement Rows: REQ-DOC-002
- Quality Scenario Rows: QAS-DOC-002
- Risk Rows: RISK-DOC-002
- Iteration: 2026-05-23-docs-taxonomy
- Operation Mode: ARCHITECT
- Mission ID: DOC-KNOWLEDGE-TAXONOMY-REFINEMENT-2026-05-23
- Mission Status: COMPLETED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode is set to ARCHITECT because this is repository knowledge architecture.
- [x] The task is aligned with repository documentation governance.
- [x] `.agents/state/active-mission.md` was reviewed.
- [x] `.agents/state/next-steps.md` was reviewed.
- [x] `.codex/context/TASK_BOARD.md` was reviewed.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] No runtime, deploy, production, secret, or LIVE trading behavior is in scope.

## Mission Block
- Mission objective: refine `history/` from broad planning/operations buckets into semantic folders for tasks, plans, audits, evidence, artifacts, and releases.
- Release objective advanced: future agents can retrieve the right historical context with less noise and fewer false source-of-truth assumptions.
- Included slices: classify history files, move residual dated docs artifacts out of `docs/`, update references, update indexes/governance/state, validate links and docs checks.
- Explicit exclusions: no `apps/` source changes, no runtime behavior changes, no production deploy, no deletion of historical evidence.
- Checkpoint cadence: after classification, after moves/link rewrites, after validation.
- Stop conditions: ambiguous canonical ownership that would hide current truth, broken references that cannot be resolved safely, or user-owned edits blocking required updates.
- Handoff expectation: concise final report with taxonomy, files moved, validations, and residual risks.

## Responsibility Lanes

| Lane | Owner | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | Integration, task closure, state updates | Mission packet and final acceptance | Parent validation gate | DONE |
| History Taxonomy | Coordinator | `history/` folders and indexes | Semantic historical knowledge layout | Move manifest and link checks | DONE |
| Docs Boundary | Coordinator | `docs/` residual dated/audit artifacts | Current docs kept canonical | Docs inventory and parity | DONE |
| Tooling/References | Coordinator | scripts/package/docs references outside `apps/` | Updated output paths and links | Guardrails and stale-path scans | DONE |
| Memory Sync | Coordinator | `.agents/state/*`, `.codex/context/*` | Durable source-of-truth update | File review | DONE |

## Context
The first restructure moved historical planning and operations records out of `docs/`, but the initial history buckets remained too broad. The operator asked for a better project-level catalog so current plans and operations stay discoverable while historical task, audit, evidence, release, and raw artifact records have clear homes.

## Goal
Create a semantic repository knowledge taxonomy that improves Obsidian navigation and agent context retrieval without losing historical traceability.

## Success Signal
- `docs/` contains current source-of-truth documentation, active plans, and living operations.
- `history/` is split by information type, not by the old planning/operations bucket.
- Agents can distinguish task contracts, old plans, audits, human-readable evidence, raw artifacts, and release packets from folder path alone.
- Moved references resolve and validation passes.

## Deliverable For This Stage
Repository knowledge taxonomy refinement with indexes, reference rewrites, and validation evidence.

## Constraints
- preserve evidence; move, do not delete
- avoid `apps/` changes in this refinement
- do not overwrite unrelated user edits
- keep repository artifacts in English
- update source-of-truth memory files

## Definition of Done
- [x] `history/` semantic folders exist with README indexes.
- [x] Existing history files are classified and moved.
- [x] Residual dated/audit/generated artifacts under `docs/` are moved when they are not current docs.
- [x] References to moved files are rewritten.
- [x] Relevant docs/state/context files describe the taxonomy.
- [x] Docs/link validation and guardrails pass.

## Forbidden
- deleting evidence rather than moving it
- moving active plans or living runbooks out of `docs/`
- modifying `apps/` source during this docs taxonomy refinement
- hiding active tasks from the task board
- staging or committing without explicit request

## Validation Evidence
- Tests: `pnpm run quality:guardrails` PASS; `pnpm run docs:parity:check` PASS
- Manual checks: semantic history stale-path scan PASS with `0` old taxonomy path hits; markdown link check covered `1804` files across `docs/`, `history/`, `.agents/`, and `.codex/` with `0` missing relative targets; dated markdown scan under `docs/` returned no files; final history counts are `tasks=404`, `plans=257`, `audits=455`, `evidence=212`, `releases=162`, `artifacts=339`
- High-risk checks: no runtime/prod/live action
- Requirements matrix updated: yes, `REQ-DOC-002`
- Quality scenarios updated: yes, `QAS-DOC-002`
- Risk register updated: yes, `RISK-DOC-002`
- Reality status: verified

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/12_documentation-governance.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no; user requested the taxonomy refinement
- Follow-up architecture doc updates: update documentation governance and indexes

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: not applicable
- Rollback note: use move manifest to reverse path moves if needed
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable
