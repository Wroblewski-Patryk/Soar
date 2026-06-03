# Task

## Header
- ID: LUC-1542
- Title: Apply completed Coolify selector disposition
- Task Type: release recovery
- Current Stage: verification
- Status: VERIFIED, CONTROL-PLANE CLOSURE APPLIED
- Owner: Portfolio Director
- Depends on: [LUC-1537](/LUC/issues/LUC-1537)
- Priority: P1
- Module Confidence Rows: deployment / Coolify production target
- Requirement Rows: production deploy confidence / Coolify selector correctness
- Quality Scenario Rows: deployment safety, configuration correctness
- Risk Rows: wrong Coolify team/workspace could inspect or mutate the wrong project
- Iteration: 2026-06-02
- Operation Mode: BUILDER
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: CHECKPOINTED

## Context
[LUC-1542](/LUC/issues/LUC-1542) was created to apply the completed disposition
for parent [LUC-1537](/LUC/issues/LUC-1537), because the work had been completed
but recovery ownership had to apply the final issue state.

## Goal
Verify that the parent disposition is complete and close the recovery issue.

## Scope
- Paperclip issue state for [LUC-1537](/LUC/issues/LUC-1537) and
  [LUC-1542](/LUC/issues/LUC-1542).
- Existing local evidence and task packets for [LUC-1537](/LUC/issues/LUC-1537).
- Paperclip closure/comment update only.

## Implementation Plan
1. Read scoped Paperclip wake payload.
2. Read [LUC-1542](/LUC/issues/LUC-1542) heartbeat context.
3. Verify parent [LUC-1537](/LUC/issues/LUC-1537) status and evidence files.
4. Confirm recovery ownership is live.
5. Close [LUC-1542](/LUC/issues/LUC-1542) with the evidence summary.

## Acceptance Criteria
- Parent [LUC-1537](/LUC/issues/LUC-1537) disposition is verified.
- Existing Coolify selector evidence is referenced.
- [LUC-1542](/LUC/issues/LUC-1542) is closed.
- No Coolify or production mutation is performed.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay read-only against Coolify
- do not print or store secret values

## Definition of Done
- [x] Paperclip issue context read.
- [x] Parent [LUC-1537](/LUC/issues/LUC-1537) verified as `done`.
- [x] Local evidence files verified.
- [x] Recovery ownership verified.
- [x] Control-plane closure applied.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping
- deploy/restart/rollback/env/database/team/account/live-trading mutation

## Validation Evidence
- `GET /api/issues/LUC-1542/heartbeat-context` -> pass; issue status
  `in_progress`, assignee `5f817ed2-b988-4c14-b726-0e9645ee3a4f`.
- `GET /api/issues/LUC-1542` -> pass; parent points to
  [LUC-1537](/LUC/issues/LUC-1537), no first-class blockers.
- Existing parent evidence exists:
  `history/evidence/luc-1537-coolify-team-workspace-confirmation-2026-06-02.md`.
- Existing parent task packet exists:
  `history/tasks/luc-1537-confirm-coolify-team-workspace-2026-06-02-task.md`.
- Final control-plane closure: `PATCH /api/issues/LUC-1542` -> pass; status
  `done`.

## Architecture Evidence
- Architecture source reviewed: Ops deployment contract through existing
  [LUC-1537](/LUC/issues/LUC-1537) evidence.
- Fits approved architecture: yes; no code or runtime architecture changed.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: no rollback needed because no mutation occurred.
- Observability or alerting impact: none.
- Staged rollout or feature flag: n/a.

## Result Report
- Task summary: Verified that parent [LUC-1537](/LUC/issues/LUC-1537) is
  complete, that the Coolify selector disposition evidence exists, and that the
  recovery issue is closed after ownership returned to Portfolio Director.
- Files changed:
  - `history/evidence/luc-1542-coolify-selector-disposition-recovery-2026-06-02.md`
  - `history/tasks/luc-1542-apply-completed-coolify-selector-disposition-2026-06-02-task.md`
- How tested: Paperclip issue readbacks, local evidence readbacks, Paperclip
  final status mutation.
- What is incomplete: nothing for this recovery issue.
- Next steps: none for [LUC-1542](/LUC/issues/LUC-1542).
- Decisions made: no production mutation authorized or performed.
