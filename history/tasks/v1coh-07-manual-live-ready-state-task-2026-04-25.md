# Task

## Header
- ID: V1COH-07
- Title: web(manual-live-state): expose ready state for actionable dashboard manual LIVE context
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1COH-06
- Priority: P0

## Context
The dashboard runtime sidebar already exposes explicit manual LIVE lifecycle
states for `submitted`, `waiting_for_fill`, `imported_open_order`, and
`position_opened`. However, the current presenter collapses the normal
pre-submit actionable state into `blocked`, which makes a valid V1 manual LIVE
context read as unavailable even when submit remains enabled.

## Goal
Expose one truthful pre-submit `ready` state for manual LIVE in the dashboard
sidebar so operators can distinguish a valid actionable context from a real
blocked context.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic

## Definition of Done
- [x] Runtime sidebar presenter distinguishes actionable pre-submit manual LIVE
      state from truly blocked state.
- [x] i18n copy and web regression coverage lock the new ready-state semantics.
- [x] Canonical planning/context artifacts reflect the closure.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx`
- Manual checks: reasoning review against current dashboard lifecycle semantics
- Screenshots/logs: n/a
- High-risk checks: confirmed `blocked` remains only for missing selected bot,
  unavailable exchange capability, missing symbol, or empty symbol scope

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/reference/execution-lifecycle-parity-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: n/a
- Follow-up architecture doc updates: none required

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: existing dashboard manual-order runtime state panel
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks: existing semantic badge/text structure preserved
- Parity evidence: actionable manual LIVE context now reads as ready instead of
  blocked while true blocked cases stay explicit

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
This task closes a misleading operator-surface regression, not a backend
execution defect.
