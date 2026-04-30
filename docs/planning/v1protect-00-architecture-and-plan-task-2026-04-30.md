# Task

## Header
- ID: V1PROTECT-00
- Title: Freeze LIVE protection-order and gap-breach architecture plus execution plan
- Task Type: design
- Current Stage: planning
- Status: DONE
- Owner: Planning Agent
- Depends on: V1SAFE-19, V1SAFE-20
- Priority: P0

## Context
Recent production observations exposed a narrower remaining `LIVE`
money-protection gap: once `TTP/TSL/SL` is armed, fast market moves can cross
the protected floor before app-side close handling finalizes, and current
architecture did not yet explicitly define how that relates to venue-side stop
orders or lifecycle history.

## Goal
Freeze canonical architecture and an execution plan for monotonic armed-stop
behavior plus exchange-backed protection-order parity in `LIVE`.

## Success Signal
- User or operator problem:
  - armed `TTP`/`TSL` can appear to disappear or fail to materialize cleanly
    under fast market moves
- Expected product or reliability outcome:
  - architecture clearly defines monotonic protection, gap-through-stop
    handling, and venue-side stop-order ownership
- How success will be observed:
  - canonical architecture docs and an implementation plan exist and align
- Post-launch learning needed: yes

## Deliverable For This Stage
Architecture doc updates and one execution-plan packet only. No feature code
beyond already existing validated hotfix slices.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Scope
- `docs/architecture/reference/live-protection-state-parity-contract.md`
- `docs/architecture/reference/live-exchange-protection-order-contract.md`
- `docs/architecture/06_execution-lifecycle.md`
- `docs/planning/v1protect-live-protection-order-and-gap-breach-plan-2026-04-30.md`
- `docs/planning/v1protect-00-architecture-and-plan-task-2026-04-30.md`

## Implementation Plan
1. Audit current canonical architecture for `LIVE` protection, close
   attribution, and runtime parity.
2. Add missing architecture rules for:
   - monotonic armed-stop behavior
   - breach-pending semantics
   - one effective protection floor per lifecycle
   - exchange-backed protection-order target
3. Publish one implementation plan packet with small slices from architecture
   freeze through production verification.

## Acceptance Criteria
- `LIVE` protection architecture explicitly covers gap-through-stop and
  exchange-side protection-order parity.
- The target contract clarifies how `SL`, `TTP`, and `TSL` converge to one
  effective floor/order in `LIVE`.
- A concrete slice-by-slice implementation plan exists.

## Definition of Done
- [x] Architecture gap analyzed against current canonical docs.
- [x] Missing rules added to architecture docs.
- [x] Execution plan published for follow-up implementation.

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
- Tests: `pnpm run quality:guardrails`
- Manual checks: architecture audit against existing `LIVE` protection and close docs
- Screenshots/logs: not applicable
- High-risk checks: verified that docs do not move ownership away from existing runtime/exchange boundaries

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: yes
- Fits approved architecture: yes
- Mismatch discovered: yes
- Decision required from user: no
- Approval reference if architecture changed: user requested architecture clarification and planning for this exact protection behavior on 2026-04-30
- Follow-up architecture doc updates:
  - `live-protection-state-parity-contract`
  - `live-exchange-protection-order-contract`
  - `06_execution-lifecycle`

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: docs only
- Observability or alerting impact: none
- Staged rollout or feature flag: none

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
This packet intentionally stops before implementation because the next step is
a multi-slice runtime/exchange/history wave with money-impacting behavior.

## Production-Grade Required Contract

Every task must include these mandatory sections before it can move to `READY`
or `IN_PROGRESS`:

- `Goal`
- `Scope` with exact files, modules, routes, APIs, schemas, docs, or runtime surfaces
- `Implementation Plan` with step-by-step execution and validation
- `Acceptance Criteria` with testable conditions
- `Definition of Done` using `DEFINITION_OF_DONE.md`
- `Result Report`

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: live-bot operator using exchange-connected positions
- Existing workaround or pain: runtime-only monitoring, manual observation, and ambiguous stop behavior
- Smallest useful slice: architecture freeze plus execution plan
- Success metric or signal: canonical docs make stop behavior and future implementation path explicit
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: yes

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: `LIVE` protected position under fast move
- SLI: not applicable in planning stage
- SLO: not applicable in planning stage
- Error budget posture: not applicable
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: not applicable
- Smoke command or manual smoke: not applicable
- Rollback or disable path: docs only

- `INTEGRATION_CHECKLIST.md` reviewed: not applicable
- Real API/service path used: no
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: architecture audit only

## AI Testing Evidence (required for AI features)

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: money-impacting trading lifecycle logic
- Trust boundaries: runtime engine, exchange adapter boundary, operator UI, persistence/history
- Permission or ownership checks: preserved existing bot/runtime/exchange ownership model
- Abuse cases: overstated protection, missing close history, weaker venue-side stop than runtime floor
- Secret handling: none
- Security tests or scans: none in planning stage
- Fail-closed behavior: architecture now explicitly requires breach-pending instead of silent reset
- Residual risk: exchange-specific stop-order semantics still need implementation proof

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report

- Task summary:
  - added missing architecture rules for monotonic armed protection and
    exchange-backed `LIVE` protection-order target
  - published a slice-by-slice implementation plan
- Files changed:
  - `docs/architecture/reference/live-protection-state-parity-contract.md`
  - `docs/architecture/reference/live-exchange-protection-order-contract.md`
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/planning/v1protect-live-protection-order-and-gap-breach-plan-2026-04-30.md`
  - `docs/planning/v1protect-00-architecture-and-plan-task-2026-04-30.md`
- How tested:
  - repository guardrails
  - manual architecture audit
- What is incomplete:
  - runtime/exchange/history implementation slices are not yet started
- Next steps:
  - `V1PROTECT-01..07`
- Decisions made:
  - armed protection must remain monotonic
  - `LIVE` should converge to one exchange-backed effective stop order per
    lifecycle when the venue supports it
