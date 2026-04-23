# Task

## Header
- ID: V1CONF-A
- Title: V1 confidence hardening after formal production approval
- Status: IN_PROGRESS
- Owner: Planning Agent
- Depends on: `docs/operations/v1-production-activation-pack-2026-04-22.md`
- Priority: P0

## Context
Soar already has a formally approved V1 activation packet, fresh prod proof
artifacts, and closed RC gates. The remaining engineering value is no longer
feature delivery, but confidence hardening: keeping repository truth aligned
with the approved state, reducing false-negative test noise, and locking the
highest-risk production paths so future changes cannot silently reopen them.

## Goal
Create one explicit post-approval execution wave that turns "V1 approved" into
"V1 trusted" through tiny, regression-safe hardening slices.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- treat prod auth, runtime, and release evidence as fail-closed paths

## Definition of Done
- [ ] Canonical queue and project state explicitly reflect that V1 is approved
      and the active work is confidence hardening rather than activation
      planning.
- [ ] The new confidence wave is decomposed into tiny executable tasks with one
      active `NOW` item and clear follow-ups.
- [ ] At least the first confidence task is implemented and validated.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests: task-specific focused packs plus relevant web/app confidence checks
- Manual checks: queue/context/planning parity review
- Screenshots/logs: not required
- High-risk checks: preserve fail-closed auth/release confidence contracts

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  `docs/architecture/reference/v1-production-activation-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: n/a
- Follow-up architecture doc updates: none expected for this planning slice

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: current production web behavior + existing tests
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks: preserve existing behavior only
- Parity evidence: focus on route/auth/runtime confidence paths

## Review Checklist (mandatory)
- [ ] Architecture alignment confirmed.
- [ ] Existing systems were reused where applicable.
- [ ] No workaround paths were introduced.
- [ ] No logic duplication was introduced.
- [ ] Definition of Done evidence is attached.
- [ ] Relevant validations were run.
- [ ] Docs or context were updated if repository truth changed.
- [ ] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
- Planned execution slices:
  1. `V1CONF-01 docs(sync): align canonical phase + queue with approved V1 and confidence-hardening mode`
  2. `V1CONF-02 test(web-route-context): continue removing false i18n/noise drift from high-signal dashboard table tests`
  3. `V1CONF-03 investigate(web-test-noise): isolate remaining AggregateError source after route-context cleanup`
  4. `V1CONF-04 qa(confidence): rerun focused web confidence pack, guardrails, and selected go-live evidence where applicable`
