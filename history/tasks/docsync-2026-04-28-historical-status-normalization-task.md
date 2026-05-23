# Task

## Header
- ID: DOCSYNC-2026-04-28-E
- Title: Normalize remaining historical planning status wording after closed waves
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Product Docs Agent
- Depends on: DOCSYNC-2026-04-28-D
- Priority: P3

## Context
After refreshing the planning catalog and stale active headers, a few historical
planning artifacts still advertised ambiguous status wording such as `PLANNED`,
`planned`, or `Published` even though their owning waves are already closed in
canonical queue/context files.

## Goal
Finish planning-status normalization so historical plans stop looking like live
execution sources.

## Deliverable For This Stage
Corrected historical status headers plus synchronized planning catalog and
queue/context notes for this docs-only cleanup slice.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Scope
- `history/plans/dashboard-loading-skeleton-progress-plan-2026-04-05.md`
- `history/plans/dashboard-forms-consistency-planner-brief-2026-04-19.md`
- `history/plans/dashboard-tables-consistency-planner-brief-2026-04-19.md`
- `history/audits/xvenue-02-exchange-boundary-leak-audit-2026-04-25.md`
- `history/plans/planning-catalog-index-2026-04-19.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Implementation Plan
1. Confirm ambiguous historical status headers against canonical closure truth.
2. Normalize only the headers that still imply active work despite closed waves.
3. Extend the planning catalog with the missing historical rows and wording note.
4. Record the cleanup slice in queue/context and rerun guardrails.

## Acceptance Criteria
- Touched historical plans no longer look active when their waves are closed.
- Planning catalog reflects the normalized historical artifacts.
- No actually active execution source is accidentally downgraded.
- `pnpm run quality:guardrails` passes after the sync.

## Definition of Done
- [x] Remaining ambiguous historical status headers are normalized.
- [x] Planning catalog is updated for the touched artifacts.
- [x] Queue/context docs record the cleanup slice.
- [x] Repository guardrails pass.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - `pnpm run quality:guardrails`
- Manual checks:
  - cross-checked each touched header against canonical queue/context closure entries
- Screenshots/logs:
  - none
- High-risk checks:
  - limited changes to historical/source artifacts only

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert the docs-only sync commit if any touched historical classification proves inaccurate

## Review Checklist (mandatory)
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
- This is intended as the last historical-status cleanup slice before treating
  the planning catalog as operationally clean.

## Result Report
- Task summary: normalized the last ambiguous historical plan headers that still
  looked active after their owning waves had closed.
- Files changed:
  - touched historical/source plans
  - planning catalog
  - queue/context sync files
- How tested: canonical cross-check plus repository guardrails
- What is incomplete: no active execution queue has been promoted yet
- Next steps: either promote a new implementation wave into `NOW` or declare the
  canonical queue intentionally empty
- Decisions made:
  - keep source briefs as historical reference, but remove misleading active-looking status wording
