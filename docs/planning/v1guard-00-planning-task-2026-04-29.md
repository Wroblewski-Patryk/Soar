# Task

## Header
- ID: V1GUARD-00
- Title: Publish final LIVE protection hardening packet for DCA/TTP/TSL parity
- Task Type: fix
- Current Stage: planning
- Status: DONE
- Owner: Backend Builder
- Depends on: `V1SAFE-A`
- Priority: P0

## Context
`V1SAFE-A` removed the operator-truth overstatement around imported and
recovered `LIVE` positions, but a follow-up audit still found runtime and
shared-engine gaps that can materially affect real-money protection.

## Goal
Publish one canonical execution packet for the remaining `LIVE` protection
gaps so implementation can proceed in small, architecture-aligned slices.

## Deliverable For This Stage
A planning packet that freezes the confirmed gaps, implementation order,
acceptance criteria, validation, and non-goals for the final `LIVE`
protection hardening wave.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Scope
- `docs/planning/v1guard-live-protection-final-hardening-plan-2026-04-29.md`
- `docs/planning/mvp-next-commits.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Implementation Plan
1. Capture the remaining confirmed protection drifts after `V1SAFE-A`.
2. Freeze exact follow-up tasks and validation for the remediation wave.
3. Sync canonical queue and project context to the new active wave.

## Acceptance Criteria
- [x] The remaining confirmed `LIVE` protection gaps are documented precisely.
- [x] The execution order for follow-up implementation is frozen.
- [x] Canonical queue/context files point to the new wave.

## Definition of Done
- [x] Planning packet exists under `docs/planning/`.
- [x] Canonical queue/context reflects the new wave.
- [x] Validation evidence for this planning slice is attached.

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
- Manual checks: reviewed architecture and current runtime implementation
- Screenshots/logs: not applicable
- High-risk checks: confirmed money-impacting gaps are captured explicitly

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: yes
- Fits approved architecture: yes
- Mismatch discovered: yes
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not required for planning slice

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
The wave is intentionally narrow: close the last confirmed `LIVE` protection
drifts without inventing a new exchange-native protection system.

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

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: not applicable
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: planning-only slice

## AI Testing Evidence (required for AI features)

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report

- Task summary: Published the final `LIVE` protection hardening packet after
  identifying three concrete remaining drifts: `TTP` bypassing `DCA-first`,
  async `LIVE DCA` fill/state divergence, and direct ticker-price consumption
  inside protection automation.
- Files changed:
  - `docs/planning/v1guard-live-protection-final-hardening-plan-2026-04-29.md`
  - `docs/planning/mvp-next-commits.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
- How tested: `pnpm run quality:guardrails`
- What is incomplete: implementation wave `V1GUARD-01..05`
- Next steps: add red tests and fix the shared-engine/runtime drifts
- Decisions made: keep scope inside the current architecture; no new exchange
  protection subsystem
