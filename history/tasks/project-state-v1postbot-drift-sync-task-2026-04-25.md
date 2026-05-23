# Task

## Header
- ID: DOCSYNC-2026-04-25-A
- Title: docs(sync): remove stale V1POSTBOT full-api red-suite drift from project state
- Status: DONE
- Owner: Product Docs Agent
- Depends on: V1POSTBOT-A
- Priority: P2

## Context
`PROJECT_STATE.md` still carried one stale sentence saying full `api` e2e had
7 red cases outside `V1IND-A`, even though the same paragraph already states
that `V1POSTBOT-A` closed and restored full API parity. This creates an
internal contradiction in a canonical source-of-truth file.

## Goal
Restore one truthful project-state summary so the canonical product snapshot no
longer advertises already-closed full-API drift.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- keep the slice documentation-only

## Definition of Done
- [x] `PROJECT_STATE.md` no longer claims unresolved 7-case full-API drift
      after the closed `V1POSTBOT-A` wave.
- [x] Queue/context/docs record the docs-sync slice and its closure.
- [x] Repository guardrails still pass after documentation sync.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests: `pnpm run quality:guardrails`
- Manual checks: canonical text review of `PROJECT_STATE.md`
- Screenshots/logs: command output only
- High-risk checks: avoid introducing a new queue/context contradiction

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  `docs/architecture/architecture-source-of-truth.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: n/a
- Follow-up architecture doc updates: none

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: canonical project context docs
- Required states: success
- Responsive checks: n/a
- Accessibility checks: n/a
- Parity evidence: project-state wording matches the already-closed
  `V1POSTBOT-A` execution history

## Review Checklist (mandatory)
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
This slice is intentionally limited to canonical source-of-truth cleanup.
