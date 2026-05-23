# Task

## Header
- ID: V1CLOSE-00
- Title: planning(queue): publish canonical close-attribution and external-close hardening packet
- Task Type: design
- Current Stage: planning
- Status: DONE
- Owner: Planning Agent
- Depends on:
- Priority: P0

## Context
Fresh production-observation follow-up on 2026-04-27 confirmed a real
architecture gap after live execution and takeover started behaving
substantially better on the affected account. The repository can already close
positions through bot lifecycle, dashboard/manual app actions, exchange events,
and reconciliation cleanup, but it still lacks one canonical model that
answers who or what initiated a close. Today the system can often close the
row, but it cannot describe that truth cleanly as:

- closed by bot automatically
- closed by user in app
- closed manually on exchange
- closed by exchange liquidation
- closed during system repair

The user explicitly approved the canonical two-dimension model on 2026-04-27:
separate `closeReason` from `closeInitiator`, then plan the implementation in
a way that cannot drift across reconciliation, runtime close, exchange event
application, and UI history surfaces.

## Goal
Publish one detailed, architecture-aligned execution packet that:

- freezes the approved close-attribution contract in canonical architecture
  docs,
- identifies exact current code paths that already close positions but do not
  yet persist or expose initiator truth,
- defines one safe task order for schema, write paths, event/reconcile logic,
  read models, UI labels, and regression coverage,
- promotes the resulting implementation wave into canonical queue/context truth.

## Deliverable For This Stage
The output of this planning stage is:

- one canonical architecture contract for position-close attribution,
- one file-scoped execution plan for the new hardening wave,
- synchronized queue/context/docs so future implementation can proceed without
  re-deciding the model.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] The approved `closeReason + closeInitiator` contract is normalized into canonical architecture docs.
- [x] A new implementation wave documents exact tasks, file scope, risks, and validation gates.
- [x] Canonical queue/context files are synchronized to the new wave and planning completion.

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
  - reviewed canonical architecture lifecycle docs against current close paths
  - reviewed current repository code paths for dashboard close, exchange-event close, and reconcile-driven stale close
  - confirmed current schema lacks canonical persisted close-attribution fields
- Screenshots/logs:
- High-risk checks:
  - confirmed current reconcile semantics still collapse external manual close into `ORPHAN_LOCAL`-style cleanup semantics
  - confirmed current dashboard close intent exists but is not yet persisted as first-class close attribution on `Position`
  - confirmed current architecture defined close reasons but not canonical close initiator/source truth

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/reference/position-lifecycle-parity-matrix.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
  - `docs/architecture/reference/assistant-runtime-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: yes
- Decision required from user: yes
- Approval reference if architecture changed:
  - user approved option 2 on 2026-04-27: separate canonical `closeReason` and `closeInitiator`
- Follow-up architecture doc updates:
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/reference/position-lifecycle-parity-matrix.md`
  - new `docs/architecture/reference/position-close-attribution-contract.md`

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: planning only; no UI implementation shipped
- Canonical visual target: operator history and runtime surfaces must eventually expose deterministic close attribution labels
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: no
- Visual-direction brief reviewed: no
- Existing shared pattern reused:
- New shared pattern introduced: no
- Design-memory entry reused:
- Design-memory update required: no
- Visual gap audit completed: no
- Background or decorative asset strategy:
- Canonical asset extraction required: no
- Screenshot comparison pass completed: no
- Remaining mismatches:
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Input-mode checks: touch | pointer | keyboard
- Accessibility checks: not applicable in this planning-only task
- Parity evidence: plan explicitly locks backend persistence before UI attribution labels

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: low
- Env or secret changes: none in planning
- Health-check impact: none in planning
- Smoke steps updated: not yet
- Rollback note: planning only; implementation wave will require prod smoke additions for external manual close detection

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
- [ ] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
This planning packet intentionally treats close attribution as a canonical
architecture extension, not a UI-only label task. The write-path order is
frozen so reconcile, exchange events, app-driven close, and runtime history do
not each invent separate semantics.
