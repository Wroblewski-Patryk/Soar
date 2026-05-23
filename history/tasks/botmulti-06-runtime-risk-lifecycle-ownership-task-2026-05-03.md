# Task

## Header
- ID: BOTMULTI-06
- Title: runtime(risk+lifecycle): align DCA/TTP/SL/TSL and ownership across multiple strategies
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: BOTMULTI-05
- Priority: P1
- Iteration: 2026-05-03 post-V1 BOTMULTI activation, iteration 6
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`BOTMULTI-05` made runtime signal evaluation consume canonical enabled
strategy links. Runtime position automation must now avoid applying DCA,
TTP, SL, or TSL from ambiguous bot-level context when a bot has multiple
enabled strategy links but an open managed position has no canonical
`position.strategyId`.

## Goal
Fail closed for multi-strategy bot-managed positions that lack canonical
position strategy provenance, preserving the approved position-scoped lifecycle
ownership model.

## Scope
- `apps/api/src/modules/engine/runtimePositionAutomation.types.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.test.ts`
- `docs/architecture/06_execution-lifecycle.md`
- BOTMULTI planning/context docs

## Implementation Plan
1. Extend runtime position selection to expose active enabled canonical
   strategy-link ids for the owning bot.
2. Add a fail-closed automation guard when a bot-managed position has no
   `strategyId` and the owning bot has more than one enabled canonical
   strategy link.
3. Emit existing skip telemetry rather than executing fallback DCA/protection
   config.
4. Add focused regression coverage for the ambiguous multi-strategy lifecycle
   case.
5. Run focused runtime tests, typecheck, docs parity, and guardrails.

## Acceptance Criteria
- Multi-strategy bot-managed positions without `position.strategyId` do not
  execute DCA or protection closes.
- The skip is observable through existing runtime automation telemetry.
- Single-strategy or legacy rows are not broadened by this task.
- No new lifecycle system or workaround path is introduced.

## Success Signal
- User or operator problem: a multi-strategy bot could apply fallback or wrong
  lifecycle protection to a position without canonical strategy ownership.
- Expected product or reliability outcome: money-impacting protection logic
  remains position-scoped and fail-closed under multi-strategy ambiguity.
- How success will be observed: focused regression proves ambiguous rows skip
  automation and emit telemetry.
- Post-launch learning needed: no.

## Deliverable For This Stage
Runtime lifecycle ownership guard and focused test coverage for ambiguous
multi-strategy managed positions.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Ambiguous multi-strategy lifecycle ownership fails closed.
- [x] Existing telemetry path records the skip reason.
- [x] Focused runtime tests pass.
- [x] API typecheck, docs parity, and guardrails pass.
- [x] Docs/context are synchronized.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- choosing the first enabled strategy link for a position
- applying bot-wide fallback DCA/TTP/SL/TSL to ambiguous multi-strategy rows
- new lifecycle ownership system
- UI/API scope creep

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- --run src/modules/engine/runtimePositionAutomation.service.test.ts -t "multi-strategy bot-managed position"`
    PASS (`1` focused test).
  - `pnpm --filter api run test -- --run src/modules/engine/runtimePositionAutomation.service.test.ts`
    PASS (`31` tests).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm run docs:parity:check` PASS.
  - `pnpm run quality:guardrails` PASS.
- Manual checks: the default runtime position query now exposes enabled
  canonical strategy-link ids for the owning bot; the service skips
  bot-managed positions that have no `position.strategyId` when more than one
  enabled canonical link exists; the skip reuses existing runtime automation
  telemetry.
- Screenshots/logs: not applicable
- High-risk checks: money-impacting protection must fail closed on ambiguous
  strategy provenance.

## Architecture Evidence
- Architecture source reviewed: runtime contexts, execution lifecycle, signal
  merge contract.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: user approved safe
  architecture-first continuation on 2026-05-03.
- Follow-up architecture doc updates: clarify fail-closed lifecycle behavior
  for missing position strategy provenance under multiple links.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert the guard and focused regression.
- Observability or alerting impact: existing runtime skip telemetry is reused.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: position automation loads strategy config by `position.strategyId`
  but can still use position/env fallback config when that id is missing.
- Gaps: after BOTMULTI-05, a bot may have multiple canonical strategy links,
  making missing position strategy provenance ambiguous for protection logic.
- Inconsistencies: signal merge has winner provenance, but lifecycle automation
  still needs explicit fail-closed handling for legacy ambiguous open rows.
- Architecture constraints: DCA/TTP/SL/TSL ownership is position-scoped.

### 2. Select One Priority Task
- Selected task: `BOTMULTI-06`.
- Priority rationale: lifecycle ownership is money-impacting and must be safe
  before UI/operator exposure.
- Why other candidates were deferred: web surfaces and closure pack depend on
  runtime lifecycle safety.

### 3. Plan Implementation
- Files or surfaces to modify: runtime position automation types/service/tests,
  execution lifecycle docs, planning/context docs.
- Logic: detect multiple enabled canonical strategy links for the owning bot;
  if `position.strategyId` is missing, skip automation with telemetry.
- Edge cases: legacy bots with zero/one link, imported positions, disabled
  strategy after opening, and existing position-level TP/SL fields.

### 4. Execute Implementation
- Implementation notes: added canonical link visibility to runtime position
  automation, added a fail-closed multi-strategy provenance guard, extended
  skip telemetry reason, and covered the ambiguous lifecycle case with a
  focused regression.

### 5. Verify and Test
- Validation performed: focused runtime automation regression, full runtime
  position automation test file, API typecheck, docs parity, repository
  guardrails.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: keep using fallback config when `strategyId` is
  missing. Rejected because it is ambiguous under multiple strategy links.
- Technical debt introduced: no
- Scalability assessment: guard is scoped to the existing bot topology loaded
  with the position.
- Refinements made: kept the implementation within the existing production
  monolith line budget without adding allowlist exceptions.

### 7. Update Documentation and Knowledge
- Docs updated: execution lifecycle architecture note, BOTMULTI plan, MVP
  queue, MVP execution plan.
- Context updated: task board and project state synchronized.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected in this iteration.
- [x] Operation mode was selected according to iteration rotation.
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
This task intentionally does not implement ownership transfer or UI strategy
selection. It only prevents unsafe automation for ambiguous legacy rows.

## Production-Grade Required Contract

- Goal: fail closed for ambiguous multi-strategy lifecycle ownership.
- Scope: runtime position automation guard and focused docs/tests.
- Implementation Plan: see above.
- Acceptance Criteria: see above.
- Definition of Done: follows `DEFINITION_OF_DONE.md` through focused
  validation evidence.
- Result Report: pending.

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: bot operator with multi-strategy runtime positions
- Existing workaround or pain: none safe; ambiguity must fail closed
- Smallest useful slice: skip ambiguous lifecycle automation
- Success metric or signal: focused regression pass
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: no
- Critical user journey: runtime protection automation
- SLI: not applicable for this narrow guard
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: unchanged
- Logs, dashboard, or alert route: existing runtime skip telemetry
- Smoke command or manual smoke: focused runtime test
- Rollback or disable path: revert code/test patch

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: focused runtime automation path
- Regression check performed: pending

## AI Testing Evidence

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: no
- Data classification: trading/runtime position metadata
- Trust boundaries: internal runtime only
- Permission or ownership checks: bot/position ownership reused
- Abuse cases: ambiguous strategy ownership must not execute money-impacting
  lifecycle commands
- Secret handling: no secrets touched
- Security tests or scans: pending guardrails
- Fail-closed behavior: pending implementation
- Residual risk: legacy single-strategy fallback remains compatibility scope

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report

- Task summary: multi-strategy bot-managed positions without
  `position.strategyId` now fail closed before DCA/TTP/SL/TSL automation can
  use fallback protection settings.
- Files changed: runtime position automation types/service/skip telemetry/test,
  execution lifecycle docs, and planning/context docs.
- How tested: focused regression, full runtime position automation test file,
  API typecheck, docs parity, repository guardrails.
- What is incomplete: UI/operator exposure and architecture-to-runtime closure
  evidence remain in `BOTMULTI-07..08`.
- Next steps: execute `BOTMULTI-07` web/operator multi-strategy truth slice.
- Decisions made: do not infer lifecycle owner from the first enabled strategy
  link; ambiguous multi-strategy position protection must fail closed.
