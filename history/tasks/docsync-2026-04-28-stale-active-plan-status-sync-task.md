# Task

## Header
- ID: DOCSYNC-2026-04-28-C
- Title: Close stale `Status: Active` headers in already closed planning packets
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Product Docs Agent
- Depends on:
- Priority: P2

## Context
The canonical queue/context files already mark several waves as closed, but a
small set of individual planning packets still advertise `Status: Active`. That
drift makes future execution nudges less trustworthy because an executor can
mistake historical audit/plan packets for still-open work.

## Goal
Restore planning-header parity so closed waves are not left with stale active
status lines.

## Deliverable For This Stage
Updated planning packet headers plus synchronized queue/context history for this
docs-only closure task.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Scope
- `history/plans/scalability-anti-drift-foundation-plan-2026-04-22.md`
- `history/plans/v1-production-activation-and-evidence-plan-2026-04-22.md`
- `history/audits/v1take-01-investigation-audit-2026-04-25.md`
- `history/audits/xadapt-02-binance-assumption-audit-2026-04-25.md`
- `history/evidence/xadapt-06-next-exchange-readiness-packet-2026-04-25.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Implementation Plan
1. Confirm which planning packets still say `Status: Active`.
2. Cross-check each candidate against canonical closure truth in
   `PROJECT_STATE` and `TASK_BOARD`.
3. Update only the stale header lines that are already closed elsewhere.
4. Record this docs-sync slice in queue/context history and run repository
   guardrails.

## Acceptance Criteria
- Every touched plan header matches existing canonical closure truth.
- No actually active wave is accidentally marked closed.
- Queue/context docs record this docs-sync slice explicitly.
- `pnpm run quality:guardrails` passes after the docs updates.

## Definition of Done
- [x] Stale `Status: Active` headers are corrected in the scoped planning files.
- [x] Queue/context history records the docs-sync closure.
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
  - compared every touched header against canonical closure lines in
    `PROJECT_STATE` and `TASK_BOARD`
- Screenshots/logs:
  - none
- High-risk checks:
  - avoided touching plans that were still genuinely active

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
- Rollback note: revert the docs-only sync commit if any touched status was
  proven to be closed incorrectly

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
- This task is intentionally docs-only and exists to keep trigger-intent
  execution trustworthy after multiple closed waves.

## Result Report
- Task summary: synchronized stale planning status headers that still showed
  `Active` for already closed waves.
- Files changed:
  - scoped planning packet headers
  - queue/context sync files
- How tested: canonical closure cross-check plus repository guardrails
- What is incomplete: the operational queue is still intentionally empty until a
  new active implementation wave is promoted
- Next steps: derive and promote the next real implementation slice from the
  remaining canonical backlog
- Decisions made:
  - treat stale plan-header drift as a first-class docs-sync task instead of
    silently editing headers without history
