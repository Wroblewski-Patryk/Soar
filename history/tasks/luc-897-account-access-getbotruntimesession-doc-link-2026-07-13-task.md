# Task

## Header
- ID: LUC-897
- Title: Account access `getBotRuntimeSession` missing-doc-link closure
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Product Docs Agent
- Depends on: none
- Priority: P1
- Module Confidence Rows: not applicable
- Requirement Rows: Account access controller doc-link truth
- Quality Scenario Rows: not applicable
- Risk Rows: app-completion Account access doc-link risk
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-897-ACCOUNT-ACCESS-GETBOTRUNTIMESESSION-DOC-LINK-2026-07-13
- Mission Status: VERIFIED

## Context

`docs/status/project-truth-index.md` routed
`apps/api/src/modules/bots/bots.controller.ts#getBotRuntimeSession` as the
current Account access `missing_doc_link` row after the earlier test-link drift
repair moved the controller off the incorrect `missing_test_link` lane.

## Goal

Resolve the remaining docs-owned source-truth gap for
`bots.controller.ts#getBotRuntimeSession` and prove that the generated
architecture-awareness, app-completion, and project-truth outputs ingest the
new linkage.

## Constraints

- Use existing architecture-awareness and project-truth generation paths.
- No runtime code, deploy, push, restart, rollback, env edits, migrations, or
  protected account/session checks.
- Keep the scope to the single Account access row.

## Definition of Done

- [x] `docs/modules/api-bots.md` documents
      `bots.controller.ts#getBotRuntimeSession`.
- [x] Documentation-link inputs and scanner overrides include the scoped
      controller.
- [x] Generated readback proves the controller is no longer a
      `missing_doc_link` gap.

## Validation Evidence

- Tests:
  - `pnpm run architecture:graph:drift:strict`
- Manual checks:
  - direct readback of the docs row, CSV row, override relation, app-completion
    priority queue, and project-truth gaps
- Screenshots/logs:
  - `history/evidence/luc-897-account-access-getbotruntimesession-doc-link-2026-07-13.md`
- High-risk checks:
  - not applicable
- Reality status: verified

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues:
  - project truth still routed the controller as the next docs-owned Account
    access gap.
- Gaps:
  - the controller had proof linkage already, but no source-truth doc-link.
- Inconsistencies:
  - adjacent api-bots runtime rows were already using the same
    docs-plus-override pattern, so the remaining gap was bounded and local.
- Architecture constraints:
  - repair through source-of-truth docs and generators only.

### 2. Select One Priority Mission Objective
- Selected task:
  - close the scoped `getBotRuntimeSession` missing-doc-link row.
- Priority rationale:
  - it was the current docs-owned Account access gap after the earlier
    test-link repair.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `docs/modules/api-bots.md`
  - `docs/architecture/relations/documentation-links.csv`
  - `docs/architecture/scanner-overrides.json`
  - generated graph/status outputs
  - `history/evidence/...`
  - `history/tasks/...`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.agents/state/system-health.md`
  - `.agents/state/requirements-verification-matrix.md`
- Logic:
  - add the canonical docs linkage, rerun the generator chain sequentially, and
    capture readback proving the gap is gone.
- Edge cases:
  - if downstream generators still reported the row, treat it as a stale-order
    readback and rerun sequentially instead of claiming a tooling regression
    from a parallel refresh.

### 4. Execute Implementation
- Implementation notes:
  - added the controller classification, doc-link registry row, and
    `documents` relation override, then regenerated the graph/status chain in
    order.

### 5. Verify and Test
- Validation performed:
  - sequential `architecture-awareness -> app-completion -> project-truth`
    regeneration, targeted JSON/Markdown readback, strict graph drift, and diff
    check.
- Result:
  - the controller now has a generated `documents` relation and no longer
    appears in app-completion priority review or project-truth gaps.

### 6. Self-Review
- Simpler option considered:
  - docs-row plus CSV only, rejected to keep parity with the repo's existing
    explicit override pattern for api-bots doc-link repairs.
- Technical debt introduced: no
- Scalability assessment:
  - follows the same bounded doc-link closure pattern used by adjacent
    Account-access repairs.

### 7. Update Documentation and Knowledge
- Docs updated:
  - bots module docs, documentation-links registry, scanner overrides, generated
    graph/status outputs, task and evidence packet, task board, project state,
    system health, requirements matrix
- Context updated:
  - yes
- Learning journal updated: not applicable; the required sequential generator
    rule already exists in `LEARNING_JOURNAL.md` and was followed here.

## Result Report

- Task summary:
  - closed the docs-owned `getBotRuntimeSession` controller gap by adding the
    missing api-bots source-truth linkage and proving the generated Soar truth
    chain now ingests it correctly.
- Files changed:
  - `docs/modules/api-bots.md`
  - `docs/architecture/relations/documentation-links.csv`
  - `docs/architecture/scanner-overrides.json`
  - generated `docs/graphs/*` and `docs/status/*` outputs from the sequential
    refresh
  - `history/evidence/luc-897-account-access-getbotruntimesession-doc-link-2026-07-13.md`
  - `history/tasks/luc-897-account-access-getbotruntimesession-doc-link-2026-07-13-task.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.agents/state/system-health.md`
  - `.agents/state/requirements-verification-matrix.md`
- How tested:
  - sequential generator-chain rerun, targeted JSON readback, strict graph
    drift, and diff check.
- What is incomplete:
  - no remaining DSM action on this controller row. The next Account access gap
    is QA-owned proof for `resolveSessionWindowEnd`.
- Next steps:
  - QA Regression Lead + Project Manager should close
    `apps/api/src/modules/bots/botOwnership.service.ts#resolveSessionWindowEnd`
    as the current `implemented_needs_proof` first gap.
- Decisions made:
  - preserved the established DSM pattern of source-truth docs + CSV + override
    + sequential generator readback.
