# Task

## Header
- ID: V1RESTART-00
- Title: planning(queue): publish canonical LIVE restart continuity and recovery hardening packet
- Task Type: design
- Current Stage: planning
- Status: DONE
- Owner: Planning Agent
- Depends on:
- Priority: P0

## Context
Fresh user-reported production behavior on 2026-04-28 proved that the
repository still lacks one canonical continuity model for `LIVE` positions
across bot or worker restart. A position can exist on the exchange before
shutdown, still exist after restart, and yet fail to reappear or fail to
recover enough lifecycle context for safe continued management. Because this
touches real-money operation, the user explicitly chose the highest-quality
target model rather than a local bugfix. The planning task therefore needs to
package the next wave as a durable, architecture-aligned continuity hardening
packet.

## Goal
Publish one detailed execution packet that:

- freezes the target `LIVE` restart and downtime continuity model,
- identifies the exact current gaps in reconciliation, ownership recovery,
  event priority, and strategy-context restoration,
- sequences safe implementation work for persistence, recovery logic, runtime
  automation continuity, operator surfaces, and verification,
- promotes the resulting implementation wave into canonical queue/context
  truth.

## Deliverable For This Stage
The output of this planning stage is:

- one canonical plan document for `LIVE` position continuity across restart and
  downtime,
- one executor-ready task breakdown for the upcoming wave,
- synchronized queue/context docs so later implementation can proceed in small,
  safe commits without re-deciding the target model.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] The `LIVE` restart-continuity wave is documented as one canonical plan with file-scoped execution tasks.
- [x] The plan explicitly covers restart continuity, event-versus-reconcile authority, ownership/context restoration, and post-restart automation continuity.
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
  - reviewed current reconciliation close behavior after one missing snapshot
  - reviewed restart bootstrap path for the execution worker
  - reviewed runtime visibility ownership path for imported `EXCHANGE_SYNC` positions
  - reviewed runtime automation dependency on `position.strategyId`
- Screenshots/logs:
- High-risk checks:
  - confirmed current reconcile semantics can close or hide positions too aggressively after restart
  - confirmed recovered imported positions do not yet guarantee strategy continuity for DCA/TSL
  - confirmed current docs do not yet freeze one canonical restart/downtime continuity contract

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/reference/wallet-source-of-truth-contract.md`
  - `docs/architecture/reference/execution-lifecycle-parity-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: yes
- Decision required from user: yes
- Approval reference if architecture changed:
  - user approved the highest-quality target direction on 2026-04-28: event-first, restart-safe, continuity-preserving `LIVE` position recovery rather than a narrow bugfix
- Follow-up architecture doc updates:
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/04_runtime-contexts.md`
  - new `docs/architecture/reference/live-position-restart-continuity-contract.md`
  - `docs/architecture/reference/position-lifecycle-parity-matrix.md`

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: planning only; no UI implementation shipped
- Canonical visual target: operator surfaces must eventually show recovery certainty explicitly instead of silently dropping positions
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
- Parity evidence: plan explicitly requires backend recovery truth before UI label or badge work

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: high
- Env or secret changes: none in planning
- Health-check impact: likely medium in implementation because restart recovery status should become observable
- Smoke steps updated: not yet
- Rollback note: planning only; implementation wave will require production-safe restart and downtime smoke evidence

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
This planning packet intentionally treats restart continuity as a lifecycle
truth problem, not as an isolated UI or reconciliation bug. The implementation
wave must preserve fail-closed ownership safety while eliminating destructive
single-pass restart behavior.
