# LUC-3722 Clear Architecture Graph Drift Guardrail - 2026-06-13

## Header
- ID: LUC-3722
- Title: [Soar][Docs] Clear architecture graph drift guardrail before source promotion
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Documentation Steward
- Priority: critical
- Module Confidence Rows: Architecture Evidence Graph / source-promotion guardrails
- Requirement Rows: REQ-DOC-031
- Quality Scenario Rows: local architecture traceability/tooling confidence
- Operation Mode: docs/memory loop
- Mission Status: VERIFIED_LOCAL

## Context
The source-promotion guardrail `pnpm run architecture:graph:drift:strict`
failed because the representative config/pipeline inventory included nested
Paperclip execution worktrees under `.paperclip/worktrees/`. Those copied
workspace files are not current Soar source truth and should not be counted as
architecture graph drift.

## Goal
Restore the architecture graph drift guardrail to a passing state without
hiding real Soar source, test, doc, config, or pipeline files.

## Scope
- `scripts/auditArchitectureGraphDrift.mjs`
- `scripts/auditArchitectureGraphDrift.test.mjs`
- generated drift outputs:
  - `docs/status/architecture-graph-drift.md`
  - `history/artifacts/architecture-graph-drift-2026-05-24.json`
- source-of-truth state updates for this issue

## Implementation
- Updated the drift audit walker to skip `.paperclip` directories alongside
  existing generated/dependency directories (`node_modules`, `.next`, `dist`,
  and `coverage`).
- Added focused regression fixture coverage proving copied routes under
  `.paperclip/worktrees/...` are ignored while real repo paths are still
  inventoried.
- Regenerated the drift markdown and JSON outputs through the existing strict
  guardrail command.

## Verification
- `node --test scripts/auditArchitectureGraphDrift.test.mjs` PASS (`5/5`).
- `pnpm run architecture:graph:drift:strict` PASS:
  `846/846 covered`, `0 missing`.
- `pnpm run quality:guardrails` PASS, including:
  `Architecture graph drift: OK (0 missing representative paths)`.

## Boundary
- No deploy, push, restart, rollback, env edit, protected smoke, production
  account use, secret/account readback, database/Redis mutation, raw log
  capture, screenshot, browser automation, exchange action, order, position,
  payment/subscription, or live-trading action occurred.
- This clears the local architecture graph drift/source-promotion guardrail
  only. It is not production smoke, worker readiness, rollback, restore, SLO,
  or release approval evidence.

## Result
Architecture graph drift guardrail is `VERIFIED_LOCAL` and no longer blocks
source promotion on false-positive nested Paperclip worktree inventory.
