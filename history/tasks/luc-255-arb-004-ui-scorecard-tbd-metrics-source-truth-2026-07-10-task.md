# LUC-255 ARB-004 UI Scorecard TBD Metrics Source Truth

## Header
- ID: LUC-255
- Title: Replace `TBD` metrics with measured values or explicit defer metadata
- Task Type: design
- Current Stage: verification
- Status: DONE
- Owner: 02 UID (UI Visual Designer)
- Priority: P2
- Mission ID: LUC-255-ARB-004-UI-SCORECARD-TBD-METRICS-2026-07-10
- Mission Status: VERIFIED

## Context
[LUC-255](/LUC/issues/LUC-255) was assigned as a local repair/source-control
lane for ARB-004. Historical docs-memory scans still pointed at unresolved
`TBD` placeholders in `docs/ux/ui-scorecard.md`, while the live scorecard had
already been repaired by [LUC-388](/LUC/issues/LUC-388).

## Goal
Verify the current UX scorecard truth and remove stale source-of-truth wording
that still described the `TBD` metric rows as open.

## Scope
- `docs/ux/ui-scorecard.md`
- `docs/analysis/documentation-drift.md`
- `history/tasks/luc-255-arb-004-ui-scorecard-tbd-metrics-source-truth-2026-07-10-task.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `.agents/state/module-confidence-ledger.md`

## Implementation Plan
1. Read the scorecard and historical ARB-004 task evidence.
2. Verify whether the scorecard still contains `TBD`.
3. Update the active documentation-drift register to describe the repaired
   state instead of an open gap.
4. Record task evidence and run focused validation.

## Acceptance Criteria
- `docs/ux/ui-scorecard.md` contains no `TBD` marker.
- The three formerly unresolved review-template rows have explicit defer
  metadata with `owner`, `date`, and `reason`.
- Active documentation drift no longer routes ARB-004 as an open `TBD` gap.
- Validation commands and source-control disposition are recorded.

## Definition of Done
- The scorecard source truth is verified.
- Stale drift wording is repaired.
- Focused placeholder scan and diff validation pass.
- No production, deploy, protected smoke, secret/account, exchange/payment,
  order, position, subscription, or live-trading action occurs.

## Result Report
- Task summary: verified `docs/ux/ui-scorecard.md` already uses explicit defer
  metadata for the three ARB-004 rows, then updated
  `docs/analysis/documentation-drift.md` so the active drift register no
  longer claims unresolved `TBD` placeholders.
- Files changed: `docs/analysis/documentation-drift.md`,
  `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`,
  `.agents/state/module-confidence-ledger.md`, and this task file.
- How tested:
  - `rg -n "\bTBD\b" docs/ux/ui-scorecard.md` -> no matches.
  - `rg -n "Deferred measurement metadata: owner `UX Visual Lead`, date `2026-05-28`" docs/ux/ui-scorecard.md` -> three matches.
  - `git diff --check` -> PASS.
- What is incomplete: future concrete screen reviews still need measured
  strongest/weakest/fix notes; that is review-instance work, not an open
  template placeholder.
- Next steps: none on [LUC-255](/LUC/issues/LUC-255).
- Decisions made: used explicit defer metadata instead of fabricated measured
  scores because no new screen-specific visual review dataset was produced.

## Validation Evidence
- Tests: not applicable; documentation/source-truth correction only.
- Manual checks: focused `rg` readback of scorecard placeholder and defer
  metadata.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `.agents/core/project-memory-index.md`,
  `.agents/core/mission-control.md`, `docs/analysis/documentation-drift.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.

## UX/UI Evidence
- Design source type: not applicable; this was scorecard source-truth
  maintenance, not a screen design change.
- Design source reference: `docs/ux/ui-scorecard.md`.
- Existing shared pattern reused: explicit defer metadata from the existing
  scorecard template.
- Design-memory update required: no.
- Required states: not applicable.
- Responsive checks: not applicable.
- Accessibility checks: not applicable.
- Parity evidence: not applicable.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Rollback note: revert the docs-only commit if needed.

## Security / Privacy Evidence
- Data classification: public project documentation.
- Secret handling: no secret values or protected bindings read.
- Abuse cases: no runtime/action path touched.
- Residual risk: none for ARB-004 template placeholder truth.
