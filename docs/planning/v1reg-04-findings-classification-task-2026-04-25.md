# Task

## Header
- ID: V1REG-04
- Title: Classify architecture-V1 verification findings and queue only real follow-up work
- Status: DONE
- Owner: Planning Agent
- Depends on: V1REG-03
- Priority: P1

## Context
`V1REG-02` and `V1REG-03` produced the first reusable architecture-based
verification pass, but the repo still needed one explicit triage slice so the
checklist would not drift into a misleading state where:

- infra-only blockers look like product bugs
- already-closed waves keep being treated as active missing functionality
- future reruns require rediscovering which failures actually need engineering
  work

This slice classifies every remaining `PARTIAL`, `PASS_WITH_DB_INFRA_BLOCKER`,
or `INFRA_BLOCKED` outcome against the current canonical queue and decides
whether any new `V1REG-Fxx` tasks are actually needed.

## Goal
Convert the raw verification findings into one canonical triage outcome:

- reuse existing closed/known wave ownership where appropriate
- declare infra-only blockers as infra-only
- queue new `V1REG-Fxx` work only if a fresh product regression or missing
  function was actually isolated

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- keep architecture docs as the function inventory source of truth
- do not create speculative follow-up bugs when evidence only shows missing
  local infra

## Definition of Done
- [x] Each remaining non-green checklist verdict is classified as either
      existing-wave-owned, infra-blocked, or requiring a new task.
- [x] The checklist includes a reusable triage summary for the next rerun.
- [x] Queue/context docs point to `V1REG-05` as the next slice.
- [x] No duplicate bugfix tasks were added where no new regression was proven.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- queuing product work from infra-only evidence

## Validation Evidence
- Tests:
  - `pnpm run quality:guardrails`
- Manual checks:
  - reviewed `V1REG-02` and `V1REG-03` findings against current queue state
- Screenshots/logs:
  - triage outcome recorded in
    `docs/operations/v1-architecture-functionality-regression-checklist-2026-04-25.md`
- High-risk checks:
  - no new task created without isolated product evidence
  - infra blockers preserved explicitly for Docker/Postgres and local API
    secret-readiness prerequisites

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/08_operator-surfaces-and-routing.md`
  - `docs/architecture/09_integrations-deployment-and-runtime-services.md`
  - `docs/architecture/10_safety-entitlements-and-risk.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
  - n/a
- Follow-up architecture doc updates:
  - none

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference:
  - `docs/ux/ux-ui-mcp-collaboration.md`
  - `docs/ux/dashboard-design-system.md`
- Required states: loading | empty | degraded | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks:
  - n/a; this slice is planning/triage only
- Parity evidence:
  - dashboard/bot/manual-order findings were mapped back to the already-closed
    cohesion and surface-truth waves instead of being re-queued as duplicates

## Review Checklist (mandatory)
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [ ] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
- Triage outcome for 2026-04-25:
  - no new `V1REG-Fxx` product task was justified
  - `F09`, `F10`, and `F12` remain owned by already-closed waves
    (`V1COH-A`, `XADAPT-A`) with no new regression isolated
  - the remaining browser/API gaps are local infra blockers and should be
    revisited in `V1REG-05` after the documented prerequisites are restored
