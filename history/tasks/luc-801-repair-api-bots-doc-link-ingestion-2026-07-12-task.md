# Task

## Header
- ID: LUC-801
- Title: Repair api-bots doc-link ingestion for closeBotRuntimeSessionPosition and resolveSessionWindowEnd
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Review
- Depends on: LUC-789, LUC-790, LUC-799
- Priority: P1
- Module Confidence Rows: not updated
- Requirement Rows: not updated
- Quality Scenario Rows: not updated
- Risk Rows: not updated
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-801-API-BOTS-DOC-LINK-INGESTION-2026-07-12
- Mission Status: VERIFIED

## Context
`LUC-789` and `LUC-790` proved the two scoped api-bots rows already had
canonical docs inputs. `LUC-799` repaired the generated ingestion path for
`resolveSessionWindowEnd`. This issue closes the family at integration level by
rerunning the canonical generator chain and verifying the final repo truth for
both scoped rows.

## Goal
Confirm whether repo-side doc-link ingestion for
`closeBotRuntimeSessionPosition` and `resolveSessionWindowEnd` is now repaired,
and if so leave a durable closure packet with the remaining owner for any
non-tooling proof work.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within verification/source-truth closure only

## Definition of Done
- [x] Canonical Soar generators rerun in dependency order.
- [x] Both scoped paths re-read from generated graph/app-completion/project-truth outputs.
- [x] Durable repo evidence states whether the tooling issue is closed and what residual lane remains.

## Forbidden
- product runtime code changes
- deploy, push, restart, rollback, or secret/account access
- claiming QA proof closure without fresh proof evidence

## Autonomous Loop Evidence

### 1. Analyze Current State
- `LUC-799` already showed `resolveSessionWindowEnd` fixed at generated-truth level.
- Current local graph also showed `closeBotRuntimeSessionPosition` already had
  `documents` linkage, so this heartbeat needed integration readback rather
  than new code changes.

### 2. Select One Priority Mission Objective
- Close the scoped api-bots doc-link ingestion family for [LUC-801](/LUC/issues/LUC-801).

### 3. Plan Implementation
- Rerun:
  `architecture-awareness -> app-completion -> project-truth`.
- Re-read only the two scoped entity paths from generated outputs.
- Publish a closure packet and refresh project-local truth summaries.

### 4. Execute Implementation
- Ran the three canonical generator scripts from
  `C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts`.
- Queried generated JSON outputs for both scoped paths.
- Added this task packet, issue evidence packet, and source-of-truth summaries.

### 5. Verify and Test
- Generator chain PASS.
- `closeBotRuntimeSessionPosition` no longer appears in app-completion priority
  review or project-truth gaps.
- `resolveSessionWindowEnd` now reads as `implemented_needs_proof` with
  `hasDoc=true` and `hasTest=true`.

### 6. Self-Review
- No simpler safe closure existed than rerunning the canonical generator chain,
  because the issue scope is generated-state ingestion.
- No new technical debt introduced.

### 7. Update Documentation and Knowledge
- Added `history/evidence/luc-801-api-bots-doc-link-ingestion-repair-2026-07-12.md`.
- Updated `.codex/context/TASK_BOARD.md`.
- Updated `.codex/context/PROJECT_STATE.md`.

## Validation Evidence
- Tests:
  - `build-architecture-awareness-index.mjs` PASS
  - `build-app-completion-index.mjs` PASS
  - `build-project-truth-indexes.mjs --apply` PASS
- Manual checks:
  - direct JSON readback for both scoped paths
- Reality status: verified

## Architecture Evidence
- Architecture source reviewed: yes
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: not applicable
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Result Report
- Task summary:
  repo-side doc-link ingestion is repaired for the two scoped api-bots rows.
  `closeBotRuntimeSessionPosition` is fully cleared from the scoped tooling
  gap; `resolveSessionWindowEnd` now remains only as QA proof work.
- Files changed:
  - `history/evidence/luc-801-api-bots-doc-link-ingestion-repair-2026-07-12.md`
  - `history/tasks/luc-801-repair-api-bots-doc-link-ingestion-2026-07-12-task.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
- How tested:
  reran the canonical generator chain and inspected generated JSON outputs.
- What is incomplete:
  no remaining tooling repair inside `LUC-801`; separate proof follow-up still
  exists for `resolveSessionWindowEnd`.
- Next steps:
  QA Regression Lead + Project Manager should handle the focused
  `implemented_needs_proof` row for
  `apps/api/src/modules/bots/botOwnership.service.ts#resolveSessionWindowEnd`.
- Decisions made:
  close `LUC-801` as an integration/tooling issue instead of opening another
  repair lane, because the scoped ingestion defect no longer reproduces.
