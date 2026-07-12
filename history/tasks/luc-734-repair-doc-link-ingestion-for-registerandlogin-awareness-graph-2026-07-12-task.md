# Task

## Header

- ID: LUC-734
- Title: Repair doc-link ingestion for registerAndLogin awareness graph
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Engineering Delivery Lead
- Depends on: LUC-722
- Priority: P1
- Module Confidence Rows: Account access / Backtests auth bootstrap helper documentation
- Requirement Rows: not applicable
- Quality Scenario Rows: documentation discoverability
- Risk Rows: app-completion Account access doc-link risk
- Iteration: 2026-07-12
- Operation Mode: BUILDER
- Mission ID: LUC-734-REPAIR-DOC-LINK-INGESTION-REGISTERANDLOGIN-2026-07-12
- Mission Status: VERIFIED

## Process Self-Audit

- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed for mission rules.
- [x] Missing or template-like state tables were not encountered.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified or
      marked not applicable.
- [x] The task improves release confidence by converting a proved doc-link
      mismatch into refreshed generated truth.

## Context

[LUC-722](/LUC/issues/LUC-722) proved that
`apps/api/src/modules/backtests/backtests.e2e.test.ts#registerAndLogin` already
had canonical doc-link inputs in `docs/modules/api-backtests.md`,
`docs/architecture/relations/documentation-links.csv`, and
`docs/architecture/scanner-overrides.json`, but generated outputs still showed
`hasDoc=false` and routed the same row as the first Account access
`missing_doc_link` gap.

## Goal

Repair the generated doc-link ingestion path for the scoped
`registerAndLogin` entity so architecture-awareness, app-completion, and
project-truth consume the existing source-of-truth link and advance the first
gap queue.

## Scope

- `docs/graphs/architecture-awareness.json`
- `docs/status/app-completion-index.json`
- `docs/status/app-completion-index.md`
- `docs/status/project-truth-index.json`
- `docs/status/project-truth-index.md`
- `docs/status/event-chain-index.json`
- `docs/status/event-chain-index.md`
- `docs/status/runtime-error-index.json`
- `docs/status/runtime-error-index.md`
- `docs/status/operational-readiness-index.json`
- `docs/status/operational-readiness-index.md`
- evidence and project state files

## Implementation Plan

1. Re-read the generated architecture-awareness entity and its relations for
   the scoped `registerAndLogin` path.
2. Re-run the awareness generator from the canonical Paperclip tooling against
   the current Soar workspace.
3. Re-run app-completion and project-truth in strict dependency order so they
   consume the fresh awareness graph.
4. Verify that the scoped row leaves `priorityReviewItems` and that project
   truth advances to the next gap.
5. Record the sequencing pitfall in project memory.

## Acceptance Criteria

- `architecture-awareness.json` contains a `documents` relation from
  `docs/modules/api-backtests.md` to
  `apps/api/src/modules/backtests/backtests.e2e.test.ts#registerAndLogin`.
- `app-completion-index.json` no longer lists the scoped path in
  `priorityReviewItems`.
- `project-truth-index.md` no longer routes the first gap to the scoped path.
- Evidence names the effective repair and the next first-gap owner/action.

## Definition of Done

- [x] The scoped `registerAndLogin` awareness entity was re-read with its
      generated relations.
- [x] Canonical awareness/app-completion/project-truth generators were rerun in
      the correct order.
- [x] Generated readback proved the row no longer appears as
      `missing_doc_link`.
- [x] Source-of-truth state and evidence were updated.

## Validation Evidence

- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`: PASS
  (`10777` entities / `35200` relations / `relationOverridesApplied=13`).
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`: PASS
  (`items=3564`, `missingDocLink=1984`, `priorityReviewItems=200`).
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`: PASS
  (first gap advanced to
  `apps/api/src/modules/bots/botOwnership.service.ts#getOwnedBotRuntimeSession`).
- Direct JSON readback: PASS for the scoped entity:
  `architecture-awareness.json` contains a `documents` relation from
  `docs/modules/api-backtests.md`,
  `app-completion-index.json` no longer contains the scoped path in
  `priorityReviewItems`, and `project-truth-index.md` no longer names it as the
  first gap.
- Reality status: verified.

## Architecture Evidence

- Architecture source reviewed: `docs/modules/api-backtests.md`,
  `docs/architecture/relations/documentation-links.csv`,
  `docs/architecture/scanner-overrides.json`,
  `docs/graphs/architecture-awareness.json`.
- Fits approved architecture: yes.
- Mismatch discovered: yes; the effective cause was stale downstream generation
  order rather than a missing source-truth relation.
- Decision required from user: no.

## Security / Privacy Evidence

- Data classification: generated docs/status metadata and public runtime probe
  outputs only.
- Secret handling: no secret, cookie, token, credential, account, or protected
  runtime value was read or written.
- Fail-closed behavior: not applicable to this source-truth refresh lane.
- Residual risk: global app-completion backlog remains; the next Account access
  row is now `getOwnedBotRuntimeSession` as `missing_doc_link`.

## Autonomous Loop Evidence

### 1. Analyze Current State

- The scoped Backtests helper already had canonical doc-link inputs.
- The generated graph from the previous checkpoint still lacked the effective
  downstream readback.

### 2. Select One Priority Mission Objective

- Selected task: refresh and verify doc-link ingestion for the scoped
  `registerAndLogin` helper.
- Deferred: all later Account access backlog rows.

### 3. Plan Implementation

- Compare the current awareness entity to the generator logic.
- Refresh awareness first, then refresh downstream indexes serially.

### 4. Execute Implementation

- Rebuilt `architecture-awareness.json`.
- Rebuilt `app-completion-index`.
- Rebuilt `project-truth-indexes` with `--apply`.

### 5. Verify and Test

- Confirmed the scoped awareness entity now has a `documents` relation.
- Confirmed `priorityReviewItems` no longer includes the scoped path.
- Confirmed the first project-truth gap advanced to the next entity.

### 6. Self-Review

- Existing systems were reused: canonical Paperclip generation scripts and
  current Soar source-of-truth files.
- Technical debt introduced: no.

### 7. Update Documentation and Knowledge

- Docs updated: generated truth indexes plus task/evidence/state files.
- Context updated: yes.
- Learning journal updated: yes, for generator sequencing.

## Review Checklist

- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated because repository truth changed.

## Result Report

- Task summary: repaired the generated awareness/app-completion/project-truth
  readback for
  `apps/api/src/modules/backtests/backtests.e2e.test.ts#registerAndLogin`.
- Files changed: generated awareness/status indexes, task/evidence packet,
  project state/context, and learning journal.
- How tested: reran canonical generation scripts and performed direct JSON/MD
  readback for the scoped entity.
- What is incomplete: the broader Account access backlog remains open.
- Next steps: route the new first Account access gap
  `apps/api/src/modules/bots/botOwnership.service.ts#getOwnedBotRuntimeSession`
  as a separate doc-link lane.
- Decisions made: treat the repair as a generation-order/source-of-truth refresh
  fix; no runtime code change was needed.
