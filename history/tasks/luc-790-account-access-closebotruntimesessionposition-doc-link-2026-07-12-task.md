# Task

## Header
- ID: LUC-790
- Title: Account access `closeBotRuntimeSessionPosition` missing-doc-link closure
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Product Docs Agent
- Depends on: none
- Priority: P1
- Module Confidence Rows: not applicable
- Requirement Rows: not applicable
- Quality Scenario Rows: not applicable
- Risk Rows: app-completion Account access doc-link risk
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-790-ACCOUNT-ACCESS-CLOSEBOTRUNTIMESESSIONPOSITION-DOC-LINK-2026-07-12
- Mission Status: VERIFIED

## Context

`docs/status/project-truth-index.md` and `docs/status/app-completion-index.md`
reported `apps/api/src/modules/bots/bots.controller.ts#closeBotRuntimeSessionPosition`
as an Account access `missing_doc_link` row even though the same controller
already had focused proof coverage.

## Goal

Prove whether `closeBotRuntimeSessionPosition` is truly undocumented or whether
the repo already has the needed source-truth inputs and the generated
app-completion/project-truth outputs are stale or ingestion-broken.

## Constraints

- Use existing architecture-awareness and project-truth generation paths.
- No runtime code, deploy, push, restart, rollback, env edits, migrations, or
  protected account/session checks.
- Keep the scope to the single Account access row.

## Definition of Done

- [x] `docs/modules/api-bots.md` documents
      `bots.controller.ts#closeBotRuntimeSessionPosition`.
- [x] Documentation-link inputs and scanner overrides include the scoped
      controller.
- [x] Generated readback proves whether the controller still remains
      `missing_doc_link` and why.

## Validation Evidence

- Tests:
  - `pnpm run architecture:graph:generate`
- Manual checks:
  - direct readback of the docs row, CSV row, scanner override, graph
    relations, and generated app-completion/project-truth outputs
- Screenshots/logs:
  - `history/evidence/luc-790-account-access-closebotruntimesessionposition-doc-link-2026-07-12.md`
- High-risk checks:
  - not applicable
- Reality status: verified

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues:
  - generated truth routed `closeBotRuntimeSessionPosition` as
    `missing_doc_link`.
- Gaps:
  - the controller had proof, but no canonical doc-link inputs.
- Inconsistencies:
  - adjacent runtime ownership/close helpers in `api-bots` were already being
    classified through explicit docs rows and overrides.
- Architecture constraints:
  - repair through source-of-truth docs and generators only.

### 2. Select One Priority Mission Objective
- Selected task:
  - prove the scoped `closeBotRuntimeSessionPosition` missing-doc-link row.
- Priority rationale:
  - it was an active docs-owned Account access app-completion gap with existing
    focused proof that could be reconciled without cross-lane runtime work.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `docs/modules/api-bots.md`
  - `docs/architecture/relations/documentation-links.csv`
  - `docs/architecture/scanner-overrides.json`
  - `history/evidence/...`
  - `history/tasks/...`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
- Logic:
  - add canonical docs linkage, regenerate available truth inputs, and capture
    whether the generated row moves.
- Edge cases:
  - if docs inputs ingest but generated status does not move, treat it as a
    separate tooling/generated-state defect instead of claiming closure.

### 4. Execute Implementation
- Implementation notes:
  - added the controller classification row, doc-link registry row, and
    `documents` relation override for the scoped controller.

### 5. Verify and Test
- Validation performed:
  - architecture-awareness regeneration plus direct file readback of docs,
    graph, app-completion, and project-truth outputs.
- Result:
  - the scoped row remains `missing_doc_link` because the graph still lacks the
    expected `documents` relation despite the new source-truth inputs.

### 6. Self-Review
- Simpler option considered:
  - CSV-only linkage, rejected to keep parity with the repo's existing
    override-backed doc-link pattern.
- Technical debt introduced: no
- Scalability assessment:
  - follows the same bounded doc-link closure pattern as the adjacent
    `resolveSessionWindowEnd` repair.

### 7. Update Documentation and Knowledge
- Docs updated:
  - bots module docs, documentation-links registry, scanner overrides, task and
    evidence packet, task board, project state
- Context updated:
  - yes
- Learning journal updated: not applicable.

## Result Report

- Task summary:
  - proved that `closeBotRuntimeSessionPosition` now has local docs inputs, but
    the generated graph/status chain still fails to ingest them, so the
    `missing_doc_link` row remains real in generated truth.
- Files changed:
  - `docs/modules/api-bots.md`
  - `docs/architecture/relations/documentation-links.csv`
  - `docs/architecture/scanner-overrides.json`
  - `history/evidence/luc-790-account-access-closebotruntimesessionposition-doc-link-2026-07-12.md`
  - `history/tasks/luc-790-account-access-closebotruntimesessionposition-doc-link-2026-07-12-task.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
- How tested:
  - regenerated architecture-awareness and read the resulting graph plus the
    current app-completion/project-truth outputs.
- What is incomplete:
  - the generated state still needs a separate repair lane before this row can
    be claimed closed.
- Next steps:
  - Delivery/tooling ownership must repair the ingestion path that should turn
    the new doc-link inputs into a `documents` relation and refreshed
    app-completion/project-truth outputs.
- Decisions made:
  - preserved the existing DSM pattern of source-truth docs + CSV + override +
    generator readback.
