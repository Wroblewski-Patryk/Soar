# Task

## Header

- ID: LUC-799
- Title: Repair resolveSessionWindowEnd doc-link ingestion into graph and generated indexes
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Engineering Delivery Lead
- Depends on: LUC-789
- Priority: P1
- Module Confidence Rows: Account access / API bots runtime session-window helper generated truth
- Requirement Rows: not applicable
- Quality Scenario Rows: documentation discoverability
- Risk Rows: app-completion Account access doc-link risk
- Iteration: 2026-07-12
- Operation Mode: BUILDER
- Mission ID: LUC-799-REPAIR-RESOLVESESSIONWINDOWEND-DOC-LINK-INGESTION-2026-07-12
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
- [x] Affected requirement, quality scenario, and risk rows were identified or marked not applicable.
- [x] The task improves release confidence by converting a proved docs-ingestion mismatch into refreshed generated truth.

## Context

[LUC-789](/LUC/issues/LUC-789) proved that
`apps/api/src/modules/bots/botOwnership.service.ts#resolveSessionWindowEnd`
already had canonical source-of-truth inputs in `docs/modules/api-bots.md`,
`docs/architecture/relations/documentation-links.csv`, and
`docs/architecture/scanner-overrides.json`, while generated outputs still
routed the helper as `missing_doc_link`.

## Goal

Repair the generated doc-link ingestion/readback chain so the scoped helper is
classified from the existing canonical docs relation instead of remaining in a
stale docs-gap state.

## Constraints

- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done

- [x] `architecture-awareness.json` contains the direct `documents` relation for the scoped helper.
- [x] `app-completion-index.json` no longer classifies the helper as `missing_doc_link`.
- [x] `project-truth-index.json` routes the helper as a proof follow-up and advances the first docs-owned gap.

## Forbidden

- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence

- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - PASS (`10800` entities / `35336` relations / `relationOverridesApplied=15`).
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - PASS (`items=3564`, `missingDocLink=1982`, `implementedNeedsProof=114`).
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`
  - PASS (first gap advanced to `apps/api/src/modules/bots/bots.controller.ts#getBotRuntimeSession` as `missing_doc_link`).
- Direct JSON readback:
  - `docs/graphs/architecture-awareness.json` contains the `documents` relation from `docs/modules/api-bots.md` to `apps/api/src/modules/bots/botOwnership.service.ts#resolveSessionWindowEnd`.
  - `docs/status/app-completion-index.json` records the scoped helper with `evidence.hasDoc=true`, `evidence.hasTest=true`, and `risk=implemented_needs_proof`.
  - `docs/status/project-truth-index.json` records the same helper as `implemented_needs_proof`.
- Module confidence ledger updated: yes
- Module confidence rows closed or changed:
  - Account access / API bots runtime session-window helper generated truth
- Requirements matrix updated: not applicable
- Quality scenarios updated: not applicable
- Risk register updated: not applicable
- Reality status: verified

## Architecture Evidence

- Architecture source reviewed:
  `docs/modules/api-bots.md`,
  `docs/architecture/relations/documentation-links.csv`,
  `docs/architecture/scanner-overrides.json`,
  `docs/graphs/architecture-awareness.json`.
- Fits approved architecture: yes
- Mismatch discovered: yes
- Decision required from user: no
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence

- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note:
  revert the generated truth artifacts and issue-scoped memory entries if this
  readback repair must be backed out.

## Autonomous Loop Evidence

### 1. Analyze Current State

- The scoped helper already had canonical docs inputs.
- The generated truth chain still reported `missing_doc_link`.
- A first rerun executed dependent generators in parallel and preserved stale downstream state.

### 2. Select One Priority Mission Objective

- Selected task: restore generated readback for `resolveSessionWindowEnd`.
- Deferred: all unrelated Account access backlog rows.

### 3. Plan Implementation

- Rebuild the graph first, then rebuild downstream indexes serially.
- Re-read the scoped row at each stage.

### 4. Execute Implementation

- Rebuilt `architecture-awareness.json`.
- Rebuilt `app-completion-index`.
- Rebuilt `project-truth-indexes` with `--apply`.
- Updated issue-scoped memory and the sequencing guardrail.

### 5. Verify and Test

- Confirmed the scoped awareness entity now has a direct doc relation.
- Confirmed app-completion no longer treats the row as a docs gap.
- Confirmed project truth advanced the first docs-owned gap.

### 6. Self-Review

- Existing systems were reused: canonical Paperclip generation scripts and current Soar source-of-truth files.
- Technical debt introduced: no.

### 7. Update Documentation and Knowledge

- Docs updated: generated truth indexes plus task/evidence/state files.
- Context updated: yes.
- Learning journal updated: yes.

