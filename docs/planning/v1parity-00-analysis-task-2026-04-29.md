# Task

## Header
- ID: V1PARITY-00
- Title: Publish LIVE runtime lifecycle parity analysis and implementation packet
- Task Type: research
- Current Stage: planning
- Status: DONE
- Owner: Planning Agent
- Depends on: V1RESTART-A, V1CLOSE-A, V1LIVE-A
- Priority: P0

## Context
Post-V1 hardening substantially improved restart continuity, live ownership,
and close attribution, but a fresh project review was requested to identify the
remaining architecture drifts before more fixes land. The highest-value symptom
reported by the user is that `DCA` executes for `PAPER` bots but not
equivalently for `LIVE` bots, which makes this a real-money parity problem.

## Goal
Produce one canonical analysis and planning packet that identifies the concrete
architecture drifts behind current LIVE lifecycle gaps and turns them into
small, safe execution slices.

## Deliverable For This Stage
A planning packet in `docs/planning/` plus synchronized queue/context updates
that:

- records confirmed implementation drifts
- ties them back to the approved architecture
- proposes the next execution slices in order
- defines acceptance criteria and scope for the implementation wave

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- `apps/api/src/modules/orders/orders.lifecycle.service.ts`
- `apps/api/src/modules/orders/orders.service.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/engine/runtimeCapitalContext.service.ts`
- `docs/architecture/06_execution-lifecycle.md`
- `docs/architecture/04_runtime-contexts.md`
- `docs/architecture/reference/execution-lifecycle-parity-contract.md`
- planning/context source-of-truth files

## Implementation Plan
1. Re-read the canonical execution and runtime-context architecture for the
   approved lifecycle contract.
2. Inspect runtime automation, exchange-event lifecycle application, runtime
   capital gating, and read-model strategy fallback behavior.
3. Classify only confirmed drifts, especially those that can explain `LIVE`
   DCA parity failure.
4. Convert the findings into a staged execution packet with acceptance
   criteria, file scope, and validation expectations.
5. Sync the canonical queue and project context to point future execution at
   the new packet.

## Acceptance Criteria
- [x] The packet identifies the confirmed root-cause candidates for the `LIVE`
      DCA parity gap.
- [x] The packet distinguishes architecture drift from mere missing coverage.
- [x] The packet defines a safe execution order from docs/tests to fixes to QA.
- [x] Canonical queue/context files reference the new wave.

## Definition of Done
- [x] One canonical planning packet exists in `docs/planning/`.
- [x] Queue/context truth points to the new wave and next smallest task.
- [x] The task remains analysis/planning only and does not mix in
      implementation.

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
- Tests: not applicable for planning-only stage
- Manual checks: repository architecture and implementation review
- Screenshots/logs: not applicable
- High-risk checks: money-impacting LIVE lifecycle path reviewed explicitly

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: yes
- Fits approved architecture: yes
- Mismatch discovered: yes
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: `V1PARITY-01`

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: not applicable

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
The strongest confirmed technical finding is that confirmed LIVE fills on
existing positions are not fully reusing the canonical add-update lifecycle,
which is consistent with the user-visible `PAPER DCA works / LIVE DCA does not`
symptom.

## Production-Grade Required Contract

Every task must include these mandatory sections before it can move to `READY`
or `IN_PROGRESS`:

- `Goal`
- `Scope` with exact files, modules, routes, APIs, schemas, docs, or runtime
  surfaces
- `Implementation Plan` with step-by-step execution and validation
- `Acceptance Criteria` with testable conditions
- `Definition of Done` using `DEFINITION_OF_DONE.md`
- `Result Report`

Runtime tasks must be delivered as a vertical slice: UI -> logic -> API -> DB
-> validation -> error handling -> test. Partial implementations, mock-only
paths, placeholders, fake data, and temporary fixes are forbidden.

## Integration Evidence

- `INTEGRATION_CHECKLIST.md` reviewed: not applicable
- Real API/service path used: yes
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: yes
- Regression check performed: implementation/test inventory audit only

## AI Testing Evidence (required for AI features)

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report

- Task summary: Published the `V1PARITY-A` planning packet for LIVE runtime
  lifecycle parity hardening after a focused repository review centered on the
  reported LIVE DCA mismatch.
- Files changed:
  - `docs/planning/v1parity-live-runtime-lifecycle-parity-hardening-plan-2026-04-29.md`
  - `docs/planning/v1parity-00-analysis-task-2026-04-29.md`
  - queue/context source-of-truth files
- How tested: architecture/code review and source-of-truth sync review
- What is incomplete: no runtime fixes implemented yet
- Next steps: start with `V1PARITY-01`
- Decisions made: treat this as a lifecycle parity wave, not a narrow DCA-only
  patch
