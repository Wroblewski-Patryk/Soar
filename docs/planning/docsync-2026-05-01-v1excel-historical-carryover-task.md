# Task

## Header
- ID: DOCSYNC-2026-05-01-V1EXCEL-HISTORICAL-CARRYOVER
- Title: Mark older V1EXCEL carryover checkboxes non-active
- Task Type: docs
- Current Stage: release
- Status: DONE
- Owner: Planning/Docs
- Depends on: `V1GATE-01`
- Priority: P0

## Context
The active V1 queue has current `NOW` and `BLOCKED` entries for the remaining
`V1EXCEL` evidence wave. Older 2026-04-29 carryover sections in the planning
queue and task board still contained unchecked checkbox rows for the same
`V1EXCEL-03..06` work, including stale stage wording that predates the fresh
2026-05-01 public `503` evidence.

## Goal
Prevent agents or operators from selecting stale duplicate queue rows as active
work while preserving the historical notes for traceability.

## Scope
- `docs/planning/mvp-next-commits.md`
- `.codex/context/TASK_BOARD.md`

## Implementation Plan
1. Identify duplicate historical `V1EXCEL-03..06` checkbox rows.
2. Convert those duplicate rows into non-checkbox historical notes.
3. Keep the current active `NOW` and `BLOCKED` entries unchanged.
4. Add a task packet and source-of-truth references for the queue hygiene sync.

## Acceptance Criteria
- Current active `V1FINAL-01`, `V1EXCEL-04`, `V1EXCEL-05`, and umbrella
  `V1EXCEL-03..06` entries remain visible.
- Older 2026-04-29 duplicate carryover rows no longer appear as independently
  executable unchecked checkboxes.
- Historical evidence text remains available.

## Definition of Done
- [x] Duplicate historical rows are marked non-active.
- [x] Current active queue entries remain intact.
- [x] Task packet exists.
- [x] Repository guardrails pass.

## Forbidden
- Do not close active `V1EXCEL` blockers.
- Do not delete historical evidence.
- Do not change the V1 `NO-GO/BLOCKED` classification.

## Validation Evidence
- Tests:
  - `pnpm run quality:guardrails` -> PASS.
  - `git diff --check` -> PASS; Windows CRLF warnings only.
- Manual checks:
  - Active queue still lists current `V1FINAL-01`, `V1EXCEL-04`, and
    `V1EXCEL-05`.
  - Historical 2026-04-29 `V1EXCEL-03..06` rows are non-checkbox notes.

## Architecture Evidence
- Architecture source reviewed: `docs/operations/v1gate-01-current-target-freshness-2026-05-01.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: not applicable.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Review Checklist
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated because repository truth changed.
- [x] Learning journal update not required.

## Result Report
- Task summary: stale duplicate V1EXCEL checkboxes in older carryover sections
  were converted to historical notes.
- Files changed: planning queue, task board, task packet.
- How tested: repository guardrails and diff check.
- What is incomplete: no operational blocker was resolved by this docs sync.
- Next steps: execute the active `V1EXCEL` blockers only from the current
  `NOW`/`BLOCKED` queue entries.
